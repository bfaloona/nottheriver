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

Local recall by kind of shop: independents 17% (4 of 23), chains 35% (22 of 63). A chain here is a brand with 10 or more US stores under one name; Ace Hardware dealers count as Ace. The labels are this report's judgment, one per baseline shop.

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
