// Run 1 (eval20-0925) vs run 2 (eval20-0925/run2, about an hour later) through the live Worker.
// With the normalize cache, both runs should send Brave the same local queries, so what differs
// is Brave's own change plus anything downstream of it. Overlap is Jaccard on registrable domains.
// Run from the repo root: node docs/evidence/quality/eval20-0925/method/run2-compare.mjs > docs/evidence/quality/eval20-0925/run2-compare.json
import { readFileSync } from 'node:fs';

const DIR = 'docs/evidence/quality/eval20-0925';
/** @type {string[]} */
const ids = JSON.parse(readFileSync(`${DIR}/method/ids.json`, 'utf8')).ids;
/** @param {string} p */
const load = (p) => JSON.parse(readFileSync(p, 'utf8')).body;
/** @param {any} b */
const shownRows = (b) => [...(b.local ?? []), ...(b.local_farther ?? [])];
/** @param {any} b */
const shown = (b) => new Set(shownRows(b).map((r) => r.retailer.domain));
/** @param {any} b */
const returned = (b) => new Set([...shown(b), ...(b.dropped ?? []).filter((/** @type {any} */ d) => d.kind === 'local').map((/** @type {any} */ d) => d.domain)]);
/** @param {Set<string>} x @param {Set<string>} y */
const jac = (x, y) => {
  const u = new Set([...x, ...y]);
  return u.size ? [...x].filter((d) => y.has(d)).length / u.size : null;
};
/** @param {any} b */
const sellsDrop = (b) => new Set((b.dropped ?? []).filter((/** @type {any} */ d) => d.kind === 'local' && d.reason === 'sells_product').map((/** @type {any} */ d) => d.domain));
/** @param {any} b */
const qkey = (b) => JSON.stringify([...b.query.local_queries].sort());
/** @param {any} b */
const top3 = (b) => (b.local ?? []).slice(0, 3).map((/** @type {any} */ r) => r.retailer.domain).join(',');

const rows = ids.map((id) => {
  const a = load(`${DIR}/responses/${id}.json`), b = load(`${DIR}/run2/responses/${id}.json`);
  const sa = shown(a), sb = shown(b);
  return {
    id,
    same_queries: qkey(a) === qkey(b),
    returned_jaccard: jac(returned(a), returned(b)),
    shown_jaccard: jac(sa, sb),
    same_nearby_top3: top3(a) === top3(b),
    only_run1: [...sa].filter((d) => !sb.has(d)),
    only_run2: [...sb].filter((d) => !sa.has(d)),
    // Same measure as variation-0925: of the shops Brave returned in both runs, shown in one and judged out in the other.
    returned_both: [...returned(a)].filter((d) => returned(b).has(d)).length,
    sells_flips: [...returned(a)].filter((d) => returned(b).has(d) && (sa.has(d) !== sb.has(d)) && [a, b].some((x) => sellsDrop(x).has(d))),
  };
});
/** @param {(number|null)[]} xs */
const mean = (xs) => {
  const v = /** @type {number[]} */ (xs.filter((x) => x !== null));
  return v.length ? +(v.reduce((s, x) => s + x, 0) / v.length).toFixed(2) : null;
};
console.log(JSON.stringify({
  same_queries: rows.filter((r) => r.same_queries).length,
  mean_returned_jaccard: mean(rows.map((r) => r.returned_jaccard)),
  mean_shown_jaccard: mean(rows.map((r) => r.shown_jaccard)),
  same_nearby_top3: rows.filter((r) => r.same_nearby_top3).length,
  shown_only_run1: rows.reduce((s, r) => s + r.only_run1.length, 0),
  shown_only_run2: rows.reduce((s, r) => s + r.only_run2.length, 0),
  returned_both: rows.reduce((s, r) => s + r.returned_both, 0),
  sells_flips: rows.reduce((s, r) => s + r.sells_flips.length, 0),
  rows,
}, null, 1));
