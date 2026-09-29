import { describe, expect, it, vi } from 'vitest';
import { BRAVE_COUNT } from '../src/brave';
import { MAX_LOCAL_QUERIES } from '../src/pipeline';
import type { Candidate } from '../src/contract';
import {
  LLM_SNIPPET_CHARS,
  LLM_TITLE_CHARS,
  MAX_LLM_LOCAL,
  MAX_LLM_ONLINE,
  acceptClassifications,
  certificationsFor,
  chainFor,
  chainLabel,
  enrichAll,
  llmView,
  negativesFor,
  type CuratedData,
  type EnrichOutput,
} from '../src/enrich';
import { createLlmClient } from '../src/llm';
import { mapPlaceResults, mapWebResults } from '../src/brave';
import { defaultRoutes, makeFixtureFetch } from '../../tests/fixtures/fixture-fetch';
import web1 from '../../tests/fixtures/brave/web-1.json';
import place1 from '../../tests/fixtures/brave/place-1.json';

const REGISTRY = new Set(['ftc.gov', 'osha.gov']);
const PRODUCT = { canonical_name: 'cast iron skillet', category: 'cookware' };

function candidate(overrides: Partial<Candidate>): Candidate {
  return {
    kind: 'online', name: 'Shop', domain: 'shop.example', url: 'https://shop.example/', title: 'Shop', snippet: '',
    address: null, lat: null, lon: null, place_id: null, ...overrides,
  };
}

describe('llmView', () => {
  it('sends the model every local candidate the place searches can return', () => {
    expect(MAX_LLM_LOCAL).toBeGreaterThanOrEqual(MAX_LOCAL_QUERIES * BRAVE_COUNT);
  });

  it('projects to five keys and applies the caps', () => {
    const many = Array.from({ length: MAX_LLM_ONLINE + 5 }, (_, i) =>
      candidate({ domain: `s${i}.example`, title: 'T'.repeat(500), snippet: 'S'.repeat(1000), address: '1 Main St', lat: 39.8, lon: -89.6, place_id: 'p' }));
    const view = llmView(many);
    expect(view).toHaveLength(MAX_LLM_ONLINE);
    expect(view[0]!.domain).toBe('s0.example');
    expect(view.map((v) => v.id)).toEqual(Array.from({ length: MAX_LLM_ONLINE }, (_, i) => `c${i}`));
    for (const v of view) {
      expect(Object.keys(v).sort()).toEqual(['domain', 'id', 'snippet', 'title', 'url']);
      expect(v.title).toHaveLength(LLM_TITLE_CHARS);
      expect(v.snippet).toHaveLength(LLM_SNIPPET_CHARS);
    }
  });

  it('with a kind, keeps only that kind and each candidate\'s index in the whole list as its id', () => {
    const list = [candidate({ domain: 'a.example' }), candidate({ kind: 'local', domain: 'b.example', place_id: 'p' }), candidate({ domain: 'c.example' })];
    expect(llmView(list, 'online').map((v) => v.id)).toEqual(['c0', 'c2']);
    expect(llmView(list, 'local').map((v) => v.id)).toEqual(['c1']);
    expect(llmView(list, 'local')).toEqual(llmView(list).filter((v) => v.domain === 'b.example'));
  });
});

describe('acceptClassifications: store_breadth', () => {
  const view = [{ id: 'c0', domain: 'shop.example', title: 'Shop', snippet: '', url: 'https://shop.example/' }];
  const reply = (store_breadth: string): EnrichOutput => ({
    candidates: [{ id: 'c0', site_type: 'retailer', sells_product: 'yes', store_breadth }],
  });

  it.each(['specialist', 'general', 'unknown'])('accepts "%s"', (value) => {
    expect(acceptClassifications(reply(value), view).get('c0')).toEqual({
      site_type: 'retailer', sells_product: 'yes', store_breadth: value,
    });
  });

  it('a made-up value leaves store_breadth null and keeps sells_product', () => {
    expect(acceptClassifications(reply('department_store'), view).get('c0')).toEqual({
      site_type: 'retailer', sells_product: 'yes', store_breadth: null,
    });
  });

  it('a missing value leaves store_breadth null', () => {
    const missing: EnrichOutput = { candidates: [{ id: 'c0', site_type: 'retailer', sells_product: 'yes' }] };
    expect(acceptClassifications(missing, view).get('c0')).toEqual({
      site_type: 'retailer', sells_product: 'yes', store_breadth: null,
    });
  });
});

