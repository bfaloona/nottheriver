import list from '../../data/categories.draft.json';
import categoryTemplate from '../prompts/category';
import type { CategoryPick, KvStore } from './contract';
import { CATEGORY_MAX_TOKENS, type LlmClient } from './llm';
import { cacheProduct, hashedCacheKey, readCached, writeCached } from './normalize-cache';
import { renderTemplate } from './prompts';

/** The model's reply to the category call, before mapping. Any string validates. */
export interface CategoryReply { general: string; specific: string }

const names = new Map(list.general.flatMap((g) => [[g.id, g.name] as const, ...g.specific.map((s) => [s.id, s.name] as const)]));
export const generalIds: ReadonlySet<string> = new Set(list.general.map((g) => g.id));
export const parentOf: ReadonlyMap<string, string> = new Map(list.general.flatMap((g) => g.specific.map((s) => [s.id, g.id] as const)));
/** Every general and specific id. */
export const listIds: ReadonlySet<string> = new Set([...generalIds, ...parentOf.keys()]);
/** "none" and "not_a_product". */
export const reservedIds: ReadonlySet<string> = new Set(list.reserved.map((r) => r.id));
export const reasons: ReadonlySet<string> = new Set(list.reserved.flatMap((r) => r.reasons?.map((x) => x.id) ?? []));

// Ids only, so a renamed category or a changed store type ships without dropping the cache.
const listBlock = list.general.map((g) => (g.specific.length ? `${g.id}: ${g.specific.map((s) => s.id).join(', ')}` : g.id)).join('\n');

export function buildCategoryPrompt(input: { product: string }): string {
  return renderTemplate(categoryTemplate, { product: JSON.stringify(input.product), categories: listBlock });
}

export interface Mapped { general: string; specific: string | null; rule: string }
const tidy = (s: unknown) => (typeof s === 'string' ? s.toLowerCase().trim().replace(/[\s-]+/g, '_') : '');

// The reply is free text by design: a reply the schema refused twice would cost a second model
// call and still give nothing. Whatever is not on the list becomes "none" here
// (rules MAP-1 to MAP-7 of docs/plans/category-list.md).
export function mapPick(rawGeneral: unknown, rawSpecific: unknown): Mapped {
  const g = tidy(rawGeneral);
  const s = tidy(rawSpecific);
  if (g === 'not_a_product') return { general: g, specific: reasons.has(s) ? s : 'unclear', rule: 'MAP-6' };
  if (generalIds.has(g)) {
    if (parentOf.get(s) === g) return { general: g, specific: s, rule: 'MAP-2' };
    return { general: g, specific: null, rule: parentOf.has(s) ? 'MAP-4' : 'MAP-3' };
  }
  // A reply of "none" is a known value, not an unknown one, so MAP-5 does not rescue it.
  if (g !== 'none' && parentOf.has(s)) return { general: parentOf.get(s)!, specific: s, rule: 'MAP-5' };
  return { general: 'none', specific: null, rule: 'MAP-7' };
}

export const NO_PICK: CategoryPick = { general: 'none', specific: null };

// Only ids and display names from the list leave this function, never the model's own strings.
export function toPick(reply: { general?: unknown; specific?: unknown }): CategoryPick {
  const { general, specific } = mapPick(reply.general, reply.specific);
  const pick: CategoryPick = { general, specific };
  const generalName = names.get(general);
  const specificName = specific === null ? undefined : names.get(specific);
  if (generalName) pick.general_name = generalName;
  if (generalName && specificName) pick.specific_name = specificName;
  return pick;
}

export const categoryCacheKey = (product: string) => hashedCacheKey('category', buildCategoryPrompt({ product: cacheProduct(product) }));

// Never throws: the pick only labels a search, so a failed call or a failed cache gives "none"
// and the search runs as it does without a pick. A failure is not cached. The raw reply is
// cached, not the mapped pick, so an edit to the list's names applies to cached products.
export async function pickCategory(product: string, llm: LlmClient, cache: KvStore | undefined): Promise<CategoryPick> {
  try {
    const key = cache ? await categoryCacheKey(product) : null;
    const cached = cache && key ? await readCached(cache, key, 'category') : null;
    if (cached !== null) return toPick(cached as CategoryReply);
    const raw = await llm.complete<CategoryReply>('category', buildCategoryPrompt({ product }), CATEGORY_MAX_TOKENS);
    if (cache && key) await writeCached(cache, key, raw);
    return toPick(raw);
  } catch {
    return NO_PICK;
  }
}
