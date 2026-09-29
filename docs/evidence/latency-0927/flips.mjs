// Builds the blind grading input for the local shops that flip between two arms of a stage-timing.ts
// EVAL=1 run, and joins the grades back to each flip's direction.
//   node docs/evidence/latency-0927/flips.mjs build <run dir> <arm A> <arm B> <out dir>
//   node docs/evidence/latency-0927/flips.mjs join <out dir>
//   node docs/evidence/latency-0927/flips.mjs counts <run dir> <arm A> <arm B>
//   node docs/evidence/latency-0927/flips.mjs relevance <run dir> <arm A> <arm B> <grading dir>
// A flip is a shop (by domain, as eval/compare.mjs counts it) that Brave returned in both arms in the
// same round and one arm showed while the other dropped it. `build` writes to-grade.json (what the
// graders see: no arm, no direction), directions.json (kept from the graders) and reused-grades.json
// (rows already graded earlier, matched on search, URL and address). `join` reads grades-*.json
// written by the graders and prints one line per direction. `counts` prints model-verdict flips per
// kind, ranked-out flips and yes/maybe shifts, between the arms and between the same arm's two rounds.
// `relevance` prints the yes/maybe split of shown local shops and the graded verdicts behind each label.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { precision, sectionResults } from '../../../eval/summarize.mjs';

const QUALITY = 'docs/evidence/quality';
const GRADING = 'docs/evidence/latency-0927/grading';
/** Drop reasons that come from the model's classification (see dropReason in proxy/src/precision.ts). */
const MODEL_REASONS = new Set(['sells_product', 'site_type']);
/** @param {string} p */
const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
/** @param {string} p */
const readOr = (p) => (existsSync(p) ? read(p) : null);
/** @param {string} id @param {string} url @param {string | null | undefined} address */
const rowKey = (id, url, address) => `${id}|${url}|${address ?? ''}`;
/** The same shop in two searches of one query: its domain and address. @param {any} r */
const shopKey = (r) => `${r.retailer.domain}|${r.address ?? ''}`;

/** @type {Map<string, any[]>} */
const loaded = new Map();
/** The saved 200 responses in a folder, read once per command. @param {string} dir @returns {any[]} */
const savedIn = (dir) => {
  if (!loaded.has(dir)) loaded.set(dir, readdirSync(dir).map((f) => read(`${dir}/${f}`)).filter((s) => s.status === 200));
  return /** @type {any[]} */ (loaded.get(dir));
};
/** Searches saved in both folders, as [in x, in y], in x's order. @param {string} dirX @param {string} dirY @returns {Array<[any, any]>} */
function pairedSaves(dirX, dirY) {
  const inY = new Map(savedIn(dirY).map((s) => [s.id, s]));
  return savedIn(dirX).flatMap((a) => (inY.has(a.id) ? [/** @type {[any, any]} */ ([a, inY.get(a.id)])] : []));
}
/** The round numbers a run folder holds for an arm. @param {string} runDir @param {string} arm */
const roundsOf = (runDir, arm) => readdirSync(runDir).filter((d) => d.startsWith(`${arm}-r`)).map((d) => d.slice(arm.length + 2));
/** @param {string} runDir @param {string} arm @param {string} round */
const responsesDir = (runDir, arm, round) => `${runDir}/${arm}-r${round}/responses`;

/** @param {any} body @param {'local' | 'online'} kind @returns {Map<string, string>} domain -> drop reason */
const droppedOf = (body, kind) => new Map((body.dropped ?? []).filter((/** @type {any} */ d) => d.kind === kind).map((/** @type {any} */ d) => [d.domain, d.reason]));

/**
 * Shops returned in both saved searches and shown by exactly one. `dropReason` is why the other arm
 * dropped it.
 * @param {any} a @param {any} b @param {'local' | 'online'} [kind]
 * @returns {Array<{ domain: string, shownBy: 'a' | 'b', dropReason: string }>}
 */
function flipsBetween(a, b, kind = 'local') {
  const shownA = new Set(sectionResults(a, kind).map((r) => r.retailer.domain));
  const shownB = new Set(sectionResults(b, kind).map((r) => r.retailer.domain));
  const dropA = droppedOf(a, kind), dropB = droppedOf(b, kind);
  /** @type {Array<{ domain: string, shownBy: 'a' | 'b', dropReason: string }>} */
  const out = [];
  for (const d of new Set([...shownA, ...shownB])) {
    const inA = shownA.has(d);
    if (inA === shownB.has(d)) continue;
    const dropReason = (inA ? dropB : dropA).get(d);
    if (dropReason !== undefined) out.push({ domain: d, shownBy: inA ? 'a' : 'b', dropReason });
  }
  return out;
}

