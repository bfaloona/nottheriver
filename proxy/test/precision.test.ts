import { describe, expect, it } from 'vitest';
import type { Candidate, Classification, Dropped, Env, SearchRequest, SellsProduct, SiteType } from '../src/contract';
import { registrableDomain } from '../src/domain';
import { enrichAll, MAX_LLM_LOCAL, MAX_LLM_ONLINE } from '../src/enrich';
import { InvalidLlmOutput } from '../src/errors';
import { createHandler } from '../src/handler';
import { addressKey, dedupe, enrichAndFilter, runSearch, scrubNormalized } from '../src/pipeline';
import { dropReason, isEditorialUrl } from '../src/precision';
import { defaultRoutes, makeFixtureFetch, schemaNameOf, type FixtureRoute } from '../../tests/fixtures/fixture-fetch';
import pilot from '../../tests/fixtures/quality/graded-pilot.json';

interface PilotRow {
  search_id: string;
  result_id: string;
  kind: 'online' | 'local';
  url: string;
  name: string;
  snippet: string;
  address: string | null;
  grade: 'yes' | 'equivalent' | 'no' | 'unknown';
  label: { site_type: SiteType; sells_product: SellsProduct };
}

// JSON imports type the enums as string; the fixture builder asserted every label value.
const rows = pilot.rows as PilotRow[];
const online = rows.filter((r) => r.kind === 'online');
const local = rows.filter((r) => r.kind === 'local');
const sells = (r: PilotRow) => r.grade === 'yes' || r.grade === 'equivalent';
const unique = (list: PilotRow[]) => [...new Map(list.map((r) => [r.url, r])).values()];
const placeIdOf = (r: PilotRow) => r.result_id.slice(r.result_id.indexOf(':') + 1, r.result_id.lastIndexOf(':'));

const ENV: Env = {
  BRAVE_API_KEY: 'fixture-brave-key',
  OPENROUTER_API_KEY: 'fixture-openrouter-key',
  ALLOWED_ORIGIN: 'http://localhost:5173',
  SITE_NAME: 'nottheriver',
  SITE_URL: 'http://localhost:5173',
};

function llmReply(content: unknown) {
  return {
    id: 'gen-test',
    model: 'google/gemma-4-31b-it',
    choices: [{ message: { role: 'assistant', content: JSON.stringify(content) } }],
    usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15, cost: 0.00001 },
  };
}

function promptOf(init?: RequestInit): string {
  return (JSON.parse(String(init?.body)) as { messages: Array<{ content: string }> }).messages[0]!.content;
}

function dataOf(prompt: string): { product: unknown; candidates: Array<{ id: string; url: string; title: string }> } {
  return JSON.parse(/<<<DATA\n([\s\S]*?)\nDATA>>>/.exec(prompt)![1]!);
}

const isEnrich = (u: URL, init?: RequestInit) => u.pathname === '/api/v1/chat/completions' && schemaNameOf(init) === 'enrich';

// The stub answers from the hand labels, so these tests prove the plumbing, not the model.
function stubClassifier(labelled: PilotRow[]): FixtureRoute {
  const byKey = new Map(labelled.map((r) => [`${r.url}|${r.name}`, r.label]));
  return {
    match: isEnrich,
    respond: (_u, init) => {
      const candidates = dataOf(promptOf(init)).candidates.flatMap((c) => {
        const label = byKey.get(`${c.url}|${c.title}`);
        return label ? [{ id: c.id, ...label }] : [];
      });
      return { body: llmReply({ retailers: [], candidates }) };
    },
  };
}

// Rebuilds the Brave replies one saved search came from, so the whole pipeline runs over graded rows.
function replayRoutes(searchRows: PilotRow[]): FixtureRoute[] {
  const web = searchRows.filter((r) => r.kind === 'online');
  const places = searchRows.filter((r) => r.kind === 'local');
  const normalized = {
    category: 'fixture', canonical_name: 'fixture product', similar_products: [],
    online_queries: ['fixture product shop'], local_queries: places.length ? ['fixture store'] : [],
  };
  return [
    {
      match: (u) => u.pathname === '/res/v1/web/search',
      respond: () => ({ body: { web: { results: web.map((r) => ({ title: r.name, url: r.url, description: r.snippet, profile: { name: r.name } })) } } }),
    },
    {
      match: (u) => u.pathname === '/res/v1/local/place_search',
      respond: () => ({
        body: {
          results: places.map((r) => ({
            id: placeIdOf(r), title: r.name, url: r.url,
            categories: r.snippet ? r.snippet.split(', ') : [],
            ...(r.address && { postal_address: { displayAddress: r.address } }),
          })),
        },
      }),
    },
    { match: (u, init) => u.pathname === '/api/v1/chat/completions' && schemaNameOf(init) === 'normalize', respond: () => ({ body: llmReply(normalized) }) },
    stubClassifier(searchRows),
  ];
}

