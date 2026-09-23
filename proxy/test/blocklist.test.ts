/// <reference types="node" />
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import cases from '../../tests/fixtures/blocklist-cases.json';
import list from '../../data/blocklist.json';
import {
  filterBlocked,
  isBlocked,
  isBlockedDomain,
  isBlockedName,
  isBlockedUrl,
  mentionsAmazon,
  normalizeName,
  scrubBlockedText,
} from '../src/blocklist';
import { registrableDomain } from '../src/domain';

type Case = (typeof cases)[number] & { website?: string };

function outcome(c: Case): string {
  switch (c.kind) {
    case 'domain':
      return isBlockedDomain(c.input) ? 'blocked' : 'allowed';
    case 'url':
      if (registrableDomain(c.input) === null) return 'dropped';
      return isBlockedUrl(c.input) ? 'blocked' : 'allowed';
    case 'name':
      return isBlockedName(c.input) ? 'blocked' : 'allowed';
    case 'local':
      return isBlocked({ name: c.input, domain: registrableDomain(c.website ?? ''), url: c.website })
        ? 'blocked'
        : 'allowed';
    default:
      throw new Error(`unknown fixture kind ${c.kind}`);
  }
}

describe('blocklist fixtures', () => {
  it('covers every category the definition of done names', () => {
    const all = cases as Case[];
    expect(all.length).toBeGreaterThanOrEqual(20);
    expect(all.some((c) => c.input === 'Whole Foods Co-op' && c.expected === 'allowed')).toBe(true);
    expect(new Set(all.map((c) => c.id)).size).toBe(all.length);
  });

  it.each(cases as Case[])('$id $kind $input -> $expected', (c) => {
    expect(outcome(c)).toBe(c.expected);
  });
});

describe('registrableDomain', () => {
  it.each([
    ['www.amazon.co.uk', 'amazon.co.uk'],
    ['WWW.Amazon.COM', 'amazon.com'],
    ['https://shop.example.org/a/b?c=d', 'example.org'],
    ['https://example.org:8080/', 'example.org'],
    ['https://example.org./', 'example.org'],
    ['example.org.', 'example.org'],
  ])('%s -> %s', (input, expected) => {
    expect(registrableDomain(input)).toBe(expected);
  });

  it.each(['', '   ', 'amazon', 'not a url', 'http://192.0.2.1/', '192.0.2.1', 'https://[::1]/', 'ftp://amazon.com/', 'https://'])(
    '%j -> null',
    (input) => {
      expect(registrableDomain(input)).toBeNull();
    },
  );
});

describe('normalizeName', () => {
  it.each([
    ['  Whole   Foods\tMarket ', 'whole foods market'],
    ['Whole Foods Market – Midtown', 'whole foods market midtown'],
    ['Amazon★Go', 'amazon go'],
    ['Amazon™Fresh', 'amazon fresh'],
    ['ＡＭＡＺＯＮ', 'amazon'],
    ['Ama​zon', 'amazon'],
    ['Ama̴zon', 'amazon'],
    ['Café Luna', 'cafe luna'],
    ['Amazo\u0144 Fresh', 'amazon fresh'],
  ])('%j -> %j', (input, expected) => {
    expect(normalizeName(input)).toBe(expected);
  });
});

describe('isBlockedUrl', () => {
  it('decodes the path and query once, not twice', () => {
    // One decode leaves "amazon%2Ecom", which holds no host token; a second decode would block.
    expect(isBlockedUrl('https://deals.example/?u=amazon%252Ecom')).toBe(false);
    expect(isBlockedUrl('https://deals.example/?u=amazon%2Ecom')).toBe(true);
  });

  it('treats a malformed percent sequence as blocked', () => {
    expect(isBlockedUrl('https://deals.example/?u=%E0%A4%A')).toBe(true);
  });

  it('checks the URL host too, so it is safe to call alone', () => {
    expect(isBlockedUrl('https://www.amazon.com/')).toBe(true);
    expect(isBlockedUrl('https://www.lodgecastiron.com/')).toBe(false);
  });

  it('scans the fragment', () => {
    expect(isBlockedUrl('https://deals.example/#https://amazon.com/')).toBe(true);
    expect(isBlockedUrl('https://deals.example/#reviews')).toBe(false);
  });

  it('blocks a non-http scheme', () => {
    expect(isBlockedUrl('javascript:alert(1)')).toBe(true);
    expect(isBlockedUrl('ftp://files.example/')).toBe(true);
  });
});

describe('mentionsAmazon', () => {
  it.each([
    ['Cheaper on Amazon?', true],
    ['Cheaper on \uff21\uff4d\uff41\uff5a\uff4f\uff4e?', true],
    ['Cheaper on Ama\u200bzon?', true],
    ['Cheaper on Amazon\u200bFresh', true],
    ['Cheaper on \u{1d400}\u{1d426}\u{1d41a}\u{1d433}\u{1d428}\u{1d427}', true],
    ['AmazonBasics skillet', true],
    ['Amazonia Plants', false],
    ['Cast iron skillet', false],
  ])('%j -> %s', (text, expected) => {
    expect(mentionsAmazon(text)).toBe(expected);
  });
});