/** Nearby shops shown in both searches, as [row in a, row in b]. @param {any} a @param {any} b @returns {Array<[any, any]>} */
function shownInBoth(a, b) {
  const inB = new Map(sectionResults(b, 'local').map((r) => [shopKey(r), r]));
  return sectionResults(a, 'local').flatMap((r) => (inB.has(shopKey(r)) ? [/** @type {[any, any]} */ ([r, inB.get(shopKey(r))])] : []));
}

/**
 * Adds the grades in a folder of flips graded by a session of this experiment. The priority 6 folder's
 * joined.json has no address field, so it comes from the rows that were graded.
 * @param {Map<string, any>} index @param {string} dir
 */
function addGradingFolder(index, dir) {
  const rows = [...(readOr(`${dir}/to-grade.json`)?.rows ?? []), ...(readOr(`${dir}/reused-grades.json`)?.rows ?? [])];
  for (const g of readOr(`${dir}/joined.json`)?.rows ?? []) {
    const t = rows.find((x) => x.search_id === g.search_id && x.url === g.url && x.name === g.name);
    index.set(rowKey(g.search_id, g.url, 'address' in g ? g.address : t?.address), { ...t, ...g, from: dir.replace('docs/evidence/', '') });
  }
}

/**
 * Every grade already made for a local shop, keyed by search, URL and address: the quality runs, the
 * priority 6 flips, and any folder in `extraFolders`.
 * @param {string[]} [extraFolders] @returns {Map<string, any>}
 */
function earlierGrades(extraFolders = []) {
  /** @type {Map<string, any>} */
  const index = new Map();
  // Later runs win: the second 9-25 run carries the first run's merged grades and operator checks.
  for (const run of ['eval60', 'eval20-0924', 'eval20-0925', 'eval20-0925/run2']) {
    const byRow = new Map(savedIn(`${QUALITY}/${run}/responses`).flatMap((s) => sectionResults(s.body, 'local').map((r) => [`${s.id}|${r.id}`, r])));
    for (const g of readOr(`${QUALITY}/${run}/grades.json`)?.grades ?? []) {
      const r = byRow.get(`${g.search_id}|${g.result_id}`);
      if (r && g.kind === 'local') index.set(rowKey(g.search_id, g.url, r.address), { ...g, from: run });
    }
  }
  for (const dir of [GRADING, ...extraFolders]) addGradingFolder(index, dir);
  return index;
}

/**
 * good, bad or unknown by eval/summarize.mjs precision(): unknown when either answer is unknown,
 * except that a shop confirmed not to exist is bad.
 * @param {any} g
 */
function verdictOf(g) {
  const { graded, relevant } = precision([{ ...g, kind: 'local' }]);
  return graded === 0 ? 'unknown' : relevant === 1 ? 'good' : 'bad';
}

/** @param {string} runDir @param {string} armA @param {string} armB @param {string} outDir */
function build(runDir, armA, armB, outDir) {
  const rounds = roundsOf(runDir, armA);
  /** @type {Map<string, any>} */
  const rows = new Map();
  /** @type {Record<string, Array<{ round: string, direction: string, other_arm_drop_reason: string }>>} */
  const directions = {};
  const counts = { flips: 0, byReason: /** @type {Record<string, number>} */ ({}) };
  for (const round of rounds) {
    for (const [a, b] of pairedSaves(responsesDir(runDir, armA, round), responsesDir(runDir, armB, round))) {
      for (const f of flipsBetween(a.body, b.body)) {
        const from = f.shownBy === 'a' ? a : b;
        counts.byReason[f.dropReason] = (counts.byReason[f.dropReason] ?? 0) + 1;
        // Only the model's own verdicts are graded; a shop that fell below the top 10 was ranked out.
        if (!MODEL_REASONS.has(f.dropReason)) continue;
        counts.flips++;
        for (const r of sectionResults(from.body, 'local').filter((x) => x.retailer.domain === f.domain)) {
          const key = rowKey(a.id, r.retailer.url, r.address);
          rows.set(key, {
            search_id: a.id, product: a.request.product, place: `${a.request.city}, ${a.request.state}`, name: r.retailer.name, url: r.retailer.url,
            address: r.address, distance_mi: r.distance_km == null ? null : Math.round(r.distance_km * 0.621371 * 10) / 10, map_categories: r.snippet,
          });
          (directions[key] ??= []).push({ round, direction: `${f.shownBy === 'a' ? armA : armB}-only`, other_arm_drop_reason: f.dropReason });
        }
      }
    }
  }
  const old = earlierGrades();
  const reused = [], todo = [];
  // Sorted by search and name, so the order says nothing about which arm showed a shop.
  for (const [key, row] of [...rows].sort((x, y) => x[1].search_id.localeCompare(y[1].search_id) || x[1].name.localeCompare(y[1].name))) {
    const g = old.get(key);
    if (g) reused.push({ ...row, sells_product: g.sells_product, local_exists: g.local_exists, distance_plausible: g.distance_plausible, page_access: g.page_access, notes: g.notes, from: g.from });
    else todo.push(row);
  }
  writeFileSync(`${outDir}/to-grade.json`, JSON.stringify({ rows: todo }, null, 1) + '\n');
  writeFileSync(`${outDir}/reused-grades.json`, JSON.stringify({ rows: reused }, null, 1) + '\n');
  writeFileSync(`${outDir}/directions.json`, JSON.stringify(directions, null, 1) + '\n');
  console.log({ rounds, model_flips: counts.flips, all_flips_by_drop_reason: counts.byReason, shop_rows: rows.size, reused: reused.length, to_grade: todo.length });
}