const REQ: SearchRequest = { product: 'fixture product', city: 'Springfield', state: 'IL', lat: 39.78, lon: -89.65 };

describe('T1: the editorial URL rule over the graded pilot', () => {
  const RULE_URLS = [
    'https://www.bonappetit.com/story/best-cast-iron-skillet',
    'https://www.seriouseats.com/best-cast-iron-skillet',
    'https://www.epicurious.com/expert-advice/best-cast-iron-skillet-pan-reviews-article',
    'https://www.foodnetwork.com/how-to/packages/shopping/sustainable-and-eco-friendly-cookware-brands',
    'https://www.shunkangcookware.com/news/durable-sustainable-versatile-cast-iron-grill-p.html',
    'https://www.the-independent.com/extras/indybest/us/best-cookware-sets-b2962473.html',
    'https://www.thegoodtrade.com/features/nontoxic-cookware/',
    'https://www.warmcazza.com/post/non-toxic-cookware-brands-2026',
    'https://www.forbes.com/sites/forbes-personal-shopper/article/best-cast-iron-skillet/',
    'https://www.booniehicks.com/best-cast-iron-skillets/',
    'https://www.tastingtable.com/992992/the-best-cast-iron-brands-ranked/',
    'https://www.allrecipes.com/longform/best-cast-iron-skillets/',
    'https://www.campmaid.com/blogs/news/4-sustainable-camping-gear-essentials',
    'https://www.ethicalconsumer.org/retailers/shopping-guide/outdoor-clothing-shops',
    'https://gearjunkie.com/outdoor/best-independent-gear-shops-america',
  ];

  it('the fixture is the pilot: 60 online rows, 8 selling', () => {
    expect(online).toHaveLength(60);
    expect(online.filter(sells)).toHaveLength(8);
    expect(online.filter((r) => r.grade === 'no')).toHaveLength(52);
  });

  it('flags exactly the 15 known URLs, 25 graded rows, and no row that sells the product', () => {
    const flagged = online.filter((r) => isEditorialUrl(r.url));
    expect(flagged).toHaveLength(25);
    expect(flagged.every((r) => r.grade === 'no')).toBe(true);
    expect([...new Set(flagged.map((r) => r.url))].sort()).toEqual([...RULE_URLS].sort());
    expect(local.filter((r) => sells(r) && isEditorialUrl(r.url))).toEqual([]);
  });

  it.each([
    ['a homepage', 'https://www.boroughfurnace.com/', false],
    ['a shop segment beside "best"', 'https://shop.example/collections/best-sellers', false],
    ['a product page', 'https://shop.example/products/blog-cast-iron', false],
    ['"best" inside a longer word', 'https://shop.example/bestway-tent', false],
    ['"best" split by an underscore', 'https://mag.example/top_best_tents', true],
    ['"best" before a file extension', 'https://mag.example/best.html', true],
    ['an uppercase segment', 'https://mag.example/Blog/tents', true],
    ['a query string only', 'https://shop.example/?q=best', false],
    ['an unparseable URL', 'not a url', false],
  ])('%s', (_label, url, expected) => {
    expect(isEditorialUrl(url)).toBe(expected);
  });
});

