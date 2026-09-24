// Turns the evidence files under docs/evidence/quality/ into report.json, the only
// source for the numbers in docs/quality.md. `--site` also writes src/quality.json.
//   node eval/summarize.mjs [--site]
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { Validator } from '@cfworker/json-schema';
import { getDomain } from 'tldts';

// OUT_DIR selects a rerun's own evidence directory, matching run-searches.mjs.
const DIR = process.env.OUT_DIR || 'docs/evidence/quality';
const SECTIONS = ['online', 'local'];
const ACCESS = ['ok', 'challenge', 'blocked', 'robots_disallow', 'error'];
const BOT_BLOCKED = new Set(['challenge', 'blocked', 'robots_disallow']);
const PERSON_BLOCKED = new Set(['challenge', 'blocked']);

const ratio = (n, d) => (d > 0 ? Math.round((n / d) * 1000) / 1000 : null);
const normName = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
const normUrl = (u) => {
  try {
    return new URL(u).href;
  } catch {
    return u;
  }
};

export function usageRow(saved) {
  const usage = saved.status === 200 ? saved.body?.usage : undefined;
  return {
    id: saved.id,
    status: saved.status,
    brave_calls: usage?.brave_calls ?? 0,
    llm_tokens: usage?.llm_tokens ?? 0,
    estimated_cost_usd: usage?.estimated_cost_usd ?? 0,
  };
}

export function totals(rows) {
  const sum = (key) => rows.reduce((n, r) => n + r[key], 0);
  return {
    searches: rows.length,
    ok: rows.filter((r) => r.status === 200).length,
    brave_calls: sum('brave_calls'),
    llm_tokens: sum('llm_tokens'),
    estimated_cost_usd: Math.round(sum('estimated_cost_usd') * 1e6) / 1e6,
  };
}

export function validateGrades(grades, schema) {
  const result = new Validator(schema, '2020-12', false).validate(grades);
  if (!result.valid) {
    const first = result.errors.slice(0, 5).map((e) => `${e.instanceLocation}: ${e.error}`);
    throw new Error(`grades.json does not match eval/grade-schema.json\n${first.join('\n')}`);
  }
}

/** Relevant: sells the product or an equivalent, and for local results the shop exists. Unknowns on either question are excluded. */
export function precision(grades) {
  const graded = grades.filter((g) => g.sells_product !== 'unknown' && g.local_exists !== 'unknown');
  const relevant = graded.filter((g) => g.sells_product !== 'no' && (g.kind === 'online' || g.local_exists === 'yes'));
  return { graded: graded.length, relevant: relevant.length, unknown: grades.length - graded.length, precision: ratio(relevant.length, graded.length) };
}

/** How often each answer was given for a yes/no/n/a check, e.g. badges_sourced. */
export function tally(grades, field) {
  const counts = { yes: 0, no: 0, 'n/a': 0 };
  for (const g of grades) counts[g[field]] += 1;
  return counts;
}

function returned(item, results) {
  const domain = item.url ? getDomain(item.url) : null;
  return results.some((r) => (domain ? r.retailer.domain === domain : normName(r.retailer.name) === normName(item.name)));
}

/** Recall against confirmed baseline retailers; `resultsFor(search_id, section)` gives the site's results. */
export function recall(baseline, resultsFor) {
  const confirmed = baseline.filter((b) => b.confirmed);
  const misses = confirmed.filter((b) => !returned(b, resultsFor(b.search_id, b.section)));
  const reasons = {};
  for (const m of misses) {
    const key = m.miss_reason ?? 'unclassified';
    reasons[key] = (reasons[key] ?? 0) + 1;
  }
  const found = confirmed.length - misses.length;
  return { confirmed: confirmed.length, found, recall: ratio(found, confirmed.length), miss_reasons: reasons };
}

export function probeRates(results) {
  const counts = { probed: results.length, ...Object.fromEntries(ACCESS.map((a) => [a, 0])) };
  for (const r of results) {
    if (!ACCESS.includes(r.access)) throw new Error(`probe.json: unknown access ${JSON.stringify(r.access)} for ${r.url}`);
    counts[r.access] += 1;
  }
  const answered = counts.probed - counts.error;
  return { ...counts, bot_blocked_rate: ratio(answered - counts.ok, answered) };
}

