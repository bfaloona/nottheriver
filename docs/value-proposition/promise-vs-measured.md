# Promise vs measured

Blind review, written 2026-11-11 from eight docs only (listed below). The site copy, code and evidence folders were not read, so every promise here is taken from those docs, not from the live page.

Two names used throughout: **Brave** is the search service the site pays for (web search and place search). The **Worker** is the site's search backend.

## The answer

- **Kept:** the online list (about 98% of results are shops that sell the product) and speed (about 3 to 5 s median).
- **Broken:** the nearby list. About 3 in 10 nearby shops a grader could judge do not sell the product or are not there, and "good" never meant "in stock at that store".
- **Mostly empty:** ranking by ethics and environment. Those two parts are 60% of the score, and likely more than 9 in 10 results carry the same default value for both.
- **Not measured at all:** "without Amazon". None of the eight docs counts how often an Amazon-owned shop gets through.
- **The weakness that most limits the offer:** the site cannot tell whether a named nearby shop carries the product. It guesses from the shop's name and store type (`docs/ranking.md:43`), and the price of a wrong guess is a drive, not a click.

The quality figures come from 20 graded searches, graded by AI agents, last run in full on 2026-09-29. One more Worker change on 2026-10-01 was checked but not fully regraded (`docs/quality.md:108`). Treat every rate as a likely level, not a fact about today's live site.

## Promises held against measurements

"Measured" means the figure is in the cited line. "My arithmetic" means I derived it from cited lines. "Implied" means the docs do not state the promise; a shopper would likely assume it.

