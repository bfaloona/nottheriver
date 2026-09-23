# 0001: External services

Status: Accepted (2026-09-23)

## Context

The Worker depends on three external services: Brave Search API (web and local results), OpenRouter (structured LLM calls for query normalization and enrichment), and Cloudflare Workers (hosting, secrets, rate limiting), deployed with OpenTofu. Each service's API surface, plan coverage and unit prices were checked on 2026-09-23 against the URLs in the Checks table before the pipeline was designed. Where a page could not be fetched, the table says so and names the page used instead.

## Decision

### Brave Search API

**Web search** (online queries): `GET https://api.search.brave.com/res/v1/web/search`, header `X-Subscription-Token`.

| Item | Verified value |
|------|----------------|
| Query params used | `q` (required), `count` (max 20, default 20), `country` (2-letter), `search_lang` (ISO 639-1, default `en`), `result_filter` (string array; allowed: `discussions`, `faq`, `infobox`, `news`, `query`, `summarizer`, `videos`, `web`, `locations`) |
| Location headers (exact names, documented on the API-reference page) | `x-loc-lat` (-90..90), `x-loc-long` (-180..180), `x-loc-city`, `x-loc-state` (code up to 3 chars), `x-loc-state-name`, `x-loc-country` (ISO 3166-1 alpha-2), `x-loc-postal-code`, `x-loc-timezone` (IANA). Header names are case-insensitive per HTTP; the docs print them lowercase. |
| `locations` block | Present when a query returns places; `locations.results[]` has `id` (temporary, expires after about 8 hours), `title`, `coordinates`, `postal_address`. |
| Billing | "Only successful requests (non-error responses) are counted against your quota and billed." |

The narrative guide page for web search does not list the `x-loc-*` headers; only the API-reference page does. Both are cited in Checks.

**Local search** (local queries): Brave documents a third local endpoint that takes free text.

| Endpoint | Input | Free text? |
|----------|-------|------------|
| `GET /res/v1/local/place_search` | `q` (optional), `latitude` + `longitude` (required together) or `location` string, `radius` (meters, a bias not a hard cutoff), `count` (1..100, default 20), `country` (default `US`), `units` (`metric` or `imperial`), `safesearch` (default `strict`), `spellcheck`, `geoloc` (`<lat>x<long>`) | Yes |
| `GET /res/v1/local/pois` | `ids` (required, valid 8 hours), `search_lang`, `ui_lang`, `units`; optional `x-loc-lat`/`x-loc-long` headers | No, ids only |
| `GET /res/v1/local/descriptions` | `ids` (required, valid 8 hours) | No, ids only |

`place_search` results carry `id`, `title`, `url` (the business website), `coordinates`, `postal_address` (`streetAddress`, `addressLocality`, `addressRegion`, `postalCode`, `country`, `displayAddress`), `distance` (`value`, `units`), `categories`, `rating`, `contact`, `opening_hours`. No `x-loc-*` headers are documented on `place_search`; coordinates go in query params there.

Live checks with the project's key, 2026-09-23: a web search sent with location headers returned 200 and a `locations` block of 37 entries; `/local/pois` with ids from that block returned 200, and with a free-text query 422; `place_search` returned 200 with 3 results. So the account's plan includes the local endpoints, and `place_search` works with free text.

**Plan and price.** The Search plan is $5.00 per 1,000 requests with $5 free credit per month and a 50 requests/second rate limit. The place-search guide states "Place Search is part of Search plan." Brave's blog post of 2026-07-08 states place search is billed at $5 per 1,000 requests, flat, every field included. The pricing page itself does not itemize place search. The Answers plan ($4 per 1,000 queries plus $5 per million input and output tokens, 2 rps) is not needed. Rate limits are enforced on a 1-second sliding window and reported in `X-RateLimit-Limit`, `X-RateLimit-Policy`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`; exceeding returns 429.

**Design for the fetch step:**

