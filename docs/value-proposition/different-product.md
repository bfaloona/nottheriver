# The case for a different product

Blind review, 2026-11-11. Angle: product shapes other than today's, and the case for stopping.

## Verdict

Do not stop yet, and do not start Amazon plan Phase B (the import of 54 findings) either. Run one free head-to-head test first (KT1, below). The files show a well-measured search engine with no shopper use recorded in the files read, whose paid part (finding shops) is its weakest part and whose strong parts (the Amazon blocklist, the sourced shop record, the grading method) need no search engine at all. The strongest different product is S1 (the record laid over the search the shopper already uses), with S2 (a static guide) as its cheap first step. If KT1 fails and nobody asks for S1 or S2, stopping is the right call and the data is worth publishing as an archive.

All judgments about what a shopper would think or do are this reviewer's own, marked "reviewer's judgment". No shopper was asked.

## Files read

`docs/STATUS.md`, `docs/ideas.md`, `docs/feasibility-overview.md`, `README.md`, `research/competitors/README.md`, and the six files in `docs/plans/`. Nothing else in the repo, and no web pages: every outside fact below is marked "not checked". Line numbers are from the files as read today.

## Where the current plan is wrong

| ID | Claim | Evidence | Kind of figure |
|---|---|---|---|
| W1 | The next three priorities do not help a shopper find a better shop. The plan says so itself. | `docs/plans/amazon-alternatives-in-ranking.md:14`; priorities 2 to 4 are all that plan, with the only discovery piece (Phase D, suggested shops) last: `docs/STATUS.md:52-54` | Text |
| W2 | The import changes the reasons shown on seven retailers that fill about 9% of result rows (105 of 1,147; the sum 41+21+14+13+8+6+2 is this reviewer's arithmetic). No recommended shop has appeared in any saved response, because the search API never returns them. | `docs/plans/amazon-alternatives-in-ranking.md:12` and `:20` | Measured (eval60, 60 searches) |
| W3 | Finding shops is the weak part and the paid part. The site finds 28 and 30 of 86 good nearby shops and 31 of 100 good online shops that another search engine found. Brave (the paid search API) is $0.020 of the roughly $0.023 per search. | Recall: `docs/plans/amazon-alternatives-in-ranking.md:79`, baseline described at `docs/plans/about-quality-summary.md:21`. Cost: `docs/feasibility-overview.md:7-8` | Recall measured (eval20-0925, the 20 graded searches run twice on 2026-09-25/26). Cost labeled in a file not read; the nearest measured figure is $0.416 for a 20-search run, `docs/plans/store-types.md:65` |
| W4 | "Ranked by ethical practice" (the README's first sentence) rests on very little live data: 4 findings and 28 certifications. A shop with no record sits at a neutral 0.5, so most rows are likely ordered by relevance and distance alone. | `README.md:3`; `docs/STATUS.md:13` and `:27`; baseline 0.5 at `docs/plans/amazon-alternatives-in-ranking.md:103` | Counts measured; "most rows" is this reviewer's inference, not measured |
| W5 | No shopper has been observed. No public link is allowed, and no searches-per-user figure exists. | `docs/STATUS.md:91`; `docs/feasibility-overview.md:33` | Text |
| W6 | The four features with "no precedent" (published accuracy, cost ledger, sourced chain badge, honest budget limits) likely serve a builder's standards more than a shopper's need. The competitor research itself says no user expectation exists for one of them, and that nobody has tested whether shoppers accept losing Amazon's stock. | `research/competitors/README.md:8`, `:22`, `:30` | Text; the first sentence is reviewer's judgment |
| W7 | The feasibility overview still calls open place data "the real lever" without the limit the later precision check found: 6 of 300 tagged shops sell the product (2.0%) and 101 of 300 exist at the address. The files blame the category rule more than the data, and say open data does not replace Brave's local search "without a narrower rule and another signal". | `docs/feasibility-overview.md:11` against `:28`; `docs/STATUS.md:38` and `:91` | Measured (300 rows near the zips of the 20 graded searches; the two files disagree on the zip count, 14 against 20) |
| W8 | Several build-then-measure cycles ended in "no change" or removal: the shop-breadth field (built, measured, removed), the stronger classifier (not shipped), classifier-judged local ranking (no live change). The measuring is sound. The pattern is tuning a product with no request for it recorded in the files read. | `docs/STATUS.md:29`, `:78`, `:89` | Text; the last sentence is reviewer's judgment |
| W9 | The latest dated entry in the files read is 2026-10-09, and the deferred budget rulings were due for another look on or after 2026-10-14. Today is 2026-11-11. | `docs/STATUS.md:91` | Text; later work may exist in files not read |

Reviewer's judgment on the shopper: a person avoiding Amazon already has a search engine and a maps app, both free. The site's own baseline of good shops was built from another search engine, and the site finds about 3 in 10 of them (W3); how those tools compare on precision and speed is not measured (the site's median search is 2.9 s, `docs/STATUS.md:34`), which is what KT1 is for. What they lack is a trustworthy answer to "is this shop Amazon's, is it a chain, and what is on record about it?" The project owns that answer and spends its money on the other question.

## The shapes at a glance

| ID | Shape | Input | What the shopper gets | Cost per use | Full pivot? |
|---|---|---|---|---|---|
| Today | Product search | Product and zip | Ranked shops, nearby and online | About $0.023 (see W3) | |
| S1 | The record over any search | A shop name or web address, or the search page the shopper is already on | Amazon-owned or not, chain badge, certifications, dated concerns, each sourced and disputable | Zero | No (new product, same shopper) |
| S2 | Static guide | A category, by browsing | A short sourced page: shops others recommend, what is on record, what was not checked | Zero | No |
| S3 | Reuse first, nearby | Zip and a kind of thing | Tool libraries, public libraries, thrift and used shops near the zip, before any new purchase | Zero if open map data carries it | No |
| S4 | Accuracy audits of shopping tools | A tool to audit | A published, blind-graded score for how often a shopping tool is right | Grader time | Yes |
| STOP | Stop and archive | | The data, method and results left public and dated | Zero | |

## S1: the record over any search

The shopper keeps their own search engine. nottheriver supplies what it alone has: the blocklist, the chain list, the certifications and the dated findings.

Two forms, smallest first:

- A "check a shop" box on the site: type a shop name or paste a web address, get its record. Runs in the browser from the data files.
- A browser extension that hides Amazon-owned results on search pages and puts the same badges beside the rest. The competitor research found that most extensions run on Amazon's own pages (`research/competitors/README.md:22`); this one would run where the shopper searches.

| Question | Answer |
|---|---|
| Who it serves | A shopper who has found a shop and wants to know whose it is and what is on record. Reviewer's judgment: this is the more common moment than "where can I buy X", because the search engine already answered that. |
| What it would take | A lookup page (small). Then the extension: one content script per search engine, store listing, review. The record must grow far past seven retailers to be worth showing (see the test). |
| What it keeps | Blocklist (39 domain and 14 name entries, 91 fixtures), chain list (41 chains), 28 certifications, findings and the 54 researched retailer files, grouped concerns, dispute links, the sourcing rules, the About page (`docs/STATUS.md:9`, `:13`, `:24`, `:26`, `:35`). |
| What it drops | The Worker's search pipeline, Brave, the model calls, zips, distance groups, the map. Kept in the repo as a fallback or demo. |
| Reopens | Nothing ruled. It makes Amazon plan Phase B (the import) more valuable, since a record lookup is only as good as its rows. |
| Main risk | Coverage. If most shops a shopper meets have no record, the box answers "nothing on file" most of the time. |

Test in under a week, no Brave:

1. From the saved eval60 responses, list every distinct shop web address. Count how many carry any record today (blocklist, chain, certification, finding), and how many would after the Phase B import. This is a script over saved files.
2. Type the products of the 20 graded searches into a general search engine by hand, save the first page, and count results with a record.
3. Pass bar, set now: at least 1 in 3 first-page shop results carries a record after the import. Below 1 in 10, S1 is not worth an extension and stays a lookup page at most.

## S2: static guide

A handful of pages ("Books without Amazon", "Outdoor gear without Amazon"), built from the research: 54 retailer files and 26 list sites (`docs/STATUS.md:24`). This is Phase D (suggested shops) promoted from last priority to the whole product, with no live search behind it.

| Question | Answer |
|---|---|
| Who it serves | A shopper deciding where to shop in general, and anyone arriving from a search engine with "alternatives to Amazon for books". Reviewer's judgment: this is how a zero-budget site gets found at all. |
| What it would take | A page template and a build step from `research/index.json`; an operator read of every claim, which Phase B's sign-off gate already plans (`docs/plans/amazon-alternatives-in-ranking.md:56`). |
| What it keeps | The research, the findings, certifications, chain badge, dispute links, the "what was not checked" honesty. |
| What it drops | Zip, nearby shops, per-search cost. |
| Reopens | Operator ruling Q4 ("Build Phase D? Not yet", `docs/plans/amazon-alternatives-in-ranking.md:95`). The ruling's reasons were no relevance evidence and an untested category match. A static page needs neither: a person picks the category, and the precision check is a page read. The remaining reason stands and must be shown on the page: 21 of 25 "acceptable" shops were never checked clean (same file, `:25`). |
| Main risk | Crowded. 26 list sites already do this, and the competitor table counts 13 partial matches for a curated directory (`research/competitors/README.md:28`). The only edge is sources, dates, shown negatives and no affiliate links. Reviewer's judgment: that edge is real to a careful reader and invisible to a hurried one. |

Test in under a week, no Brave:

1. Build three category pages by hand from the research files.
2. Precision: a blind grader opens each listed shop and marks whether it sells the category. Pass bar: 9 in 10.
3. Usefulness: put a page and one of the existing list sites side by side in front of five people who avoid Amazon, recruited by the operator, and ask which they would use and why. A static page spends nothing on Brave, so the reason behind the no-public-link ruling (`docs/STATUS.md:91`) does not apply; the operator should confirm that reading. Pass bar: 3 of 5 pick the nottheriver page.

## S3: reuse first, nearby

The answer to "where do I buy it without Amazon" becomes "borrow it or buy it used, here". Source: the operator's own idea, not started (`docs/ideas.md:11`).

| Question | Answer |
|---|---|
| Who it serves | A shopper whose reason for avoiding Amazon is consumption itself. Reviewer's judgment: this is a smaller group than "avoid Amazon", and a better served one, because the result is a place and needs no stock check. |
| What it would take | A category-level local lookup (thrift shop, tool library, public library, repair shop) from open map data, served to the browser by zip. |
| What it keeps | Zips, distance groups, the map, the privacy design (zip stays in the browser), the open place data work. |
| What it drops | Product-level "sells it" judgments, the model, Brave, the ethics score. |
| Reopens | The open marketplace question (`docs/STATUS.md:96`) if listings from Facebook Marketplace or Craigslist are wanted; this shape works without them. |
| Why open data may fit here when it failed for product search | The 2.0% figure (W7) measured "does this shop sell this exact product". S3 asks only "is this a thrift shop". That is the question a map category answers. The second figure does carry over: 101 of 300 rows were found at their address, 20 were confirmed gone, and the other 179 are not broken out (`docs/STATUS.md:38`). |

Test in under a week, no Brave:

1. For the zips of the 20 graded searches, pull thrift, used, library and tool-library places from OpenStreetMap and Overture (the tag names were not checked here).
2. A blind grader checks the 5 nearest per zip and kind: does it exist, and is it that kind of place.
3. Pass bar: 8 in 10 exist and match, and at least 3 in 4 of those zips have 3 or more within the nearby distance (10 or 30 miles, `docs/STATUS.md:22`).

## S4, the full pivot: accuracy audits of shopping tools

Stop being a shopping tool. Point the grading method at the tools that exist. None of the 48 sites in the competitor research publishes how accurate it is (`research/competitors/README.md:26`).

| Question | Answer |
|---|---|
| Who it serves | People choosing an ethical-shopping or local-shop tool, writers who cover them, and the tools' own teams. A different audience from today's. |
| What it would take | A fixed public method (query set, blind grading, two runs, a correction path), a first report on three or four tools, and a way to handle a tool that objects. |
| What it keeps | The 60-search query set, the grade schema, blind second graders, the run-twice rule, the 86-shop and 100-shop baselines, the evidence index, the dispute idea (`docs/STATUS.md:19`, `:28`). |
| What it drops | The site as a product, the Worker, the blocklist as a live filter, the ranking. nottheriver becomes one row in its own report. |
| Reopens | Nothing ruled. It turns the dispute process (still undefined, `docs/STATUS.md:97`) from a gap into the core of the product. |
| Main risk | No shopper asked for it either (reviewer's judgment), and grading a tool that blocks automated reading needs a person at a browser. Whether the tools' terms allow it was not checked. |

Test in under a week, no Brave. This test is also KT1, the kill test for today's product:

1. Run the 20 graded searches by hand on a maps app, a general search engine with Amazon excluded, and one local-stock finder from the competitor list (hand use in a browser, no API calls).
2. Pool the first 10 results of each tool with the rows of one saved nottheriver run, shuffle them so the grader cannot see which tool a row came from, and grade with the existing schema. About 600 new rows (3 tools, 20 searches, 10 results; this reviewer's arithmetic).
3. Compare precision and good shops in the top 3 only. Do not compare recall: the existing baseline was built from another search engine (`docs/plans/about-quality-summary.md:21`), so it favors that engine by construction. For reference, the latest measured nottheriver figures are online precision 98.4%, nearby 70.9% and 71.0% (`docs/STATUS.md:3`).
4. Pass bar for S4: the scores differ enough between tools that a reader would choose differently (the operator sets the gap before grading; 10 points is a starting proposal).

## STOP: the case for stopping

Strongest form of the argument:

- No demand evidence exists in the files read (W5), after a build that reached 872 unit tests (`docs/STATUS.md:237`).
- The site finds about 3 in 10 of the good shops another search engine found (W3, the recall row).
- The money is blocked: any graded rerun waits on a Brave budget ruling, and a public link waits on a payment method and quota (`docs/STATUS.md:62-63`).
- The category has a high casualty rate: six of the sites researched are defunct or changed, one of which concluded operations in February 2026 (`research/competitors/README.md:49`).
- The one data source that could have removed the cost was measured at 2.0% for product search with the rule tried; a narrower rule is untested (W7, the open place data row).

| Question | Answer |
|---|---|
| Who it serves | The operator's time, and any later builder, who gets a clean, dated, sourced record and a method. |
| What it would take | One closing pass: a dated notice on the site and README, the Worker's search turned off, keys revoked, the data files and evidence left public under the existing AGPL license (`docs/STATUS.md:73`). |
| What it keeps | Everything as an archive: blocklist, chain list, findings, research, eval method and results. |
| Test (KT1, the kill test) | The S4 test above, read the other way. Pass bar set now: stop the search product if nottheriver's nearby top 3 is good no more often than the maps app's top 3 on the same 20 searches, and its online first page has no more good shops than the general search engine's. Add the S2 five-person check: if fewer than 2 of 5 would use any nottheriver form, stop all forms. |

Reviewer's judgment: stopping the search product is likely right; stopping the project is likely early, because S1 and S2 cost nothing to run and have not been tried.

## Ranked changes

Sizes: wording, screen, feature, pivot. Confidence is this reviewer's.

| ID | Change | Evidence | Size | Cheapest test | Confidence |
|---|---|---|---|---|---|
| CH1 | Put KT1 (the hand head-to-head against a maps app and a general search engine) at the top of the priority list, ahead of Amazon plan Phase B. | W1 (priorities do not help find a better shop), W3 (finding is the weak, paid part), W5 (no shopper observed): `docs/STATUS.md:52-54`, `docs/plans/amazon-alternatives-in-ranking.md:14` and `:79` | Wording (a reorder; the test is about 600 rows to grade, likely a few days, this reviewer's estimate) | The test is the change; done when the comparison table exists | High that it should run first; no view on the result |
| CH2 | Add a "check a shop" box (S1, first form): shop name or web address in, sourced record out, in the browser. | `docs/STATUS.md:9`, `:13`, `:35`; `research/competitors/README.md:22` | Screen | S1 step 1: share of saved eval60 shops with any record, before and after the import | Medium: depends on coverage |
| CH3 | When the search budget is spent or blocked, hand the shopper to their own search engine with the product filled in and Amazon excluded, and keep the shop check working. | Budget blocked: `docs/STATUS.md:62`; honest limits have no precedent: `research/competitors/README.md:30` | Feature | Build the link by hand for 5 products and confirm Amazon is absent from the first page (whether engines accept the exclusion list was not checked) | Medium |
| CH4 | Stop leading with "ranked by ethical practice" until the record is larger; lead with what is measured: never Amazon, and how often results are right. | `README.md:3` against `docs/STATUS.md:27` (4 live findings) | Wording | Count, over the saved eval60 rows, how many have an ethics or environment score other than the neutral 0.5; if under 1 in 5, the wording change stands | High |
| CH5 | Build three static guide pages (S2) and treat Phase D as first, not last. | `docs/plans/amazon-alternatives-in-ranking.md:20`, `:65`, `:95` | Feature | S2 steps 2 and 3 (9 in 10 sell the category; 3 of 5 people prefer it) | Medium: crowded field |
| CH6 | Add the precision check's limit ("not without a narrower rule and another signal") to the feasibility overview's "local data is the real lever" line. | `docs/feasibility-overview.md:11` against `:28`; `docs/STATUS.md:91` | Wording | None needed; the summary line lacks the qualifier the later rows carry | Medium |
| CH7 | Trial a reuse-first nearby section (S3). | `docs/ideas.md:11`; `docs/STATUS.md:38` | Feature | S3 test (8 in 10 exist and match; 3 in 4 zips have 3 or more) | Low to medium: existence data is weak |
| CH8 | Ship the record as a browser extension (S1, second form) and retire the paid search. | CH2's result; `research/competitors/README.md:22` | Pivot | Only after CH2 passes its 1-in-3 bar | Medium |
| CH9 | Pivot to accuracy audits of shopping tools (S4). | `research/competitors/README.md:26`; `docs/STATUS.md:19` | Pivot | KT1's table doubles as the first report | Low to medium: no demand evidence either |
| CH10 | Stop and archive (STOP). | W3 (finding is the weak, paid part), W5 (no shopper observed), `research/competitors/README.md:49` | Pivot | KT1 fails both bars and fewer than 2 of 5 people would use any form | Medium for the search product, low for the whole project |
