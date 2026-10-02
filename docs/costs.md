# Costs

The open ledger: what one search costs to run, from published unit prices. Each search also shows its own Brave call count, LLM tokens and estimated cost in the page footer.

## Unit prices

All checked 2026-09-23. `proxy/src/pricing.ts` holds the same numbers.

| Service | Price | Source |
|---|---|---|
| Brave Search API, Search plan (web search and place search) | $5.00 per 1,000 requests; $5 free credit per month; 50 requests per second | https://api-dashboard.search.brave.com/documentation/pricing |
| Brave place search | Part of the Search plan, $5 per 1,000 requests flat | https://api-dashboard.search.brave.com/documentation/services/place-search and Brave's blog post of 2026-07-08, https://brave.com/blog/place-search-improved/ |
| Brave billing rule | "Only successful requests (non-error responses) are counted against your quota and billed." | https://api-dashboard.search.brave.com/documentation/guides/rate-limiting |
| OpenRouter `google/gemma-4-31b-it` (primary model) | $0.09 per million prompt tokens, $0.34 per million completion tokens | https://openrouter.ai/api/v1/models |
| OpenRouter `google/gemma-4-26b-a4b-it` (fallback model) | $0.09 per million prompt tokens, $0.30 per million completion tokens | https://openrouter.ai/api/v1/models |
| Cloudflare Workers Free plan | 100,000 requests per day at no charge | https://developers.cloudflare.com/workers/platform/pricing/ |

The OpenRouter prices in the table are the cheapest endpoint's, and OpenRouter may route to a pricier one. On 2026-10-01, the primary model's 14 endpoints ranged from $0.09 to $0.75 per million prompt tokens and $0.33 to $1.15 per million completion tokens; ModelRun and SiliconFlow list $0.75 and $1.00 (https://openrouter.ai/api/v1/models/google/gemma-4-31b-it/endpoints). The Worker asks OpenRouter to route for throughput (`proxy/src/llm.ts`), and in the 2026-10-01 check below all 96 calls of its two arms were billed at exactly $0.75 per million prompt and $1.00 per million completion tokens, about 6 times the cheapest endpoint's price. The footer therefore uses the cost OpenRouter reports for each call and falls back to the table's prices only when that field is missing.

## Cost per search

Measured: the 20 graded searches run once on 2026-10-01, locally, through the pipeline code the Worker runs now (`10cc13f`, deployed as `975dfdd`), with live model calls: `docs/evidence/quality/eval20-breadth-removal/default-r1/responses/`, figures from each response's `usage.llm` by `node docs/evidence/llm-usage-stats.mjs`. Cost is OpenRouter's reported figure. Caps: from the code; prompt sizes in characters by `npx tsx docs/evidence/prompt-size-at-caps.ts`.

| Part | Calls | Measured (20 searches) | Upper bound from the caps |
|---|---|---|---|
| Brave | 1 to 3 web searches plus 0 to 2 place searches (the client also refuses any call past 6) | 4 in every search, so $0.020 (price-list estimate, not billed) | 5 × $0.005 = $0.025 |
| Normalize (model reads the product) | 1, skipped when the product's reading is cached (30 days); retried once on invalid output | Made in 8 of 20 searches (the run shared one cache between two arms, so this is not the live hit rate); 348 to 351 prompt tokens, 63 to 79 completion tokens, $0.00032 to $0.00034 a call | Prompt 1,578 characters at the 120-character product cap; completion capped at 400 tokens |
| Enrich (model judges each candidate) | 2, one for online and one for local candidates; each retried once | Per call: prompt median 1,678 tokens (max 2,900), completion median 278 (max 382). Per search, both calls: prompt median 3,668 (max 4,197), completion median 532 (max 635); $0.0010 to $0.0025 a call | Prompts 21,862 characters (24 online candidates) and 18,504 (20 local), each candidate at the title and snippet caps with an assumed 200-character URL and 40-character domain (neither is capped, so longer ones raise this); completion capped at 3,000 tokens a call |
| Model use, whole search | | $0.0024 to $0.0040, median $0.0034 | Prompt at most (1,578 + 21,862 + 18,504) × 2 attempts = 83,888 tokens, taking the loose bound of one token per character; completion at most (400 + 3,000 × 2) × 2 = 12,800 tokens. At the $0.75 and $1.00 endpoint: $0.063 + $0.013 ≈ $0.076; at the cheapest: $0.0076 + $0.0044 ≈ $0.012 |

- **Typical search, measured:** about $0.023: $0.020 of Brave (4 calls, estimate) plus $0.0034 of model use. A search that also calls normalize adds about $0.0003.
- **Upper bound:** about $0.10 per search ($0.025 Brave + $0.076 model use at the endpoint the Worker was routed to); about $0.037 if every call went to the cheapest endpoint.
- **Free credit:** $5 of Brave credit a month covers 1,000 requests, about 250 searches at the measured 4 calls each.

## Abuse ceiling

The Worker accepts requests without an `Origin` header (it must be safe to call from curl), and per-client keys can be rotated, so a global rate limit is the spend circuit breaker: 60 searches per minute for the whole Worker by default. At the measured typical $0.023 per search that is about $1.40 per minute; at the upper bound of about $0.10 per search, about $6 per minute. To lower the limit, change `GLOBAL_LIMIT` in `proxy/src/handler.ts` and its mirrors, which must match: the `GLOBAL_LIMITER` binding in `proxy/wrangler.jsonc` and `global_limit_per_minute` in `infra/variables.tf`. Or lower the spend caps on the Brave and OpenRouter keys, to taste. The key spend caps are the last backstop.

## Zip dataset

`public/zips.json` ships as a separate static file, fetched on first search: 1,266,692 bytes raw, 317,402 bytes with `gzip -9` (build of 2026-09-23, [data/README.md](../data/README.md)).
