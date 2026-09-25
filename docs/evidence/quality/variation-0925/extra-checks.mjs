// Extra checks on saved data: (a) how much wording churn is only store<->shop,
// (b) sells/site-type judgment flips on domains both eval runs got from Brave,
// (c) shown-row overlap by domain + street address.
import { readFileSync, readdirSync } from 'node:fs';
const DIR = new URL('.', import.meta.url).pathname;
const A = 'docs/evidence/quality/eval60/responses/', B = 'docs/evidence/quality/eval20-0924/responses/';
const load = (p) => JSON.parse(readFileSync(p, 'utf8')).body;
const key = (qs, canon) => JSON.stringify(qs.map((q) => { const s = q.toLowerCase().trim(); return canon ? s.replace(/ (shop|store)$/, ' STORE') : s; }).sort());
const s3 = { ...JSON.parse(readFileSync(DIR + 'step3.json', 'utf8')) };
const s3b = JSON.parse(readFileSync(DIR + 'step3b.json', 'utf8'));
let e1 = [0, 0], m6 = [0, 0], flips = 0, both = 0, flipIds = [];
const jac = (x, y) => { const u = new Set([...x, ...y]); return u.size ? [...x].filter((d) => y.has(d)).length / u.size : null; };
const addrJ = [];
for (const f of readdirSync(B).filter((x) => x.endsWith('.json')).sort()) {
  const id = f.replace('.json', ''), a = load(A + f), b = load(B + f);
  if (key(a.query.local_queries, false) !== key(b.query.local_queries, false)) e1[0]++;
  if (key(a.query.local_queries, true) !== key(b.query.local_queries, true)) e1[1]++;
  const runs = [...s3[id], ...s3b[id]].map((r) => r.local_queries ?? []);
  if (new Set(runs.map((q) => key(q, false))).size > 1) m6[0]++;
  if (new Set(runs.map((q) => key(q, true))).size > 1) m6[1]++;
  const fate = (body) => {
    const m = new Map();
    for (const r of [...body.local, ...(body.local_farther ?? [])]) m.set(r.retailer.domain, 'shown');
    for (const d of body.dropped.filter((x) => x.kind === 'local')) if (!m.has(d.domain)) m.set(d.domain, d.reason);
    return m;
  };
  const fa = fate(a), fb = fate(b);
  for (const [d, x] of fa) {
    if (!fb.has(d)) continue;
    both++;
    const y = fb.get(d);
    const judged = (r) => r === 'sells_product' || r === 'site_type';
    if ((x === 'shown' && judged(y)) || (y === 'shown' && judged(x))) { flips++; flipIds.push(`${id}:${d}:${x}->${y}`); }
  }
  const addr = (body) => new Set([...body.local, ...(body.local_farther ?? [])].map((r) => `${r.retailer.domain}|${(r.address ?? '').toLowerCase().split(',')[0]}`));
  addrJ.push(jac(addr(a), addr(b)));
}
const mean = (xs) => +(xs.filter((x) => x !== null).reduce((s, x) => s + x, 0) / xs.filter((x) => x !== null).length).toFixed(2);
console.log(JSON.stringify({
  eval_runs_wording_differs: { raw: e1[0], after_store_shop_canon: e1[1] },
  six_normalize_runs_unstable: { raw: m6[0], after_store_shop_canon: m6[1] },
  judgment_flips: { domains_in_both_runs: both, shown_vs_judged_out: flips, examples: flipIds },
  shown_overlap_domain_address: mean(addrJ),
}, null, 1));