| Label | Promise (where it is stated) | Measured | Verdict |
|---|---|---|---|
| P1 online shops | Results are shops that sell the product (`docs/ranking.md:7`) | 98.4%, 188 of 191, in both runs of 2026-09-29 (measured, `docs/quality.md:99`) | Kept |
| P2 nearby shops | Same, for shops near you | 70.9% (100 of 141) and 71.0% (103 of 145) of judged rows; 17 and 16 rows could not be judged (measured, `docs/quality.md:100`). So about 29% of judged rows are wrong, and 63% to 64% of all nearby rows shown are confirmed good (my arithmetic: 100 of 158, 103 of 161) | Broken |
| P3 top of the nearby list | Implied: the first shops listed are the best bets | 36 of 51 and 36 of 52 judged top-3 shops good (measured, `docs/quality.md:113`): about 3 in 10 wrong at the top too | Broken |
| P4 the "sells it" label | Implied: "likely sells it" and "may sell it" tell a shopper something | "Likely": 114 of 137 judged good, 83%. "May": 87 of 147, 59% (my arithmetic from `docs/quality.md:109`, two runs that share most shops). 39% to 44% of nearby shops carry "likely" (measured, `docs/quality.md:113`) | Half kept: "likely" is useful; "may" is close to a coin flip and covers most of the list |
| P5 in stock at this store | Implied by any nearby list | Never measured. The judgment is "a likelihood, not a stock check" (`docs/ranking.md:43`); 12 of 36 regraded rows rested on the chain's website alone (`docs/quality.md:141`) | Unmet |
| P6 the shop exists | Implied: a listed shop is at that address | No current rate. 3 of 24 new rows on 2026-09-25 were shops no longer at the address (measured, `docs/quality.md:90`) | Likely breaks now and then |
| P7 finds the good shops | Implied: a search turns up the shops worth knowing | Nearby: 30 of 86 baseline shops found. Online: 31 of 100 (measured, `docs/quality.md:113`). The baseline is at most 5 shops per section from another search engine (`docs/quality.md:144`), so this is "finds about a third of a short list", not "misses 70% of all shops" | Weak |
| P8 finds independents | Implied by the project's aims (`docs/open-place-coverage.md:85`) | Independents 5 of 22 found, chains 23 of 64 (measured, `docs/quality.md:17`; run not stated, and 28 of 86 does not match that file's headline 26 of 86 at `docs/quality.md:10`; small sample) | Weak, likely weaker than for chains |
| P9 ranked by ethics and environment | Score = 0.25 relevance + 0.30 ethics + 0.30 environment + 0.15 proximity (`docs/ranking.md:29`) | Both start at 0.5 (`docs/ranking.md:47`). 13 of 376 results carried a certification badge in the first full run (measured, `docs/quality.md:12`, `:140`); 28 to 29 curated signals per run of about 360 results on 2026-09-28 (measured, `docs/search-latency.md:70`). Four findings exist in total (`docs/ranking.md:114`) | Mostly empty: likely 92% to 96% of results get the default on both |
| P10 every result explained from a source | `docs/feasibility-overview.md:18` | No unsupported certification badge (0 of 13, `docs/quality.md:12`). Chain badge: the REI count is unsupported on 10 badged rows per run, and three store counts differ from their source pages (`docs/quality.md:111`) | Mostly kept; four known data errors |
| P11 every finding disputable | `docs/feasibility-overview.md:18`, `docs/ranking.md:112` | The link exists; how a dispute is reviewed is "TBD" (`docs/ranking.md:122`) | A link without a process |
| P12 zip never leaves the browser | `docs/feasibility-overview.md:17`, `docs/privacy.md:7` | True as written. The center of the zip area, rounded to about 0.6 mi, goes to Brave twice per search and "identifies your zip area" (`docs/privacy.md:8-9`, `:19`) | Kept in letter; the short form overstates it |
| P13 no accounts, no tracking | `docs/feasibility-overview.md:17` | The privacy doc does not claim nothing is kept (`docs/privacy.md:3`). Kept: a 30-day list of products searched, with no location (`docs/privacy.md:32`). Map images send the shopper's IP address to OpenStreetMap (`docs/privacy.md:12`). The model account's privacy settings are "not verified" (`docs/privacy.md:44`) | Kept, with one unverified setting |
| P14 fast | Not stated as a promise | Whole search: median 2.9 s and 3.3 s on 2026-09-29 (measured, `docs/quality.md:95`), down from 25 s to 29 s (`docs/search-latency.md:64`). Two days later the model step alone had a median of 4.1 s or 5.1 s (`docs/quality.md:108`). Nearly every call ran on one fast provider; slow-provider behavior was not measured (`docs/search-latency.md:109`, `:132`) | Kept, resting on one provider |
| P15 open cost ledger | Each search shows its cost (`docs/costs.md:3`) | About $0.023 a search, of which $0.020 is a Brave price-list estimate, not billed data (`docs/costs.md:31`) | Kept, if the footer says "estimate" |
| P16 honest degradation | The site says when the month's budget is reached (`docs/feasibility-overview.md:19`) | Free credit covers about 250 searches a month (`docs/costs.md:33`). Whether a per-key quota can be set is unverified (`docs/feasibility-overview.md:34`) | Not shown to work |
| P17 without Amazon | The product's premise | Not measured in any of the eight docs. `docs/ranking.md:7` mentions two blocklist passes; no doc reports a leak count | Unknown |

## What the score really sorts on (my arithmetic)

From `docs/ranking.md:29`, `:47` and `:76`, for a result with no certification and no finding:

| Result kind | Score | What changes the order |
|---|---|---|
| Online shop | 0.375 + 0.25 × relevance | Only relevance, which has three values (1.0, 0.5, 0.2). Shops with the same value tie |
| Nearby shop, metropolitan zip (within 10 mi) | 0.30 + 0.25 × relevance + 0.15 × proximity | "Likely" against "may" is worth 0.125. The whole 10 mi of distance is worth at most 0.06 (proximity reaches zero at about 25 mi) |

So among those results the order is a keyword match online, and "likely or may, then distance" nearby. The line of weights shown above the results (`docs/ranking.md:3`) tells a shopper that ethics and environment are 60% of the score. They move only the few results that have a certification or a finding, up or down against the rest.

A second gap: proximity reaches zero at about 25 mi, while a rural "near you" list runs to 30 mi and "farther away" to 100 mi (`docs/ranking.md:76`, `:84-85`). Distance stops sorting rural shops just where it starts to matter.