describe('T2: full pipeline replay with a stub classifier built from the labels', () => {
  const searches = [...new Set(rows.map((r) => r.search_id))];

  it.each(searches)('%s: drops every graded "no", keeps every seller or its same-store twin', async (searchId) => {
    const searchRows = rows.filter((r) => r.search_id === searchId);
    const fetch = makeFixtureFetch(replayRoutes(searchRows));
    const res = await runSearch(REQ, ENV, { fetch, now: () => 0, log: () => {} });
    const shown = [...res.online, ...res.local];
    const shownKeys = new Set(shown.map((r) => `${r.kind}|${r.retailer.url}|${r.retailer.name}`));
    const storeKeys = new Set(res.local.map((r) => `${r.retailer.domain}|${addressKey(r.address)}`));

    for (const r of searchRows.filter((x) => x.grade === 'no')) {
      expect(shownKeys.has(`${r.kind}|${r.url}|${r.name}`), `${r.url} ${r.name}`).toBe(false);
    }
    for (const r of searchRows.filter(sells)) {
      const kept = shownKeys.has(`${r.kind}|${r.url}|${r.name}`)
        || (r.kind === 'local' && storeKeys.has(`${registrableDomain(r.url)}|${addressKey(r.address)}`));
      expect(kept, `${r.url} ${r.name}`).toBe(true);
    }
    expect(res.usage.llm.map((u) => u.call)).toEqual(['normalize', 'enrich']);
  });

  it.each(searches)('%s: a flagged page is dropped even when the model calls it a shop', async (searchId) => {
    const searchRows = rows.filter((r) => r.search_id === searchId);
    const allShops = searchRows.map((r) => ({ ...r, label: { site_type: 'retailer' as const, sells_product: 'yes' as const } }));
    const routes = replayRoutes(searchRows);
    routes[routes.length - 1] = stubClassifier(allShops);
    const res = await runSearch(REQ, ENV, { fetch: makeFixtureFetch(routes), now: () => 0, log: () => {} });
    const shownUrls = res.online.map((r) => r.retailer.url);
    const webRows = searchRows.filter((r) => r.kind === 'online');
    expect(shownUrls.sort()).toEqual(webRows.filter((r) => !isEditorialUrl(r.url)).map((r) => r.url).sort());
  });

  it('keeps editorial pages in the model input, after the shops', async () => {
    const searchRows = rows.filter((r) => r.search_id === 'cast-iron-skillet-urban');
    const fetch = makeFixtureFetch(replayRoutes(searchRows));
    await runSearch(REQ, ENV, { fetch, now: () => 0, log: () => {} });
    const call = fetch.calls.find((c) => isEnrich(new URL(c.url), { body: c.body ?? '' }))!;
    const urls = dataOf(promptOf({ body: call.body ?? '' })).candidates.map((c) => c.url);
    expect(urls.filter(isEditorialUrl).length).toBeGreaterThan(0);
    const onlineFlags = urls.filter((u) => searchRows.some((r) => r.kind === 'online' && r.url === u)).map(isEditorialUrl);
    expect(onlineFlags).toEqual([...onlineFlags].sort((a, b) => Number(a) - Number(b)));
  });
});

describe('T3: which layer catches each unique online "no" URL', () => {
  const noUrls = unique(online.filter((r) => r.grade === 'no'));
  const layerOf = (r: PilotRow) => (isEditorialUrl(r.url) ? 'rule' : dropReason(r.label as Classification) ?? 'kept');
  const byLayer = (layer: string) => noUrls.filter((r) => layerOf(r) === layer).map((r) => r.url);

  it('splits 27 unique URLs 15 / 11 / 1, and none stay', () => {
    expect(noUrls).toHaveLength(27);
    expect(byLayer('rule')).toHaveLength(15);
    expect(byLayer('site_type')).toHaveLength(11);
    expect(byLayer('sells_product')).toEqual(['https://abodeoutside.com/collections/all']);
    expect(byLayer('kept')).toEqual([]);
  });

  it('the 404 page is caught only by the classifier', () => {
    expect(byLayer('site_type')).toContain('https://bettertrail.com/sustainability/camping-tents');
  });

  it.each([
    [{ site_type: 'retailer', sells_product: 'yes' }, null],
    [{ site_type: 'marketplace', sells_product: 'maybe' }, null],
    [{ site_type: 'other', sells_product: 'maybe' }, null],
    [{ site_type: 'editorial', sells_product: 'yes' }, 'site_type'],
    [{ site_type: 'service', sells_product: 'maybe' }, 'site_type'],
    [{ site_type: 'manufacturer_no_cart', sells_product: 'yes' }, 'site_type'],
    [{ site_type: 'retailer', sells_product: 'no' }, 'sells_product'],
    [null, null],
  ] as Array<[Classification | null, string | null]>)('dropReason(%j) is %s', (c, expected) => {
    expect(dropReason(c)).toBe(expected);
  });
});

function candidate(overrides: Partial<Candidate>): Candidate {
  return {
    kind: 'online', name: 'Shop', domain: 'shop.example', url: 'https://shop.example/', title: 'Shop', snippet: '',
    address: null, lat: null, lon: null, place_id: null, ...overrides,
  };
}