describe('curated lookups', () => {
  const data: CuratedData = {
    certifications: [
      { domain: 'shop.example', kind: 'b_corp', source_url: 'https://cert.example/a', checked: '2026-09-23' },
      { domain: 'shop.example', kind: 'one_percent_planet', source_url: 'https://cert.example/b', checked: '2026-09-23' },
      { domain: 'else.example', kind: 'fair_trade', source_url: 'https://cert.example/c', checked: '2026-09-23' },
    ],
    negatives: [{
      domain: 'shop.example', kind: 'governance', claim: 'Agency page title', source_url: 'https://www.ftc.gov/x', action_date: '2022-04-08',
      penalty_usd: 1_000_000, relation: 'self', status: 'final',
    }],
    chains: [{ domain: 'shop.example', name: 'Shop', stores: 50, source_url: 'https://cert.example/chain', checked: '2026-09-23' }],
  };

  it('attaches every certification row for a domain with its badge label', () => {
    expect(certificationsFor('shop.example', data.certifications)).toEqual([
      { kind: 'b_corp', label: 'B Corp', source_url: 'https://cert.example/a', checked: '2026-09-23' },
      { kind: 'one_percent_planet', label: '1% for the Planet', source_url: 'https://cert.example/b', checked: '2026-09-23' },
    ]);
    expect(certificationsFor('none.example', data.certifications)).toEqual([]);
  });

  it('builds the chain badge for a domain in data.chains, "Chain, <count> stores"', () => {
    expect(chainFor('shop.example', data.chains)).toEqual({
      label: 'Chain, 50 stores', stores: 50, source_url: 'https://cert.example/chain', checked: '2026-09-23',
    });
    expect(chainFor('none.example', data.chains)).toBeNull();
  });

  it('marks a floor count with a "+" in the label', () => {
    expect(chainLabel({ stores: 30, stores_at_least: true })).toBe('Chain, 30+ stores');
    expect(chainLabel({ stores: 30 })).toBe('Chain, 30 stores');
  });

  it('formats the count with thousands separators', () => {
    expect(chainLabel({ stores: 5000, stores_at_least: true })).toBe('Chain, 5,000+ stores');
    expect(chainLabel({ stores: 1995 })).toBe('Chain, 1,995 stores');
  });

  it('adds "dealer-owned" to the label when the row\'s note says so, but not otherwise', () => {
    expect(chainLabel({ stores: 5000, stores_at_least: true, note: 'dealer-owned: stores are independently owned' })).toBe('Chain, 5,000+ stores, dealer-owned');
    expect(chainLabel({ stores: 1995, note: 'more than 2,000 stores in the U.S.' })).toBe('Chain, 1,995 stores');
    expect(chainLabel({ stores: 1995 })).toBe('Chain, 1,995 stores');
  });

  it('attaches curated negatives without needing a fetched URL', () => {
    expect(negativesFor('shop.example', data.negatives)).toEqual([
      {
        kind: 'governance', polarity: 'negative', claim: 'Agency page title', source_url: 'https://www.ftc.gov/x', origin: 'curated', action_date: '2022-04-08',
        penalty_usd: 1_000_000, relation: 'self', status: 'final',
      },
    ]);
  });

  it('enrichAll joins curated data and the model reply for every candidate', async () => {
    const fetch = makeFixtureFetch(defaultRoutes());
    const llm = createLlmClient({ fetch, apiKey: 'k', siteUrl: 'https://site.example', siteName: 'test' });
    const pass1 = [...mapWebResults(web1, REGISTRY).filter((c) => c.domain.endsWith('.example')), candidate({})];
    const rows = await enrichAll(pass1, llm, data, PRODUCT);
    expect(rows.map((r) => r.candidate)).toEqual(pass1);
    const shopRow = rows.find((r) => r.candidate.domain === 'shop.example')!;
    expect(shopRow.certifications).toHaveLength(2);
    expect(shopRow.signals).toEqual([expect.objectContaining({ origin: 'curated' })]);
    expect(shopRow.chain).toEqual({ label: 'Chain, 50 stores', stores: 50, source_url: 'https://cert.example/chain', checked: '2026-09-23' });
    expect(rows.find((r) => r.candidate.domain === 'granite-outfitters.example')!.chain).toBeNull();
    // The reply's one classification (c0, the first candidate) lands on its row; the model is
    // not asked for signals, so a shop with no curated row has none.
    expect(rows[0]!.classification).toEqual({ site_type: 'retailer', sells_product: 'yes', store_breadth: 'specialist' });
    expect(rows.find((r) => r.candidate.domain === 'blue-heron-goods.example')!.signals).toEqual([]);
    expect(llm.usage.map((u) => u.call)).toEqual(['enrich']);
  });

  it('enrichAll with no candidates makes no LLM call', async () => {
    const llm = { usage: [], complete: vi.fn() };
    expect(await enrichAll([], llm as never, data, PRODUCT)).toEqual([]);
    expect(llm.complete).not.toHaveBeenCalled();
  });

  it('local candidates never send location fields to the model', () => {
    const view = llmView(mapPlaceResults(place1, REGISTRY));
    expect(JSON.stringify(view)).not.toMatch(/Main St|39\.78|-89\.63|postal|coordinates/);
  });
});