/** @param {string} outDir */
function join(outDir) {
  const directions = read(`${outDir}/directions.json`);
  const graded = readdirSync(outDir).filter((f) => /^grades-.*\.json$/.test(f)).flatMap((f) => read(`${outDir}/${f}`));
  const todo = read(`${outDir}/to-grade.json`).rows;
  const reused = read(`${outDir}/reused-grades.json`).rows;
  /** @type {any[]} */
  const joined = [];
  for (const t of todo) {
    const g = graded.find((x) => x.search_id === t.search_id && x.url === t.url && x.name === t.name);
    if (!g) throw new Error(`no grade for ${t.search_id} ${t.name}`);
    joined.push({ ...t, ...g, source: 'new' });
  }
  for (const r of reused) joined.push({ ...r, source: 'reused' });
  for (const j of joined) {
    j.verdict = verdictOf(j);
    j.directions = directions[rowKey(j.search_id, j.url, j.address)];
  }
  const rule = 'as eval/summarize.mjs precision(): good = sells the product (yes or equivalent) and the shop exists; bad = does not sell it, or confirmed not to exist; unknown = either answer unknown';
  writeFileSync(`${outDir}/joined.json`, JSON.stringify({ rule, rows: joined }, null, 1) + '\n');
  /** @type {Record<string, Record<string, number>>} */
  const table = {};
  for (const j of joined) {
    // A shop flipped in both directions (in different rounds) gets its own line.
    const dirs = [...new Set(j.directions.map((/** @type {any} */ x) => x.direction))];
    const label = dirs.length > 1 ? 'both directions' : dirs[0];
    table[label] ??= { good: 0, bad: 0, unknown: 0 };
    table[label][j.verdict]++;
  }
  console.table(table);
  console.log({ shops: joined.length, new: todo.length, reused: reused.length });
}

/** The relevance component's value: 1.0 when the model judged the shop sells the product, 0.5 for maybe. @param {any} r */
const relevanceOf = (r) => r.components?.find((/** @type {any} */ c) => c.name === 'relevance')?.value;

/** @typedef {(a: any, b: any) => [number, number]} Measure Two saved bodies to [count, total]; total is 0 when the count has none. */

/**
 * Shops shown in both searches whose relevance value differs (a yes/maybe shift reorders the nearby
 * top 3 without dropping anything). Returns [differing, shown in both].
 * @type {Measure}
 */
function relevanceShifts(a, b) {
  const both = shownInBoth(a, b);
  return [both.filter(([x, y]) => relevanceOf(x) !== relevanceOf(y)).length, both.length];
}

/**
 * Flips and relevance shifts between two arms next to the same code run in both rounds (noise).
 * Model flips are drops by sells_product or site_type; ranked-out flips are shops that fell below
 * the top 10 in one arm and were shown in the other.
 * @param {string} runDir @param {string} armA @param {string} armB
 */
