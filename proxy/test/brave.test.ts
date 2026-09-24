import { describe, expect, it } from 'vitest';
import { BraveBudgetExceeded, MAX_BRAVE_CALLS, createBraveClient, locCityHeader, mapPlaceResults, mapWebResults } from '../src/brave';
import type { Candidate } from '../src/contract';
import { UpstreamError } from '../src/errors';
import { defaultRoutes, makeFixtureFetch } from '../../tests/fixtures/fixture-fetch';
import web1 from '../../tests/fixtures/brave/web-1.json';
import web2 from '../../tests/fixtures/brave/web-2.json';
import place1 from '../../tests/fixtures/brave/place-1.json';

const LOC = { lat: 39.8, lon: -89.65, city: 'Springfield', state: 'IL' };
const REGISTRY = new Set(['ftc.gov']);

function client(routes = defaultRoutes(), maxCalls?: number) {
  const fetch = makeFixtureFetch(routes);
  return { fetch, brave: createBraveClient({ fetch, apiKey: 'test-key', negativeSourceDomains: REGISTRY, maxCalls }) };
}

describe('web search request', () => {
  it('sends exactly the documented params and headers, nothing forwarded', async () => {
    const { fetch, brave } = client();
    await brave.webSearch('cast iron skillet', LOC);
    const call = fetch.calls[0]!;
    const url = new URL(call.url);
    expect(url.origin + url.pathname).toBe('https://api.search.brave.com/res/v1/web/search');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      q: 'cast iron skillet', count: '10', country: 'US', search_lang: 'en', result_filter: 'web',
    });
    expect(call.headers).toEqual({
      accept: 'application/json',
      'x-subscription-token': 'test-key',
      'x-loc-lat': '39.8',
      'x-loc-long': '-89.65',
      'x-loc-city': 'Springfield',
      'x-loc-state': 'IL',
      'x-loc-country': 'US',
    });
  });

  it('folds an accented city and omits a city that cannot be a header value', async () => {
    expect(locCityHeader('Mayagüez')).toBe('Mayaguez');
    expect(locCityHeader('Cañon City')).toBe('Canon City');
    expect(locCityHeader('東京')).toBeNull();

    const { fetch, brave } = client();
    await brave.webSearch('skillet', { ...LOC, city: '東京' });
    expect(Object.keys(fetch.calls[0]!.headers).sort()).toEqual(
      ['accept', 'x-loc-country', 'x-loc-lat', 'x-loc-long', 'x-loc-state', 'x-subscription-token'],
    );
  });
});

describe('place search request', () => {
  it('sends the local query verbatim with the centroid as the only location', async () => {
    const { fetch, brave } = client();
    await brave.placeSearch('kitchen supply store', LOC);
    const call = fetch.calls[0]!;
    const url = new URL(call.url);
    expect(url.pathname).toBe('/res/v1/local/place_search');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      q: 'kitchen supply store', latitude: '39.8', longitude: '-89.65', count: '10', country: 'US', units: 'metric',
    });
    expect(call.headers).toEqual({ accept: 'application/json', 'x-subscription-token': 'test-key' });
    expect(call.url).not.toContain('Springfield');
  });
});

describe('call budget and errors', () => {
  it(`allows ${MAX_BRAVE_CALLS} calls and throws before fetching the next`, async () => {
    const { fetch, brave } = client();
    for (let i = 0; i < MAX_BRAVE_CALLS; i++) {
      await (i % 2 ? brave.placeSearch('q', LOC) : brave.webSearch('q', LOC));
    }
    expect(brave.calls).toBe(MAX_BRAVE_CALLS);
    await expect(brave.webSearch('q', LOC)).rejects.toBeInstanceOf(BraveBudgetExceeded);
    await expect(brave.placeSearch('q', LOC)).rejects.toBeInstanceOf(BraveBudgetExceeded);
    expect(fetch.calls).toHaveLength(MAX_BRAVE_CALLS);
  });

  it('counts calls and honours a smaller budget', async () => {
    const { brave } = client(defaultRoutes(), 1);
    expect(brave.calls).toBe(0);
    await brave.webSearch('q', LOC);
    expect(brave.calls).toBe(1);
    await expect(brave.webSearch('q', LOC)).rejects.toBeInstanceOf(BraveBudgetExceeded);
  });

  it('turns a non-2xx answer into an UpstreamError that carries no upstream text', async () => {
    const { brave } = client([{ match: () => true, respond: () => ({ status: 429, body: { error: 'SECRET upstream detail' } }) }]);
    const err = await brave.webSearch('q', LOC).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(UpstreamError);
    expect(String(err)).not.toContain('SECRET');
  });

  it('turns a network failure into an UpstreamError', async () => {
    const failing = Object.assign(async () => { throw new TypeError('network down'); }, { calls: [] });
    const brave = createBraveClient({ fetch: failing as unknown as typeof fetch, apiKey: 'k', negativeSourceDomains: REGISTRY });
    await expect(brave.placeSearch('q', LOC)).rejects.toBeInstanceOf(UpstreamError);
  });
});

