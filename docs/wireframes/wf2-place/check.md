Verdict: mostly sound, with 1 gap that blocks a visitor (the thin-result frame has no cost line and no way to the trust, privacy or dispute pages), 4 that mislead and 16 minor. No IV-F rule is broken outright, all 69 inventory items have a coverage row, and every required state is drawn at both widths.

# WF2 Place: independent check

Checked against `inventory.md` and the output rules only. Reasoned from the markup and CSS; nothing was rendered in a browser. Frame names are the captions in `wireframe.html`; line numbers are that file's.

## Gaps

| # | What is wrong | Where | Inventory item or rule | Severity |
|---|---|---|---|---|
| G1 | The thin-result frame has no legend box, no cost line, no "left off the plan" summary, no order or narrow controls, and no link to trust, privacy, method, exclusion, source code or dispute. A visitor with a thin result cannot learn what the search cost or reach those pages. The frame does not say it is shortened, and it contradicts the wireframe's own notes: trust is "reached from the legend under every plan" (line 546) and privacy and cost "from the legend after a search" (line 598) | Frame 5, both widths (lines 305-321, 323-345) | IV-D18, IV-D14 to D17, IV-D19, IV-D5, IV-D6, IV-C11, IV-B16 | Blocks a visitor (as drawn) |
| G2 | "Open in your device's map app" is an outside party. The wireframe does not name it, does not mark it as a cost the operator has to accept (only `coverage.md` and `why.md` say so), and frame 9 "Nowhere else" does not list it. "That app then learns this shop's address, not your zip" leaves out that a map app normally also knows the device's location and the person | Frame 6, both widths (lines 379, 414); frame 9 (lines 611, 629) | IV-F2, IV-F1 | Misleads |
| G3 | The online zone heading says "reach you anywhere". The inventory says nothing about where online shops deliver | Frames 4 and 5, both widths (lines 260, 291, 317, 339) | IV-C4, IV-F12 | Misleads |
| G4 | Not stated whether frames 6 to 9 are views inside one page or separate pages (`coverage.md` calls 8 and 9 "pages"). With the zip never recalled or put in an address and results never stored, "Back to the plan" from a separate page would need a new search and a retyped zip. Frame 10b says "your product and place are still filled in" and frame 5 offers "Change the product" alone, while `coverage.md` says the zip must be typed again after leaving the page. The form a visitor lands on after "Change" is never drawn | Frames 4 to 9 top bars; lines 312, 670; `coverage.md` IV-D20 row | IV-F1, IV-D20 | Misleads |
| G5 | At 360 px the top bar of the shop card and the concern card has "Back to the plan" but no "Change". `coverage.md` says "Change" is in the top bar of frames 4 to 7. Searching again from there takes an extra step at 360 px only | Frames 6 and 7, 360 px (lines 371, 445) | IV-D20 | Minor |
| G6 | An opened online shop is described in a note, not drawn at either width. For an online shop, going to its listing, reading its four score parts and following its certification to a source (the B Corp tag on shop number 1) are never shown | Note after frame 6 (line 436) | IV-D8, IV-D9, IV-D10, IV-F4 | Minor |
| G7 | The score table on the concern card has no dispute link. `coverage.md` IV-F5 claims one "under every score table" | Frame 7, both widths (lines 462-468, 498-504) | IV-F5, IV-D13 | Minor |
| G8 | The wireframe never says what activating a mark or a shop name does. `coverage.md` IV-F11 says marks are links to their rows; frame 6 at 1280 px says neighbors "can be opened from here". The underlined shop name on a row could be read as the shop's website | Frame 4 rows and marks; line 402 | IV-F11, IV-D9, IV-D8 | Minor |
| G9 | Keyboard and screen reader use is only asserted in the top note (the list repeats the plan as text). Not stated: how a screen reader learns that the wait ended, that results or a refusal arrived, where focus goes on opening a card and on "Back", and whether the marks are extra tab stops before the same shops in the list. At 1280 px the plan comes before the status message and the counts in source order | Line 83; frames 3 and 4 at 1280 px (lines 223-232, 270-279) | IV-F11 | Minor |
| G10 | At 360 px the inner circle is 124 px across and marks are 22 px squares. The inventory allows up to 10 nearby shops, 2 branches of one company and shops at the center. No rule for marks that overlap each other or the center square is stated, and the drawn example (5 marks, nearest pair 8 px apart) avoids the case | CSS lines 43, 46, 51 | IV-F10 | Minor |
| G11 | Chain, certification and concern tags use one identical box style on result rows and differ only by their first word. Nothing on a row says a chain fact does not change the score (said only in frames 7 and 8). `coverage.md` presents the shared style as the handling | Frame 4 rows (lines 253-254, 284-285); CSS line 62 | IV-F8 | Minor |
| G12 | `why.md` says the ranking method is "one link from every frame". Frames 2b, 3, 5 and 7 have no such link at either width, and frame 2 at 360 px has only "Legend and limits" | `why.md` line 44 | IV-D14 | Minor |
| G13 | The arriving frame at 360 px drops the sentence present at 1280 px: a search takes about 3 seconds, costs about $0.023, nobody pays to be placed | Line 123 (1280 px) against lines 105-106 (360 px) | IV-B15, IV-B3 | Minor |
| G14 | The trust page at 360 px has no link to the privacy and cost page; at 1280 px it does | Line 549 against line 569 | IV-D16 | Minor |
| G15 | Shop number 6 (only the category is named) has a solid mark. The frame 4 note says solid means "likely sells it or names it in a listing"; the legend says only "dashed: possibly". Five sells-it levels are shown as two mark styles without saying where the middle level falls | Lines 240, 247-248, 263 | IV-C5, IV-B6 | Minor |
| G16 | The left-off summary counts "1 outside the top 10" in a search that returned 6 nearby, 1 farther and 3 online shops, below the limits of 10 nearby, 3 farther and 10 online | Lines 264, 275 | IV-C3, IV-C4, IV-C11 | Minor |
| G17 | The trust table gives 62 to 64% and 33 to 35% for "Nearby and farther". The inventory gives those figures for nearby results and does not say they cover more distant shops | Lines 552, 574 | IV-C12, IV-F12 | Minor |
| G18 | Shop number 10 (distance unknown) scores 0.40, which works out to zero for closeness, the same as a shop 25 miles away. No drawn frame explains that line for such a shop. The inventory does not say how an unknown distance counts; `why.md` marks the values as placeholders | Lines 257, 288 | IV-C5, IV-F4, IV-F7 | Minor |
| G19 | The budget-spent message appears only after a visitor has typed both fields and pressed the button; arriving while the budget is spent is not drawn. Its link row leaves out dispute and the exclusion. `coverage.md` IV-F3 lists frames 1, 4 and 8 for the word "Amazon" and misses the top bar link in frame 2 at 1280 px | Frame 10 (lines 643-648); line 156 | IV-E7, IV-F12, IV-F3 | Minor |
| G20 | The shop card says "Concerns: none found in the 14 accepted sources". The inventory describes concerns as a small curated set (4 now, on four large chains) and does not say each shop is looked up in all 14 sources. The sentence reads as a cleared record | Frame 6, both widths (lines 392, 429) | IV-C8, IV-F12, IV-F7 | Misleads |
| G21 | The waiting frame says "at most about 5" seconds. The inventory gives about 5 as the slowest of 20 measured searches, not a ceiling | Frame 3, both widths (lines 214, 229) | IV-C10, IV-F12 | Minor |