describe('T4: fail open on gaps and unknown values, fail closed on an invalid reply', () => {
  const CURATED = { certifications: [], negatives: [], negativeSources: new Set<string>() };
  const PRODUCT = { canonical_name: 'tent', category: 'outdoor gear' };

  function fakeLlm(reply: (ids: string[]) => unknown) {
    const prompts: string[] = [];
    return {
      prompts,
      llm: {
        usage: [],
        complete: async (_call: string, prompt: string) => {
          prompts.push(prompt);
          return reply(dataOf(prompt).candidates.map((c) => c.id));
        },
      } as never,
    };
  }

  it('keeps a candidate the model omits, and ignores an id it never sent', async () => {
    const list = [candidate({ domain: 'a.example', url: 'https://a.example/' }), candidate({ domain: 'b.example', url: 'https://b.example/' })];
    const { llm } = fakeLlm(() => ({
      retailers: [],
      candidates: [{ id: 'c0', site_type: 'editorial', sells_product: 'no' }, { id: 'c9', site_type: 'editorial', sells_product: 'no' }],
    }));
    const out = await enrichAll(list, llm, CURATED, PRODUCT);
    expect(out.map((r) => r.classification)).toEqual([{ site_type: 'editorial', sells_product: 'no' }, null]);
    expect(dropReason(out[1]!.classification)).toBeNull();
  });

  it('caps the view at 24 online and 20 local, and keeps what is past the cap', async () => {
    const many = [
      ...Array.from({ length: 30 }, (_, i) => candidate({ domain: `o${i}.example`, url: `https://o${i}.example/` })),
      ...Array.from({ length: 25 }, (_, i) => candidate({ kind: 'local', domain: `l${i}.example`, url: `https://l${i}.example/`, place_id: `p${i}` })),
    ];
    const { llm, prompts } = fakeLlm((ids) => ({
      retailers: [],
      // Also answers for every id it could guess, including the ones past the cap.
      candidates: [...ids, ...many.map((_, i) => `c${i}`)].map((id) => ({ id, site_type: 'editorial', sells_product: 'no' })),
    }));
    const out = await enrichAll(many, llm, CURATED, PRODUCT);
    const sent = dataOf(prompts[0]!).candidates.map((c) => c.id);
    expect(MAX_LLM_ONLINE).toBe(24);
    expect(MAX_LLM_LOCAL).toBe(20);
    expect(sent).toHaveLength(44);
    expect(sent.slice(0, 24)).toEqual(Array.from({ length: 24 }, (_, i) => `c${i}`));
    expect(sent.slice(24)).toEqual(Array.from({ length: 20 }, (_, i) => `c${30 + i}`));
    const classified = out.map((r) => r.classification !== null);
    expect(classified).toEqual(many.map((_, i) => i < 24 || (i >= 30 && i < 50)));
  });

  it('sends the product inside the data block and no location', async () => {
    const { llm, prompts } = fakeLlm(() => ({ retailers: [], candidates: [] }));
    await enrichAll([candidate({ kind: 'local', address: '1 Main St', lat: 39.8, lon: -89.6, place_id: 'p' })], llm, CURATED, PRODUCT);
    const data = dataOf(prompts[0]!);
    expect(data.product).toEqual(PRODUCT);
    expect(Object.keys(data.candidates[0]!).sort()).toEqual(['domain', 'id', 'snippet', 'title', 'url']);
    expect(prompts[0]).not.toMatch(/Main St|39\.8|-89\.6/);
  });

  it('records each drop with its reason, and nothing it kept', async () => {
    const shop = candidate({ domain: 'shop.example', url: 'https://shop.example/tents' });
    const cafe = candidate({ kind: 'local', domain: 'cafe.example', url: 'https://cafe.example/', address: '1 Main St', place_id: 'p1' });
    const article = candidate({ domain: 'mag.example', url: 'https://mag.example/blog/best-tents' });
    const { llm } = fakeLlm(() => ({ retailers: [], candidates: [{ id: 'c1', site_type: 'retailer', sells_product: 'no' }] }));
    const normalized = { ...PRODUCT, similar_products: [], online_queries: ['q'], local_queries: [] };
    const dropped: Dropped[] = [];
    const kept = await enrichAndFilter([shop, cafe, article], llm, normalized, dropped);
    expect(kept.map((r) => r.candidate)).toEqual([shop]);
    expect(dropped).toEqual([
      { kind: 'online', domain: 'mag.example', reason: 'editorial_url' },
      { kind: 'local', domain: 'cafe.example', reason: 'sells_product' },
    ]);
  });

  it('a flagged page is not a result but can still be cited as evidence for a shop', async () => {
    const shop = candidate({ name: 'Riverbend Outfitters', domain: 'riverbend.example', url: 'https://riverbend.example/tents', title: 'Tents' });
    const article = candidate({ name: 'Mag', domain: 'mag.example', url: 'https://mag.example/blog/tents', title: 'Riverbend Outfitters repairs tents for free' });
    const signal = { kind: 'environmental', polarity: 'positive', claim: 'x', source_url: article.url, confidence: 0.8 };
    const { llm } = fakeLlm(() => ({ retailers: [{ domain: shop.domain, signals: [signal] }], candidates: [] }));
    const normalized = { ...PRODUCT, similar_products: [], online_queries: ['q'], local_queries: [] };
    const kept = await enrichAndFilter([article, shop], llm, normalized);
    expect(kept.map((r) => r.candidate)).toEqual([shop]);
    expect(kept[0]!.signals).toEqual([expect.objectContaining({ source_url: article.url, claim: article.title, origin: 'llm' })]);
  });

  it('an unknown classification value leaves that candidate unclassified, and the search still succeeds', async () => {
    const odd = llmReply({ retailers: [], candidates: [{ id: 'c0', site_type: 'blog', sells_product: 'probably' }] });
    const routes = [{ match: isEnrich, respond: () => ({ body: odd }) }, ...defaultRoutes()];
    const fetch = makeFixtureFetch(routes);
    const res = await runSearch(REQ, ENV, { fetch, now: () => 0, log: () => {} });
    expect(fetch.calls.filter((c) => isEnrich(new URL(c.url), { body: c.body ?? '' }))).toHaveLength(1);
    expect(res.online.length + res.local.length).toBeGreaterThan(0);

    const { llm } = fakeLlm(() => ({ retailers: [], candidates: [{ id: 'c0', site_type: 'blog', sells_product: 'no' }] }));
    const out = await enrichAll([candidate({ domain: 'a.example', url: 'https://a.example/' })], llm, CURATED, PRODUCT);
    expect(out[0]!.classification).toBeNull();
  });

  it('a structurally invalid reply is retried once, then the search fails with a 502', async () => {
    const invalid = llmReply({ retailers: [], candidates: 'none' });
    const routes = [{ match: isEnrich, respond: () => ({ body: invalid }) }, ...defaultRoutes()];
    const fetch = makeFixtureFetch(routes);
    await expect(runSearch(REQ, ENV, { fetch, now: () => 0, log: () => {} })).rejects.toBeInstanceOf(InvalidLlmOutput);
    expect(fetch.calls.filter((c) => isEnrich(new URL(c.url), { body: c.body ?? '' }))).toHaveLength(2);

    const handle = createHandler(runSearch, { fetch: makeFixtureFetch(routes), now: () => 0, log: () => {} });
    const request = new Request('https://proxy.example/search', {
      method: 'POST',
      headers: { Origin: ENV.ALLOWED_ORIGIN, 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.9' },
      body: JSON.stringify({ product: 'cast iron skillet', city: 'Springfield', state: 'IL', lat: 39.8, lon: -89.65 }),
    });
    const res = await handle(request, ENV);
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: 'invalid_llm_output' });
  });
});