describe('isBlocked and filterBlocked', () => {
  it('fails closed on a missing domain', () => {
    expect(isBlocked({ name: 'Corner Hardware', domain: null })).toBe(true);
    expect(isBlocked({ name: 'Corner Hardware', domain: undefined })).toBe(true);
    expect(isBlocked({ name: 'Corner Hardware', domain: '' })).toBe(true);
    expect(isBlocked({ name: 'Corner Hardware', domain: 'cornerhardware.example' })).toBe(false);
  });

  it('blocks a row whose url host disagrees with its domain field', () => {
    expect(isBlocked({ name: 'Lodge', domain: 'lodgecastiron.com', url: 'https://www.amazon.com/dp/B0' })).toBe(true);
  });

  it('keeps only unblocked items, in order', () => {
    const rows = [
      { retailer: { name: 'Lodge', domain: 'lodgecastiron.com', url: 'https://www.lodgecastiron.com/' } },
      { retailer: { name: 'Amazon', domain: 'amazon.com', url: 'https://www.amazon.com/dp/B0' } },
      { retailer: { name: 'Deals', domain: 'deals.example', url: 'https://deals.example/?u=https://amzn.to/x' } },
      { retailer: { name: 'Whole Foods Market - Midtown', domain: 'grocer.example', url: 'https://grocer.example/' } },
      { retailer: { name: 'Corner Hardware', domain: 'cornerhardware.example', url: 'https://cornerhardware.example/' } },
    ];
    const kept = filterBlocked(rows, (r) => r.retailer).map((r) => r.retailer.name);
    expect(kept).toEqual(['Lodge', 'Corner Hardware']);
  });
});

describe('scrubBlockedText', () => {
  it.each([
    ['Amazon Basics cast iron skillet', 'Basics cast iron skillet'],
    ['skillet like  Whole Foods Market sells', 'skillet like sells'],
    ['AMAZON-fresh produce', 'produce'],
    ['cast-iron skillet, 10.25 inch', 'cast-iron skillet, 10.25 inch'],
    ['Amazonia plants', 'Amazonia plants'],
    ['amazon', ''],
    ['Amazon™ Fresh produce', 'produce'],
    ['Amazon​Fresh produce', 'produce'],
    ['Ama​zon skillet', 'skillet'],
    ['Ama̴zon skillet', 'skillet'],
    ['skillet under $50', 'skillet under $50'],
    ['cast\u200biron skillet 🍳', 'cast\u200biron skillet 🍳'],
    ['Amazo\u0144 Fresh produce', 'produce'],
    ['AmazonBasics skillet', 'skillet'],
    ['Café skillet', 'Café skillet'],
  ])('%j -> %j', (input, expected) => {
    expect(scrubBlockedText(input)).toBe(expected);
  });

  it('removes every name entry as a whole phrase', () => {
    for (const n of list.names) expect(scrubBlockedText(`buy ${n.name} now`), n.name).toBe('buy now');
  });
});

describe('data/blocklist.json', () => {
  const md = readFileSync(new URL('../../data/blocklist.md', import.meta.url), 'utf8');
  const entries = [...list.domains, ...list.names];

  it('gives every entry a fetched source and a check date', () => {
    for (const e of entries) {
      const redirect = e.source_kind === 'http-redirect' && /^https:\/\/\S+ -> \d{3} https?:\/\/\S+$/.test(e.source);
      expect(redirect || e.source.startsWith('https://'), e.source).toBe(true);
      expect(e.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('uses only known rule kinds', () => {
    for (const d of list.domains) expect(['exact', 'label-any-suffix']).toContain(d.kind);
    for (const n of list.names) expect(['exact', 'prefix-word']).toContain(n.match);
  });

  it('blocks names after the bare "Whole Foods" but lets its co-op exceptions pass', () => {
    expect(isBlockedName('Whole Foods - Midtown')).toBe(true);
    for (const n of ['Whole Foods Co-op', 'Whole Foods Cooperative']) expect(isBlockedName(n), n).toBe(false);
  });

  it('documents every entry in blocklist.md', () => {
    for (const d of list.domains) expect(md, d.pattern).toContain(`| ${d.pattern} |`);
    for (const n of list.names) expect(md, n.name).toContain(`| ${n.name} |`);
  });

  it('blocks every name entry as spelled in the list', () => {
    for (const n of list.names) expect(isBlockedName(n.name), n.name).toBe(true);
    expect(normalizeName('Amazon 4-star')).toBe(normalizeName('Amazon 4-Star'));
  });
});
