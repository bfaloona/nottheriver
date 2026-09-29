// Run from the repo root: node docs/evidence/quality/eval20-store-types/method/breadth-measures.mjs > docs/evidence/quality/eval20-store-types/breadth-measures.json
// M5 (docs/plans/store-types.md Phase 4): the model's store_breadth against the grader's, on shown local rows.
// M6: good rate of local rows by the model's yes/maybe judgment and by breadth, per run and pooled.
// Good/bad/unknown follow eval/summarize.mjs precision(): unknown on either question is left out of the rate.
import { readFileSync } from 'node:fs';

const BASE = 'docs/evidence/quality/eval20-store-types';
const RUNS = [BASE, `${BASE}/run2`];
/** @param {string} p */
const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
/** @type {string[]} */
const ids = read(`${BASE}/method/ids.json`).ids;

/** @param {any} g @returns {'good' | 'bad' | 'unknown'} */
const verdict = (g) => {
  if (g.local_exists === 'no') return 'bad';
  if (g.sells_product === 'unknown' || g.local_exists === 'unknown') return 'unknown';
  return g.sells_product !== 'no' && g.local_exists === 'yes' ? 'good' : 'bad';
};
/** @param {any} r @returns {'yes' | 'maybe' | 'text'} */
const judged = (r) => {
  const label = r.components.find((/** @type {any} */ c) => c.name === 'relevance')?.sources?.[0]?.label ?? '';
  return label.startsWith('Model judgment: likely') ? 'yes' : label.startsWith('Model judgment: may') ? 'maybe' : 'text';
};
/** The merge (merge.mjs) records why a grader answered unknown as a marker in the grade's notes. @param {string} notes */
const unknownKind = (notes) => notes.match(/\[store_breadth unknown kind: (\w+)\]/)?.[1] ?? 'unclassified';
/** @param {number} n @param {number} d */
const ratio = (n, d) => (d > 0 ? Math.round((n / d) * 1000) / 1000 : null);

/** @typedef {{ run: string, key: string, model: string, grader: string, graderKind: string, verdict: 'good' | 'bad' | 'unknown', judged: 'yes' | 'maybe' | 'text' }} Row */
/** @type {Row[]} */
const rows = [];
for (const dir of RUNS) {
  const run = dir === BASE ? 'run1' : 'run2';
  const grades = new Map(read(`${dir}/grades.json`).grades.map((/** @type {any} */ g) => [`${g.search_id}|${g.result_id}`, g]));
  for (const id of ids) {
    const b = read(`${dir}/responses/${id}.json`).body;
    for (const r of [...b.local, ...(b.local_farther ?? [])]) {
      const g = grades.get(`${id}|${r.id}`);
      rows.push({ run, key: `${id}|${r.retailer.url}|${r.address ?? ''}`, model: r.store_breadth ?? 'missing', grader: g.store_breadth ?? 'missing', graderKind: g.store_breadth === 'unknown' ? unknownKind(g.notes) : g.store_breadth, verdict: verdict(g), judged: judged(r) });
    }
  }
}

/** M5 on a set of rows: a confusion table plus agreement where both labels are specialist or general. @param {Row[]} set */
function m5(set) {
  /** @type {Record<string, number>} */
  const matrix = {};
  for (const r of set) matrix[`model ${r.model} / grader ${r.grader}`] = (matrix[`model ${r.model} / grader ${r.grader}`] ?? 0) + 1;
  const both = set.filter((r) => ['specialist', 'general'].includes(r.model) && ['specialist', 'general'].includes(r.grader));
  // What Phase 3b would use: is the shop a specialist for this product or not. Shops the grader found off-category count as not specialist; other unknowns are left out.
  const binaryRows = set.filter((r) => ['specialist', 'general', 'off_category'].includes(r.graderKind));
  const modelSpecialist = (/** @type {Row} */ r) => r.model === 'specialist';
  const graderSpecialist = (/** @type {Row} */ r) => r.grader === 'specialist';
  return {
    rows: set.length,
    rows_with_both_labels_known: both.length,
    agree: both.filter((r) => r.model === r.grader).length,
    agreement: ratio(both.filter((r) => r.model === r.grader).length, both.length),
    model_general_on_grader_specialist: both.filter((r) => r.model === 'general' && r.grader === 'specialist').length,
    model_specialist_on_grader_general: both.filter((r) => r.model === 'specialist' && r.grader === 'general').length,
    model_unknown_or_missing: set.filter((r) => !['specialist', 'general'].includes(r.model)).length,
    grader_unknown: set.filter((r) => r.grader === 'unknown').length,
    grader_unknown_by_kind: Object.fromEntries(['off_category', 'not_a_retailer', 'unresolved', 'unclassified'].map((k) => [k, set.filter((r) => r.grader === 'unknown' && r.graderKind === k).length])),
    specialist_or_not: {
      rows: binaryRows.length,
      agree: binaryRows.filter((r) => modelSpecialist(r) === graderSpecialist(r)).length,
      agreement: ratio(binaryRows.filter((r) => modelSpecialist(r) === graderSpecialist(r)).length, binaryRows.length),
      model_specialist_grader_not: binaryRows.filter((r) => modelSpecialist(r) && !graderSpecialist(r)).length,
      grader_specialist_model_not: binaryRows.filter((r) => !modelSpecialist(r) && graderSpecialist(r)).length,
    },
    matrix,
  };
}

/** M6 on a set of rows: good rate per (judgment, breadth label), by the model's label and by the grader's. @param {Row[]} set */
function m6(set) {
  /** @param {'model' | 'grader'} by */
  const table = (by) => {
    /** @type {Record<string, { rows: number, good: number, bad: number, unknown: number, good_rate: number | null }>} */
    const out = {};
    for (const r of set) {
      const cell = (out[`${r.judged} / ${by} ${r[by]}`] ??= { rows: 0, good: 0, bad: 0, unknown: 0, good_rate: null });
      cell.rows++;
      cell[r.verdict]++;
      cell.good_rate = ratio(cell.good, cell.good + cell.bad);
    }
    return Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
  };
  return { by_model_label: table('model'), by_grader_label: table('grader') };
}

/** @param {Row[]} set */
const unique = (set) => [...new Map(set.map((r) => [r.key, r])).values()];
const run1 = rows.filter((r) => r.run === 'run1');
const run2 = rows.filter((r) => r.run === 'run2');
console.log(JSON.stringify({
  m5: { run1: m5(run1), run2: m5(run2), unique_shops_both_runs: m5(unique(rows)) },
  m6: { run1: m6(run1), run2: m6(run2), both_runs_rows: m6(rows) },
}, null, 2));
