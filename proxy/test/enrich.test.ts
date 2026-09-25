import { describe, expect, it, vi } from 'vitest';
import { BRAVE_COUNT } from '../src/brave';
import { MAX_LOCAL_QUERIES } from '../src/pipeline';
import type { Candidate } from '../src/contract';
import {
  LLM_SNIPPET_CHARS,
  LLM_TITLE_CHARS,
  MAX_LLM_LOCAL,
  MAX_LLM_ONLINE,
  acceptSignals,
  certificationsFor,
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
import enrichFixture from '../../tests/fixtures/llm/enrich.json';

const REGISTRY = new Set(['ftc.gov', 'osha.gov']);
const PRODUCT = { canonical_name: 'cast iron skillet', category: 'cookware' };

function candidate(overrides: Partial<Candidate>): Candidate {
  return {
    kind: 'online', name: 'Shop', domain: 'shop.example', url: 'https://shop.example/', title: 'Shop', snippet: '',
    address: null, lat: null, lon: null, place_id: null, ...overrides,
  };
}

const shop = candidate({ name: 'Riverbend Hardware', domain: 'riverbend-hardware.example', url: 'https://riverbend-hardware.example/pans', title: 'Pans | Riverbend Hardware' });
const osha = candidate({ name: 'OSHA', domain: 'osha.gov', url: 'https://www.osha.gov/news/fixture', title: 'Fixture release naming Riverbend Hardware', snippet: 'Inspection results.' });
const oshaUnrelated = candidate({ name: 'OSHA', domain: 'osha.gov', url: 'https://www.osha.gov/news/other', title: 'Fixture release about another company' });
const blog = candidate({ name: 'Cookware Blog', domain: 'blog.example', url: 'https://blog.example/review', title: 'Review of Riverbend Hardware skillets' });
const other = candidate({ name: 'Other Shop', domain: 'other.example', url: 'https://other.example/', title: 'Other Shop' });

const signal = (source_url: string, polarity: 'positive' | 'negative' = 'positive', kind: 'labor' | 'governance' | 'environmental' = 'labor') =>
  ({ kind, polarity, claim: 'MODEL PROSE', source_url, confidence: 0.9 });
const output = (domain: string, ...signals: ReturnType<typeof signal>[]): EnrichOutput => ({ retailers: [{ domain, signals }], candidates: [] });

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
});

describe('acceptSignals', () => {
  const all = [shop, osha, oshaUnrelated, blog, other];

  it('drops a retailer domain that was never fetched', () => {
    expect(acceptSignals(output('unknown.example', signal(shop.url)), all, REGISTRY).size).toBe(0);
  });

  it('drops a signal whose source was not fetched', () => {
    expect(acceptSignals(output(shop.domain, signal('https://riverbend-hardware.example/elsewhere')), all, REGISTRY).size).toBe(0);
  });

  // Its claim would be the shop's own page title, which says nothing about labor or the environment.
  it('drops a positive citing the retailer\'s own page', () => {
    expect(acceptSignals(output('www.riverbend-hardware.example', signal(`${shop.url}/`, 'positive', 'environmental')), all, REGISTRY).size).toBe(0);
  });

  it('keeps a positive from another fetched page only when that page names the retailer', () => {
    expect(acceptSignals(output(shop.domain, signal(blog.url)), all, REGISTRY).get(shop.domain)).toHaveLength(1);
    expect(acceptSignals(output(shop.domain, signal(other.url)), all, REGISTRY).size).toBe(0);
  });

  it('drops a negative from a domain outside the registry even when it names the retailer', () => {
    expect(acceptSignals(output(shop.domain, signal(blog.url, 'negative')), all, REGISTRY).size).toBe(0);
  });

  it('keeps a registry negative that names the retailer and drops one that does not', () => {
    const kept = acceptSignals(output(shop.domain, signal(osha.url, 'negative')), all, REGISTRY).get(shop.domain);
    expect(kept).toEqual([{ kind: 'labor', polarity: 'negative', claim: osha.title, source_url: osha.url, origin: 'llm', action_date: null }]);
    expect(acceptSignals(output(shop.domain, signal(oshaUnrelated.url, 'negative')), all, REGISTRY).size).toBe(0);
  });

  it('matches the retailer by its domain label as well as its name', () => {
    const page = candidate({ domain: 'osha.gov', url: 'https://www.osha.gov/news/label', title: 'Case about riverbend-hardware.example' });
    const result = acceptSignals(output(shop.domain, signal(page.url, 'negative')), [shop, page], REGISTRY);
    expect(result.get(shop.domain)).toHaveLength(1);
  });

  it('counts a repeated signal once', () => {
    const result = acceptSignals(output(shop.domain, signal(blog.url), signal(`${blog.url}/`)), all, REGISTRY);
    expect(result.get(shop.domain)).toHaveLength(1);
  });

  it('ignores a malformed source URL', () => {
    expect(acceptSignals(output(shop.domain, signal('not a url')), all, REGISTRY).size).toBe(0);
  });

  it('applies the rules to the enrich fixture over the fixture candidates', () => {
    const fetched = mapWebResults(web1, REGISTRY);
    const content = JSON.parse(enrichFixture.choices[0]!.message.content) as EnrichOutput;
    const result = acceptSignals(content, fetched, REGISTRY);
    // Blue Heron's own-page positive is dropped; the FTC negative (not a mention of it), the unfetched
    // page, Granite's own-page negative and the unknown shop fall to the other rules.
    expect(content.retailers.flatMap((r) => r.signals).some((s) => s.source_url === 'https://blue-heron-goods.example/cast-iron')).toBe(true);
    expect(result.size).toBe(0);
  });
});

describe('curated lookups', () => {
  const data: CuratedData = {
    certifications: [
      { domain: 'shop.example', kind: 'b_corp', source_url: 'https://cert.example/a', checked: '2026-09-23' },
      { domain: 'shop.example', kind: 'one_percent_planet', source_url: 'https://cert.example/b', checked: '2026-09-23' },
      { domain: 'else.example', kind: 'fair_trade', source_url: 'https://cert.example/c', checked: '2026-09-23' },
    ],
    negatives: [{ domain: 'shop.example', kind: 'governance', claim: 'Agency page title', source_url: 'https://www.ftc.gov/x', action_date: '2022-04-08' }],
    negativeSources: REGISTRY,
  };

  it('attaches every certification row for a domain with its badge label', () => {
    expect(certificationsFor('shop.example', data.certifications)).toEqual([
      { kind: 'b_corp', label: 'B Corp', source_url: 'https://cert.example/a', checked: '2026-09-23' },
      { kind: 'one_percent_planet', label: '1% for the Planet', source_url: 'https://cert.example/b', checked: '2026-09-23' },
    ]);
    expect(certificationsFor('none.example', data.certifications)).toEqual([]);
  });

  it('attaches curated negatives without needing a fetched URL', () => {
    expect(negativesFor('shop.example', data.negatives)).toEqual([
      { kind: 'governance', polarity: 'negative', claim: 'Agency page title', source_url: 'https://www.ftc.gov/x', origin: 'curated', action_date: '2022-04-08' },
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
    // The reply's one classification (c0, the first candidate) lands on its row; its only
    // acceptable-looking signal cites the shop's own page and is dropped.
    expect(rows[0]!.classification).toEqual({ site_type: 'retailer', sells_product: 'yes' });
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
