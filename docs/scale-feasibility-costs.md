# Scale feasibility: what a month costs

Product design feasibility, the money side: what a search costs today, what a month costs at 300 to 300,000 searches, and how far caching and storage choices move that. Read-only research, 2026-10-08, branch `main` at 3deed0e. Companion on what can be cached or stored: [scale-feasibility-reuse.md](scale-feasibility-reuse.md). Summary and operator questions: [scale-feasibility.md](scale-feasibility.md).

Every figure is one of three kinds and is labelled: **measured** (from saved responses or the code), **list price** (a pricing page read on the date given, see Sources), or **projection** (arithmetic on measured figures and list prices, with its assumptions on the same line). Nothing here is billed data. "Routed price" means the $0.75 per million prompt and $1.00 per million completion tokens every call in the 2026-10-01 run was billed at; "cheapest endpoint" means $0.09 and $0.34 (`docs/costs.md:14,18`).

**Short answer.** A search costs about $0.023 today and Brave is 85% of it at the routed model price, 97% at the cheapest. The curve is a straight line in searches: about $65 a month at 3,000 searches, $700 at 30,000, $7,000 at 300,000 (projection, assumptions in B). No free tier matters except Brave's $5 credit, which ends at 250 searches a month. Cloudflare stays at $0 to $5 a month through 300,000 searches. No model-side cache or routing choice moves the total more than 12%; the only lever above that is the Brave call count, where each call removed is 21% of the total.

## A. Base: per-search cost today

Measured on the 20 graded searches run 2026-10-01 (`docs/evidence/quality/eval20-breadth-removal/default-r1/responses/`, figures by `node docs/evidence/llm-usage-stats.mjs <dir>`, rerun 2026-10-08). Each search made exactly 2 web searches and 2 place searches (`body.query.online_queries` and `local_queries`, 2+2 in all 20 files). 8 of 20 searches called normalize; the other 12 hit the KV cache, but the run shared one cache between two arms, so 40% is not a live miss rate (`docs/costs.md:27`).

| Part | Min | Median | Max | Kind |
|---|---|---|---|---|
| Brave calls | 4 | 4 | 4 | measured |
| Brave at list price, $0.005 per call | $0.020 | $0.020 | $0.020 | list price, not billed |
| Normalize call, routed price (8 calls) | $0.000325 | $0.000328 | $0.000342 | measured, OpenRouter's reported cost |
| Normalize call, cheapest endpoint (same tokens: 349 prompt, 66 completion) | | $0.000054 | | projection |
| Enrich, both calls per search, routed price (prompt 2,758 to 4,197 tokens, completion 364 to 635) | $0.00243 | $0.00328 | $0.00378 | measured tokens, routed price |
| Enrich, both calls, cheapest endpoint (same tokens) | $0.00037 | $0.00051 | $0.00059 | projection |
| Model use, whole search, routed | $0.00243 | $0.00342 | $0.00397 | measured, OpenRouter's reported cost; mean $0.00338 |
| Model use, whole search, cheapest | $0.00037 | about $0.00053 | $0.00065 | projection |
| **Whole search, routed** | $0.0224 | **$0.0234** | $0.0240 | projection: list Brave + measured model |
| **Whole search, cheapest endpoint** | $0.0204 | **$0.0205** | $0.0207 | projection |

- Normalize hit vs miss: a miss adds $0.00033 at the routed price (1.4% of a search), $0.00005 at the cheapest.
- Caveat from `docs/costs.md:18`: OpenRouter routes for throughput (`proxy/src/llm.ts:78`), and all 96 calls in the 2026-10-01 check landed on the $0.75/$1.00 endpoint, 6.4 times the cheapest for that token mix. The endpoint list read 2026-10-08 still spans $0.09 to $0.75 prompt and $0.34 to $1.15 completion across 13 endpoints; which one a future call lands on is not under the Worker's control beyond the sort setting.
- Upper bound per search from the caps: about $0.10 at the routed price, $0.037 at the cheapest (`docs/costs.md:29,32`). Used in D.
- OpenRouter adds a 5.5% fee ($0.80 minimum) when credits are bought (list price, 2026-10-08). The tables below show pre-fee model cost; add 5.5% to the OpenRouter column.