## The IV-F rules, one by one

| Rule | Finding |
|---|---|
| IV-F1 | Kept as stated (frames 1, 2, 9, 10; top bar shows city and state). Left open by G4 |
| IV-F2 | The page itself needs no outside fetch: plan drawn locally, system font. One optional exit, the map app: see G2. GitHub (dispute form) is named, with "needs an account" and "what you file is public" |
| IV-F3 | 9 occurrences of "Amazon", all in the statement of the exclusion or a link to it: intro sentence (lines 93, 114), links "Why Amazon is never on it" and "Why no Amazon" (106, 110, 156), legend "Never on this plan" (248, 274), trust page "Never on the plan" (556, 578). None in a result, a suggestion or example text. No brand of it is named |
| IV-F4 | Kept for the two drawn cards. Not drawn for an online shop (G6) or a distance-unknown shop (G18) |
| IV-F5 | Every drawn concern, certification and chain fact has a dispute link. Score parts: frame 6 yes, frame 7 no (G7) |
| IV-F6 | Kept. Claims are in quotation marks with source and date; size words are the inventory's bands |
| IV-F7 | Kept: "Nothing found, for or against", "unknown is not bad", "does not prove it is independent". See G18 |
| IV-F8 | Weakened on rows (G11); stated plainly in frames 7 and 8 |
| IV-F9 | Nothing drawn; nothing mixed |
| IV-F10 | Likely fits. The 360 px frame has 332 px of content width; the plan is 326 px; no other fixed width exceeds it; tables have 2 or 3 columns of wrapping text at 12 px; rows are 26 px, flexible, auto. The frame clips overflow (`overflow:hidden`), so any overflow would be hidden, not scrolled. See G10 |
| IV-F11 | Stated: the list repeats the plan as text (miles, compass direction, zone, sells-it level), solid and dashed are repeated in words, nothing moves. Not stated: G8, G9 |
| IV-F12 | Kept: thin (5, 5b), guess ("likely", "possibly", "not a stock check", "call first"), failed (10b), budget (10), measured figures in the legend and frame 8. See G3, G17, G20, G21 |
| IV-F13 | Kept. Every distance is in miles |
| IV-F14 | Kept. No excerpts; listing titles only |
| IV-F15 | Kept |
| IV-F16 | Kept: credits text in frame 8, link from frame 1 at both widths |

