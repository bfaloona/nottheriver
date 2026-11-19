import type { KvStore, Normalized } from './contract';
import { MODELS } from './llm';
import { buildNormalizePrompt } from './prompts';
import { validateAgainst, type SchemaName } from './validate';

// The model words its searches differently from run to run even at temperature 0, which
// changed which shops Brave returned; caching its reading makes a product's searches repeatable.
export const NORMALIZE_CACHE_TTL_SECONDS = 30 * 24 * 60 * 60;
// Bump to drop every cached reading, e.g. after a bad one was cached.
const CACHE_VERSION = 1;

export const cacheProduct = (product: string) => product.normalize('NFKC').trim().toLowerCase().replace(/\s+/g, ' ');

// Hashed so the namespace's key list shows no search text; the prompt and model list are in
// the hash, so changing either starts a fresh cache.
export async function hashedCacheKey(prefix: string, prompt: string): Promise<string> {
  const text = JSON.stringify({ version: CACHE_VERSION, prompt, models: MODELS });
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)));
  return `${prefix}:${[...digest].map((b) => b.toString(16).padStart(2, '0')).join('')}`;
}

export const normalizeCacheKey = (product: string) => hashedCacheKey('normalize', buildNormalizePrompt({ product: cacheProduct(product) }));

// A cache failure never fails a search: it only costs a model call.
export async function readCached(cache: KvStore, key: string, schema: SchemaName): Promise<unknown> {
  try {
    const value: unknown = await cache.get(key, 'json');
    return value !== null && validateAgainst(schema, value).ok ? value : null;
  } catch {
    return null;
  }
}

export async function writeCached(cache: KvStore, key: string, raw: unknown): Promise<void> {
  try {
    await cache.put(key, JSON.stringify(raw), { expirationTtl: NORMALIZE_CACHE_TTL_SECONDS });
  } catch {
    // Workers KV limits writes per day; past the limit searches simply stop being cached.
  }
}

export const readNormalized = (cache: KvStore, key: string) => readCached(cache, key, 'normalize');
export const writeNormalized = (cache: KvStore, key: string, raw: Normalized) => writeCached(cache, key, raw);
