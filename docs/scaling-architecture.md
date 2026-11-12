# Scaling scenarios and the architecture changes they call for

2026-11-11, on `main` as of e132f05. Builds on [scale-feasibility.md](scale-feasibility.md) and its companions ([costs](scale-feasibility-costs.md), [reuse](scale-feasibility-reuse.md)); their 13 decisions (10 ruled, 3 deferred) are treated as settled where ruled. Not an implementation plan: nothing in `proxy/`, `src/` or `infra/` was changed.

## The answer

1. **Today's design is limited by money, not capacity:** about $0.023 a search, so $2 a month at 300 searches, $65 at 3,000, $696 at 30,000 and $7,014 at 300,000 (projection). Past the free Brave credit (250 searches) and the free cache-write allowance (75,000, where caching stops and searches still work), steady use reaches no limit this doc could put a figure on below about 1 million searches a month.
2. **What likely breaks first is the ceiling and the message:** nothing in the Worker stops spending when a budget is gone, and a used-up budget reaches the visitor as "The search didn't complete. Wait a moment and try again."
3. **First change: one shared counter in the Worker** (the budget meter, option OPT-X2) that counts the day's searches, Brave calls and model cost, refuses a search before any paid call once the day's budget is used, and says so.
4. **After that, in order of readiness:** 3 Brave calls instead of 4 (21% off), a cache of web results keyed by the search wording alone, then a shop table built from open place data (43% to 64% off, not ready).
5. **One limit of this run:** no price outside the repo was checked (web access was blocked). The figures were first worked by hand from the script's formulas; the script has since been run and every figure checked against its output, with no difference found ([Figures](#figures)).

Words and labels used below:

| Term | Meaning |
|---|---|
| Worker | The site's one server program, on Cloudflare; it runs each search |
| Brave | The search service the Worker pays for web results and nearby places |
| OpenRouter, the model | The reseller through which the Worker pays a language model to read the product and judge each shop |
| KV | Cloudflare's key-value store, where the model's reading of a product is cached for 30 days |
| Durable Object | A small Cloudflare store with one copy shared by every running instance of the Worker |
| 502, 429 | The Worker's answers for "a paid service failed" and "too many requests" |
| Eval, precision | The repo's graded test searches; precision is the share of shown shops graded good |
| SC, OPT, AQ | Scenario, option, and architecture question for the operator. Option letters: C caching, B batching and precomputation, O outsourcing, X everything else |
| CQ, RQ, $Q, LQ, OQ | Earlier decision labels from the caching, reuse, costs, latency and open-data notes; each is described where it is used |
| Zip area, center | The Census area for a zip code, and its center rounded to about 1 km. The zip itself stays in the browser; the center is what the Worker and Brave receive (`docs/privacy.md:8-9`) |

## Figures

