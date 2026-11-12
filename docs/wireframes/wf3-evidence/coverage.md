# WF3 Evidence: coverage

69 rows: 18 questions (IV-B), 21 functions (IV-D), 14 planned additions (IV-E), 16 rules (IV-F). 8 rows are "Not handled". 8 rows are marked "Partly" (IV-B15, IV-B18, IV-D5, IV-E6, IV-E8, IV-E11, IV-E14, IV-F11). Updated after the fix round recorded at the end of `check.md`.

States are the lettered sections of `wireframe.html`: A arriving, B asking (with the reopened form), C waiting, D results of both kinds, E nearby and more distant, F online only, G thin or empty, H one result opened, I concern and dispute, J sources, K this site's record, L budget spent, refused, failed.

## IV-B. The questions a visitor asks

| Item | What it is | Where the design handles it |
|---|---|---|
| IV-B1 | What is this, and what is it for | State A: the one-sentence heading above the form |
| IV-B2 | What do I give it, and is that safe | State A: the "Your zip stays in this browser" line in the Ask box. State B: the table "What leaves this browser when you press Search", which names each receiver (Brave Search, OpenRouter and the model provider it routes to, Cloudflare and GitHub Pages) |
| IV-B3 | Is it working, how long | State C: the heading "Searching for...", the line "Usually about 3 seconds, at most about 5", and the four-step table |
| IV-B4 | Can I get this near me today, where, how far | State D: nearby rows with miles, direction and street address. State E: the same rows ordered by distance, with the 25 mile strip |
| IV-B5 | If not nearby, who sells it online | State D: online rows in the same list. State F: online rows alone, each with the listing found |
| IV-B6 | Does this shop really sell it, or is that a guess | State D: the "Sells it" cell, drawn as sourced (the shop's listing), judged (likely or possibly), or measured (not confirmed, because not judged). States E and F: the reliability line above the rows. State H: the "Sells it" line with "who says so" |
| IV-B7 | Why is this shop ahead of that one | State H: the table "Why it is behind Example Restaurant Supply (place 6), the shop above it", with both shops named on every line at 360 px, and the "Compare with" control. The second record in state H states why place 1 is ahead of place 2 |
| IV-B8 | What is known about how the shop treats people and the planet, and who says so | State D: the "People" and "Planet" cells. State H: the "Who says so" column. State J: the "Outside sources" table |
| IV-B9 | Chain or independent | State D: the "Size, not a rating: chain of 1,240 stores" mark and the footnote that a shop without one is not shown to be independent. State H: "Known, but not scored" |
| IV-B10 | How bad is this concern | State I, part I1: the table with when, about whom, final or open, how large, what it cost |
| IV-B11 | This is wrong, how do I contest it | State H: "Dispute" on every line. State I, part I3: the prefilled form fields and "What to expect, stated plainly" |
| IV-B12 | Why trust the ordering, how often is it wrong, what does it miss | State A: "How far to rely on it". State D: "What this answer rests on". State K, part K1: the accuracy table and "What it misses" |
| IV-B13 | Why no Amazon, what counts as Amazon | State A: the last row of "How far to rely on it". State K, part K3: the exclusion table (one bracketed business-name row and one bracketed web-domain row) and "The whole exclusion set" link |
| IV-B14 | What do you know about me, what do you keep | State K, part K4: the "Who / Learns" table, with every party named, and the "What / Afterward / How long" table |
| IV-B15 | Who pays, what did my search cost, is anyone paying to be placed | Partly. State D: "This search cost". State K, part K5: cost table and "Is anyone paying to be placed". "Who pays" is a bracket, because the inventory names no funder |
| IV-B16 | Little or nothing: my wording, my location or the site's limit | State G: the table "Is it your wording, your location, or the site's limit?" (G1), the nothing-matched box (G2), the own-filter box (G3), the box for nearby shops with no online shops (G4) |
| IV-B17 | Refused or failed: broken, blocked or out of money, when to retry | State L: boxes L1, L2, L3 and the table "Which one is it?" |
| IV-B18 | I chose a shop, how do I get to it | Partly. States D to G: "Go to the listing" on every online row and "Shop's site" on every nearby row. State H: "Go to examplemart.example", street address, miles and direction. No directions and no map |

## IV-D. What a visitor can do

| Item | What it is | Where the design handles it |
|---|---|---|
| IV-D1 | Ask: product and zip, start a search | State A and state B: the Ask box with Product, US zip code and Search |
| IV-D2 | Be told what is wrong and fix it | State B: the box "If something is wrong with what you gave" (three messages) |
| IV-D3 | Know a search is under way and how long | State C: the whole state |
| IV-D4 | Read nearby, more distant and online shops with their facts | State D: the ledger rows, each statement labeled with its weight at 360 px. State E: nearby and more distant, plus a variant row for a shop whose distance is unknown. State F: online with the listing address |
| IV-D5 | Reorder by score, distance or name | Partly. State D: "Order by" Score, Distance, Name, with the rule for each order written under the rows. State E draws the distance order for nearby and more distant shops. The distance order of the full mixed list and the name order are stated, not drawn |
| IV-D6 | Narrow: nearby only, online only, certification only | State D: the "Show" control with Nearby, Nearby and more distant, Online, and With a certification. States E and F show "Nearby and more distant" and "Online" applied; "Nearby" alone is described in state E's footnote, not drawn; state G, part G3 shows a choice that leaves nothing |
| IV-D7 | Judge which shops are practical to reach | State E: the box "How far, on a strip of 25 miles", plus miles, compass direction and street address in each row. The variant box says how a shop with no known distance is shown and ordered |
| IV-D8 | Go to a shop's own website, shop not told the origin | States D to G: "Go to the listing" (online) and "Shop's site" (nearby), explained under the rows of states D and F. State H: "Go to examplemart.example" |
| IV-D9 | Learn why a shop is placed where it is | State H: the table "Why it scores 0.51" with value, weight and what each part adds, and the second record (an online shop with two certifications, score 0.78, online closeness 0.50) |
| IV-D10 | Follow a certification, chain fact or concern to its source | State H: "Open the source" links on the concern, the chain fact and, in the second record, each certification. State J: "Open the source" on every row of "Outside sources" |
| IV-D11 | Read every concern on a shop, including several | State I, part I2: "Example Big Box: 4 concerns counted, 2016 to 2024" |
| IV-D12 | Dispute a concern | State I, part I1: "Dispute this concern". Part I3: the four prefilled fields, "Open the dispute form", and the limits table. Part I3 also draws the page as reached with nothing chosen, with the four fields empty |
| IV-D13 | Dispute a certification, chain fact or score part | State H: "Dispute" on each score line, the chain line and the certifications line. State I, part I3: the "Dispute" selector with six kinds, and the box "Reached with nothing chosen" |
| IV-D14 | Read how ordering works | State K, part K2: the four-part table and the lines under it |
| IV-D15 | Read why Amazon never appears and see the exclusion set | State K, part K3: the statement of the exclusion, the bracketed table of excluded names and domains, and the link "The whole exclusion set" |
| IV-D16 | Read what is sent, to whom, what is kept | State K, part K4: the "Who / Learns" table (Brave Search, OpenRouter and the model provider, Cloudflare and GitHub Pages, GitHub, anyone else) and the "What / Afterward / How long" table. State B: the table "What leaves this browser when you press Search", with the same names |
| IV-D17 | Read how accurate and complete results are, reach raw evidence | State K, part K1: the table, and the "Raw evidence" and "The method" links |
| IV-D18 | Learn what the search cost, reach the ledger | State D: "This search cost" with the "Cost ledger" link. State K, part K5: the "Your last search" row and the link "The cost ledger" |
| IV-D19 | Reach the source code and license | State K, part K6: the "Source code" and "License" links. States A and D: footer links |
| IV-D20 | Search again with a changed product or zip | Every state: "Ask" in the top bar. States D to G, J and L: also "Change the search". Both reopen the form drawn in state B, second box: product filled in, zip empty and typed again. State L: "Search again" reuses the place already worked out (a guess by this designer; see `why.md`) |
| IV-D21 | Find the required data credits | State K, part K6: "Data credits". States A and D: footer link |

## IV-E. Headed towards

| Item | What it is | Where the design handles it |
|---|---|---|
| IV-E1 | Many more concerns, several per shop | State I, part I2: list of several concerns with count, year range and an "Order by" control. State D draws only the single-concern form of the People cell ("1 concern counted"); how that cell reads for a shop with several is not drawn |
| IV-E2 | How each concern was counted, and a way to the full research record | State I, parts I1 and I2: "How large", "About whom", "Final or open", "How it was counted". The link to the research record is a designer note only |
| IV-E3 | Suggested shops, never scored | Not handled. Undecided by the operator, and the design has no place for unscored shops outside the ledger |
| IV-E4 | Consumer co-ops as a positive fact | Not handled. It would be one more sourced line or a "Not scored" pill; not drawn because its score effect is undecided |
| IV-E5 | Price-level indication, usable for reordering | Not handled. No price data exists; it would add an "Order by" choice |
| IV-E6 | The service reporting each step as it happens | Partly. State C: the four-step table is static today and is the place where live steps would be marked |
| IV-E7 | Honest behavior when the money runs out | State L, box L1, labeled a proposal. No reset date, since whether a limit exists is undecided |
| IV-E8 | Written dispute process, response time, per-shop record of disputes | Partly. State I, part I3: today's limits are stated in the "What to expect" table; the future process and the "under dispute" marker are a designer note only |
| IV-E9 | Wider kinds of places (free, used, lending, thrift, marketplaces) | Not handled. Proposed only; no data to draw |
| IV-E10 | Favoring independent shops | Not handled. Undecided; state K, part K2 lists chain size as not scored, which is today's rule |
| IV-E11 | Fallback or clearer explanation for zips that cannot be resolved | Partly. State B: the message "This zip is not in the list" explains and suggests a nearby street-address zip. No fallback |
| IV-E12 | Nearby shops from a curated directory | Not handled. It would change "Sells it" for nearby shops from judged to sourced; not drawn |
| IV-E13 | Daily totals of searches and cost | Not handled. Whether visitors can read them is not stated; state K, part K5 would hold them |
| IV-E14 | Weighing concerns by age | Partly. State I, part I1: the "When" line says age is not weighed today. The future weighing is not drawn |

## IV-F. Rules any design must keep

| Item | What it is | Where the design handles it |
|---|---|---|
| IV-F1 | Zip never leaves the browser, never recalled, never in an address; no street address or device location asked | State A: the Ask box line. State B: the "Not sent" row, and the reopened form with its zip field empty. States C and L: the last line. The form asks for product and zip only |
| IV-F2 | No accounts, cookies, analytics; nothing fetched from a third party by default | State K, part K4: the "Anyone else" row and the last line. State E uses a strip, not a map. State I, part I3 says the dispute form leaves the site and what GitHub learns. Every outside party is named in states B and K |
| IV-F3 | Amazon and its brands never appear, including in example text | All placeholder shops are invented "Example" names. State K, part K3 shows the exclusion set as bracketed rows with no brand named. The word "Amazon" appears only in the site's own statement of the exclusion |
| IV-F4 | Every placement explained, with a source for each certification and concern | State D: four statements per row. State H: "Who says so" and the arithmetic. State J: every source listed |
| IV-F5 | Every concern disputable; certifications, chain facts and score parts too | State H: "Dispute" on each line. State I: "Dispute" on each concern, and part I3. State J: "Dispute" on each row |
| IV-F6 | A concern's text is the source's wording with source and date; no verdict words | State I, part I1: the claim in quotes, the line "The source's own title", source and date. No grades anywhere |
| IV-F7 | Unknown is not bad; no chain fact does not mean independent | States D to H: "Nothing found" drawn pale and scored as the middle. State D: the footnote. State G, part G3 |
| IV-F8 | A chain fact is neither praise nor criticism | States D, E, H, J: the rounded outline is used for chain size alone and reads "Size, not a rating". The association membership is drawn as a sourced statement reading "Certification, never scored", so the two differ in shape and in words |
| IV-F9 | Suggested shops never mixed with scored results | Not handled. No suggested shops are drawn (see IV-E3, suggested shops) |
| IV-F10 | Usable at 360 px | Every state has a 360 px frame |
| IV-F11 | Keyboard, screen reader, reduced motion | Partly. Stated, not drawn: state D's designer note gives the focus order and says the selected control and each statement's kind are announced in words; state C's note says nothing animates. Sourced and measured cells now say who or how in visible text. A static wireframe cannot show the rest |
| IV-F12 | Honest when thin, when a judgment is a guess, when failed, when the budget is spent | State G (thin and empty). States D, E, H (judged statements with measured accuracy). State L (failed, refused, budget spent). State K, part K1. The site's own unsourced claims in states A and K are marked "This site says", not "Sourced" |
| IV-F13 | Distances in miles | States B, D, E, G, H, J, K: every distance is in miles |
| IV-F14 | Raw web excerpts not shown | No state shows an excerpt. State J: "Left out" gives site name and reason only |
| IV-F15 | No affiliate links, paid placement or advertising | State A: the "No paid placement" row. State K, part K5: "Is anyone paying to be placed". No ad areas in any state |
| IV-F16 | Required data credits can be found | State K, part K6: "Data credits". States A and D: footer link |
