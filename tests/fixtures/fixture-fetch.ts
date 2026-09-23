import web1 from './brave/web-1.json';
import web2 from './brave/web-2.json';
import place1 from './brave/place-1.json';
import normalize from './llm/normalize.json';
import enrich from './llm/enrich.json';

export type FixtureRoute = {
  match: (url: URL, init?: RequestInit) => boolean; // OpenRouter routes discriminate on json_schema.name in the body
  // n counts earlier answers from this route within one makeFixtureFetch instance.
  respond: (url: URL, init: RequestInit | undefined, n: number) => { status?: number; body: unknown };
};

export interface RecordedCall { url: string; method: string; headers: Record<string, string>; body: string | null }

// Unmatched URLs answer 599 so a wrong endpoint fails loudly instead of looking like an empty result.
export function makeFixtureFetch(routes: FixtureRoute[]): typeof fetch & { calls: RecordedCall[] } {
  const calls: RecordedCall[] = [];
  const answered = new Map<FixtureRoute, number>();
  const fixtureFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    const headers: Record<string, string> = {};
    new Headers(init?.headers).forEach((value, key) => { headers[key] = value; });
    calls.push({ url: url.href, method: init?.method ?? 'GET', headers, body: typeof init?.body === 'string' ? init.body : null });
    const route = routes.find((r) => r.match(url, init));
    let reply: { status?: number; body: unknown } = { status: 599, body: { error: 'no fixture' } };
    if (route) {
      const n = answered.get(route) ?? 0;
      answered.set(route, n + 1);
      reply = route.respond(url, init, n);
    }
    const { status = 200, body } = reply;
    return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
  };
  return Object.assign(fixtureFetch, { calls });
}

export function schemaNameOf(init?: RequestInit): string | undefined {
  if (typeof init?.body !== 'string') return undefined;
  try {
    return (JSON.parse(init.body) as { response_format?: { json_schema?: { name?: string } } }).response_format?.json_schema?.name;
  } catch {
    return undefined;
  }
}

// One routing table for the Worker tests and the e2e mock proxy, so they cannot diverge.
// Web search alternates web-1, web-2, web-1, ... per makeFixtureFetch instance.
export function defaultRoutes(llm: { normalize?: unknown; enrich?: unknown } = {}): FixtureRoute[] {
  return [
    { match: (u) => u.pathname === '/res/v1/web/search', respond: (_u, _i, n) => ({ body: n % 2 === 0 ? web1 : web2 }) },
    { match: (u) => u.pathname === '/res/v1/local/place_search', respond: () => ({ body: place1 }) },
    {
      match: (u, init) => u.pathname === '/api/v1/chat/completions' && schemaNameOf(init) === 'normalize',
      respond: () => ({ body: llm.normalize ?? normalize }),
    },
    {
      match: (u, init) => u.pathname === '/api/v1/chat/completions' && schemaNameOf(init) === 'enrich',
      respond: () => ({ body: llm.enrich ?? enrich }),
    },
  ];
}
