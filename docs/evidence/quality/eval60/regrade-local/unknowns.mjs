// Run from the repo root: node docs/evidence/quality/eval60/regrade-local/unknowns.mjs
// Local precision after regrading the rows the first grades left unknown (45): 37 graded in
// grades-unknowns.json, 8 already in grades-second.json. Other rows keep their first grade.
import { readFileSync } from 'node:fs';
const D = 'docs/evidence/quality/eval60/';
const read = (p) => JSON.parse(readFileSync(D + p, 'utf8'));
const verdict = (g) => (g.sells_product === 'unknown' || g.local_exists === 'unknown' ? 'unknown' : g.sells_product !== 'no' && g.local_exists === 'yes' ? 'good' : 'bad');
const first = read('grades.json').grades.filter((g) => g.kind === 'local');
const second = new Map([...read('regrade-local/grades-unknowns.json').grades, ...read('regrade-local/grades-second.json').grades].map((g) => [g.result_id, g]));
const count = { good: 0, bad: 0, unknown: 0 }; const regraded = { good: 0, bad: 0, unknown: 0 };
for (const g of first) {
  const v = verdict(g) === 'unknown' ? verdict(second.get(g.result_id)) : verdict(g);
  count[v]++;
  if (verdict(g) === 'unknown') regraded[v]++;
}
console.log({ first_unknowns_regraded: regraded, combined: count, precision: `${count.good}/${count.good + count.bad}` });
