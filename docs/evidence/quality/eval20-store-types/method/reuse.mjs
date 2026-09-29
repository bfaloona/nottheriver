// Run from the repo root: node docs/evidence/quality/eval20-store-types/method/reuse.mjs [run2]
// Splits one run's shown rows into grades reused from earlier runs and rows to grade, and lists the
// reused local rows whose store_breadth still needs the grader's own judgment (new local rows get it in to-grade).
// Reuse key: online (search, url); local (search, url, address), since one URL can be several branches.
// Grader-facing files never carry the model's store_breadth or the chain label the site showed.
import { readFileSync, writeFileSync } from 'node:fs';

const DIR = 'docs/evidence/quality';
const RUN2 = process.argv[2] === 'run2';
const NEW = RUN2 ? `${DIR}/eval20-store-types/run2` : `${DIR}/eval20-store-types`;
const SUFFIX = RUN2 ? '-run2' : '';
const OUT = new URL('.', import.meta.url).pathname;
/** @param {string | URL} p */
const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
/** @type {string[]} */
const ids = read(new URL('ids.json', import.meta.url)).ids;
/** @type {Map<string, string>} */
const products = new Map(read('eval/queries.json').queries.map((/** @type {{ id: string, product: string }} */ q) => [q.id, q.product]));

/** @param {string} dir @param {string} id @returns {any[]} */
const rows = (dir, id) => {
  const s = read(`${dir}/responses/${id}.json`);
  if (s.status !== 200) return [];
  return [...s.body.online, ...s.body.local, ...(s.body.local_farther ?? [])].map((r) => ({ search_id: id, ...r }));
};
/** @param {string} id @param {string} kind @param {string} url @param {string | undefined} address */
const key = (id, kind, url, address) => (kind === 'online' ? `${id}|online|${url}` : `${id}|local|${url}|${address ?? ''}`);

/** @type {Map<string, any & { from: string }>} */
const oldGrades = new Map();
/** @type {Set<string>} */
let latencyKeys = new Set();
let latencyOverridden = 0;
/** @param {string} run @param {any[]} grades */
const index = (run, grades) => {
  const byRow = new Map(ids.flatMap((id) => rows(`${DIR}/${run}`, id)).map((r) => [`${r.search_id}|${r.id}`, r]));
  for (const g of grades) {
    const r = byRow.get(`${g.search_id}|${g.result_id}`);
    if (!r) continue;
    const k = key(g.search_id, g.kind, g.url, r.address);
    if (latencyKeys.has(k)) latencyOverridden++;
    oldGrades.set(k, { ...g, from: run });
  }
};

// Latency work (2026-09-28) graded nearby shops blind on the same fields; they carry no result_id, so
// they join on search, URL and address. Indexed first so an eval-run grade (which carries operator
// checks) always wins a collision; the collisions are counted and printed.
const LATENCY = 'docs/evidence/latency-0927';
for (const file of ['grading/grades-new-a.json', 'grading/grades-new-b.json', 'grading-split/grades-a.json', 'grading-split/grades-b.json']) {
  for (const g of read(`${LATENCY}/${file}`)) {
    if (!ids.includes(g.search_id)) continue;
    oldGrades.set(key(g.search_id, 'local', g.url, g.address), { ...g, kind: 'local', from: file });
  }
}
latencyKeys = new Set(oldGrades.keys());

// Same order as eval20-0925/method/reuse.mjs: later sources win, so the freshest grade of a row is used.
const E60 = `${DIR}/eval60`;
const second = new Map([...read(`${E60}/regrade-local/grades-unknowns.json`).grades, ...read(`${E60}/regrade-local/grades-second.json`).grades].map((g) => [`${g.search_id}|${g.result_id}`, g]));
const FIELDS = ['sells_product', 'local_exists', 'distance_plausible', 'page_access'];
index('eval60', read(`${E60}/grades.json`).grades.map((/** @type {any} */ g) => {
  const s = second.get(`${g.search_id}|${g.result_id}`);
  if (!s || (g.sells_product !== 'unknown' && g.local_exists !== 'unknown')) return g;
  return { ...g, ...Object.fromEntries(FIELDS.filter((f) => s[f] !== undefined).map((f) => [f, s[f]])), notes: `${s.notes ?? ''} [second-pass grade]` };
}));
index('eval20-0924', read(`${DIR}/eval20-0924/grades.json`).grades);
index('eval20-0925', read(`${DIR}/eval20-0925/grades.json`).grades);
index('eval20-0925/run2', read(`${DIR}/eval20-0925/run2/grades.json`).grades);
if (RUN2) index('eval20-store-types', read(`${DIR}/eval20-store-types/grades.json`).grades);

/** @type {Map<string, number>} */
const fromCounts = new Map();
const GRADE_FIELDS = ['sells_product', 'local_exists', 'distance_plausible', 'badges_sourced', 'page_access', 'notes', 'checked', 'store_breadth'];
const reused = [];
const todo = [];
const breadth = [];
for (const id of ids) {
  for (const r of rows(NEW, id)) {
    const found = oldGrades.get(key(id, r.kind, r.retailer.url, r.address));
    // A latency grade has no badges_sourced; it is reusable only where there is no certification to check.
    const old = found && (found.badges_sourced !== undefined || r.certifications.length === 0) ? { badges_sourced: 'n/a', ...found } : undefined;
    if (old) {
      const { from } = old;
      fromCounts.set(from, (fromCounts.get(from) ?? 0) + 1);
      const grade = Object.fromEntries(GRADE_FIELDS.filter((f) => old[f] !== undefined).map((f) => [f, old[f]]));
      reused.push({ ...grade, search_id: id, result_id: r.id, kind: r.kind, url: r.retailer.url, notes: `${grade.notes ?? ''} [reused from ${from}, same URL${r.kind === 'local' ? ' and address' : ''}]`.trim() });
    } else {
      todo.push({
        search_id: id, product: products.get(id), result_id: r.id, kind: r.kind, name: r.retailer.name, url: r.retailer.url, address: r.address,
        distance_mi: r.distance_km == null ? null : Math.round(r.distance_km * 0.621371 * 10) / 10,
        matched_product: r.matched_product, snippet: r.snippet, certifications: r.certifications.map((/** @type {any} */ c) => ({ label: c.label, source_url: c.source_url })),
      });
    }
    if (r.kind === 'local' && old && !old.store_breadth) breadth.push({ search_id: id, product: products.get(id), result_id: r.id, name: r.retailer.name, url: r.retailer.url, address: r.address });
  }
}
writeFileSync(`${OUT}/reused-grades${SUFFIX}.json`, JSON.stringify({ grades: reused }, null, 1) + '\n');
writeFileSync(`${OUT}/to-grade${SUFFIX}.json`, JSON.stringify({ rows: todo }, null, 1) + '\n');
writeFileSync(`${OUT}/breadth-rows${SUFFIX}.json`, JSON.stringify({ rows: breadth }, null, 1) + '\n');
/** @param {any[]} list */
const count = (list) => ({ online: list.filter((r) => r.kind === 'online').length, local: list.filter((r) => r.kind === 'local').length });
console.log({ reused: count(reused), to_grade: count(todo), local_rows_needing_breadth: breadth.length, latency_grades_overridden_by_eval_grades: latencyOverridden, reused_by_source: Object.fromEntries(fromCounts) });
