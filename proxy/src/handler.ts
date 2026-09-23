import type { Deps, Env, ErrorCode, RateLimiter, RunSearch, SearchRequest } from './contract';
import { InvalidLlmOutput, UpstreamError } from './errors';
import { validateAgainst } from './validate';

export const MAX_BODY_BYTES = 4096;
export const MAX_PRODUCT_CHARS = 120;
export const MAX_CITY_CHARS = 80;

// The single source for both limits; proxy/wrangler.jsonc and the OpenTofu defaults
// mirror these (config.test.ts checks the former). Cloudflare only offers 10 or 60 s periods.
export const RATE_LIMIT = { limit: 30, periodSeconds: 60 } as const;
export const GLOBAL_LIMIT = { limit: 60, periodSeconds: 60 } as const;

const ROUTE = '/search';

const STATES = new Set(
  ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND ' +
    'OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC PR VI GU AS MP').split(' '),
);

export function corsHeaders(origin: string | null, allowedOrigin: string): Record<string, string> {
  if (!origin || origin !== allowedOrigin) return {};
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'content-type',
  };
}

// Trusted only because Cloudflare's edge sets this header; a deployment elsewhere
// must key on the socket peer address instead.
export function clientKey(request: Request): string {
  const ip = request.headers.get('CF-Connecting-IP')?.trim().toLowerCase();
  if (!ip) return 'unknown';
  // IPv4, including the IPv4-mapped IPv6 form, is keyed whole; a /64 of that form would be every IPv4 client.
  if (!ip.includes(':') || ip.includes('.')) return ip;
  return ipv6Prefix64(ip) ?? ip;
}

// One subscriber usually holds a whole /64, so keying on the full address would
// hand out 2^64 buckets.
function ipv6Prefix64(ip: string): string | null {
  const [head = '', tail, extra] = ip.split('::');
  if (extra !== undefined) return null;
  const groups = (part: string) => (part ? part.split(':') : []);
  const left = groups(head);
  const right = tail === undefined ? [] : groups(tail);
  const missing = 8 - left.length - right.length;
  if (missing < 0 || (tail === undefined && missing !== 0)) return null;
  const all = [...left, ...Array<string>(missing).fill('0'), ...right];
  const prefix = all.slice(0, 4).map((h) => (/^[0-9a-f]{1,4}$/.test(h) ? parseInt(h, 16).toString(16) : null));
  return prefix.includes(null) ? null : `${prefix.join(':')}::/64`;
}

// Per-isolate fixed window, matching the binding's "limit per period", used only when
// the binding is absent. Each isolate counts separately, so this is weak; the spend caps
// on the API keys are the backstop.
export function memoryLimiter(limit: number, periodMs: number, now: () => number): RateLimiter {
  const windows = new Map<string, { count: number; start: number }>();
  return {
    async limit({ key }) {
      const t = now();
      if (windows.size > 10_000) {
        for (const [k, w] of windows) if (t - w.start >= periodMs) windows.delete(k);
      }
      let w = windows.get(key);
      if (!w || t - w.start >= periodMs) {
        w = { count: 0, start: t };
        windows.set(key, w);
      }
      if (w.count >= limit) return { success: false };
      w.count += 1;
      return { success: true };
    },
  };
}

// Counts bytes as they arrive so a body of multi-byte characters cannot slip past a
// character count, and stops reading the moment the cap is passed.
export async function readBodyCapped(request: Request, maxBytes: number): Promise<string | null> {
  if (!request.body) return '';
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let total = 0;
  let text = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return text + decoder.decode();
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      return null;
    }
    text += decoder.decode(value, { stream: true });
  }
}

const twoDecimals = (x: number) => Math.round(x * 100) / 100 === x;

export function parseSearchRequest(value: unknown): SearchRequest | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const raw = value as Record<string, unknown>;
  const trimmed = {
    ...raw,
    ...(typeof raw.product === 'string' && { product: raw.product.trim() }),
    ...(typeof raw.city === 'string' && { city: raw.city.trim() }),
  };
  if (!validateAgainst('search-request', trimmed).ok) return null;
  const req = trimmed as unknown as SearchRequest;
  if (!STATES.has(req.state) || !twoDecimals(req.lat) || !twoDecimals(req.lon)) return null;
  return { product: req.product, city: req.city, state: req.state, lat: req.lat, lon: req.lon };
}

export function createHandler(runSearch: RunSearch, deps: Deps) {
  // Created once per handler, i.e. once per isolate, so the fallback actually counts.
  let clientFallback: RateLimiter | undefined;
  let globalFallback: RateLimiter | undefined;
  const perClient = (env: Env) =>
    env.RATE_LIMITER ?? (clientFallback ??= memoryLimiter(RATE_LIMIT.limit, RATE_LIMIT.periodSeconds * 1000, deps.now));
  const global = (env: Env) =>
    env.GLOBAL_LIMITER ?? (globalFallback ??= memoryLimiter(GLOBAL_LIMIT.limit, GLOBAL_LIMIT.periodSeconds * 1000, deps.now));

  async function allowed(request: Request, env: Env): Promise<boolean> {
    try {
      if (!(await perClient(env).limit({ key: clientKey(request) })).success) return false;
      return (await global(env).limit({ key: 'global' })).success;
    } catch {
      return false; // a broken limiter must not turn into unlimited spend
    }
  }

  return async function handle(request: Request, env: Env): Promise<Response> {
    const started = deps.now();
    let status = 500;
    const baseHeaders = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      Vary: 'Origin',
      ...corsHeaders(request.headers.get('Origin'), env.ALLOWED_ORIGIN),
    };
    const reply = (code: number, body: unknown, extra: Record<string, string> = {}) => {
      status = code;
      return new Response(body === null ? null : JSON.stringify(body), { status: code, headers: { ...baseHeaders, ...extra } });
    };
    const fail = (code: number, error: ErrorCode, extra?: Record<string, string>) => reply(code, { error }, extra);

    try {
      if (request.method === 'OPTIONS') return reply(204, null);
      if (request.method !== 'POST' || new URL(request.url).pathname !== ROUTE) return fail(404, 'bad_request');
      if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) return fail(415, 'bad_request');
      if (Number(request.headers.get('Content-Length') ?? 0) > MAX_BODY_BYTES) return fail(413, 'bad_request');
      const body = await readBodyCapped(request, MAX_BODY_BYTES);
      if (body === null) return fail(413, 'bad_request');
      if (!(await allowed(request, env))) {
        return fail(429, 'rate_limited', { 'Retry-After': String(RATE_LIMIT.periodSeconds) });
      }
      let parsed: unknown;
      try {
        parsed = JSON.parse(body);
      } catch {
        return fail(400, 'bad_request');
      }
      const search = parseSearchRequest(parsed);
      if (!search) return fail(400, 'bad_request');
      try {
        return reply(200, await runSearch(search, env, deps));
      } catch (err) {
        if (err instanceof UpstreamError) return fail(502, 'upstream_error');
        if (err instanceof InvalidLlmOutput) return fail(502, 'invalid_llm_output');
        return fail(500, 'server_error');
      }
    } catch {
      return fail(500, 'server_error');
    } finally {
      // The only log line: never bodies, query text, coordinates, keys or error text.
      deps.log(JSON.stringify({ route: ROUTE, status, ms: deps.now() - started }));
    }
  };
}
