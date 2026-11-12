Verdict: passes with gaps. No function in IV-D is blocked at either width and no IV-F rule is plainly broken; 17 gaps found (0 block a visitor, 3 mislead, 14 minor).

# WF3 Evidence: independent check

Checked against `inventory.md` and the output rules only. Nothing was rendered: fit at 360 px and 1280 px is reasoned from the markup and CSS. Line numbers are in `wireframe.html`; where two are given, the first is the 360 px frame and the second the 1280 px frame.

## Gaps

| # | What is wrong | Where | Inventory item or rule | Severity |
|---|---|---|---|---|
| G1 | The site's own claims are drawn with the solid "Sourced" bar, which the legend defines as "an outside source says so; address and date given". No outside source is given for: no paid placement, anyone can dispute, Amazon is removed, what the site misses, what is sent, no cookies, the license. | Legend line 99. State A lines 106 to 108 / 136 to 138. State K lines 793, 808, 822, 828, 847, 849 / 871, 886, 900, 906, 925, 927 | IV-F12 (honest about what a statement rests on); `why.md` "Sourced: an outside source says so" | Misleads |
| G2 | No outside party is named anywhere. Bracketed "[named here]": search index (K1), search provider, language-model service, two hosts (K4), code host (I3). Role only, with no bracket: states A, B, D, J. The inventory names all of them, and the output rule bars real names only for shops. Also, the state B table "Who receives it" leaves out the hosts (which get the IP address) and the model provider the language-model service routes to. | Lines 164 to 167 / 194 to 197 (B); 592 / 660 (I3); 793 / 871 (K1); 831 to 833 / 909 to 911 (K4) | IV-D16, IV-B2, IV-B14, IV-C13, IV-F2 | Misleads |
| G3 | At 360 px the comparison table in state H never names the shop being compared. The names are only in the header row, and `.n .hd{display:none!important}` hides it; cells say "This shop" and "Shop above". With "The shop below" or "Another shop..." chosen, the label "Shop above" would be wrong and no name is shown. | Line 492 (hidden header), 493 to 497, 500; CSS line 50 | IV-B7, IV-D9, IV-F10 | Misleads |
| G4 | Other facts that exist only in header rows are lost at 360 px: the four weights on result rows (states D, E, F, G); "Place by score" in state F, where rows read 1, 2, 3, 5 with no note (state E has a footnote, F does not); the later run's date in K1; "Value x weight = adds" in H; both column headings in C (`keep` does not override the rule); column meanings in I2. | Lines 261, 323, 370, 401, 784, 481, 220, 574; CSS line 50 | IV-F10, IV-D14, IV-D17 | Minor |
| G5 | The chain fact and the association membership use the same rounded pill and differ by words only. Membership is one of the six certification kinds (IV-C6), so a chain fact can be mistaken for a certification. `coverage.md` admits this. | Lines 265 and 268 / 292 and 295; 703 and 704 / 744 and 745 | IV-F8 | Minor |
| G6 | Keyboard and screen reader use is stated only in the state C note (nothing animates; what a screen reader hears). Nothing is said about focus order, the selected control (shown by black fill only), or a text form of the statement kinds. Sourced and measured statements carry their kind by bar style only ("B Corp", "2.1 mi"); judged and nothing-found happen to say it in words. | Note line 213; rows 262 to 270; CSS lines 24, 28 to 31 | IV-F11 | Minor |
| G7 | No state draws a nearby shop with unknown distance or missing coordinates, though K2 says "Distance unknown: said so on the shop's record". Its row, its place on the 25 mile strip, its closeness value and its place under "Order by Distance" are not shown. | K2 line 802 / 880; state E lines 314 to 320 | IV-C3, IV-D4, IV-D7, IV-F7 | Minor |
| G8 | Only one opened record is drawn: a nearby shop with a concern. No opened record for an online shop (the number behind "fixed middle value" is never shown) or for a shop with a certification (its source and date appear only in state J). | State H lines 470 to 543; rows 262, 263 | IV-D9, IV-D10, IV-F4, IV-C5 | Minor |
| G9 | State K is drawn only as reached after a search. From state A (top bar: Ask, This site's record) a visitor lands on a page whose top bar is Shops, Sources, This site's record: no Ask tab, two tabs with nothing behind them, and a "Your last search" row with no search. States H, I and K have no "Change the search" control. | Lines 86, 779 / 857, 818 / 896 | IV-D20, IV-A8, IV-A10 | Minor |
| G10 | The form reopened by "Change the search" is not drawn, and nothing says whether the zip is still filled in or must be typed again. State L says "The form is as you left it" and its note says "with the form still filled in", but no form is drawn in L, and L shows the Shops tab as selected with no answer. | Lines 250, 937, 940, 957, 965 | IV-D20, IV-F1 | Minor |
| G11 | The dispute path is drawn only as filled in from Example Mart's concern. The entry from the state A link ("How to dispute, and its limits") and the state D footer ("Dispute something"), with nothing chosen yet, is not drawn. | Lines 107, 272, 587 to 599 | IV-D12, IV-D13, IV-A9 | Minor |
| G12 | State G covers "no nearby", "nothing matched" and "own filter". The case "nearby shops exist, no online shops" is not drawn. | Lines 398 to 425 | IV-C16, IV-B16 | Minor |
| G13 | "Order by Distance" on the full mixed list is not defined: state F says online shops stay in score order, but not where they sit among nearby shops. "Order by Name" is a control only (the coverage table says so). | Lines 259, 369 | IV-D5 | Minor |
| G14 | The statement kinds are used inconsistently. Row 9 "Not confirmed: the model did not get to judge this one" has the dashed "Judged" bar. "About whom" and "Final or open" are solid (sourced) in I1 and double (measured) in I2. The legend says "one of four kinds" and lists five. | Lines 270, 563 to 564 vs 575 to 578, 98 to 99 | Self-consistency; `why.md` kinds table | Minor |
| G15 | The same control on the same online shops is "Shop's site" in state D and "Go to the listing" in state F. State E is labeled "Nearby only" but shows "Nearby and more distant 5"; "Nearby 4" is never drawn applied. | Lines 262 vs 371; 306, 310 | IV-D6, IV-D8, self-consistency | Minor |
| G16 | At 360 px state K reads K1, K2, K3, K5, K4, K6, against its own numbering and the order `why.md` gives. The K3 table pairs "business name 1 of 14" with "domain 1 of 39" in one row, though the two sets differ in size. | Lines 807 to 827, 811 to 812 | `why.md` step 9; IV-C14 | Minor |
| G17 | `coverage.md` row IV-E1 says the state D People cell "would read N concerns counted, years". No such text is in the wireframe; state D shows only the single-concern form. | Line 268; `coverage.md` line 60 | IV-E1, IV-D11 | Minor |

## Coverage rows (69)

All 69 items of IV-B, IV-D, IV-E and IV-F have a row; none is missing. The header counts in `coverage.md` (9 not handled, 6 partly) are right.

| Result | Count | Rows |
|---|---|---|
| Shown as claimed | 55 | All rows not listed below. Includes the 6 the table itself marks "Partly" (IV-B15, IV-B18, IV-E6, IV-E8, IV-E11, IV-E14), which match what is drawn |
| Partly shown, beyond what the row admits | 5 | IV-B7 (G3), IV-B14 and IV-D16 (G2), IV-D4 (G7), IV-E1 (G17) |
| Claimed but not shown | 0 | |
| Not handled | 9 | See next table |

Shown as claimed but with a gap noted: IV-D5 (G13), IV-D9 and IV-D10 (G8), IV-D12 and IV-D13 (G11), IV-D20 (G10, the row admits the form is not drawn), IV-F8 (G5, the row admits it), IV-F10 (G3, G4).

| Not handled | Does the reason hold? |
|---|---|
| IV-E3 suggested shops | Yes. Undecided by the operator; IV-E items are not required |
| IV-E4 consumer co-ops | Yes. Proposed only |
| IV-E5 price level | Yes. Proposed; no data |
| IV-E9 wider kinds of places | Yes. Proposed only |
| IV-E10 favoring independents | Yes. Undecided; K2 shows today's rule |
| IV-E12 curated directory | Yes. Proposed direction |
| IV-E13 daily totals | Yes. Deferred |
| IV-F9 suggested shops never mixed | Yes. The rule applies only if suggested shops are built; none are drawn |
| IV-F11 keyboard, screen reader, motion | Partly. A static file cannot show it, but it could state more than it does (G6) |

## IV-F rules, one by one

| Rule | Finding |
|---|---|
| IV-F1 zip | Kept in what is drawn: results name "Olympia, WA", never the zip; "never put in the page address" is stated (lines 166, 847). Open point G10 |
| IV-F2 no third party | Kept: the file fetches nothing, no map, K4 says "Anyone else: No one". The code host is reached only when the visitor opens the form, and what it learns is stated (line 611). Parties are placeholders, not names (G2) |
| IV-F3 Amazon | Kept. 12 occurrences, all explanation of the exclusion; list below. No brand of the exclusion set appears |
| IV-F4 placement explained | Kept for the drawn record (state H) and in state J. Not drawn for an online or certified shop (G8) |
| IV-F5 disputable | Kept: Dispute on each score line, chain line and certification line of H, each concern in I, each row of J; six kinds in I3 |
| IV-F6 no verdict words | Kept. Concern text is quoted with source and date. Words used for shops (likely, possibly, major, standard, minor, place, score) are the inventory's own. The state D cell "1 concern counted: labor, 2023, [source]" is a count, not a verdict |
| IV-F7 unknown is not bad | Kept: "Nothing found" scores 0.50 in every worked sum, is said to be the common case, and the chain footnote is present (line 271). Open point G7 |
| IV-F8 chain fact | Weakened (G5) |
| IV-F9 | Does not apply: no suggested shops |
| IV-F10 360 px | Likely fits. No `table` elements and no fixed widths inside the 360 frames; `.t` rows stack as blocks, `.r` rows use a 24px / 1fr / 44px grid, bars and pills wrap. Longest unbroken run is about 33 characters at 12px (line 372), under the 256 px column. Information is lost through hidden headers (G3, G4). State D at 360 is long (9 shops of about 7 lines), which `why.md` admits |
| IV-F11 | Stated in one note only (G6). "Nothing animates" covers reduced motion |
| IV-F12 honest | Thin, guess, failed and budget-spent are all drawn, with measured accuracy on A, D, E, F, K1. Weakened by G1 |
| IV-F13 miles | Kept everywhere |
| IV-F14 no excerpts | Kept. Only listing titles, source titles, site names and reasons |
| IV-F15 no ads | Kept |
| IV-F16 credits | Kept: K6 and the footers of A and D |

"Amazon" occurrences (line, context, kind):

| Lines | Context | Kind |
|---|---|---|
| 87, 117 | Heading: "Amazon is never among them." | Explanation |
| 108, 138 | "Amazon and every business it owns or has owned are removed from every answer" | Explanation |
| 781, 859 | Link: "K3 Why no Amazon" | Explanation |
| 807, 885 (twice each) | Heading: "Why no Amazon, and what counts as Amazon" | Explanation |
| 808, 886 | "Amazon and every business it owns or has owned never appear" | Explanation |

## What a visitor cannot do (IV-D1 to IV-D21, both widths)

No function fails at one width only: both frames of every state hold the same markup. Functions that need a step the wireframe never shows:

| Function | Missing step | Gap |
|---|---|---|
| IV-D4, IV-D7 | A shop with unknown distance | G7 |
| IV-D5 | Name order; distance order on the mixed list | G13 |
| IV-D9, IV-D10 | Opened record of an online or certified shop | G8 |
| IV-D12, IV-D13 | Starting a dispute without coming from a shop's record | G11 |
| IV-D14 to IV-D19 | Reading state K before any search | G9 |
| IV-D16 | Learning who the parties are | G2 |
| IV-D20 | The reopened form | G10 |

At 360 px only: IV-D9's comparison loses the other shop's name (G3).

## States

All required states appear at both widths: arriving (A), asking (B), waiting (C), results of both kinds (D, with E and F narrowed), thin or empty (G), one result opened (H), concern and dispute (I), trust, cost and privacy (K), budget spent (L), plus sources (J). The visible text of the two frames is identical in all 12 states (compared by script). What differs is what the CSS hides: header rows at 360 (G3, G4) and inline labels at 1280, where the headers carry the same words.

## File rules

| Rule | Finding |
|---|---|
| Well-formed | Yes: every tag closes in order; no block element inside a paragraph (checked by script) |
| No images, external files, links out | None. No `img`, `a`, `link`, `src`, `href` or `url()`. Links are underlined text |
| Scripts | One function that shows and hides states; 13 buttons call it |
| Grays only | Yes: #000, #555, #888, #ccc, #eee, #fff |
| System font | Yes: `system-ui, sans-serif` |
| Placeholder shops say "Example" | Yes, all 14, and all 9 invented sources and all left-out sites |
| Real names present | B Corp, 1% for the Planet (certification kinds), US Census Bureau, GeoNames (credits), AGPL-3.0, Olympia WA and zip 98501 (place), Amazon. None is a shop |
| Inventory's outside services | Brave Search, OpenRouter, Cloudflare, GitHub Pages, GitHub: 0 occurrences each (G2) |

## Verified as correct

- 55 of 69 coverage rows shown as claimed; 5 partly; 0 claimed but not shown; 9 not handled, 8 with a reason that holds fully.
- 16 of 16 IV-F rules: 14 kept or not applicable, 1 weakened (IV-F8), 1 only stated (IV-F11).
- 21 of 21 functions can be completed at both widths; 7 groups need an undrawn step.
- 12 of 12 states have both frames with identical text.
- 12 of 12 "Amazon" occurrences are explanation.
- 9 of 9 scores in state D, 1 in state G and the state H sums and differences agree with the stated weights (0.25, 0.30, 0.30, 0.15) and the 25 mile rule.
- Counts agree across states: 4 nearby + 1 more distant + 4 online = 9; 11 left out (5 + 4 + 2); 14 "nothing found" places; 3 shops with a certification; 6 outside statements.
- Inventory figures match where quoted: 33,791 zip areas, 0.6 mile, 10 and 30 and 100 miles, 30 days, 30 a minute, one minute, 98%, 62 to 64%, 71%, 98.4%, 80% (53 of 66), 40% (58 of 146), 31%, 33 to 35%, $0.023, $0.026, $65 for 3,000, 28 entries, 14 sources, 41 chains, 39 domains, 14 names, band limits $1,000,000 and $100,000.

## Fix round

Written by the fixing designer, not the checker. 13 gaps fixed, 4 partly fixed (G6, G9, G13, G15), 0 left alone. Every change is in both the 360 px and the 1280 px frame. Nothing was rendered; the line numbers above are now stale, so places are given as states and parts. Checked by text search after the edits: tags balance, no "[named here]" is left, grays only, `wireframe.html` is about 143 KB.

| Gap | What it was, in short | Result | Where, or why not |
|---|---|---|---|
| G1 | Site's own claims drawn as "Sourced" | Fixed | A fifth kind, "This site says" (thin bar plus those words, with a link to a public file), in the state A legend. Used for the state A zip line and three claim rows, and in state K parts K1 (what it misses), K2 (counted from), K3, K4, K5 and K6. K3's per-entry ownership sources stay "Sourced" |
| G2 | No outside party named; state B table incomplete | Fixed | Brave Search, OpenRouter, Cloudflare, GitHub Pages and GitHub named in states B, G, I (part I3), J and K (parts K1, K4). State B table gains the model provider and a row for the IP address and the hosts. Reading used: the bar on real business names applies to shops |
| G3 | Comparison at 360 px never names the other shop | Fixed | State H: both shop names and places are in every line's inline label and in the heading; the "Compare with" control shows places and says the names follow the choice |
| G4 | Facts held only in header rows lost at 360 px | Fixed | Weights in the inline labels of every result row (states D to G); state F footnote explains "place by score"; K1 label carries the later run's date; state H "Value x weight = adds" label; state C headings now shown at 360 px; part I2 "How it was counted" label; K3 and K4 cell labels |
| G5 | Chain fact and membership share one pill | Fixed | The rounded outline now means chain size only ("Size, not a rating"). Membership is drawn as sourced, reading "Certification, never scored" (states D, E, J, part K2, both legends) |
| G6 | Keyboard and screen reader use barely stated | Partly fixed | State D's designer note gives focus order and says the selected control and each statement's kind are announced as words; certification and distance cells now say who or how in visible text. Still stated rather than drawn: a static file cannot show it |
| G7 | No shop with unknown distance drawn | Fixed | State E: a variant box outside the 9 shops, with its row, its absence from the strip and its place under "Order by Distance". Its score and closeness value are brackets: the inventory does not give the value |
| G8 | Only one opened record | Fixed | State H: "A second record", Example Cookware Works, online with two certifications; sources and dates, online closeness 0.50, sum 0.775 shown as 0.78, and why it is ahead of place 2 |
| G9 | State K only as reached after a search; no way to search again from H, I, K | Partly fixed | "Ask" is now in the top bar of every state. The before-search form of state K (top bar of two tabs, "No search yet" row) is stated in the K note, not drawn as its own frame, to keep the file small |
| G10 | Reopened form not drawn; zip refill unstated | Fixed | State B, second box: the reopened form, product filled in and zip empty, because the zip is never recalled. State L no longer says "the form is as you left it"; its "Search again" reuses the place already worked out, which is a guess labeled in the state L note |
| G11 | Dispute path only as prefilled | Fixed | State I, part I3: the box "Reached with nothing chosen", four empty fields |
| G12 | "Nearby shops, no online shops" not drawn | Fixed | State G, part G4 |
| G13 | Distance order on the mixed list undefined; name order a control only | Partly fixed | A rule this designer chose, stated in state D under the rows: known distances, then unknown, then online in score order; name order A to Z. Neither full list is drawn (coverage row IV-D5 is now "Partly") |
| G14 | Statement kinds used inconsistently; legend said four, listed five | Fixed | "Not confirmed" row is now "Measured" (counted as not judged), not "Judged"; part I1 kind, about whom and final or open are "Measured" like part I2; legend says five kinds plus the chain mark |
| G15 | Two names for one control; state E mislabeled | Partly fixed | Online rows say "Go to the listing" in every state, nearby rows "Shop's site", explained in state D. State E is labeled "Nearby and more distant"; "Nearby 4" is described in its footnote, not drawn |
| G16 | State K out of order at 360 px; K3 rows pair unlike sets | Fixed | K5 moved after K4, so both widths read K1 to K6. K3 has one business-name row and one web-domain row, each with a kind |
| G17 | Coverage row IV-E1 claimed text not in the wireframe | Fixed | `coverage.md` row IV-E1 now says the several-concerns form of the state D cell is not drawn |
