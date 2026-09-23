import { describe, expect, it, vi } from 'vitest';
import type { Deps, Env, RateLimiter, RunSearch, SearchResponse } from '../src/contract';
import { InvalidLlmOutput, UpstreamError } from '../src/errors';
import {
  GLOBAL_LIMIT,
  MAX_BODY_BYTES,
  RATE_LIMIT,
  clientKey,
  createHandler,
  memoryLimiter,
  parseSearchRequest,
  readBodyCapped,
} from '../src/handler';
import fixtureResponse from '../../tests/fixtures/search-response.json';

const ORIGIN = 'http://localhost:5173';
const VALID = { product: 'cast iron skillet', city: 'Springfield', state: 'IL', lat: 39.8, lon: -89.65 };
const allow: RateLimiter = { limit: async () => ({ success: true }) };
const deny: RateLimiter = { limit: async () => ({ success: false }) };

function makeEnv(overrides: Partial<Env> = {}): Env {
  return {
    BRAVE_API_KEY: 'test-brave',
    OPENROUTER_API_KEY: 'test-openrouter',
    ALLOWED_ORIGIN: ORIGIN,
    SITE_NAME: 'test-site',
    SITE_URL: ORIGIN,
    RATE_LIMITER: allow,
    GLOBAL_LIMITER: allow,
    ...overrides,
  };
}

function setup(runSearch: RunSearch = async () => fixtureResponse as SearchResponse, now = () => 1_000_000) {
  const log = vi.fn<(line: string) => void>();
  const deps: Deps = { fetch: vi.fn() as unknown as typeof fetch, now, log };
  const search = vi.fn(runSearch);
  return { handle: createHandler(search, deps), log, search };
}

interface ReqOpts {
  method?: string;
  path?: string;
  origin?: string | null;
  contentType?: string | null;
  body?: BodyInit | null;
  headers?: Record<string, string>;
  ip?: string;
}

function req({ method = 'POST', path = '/search', origin = ORIGIN, contentType = 'application/json', body, headers = {}, ip = '203.0.113.7' }: ReqOpts = {}): Request {
  const h = new Headers(headers);
  if (origin) h.set('Origin', origin);
  if (contentType) h.set('Content-Type', contentType);
  if (ip) h.set('CF-Connecting-IP', ip);
  const init: RequestInit = { method, headers: h };
  if (method !== 'GET' && method !== 'OPTIONS') init.body = body === undefined ? JSON.stringify(VALID) : body;
  return new Request(`https://proxy.example${path}`, init);
}

function streamOf(bytes: number): Request {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new Uint8Array(bytes - 1).fill(0x20));
      controller.enqueue(new Uint8Array([0x20]));
      controller.close();
    },
  });
  // duplex is required by Node for a streamed body and is missing from the RequestInit types.
  const init = { method: 'POST', body: stream, duplex: 'half', headers: { 'Content-Type': 'application/json', Origin: ORIGIN } };
  return new Request('https://proxy.example/search', init as RequestInit);
}

async function errorOf(res: Response): Promise<unknown> {
  return ((await res.json()) as { error: unknown }).error;
}

