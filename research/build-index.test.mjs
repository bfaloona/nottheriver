import { describe, it, expect } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { stringify } from 'yaml';
import { rateRetailer, blocklistMatch, isAcceptedSource, splitFrontMatter, buildIndex } from './build-index.mjs';

const TODAY = '2026-09-25';
const cert = (kind) => ({ kind, source: 'https://www.bcorporation.net/x', checked: TODAY, verified_this_run: true });
const concern = (kind, date = '2025-01-01', source = 'https://www.osha.gov/news/x') => ({ kind, title: 'T', source, date, accepted_source: true });

describe('rateRetailer', () => {
  it('starts both components at 0.5 and rates an unknown shop acceptable', () => {
    expect(rateRetailer({ today: TODAY })).toEqual({ ethics: 0.5, environment: 0.5, tier: 'acceptable' });
  });

  it('counts a certification kind once and recommends at 1.25', () => {
    expect(rateRetailer({ certifications: [cert('b_corp'), cert('b_corp')], today: TODAY })).toEqual({ ethics: 0.75, environment: 0.5, tier: 'recommended' });
  });

  it('caps before subtracting, so a finding still costs 0.25 at full certification', () => {
    const r = rateRetailer({ certifications: ['b_corp', 'fair_trade', 'worker_coop'].map(cert), concerns: [concern('labor')], today: TODAY });
    expect(r.ethics).toBe(0.75);
  });

  it('counts a concern once per kind and source page', () => {
    expect(rateRetailer({ concerns: [concern('labor'), concern('labor')], today: TODAY }).ethics).toBe(0.25);
  });

  it('floors at 0 and puts environmental findings in environment', () => {
    const cs = ['a', 'b', 'c'].map((s) => concern('environmental', '2025-01-01', `https://www.epa.gov/${s}`));
    expect(rateRetailer({ concerns: cs, today: TODAY })).toMatchObject({ ethics: 0.5, environment: 0, tier: 'caution' });
  });

  it('ignores concerns from sources that are not accepted', () => {
    expect(rateRetailer({ concerns: [{ ...concern('labor'), accepted_source: false }], today: TODAY }).ethics).toBe(0.5);
  });

  it('withholds recommended for an accepted concern in the last 5 years, but not an older one', () => {
    const certs = ['b_corp', 'fair_trade', 'one_percent_planet'].map(cert);
    expect(rateRetailer({ certifications: certs, concerns: [concern('labor', '2022-01-01')], today: TODAY }).tier).toBe('acceptable');
    expect(rateRetailer({ certifications: certs, concerns: [concern('labor', '2019-01-01')], today: TODAY }).tier).toBe('recommended');
    expect(rateRetailer({ certifications: certs, concerns: [concern('labor', 'unknown')], today: TODAY }).tier).toBe('acceptable');
  });

  it('excludes Amazon-owned retailers whatever their score', () => {
    expect(rateRetailer({ certifications: [cert('b_corp')], amazon_owned: true, today: TODAY }).tier).toBe('excluded');
  });
});

describe('source and blocklist checks', () => {
  it('accepts a subdomain of a listed negative source', () => {
    expect(isAcceptedSource('https://www.osha.gov/news/x')).toBe(true);
    expect(isAcceptedSource('https://www.nytimes.com/x')).toBe(false);
  });

  it('matches Amazon-owned companies by domain label and by name', () => {
    expect(blocklistMatch('Amazon', 'amazon.co.uk')).toBeTruthy();
    expect(blocklistMatch('Whole Foods Market', 'wholefoodsmarket.com')).toBeTruthy();
    expect(blocklistMatch('Bookshop.org', 'bookshop.org')).toBeNull();
  });
});

describe('splitFrontMatter', () => {
  it('rejects a file without front matter', () => {
    expect(() => splitFrontMatter('# no front matter')).toThrow('no front matter');
  });
});

describe('buildIndex', () => {
  const md = (fm, body = '## Sources\n- https://example.org/a\n') => `---\n${stringify(fm)}---\n\n${body}`;
  const site = {
    name: 'Example List', domain: 'example.org', url: 'https://example.org/list', kind: 'article', category: 'ethical-affirmative', also: [],
    score: 50, score_parts: { independence: 10, evidence: 10, substance: 10, currency: 10, usefulness: 5, no_dark_patterns: 5 },
    affiliate_links: 'none', owner: 'unknown', updated: 'unknown', retailers_listed: 3, amazon_owned_recommended: [], checked: TODAY,
  };
  const retailer = {
    name: 'Shop', domain: 'shop.example', type: 'retailer', goods: ['books'], ownership: 'unknown', parent: 'unknown', hq: 'unknown',
    marketplace: 'unknown', sells_on_amazon: 'unknown', amazon_owned: false, certifications: [], concerns: [],
    ethics: 0.5, environment: 0.5, tier: 'acceptable', mentions: 1, mentioned_by: ['example-org'], checked: TODAY,
  };
  const setup = (files) => {
    const root = mkdtempSync(join(tmpdir(), 'research-'));
    for (const d of ['sites', 'retailers']) mkdirSync(join(root, d));
    for (const [p, text] of Object.entries(files)) writeFileSync(join(root, p), text);
    return root;
  };

  it('indexes valid files', () => {
    const { errors, index } = buildIndex(setup({ 'sites/example-org.md': md(site), 'retailers/shop-example.md': md(retailer) }));
    expect(errors).toEqual([]);
    expect(index.sites[0].slug).toBe('example-org');
    expect(index.retailers).toHaveLength(1);
  });

  it('reports arithmetic, naming, sourcing and cross-reference errors', () => {
    const { errors } = buildIndex(setup({
      'sites/wrong-name.md': md({ ...site, score: 99 }, 'no sources'),
      'retailers/shop-example.md': md({ ...retailer, ethics: 0.75, tier: 'recommended', mentions: 2, mentioned_by: ['missing-site'] }),
    }));
    const text = errors.join('\n');
    for (const needle of ['file name should be example-org.md', 'score is 99', 'Sources', 'ethics is 0.75', 'tier is', 'mentions is 2', 'missing-site']) {
      expect(text).toContain(needle);
    }
  });

  it('rejects an unverified certification with no curated row, and a wrong accepted_source', () => {
    const r = {
      ...retailer,
      certifications: [{ kind: 'b_corp', source: 'https://www.bcorporation.net/x', checked: TODAY, verified_this_run: false }],
      concerns: [{ kind: 'labor', title: 'T', source: 'https://www.nytimes.com/x', date: '2025-01-01', accepted_source: true }],
    };
    const { errors } = buildIndex(setup({ 'sites/example-org.md': md(site), 'retailers/shop-example.md': md(r) }));
    expect(errors.join('\n')).toMatch(/no matching row in data\/certifications.json[\s\S]*accepted_source must be false/);
  });
});
