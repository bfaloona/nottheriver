# WF1 Sequence: coverage

Of 69 rows, 62 are handled as drawn, 5 are "partly" and 2 are described but not drawn.

| Status | Rows |
|---|---|
| Partly | IV-D5 (reorder results), IV-D7 (judge which shops are practical to reach), IV-D12 (dispute a concern), IV-D13 (dispute a certification, chain fact or score part), IV-F11 (keyboard and screen reader use) |
| Described, not drawn | IV-E12 (nearby shops from a curated directory), IV-E14 (weighing concerns by age) | Reasons are in the last table.

Frame names are the labels in `wireframe.html` (S1 to S11, plus S5b, S6b and S8b added in the fix round). Each state exists at 360 px and 1280 px with the same text. "Asked" means the "Asked at this step" panel of that frame.

## IV-B Questions

| Label | Where handled |
|---|---|
| IV-B1 | S1 Arriving: purpose line and Asked "What is this for?"; S10 "Before step 1" |
| IV-B2 | S2 Asking: note under the zip field (the four things made from the zip) and Asked "What is sent, and to whom?"; S1 door "What will you learn about me?" leads to S10 |
| IV-B3 | S3 Waiting: "about 3 seconds", the measured median and slowest, the four things in order |
| IV-B4 | S4 Results, nearby: step 4 counts, then shop 1 with miles and direction; "How far, nearest first" ruler. S6b Results, farther: the same for shops past the nearby limit |
| IV-B5 | S5 Results, online; S6 Thin or empty offers the online answer when nearby is zero; S6b names the online shop it does not list |
| IV-B6 | S4, S5, S5b, S6b: check 1 "Does it sell it?" with the level and its measured accuracy; S9 Go "Check first" |
| IV-B7 | S7 Shop opened: "Why ahead of the next shop?" box and the four parts; S5b Asked "Why is an online shop ahead of a nearby one?" |
| IV-B8 | S4, S5, S5b, S6b: check 3 "What is on its record?"; S7 parts 3 and 4 with sources; S8 for concerns |
| IV-B9 | S4, S5, S5b, S8: dashed "Fact, not scored: part of a chain"; S7 and S6b: not in the curated set, which does not prove it is independent |
| IV-B10 | S8 Concern and dispute: date, "How it was counted" on each concern, Asked "How bad is this?" |
| IV-B11 | S8: "Disputing concern 1, in order"; S8b Dispute, not searching, reached from the S1 door and from "Dispute something" in the top bar of every frame |
| IV-B12 | S4 Asked "How often is a nearby shop wrong?"; S6 "The site's limit"; S10 "How often is it wrong, and what does it miss?" |
| IV-B13 | S1 Asked (closed row); S10 "Why is there no Amazon, and what counts?" |
| IV-B14 | S2 Asked "What is kept, and for how long?" (open, short form); S9 Go "What is kept now that you are done"; S10 "What is kept?" full table |
| IV-B15 | Cost of one's own search: folded step 3 in every frame after a search ("Cost: about $0.023"), Asked "What did this search cost?" in S4, S5, S5b, S6, S6b, and S9. Who pays and paid placement: S10, S9, S3 Asked |
| IV-B16 | S6 Thin or empty: "Is it my wording, my location, or the site's limit? Try in this order" |
| IV-B17 | S3 Waiting: "If the wait ends badly" (failed, too many searches); S11 Budget spent with Asked "Is it broken, am I blocked, or is it out of money?" |
| IV-B18 | S9 Go: nearby shop (website, address, copy, own map app) and the online-shop box with "Open the shop's page" |

## IV-D Functions