describe('CORS', () => {
  it('answers a preflight from the allowed origin with CORS headers', async () => {
    const { handle } = setup();
    const res = await handle(req({ method: 'OPTIONS' }), makeEnv());
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe(ORIGIN);
    expect(res.headers.get('Access-Control-Allow-Methods')).toBe('POST');
    expect(res.headers.get('Access-Control-Allow-Headers')).toBe('content-type');
    expect(res.headers.get('Vary')).toBe('Origin');
  });

  it('answers a preflight from another origin without CORS headers', async () => {
    const { handle } = setup();
    const res = await handle(req({ method: 'OPTIONS', origin: 'https://evil.example' }), makeEnv());
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
    expect(res.headers.get('Access-Control-Allow-Methods')).toBeNull();
  });

  it('puts CORS headers on a POST from the allowed origin only', async () => {
    const { handle } = setup();
    const ok = await handle(req(), makeEnv());
    expect(ok.headers.get('Access-Control-Allow-Origin')).toBe(ORIGIN);
    const other = await handle(req({ origin: 'https://evil.example' }), makeEnv());
    expect(other.status).toBe(200);
    expect(other.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });

  it('puts CORS headers on error responses so the browser can read the error', async () => {
    const { handle } = setup();
    const bad = await handle(req({ body: '{' }), makeEnv());
    expect(bad.status).toBe(400);
    expect(bad.headers.get('Access-Control-Allow-Origin')).toBe(ORIGIN);
    const limited = await handle(req(), makeEnv({ RATE_LIMITER: deny }));
    expect(limited.status).toBe(429);
    expect(limited.headers.get('Access-Control-Allow-Origin')).toBe(ORIGIN);
  });

  it('serves a request with no Origin, so curl works', async () => {
    const { handle } = setup();
    const res = await handle(req({ origin: null }), makeEnv());
    expect(res.status).toBe(200);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });
});

describe('routing and content type', () => {
  it('returns 404 for GET and for other paths', async () => {
    const { handle } = setup();
    expect((await handle(req({ method: 'GET' }), makeEnv())).status).toBe(404);
    const other = await handle(req({ path: '/relay' }), makeEnv());
    expect(other.status).toBe(404);
    expect(await errorOf(other)).toBe('bad_request');
  });

  it('returns 415 for a non-JSON content type', async () => {
    const { handle } = setup();
    expect((await handle(req({ contentType: 'text/plain' }), makeEnv())).status).toBe(415);
    expect((await handle(req({ contentType: null, body: 'x' }), makeEnv())).status).toBe(415);
  });

  it('accepts a JSON content type with a charset', async () => {
    const { handle } = setup();
    expect((await handle(req({ contentType: 'application/json; charset=utf-8' }), makeEnv())).status).toBe(200);
  });
});

describe('body cap', () => {
  it('rejects a declared Content-Length over the cap before reading', async () => {
    const { handle, search } = setup();
    const res = await handle(req({ headers: { 'Content-Length': '5000' } }), makeEnv());
    expect(res.status).toBe(413);
    expect(search).not.toHaveBeenCalled();
  });

  it('rejects a streamed body one byte over the cap with no Content-Length', async () => {
    const { handle } = setup();
    const request = streamOf(MAX_BODY_BYTES + 1);
    expect(request.headers.get('content-length')).toBeNull();
    expect((await handle(request, makeEnv())).status).toBe(413);
  });

  it('counts bytes, not characters', async () => {
    const { handle } = setup();
    const body = JSON.stringify({ ...VALID, product: '€'.repeat(2000) });
    expect(body.length).toBeLessThan(MAX_BODY_BYTES);
    expect((await handle(req({ body }), makeEnv())).status).toBe(413);
  });

  it('accepts a body of exactly the cap', async () => {
    const { handle } = setup();
    const json = JSON.stringify(VALID);
    const body = json + ' '.repeat(MAX_BODY_BYTES - json.length);
    expect(new TextEncoder().encode(body).byteLength).toBe(MAX_BODY_BYTES);
    expect((await handle(req({ body }), makeEnv())).status).toBe(200);
  });

  it('readBodyCapped returns null past the cap and the text within it', async () => {
    expect(await readBodyCapped(streamOf(11), 10)).toBeNull();
    expect(await readBodyCapped(new Request('https://x.example/', { method: 'POST', body: 'héllo' }), 6)).toBe('héllo');
    expect(await readBodyCapped(new Request('https://x.example/', { method: 'POST' }), 6)).toBe('');
  });
});

describe('rate limits', () => {
  async function expect429(res: Response) {
    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBe(String(RATE_LIMIT.periodSeconds));
    expect(await res.json()).toEqual({ error: 'rate_limited' });
  }

  it('fixes the limits the deployment mirrors', () => {
    expect(RATE_LIMIT).toEqual({ limit: 30, periodSeconds: 60 });
    expect(GLOBAL_LIMIT).toEqual({ limit: 60, periodSeconds: 60 });
  });

  it('returns 429 when the per-client limiter refuses', async () => {
    const { handle, search } = setup();
    await expect429(await handle(req(), makeEnv({ RATE_LIMITER: deny })));
    expect(search).not.toHaveBeenCalled();
  });

  it('returns 429 when the global limiter refuses and the client limiter allows', async () => {
    const { handle } = setup();
    await expect429(await handle(req(), makeEnv({ GLOBAL_LIMITER: deny })));
  });

  it('fails closed when a limiter throws', async () => {
    const { handle } = setup();
    const broken: RateLimiter = { limit: async () => { throw new Error('binding down'); } };
    await expect429(await handle(req(), makeEnv({ RATE_LIMITER: broken })));
    await expect429(await handle(req(), makeEnv({ GLOBAL_LIMITER: broken })));
  });

  it('keys the per-client limiter on CF-Connecting-IP and the global one on a constant', async () => {
    const { handle } = setup();
    const client = { limit: vi.fn(async () => ({ success: true })) };
    const global = { limit: vi.fn(async () => ({ success: true })) };
    await handle(req({ ip: '198.51.100.4' }), makeEnv({ RATE_LIMITER: client, GLOBAL_LIMITER: global }));
    expect(client.limit).toHaveBeenCalledWith({ key: '198.51.100.4' });
    expect(global.limit).toHaveBeenCalledWith({ key: 'global' });
  });

  it('falls back to one in-memory limiter per handler: call 30 passes, call 31 is refused', async () => {
    const { handle } = setup();
    const env = makeEnv({ RATE_LIMITER: undefined, GLOBAL_LIMITER: undefined });
    for (let i = 1; i <= RATE_LIMIT.limit; i++) {
      expect((await handle(req(), env)).status, `call ${i}`).toBe(200);
    }
    await expect429(await handle(req(), env));
    expect((await handle(req({ ip: '198.51.100.9' }), env)).status).toBe(200);
  });

  it('counts the fallback per fixed window: call 31 is refused 30 s in and allowed once the window ends', async () => {
    let t = 1_000_000;
    const { handle } = setup(undefined, () => t);
    const env = makeEnv({ RATE_LIMITER: undefined, GLOBAL_LIMITER: undefined });
    for (let i = 0; i < RATE_LIMIT.limit; i++) expect((await handle(req(), env)).status).toBe(200);
    t += 30_000;
    await expect429(await handle(req(), env));
    t += 30_000;
    expect((await handle(req(), env)).status).toBe(200);
  });

  it('falls back to an in-memory global limiter across clients', async () => {
    const { handle } = setup();
    const env = makeEnv({ GLOBAL_LIMITER: undefined });
    for (let i = 0; i < GLOBAL_LIMIT.limit; i++) {
      expect((await handle(req({ ip: `198.51.100.${i}` }), env)).status).toBe(200);
    }
    await expect429(await handle(req({ ip: '192.0.2.200' }), env));
  });
});

describe('memoryLimiter', () => {
  it('allows the limit per key per window and nothing more until the window ends', async () => {
    let t = 0;
    const limiter = memoryLimiter(3, 60_000, () => t);
    for (let i = 0; i < 3; i++) expect((await limiter.limit({ key: 'a' })).success).toBe(true);
    expect((await limiter.limit({ key: 'a' })).success).toBe(false);
    expect((await limiter.limit({ key: 'b' })).success).toBe(true);
    t = 59_999;
    expect((await limiter.limit({ key: 'a' })).success).toBe(false);
    t = 60_000;
    for (let i = 0; i < 3; i++) expect((await limiter.limit({ key: 'a' })).success).toBe(true);
    expect((await limiter.limit({ key: 'a' })).success).toBe(false);
  });
});

describe('clientKey', () => {
  const keyOf = (ip?: string) => clientKey(new Request('https://x.example/', { headers: ip ? { 'CF-Connecting-IP': ip } : {} }));

  it('uses a full IPv4 address and "unknown" when the header is absent', () => {
    expect(keyOf('203.0.113.7')).toBe('203.0.113.7');
    expect(keyOf('203.0.113.8')).not.toBe(keyOf('203.0.113.7'));
    expect(keyOf()).toBe('unknown');
  });

  it('buckets IPv6 by /64', () => {
    expect(keyOf('2001:db8:1:2:aaaa::1')).toBe(keyOf('2001:db8:1:2:bbbb:cccc:dddd:2'));
    expect(keyOf('2001:0DB8:0001:0002::')).toBe(keyOf('2001:db8:1:2::ffff'));
    expect(keyOf('2001:db8:1:2::1')).not.toBe(keyOf('2001:db8:1:3::1'));
    expect(keyOf('::1')).toBe(keyOf('0:0:0:0:0:0:0:1'));
  });

  it('keys IPv4-mapped IPv6 addresses whole, not by /64', () => {
    expect(keyOf('::ffff:192.0.2.1')).not.toBe(keyOf('::ffff:192.0.2.2'));
  });
});

describe('request validation', () => {
  const cases: Array<[string, unknown]> = [
    ['121-character product', { ...VALID, product: 'x'.repeat(121) }],
    ['whitespace-only product', { ...VALID, product: '   ' }],
    ['extra key', { ...VALID, zip: '62701' }],
    ['unknown state', { ...VALID, state: 'XX' }],
    ['lowercase state', { ...VALID, state: 'il' }],
    ['city with a newline', { ...VALID, city: 'Spring\nfield' }],
    ['city with digits', { ...VALID, city: 'Springfield 2' }],
    ['lat with 3 decimals', { ...VALID, lat: 39.801 }],
    ['lon as a string', { ...VALID, lon: '-89.65' }],
    ['missing lon', { product: 'x', city: 'Springfield', state: 'IL', lat: 1 }],
    ['an array', [VALID]],
    ['null', null],
  ];

  it.each(cases)('rejects %s with 400', async (_name, body) => {
    const { handle, search } = setup();
    const res = await handle(req({ body: JSON.stringify(body) }), makeEnv());
    expect(res.status).toBe(400);
    expect(await errorOf(res)).toBe('bad_request');
    expect(search).not.toHaveBeenCalled();
  });

  it('rejects malformed JSON with 400', async () => {
    const { handle } = setup();
    expect((await handle(req({ body: '{"product":' }), makeEnv())).status).toBe(400);
  });

  it('trims product and city and accepts every territory code', () => {
    expect(parseSearchRequest({ ...VALID, product: '  skillet ', city: ' Springfield ' })).toEqual({ ...VALID, product: 'skillet', city: 'Springfield' });
    for (const state of ['DC', 'PR', 'VI', 'GU', 'AS', 'MP', 'WY']) {
      expect(parseSearchRequest({ ...VALID, state })).not.toBeNull();
    }
    expect(parseSearchRequest({ ...VALID, product: 'x'.repeat(120) })).not.toBeNull();
    expect(parseSearchRequest({ ...VALID, city: 'Mayagüez' })).not.toBeNull();
  });
});

describe('responses and errors', () => {
  it('returns the search result as uncached JSON', async () => {
    const { handle, search } = setup();
    const res = await handle(req(), makeEnv());
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('application/json');
    expect(res.headers.get('Cache-Control')).toBe('no-store');
    expect(await res.json()).toEqual(fixtureResponse);
    expect(search).toHaveBeenCalledWith(VALID, expect.anything(), expect.anything());
  });

  it.each([
    [new UpstreamError(), 502, 'upstream_error'],
    [new InvalidLlmOutput(), 502, 'invalid_llm_output'],
    [new Error('boom'), 500, 'server_error'],
  ])('maps %s to %i', async (err, status, code) => {
    const { handle } = setup(async () => { throw err; });
    const res = await handle(req(), makeEnv());
    expect(res.status).toBe(status);
    expect(await res.json()).toEqual({ error: code });
    expect(res.headers.get('Cache-Control')).toBe('no-store');
  });
});

describe('logging', () => {
  const SECRET_PRODUCT = 'sentinel product 7f3a';
  const SECRET_IP = '192.0.2.77';
  const secretBody = JSON.stringify({ ...VALID, product: SECRET_PRODUCT });
  const paths: Array<[string, () => Request, Partial<Env>, RunSearch?]> = [
    ['204', () => req({ method: 'OPTIONS', ip: SECRET_IP }), {}],
    ['400', () => req({ body: JSON.stringify({ ...VALID, product: SECRET_PRODUCT, state: 'XX' }), ip: SECRET_IP }), {}],
    ['404', () => req({ path: '/nope', body: secretBody, ip: SECRET_IP }), {}],
    ['413', () => req({ body: secretBody + ' '.repeat(MAX_BODY_BYTES), ip: SECRET_IP }), {}],
    ['415', () => req({ contentType: 'text/plain', body: secretBody, ip: SECRET_IP }), {}],
    ['429', () => req({ body: secretBody, ip: SECRET_IP }), { RATE_LIMITER: deny }],
    ['502', () => req({ body: secretBody, ip: SECRET_IP }), {}, async () => { throw new UpstreamError(); }],
    ['500', () => req({ body: secretBody, ip: SECRET_IP }), {}, async () => { throw new Error(`BOOM ${SECRET_PRODUCT}`); }],
    ['200', () => req({ body: secretBody, ip: SECRET_IP }), {}],
  ];

  it.each(paths)('logs exactly one line with route, status and ms on %s', async (status, make, envOverrides, runSearch) => {
    const { handle, log } = setup(runSearch);
    const res = await handle(make(), makeEnv(envOverrides));
    expect(String(res.status)).toBe(status);
    expect(log).toHaveBeenCalledTimes(1);
    const line = log.mock.calls[0]![0];
    const parsed = JSON.parse(line) as Record<string, unknown>;
    expect(Object.keys(parsed).sort()).toEqual(['ms', 'route', 'status']);
    expect(parsed).toMatchObject({ route: '/search', status: res.status });
    expect(line).not.toContain(SECRET_PRODUCT);
    expect(line).not.toContain(SECRET_IP);
    expect(line).not.toContain('BOOM');
  });

  it('never writes to the console', async () => {
    const spies = (['log', 'error', 'warn', 'info', 'debug'] as const).map((m) => vi.spyOn(console, m).mockImplementation(() => {}));
    const { handle } = setup(async () => { throw new Error('boom'); });
    await handle(req(), makeEnv());
    await handle(req({ body: '{' }), makeEnv());
    for (const spy of spies) {
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    }
  });
});