describe('T5: local department dedupe', () => {
  const fromRow = (r: PilotRow): Candidate => candidate({
    kind: 'local', name: r.name, domain: registrableDomain(r.url)!, url: r.url, title: r.name, snippet: r.snippet,
    address: r.address, place_id: placeIdOf(r),
  });
  const find = (name: string) => fromRow(local.find((r) => r.name.startsWith(name))!);
  const names = (list: Candidate[]) => dedupe(list).map((c) => c.name);

  it.each([
    [['REI Bike Shop', 'REI'], 'REI'],
    [['Camping World RV Parts', 'Camping World - Hamburg', 'Propane Refills'], 'Camping World - Hamburg'],
    [['Hamburg Gun Library', "Cabela's"], "Cabela's"],
  ])('merges %j into the shortest name', (group, winner) => {
    expect(names(group.map(find))).toEqual([winner]);
  });

  it('keeps the merged store at the first member\'s position', () => {
    expect(names([find('REI Bike Shop'), find('Boscov'), find('REI')])).toEqual(['REI', "Boscov's"]);
  });

  it('keeps apart branches at different addresses and shops of one mall', () => {
    const homegoods = local.filter((r) => r.name === 'HomeGoods').map(fromRow);
    const dicks = local.filter((r) => r.name.startsWith("DICK'S")).map(fromRow);
    expect(homegoods).toHaveLength(2);
    expect(dicks).toHaveLength(2);
    expect(dedupe(homegoods)).toHaveLength(2);
    expect(dedupe(dicks)).toHaveLength(2);
    expect(names([find('Boscov'), dicks[0]!])).toEqual(["Boscov's", "DICK'S Sporting Goods"]);
  });

  it('falls back to the place id when there is no address', () => {
    const a = candidate({ kind: 'local', name: 'A', domain: 'x.example', place_id: 'p1' });
    const b = candidate({ kind: 'local', name: 'Bb', domain: 'x.example', place_id: 'p2' });
    expect(dedupe([a, b, { ...a, name: 'A again' }]).map((c) => c.name)).toEqual(['A', 'Bb']);
  });

  it('online dedupe stays first-wins by domain', () => {
    const first = candidate({ name: 'Long Shop Name', url: 'https://shop.example/a' });
    const second = candidate({ name: 'S', url: 'https://shop.example/b' });
    expect(dedupe([first, second])).toEqual([first]);
  });

  it('online dedupe swaps a kept editorial page for a later shop page of the same domain', () => {
    const blog = candidate({ url: 'https://shop.example/blog/best-tents' });
    const product = candidate({ url: 'https://shop.example/products/tent' });
    const other = candidate({ domain: 'other.example', url: 'https://other.example/tent' });
    expect(dedupe([blog, other, product])).toEqual([product, other]);
    // A shop page already kept is not swapped for an editorial one.
    expect(dedupe([product, blog])).toEqual([product]);
  });

  it.each([
    ['200 Ridge Pike Ste 115, Conshohocken, PA 19428', '200 ridge pike'],
    ['321 Speen St #3a, Natick, MA 01760', '321 speen st'],
    ['1528 Walnut St # 1900, Philadelphia, PA 19102', '1528 walnut st'],
    ['500 W Germantown Pike Space 1515, Plymouth Meeting, PA 19462', '500 w germantown pike'],
    ['500 Hawk Ridge Dr Suites 9-11, Hamburg, PA 19526', '500 hawk ridge dr'],
    ['1700 Market St Suite 600, Philadelphia, PA 19103', '1700 market st'],
    ['9 Mill Rd Unit 4, Town, ST 00000', '9 mill rd'],
    ['12 Stevens St, Town, ST 00000', '12 stevens st'],
    ['4 Unity Way, Town, ST 00000', '4 unity way'],
    ['1 Space Park Dr, Town, ST 00000', '1 space park dr'],
    [null, null],
    ['', null],
  ])('addressKey(%j) is %j', (address, expected) => {
    expect(addressKey(address)).toBe(expected);
  });
});

