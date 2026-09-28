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

/**
 * Relevant: sells the product or an equivalent, and for local results the shop exists. Unknowns on
 * either question are excluded, except a local shop confirmed not to exist counts as bad even when
 * whether it sells the product is unknown (operator ruling, 2026-09-26).
 */
export function precision(grades) {
  const known = (g) => g.local_exists === 'no' || (g.sells_product !== 'unknown' && g.local_exists !== 'unknown');
  const graded = grades.filter(known);
  const relevant = graded.filter((g) => g.sells_product !== 'no' && (g.kind === 'online' || g.local_exists === 'yes'));
  return { graded: graded.length, relevant: relevant.length, unknown: grades.length - graded.length, precision: ratio(relevant.length, graded.length) };
}

/** How often each answer was given for a yes/no/n/a check, e.g. badges_sourced. */
export function tally(grades, field) {
  const counts = { yes: 0, no: 0, 'n/a': 0 };
  for (const g of grades) counts[g[field]] += 1;
  return counts;
}

function matchResults(item, results) {
  // A shop can own several domains (one redirecting to another); any of them counts.
  const urls = item.url ? [item.url, ...(item.also_urls ?? [])] : [];
  const domains = new Set(urls.map((u) => getDomain(u)).filter(Boolean));
  if (domains.size === 0) return results.filter((r) => normName(r.retailer.name) === normName(item.name));
  return results.filter((r) => domains.has(r.retailer.domain));
}

