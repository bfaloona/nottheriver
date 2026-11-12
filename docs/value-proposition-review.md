# Value proposition review

## 1. The answer

- **The offer today:** type a product and a zip code, get online shops that almost always sell it, a nearby list where likely about 3 in 10 judged shops are wrong, Amazon filtered out by code, and no price, stock, hours or phone. It is not open to anyone yet: no public link is allowed (`docs/STATUS.md:91`) and the free search credit covers about 250 searches a month (`docs/costs.md:33`).
- **It likely does not hold as stated.** The headline makes three promises (`index.html:25`). "Never Amazon" is enforced but its leak rate was never counted. "Near you" is the weakest measured part. "Ranked by how they treat people and the planet": 87% to 93% of results in a graded run of 2026-09-29 carry the default ethics and environment scores (measured for this review; agreement AG1 in section 2).
- **Nobody knows if it beats what a shopper already has.** No file the reviewers read records a shopper using it, or a comparison with a maps app or a general search engine.
- **The one change to make first:** rewrite the headline to what is measured (row R10): it finds shops that sell the thing, filters Amazon out by a sourced list, and flags the findings it has. The words are the operator's.
- **Then, before Amazon plan Phase B (the import of 54 findings):** the two remaining checks on saved results (row R1), five real shoppers (row R2) and a hand comparison against the free substitutes (row R3).

## How this was made

Written 2026-11-11. The rates in this file are from 20 graded searches last run in full on 2026-09-29; read each as a likely level, not a fact about today's site.

Four reviewers each saw only their own inputs and none of the others' work. This file is the lead's synthesis; a judgment here is the lead's unless a reviewer is named. A statement about what a shopper would think or do is a judgment, never data: no shopper was asked.

| Lens | Reviewer's angle | Saw the site? | Saw the measurements? | File |
|---|---|---|---|---|
| VL1 (first visit) | Pages, visitor-facing strings, four screenshots | Yes | Only the About page figures | [first-visit.md](value-proposition/first-visit.md) |
| VL2 (position) | Competitor and list-site research | No | No | [position.md](value-proposition/position.md) |
| VL3 (promise against measurement) | Eight docs of measurements | No | Yes | [promise-vs-measured.md](value-proposition/promise-vs-measured.md) |
| VL4 (different product) | Status, plans, ideas, the competitor summary | No | Summary figures only | [different-product.md](value-proposition/different-product.md) |

Shared inputs: VL2 and VL4 both read `research/competitors/README.md`; VL3 and VL4 both read `docs/feasibility-overview.md`. Where two reviewers agree from a shared file, the agreement is weaker than two independent readings.

Terms used below:

| Term | Meaning |
|---|---|
| Brave | The paid search service the site uses for web and place search |
| Precision | Of the results shown, the share a grader judged good (sells the product; for a nearby shop, also exists) |
| Recall | Of a short list of good shops built with another search engine, the share the site found |
| `caution` | A tier in the retailer research for a retailer with at least one counted finding |
| Phase B, Phase D | Parts of the Amazon plan (`docs/plans/amazon-alternatives-in-ranking.md`): B imports 54 findings, D adds suggested shops |

## 2. Where the reviewers agree and disagree

### Agreements and unopposed findings

