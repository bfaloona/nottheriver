// Compares eval20-0925 (after "store" always and the normalize cache) with eval20-0924 and eval60.
// Checks the fix held: every zip of one product sent the same local queries, all ending in "store".
// Overlap is Jaccard on registrable domains, as in variation-0925/step1-compare.mjs.
// Run from the repo root: node docs/evidence/quality/eval20-0925/method/compare.mjs > docs/evidence/quality/eval20-0925/compare.json
import { readFileSync } from 'node:fs';

const DIR = 'docs/evidence/quality';
const ids = JSON.parse(readFileSync(`${DIR}/eval20-0924/method/ids.json`, 'utf8')).ids;
/** @param {string} run @param {string} id */
const load = (run, id) => JSON.parse(readFileSync(`${DIR}/${run}/responses/${id}.json`, 'utf8')).body;
/** @param {any} b */
const shown = (b) => new Set([...(b.local ?? []), ...(b.local_farther ?? [])].map((r) => r.retailer.domain));
/** @param {any} b */
const returned = (b) => new Set([...shown(b), ...(b.dropped ?? []).filter((/** @type {any} */ d) => d.kind === 'local').map((/** @type {any} */ d) => d.domain)]);
/** @param {Set<string>} x @param {Set<string>} y */
const jac = (x, y) => {
  const u = new Set([...x, ...y]);
  return u.size ? [...x].filter((d) => y.has(d)).length / u.size : null;
};
/** @param {any} b */
const qkey = (b) => JSON.stringify([...b.query.local_queries].map((q) => q.toLowerCase().trim()).sort());
const product = (/** @type {string} */ id) => id.replace(/-(urban|suburban|rural)$/, '');

const rows = ids.map((/** @type {string} */ id) => {
  const now = load('eval20-0925', id);
  /** @param {string} run */
  const vs = (run) => {
    const b = load(run, id);
    return { same_queries: qkey(b) === qkey(now), returned_jaccard: jac(returned(b), returned(now)), shown_jaccard: jac(shown(b), shown(now)) };
  };
  return {
    id,
    local_queries: now.query.local_queries,
    all_end_in_store: now.query.local_queries.every((/** @type {string} */ q) => /\bstore$/i.test(q.trim())),
    n_returned: returned(now).size,
    n_shown: shown(now).size,
    vs_0924: vs('eval20-0924'),
    vs_eval60: vs('eval60'),
  };
});

// Products with more than one graded zip: did all of them get the same wording?
/** @type {Map<string, Set<string>>} */
const wordings = new Map();
for (const r of rows) wordings.set(product(r.id), (wordings.get(product(r.id)) ?? new Set()).add(JSON.stringify([...r.local_queries].sort())));
const multiZip = [...wordings].filter(([p]) => rows.filter((r) => product(r.id) === p).length > 1);

/** @param {(number|null)[]} xs */
const mean = (xs) => {
  const v = /** @type {number[]} */ (xs.filter((x) => x !== null));
  return v.length ? +(v.reduce((s, x) => s + x, 0) / v.length).toFixed(2) : null;
};
/** @param {typeof rows} g @param {'vs_0924'|'vs_eval60'} k */
const group = (g, k) => ({ n: g.length, returned_jaccard: mean(g.map((r) => r[k].returned_jaccard)), shown_jaccard: mean(g.map((r) => r[k].shown_jaccard)) });
/** @param {'vs_0924'|'vs_eval60'} k */
const split = (k) => ({ same: group(rows.filter((r) => r[k].same_queries), k), differ: group(rows.filter((r) => !r[k].same_queries), k) });

console.log(JSON.stringify({
  all_end_in_store: rows.filter((r) => r.all_end_in_store).length,
  multi_zip_products: multiZip.map(([p, w]) => ({ product: p, wordings: w.size })),
  vs_0924: split('vs_0924'),
  vs_eval60: split('vs_eval60'),
  rows,
}, null, 1));