function returned(item, results) {
  return matchResults(item, results).length > 0;
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

const kindOf = (b) => (b.chain === true ? 'chain' : b.chain === false ? 'not_chain' : 'unlabelled');

/** How many baseline rows carry each chain label, regardless of `confirmed`, so an unlabelled row is visible even when it's a miss the recall figures below never count. @param {object[]} baseline */
export function labelCounts(baseline) {
  const counts = { chain: 0, not_chain: 0, unlabelled: 0 };
  for (const b of baseline) counts[kindOf(b)] += 1;
  return counts;
}

/**
 * Recall split by the chain label: a row the label hasn't reached yet must not be silently folded
 * into either the chain or the non-chain figure, so it gets its own bucket and its own (small,
 * expected) recall number rather than vanishing.
 * @param {object[]} baseline @param {(id: string, section: string) => object[]} resultsFor
 */
export function recallByKind(baseline, resultsFor) {
  const groups = { chain: [], not_chain: [], unlabelled: [] };
  for (const b of baseline) groups[kindOf(b)].push(b);
  return Object.fromEntries(Object.entries(groups).map(([kind, rows]) => [kind, recall(rows, resultsFor)]));
}

/**
 * A badge on a labelled `chain: false` shop (must be 0), and coverage of labelled `chain: true` shops,
 * over baseline rows the site returned. The badge field does not exist on any result yet; while none
 * carries it, 0 false badges and 0% coverage would read as a pass for the wrong reason, so this
 * reports "not measured" until some returned result actually has a `chain` field.
 * @param {object[]} baseline @param {(id: string, section: string) => object[]} resultsFor
 */
export function badgeCheck(baseline, resultsFor) {
  const cache = new Map();
  const resultsCached = (id, sec) => {
    const key = `${id}\u0000${sec}`;
    if (!cache.has(key)) cache.set(key, resultsFor(id, sec));
    return cache.get(key);
  };
  const anyChainField = baseline.some((b) => resultsCached(b.search_id, b.section).some((r) => 'chain' in r));
  if (!anyChainField) return { measured: false };

  let falseBadges = 0, chainFalseReturned = 0, chainTrueReturned = 0, chainTrueBadged = 0;
  for (const b of baseline) {
    if (b.chain === undefined) continue;
    const matched = matchResults(b, resultsCached(b.search_id, b.section));
    if (matched.length === 0) continue;
    const badged = matched.some((r) => r.chain);
    if (b.chain === false) { chainFalseReturned += 1; if (badged) falseBadges += 1; }
    else { chainTrueReturned += 1; if (badged) chainTrueBadged += 1; }
  }
  return {
    measured: true,
    false_badges: falseBadges,
    chain_false_returned: chainFalseReturned,
    chain_true_returned: chainTrueReturned,
    chain_true_badged: chainTrueBadged,
    coverage: ratio(chainTrueBadged, chainTrueReturned),
  };
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

/**
 * The About page's headline, or null unless every figure was actually measured.
 * @param {object[]} reports One or two graded runs of the same eval (every graded eval now runs twice,
 *   operator ruling 2026-09-26); a figure that rounds to a different percentage between runs is given
 *   as a [low, high] range rather than picking one. More than one run means its new rows were graded by
 *   a second agent that did not see the first run's grades, so the local precision figure gets a note.
 * @param {string} evidence The (first) run's evidence folder (OUT_DIR).
 * @returns {object|null}
 */
export function siteMeasure(reports, evidence) {
  const [first] = reports;
  const values = (kind, sec) => reports.map((r) => r[kind][sec][kind]);
  const all = ['precision', 'recall'].flatMap((kind) => SECTIONS.flatMap((sec) => values(kind, sec)));
  if (!first.graded_through || !all.every(Number.isFinite)) return null;
  const figure = (kind, sec) => {
    const vs = values(kind, sec);
    return new Set(vs.map((v) => Math.round(v * 100))).size === 1 ? vs[0] : [Math.min(...vs), Math.max(...vs)];
  };
  const both = (kind) => ({ online: figure(kind, 'online'), local: figure(kind, 'local') });
  // A sampled run grades only some searches; the headline names how many it rests on. `runs` lets the
  // About page's wording depend on whether this ran once or twice, rather than assuming twice.
  const note = reports.length > 1 ? "a figure that mixes two graders' answers" : undefined;
  return { date: first.graded_through, searches: first.searches.graded, runs: reports.length, precision: both('precision'), recall: both('recall'), evidence, note };
}

async function readJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (err) {
    if (fallback !== undefined && err.code === 'ENOENT') return fallback;
    throw err;
  }
}

/** What the page shows in a section: local includes the "Farther away" group listed under it. */
export function sectionResults(body, section) {
  return section === 'local' ? [...body.local, ...(body.local_farther ?? [])] : body[section];
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
    return s?.status === 200 ? sectionResults(s.body, section) : [];
  };
  const gradesIn = (sec) => grades.grades.filter((g) => g.kind === sec);
  const run = totals([...responses.values()].map(usageRow));
  const report = {
    generated: new Date().toISOString(),
    graded_through: grades.grades.map((g) => g.checked).sort().at(-1) ?? null,
    searches: { planned: queries.length, saved: run.searches, ok: run.ok, graded: new Set(grades.grades.map((g) => g.search_id)).size },
    cost: { brave_calls: run.brave_calls, llm_tokens: run.llm_tokens, estimated_cost_usd: run.estimated_cost_usd },
    precision: Object.fromEntries(SECTIONS.map((sec) => [sec, precision(gradesIn(sec))])),
    precision_local_by_zip_kind: Object.fromEntries(
      ['urban', 'suburban', 'rural'].map((k) => [k, precision(gradesIn('local').filter((g) => zipKind.get(g.search_id) === k))]),
    ),
    badges_sourced: Object.fromEntries(SECTIONS.map((sec) => [sec, tally(gradesIn(sec), 'badges_sourced')])),
    distance_plausible: tally(gradesIn('local'), 'distance_plausible'),
    recall: Object.fromEntries(SECTIONS.map((sec) => [sec, recall(grades.baseline.filter((b) => b.section === sec), resultsFor)])),
    // How many baseline rows (any confirmed status) carry each chain label, and confirmed-only recall
    // split the same way; see docs/quality.md:17 for the chain rule these labels follow.
    labels: Object.fromEntries(SECTIONS.map((sec) => [sec, labelCounts(grades.baseline.filter((b) => b.section === sec))])),
    recall_by_kind: Object.fromEntries(SECTIONS.map((sec) => [sec, recallByKind(grades.baseline.filter((b) => b.section === sec), resultsFor)])),
    chain_badges: badgeCheck(grades.baseline, resultsFor),
    probe: Object.fromEntries(SECTIONS.map((sec) => [sec, probeRates(probe.results.filter((r) => r.kind === sec))])),
    probe_vs_person: agreement(probe.results, grades.grades),
  };
  await mkdir(DIR, { recursive: true });
  await writeFile(`${DIR}/report.json`, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));

  if (process.argv.includes('--site')) {
    // A second run of the same eval, when one has been saved alongside this one (Q2 ruling above).
    const run2 = await readJson(`${DIR}/run2/report.json`, null);
    const measured = siteMeasure(run2 ? [report, run2] : [report], DIR);
    await writeFile('src/quality.json', JSON.stringify({ measured }, null, 2) + '\n');
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main();