function counts(runDir, armA, armB) {
  /**
   * @param {string} dirX @param {string} dirY @param {Measure} measure
   * @returns {string} the count, with "of <total>" when the measure has one
   */
  const between = (dirX, dirY, measure) => {
    let n = 0, of = 0;
    for (const [x, y] of pairedSaves(dirX, dirY)) {
      const [count, total] = measure(x.body, y.body);
      n += count;
      of += total;
    }
    return of ? `${n} of ${of}` : String(n);
  };
  /** @param {'local' | 'online'} kind @param {(reason: string) => boolean} keep @returns {Measure} */
  const flips = (kind, keep) => (a, b) => [flipsBetween(a, b, kind).filter((f) => keep(f.dropReason)).length, 0];
  const measures = /** @type {const} */ ([
    ['local model flips', flips('local', (r) => MODEL_REASONS.has(r))],
    ['online model flips', flips('online', (r) => MODEL_REASONS.has(r))],
    ['local ranked-out flips (below_top_10)', flips('local', (r) => r === 'below_top_10')],
    ['local shown in both, relevance differs', relevanceShifts],
  ]);
  const [first = '1', second = '2'] = roundsOf(runDir, armA);
  const dir = (/** @type {string} */ arm, /** @type {string} */ round) => responsesDir(runDir, arm, round);
  const pairs = [
    [`${armA} vs ${armB}, round ${first}`, dir(armA, first), dir(armB, first)],
    [`${armA} vs ${armB}, round ${second}`, dir(armA, second), dir(armB, second)],
    [`${armA} r${first} vs r${second} (noise)`, dir(armA, first), dir(armA, second)],
    [`${armB} r${first} vs r${second} (noise)`, dir(armB, first), dir(armB, second)],
  ];
  console.table(measures.map(([name, measure]) => ({ measure: name, ...Object.fromEntries(pairs.map(([label, x, y]) => [label, between(/** @type {string} */ (x), /** @type {string} */ (y), measure)])) })));
}

/**
 * How the model's yes/maybe judgment (relevance 1.0 / 0.5) is spread over the shown local shops in each
 * arm, how those grades split by verdict where a grade exists (earlier runs plus the flips graded in
 * <grading dir>), and, for shops shown in both arms, how the graded ones moved.
 * @param {string} runDir @param {string} armA @param {string} armB @param {string} gradingDir
 */
function relevance(runDir, armA, armB, gradingDir) {
  const grades = earlierGrades([gradingDir]);
  /** @param {string} id @param {any} r @returns {'good' | 'bad' | 'unknown' | 'ungraded'} */
  const verdict = (id, r) => { const g = grades.get(rowKey(id, r.retailer.url, r.address)); return g ? verdictOf(g) : 'ungraded'; };
  const blank = () => ({ good: 0, bad: 0, unknown: 0, ungraded: 0 });
  const perArm = [];
  const nearbyTop3 = [];
  /** @type {Record<string, { shops: number, good: number, bad: number, unknown: number, ungraded: number }>} */
  const moved = {};
  for (const round of roundsOf(runDir, armA)) {
    for (const arm of [armA, armB]) {
      /** @type {Record<string, { shown: number, good: number, bad: number, unknown: number, ungraded: number }>} */
      const byValue = {};
      const top3 = { arm, round, shops: 0, ...blank() };
      for (const s of savedIn(responsesDir(runDir, arm, round))) {
        for (const r of sectionResults(s.body, 'local')) {
          const cell = (byValue[String(relevanceOf(r))] ??= { shown: 0, ...blank() });
          cell.shown++;
          cell[verdict(s.id, r)]++;
        }
        for (const r of s.body.local.slice(0, 3)) {
          top3.shops++;
          top3[verdict(s.id, r)]++;
        }
      }
      for (const [value, cell] of Object.entries(byValue)) perArm.push({ arm, round, relevance: value, ...cell });
      nearbyTop3.push(top3);
    }
    for (const [a, b] of pairedSaves(responsesDir(runDir, armA, round), responsesDir(runDir, armB, round))) {
      for (const [x, y] of shownInBoth(a.body, b.body)) {
        const cell = (moved[`${armA} ${relevanceOf(x)} -> ${armB} ${relevanceOf(y)}`] ??= { shops: 0, ...blank() });
        cell.shops++;
        cell[verdict(a.id, x)]++;
      }
    }
  }
  console.table(perArm);
  console.table(moved);
  console.table(nearbyTop3);
}

/** Each command with how many arguments it takes. @type {Record<string, [number, (...args: string[]) => void]>} */
const commands = { build: [4, build], join: [1, join], counts: [3, counts], relevance: [4, relevance] };
const [cmd = '', ...args] = process.argv.slice(2);
const command = commands[cmd];
if (!command || args.length !== command[0]) {
  throw new Error('usage: flips.mjs build <run dir> <arm A> <arm B> <out dir> | join <out dir> | counts <run dir> <arm A> <arm B> | relevance <run dir> <arm A> <arm B> <grading dir>');
}
command[1](...args);
