# Search quality

Graded 2026-09-23 (US Pacific time; baseline top-up and access probe finished 2026-09-24) on a sample of 20 of the 60 evaluation searches. The results table comes from [`evidence/quality/eval60/report.json`](evidence/quality/eval60/report.json), produced by `eval/summarize.mjs` from the saved responses and grades in the same folder; the other tables cite their own evidence files. The About page shows the headline from `src/quality.json`.

## Results

| Measure | Online | Local |
|---|---|---|
| Precision (sells the product; local: and the shop exists) | 99% (189 of 191) | 51% (72 of 140; 45 not judgeable, left out) |
| Recall against a separately built baseline | 30% (30 of 100) | 30% (26 of 86) |
| Bot blocked rate (probe, one page per domain) | 16% (27 of 169 domains) | 14% (49 of 353 domains) |
| Results with an unsupported badge source | 0 of 7 with badges | 0 of 6 with badges |
| Local distance implausible | n/a | 2 of 185 |

Local precision by area: urban 48% (23 of 48), suburban 53% (30 of 57), rural 54% (19 of 35).

Local recall by kind of shop: independents 23% (5 of 22), chains 36% (23 of 64). A chain here is a brand with 10 or more US stores under one name; Ace Hardware dealers count as Ace. The labels are this report's judgment, one per baseline shop.

Evaluation cost: the 60 searches made 240 Brave calls and used 313,981 model tokens, an estimated $1.25 in total.

## What changed, on the six pilot searches

The same six searches (cast iron skillet and camping tent, each in an urban, suburban and rural zip) were run before and after each fix. Grades for a URL graded in an earlier run were reused.

| Run | Online precision | Local precision | Online recall | Local recall |
|---|---|---|---|---|
| Before fixes ([report](evidence/quality/report.json)) | 13% (8 of 60) | 34% (16 of 47) | 1 of 30 | 6 of 23 |
| Retailer filtering ([after](evidence/quality/after/report.json)) | 100% (57 of 57) | 47% (18 of 38) | 15 of 30 | 6 of 23 |
| Local results fix ([after3](evidence/quality/after3/report.json)) | 100% (55 of 55) | 38% (17 of 45) | 15 of 30 | 6 of 23 |
| Store-type filter (this run, pilot subset) | 100% (56 of 56) | 53% (18 of 34; 13 left out) | 15 of 30 | 6 of 23 |

Online results went from mostly review articles to shops. Local precision moves around a lot between runs because each run has about 40 local rows, so a few rows swing it by 10 points.

The probe covered every retailer domain in all 60 searches (566 domains; 44 fetch errors are left out of the rate). On the 234 pages both the probe and a grader opened, the grader saw every one, while 39 turned the declared bot away (36 refused or challenged it, 3 disallowed it in robots.txt). Graders recorded only whether a page opened, not whether it blocked them, so this compares the bot with a person who got through. A site that fetched retailer pages to check stock would lose about one retailer in six ([probe.json](evidence/quality/eval60/probe.json)).

## Rerun after distance groups and classifier-judged ranking

On 2026-09-24 the same 20 searches were run again on the Worker with distance groups (nearby 10 mi metro, 30 mi rural, up to 3 "Farther away" to 100 mi) and local relevance from the classifier's sells judgment. Nothing measurable changed: every difference is within what a rerun alone moves ([report](evidence/quality/eval20-0924/report.json)).

| Measure | Before (eval60) | Rerun |
|---|---|---|
| Local precision, both graders' answers | 56% (94 of 167) | 59% (90 of 153; 18 not judgeable) |
| Good shops in each search's nearby top 3 | 30 of 54 judged | 29 of 51 judged |
| "Farther away" shops (new) | n/a | 5 good, 4 bad, 1 not judgeable |
| Online precision | 99% (189 of 191) | 98% (184 of 188) |
| Local recall, farther shops included | 26 of 86 | 24 of 86 |
| Online recall | 30 of 100 | 30 of 100 |
| Shown results the model did not judge | not measured | 0 online, 0 local |