## Verified as correct, by count

- 69 of 69 items in IV-B, IV-D, IV-E and IV-F have a coverage row; none is missing.
- 64 of 69 rows shown as claimed; 5 partly shown (IV-D20: G5; IV-F2: G2; IV-F3: G19; IV-F5: G7; IV-F11: G8); 0 claimed but not shown. All 14 IV-E rows match what is and is not drawn.
- 21 of 21 functions can be completed at both widths on the path from arriving through a normal result (frames 1 to 4 and the pages reached from frame 4). Exceptions: from the thin-result frame (G1), one extra step at 360 px (G5), online shops by note only (G6), reorder and narrow behavior described in a note and not drawn (as `coverage.md` says).
- 10 of 10 required states appear at both widths, in 28 frames (14 pairs). Content differences between widths: G5, G13, G14; frame 2b has a plan at 1280 px only, with no information lost.
- 16 IV-F rules: 0 broken, 6 weakened or left open (F1, F2, F5, F8, F11, F12).
- File rules: tags balance (parser check, 0 errors, 0 duplicate ids); 0 images, 0 anchors, 0 external files or addresses; 10 color values, all gray; `system-ui, sans-serif`; one script that only shows and hides states and marks the active button.
- 13 invented shops, 5 invented sources and 4 invented places, all carrying "Example". No real business names.
- Outside names present, all from the inventory: Amazon, Brave Search, OpenRouter, Cloudflare, GitHub Pages, GitHub, US Census Bureau, GeoNames, B Corp.
- 2 of 2 score tables add up (0.676, 0.509); all 10 row scores in frame 4 fit the four weights and the 25-mile falloff; the 6 placed marks sit at the miles and direction their rows state, at both widths.
- Inventory figures matched: weights 0.15, 0.25, 0.30, 0.30; 10, 30 and 100 miles; 62 to 64%, 98%, 31%, 33 to 35%, 80% (53 of 66), 40% (58 of 146), 71% and 98.4% with their dates; about 3 and 5 seconds; about $0.023; 30 searches a minute; 30 days; one minute; 0.6 mile; 39 domains and 14 names; 41 chains; 14 accepted sources; certification 0.25, concern up to 0.25; what is sent to Brave Search, OpenRouter and the hosts.

## Fix round

Result: 21 of 21 gaps fixed in `wireframe.html`, at both widths. 3 of them (G9, G10, G19) are fixed by a stated rule or a labeled guess, not by a fully drawn state. Written by the fixing designer; the checker's text above is unchanged.

