Verdict: not ready as it stands. 2 gaps stop a visitor from finishing a function, 2 mislead, and 20 are minor. No IV-F rule is broken outright and all 69 inventory items have a coverage row.

# WF1 Sequence: independent check

Checked against `inventory.md` and the output rules only. Line numbers refer to `wireframe.html`; where two numbers are given they are the 360 px and 1280 px copies of the same content. The check was done by reading markup and CSS; nothing was rendered in a browser, so the layout findings (G4, IV-F10) are reasoned, not observed.

## Gaps

| # | What is wrong | Where | Inventory item or rule | Severity |
|---|---|---|---|---|
| G1 | More distant shops are never drawn as results. They exist only as counts on a step-4 choice ("1 more, within 100 miles"; "2 shops: 38 and 61 miles"). No frame shows such a shop's name, address, direction, sells-it level, score or record, or what the distance ruler does past the nearby limit. In S6 (0 nearby) these are the visitor's only shops to drive to | 262/312, 463/490 | IV-D4, IV-D7, IV-B4, IV-C3 | blocks a visitor |
| G2 | What a search cost is shown only at step 6, after a shop is chosen. A visitor whose search found nothing, or who chooses no shop, has no place to learn it. S3 has only a closed row about cost; S10 says "Shown at step 6 for your own search"; S6 has nothing | 697/727, 800/863, 220/244 | IV-D18, IV-B15 | blocks a visitor |
| G3 | S2 says the zip becomes a city, state and zip-area center and "Only those are sent". The rural-urban category is also sent (S3 says so: "that the area is metropolitan"). S10, the page for reading before typing, never lists the city and state or the rural-urban category as sent at all | 147/175, 219/243, 759-764/822-827 | IV-C13, IV-D16, IV-B2 | misleads |
| G4 | The S1 door "Something is said about my shop. How do I check it and contest it?" and the top-bar "Dispute something" have no frame of their own. The only description is one sentence in S8 ("starts at step 2 and asks for the retailer's name"). No frame shows how someone who is not searching finds what is said about a shop | 96/120, 622/660, 803/866 | IV-B11, IV-D12, IV-D13 | misleads |
| G5 | Distance ruler rows are set to one line with overflow hidden. At 360 px the usable width inside the ruler is about 324 px. The 6.0 mile row (bar 60%, about 194 px) leaves about 124 px for "6.0 mi W, Example Variety Store", which needs about 185 px, so the name is cut. A shop near 10 miles would lose its whole label. The explanatory note inside the ruler is also a `div`, so it is cut mid-sentence too. At 1280 px the ruler sits in a grid column that may widen to fit the unwrapped text, so the result there is not determined without rendering | CSS 68; 290-291 (360), 340-341 (1280) | IV-F10, IV-D7 | minor (miles are repeated in the rows above) |
| G6 | The "No preference" view (all kinds in one order by score) is not drawn, and S6 does not offer it. It is the only way to see a nearby and an online shop in one order. coverage.md declares this | 262/312, 463/490 | IV-D4, IV-D5, IV-C5 | minor |
| G7 | In S4 the row "1 concern (labor, 2023)" on Example Home Center has no link to read or dispute that concern. S5's row has "read all 3". Reading it needs "next shop" twice, and that state is not drawn | 282/332 | IV-D11, IV-F5 | minor |
| G8 | Shops 2 to 4 in the "Then consider" list are not links. The only way to open one is "Not this one: next shop", in order. No way back to an earlier shop is drawn, and no frame shows a shop other than shop 1 as the open one in step 5 | 280-284/330-334, 387-389/430-432 | IV-D8, IV-D9 | minor |
| G9 | S7 says "Each can be disputed" but part 3 (how it treats people) and the total have no dispute link. Parts 1, 2 and 4 do | 531-535/567-571 | IV-D13, IV-F5 | minor |
| G10 | The Go step for an online shop is a two-line text box with no control to open the page. In S5 "Page found: tools-online.example/drills" is plain text, not a link | 694/724, 378/421 | IV-D8, IV-B18 | minor |
| G11 | One shop opened to its reasons is drawn for a nearby shop only. No frame shows the four parts for an online shop (the fixed middle value for closeness, the listing-based sells-it level) | S7 | IV-D9 | minor |
| G12 | Missing-data cases are not drawn: a nearby shop with no street address, an unknown distance or no coordinates (ruler row, compass direction, "Copy the address", map-app button). why.md says the direction is absent then; the wireframe shows nothing | S4, S9 | IV-C3, IV-D7 | minor |
| G13 | S3 heading says "at most about 5" seconds. The inventory figure is the slowest of 20 measured searches, not a ceiling. S10 words it correctly ("slowest about 5") | 208/230 | IV-C10, IV-F12 | minor |
| G14 | S11 says the money "in this period" is spent and "so there is a limit". The inventory says whether a limit per period exists is deferred. The frame lists this as an open point, but the heading states it as fact | 886-887/910-911 | IV-E7 | minor |
| G15 | S4 check 3 for Example Hardware Co-op lists the worker co-op certification only. S7 for the same shop also shows "member of an independent retailer association" | 272-274/322-324 vs 540/576 | self-contradiction, IV-C6 | minor |
| G16 | why.md and coverage.md (IV-F3 row) say Amazon is named only in the purpose line and the exclusion answers. It is also in the S1 answer to "What is this for?". The text is an explanation, so the rule holds; the claim is wrong | 100/124 | IV-F3 | minor |
| G17 | why.md says "The page never shows more than one step open". S4 and S5 show step 4's choices and step 5 together | 261-262, 368-369 | why.md claim | minor |
| G18 | why.md says the same answers that open beside each step appear on the one page. S10 lacks "How were my words read?", "What was left out, and why?" and "Who decides which sources count?". Its "what is sent" table drops "No location fields" for the language-model service, and its "kept" table drops that the log line never holds product or place and that only the first half of an IPv6 address is held | S10 vs 299, 477, 549; 762/825, 770-771/833-834 | why.md claim, IV-C13 | minor |
| G19 | The map-app handoff and the GitHub form are named with what each party learns, but nothing in the wireframe marks either as a cost the operator has to accept. That statement is only in coverage.md | 691/721, 619/657 | IV-F2 | minor |
| G20 | At 360 px the CSS hides the hint text on steps not yet reached, so "about 3 seconds" on step 3 is absent at 360 in S1 and S2 and present at 1280 | CSS 35; 86, 141 | IV-D3 (the S3 frame still states it) | minor |
| G21 | "Search for something else" and "change" on step 1 do not say whether the zip must be typed again. The rule is that the zip is never recalled | 699/729, rail from S3 on | IV-F1, IV-D20 | minor |
| G22 | Keyboard and screen-reader behavior is stated in one place only (S3: announced once, no motion under reduced motion). Not stated: where focus goes when a step folds and the next opens, whether results and error messages are announced, how the "+" and "-" question rows expose open or closed. "+ Which sources are accepted?" is marked closed but shows its answer. Reorder choices are drawn as check boxes though only one can apply | 209/231, 630/668, 265/315 | IV-F11 | minor |
| G23 | The four amounts printed in S7 add to 0.665, beside "Total 0.66 ... rounded". A visitor adding them gets 0.67. (The unrounded closeness amount is 0.138, which gives 0.663.) | 535/571 | IV-C5 (the explanation must match the score) | minor |
| G24 | S4 and S5 are the same search (same step-3 line) but give different summaries: "Left out: 6 sites ... Not judged: 2 results" in S4 and "Left out: 5 sites ... Not judged: 0 results" in S5. Nothing says these are counts per kind of shop | 292/342 vs 391/434 | IV-C11, self-contradiction | minor |

