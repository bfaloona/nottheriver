// Run from the repo root: node docs/evidence/quality/eval20-0925/method/reuse.mjs [run2]
// Splits the eval20-0925 rows (or, with run2, the second run's) into grades reused from earlier runs and rows to grade.
// Reuse key: online (search, url); local (search, url, address), since one URL can be several branches.
// eval20-0924/grades.json already holds its eval60 reuses, second-pass grades and operator checks,
// so it wins over eval60 when both have the key.
import { readFileSync, writeFileSync } from 'node:fs';

const DIR = 'docs/evidence/quality';
const RUN2 = process.argv[2] === 'run2';
const NEW = RUN2 ? `${DIR}/eval20-0925/run2` : `${DIR}/eval20-0925`;
const SUFFIX = RUN2 ? '-run2' : '';
const OUT = new URL('.', import.meta.url).pathname;
/** @param {string | URL} p */
const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
/** @type {string[]} */
const ids = read(new URL('ids.json', import.meta.url)).ids;

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
/** @param {string} run @param {any[]} grades */
const index = (run, grades) => {
  const byRow = new Map(ids.flatMap((id) => rows(`${DIR}/${run}`, id)).map((r) => [`${r.search_id}|${r.id}`, r]));
  for (const g of grades) {
    const r = byRow.get(`${g.search_id}|${g.result_id}`);
    if (r) oldGrades.set(key(g.search_id, g.kind, g.url, r.address), { ...g, from: run });
  }
};

// eval60 first-pass unknowns take the second-pass grade when there is one (regrade-local).
const E60 = `${DIR}/eval60`;
const second = new Map([...read(`${E60}/regrade-local/grades-unknowns.json`).grades, ...read(`${E60}/regrade-local/grades-second.json`).grades].map((g) => [`${g.search_id}|${g.result_id}`, g]));
const FIELDS = ['sells_product', 'local_exists', 'distance_plausible', 'page_access'];
index('eval60', read(`${E60}/grades.json`).grades.map((/** @type {any} */ g) => {
  const s = second.get(`${g.search_id}|${g.result_id}`);
  if (!s || (g.sells_product !== 'unknown' && g.local_exists !== 'unknown')) return g;
  return { ...g, ...Object.fromEntries(FIELDS.filter((f) => s[f] !== undefined).map((f) => [f, s[f]])), notes: `${s.notes ?? ''} [second-pass grade]` };
}));
index('eval20-0924', read(`${DIR}/eval20-0924/grades.json`).grades);
// The first run's merged grades (with its operator checks) win for the second run.
if (RUN2) index('eval20-0925', read(`${DIR}/eval20-0925/grades.json`).grades);

const reused = [];
const todo = [];
for (const id of ids) {
  for (const r of rows(NEW, id)) {
    const old = oldGrades.get(key(id, r.kind, r.retailer.url, r.address));
    if (old) {
      const { from, ...grade } = old;
      reused.push({ ...grade, result_id: r.id, notes: `${grade.notes ?? ''} [reused from ${from}, same URL${r.kind === 'local' ? ' and address' : ''}]`.trim() });
    } else {
      todo.push({
        search_id: id, result_id: r.id, kind: r.kind, name: r.retailer.name, url: r.retailer.url, address: r.address,
        distance_mi: r.distance_km == null ? null : Math.round(r.distance_km * 0.621371 * 10) / 10,
        matched_product: r.matched_product, snippet: r.snippet, certifications: r.certifications.map((/** @type {any} */ c) => ({ label: c.label, source_url: c.source_url })),
      });
    }
  }
}
writeFileSync(`${OUT}/reused-grades${SUFFIX}.json`, JSON.stringify({ grades: reused }, null, 1) + '\n');
writeFileSync(`${OUT}/to-grade${SUFFIX}.json`, JSON.stringify({ rows: todo }, null, 1) + '\n');
/** @param {any[]} list */
const count = (list) => ({ online: list.filter((r) => r.kind === 'online').length, local: list.filter((r) => r.kind === 'local').length });
console.log({ reused: count(reused), to_grade: count(todo) });
