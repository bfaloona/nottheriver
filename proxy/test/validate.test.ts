import { Validator } from '@cfworker/json-schema';
import { describe, expect, it } from 'vitest';
import { schemas, structuralOnly, validateAgainst } from '../src/validate';
import searchResponse from '../../tests/fixtures/search-response.json';
import normalizeFixture from '../../tests/fixtures/llm/normalize.json';
import normalizeAmazon from '../../tests/fixtures/llm/normalize-amazon.json';
import normalizeInvalid from '../../tests/fixtures/llm/normalize-invalid.json';
import enrichFixture from '../../tests/fixtures/llm/enrich.json';
import enrichAmazon from '../../tests/fixtures/llm/enrich-with-amazon.json';

const REQUEST = { product: 'cast iron skillet', city: 'Springfield', state: 'IL', lat: 39.8, lon: -89.65 };
const contentOf = (fixture: { choices: Array<{ message: { content: string } }> }): unknown =>
  JSON.parse(fixture.choices[0]!.message.content);

describe('validateAgainst', () => {
  it('accepts every fixture for its schema', () => {
    expect(validateAgainst('search-request', REQUEST)).toEqual({ ok: true });
    expect(validateAgainst('search-response', searchResponse)).toEqual({ ok: true });
    expect(validateAgainst('normalize', contentOf(normalizeFixture))).toEqual({ ok: true });
    expect(validateAgainst('normalize', contentOf(normalizeAmazon))).toEqual({ ok: true });
    expect(validateAgainst('enrich', contentOf(enrichFixture))).toEqual({ ok: true });
    expect(validateAgainst('enrich', contentOf(enrichAmazon))).toEqual({ ok: true });
  });

  it('rejects the invalid normalize fixture', () => {
    expect(validateAgainst('normalize', contentOf(normalizeInvalid)).ok).toBe(false);
  });

  it.each([
    ['an extra property', 'search-request', { ...REQUEST, zip: '62701' }],
    ['a missing field', 'search-request', { product: 'x', city: 'Springfield', state: 'IL', lat: 1 }],
    ['a number out of range', 'search-request', { ...REQUEST, lat: 91 }],
    ['a city with a control character', 'search-request', { ...REQUEST, city: 'Spring\u0007field' }],
    ['a city with digits', 'search-request', { ...REQUEST, city: 'Springfield 9' }],
    ['a city over 80 characters', 'search-request', { ...REQUEST, city: 'A'.repeat(81) }],
    ['a wrong enum', 'enrich', { retailers: [{ domain: 'a.example', signals: [{ kind: 'pricing', polarity: 'positive', claim: 'c', source_url: 'https://a.example/', confidence: 0.5 }] }] }],
    ['a confidence above 1', 'enrich', { retailers: [{ domain: 'a.example', signals: [{ kind: 'labor', polarity: 'positive', claim: 'c', source_url: 'https://a.example/', confidence: 2 }] }] }],
    ['a response with three components', 'search-response', { ...searchResponse, online: [{ ...searchResponse.online[0], components: searchResponse.online[0]!.components.slice(0, 3) }] }],
  ] as const)('rejects %s', (_label, name, value) => {
    const result = validateAgainst(name, value);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.length).toBeGreaterThan(0);
  });

  it('matches the city pattern with the unicode flag, so accented names pass', () => {
    expect(validateAgainst('search-request', { ...REQUEST, city: 'Mayagüez' }).ok).toBe(true);
    expect(validateAgainst('search-request', { ...REQUEST, city: "Coeur d'Alene" }).ok).toBe(true);
    expect(validateAgainst('search-request', { ...REQUEST, city: 'Winston-Salem' }).ok).toBe(true);
  });
});

describe('structuralOnly', () => {
  const DROPPED = ['maxLength', 'minLength', 'minimum', 'maximum', 'enum', 'pattern', 'minItems', 'maxItems'];

  it.each(['normalize', 'enrich'] as const)('strips value constraints from the %s schema and keeps structure', (name) => {
    const structural = structuralOnly(schemas[name]);
    const text = JSON.stringify(structural);
    for (const keyword of DROPPED) expect(text).not.toContain(`"${keyword}"`);
    expect(text).not.toContain('__');
    expect(structural.additionalProperties).toBe(false);
    expect(structural.required).toEqual(schemas[name].required);

    const validator = new Validator(structural, '7', false);
    const sample = contentOf(name === 'normalize' ? normalizeFixture : enrichFixture) as Record<string, unknown>;
    expect(validator.validate(sample).valid).toBe(true);
    expect(validator.validate({ ...sample, extra: 1 }).valid).toBe(false);
  });

  it('keeps nested object structure in enrich', () => {
    const structural = structuralOnly(schemas.enrich);
    const retailer = (structural.properties!.retailers as { items: { additionalProperties: boolean; required: string[] } }).items;
    expect(retailer.additionalProperties).toBe(false);
    expect(retailer.required).toEqual(['domain', 'signals']);
  });
});
