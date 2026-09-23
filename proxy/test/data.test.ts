/// <reference types="node" />
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import certifications from '../../data/certifications.json';
import negatives from '../../data/negatives.json';
import registry from '../../data/negative-sources.json';
import type { CertKind, SignalKind } from '../src/contract';
import { registrableDomain } from '../src/domain';

// Records keyed by the contract unions, so adding or renaming a kind fails typecheck here.
const CERT_KINDS = {
  b_corp: 'ethics', fair_trade: 'ethics', worker_coop: 'ethics',
  one_percent_planet: 'env', climate_neutral: 'env',
  independent_retailer_assoc: 'unscored',
} as const satisfies Record<CertKind, string>;
const SIGNAL_KINDS = { labor: true, governance: true, environmental: true } satisfies Record<SignalKind, true>;

const DATE = /^\d{4}-\d{2}-\d{2}$/;

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
});

describe('negatives.json', () => {
  it.each(negatives.entries)('$domain $kind is sourced from an accepted registry domain', (e) => {
    expectSourced(e);
    expect(e.name).not.toBe('');
    expect(Object.keys(SIGNAL_KINDS)).toContain(e.kind);
    expect(e.action_date).toMatch(DATE);
    expect(e.claim).not.toBe('');
    expect(registryDomains).toContain(registrableDomain(e.source_url));
  });

  it('has one row per domain and kind', () => {
    expectUnique(negatives.entries.map((e) => `${e.domain} ${e.kind}`));
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
