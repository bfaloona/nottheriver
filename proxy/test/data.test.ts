/// <reference types="node" />
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import certifications from '../../data/certifications.json';
import negatives from '../../data/negatives.json';
import registry from '../../data/negative-sources.json';
import type { CertKind, SignalKind } from '../src/contract';
import { registrableDomain } from '../src/domain';
import { negativesFor, type NegativeRow } from '../src/enrich';
import { ENV, ETHICS, findingCost } from '../ranking/score';

// The JSON import types `relation`/`status`/`citation_type` as plain strings; the row test below
// checks each against its contract union, which is what makes this cast safe.
type NegativeEntry = NegativeRow & { name: string; checked: string; note?: string };
const negativeEntries = negatives.entries as unknown as NegativeEntry[];

// Records keyed by the contract unions, so adding or renaming a kind fails typecheck here.
const CERT_KINDS = {
  b_corp: 'ethics', fair_trade: 'ethics', worker_coop: 'ethics',
  one_percent_planet: 'env', climate_neutral: 'env',
  independent_retailer_assoc: 'unscored',
} as const satisfies Record<CertKind, string>;
const SIGNAL_KINDS = { labor: true, governance: true, environmental: true } satisfies Record<SignalKind, true>;

const DATE = /^\d{4}-\d{2}-\d{2}$/;
// ADR 0006 (weighted findings)
const RELATIONS = ['self', 'related-at-shop', 'related'];
const STATUSES = ['final', 'open'];
const CITATION_TYPES = ['willful', 'repeat', 'serious', 'other'];
const AMOUNT_STATED_DOMAINS = ['osha.gov', 'oag.ca.gov'];
// A citation type comes off an inspection's own citation-type column, which exists only on an
// inspection-detail page; a settlement press release elsewhere on osha.gov has no such column.
const OSHA_INSPECTION = /^https:\/\/www\.osha\.gov\/ords\/imis\/establishment\.inspection_detail\?/;

function expectSourced(e: { domain: string; source_url: string; checked: string }) {
  expect(e.source_url, e.domain).toMatch(/^https:\/\//);
  expect(e.checked, e.domain).toMatch(DATE);
  expect(registrableDomain(e.domain), e.domain).toBe(e.domain);
}

function markdownRows() {
  const md = readFileSync(new URL('../../data/negative-sources.md', import.meta.url), 'utf8');
  return md
    .split('\n')
    .filter((line) => line.startsWith('|'))
    .map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()))
    .filter(([domain]) => domain !== 'domain' && !domain!.startsWith('-'))
    .map(([domain, organization, rationale, verified_via, checked]) => ({ domain, organization, rationale, verified_via, checked }));
}

function expectUnique(keys: string[]) {
  expect(keys.filter((k, i) => keys.indexOf(k) !== i)).toEqual([]);
}

const registryDomains = new Set(registry.sources.map((s) => s.domain));

describe('certifications.json', () => {
  it.each(certifications.entries)('$domain $kind is sourced and well formed', (e) => {
    expectSourced(e);
    expect(e.name).not.toBe('');
    expect(Object.keys(CERT_KINDS)).toContain(e.kind);
  });

  it('groups kinds into score components as the ranking rules say', () => {
    const byKind = Object.entries(certifications.kinds).flatMap(([group, kinds]) => kinds.map((k) => [k, group]));
    expect(Object.fromEntries(byKind)).toEqual(CERT_KINDS);
  });

  it('has one row per domain and kind', () => {
    expectUnique(certifications.entries.map((e) => `${e.domain} ${e.kind}`));
  });

  // score.ts hardcodes its own ETHICS/ENV.certs lists rather than reading this file's `kinds`
  // map, so nothing else catches the two drifting apart if one side gets a cert kind added,
  // renamed or moved.
  it("matches score.ts's ETHICS and ENV cert lists exactly", () => {
    expect([...ETHICS.certs].sort()).toEqual([...certifications.kinds.ethics].sort());
    expect([...ENV.certs].sort()).toEqual([...certifications.kinds.env].sort());
  });
});

describe('negatives.json', () => {
  it.each(negativeEntries)('$domain $kind is sourced from an accepted registry domain', (e) => {
    expectSourced(e);
    expect(e.name).not.toBe('');
    expect(Object.keys(SIGNAL_KINDS)).toContain(e.kind);
    expect(e.action_date).toMatch(DATE);
    expect(e.claim).not.toBe('');
    expect(registryDomains).toContain(registrableDomain(e.source_url));
  });

  it.each(negativeEntries)('$domain $kind has the weighted-findings fields ADR 0006 requires', (e) => {
    expect(e.penalty_usd === null || (Number.isInteger(e.penalty_usd) && e.penalty_usd >= 0), e.domain).toBe(true);
    if (AMOUNT_STATED_DOMAINS.includes(registrableDomain(e.source_url) ?? '')) {
      expect(e.penalty_usd, e.domain).not.toBeNull();
    }
    expect(RELATIONS, e.domain).toContain(e.relation);
    if (e.relation === 'related' || e.relation === 'related-at-shop') {
      expect(e.note, e.domain).toBeTruthy();
    }
    expect(STATUSES, e.domain).toContain(e.status);
    if (e.status === 'open') expect(e.penalty_usd, e.domain).toBeNull();
    if (OSHA_INSPECTION.test(e.source_url)) {
      expect(CITATION_TYPES, e.domain).toContain(e.citation_type);
    } else {
      expect(e.citation_type, e.domain).toBeUndefined();
    }
  });

  it('has one row per domain and kind', () => {
    expectUnique(negatives.entries.map((e) => `${e.domain} ${e.kind}`));
  });

  // Same drift risk as the cert lists above: score.ts hardcodes ETHICS.negatives/ENV.negatives,
  // and no `kinds` map exists for signals to check against, so check the two lists cover every
  // SignalKind between them (a duplicate would also fail this: the lengths would no longer match).
  it("scores every SignalKind once, split between score.ts's ETHICS and ENV negatives lists", () => {
    const scored = [...ETHICS.negatives, ...ENV.negatives];
    expect(scored.sort()).toEqual(Object.keys(SIGNAL_KINDS).sort());
  });

  // ADR 0006 (weighted findings): each of today's 4 live rows is major and self, so it must keep
  // costing the flat 0.25 it always has; a live score changing here would be the bug.
  it.each(negativeEntries)('$domain: major and self, so it costs the same 0.25 it always has', (e) => {
    const [signal] = negativesFor(e.domain, negativeEntries);
    expect(signal, e.domain).toBeDefined();
    expect(findingCost(signal!), e.domain).toEqual({ band: 'major', relation: 'self', cost: 0.25 });
  });
});

describe('negative-sources registry', () => {
  it.each(registry.sources)('$domain is a registrable domain with a verification page', (s) => {
    expect(registrableDomain(s.domain)).toBe(s.domain);
    expect(s.verified_via).toMatch(/^https:\/\//);
    expect(s.checked).toMatch(DATE);
  });

  it('has one row per domain', () => {
    expectUnique(registry.sources.map((s) => s.domain));
  });

  it('JSON and Markdown tables agree row for row', () => {
    expect(markdownRows()).toEqual(registry.sources);
  });

  it('no accepted source is also a retailer in the seed lists', () => {
    const retailers = [...certifications.entries, ...negatives.entries].map((e) => e.domain);
    expect(retailers.filter((d) => registryDomains.has(d))).toEqual([]);
  });
});
