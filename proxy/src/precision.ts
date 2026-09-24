import type { Candidate, Classification } from './contract';

// Every word here matched at least one page graded "no" in tests/fixtures/quality/graded-pilot.json;
// add one only with new graded evidence, since a false match hides a real shop.
const EDITORIAL_SEGMENTS: ReadonlySet<string> = new Set([
  'blog', 'blogs', 'news', 'post', 'posts', 'story', 'article', 'articles', 'features',
  'expert-advice', 'longform', 'how-to', 'shopping-guide',
]);
const SHOP_SEGMENTS: ReadonlySet<string> = new Set(['collections', 'product', 'products', 'shop', 'store', 'stores']);
const BEST_SLUG = /(^|[-_.])best([-_.]|$)/;

// A shop segment wins over any editorial one, so a shop's "best sellers" collection is never
// flagged. A homepage is never flagged: too little in the URL to judge it.
export function isEditorialUrl(url: string): boolean {
  let path: string;
  try {
    path = new URL(url).pathname.toLowerCase();
  } catch {
    return false;
  }
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0 || segments.some((s) => SHOP_SEGMENTS.has(s))) return false;
  return segments.some((s) => EDITORIAL_SEGMENTS.has(s) || BEST_SLUG.test(s));
}

// Local candidates are never flagged: a place URL is a store page, not an article.
export function splitEditorial(candidates: Candidate[]): { shops: Candidate[]; editorial: Candidate[] } {
  const shops: Candidate[] = [];
  const editorial: Candidate[] = [];
  for (const c of candidates) (c.kind === 'online' && isEditorialUrl(c.url) ? editorial : shops).push(c);
  return { shops, editorial };
}

export type DropReason = 'site_type' | 'sells_product';
const DROPPED_SITE_TYPES: ReadonlySet<string> = new Set(['editorial', 'service', 'manufacturer_no_cart']);

// No classification means keep: a wrong drop is invisible to shoppers and graders,
// while a wrong keep is visible and can be graded.
export function dropReason(c: Classification | null): DropReason | null {
  if (!c) return null;
  if (DROPPED_SITE_TYPES.has(c.site_type)) return 'site_type';
  if (c.sells_product === 'no') return 'sells_product';
  return null;
}