## What a shopper would feel at these rates (my judgment, not data)

No visitor was observed or asked in the docs I read. These are my reading of the rates.

| Label | Situation | Rate behind it | Likely feeling |
|---|---|---|---|
| F1 | Scans the online list | 1 or 2 wrong in 100 | Trust. This part works like a clean shop list |
| F2 | Scans a nearby list of about 8 shops | About 5 good, 2 wrong, 1 nobody could confirm (my arithmetic from `docs/quality.md:100`: 158 rows over 20 searches) | Sees a fly-fishing shop for a headlamp or a building-supply yard for a drill (`docs/quality.md:110`) and discounts the whole list, good rows included |
| F3 | Drives to one of the top 3 | About 3 in 10 judged shops wrong, and stock at that store never checked | One wasted trip is likely enough to end use of the nearby list. A wasted trip costs more than the click to a big retailer it was meant to replace |
| F4 | Reads "may sell it" on most nearby rows | 56% to 61% of rows, about 59% good | A hedge on most rows reads as "the site does not know", which is accurate |
| F5 | Looks for a known local independent | Independents found 5 of 22 | "It does not know my town." The shopper notices the missing shop they already know |
| F6 | Picks the site for its ethics ranking | Default values on likely more than 9 in 10 results | The page likely shows "Baseline 0.5" twice on almost every result (`docs/ranking.md:47`). Reads as a promise with little behind it |
| F7 | Reads "your zip never leaves the browser", then the privacy page | Zip-area center to about 0.6 mi sent to Brave | Feels the headline was a technicality. The privacy page itself is candid, which helps |
| F8 | Waits for results | About 3 to 5 s | No complaint |

## Weaknesses compared

| Label | Weakness | How often wrong | Cost to the shopper when wrong | Can wording fix it? |
|---|---|---|---|---|
| W1 | Cannot tell if a nearby shop carries the product | About 3 in 10 judged; stock unmeasured | A drive | Partly (it sets the expectation), not the rate |
| W2 | Misses shops worth knowing | About two thirds of a short baseline | Invisible, except when a known shop is absent | No |
| W3 | Ethics and environment data is thin | Likely more than 9 in 10 results at default | A hollow promise, no wasted trip | Yes |
| W4 | Brave is the cost; about 250 free searches a month | Not a quality rate | None until the quota is hit | No |

**W1 is the one.** It has the highest wrong rate on the part of the product with the highest cost of error, and it is the part a general search engine does not already do. W2 loses because a shopper cannot see a miss. W3 loses because honest wording removes most of the harm. W4 limits scale, not the offer.

Why W1 is hard, from the docs:

- A page-reading stock check is blocked at about 1 retailer in 6 (`docs/quality.md:34`).
- A stronger model raised nearby precision to 62.5% from 49.4% but would have dropped 12 of 72 good shops, 3 of them small independents (`docs/quality.md:130`).
- Open place data as a category lookup gave 6 sellers in the 300 nearest shops; 187 of the 300 could not be judged (`docs/open-place-precision.md:13`, `:19`).
- Open place data does hold the shops: 82 of 86 baseline shops are in Overture Places, a free place dataset (`docs/open-place-coverage.md:11`). Matching by brand name, not category, was never measured.

## The case for stopping (my judgment)

Not made by these numbers. Fixed cost is zero (`docs/feasibility-overview.md:7`), the online list keeps its promise, and the docs report their own failures plainly. The case would strengthen if CH-3 (the Amazon leak count below) finds Amazon-owned shops getting through, or if CH-1's re-cut (below) leaves most nearby lists nearly empty.

## What I could not check

- The live page, the About page's headline figure (`docs/quality.md:3`), and any tagline.
- Any rate after 2026-10-01. Change in Brave's results over days or weeks was not measured (`docs/quality.md:69`).
- Real visitor behavior: no measured searches-per-user figure exists (`docs/feasibility-overview.md:33`).

## Files read