## Coverage rows not shown exactly as claimed (11 of 69)

| Row | Finding |
|---|---|
| IV-B14 | Partly. In S2 the "What is kept" question is a closed row with no content; the content is in S9 and S10 |
| IV-D4 | Partly. See G1; also a nearby shop's website address appears only in S9, not in the results |
| IV-D7 | Partly. See G1 and G5; "S6 lists farther shops by miles" is two numbers on a choice label |
| IV-D8 | Partly. Nearby shown; online has no control (G10) |
| IV-D13 | Partly. See G9 |
| IV-D16 | Partly. See G3 and G18 |
| IV-D18 | Partly. See G2 |
| IV-F2 | Partly. S2 says "nothing else is fetched" in a sentence, S10 in a table row; operator cost not marked (G19) |
| IV-F3 | Rule kept; the row's "only in" claim misses one place (G16) |
| IV-F5 | Partly. See G7 and G9 |
| IV-F10 | Partly. Every state has a 360 px frame and is one column there, but see G5 |

No row is claimed and wholly absent. No item of IV-B, IV-D, IV-E or IV-F lacks a row (18 + 21 + 14 + 16 = 69).

## IV-F rules, one by one

| Rule | Finding |
|---|---|
| IV-F1 | Kept. Stated at S2; folded step 2 shows city and state only; no street address or device location asked. Unstated point in G21 |
| IV-F2 | Kept, weakened by G19. No fetches in the design; GitHub and the map app are named with what they learn |
| IV-F3 | Kept. 12 occurrences of "Amazon", all explanation, none in example or result text: purpose line (88, 112); answer to "What is this for?" (100, 124); question "Why is there no Amazon, and what counts as Amazon?", twice in each (101, 125); S10 exclusion question and answer, twice in each (756, 819). No Amazon brand is named anywhere |
| IV-F4 | Kept for the shops drawn in full (S7, S8). Sources and dates on each certification and concern |
| IV-F5 | Weakened by G7 and G9 |
| IV-F6 | Kept. Claims are quoted with source and date; size bands are the inventory's own terms; S8 declines a verdict |
| IV-F7 | Kept. "Nothing found", "starts at the middle (unknown, not bad)", "does not prove it is independent" |
| IV-F8 | Kept. Chain fact is a dashed box labeled "Fact, not scored"; the difference from a certification is the label plus line style, with no color involved |
| IV-F9 | Kept, as a planned note in S5 only |
| IV-F10 | Mostly holds by the markup. The 360 frame has 338 px of content width; all grids apply only under the 1280 class; tables are 2 or 3 columns at 12 px with wrapping text; the longest unbreakable strings (example web addresses, about 30 characters) fit; buttons and choices are inline blocks that wrap. One failure: G5 |
| IV-F11 | Partly stated. See G22. Implied by structure: the path is an ordered list, nothing depends on hover, bars have text beside them. The file's own state switcher is mouse-only spans, which is the viewer, not the design |
| IV-F12 | Kept for thin (S6), guess (S4, S5, S9), failed (S3), budget (S11), accuracy (S4, S10). Small overstatement in G13 |
| IV-F13 | Kept. Every distance is in miles |
| IV-F14 | Kept. No excerpts; only the matched listing title, which is an inventory field |
| IV-F15 | Kept |
| IV-F16 | Kept. "Data credits" in all 22 frame footers and in S10 |

