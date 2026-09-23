import { describe, expect, it } from 'vitest';
import type { Candidate, CertKind, Certification, Normalized, Signal, SignalKind } from '../src/contract';
import { WEIGHTS } from '../ranking/weights';
import { env, ethics, proximity, rankByScore, relevance, scoreCandidate } from '../ranking/score';

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

function negative(kind: SignalKind, n = 1): Signal {
  return {
    kind, polarity: 'negative', claim: `Case ${n}`, source_url: `https://www.ftc.gov/case-${kind}-${n}`,
    origin: 'curated', action_date: '2024-01-01',
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
    expect(fn([], [], DOC)).toEqual({ value: 0.5, sources: [{ label: 'Baseline 0.5', url: DOC }] });
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
      value: 0.92, distance_km: 3.2, sources: [{ label: '3.2 km from your zip area', url: DOC }],
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
