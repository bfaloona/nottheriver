import { createServer, type IncomingMessage } from 'node:http';
import type { Env, SearchResponse } from '../proxy/src/contract';
import { isBlockedDomain, isBlockedUrl } from '../proxy/src/blocklist';
import { createHandler } from '../proxy/src/handler';
import { runSearch } from '../proxy/src/pipeline';
import { validateAgainst } from '../proxy/src/validate';
import { defaultRoutes, makeFixtureFetch } from './fixtures/fixture-fetch';
import web1 from './fixtures/brave/web-1.json';
import place1 from './fixtures/brave/place-1.json';

// The real Worker handler and pipeline, with only the upstream fetch swapped for fixtures,
// so the browser test exercises both blocklist passes rather than a canned response.
const PORT = 8788;
const ORIGIN = `http://localhost:${PORT}`;

const allow = { limit: async () => ({ success: true }) };
const env: Env = {
  BRAVE_API_KEY: 'test',
  OPENROUTER_API_KEY: 'test',
  ALLOWED_ORIGIN: 'http://localhost:5173',
  SITE_NAME: 'nottheriver',
  SITE_URL: 'http://localhost:5173',
  RATE_LIMITER: allow,
  GLOBAL_LIMITER: allow,
};

// A fresh fixture fetch per search: web results alternate by call count, and a shared
// counter would make the second search in a run differ from the first. The base fetch
// matches nothing, so no code path can reach a live API.
// The place fixture sits around Springfield, IL; it is moved to the searched point, keeping
// each shop's offset, so the browser test's zip gets nearby shops rather than ones too far to show.
const FIXTURE_ORIGIN = { lat: 39.78, lon: -89.65 };
function placesAround(url: URL) {
  const dLat = Number(url.searchParams.get('latitude')) - FIXTURE_ORIGIN.lat;
  const dLon = Number(url.searchParams.get('longitude')) - FIXTURE_ORIGIN.lon;
  const results = place1.results.map((r) => (r.coordinates ? { ...r, coordinates: [r.coordinates[0]! + dLat, r.coordinates[1]! + dLon] } : r));
  return { ...place1, results };
}
const routes = () => defaultRoutes().map((route) => (route.match(new URL('https://api.search.brave.com/res/v1/local/place_search'))
  ? { ...route, respond: (u: URL) => ({ body: placesAround(u) }) }
  : route));

const handle = createHandler(
  (req, e, deps) => runSearch(req, e, { ...deps, fetch: makeFixtureFetch(routes()) }),
  { fetch: makeFixtureFetch([]), now: Date.now, log: () => {} },
);

async function toRequest(req: IncomingMessage): Promise<Request> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') headers.set(key, value);
  }
  const hasBody = req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS';
  return new Request(ORIGIN + (req.url ?? '/'), {
    method: req.method,
    headers,
    body: hasBody ? Buffer.concat(chunks) : undefined,
  });
}

const urlsIn = (value: unknown): string[] => JSON.stringify(value).match(/https?:\/\/[^"\s]+/g) ?? [];
const isBlockedLink = (u: string): boolean => isBlockedDomain(u) || isBlockedUrl(u);

// Fails startup, and so the whole e2e run, if the pipeline's output is off-contract or leaks a
// blocked link. The fixture check keeps the browser's Amazon-free assertion from going vacuous
// if someone trims the Amazon entries out of the upstream data. Output checks are negatives
// only: the "How ranking works" source is a localhost URL with no registrable domain.
async function selfTest(): Promise<string | null> {
  if (!urlsIn(web1).some(isBlockedLink)) return 'web fixture has no blocked URL to filter';
  if (!urlsIn(place1).some(isBlockedLink)) return 'place fixture has no blocked URL to filter';
  const response = await handle(
    new Request(`${ORIGIN}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: 'cast iron skillet', city: 'Springfield', state: 'IL', lat: 39.8, lon: -89.65 }),
    }),
    env,
  );
  if (response.status !== 200) return `status ${response.status}`;
  const body = (await response.json()) as SearchResponse;
  const validation = validateAgainst('search-response', body);
  if (!validation.ok) return `schema: ${validation.errors.join('; ')}`;
  if (body.local.length === 0 || body.online.length === 0) return 'a result section is empty';
  const urls = urlsIn(body);
  if (urls.length === 0) return 'no URLs to check';
  const blocked = urls.find(isBlockedLink);
  if (blocked) return `blocked URL ${blocked}`;
  if (/\bamazon\b/i.test(JSON.stringify([body.local, body.online]))) return 'results mention amazon';
  return null;
}

const failure = await selfTest();
if (failure) {
  console.error(`mock proxy self-test failed: ${failure}`);
  process.exit(1);
}

createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' }).end('ok');
    return;
  }
  toRequest(req)
    .then((request) => handle(request, env))
    .then(async (response) => {
      // Body first, so a failed read can still answer 500 before any header is sent.
      const bytes = Buffer.from(await response.arrayBuffer());
      res.writeHead(response.status, Object.fromEntries(response.headers)).end(bytes);
    })
    .catch(() => res.writeHead(500).end());
}).listen(PORT);