| Kind | Meaning here |
|---|---|
| Measured | Read from a repo file, which is named |
| List price | A price already recorded in [costs.md](costs.md) or the [costs note](scale-feasibility-costs.md#sources), with the date it was read there. None was re-read for this doc |
| Projection | Arithmetic on the two above. Every monthly, hourly and daily dollar figure in this doc is a projection |
| Unknown | Not measured in the repo. The measurement that would settle it is in [Unknowns](#unknowns-and-what-would-settle-each) |

The arithmetic is `docs/evidence/scaling-architecture/scenarios.mjs`, which writes `scenarios-output.json` beside itself; that file is the reference. The projections below were first worked by hand from the script's formulas, because the session that wrote this doc was not allowed to run it. The script was run later on 2026-11-11 and every figure here was compared with its output or with the repo file cited for it: none differed. To repeat the check, run `node docs/evidence/scaling-architecture/scenarios.mjs` from the repo root. The run also filled three geography figures, each measured (counted from `public/zips.json` by the script, `geography` in the output): 16,473 of the 33,791 zip areas get the 30-mile radius; the 33,791 areas have 33,680 distinct centers; and the centers of the contiguous states' zip areas span 3.8 hours of sun time east to west. The same run counted the territories and matched the 149 below.

Inputs, all from the repo: $0.005 a Brave call and a $5 monthly credit (list price 2026-09-23, `docs/costs.md:11`); 4 Brave calls a search (measured, `docs/costs.md:26`); model use $0.00338 a search at the price OpenRouter routed to and $0.00053 at the cheapest endpoint, with a product reading missing from the cache in 40% of searches (measured on one eval run, not a live rate; `docs/scale-feasibility-costs.md:33`). A typical search is therefore $0.02338: Brave 85.5%, the model 14.5%, one Brave call 21.4%. The costs note rounds this to $0.0234, so its abuse figures are about 0.1% higher than the ones here. The $7,014 at 300,000 searches is Brave $5,995 after the credit, the model $1,014 and $5 for the Workers plan that size forces.

Figures quoted in the options table without a file beside them come from: the costs note, sections C and E (the $0.0025 verdict-cache ceiling, "about 7 s slower", Brave's 50 calls a second, the $0.10 upper bound, the 13 endpoints with no reported speed); [search-latency.md](search-latency.md) (the 0.9 to 7.8 s reading wait); [quality.md](quality.md) (online results 98% good; local precision 62% to 71% across the graded runs, the share of shown nearby shops graded good); and [open-place-precision.md](open-place-precision.md) (6 sellers among 300 open-data shops; 107 of the 300 graded as not selling, the rest could not be judged).

## SC, the scenarios

The sizes are the four rungs the costs note already uses, so each total can be checked against it. They are sizes to plan against, not forecasts: the repo holds no traffic data and no searches-per-user figure.

| Scenario | Size chosen | Why this size |
|---|---|---|
| SC1 steady, small | 300 searches a month (10 a day) | The smallest rung above the free Brave credit (250) |
| SC1 steady, medium | 3,000 a month (100 a day) | The quota example in the costs note ($Q3, Brave payment method and quota) |
| SC1 steady, large | 30,000 a month (1,000 a day) | The line below which the costs note found no cache worth its money |
| SC2 spike | One of the months above arriving in one hour | A news mention, as the task for this doc defined it |
| SC3 whole country | 300,000 a month (10,000 a day), from any of the 33,791 zip areas | The top rung; about 9 searches per zip area per month if spread evenly |
| SC4 unwanted traffic | A scripted caller of `POST /search` at the per-client limit (30 a minute) or the site-wide limit (60 a minute) | The limits in `proxy/src/handler.ts:11-12` |
| SC5 no money | A month with nothing paid to Brave | The $5 Brave credit only |

### Scenario table

All dollar figures are projections. "Latency" is what was measured at low load: median 2.9 s for 20 live searches on 2026-09-29 (`docs/STATUS.md`, Done row "Search latency"), and median 5.2 s, 90th percentile 11.5 s, worst 15.7 s for 20 searches on 2026-10-01 (costs note, section E); why the two runs differ was not looked into. Latency under load is unknown at every size. Steady months are after Brave's $5 credit; spike and unwanted-traffic figures are before it, which is why 3,000 searches cost $65.14 in one row and $70.14 in another.

| Scenario | Brave calls | Model calls | Cost | Limit that breaks first | What the visitor sees when it breaks |
|---|---|---|---|---|---|
| SC1 small, 300 a month | 1,200 a month | 720 | $2.01 a month | The Brave credit, at search 251 | "The search didn't complete. Wait a moment and try again." (if Brave refuses calls past the credit with no card; what Brave does there is unverified) |
| SC1 medium, 3,000 | 12,000 | 7,200 | $65.14 | The operator's budget; no service limit | Same line, once a Brave quota or the model key cap is reached |
| SC1 large, 30,000 | 120,000 | 72,000 | $696.40 | The operator's budget; KV writes are at 400 of 1,000 a day | Same line |
| SC2 spike of 3,000 in an hour | 12,000 in the hour | 7,200 | $70.14 for the hour | 50 a minute, under the 60-a-minute site limit; KV writes (1,200 wanted, 1,000 allowed a day), after which readings stop being cached | Normal results; later first searches for a product are slower |
| SC2 spike of 30,000 in an hour | 14,400 if the site limit holds; 120,000 if it does not | 8,640 or 72,000 | $84.17 if it holds; $701.40 if it does not | The site limit: 500 a minute wanted, 60 allowed, so 88% are refused | "Too many searches from this connection. Try again in about a minute.", which is wrong: the visitor's connection is not the cause |
| SC2 spike of 300,000 in an hour | 2,400 if the limit holds; at most 30,000 if it does not (Brave's own 50 calls a second, for the 10 minutes below) | 1,440 or more | $14.03 if it holds; up to $150 of Brave if it does not. On the $5 Workers plan the hour runs in full: $84.17, or up to $900 of Brave | The site limit at once (98.8% refused while it runs; 99.8% of the hour's searches go unserved), then Workers Free's 100,000 requests a day at about minute 10 (600,000 arrive in the hour, arrivals taken as even), after which search is down until the allowance resets | The "Too many searches" line for 10 minutes, then likely the "didn't complete" line; the Worker's own code no longer runs, so this was not tested |
| SC3 country, 300,000 a month | 1,200,000 a month | 720,000 | $7,014 | The operator's budget; KV writes (4,000 wanted a day) force the $5 Workers plan | Same as SC1, plus the gaps in [SC3](#sc3-the-whole-country) |
| SC4 one caller at 30 a minute | 172,800 a day | 103,680 a day | $1,010 a day; $4,320 at the upper bound of $0.10 a search | Nothing in the Worker; the provider caps | Real visitors see nothing until a cap is hit, then the "didn't complete" line for the rest of the month |
| SC4 many addresses at 60 a minute | 345,600 a day | 207,360 a day | $2,020 a day; $8,640 upper bound; more on the $5 Workers plan if the caller reaches several Worker instances | Nothing in the Worker | Real visitors get the "Too many searches from this connection" line while the caller holds the limit |
| SC5 no money | 1,000 a month | 600 | $0 to Brave; about $0.85 of model use, so not zero | The Brave credit, at 250 searches (8.3 a day) | From search 251, the "didn't complete" line until the month turns |

Latency a visitor sees, by scenario:

| Scenario | Latency |
|---|---|
| SC1, any size | Measured at low load: median 2.9 s (2026-09-29) and 5.2 s (2026-10-01), worst 15.7 s. A first search for a product adds the reading call |
| SC2 | Unknown under load: the repo holds no load test. A refusal is answered before any paid call (`proxy/src/handler.ts:156`); its time was not measured |
| SC3 | Unknown from Alaska, Hawaii and the territories; the repo holds no measurement from any of them |
| SC4 | Real visitors: as SC1 until a limit or cap is reached, then an immediate refusal or failure |
| SC5 | As SC1 for the first 250 searches. After that a failure, which arrives after the Brave calls have been tried |

### What "breaks" means in the code

| Event | What the Worker does | Source |
|---|---|---|
| Brave answers with an error (credit gone, quota reached, rate limit) | The whole search fails with 502 `upstream_error` | `proxy/src/brave.ts:136`, `proxy/src/handler.ts:170` |
| OpenRouter answers with an error (key cap reached) | Same 502 | `proxy/src/llm.ts:44` |
| The model key is spent and the product's reading is cached | The 4 Brave calls run and are billed, then the search fails at the shop-judging call | order of steps, `proxy/src/pipeline.ts:321-324` |
| Either limiter refuses | 429 before any paid call | `proxy/src/handler.ts:156-158` |
| The site shows a 502 | "The search didn't complete. Wait a moment and try again." | `src/render.ts:361` |
| The site shows a 429 | "Too many searches from this connection. Try again in about a minute." for the per-client and the site-wide limit alike | `src/render.ts:363`, `src/api.ts:30` |

The feasibility overview's third promise is honest degradation: "the site should say when it is reached rather than fail silently". Today it does not. A used-up budget reads as a passing fault, and "wait a moment" invites the retry that cannot work. The landing page, the About page and the zip lookup still load; nothing else does.

### SC1, steady use

Where steady use meets a limit (projection; searches a month):

| Limit | Reached at | What happens |
|---|---|---|
| Brave's $5 credit | 250 | Paid calls, or failures with no card (unverified) |
| KV Free, 1,000 writes a day | 75,000 | Readings stop being cached; searches still work (`proxy/src/normalize-cache.ts:36`) |
| Site limit of 60 a minute, if the busiest hour holds 10% of a day's searches (an assumption; no traffic data exists) | 1,080,000 | Refusals in the busiest hour |
| Site limit of 60 a minute, traffic spread flat | 2,592,000 | Refusals all day |
| Workers Free, 100,000 requests a day at 2 a search | 1,500,000 | Search down for the rest of the day |

Two services in the path have no figure. GitHub Pages serves `zips.json` (330,531 bytes compressed, `data/README.md:37`); if every search downloaded it afresh that is 0.99 GB a month at 3,000 searches, 9.9 GB at 30,000 and 99 GB at 300,000, an upper bound because browsers keep the file. GitHub's limits were not checked (not verified). The map loads tiles from OpenStreetMap's volunteer-run servers, which give no guarantee and may block a site that strains them (`docs/debt.md:92`); the number of tiles per search is not measured.

### SC2, a spike

- **The limiter is the weak part.** Cloudflare's rate-limit binding did not throttle in a live test, and the in-memory limiter counts per Worker instance, so separate connections escape it (`docs/debt.md:10`). "If the limit holds" above is the good case.
- **What caps the bill if it does not hold:** the provider caps only. The model key cap does not stop Brave spend, because Brave runs before the shop-judging call. A Brave quota would; whether one can be set per key is unverified (costs note, section D). Brave's rate limit of 50 calls a second allows 45,000 searches, or $900 of Brave calls, in an hour.
- **After the spike:** if the credit or a quota was used up in that hour, search is down for every later visitor until the month turns, with the "wait a moment" line.
- **What a spike does not break:** Workers Free requests (60,000 for a 30,000-search spike), the 50 outgoing requests allowed per search (`docs/decisions/0001-external-services.md:101`), and Brave's rate limit (33 calls a second at 30,000 in an hour).

### SC3, the whole country

| Subject | What the repo shows | Status |
|---|---|---|
| Money | $7,014 a month, $5,995 of it Brave | Projection. This doc's judgment: a funding decision or a cheaper way to find shops comes first |
| Rural zips | The nearby radius is 30 miles for rural-urban codes 4 to 10. Graded local precision was 54% rural (19 of 35), 53% suburban, 48% urban (`docs/quality.md:15`), so rural was not worse in that sample. One rural search had no confirmed local shop in its baseline (`docs/quality.md:144`) | Measured, 6 rural searches of the 20 graded (`docs/quality.md:134`). 16,473 of the 33,791 zip areas (48.7%) carry codes 4 to 10 and get the 30-mile radius; 17,314 carry codes 1 to 3 and 4 have no code, and both get 10 miles (`proxy/src/pipeline.ts:31-33`). Measured, counted from `public/zips.json` by the script; a share of zip areas, not of searches |
| Places with few shops | The thinnest open-data search still had 65 candidate shops inside its radius ([open-place-precision.md](open-place-precision.md#thin-nearby-sections)) | Measured for 20 searches. What Brave's place search returns in the emptiest zips is unknown |
| Territories | 149 zip areas: Puerto Rico 132, US Virgin Islands 6, Guam 7, American Samoa 1, Northern Mariana Islands 3 (counted in `public/zips.json` with `grep -co '"PR"'` and so on, where `grep` is ugrep, which counts matches; other greps count lines and print 1. The script's `geography.territories` gives the same five counts). Measured. No eval search was run in any of them. The Worker sends Brave `country=US` and the territory's code as the state (`proxy/src/brave.ts:157-163`) | What Brave returns there is unknown |
| Postal codes with no zip area | 7,846 codes, mostly PO boxes, answer "not found" (`docs/debt.md:72`) | Known gap, an open operator decision |
| Speed far from the model provider | The model's writing time is 76% to 93% of a search; network time to Brave and OpenRouter was tens of milliseconds from a home network (`docs/search-latency.md:5,15`). Distance is likely not what a visitor in Alaska or Guam would notice | Unknown from the edge; nothing measures stages in production |
| Time zones | A daily ceiling that resets at midnight UTC resets during the US afternoon and evening (general knowledge, not a repo figure), so a day's budget could be used up before the US evening and refill partway through it. The centers of the contiguous states' zip areas run from longitude -124.64 (Washington) to -67.01 (Maine), 3.8 hours of sun time at 15 degrees an hour (measured, counted from `public/zips.json` by the script). That is how far apart "evening" is by the sun, not a count of clock time zones, and it leaves out Alaska, Hawaii and the territories | A design input for the budget meter's reset hour |
| Shared results | 300,000 searches over 33,791 zip areas is 8.9 searches per area per month if spread evenly, 0.9 at 30,000. Real traffic is likely concentrated in cities; by how much is unknown | Projection. A cache keyed by area hits rarely in most of the country, so the cache that matters nationally is one with no location in its key |

### SC4, unwanted traffic

- **Who can call it:** anyone. The route is safe to call from curl by design, and the allowed origin is not a login (`docs/architecture.md:17`).
- **What a caller can run up:** the table above, without paying anything. On Workers Free the most is $2,338 a day: the 100,000 requests a day allowance is an accidental stop (a script sends one request a search, with no browser preflight), and once it is reached real visitors get no answer from the Worker at all. On the $5 Workers plan that stop is gone, and a caller reaching several Worker instances multiplies the site-wide figure: $4,040 a day at 2 instances, $10,100 at 5 (projection).
- **Side effects:** each new product text is a KV write, so 1,000 made-up products use the day's writes and readings stop being cached for real visitors; and whatever the caller types is stored for 30 days as a "product" (`docs/privacy.md:32`).
- **What stops it today:** the provider caps, if they are set. Their values are not in the repo and should not be; whether they exist is one of the three deferred decisions below.
- **With a ceiling in the Worker,** the loss is the ceiling and the attack becomes an outage. A caller at 60 a minute uses up a 3,000-search month in 50 minutes. Cut into daily slices of 100 searches, it uses up a day in 1.7 minutes and the most lost in a day is $2.34; the next day starts fresh. A caller who comes back every day closes search every day: the money is bounded, the outage is not, and the answer then is a human check (OPT-X8) or a lower per-client limit, neither of which this doc recommends before that is seen.

### SC5, a month with no money

| Brave calls a search | Searches the credit buys a month | A day | Model use, routed price | Months a $5 model top-up lasts |
|---|---|---|---|---|
| 4 (today) | 250 | 8.3 | about $0.85 ($0.845) | 5.9 |
| 3 | 333 | 11.1 | $1.13 | 4.4 |
| 2 (no place search) | 500 | 16.7 | $1.69 | 3.0 |

- **Search does not run at exactly $0.** The model has no free allowance in the repo's price list; a month on the Brave credit needs about $0.85 of model use, and OpenRouter charges a fee of at least $0.80 on each credit purchase (costs note, section A); the "months" column is before that fee.
- **What works with nothing spent:** the two pages and the zip lookup. The curated rows (29 certifications, 41 chains, 4 concerns) live inside the Worker and are only visible through a search.
- **The fallback that would work at $0** is a static directory of curated shops on GitHub Pages (OPT-X6). It does not exist; the nearest thing is `research/` (54 retailer files), whose use as suggested shops the operator has ruled "not yet".

## What the three deferred decisions mean in each scenario

Three of the 13, deferred on 2026-10-09 to 2026-10-14 and not ruled since, as far as `docs/STATUS.md` at e132f05 shows.

| Deferred decision | SC1 steady | SC2 spike | SC3 country | SC4 unwanted traffic | SC5 no money |
|---|---|---|---|---|---|
| $Q3, a Brave payment method and monthly quota | Needed from search 251. Small: $1.00 a month over the credit. Medium: $55. Large: $595 | The only cap on 85% of a spike's cost if the limiter fails, and unverified | $5,995 a month of Brave; a funding decision, not a setting | Same as SC2 | No card is the safest setting, provided something stops calls at 1,000 a month. What Brave does past the credit without a card is unverified |
| RQ4, daily counters | Turn "hit rate unknown" into numbers | Today the operator learns of a spike from the bill: observability is off and nothing counts searches | Totals only. The per-area and per-product density that decides every cache is a separate count the operator deferred, and AQ10 here | The only way to see it happened | Shows how many days the credit lasts |
| $Q6, spend ceilings on both keys | Model key cap at twice the month: $2.03, $20.28, $202.80 | Bounds the model 14.5% only | $2,028 | Bounds the model share; Brave is still open | A model cap alone leaves Brave calls billed for searches that then fail |

The budget meter (OPT-X2) answers the totals that RQ4 asks for and gives $Q6 a first line of defense inside the Worker. It is an estimate, so the caps at the two providers stay as the backstop, and whether a Brave quota can be set per key stays an open safety question. It does not replace the choice in $Q3 of whether to add a card.

## OPT, the options

"Promises" are the three in the [feasibility overview](feasibility-overview.md#what-to-protect): the zip stays in the browser with no accounts or tracking; every result is explained from a source and disputable; honest degradation. Savings are projections against today's $0.02338 a search. Build cost is this doc's judgment in rough sizes (small: a day or less; medium: several days; large: weeks), not an estimate from measured work.

| Option | Saves, and where | Build and run cost | Result quality | Promises | Standing |
|---|---|---|---|---|---|
| OPT-C1 The browser remembers this visit's results in page memory | A repeat of the same search in one visit; rate unknown | Small; $0 | None | Kept, if nothing is written to storage. Writing results to `sessionStorage` would put nearby shop names in a store that `docs/privacy.md:36` says never holds the zip | New |
| OPT-C2 Web results cached by search wording alone, in KV | 2 Brave calls on a hit: $30, $90 or $150 a month at SC1 large for 10%, 30%, 50% hits; ten times that at SC3 | Small to medium; $0 until KV writes pass 1,000 a day | This doc's judgment: a stale draw is mostly an older good draw (online results are 98% good); a bad draw lasts the lifetime | Kept only if all of these hold: the location test shows location barely changes web results (the pass mark is not set), so no location is in the key; cached results say when they were fetched; the lifetime is set and short; the privacy page gains a row for a second list of typed product wordings. What location goes to Brave on a miss is undecided. AQ11 | Waits on RQ6 (the location-header test), ruled yes with about 60 Brave calls; no result in the repo |
| OPT-C3 Place results cached by store type and zip area | 2 Brave calls on a hit; hits are rare outside dense areas | Small | A closed shop stays "nearby" for the lifetime | Stores search words with a zip-area center | Ruled no for now (CQ1) |
| OPT-C4 Shop verdicts cached | At most $0.0025 a search | Medium | A cached "no" hides a shop silently | Weakens "every result explained" | Ruled no (CQ2, RQ2) |
| OPT-C5 Whole responses cached, in KV or at Cloudflare's edge | A whole search on a hit; near-zero hits | Small | Everything goes stale together | Pairs the product itself with a location | Ruled no (RQ3) |
| OPT-B1 Product readings built ahead for a fixed product list | The first visitor's 0.9 to 7.8 s wait (measured before the routing change); $0.33 a month per 1,000 products | Small; needs a product list, and the per-product count is deferred (RQ4) | Same reading, earlier | Kept if the list is written by hand; a list drawn from counts of what visitors typed needs AQ10 first | New; listed as "raise normalize cache hit rate" in [search-latency.md](search-latency.md) |
| OPT-B2 A shop table built offline from open place data, served from the Worker | The 2 place calls: 43% a search. $396 instead of $696 at SC1 large, $4,014 instead of $7,014 at SC3. Doubles SC5 to 500 searches. With one web call as well, 64% | Large; table size, storage cost and license terms were not examined | Not ready: 6 of 300 nearby open-data shops sell the product with the rule as written (2.0%), against 62% to 71% for Brave plus the model. A table built offline also shows closed shops until its next build | First promise stronger: the zip-area center no longer goes to Brave's place search. Second promise at risk until each shop row carries its source and build date and the data license (not examined) allows showing it | The operator recorded that open data does not replace Brave's local search without a narrower rule and another signal |
| OPT-B3 Results built ahead for a grid of products and areas | Nothing below 150,000 searches a month landing on the grid (nightly) or 21,429 (weekly). A 100-product, 50-area grid costs $117 a refresh, $3,507 a month nightly, $501 weekly | Medium, plus the refresh bill | A closed shop stays for the refresh interval | Stores product and area pairs, chosen by the operator rather than typed by visitors; still the stale-shop risk CQ1 turned on | New; not recommended |
| OPT-B4 Web results refreshed on a schedule for a fixed product list | As OPT-C2, with no visitor's wording stored | Small, after OPT-C2; each refresh is 2 Brave calls a product ($0.01) | As OPT-C2 | Kept, on the same conditions as OPT-C2 and a hand-written list | New; waits on RQ6 |
| OPT-B5 The model provider's batch price for offline work | Applies only to work outside a search (OPT-B1, OPT-B2). The model is 14.5% of a search at most | Small | None | Kept | Price not verified; whether OpenRouter offers one was not checked |
| OPT-O1 Feeds from certifiers or retailers | No money; fresher badges | Unknown: the two certifier directories checked so far refuse scripts (`docs/debt.md:62`) | Better sourcing | Kept | No feed found in the repo |
| OPT-O2 Corrections and shop rows from the public, by pull request | No money per search; moves cost to review time | Small to start: the dispute issue template exists | Fewer closed or wrong shops | Kept for searching, if each row has a source and a date. Sending a correction needs a GitHub account and is public | The dispute process is undefined; a shop store waits on it (RQ5) |
| OPT-O3 A visitor's own Brave or OpenRouter key, passed through the Worker | That visitor's whole cost | Medium | None | At risk: the Worker would handle a visitor's secret, and the visitor must hold an account with Brave, which the site otherwise spares them. Needs privacy rows | New; not recommended |
| OPT-O4 The visitor's browser calls Brave directly | All of Brave | Small | None | **Broken:** Brave would get the visitor's IP address with the search words and the zip-area center, which `docs/privacy.md:18` says it does not receive | New; ruled out by the promise |
| OPT-O5 Someone else runs a copy for their own town | All of that town's cost | None here; the AGPL license and the "Hosting elsewhere" section of [architecture.md](architecture.md) already allow it. The adapter for other hosts is not written | Depends on that copy | That copy's operator makes its own promises | New |
| OPT-O6 Donated or nonprofit credits; donations shown beside the meter | Up to the whole bill | Operator time | None | Kept only if donating is a plain link away from the site, with no embedded script | Not verified: no program was checked this run |
| OPT-O7 The shop-judging model runs in the visitor's browser | At most 14.5% | Large | Unknown; a different, smaller model | Kept only if both blocklist passes stay in the Worker and the model file is served from the site itself. A different model per device makes a disputed verdict hard to reproduce | New; not recommended: large work for the smaller share |
| OPT-O8 Another search or place provider | Unknown | Medium each, plus a graded eval | Unknown | Each new provider receives the zip-area center and needs a privacy row | Price not verified |
| OPT-X1 Three Brave calls a search | 21%: $50 instead of $65 at SC1 medium, $546 instead of $696 at SC1 large, $5,514 instead of $7,014 at SC3; 333 searches on the credit | Small, after the eval | Unknown until the eval; it changes which shops are found | Kept | Ruled yes ($Q5, the 3-call eval), about 160 Brave calls authorized; no result in the repo. Which call goes (a web call or a place call) is what the eval decides; if a web call, OPT-C2 saves 1 call a hit, not 2 |
| OPT-X2 Budget meter: one shared counter with a hard ceiling | Caps SC2 and SC4 at the ceiling; ends the Brave calls wasted when the model budget is gone | Medium; a new Worker binding, so an operator deploy. 2 counter requests a search is 20,000 a day at SC3 against 100,000 free | None when under budget | Likely restores honest degradation for the meter's own ceiling, with OPT-X3. The meter holds daily totals only: no product, no location, no IP address; it needs a privacy row. If the same object also becomes the shared rate limiter, it holds what the limiter holds today (a client key, the IP address or half of an IPv6 one, for 60 seconds, `docs/privacy.md:29`), in one place instead of many | New; the first change |
| OPT-X3 Say what happened: a "budget used up" answer and a "site is busy" answer | No money; ends retries that cannot work | Small; a new error code and two lines of site text | None | This is the honest-degradation promise | New; ships with OPT-X2 |
| OPT-X4 Cheapest model endpoint | 12%: $85.50 a month at SC1 large, $855 at SC3 | One line | About 7 s slower a search when last measured | Kept; the Worker already refuses providers that collect data | The operator ruled for speed (LQ1) |
| OPT-X5 A cheaper or self-hosted model | At most 14.5%; 2.6% if already on the cheapest endpoint | Medium to large, plus a graded eval | Unknown | Kept if the provider collects no data, as today | Price not verified |
| OPT-X6 A static directory of curated shops, with search as the fallback | Works at $0, in a spike and when the budget is gone | Medium, then curation time | Online shops only; no nearby section | Kept: every row is sourced; "disputable" is as weak as it is today, since the dispute process is unwritten | Touches "suggested shops", ruled not yet (to be revisited after the Amazon plan's measuring phase; the reason is not in the files read) |
| OPT-X7 A waiting line instead of a refusal | Nothing; smooths a spike | Medium | None | A server-side line would hold product and area for minutes. A browser-side wait with an honest message holds nothing | New; the browser-side form is part of OPT-X3 |
| OPT-X8 A human check before a search | Bounds SC4 further | Small to medium | This doc's judgment: some real visitors fail any such check | A hosted check adds a third-party script, which `docs/privacy.md:40` says the site has none of | Price not verified; not recommended for now |

### Caching

- **The ruled caches stay ruled.** What would justify reopening each is in [When a ruling should be reopened](#when-a-ruling-should-be-reopened).
- **The cache that scales nationally has no location in its key.** At SC3 an average zip area sees 8.9 searches a month, so area-keyed entries expire unused in most of the country. Product readings (exists) and web results by wording (OPT-C2) are shared by everyone.
- **A response to one search cannot be held at Cloudflare's edge without becoming OPT-C5.** What can be shared safely is what is the same for everyone: the static site and `zips.json` (already, on GitHub Pages), product readings, and web results by wording if OPT-C2's conditions hold.
- **OPT-C1 is the one cache that needs no ruling,** as long as it lives in page memory and is gone when the tab closes.

### Batching and precomputation

- **Work moved out of the request only pays when it is shared.** OPT-B3's grid shows the trap: a refresh costs one search per cell, so it loses to searching on request until every cell is asked for more than once between refreshes. At SC1 large, with all traffic on the grid, a cell is asked for 6 times a month.
- **The offline work worth doing is the kind with no per-search cost at all:** the shop table (OPT-B2). Its blocker is quality, not money. The precision check's own next step is a narrower rule (match only a shop's own category, drop the group entries), which on that sample would have removed 75 of 107 non-sellers and 1 of 6 sellers; what precision it reaches on a fresh sample is not measured.
- **Batch pricing matters little:** the model is 14.5% of a search and a search cannot wait for a batch.

### Outsourcing

- **The largest outsourcing is already identified:** open place data carrying the nearby search (OPT-B2).
- **Curation by others (OPT-O2) trades money for review time** and waits on a written dispute process, which is already an open operator decision.
- **A visitor's key is the wrong trade for this site.** Through the Worker it adds a secret to handle and an account to hold; from the browser it breaks the promise that Brave never gets the visitor's IP address.
- **A copy run by someone else (OPT-O5) is the form of "someone else pays" that puts no promise of this site at risk,** because that operator makes its own.

### Everything else

- **OPT-X2, the budget meter.** One counter shared by every Worker instance (a Durable Object; its SQLite form is on Cloudflare's free plan, list price 2026-10-08 in the costs note). Before a search it answers "is there budget left today?"; after, it adds the search's Brave calls and model cost. The same object can be the shared rate limiter that `docs/debt.md:10` already names as the fix. A public "searches left today" line can read from it. The counts are estimates at list price, not Brave's bill. One design condition: the counter's own free allowance is 100,000 requests a day, and a 300,000-search spike or a caller at 60 a minute all day (86,400) would reach or pass it if every arriving search asked the counter. Each Worker instance therefore has to refuse from its own memory once the counter has said the budget is gone, and keep the in-memory limiter in front.
- **Daily slices beat one monthly pot.** With one pot, a spike or a script on the 2nd closes search until the 1st. With daily slices the most lost is a day.
- **OPT-X3, the messages.** Two new answers: the budget is used up (with the reset time), and the site is busy (the site-wide limit, not the visitor's connection). Three cases the meter alone does not cover belong here too: a Brave or model error that means "credit, quota or cap reached" should give the "budget used up" answer, since the meter's estimate can lag the real bill; a search should be refused as "busy" when the counter cannot be reached, so a fault never means open spending; and the page itself should say search is unavailable when the Worker does not answer at all, which is what a used-up Workers Free allowance looks like.
- **OPT-X6, the directory,** is the end the feasibility overview describes: "the product becomes a curated directory with a search engine as fallback". Among the options here it is the only one that shows a visitor something when the budget is zero.

## Recommended path

Each stage starts when its trigger is seen, not before. Stage 1's trigger is a decision rather than a measurement: the wish to publish a link.

| Stage | Trigger | Do | Scenario it answers |
|---|---|---|---|
| 1 | Before any public link. SC2, SC4 and SC5 can all happen on the first day | Rule on the three deferred decisions (AQ1). Build the budget meter with daily slices and the honest answers (AQ2 to AQ4) | SC2 and SC4 (bounded); SC5 (an honest message, not a result) |
| 2 | The meter shows a month passing the Brave credit | Run the two tests already authorized: the 3-call eval and the location-header test. Ship 3 calls if recall holds; ship the wording-only web cache only after AQ11 | SC1 small to medium |
| 3 | The meter shows the day's slice used up on 10 or more days in each of two months (this doc's pick of a threshold) | Choose: raise the budget, add funding with the public meter (OPT-O6), or build the directory (AQ7). If scripts are the cause, AQ8's human check comes back | SC5, SC1 medium, SC4 |
| 4 | 30,000 searches a month, or a launch aimed at one city | Revisit the place cache, as its ruling says, with whatever counts AQ10 allows. Run the narrower-rule precision check on open place data (AQ5). Switch to the $5 Workers plan when KV writes near 1,000 a day (ruled, $Q2) | SC1 large |
| 5 | 300,000 searches a month, or opening to the territories | A funding model first; this doc does not frame one, and any that adds accounts, ads or tracked links breaks the first promise. The shop table only if stage 4's check passed and the second signal the operator's ruling asks for exists. The territory check (AQ6). A tile provider with an agreement (`docs/debt.md:92`), which would receive what OpenStreetMap receives today: the visitor's IP address and the map area | SC3 |

### When a ruling should be reopened

None is reopened here. Each row names the scenario and the evidence that would justify it.

| Ruling | Scenario | Evidence that would justify reopening |
|---|---|---|
| CQ1, no place-search cache for now | SC1 large in one city | A count of how often one store type is searched in one zip area. That count is a coarser form of the product-and-area pairing the next row says cannot be held, so it needs its own ruling and privacy row before it is collected (AQ10) |
| CQ2 and RQ2, no verdict cache | SC3 at the routed model price | A graded A/B showing a partial prompt does not move verdicts, and a way to show a cached verdict with its date so a cached "no" is not silent |
| RQ3, no whole-response cache | None found | Measuring repeats of a product in an area would itself hold product and area together, so the evidence cannot be gathered without the ruling it would support |
| LQ1, route the model for speed | SC5, or SC3 where the premium is $855 a month | A measured speed for the cheapest endpoints; all 13 reported none on 2026-10-08 |
| $Q2, Workers Paid when KV writes near 1,000 a day | SC2 at country size | A day near 100,000 Worker requests; the request allowance, not KV writes, is what a large spike breaks |
| Suggested shops, not yet (the last phase of the Amazon alternatives plan) | SC5 | The meter showing days with the budget used up shows the need. Whether need answers the ruling is the operator's call: its reason is not in the files read |

## AQ, decisions for the operator

All recommendations are this doc's judgment.

| Label | Decision | Recommendation | What it unblocks |
|---|---|---|---|
| AQ1 | Rule on the three deferred decisions as one choice of mode: credit only (Brave held to 1,000 calls a month) or paid (a monthly budget above the credit) | Credit only until the meter exists, then paid at a budget the operator names. About $0.85 a month of model use. This departs from the costs note's $Q3 recommendation (add a payment method and quota now). Whether the Brave account already has a payment method is not recorded in the repo; the eval runs of 2026-09-28 made more Brave calls than the credit covers, so it likely does, and in that case "credit only" means a quota of 1,000 calls set in the Brave dashboard if one can be set, which is unverified. Keep the model key cap either way | With AQ2 and AQ3, any public link. A link published in this mode without them shows the misleading "wait a moment" line from search 251 |
| AQ2 | Build the budget meter (OPT-X2)? It changes `proxy/` and `infra/` and needs an operator deploy for the new binding | Yes, first | The totals RQ4 (daily counters) asks for, a first line for $Q6 (spend ceilings) in front of the provider caps, a bounded SC2 and SC4, the shared limiter in `docs/debt.md:10`, a public meter |
| AQ3 | Add the "budget used up" and "site is busy" answers (OPT-X3)? New error codes in the response contract and new site text | Yes, with AQ2 | The honest-degradation promise |
| AQ4 | One monthly pot or daily slices, and at what hour the day turns | Daily slices, turning during the US night rather than at midnight UTC | A script or spike costs a day, not the month |
| AQ5 | Fund the narrower-rule precision check on open place data: no Brave calls, model and grader time | Yes, at stage 4, or sooner if grader time is free | Half of what OPT-B2, the 43% to 64% saving, needs; the operator's ruling also asks for a second signal, which is not chosen |
| AQ6 | Authorize about 40 Brave calls ($0.20 at list price) for 10 searches in territory zips | Yes, before the site says it covers every US zip | The territory row of SC3 |
| AQ7 | Build the static directory fallback (OPT-X6)? | Not now: the suggested-shops ruling stands. Decide when stage 3's trigger is seen | What a visitor gets at zero budget |
| AQ8 | Rule out a visitor's own key (OPT-O3) and a hosted human check (OPT-X8) for now? | Yes, rule both out; revisit the human check only if the meter shows daily slices used up by scripts | Keeps two promises from being traded for convenience |
| AQ9 | A follow-up run with web access to check the unverified prices and programs | Yes, before acting on OPT-B5, OPT-O6, OPT-O8, OPT-X5 or OPT-X8 | Those five options |
| AQ10 | May the Worker count searches per product or per store type and zip area, beyond day totals? The operator deferred the per-product count with RQ4 | Not now; decide at stage 4, with a privacy row, a floor below which nothing is kept, and nothing finer than a day | The evidence for reopening the place cache; a product list for OPT-B1 drawn from real use |
| AQ11 | The terms for the wording-only web cache (OPT-C2): its lifetime, a "fetched on" note on cached results, the pass mark for the location test, what location Brave gets on a miss, the privacy row | Set them before the location test is read, so the test can fail: this doc suggests a lifetime of a day or less | Shipping OPT-C2 at stage 2 |

## Unknowns, and what would settle each

| Unknown | Measurement |
|---|---|
| Live searches a day and the reading cache's hit rate | The daily totals (RQ4, OPT-X2) |
| How concentrated traffic is by area and product | Only with the counts in AQ10 |
| What Brave does past the credit with no card, and whether a quota can be set per key | The Brave dashboard, read by the operator |
| Whether the 3-call eval or the location-header test has been run | Not in the repo at e132f05; `main` could not be refreshed in this run |
| Latency under load, and from Alaska, Hawaii or a territory | Stage timings in the Worker (proposed in [search-latency.md](search-latency.md), not built) |
| What Brave's place search returns in territories and the emptiest rural zips | AQ6 |
| Precision of open place data under a narrower rule | AQ5 |
| Map tiles per search; GitHub Pages limits | A browser trace; GitHub's documentation |
| Prices and programs outside the repo: batch pricing, donated credits, other search and place providers, other models, human checks | AQ9 |

## Sources

No page was fetched for this doc. Every price is one already recorded in the repo with its own URL and read date: [costs.md](costs.md) (2026-09-23) and the Sources table of [scale-feasibility-costs.md](scale-feasibility-costs.md#sources) (2026-10-08). Measured figures name their file where they appear. Code references are to the tree at e132f05.