`docs/quality.md`, `docs/search-latency.md`, `docs/open-place-coverage.md`, `docs/open-place-precision.md`, `docs/costs.md`, `docs/feasibility-overview.md`, `docs/ranking.md`, `docs/privacy.md`. No web pages were fetched and no searches were made.

## Ranked changes

Sizes are one of: wording, screen, feature, pivot.

### CH-1. Show only "likely sells it" shops near you by default; put "may sell it" shops behind a "might carry it, call first" fold

- **Evidence:** "likely" is about 83% good and "may" about 59% (`docs/quality.md:109`); 82% to 83% against 45% to 46% in the earlier test of judging online and nearby shops in separate model calls (`docs/search-latency.md:119-120`); "likely" covers 39% to 44% of nearby rows (`docs/quality.md:113`), with 14 of 157 more moved to "likely" on 2026-10-01 (`docs/quality.md:108`).
- **Known cost:** 87 of the 201 judged-good rows (43%, my arithmetic from `docs/quality.md:109`) carry "may" and would sit behind the fold. The operator already declined a stricter classifier that would have dropped 12 of 72 good shops (`docs/quality.md:130`). A fold differs: the shops stay one tap away with an honest label, where a drop removes them.
- **Size:** screen.
- **Cheapest test:** re-cut the saved 2026-09-29 graded rows, zero Brave calls: (a) precision of the "likely" rows alone, (b) how many of the 20 searches have fewer than 3 "likely" shops, split by urban, suburban and rural, (c) which good shops move behind the fold, and how many are independents.
- **Confidence:** high that visible precision rises to roughly 80% to 88%. Medium that the lists stay long enough: 58 to 64 "likely" rows over 20 searches is about 3 a search, and rural searches may get fewer.

### CH-2. Stop implying ethics and environment decide the order; say how many results have any such data

- **Evidence:** weights (`docs/ranking.md:29`), baseline 0.5 (`docs/ranking.md:47`), 13 badged results of 376 (`docs/quality.md:12`, `:140`), four findings in total (`docs/ranking.md:114`), weights line shown above results (`docs/ranking.md:3`).
- **Size:** wording. Illustrative line, counts made up: "2 of these 14 shops have a certification or a regulator finding on file. The rest are sorted by how likely they are to sell it, then distance."
- **Cheapest test:** from saved responses, count results whose ethics or environment value differs from 0.5, and count searches whose top 3 changes when both weights are set to zero. Zero Brave calls.
- **Confidence:** high that the share is under 10%. Medium that the top 3 changes in fewer than 1 search in 5.

### CH-3. Measure "without Amazon" and publish the number

- **Evidence:** no leak count in any of the eight docs; blocklist passes mentioned only in passing (`docs/ranking.md:7`).
- **Size:** feature (one more column in the evaluation report).
- **Cheapest test:** run the blocklist's own list of Amazon-owned domains and brand names over the saved responses of the 60 evaluation searches, plus a hand read of 50 random shown results for sellers that fulfil through Amazon. Zero Brave calls.
- **Confidence:** high that it is worth measuring, since it is the headline promise. No view on what the number will be.

### CH-4. Add known chain stores from open place data by brand name, with a per-chain "sells this category" table

- **Evidence:** 57 baseline nearby shops were never returned by Brave's place search (`docs/quality.md:121`); 60 of 64 chain baseline shops are in Overture Places (`docs/open-place-coverage.md:36`); the chain list has 41 rows and a rule per chain "would move those to yes without the tag" (`docs/open-place-coverage.md:42`).
- **Why this is not the two ideas already tried:** adding OpenStreetMap shops to the candidates gave no precision gain and found 4 or 5 of 23 exact stores (`docs/quality.md:129`), and the category-only lookup failed (`docs/open-place-precision.md:79`). Both admitted shops by type. This admits only stores whose brand is on the curated chain list. Only 19 of the 300 category-lookup rows matched a listed chain, and 17 of those went unjudged because the chain's site refused the grader (`docs/open-place-precision.md:19`), so the brand route is untested, not disproved.
- **Size:** feature.
- **Cheapest test:** on the existing coverage results, count the baseline shops the site missed that are Overture rows matching a listed chain. That is the recall this would add, with zero Brave calls. Then have a person open the 17 blocked chain pages to settle the precision side.
- **Confidence:** medium for recall on chains. Low that it helps independents, the group the project's aims name (`docs/open-place-coverage.md:85`).

