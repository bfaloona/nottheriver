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

The OpenRouter prices are the cheapest endpoint's. On the same day, endpoints for the primary model ranged from $0.09 to $0.75 per million prompt tokens (https://openrouter.ai/api/v1/models/google/gemma-4-31b-it/endpoints), and OpenRouter may route to a pricier one. The footer therefore uses the cost OpenRouter reports for each call and falls back to the prices above only when that field is missing.

## Cost per search

| Part | Calls | Cost |
|---|---|---|
| Brave | 1 to 3 web searches plus 0 to 2 place searches, so at most 5 (the client also refuses any call past 6) | at most 5 × $0.005 = $0.025 |
| LLM completion | 2 calls (normalize, enrich), each retried once on invalid output; completion capped at 400 and 2,000 tokens | at most (400 + 2,000) × 2 × $0.34/M ≈ $0.0016 |
| LLM prompt | Measured with 30 candidates at the title and snippet caps and 200-character URLs: normalize prompt 1,197 characters, enrich prompt 25,605 characters. URLs are not capped, so a longer URL raises this figure | about (1,197 + 25,605) × 2 × $0.09/M ≈ $0.0048 at the cheapest endpoint's price, taking the loose bound of one token per character; about $0.04 at the $0.75/M endpoint |

- **Upper estimate at the cheapest endpoint:** about $0.03 per search, almost all of it Brave. If OpenRouter routes to the $0.75/M endpoint, the prompt alone adds up to about $0.04, so about $0.07 before any higher completion price at that endpoint.
- **Estimated typical search:** 4 to 5 Brave calls when the model returns the full 3 online and 1 to 2 local queries ($0.020 to $0.025) plus well under $0.002 of LLM use, so about $0.02 to $0.03. The LLM figure is an estimate, not a measurement; the live evaluation in [quality.md](quality.md) will record real per-search cost.
- **Free credit:** $5 of Brave credit a month covers 1,000 requests, about 200 searches at 5 calls each.

## Abuse ceiling

The Worker accepts requests without an `Origin` header (it must be safe to call from curl), and per-client keys can be rotated, so a global rate limit is the spend circuit breaker: 60 searches per minute for the whole Worker by default. At about $0.03 per search that is about $1.80 per minute at the cheapest endpoint's price; the ceiling scales with the endpoint OpenRouter routes to (about $4.20 per minute at $0.07 per search). To lower the limit, change `GLOBAL_LIMIT` in `proxy/src/handler.ts` and its mirrors, which must match: the `GLOBAL_LIMITER` binding in `proxy/wrangler.jsonc` and `global_limit_per_minute` in `infra/variables.tf`. Or lower the spend caps on the Brave and OpenRouter keys, to taste. The key spend caps are the last backstop.

## Zip dataset

`public/zips.json` ships as a separate static file, fetched on first search: 1,266,692 bytes raw, 317,402 bytes with `gzip -9` (build of 2026-09-23, [data/README.md](../data/README.md)).