G numbers are the checker's gap numbers. Frame names are the captions in `wireframe.html`.

| # | Outcome | Where and how |
|---|---|---|
| G1 | Fixed | Frame 5, both widths: legend with all links (limits, privacy and cost, method, exclusion, dispute, source code), order and narrow controls, left-off summary (9 sites, counts add up) and cost line. Frame 5b caption says these stay |
| G2 | Fixed | Frames 6 and 9: the map app is named as an outside party, with what it receives, what it normally already knows (device location, possibly the person), and a mark that the operator has to accept it or remove the link |
| G3 | Fixed | "reach you anywhere" removed from frames 4 and 5; the heading now says "no address, no distance". Frame 6b says the page does not know where a shop delivers |
| G4 | Fixed | New top note "One page, several views". New frame 2c draws the form after "Change". Frame 5 buttons, frame 10b and the IV-D20 coverage row now agree. The reading of "never recalled" is labeled the designer's judgment in `why.md` |
| G5 | Fixed | "Change" added to the 360 px top bar of frames 6 and 7 (and 6b, 6c) |
| G6 | Fixed | New frame 6b: an online shop opened, with the listing button, four score parts and the certification's source. Which conduct part a B Corp raises is a placeholder |
| G7 | Fixed | Frame 7 score table: "How the order works" and "Dispute any line" added |
| G8 | Fixed | Legend in frames 4 and 5 and a new note under the frame 4 heading: a mark or a shop name opens the card; the website is a button on the card |
| G9 | Fixed, by statement | New top note on keyboard and screen reader behavior (announcements, focus, marks not tab stops). At 1280 px the status message or counts now come before the plan in frames 3, 4, 5 and 10. Not testable in a static frame |
| G10 | Fixed, by a stated rule | Legend and the note under the frame 4 heading: overlapping marks become one mark with a plus that opens a short list; a shop at the center sits beside the square. Not drawn |
| G11 | Fixed | Chain facts on rows are an unboxed italic line reading "size only, not scored"; certifications and concerns stay boxed. The legend states the difference |
| G12 | Fixed | `why.md` now lists which frames link to the method and which do not. Links added to frames 5 and 7 by G1 and G7 |
| G13 | Fixed | Frame 1 at 360 px now carries the time, cost and "nobody pays" sentence |
| G14 | Fixed | Frame 8 at 360 px: link to the privacy and cost view added to the link box (also added at 1280 px, where the top bar already had it) |
| G15 | Fixed | Legend and the frame 4 note say which of the five sells-it levels are solid and which dashed |
| G16 | Fixed | Left-off summary in frame 4 no longer counts a top-10 cut: 7 not a shop, 4 do not sell it, 2 too far, 1 third branch |
| G17 | Fixed | Frame 8 table: "Nearby" and "Farther" are separate rows; farther says "no separate figure". Legends say the same |
| G18 | Fixed | New frame 6c: the card for shop number 10, whose "How close" line says an unknown distance adds nothing and is missing data, not a finding. Score left at 0.40. The rule itself is a placeholder, labeled so |
| G19 | Fixed, partly a guess | New frame 10c: arriving while the budget is spent, labeled a guess because whether the site can know beforehand is undecided. Link rows of frames 10 and 10c gain dispute and the exclusion. The IV-F3 coverage row now lists every place the name appears |
| G20 | Fixed | Frames 6, 6b, 6c: "none in our set ... nothing on file, not checked and clear" |
| G21 | Fixed | Frame 3: "Usually about 3 seconds. The slowest of 20 measured searches took about 5." |

New frames in this round: 2c, 6b, 6c, 10c (18 pairs of frames in all).

Checks run after the fixes: opening and closing counts matched for the 15 tags counted; 36 captions; no anchors, images, external addresses or stale phrases found by search. Not done: nothing was rendered in a browser, and nesting, duplicate ids and colors were not checked by machine (no ids were added; the one color value added, `#555`, was already in use).

Permission checks refused two shell commands in this round. The first was a script that would have inserted frames 2c, 6b, 6c and 10c; the same frames were then added with the file-editing tool. The second was a combined check script; parts of it were then run as single searches. Both are reported to the lead agent.