## What a visitor cannot do (IV-D1 to IV-D21, at 360 px and 1280 px)

No function differs between the two widths; the two copies of each state carry the same text.

| Function | Finding |
|---|---|
| IV-D4, IV-D7 | Cannot be completed for more distant shops (G1) |
| IV-D18 | Cannot be completed unless a shop is chosen (G2) |
| IV-D5 | Controls are drawn; no frame shows a reordered list, and reordering across kinds needs the undrawn "No preference" view (G6) |
| IV-D8 | Online shop: needs a control the wireframe never shows (G10) |
| IV-D9, IV-D11 | For shops 2 to 4 these need "next shop" steps whose result is never drawn (G7, G8) |
| IV-D12, IV-D13 | From a search: complete. From the top bar or the S1 door: needs steps never shown (G4). Without a GitHub account: not possible, which the inventory states and S8 says plainly |
| IV-D20 | Complete; whether the zip is typed again is unstated (G21) |
| IV-D1, D2, D3, D6, D10, D14, D15, D16, D17, D19, D21 | Can be completed at both widths |

## States

All nine required states appear at both widths (11 sections, 22 frames): arriving S1, asking S2, waiting S3, results of both kinds S4 and S5, thin or empty S6, one result opened S7, concern and dispute S8, trust, cost and privacy S10 (with S9), budget spent S11. Text content of each pair is identical after removing layout wrappers (compared by script). The only width difference that drops information is G20.

