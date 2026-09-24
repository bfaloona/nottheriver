# Search quality

Graded 2026-09-23 (US Pacific time; baseline top-up and access probe finished 2026-09-24) on a sample of 20 of the 60 evaluation searches. The results table comes from [`evidence/quality/eval60/report.json`](evidence/quality/eval60/report.json), produced by `eval/summarize.mjs` from the saved responses and grades in the same folder; the other tables cite their own evidence files. The About page shows the headline from `src/quality.json`.

## Results

| Measure | Online | Local |
|---|---|---|
| Precision (sells the product; local: and the shop exists) | 99% (189 of 191) | 51% (72 of 140; 45 not judgeable, left out) |
| Recall against a separately built baseline | 30% (30 of 100) | 29% (25 of 86) |
| Bot blocked rate (probe, one page per domain) | 16% (27 of 169 domains) | 14% (49 of 353 domains) |
| Results with an unsupported badge source | 0 of 7 with badges | 0 of 6 with badges |
| Local distance implausible | n/a | 2 of 185 |

Local precision by area: urban 48% (23 of 48), suburban 53% (30 of 57), rural 54% (19 of 35).

Local recall by kind of shop: independents 17% (4 of 23), chains 33% (21 of 63). A chain here is a brand with 10 or more US stores under one name; Ace Hardware dealers count as Ace. The labels are this report's judgment, one per baseline shop.

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

## Why good shops were missed

| Reason | Online | Local |
|---|---|---|
| Brave has a matching page but it was not in the top 10 for the site's queries (a `site:` query found one) | 48 | not checked |
| Returned but ranked below the top 10 or cut by the 2-branch cap | 2 | 3 |
| Never returned by the site's Brave queries (online: not checked, Brave call budget) | 20 | 58 |

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
- **AI graders, one pass.** Grades are one agent's judgment at one time, with no second grader to check agreement. Online precision of 99% was spot-checked: a second agent regraded 15 online rows drawn with a seeded shuffle without seeing the first grades and judged all 15 relevant (14 yes, 1 close equivalent) ([spotcheck](evidence/quality/eval60/spotcheck/)).
- **Many local rows could not be judged.** 45 of 185 local rows had an unknown answer (a store page that lists no products, a dead site with a live map listing) and are left out of precision.
- **Mixed grading method.** Fetch and browser grading can see different pages. The browser was signed in to the operator's accounts: 4 Facebook pages were read logged in, and Walmart showed no bot check, possibly because of that.
- **Recall is relative.** The baseline is what another search engine found, up to 5 shops per section. One search (loose-leaf green tea, rural Illinois) has no confirmed local shop.
- **The probe is a proxy.** It runs from Cloudflare's network and names itself, while Brave's crawler does not, so its blocked rate approximates what Brave meets. Its challenge detection is a heuristic.
- **Unknowns are left out.** Results the grader could not judge are excluded from precision and reported as a count.
