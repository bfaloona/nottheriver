// Run from the repo root after grading: node docs/evidence/quality/eval20-0925/method/merge.mjs [run2]. Writes grades.json in eval20-0925 (or eval20-0925/run2)
// (reused + new grades, eval60 recall baseline unchanged) and prints the extra measures:
// good shops in each search's nearby top 3, and rows shown without a model judgment.
import { readFileSync, writeFileSync } from 'node:fs';

const HERE = new URL('.', import.meta.url).pathname;
const RUN2 = process.argv[2] === 'run2';
const DIR = RUN2 ? 'docs/evidence/quality/eval20-0925/run2' : 'docs/evidence/quality/eval20-0925';
const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
const ids = read(`${HERE}/ids.json`).ids;

const grades = RUN2
  ? [...read(`${HERE}/reused-grades-run2.json`).grades, ...read(`${HERE}/grades-new-run2.json`).grades]
  : [...read(`${HERE}/reused-grades.json`).grades, ...read(`${HERE}/grades-new-online.json`).grades, ...read(`${HERE}/grades-new-local.json`).grades];
// The operator's own-browser checks of rows the graders were blocked on replace those fields.
// Run 2 reuses run 1's grades with its checks already applied, so it reads only its own file.
const checks = new Map(read(`${HERE}/operator-checks${RUN2 ? '-run2' : ''}.json`).checks.map((c) => [`${c.search_id}|${c.result_id}`, c]));
for (const [i, g] of grades.entries()) {
  const c = checks.get(`${g.search_id}|${g.result_id}`);
  if (c) grades[i] = { ...g, ...c, notes: `${c.notes} Grader: ${g.notes}` };
}
const baseline = read('docs/evidence/quality/eval60/grades.json').baseline.filter((b) => ids.includes(b.search_id));

// Every shown row has exactly one grade.
const shown = ids.flatMap((id) => {
  const b = read(`${DIR}/responses/${id}.json`).body;
  return [...b.online, ...b.local, ...(b.local_farther ?? [])].map((r) => `${id}|${r.id}`);
});
const graded = new Map();
for (const g of grades) graded.set(`${g.search_id}|${g.result_id}`, (graded.get(`${g.search_id}|${g.result_id}`) ?? 0) + 1);
const missing = shown.filter((k) => !graded.has(k));
const dupes = [...graded].filter(([, n]) => n > 1).map(([k]) => k);
if (missing.length || dupes.length) {
  console.error({ missing, dupes });
  process.exit(1);
}
writeFileSync(`${DIR}/grades.json`, JSON.stringify({ grades, baseline }, null, 1) + '\n');

const verdict = (g) => (g.sells_product === 'unknown' || g.local_exists === 'unknown' ? 'unknown' : g.sells_product !== 'no' && g.local_exists === 'yes' ? 'good' : 'bad');
const byKey = new Map(grades.map((g) => [`${g.search_id}|${g.result_id}`, g]));
const top3 = { good: 0, bad: 0, unknown: 0 };
const farther = { good: 0, bad: 0, unknown: 0 };
const unclassified = { online: 0, local: 0 };
for (const id of ids) {
  const b = read(`${DIR}/responses/${id}.json`).body;
  for (const r of b.local.slice(0, 3)) top3[verdict(byKey.get(`${id}|${r.id}`))]++;
  for (const r of b.local_farther ?? []) farther[verdict(byKey.get(`${id}|${r.id}`))]++;
  unclassified.online += b.usage.unclassified_shown?.online ?? 0;
  unclassified.local += b.usage.unclassified_shown?.local ?? 0;
}
console.log({ rows: grades.length, baseline: baseline.length, nearby_top3: top3, farther, unclassified_shown: unclassified });
