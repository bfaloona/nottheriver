import type { Env } from './contract';
import { createHandler } from './handler';
import { runSearch } from './pipeline';

// Built once per isolate so the in-memory rate limiter keeps its counts between requests.
const handler = createHandler(runSearch, { fetch: globalThis.fetch.bind(globalThis), now: Date.now, log: console.log });

export default {
  fetch: (request, env) => handler(request, env),
} satisfies ExportedHandler<Env>;