describe('web result mapping', () => {
  const candidates = mapWebResults(web1, REGISTRY);
  const byDomain = (d: string) => candidates.find((c) => c.domain === d);

  it('maps a clean result to an online candidate', () => {
    expect(byDomain('blue-heron-goods.example')).toEqual({
      kind: 'online',
      name: 'Blue Heron Goods',
      domain: 'blue-heron-goods.example',
      url: 'https://blue-heron-goods.example/cast-iron',
      title: 'Pre-seasoned Cast Iron Skillet, 10 inch | Blue Heron Goods',
      snippet: 'Pre-seasoned cast iron skillet, 10 inch. Ships in recycled packaging.',
      address: null, lat: null, lon: null, place_id: null,
    });
  });

  it('keeps blocked retailers for the filters to remove, and drops registry pages', () => {
    const domains = candidates.map((c) => c.domain);
    expect(domains).toEqual(expect.arrayContaining(['amazon.com', 'a.co', 'zappos.com', 'amazon.co.uk', 'deals.example']));
    expect(domains).not.toContain('ftc.gov');
    expect(candidates).toHaveLength(web1.web.results.length - 1);
  });

  it('falls back to the hostname without www when there is no profile name', () => {
    expect(byDomain('a.co')!.name).toBe('a.co');
    expect(mapWebResults(web2, REGISTRY).find((c) => c.domain === 'lakeside-mercantile.example')!.name).toBe('lakeside-mercantile.example');
  });

  it('drops invalid punycode, IP hosts and non-http schemes', () => {
    const mapped = mapWebResults(web2, REGISTRY);
    expect(mapped.map((c) => c.domain)).toEqual(['blue-heron-goods.example', 'lakeside-mercantile.example', 'wholefoodsmarket.com']);
  });

  it('strips inline markup from titles and snippets', () => {
    const [c] = mapWebResults({ web: { results: [{ title: 'Cast <strong>iron</strong>', url: 'https://a.example/', description: 'a <strong>skillet</strong>' }] } }, REGISTRY);
    expect(c!.title).toBe('Cast iron');
    expect(c!.snippet).toBe('a skillet');
  });

  it('tolerates a body with no web block', () => {
    expect(mapWebResults({ type: 'search' }, REGISTRY)).toEqual([]);
    expect(mapWebResults(null, REGISTRY)).toEqual([]);
  });
});

describe('place result mapping', () => {
  const candidates = mapPlaceResults(place1, REGISTRY);

  it('maps a place to a local candidate with categories as the snippet', () => {
    expect(candidates[0]).toEqual({
      kind: 'local',
      name: 'Riverbend Hardware',
      domain: 'riverbend-hardware.example',
      url: 'https://riverbend-hardware.example/',
      title: 'Riverbend Hardware',
      snippet: 'Hardware Store, Cookware Store',
      address: '12 Main St, Springfield, IL 62701',
      lat: 39.78,
      lon: -89.63,
      place_id: 'place-1',
    });
  });

  it('drops a place without a website and keeps blocked ones for the filters', () => {
    const names = candidates.map((c) => c.name);
    expect(names).not.toContain('No Website Kitchen Store');
    expect(names).toEqual(expect.arrayContaining(['Whole Foods Market - Midtown', 'Whole Foods Co-op', 'Amazon Hub Locker - Midtown', 'Corner Hardware']));
    expect(candidates).toHaveLength(place1.results.length - 1);
  });

  it('drops a place whose website is on a registry domain', () => {
    const place = { results: [{ id: 'x', title: 'Agency Office', url: 'https://www.ftc.gov/', coordinates: [1, 2] }] };
    expect(mapPlaceResults(place, REGISTRY)).toEqual([]);
  });

  it('puts Brave\'s icon_category first in the snippet, readable, so the classifier sees the store type', () => {
    const [c] = mapPlaceResults({ results: [{ id: 'x', title: 'Crate & Barrel', url: 'https://crateandbarrel.com/', icon_category: 'clothing_store', categories: ['Home Goods'] }] }, REGISTRY);
    expect(c!.snippet).toBe('clothing store, Home Goods');
  });

  it('ignores an icon_category that is empty or not a string, as if Brave had dropped the field', () => {
    for (const icon_category of [7, '']) {
      const [c] = mapPlaceResults({ results: [{ id: 'x', title: 'Shop', url: 'https://shop.example/', icon_category }] }, REGISTRY);
      expect(c!.snippet).toBe('');
    }
  });

  it('sets a restaurant or amusement park aside before the model, keeping the whole candidate', () => {
    const rejected: Candidate[] = [];
    const places = { results: [
      { id: 'r', title: "Jackson's Kitchen", url: 'https://jacksonskitchen.example/', icon_category: 'restaurant' },
      { id: 'a', title: 'Fun Park', url: 'https://www.funpark.example/', icon_category: 'amusement_park' },
      { id: 'f', title: 'Crate & Barrel', url: 'https://crateandbarrel.com/', icon_category: 'furniture' },
    ] };
    expect(mapPlaceResults(places, REGISTRY, rejected).map((c) => c.name)).toEqual(['Crate & Barrel']);
    expect(rejected.map((c) => [c.name, c.domain, c.snippet])).toEqual([
      ["Jackson's Kitchen", 'jacksonskitchen.example', 'restaurant'],
      ['Fun Park', 'funpark.example', 'amusement park'],
    ]);
  });

  it('keeps a place with no coordinates, with null lat and lon', () => {
    const [c] = mapPlaceResults({ results: [{ id: 'x', title: 'Shop', url: 'https://shop.example/' }] }, REGISTRY);
    expect(c).toMatchObject({ lat: null, lon: null, address: null, snippet: '' });
  });
});