- **Recall moved by 4 chain stores.** Lost: Target (Kyle) and Safeway (Burlingame), which Brave did not return this time, and DICK'S Sporting Goods (Buckhead), returned but ranked below the top 10. Gained: Mountain High Outfitters (Buckhead), matched by domain through a different listing (Ponce City Market) that this run's grader found closed, so the gain is not a real find.
- **The offline replay did not carry over.** Replaying the new ranking on eval60's saved results put 29 good shops in the nearby top 3 instead of 23 (a different count from the table above, which uses both graders' answers); live, Brave returned different shops and the top 3 held level.
- **Method.** 316 of 359 grades were reused from eval60 where the URL (and, for local, the address) matched; the 43 new rows were graded by two agents that did not see the baseline or earlier grades. The graders' browser was blocked on 3 online pages (Macy's, Bloomingdale's, Public Lands); the operator opened them in a personal browser and all 3 sell the product. The recall baseline is eval60's, unchanged; miss reasons in the report are eval60's labels, not checked again. The run made 80 Brave calls and cost about $0.42 in model use. Scripts and inputs: [eval20-0924/method](evidence/quality/eval20-0924/method/).

## Why local results change from run to run

On 2026-09-25 the 20 graded searches were used to separate the causes of run-to-run change in local results ([evidence](evidence/quality/variation-0925/)). Overlap is the share of shop websites two runs have in common (shared ÷ all distinct), counting every local shop the Worker recorded from Brave, shown or not.

| Comparison | Searches | Overlap |
|---|---|---|
| Eval60 vs rerun, the model wrote the same local searches | 13 | 93% |
| Eval60 vs rerun, the model worded them differently | 7 | 62% |
| Same wording sent straight to Brave, two replays an hour apart | 20 | 93% |
| Same wording, rerun vs the first replay 1 to 2 hours later | 20 | 94% |