| ID | Finding | Reviewers | Strongest evidence |
|---|---|---|---|
| AG1 | Ethics and environment are 60% of the stated score and likely change nothing for most results. | VL3 and VL4 infer it; VL2 infers it from the retailer research, which does not drive the live site; VL1 calls it unproven and asks for a count. | Measured: 13 of 376 results carried a certification badge (`docs/quality.md:12`, `:140`); 4 live findings (`docs/STATUS.md:27`). Both scores start at 0.5 (`about.html:36-37`). VL3 projected "more than 9 in 10 results at the default". Measured by the lead for this review, by text search over the 20 saved responses in `docs/evidence/quality/eval20-store-types/responses/` (run 1, 2026-09-29, 349 results): 651 of the 698 ethics and environment scores are 0.5; 33 are lowered to 0.25, 14 are raised. So 302 to 325 of 349 results (87% to 93%) are at the default on both; the exact figure needs a per-result join. 12 results carry a certification. Whether the order of the top 3 changes is not counted (row R1). |
| AG2 | The nearby list is the weak part. A wrong row costs a trip (reviewers' judgment). | VL1, VL3; VL4 on recall | Measured: nearby precision 70.9% and 71.0% of judged rows; nearby top 3 good in 36 of 51 and 36 of 52 (`docs/quality.md:100`, `:113`). Online precision 98.4% (`docs/quality.md:99`). Stock at the store was never checked (`docs/ranking.md:43`). |
| AG3 | A result gives a shopper nothing to act on: no price, stock, hours, phone or directions. Nearby rows should say "call first". | VL1, VL2, VL3 | The result row draws name, matched term, distance and address only (`src/render.ts:188-198`). |
| AG4 | Show how sure the site is on each nearby row, not inside a closed panel. | VL1 (its top change) and VL3 (its top change), the two reviewers who saw the site or the measurements | VL3's arithmetic from `docs/quality.md:109`: "likely sells it" rows 83% good (114 of 137), "may sell it" rows 59% (87 of 147). The labels exist only inside "Why this rank" (`src/render.ts:100-105`). |
| AG5 | No demand evidence exists. The research shows the product is unusual, not wanted. | VL2, VL4 (shared file); VL3 notes no visitor data | No public link (`docs/STATUS.md:91`); no searches-per-user figure (`docs/feasibility-overview.md:33`); the competitor summary concedes the gap (`research/competitors/README.md:22`, `:30`). |
| AG6 | Compare the site by hand with the free substitutes before more feature work. | VL2 and VL4, each as its top change, from a shared file. Their designs differ (disagreement DG3, below). | Google is the only compared tool with both product search and nearby-with-map (`research/competitors/search-tools.md:298-299`). |
| AG7 | The site finds about a third of a short list of good shops built with another search engine. | VL1, VL3, VL4 | Measured: 30 of 86 nearby, 31 of 100 online (`docs/quality.md:113`). The list is at most 5 shops per section (`docs/quality.md:144`). |
| AG8 | Published accuracy, the budget notice and the cost ledger serve the builder's standards more than a shopper's need (reviewers' judgment). | VL2, VL4; VL1 for the results footer only | Measured: 0 of 48 compared sites publish cost or accuracy (`research/competitors/README.md:25-26`). VL2 did not see where the site shows these. |
| AG9 | The material that needs no search (the Amazon blocklist, the chain list, the retailer research) is the durable asset; static pages or published data are the fallback product. | VL2, VL4 | Measured: 4 of 26 list sites recommend an Amazon-owned company (`research/amazon-alternatives.md:55-63`). |
| AG10 | Every tool in this field that still runs has someone paying for it; the site has a budget cap and no revenue, so it can still end for lack of users. | VL2 only (pattern PT1), unopposed | `research/competitors/README.md:32-40`. VL2 adds that a row of closed attempts is weak evidence of an unmet need. |
| AG11 | Do not stop the whole project now. | All four | Fixed cost is zero (`docs/feasibility-overview.md:7`). VL4 adds that stopping the search product is likely right; the others make that conditional. |

### Disagreements

| ID | Question | Sides | Which side the evidence favors |
|---|---|---|---|
| DG1 | What should the product lead with? | VL1, VL3: online, the part that measures well. VL3 also offers dropping the nearby promise outright (its change CH-10). VL2: the opposite, narrow to independent shops nearby, since online competes with typing a store name and "no Amazon" is invisible on a map. | Neither fully. Accuracy favors online. A promise about independents runs against one measured figure: 5 of 22 independent shops on the short list found (measured, `docs/quality.md:17`; a small sample, and VL3 notes the row's total does not match the same file's headline recall). VL2 did not see it. No data answers VL2's point that online has the weaker reason to exist. Rows R2 and R3 decide. |
| DG2 | Is "never Amazon" delivered? | VL1: yes, removed twice by code. VL3: unmeasured. | VL3. The filter passes 91 test cases (`docs/STATUS.md:9`), which shows it removes what is on the list, not that the list is complete against real results. VL3's proposed script over saved responses would find nothing by construction: the saved results have already passed the same list (`about.html:29`). Only a hand read can count it (row R1). |
| DG3 | What should the hand comparison be? | VL2: Google Maps and one list article, 3 zip codes, top 5, count independents, three people who are not the builder pick the more useful first choice. VL4: a maps app, a general search engine and a local-stock finder, the 20 graded searches, top 10, graded blind, with a stop bar. | A mix (row R3). VL4's blind grading reuses the existing grades. VL2's independent count and human pick measure what the grades cannot. VL4's stop bar treats a tie as a loss; with online at 98.4% a tie is the likely online result (lead's projection), so the bar needs a stated gap. |
| DG4 | Change the ethics claim now or after a count? | VL3 (which did not see the headline): stop implying ethics decides the order; it projected under 10% of results with such data. VL1, VL4: after a count. | Now. The count exists in bounded form (agreement AG1: 7% to 13% of results have a score other than 0.5, so VL3's projection is at the edge of the measured range), and VL4's bar for the change was fewer than 1 in 5. VL1 also asked for the top-3 order count, which is still open (row R1); it can soften the new wording later but cannot rescue "ranked by" as the lead claim. |
| DG5 | Do the Amazon plan phases come next? | Current priorities: Phases B, C, D (`docs/STATUS.md:52-54`). VL4: pause B; it changes the reasons shown on seven retailers in about 9% of result rows (105 of 1,147; VL4's sum from `docs/plans/amazon-alternatives-in-ranking.md:12`), and the plan says it does not help find a better shop (`:14`). VL2: the method marks well-known alternatives (Etsy, Target, Patagonia) `caution` and partly measures how well documented a company is. | VL4 on order: pause, not cancel. VL2's risk is a judgment with no shopper data; row R2 can test it. |
| DG6 | Should cost stay in the results footer? | VL1: move cost and "model tokens" to About, unless the operator wants cost shown on principle. VL3: the open ledger is a kept promise if the footer says "estimate" ($0.020 of about $0.023 is a price-list estimate, `docs/costs.md:31`). | A values call for the operator (decision VQ5 in section 5). |
| DG7 | How wrong is the nearby list? | VL1: 62 to 64% good, from the About page data (`src/quality.json:8-11`, dated 2026-09-26). VL3: 70.9% and 71.0% of judged rows on 2026-09-29, or 63% to 64% of all rows shown (VL3's arithmetic). | Not settled. The two differ by date, by which rows are counted, or both. Row R8 checks before the About figure changes. |

## 3. Recommended changes, smallest to largest

Sizes run test (no change to the site), wording, style, screen, feature, pivot. "Agent can do" means it fits the brief's wording and small style changes, to wait on the branch `claude/value-prop-quick-wins` for the operator. Nothing here has been built or run (see "What was not done"). Effort is the lead's estimate.

| ID | Change | Size | Evidence | Effort | Risk | Cheapest test | Who |
|---|---|---|---|---|---|---|---|
| R1 | Two checks on saved results: (a) a script that gives the exact share of results with an ethics or environment score other than 0.5, and the number of searches whose top 3 changes with both weights at zero; (b) a hand read of 50 shown results for Amazon-owned names missing from the blocklist and for sellers that fulfill through Amazon. | Test | AG1, DG2; VL3 changes CH-2 and CH-3; VL1 change C2 | (a) an hour or two; (b) half a day of page reading | None | The counts are the test | Agent can do: (a) in a session allowed to run scripts, (b) with a browser |
| R2 | Five people who avoid Amazon each find two products with the site and with their usual tool. Record what they do. Include one result set with a well-known retailer marked with a concern. | Test | AG5; unknown UK1 | A day of the operator's time | Five people is a signal, not a rate | It is the test | Operator decides (VQ2) |
| R3 | Hand comparison: the 20 graded searches on a maps app, a general search engine with Amazon excluded, and a chat assistant. First 10 results each, pooled with one nottheriver run, shuffled, graded blind for sells it, exists, independent or chain, and Amazon-owned. Three people who are not the builder pick the first choice they would visit. | Test | AG6, DG3 | About 600 rows to grade (3 tools, 20 searches, 10 results; lead's arithmetic): a few days | A saved September run against live results counts closures against the site only; check existence for all rows on the same day, or spend a fresh run (about 80 Brave calls, `docs/STATUS.md:62`) | It is the test. Bar set before grading, with a stated gap; a tie alone is not a loss | Operator decides (VQ1); an agent can grade, a person runs the searches |
| R4 | Fix the About typo (", Like a certification"); set the page title to the site name instead of "Search". | Wording | `about.html:41`, `index.html:7` | Minutes | None | Read-through | Agent can do |
| R5 | One new line under the headline saying what to type and what comes back, an example in the product box, "US only". Write it to match the headline R10 settles on, not the About opening, which repeats the claims in question. | Wording | `index.html:25-39`; VL1 stall list, item S1 (blank first screen) | Under an hour | Longer first screen at 360 px wide | Show old and new to five people; ask what they will get | Agent can do, after R10 |
| R6 | Privacy line under the zip field, in the accurate form: the zip stays in the browser, and the search service learns the zip area. | Wording | `about.html:48`; VL3 change CH-7 | Under an hour | A shorter line would overstate | Five people: "who learns where you are?" | Agent can do |
| R7 | Replace the weights line ("Ranked by relevance 0.25, ethics 0.30...") with a sentence; use one set of names for the four parts in both places. | Wording | `src/render.ts:246-255`, `:91-96`. `about.html:33` says the weights are listed above results, so About changes too | 1 to 2 hours with tests | Departs from a recorded default (`docs/STATUS.md:158`) | Five people: "why is result 1 above result 2?" | Agent can do; operator approves the sentence |
| R8 | Bring the About quality figures up to the 2026-09-29 run, after checking which rows each figure counts (DG7). | Wording | `src/quality.json:3`; `docs/quality.md:99-100` | 1 to 2 hours; `docs/STATUS.md:165` names the script that writes the file | The nearby figure could rise to 71% only by leaving out unjudged rows; say which rows are counted | The figures match the run's `report.json` | Agent can do |
| R9 | Coverage note in shopper words: the list is partial, with a link out to a map search for the product near the city. Drop "Brave Search's index". | Wording | `index.html:56`; AG7 | Under an hour | "About a third" must read as a third of a short comparison list | None needed | Agent can do |
| R10 | Rewrite the headline to what is measured: drop "ranked by how they treat people and the planet" and say the site flags known labor and environmental findings. | Wording | AG1, DG4; `index.html:25`, `about.html:25` | Minutes; the words are the operator's | Gives up the line that sets the site apart on paper. The old line can return if the record grows | In R2, ask each person what they expect after reading the new headline | Operator decides (VQ3) |
| R11 | Results footer: mark the cost as an estimate and drop "model tokens", or move the line to About. | Wording | DG6; `src/render.ts:371-376` | Under an hour | Moving it reverses an open-cost stance | None | Operator decides (VQ5) |
| R12 | Replace "How disputes are reviewed and resolved: TBD" with a process, or remove the promise until one exists. | Wording | `about.html:44`; raised by VL1, VL3 and VL4; already under "Decisions needed" (`docs/STATUS.md:97`) | The decision is the work | A link with no process behind it (VL3) | File one test dispute and time it to a decision | Operator decides |
| R13 | Rename the "Score" sort to "Best match"; hide "Has certification" when no result has one. | Style | `index.html:47-53`; VL1 stall list, items S7 and S8 | 1 to 2 hours | None found | Count how many of the 20 graded searches would show the filter | Agent can do |
| R14 | Show the "sells it" level on each nearby row ("likely sells it", "may sell it, call first"). Second step: fold the "may" rows. | Screen | AG4 | Label: hours. Fold: 1 to 2 days | Fold: 87 of 201 judged-good rows go behind it, and "likely" rows are about 3 a search (VL3's arithmetic), likely fewer in rural zips | Re-cut the saved 2026-09-29 grades: precision of "likely" rows, searches with fewer than 3, which good independents fold | Label: agent can do. Fold: operator decides (VQ4) |
| R15 | Lead each result with what a shopper can see is different: the sourced chain-or-independent badge and distance, with ethics detail one tap away and three plain states (has certifications, has findings, nothing on record). | Screen | VL2 row DF3 (0 of 48 compared sites show a sourced chain flag) and change CH4 | 1 to 2 days | Rests on VL2's judgment of what shoppers notice | In R2, ask which shop each person would pick and why | Operator decides |
| R16 | "Check a shop" box: a shop name or web address in, its record out (Amazon-owned or not, chain, certifications, findings). Runs in the browser from the data files, no search cost. | Screen | VL4 shape S1 (the record over any search); `docs/STATUS.md:9`, `:13`, `:35` | Days | Answers "nothing on file" most of the time if few shops have a record | Share of distinct shops in the saved 60-search responses with any record, before and after the Phase B import | Operator decides (VQ6) |
| R17 | Give each row something to do: address as a directions link, phone and hours where the data has them, the product page for online rows. | Feature | AG3. Overture Places (a free place dataset) has a phone number for 82 of 82 found shops (measured, `docs/open-place-coverage.md:49`); the site's saved nearby results have no phone or hours field (one saved response read by the lead); whether Brave's place results carry them upstream is not recorded | Days; unknown until the data is checked | A stale phone or hours costs trust | Check Brave's place result fields in the Worker code; count matches of saved nearby rows to Overture by name and address | Operator decides |
| R18 | When the search budget is spent, hand the shopper to their own search engine with the product filled in and Amazon excluded. | Feature | VL4 change CH3; the budget notice is not shown to work (VL3 row P16) | A day | Whether search engines accept the exclusion was not checked | Build the link by hand for 5 products | Operator decides |
| R19 | Three static guide pages from the research, in categories with no established finder (books already have one, `research/competitors/search-tools.md:91`). Each shop sourced, with what was not checked. | Feature | AG9; 54 retailer files and 26 list sites (`docs/STATUS.md:24`). VL4 calls this the cheap first step toward R16 and R23 | Days, plus the operator's read of every claim | A crowded field; 21 of 25 `acceptable` retailers were never checked clean (measured, `research/amazon-alternatives.md:111`) | A blind grader opens each listed shop (VL4's bar: 9 in 10 sell the category); five people compare a page with an existing list site | Operator decides (VQ6); reopens ruling Q4 (Phase D not yet) |
| R20 | Add known chain stores from open place data by brand name, with a per-chain "sells this category" table. | Feature | VL3 change CH-4; 60 of 64 chain shops on the short list are in Overture Places (measured, `docs/open-place-coverage.md:36`). Differs from the two open-data ideas already tried, which admitted shops by type | Days | Helps chains, not independents | Count missed short-list shops that match a listed chain in the existing coverage results | Operator decides, after R3 |
| R21 | Narrow to categories with a published roll of independent shops (toys, bikes, pharmacies and others), one metro area first. | Pivot | VL2 change CH2; 9 category trade bodies, 7 with a locator (`research/sites/ilsr-org.md:63-78`). Nobody has opened the locators or read their terms | Weeks | The site finds independents worst today (DG1); works only as a hand-built table | Open each locator, check reuse terms, build one category for one metro by hand, rerun R3 for it | Operator decides, after R3 |
| R22 | Drop the nearby promise: a non-Amazon online shop finder, zip optional, with nearby as "shops worth a call" or a curated list. | Pivot | VL3 change CH-10; VL1 change C6. Opposes R21 (DG1) | Weeks | Gives up "near you", which may be why a person avoiding Amazon came (VL1) | R14's re-cut: if fewer than half the 20 searches keep 3 "likely" shops, filtering will not rescue nearby (VL3) | Operator decides, after R3 |
| R23 | Retire paid search and publish the record: data files, guide pages, later a browser extension that marks Amazon-owned results on the shopper's own search page. | Pivot | AG9; VL4 shape S1, second form; VL2 change CH9. Three extensions in this field show 545, 27 and 8 users (measured, `research/sites/themarkup-org.md:24`, `research/competitors/search-tools.md:249-255`, `:272-274`; the first two are Firefox-only counts, so totals are likely higher), and one general extension is live and maintained | Weeks | Low reach | VL4's bar: after the import, 1 in 3 shop results on a search engine's first page carries a record; under 1 in 10, stay a lookup page | Operator decides, after R3 |
| R24 | Reuse first: thrift, used, library and tool-library places near the zip, from open map data, before any new purchase. | Pivot | VL4 shape S3; the operator's own idea (`docs/ideas.md:11`) | Weeks | Open place data found 101 of 300 rows at their address (measured, `docs/STATUS.md:38`) | A blind grader checks the 5 nearest per zip and kind (VL4's bar: 8 in 10 exist and match) | Operator decides |
| R25 | Stop being a shopping tool: publish blind-graded accuracy audits of the shopping tools that exist. | Pivot | VL4 shape S4; none of 48 compared sites publishes accuracy (`research/competitors/README.md:26`) | Weeks | No demand evidence for this either (VL4) | R3's table doubles as the first report | Operator decides |
| R26 | Stop and archive: a dated notice, search turned off, keys revoked, data and evidence left public. | Pivot | VL4's stopping case | A day | Closes a product no shopper has yet tried | R3 misses its bar and fewer than 2 of 5 people in R2 would use the site; for the other forms, VL4's guide-page check (R19) | Operator decides, after R2 and R3 |

Left out as fixes that do not change the offer: the chain badge counts (VL3 change CH-8; `docs/STATUS.md:36` records three counts corrected on 2026-10-01 and REI's taken from another page), proximity sorting past 25 miles in rural zips (VL3 change CH-9), sending book searches to Bookshop.org (VL2 change CH8), and adding the precision check's limit to the "local data is the real lever" line in `docs/feasibility-overview.md` (VL4 change CH6). Also left out: showing a price on online rows (VL1 change C8, which VL1 itself rates low to medium because a stale price costs trust). VL1's change C12 (narrow to "an Amazon-free shop finder" if the counts come back thin) is covered by R10 and R22.

### Recommendations that pull against each other

| ID | Tension | Resolution |
|---|---|---|
| TN1 | R5 and R6 add words to the first screen; R11 may remove words from the results page. | Add what a shopper needs before searching; trim what only the builder needs. |
| TN2 | R14's fold hides less certain nearby shops; the operator declined a stricter classifier (the model step that judges whether a shop sells the product) that would have dropped 12 of 72 good shops (measured, `docs/quality.md:130`). | A fold keeps the shops one tap away. If the re-cut shows most good independents fold, label only. |
| TN3 | R16 and R19 make the Phase B import more valuable; this review pauses Phase B. | Pause, not cancel. Phase B resumes if the search product passes R3 or R16's coverage count is high enough to justify the box. |
| TN4 | R21 (independents nearby) and R22 (drop nearby) are opposite pivots. | Neither before R2 and R3. R10's headline rewrite is safe under both. |

## 4. What nobody could answer from the repo

| ID | Question | How to find out |
|---|---|---|
| UK1 | Would a person who avoids Amazon use this instead of a maps app or typing a store name? | R2. No answer is assumed here. |
| UK2 | How does the site compare with the free substitutes on the same searches? | R3. |
| UK3 | Does the order of results change without the ethics and environment scores? (How many results carry such data is now bounded, AG1.) | R1 (a). |
| UK4 | Does any Amazon-owned or Amazon-fulfilled seller reach the results? | R1 (b). |
| UK5 | What do Brave's place results carry that the site drops (phone, hours)? The site's own response has neither. | Read the Brave client in the Worker code or Brave's API reference. |
| UK6 | Do well-known alternatives marked with a concern make a shopper give up? | R2, with the flagged result set. |
| UK7 | How would shoppers find the site, and who would pay to keep it running (finding AG10, the who-pays pattern)? | Not answerable from the repo. Static pages (R19) are the only proposed route to being found through a search engine; a 30-day read of search impressions would test it (VL2 change CH5). |
| UK8 | Is any measured rate still true? No reviewer saw a real results page; the results screenshot shows test data. | A graded rerun costs about 80 Brave calls and waits on the budget (`docs/STATUS.md:62`). |
| UK9 | Can a per-key Brave quota be set, so the budget notice works? | Unverified (`docs/feasibility-overview.md:34`); check Brave's account settings. |
| UK10 | What changed after 2026-10-09, the latest dated entry the reviewers saw? | The operator knows; the deferred budget rulings were due for another look on or after 2026-10-14 (`docs/STATUS.md:91`). |

## 5. Decisions for the operator

| ID | Decision | Recommendation |
|---|---|---|
| VQ1 | Put the two checks on saved results (R1) and the hand comparison (R3) ahead of Amazon plan Phase B, with R3's bar and gap set before grading? | Yes. Of the tests, R1 first: it costs no search calls, finishes the ethics count and gives the first sample of the Amazon leak rate. The headline rewrite (VQ3) does not wait on it. |
| VQ2 | Recruit five people for R2, and does showing them the site fit the no-public-link ruling? | Yes; a supervised session with five people is not a public link (lead's reading, for the operator to confirm). |
| VQ3 | Rewrite the headline (R10) now? | Yes. 87% to 93% of results at the default scores is enough to drop "ranked by how they treat people and the planet" until the record grows. |
| VQ4 | Fold "may sell it" nearby shops (R14), or only label them? | Label now; decide the fold from the re-cut. |
| VQ5 | Results footer (R11): keep the cost line, or move it to About? | Lead's judgment: keep it, marked as an estimate, without "model tokens". |
| VQ6 | Open an outlet for the record that costs nothing per search: guide pages (R19), the "check a shop" box (R16), both or neither? | Run R16's coverage count (a script over saved files). Three guide pages first either way; build the box only if the count shows a record for a useful share of shops. This is the one feature recommended ahead of the comparison (R3): the pages are the fallback under every outcome of R3 and make no search calls. It still needs the operator's read of every claim and reopens ruling Q4 (Phase D not yet). |
| VQ7 | May static pages go public before the Brave payment ruling, since they make no Brave calls? | Yes, if the pages carry no search box. |
| VQ8 | Approve the agent-doable rows (R4 to R9, R13, R14's label) for a later session? | Yes; each is small and reversible. R5 waits on R10; R7's sentence needs the operator's wording. |

## What was not done

- **The quick-wins branch was not built.** This session could not run `git add`, `git fetch` or scripts (each needed an approval nobody could give), so no branch, commit or push exists. Of R1, only the bounded count in AG1 was run, by text search.
- **No web searches ran.** Three reviewers needed none; VL2's three attempts were denied. Every outside fact comes from the research files and their read dates.
- **Design patterns:** no recommended change was checked against `src/styles.css`, because none was built.

## Review record

One fresh reviewer, given only this file and the four lens files, attacked the first version: 20 findings. 18 applied in full; 2 applied in part. Finding 18's rejected part questioned four citations the reviewer was not allowed to open (`docs/STATUS.md:36`, `:158`, `:165`, `about.html:33`); the lead had read those lines. Finding 20 (writing rules) is applied except that two disagreement cells are still longer than a line or two.

After that rewrite the lead found one more fault itself: a proposed script to count Amazon leaks would have found nothing, because the saved results are already filtered. That count is now a hand read (R1), and the ethics count was run by text search (AG1), which moved the headline rewrite to first place.

A second fresh reviewer then made a narrow check of the rewrite: 8 findings, 7 applied, 1 rejected (it read "54 findings" and "54 retailer files" as a conflict; `docs/STATUS.md:24` and `:52` give both). Its arithmetic check of the AG1 count found no error.

The `copy-review` skill failed to load in this session; the two reviewers' writing-rules checks and the lead's read-through stand in for it.

The largest change from the attack: the first version put the hand comparison first. The objection held up: the comparison tests the axis already measured weakest, and its stop bar counted a tie as a loss. The order is now the headline rewrite, the two checks on saved results, five shoppers, then the comparison.
