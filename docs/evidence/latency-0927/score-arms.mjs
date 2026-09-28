// Scores stage-timing.ts EVAL=1 runs against the eval20-0925 hand grades, without new grading:
// recall against the confirmed baseline, and how the shown results split among graded "sells it",
// graded "doesn't", and never graded. A result is matched to a grade by exact URL within the search.
//   node docs/evidence/latency-0927/score-arms.mjs <dir holding <arm>-r<round>/responses>
import { readFileSync, readdirSync } from 'node:fs';
import { recall, sectionResults } from '../../../eval/summarize.mjs';

const root = process.argv[2];
if (!root) throw new Error('usage: score-arms.mjs <dir>');
const grades = JSON.parse(readFileSync('docs/evidence/quality/eval20-0925/grades.json', 'utf8'));
/** @type {Map<string, string>} */
const verdict = new Map(grades.grades.map((/** @type {any} */ g) => [`${g.search_id} ${g.url}`, g.sells_product]));

/** @param {number[]} xs @param {number} q */
const pct = (xs, q) => [...xs].sort((a, b) => a - b)[Math.floor(q * (xs.length - 1))];

const rows = [];
for (const arm of readdirSync(root).filter((d) => /-r\d+$/.test(d)).sort()) {
  const dir = `${root}/${arm}/responses`;
  const saved = readdirSync(dir).map((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')));
  const byId = new Map(saved.map((s) => [s.id, s]));
  const ids = new Set(byId.keys());
  const baseline = grades.baseline.filter((/** @type {any} */ b) => ids.has(b.search_id));
  /** @param {string} id @param {string} section */
  const resultsFor = (id, section) => {
    const s = byId.get(id);
    return s?.status === 200 ? sectionResults(s.body, section) : [];
  };
  const shown = { yes: 0, no: 0, ungraded: 0 };
  for (const s of saved.filter((x) => x.status === 200)) {
    for (const r of [...sectionResults(s.body, 'local'), ...s.body.online]) {
      const v = verdict.get(`${s.id} ${r.retailer.url}`);
      if (v === 'yes' || v === 'equivalent') shown.yes++;
      else if (v === 'no') shown.no++;
      else shown.ungraded++;
    }
  }
  const ms = saved.map((s) => s.elapsed_ms);
  const rec = (/** @type {string} */ section) => recall(baseline.filter((/** @type {any} */ b) => b.section === section), resultsFor);
  rows.push({
    arm,
    searches: saved.length,
    failed: saved.filter((s) => s.status !== 200).length,
    p50_s: Math.round(pct(ms, 0.5) / 100) / 10,
    p90_s: Math.round(pct(ms, 0.9) / 100) / 10,
    recall_online: rec('online').recall,
    recall_local: rec('local').recall,
    shown_graded_yes: shown.yes,
    shown_graded_no: shown.no,
    shown_ungraded: shown.ungraded,
  });
}
console.table(rows);
