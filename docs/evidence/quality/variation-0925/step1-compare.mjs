// Step 1: compare eval60 vs eval20-0924 for the 20 shared searches.
// "returned" = local domains Brave gave the pipeline (shown + farther + dropped local);
// "shown" = local + local_farther only. Overlap is Jaccard on registrable domains.
// Run from the repo root: node <this> > step1.json
import { readFileSync, readdirSync } from 'node:fs';

const A = 'docs/evidence/quality/eval60/responses/';
const B = 'docs/evidence/quality/eval20-0924/responses/';
const load = (p) => JSON.parse(readFileSync(p, 'utf8')).body;
const shown = (b) => new Set([...(b.local ?? []), ...(b.local_farther ?? [])].map((r) => r.retailer.domain));
const returned = (b) => new Set([...shown(b), ...(b.dropped ?? []).filter((d) => d.kind === 'local').map((d) => d.domain)]);
const jac = (x, y) => {
  const u = new Set([...x, ...y]);
  if (!u.size) return null;
  return [...x].filter((d) => y.has(d)).length / u.size;
};
const qkey = (b) => JSON.stringify([...b.query.local_queries].map((q) => q.toLowerCase().trim()).sort());

const rows = readdirSync(B).filter((f) => f.endsWith('.json')).map((f) => {
  const a = load(A + f), b = load(B + f);
  return {
    id: f.replace('.json', ''),
    same_queries: qkey(a) === qkey(b),
    q60: a.query.local_queries, q0924: b.query.local_queries,
    returned_jaccard: jac(returned(a), returned(b)),
    shown_jaccard: jac(shown(a), shown(b)),
    n_returned: [returned(a).size, returned(b).size],
    n_shown: [shown(a).size, shown(b).size],
  };
});
const mean = (xs) => { const v = xs.filter((x) => x !== null); return v.length ? +(v.reduce((s, x) => s + x, 0) / v.length).toFixed(2) : null; };
const group = (g) => ({ n: g.length, returned_jaccard: mean(g.map((r) => r.returned_jaccard)), shown_jaccard: mean(g.map((r) => r.shown_jaccard)) });
console.log(JSON.stringify({ same: group(rows.filter((r) => r.same_queries)), differ: group(rows.filter((r) => !r.same_queries)), rows }, null, 1));
