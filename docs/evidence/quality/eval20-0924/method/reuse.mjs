// Run from the repo root: node docs/evidence/quality/eval20-0924/method/<script>.. Splits the eval20-0924 rows into grades reused from eval60 and rows to grade.
// Reuse key: online (search, url); local (search, url, address), since one URL can be several branches.
// A first-pass unknown takes the second-pass grade when there is one (regrade-local).
import { readFileSync, writeFileSync } from 'node:fs';

const OLD = 'docs/evidence/quality/eval60';
const NEW = 'docs/evidence/quality/eval20-0924';
const OUT = new URL('.', import.meta.url).pathname;
const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
const ids = read(new URL('ids.json', import.meta.url)).ids;

const rows = (dir, id) => {
  const s = read(`${dir}/responses/${id}.json`);
  if (s.status !== 200) return [];
  return [...s.body.online, ...s.body.local, ...(s.body.local_farther ?? [])].map((r) => ({ search_id: id, ...r }));
};
const key = (id, kind, url, address) => (kind === 'online' ? `${id}|online|${url}` : `${id}|local|${url}|${address ?? ''}`);

const oldRows = new Map(ids.flatMap((id) => rows(OLD, id)).map((r) => [`${r.search_id}|${r.id}`, r]));
const second = new Map([...read(`${OLD}/regrade-local/grades-unknowns.json`).grades, ...read(`${OLD}/regrade-local/grades-second.json`).grades].map((g) => [`${g.search_id}|${g.result_id}`, g]));
const FIELDS = ['sells_product', 'local_exists', 'distance_plausible', 'page_access'];
const oldGrades = new Map();
for (const g of read(`${OLD}/grades.json`).grades) {
  const r = oldRows.get(`${g.search_id}|${g.result_id}`);
  if (!r) continue;
  let grade = g;
  const s = second.get(`${g.search_id}|${g.result_id}`);
  if (s && (g.sells_product === 'unknown' || g.local_exists === 'unknown')) {
    grade = { ...g, ...Object.fromEntries(FIELDS.filter((f) => s[f] !== undefined).map((f) => [f, s[f]])), notes: `${s.notes ?? ''} [second-pass grade]` };
  }
  oldGrades.set(key(g.search_id, g.kind, g.url, r.address), grade);
}

const reused = [];
const todo = [];
for (const id of ids) {
  for (const r of rows(NEW, id)) {
    const old = oldGrades.get(key(id, r.kind, r.retailer.url, r.address));
    if (old) {
      reused.push({ ...old, result_id: r.id, notes: `${old.notes ?? ''} [reused from eval60, same URL${r.kind === 'local' ? ' and address' : ''}]`.trim() });
    } else {
      todo.push({
        search_id: id, result_id: r.id, kind: r.kind, name: r.retailer.name, url: r.retailer.url, address: r.address,
        distance_mi: r.distance_km == null ? null : Math.round(r.distance_km * 0.621371 * 10) / 10,
        matched_product: r.matched_product, snippet: r.snippet, certifications: r.certifications.map((c) => ({ label: c.label, source_url: c.source_url })),
      });
    }
  }
}
writeFileSync(`${OUT}/reused-grades.json`, JSON.stringify({ grades: reused }, null, 1) + '\n');
writeFileSync(`${OUT}/to-grade.json`, JSON.stringify({ rows: todo }, null, 1) + '\n');
const count = (list) => ({ online: list.filter((r) => r.kind === 'online').length, local: list.filter((r) => r.kind === 'local').length });
console.log({ reused: count(reused), to_grade: count(todo) });
