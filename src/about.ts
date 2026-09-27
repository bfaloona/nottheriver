import { disputeUrl, repoUrl, siteName } from './config';
import quality from './quality.json';

// A figure is a fraction in [0, 1]; a [low, high] pair when two graded runs of the same eval rounded
// to different percentages (an eval now runs twice, operator ruling 2026-09-26).
export type Figure = number | [number, number];

// null until an evaluation has run.
export interface QualityMeasure {
  date: string; // YYYY-MM-DD
  searches: number; // searches graded; a run may grade a sample of those it made
  runs: number; // how many graded runs this headline draws from (usually 2, operator ruling 2026-09-26)
  precision: { online: Figure; local: Figure };
  recall: { online: Figure; local: Figure };
  evidence: string; // this run's evidence folder, e.g. docs/evidence/quality/eval20-0925
}

const whole = (n: number) => Math.round(n * 100);
const fig = (f: Figure) => (Array.isArray(f) ? `${whole(f[0])} to ${whole(f[1])}%` : `${whole(f)}%`);

export function precisionText(measured: QualityMeasure | null): string {
  if (!measured) return 'Not yet measured.';
  const { date, searches, runs } = measured;
  const { online, local } = measured.precision;
  const runsClause = runs > 1 ? `, each run ${runs === 2 ? 'twice' : `${runs} times`}` : '';
  return (
    `Checked ${date} on ${searches} graded searches${runsClause}. Online, ${fig(online)} of results sold the product or a close ` +
    `equivalent; nearby, ${fig(local)} did (a figure that mixes two graders' answers).`
  );
}

export function recallText(measured: QualityMeasure | null): string {
  if (!measured) return '';
  const { online, local } = measured.recall;
  return `This site found ${fig(online)} of the good online shops and ${fig(local)} of the good local shops that the independent search found.`;
}

document.title = `About ${siteName}`;
for (const el of document.querySelectorAll('[data-site-name]')) el.textContent = siteName;

const measured = (quality as { measured: QualityMeasure | null }).measured;

const quote = document.querySelector('[data-quality]');
if (quote) quote.textContent = precisionText(measured);
const recallEl = document.querySelector<HTMLElement>('[data-quality-recall]');
if (recallEl) {
  recallEl.textContent = recallText(measured);
  recallEl.hidden = !measured;
}
// The HTML points at the index of all runs; once measured, point at that run's own folder instead.
const evidenceLink = document.querySelector<HTMLAnchorElement>('[data-evidence-link]');
if (evidenceLink && measured) evidenceLink.dataset.repoPath = `tree/main/${measured.evidence}`;

// Without a repo URL (dev, e2e) doc references stay plain text and repo-only sentences stay hidden.
if (repoUrl) {
  for (const a of document.querySelectorAll<HTMLAnchorElement>('a[data-repo-path]')) {
    a.href = a.dataset.repoPath ? `${repoUrl}/${a.dataset.repoPath}` : repoUrl;
    a.rel = 'noopener noreferrer';
  }
  for (const a of document.querySelectorAll<HTMLAnchorElement>('a[data-dispute-link]')) {
    a.href = disputeUrl;
    a.rel = 'noopener noreferrer';
  }
  for (const el of document.querySelectorAll<HTMLElement>('[data-needs-repo]')) el.hidden = false;
}