/** Probe verdict vs what a person saw in a real browser, for URLs graded both ways. */
export function agreement(probeResults, grades) {
  // Graders copy retailer.url verbatim; compare parsed forms so 'https://a.com' matches 'https://a.com/'.
  const byUrl = new Map(grades.map((g) => [normUrl(g.url), g]));
  const t = { both_blocked: 0, bot_only: 0, person_only: 0, neither: 0 };
  for (const p of probeResults) {
    const g = byUrl.get(normUrl(p.url));
    if (!g || p.access === 'error' || g.page_access === 'error') continue;
    const bot = BOT_BLOCKED.has(p.access);
    const person = PERSON_BLOCKED.has(g.page_access);
    t[bot && person ? 'both_blocked' : bot ? 'bot_only' : person ? 'person_only' : 'neither'] += 1;
  }
  return {
    ...t,
    // Scores the probe as a predictor of what a person sees; bot_only cases lower
    // precision and are exactly the bot-specific blocking this eval looks for.
    precision: ratio(t.both_blocked, t.both_blocked + t.bot_only),
    recall: ratio(t.both_blocked, t.both_blocked + t.person_only),
  };
}

/** The About page's headline, or null unless every figure was actually measured. */
export function siteMeasure(report) {
  const precision = { online: report.precision.online.precision, local: report.precision.local.precision };
  const recall = { online: report.recall.online.recall, local: report.recall.local.recall };
  const figures = [...Object.values(precision), ...Object.values(recall)];
  if (!report.graded_through || !figures.every(Number.isFinite)) return null;
  return { date: report.graded_through, searches: report.searches.ok, precision, recall };
}

async function readJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (err) {
    if (fallback !== undefined && err.code === 'ENOENT') return fallback;
    throw err;
  }
}

async function main() {
  const { queries } = await readJson('eval/queries.json');
  const saved = await Promise.all(queries.map((q) => readJson(`${DIR}/responses/${q.id}.json`, null)));
  const responses = new Map(saved.filter(Boolean).map((s) => [s.id, s]));
  const grades = await readJson(`${DIR}/grades.json`, { grades: [], baseline: [] });
  validateGrades(grades, await readJson('eval/grade-schema.json'));
  const probe = await readJson(`${DIR}/probe.json`, { results: [] });

  const zipKind = new Map(queries.map((q) => [q.id, q.zip_kind]));
  const resultsFor = (id, section) => {
    const s = responses.get(id);
    return s?.status === 200 ? s.body[section] : [];
  };
  const gradesIn = (sec) => grades.grades.filter((g) => g.kind === sec);
  const run = totals([...responses.values()].map(usageRow));
  const report = {
    generated: new Date().toISOString(),
    graded_through: grades.grades.map((g) => g.checked).sort().at(-1) ?? null,
    searches: { planned: queries.length, saved: run.searches, ok: run.ok },
    cost: { brave_calls: run.brave_calls, llm_tokens: run.llm_tokens, estimated_cost_usd: run.estimated_cost_usd },
    precision: Object.fromEntries(SECTIONS.map((sec) => [sec, precision(gradesIn(sec))])),
    precision_local_by_zip_kind: Object.fromEntries(
      ['urban', 'suburban', 'rural'].map((k) => [k, precision(gradesIn('local').filter((g) => zipKind.get(g.search_id) === k))]),
    ),
    badges_sourced: Object.fromEntries(SECTIONS.map((sec) => [sec, tally(gradesIn(sec), 'badges_sourced')])),
    distance_plausible: tally(gradesIn('local'), 'distance_plausible'),
    recall: Object.fromEntries(SECTIONS.map((sec) => [sec, recall(grades.baseline.filter((b) => b.section === sec), resultsFor)])),
    probe: Object.fromEntries(SECTIONS.map((sec) => [sec, probeRates(probe.results.filter((r) => r.kind === sec))])),
    probe_vs_person: agreement(probe.results, grades.grades),
  };
  await mkdir(DIR, { recursive: true });
  await writeFile(`${DIR}/report.json`, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));

  if (process.argv.includes('--site')) {
    await writeFile('src/quality.json', JSON.stringify({ measured: siteMeasure(report) }, null, 2) + '\n');
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main();