| Label | Where handled |
|---|---|
| IV-D1 | S1 Arriving (product), S2 Asking (zip, Search) |
| IV-D2 | S2 Asking: three message boxes (zip not five digits, product empty, zip not known) |
| IV-D3 | S3 Waiting; the step-3 hint "about 3 seconds" shows on the path in S1 and S2 at both widths |
| IV-D4 | Nearby: S4, with address, miles, direction, website, sells-it level, score, record. More distant: S6b draws one in full and one as a row; S5b row 9 is the more distant shop of the first search. Online: S5. All kinds in one order: S5b |
| IV-D5 | Partly. Single-choice "Reorder by: score, distance, name" in S4, S5, S5b, S6b (distance not offered online). The rule for ordering by distance across kinds is stated in S5b. No frame shows a list after reordering |
| IV-D6 | Step 4 answers are nearby only and online only (S4, S5); "only shops with a certification" check box beside the reorder choices; S6 shows the narrowed-to-none message |
| IV-D7 | Partly. S4 ruler (full width = the nearby limit) and S6b ruler (full width = 100 miles, nearby limit marked), each with miles and compass direction in text; street address in check 2. Missing address, distance or coordinates: stated as rules in S4 and S9, not drawn on an example shop |
| IV-D8 | S9 Go: "Open the shop's website" (nearby) and "Open the shop's page" (online), each with "the shop is not told you came from here"; website links in check 2 of S4, S5, S5b, S6b |
| IV-D9 | S7 Shop opened: score and four parts for a nearby shop and, in a second box, for an online shop; S6b: the four parts for a more distant shop. Any shop opens by its name in the lists |
| IV-D10 | S7 (certification and retailer-association fact "open source"), S8 ("Read the source" on each concern, "open source" on the chain fact) |
| IV-D11 | S8: all 3 concerns listed with count and year range; reached from "read all 3" in S5 and S5b, and from "read it and its source, or dispute it" on the one-concern row in S4 and S5b |
| IV-D12 | Partly. From a search: S8 "Dispute this" and the four-step path. Without a search: S8b, five steps. Both state the GitHub account, that filing is public, and that no response time is promised. Not possible: filing without a GitHub account; looking a shop up by name |
| IV-D13 | Partly. S7 and S6b: "dispute" beside every score part, the total, each certification and fact; S8: "dispute" on the chain fact. Same limits as IV-D12 |
| IV-D14 | S5 Asked "Why this order?"; S7 Asked "What raises and lowers each part?"; S10 "How does the order work?" |
| IV-D15 | S10 "Why is there no Amazon, and what counts?" with link to the exclusion set; S1 Asked row |
| IV-D16 | S2 note and Asked (what is sent, including the rural-urban category, and what is kept); S10 "What is sent" sentence and table, "What is kept" table |
| IV-D17 | S10 accuracy table with "Method" and "Raw evidence"; S4 Asked; S6 "The site's limit" |
| IV-D18 | Folded step 3 "Cost" link and Asked "What did this search cost?" in S4, S5, S5b, S6 (a search that found nothing nearby), S6b; S9 "What this search cost"; all with "Public cost ledger". A search that did not finish shows no cost (S3 Asked, S10) |
| IV-D19 | Footer of every frame; S10 "About the project" |
| IV-D20 | "change" on folded steps 1 and 2 in every frame from S2 on; S9 "Search for something else", "Same product, different zip", with the note on when the zip is typed again |
| IV-D21 | Footer of every frame; S10 "Data credits" |

## IV-E Headed towards

