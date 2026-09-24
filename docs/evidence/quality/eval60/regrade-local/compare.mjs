// Run from the repo root: node docs/evidence/quality/eval60/regrade-local/compare.mjs
// Agreement between the first local grades (eval60/grades.json) and the blind second pass.
import { readFileSync } from 'node:fs';
const W = new URL('.', import.meta.url).pathname;
const first = new Map(JSON.parse(readFileSync('docs/evidence/quality/eval60/grades.json', 'utf8')).grades.map((g) => [g.result_id, g]));
const second = JSON.parse(readFileSync(W + 'grades-second.json', 'utf8')).grades;
const verdict = (g) => (g.sells_product === 'unknown' || g.local_exists === 'unknown' ? 'unknown' : g.sells_product !== 'no' && g.local_exists === 'yes' ? 'good' : 'bad');
const t = {}; const rows = [];
for (const b of second) {
  const a = first.get(b.result_id); const va = verdict(a), vb = verdict(b);
  const k = `${va}/${vb}`; t[k] = (t[k] ?? 0) + 1;
  if (va !== vb) rows.push(`${va} -> ${vb} [${b.evidence_level}] ${b.search_id} | ${b.url} | 1st: ${a.sells_product}/${a.local_exists} | 2nd: ${b.sells_product}/${b.local_exists}`);
}
const both = second.filter((b) => verdict(first.get(b.result_id)) !== 'unknown' && verdict(b) !== 'unknown');
const agree = both.filter((b) => verdict(first.get(b.result_id)) === verdict(b)).length;
const prec = (list, f) => { const j = list.filter((g) => f(g) !== 'unknown'); return `${j.filter((g) => f(g) === 'good').length}/${j.length}`; };
console.log({ pairs: t, judged_by_both: both.length, agree, agreement: (agree / both.length).toFixed(3),
  precision_first: prec(second.map((b) => first.get(b.result_id)), verdict), precision_second: prec(second, verdict) });
for (const lvl of ['store', 'chain']) { const s = second.filter((b) => b.evidence_level === lvl); console.log(lvl, 'second-pass precision', prec(s, verdict)); }
console.log(rows.join('\n'));
