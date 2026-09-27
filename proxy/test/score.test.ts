import { describe, expect, it } from 'vitest';
import type { Candidate, CertKind, Certification, Normalized, Signal, SignalKind } from '../src/contract';
import { WEIGHTS } from '../ranking/weights';
import { env, ethics, findingCost, proximity, rankByScore, relevance, scoreCandidate } from '../ranking/score';

const SITE = 'http://localhost:5173';
const DOC = `${SITE}/about.html#ranking`;
const ORIGIN = { lat: 42.38, lon: -71.13 };
const KM_PER_DEG_LAT = (6371 * Math.PI) / 180;

const normalized: Normalized = {
  category: 'cookware',
  canonical_name: 'cast iron skillet',
  similar_products: ['carbon steel pan', 'dutch oven'],
  online_queries: ['cast iron skillet'],
  local_queries: ['cast iron skillet'],
};

function online(title: string, snippet = ''): Candidate {
  return {
    kind: 'online', name: 'Shop', domain: 'shop.example', url: 'https://shop.example/p', title, snippet,
    address: null, lat: null, lon: null, place_id: null,
  };
}

// A place due north of ORIGIN, so its haversine distance is km along a meridian.
function local(title: string, categories: string, km: number | null = 3.2): Candidate {
  return {
    kind: 'local', name: title, domain: 'store.example', url: 'https://store.example/', title,
    snippet: categories, address: '1 Main St, Springfield',
    lat: km === null ? null : ORIGIN.lat + km / KM_PER_DEG_LAT,
    lon: km === null ? null : ORIGIN.lon, place_id: 'place-1',
  };
}

function cert(kind: CertKind, label: string = kind): Certification {
  return { kind, label, source_url: `https://cert.example/${kind}`, checked: '2026-09-23' };
}

// Major and self by default (cost 0.25), so every existing "0.25 per negative" test still holds:
// that is also ADR 0006's equivalence claim made concrete (all major and self equals the old flat rule).
function negative(kind: SignalKind, n = 1, overrides: Partial<Signal> = {}): Signal {
  return {
    kind, polarity: 'negative', claim: `Case ${n}`, source_url: `https://www.ftc.gov/case-${kind}-${n}`,
    origin: 'curated', action_date: '2024-01-01',
    penalty_usd: 1_000_000, relation: 'self', status: 'final',
    ...overrides,
  };
}

