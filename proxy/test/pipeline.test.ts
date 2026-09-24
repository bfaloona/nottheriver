import { beforeEach, describe, expect, it, vi } from 'vitest';
import certifications from '../../data/certifications.json';
import negatives from '../../data/negatives.json';
import { filterBlocked, isBlocked, isBlockedDomain, isBlockedUrl } from '../src/blocklist';
import type { Candidate, Certification, Env, SearchRequest, SearchResponse, Signal } from '../src/contract';
import { enrichAll, type EnrichedRow } from '../src/enrich';
import { InvalidLlmOutput } from '../src/errors';
import { MAX_BRAVE_CALLS } from '../src/brave';
import { MAX_LOCAL_QUERIES, MAX_ONLINE_QUERIES, finalizeResponse, runSearch, scoreAll, type ScoredRow } from '../src/pipeline';
import { estimateCost } from '../src/pricing';
import { validateAgainst } from '../src/validate';
import { defaultRoutes, makeFixtureFetch, type FixtureRoute } from '../../tests/fixtures/fixture-fetch';
import place1 from '../../tests/fixtures/brave/place-1.json';
import normalizeFixture from '../../tests/fixtures/llm/normalize.json';
import normalizeAmazon from '../../tests/fixtures/llm/normalize-amazon.json';
import enrichWithAmazon from '../../tests/fixtures/llm/enrich-with-amazon.json';

// Wrapped, not replaced: the real code runs, and the spies record what each pass saw.
vi.mock('../src/blocklist', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../src/blocklist')>();
  return { ...mod, filterBlocked: vi.fn(mod.filterBlocked) };
});
vi.mock('../src/enrich', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../src/enrich')>();
  return { ...mod, enrichAll: vi.fn(mod.enrichAll) };
});

const REQ: SearchRequest = { product: 'cast iron skillet', city: 'Springfield', state: 'IL', lat: 39.78, lon: -89.65 };
const ENV: Env = {
  BRAVE_API_KEY: 'fixture-brave-key',
  OPENROUTER_API_KEY: 'fixture-openrouter-key',
  ALLOWED_ORIGIN: 'http://localhost:5173',
  SITE_NAME: 'nottheriver',
  SITE_URL: 'http://localhost:5173',
};
const NORMALIZED = JSON.parse(normalizeFixture.choices[0]!.message.content);

async function search(routes: FixtureRoute[] = defaultRoutes(), env: Env = ENV) {
  const fetch = makeFixtureFetch(routes);
  const res = await runSearch(REQ, env, { fetch, now: () => 0, log: () => {} });
  return { res, fetch };
}

const isBrave = (url: string) => url.startsWith('https://api.search.brave.com/');
const isLlm = (url: string) => url.startsWith('https://openrouter.ai/');

function llmReply(content: unknown) {
  return {
    id: 'gen-test',
    model: 'google/gemma-4-31b-it',
    choices: [{ message: { role: 'assistant', content: JSON.stringify(content) } }],
    usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15, cost: 0.00001 },
  };
}

function candidate(overrides: Partial<Candidate>): Candidate {
  return {
    kind: 'online', name: 'Clean Shop', domain: 'clean.example', url: 'https://clean.example/skillet',
    title: 'Cast iron skillet', snippet: 'Cast iron skillet, pre-seasoned.', address: null, lat: null, lon: null, place_id: null,
    ...overrides,
  };
}

const row = (c: Candidate, certs: Certification[] = [], signals: Signal[] = []): EnrichedRow =>
  ({ candidate: c, certifications: certs, signals, classification: null });
const NO_USAGE = { brave_calls: 0, llm: [], llm_tokens: 0, estimated_cost_usd: 0 };