## B. Scale scenarios

Projection from the measured per-search figures. Assumptions, all rows: 4 Brave calls a search at $0.005; a 40% normalize miss rate (the eval run's, not live); model cost per search = enrich $0.00325 + 0.4 × normalize, so $0.00338 routed and $0.00053 cheapest; 2 Worker requests a search (CORS preflight plus POST, `docs/search-latency.md:23`); 1 KV read a search and 1 KV write a miss (`proxy/src/pipeline.ts:298-310`); 30-day month; Cloudflare Workers Free unless a limit forces Paid. There is no measured searches-per-user figure anywhere in the repo, so the user rows are two guesses shown side by side.

| | 300 searches/month | 3,000 | 30,000 | 300,000 |
|---|---|---|---|---|
| Searches a day | 10 | 100 | 1,000 | 10,000 |
| Users if 3 searches a user a month (assumption) | 100 | 1,000 | 10,000 | 100,000 |
| Users if 10 searches a user a month (assumption) | 30 | 300 | 3,000 | 30,000 |
| Brave calls a month | 1,200 | 12,000 | 120,000 | 1,200,000 |
| Brave at list, after the $5 monthly credit | $1.00 | $55 | $595 | $5,995 |
| OpenRouter, routed price | $1.01 | $10.14 | $101 | $1,014 |
| OpenRouter, cheapest endpoint | $0.16 | $1.59 | $16 | $159 |
| Worker requests a day (Free cap 100,000) | 20 | 200 | 2,000 | 20,000 |
| KV reads a day (Free cap 100,000) | 10 | 100 | 1,000 | 10,000 |
| KV writes a day at 40% miss (Free cap 1,000) | 4 | 40 | 400 | **4,000: over the cap** |
| Cloudflare | $0 | $0 | $0 | $5 (Paid, see note) |
| **Total, routed** | **$2.01** | **$65** | **$696** | **$7,014** |
| Per search, routed | $0.0067 | $0.0217 | $0.0232 | $0.0234 |
| **Total, cheapest endpoint** | **$1.16** | **$57** | **$611** | **$6,159** |
| Per search, cheapest | $0.0039 | $0.0189 | $0.0204 | $0.0205 |

Where each free tier ends and where a plan step is forced (projection, same assumptions):

| Threshold | Searches a month | Source |
|---|---|---|
| Brave $5 credit used up (1,000 calls) | 250 | list price 2026-10-08, `docs/costs.md:33` |
| Workers KV Free, 1,000 writes a day, at 40% miss | 75,000 (30,000 if every product is new) | list price 2026-10-08 |
| Workers Free, 100,000 requests a day, 2 a search | 1,500,000 | list price 2026-10-08 |
| Workers KV Free, 100,000 reads a day | 3,000,000 | list price 2026-10-08 |
| Workers Free 10 ms CPU per invocation | unmeasured; `docs/debt.md:34` already trimmed runtime validation to stay inside it | code |
| OpenRouter | no tier; prepaid credits, per-key cap (D) | list price 2026-10-08 |

Note on the $5: past the KV write cap the Worker does not fail, it stops caching (`proxy/src/normalize-cache.ts:36`). At 300,000 searches the 3,000 uncached misses a day cost about $30 a month in repeat normalize calls at the routed price ($5 at the cheapest), so Workers Paid ($5 minimum a month, 10 million requests and 1 million KV writes included) pays for itself there and nowhere lower. Workers Paid is never forced by request volume inside this ladder.

## C. Sensitivity: what each cache or choice is worth

Each row: cost at scale without, with, and the hit rate at which the change covers any new platform cost. All projections on the B assumptions unless stated.

### C1. Normalize cache hit rate (today 60% in one eval run, live rate unknown)

| Scale | Model cost at 0% hit (routed / cheapest) | At 60% hit | At 100% hit | Break-even for the $5 Paid plan to keep writes flowing |
|---|---|---|---|---|
| 30,000 | $107 / $17 | $101 / $16 | $98 / $15 | never: writes stay under the Free cap below 75,000 searches at 40% miss |
| 300,000 | $1,073 / $168 | $1,014 / $158 | $975 / $152 | routed: Paid pays off once lost writes exceed about 500 a day (about 113,000 searches a month at 40% miss); cheapest: about 306,000 |

The whole normalize call is 1.4% of a search at the routed price, so this cache's money value tops out near $100 a month at 300,000 searches. Its real value is repeatable wording (`docs/caching-and-store-types.md:13`), and it also saves 0.9 to 7.8 s on a hit (E). The projection assumes each lost write costs exactly one extra normalize call later, which overstates it when a product is never searched again.

### C2. Place-search cache by local query and 2-decimal zip center (ruled out for now, CQ1, `docs/caching-and-store-types.md:92`)

Place search is 2 of the 4 Brave calls, $0.010 a search (list price). A hit saves both calls for that search; the cache needs 2 KV reads a search and 2 writes a miss.

| Scale | Brave without | With, 10% hit | With, 30% hit | With, 50% hit | New platform cost | Break-even hit rate |
|---|---|---|---|---|---|---|
| 3,000 | $60 | $57 | $51 | $45 | $0 (200 writes a day at most) | 0% |
| 30,000 | $600 | $570 | $510 | $450 | $0 while misses are under 50%; else Paid $5 | 1.7% |
| 300,000 | $6,000 | $5,700 | $5,100 | $4,500 | Paid $5 (writes pass 1,000 a day at any miss rate) | 0.17% |

Any hit rate above 2% pays for the platform, so the ruling is not a money question. What is unknown is the hit rate itself, and no live data exists (the eval had 0 repeats of (query, center) in 120 place calls: 30 zip areas with two different products each, no shared local wording; companion note I3). Two facts from the reuse note change what to expect: the local query names a store type, not the product, so one cached draw serves every product in a category for that zip area (20 eval products collapsed to 26 local wordings, reuse note E1), which makes hits denser than the 2026-09-27 "sparse" judgment assumed; and the hit rate is a function of searches per zip area per TTL, so it is near zero for users spread across the country and real only for a city-focused launch.

A web-search cache (the other $0.010) has the same arithmetic. Its key must carry city, state and the center today (`docs/caching-and-store-types.md:33`), so it hits less often and carries the CQ1 privacy shape; but if the reuse note's RQ6 experiment (about 60 Brave calls) shows the location headers barely change web results, the key becomes the query alone, shared by everyone who searches that product, with no location stored at all (reuse note E2). That variant still needs a privacy row (a second list of product wordings) but pairs no search term with a location, and at the same hit rates it is worth the same $0.010 a search. The privacy and staleness costs of both are in the reuse note.

### C3. Enrich verdict cache per candidate (per shop and product; dropped 2026-09-27, CQ2)

Enrich is $0.00325 a search routed, $0.00051 cheapest. The two calls covered about 40 candidates in the measured run (2 web queries of 10 plus 20 local; the cap allows 24 online, `docs/architecture.md:26`). Instructions go out once per call, about 500 prompt tokens each (the split added 500 tokens, 3,459 to 3,959, `docs/search-latency.md:111`), so about 1,000 of the median 3,668 prompt tokens, 27%, are sent regardless. The cacheable part is about $0.0025 routed, $0.00042 cheapest, and one candidate is about 67 prompt and 13 completion tokens: $0.000063 routed, $0.000010 cheapest (projection from the 20-search token sums). A per-shop key without the product caches only `site_type`; `sells_product` still needs the model, so it saves tokens only if the prompt is also changed.

| Scale | Enrich without (routed / cheapest) | 30% hit | 60% hit | 100% hit (every candidate known, call skipped) | New platform cost | Break-even hit rate (routed / cheapest) |
|---|---|---|---|---|---|---|
| 3,000 | $9.75 / $1.53 | $7.50 / $1.15 | $5.25 / $0.77 | $2.25 / $0.27 | Paid $5: 40 writes a miss passes 1,000 a day at 25 miss-searches a day | 67% / over 100% |
| 30,000 | $98 / $15 | $75 / $12 | $53 / $8 | $23 / $3 | Paid $5; KV reads 40,000 a day stay Free | 7% / 40% |
| 300,000 | $975 / $153 | $750 / $115 | $525 / $77 | $225 / $27 | Paid $5, plus KV overage about $25 a month at 50% miss (6 million writes, 1 million included, $5 a million); in D1 or a Durable Object SQLite store the same rows are inside the included 50 million writes, so $5 flat | 4% / 26% |

So this cache belongs in D1 or Durable Object SQLite, not KV, and it is worth doing only at the routed price or above 30,000 searches. Two caveats carried from the earlier research: a cached "no" hides a real shop for the whole TTL, so only "yes" and "maybe" are safe to cache, which lowers the hit rate; and a cached verdict was made in a different context (`docs/caching-and-store-types.md:34`).

### C4. Routing: throughput (today) vs cheapest endpoint

No platform cost; the premium is $0.00285 a search (measured $0.00338 less projected $0.00053), 12% of the total at every scale.

| Scale | Model cost, throughput routing | Model cost, cheapest | Premium a month | What it bought when measured |
|---|---|---|---|---|
| 300 | $1.01 | $0.16 | $0.86 | median search 14.0 to 14.8 s became 7.0 to 7.9 s (`docs/search-latency.md:83-84`); later 3.1 to 4.4 s on the same provider (`:106-107`) |
| 3,000 | $10 | $1.59 | $8.55 | |
| 30,000 | $101 | $16 | $86 | |
| 300,000 | $1,014 | $159 | $855 | |

Break-even is a product judgment, not a hit rate: about $0.003 a search for roughly half the wait. Provider speeds vary 3x on one provider (`docs/search-latency.md:39`) and all 13 endpoints reported null throughput on 2026-10-08, so a cheapest-with-a-speed-floor setting cannot be evaluated from the list.

### C5. The lever bigger than any cache: Brave calls per search

Projection: each Brave call removed saves $0.005 a search, 21% of the total at the routed price, $150 a month at 30,000 and $1,500 at 300,000. `docs/debt.md:31` records two untested options: web search `count` up to 20 is the same billed call (so 1 web call with 20 results instead of 2 with 10), and the two local queries could become one. Both change which shops are found, so each needs an eval run, not just a price check. This note cannot say what recall they cost.

## D. Abuse and ceilings

Global limit: 60 searches a minute for the whole Worker (`proxy/src/handler.ts:12`, mirrored in `proxy/wrangler.jsonc` and `infra/variables.tf`). Projection at the measured typical $0.0234 and the cap-derived upper bound $0.10 a search:

| Window | Searches at 60 a minute | Typical | Upper bound |
|---|---|---|---|
| Minute | 60 | $1.40 | $6.00 |
| Hour | 3,600 | $84 | $360 |
| Day | 86,400 | $2,022 | $8,640 |
| 30 days | 2,592,000 | $60,650 | $259,200 |

Why those are not real ceilings:

| Gap | Effect | Source |
|---|---|---|
| The Cloudflare rate-limit binding did not throttle in a live test (135 requests, no 429) | the 60 a minute may not hold at all | `docs/debt.md:10` |
| The in-memory limiter counts per isolate | n isolates allow n × 60 a minute | `docs/debt.md:10`, `handler.ts:55` |
| Binding counts are per Cloudflare location and approximate | the "global" 60 is really per location | `docs/privacy.md:29` |
| Workers Free: 100,000 requests a day | an accidental hard ceiling at 100,000 searches a day if an attacker skips preflight: about $2,340 typical, $10,000 upper bound, a day. Upgrading to Paid removes it | list price 2026-10-08 |
| Brave Search plan: 50 queries a second | caps Brave spend at about $21,600 a day; errors (429) are not billed | list price 2026-10-08, `docs/costs.md:11` |

Provider caps, the real backstop (`docs/architecture.md:44`; the values are not in the repo and should not be):

| Provider | Mechanism | Verified |
|---|---|---|
| OpenRouter | optional spending cap per API key (`limit`, `limit_remaining`, `limit_reset` on `GET /api/v1/key`); requests fail with 402 `openrouter_key_limit` once spent | yes, 2026-10-08 |
| Brave | a "Monthly quota (0 for unlimited)" is associated with the plan; whether the operator can set it per key in the dashboard | unverified; the pricing page is JavaScript-rendered and the rate-limiting guide shows the quota only as an example |

A bad day: a scraper holding 60 searches a minute for 24 hours at one location costs about $2,000, of which about $1,730 is Brave (projection). The OpenRouter key cap does not stop that: the pipeline runs normalize, then Brave, then enrich (`proxy/src/pipeline.ts:321-324`), so once the model key is exhausted a search for a cached product still makes its 4 Brave calls before failing at enrich. Only a Brave quota caps the 85%.

## E. Latency as a cost

What a shopper waits today, measured:

| Measurement | Median | p90 | Max | Source |
|---|---|---|---|---|
| 20 eval searches, 2026-10-01, run locally through the Worker code (`elapsed_ms`) | 5.2 s | 11.5 s | 15.7 s | `default-r1/responses/`, read 2026-10-08 |
| 60 searches × 2 rounds with split enrich, 2026-09-28, all on ModelRun | 3.1 to 3.6 s | 3.7 to 4.5 s | | `docs/search-latency.md:107` |
| Live site through the browser, 2026-09-27, before the speed work | 27 to 66 s | | | `docs/search-latency.md:24` |

Where the time goes after the speed work: enrich 2.3 s median on 2026-09-28 (`search-latency.md:107`) and 4.1 s on 2026-10-01 (`docs/quality.md:108`), Brave 0.8 to 0.9 s (`:34-37`), normalize 0.9 to 7.8 s when called (`:34-37`, measured before throughput routing; its wait was provider queueing, not work). The page shows only "Searching" meanwhile (`:150`). No live measurement exists since the speed work; observability is off (`docs/privacy.md:31`).

| Choice | Seconds it moves | Money it moves |
|---|---|---|
| Normalize cache hit | saves the normalize call, 0.9 to 7.8 s at the last measurement | $0.00033 |
| Place or web search cache | under 1 s; "not worth doing for speed" (`search-latency.md:148`) | $0.010 each |
| Enrich verdict cache | up to the enrich time (2.3 s median on 2026-09-28, 4.1 s on 2026-10-01) only when every candidate hits; otherwise output tokens, the time driver, shrink with the candidate count | up to $0.0025 |
| Cheapest-endpoint routing | adds back about 7 s a search at the 2026-09-28 measurement | saves $0.00285 |
| One fewer Brave call | about 0 s (calls run in parallel) | saves $0.005 |

The money and the seconds point different ways: the cheapest cost cut (Brave calls) buys no time, and the biggest time cost (routing) is the cheapest to keep.

## F. Questions for the operator ($Q)

- $Q1. Is $0.023 a search (about $0.70 per 30 searches) an acceptable unit cost until a Brave-call reduction is evaluated? Recommendation: yes; nothing on the model side moves it more than 12%, so cache work should not be justified by money below 30,000 searches a month.
- $Q2. When does Workers Paid ($5 a month) switch on? Recommendation: when KV writes approach 1,000 a day (about 2,500 searches a day at the eval's miss rate) or when a cache that needs D1 ships; the Durable Object limiter fix from `docs/debt.md:10` runs on Free (SQLite-backed objects are on the Free plan, list price 2026-10-08), so it is not a reason.
- $Q3. Add a Brave payment method and a monthly quota before any public link? The $5 credit is 250 searches a month, one busy day, and what Brave does past it without a card is unverified. Recommendation: yes, with the quota set to the month's budget (for example 12,000 calls = $60 = 3,000 searches) and raised deliberately.
- $Q4. Revisit CQ1 (place-search cache) with these numbers? It is worth hit rate × $0.010 a search and covers its platform cost above a 2% hit rate, but it is under $150 a month below 30,000 searches. Recommendation: leave the ruling until 30,000 a month or a city-focused launch where the hit rate would be real; decide on privacy, not money. The reuse note's RQ6 (web cache keyed by query alone, no location) is the better first cache if it pans out: same $0.010 a search, no location in the row; and its RQ4 daily counters are what turn every "hit rate unknown" in this note into a number.
- $Q5. Fund an eval of 3 Brave calls a search (1 web call at `count` 20, or 1 local query)? Recommendation: yes, before any cache work; it is the only change above the routing premium's 12% of the total, and the eval harness already exists.
- $Q6. What monthly spend ceiling goes on the two keys? Recommendation: OpenRouter key cap at about twice the expected month, Brave quota at the month's budget per $Q3; both are explicit guesses until the reuse note's RQ4 counters give a measured month, reviewed monthly; record in `docs/costs.md` that caps exist, never the values.

## Sources

| Price | Figure | URL | Read |
|---|---|---|---|
| Workers Free | 100,000 requests a day, 10 ms CPU an invocation | https://developers.cloudflare.com/workers/platform/pricing/ | 2026-10-08 |
| Workers Paid | $5 a month minimum; 10 million requests included, +$0.30 a million; 30 million CPU-ms included, +$0.02 a million | same | 2026-10-08 |
| Workers KV Free | 100,000 reads, 1,000 writes, 1,000 deletes, 1,000 lists a day; 1 GB | https://developers.cloudflare.com/kv/platform/pricing/ | 2026-10-08 |
| Workers KV Paid | 10 million reads (+$0.50 a million), 1 million writes (+$5 a million), 1 GB (+$0.50 a GB-month) a month | same | 2026-10-08 |
| Durable Objects | Free (SQLite backend only): 100,000 requests a day, 13,000 GB-s a day, 5 million rows read and 100,000 written a day, 5 GB; Paid: 1 million requests (+$0.15 a million), 400,000 GB-s (+$12.50 a million), 25 billion rows read (+$0.001 a million), 50 million rows written (+$1 a million), 5 GB-month (+$0.20) | https://developers.cloudflare.com/durable-objects/platform/pricing/ | 2026-10-08 |
| D1 | Free: 5 million rows read and 100,000 written a day, 5 GB; Paid: 25 billion rows read (+$0.001 a million), 50 million written (+$1 a million), 5 GB (+$0.75 a GB-month) | https://developers.cloudflare.com/d1/platform/pricing/ | 2026-10-08 |
| Brave Search plan | $5 per 1,000 requests, $5 free credit a month, 50 queries a second; place search "is part of Search plan" | https://brave.com/search/api/ and https://api-dashboard.search.brave.com/documentation/services/place-search | 2026-10-08 |
| Brave billing rule | only successful (non-error) responses are billed; monthly quota "associated with your plan", shown only as an example | https://api-dashboard.search.brave.com/documentation/guides/rate-limiting | 2026-10-08 |
| Brave pricing page | JavaScript-rendered; no figures in the fetched HTML, so the plan price above comes from brave.com/search/api, and per-key quota setting is **unverified** | https://api-dashboard.search.brave.com/documentation/pricing | 2026-10-08 |
| OpenRouter gemma-4-31b-it endpoints | 13 endpoints, prompt $0.09 (DeepInfra fp4) to $0.75 (ModelRun, SiliconFlow) a million; completion $0.34 (DeepInfra, CoreWeave) to $1.15 (SambaNova); all throughput fields null | https://openrouter.ai/api/v1/models/google/gemma-4-31b-it/endpoints | 2026-10-08 |
| OpenRouter fees | 5.5% ($0.80 minimum) on card credit purchases, 5% crypto, no inference markup | https://openrouter.ai/docs/faq | 2026-10-08 |
| OpenRouter key cap | per-key `limit`; 402 `openrouter_key_limit` when exhausted | https://openrouter.ai/docs/api-reference/limits | 2026-10-08 |
| Measured per-search figures | this note's section A | `docs/evidence/quality/eval20-breadth-removal/default-r1/responses/`, `docs/costs.md:24-32` | 2026-10-08 |

No request in this research carried the operator's name, email or account details; the fetches were plain page reads of public pricing pages.