| Label | Where it would go |
|---|---|
| IV-E1 | S8 already shows a shop with 3 concerns, count and year range; S5 and S5b rows show the summary "3 concerns, 2019 to 2024" |
| IV-E2 | S8: "How it was counted" is drawn on each concern; the research record link is a planned note under the concerns |
| IV-E3 | S5: planned note below the last scored shop, in a separate box headed as not scored. Would appear the same way in S4, S5b and S6b |
| IV-E4 | S7: planned note; a row like the retailer association fact, or a certification row if it gets a score effect |
| IV-E5 | S7: planned note; a "not scored" line on the shop and a fourth reorder choice |
| IV-E6 | S3: planned note; the four-item list marks the current one |
| IV-E7 | S11 Budget spent (this designer's proposed wording; no date, period or offer invented; open points listed in the frame) |
| IV-E8 | S8: planned note (state under each concern's date, response time in dispute step 4). S8b: planned note (a record per shop replaces "find what is said"); S8b Asked says no dispute state is shown today |
| IV-E9 | S6: planned note; a further answer to step 4 "How soon". Not drawn elsewhere |
| IV-E10 | S7: planned note if it enters the score (a fifth part). If it only changes what is found, nothing in the design changes |
| IV-E11 | S2: planned note under the "zip is not known here" message |
| IV-E12 | Not drawn. Effect: check 1 for nearby shops in S4 would read as a lookup with its source, and the Brave Search row in the S2 and S10 "what is sent" tables would lose the zip-area center |
| IV-E13 | S10: planned note under "What did my search cost?", only if the totals are made public |
| IV-E14 | Not handled beyond one sentence in S8 ("Age does not change how a concern counts"), which would change. Reason: deferred, and no rule exists to draw |

## IV-F Rules

| Label | Where handled |
|---|---|
| IV-F1 | S2: note under the zip field; from S3 on the folded step 2 shows city and state, never the zip; no location or street address is asked anywhere. S9 note: the place is held by the open page only, and the zip is typed again after a reload (this designer's reading of "never recalled") |
| IV-F2 | S2 and S10 state that the page fetches from no other party. Two outside parties appear only when a visitor chooses them: GitHub (S8, S8b) and the visitor's own map app (S9). Each is named with what it learns, and each has an "Operator decision needed" note in the frame marking it as a cost the operator has to accept |
| IV-F3 | No Amazon brand appears. The company is named only where the purpose or the exclusion is explained: S1 purpose line, S1 "What is this for?" answer, S1 and S10 exclusion question and answer |
| IV-F4 | S7: every part explained for a nearby and an online shop; S6b for a more distant shop; certifications with source and date. S8: each concern with source and what it cost |
| IV-F5 | S8 "Dispute this" on every concern; S4 and S5b one-concern row links to read or dispute it; S7 and S6b "dispute" on every part, the total, certifications and facts; S8 on the chain fact |
| IV-F6 | S8: claims in quotation marks as the source's wording, with source and date; "This site adds no grade"; Asked "How bad is this?" declines a verdict |
| IV-F7 | S4, S5, S5b: "nothing found", "No concerns found"; S6b: "not a mark against it" and Asked "Why is the score low when nothing bad was found?"; S7: "starts at the middle (unknown, not bad)", "does not prove it is independent" |
| IV-F8 | Chain fact is a dashed box labeled "Fact, not scored" in S4, S5, S5b, S7, S8; certifications are solid thin boxes labeled "Certification"; concerns have a thick left edge and are labeled "Concern" |
| IV-F9 | S5 planned note: separate box below scored shops, never in the numbered order |
| IV-F10 | Every state has a 360 px frame; all content is one column there. Ruler labels now sit above their bars and wrap. Reasoned from the markup, not observed in a browser |
| IV-F11 | Partly. Behavior is stated in the box at the top of the wireframe (order, focus on step change, announcements, question rows, single-choice groups, ruler text, motion) and in S3. A static wireframe cannot prove keyboard or screen-reader use |
| IV-F12 | S6 and S6b (thin), check 1 in S4, S5, S5b, S6b (guess stated with measured accuracy), S3 (failed; the slowest search stated as measured, not as a ceiling), S11 (budget spent), S10 (accuracy table) |
| IV-F13 | All distances in miles in S4, S5b, S6, S6b, S7, S9 |
| IV-F14 | S7 note: no excerpts shown. Only the matched listing title appears (S5, S7, S9), which is a field in IV-C4. Judgment of this designer: a listing title could in principle carry an excluded brand name, so the build must filter it |
| IV-F15 | S9 and S10 state no paid placement, affiliate links or advertising; no frame has a slot for any |
| IV-F16 | Footer of every frame; S10 "Data credits" |

## Not handled or only partly handled

| Item | Reason |
|---|---|
| IV-D5 Reorder | Controls and the cross-kind distance rule are drawn; a list after reordering is not. Judgment of this designer: the reordered list has the same rows in another order |
| IV-D12, IV-D13 Dispute | No intake exists without a GitHub account (IV-D12), and no way exists to look up what is said about a shop without a search returning it. S8 and S8b say both plainly |
| IV-F11 Keyboard and screen reader | Stated, not verifiable in a static wireframe |
| IV-E12 (nearby shops from a curated directory), IV-E14 (weighing concerns by age) | Described above, not drawn |
| IV-D7: missing address, distance or coordinates on a nearby shop | Written as rules in S4 and S9; no example shop with a missing fact is drawn |
| A shop reordered or narrowed view in S6b and S5b | Controls only |
| The 10 rural-urban categories | The count is stated in S2 and S10; only "metropolitan" and "rural" appear by name, as the reason for 10 or 30 miles |
| A cost figure for a search that did not finish | The page learns only that it failed (IV-C16), so none is shown |