describe('weights', () => {
  it('match the published formula and sum to 1', () => {
    expect(WEIGHTS).toEqual({ relevance: 0.25, ethics: 0.3, env: 0.3, proximity: 0.15 });
    expect(Object.values(WEIGHTS).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
  });
});

describe('relevance', () => {
  it.each([
    ['canonical name in the title', online('Lodge cast iron skillet 10 inch'), 'cast iron skillet'],
    ['similar product in the snippet', online('Kitchen shop', 'We stock a Dutch oven or two'), 'dutch oven'],
    ['case, punctuation and whitespace differences', online('CAST-IRON   Skillet!'), 'cast iron skillet'],
    ['a plural form', online('Cast iron skillets and cookware.'), 'cast iron skillet'],
  ])('is 1.0 for %s', (_, c, matched) => {
    const r = relevance(c, normalized);
    expect(r.value).toBe(1);
    expect(r.matched).toBe(matched);
  });

  it('does not match a plural needle against singular text (substring rule, no stemming)', () => {
    const n = { ...normalized, canonical_name: 'cast iron skillets', similar_products: ['glasses'], category: 'tools' };
    expect(relevance(online('Our cast iron skillet'), n)).toMatchObject({ value: 0.2, matched: '' });
    expect(relevance(online('Cork glass'), n)).toMatchObject({ value: 0.2, matched: '' });
  });

  it('does not match a phrase split across title and snippet', () => {
    expect(relevance(online('Seasoned cast iron', 'skillet and more'), normalized).value).toBe(0.2);
  });

  it('is 0.5 when only the category appears', () => {
    expect(relevance(online('Cookware outlet'), normalized)).toMatchObject({ value: 0.5, matched: 'cookware' });
  });

  it('is 0.2 otherwise, with an empty match', () => {
    expect(relevance(online('Garden hoses'), normalized)).toMatchObject({ value: 0.2, matched: '' });
  });

  it('matches substrings, so "pan" is found inside "saucepan" and also, falsely, inside "Japan"', () => {
    const n = { ...normalized, canonical_name: 'pan', similar_products: [], category: 'kitchen' };
    expect(relevance(online('Stainless saucepan'), n).value).toBe(1);
    expect(relevance(online('Imported from Japan'), n).value).toBe(1);
  });

  it('never matches an empty product string', () => {
    const n = { ...normalized, canonical_name: '', similar_products: ['  '], category: '' };
    expect(relevance(online('Anything'), n).value).toBe(0.2);
  });

  it('cites the candidate page, labelled with its title', () => {
    expect(relevance(online('Cookware outlet'), normalized).source).toEqual({
      label: 'Cookware outlet', url: 'https://shop.example/p',
    });
  });

  it('scores a local store from its title and categories', () => {
    const hardware = { ...normalized, category: 'hardware' };
    expect(relevance(local('Corner Store', 'Hardware Store'), hardware).value).toBe(0.5);
    expect(relevance(local('Corner Store', 'Hardware Store'), normalized).value).toBe(0.2);
    expect(relevance(local('Skillet Shack', 'Cast Iron Skillet Shop'), normalized).value).toBe(1);
  });

  it("lifts a local store by the model's judgment that it sells the product, citing the store", () => {
    const store = local('Corner Store', 'Hardware Store');
    expect(relevance(store, normalized, 'yes')).toEqual({
      value: 1, matched: '', source: { label: 'Model judgment: likely sells it', url: store.url },
    });
    expect(relevance(store, normalized, 'maybe')).toMatchObject({ value: 0.5, matched: '', source: { label: 'Model judgment: may sell it' } });
    expect(relevance(store, normalized, null).value).toBe(0.2);
    expect(relevance(store, normalized).value).toBe(0.2);
  });

  it('keeps the text match when it scores higher than the judgment, and ignores judgments for online retailers', () => {
    expect(relevance(local('Skillet Shack', 'Cast Iron Skillet Shop'), normalized, 'maybe')).toMatchObject({ value: 1, matched: 'cast iron skillet' });
    expect(relevance(online('Garden hoses'), normalized, 'yes').value).toBe(0.2);
  });
});

const dimensions = [
  {
    name: 'ethics', fn: ethics, kinds: ['b_corp', 'fair_trade', 'worker_coop'],
    other: 'one_percent_planet', neg: ['labor', 'governance'], otherNeg: 'environmental',
  },
  {
    name: 'env', fn: env, kinds: ['one_percent_planet', 'climate_neutral'],
    other: 'b_corp', neg: ['environmental'], otherNeg: 'labor',
  },
] as const;

describe.each(dimensions)('$name', ({ fn, kinds, other, neg, otherNeg }) => {
  const all = kinds.map((k) => cert(k));

  it('starts at the 0.5 baseline, citing the ranking doc', () => {
    expect(fn([], [], DOC)).toEqual({ value: 0.5, minor_cap_applied: false, sources: [{ label: 'Baseline 0.5', url: DOC }] });
  });

  it('adds 0.25 per certification of its own kind and cites it', () => {
    const r = fn([cert(kinds[0], 'Badge')], [], DOC);
    expect(r.value).toBe(0.75);
    expect(r.sources).toContainEqual({ label: 'Badge', url: `https://cert.example/${kinds[0]}` });
  });

  it('caps at 1.0', () => {
    expect(fn(all, [], DOC).value).toBe(1);
  });

  it('counts a repeated certification kind once', () => {
    expect(fn([cert(kinds[0]), cert(kinds[0])], [], DOC).value).toBe(0.75);
  });

  it('ignores the other dimension, independent-retailer badges and positive signals', () => {
    const positive: Signal = { ...negative(neg[0]), polarity: 'positive' };
    expect(fn([cert(other), cert('independent_retailer_assoc')], [positive, negative(otherNeg)], DOC).value).toBe(0.5);
  });

  it('subtracts 0.25 per accepted negative of its kinds and cites the source', () => {
    for (const k of neg) {
      const s = negative(k);
      const r = fn([], [s], DOC);
      expect(r.value).toBe(0.25);
      expect(r.sources).toContainEqual({ label: expect.stringContaining(s.claim), url: s.source_url });
    }
  });

  it('counts a repeated negative of one kind and page once, as a curated and an LLM copy would be', () => {
    expect(fn([], [negative(neg[0]), { ...negative(neg[0]), origin: 'llm', action_date: null }], DOC).value).toBe(0.25);
  });

  it('floors at 0', () => {
    expect(fn([], [negative(neg[0], 1), negative(neg[0], 2), negative(neg[0], 3)], DOC).value).toBe(0);
  });

  it('applies the cap before negatives', () => {
    // For ethics, three certifications would net 1.0 without the cap first; with it, 0.75.
    expect(fn(all, [negative(neg[0])], DOC).value).toBe(0.75);
  });
});

it('ethics counts a labor and a governance negative citing one page as two', () => {
  const labor = negative('labor');
  expect(ethics([], [labor, { ...negative('governance'), source_url: labor.source_url }], DOC).value).toBe(0);
});

// ADR 0006 (weighted findings): cost = 0.25 x band x relation, read only from the row's own fields.
describe('findingCost', () => {
  const OSHA_INSPECTION_URL = 'https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1';
  const signal = (overrides: Partial<Signal> = {}): Signal => ({
    kind: 'labor', polarity: 'negative', claim: 'x', source_url: 'https://www.ftc.gov/x',
    origin: 'curated', action_date: '2024-01-01', relation: 'self', status: 'final', penalty_usd: 0,
    ...overrides,
  });

  it.each([
    [99_999, 'minor'], [100_000, 'standard'], [999_999, 'standard'], [1_000_000, 'major'], [0, 'minor'],
  ] as const)('bands a $%d penalty as %s', (penalty_usd, band) => {
    expect(findingCost(signal({ penalty_usd })).band).toBe(band);
  });

  it('bands an unstated amount (null) as standard', () => {
    expect(findingCost(signal({ penalty_usd: null })).band).toBe('standard');
  });

  it('bands an open case with no penalty as minor', () => {
    expect(findingCost(signal({ status: 'open', penalty_usd: null })).band).toBe('minor');
  });

  it.each(['willful', 'repeat'] as const)('bands a %s OSHA inspection citation as standard, whatever its amount', (citation_type) => {
    expect(findingCost(signal({ source_url: OSHA_INSPECTION_URL, citation_type, penalty_usd: 5_000 })).band).toBe('standard');
  });

  it.each(['serious', 'other'] as const)('leaves a %s OSHA inspection citation banded on the amount alone', (citation_type) => {
    expect(findingCost(signal({ source_url: OSHA_INSPECTION_URL, citation_type, penalty_usd: 5_000 })).band).toBe('minor');
  });

  it('reads citation_type only on an inspection-detail page: a willful settlement press release on osha.gov still bands on the amount', () => {
    // Dollar General's curated row cites a national news release, not an inspection page: no
    // citation-type column exists there to read, so `citation_type` never overrides its amount.
    const pressRelease = 'https://www.osha.gov/news/newsreleases/national/x';
    expect(findingCost(signal({ source_url: pressRelease, citation_type: 'willful', penalty_usd: 5_000 })).band).toBe('minor');
  });

  it.each([
    ['self', 1], ['related-at-shop', 1], ['related', 0.5],
  ] as const)('weighs a %s finding at %s', (relation, weight) => {
    expect(findingCost(signal({ relation, penalty_usd: 1_000_000 })).cost).toBe(0.25 * weight);
  });

  it('costs 0.03125 for a related minor finding', () => {
    expect(findingCost(signal({ relation: 'related', penalty_usd: 0 })).cost).toBe(0.03125);
  });

  it('scores an llm-origin signal, which carries none of these fields, as standard and self: 0.125', () => {
    const llmSignal: Signal = { kind: 'labor', polarity: 'negative', claim: 'x', source_url: 'https://www.ftc.gov/x', origin: 'llm', action_date: null };
    expect(findingCost(llmSignal)).toEqual({ band: 'standard', relation: 'self', cost: 0.125 });
  });
});

describe('minor cap (ADR 0006: at most 0.25 per dimension)', () => {
  const minor = (kind: SignalKind, n: number, overrides: Partial<Signal> = {}) => negative(kind, n, { penalty_usd: 0, ...overrides });

  it('four minor rows cost 0.25 in total, without tripping the cap flag', () => {
    const rows = [1, 2, 3, 4].map((n) => minor('labor', n));
    const r = ethics([], rows, DOC);
    expect(r.value).toBe(0.25); // 0.5 - 4 x 0.0625
    expect(r.minor_cap_applied).toBe(false);
  });

  it('five minor rows still cost 0.25, and now the cap flag is set', () => {
    const rows = [1, 2, 3, 4, 5].map((n) => minor('labor', n));
    const r = ethics([], rows, DOC);
    expect(r.value).toBe(0.25);
    expect(r.minor_cap_applied).toBe(true);
  });

  it('nine related minor rows (9 x 0.03125 = 0.28125) still cost only 0.25', () => {
    const rows = Array.from({ length: 9 }, (_, i) => minor('labor', i, { relation: 'related' }));
    const r = ethics([], rows, DOC);
    expect(r.value).toBe(0.25);
    expect(r.minor_cap_applied).toBe(true);
  });

  it('a major row beside five minor rows costs 0.5 in total: the cap never touches major or standard findings', () => {
    const rows = [negative('labor', 0), ...[1, 2, 3, 4, 5].map((n) => minor('labor', n))];
    expect(ethics([], rows, DOC).value).toBe(0); // 0.5 - 0.25 (major) - 0.25 (capped minor)
  });

  it('caps per dimension, not per kind: five minor labor rows plus one minor governance row cost 0.25 together', () => {
    const rows = [...[1, 2, 3, 4, 5].map((n) => minor('labor', n)), minor('governance', 6)];
    expect(ethics([], rows, DOC).value).toBe(0.25);
  });

  it('caps ethics and environment separately: five minor rows in each dimension cost 0.25 apiece', () => {
    const rows = [...[1, 2, 3, 4, 5].map((n) => minor('labor', n)), ...[1, 2, 3, 4, 5].map((n) => minor('environmental', n))];
    expect(ethics([], rows, DOC).value).toBe(0.25);
    expect(env([], rows, DOC).value).toBe(0.25);
  });
});

// ADR 0006's worked examples, recomputed here from fixtures (not data/*.json: those rows don't
// exist until Phase B) so a changed row or rule fails this test by name.
describe('ADR 0006 worked examples', () => {
  const oshaLabor = (source_url: string, penalty_usd: number, relation: Signal['relation'] = 'self') => ({
    kind: 'labor' as const, polarity: 'negative' as const, claim: 'OSHA inspection', source_url,
    origin: 'curated' as const, action_date: '2024-01-01', penalty_usd, relation, status: 'final' as const,
  });
  const prop65 = (source_url: string, penalty_usd: number, relation: Signal['relation'] = 'self') => ({
    kind: 'environmental' as const, polarity: 'negative' as const, claim: 'Prop 65 settlement', source_url,
    origin: 'curated' as const, action_date: '2024-01-01', penalty_usd, relation, status: 'final' as const,
  });
  const standard = (kind: SignalKind, source_url: string) => ({
    kind, polarity: 'negative' as const, claim: 'Not stated', source_url,
    origin: 'curated' as const, action_date: '2024-01-01', penalty_usd: null, relation: 'self' as const, status: 'final' as const,
  });
  const openCase = (source_url: string) => ({
    kind: 'labor' as const, polarity: 'negative' as const, claim: 'Open complaint', source_url,
    origin: 'curated' as const, action_date: '2024-01-01', penalty_usd: null, relation: 'self' as const, status: 'open' as const,
  });

  it('Walmart: two majors and two unstated-amount standards floor ethics at 0, env stays 0.25', () => {
    const walmartEthics = [
      { ...standard('governance', 'https://ftc.example/walmart-2025-06-23'), penalty_usd: 50_000_000 },
      standard('governance', 'https://ftc.example/walmart-2025-06-23-b'),
      standard('labor', 'https://dol.example/walmart-2024-01-11'),
    ];
    const walmartEnv = [{ ...standard('environmental', 'https://courtlistener.example/walmart'), penalty_usd: 11_000_000 }];
    expect(ethics([], walmartEthics, DOC).value).toBe(0);
    expect(env([], walmartEnv, DOC).value).toBe(0.25);
  });

  it('Costco: four minor OSHA/NLRB rows cost exactly the cap, ethics 0.25', () => {
    const rows = [
      oshaLabor('https://osha.example/costco-1', 9_403),
      oshaLabor('https://osha.example/costco-2', 1_330),
      oshaLabor('https://osha.example/costco-3', 560),
      openCase('https://nlrb.example/costco'),
    ];
    expect(ethics([], rows, DOC).value).toBe(0.25);
  });

  it("Patagonia: two ethics certs plus one standard finding gives ethics 0.875; one env cert plus one self and three related minors gives env 0.59375", () => {
    const certs = [cert('fair_trade'), cert('b_corp'), cert('climate_neutral')];
    const patagoniaEthics = [standard('labor', 'https://nlrb.example/patagonia')];
    const patagoniaEnv = [
      prop65('https://oag.example/patagonia-2021-08-12', 36_000, 'self'),
      prop65('https://oag.example/patagonia-2022-12-07', 4_000, 'related'),
      prop65('https://oag.example/patagonia-2023-02-17', 5_000, 'related'),
      prop65('https://oag.example/patagonia-2025-04-01', 2_000, 'related'),
    ];
    expect(ethics(certs, patagoniaEthics, DOC).value).toBe(0.875);
    expect(env(certs, patagoniaEnv, DOC).value).toBe(0.59375);
  });

  it('Etsy: five minor Prop 65 rows exceed the cap, so env goes from 0.75 to 0.5 (ethics untouched at 0.5)', () => {
    const rows = [
      prop65('https://oag.example/etsy-1', 20_000),
      prop65('https://oag.example/etsy-2', 40_000),
      prop65('https://oag.example/etsy-3', 6_000),
      prop65('https://oag.example/etsy-4', 24_300),
      prop65('https://oag.example/etsy-5', 10_000),
    ];
    expect(ethics([], [], DOC).value).toBe(0.5);
    expect(env([cert('climate_neutral')], rows, DOC).value).toBe(0.5);
  });

  it("Bob's Red Mill: a fair_trade cert plus one minor labor row gives ethics 0.6875; seven minor environmental rows exceed the cap, env 0.25", () => {
    const ethicsRows = [oshaLabor('https://osha.example/bobsredmill', 1_350)];
    const envRows = [5_000, 19_000, 1_000, 7_500, 16_000, 2_500, 2_000].map((amount, i) => prop65(`https://oag.example/bobsredmill-${i}`, amount));
    expect(ethics([cert('fair_trade')], ethicsRows, DOC).value).toBe(0.6875);
    expect(env([], envRows, DOC).value).toBe(0.25);
  });

  it("Azure Standard: three warehouse OSHA rows, related-at-shop (operator ruling 2026-09-27), cost ethics 0.3125", () => {
    const rows = [
      oshaLabor('https://osha.example/azure-1', 1_800, 'related-at-shop'),
      oshaLabor('https://osha.example/azure-2', 1_000, 'related-at-shop'),
      oshaLabor('https://osha.example/azure-3', 570, 'related-at-shop'),
    ];
    expect(ethics([], rows, DOC).value).toBe(0.3125);
  });
});

describe('proximity', () => {
  it.each([
    [0, 1],
    [20, 0.5],
    [40, 0],
    [60, 0],
  ])('%d km scores %d', (km, value) => {
    const r = proximity(local('Store', 'Hardware Store', km), ORIGIN, DOC);
    expect(r.value).toBe(value);
    expect(r.distance_km).toBe(km);
  });

  it('rounds distance to 1 decimal and cites the ranking doc with it', () => {
    expect(proximity(local('Store', 'x', 3.2), ORIGIN, DOC)).toEqual({
      value: 0.92, distance_km: 3.2, sources: [{ label: '2.0 mi (3.2 km) from your zip area', url: DOC }],
    });
  });

  it('is 0 with no distance and no source when a place has no coordinates', () => {
    expect(proximity(local('Store', 'x', null), ORIGIN, DOC)).toEqual({ value: 0, distance_km: null, sources: [] });
  });

  it('treats non-finite coordinates as missing', () => {
    expect(proximity({ ...local('Store', 'x'), lat: Number.NaN }, ORIGIN, DOC)).toEqual({
      value: 0, distance_km: null, sources: [],
    });
  });

  it('has no source at 0 beyond the radius', () => {
    expect(proximity(local('Store', 'x', 60), ORIGIN, DOC).sources).toEqual([]);
  });

  it('is a fixed 0.5 for online retailers', () => {
    expect(proximity(online('x'), ORIGIN, DOC)).toEqual({
      value: 0.5, distance_km: null, sources: [{ label: 'Online retailer, fixed 0.5', url: DOC }],
    });
  });
});

describe('scoreCandidate', () => {
  const input = (candidate: Candidate, certifications: Certification[] = [], signals: Signal[] = []) => ({
    candidate, certifications, signals, normalized, origin: ORIGIN, siteUrl: SITE,
  });

  it('reproduces the hand-computed weighted sum for a local result', () => {
    const r = scoreCandidate(input(local('Riverbend Hardware', 'Cast iron skillets and cookware.'), [cert('b_corp')]));
    // 0.25*1 + 0.3*0.75 + 0.3*0.5 + 0.15*0.92 = 0.763
    expect(r.score).toBe(0.763);
    expect(r.components.map((c) => [c.name, c.value, c.weight, c.contribution])).toEqual([
      ['relevance', 1, 0.25, 0.25],
      ['ethics', 0.75, 0.3, 0.225],
      ['env', 0.5, 0.3, 0.15],
      ['proximity', 0.92, 0.15, 0.138],
    ]);
    expect(r.matched_product).toBe('cast iron skillet');
    expect(r.distance_km).toBe(3.2);
  });

  it('reproduces the hand-computed weighted sum for an online result', () => {
    const r = scoreCandidate(input(online('Outdoor cookware and camp gear'), [], [negative('labor')]));
    // 0.25*0.5 + 0.3*0.25 + 0.3*0.5 + 0.15*0.5 = 0.425
    expect(r.score).toBe(0.425);
    expect(r.matched_product).toBe('cookware');
    expect(r.distance_km).toBeNull();
  });

  it('rounds each contribution for display but sums unrounded products for the score', () => {
    // Proximity at 11.5 km is 0.7125. These weights make the two summing orders disagree:
    // unrounded 0.0006 + 0.106875 = 0.107475 -> 0.107; rounded 0.001 + 0.107 = 0.108.
    const w = { relevance: 0, ethics: 0.0012, env: 0, proximity: 0.15 };
    const r = scoreCandidate(input(local('Store', 'Garden', 11.5)), w);
    expect(r.components.map((c) => c.contribution)).toEqual([0, 0.001, 0, 0.107]);
    expect(r.components[3]?.value).toBe(0.7125);
    expect(r.score).toBe(0.107);
  });

  it('uses weights passed in', () => {
    const w = { relevance: 1, ethics: 0, env: 0, proximity: 0 };
    expect(scoreCandidate(input(online('Garden hoses')), w).score).toBe(0.2);
  });

  it('cites every non-zero component (HR5) across every branch', () => {
    const cases = [
      input(online('cast iron skillet')),
      input(online('Cookware outlet'), [cert('b_corp'), cert('climate_neutral')]),
      input(online('Garden hoses'), [], [negative('labor'), negative('labor', 2), negative('environmental')]),
      input(local('Store', 'Hardware Store', 0), [cert('independent_retailer_assoc')]),
      input(local('Store', 'Hardware Store', 60)),
      input(local('Store', 'Hardware Store', null)),
    ];
    for (const c of cases) {
      const r = scoreCandidate(c);
      expect(r.components.map((x) => x.name)).toEqual(['relevance', 'ethics', 'env', 'proximity']);
      for (const comp of r.components) {
        expect(comp.value).toBeGreaterThanOrEqual(0);
        expect(comp.value).toBeLessThanOrEqual(1);
        expect(comp.weight).toBe(WEIGHTS[comp.name]);
        if (comp.value > 0) expect(comp.sources.length).toBeGreaterThanOrEqual(1);
        for (const s of comp.sources) {
          expect(s.url).toMatch(/^https?:\/\//);
          expect(s.label).not.toBe('');
        }
      }
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(1);
    }
  });

  it('points baseline sources at the site ranking doc', () => {
    const r = scoreCandidate(input(online('x')));
    for (const name of ['ethics', 'env', 'proximity']) {
      expect(r.components.find((c) => c.name === name)?.sources[0]?.url).toBe(DOC);
    }
  });

  it('attaches band, relation and cost to every negative signal, defaulting a missing relation to self (ADR 0006)', () => {
    const sig = negative('labor', 1, { penalty_usd: 50_000, relation: undefined });
    const r = scoreCandidate(input(online('x'), [], [sig]));
    expect(r.signals[0]).toMatchObject({ band: 'minor', relation: 'self', cost: 0.0625 });
  });

  it('leaves positive signals and certifications untouched', () => {
    const positive: Signal = { ...negative('labor'), polarity: 'positive' };
    const r = scoreCandidate(input(online('x'), [], [positive]));
    expect(r.signals[0]).toEqual(positive);
  });

  it('flags minor_cap_applied on ethics only when the cap actually reduced the total, and never on relevance or proximity', () => {
    const rows = [1, 2, 3, 4, 5].map((n) => negative('labor', n, { penalty_usd: 0 }));
    const r = scoreCandidate(input(online('x'), [], rows));
    expect(r.components.find((c) => c.name === 'ethics')?.minor_cap_applied).toBe(true);
    expect(r.components.find((c) => c.name === 'env')?.minor_cap_applied).toBe(false);
    expect(r.components.find((c) => c.name === 'relevance')?.minor_cap_applied).toBeUndefined();
    expect(r.components.find((c) => c.name === 'proximity')?.minor_cap_applied).toBeUndefined();
  });
});

describe('rankByScore', () => {
  it('ranks by score descending and keeps input order on ties', () => {
    const rows = [
      { id: 'a', score: 0.5 },
      { id: 'b', score: 0.7 },
      { id: 'c', score: 0.5 },
    ];
    expect(rankByScore(rows).map((r) => [r.id, r.rank])).toEqual([['b', 1], ['a', 2], ['c', 3]]);
  });
});
