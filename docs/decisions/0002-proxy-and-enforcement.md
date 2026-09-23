# 0002: One proxy route and two enforcement points

Status: Accepted (2026-09-23)

## Context

The site must never show Amazon or an Amazon-owned business, and a language model sits in the middle of the pipeline. API keys cannot live in a static site. Anything the browser can call, anyone can call with curl, so CORS protects nothing. The Worker runs on Cloudflare's Free plan, with 10 ms of CPU per request.

## Decision

- **One route.** The Worker exposes only `POST /search`, taking `{product, city, state, lat, lon}` and returning ranked results. Prompts are fixed templates in `proxy/prompts/`; there is no general search or LLM relay a caller could repurpose. User text is interpolated as JSON-quoted data, and every model reply is validated against a schema in `proxy/schemas/`.
- **Safe to call from curl.** Requests without an `Origin` are accepted. Protection is a 4 KB body cap counted in bytes, schema validation, fixed error strings that never echo input, a per-client rate limit, and a global per-minute limit that acts as a spend circuit breaker ([0001](0001-external-services.md)). A limiter that throws counts as a refusal.
- **Injected dependencies.** `createHandler(runSearch, deps)` receives `fetch`, a clock and a logger; `runSearch` receives the environment. Tests run the real handler and pipeline against fixture responses, and no test can reach Brave or OpenRouter.
- **Filter 1, after fetching.** `filterBlocked` (`proxy/src/blocklist.ts`) runs over every fetched candidate before enrichment: registrable-domain match (with `amazon` under any public suffix), name match on normalized text, and a scan of the URL's path and query for embedded blocked domains. The model sees only what survives.
- **Filter 2, the last step before the response is built** (`finalizeResponse` in `proxy/src/pipeline.ts`, exported so it can be tested alone):
  1. `filterBlocked` again, over each result's retailer name, domain and URL;
  2. a text rule that drops any result whose title, retailer name, snippet or matched product contains the word "amazon";
  3. a source scrub that removes any certification, signal or score source whose URL is blocked, and any signal whose claim contains the word, then rescores the row so a removed badge leaves no score behind.
- **No filtering in the browser.** The site renders what the Worker returns; one enforcement implementation is easier to test and cannot drift.
- **The model cannot add retailers.** Enrichment output is joined back to Filter 1's survivors by domain; rows for any other domain are dropped. Filter 2 still assumes something could slip through.

## Consequences

- The LLM is never the only line of defense. `proxy/test/pipeline.test.ts` spies on `filterBlocked` and asserts it runs exactly twice per search, and injects an Amazon row into the enrich output to show Filter 2 removes it in the real ordering.
- The text rule over-blocks: a shop whose snippet says "not on Amazon" disappears ([debt.md](../debt.md)).
- Only the Worker holds keys; the static bundle is scanned for key patterns in CI.
- Moving off Cloudflare means replacing the entry point and platform bindings, not the pipeline ([architecture.md](../architecture.md)).