## File rules

| Rule | Finding |
|---|---|
| Well-formed HTML | Yes. Every tag opens and closes in order (checked by parser) |
| No images, external files, links out | None. No `img`, `a`, `link`, `src`, `href`, `url()` or web address with a scheme |
| Scripts | One, show and hide only (932-943) |
| Grays only | Six values: #111, #444, #777, #bbb, #eee, #fff |
| System font | `system-ui, sans-serif` |
| Placeholder shops say "Example" | All 8 shops and all 6 invented sources and certifiers do; all 6 web addresses end in `.example` |
| Real names present (not shops) | Amazon, Brave Search, OpenRouter, Cloudflare, GitHub, GitHub Pages, US Census Bureau, GeoNames; certification kind "1% for the Planet"; licenses AGPL-3.0 and CC BY 4.0. All are named in the inventory |

## Verified as correct, by count

- 58 of 69 coverage rows shown as claimed; 11 partly; 0 claimed but absent; 0 inventory items without a row.
- 16 of 16 IV-F rules not broken; 5 weakened (F2, F5, F10, F11, F12).
- 12 of 12 "Amazon" occurrences are explanation.
- 9 of 9 required states present at both widths; 11 of 11 frame pairs identical in text.
- 11 of 21 functions complete at both widths with no undrawn step; 3 cannot be completed in some case (D4, D7, D18); 7 need a step not drawn or have an unstated point (D5, D8, D9, D11, D12, D13, D20).
- Inventory facts restated correctly: weights 0.25, 0.30, 0.30, 0.15; zero closeness at 25 miles; nearby 10 and 30 miles, 100 mile outer limit; 33,791 zip areas; 30 searches a minute; 41 chains; 14 accepted sources; 39 domains and 14 names; certification adds 0.25, concern costs up to 0.25; size bands; all six accuracy figures with dates and the later run; $0.023 a search; $65 projection; 30 days, one minute.
- Score arithmetic: the one shop with stated part values (S7) and the S8 penalties (0.075 + 0.015 + 0.015) are right apart from the rounding in G23, and the S7 gap explanation (0.075 plus the rest from 1.3 miles) matches. The other 6 scores are consistent with one assumed value per sells-it level; the wireframe does not state those values, so they are not proven.

## Fix round

Written by the designer after the check above. 22 gaps fixed, 2 fixed in part (G4, G12), 0 left as they were. Frame names replace line numbers, which have moved. Three frames were added: S5b Results, no preference; S6b Results, farther; S8b Dispute, not searching. Every change inside a frame is in both the 360 px and the 1280 px copy; the text of each pair was compared by script and matches. Two additions sit above the frames and apply to both widths: the symbol legend and the keyboard and screen-reader box. Nothing was rendered in a browser.