// The blocklist comes from data/blocklist.json, so this checks every entry, not a fixed list.
// Only the negative is asserted: the ranking-doc URLs point at localhost, which has no registrable domain.
function expectAmazonFree(res: SearchResponse) {
  const text = JSON.stringify({ query: { canonical_name: res.query.canonical_name, category: res.query.category }, local: res.local, online: res.online });
  const urls = text.match(/https?:\/\/[^"\s]+/g) ?? [];
  expect(urls.length).toBeGreaterThan(0);
  for (const url of urls) {
    expect(!isBlockedDomain(url) && !isBlockedUrl(url), url).toBe(true);
  }
  expect(text).not.toMatch(/\bamazon\b/i);
}

const domainsOf = (items: unknown) =>
  (items as Array<Candidate | ScoredRow>).map((i) => ('result' in i ? i.result.retailer.domain : i.domain));
const spy = vi.mocked(filterBlocked);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('runSearch over the fixtures', () => {
  it('returns a response that matches the published schema', async () => {
    const { res } = await search();
    const result = validateAgainst('search-response', res);
    expect(result.ok ? [] : result.errors).toEqual([]);
  });

  it('makes one Brave call per query and reports usage and cost', async () => {
    const { res, fetch } = await search();
    const expected = NORMALIZED.online_queries.length + NORMALIZED.local_queries.length;
    expect(fetch.calls.filter((c) => isBrave(c.url))).toHaveLength(expected);
    expect(res.usage.brave_calls).toBe(expected);
    expect(res.usage.llm.map((u) => u.call)).toEqual(['normalize', 'enrich']);
    expect(res.usage.llm_tokens).toBe(400 + 120 + 2100 + 300);
    expect(res.usage.estimated_cost_usd).toBe(estimateCost(res.usage));
    expect(res.usage.estimated_cost_usd).toBeGreaterThan(0);
  });

  it('sends the model no location: no location keys and no coordinates', async () => {
    const { fetch } = await search();
    const bodies = fetch.calls.filter((c) => isLlm(c.url)).map((c) => c.body ?? '');
    expect(bodies).toHaveLength(2);
    const coordinates = [...place1.results.flatMap((r) => r.coordinates ?? []), REQ.lat, REQ.lon].map(String);
    for (const body of bodies) {
      const prompt = (JSON.parse(body) as { messages: Array<{ content: string }> }).messages.map((m) => m.content).join('\n');
      for (const key of ['lat', 'lon', 'coordinates', 'postal_address', 'distance', 'address']) expect(prompt).not.toContain(`"${key}"`);
      for (const value of coordinates) expect(body).not.toContain(value);
    }
  });

  it('removes every blocked retailer, URL and mention', async () => {
    const { res } = await search();
    expectAmazonFree(res);
    const domains = [...res.online, ...res.local].map((r) => r.retailer.domain);
    expect(domains).not.toContain('copper-kettle-kitchen.example'); // "Cheaper on Amazon" in its snippet
    expect(domains).not.toContain('ftc.gov');
    expect(res.local.map((r) => r.retailer.name)).toContain('Whole Foods Co-op');
  });

  it('dedupes within a section in fetch order, but keeps a shop that is both online and local', async () => {
    const { res } = await search();
    const online = res.online.map((r) => r.retailer.domain);
    expect(online.filter((d) => d === 'blue-heron-goods.example')).toHaveLength(1);
    // web-1 is fetched before web-2, so its page is the one kept.
    expect(res.online.find((r) => r.retailer.domain === 'blue-heron-goods.example')!.retailer.url).toBe('https://blue-heron-goods.example/cast-iron');
    const placeIds = res.local.map((r) => r.id.split(':')[1]);
    expect(new Set(placeIds).size).toBe(placeIds.length);
    for (const d of ['blue-heron-goods.example', 'northfork-kitchen.example']) {
      expect(online).toContain(d);
      expect(res.local.map((r) => r.retailer.domain)).toContain(d);
    }
  });

  it('ranks 1..n by score, gives every counted component a source, and exposes no coordinates', async () => {
    const { res } = await search();
    for (const section of [res.local, res.online]) {
      expect(section.map((r) => r.rank)).toEqual(section.map((_, i) => i + 1));
      const scores = section.map((r) => r.score);
      expect(scores).toEqual([...scores].sort((a, b) => b - a));
      for (const r of section) {
        for (const c of r.components) if (c.value > 0) expect(c.sources.length, `${r.id} ${c.name}`).toBeGreaterThan(0);
      }
    }
    expect(JSON.stringify([res.local, res.online])).not.toMatch(/"(lat|lon)"/);
  });

  it('builds ranking-doc links with one slash when SITE_URL ends in a slash', async () => {
    const { res, fetch } = await search(defaultRoutes(), { ...ENV, SITE_URL: 'http://localhost:5173/' });
    const urls = res.online.flatMap((r) => r.components.flatMap((c) => c.sources.map((s) => s.url)));
    expect(urls).toContain('http://localhost:5173/about.html#ranking');
    expect(urls.filter((u) => u.includes('5173//'))).toEqual([]);
    expect(fetch.calls.find((c) => isLlm(c.url))!.headers['http-referer']).toBe('http://localhost:5173');
  });
});

describe('query handling', () => {
  it('truncates the model queries to 3 online and 2 local, so a search stays under the 6-call cap', async () => {
    const many = { ...NORMALIZED, online_queries: ['q1', 'q2', 'q3', 'q4', 'q5'], local_queries: ['l1', 'l2', 'l3'] };
    const { res, fetch } = await search(defaultRoutes({ normalize: llmReply(many) }));
    const qs = fetch.calls.filter((c) => isBrave(c.url)).map((c) => new URL(c.url).searchParams.get('q'));
    expect(qs).toEqual(['q1', 'q2', 'q3', 'l1 store', 'l2 store']);
    expect(res.usage.brave_calls).toBe(5);
    expect(MAX_ONLINE_QUERIES + MAX_LOCAL_QUERIES).toBeLessThanOrEqual(MAX_BRAVE_CALLS);
  });

  it('matches only the first 6 similar products', async () => {
    const decoys = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6'].map((d) => `${d} decoy`);
    const reply = (similar: string[]) => llmReply({ ...NORMALIZED, canonical_name: 'zz none', category: 'zz none', similar_products: similar, local_queries: [] });
    const relevanceOf = async (similar: string[]) => {
      const { res } = await search(defaultRoutes({ normalize: reply(similar) }));
      expect(res.online.length).toBeGreaterThan(0);
      return res.online.map((r) => r.components.find((c) => c.name === 'relevance')!.value);
    };
    // Control: in the first six, the product matches the fixture snippets.
    expect(await relevanceOf(['cast iron skillet', ...decoys.slice(1)])).toContain(1);
    expect(await relevanceOf([...decoys, 'cast iron skillet'])).not.toContain(1);
  });

  it('skips place search when there are no local queries', async () => {
    const { res, fetch } = await search(defaultRoutes({ normalize: llmReply({ ...NORMALIZED, local_queries: [] }) }));
    expect(fetch.calls.some((c) => c.url.includes('/local/'))).toBe(false);
    expect(res.local).toEqual([]);
    expect(res.online.length).toBeGreaterThan(0);
  });

  it('strips a blocked brand from the model output before any query is sent', async () => {
    const { res, fetch } = await search(defaultRoutes({ normalize: normalizeAmazon }));
    expect(res.query.canonical_name).toBe('Basics cast iron skillet');
    const qs = fetch.calls.filter((c) => isBrave(c.url)).map((c) => new URL(c.url).searchParams.get('q') ?? '');
    expect(qs.length).toBeGreaterThan(0);
    for (const q of qs) expect(q).not.toMatch(/amazon/i);
  });

  it('refuses the model output when every online query is a blocked name', async () => {
    const blocked = llmReply({ ...NORMALIZED, online_queries: ['Amazon', 'Whole Foods Market'] });
    const fetch = makeFixtureFetch(defaultRoutes({ normalize: blocked }));
    await expect(runSearch(REQ, ENV, { fetch, now: () => 0, log: () => {} })).rejects.toBeInstanceOf(InvalidLlmOutput);
    expect(fetch.calls.some((c) => isBrave(c.url))).toBe(false);
  });

  it('drops blocked queries before capping, so a usable fourth query is still sent', async () => {
    const online_queries = ['Amazon', 'Whole Foods Market', 'Amazon', 'cast iron skillet shop'];
    const { fetch } = await search(defaultRoutes({ normalize: llmReply({ ...NORMALIZED, online_queries, local_queries: [] }) }));
    expect(fetch.calls.filter((c) => isBrave(c.url)).map((c) => new URL(c.url).searchParams.get('q'))).toEqual(['cast iron skillet shop']);
  });

  it('falls back to the product when the canonical name is empty', async () => {
    const { res } = await search(defaultRoutes({ normalize: llmReply({ ...NORMALIZED, canonical_name: '' }) }));
    expect(res.query.canonical_name).toBe(REQ.product);
  });

  it('scrubs a blocked brand from the product fallback', async () => {
    const fetch = makeFixtureFetch(defaultRoutes({ normalize: llmReply({ ...NORMALIZED, canonical_name: '' }) }));
    const res = await runSearch({ ...REQ, product: 'Amazon Basics skillet' }, ENV, { fetch, now: () => 0, log: () => {} });
    expect(res.query.canonical_name).toBe('Basics skillet');
  });

  it('makes no enrich call when every fetched result is blocked', async () => {
    const onlyBlocked: FixtureRoute[] = [
      {
        match: (u) => u.pathname === '/res/v1/web/search',
        respond: () => ({ body: { type: 'search', web: { results: [{ title: 'Skillet', url: 'https://www.amazon.com/dp/B0X', description: 'Skillet.' }] } } }),
      },
      {
        match: (u) => u.pathname === '/res/v1/local/place_search',
        respond: () => ({ body: { type: 'locations', results: [{ id: 'p1', title: 'Amazon Hub Locker - Midtown', url: 'https://locker.example/', coordinates: [39.8, -89.6] }] } }),
      },
      ...defaultRoutes(),
    ];
    const { res, fetch } = await search(onlyBlocked);
    expect(fetch.calls.filter((c) => isLlm(c.url))).toHaveLength(1);
    expect(res.usage.llm.map((u) => u.call)).toEqual(['normalize']);
    expect(res.local).toEqual([]);
    expect(res.online).toEqual([]);
  });
});

describe('the second blocklist pass', () => {
  it('drops blocked retailers and blocked text, and rescores a row whose badge source is blocked', () => {
    const blockedCert: Certification = { kind: 'b_corp', label: 'B Corp', source_url: 'https://www.amazon.com/b-corp', checked: '2026-09-23' };
    const mentionsAmazon: Signal = {
      kind: 'labor', polarity: 'positive', claim: 'Why we left Amazon', source_url: 'https://clean.example/about', origin: 'llm', action_date: null,
    };
    const clean = candidate({});
    const rows = [
      row(candidate({ name: 'Amazon', domain: 'amazon.com', url: 'https://www.amazon.com/dp/B0' })),
      row(candidate({ kind: 'local', name: 'Whole Foods Market - Midtown', domain: 'wholefoodsmarket.com', url: 'https://www.wholefoodsmarket.com/stores/midtown', place_id: 'p3', lat: 39.8, lon: -89.64 })),
      row(candidate({ name: 'Copper Kettle', domain: 'copper.example', url: 'https://copper.example/', snippet: 'Cheaper on Amazon? Compare prices.' })),
      // Only the name or only the URL gives these away; the name is not a leading match.
      row(candidate({ name: 'Best Amazon Deals', domain: 'best-deals.example', url: 'https://best-deals.example/skillet' })),
      row(candidate({ name: 'Deal Finder', domain: 'deals.example', url: 'https://deals.example/go?u=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB0' })),
      row(clean, [blockedCert], [mentionsAmazon]),
    ];
    const scored = scoreAll(rows, NORMALIZED, REQ, ENV.SITE_URL);
    const before = scored[5]!;
    expect(before.result.components.some((c) => c.sources.some((s) => s.url === blockedCert.source_url))).toBe(true);

    const res = finalizeResponse(scored, NORMALIZED, REQ, NO_USAGE);
    expect(res.local).toEqual([]);
    expect(res.online.map((r) => r.retailer.domain)).toEqual(['clean.example']);
    const kept = res.online[0]!;
    expect(kept.certifications).toEqual([]);
    expect(kept.signals).toEqual([]);
    expect(kept.score).toBe(scoreAll([row(clean)], NORMALIZED, REQ, ENV.SITE_URL)[0]!.result.score);
    expect(kept.score).toBeLessThan(before.result.score);
    expectAmazonFree(res);
  });

  it.each([
    ['fullwidth', 'Cheaper on \uff21\uff4d\uff41\uff5a\uff4f\uff4e'],
    ['zero-width', 'Cheaper on Ama\u200bzon'],
  ])('drops a row whose snippet spells Amazon in %s characters', (_, snippet) => {
    const rows = [row(candidate({ domain: 'copper.example', url: 'https://copper.example/', snippet })), row(candidate({}))];
    const res = finalizeResponse(scoreAll(rows, NORMALIZED, REQ, ENV.SITE_URL), NORMALIZED, REQ, NO_USAGE);
    expect(res.online.map((r) => r.retailer.domain)).toEqual(['clean.example']);
  });

  it('caps each section at 10 and keeps fetch order among equal scores', () => {
    const rows = Array.from({ length: 12 }, (_, i) => row(candidate({ domain: `shop${i}.example`, url: `https://shop${i}.example/skillet` })));
    const res = finalizeResponse(scoreAll(rows, NORMALIZED, REQ, ENV.SITE_URL), NORMALIZED, REQ, NO_USAGE);
    expect(res.online.map((r) => r.retailer.domain)).toEqual(rows.slice(0, 10).map((r) => r.candidate.domain));
    expect(res.online.map((r) => r.rank)).toEqual(Array.from({ length: 10 }, (_, i) => i + 1));
  });

  it('runs twice, and the model enrichment cannot bring a blocked retailer back', async () => {
    const { res } = await search(defaultRoutes({ enrich: enrichWithAmazon }));
    expect(spy).toHaveBeenCalledTimes(2);
    expect(domainsOf(spy.mock.calls[0]![0])).toContain('amazon.com');
    expect(domainsOf(spy.mock.results[0]!.value)).not.toContain('amazon.com');
    // The clean retailer's signal from the same reply was accepted, so the reply was used.
    expect(res.online.find((r) => r.retailer.domain === 'blue-heron-goods.example')!.signals.map((s) => s.origin)).toContain('llm');
    expectAmazonFree(res);
  });

  it('removes a blocked retailer that enters after the first pass', async () => {
    const { enrichAll: realEnrichAll } = await vi.importActual<typeof import('../src/enrich')>('../src/enrich');
    // A name the text rule cannot match, so only the domain check can remove it. The model calls
    // it a shop selling the product, so the classification filter keeps it and only pass 2 can drop it.
    const injected: EnrichedRow = {
      ...row(candidate({ name: 'Prime Deals', domain: 'amazon.com', url: 'https://www.amazon.com/dp/B0' })),
      classification: { site_type: 'retailer', sells_product: 'yes' },
    };
    vi.mocked(enrichAll).mockImplementationOnce(async (...args) => [...(await realEnrichAll(...args)), injected]);

    const { res } = await search();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(domainsOf(spy.mock.results[0]!.value)).not.toContain('amazon.com');
    expect(domainsOf(spy.mock.calls[1]![0])).toContain('amazon.com');
    expect(domainsOf(spy.mock.results[1]!.value)).not.toContain('amazon.com');
    expectAmazonFree(res);
  });
});

describe('curated data against the blocklist', () => {
  it.each([...certifications.entries, ...negatives.entries])('$domain is not blocked and cites an allowed source', (e) => {
    expect(isBlocked({ name: e.name, domain: e.domain })).toBe(false);
    expect(isBlockedDomain(e.source_url) || isBlockedUrl(e.source_url)).toBe(false);
  });
});
