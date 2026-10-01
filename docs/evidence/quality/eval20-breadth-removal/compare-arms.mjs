// Run from the repo root: node docs/evidence/quality/eval20-breadth-removal/compare-arms.mjs
// Compares the Worker before and after the store_breadth removal on the 20 graded searches. Both arms ran
// on identical inputs (same normalize reading, same Brave replies; see stage-timing.ts SHARED_CACHE and
// REPLAY_BRAVE), so every difference is the prompt change and the model's answers to it.
// Prints: shops shown by only one arm with the graded verdict of each, and how many shops shown by both
// arms changed relevance (yes 1.0 / maybe 0.5).
import { existsSync, readFileSync } from 'node:fs';
import { precision, sectionResults } from '../../../../eval/summarize.mjs';

const Q = 'docs/evidence/quality';
const RUN = `${Q}/eval20-breadth-removal`;
const BEFORE = 'alt-before';
const AFTER = 'default';
/** @param {string} p */
const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
/** @type {string[]} */
const ids = read(`${Q}/eval20-store-types/method/ids.json`).ids;
/** @param {string} id @param {string} kind @param {string} url @param {string | undefined} address */
const key = (id, kind, url, address) => (kind === 'online' ? `${id}|online|${url}` : `${id}|local|${url}|${address ?? ''}`);

/** Grades from the two store-types runs, joined to their rows for the address. @type {Map<string, any>} */
const pool = new Map();
for (const dir of [`${Q}/eval20-store-types`, `${Q}/eval20-store-types/run2`]) {
  /** @type {Map<string, any>} */
  const rows = new Map();
  for (const id of ids) for (const r of [...read(`${dir}/responses/${id}.json`).body.online, ...read(`${dir}/responses/${id}.json`).body.local]) rows.set(`${id}|${r.id}`, r);
  for (const g of read(`${dir}/grades.json`).grades) {
    const r = rows.get(`${g.search_id}|${g.result_id}`);
    if (r) pool.set(key(g.search_id, g.kind, g.url, r.address), g);
  }
}
// Grades made for this comparison (rows the earlier runs never showed or never graded).
for (const g of [...read(`${RUN}/grading/reused-grades.json`).rows ?? [], ...(existsSync(`${RUN}/grading/grades-a.json`) ? read(`${RUN}/grading/grades-a.json`) : [])]) {
  pool.set(key(g.search_id, 'local', g.url, g.address), g);
}

/** @param {any} r */
const relevanceOf = (r) => r.components.find((/** @type {any} */ c) => c.name === 'relevance')?.value;
/** @type {any[]} */
const shifted = [];
const out = { only_before: /** @type {string[]} */ ([]), only_after: /** @type {string[]} */ ([]), relevance_changed: 0, shown_in_both: 0, yes_to_maybe: 0, maybe_to_yes: 0 };
/** @type {any[]} */
const graded = [];
for (const id of ids) {
  const before = read(`${RUN}/${BEFORE}-r1/responses/${id}.json`).body;
  const after = read(`${RUN}/${AFTER}-r1/responses/${id}.json`).body;
  for (const kind of /** @type {const} */ (['local', 'online'])) {
    /** @param {any} b */
    const byKey = (b) => new Map(sectionResults(b, kind).map((/** @type {any} */ r) => [key(id, kind, r.retailer.url, r.address), r]));
    const a = byKey(before), b = byKey(after);
    for (const [k, r] of a) {
      if (b.has(k)) {
        if (kind === 'local') {
          out.shown_in_both++;
          const x = relevanceOf(r), y = relevanceOf(b.get(k));
          if (x !== y) {
            out.relevance_changed++;
            if (x > y) out.yes_to_maybe++; else out.maybe_to_yes++;
            const g = pool.get(k);
            shifted.push({ search: id, shop: r.retailer.name, direction: x > y ? 'yes_to_maybe' : 'maybe_to_yes', grade: g });
          }
        }
        continue;
      }
      const g = pool.get(k);
      out.only_before.push(`${id} ${kind} ${r.retailer.name}: ${g ? `sells ${g.sells_product}, exists ${g.local_exists}` : 'not graded'}`);
      if (g) graded.push({ ...g, side: 'before' });
    }
    for (const [k, r] of b) {
      if (a.has(k)) continue;
      const g = pool.get(k);
      out.only_after.push(`${id} ${kind} ${r.retailer.name}: ${g ? `sells ${g.sells_product}, exists ${g.local_exists}` : 'not graded'}`);
      if (g) graded.push({ ...g, side: 'after' });
    }
  }
}
console.log(JSON.stringify({
  ...out,
  shifted_rows: shifted.map((x) => `${x.search} ${x.shop} ${x.direction}: ${x.grade ? `sells ${x.grade.sells_product}, exists ${x.grade.local_exists}` : 'not graded'}`),
  precision_of_shifted_rows: precision(shifted.flatMap((x) => (x.grade ? [x.grade] : []))),
  precision_of_rows_only_before: precision(graded.filter((g) => g.side === 'before')),
  precision_of_rows_only_after: precision(graded.filter((g) => g.side === 'after')),
}, null, 2));
