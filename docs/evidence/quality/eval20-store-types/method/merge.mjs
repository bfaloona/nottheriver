// Run from the repo root after grading: node docs/evidence/quality/eval20-store-types/method/merge.mjs [run2]
// Writes grades.json in eval20-store-types (or eval20-store-types/run2): reused + new grades, the
// grader's store_breadth on every local row, the chain badge source check folded into badges_sourced,
// and the recall baseline WITH chain labels (eval20-0925's, not eval60's, which has none).
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';

const HERE = new URL('.', import.meta.url).pathname;
const RUN2 = process.argv[2] === 'run2';
const RUN = RUN2 ? 'run2' : 'run1';
const DIR = RUN2 ? 'docs/evidence/quality/eval20-store-types/run2' : 'docs/evidence/quality/eval20-store-types';
const SUFFIX = RUN2 ? '-run2' : '';
/** @param {string} p */
const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
/** @type {string[]} */
const ids = read(`${HERE}/ids.json`).ids;

/** @type {any[]} */
const grades = [...read(`${HERE}/reused-grades${SUFFIX}.json`).grades, ...read(`${HERE}/grades-new-${RUN}.json`).grades];

// The operator's own-browser checks of rows the graders were blocked on replace those fields.
const checksFile = `${HERE}/operator-checks${SUFFIX}.json`;
if (existsSync(checksFile)) {
  const checks = new Map(read(checksFile).checks.map((/** @type {any} */ c) => [`${c.search_id}|${c.result_id}`, c]));
  for (const [i, g] of grades.entries()) {
    const c = checks.get(`${g.search_id}|${g.result_id}`);
    if (c) grades[i] = { ...g, ...c, notes: `${c.notes} Grader: ${g.notes}` };
  }
}

// Shown rows, with the badge each carries.
/** @type {Map<string, any>} */
const shownRows = new Map();
for (const id of ids) {
  const b = read(`${DIR}/responses/${id}.json`).body;
  for (const r of [...b.online, ...b.local, ...(b.local_farther ?? [])]) shownRows.set(`${id}|${r.id}`, r);
}

// store_breadth: breadth-<run>-out-[a-z].json first, then a browser pass, which wins.
const breadthFiles = readdirSync(HERE).filter((f) => new RegExp(`^breadth-${RUN}-out-[a-z]\\.json$`).test(f)).sort();
if (existsSync(`${HERE}/breadth-${RUN}-out-browser.json`)) breadthFiles.push(`breadth-${RUN}-out-browser.json`);
/** @type {Map<string, any>} */
const breadth = new Map();
for (const f of breadthFiles) {
  for (const g of read(`${HERE}/${f}`).grades) {
    // A browser row that could not open the page must not erase the earlier grader's label.
    if (g.page_opened === false && breadth.has(`${g.search_id}|${g.result_id}`)) continue;
    breadth.set(`${g.search_id}|${g.result_id}`, g);
  }
}

// Chain badge source check, one answer per source page.
/** @type {Map<string, any>} */
const chainGrades = new Map(existsSync(`${HERE}/chain-source-grades.json`) ? read(`${HERE}/chain-source-grades.json`).grades.map((/** @type {any} */ g) => [g.source_url, g]) : []);
if (existsSync(`${HERE}/chain-source-grades-browser.json`)) {
  for (const g of read(`${HERE}/chain-source-grades-browser.json`).grades) if (g.supports !== 'unknown') chainGrades.set(g.source_url, g);
}
// The definition names big-box under "general", but graders read it relative to the product: Lowe's was
// specialist for a drill and unknown for a skillet, Home Depot general for a drill and unknown for towels.
// One rule for the chains the graders split on: a home-improvement or office big-box is general for every product.
const BIG_BOX_DOMAINS = new Set(['homedepot.com', 'lowes.com', 'officedepot.com']);
/**
 * Why a grader answered "unknown": the shop's main line is a different category (the scale has no value
 * for it), it is not a retailer, or the site could not be read. Read from the grader's own note.
 * @param {string} notes @returns {'off_category' | 'not_a_retailer' | 'unresolved'}
 */
const unknownKind = (notes) =>
  /^NOT A RETAILER|not a retailer|tour operator|contractor|wireless carrier|wholesale/i.test(notes) ? 'not_a_retailer'
    : /^UNREACHABLE|does not resolve|unreachable|could not be determined|could not tell/i.test(notes) ? 'unresolved'
      : 'off_category';
