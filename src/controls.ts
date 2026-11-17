import type { SearchResult } from '../proxy/src/contract';

export type SortKey = 'score' | 'distance' | 'name';
export interface Filters { near: boolean; online: boolean; certifiedOnly: boolean }
export interface View extends Filters { sort: SortKey }

export const defaultView: View = { sort: 'score', near: true, online: true, certifiedOnly: false };

type Compare = (a: SearchResult, b: SearchResult) => number;

const byName: Compare = (a, b) => a.retailer.name.localeCompare(b.retailer.name, 'en', { sensitivity: 'base' });

const comparators: Record<SortKey, Compare> = {
  // Rank comes from the Worker and is never recomputed, so "Why this rank" always matches.
  score: (a, b) => a.rank - b.rank,
  name: byName,
  distance: (a, b) => {
    if (a.distance_km === b.distance_km) return byName(a, b);
    if (a.distance_km === null) return 1;
    if (b.distance_km === null) return -1;
    return a.distance_km - b.distance_km;
  },
};

const isCertified = (r: SearchResult) => r.certifications.length > 0;

// Array.prototype.sort is stable, so equal keys keep their input order.
export function sortResults(results: readonly SearchResult[], key: SortKey): SearchResult[] {
  return [...results].sort(comparators[key]);
}

export function filterResults(results: readonly SearchResult[], filters: Filters): SearchResult[] {
  return results.filter(
    (r) =>
      (r.kind === 'local' ? filters.near : filters.online) &&
      (!filters.certifiedOnly || isCertified(r)),
  );
}

// The number is what checking the box would leave on screen, so it follows the sections
// switched on and comes from the filter itself.
export function showCertifiedCount(
  root: ParentNode,
  results: readonly SearchResult[],
  sections: Pick<Filters, 'near' | 'online'>,
  newSearch = false,
): void {
  const count = filterResults(results, { ...sections, certifiedOnly: true }).length;
  const box = root.querySelector<HTMLInputElement>('#certified-only')!;
  root.querySelector('[data-certified-count]')!.textContent = `(${count})`;
  // Left checked from an earlier search, the box would hide every result of this one.
  if (newSearch && count === 0) box.checked = false;
  // A checked box stays enabled at 0: switching a section off must not trap the visitor
  // behind their own filter, or quietly take it off.
  box.disabled = count === 0 && !box.checked;
}

// Wires the native controls; returns a reader for the current view.
export function bindControls(root: ParentNode, onChange: (view: View) => void): () => View {
  const sort = root.querySelector<HTMLSelectElement>('#sort')!;
  const box = (id: string) => root.querySelector<HTMLInputElement>(id)!;
  const near = box('#show-near');
  const online = box('#show-online');
  const certifiedOnly = box('#certified-only');
  const read = (): View => ({
    sort: sort.value as SortKey,
    near: near.checked,
    online: online.checked,
    certifiedOnly: certifiedOnly.checked,
  });
  for (const el of [sort, near, online, certifiedOnly]) el.addEventListener('change', () => onChange(read()));
  return read;
}
