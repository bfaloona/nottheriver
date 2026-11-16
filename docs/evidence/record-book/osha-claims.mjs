// Joins a saved OSHA inspection query and its violations (both written by
// research/fetch-osha-dol.mjs) into one line per inspection with a penalty, for the claim sheet.
//   node docs/evidence/record-book/osha-claims.mjs <inspections.json> <violations.json> [from] [to] [threshold]
// Prints a tab-separated table to stdout and counts to stderr. Dates default to the pilot window.
import { readFileSync } from 'node:fs';
import { summarizeInspection } from '../../../research/fetch-osha-dol.mjs';

/**
 * @typedef {{activity_nr: number|string, estab_name: string, site_address?: string, site_city?: string, site_state?: string, reporting_id?: string, open_date?: string, close_case_date?: string|null}} Inspection
 * @typedef {{activity_nr: number|string, delete_flag?: string|null, current_penalty?: string|number|null, issuance_date?: string|null, contest_date?: string|null, final_order_date?: string|null}} Violation
 */

const day = (/** @type {string|null|undefined} */ d) => (d ? d.slice(0, 10) : '');
const [inspFile, violFile, from = '2021-11-15', to = '2026-11-15', threshold = '100000'] = process.argv.slice(2);
/** @type {Inspection[]} */
const inspections = JSON.parse(readFileSync(inspFile, 'utf8')).rows;
/** @type {Violation[]} */
const violations = JSON.parse(readFileSync(violFile, 'utf8')).rows;
/** @type {Record<string, Violation[]>} */
const byNr = {};
for (const v of violations) (byNr[String(v.activity_nr)] ??= []).push(v);
const cols = ['activity_nr', 'estab_name', 'site_address', 'site_city', 'site_state', 'reporting_id', 'open_date', 'close_case_date', 'issued', 'action_date', 'current_penalty', 'final', 'contested_ever', 'in_window', 'meets_rule'];
console.log(cols.join('\t'));
let cited = 0;
let withPenalty = 0;
let inWindow = 0;
for (const insp of inspections) {
  const s = summarizeInspection(insp, byNr[String(insp.activity_nr)] ?? []);
  if (s.violations > 0) cited++;
  if (s.current <= 0) continue;
  withPenalty++;
  const within = s.actionDate >= from && s.actionDate <= to;
  if (within) inWindow++;
  const meets = within && s.final && s.current >= Number(threshold);
  console.log([insp.activity_nr, insp.estab_name, insp.site_address ?? '', insp.site_city ?? '', insp.site_state ?? '', insp.reporting_id ?? '', day(insp.open_date), day(insp.close_case_date), s.issued, s.actionDate, s.current, s.final ? 'yes' : 'no', s.anyContest ? 'yes' : 'no', within ? 'yes' : 'no', meets ? 'yes' : 'no'].join('\t'));
}
console.error(`${inspections.length} inspections; ${cited} with live violations; ${withPenalty} with a current penalty above 0; ${inWindow} of those dated in ${from}..${to}`);
