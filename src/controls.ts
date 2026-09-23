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

// Array.prototype.sort is stable, so equal keys keep their input order.
export function sortResults(results: readonly SearchResult[], key: SortKey): SearchResult[] {
  return [...results].sort(comparators[key]);
}

export function filterResults(results: readonly SearchResult[], filters: Filters): SearchResult[] {
  return results.filter(
    (r) =>
      (r.kind === 'local' ? filters.near : filters.online) &&
      (!filters.certifiedOnly || r.certifications.length > 0),
  );
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