- Online queries (up to 3): web search with `q`, `count=10`, `country=US`, `search_lang=en`, `result_filter=web`, plus headers `x-loc-lat`, `x-loc-long`, `x-loc-city`, `x-loc-state`, `x-loc-country=US`. The centroid is rounded to 2 decimals in the browser before it reaches the Worker, so nothing finer is sent.
- Local queries (up to 2): `place_search` with `q=<local_query>`, `latitude`, `longitude`, `count=10`, `country=US`, `units=metric`. The returned `url` is used for the blocklist domain check; proximity and the displayed distance are haversine from the request centroid (`coordinates`), and Brave's `distance` field is unused. `pois` and `descriptions` are not called; nothing they add is needed for ranking.
- Total: at most 5 Brave calls per search, under the hard cap of 6 that the client enforces.
- Plan gate: place_search returned 200, 3 results on 2026-09-23.
- A web-search fallback for local results (`{product} near {city}, {state}`) is not needed and is not built.

### OpenRouter

Endpoint: `POST https://openrouter.ai/api/v1/chat/completions`, header `Authorization: Bearer <key>`.

| Item | Verified value |
|------|----------------|
| App attribution headers | `HTTP-Referer` ("identifies your app's URL and is used as the primary identifier for rankings") and `X-OpenRouter-Title` ("sets or modifies your app's display name"; "`X-Title` is still supported for backwards compatibility"). Decision: send `HTTP-Referer` and `X-OpenRouter-Title`. Do not send `X-OpenRouter-Categories` or `X-OpenRouter-App-Visibility`. |
| Structured output | `response_format: {type: "json_schema", json_schema: {name, strict: true, schema: {type: "object", properties, required, additionalProperties: false}}}`. Support "varies by provider endpoint, not universally by model." The docs say to set `provider.require_parameters: true` so routing only reaches endpoints that support every parameter in the request. Strict mode "varies: some providers guarantee compliance while others treat schemas as strong hints," so the Worker validates every response against the schema in code. |
| Provider routing fields | `order`, `allow_fallbacks` (default true), `require_parameters` (default false), `data_collection` (`"allow"` or `"deny"`, default `"allow"`), `zdr` (bool), `only`, `ignore`, `quantizations`, `sort`, `max_price`, `preferred_min_throughput`, `preferred_max_latency`, `enforce_distillable_text`. |
| Model fallback | Request field `models: [primary, fallback, ...]` in priority order. Fallback triggers on context-length errors, moderation flags, rate limiting, and downtime. "Requests are priced using the model that was ultimately used, which will be returned in the `model` attribute of the response body." |
| Usage accounting | Always included; `usage: {include: true}` is deprecated and has no effect. Fields: `prompt_tokens`, `completion_tokens`, `total_tokens`, `cost` (credits charged), `cost_details.upstream_inference_cost`, `prompt_tokens_details.cached_tokens`, `completion_tokens_details.reasoning_tokens`, `is_byok`. |
| Token limit field | `max_tokens` is marked deprecated in the API reference in favour of `max_completion_tokens`. |
| Privacy settings | Account page `https://openrouter.ai/settings/privacy`. Documented controls: opt out of routing to providers that may train on prompts (separate toggles for paid and free models), and an account-wide data-policy filter. "This setting has no bearing on OpenRouter's own policies and what we do with your prompts." No page fetched names a distinct prompt-logging toggle; [privacy.md](../privacy.md) says the setting names were not verified. |

**Models** (checked via `GET /api/v1/models` and `GET /api/v1/models/{id}/endpoints`):

| Model | Context | Prompt $/token | Completion $/token | `structured_outputs` | `response_format` |
|-------|---------|----------------|--------------------|----------------------|-------------------|
| `google/gemma-4-31b-it` | 262,144 | 0.00000009 | 0.00000034 | yes | yes |
| `google/gemma-4-26b-a4b-it` | 262,144 | 0.00000009 | 0.0000003 | yes | yes |
| `google/gemma-4-31b-it:free` | 262,144 | 0 | 0 | no | yes |
| `google/gemma-4-26b-a4b-it:free` | 262,144 | 0 | 0 | no | yes |