- **Wording is likely the main cause.** The model writes the two local searches, and at temperature 0 it still words them differently: across 6 runs of the same request, 11 of 20 searches got more than one wording. It happened when one provider served every run, so pinning the provider would not fix it. One word can matter: "tea store" and "tea shop" in rural Illinois shared 2 of 18 shops. 4 of the 7 differences between the eval runs were only "store" vs "shop".
- **Brave itself changes a little.** With the wording fixed, about 1 shop in 14 changes within an hour, and the order of the top 5 changed in 7 of 20 searches. That is about as much change as between eval runs whose wording matched. Target (Kyle) was lost this way: same searches, and Brave stopped returning it.
- **The shop-judging step barely changes.** Of 230 shops Brave returned in both eval runs, 1 was shown in one run and judged out in the other.
- **Of the three shops the rerun lost**, one was Brave (Target), one followed a wording change (Safeway, Burlingame: "chocolatier shop" / "specialty food store" became "chocolatier store" / "specialty food shop"), and one was ranking (DICK'S, Buckhead: returned, but below the top 10).
- **Method.** Wording: the production normalize prompt and request settings, 6 runs per search, $0.008 in model use. Brave: each search's rerun wording sent to Brave place search twice with the Worker's coordinates and count, 80 calls. Eval comparisons use saved responses only. The Brave measure covers about two hours; churn over days or weeks was not measured.

## Rerun after fixing the search wording

On 2026-09-25 and 26 (US Pacific) the same 20 searches were run twice on the Worker, about an hour apart, after local searches were made to always end in "store" and the model's reading of each product was cached ([evidence](evidence/quality/eval20-0925/)). The wording is now repeatable. Both runs' local precision was above the 9-24 rerun's, and the two runs were 1.9 points apart; the step that judges whether a shop sells the product now changes more between runs than the earlier measure found.

**Precision rule (operator ruling, 2026-09-26):** a local shop confirmed not to exist counts as bad, even when whether it sells the product is unknown; applied to the figures below. Under this rule the eval60 headline would move from 51% (72 of 140) to 50% (72 of 144), and the 9-24 rerun from 59% (90 of 153) to 58.1% (90 of 155); the earlier tables above (including the "Rerun 9-24" column in the table below) are left as originally reported rather than rewritten.

| Measure | Rerun 9-24 | Rerun 9-25, first run | Rerun 9-25, second run |
|---|---|---|---|
| Local precision, both graders' answers | 59% (90 of 153; 18 not judgeable) | 63.6% (96 of 151; 19 not judgeable) | 61.7% (95 of 154; 20 not judgeable) |
| Good shops in each search's nearby top 3 | 29 of 51 judged | 32 of 49 judged | 32 of 50 judged |
| "Farther away" shops | 5 good, 4 bad, 1 not judgeable | 9 good, 3 bad, 1 not judgeable | 9 good, 3 bad, 1 not judgeable |
| Online precision | 98% (184 of 188) | 98% (188 of 192) | 98% (187 of 191) |
| Local recall, farther shops included | 24 of 86 | 28 of 86 | 30 of 86 |
| Online recall | 30 of 100 | 31 of 100 | 31 of 100 |

- **The wording fix held.** Every local search in both runs ended in "store"; the 3 zips of each product sent the same wording; and the second run sent the first run's wording in all 20 searches. The cache stored a fresh wording, so 18 of 20 searches were worded differently from 9-24: this run is a new starting point, not a like-for-like repeat ([compare.json](evidence/quality/eval20-0925/compare.json)).
- **Run to run, with the wording fixed:** the two runs shared 93% of shown shop websites (96% of all local shops the Worker recorded from Brave), and the nearby top 3 was identical in 17 of 20 searches ([run2-compare.json](evidence/quality/eval20-0925/run2-compare.json)).
- **Shop judging caused most of the remaining change.** Of 14 shop websites shown in only one run, 8 were judged "does not sell" in the other run, 3 were ranked below the top 10, and 3 were not returned by Brave. Counted the way the earlier measure was, 8 of the 248 shops Brave returned in both runs were shown in one and judged out in the other; eval60 vs the 9-24 rerun had 1 of 230. The 8 came from 2 searches: cast iron skillet (suburban), where Brave returned the same shops and the judging call used the same number of prompt tokens both times, and camping tent (urban), where the first run judged 9 local shops out and the second none.
- **Recall gained 5 stores and lost 1.** Gained: Target (Kyle), Safeway (Burlingame) and DICK'S Sporting Goods (Buckhead), the three the 9-24 rerun lost, plus High Country Outfitters (Midtown) and Target (St Louis Park). Lost: Trader Joe's (Atlanta), which the second run found again along with The Home Depot (Natick). These counts compare the first run with 9-24. Mountain High Outfitters (Buckhead) still counts as found through a listing the 9-24 grader found closed.
- **Among the 24 new local rows** the graders found 3 shops no longer at the listed address, a wholesale building-products distributor, and a result linked to an unrelated app's website.
- **Method.** 325 of 362 grades were reused from eval60 and the 9-24 rerun where the URL (and, for local, the address) matched; the 37 new rows were graded by two agents that did not see the baseline or earlier grades. The graders' browser was blocked on Cabela's; the operator opened it in a personal browser and it sells tents. Five local pages the graders could not open cleanly (a certificate error, a refused connection, a human check) were graded from other evidence. The second run reused 354 grades (from the first run where they matched) and a third agent graded its 11 new rows; the operator checked 2 of them: Urban Outfitters (Walnut St) has no tents for sale, and no shop named First Contact Gear was found near 19103, so it counts as bad in precision under the non-existent-shop rule even though whether it sells tents is unknown. Each run made 80 Brave calls and cost about $0.42 in model use; 3 first-run searches timed out at the eval client's 60 s limit and were retried, and those attempts may have made up to 12 Brave calls not counted. Scripts and inputs: [eval20-0925/method](evidence/quality/eval20-0925/method/).

## Store types: chain badge and shop breadth (2026-09-29)

The same 20 searches ran twice, about an hour apart, on the Worker as deployed on 2026-09-29 (chain badge, `store_breadth` judgment, and the latency changes since eval20-0925: compact prompt, throughput routing, no signals, no editorial pages, split enrich call). Plan and gates: [plans/store-types.md](plans/store-types.md) Phase 4. Evidence: [eval20-store-types](evidence/quality/eval20-store-types/) (run 1) and its `run2/` folder. Both runs: 20 of 20 searches succeeded, each with two `enrich` calls, 80 Brave calls (price-list estimate, not billed), model use $0.0718 and $0.0720 (from the responses' `usage.llm`), median search 2.9 s and 3.3 s.

| Label | Measure | Run 1 | Run 2 | Bar | Result |
|---|---|---|---|---|---|
| M1 | Online precision | 98.4% (188 of 191; 0 not judgeable) | 98.4% (188 of 191; 0) | 96% floor | Met |
| M1 | Local precision | 70.9% (100 of 141; 17 not judgeable) | 71.0% (103 of 145; 16) | 57.5% floor | Met |
| M2 | Shops judged "sells it" in one run and out in the other | 2 of 241 shops returned in both | | 8 of 248 earlier; more than double fails | Met; wording identical in all 20 searches |
| M3 | Chain badge on a shop labelled `chain: false` | 0 of 20 returned | 0 of 21 returned | 0 | Met |
| M4 | `chain: true` shops returned that carry the badge | 39 of 41 | 38 of 40 | Reported | Both misses are unlisted chains: Sports Basement (Bryant St) and The North Face (Natick Mall), same two in both runs |
| M5 | Model `store_breadth` against the grader's, where both said specialist or general | 76.3% (90 of 118) | 75.4% (89 of 118) | Reported | See below |
| M6 | Good rate of "may sell it" shops the model called specialist | 50% (10 of 20 judged; 25 shown) | 45% (9 of 20; 25 shown) | 60% on at least 20 rows (Q5) | Not met: 47.5% (19 of 40 judged) over both runs |

- **Operator rulings (2026-09-30).** No on Q5 (no specialist relevance tier) and no on Q6 (no values component); Phases 3b and 5 of the plan are dropped and `store_breadth` stays in the response with no score effect.
- **M6 in full (both runs, judged rows only).** "May sell it" shops by the model's label: specialist 47.5% good (19 of 40), general 65.9% (60 of 91), unknown 50% (8 of 16). By the grader's label the same shops: specialist 72.5% (37 of 51), general 75% (36 of 48), and 29.2% (14 of 48) for shops the grader could not call specialist or general. "Likely sells it" shops by the model's label: specialist 76.7% (46 of 60), general 88.3% (68 of 77). The two runs share most shops, so the two runs are not independent samples; 169 distinct shops appear in the pooled rows.
- **Why the model's "specialist" does not help (likely).** In each run the grader answered "unknown" on about 37 of the 158 to 161 local rows, and by keyword in its notes about 30 of those are shops whose single main line is a different category than the product (a fly-fishing shop for a headlamp, a building-supply yard for a drill); the three-way scale has no value for them. The model called 16 of run 1's "unknown" shops "specialist", so its specialist group in run 1 is 41 shops the grader also judged specialists plus 16 the grader could not place, which is likely what drags its good rate down. It also called 28 shops "general" that the grader judged specialists (0 the other way). Read as a yes/no question, "specialist for this product or not", the model and grader agree on 71.5% (108 of 151) of run 1's rows. In the graded rows, the split that separates good from bad "may sell it" shops is whether the grader could place the shop as specialist or general (29% good for those it could not, mostly wrong-line shops, against about 73%), not specialist versus general (72.5% against 75%).
- **Chain badge sources.** 29 distinct source pages sit behind the 103 badged rows of run 1. A grader checked each page for a stated store count of 10 or more: 28 of 29 do (Office Depot's page, read in a browser, says 834 retail locations without naming the country). REI's page refused every grader load; the operator opened it on 2026-09-30: it announces new stores but does not state how many REI stores there are, so it does not support the badge's "190+". Those 10 badged rows per run are the only `badges_sourced: no` answers in `report.json`. Three counts differ from their pages: Walmart's badge says 5,217, but the page says 4,615 Walmart U.S. stores and 602 Sam's Club clubs; the Cabela's badge says 70 (the page's January 2024 U.S. figure) while the page's latest figure is 49 for the U.S. and Canada together; the Ace Hardware page's newest figure is over 5,700 against the badge's "5,000+". None falls below 10. These are follow-ups for `data/chains.json`, not fixed here.
- **Grading.** 330 of 349 run 1 grades and 345 of 352 run 2 grades were reused (matched on URL and, for local, address) from eval60, eval20-0924, eval20-0925 and the latency grading; a browser agent graded the 19 new run 1 rows and 7 new run 2 rows, and seven agents graded `store_breadth` for the 147 reused local rows of run 1 (the browser agents did the other 11 in run 1 and 11 in run 2), from each shop's own site or listing, without seeing the model's label, the chain badge or any earlier grade. A browser pass reopened 42 rows the fetch agents could not read. Grader labels are judgment: the graders read "specialist" relative to the product and disagreed on big-box chains, so one rule was applied at merge (Home Depot, Lowe's and Office Depot are "general" for every product; 8 rows per run changed, and M5 without the rule would be 73.2% (82 of 112) and 72.3% (81 of 112)). Seven run 1 rows the browser agent marked "yes" without loading the page (Walmart, Steep & Cheap in three searches, Locally, Columbia, Home Depot Brentwood) were set to "unknown" until the operator opened the pages on 2026-09-30 and confirmed all five pages list the product (the Home Depot store page sells drills); 5 run 2 rows sit on the same pages and take the same answer. Scripts and inputs: [eval20-store-types/method](evidence/quality/eval20-store-types/method/).
- **Against eval20-0925 (directional only, the Worker changed in five ways since).** Local precision 70.9% and 71.0% against 63.6% and 61.7%; nearby top 3 good 36 of 51 and 36 of 52 judged against 32 of 49 and 32 of 50; local recall 30 of 86 in both runs against 28 and 30, online 31 of 100 in all four. 44% (64 of 146) and 39% (58 of 147) of nearby shops carry "likely sells it", below the roughly half the split-enrich test showed.

## Why good shops were missed

| Reason | Online | Local |
|---|---|---|
| Brave has a matching page but it was not in the top 10 for the site's queries (a `site:` query found one) | 48 | not checked |
| Returned but ranked below the top 10 or cut by the 2-branch cap | 2 | 3 |
| Never returned by the site's Brave queries (online: not checked, Brave call budget) | 20 | 57 |

All 48 online misses checked with a Brave `site:` query had a matching page in Brave's index (hit counts in [misses.json](evidence/quality/eval60/misses.json)), so online recall is limited by what the site's two online queries return, not by the index. Local misses were never among Brave's place results for the site's two local queries; whether Brave's place index holds them was not checked.

## Experiments that did not ship

| Idea | Result | Evidence |
|---|---|---|
| Add OpenStreetMap shops and Brave web results to the local candidates | No gain in precision: 44.7 to 45.5% in every combination against 47.4% for production. Adding web results raised recall matched by domain (10 of 23 against 6), but those hits were national category pages or other branches; counting only the exact store, every combination found 4 or 5 of 23. Decided not to build an OSM index | [merge-test/score.md](evidence/quality/merge-test/score.md) |
| A stronger classifier model (Gemini 2.5 Flash) with one added prompt paragraph about map listings | Held for a decision. It passed a rule fixed before the test, on the merge-test searches: local precision 62.5% against 49.4%, the same share of good local shops kept, the same result on two runs, $0.0037 more per search. On the 20-search sample it would also drop 12 of 72 good local shops (3 of them small independents: a kitchen shop and two tea shops; the rest chains such as REI for a rain jacket) and 3 of 189 good online shops, while dropping 32 bad local ones. Not in the code and not deployed | [classifier-test/README.md](evidence/quality/classifier-test/README.md) |

## Method

60 searches: 20 products in 8 categories, each in an urban, a suburban and a rural zip across 10 states ([`eval/README.md`](../eval/README.md) has the zip rule and field definitions). All 60 were run on 2026-09-24 (UTC) against the deployed Worker, with the store-type filter live. A stratified sample of 20 was graded: the 6 pilot searches plus 14 others covering every category, balanced across zip kinds (7 urban, 7 suburban, 6 rural). The sample was chosen from the query list before any result was looked at.

Each result was opened and graded by an AI agent working from the grading rules. Pages were first fetched directly; of the 279 results with no earlier grade, the 110 whose pages blocked fetching or needed JavaScript were graded in a real Chrome browser. Results graded in an earlier pilot run were reused. The recall baseline was built by separate agents that never saw the site's results: up to 5 local and 5 online shops per search found with a different search engine, each confirmed on its own page, with fetch-blocked chains confirmed in Chrome. Pilot baselines are the ones from the earlier pilot runs.

## Limitations

- **Small sample.** 20 graded searches (376 results) cannot represent every product or place; treat the numbers as a rough level.
- **AI graders.** Grades are one agent's judgment at one time; a second agent checked only samples. Online precision of 99% was spot-checked: a second agent regraded 15 online rows drawn with a seeded shuffle without seeing the first grades and judged all 15 relevant (14 yes, 1 close equivalent) ([spotcheck](evidence/quality/eval60/spotcheck/)). Local grades were checked the same way on 2026-09-24: a second agent regraded 36 local rows (12 per zip kind, seeded draw) without seeing the first grades, and on the 27 rows both could judge the two agreed on 25 (a good shop or not). The second agent also recorded whether its evidence was about that store or only the chain's website: 12 of 36 rested on chain evidence alone ([regrade-local](evidence/quality/eval60/regrade-local/)).
- **Many local rows could not be judged.** 45 of 185 local rows had an unknown answer (a store page that lists no products, a dead site with a live map listing) and are left out of precision. A second agent then regraded all 45 with a store-level rule (the 8 in the regrade sample, plus the other 37): 22 turned out good, 5 bad and 18 still could not be judged. Counting those, local precision is 56% (94 of 167) instead of 51%, a figure that mixes two graders ([regrade-local/unknowns.mjs](evidence/quality/eval60/regrade-local/unknowns.mjs)). On the 36-row regrade sample alone, precision was 54% (15 of 28) by the first grades and 71% (24 of 34) by the second.
- **Mixed grading method.** Fetch and browser grading can see different pages. The browser was signed in to the operator's accounts: 4 Facebook pages were read logged in, and Walmart showed no bot check, possibly because of that.
- **Recall is relative.** The baseline is what another search engine found, up to 5 shops per section. One search (loose-leaf green tea, rural Illinois) has no confirmed local shop.
- **The probe is a proxy.** It runs from Cloudflare's network and names itself, while Brave's crawler does not, so its blocked rate approximates what Brave meets. Its challenge detection is a heuristic.
- **Local results change between runs.** Mostly because the model worded its local searches differently ([details](#why-local-results-change-from-run-to-run)); with the wording now fixed, the model's sells judgment is the largest remaining cause ([details](#rerun-after-fixing-the-search-wording)). A single run can gain or lose a shop by chance, so small differences between eval runs are not evidence of a change; every graded eval now runs twice and reports both (operator ruling, 2026-09-26).
- **Unknowns are left out.** Results the grader could not judge are excluded from precision and reported as a count.