### CH-5. Reword the nearby list as "shops to call", with a phone number and a "call to check stock" line on every row

- **Evidence:** the judgment is not a stock check (`docs/ranking.md:43`); a third of regraded rows rested on chain-level evidence (`docs/quality.md:141`); Overture carries a phone number for 82 of 82 found shops (`docs/open-place-coverage.md:49`). Whether Brave's place results carry a phone number is not in the docs I read.
- **Size:** wording, plus feature if phone numbers must be joined in.
- **Cheapest test:** count the share of saved nearby rows that already have a phone field. If low, count how many match an Overture row by name and address.
- **Confidence:** medium. It lowers the cost of a wrong row from a drive to a call; it does not lower the wrong rate.

### CH-6. Lead the first screen with the online list; present nearby as the second, less certain section

- **Evidence:** online 98.4% against nearby 71% (`docs/quality.md:99-100`). I did not see the current first screen, so this may already be the case.
- **Size:** screen.
- **Cheapest test:** none in the saved data. It needs a count of which section visitors click, and the daily counters are not built yet (`docs/feasibility-overview.md:26`). Any such count would need a row in the privacy doc first.
- **Confidence:** medium, my judgment only.

### CH-7. Replace "zip never leaves the browser" as the short privacy line

- **Evidence:** `docs/feasibility-overview.md:17` against `docs/privacy.md:9` and `:19`.
- **Size:** wording. Example: "Brave learns which zip area you searched from, to about 0.6 mi. Brave and the model provider never get your zip, address or IP address." (OpenStreetMap, Cloudflare and GitHub do receive the IP address: `docs/privacy.md:12`, `:29-30`, `:33`.)
- **Cheapest test:** show each line to five people and ask who learns where they are. I have no data on which reads better.
- **Confidence:** high that the current short form overstates; medium that visitors care.

### CH-8. Fix the four known badge data errors and write the dispute process

- **Evidence:** REI count unsupported; Walmart, Cabela's and Ace Hardware counts differ from their pages (`docs/quality.md:111`); dispute review "TBD" (`docs/ranking.md:122`).
- **Size:** wording (data rows and one short page).
- **Cheapest test:** rerun the badge source check on the corrected rows; file one test dispute and time it to a decision.
- **Confidence:** high. Small, but these are the only places where "sourced" is measurably false.

### CH-9. Make proximity keep sorting past 25 mi in rural zips

- **Evidence:** proximity is zero at about 25 mi (`docs/ranking.md:76`); rural lists run to 30 mi and 100 mi (`docs/ranking.md:84-85`); 7 of 19 good rural shops were beyond 30 mi (`docs/ranking.md:88`).
- **Size:** feature (one formula change).
- **Cheapest test:** replay the saved rural searches with a 100 mi scale and compare good shops in the top 3. Zero Brave calls.
- **Confidence:** low to medium; 6 rural searches is a thin sample.

### CH-10. Pivot option: drop the promise of nearby search; keep a non-Amazon online shop finder plus a curated list of chains and independents per area

- **Evidence:** the directory direction is already named (`docs/feasibility-overview.md:11`); Brave's place search is $0.010 of a $0.023 search (`docs/feasibility-overview.md:8`); on a like-for-like grading basis nearby precision moved from 56% to about 71% across the fixes of 2026-09-23 to 2026-09-29 (`docs/quality.md:42`, `:100`; directional, the Worker changed several ways) and still has no stock check.
- **Size:** pivot.
- **Cheapest test:** CH-1's re-cut. If fewer than half of the 20 searches keep 3 or more "likely" shops, the nearby list as a search product is likely not rescuable by filtering, and curation is the remaining route.
- **Confidence:** low. I would try CH-1, CH-4 and CH-5 first.
