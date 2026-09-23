import { describe, expect, it } from 'vitest';
import { InvalidLlmOutput, UpstreamError } from '../src/errors';
import { ENRICH_MAX_TOKENS, MODELS, NORMALIZE_MAX_TOKENS, createLlmClient } from '../src/llm';
import { schemas, structuralOnly } from '../src/validate';
import { defaultRoutes, makeFixtureFetch, type FixtureRoute } from '../../tests/fixtures/fixture-fetch';
import normalizeInvalid from '../../tests/fixtures/llm/normalize-invalid.json';
import normalizeFixture from '../../tests/fixtures/llm/normalize.json';

const SITE = { siteUrl: 'https://site.example/app', siteName: 'test-site' };

function client(routes: FixtureRoute[] = defaultRoutes()) {
  const fetch = makeFixtureFetch(routes);
  return { fetch, llm: createLlmClient({ fetch, apiKey: 'test-key', ...SITE }) };
}

const always = (body: unknown, status = 200): FixtureRoute[] => [{ match: () => true, respond: () => ({ status, body }) }];

describe('request', () => {
  it('sends the fixed body with a structure-only schema and the token cap', async () => {
    const { fetch, llm } = client();
    await llm.complete('normalize', 'PROMPT TEXT', NORMALIZE_MAX_TOKENS);
    const call = fetch.calls[0]!;
    expect(call.url).toBe('https://openrouter.ai/api/v1/chat/completions');
    expect(call.method).toBe('POST');
    expect(JSON.parse(call.body!)).toEqual({
      models: ['google/gemma-4-31b-it', 'google/gemma-4-26b-a4b-it'],
      messages: [{ role: 'user', content: 'PROMPT TEXT' }],
      response_format: { type: 'json_schema', json_schema: { name: 'normalize', strict: true, schema: structuralOnly(schemas.normalize) } },
      provider: { require_parameters: true, data_collection: 'deny' },
      max_completion_tokens: 400,
      temperature: 0,
    });
    expect(MODELS.some((m) => m.endsWith(':free'))).toBe(false);
  });

  it('names the enrich schema and passes its token cap', async () => {
    const { fetch, llm } = client();
    await llm.complete('enrich', 'x', ENRICH_MAX_TOKENS);
    const body = JSON.parse(fetch.calls[0]!.body!);
    expect(body.response_format.json_schema.name).toBe('enrich');
    expect(body.max_completion_tokens).toBe(2000);
    expect(JSON.stringify(body.response_format.json_schema.schema)).not.toMatch(/"(enum|maxLength|minimum|maximum)"/);
  });

  it('sends exactly the four literal headers', async () => {
    const { fetch, llm } = client();
    await llm.complete('normalize', 'x', NORMALIZE_MAX_TOKENS);
    expect(fetch.calls[0]!.headers).toEqual({
      authorization: 'Bearer test-key',
      'content-type': 'application/json',
      'http-referer': 'https://site.example/app',
      'x-openrouter-title': 'test-site',
    });
  });
});

describe('response handling', () => {
  it('returns the parsed, validated content', async () => {
    const { llm } = client();
    const data = await llm.complete<{ canonical_name: string }>('normalize', 'x', NORMALIZE_MAX_TOKENS);
    expect(data.canonical_name).toBe('cast iron skillet');
  });

  it('retries once on invalid output, then throws InvalidLlmOutput with a fixed message', async () => {
    const { fetch, llm } = client(always(normalizeInvalid));
    const err = await llm.complete('normalize', 'x', NORMALIZE_MAX_TOKENS).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(InvalidLlmOutput);
    expect(String(err)).not.toContain('missing arrays');
    expect(fetch.calls).toHaveLength(2);
    expect(fetch.calls[1]!.body).toBe(fetch.calls[0]!.body);
  });

  it('succeeds when the retry is valid and records both billed attempts', async () => {
    const { fetch, llm } = client([{ match: () => true, respond: (_u, _i, n) => ({ body: n === 0 ? normalizeInvalid : normalizeFixture }) }]);
    await llm.complete('normalize', 'x', NORMALIZE_MAX_TOKENS);
    expect(fetch.calls).toHaveLength(2);
    expect(llm.usage).toHaveLength(2);
  });

  it.each([
    ['content that is not JSON', { ...normalizeFixture, choices: [{ message: { role: 'assistant', content: 'Sure! Here you go' } }] }],
    ['no choices', { model: 'm', usage: {} }],
    ['a body that is not an object', 'oops'],
  ])('treats %s as invalid output', async (_label, body) => {
    const { fetch, llm } = client(always(body));
    await expect(llm.complete('normalize', 'x', NORMALIZE_MAX_TOKENS)).rejects.toBeInstanceOf(InvalidLlmOutput);
    expect(fetch.calls).toHaveLength(2);
  });

  it('throws UpstreamError on a non-2xx status without retrying or quoting the body', async () => {
    const { fetch, llm } = client(always({ error: { message: 'SECRET no endpoints found' } }, 404));
    const err = await llm.complete('normalize', 'x', NORMALIZE_MAX_TOKENS).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(UpstreamError);
    expect(String(err)).not.toContain('SECRET');
    expect(fetch.calls).toHaveLength(1);
  });

  it('turns a network failure into an UpstreamError without retrying', async () => {
    let attempts = 0;
    const failing = async () => { attempts++; throw new TypeError('network down'); };
    const llm = createLlmClient({ fetch: failing as unknown as typeof fetch, apiKey: 'test-key', ...SITE });
    await expect(llm.complete('normalize', 'x', NORMALIZE_MAX_TOKENS)).rejects.toBeInstanceOf(UpstreamError);
    expect(attempts).toBe(1);
  });
});

describe('usage', () => {
  it('records model, tokens and cost from the response', async () => {
    const { llm } = client();
    await llm.complete('normalize', 'x', NORMALIZE_MAX_TOKENS);
    await llm.complete('enrich', 'x', ENRICH_MAX_TOKENS);
    expect(llm.usage).toEqual([
      { call: 'normalize', model: 'google/gemma-4-31b-it', prompt_tokens: 400, completion_tokens: 120, cost_usd: 0.0000768 },
      { call: 'enrich', model: 'google/gemma-4-31b-it', prompt_tokens: 2100, completion_tokens: 300, cost_usd: 0.000291 },
    ]);
  });

  it('records a null cost when the response has none, and the model that actually served', async () => {
    const noCost = { ...normalizeFixture, model: 'google/gemma-4-26b-a4b-it', usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 } };
    const { llm } = client(always(noCost));
    await llm.complete('normalize', 'x', NORMALIZE_MAX_TOKENS);
    expect(llm.usage).toEqual([{ call: 'normalize', model: 'google/gemma-4-26b-a4b-it', prompt_tokens: 10, completion_tokens: 5, cost_usd: null }]);
  });
});