| Gap | Result | Where, or why not |
|---|---|---|
| G1 more distant shops never drawn | Fixed | New frame S6b: one more distant shop in full (name, address, miles, direction, website, sells-it level, score with four parts, record), a second as a row, and a ruler whose full width is 100 miles with the 30-mile nearby limit marked. S5b row 9 is the more distant shop of the first search. S6 says which frame "I will drive farther" opens |
| G2 search cost only at step 6 | Fixed | Folded step 3 shows "Cost: about $0.023" in every frame after a search; Asked "What did this search cost?" is open in S4, S5, S5b, S6 and S6b; S3 Asked and S10 say when it appears and that a search that did not finish shows no cost |
| G3 rural-urban category missing from "what is sent" | Fixed | S2 note and Asked table; S10 "What is sent" now opens with the full list of what is sent |
| G4 no frame for disputing without a search | Fixed in part | New frame S8b draws the path in five steps. Not fixed: looking up what is said about a shop by name. No such function exists in the inventory (a record per shop is IV-E8, undecided), so S8b sends the person to a search and says the shop may not come up |
| G5 ruler labels cut off | Fixed (reasoned, not observed) | CSS: the label sits above its bar and wraps; the one-line and hidden-overflow rules are gone. Applies to the S4 and S6b rulers at both widths |
| G6 "No preference" view not drawn | Fixed | New frame S5b: all 9 shops in one order with a kind tag on each; S6 and S6b offer "No preference" |
| G7 one-concern row had no link | Fixed | S4 and S5b: "read it and its source, or dispute it" on the Example Home Center row |
| G8 shops 2 to 4 not links, no way back | Fixed | Shop names in the lists of S4, S5, S5b, S6b are links with a note; S5b shows shop 2 of 9 open with "Previous shop" |
| G9 part 3 and the total had no dispute link | Fixed | S7: "dispute this part" on part 3 and "dispute the score" on the total; the same in the online box and in S6b |
| G10 no control to open an online shop's page | Fixed | S9: box "Step 6 for an online shop" with "Open the shop's page"; S5: the page found is a link |
| G11 no four parts for an online shop | Fixed | S7: second box, "The same four parts for an online shop", with the fixed middle value for closeness |
| G12 missing-data cases not drawn | Fixed in part | S4 and S9: a dashed box states what each check, the ruler, the distance order and step 6 show with no address, no distance or no coordinates. No example shop with a missing fact is drawn; the "how close" part for unknown distance is given in words only because the inventory has no value |
| G13 "at most about 5" seconds | Fixed | S3 heading and note: median about 3, slowest measured about 5, a search can take longer |
| G14 budget "period" and "limit" stated as fact | Fixed | S11 heading and first line no longer name a period or a limit; the open points line lists the period |
| G15 retailer association fact missing in S4 | Fixed | S4 and S5b check 3 show it as "Fact about the shop, not scored" |
| G16 wrong "only in" claim about Amazon | Fixed | why.md "Calls made" and coverage.md IV-F3 row now list all four places |
| G17 "never more than one step open" | Fixed | why.md first section: one step is current, and the step-4 choice stays open above step 5 |
| G18 S10 lacked three answers and three details | Fixed | S10: added "How were my words read?", "What was left out, and why?", "Who decides which sources count?"; added "No location fields", the IPv6 half and "never product or place". S10 intro and why.md now say that answers about one search or one shop appear only at their step |
| G19 operator cost not marked in the wireframe | Fixed | "Operator decision needed (IV-F2)" notes in S8, S8b (GitHub) and S9 (map app); S10 table row names both |
| G20 "about 3 seconds" hidden at 360 px | Fixed | CSS keeps the step-3 hint visible on the path at 360 px (S1, S2) |
| G21 zip typed again or not | Fixed | S9 note: the place is kept while the page stays open, and the zip is typed again after a reload. This is the designer's reading of "never recalled", listed in why.md "Calls made" |
| G22 keyboard and screen-reader behavior | Fixed as a statement | Box at the top of the wireframe; reorder choices drawn as a single-choice group; "Which sources are accepted?" in S8 marked open. Cannot be proven in a static file, so coverage row IV-F11 stays "partly" |
| G23 parts did not add to the total | Fixed | S7: closeness 0.916 x 0.15 = 0.137; total 0.15 + 0.137 + 0.225 + 0.15 = 0.662, shown as 0.66; the gap line states the 0.008 |
| G24 two different left-out summaries | Fixed | S4, S5 and S5b show one summary for the search: 11 sites left out, 2 results not judged |

Checker's "partly" rows without a gap number: IV-B14, what is kept (S2 "What is kept" is now open with a short answer); IV-D4, reading the shops (a nearby shop's website is in check 2 of S4); IV-F2, no third parties (see G19).

Coverage rows still "partly" after this round: IV-D5, reorder results (no reordered list drawn); IV-D7, judging which shops are practical to reach (missing-data cases written as rules, no example shop drawn); IV-D12 and IV-D13, disputes (no filing without a GitHub account, no lookup by shop); IV-F11, keyboard and screen reader use (stated, not provable). Described but not drawn: IV-E12 (nearby shops from a curated directory) and IV-E14 (weighing concerns by age).

Checks run after the fixes, by script on the file: tags balanced; no image, link, external file or web address with a scheme; the same six gray values; 14 sections, each with a switcher entry; 12 occurrences of "Amazon", unchanged; folder size about 179 KB.
