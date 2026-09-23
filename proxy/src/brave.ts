import type { Candidate } from './contract';
import { registrableDomain } from './domain';
import { UpstreamError } from './errors';

export const MAX_BRAVE_CALLS = 6;
export const BRAVE_COUNT = 10;
const API = 'https://api.search.brave.com/res/v1';

export class BraveBudgetExceeded extends Error {
  constructor() {
    super('Brave call budget exceeded');
    this.name = 'BraveBudgetExceeded';
  }
}

export interface SearchLocation { lat: number; lon: number; city: string; state: string }

interface WebResult {
  title?: string;
  url?: string;
  description?: string;
  meta_url?: { hostname?: string };
  profile?: { name?: string };
  extra_snippets?: string[];
}

interface PlaceResult {
  id?: string;
  title?: string;
  url?: string;
  coordinates?: [number, number];
  categories?: string[];
  postal_address?: { displayAddress?: string };
}

// Snippets may carry inline markup; the site renders text and relevance matches words.
const text = (s: string | undefined) => (s ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

function parseUrl(raw: unknown): { href: string; host: string; domain: string } | null {
  if (typeof raw !== 'string') return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    const domain = registrableDomain(url.hostname);
    return domain ? { href: url.href, host: url.hostname, domain } : null;
  } catch {
    return null;
  }
}

// Header values must be Latin-1 or fetch throws; fold accents and omit anything else.
export function locCityHeader(city: string): string | null {
  const folded = city.normalize('NFKD').replace(/\p{M}/gu, '');
  return /^[\x20-\x7e]+$/.test(folded) ? folded : null;
}

// A registry page (a regulator, a court) is never a retailer, and letting one through
// would make it citable as a negative source for any unrelated shop.
export function mapWebResults(body: unknown, negativeSourceDomains: ReadonlySet<string>): Candidate[] {
  const results = (body as { web?: { results?: WebResult[] } } | null)?.web?.results ?? [];
  return results.flatMap((r): Candidate[] => {
    const parsed = parseUrl(r.url);
    if (!parsed || negativeSourceDomains.has(parsed.domain)) return [];
    const host = r.meta_url?.hostname || parsed.host;
    return [{
      kind: 'online',
      name: text(r.profile?.name) || host.replace(/^www\./, ''),
      domain: parsed.domain,
      url: parsed.href,
      title: text(r.title),
      snippet: text([r.description, ...(r.extra_snippets ?? [])].join(' ')),
      address: null,
      lat: null,
      lon: null,
      place_id: null,
    }];
  });
}

// Places without a website are dropped: the blocklist needs a domain and every
// result needs a source URL.
export function mapPlaceResults(body: unknown, negativeSourceDomains: ReadonlySet<string>): Candidate[] {
  const results = (body as { results?: PlaceResult[] } | null)?.results ?? [];
  return results.flatMap((r): Candidate[] => {
    const parsed = parseUrl(r.url);
    const name = text(r.title);
    if (!parsed || !name || negativeSourceDomains.has(parsed.domain)) return [];
    const [lat, lon] = r.coordinates ?? [];
    return [{
      kind: 'local',
      name,
      domain: parsed.domain,
      url: parsed.href,
      title: name,
      snippet: (r.categories ?? []).map(text).join(', '),
      address: r.postal_address?.displayAddress ?? null,
      lat: typeof lat === 'number' ? lat : null,
      lon: typeof lon === 'number' ? lon : null,
      place_id: r.id ?? null,
    }];
  });
}

export function createBraveClient(opts: {
  fetch: typeof globalThis.fetch;
  apiKey: string;
  negativeSourceDomains: ReadonlySet<string>;
  maxCalls?: number;
}) {
  const { apiKey, negativeSourceDomains, maxCalls = MAX_BRAVE_CALLS } = opts;
  let calls = 0;

  // Headers are built from literals only, so nothing from the inbound request
  // (User-Agent, Referer) can reach Brave.
  async function get(path: string, params: Record<string, string>, headers: Record<string, string>): Promise<unknown> {
    if (calls >= maxCalls) throw new BraveBudgetExceeded();
    calls++;
    const url = `${API}${path}?${new URLSearchParams(params)}`;
    let res: Response;
    try {
      res = await opts.fetch(url, { headers: { Accept: 'application/json', 'X-Subscription-Token': apiKey, ...headers } });
    } catch {
      throw new UpstreamError();
    }
    if (!res.ok) throw new UpstreamError();
    try {
      return await res.json();
    } catch {
      throw new UpstreamError();
    }
  }

  return {
    get calls() {
      return calls;
    },

    async webSearch(q: string, loc: SearchLocation): Promise<Candidate[]> {
      const city = locCityHeader(loc.city);
      const body = await get(
        '/web/search',
        { q, count: String(BRAVE_COUNT), country: 'US', search_lang: 'en', result_filter: 'web' },
        {
          'x-loc-lat': String(loc.lat),
          'x-loc-long': String(loc.lon),
          ...(city && { 'x-loc-city': city }),
          'x-loc-state': loc.state,
          'x-loc-country': 'US',
        },
      );
      return mapWebResults(body, negativeSourceDomains);
    },

    // place_search documents no x-loc-* headers; the centroid goes in the query only.
    async placeSearch(q: string, loc: SearchLocation): Promise<Candidate[]> {
      const body = await get(
        '/local/place_search',
        { q, latitude: String(loc.lat), longitude: String(loc.lon), count: String(BRAVE_COUNT), country: 'US', units: 'metric' },
        {},
      );
      return mapPlaceResults(body, negativeSourceDomains);
    },
  };
}

export type BraveClient = ReturnType<typeof createBraveClient>;