The model-level prices are the cheapest endpoint's. For `gemma-4-31b-it`, 11 of 13 endpoints list `structured_outputs`, prices range from 0.09 to 0.75 $/M prompt tokens, and quantization ranges from fp4 to bf16. For `gemma-4-26b-a4b-it`, 8 of 12 endpoints list `structured_outputs`. `require_parameters: true` is therefore mandatory. The public endpoints JSON carries no data-policy field, so whether `data_collection: "deny"` leaves a structured-output-capable route is not verified.

**Design:**

- Request: `models: ["google/gemma-4-31b-it", "google/gemma-4-26b-a4b-it"]`, `response_format` with `strict: true`, `provider: {require_parameters: true, data_collection: "deny"}`, `max_completion_tokens` 400 for normalize and 2,000 for enrich, `temperature: 0`. Never `:free` variants.
- The schema sent to the model is structural only (types, required fields, `additionalProperties: false`), because provider support for value keywords such as `maxLength` and `enum` in strict mode is unverified for these endpoints; the full schema is enforced on every reply in code, with one retry before the search fails.
- On an error (including "no endpoints match") the Worker returns a generic `upstream_error`; it never silently drops `data_collection: "deny"`. If this fires at the first live search, the operator decides whether to relax it.
- Optional quality knob, not enabled: `provider.quantizations: ["fp8", "bf16"]` excludes fp4 endpoints at slightly higher cost.
- The cost footer uses `usage.cost` and token counts from each response; no second call. The response's `model` field records which model served.
- Outbound headers are constants: `HTTP-Referer` (site URL from config) and `X-OpenRouter-Title` (site name from config); inbound `User-Agent` and `Referer` never reach OpenRouter.

### Cloudflare Workers

**Rate Limiting binding.** GA since 2025-09-19 ("the `ratelimit` binding is now stable and recommended for all production workloads"). Wrangler 4.36.0 or later. Config: `ratelimits[]` with `name`, `namespace_id` (string containing a positive integer, unique per account), `simple.limit` (number), `simple.period` (seconds, "Must be either `10` or `60`"). `simple` is the only supported type. API: `await env.LIMITER.limit({key})` returns `{success}`. Caveats from the docs: counters are per Cloudflare location, eventually consistent, "intentionally designed to not be used as an accurate accounting system"; the docs advise against IP addresses as keys because many users can share one. Bindings with the same `namespace_id` share counters.

Plan availability: the runtime doc, the Workers pricing page and the GA changelog say nothing about plan tiers, and the pricing page has no rate-limiting line item. No official page restricts the binding to paid plans, and none confirms it on Free. The first `tofu apply` settles it; an in-memory fallback stays in the code for the case where the binding is absent.

**A 600-second window is not allowed,** so "30 searches per IP per 10 minutes" cannot be expressed directly.

| Option | Config | Sustained max per 10 min | Burst |
|--------|--------|--------------------------|-------|
| A | `limit: 3, period: 60` | 30 | 3/min |
| B | `limit: 5, period: 60` | 50 | 5/min |
| C | `limit: 30, period: 60` | 300 | 30/min |

Decision: C, plus a second, global limiter.

