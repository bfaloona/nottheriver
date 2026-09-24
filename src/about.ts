import { disputeUrl, repoUrl, siteName } from './config';
import quality from './quality.json';

// Fractions in [0, 1] from the latest evaluation run; null until one has run.
export interface QualityMeasure {
  date: string; // YYYY-MM-DD
  searches: number; // searches graded; a run may grade a sample of those it made
  precision: { online: number; local: number };
  recall: { online: number; local: number };
}

const pct = (n: number) => `${Math.round(n * 100)}%`;

export function coverageText(measured: QualityMeasure | null): string {
  if (!measured) return 'Not yet measured.';
  const { date, searches, precision, recall } = measured;
  return (
    `Last measured ${date} across ${searches} graded searches: ${pct(precision.online)} of online results and ${pct(precision.local)} of local ` +
    `results sold the product or a close equivalent. This site found ${pct(recall.online)} of the good online ` +
    `shops and ${pct(recall.local)} of the good local shops that the independent search found.`
  );
}

document.title = `About ${siteName}`;
for (const el of document.querySelectorAll('[data-site-name]')) el.textContent = siteName;

const quote = document.querySelector('[data-quality]');
if (quote) quote.textContent = coverageText((quality as { measured: QualityMeasure | null }).measured);

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
