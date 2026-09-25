// Same measures on eval60 (before distance groups and classifier-judged ranking), second-pass grades for first-pass unknowns.
import { readFileSync } from 'node:fs';
const HERE = new URL('.', import.meta.url).pathname;
const OLD = 'docs/evidence/quality/eval60';
const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
const ids = read(`${HERE}/ids.json`).ids;
const verdict = (g) => (!g ? 'ungraded' : g.sells_product === 'unknown' || g.local_exists === 'unknown' ? 'unknown' : g.sells_product !== 'no' && g.local_exists === 'yes' ? 'good' : 'bad');
const second = new Map([...read(`${OLD}/regrade-local/grades-unknowns.json`).grades, ...read(`${OLD}/regrade-local/grades-second.json`).grades].map((g) => [`${g.search_id}|${g.result_id}`, g]));
const byKey = new Map(read(`${OLD}/grades.json`).grades.map((g) => {
  const k = `${g.search_id}|${g.result_id}`;
  return [k, verdict(g) === 'unknown' && second.has(k) ? second.get(k) : g];
}));
const top3 = {}; const local = {};
for (const id of ids) {
  const b = read(`${OLD}/responses/${id}.json`).body;
  b.local.slice(0, 3).forEach((r) => { const v = verdict(byKey.get(`${id}|${r.id}`)); top3[v] = (top3[v] ?? 0) + 1; });
  b.local.forEach((r) => { const v = verdict(byKey.get(`${id}|${r.id}`)); local[v] = (local[v] ?? 0) + 1; });
}
console.log({ nearby_top3: top3, all_local: local });