- `RATE_LIMITER`: 30 per 60 s per client key, where the key is the `CF-Connecting-IP` header (Cloudflare's documented client-IP header), used whole for IPv4 and cut to the /64 prefix for IPv6 so one subscriber cannot rotate through addresses.
- `GLOBAL_LIMITER`: 60 per 60 s for the whole Worker, keyed on a constant. This is the spend circuit breaker: the Worker accepts requests without an `Origin` header by design, and client keys can be rotated, so only a global ceiling bounds spend per minute ([costs.md](../costs.md)).

With the global breaker in place the per-client number no longer controls spend, so C keeps the requirement's burst number and accepts a sustained ceiling 10 times higher ([debt.md](../debt.md)). The Terraform schema also exposes `simple.mitigation_timeout` ("0, 10, or multiples of 60 up to 86400"); the runtime doc does not mention it, so it is not relied on.

**Free-plan limits that shape the Worker** (Workers Free vs Paid): 100,000 requests/day vs no limit; CPU time 10 ms vs 5 min per invocation; subrequests 50 vs 10,000 per request; 6 simultaneous outgoing connections on both; env var and secret size 5 KB on both. At most 5 Brave calls plus up to 4 OpenRouter attempts per search is well under 50 subrequests, but the 10 ms CPU budget means schema validation, blocklist matching and scoring must be cheap (validators compiled once at module scope). Per the limits page, "Waiting on network requests (such as `fetch()` calls, KV reads, or database queries) does not count toward CPU time."

**OpenTofu and the Cloudflare provider.** Provider `cloudflare/cloudflare` v5.25.0 (released 2026-09-11) is the latest on GitHub and on the OpenTofu registry.

| Resource | Role | Key arguments |
|----------|------|---------------|
| `cloudflare_workers_script` | Upload the Worker and its bindings (stable) | `account_id`, `script_name`, `content_file` + `content_sha256` (required together), `main_module`, `compatibility_date`, `bindings[]` |
| `cloudflare_workers_script_subdomain` | Enable `<script>.<account>.workers.dev` | `account_id`, `script_name`, `enabled = true`, `previews_enabled = false` |
| `cloudflare_workers_route` | Route on a custom zone (custom domain only) | `zone_id`, `pattern`, `script` |
| `cloudflare_worker` + `cloudflare_worker_version` + `cloudflare_workers_deployment` | Newer trio; the provider docs label it beta and note `cloudflare_workers_script_subdomain` is redundant with `cloudflare_worker` | not used |

Bindings (`type` values verified in the schema): `secret_text` for `BRAVE_API_KEY` and `OPENROUTER_API_KEY`; `plain_text` for `ALLOWED_ORIGIN`, `SITE_NAME` and `SITE_URL`; `ratelimit` for `RATE_LIMITER` (`namespace_id = "1001"`, `simple = {limit = var.rate_limit_per_minute, period = 60}`) and `GLOBAL_LIMITER` (`namespace_id = "1002"`, `simple = {limit = var.global_limit_per_minute, period = 60}`). `text` is marked Sensitive in the schema; variables holding keys and account-identifying values are `sensitive = true` and come from `TF_VAR_*`.

Decision: `cloudflare_workers_script` plus `cloudflare_workers_script_subdomain`; no `cloudflare_workers_route` until a custom domain exists.

## Consequences

- The fetch step uses `place_search` for local results; the local fixtures follow the `place_search` result shape.
- Coordinates travel to Brave two ways: as `x-loc-*` headers on web search and as `latitude`/`longitude` query params on place search. [privacy.md](../privacy.md) states both.
- `provider.require_parameters: true` is a hard requirement, because some Gemma endpoints do not support structured outputs (2 of 13 on the primary model, 4 of 12 on the fallback).
- `data_collection: "deny"` may leave no eligible route; only the first live search can show this.
- Rate limiting is 30 per minute per client plus 60 per minute globally, not 30 per 10 minutes; the in-memory fallback stays in case the binding is unavailable on the Free plan.
- The Worker must fit the 10 ms CPU budget on the Free plan; the schema validator was chosen with that in mind.
- OpenTofu uses stable v5 resources; migrating to the `cloudflare_worker` trio waits until it leaves beta.
- Unit prices and cost per search are in [costs.md](../costs.md).

## Checks

| URL | What was verified | Date |
|-----|-------------------|------|
| https://api-dashboard.search.brave.com/app/documentation/web-search/query | Web search query params (`q`, `count` max 20, `country`, `search_lang`, `offset`, `freshness`, `safesearch`, `extra_snippets`); only `X-Subscription-Token` header shown | 2026-09-23 |
| https://api-dashboard.search.brave.com/app/documentation/web-search/headers | 404 Not Found; replaced by the API-reference page below | 2026-09-23 |
| https://api-dashboard.search.brave.com/app/documentation/web-search/local-search | 404 Not Found; replaced by the place-search guide below | 2026-09-23 |
| https://api-dashboard.search.brave.com/app/documentation/web-search/responses | `locations` results carry a temporary `id` (about 8 hours); full schema not on this page | 2026-09-23 |
| https://api-dashboard.search.brave.com/api-reference/web/search/get | `x-loc-*` headers; `result_filter` allowed values; `locations.results[]` fields; web results are `web.results[]` with `title`, `url`, `description`, `meta_url`, `profile`, `extra_snippets` | 2026-09-23 |
| https://api-dashboard.search.brave.com/api-reference/web/search/post | POST variant exists with the same `x-loc-*` headers and `result_filter` values | 2026-09-23 |
| https://api-dashboard.search.brave.com/documentation/services/web-search | Guide page; lists `q`, `count`, `country`, `search_lang`; does not list `x-loc-*` headers; POI `id` expires after about 8 hours | 2026-09-23 |
| https://api-dashboard.search.brave.com/documentation/services/place-search | `place_search` takes free-text `q`; `pois` and `descriptions` take `ids` only; up to 20 ids per request; "Place Search is part of Search plan" | 2026-09-23 |
| https://api-dashboard.search.brave.com/api-reference/web/place_search | `place_search` params, headers, result fields | 2026-09-23 |
| https://api-dashboard.search.brave.com/api-reference/web/local_pois | `GET /res/v1/local/pois` takes `ids` (8-hour validity), optional `x-loc-lat`/`x-loc-long`; result fields | 2026-09-23 |
| https://api-dashboard.search.brave.com/api-reference/web/poi_descriptions | `GET /res/v1/local/descriptions` takes `ids` only; returns AI-generated descriptions | 2026-09-23 |
| https://api-dashboard.search.brave.com/documentation/pricing | Search plan $5.00 per 1,000 requests, $5 free credit monthly, 50 rps; Answers plan $4.00 per 1,000 plus $5 per million tokens, 2 rps | 2026-09-23 |
| https://brave.com/search/api/ | Same plan prices as above; local search not itemized | 2026-09-23 |
| https://brave.com/blog/place-search-improved/ | Place search $5 per 1,000 requests flat, on the Search plan; post dated 2026-07-08 | 2026-09-23 |
| https://api-dashboard.search.brave.com/documentation/guides/rate-limiting | 1-second sliding window; 429 on excess; `X-RateLimit-*` headers; only successful requests are billed | 2026-09-23 |
| Brave API, live calls with the project key | Web search with location headers: 200, `locations` block of 37 entries; `/local/pois` by ids: 200; `/local/pois` free text: 422; `place_search`: 200, 3 results | 2026-09-23 |
| https://openrouter.ai/docs/api-reference/overview | Chat completions URL and bearer auth; `HTTP-Referer`, `X-OpenRouter-Title`, `X-Title` (alias); usage always returned | 2026-09-23 |
| https://openrouter.ai/docs/api-reference/authentication | `HTTP-Referer` and `X-OpenRouter-Title` listed as the optional headers | 2026-09-23 |
| https://openrouter.ai/docs/app-attribution | `X-OpenRouter-Title` is current; "`X-Title` is still supported for backwards compatibility" | 2026-09-23 |
| https://openrouter.ai/docs/features/structured-outputs | `response_format.json_schema` with `strict: true`; support varies by provider endpoint; use `require_parameters: true` | 2026-09-23 |
| https://openrouter.ai/docs/features/provider-routing | `provider` object fields and defaults | 2026-09-23 |
| https://openrouter.ai/docs/guides/routing/model-fallbacks | `models` array; fallback triggers; billed and reported by the `model` actually used | 2026-09-23 |
| https://openrouter.ai/docs/use-cases/usage-accounting | Usage always included; `usage.include` deprecated; `cost` and `cost_details` fields | 2026-09-23 |
| https://openrouter.ai/docs/api-reference/chat-completion | Request fields (`response_format`, `provider`, `models`, `max_tokens` deprecated for `max_completion_tokens`); response `usage` fields | 2026-09-23 |
| https://openrouter.ai/docs/features/privacy-and-logging | Training opt-out (separate paid and free), account-wide data-policy filter at /settings/privacy; no distinct logging toggle named | 2026-09-23 |
| https://openrouter.ai/api/v1/models | Pricing and `supported_parameters` for the four Gemma 4 ids | 2026-09-23 |
| https://openrouter.ai/api/v1/models/google/gemma-4-31b-it/endpoints | 13 endpoints, 11 with `structured_outputs`; price and quantization spread; no data-policy field | 2026-09-23 |
| https://openrouter.ai/api/v1/models/google/gemma-4-26b-a4b-it/endpoints | 12 endpoints, 8 with `structured_outputs` | 2026-09-23 |
| https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/ | `ratelimits` config, `period` must be 10 or 60, `limit()` API, per-location and eventually consistent, advice against IP keys | 2026-09-23 |
| https://developers.cloudflare.com/changelog/2025-09-19-ratelimit-workers-ga/ | Rate Limiting in Workers GA; `ratelimit` binding stable; no plan note | 2026-09-23 |
| https://developers.cloudflare.com/changelog/2025-09-15-rate-limiting-ga/ | 404 (guessed URL); replaced by the 2025-09-19 entry above | 2026-09-23 |
| https://developers.cloudflare.com/workers/platform/pricing/ | Free plan 100,000 requests/day; no rate-limiting line item | 2026-09-23 |
| https://developers.cloudflare.com/workers/platform/limits/ | Free vs Paid: CPU 10 ms vs 5 min, subrequests 50 vs 10,000, 6 simultaneous connections, 5 KB env vars | 2026-09-23 |
| https://developers.cloudflare.com/workers/platform/limits/index.md | "Waiting on network requests (such as `fetch()` calls, KV reads, or database queries) does not count toward CPU time." | 2026-09-23 |
| https://developers.cloudflare.com/workers/wrangler/configuration/ | Page fetched; `ratelimits` section not present in the rendered content used | 2026-09-23 |
| https://developers.cloudflare.com/workers/runtime-apis/bindings/ | Rate Limiting listed with no plan or beta annotation | 2026-09-23 |
| https://developers.cloudflare.com/workers/platform/infrastructure-as-code/ | Recommends `cloudflare_worker` + `cloudflare_worker_version` + `cloudflare_workers_deployment`; `plain_text` and `secret_text` binding examples | 2026-09-23 |
| https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/workers_script | Page is JS-rendered and returned no content to the fetcher; replaced by the provider repo docs below | 2026-09-23 |
| https://raw.githubusercontent.com/cloudflare/terraform-provider-cloudflare/main/docs/resources/workers_script.md | `cloudflare_workers_script` schema: `content_file` requires `content_sha256`; binding `type` values include `plain_text`, `secret_text`, `ratelimit`; `text` (Sensitive), `namespace_id`, `simple {limit, period, mitigation_timeout}` | 2026-09-23 |
| https://raw.githubusercontent.com/cloudflare/terraform-provider-cloudflare/main/docs/resources/workers_script_subdomain.md | `account_id`, `script_name`, `enabled`, `previews_enabled`; noted redundant with `cloudflare_worker` | 2026-09-23 |
| https://raw.githubusercontent.com/cloudflare/terraform-provider-cloudflare/main/docs/resources/workers_route.md | `zone_id`, `pattern`, `script` (zone required) | 2026-09-23 |
| https://raw.githubusercontent.com/cloudflare/terraform-provider-cloudflare/main/docs/resources/worker.md | `cloudflare_worker` with nested `subdomain {enabled, previews_enabled}` | 2026-09-23 |
| https://raw.githubusercontent.com/cloudflare/terraform-provider-cloudflare/main/docs/resources/worker_version.md | `cloudflare_worker_version` bindings (same `ratelimit`/`simple` shape), `modules[] {name, content_type, content_file}` | 2026-09-23 |
| https://api.github.com/repos/cloudflare/terraform-provider-cloudflare/releases/latest | Latest release v5.25.0, 2026-09-11 | 2026-09-23 |
| https://api.opentofu.org/registry/docs/providers/cloudflare/cloudflare/index.json | OpenTofu registry lists v5.25.0 as latest | 2026-09-23 |
| https://developers.cloudflare.com/fundamentals/reference/http-headers/index.md | `CF-Connecting-IP` "provides the client IP address connecting to Cloudflare" | 2026-09-23 |
