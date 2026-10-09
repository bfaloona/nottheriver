# Scale feasibility: caching, storage and cost as users arrive

Product-design evaluation, 2026-10-08, of what happens when the site gets users: what in a search can be cached, what could live in a database, and what a month costs. Not an implementation plan. Two companion notes hold the evidence: [what can be cached or stored](scale-feasibility-reuse.md) (inventory I1 to I13, questions RQ1 to RQ7) and [what a month costs](scale-feasibility-costs.md) (scenarios, sensitivity, questions $Q1 to $Q6). Every number there carries its source; the figures repeated here are the companion notes' and are labelled the same way: measured, list price, or projection.

## Short answer

- **A search costs about $0.023, and Brave is 85% of it** (projection: 4 Brave calls at list price plus measured model use at the price OpenRouter routed to; 97% if the model ran at the cheapest endpoint). The curve is a straight line: about $65 a month at 3,000 searches, $700 at 30,000, $7,000 at 300,000.
- **No cache is a money decision below 30,000 searches a month.** The product-reading cache that exists is worth under $100 a month even at 300,000 searches (its value is repeatable wording and 1 to 8 s of wait). A place or web cache is worth hit rate × $0.010 a search; a verdict cache at most $0.0025. The one lever above the routing premium's 12% is the Brave call count: each call removed is 21%.
- **Caching is a product and privacy decision.** Three things decide each candidate: who shares the entry (everyone, one zip area, one user), what stale looks like to a shopper (a closed shop shown as nearby is the eval's worst local failure), and whether the key puts search terms next to a location. The two cache rulings already made (CQ1, no place-search cache for now; CQ2, verdicts not cached, both 2026-09-27) stand; two facts are new, below.
- **A database should store the shop, never the search.** Shop facts with sources, dates and dispute state are the same shape as today's `data/*.json` rows and cost nothing in privacy. A row per search puts product and location together, for which the privacy page's "What is kept" table has no row. Daily totals are the most that should be kept.
- **The free tiers do not matter except Brave's.** Its $5 credit covers 250 searches a month. Cloudflare stays at $0 to $5 a month through 300,000 searches.

## What is new since the 2026-09-27 rulings

| New fact | Where | What it changes |
|---|---|---|
| Place results are shared across products, not only across people: local wording names a store type, so one cached draw for "outdoor gear store" in one zip area serves every outdoor product (20 eval products collapse to 26 local wordings) | reuse note, I3 and after the table | The place cache (CQ1, ruled no) would hit more often than "sparse" assumed. Still a privacy question, not money (RQ1 and $Q4, reopening the place cache) |
| Verdicts depend on which other candidates were in the model call: splitting enrich moved about half of nearby shops from "may sell it" to "likely sells it" | reuse note, I4 | A cached verdict is one from a different context; a cached "no" is an invisible, persistent drop. Stronger reason than CQ2 had to keep verdicts uncached as a call skipper (RQ2, the narrow verdict cache) |
| Whether Brave's location headers change web results is unmeasured | reuse note, I2, RQ6 | If they barely do, a web cache keyed by query alone is shared by everyone, saves 2 to 3 of 4 Brave calls on a hit, and stores no location. It still needs a privacy row (a second list of product wordings), but it is the only Brave cache that pairs no search term with a location |
| Brave runs before enrich in the pipeline | costs note, D | The OpenRouter key cap does not stop Brave spend; only a Brave quota caps the 85%. Whether a per-key quota can be set is unverified |
| KV Free's 1,000 writes a day runs out near 75,000 searches a month | costs note, B | The code then stops caching rather than failing; Workers Paid ($5) pays for itself only at about 113,000 searches a month |

## Verdict per item

From the reuse note's inventory, one line each. "Ruled" means an operator ruling exists and is cited there.

| Item | Verdict |
|---|---|
| I1 product reading | Cached, ruled (KV, 30 days; the TTL was an agent's pick) |
| I2 Brave web results | Deferred, ruled; reopen only after the RQ6 experiment |
| I3 Brave place results | Ruled no for now (CQ1); cross-product sharing is the new input for RQ1 |
| I4 shop verdicts | Dropped, ruled (CQ2, verdicts not cached); context dependence now measured |
| I5 "Why this rank" | Keep fresh; deterministic, never cache apart from its inputs |
| I6 curated rows, I7 zips | Stored in the repo and as a static file; do not move |
| I8 usage figures | Needs ruling (RQ4): daily totals only |
| I9 the request, I10 whole response | Keep fresh; never a row per request; whole-response cache recommended no (RQ3) |
| I11 dropped list | Keep as is |
| I12 grades | Stored in the repo, eval only; a shop store could reuse them as corrections |
| I13 rate-limit counter | Not a cache; the shared Durable Object counter is already the recommended fix |

Two different risks govern the two kinds of cache. For verdicts, a wrong keep is visible and disputable while a wrong drop is invisible to shoppers (graders see only a domain and a reason in the dropped list), so a verdict cache should hold keeps, never "no". For Brave draws the risk runs the other way: a stale keep, a closed shop shown as nearby, is the cost, and the control is a lifetime in hours, not days.

## A month at scale

Projection from the measured per-search figures (assumptions in the costs note, section B: 4 Brave calls a search, 40% product-reading misses from one eval run, 30-day month). Model cost at the price OpenRouter routed to; the costs note also gives the cheapest-endpoint column.

| Searches a month | 300 | 3,000 | 30,000 | 300,000 |
|---|---|---|---|---|
| Brave, after the $5 credit | $1.00 | $55 | $595 | $5,995 |
| OpenRouter | $1.01 | $10 | $101 | $1,014 |
| Cloudflare | $0 | $0 | $0 | $5 |
| Total | $2.01 | $65 | $696 | $7,014 |
| Per search | $0.0067 | $0.0217 | $0.0232 | $0.0234 |

No searches-per-user figure exists in the repo; at 3 searches a user a month the columns are 100 to 100,000 users, at 10 they are 30 to 30,000.

Abuse ceiling: the 60-a-minute global limit implies about $2,000 a day, but the limit is per Cloudflare location and the binding did not throttle in a live test, so the provider caps are the real backstop (costs note, D).

## Decisions for the operator, in the order they unblock each other

The labels are the companion notes' (RQ from the reuse note, $Q from the costs note), with each note's recommendation.

| Order | Question | Recommendation |
|---|---|---|
| 1 | $Q3 Add a Brave payment method and monthly quota before any public link | Yes; the credit is one busy day, and a Brave quota is the only cap on 85% of spend. The first quota is a guess at the month's budget, revisited once RQ4 counters exist |
| 2 | RQ4 Keep daily totals (searches, cache hits, Brave calls, model cost) with a privacy.md row | Yes; it is the missing input to every "hit rate unknown" below and to the ceilings in $Q6. Defer the per-product count |
| 3 | $Q6 Spend ceilings on both keys | OpenRouter key cap at about twice the expected month, Brave quota per $Q3; both explicit guesses until the RQ4 counters exist, reviewed monthly; record that caps exist, never the values |
| 4 | RQ7 A "what is fresh and what is kept" list on the About page | Yes, small; gives any later cache one line to add |
| 5 | $Q1 Accept $0.023 a search as the unit cost until a Brave-call change is evaluated | Yes; nothing model-side moves it more than 12% |
| 6 | $Q5 Fund an eval of 3 Brave calls a search (one web call at count 20, or one local query) | Yes, before any cache work; the only change above 12% of the total, and it needs a recall eval, not a price check |
| 7 | RQ6 About 60 Brave calls to test whether location headers change web results (20 queries with and without location, plus a same-condition pair as a churn control) | Yes; if location barely matters, a query-only web cache is shared by everyone with no location stored |
| 8 | RQ1 and $Q4 Reopen the place cache (CQ1) | Not yet; decide with the counters from RQ4, on privacy not money; not below 30,000 searches a month or a city-focused launch |
| 9 | RQ2 Narrow verdict cache as a prompt shrinker | No for now; small money, and a partial prompt changes the call context again |
| 10 | RQ3 Whole-response cache per product and zip area | No; near-zero hits and the one store that pairs product with location |
| 11 | RQ5 A shop store (facts, corrections, dispute state) | After the dispute process is written; until then, corrections go in `data/` as sourced rows |
| 12 | $Q2 When Workers Paid switches on | When KV writes approach 1,000 a day or a cache that needs D1 ships; the Durable Object limiter fix runs on Free |

Items 6 and 7 need Brave calls; the standing authorization to raise the Brave cap ended 2026-09-30 (`docs/STATUS.md`, Blocked on operator).
