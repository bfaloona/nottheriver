// Measures how retailer sites answer an honestly identified bot. Deployed only for an
// eval run, then deleted. It never imitates a browser: the User-Agent names the probe
// and links the site's About page, and robots.txt is obeyed before every page fetch,
// including each redirect hop.
import { classify, pageTitle } from './classify';
import { isAllowed } from './robots';
import { parseTarget } from './target';

interface Env {
  PROBE_TOKEN: string; // secret, random per run
  UA_PRODUCT: string;  // e.g. "nottheriver-access-probe/0.1"
  ABOUT_URL: string;   // passed with --var at deploy so no account host lives in the repo
}

const BODY_CAP = 1_000_000;
const TITLE_SCAN = 65_536;
const TIMEOUT_MS = 15_000;
const GAP_MS = 2_000;
const MAX_HOPS = 5;

async function readCapped(res: Response): Promise<Uint8Array> {
  const out = new Uint8Array(BODY_CAP);
  let size = 0;
  const reader = res.body?.getReader();
  while (reader && size < BODY_CAP) {
    const { done, value } = await reader.read();
    if (done) break;
    const n = Math.min(value.length, BODY_CAP - size);
    out.set(value.subarray(0, n), size);
    size += n;
  }
  await reader?.cancel();
  return out.subarray(0, size);
}

/** robots.txt text for the URL's origin; '' when it imposes no rules, null when unreachable. */
async function robotsTxt(url: URL, ua: string): Promise<string | null> {
  let res: Response;
  try {
    res = await fetch(new URL('/robots.txt', url), { headers: { 'User-Agent': ua }, signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch {
    return null;
  }
  // RFC 9309 2.3.1: 4xx means no restrictions; 5xx or network failure means complete disallow.
  if (res.status >= 500) return null;
  if (res.status >= 400) return '';
  return new TextDecoder().decode(await readCapped(res));
}

async function probe(start: URL, env: Env): Promise<Record<string, unknown>> {
  const ua = `${env.UA_PRODUCT} (+${env.ABOUT_URL})`;
  const token = env.UA_PRODUCT.split('/')[0] ?? env.UA_PRODUCT;
  const started = Date.now();
  const robotsByOrigin = new Map<string, string | null>();
  let requests = 0;
  const pace = async () => {
    if (requests++ > 0) await new Promise((r) => setTimeout(r, GAP_MS));
  };

  let url = start;
  const outcome = (fields: Record<string, unknown>) => ({ url: start.href, final_url: url.href, ...fields, elapsed_ms: Date.now() - started });
  try {
    for (let hop = 0; ; hop++) {
      if (!robotsByOrigin.has(url.origin)) {
        await pace();
        robotsByOrigin.set(url.origin, await robotsTxt(url, ua));
      }
      const rules = robotsByOrigin.get(url.origin);
      // An unreachable robots.txt forbids fetching, but a site that is down has not blocked anyone.
      if (rules == null) return outcome({ access: 'error', robots: 'unreachable' });
      if (!isAllowed(rules, token, url.pathname + url.search)) return outcome({ access: 'robots_disallow', robots: 'disallowed' });

      await pace();
      const res = await fetch(url, { headers: { 'User-Agent': ua }, redirect: 'manual', signal: AbortSignal.timeout(TIMEOUT_MS) });
      const location = res.headers.get('location');
      if (res.status >= 300 && res.status < 400 && location && hop < MAX_HOPS) {
        await res.body?.cancel();
        url = new URL(location, url);
        continue;
      }
      const bytes = await readCapped(res);
      const text = new TextDecoder().decode(bytes.subarray(0, TITLE_SCAN));
      const cfMitigated = res.headers.get('cf-mitigated');
      const digest = await crypto.subtle.digest('SHA-256', bytes);
      return outcome({
        status: res.status,
        ...classify(res.status, cfMitigated, text),
        robots: 'allowed',
        headers: { server: res.headers.get('server'), cf_mitigated: cfMitigated, content_type: res.headers.get('content-type') },
        title: pageTitle(text),
        sha256: [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join(''),
        length: bytes.length,
        truncated: bytes.length === BODY_CAP,
      });
    }
  } catch (err) {
    return outcome({ access: 'error', error: err instanceof Error ? err.name : 'unknown' });
  }
}

function tokenMatches(header: string | null, secret: string | undefined): boolean {
  // Unset until `wrangler secret put` runs after the first deploy.
  if (!secret) return false;
  const enc = new TextEncoder();
  const given = enc.encode(header ?? '');
  const expected = enc.encode(`Bearer ${secret}`);
  return given.length === expected.length && crypto.subtle.timingSafeEqual(given, expected);
}

export default {
  async fetch(req, env): Promise<Response> {
    if (req.method !== 'GET') return Response.json({ error: 'method' }, { status: 405 });
    if (!tokenMatches(req.headers.get('Authorization'), env.PROBE_TOKEN)) return Response.json({ error: 'unauthorized' }, { status: 401 });
    const target = parseTarget(new URL(req.url).searchParams.get('url'));
    if (!target) return Response.json({ error: 'bad_url' }, { status: 400 });
    return Response.json(await probe(target, env));
  },
} satisfies ExportedHandler<Env>;