describe('T6: query guard', () => {
  const base = { category: 'outdoor gear', canonical_name: 'camping tent', similar_products: [] };
  const guard = (online_queries: string[], local_queries: string[], product = 'camping tent') =>
    scrubNormalized({ ...base, online_queries, local_queries }, product);

  it.each([
    ['best camping tent', 'camping tent'],
    ['Top 10 camping tents REVIEWS', '10 camping tents'],
    ['tent A vs. tent B review', 'tent A tent B'],
    ['buy camping tent', 'buy camping tent'],
    ['bestway tent shop', 'bestway tent shop'],
  ])('online %j becomes %j', (q, expected) => {
    expect(guard([q], []).online_queries).toEqual([expected]);
  });

  it('keeps a banned word the shopper typed', () => {
    expect(guard(['best tank top shop'], [], 'tank top').online_queries).toEqual(['tank top shop']);
  });

  it('drops an online query that was only banned words, and refuses when none are left', () => {
    expect(guard(['best reviews', 'buy tent'], []).online_queries).toEqual(['buy tent']);
    expect(() => guard(['best top reviews'], [])).toThrow(InvalidLlmOutput);
  });

  it.each([
    ['outdoor gear', 'outdoor gear store'],
    ['camping', 'camping store'],
    ['outdoor gear store', 'outdoor gear store'],
    ['Cookware Shop', 'Cookware Shop'],
    ['mountain outfitters', 'mountain outfitters'],
    ['sporting goods stores', 'sporting goods stores'],
  ])('local %j becomes %j', (q, expected) => {
    expect(guard(['buy tent'], [q]).local_queries).toEqual([expected]);
  });

  it('local queries keep "best" and "top": the guard only shapes online queries', () => {
    expect(guard(['buy tent'], ['top gear store']).local_queries).toEqual(['top gear store']);
  });
});
