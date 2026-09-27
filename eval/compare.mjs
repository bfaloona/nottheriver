// Compares two saved runs of the same eval: whether the model's normalize wording (online_queries/
// local_queries, the search terms the Worker sends Brave) drifted per search (proxy/src/normalize-
// cache.ts caches that reading for 30 days; once an entry expires, a rerun can get fresh wording
// with no code change to blame) and, for local results, how much the shown shops moved. Extends
// docs/evidence/quality/eval20-0925/method/run2-compare.mjs (kept as evidence) to also watch
// online_queries, and to take any two response directories instead of one fixed pair.
//   node eval/compare.mjs <runA responses dir> <runB responses dir>
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

/** @param {string} path @param {unknown} [fallback] */
function readJson(path, fallback) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (err) {
    if (fallback !== undefined && /** @type {NodeJS.ErrnoException} */ (err).code === 'ENOENT') return fallback;
    throw err;
  }
}

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
/** @param {any} b @param {'local_queries'|'online_queries'} section */
const qkey = (b, section) => JSON.stringify([...b.query[section]].sort());
/** @param {any} b */
const top3 = (b) => (b.local ?? []).slice(0, 3).map((/** @type {any} */ r) => r.retailer.domain).join(',');

/**
 * One search's comparison between run A and run B. `same_queries` stays local-only (and keeps the
 * name run2-compare.mjs used) so the headline number is comparable across both scripts;
 * `same_online_queries` is the new online-side check. The shown/dropped metrics (jaccard, top3,
 * sells_flips) are local-only in both scripts: online results carry no distance or "farther away"
 * grouping to compare.
 * @param {string} id @param {any} a @param {any} b
 */
export function compareRow(id, a, b) {
  const sa = shown(a), sb = shown(b);
  return {
    id,
    same_queries: qkey(a, 'local_queries') === qkey(b, 'local_queries'),
    same_online_queries: qkey(a, 'online_queries') === qkey(b, 'online_queries'),
    returned_jaccard: jac(returned(a), returned(b)),
    shown_jaccard: jac(sa, sb),
    same_nearby_top3: top3(a) === top3(b),
    only_run1: [...sa].filter((d) => !sb.has(d)),
    only_run2: [...sb].filter((d) => !sa.has(d)),
    // Same measure as variation-0925: of the shops Brave returned in both runs, shown in one and judged out in the other.
    returned_both: [...returned(a)].filter((d) => returned(b).has(d)).length,
    sells_flips: [...returned(a)].filter((d) => returned(b).has(d) && (sa.has(d) !== sb.has(d)) && [a, b].some((x) => sellsDrop(x).has(d))),
  };
}

/** @param {(number|null)[]} xs */
const mean = (xs) => {
  const v = /** @type {number[]} */ (xs.filter((x) => x !== null));
  return v.length ? +(v.reduce((s, x) => s + x, 0) / v.length).toFixed(2) : null;
};

/** @param {ReturnType<typeof compareRow>[]} rows */
export function summarize(rows) {
  return {
    compared: rows.length,
    same_queries: rows.filter((r) => r.same_queries).length,
    same_online_queries: rows.filter((r) => r.same_online_queries).length,
    mean_returned_jaccard: mean(rows.map((r) => r.returned_jaccard)),
    mean_shown_jaccard: mean(rows.map((r) => r.shown_jaccard)),
    same_nearby_top3: rows.filter((r) => r.same_nearby_top3).length,
    shown_only_run1: rows.reduce((s, r) => s + r.only_run1.length, 0),
    shown_only_run2: rows.reduce((s, r) => s + r.only_run2.length, 0),
    returned_both: rows.reduce((s, r) => s + r.returned_both, 0),
    sells_flips: rows.reduce((s, r) => s + r.sells_flips.length, 0),
    rows,
  };
}

/** A one-line flag for a search whose wording changed, or null when both sections matched. @param {any} a @param {any} b @param {ReturnType<typeof compareRow>} row */
export function changeNote(a, b, row) {
  const parts = [];
  if (!row.same_queries) parts.push(`local ${qkey(a, 'local_queries')} -> ${qkey(b, 'local_queries')}`);
  if (!row.same_online_queries) parts.push(`online ${qkey(a, 'online_queries')} -> ${qkey(b, 'online_queries')}`);
  return parts.length ? `${row.id}: wording changed (${parts.join('; ')})` : null;
}

function main() {
  const [dirA, dirB] = process.argv.slice(2);
  if (!dirA || !dirB) {
    console.error('Usage: node eval/compare.mjs <runA responses dir> <runB responses dir>');
    process.exit(1);
  }
  const { queries } = readJson('eval/queries.json');
  const rows = [];
  for (const { id } of queries) {
    const a = readJson(`${dirA}/${id}.json`, null);
    const b = readJson(`${dirB}/${id}.json`, null);
    // Skip ids either run didn't save, or saved as a failed search (no body.query to compare).
    if (a?.status !== 200 || b?.status !== 200) continue;
    const row = compareRow(id, a.body, b.body);
    rows.push(row);
    const note = changeNote(a.body, b.body, row);
    if (note) console.error(note);
  }
  const summary = summarize(rows);
  const changedLocal = rows.length - summary.same_queries;
  const changedOnline = rows.length - summary.same_online_queries;
  const changedEither = rows.filter((r) => !r.same_queries || !r.same_online_queries).length;
  console.error(`${changedEither} of ${rows.length} searches changed wording (${changedLocal} local, ${changedOnline} online)`);
  console.log(JSON.stringify(summary, null, 1));
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