const unknownChain = [];
/** @type {string[]} */
const downgraded = [];

for (const [i, g] of grades.entries()) {
  const k = `${g.search_id}|${g.result_id}`;
  const row = shownRows.get(k);
  let next = { ...g };
  // A page that never loaded cannot support a yes (eval/README.md: grader rule; blocked rows wait for an operator check).
  if (g.sells_product === 'yes' && g.page_access !== 'ok' && /^needs operator check/i.test(g.notes)) {
    next = { ...next, sells_product: 'unknown', notes: `${g.notes} [sells_product set to unknown: the page never loaded, awaiting an operator check]` };
    downgraded.push(k);
  }
  const b = breadth.get(k);
  const breadthApplied = g.kind === 'local' && Boolean(b) && (!g.store_breadth || g.store_breadth === 'unknown');
  if (breadthApplied) next.store_breadth = b.store_breadth;
  if (g.kind === 'local' && BIG_BOX_DOMAINS.has(row?.retailer.domain) && next.store_breadth !== 'general') {
    next.notes = `${next.notes} [store_breadth was ${next.store_breadth}; set to general: big-box chain, one rule for every product]`;
    next.store_breadth = 'general';
  }
  if (row?.chain) {
    const c = chainGrades.get(row.chain.source_url);
    if (!c || c.supports === 'unknown') unknownChain.push(k);
    else {
      // Certification check and chain check must both hold.
      next.badges_sourced = g.badges_sourced === 'no' || c.supports === 'no' ? 'no' : 'yes';
      next.notes = `${next.notes} [chain badge source ${c.supports === 'yes' ? 'states' : 'does not state'} a count of 10 or more stores]`;
    }
  }
  // The breadth grader's own note is kept with the grade, so the reason for an unknown stays auditable.
  if (breadthApplied) next.notes = `${next.notes} [store_breadth ${b.store_breadth}: ${b.notes}]`;
  if (g.kind === 'local' && next.store_breadth === 'unknown') next.notes = `${next.notes} [store_breadth unknown kind: ${unknownKind(b?.notes ?? g.notes)}]`;
  grades[i] = next;
}

const baseline = read('docs/evidence/quality/eval20-0925/grades.json').baseline.filter((/** @type {any} */ b) => ids.includes(b.search_id));

// Every shown row has exactly one grade, and every local row a store_breadth.
const graded = new Map();
for (const g of grades) graded.set(`${g.search_id}|${g.result_id}`, (graded.get(`${g.search_id}|${g.result_id}`) ?? 0) + 1);
const missing = [...shownRows.keys()].filter((k) => !graded.has(k));
const dupes = [...graded].filter(([, n]) => n > 1).map(([k]) => k);
const noBreadth = grades.filter((g) => g.kind === 'local' && !g.store_breadth).map((g) => `${g.search_id}|${g.result_id}`);
if (missing.length || dupes.length || noBreadth.length) {
  console.error({ missing, dupes, noBreadth });
  process.exit(1);
}
writeFileSync(`${DIR}/grades.json`, JSON.stringify({ grades, baseline }, null, 1) + '\n');

/** @param {any} g */
const verdict = (g) => (g.sells_product === 'unknown' || g.local_exists === 'unknown' ? 'unknown' : g.sells_product !== 'no' && g.local_exists === 'yes' ? 'good' : 'bad');
const byKey = new Map(grades.map((g) => [`${g.search_id}|${g.result_id}`, g]));
const top3 = { good: 0, bad: 0, unknown: 0 };
const farther = { good: 0, bad: 0, unknown: 0 };
const unclassified = { online: 0, local: 0 };
for (const id of ids) {
  const b = read(`${DIR}/responses/${id}.json`).body;
  for (const r of b.local.slice(0, 3)) top3[verdict(byKey.get(`${id}|${r.id}`))]++;
  for (const r of b.local_farther ?? []) farther[verdict(byKey.get(`${id}|${r.id}`))]++;
  unclassified.online += b.usage.unclassified_shown?.online ?? 0;
  unclassified.local += b.usage.unclassified_shown?.local ?? 0;
}
console.log({ rows: grades.length, baseline: baseline.length, nearby_top3: top3, farther, unclassified_shown: unclassified, chain_badge_rows_without_a_source_answer: unknownChain, unread_yes_set_to_unknown: downgraded });
