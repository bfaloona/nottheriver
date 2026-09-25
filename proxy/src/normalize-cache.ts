import type { KvStore, Normalized } from './contract';
import { MODELS } from './llm';
import { buildNormalizePrompt } from './prompts';
import { validateAgainst } from './validate';

// The model words its searches differently from run to run even at temperature 0, which
// changed which shops Brave returned; caching its reading makes a product's searches repeatable.
export const NORMALIZE_CACHE_TTL_SECONDS = 30 * 24 * 60 * 60;
// Bump to drop every cached reading, e.g. after a bad one was cached.
const CACHE_VERSION = 1;

const cacheProduct = (product: string) => product.normalize('NFKC').trim().toLowerCase().replace(/\s+/g, ' ');

// Hashed so the namespace's key list shows no search text; the prompt and model list are in
// the hash, so changing either starts a fresh cache.
export async function normalizeCacheKey(product: string): Promise<string> {
  const text = JSON.stringify({ version: CACHE_VERSION, prompt: buildNormalizePrompt({ product: cacheProduct(product) }), models: MODELS });
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)));
  return `normalize:${[...digest].map((b) => b.toString(16).padStart(2, '0')).join('')}`;
}

// A cache failure never fails a search: it only costs a model call.
export async function readNormalized(cache: KvStore, key: string): Promise<unknown> {
  try {
    const value: unknown = await cache.get(key, 'json');
    return value !== null && validateAgainst('normalize', value).ok ? value : null;
  } catch {
    return null;
  }
}

export async function writeNormalized(cache: KvStore, key: string, raw: Normalized): Promise<void> {
  try {
    await cache.put(key, JSON.stringify(raw), { expirationTtl: NORMALIZE_CACHE_TTL_SECONDS });
  } catch {
    // Workers KV limits writes per day; past the limit searches simply stop being cached.
  }
}
