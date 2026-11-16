# Interface prototype: design spec

Status: final for the build. Builders follow this file plus the six digests in `handoff/ui-prototype/` (rd1 to rd6). Output: one file, `docs/ui-prototype/prototype.html`. Pixel counts are calculated from the sums printed here, not rendered, except where a figure is marked rendered or measured. Text widths are estimated at half an em a character (6 px at 12 px, 6.5 px at 13 px, 7 px at 14 px); a chip is its text plus 14 px (a finding chip 15 px), with 6 px between chips. Short names used throughout: wide = 1280 px and up, medium = 1024 to 1279 px, narrow = under 1024 px.

## 1. Direction

1. One table of every shop is the page. One row per shop, one column per criterion, the same columns for nearby, farther and online shops (built on proposal A, the comparison grid).
2. Three parts never change: the list, a filter rail on its left, and one side panel on its right. The panel holds one opened shop, a compare of 2 to 4 shops, the chosen shop, or the facts about the search. The list stays on screen in every case at wide.
3. At narrow the same parts restack: each table row becomes a three-line block, the rail becomes a sheet, the panel becomes a sheet. Same markup, and the same wording except where this spec gives a narrow form.
4. Each row shows the score as a number and a four-part bar, People and Planet as small bars around a middle tick, and one Record cell that says "unknown" or shows the sourced facts. Unknown is drawn the same for every shop and is never a low mark.
5. Sorting and filtering reorder and hide rows. They never change a score, a rank label or the "Why this score" sum; line 2 of "Why here" follows the shown order (section 5).
6. Default view keeps today's sections (Near you, Farther away, Online) as bands of one table, sorted by score. The departures (D1 to D4) are listed in section 13 and outlined on screen with `marks=1`.
7. The main screen is results at 1280x800 with the sparse set: all 19 shops, 9 facts each, no scrolling.

## 2. Views and states

### Hash scheme

The hash is the only state. Every control writes it and re-renders; a `hashchange` (Back, Forward, a typed hash) re-renders too. Unknown keys are ignored and a bad value falls back to the default, and a fallback is written back to the hash, so the next change builds on what shows. Typed product text and the zip are never written to the hash, to storage or to any URL.

History:

- A view change, opening a panel and opening a sheet push an entry; every other change replaces the current one, including "Previous shop" and "Next shop".
- Close, "List", "Back to the list" and a sheet's Close step back to the plain list when that is the entry under the layer, so the next browser Back never reopens what was just closed; otherwise they replace.
- Picks and list settings are selections, not places: an entry reached by Back or Forward takes the current `data`, `place`, `theme`, `sort`, `group`, `kind`, `f`, `within`, `people`, `planet`, `cmp`, `ref`, `ties` and `only`, so Back only closes or reopens panels and sheets, whatever view the entry belongs to (a typed hash is taken as is).
- When the data set differs, the entry's open shop is carried by domain and a note on a certification or finding closes, as with the Data switch.
- A Data or Place switch, or a "Remove", that closes the open panel steps back to the plain list under it the same way Close does.
- When a panel closes for any reason the list returns to the scroll position it had when the panel opened.

| Key | Values (default first) | Meaning |
|---|---|---|
| `view` | `start`, `searching`, `results`, `about` | Page view |
| `data` | `sparse`, `filled` | Made-up data set |
| `place` | `metro`, `rural` | Which made-up search: metro is "cast iron skillet" in Example City, ST; rural is "wool socks" in Example Township, ST |
| `theme` | `auto`, `light`, `dark` | Color theme |
| `marks` | `0`, `1` | `1` outlines every D1 to D4 element with its tag, and runs the data and wording self-checks, which report to the console |
| `state` | absent by default (no value means the normal view); with `view=start`: `typing`, `err-product`, `err-zip`, `err-zip-unknown`; with `view=results`: `empty`, `thin`, `no-online`, `no-near`, `failed`, `rate`, `budget` | Canned state |
| `sort` | `score`, `distance`, `name`, `sells`, `people`, `planet` | Row order |
| `group` | `kind`, `none` | Bands by kind, or one list |
| `kind` | comma list of `near`, `far`, `online` (default all three) | Kinds shown |
| `f` | comma list of `record`, `cert`, `finding`, `nofinding`, `chain`, `nochain`, `sure` (default empty) | Filters, combined with AND |
| `within` | `any`, `1`, `3`, `5`, `10`, `25` | Miles limit. Any value but `any` keeps near and farther shops at or under it and hides a near or farther shop whose distance is not given. Online shops stay unless Online is off |
| `people`, `planet` | `any`, `up`, `down` | `up` keeps shops with at least one scored certification in that part; `down` keeps shops with at least one finding counted in that part. The test is the fact, not the part's value, so a shop with both (filled n3) passes either |
| `panel` | `none`, `shop`, `compare`, `chosen`, `search` | Side panel content |
| `shop` | a shop id | The shop for `panel=shop` and `panel=chosen` |
| `sec` | with `panel=shop`: `score`, `record`, `where`; with `view=about`: `order`, `accuracy`, `privacy`, `amazon`, `cost`, `dispute`, `credits` | Scroll target or About section |
| `cmp` | comma list of 0 to 4 shop ids | Shops picked for compare |
| `ref` | a shop id in `cmp` (default: the first) | The shop the others are compared to |
| `only` | `all`, `diff` | Compare shows all rows, or only rows that differ |
| `dispute` | `none`, or one of `sells`, `people`, `planet`, `distance`, `chain`, `cert1`, `cert2`, ..., `finding1`, `finding2`, ... | With `panel=shop`: which Dispute control has its note open (one at a time) |
| `sheet` | `none`, `filters`, `edit` | `filters` opens the rail as a sheet wherever the rail is folded (narrow, medium, and wide while `panel=compare`); it does nothing while the rail is docked. `edit` opens the search form as a sheet at narrow |
| `ties` | `fold`, `open` | Narrow only: tie groups folded or open |

Shop ids are the section letter in lower case plus the rank the search gave, for example `n4`, `f5`, `o10`. Near you and farther away share one numbering, gaps are kept (sparse metro has no `n9`), and nothing is ever renumbered. An id names a shop inside one made-up search only: the same shop has a different id in the other data set, so the Data switch carries `shop`, `cmp` and `ref` across by domain (section 10).

Fallbacks for ids that do not fit:

| Case | Result |
|---|---|
| `panel=shop` or `panel=chosen` with a `shop` id that is not in the set (for example `n9`) | `panel=none` |
| `cmp` with an id that is not in the set, a repeat, or a fifth id | That id is dropped |
| `panel=compare` with fewer than 2 ids left in `cmp` | `panel=none`; the picks stay |
| `ref` that is not in `cmp` | The first id in `cmp` |
| `dispute` naming a control the shop does not have (for example `finding2` on a shop with one finding) | `dispute=none` |

Screenshot rule: a state loaded by hash holds still. `view=searching` moves on to results (after 1.2 s) only when the Search button started it in this page session, or when Back or Forward lands on a searching entry this page wrote. A shop id stays in the hash only while `panel=shop` or `panel=chosen` shows it.

### Views and states

| View or state | Hash (defaults omitted) | What it shows | Jobs (J1 search, J2 scan results, J3 evaluate tradeoffs, J4 select by criteria) |
|---|---|---|---|
| Start | `#view=start` | Headline, search form, what-is-sent note, cost line, prototype note; from 1024 px, two sample results beside them. At wide the filter rail is already live, with no counts, and its choices carry into results | J1, J4 |
| Typing | `#view=start&state=typing` | Product filled, zip field empty, the worked-out place line and the "pressing Search sends" line shown as if a zip had just resolved, in place of the what-is-sent note (tagged "Prototype: shown without a zip") | J1 |
| Form errors | `#view=start&state=err-product` (also `err-zip`, `err-zip-unknown`) | The field error under its field, the field marked invalid and focused | J1 |
| Searching | `#view=searching` | Status line, the four steps a search takes, what was sent, table header with empty bands. No motion | J1 |
| Results | `#view=results` | Facts strip, rail, table (section 4). `&place=rural` gives 4 near, 3 farther, 10 online. `&data=filled` gives the full set | J2, J3, J4 |
| Results, re-sorted | `#view=results&sort=distance&group=none` (any `sort`, `group`, `kind`, `f`, `within`, `people`, `planet`) | Same table, reordered or narrowed. Part sorts add the sort note row | J2, J4 |
| A shop opened | `#view=results&panel=shop&shop=n4` (`&sec=record` jumps to the finding; `&dispute=finding1` shows its dispute note) | Panel with the shop in full (section 5). The list stays, its row marked | J3, J4 |
| Shops picked | `#view=results&cmp=n1,n4,o1` | Picked rows sit in a "To compare" band at the top with the Compare button | J3 |
| Compare | `#view=results&panel=compare&cmp=n1,n4,o1` (`&ref=n4`, `&only=diff`) | Panel with 2 to 4 shops as aligned columns; the list shows each shop's difference from the compared-to shop (section 6) | J3, J4 |
| Chosen | `#view=results&panel=chosen&shop=n1` | Panel with the choosing step: address to copy, website, what the site does not know, a fallback shop | J4 |
| About this search | `#view=results&panel=search` | Panel: how the product was read, search wording, counts, what was left out and why, cost, the plot | J3 |
| Filtered to nothing | `#view=results&f=cert&kind=near` | Table header stays; one message row with a "Remove" button per active filter and "Clear filters" | J4 |
| Nothing found | `#view=results&state=empty` | Message block in place of the table: nothing matched, what to try, the cost line (the search ran) | J1, J2 |
| Thin | `#view=results&place=rural&state=thin` (`&panel=search` shows the box text in the panel) | Near you band reads "none within 30 mi"; Farther away and Online hold rows. The "Why so few nearby?" box is the one row under the empty Near you band header: open at wide and medium (88 px), one 44 px button at narrow that opens About this search, where the same text comes first | J1, J2 |
| One kind empty | `#view=results&state=no-online` (also `no-near`) | The empty band says so in its header; the other bands hold rows | J2 |
| Search failed | `#view=results&state=failed` | Message block, "Try again" button, the form keeps its text | J1 |
| Too many requests | `#view=results&state=rate` | Message block and a "Try again" button | J1 |
| Search budget spent | `#view=results&state=budget` | Message block marked as a wording proposal; Search button is disabled and keeps its label, so the top bar does not shift (the Edit sheet reads "Search (paused)"); the message says "Search is paused."; About still works | J1 |
| Method and trust | `#view=about&sec=order` (other `sec` values above) | One page, section index on the left: how the order works, sold it in tests, privacy, why Amazon never appears, cost, disputes, credits | J3, J1 |
| Sheets | `#view=results&sheet=filters`, `&sheet=edit` | The rail as a sheet (narrow, medium, and wide during compare); the search form as a sheet at narrow (product filled, zip empty) | J1, J4 |

What typing does in the prototype: the product field accepts 1 to 120 characters and the zip field any five digits; `00000` shows the unknown-zip error. Search always returns the set picked by `data` and `place`, and the top bar then shows that set's product ("cast iron skillet" or "wool socks"), whatever was typed. The zip stays in its field until the page is reloaded and goes nowhere else.

## 3. Layouts

### Breakpoints

| Width | Rail | List | Panel |
|---|---|---|---|
| Wide, 1280 and up | Docked left, 200 px. While `panel=compare` it folds to the "Filters" button in the facts strip, which opens it as a 232 px sheet from the left (`sheet=filters`) | Table, 32 px rows. Full columns with no panel; narrowed columns beside a panel | Docked right: 464 px for shop, chosen and search; 840 px for compare |
| Medium, 1024 to 1279 | Sheet from the left, 232 px, opened by "Filters" in the facts strip | Table, full columns (Shop takes the slack); narrowed columns beside a docked shop, chosen or search panel, as at wide (Shop 184, Record 200 to 292) | Shop, chosen and search dock right at 464 px beside the narrowed list. Compare (840 px) is a drawer over the list from the right, under the facts strip (which stays readable and clickable however many lines it wraps to), capped at the viewport less 32 px, its shadow cast to the left |
| Narrow, under 1024 | Full-screen sheet opened by the "Filters" chip | Each row is a three-line block, 70 px; column header hidden from sight | Full-screen sheet |

Page gutter is 16 px at every width. At wide and medium the page is one screen tall: top bar and facts strip are fixed, and the rail, the list and the panel each scroll on their own. The facts strip is one line at wide and may wrap to two at medium. At narrow the page scrolls; the top bar and the chip row are sticky.

Footer: 12 px text, one line (28 px tall) where the width allows and wrapping where it does not. At wide and medium it is the last thing in the list column's scroll area, after the table: the column is one scrolling box that holds `main` and then the `footer`, as siblings. On Start and About, and at narrow, it ends the main column. At medium and narrow it also holds the Place and Theme switches.

Start and About use the same shell. Start: the top bar holds only the wordmark, the Prototype group and About; the main column (640 px at most, left-aligned, as on the live site) holds the headline, the form (three columns from 768 px, stacked below), the notes and the footer; the rail sits in its usual place at wide. About: the section index takes the rail's place (a select at narrow) and the text runs in one 640 px column. On every other view at wide and medium the form sits in the top bar: inputs 32 px tall with 16 px text, no placeholders, and short visible labels in 12 px to the left of each field ("Looking for", "Zip"); the accessible names stay "What are you looking for" and "Zip code". At narrow the form lives in the Edit sheet with 44 px inputs and the full labels above them.

Top bar widths on results and searching (one row, 44 px tall, inside the 16 px gutters):

| Part | Wide (1,248 usable at 1280) | Medium (992 usable at 1024) |
|---|---|---|
| Wordmark (creek mark and name) | 152 | 152 |
| Gap | 16 | 16 |
| "Looking for" label with its gap | 72 | 72 |
| Product input (flexes between 200 and 280) | 264 | 278 |
| Gap | 12 | 12 |
| "Zip" label with its gap | 24 | 24 |
| Zip input | 72 | 72 |
| Gap | 8 | 8 |
| Search | 72 | 72 |
| Gap (takes any slack once the product input reaches 280) | 16 | 16 |
| Prototype group | 480: padding 16, "Prototype" 54, Data 132, Place 132, Theme 114, gaps 32 | 210: padding 16, "Prototype" 54, gap 8, Data 132. Place and Theme sit in the footer |
| Gap | 16 | 16 |
| About | 44 | 44 |
| Sum | 1,248 | 992 |

### R-1280. Results, 1280x800 (`#view=results`, sparse metro)

```
|16|<--- rail 200 --->|16|<------------------------------ grid 1032 ------------------------------>|16|
+-----------------------------------------------------------------------------------------------------+ 0
| ~ nottheriver  Looking for [cast iron skillet     ] Zip [     ] [Search]   Prototype: Data[Sparse|Filled] Place[Metro|Rural] Theme[Auto v]  About | 44
+-----------------------------------------------------------------------------------------------------+ 44
| Example City, ST · 9 near you (10 mi) · 0 farther · 10 online · Sold it in tests: about 62 to 64% of nearby shops, 98% of ... (one line)  [About this search] | 32
+--------------------+--------------------------------------------------------------------------------+ 76
| Group              | [] #    Shop                  Sells it        People  Planet  Distance   Score v          Record                  | 36
| (By kind) One list |                               13 likely or named 18 at 0.50 17 at 0.50 0.4 to 6.3 mi 7 tied at 0.63 unknown for 16 of 19 |
| Show               +--------------------------------------------------------------------------------+ 112
| [x] Near you     9 | Near you · 9 shops within 10 mi of the center of your zip area · Sells it is a guess here: call first | 24
| [x] Farther away 0 | [] N1  Example Kitchen Supply    Likely, a guess  0.4 mi NE  --o--  --o--  [###|##|##|##] 0.70     unknown                | 32
| [x] Online      10 | [] N2  Example Restaurant Supply Likely, a guess  1.3 mi S   --o--  --o--  [###|##|##|##] 0.69     unknown                | 32
| Record             | [] N3  Example Cookware and Cu.. Likely, a guess  2.2 mi E   --o--  --o--  [###|##|##|##] 0.69     unknown                | 32
| [ ] Any record   3 |
| [ ] Has a certif. 1| [] N4  Example Home Center       Likely, a guess  0.8 mi SE  -x|--  --o--  [###|# |##|##] 0.62     |Governance 2022 :Chain, 2,347 stores: | 32
| [ ] Has a finding 2| [] N5  Example Hardware Dealers  May, a guess     1.9 mi W   --o--  --o--  [## |##|##|##] 0.56     unknown :Chain, 5,000+ stores, dealer-owned: | 32
| [ ] No finding   17| [] N6  Example Hardware Dealers  May, a guess     3.6 mi NE  --o--  --o--  [## |##|##|##] 0.55     unknown :Chain, 5,000+ stores, dealer-owned: | 32
| [ ] On chain list 6|  ... N7, N8, N10: 3 rows                                                        | 96
| [ ] Not on list  13| Online · 10 shops · No address or distance · Sells it is read from the shop's listing | 24
| Sells it           | [] O1  Example Trail Outfitters  Named in listing online      --o--  --|=>  [###|##|###|#] 0.70     (Climate Label certified) :Chain, 195 stores: | 32
| [ ] Likely or named 13| [] O2  Example Cast Iron Works   Named in listing online      --o--  --o--  [###|##|##|#] 0.63 =7   unknown                | 32
|                    |  ... O3 to O10: 8 rows, O2 to O8 inside one tie bracket                         | 256
| Distance [Any v]   | About · Zip data: ... · Prototype with made-up shops. Nothing is sent anywhere.   | 28
| People [Any v]     +--------------------------------------------------------------------------------+ 796
| Planet [Any v]     |
| [Clear filters]    |
| Where · not to     |
|  scale past 10 mi  |
| (plot 152 x 152)   |
+--------------------+
```

- Width: 16 + 200 + 16 + 1032 + 16 = 1280. Columns: compare box 32, # 32, Shop 192, Sells it 120, People 70, Planet 70, Distance 80, Score 144, Record 292 = 1032. Past 1280 the slack goes to Record first, up to 440 px (the widest filled chip set on one line), then to Shop, so at 1440 no filled row wraps. The four part columns sit in the score bar's segment order, and each part column's head carries a 3 px underline in its segment color, so the head row is the bar's key.
- Height: top bar 44 + facts strip 32 + column header 36 + 2 band headers x 24 = 160. Left for rows: 640. Sparse metro needs 19 rows x 32 = 608 and the footer line takes 28, so all 19 shops and the footer show with 4 px spare. The Farther away band is not drawn when it is empty and Near you is not.
- No sparse metro row wraps at this width. The widest Record cells are O1 (274 px) and the two Example Hardware Dealers rows (270 px; rendered, about 278) in 280 px of cell. If rendered text runs wider than the estimate, each row that wraps costs 20 px: the first pushes the footer line into a 16 px scroll, and from the second on the last shop row is partly cut.
- Facts per row: rank with kind, name, sells-it level, miles and direction, People, Planet, score with its four-part bar, record, chain = 9.
- Filled metro (23 shops, 3 bands): 800 - 184 = 616. Eight rows are two-line (n3, n4, n6, n7, n8, o5, o7, o10, measured), so 16 rows show in full and the rest is one scroll inside the list.
- With shops picked, the "To compare" band header (32 px, sticky under the column header) costs one row.
- Rail, 724 px tall: Group 46, Show 90, Record 162 (six boxes), Sells it 42, Distance 46, People and Planet 98 (the legend, a one-line key to the micro-bar marks drawn in their own shapes, "[ring] unknown [solid] raised [hatch] lowered", whose title says each in full, then the two selects), Clear filters 24, seven gaps of 6, 8 px padding above and 4 below = 562; the plot block (label 20 + plot 152 + gap 8) = 180. Total 742: the plot's last 18 px is a scroll inside the rail. Two things print only when they apply and are outside this sum: the note under "Not on the chain list" (32 px, only while that box is ticked) and the plot's "not drawn" caption (16 px, only when a shop has no position). With either, the rail is taller than 724 px and scrolls on its own, the plot last.

### R-360. Results, 360x740

```
|16|<------------------- 328 ------------------->|16|
+--------------------------------------------------+ 0
| ~  cast iron skillet          [Edit] [Sparse|Filled] | 44 sticky
+--------------------------------------------------+ 44
| Example City, ST · 9 near you (10 mi) · 10 online | 40
| Sold it in tests: nearby 62 to 64%, online 98%    |
+--------------------------------------------------+ 84
| [Filters ] [Sort    ] [Group   ] [About       ]   | 44 sticky
| [none    ] [Score  v] [By kind v] [this search]   |
+--------------------------------------------------+ 128
| Near you · 9 within 10 mi · sells it is a guess   | 28
+--------------------------------------------------+ 156
| N1 Example Kitchen Supply      [####] 0.70 | [ ]  | 70
| 0.4 mi NE · Likely sells it, a guess       |      |
| unknown                                    |      |
| N2 Example Restaurant          [####] 0.69 | [ ]  | 90
| Supply                                     |      |
| 1.3 mi S · Likely sells it, a guess        |      |
| unknown                                    |      |
| N3 Example Cookware and        [####] 0.69 | [ ]  | 90
| Cutlery Supply - ...                       |      |
| N4 Example Home Center         [### ] 0.62 | [ ]  | 70
| 0.8 mi SE · Likely sells it, a guess       |      |
| |Governance 2022  :Chain, 2,347 stores:    |      |
| N5 Example Hardware            [### ] 0.56 | [ ]  | 90
| Dealers                                    |      |
| 1.9 mi W · May sell it, a guess            |      |
| unknown  :Chain, 5,000+ stores, dealer-owned: |   |
| N6 (90), N7 (70)                                  | 160
+--------------------------------------------------+ 726 (N8 starts at 726, cut at 740)
```

- Row grid: # 28, text 172, score block 84 (bar 44, gap 6, number 34; on a tied row the tie mark "={n}" sits under the number, at the right of line 2, so bars and numbers share one x on every row), compare box 44 = 328. Under 360 px the bar is 32 px and the score block 72.
- A record that is the one word "unknown" (no chain or association chip) ends line 2 as " · unknown" when line 2 has room for it (every row from 400 px; at 360 the shorter lines, such as "online · Named in listing"), and the row drops line 3 (52 px). Line 1 puts the #, the name and the score block in the first three columns. Lines 2 and 3 start at the row's left edge and span those three columns together (28 + 172 + 84 = 284 px). The compare box sits alone in the fourth column for the full row height. Lines: name 20, where and sells-it 18, record 20, padding 6 + 6 = 70.
- A name that does not fit 172 px takes a second line (20 px more, 90 in all) and is cut only after that, because the word after "Example" is what tells shops apart. At 360, N2, N3, N5 and N6 take two lines.
- What must fit in 284 px: the longest line 2, "0.4 mi NE · Likely sells it, a guess" (234 px), and the widest sparse Record lines (O1 274 px, the Example Hardware Dealers rows 270 px). No sparse metro Record line wraps.
- Height: 44 + 40 + 44 + 28 = 156. Left: 584. 3 rows x 70 + 4 x 90 = 570 runs to N7, so 7 shops show in full and the eighth starts. 9 facts each (the bar carries the four parts as one fact here).
- Filled set: every row has chips; long names and wide chip sets each add a line, so 6 shops (n1 to n6) show in full.
- Chip row: four chips, 44 px tall with 8 px gaps, each a 12 px label over a 13 px value with 8 px side padding. "Filters" and "About this search" are buttons as wide as their words; "Sort" and "Group" are native selects under their labels, at least 82 px wide so the widest values ("Distance" 56 px, "One list" 48 px) clear the arrow. Measured: Filters 51, Sort 82, Group 82, About 86 ("this search" is 70 px), 301 + 3 x 8 = 325 of 328, so the row never overflows or cuts a value. Under 360 px the row stays one line: Filters reads "Filters none" on one line, Sort and Group show their value only (each keeps its accessible name), and "About this search" moves to a link at the end of the summary line.
- The "About this search" chip opens `panel=search`. Place and Theme switches sit in the page footer at narrow; the Data switch stays in the top bar. The top bar shows the product only; the summary line under it starts with the place. With farther shops it reads "Example Township, ST · 4 near you (30 mi) · 3 farther · 10 online" and wraps to two lines.

### S-1280. A shop opened, 1280x800 (`#view=results&panel=shop&shop=n4`)

```
|16|<- rail 200 ->|16|<------- grid 552 ------->|16|<------------ panel 464 ------------>|16|
+-------------------------------------------------------------------------------------------+ 0
| top bar 44, facts strip 32                                                                 | 76
+---------------+----------------------------+--------------------------------------------+
| rail as R-1280| [] #   Shop      Score Record       | [< 4 of 19 >]                   [Close] | 56
|               | Near you · 9 within 10 mi · sells it is a guess, call first | Example Home Center (serif 20) |
|               | [] N1 Example Kitchen.. 0.70 unknown| N4 · Near you · 0.8 mi SE · Score 0.62   |
|               | [] N2 Example Restaur.. 0.69 unknown| [Choose this shop] [Add to compare]      | 40
|               | [] N3 Example Cookwar.. 0.69 unknown| Why this score                           | 192
|               |>[] N4 Example Home Ce.. 0.62 |Governance 2022 :Chain, 2,347 stores:| [####|#:x|###|###]          |
|               | [] N5 Example Hardwar.. 0.56 unknown | Sells it Likely sells it, a guess 1.00 x 0.25 = 0.250 Dispute |
|               |       :Chain, 5,000+ stores, dealer-owned: | People   Governance finding 0.25 x 0.30 = 0.075 Dispute |
|               | [] N6 Example Hardwar.. 0.55 unknown | Planet   unknown            0.50 x 0.30 = 0.150 Dispute |
|               |       :Chain, 5,000+ stores, dealer-owned: | Distance 0.8 mi SE       0.97 x 0.15 = 0.145 Dispute |
|               |  ... 17 rows in full, O9 cut, O10 below | 0.250 + 0.075 + 0.150 + 0.145 = 0.620, shown as 0.62 |
|               |                                     | Record: finding card, certifications line | 152
|               |                                     | Why here                                 | 60
|               |                                     | Sells it                                 | 44
|               |                                     | Chain                                    | 44
|               |                                     | Where: plot 88, miles, address [Copy address] [Website] | 96
|               |                                     | Not known here                           | 40
+---------------+----------------------------+--------------------------------------------+ 800
```

- Width: 16 + 200 + 16 + 552 + 16 + 464 + 16 = 1280. Narrowed columns: compare box 32, # 28 (the widest, "O10", is about 24 px; 2 px padding), Shop 184 at 1280, Score 48 (number only), Record = 100vw less 974 px less the fourth column, held between 222 and 292 = 258 at 1280. Slack from a wider window goes to Record first, up to 292 px (the widest one-line sparse chip set, about 278, plus padding), and then to Shop; at 1440 no sparse row wraps.
- Under a sort other than score or name, the sorted column takes Score's place, and its width comes out of Record, never Shop: Distance 76, Sells it 96 (the short words "Likely", "May", "Named", "Category only", "Not confirmed"; the band header says "a guess, call first"), People or Planet 70.
- Panel height to the finding card: 56 + 40 + Why this score (heading with the "How the order works" link, bar 30, four one-line part rows of about 31, sum line) about 230 = the Record block at about 480, so the finding card's kind, date, claim and penalty show on the first screen. Why here, Sells it, Chain, Where and Not known here follow and scroll inside the panel.
- Once the shop's heading scrolls under the panel bar, the bar shows "{N4} {name}" (13 px semibold, cut with an ellipsis) and a compact "Choose" between the count and Close.
- The list keeps 5 facts per row (rank, name, score, record, chain). At 1280 the Record cell holds 258 px, so four sparse rows wrap (n5, n6, o1, o9) and n4 does not. People, Planet, Sells it and Distance columns come back when the panel closes.
- Band headers here use the short wording (section 8), which keeps "sells it is a guess, call first"; any band header that is still too long wraps to a second line and is never cut.

### S-360. A shop opened, 360x740

```
+--------------------------------------------------+ 0
| [< List] [Filters]      4 of 19   [<] [>]         | 44
| Example Home Center                               | 28 (56 when the name wraps)
| N4 · Near you · 0.8 mi SE · Score 0.62            | 20
| [Choose this shop]  [Add to compare]              | 48
| [#####|#:x|###|###]                               | 24
| Sells it  Likely sells it, a guess       0.250     | 80
|   1.00 x 0.25              [Source] [Dispute]     |
| People    Governance finding             0.075     | 80
|   0.25 x 0.30           [2 sources] [Dispute]     |
| Planet    unknown                        0.150     | 80
|   0.50 x 0.30              [Source] [Dispute]     |
| Distance  0.8 mi SE                      0.145     | 80
|   0.97 x 0.15              [Source] [Dispute]     |
| = 0.620, shown as 0.62                            | 24
| Record                                            | 40
| |Governance · 2022-04-08                          | 170 (the card's top 104 above the 740 line)
| | "Example Trade Commission announces settlement  |
| |  with Example Home Center requiring refunds     |
| |  to customers"                                  |
| | Penalty $3,000,000 (major) · Names this shop ·  |
+--------------------------------------------------+ 740
| | Took 0.25 from People, 0.075 off the score      |
| | [Source] [Dispute this]                         |
| Why here: place 4 of 9 near you ...               | 64
| Sells it: Likely sells it. A guess ...            | 64
| :Chain, 2,347 stores: no score effect             | 72
|   [Source] [Dispute]                              |
| Where: 0.8 mi south-east ...                      | 120
```

- Sum: 44 + 28 + 20 + 48 + 24 + 4 x 80 + 24 + 40 = 548 plus block gaps; the finding card starts at about 636, so its kind, date, claim and penalty line show above the 740 line; the rest is a scroll. "How the order works" sits on the "Why this score" heading line, and at narrow the sum line keeps only its total ("= 0.620, shown as 0.62."), since each part's number is in its own row above.
- Each part row is 80 px and always open: one line with the part, its words and the contribution, then one 44 px line with value x weight at the left and two 44 px targets at the right, plus 6 + 6 padding. The words are the short forms of section 5, so each fits one line. "Source" is the part's one source link; when the part has more than one (a baseline plus a certification or finding) it reads "{n} sources" and jumps to the Record block, where each fact carries its own link. Every Source and Dispute in the sheet (part rows, finding cards, certification blocks, the chain block) is a 44 px target on a line of its own. Nothing in the sheet is folded.
- Finding card: kind and date 20, claim 3 lines 54, penalty line 20, "Took" line 20, button line 44, padding 12 = 170. Chain block: one line 20, button line 44, padding 8 = 72.
- `sec=record` scrolls the finding to the top; `sec=where` scrolls to the address.

### C-1280. Compare, 1280x800 (`#view=results&panel=compare&cmp=n1,n4,o1`)

```
|16|<----- grid 392 ----->|16|<--------------------------- panel 840 --------------------------->|16|
+----------------------------------------------------------------------------------------------------+ 0
| top bar 44; facts strip 32 with [Filters 0] at its left                                             | 76
+------------------------+-------------------------------------------------------------------------+
| [] #  Shop   Score vs N1      | Compare 3 shops    [ ] Only rows that differ             [Close] | 32
| To compare · 3 of 4 [Compare] [Clear] | Largest gap from N1 Example Kitchen Supply: N4 Example Home Center | 40
| [x] N1 Example Ki.. 0.70 N1   | is 0.078 lower, nearly all of it People (N4 has a Governance finding). |
| [x] N4 Example Ho.. 0.62 -0.078 People | (labels 120) | N1 Example [x]| N4 Example [x]| O1 Example [x] | 72
| [x] O1 Example Tr.. 0.70 +0.002 mixed |              | Kitchen Supply| Home Center   | Trail Outfitters|
| Near you · 9 within 10 mi · sells it is a guess, call first | Near, 0.4 mi NE| Near, 0.8 mi SE| Online |
| [ ] N2 Example Re.. 0.69 -0.006 Dist. |              | Others compared to this | [Compare to this] | [Compare to this] |
| [ ] N3 Example Co.. 0.69 -0.011 Dist. | Score        | 0.698         | 0.620  -0.078 | 0.700  +0.002  | 32
| [ ] N5 Example Ha.. 0.56 -0.135 Sells | Four parts   | [###|##|##|##]| [###|#|##|##] | [###|##|###|#] | 32
|                               |              | value   adds  | value adds vs N1 | value adds vs N1 | 24
|  ... all 19 rows              | Sells it     | Likely, a guess 0.250 | Likely, a guess 0.250 = | Named 0.250 = | 36
|                               | People       | unknown 0.150 | 0.25  0.075  -0.075 | unknown 0.150 = | 36
|                               | Planet       | unknown 0.150 | unknown 0.150 = | 0.75  0.225  +0.075 | 36
|                               | Distance     | 0.4 mi 0.148  | 0.8 mi 0.145 -0.003 | online 0.075 -0.073 | 36
|                               | Certifications| none on file | none on file  | (Climate Label certified) | 36
|                               | Findings     | none on file  | |Governance 2022 | none on file | 36
|                               | Chain list   | not on the list| :Chain, 2,347 stores: | :Chain, 195 stores: | 36
|                               | Sold it in tests| 80% of "likely" shops | 80% of "likely" shops | 98% of online shops | 32
|                               | Address      | 12 Example St [Copy] | 400 Example Blvd [Copy] | online | 40
|                               | Website      | kitchen-supply.example | home-center.example | trail-outfitters.example | 32
|                               | Not known here: stock, price, opening hours, delivery (one merged row) | 28
|                               |              | [Choose this shop] | [Choose this shop] | [Choose this shop] | 40 sticky bottom
+------------------------+-------------------------------------------------------------------------+ 732
```

- Width: 16 + 392 + 16 + 840 + 16 = 1280. List columns: compare box 32, # 32, Shop 184, Score 48, "vs N1" 96 = 392. Panel: 16 padding, labels 120, shop columns share 688 (4 x 172, 3 x 229, 2 x 344), 16 padding.
- "vs N1" cell: the signed difference and a short part tag, "Sells", "People", "Planet", "Dist." or "mixed" (the full words are in the cell's title and accessible name). The widest, "-0.078 People", is about 86 px of the 88 px inside the cell (4 px padding), so no row wraps.
- A 24 px row above the first part row names the numbers in a part cell: "value · adds · vs N1" (the compared-to column: "value · adds"). The part row labels carry their segment's color swatch, which keys the Four parts bars.
- Each column head's name is a button that opens that shop in full; the opened shop then shows "Back to compare". Each certification and finding chip in compare opens its own source (the toast); a "{n} certifications" chip has no single source and opens nothing.
- Each column head has a small close mark at its top right ("Remove {name} from compare"), so no Remove row is needed at wide and medium. The Choose row is a bar stuck to the panel's bottom edge, so choosing never needs a scroll with 2 to 4 shops; the rows above it scroll under it. The Address cell puts "Copy" (accessible name "Copy address of {name}") on the street line.
- A part cell is three fixed tracks (value, adds 40 px, difference 50 px); only the value wraps inside its own track ("Likely, a / guess"), so the adds and difference figures read straight down every column.
- Panel height: 32 + 40 + 72 + 32 + 32 + 24 + 7 x 36 + 32 + 40 + 32 + 28 + 40 = 656 of 724. From 1440 px the compare panel is 920 px.
- Visible: 15 aligned rows for up to 4 shops, plus the list at 4 facts per row (rank, name, score, difference from the compared-to shop with the part that explains most of it). List height: 160 + the "To compare" header 32 + 3 picked copies and 19 rows x 32 = 896: every row is one line here, so the picks and 16 shops show and the rest is a scroll.

### C-360. Compare, 360x740

```
|16|<- 76 ->|<-- 84 -->|<-- 84 -->|<-- 84 -->|16|
+--------------------------------------------------+ 0
| [< List]  Compare 3 shops                         | 44
| [ ] Only rows that differ                         | 44
| Largest gap from N1: N4 is 0.078 lower, nearly    | 60
|  all of it People (N4 has a Governance finding).  |
+----------+----------+----------+----------+ 148
|          | N1 Example| N4 Example| O1 Example| 108 sticky
|          | Kitchen  | Home     | Trail    |
|          | Supply   | Center   | Outfitters|
|          | Others compared to this| [Compare to this]| [Compare to this]|
| Score    | 0.698    | 0.620    | 0.700    | 40
|          |          | -0.078   | +0.002   |
| Parts    | [####]   | [### ]   | [####]   | 52
|          | value /  | value /  | value /  |
|          | adds     | adds vs N1| adds vs N1|
| Sells it | Likely (guess) | Likely (guess) | Named | 56
|          | 0.250    | =        | =        |
| People   | unknown  | 0.25     | unknown  | 40
|          | 0.150    | -0.075   | =        |
| Planet   | unknown  | unknown  | 0.75     | 40
|          | 0.150    | =        | +0.075   |
| Distance | 0.4 mi   | 0.8 mi   | online   | 40
|          | 0.148    | -0.003   | -0.073   |
| Certif.  | none on  | none on  | Climate  | 56
|          | file     | file     | Label    |
|          |          |          | certified|
| Findings | none on  | Govern-  | none on  | 44
|          | file     | ance 2022| file     |
| Chain    | not on   | Chain,   | Chain,   | 56
| list     | the list | 2,347    | 195      |
|          |          | stores   | stores   |
| Tests    | 80%      | 80%      | 98%      | 32
| Address  | 12 Exam..| 400 Exa..| online   | 56
+----------+----------+----------+----------+ 688 (first screen ends; the rows below scroll)
| Website  | [link]   | [link]   | [link]   | 44
| Not known here: stock, price, opening     | 36
|  hours, delivery                           |
| Remove   | [Remove] | [Remove] | [Remove] | 44
+----------+----------+----------+----------+ 812
| [Choose]   [Choose]   [Choose]                   | 52 sticky bottom, 688 to 740
+--------------------------------------------------+
```

- Width: 16 + 76 + 3 x 84 + 16 = 360. The left gutter sits inside the label column (92 px cell), so the label column is sticky with no gap at its left; a fourth shop scrolls sideways inside the table box only, never the page.
- Under 600 px the compared-to shop's column comes first and sticks beside the label column (92 + 84 = 176 px), so every difference is read against a shop that stays on screen; the other columns scroll under it. While columns sit off screen to the right, the box's right edge carries a soft shadow.
- At narrow, compare is one screen tall. The title bar, "Only rows that differ" and the gap sentence stay at the top, and the table box under them scrolls on its own both ways. A box that scrolls sideways also holds anything sticky inside it, so the head (top), the label and compared-to columns (left, under 600 px) and the Choose bar (bottom) stick to this box, the same way for 2 to 4 shops. On a screen under 600 px tall the panel scrolls as a page instead, so the gap sentence goes up with the table.
- A part cell at 84 px: the value on line 1; line 2 in 12 px is what it adds in the compared-to column and the difference in what it adds in the others, so both numbers on line 2 are on one scale. The Four parts row says so under its bars ("value / adds", "value / adds vs N1"), so no separate row is spent on it at narrow.
- The gap sentence keeps two lines at narrow, with "More" (a 44 px target at the end of line 2) when it runs longer; "More" opens it in place for as long as compare stays open.
- Column head, 108 px: the rank and name as a button (up to three lines, then an ellipsis), one 44 px control, 8 padding. The control is the words "Others compared to this" on the compared-to column and a "Compare to this" button (76 x 44, two lines) on the others. One 44 px target fits an 84 px column and two do not, so at narrow "Remove" is its own row, the last before the sticky Choose bar, where its label shows (at wide and medium it is the close mark in each head). The Choose buttons read "Choose" here, with the accessible name "Choose {name}". The kind and distance line of the wide head is not drawn here; the Distance row carries it.
- Height: 44 + 44 + 60 = 148 above the table. Head 108, then Score 40, Parts with its key 52, 4 part rows x 40 = 360, which ends at 508; Certif., Findings and Chain list show above the sticky Choose bar (52, from 688), and the rest scrolls inside the box.
- In this table only, "Certifications" may show as "Certif." in the label column at narrow, with the full word as its accessible name. Certification and chain wording wraps and is never shortened (three or more certifications read "{n} certifications", as in the Record cell). A finding kind too wide for the column breaks at a hyphen ("Govern-ance", "Environ-mental"), and a domain breaks only after a dot or a hyphen. The Address cell shows the street line; the full address and "Copy address" are in the opened shop and the chosen panel.

### Q-1280 and Q-360. Searching (`#view=searching`)

```
1280:                                                         360:
+------------------------------------------------------+ 0   +------------------------------+ 0
| top bar 44 (fields filled, Search disabled)          |     | top bar 44                   |
| Searching shops near Example City, ST and online.    | 32  | Searching shops near Example | 56
|  This takes a few seconds.                           |     |  City, ST and online. This   |
+-------------+----------------------------------------+ 76  |  takes a few seconds.        |
| rail 200,   | column header 36                       |     +------------------------------+ 100
| controls    | Near you · searching                24 |     | What a search does (card)    | 232
| disabled,   | Online · searching                  24 |     |  1 Reads the product         |
| no counts   | +- What a search does (card 480) ---+ |     |  2 Searches the web and      |
|             | | 1 Reads the product                | |     |    nearby places             |
|             | | 2 Searches the web and nearby      | |     |  3 Judges which results are  |
|             | |   places                           | |     |    shops that sell it        |
|             | | 3 Judges which results are shops   | |     |  4 Scores them               |
|             | |   that sell it                     | |     |  Results arrive all at once...|
|             | | 4 Scores them                      | |     +------------------------------+ 332
|             | | Results arrive all at once, usually| |     | Sent: the product; Example   | 96
|             | | in about 3 seconds; the slowest of | |     |  City, ST; the center of the |
|             | | 20 measured searches took about 5. | |     |  zip area; that the area is  |
|             | | Sent: ... Not the zip.             | |     |  is a city area. Not the zip.|
|             | +------------------------------------+ |     +------------------------------+ 428
+-------------+----------------------------------------+ 800 | (empty to 740)               |
```

The four steps are a plain numbered list, all shown at once. No step is marked as under way, because the page hears back once.

### St-1280 and St-360. Start (`#view=start`)

```
1280:                                                              360:
|16|<- rail 200 ->|16|<------- main, 640 at most ------->|         |16|<---------- 328 ---------->|16|
+----------------------------------------------------------+ 0     +--------------------------------+ 0
| ~ nottheriver       Prototype: Data Place Theme    About | 44    | ~ nottheriver [Sparse|Filled] About | 44
+---------------+------------------------------------------+ 44    +--------------------------------+ 44
| Set what      | (space 32)                               |       | (space 24)                     |
| matters before| Find who sells it near you or online,    | 172   | Find who sells it near you or  | 192
| you search.   | never Amazon. For every shop we show     |       | online, never Amazon. For      |
| These carry   | what we know about how it treats people  |       | every shop we show what we     |
| into your     | and the planet.                          |       | know about how it treats       |
| results.      |  (serif 32, 4 lines of 43)               |       | people and the planet.         |
| Group         | (space 24)                               |       |  (serif 24, 6 lines of 32)     |
| Show          | What are you looking for   Zip code      | 69    | (space 16)                     |
| Record        | [                        ] [      ] [Search] |    | What are you looking for       | 69
| Sells it      | Your zip stays in this browser. Sent     | 50    | [                            ] |
| Distance      |  instead: city, state, ...               |       | (space 12)                     |
| People        | A search takes about 3 seconds and ...   | 50    | Zip code                       | 69
| Planet        | Prototype: every shop here is made up ...| 50    | [          ]                   |
| [Clear        | (space 24)                               |       | Your zip stays in this browser.| 67
|  filters]     | About · Zip data: ... · Prototype ...    | 44    |  Sent instead: ... (3 lines)   |
| (no counts,   +------------------------------------------+ 559   | (space 12)                     |
|  no plot)     |                                                  | [           Search           ] | 48
+---------------+                                                  | [Filters]                      | 52
                                                                   | A search takes about 3 ...     | 50
                                                                   | Prototype: every shop ...      | 71
                                                                   +--------------------------------+ 726
                                                                   | footer: About, credit, Place, Theme (below 740) |
```

- 1280: 44 + 32 + 172 + 24 + 69 + 50 + 50 + 50 = 491, then 24 of space and the footer (44) end at 559 of 800. The form is three columns (`1fr 8rem auto`): label 21, gap 4, input 44. The three notes run the full 640 px, two 14 px lines each.
- From 1024 px a sample block sits to the right of the main column (32 px gap, up to 360 px wide, at least 296): the label "Example results", then one nearby and one online shop of the current made-up search (the first of each kind with a fact on file) as the list draws them (rank, name, score bar and number; distance and sells-it words; People and Planet micro-bars; record chips), then a key to the bar's four colors ("Score parts: Sells it, People, Planet, Distance"). It is plain text: nothing in it opens a panel or takes a pick. Under 1024 px it is not drawn.
- 360: 44 + 24 + 192 + 16 + 69 + 12 + 69 + 67 + 12 + 48 + 52 + 50 + 71 = 726 of 740. The Search button ends at 553, above the fold. The fields stack and the what-is-sent note sits under the zip field.
- `state=typing` shows the worked-out place line and the "pressing Search sends" line in place of the what-is-sent note, which says the same thing less exactly, so each fact is said once.
- A field error is one 14 px line (25 px) under its field.

### Ab-1280 and Ab-360. About (`#view=about&sec=order`)

```
1280:                                                              360:
|16|<- index 200 ->|16|<-------- text, 640 -------->|              |16|<---------- 328 ---------->|16|
+----------------------------------------------------------+ 0     +--------------------------------+ 0
| ~ nottheriver       Prototype: Data Place Theme    About | 44    | ~ nottheriver [Sparse|Filled] About | 44
+----------------+-----------------------------------------+ 44    | [How the order works       v ] | 44 sticky
| How the order  | How the order works  (serif 20)         | 54    +--------------------------------+ 88
|  works   (now) | Each shop gets four parts between 0     |       | How the order works  (serif 20)| 46
| Sold it in     |  and 1 ... (serif 16, lines of 26)      |       | Each shop gets four parts ...  |
|  tests         | Weights table: 4 rows of 32             | 160   | Weights table: 4 rows, the rule|
| Privacy        | ...                                     |       |  under each name               |
| Why Amazon     | Sold it in tests  (serif 20)            |       | ...                            |
|  never appears |                                         |       |                                |
| Cost           |                                         |       |                                |
| Disputing      |                                         |       |                                |
| Source and     |                                         |       |                                |
|  credits       |                                         |       |                                |
+----------------+-----------------------------------------+ 800   +--------------------------------+ 740
```

- The seven sections are one scrolling page in the order of the index. `sec` scrolls its heading to the top and marks it in the index (`aria-current`).
- 1280: the index is 7 links, 32 px each (44 when the label wraps), and stays put while the text scrolls. 360: the index is one native select, 44 px, sticky under the top bar.
- The wordmark leads to `#view=start`. Browser Back returns to the results the visitor came from, because a view change pushes a history entry.

## 4. Results view

One `table` (roles in section 11). Default sort: score, high first. Default grouping: bands by kind in the order Near you, Farther away, Online. Sticky: the column header; the "To compare" band header (for the whole list); at narrow the top bar and chip row.

### Columns (wide and medium)

| # | Column | Width | Align | Present | Missing or not applicable |
|---|---|---|---|---|---|
| 1 | Compare box | 32 | center | Check box, label "Compare {name}" | Disabled at 4 picked, title "Compare holds 4. Remove one first." |
| 2 | # | 32 | left | Section letter and the search's rank: "N4", "F5", "O2". 12 px, muted | Never missing. Gaps stay ("N8" then "N10") |
| 3 | Shop | 192 at 1280 (the rest) | left | Name as a button that opens the shop, 13 px semibold, one line, cut with an ellipsis; full name in its accessible name and title | Never missing |
| 4 | Sells it | 120 | left | Near and farther: "Likely, a guess" or "May, a guess". Online: "Named in listing", "Category only", "Not confirmed" | Never missing |
| 5 | People | 70 | center | Micro-bar (section 9): raised by a certification, lowered by a finding. Its title is its accessible text ("People 0.25: lowered by 1 finding") | Nothing on file: empty track with a hollow ring on the middle tick. No word in this cell |
| 6 | Planet | 70 | center | Same as People | Same |
| 7 | Distance | 80 | left | "{d} mi {DIR}": one decimal under 10 mi, whole miles from 10; DIR is one of N, NE, E, SE, S, SW, W, NW | Online: "online" (does not apply). Near with no distance: "not given". No coordinates: miles without a direction |
| 8 | Score | 144 | left | Four-part bar 72 px (title: the four parts, as its accessible name), then the number to 2 places (13 px, semibold, tabular), then the tie mark "={n}" in 12 px muted, 4 px after the number and inside the cell's 8 px right padding, when 2 or more shown shops in the same section share the 3-place score | Never missing |
| 9 | Record | 292 to 440 at wide (298 at medium) | left | Chips in this order: findings, certifications, retailer association, chain | No certification and no finding: the word "unknown", muted, plain text. A chain or association chip may follow it and never replaces it |

Columns 4 to 7 follow the score bar's segment order (Sells it, People, Planet, Distance), and each of their heads carries a 3 px underline in its part color, so the head row is the key to the bar. The Score head's title says so.

Four wordings for something missing, each with one use and never swapped:

| Wording | Where it is used |
|---|---|
| **unknown** | The shop's record as a whole, and a People or Planet part: no certification and no finding is on file. Neutral |
| **none on file** | One kind of fact listed on its own (the Certifications line or the Findings line) in an opened shop and in compare. In compare a shop whose record is unknown reads "none on file" in both rows; in an opened shop it gets the one "People and planet: unknown" line instead (section 8) |
| **online** | Distance and address, which do not apply to an online shop |
| **not given** | A field the search returned empty: "Distance not given", "Address not given", "not given" in a cell |

"Not on the chain list" (compare: "not on the list" under the row label "Chain list") is not one of these. It is the fact the site holds.

"Unknown record" has one definition everywhere: the shop has no finding and none of the five scored certification kinds. A chain fact and a retailer association membership do not count as a record. Header note: "unknown for {n} of {N}".

Record cell rules: one finding shows as "{Kind} {year}" ("Labor 2023"); two or more as "{n} findings, {first year} to {last year}". One or two certifications show their full labels; three or more show "{n} certifications". The association chip reads "Retailer association". The chain chip shows `chain.label` in full, always. Every chip is one line and never breaks inside. The cell is one line. If its content is wider than the cell, whole chips move to a second line and that row is 52 px. Nothing is shortened or cut.

Column header: 36 px, two lines. Line 1 is the column name as a sort button (all but # and Record), with an arrow on the sorted one. Line 2 is a 12 px muted note that says what the shown shops hold: Sells it "{13} likely or named" (the largest level group: "likely or named", "may or category", "not confirmed"), People and Planet "{18} unknown" (the count in the most common group, named "unknown" when nothing is on file for any of them, else "{n} at {0.50}"; "all unknown" or "all at 0.50" when every shown row shares it), Distance "{0.4} to {6.3} mi" (the range of shown near and farther shops; "online only" or "not given" when there is none), Score "{n} tied at {score}" or "no ties" ("{n} tied" in the 48 px column beside a panel), Record "unknown for {n} of {N}". Notes count the rows now shown. Each part note's title lists every group: "Shops shown: 18 at 0.50, unknown; 1 at 0.25."

### Rows

- Height 32 px (52 px when the Record cell wraps). Cell padding 6 px. Row rule 1 px `--rule`. Hover and focus-within fill `--row-hover`; the opened shop's row fills `--row-sel` with a 3 px `--accent` left bar.
- A click anywhere on a row outside the check box opens the shop. Rows hold no links; every website, source and dispute link lives in the panel.
- Tie bracket: when tied rows are adjacent (sort by score), a 2 px `--tick` bracket runs down the left edge of their Score cells. Under other sorts only the "={n}" mark shows. Its title: "{n} shops share this score. They are listed in the search's own order."
- Band header: 24 px, `--surface-2`, band name in serif 14 px, the rest 12 px. Text in section 8. A header too long for its row wraps to a second line; it is never cut. While filters hide some of a band's shops its count reads "{6} of {9} shown", and the facts strip keeps the search's totals.
- "To compare" band: first in the table whenever `cmp` is not empty. A picked row stays in its own band with its box checked, and the band holds a copy of each pick, in pick order (a pick that filters hide shows only there, with "Hidden in the list by: {filter}"). Its 32 px header holds "To compare · {n} of 4", "Compare" (enabled from 2) and "Clear". It sticks under the column header at wide and medium and under the chip row at narrow, for the whole list, so Compare stays in reach while the shopper scans further down. Ticking a row's box keeps that row at the same place on screen, with focus still on its box, so the shop under the pointer never changes. "Clear" moves focus to the first row's box and says "Compare cleared". "Previous shop" and "Next shop" walk each shop once.
- Sort note row (24 px, under the column header): shown for `sort=people` or `planet` when 80% or more of the shown rows share one value, and for `sort=sells` in the same case.
- `group=none`: no kind bands; the # column still tells the kind by its letter and the Distance cell reads "online" for online shops. While filters hide some shops, one header row above the list reads "{13} of {19} shown · {6} hidden by filters" with a "Clear filters" button.
- Branches: the search can return two branches of one company (same domain, at most 2). Each is an ordinary row with the name the search gave, so two rows can carry one name, one chain chip and one record (sparse metro N5 and N6). Nothing merges or tags them. The # and the Distance cell tell them apart, and each row's title and accessible name add the street address ("Example Hardware Dealers, 88 Example Ave"). The opened shop points to the other branch (section 5, block 8) and compare says "Same company" (section 6).
- Every tied row keeps its own row at wide and medium, under any sort. The seven sparse online rows at 0.625 differ in name, and one of them carries a chain chip; the names are what a shopper scans this band for.

### Sort rules

| `sort` | Order | Ties |
|---|---|---|
| `score` | Score, high first | The search's rank; across sections near, then farther, then online |
| `distance` | Known miles, nearest first; then "not given"; then online | By score |
| `name` | A to Z, case and accents ignored | By score |
| `sells` | Part value high first (1.0, 0.5, 0.2) | By score |
| `people`, `planet` | Part value high first | By score |

With bands on, sorting happens inside each band.

### Narrowed table (beside a docked panel: wide, and medium for shop, chosen and search)

| Panel | Columns kept | Changes |
|---|---|---|
| Shop, chosen, search | Compare box 32, # 28, Shop (184 at 1280 and at 1024, more from wider windows), Score 48, Record 222 to 292 (200 to 292 at medium) | Score is the number only. Slack goes to Record first, up to 292, then to Shop. Under `sort=distance`, `sells`, `people` or `planet` that column (76, 96, 70, 70) takes Score's place so the order stays readable, and takes its width from Record, not Shop; Sells it shows its short words there. Record keeps every rule above |
| Compare | Compare box 32, # 32, Shop 184, Score 48, "vs {N1}" 96 | "vs {N1}" shows the signed score difference and a short tag for the part that explains it: "Sells", "People", "Planet", "Dist." or "mixed" ("-0.078 People", "-0.006 Dist."). The tag is the largest part that moved the score the same way as the difference (the largest part when none did). When the two largest parts pull opposite ways and nearly cancel (rule 3 of the gap sentence, section 6), or when the two largest differ in size by less than 0.005, the tag is "mixed" and the title lists the parts: "0.002 higher: Planet 0.075 higher, Distance 0.073 lower"; "0.161 lower: People 0.075 lower, Planet 0.075 lower, Distance 0.011 lower". The cell's title and accessible name use full words ("0.006 lower, mostly Distance"). The compared-to shop's row shows its own rank ("N1"); "=" when the scores and all four parts match |

### Narrow row (under 1024)

Same cells, placed by CSS grid with four columns (# 28, text 172, score block 84 or wider, compare box 44). Line 1 is #, name (14 px semibold; a name too long for one line takes a second, then an ellipsis), then the score block (bar 44 px, score; on a tied row the muted tie mark "={n}" sits under the score, at the right end of line 2, so every row's bar and number line up). The column header row is hidden from sight and its sort buttons leave the Tab order; the Sort chip sorts here. The compare box (44 px wide) takes the fourth column for the full row height. Lines 2 and 3 start at the row's left edge and span the first three columns, 284 px. Line 2 is Distance then Sells it, joined by " · "; here the sells-it cell also shows its tail words: "Likely sells it, a guess", "May sell it, a guess". Line 3 is the Record cell; when its chips are wider than 284 px, whole chips move to a fourth line and the row is 90 px. A record that is only "unknown" ends line 2 instead when it fits there (R-360), and the row has no line 3. People and Planet cells are not drawn; the score bar and the row's accessible text carry them. Tie fold (narrow only): under `sort=score`, a tie group of 4 or more shows its first 2 rows and a button row "Show {n} more at {score}" (`ties=open` shows all, with a button row "Show fewer at {score}" after the group that folds it again). "Previous shop" and "Next shop" walk folded rows too, and opening a folded shop by hash leaves the fold as it is; closing it returns focus to the fold's button.

## 5. Opened shop

Panel at wide and medium (464 px), sheet at narrow. Blocks in this order; every block shows for every shop.

| # | Block | Content and wording |
|---|---|---|
| 1 | Header | "Previous shop" and "Next shop" buttons around "{i} of {n}" (they walk the list in its current order and filters, and replace the history entry); "Close" (narrow: "List"). A shop opened from a compare column's name shows "Back to compare" above its name. At narrow a "Filters" button sits beside "List" and opens the Filters sheet over the shop; closing the sheet returns focus to it. When filters hide the opened shop, "Previous shop" and "Next shop" go to the nearest shown shops on either side of where it would sit, and the count reads "{n} shown". Name in serif 20 px, wrapping. One line: "{rank} · {Near you / Farther away / Online} · {d} mi {DIR} · Score {0.62}". Online leaves the distance part out ("O1 · Online · Score 0.70"); a near or farther shop with no distance reads "Distance not given" in its place; one with miles and no coordinates shows the miles without a direction. If filters hide this shop: "Hidden in the list by your filters." |
| 2 | Actions | "Choose this shop" (primary), "Add to compare" (reads "In compare · Remove" when picked). At narrow, with 2 or more picked, it reads "In compare ({2}) · Remove" and a "Compare {2}" button follows, which opens compare |
| 3 | Why this score | Heading with the link "How the order works" beside it. Bar 400 px wide (wide) with the four contributions and, after People or Planet, a hatched outline the width of what a finding took. Then a table: Part, What is known, Value x weight = adds, Dispute; from 600 px each row is one line (about 31 px). Then the sum line. Precision and the sum line are set out under this table |
| 4 | Record | Findings first, newest first, one card each: kind and action date; the claim in quotes (the source's own title); source name as a link; "Penalty {$3,000,000} ({major / standard / minor})" or "Amount not stated (standard)"; "Names this shop" or "About a related company (counted at half)"; "Case closed" or "Case still open, counted as minor"; "Took {0.25} from {People}, {0.075} off the score."; "Dispute this". If the cap applied: "Small findings together take at most 0.25; the cap applied here." Then certifications, one block each: label; "Adds 0.25 to {People / Planet}" (retailer association: "No score effect"); source link; "Checked {date}"; "Dispute". When there are none, the absence lines in section 8 |
| 5 | Why here | Two lines, set out under this table: the shop's place in its section, then a comparison with one neighbor in the list as shown |
| 6 | Sells it | The level sentence with its measured share (section 8) |
| 7 | Chain | Styled apart from block 4: dashed outline, no fill. "{chain.label}. A fact about size. No score effect." Source link, "Checked {date}", "Dispute". Not on the list: "Not on the chain list (41 chains). That does not show what kind of business it is." |
| 8 | Where | Plot 88 px with this shop filled (section 9). Near: "{0.8} mi south-east in a straight line from the center of your zip area, not from you. The road is longer." Address with "Copy address". "Website" button with the domain under it and "The shop is not told you came from here." Online: "Online: no address and no distance." and the button reads "Open the listing". No distance: "Distance not given. The search returned no position for this shop, so it is not on the plot." Empty or missing address on a near or farther shop: "Address not given." and "Copy address" is not drawn. When the list holds another branch of the same company: "Another branch of this company is in this list: {N6, 3.6 mi NE}", the branch as a button that opens it |
| 9 | Not known here | "This site does not know stock, price, opening hours or delivery." |

"What is known" wording per part:

| Part | Cases |
|---|---|
| Sells it | "Likely sells it, a guess" · "May sell it, a guess" · "Listing names the product" · "Listing names only the category" · "Not confirmed" |
| People, Planet | "unknown, counts as 0.50" (title: "unknown: nothing on file, counts as the middle (0.50)") · or the facts that moved it, each named: "Worker co-op (+0.25)", "Governance finding (-0.25)" |
| Distance | "{0.8} mi {SE}" (title: "{0.8} mi: 1.00 at the center of your zip area, falling to 0 at 25 mi") · "{38} mi: past 25 mi, so this part adds 0. That is distance, not a finding." · "Online: 0.50 for all" (title: "Online: a fixed middle value, 0.50, the same for every online shop") · "Distance not given: adds 0. Missing data about position, not a finding about the shop." |

Each part row's source. From 600 px the words are the link, so a row stays one line: Sells it's words link to the model judgment ("Model judgment: likely sells it" in its title) or, for an online shop, to the listing; Distance's words link to `#view=about&sec=order`; each certification and finding in People and Planet links its own source (several findings of one kind read "{2} Labor findings (-0.25)" and jump to the Record block); the "Starts at 0.50" baseline is the link on the part's name, People or Planet. At narrow each row has its own "Source" or "{n} sources" target, as S-360 says: for a near or farther shop, Sells it links "Model judgment: likely sells it" (or "may sell it"); for an online shop the link goes to the listing. The listing page's title is never printed anywhere: it is page text and could carry an excluded brand's name. `matched_product` is the only listing text the page shows. People and Planet link each certification and finding, plus "Starts at 0.50"; Distance links "{0.8} mi ({1.3} km) from your zip area", or for an online shop "Same 0.50 for every online shop". These starting-value and distance links go to `#view=about&sec=order`.

Numbers in "Why this score":

- A part's value and a finding's size print to 2 places (0.50, 0.25, 0.13, 0.69, 0.97; "Labor finding (-0.06)", "Took 0.06 from People"), and so do the accessible names ("People 0.69"). Four places would claim more than a 62 to 64% accuracy supports.
- A part's contribution ("adds") and the score print to 3 places, as the search returns them.
- Sum line when the four printed contributions add up to the score: "0.250 + 0.075 + 0.150 + 0.145 = 0.620, shown as 0.62." Its title: "The order uses the full value."
- Sum line when they miss it, which rounding each part can cause (filled n3): "0.250 + 0.206 + 0.150 + 0.132 = 0.738. The score is 0.739, shown as 0.74: each part is rounded, so the sum misses by {0.001}." At narrow the four added parts are left off and the line starts at "=". The left side is always the true sum of the four numbers printed, and the miss is the printed difference (0.001 in the made-up data, 0.002 at the very most).

"Why here" lines:

- Line 1: "Place {4} of {9} near you by score." (farther: "of {3} farther away"; online: "of {10} online"). Place and total count the shop's whole section as the search returned it, before any filter and whatever the sort, so this line never changes. Place can differ from the rank label where ranks skip.
- Line 2 compares with one neighbor. The neighbor set is the shown rows of the shop's own band (with `group=none`, all shown rows), after filters and in the current sort. A picked row counts at its place in its own band, never as its copy in "To compare".
- The neighbor is the row above. The first row of a set compares with the row below. Bands never mix: the first online row is not compared with the last near row unless `group=none`.
- Wording: "Against {N3 Example ...}, the shop above in {Near you} (sorted by {score}): score 0.067 lower. People 0.075 lower (N4 has a Governance finding). Distance 0.008 higher (1.4 mi closer)." With `group=none`: "the shop above in this list". Below: "the shop below". Parts are listed largest first and equal parts are left out. The brackets always name the shop that holds the fact (section 6).
- All four parts equal: "Same score and the same four parts as {shop}. The search's own order puts {shop} first."
- Same score from different parts (filled o3 under o2): "Against {O2 Example ...}, the shop above in {Online} (sorted by {score}): the same score. People 0.075 higher (O3 is a B Corp). Planet 0.075 lower (O2 is a 1% for the Planet member). The search's own order puts {O2} first."
- The set holds only this shop: "The only shop shown in {Near you}." (with `group=none`: "The only shop shown.")
- The opened shop is hidden by filters: the set is its band with the filters off, and line 2 starts "With filters off: ".

At narrow every Source link and Dispute button in the sheet is a 44 px target on a line of its own (S-360).

"Dispute" (on a part, certification or chain) and "Dispute this" (on a finding) open one note in place, under the control that opened it (hash key `dispute`): "Disputes are filed on a public form on GitHub. It needs an account there, and what you file is public. Anyone can file, including the shop. How disputes are reviewed is not decided, and no response time is promised. Until then this stays as shown." with the button "Open the dispute form".

Links out: every shop, source and dispute link is made up and ends in `.example`. Each is a button drawn as a link that keeps its address in `data-href` and has no `href`, so no click, middle click or "open in new tab" can leave the page; activating it shows the toast "Prototype: this would open {host} in a new tab." Real links would carry `rel="noopener noreferrer"`.

## 6. Compare

| Question | Answer |
|---|---|
| Adding | The check box at the start of a row, or "Add to compare" in an opened shop. A picked row stays in its band, checked, and a copy of it sits in the "To compare" band at the top of the list under any sort or filter |
| Removing | Clear the row's check box (or its copy's), the close mark in a compare column's head ("Remove" in its own row at narrow), or "Clear" in the band header. Removing down to one shop closes compare (`panel=none`), keeps the pick, and moves focus to that shop's check box. Each removal says "{name} removed from compare, {n} of 4" |
| Limit | 2 to 4. With 4 picked, other check boxes are disabled with the title "Compare holds 4. Remove one first." |
| Opening | "Compare" in the band header (enabled from 2 picked). It sets `panel=compare`. Closing the panel keeps the picks |
| Compared to | The first picked shop, or the one set with "Compare to this". Its column is marked "Others compared to this" and filled `--row-sel` |
| Aligned rows | Column head (rank and name as a button that opens the shop; kind and distance at wide and medium; the words "Others compared to this" or the "Compare to this" button), Score, Four parts (bars on one 0 to 1 scale), a row naming the numbers ("value · adds · vs {N1}"), Sells it, People, Planet, Distance (each label with its part's color swatch), Certifications (one or two as 20 px chips, three or more as one "{n} certifications" chip as in the Record cell, listed with sources in the opened shop; then the association chip), Findings (each chip, and each certification chip, opens its source), Chain list, Sold it in tests, Address (with "Copy" on the street line at wide and medium), Website, Not known here, "Choose this shop" (a bar stuck to the bottom at every width), "Remove" (narrow only; elsewhere the head's close mark) |
| How differences show | The four part rows and Score show the value, the contribution, and the signed difference in contribution from the compared-to shop ("-0.075"), or "=". Values use the precision of "Why this score" (section 5). A cell that differs from the compared-to shop gets weight 600 and a 2 px `--diff-ring` bar on its left edge only; equal cells are muted. An absence ("none on file", "not on the list") is never bolded or marked: it stays muted, and only the opposite cell that holds a fact is marked. One neutral color, no direction color. Titles say "higher" and "lower", never any word of praise or blame. The four part differences add up to the score difference, or miss it by 0.001 where parts were rounded; then the Score cell's title says "parts are rounded" |
| Gap sentence | Under the title, about the shop with the largest score gap from the compared-to shop. Four templates, set out under this table |
| Only rows that differ | Off by default. On: rows equal across all shops fold into one line, "Same for all {3}: People unknown, Planet unknown, Chain list: not on the list." |
| Same company | When two picked shops share a domain, a line under the gap sentence: "Same company: 2 branches. Same record, different distance." (`cmp=n5,n6` in sparse metro, `cmp=n7,n8` in filled metro) |
| Mixed kinds | Near and online sit side by side. A nearby or farther shop's Sells it cell keeps its guess label ("Likely, a guess"; "Likely (guess)" at narrow) beside an online "Named". Distance reads "online 0.075" against "0.4 mi 0.148"; only the contributions are differenced, never miles |
| Missing values | A near or farther shop with no distance reads "not given 0.000" in the Distance row. An empty address reads "not given" with no "Copy address". Certifications and Findings read "none on file"; Chain list reads "not on the list" |
| Hidden by a filter | A picked shop that the filters hide stays in the band and in compare, with "Hidden in the list by: {filter label}" |
| Choosing | "Choose this shop" in a compare column or in an opened shop sets `panel=chosen` |

Gap sentence. For each part, d is the shop's contribution minus the compared-to shop's (3 places). M is the sum of the four sizes of d, A is the part with the largest size and B the next. The sentence is about the picked shop whose score is farthest from the compared-to shop (the earlier pick on a tie). It opens "Largest gap from {ref}: " with 3 or 4 shops and "Against {ref}: " with 2; when M is 0 it has no opening, since the template names the compared-to shop itself. The first rule that holds picks the template:

| Rule | Template | Worked pair |
|---|---|---|
| M is 0 | "{shop} has the same score and the same four parts as {ref}." | Sparse o3 against o2 (`cmp=o2,o3`): "O3 Example Kitchen Online has the same score and the same four parts as O2 Example Cast Iron Works." |
| A is 80% or more of M | "{shop} is {0.078} {lower}, {nearly all} of it {People} ({N4 has a Governance finding})." It reads "all of it" when A is the only part that differs | Sparse n4 against n1: People -0.075 of M 0.078 (96%). Sparse n6 against n5: "N6 Example Hardware Dealers is 0.010 lower, all of it Distance (1.7 mi farther)." |
| A and B pull opposite ways and their sum is at most a fifth of A | "{shop} is {0.002} {higher}. {Planet} {0.075} {higher} ({O1 is Climate Label certified}) and {Distance} {0.073} {lower} ({online against 0.4 mi}) nearly cancel." It says "cancel" when they cancel exactly. When another part is left, the gap is that part, so the sentence names it: "...cancel; the {0.070} is {Distance} ({online against 0.8 mi})." ("is mostly" when more than one part is left or the pair does not cancel exactly). When the two scores are equal it opens "{shop} has the same score as {ref}." and ends "cancel." | Sparse o1 against n1 (`cmp=n1,o1`). Sparse o9 against n4 (`cmp=n4,o9`): "O9 Example Big Box Online is 0.070 lower. People 0.075 higher (N4 has a Governance finding) and Planet 0.075 lower (O9 has an Environmental finding) cancel; the 0.070 is Distance (online against 0.8 mi)." Equal scores: filled o3 against o2 (`data=filled&cmp=o2,o3`), People 0.075 higher (O3 is a B Corp) and Planet 0.075 lower (O2 is a 1% for the Planet member) |
| Anything else | "{shop} is {0.359} {lower}, mostly {People} ({0.262} {lower}: {N6 has 2 findings, N1 has 2 certifications}), then {Planet} ({0.094} {lower}: {N6 has an Environmental finding, N1 is a 1% for the Planet member})." | Filled n6 against n1 (`data=filled&cmp=n1,n6`): People is 73% of M 0.359 |

The words in the last brackets come from the part: Sells it gives the two levels and says which are guesses ("may sell it against likely sells it, both guesses"; with one nearby or farther level, only that one carries it: "named in listing against likely sells it, a guess"); Distance gives "{1.7} mi farther" or "closer", "online against {0.4} mi" for mixed kinds, or "distance not given". People and Planet always name the shop that holds each fact that differs, since a shop must never read as holding another shop's fact: one fact reads as a clause ("N4 has a Governance finding", "O1 is Climate Label certified", "N2 sells Fair Trade Certified products", "N1 is a worker co-op", "O3 is a B Corp", "O2 is a 1% for the Planet member"); two or more on one shop are counted ("N6 has 2 findings", "N1 has 1 certification and 2 findings"); the shop's facts come first, then the other shop's, joined by a comma.

Ties in size: wherever parts are ranked by the size of their difference (A and B here, the tag in the "vs" column, the order of parts in "Why here"), parts of equal size keep the fixed order Sells it, People, Planet, Distance.

When every picked shop has an unknown record, a second sentence follows: "Nothing is on file for people or planet for any of these {3}, so they differ only in sells-it level and distance." When M is 0 for every picked shop it stops after "any of these {2}."

Chosen panel, in order:

1. "You chose {name}."
2. the address with "Copy address" (online: "Online: no address."; empty or missing: "Address not given." with no "Copy address")
3. "Website" ("Open the listing" for online) with "The shop is not told you came from here."
4. "{0.4} mi north-east in a straight line from the center of your zip area. The road is longer." (no distance: "Distance not given."; online: this line is left out)
5. the sells-it sentence for its level
6. "This site does not know stock, price, opening hours or delivery." (online adds "Delivery and shipping are on the shop's page.")
7. "If it does not work out: {next shop}" as a button
8. "Back to the list"
9. "Search for something else"

The fallback is the next other shop in compare when compare holds any; otherwise the next row in the list under the current sort and filters.

## 7. Controls

Every control is a native button, check box, radio group or select. Tab reaches all of them; Space or Enter works them; arrow keys move inside a radio group.

| Control | Where | Exact label and values (default in bold) | Hash | Departure |
|---|---|---|---|---|
| Product, zip, Search | Top bar (wide, medium); start view; Edit sheet (narrow) | "What are you looking for", "Zip code", "Search" | none | |
| Edit | Narrow top bar | "Edit" | `sheet=edit` | |
| Data switch | Top bar, inside a dashed "Prototype" group | "Data": **Sparse**, Filled. Carries `shop`, `cmp` and `ref` to the same shops in the other set (section 10). A note open on a certification or finding (`dispute=cert{n}`, `finding{n}`) closes, since those are numbered within one shop's record; a part or chain note stays | `data` | |
| Place switch | Same group (medium and narrow: footer) | "Place": **Metro**, Rural. It changes the search, so it clears `shop`, `cmp`, `ref`, `dispute` and a shop panel's `sec` (on About, `sec` stays) and closes a shop, chosen or compare panel | `place` | |
| Theme | Same group (medium and narrow: footer) | "Theme": **Auto**, Light, Dark | `theme` | |
| About | Top bar (narrow results: footer) | "About" | `view=about` | |
| About this search | Facts strip (narrow: the fourth chip, "About" over "this search") | "About this search" | `panel=search` | |
| Sort | Column header buttons (wide, medium); chip with the label "Sort" over a native select (narrow) | **Score**, Distance, Name (the Shop header), Sells it, People, Planet | `sort` | D2 for Sells it, People, Planet |
| Group | Rail, radio pair; chip with the label "Group" over a native select (narrow) | "Group": **By kind**, One list | `group` | D3 for One list |
| Show | Rail check boxes with counts | "Near you", "Farther away", "Online" (**all on**) | `kind` | |
| Has a certification | Rail | "Has a certification" (off). Title: "Counts the five scored kinds. Retailer association membership is not counted." | `f=cert` | |
| Findings | Rail | "Has a finding", "No finding on file" (off) | `f=finding`, `f=nofinding` | D2 |
| Any record on file | Rail, first in Record | "Any record on file" (off). Title: "Has a certification or a finding. A chain fact or a retailer association membership is not a record." Keeps shops whose record is not unknown | `f=record` | D2 |
| Chain list | Rail | "On the chain list", "Not on the chain list" (off) | `f=chain`, `f=nochain` | D2, against the 2026-09-27 ruling "badge only, no filter" |
| Sells it | Rail | "Likely or named" (off), title "Judged likely, or named in the shop's listing": keeps shops whose sells-it value is 1.0 | `f=sure` | D2 |
| Distance | Rail select | "Within": **Any distance**, 1 mi, 3 mi, 5 mi, 10 mi, 25 mi. Note when set: "Online shops have no distance and stay unless Online is off." When the set also holds a near or farther shop with no distance, the note adds "{1} shop with no distance given is hidden." | `within` | D2 |
| People, Planet | Rail selects, under the micro-bar key | "People": **Any**, "Raised ({n})", "Lowered ({n})". "Planet": the same. The key above them reads "[ring] unknown [solid] raised [hatch] lowered" in the bars' own shapes, and its title says in full that raised is by a certification and lowered by a finding. Raised means at least one scored certification in that part; lowered means at least one finding counted in that part. A shop can be both. The counts follow the rule for filter counts below | `people`, `planet` | D2 |
| Clear filters | Rail | "Clear filters" (resets `kind`, `f`, `within`, `people`, `planet`) | | |
| Filters | Facts strip when the rail is folded ("Filters {n}", n = active filters); first chip at narrow ("Filters" over "{n} on", or "none"); at narrow also in an opened shop's bar, beside "List", where the chip row is gone | "Filters". The sheet ends in a sticky bar with "Show {n} of {N} shops" (closes the sheet; "Done" on the start view) and "Clear"; "Close" stays in its header for keyboard and Escape, and browser Back closes it too | `sheet=filters` | |
| Compare box | Row | "Compare {name}" | `cmp` | |
| Compare, Clear | "To compare" band header | "Compare", "Clear" | `panel=compare`, `cmp` | |
| Open a shop | Row or name button | (the name) | `panel=shop&shop=` | D1 inside the panel |
| Previous, next | Panel header | "Previous shop", "Next shop" | `shop` | |
| Dispute | Shop panel: each part, certification, chain and finding | "Dispute", "Dispute this" (finding); opens the note under it, a second press closes it | `dispute` | |
| Only rows that differ | Compare | "Only rows that differ" (off) | `only` | |
| Compare to this | Compare column head | "Compare to this" (accessible name "Compare the others to {name}") | `ref` | |
| Shop name in compare | Compare column head | (the rank and name), opens the shop; the shop panel then shows "Back to compare" | `panel=shop&shop=` | |
| Remove | Compare: a 24 px close mark at the top right of each column head (narrow: "Remove", its own row) | Close mark titled "Remove from compare"; accessible name "Remove {name} from compare" | `cmp` | |
| Choose | Shop panel, compare column | "Choose this shop" (narrow compare: "Choose", accessible name "Choose {name}") | `panel=chosen` | |
| Tie fold | Narrow list | "Show {n} more at {0.63}"; once open, "Show fewer at {0.63}" | `ties=open`, `ties=fold` | |
| Why so few nearby? | Thin state, narrow: the row under the empty Near you band header | "Why so few nearby?" | `panel=search` | |
| Other branch | Shop panel, Where block, when the list holds another branch | "{N6, 3.6 mi NE}" (accessible name "Open {name}, {3.6 mi NE}") | `shop={id}` | |
| Sources | Shop sheet at narrow, a part row with more than one source | "{n} sources" | `sec=record` | |
| Marks | No visible control; hash only | | `marks=1` | |

Filter counts: each count is the number of rows the list would show with that box ticked and every other active filter kept, so a zero is visible before it is pressed. The options of the People and Planet selects carry counts the same way. While "Not on the chain list" is ticked and it also removes every shop with a finding, a note prints under it: "This also hides every shop with a finding here: all {n} are on the chain list." With one such shop (sparse rural): "This also hides the one shop with a finding here: it is on the chain list." The note is not drawn while the box is clear.

The plot (D4) is not a control. Its dots are not tab stops; hovering or focusing a row rings that shop's dot.

While no rows show (a message block: nothing found, failed, too many requests, budget spent) and while searching, the rail's Record, Sells it, Distance and People and Planet controls and "Clear filters" are disabled, drawn as on the searching view; Group and Show stay live, since they carry into the next search, and a change there says "Saved for your next search."

Start view: the rail shows at wide with no counts and the note "Set what matters before you search. These carry into your results." At narrow the same sits behind a "Filters" button under the form.

## 8. Wording

US spelling, no em dashes, no verdict words, never the word "independent" for a shop. `{}` marks a value from the data.

| Where | Exact text |
|---|---|
| Wordmark, tab title | nottheriver |
| Headline (start view only, serif) | Find who sells it near you or online, never Amazon. For every shop we show what we know about how it treats people and the planet. |
| Field labels, button | What are you looking for · Zip code · Search |
| What-is-sent note (under the zip field) | Your zip stays in this browser. Sent instead: city, state, the center of your zip area and how rural it is. |
| Cost line (start) | A search takes about 3 seconds and costs the project about {2} cents. Nobody pays to be placed. (Cents from `usage.estimated_cost_usd`, rounded) |
| Prototype note (start) | Prototype: every shop here is made up. Any five digits work, and results are for "cast iron skillet" (Metro) or "wool socks" (Rural). |
| Worked-out place (typing) | {Example City, ST}. Nearby means within {10} miles here. |
| Pressing Search sends (typing) | Pressing Search sends: the product, {Example City, ST}, the center of the zip area and that it is {a city area / a rural area}. Not the zip. |
| Field errors | Type what you are looking for. · Enter a five-digit zip code. · That zip code isn't in our list. Check the five digits and try again. |
| Searching status | Searching shops near {city}, {state} and online. This takes a few seconds. |
| Search steps (card title "What a search does") | 1 Reads the product · 2 Searches the web and nearby places · 3 Judges which results are shops that sell it · 4 Scores them · Results arrive all at once, usually in about 3 seconds; the slowest of 20 measured searches took about 5. |
| Sent (searching) | Sent: the product, {Example City, ST}, the center of the zip area and that it is {a city area / a rural area}. Not the zip. |
| Searching status (live region) | Searching for shops near {city}, {state} |
| Done status (live region) | Found {n} shops near you, {n} farther away and {n} online. |
| Data-set switch | Prototype · Data: Sparse / Filled · Place: Metro / Rural. Titles: "Sparse: as empty as real results." "Filled: as full as the fields allow." |
| Facts strip (wide, medium) | {City, ST} · {n} near you ({r} mi) · {n} farther · {n} online · Sold it in tests: about 62 to 64% of nearby shops, 98% of online shops (measured 2026-09-26) |
| Top bar (narrow) | {product} (the place is on the summary line under it) |
| Summary (narrow) | {City, ST} · {n} near you ({r} mi) · {n} farther · {n} online (the farther part only when it is above 0) / Sold it in tests: nearby 62 to 64%, online 98% |
| Chip row (narrow) | Filters over "{n} on" (or "none") · Sort over {Score} · Group over {By kind} · About over "this search" |
| Accuracy statement in full (About this search, About) | In tests, about 62 to 64% of nearby shops shown really sold the product, and 98% of online shops. Measured 2026-09-26 on 20 graded searches, each run twice. No separate figure exists for farther shops. |
| Column heads | Compare (hidden from sight) · # · Shop · Sells it · People · Planet · Distance · Score · Record · vs {N1} |
| Score title | The bar holds the four parts in the order and colors of the column heads: Sells it, People, Planet, Distance. |
| # title | The search's own place for each shop in its section: N near you, F farther away, O online. Sorting never renumbers. |
| People, Planet titles | How it treats people: 0.50 when nothing is on file. A certification raises it, a finding lowers it. (Planet: "How it treats the planet: ...") |
| Micro-bar accessible text | People 0.50: unknown · People 0.75: raised by 1 certification · People 0.25: lowered by 1 finding |
| Sells-it words (row) | Likely, a guess · May, a guess · Named in listing · Category only · Not confirmed. Narrow: Likely sells it, a guess · May sell it, a guess |
| Unknown | unknown |
| Record absence, opened shop, no finding and no certification | People and planet: unknown. No certification or finding is on file for this shop, and this search found none. Nothing on file does not mean the shop was checked. |
| Record absence, one kind only | Findings: none on file. The set is small and hand-built from 14 accepted sources. Nothing on file does not mean the shop was checked. · Certifications: none on file. |
| Compare, nothing in a row | Certifications and Findings: none on file · Chain list: not on the list · Distance or Address the search left empty: not given |
| Missing distance or address | Distance not given · Address not given · Distance not given. The search returned no position for this shop, so it is not on the plot. |
| Other branch | Another branch of this company is in this list: {N6, 3.6 mi NE} · Same company: 2 branches. Same record, different distance. |
| Chain badge | `chain.label` as given: "Chain, {count} stores", "Chain, {n}+ stores", "Chain, {n}+ stores, dealer-owned" |
| Chain block | {label}. A fact about size. No score effect. · Not on the chain list (41 chains). That does not show what kind of business it is. |
| Association | Retailer association (chip) · Member of a retailer association. No score effect. (block) |
| Band headers (wide) | Near you · {n} shops within {r} mi of the center of your zip area · Sells it is a guess here: call first / Farther away · {n} shops, {a} to {b} mi · Sells it is a guess here: call first / Online · {n} shops · No address or distance · Sells it is read from the shop's listing |
| Band headers (beside a panel at wide) | Near you · {n} within {r} mi · sells it is a guess, call first / Farther away · {n}, {a} to {b} mi · a guess, call first / Online · {n} · read from the listing |
| Band headers (narrow) | Near you · {n} within {r} mi · sells it is a guess / Farther away · {n}, {a} to {b} mi · a guess / Online · {n} · read from the listing |
| Band count while filters hide some | {6} of {9} shown, in place of "{n} shops" or "{n}" ("Near you · 6 of 9 shown within 10 mi of the center of your zip area · ..."; narrow: "Near you · 6 of 9 shown · sells it is a guess") |
| Empty bands | Near you · none within {r} mi / Farther away · none between {r} and 100 mi / Online · none found. An online shop may still sell it. (narrow: Online · none found) |
| Tie title | {n} shops share this score. They are listed in the search's own order. |
| Sort note | Sorted by {People}. {17} of {19} shops have the same value ({0.50, unknown}), so among them the order is by score. |
| Sells-it sentences | Likely sells it. A guess from the shop's name and type, not a stock check. In tests 80% of nearby shops at this level really sold the product (53 of 66). Call before you go. / May sell it. A guess from the shop's name and type, not a stock check. In tests 40% of nearby shops at this level really sold the product (58 of 146). Call before you go. / Its listing names the product: "{matched_product}". In tests 98% of online shops shown really sold the product or a close equivalent. / Its listing names only the category ({category}). / Not confirmed: the shop's page did not name the product or its category, so this counts at the lowest level. Farther shops (only nearby shops were measured): Likely sells it. A guess from the shop's name and type, not a stock check. No figure was measured for farther shops; for nearby shops at this level it was {80}%. Call before you go. (May sell it: {40}%.) |
| Sells-it source link | Model judgment: likely sells it · Model judgment: may sell it · Shop's listing page |
| Sum line | {0.250} + {0.075} + {0.150} + {0.145} = {0.620}, shown as {0.62}. / {0.250} + {0.206} + {0.150} + {0.132} = {0.738}. The score is {0.739}, shown as {0.74}: each part is rounded, so the sum misses by {0.001}. (Title: The order uses the full value.) |
| Sold it in tests (compare row) | 80% of "likely" shops · 40% of "may" shops · 98% of online shops · farther: no figure (nearby: 80% of "likely" shops) · no figure (nearby: 40% of "may" shops) |
| Compare head and numbers row | Others compared to this · Compare to this · value · adds · vs {N1} · Back to compare (shop panel) |
| Dispute | Dispute · Dispute this · the note in section 5 |
| About this search | (In the thin state the "Why so few nearby?" text comes first.) Read as: {canonical_name} ({category}). · Searched online for: "{q1}", "{q2}". Nearby for: "{q1}", "{q2}". · Found: {n} near you (within {r} mi of the center of your zip area), {n} farther, {n} online. · Left out: {n} sites. {n} do not sell it, {n} not a shop, ... (then site names by reason) · Not judged: {n}. (left out when {n} is 0) · This search used {4} web lookups and an AI model, about {2} cents. The project pays for each search. No paid placement. |
| Left-out reasons | does not sell it (`sells_product`) · not a shop (`site_type`) · the wrong kind of place (`place_category`) · an article, not a shop (`editorial_url`) · not in the top 10 (`below_top_10`) · more branch of a company already shown (plural: more branches of companies already shown) (`branch_cap`) · more than 100 mi away (`too_far`) |
| Plot | Where · not to scale past {r} mi. Description: Straight lines from the center of your zip area, not from you. Not a street map. When a shop has no position: 1 shop without a position is not drawn. ({n} shops without a position are not drawn.) In that shop's own Where block: This shop has no position, so it is not drawn. |
| Filtered to nothing | {19} shops were found. Your filters hide all of them. (With shops picked: Your filters hide every shop except the ones picked to compare.) · Remove: {filter label} (one button per active filter) · Clear filters |
| Nothing found | Nothing matched "{product}", nearby or online. Try a shorter or more general name. The search ran: {4} web lookups, about {2} cents. A shop may still sell it: searches find about a third of the shops that do. |
| Thin box ("Why so few nearby?") | Your place: a rural zip area, so nearby means within 30 miles. · The site's reach: in tests it found about a third (33 to 35%) of the nearby shops that really sell it. A shop near you can exist and be missing. · Your wording: a shorter or more general name may find more. |
| Search failed | The search didn't complete. Wait a moment and try again. · Try again |
| Too many requests | Too many searches from this connection (the limit is 30 a minute). Try again in about a minute. |
| Budget spent | No search was run: the money for searches is spent for now. Search is paused. No date is set for searches to resume. · Search (paused) (Edit sheet only; the top bar's Search keeps its label, disabled) · tag: Wording proposal, not yet ruled on |
| Toasts | Address copied. (only once the copy is done) · Copy did not work. The address is shown above. (when the browser refuses it) · Prototype: this would open {host} in a new tab. · Compare holds 4. Remove one first. While compare is open, at every width, the toast sits above the Choose bar. |
| Filters sheet bar | Show {2} of {19} shops (start view: Done) · Clear |
| Tie fold | Show {5} more at {0.63} · Show fewer at {0.63} |
| Footer | About · Zip data: US Census ZCTA Gazetteer (public domain); GeoNames (CC BY 4.0). · Prototype with made-up shops. Nothing is sent anywhere. (At medium and narrow the Place and Theme switches follow.) |

About sections (fixed text, kept short; the full live wording is in rd5 section 4e):

| `sec` | Heading | Content |
|---|---|---|
| `order` | How the order works | "Each shop gets four parts between 0 and 1. Its score is their weighted sum, and the default order is by score." Weights table: Sells it 0.25, People 0.30, Planet 0.30, Distance 0.15, with the rules from rd6 section 5 in one line each. "Unknown means no certification and no finding is on file for the shop, and the search found no accepted finding about it. It counts neither for nor against the shop: People and Planet stay at 0.50." "Sorting and filtering never change a score." "A chain fact and a retailer association membership never change the score." |
| `accuracy` | Sold it in tests | The accuracy statement, then a table: online 98%; nearby 62 to 64%; "likely" 80% (53 of 66); "may" 40% (58 of 146); found 31% of the online shops that really sell it; found 33 to 35% of the nearby shops that really sell it. "Results come from one search index. Shops that block search crawlers may be missing." Links: "Raw evidence" and "Method" |
| `privacy` | Privacy | "Your zip code never leaves your browser. The site sends the product, the city and state, the center of your zip area rounded to two decimal places, and its rural-urban category. No accounts, cookies or analytics." Then who learns what and what is kept (rd1 section 3, "Sent, to whom, kept"; rows "How the site read the product", "Kept for one minute to limit searches per connection", "Server logs"), and "This prototype sends nothing and keeps nothing." |
| `amazon` | Why Amazon never appears | "Amazon, and every business it owns or has owned, never appears in results at any rank. Code removes them twice: once right after the web search, and again as the last step before results reach your browser. The language model is never the only check. The exclusion list has 39 web domains and 14 business names, each with a public source and date." Link: "The exclusion list and its sources". No business name on the list is printed in the prototype |
| `cost` | Cost | "Each search costs the project about {2} cents: {4} web lookups and the work of an AI model. No fixed running cost. No paid placement, no affiliate links, no advertising." Link: "Cost ledger" |
| `dispute` | Disputing | "Anyone can dispute a certification, a chain badge, a finding, or any part of a score, including the business itself." Then the dispute note from section 5 |
| `credits` | Source and credits | "Open source under the GNU Affero General Public License v3.0." "Zip code coordinates: US Census Bureau ZCTA Gazetteer (public domain). City and state names: GeoNames, CC BY 4.0." Link: "Source code" |

The five About links above (Raw evidence, Method, The exclusion list and its sources, Cost ledger, Source code) point at made-up pages on `project-repo.example`. Like every other link out, a click shows the toast and opens nothing.

## 9. Tokens and look

Kept by name and value from the live site (rd5 section 1): `--bg`, `--surface`, `--ink`, `--ink-muted`, `--accent`, `--accent-ink`, `--badge-bg`, `--warn`, `--warn-bg`, `--rule`, `--border-input`, `--focus`, `--shadow-popover`, `--font-voice`, `--font-ui`, `--text-sm` to `--text-2xl`, `--leading-ui`, `--leading-display`, `--leading-prose`, `--space-1` to `--space-8`, `--gutter`, `--control-height`, `--radius-control`, `--radius-panel`, `--measure` (About prose only). Dark values apply under `prefers-color-scheme: dark` when `theme=auto`, and under `:root[data-theme="dark"]`; `data-theme="light"` forces light.

| New token | Light | Dark | Use |
|---|---|---|---|
| `--surface-2` | `#E9EFEC` | `#16302D` | Top bar, facts strip, column header, band headers |
| `--row-hover` | `#EEF5F4` | `#203634` | Row under the pointer or holding focus |
| `--row-sel` | `#E3F0F0` | `#213A3B` | Opened row, reference column (same as `--badge-bg`) |
| `--track` | `#DDE5E2` | `#2A3D3B` | Empty bar track (decorative; the tick and ring carry meaning) |
| `--tick` | `#6F8683` | `#7A9391` | Middle tick, unknown ring, tie bracket, chain outline (3.9:1 and 4.5:1 on `--surface`) |
| `--part-sells` | `#4A5FA0` | `#9DB0EC` | Sells it segment (6.1:1, 6.9:1) |
| `--part-people` | `#7E4F93` | `#CDA3DF` | People segment (6.1:1, 7.0:1) |
| `--part-planet` | `#62702A` | `#BECB7E` | Planet segment (5.4:1, 8.5:1) |
| `--part-distance` | `#56707F` | `#A3BDCB` | Distance segment (5.2:1, 7.5:1) |
| `--assoc-bg` | `#E6EAE9` | `#2A3836` | Retailer association chip fill |
| `--diff-ring` | `#17302C` | `#E5EEEC` | Left-edge bar on a compare cell that differs |
| `--scrim` | `rgb(16 32 30 / 0.35)` | `rgb(0 0 0 / 0.55)` | Behind a sheet |
| `--sheet-shadow` | `0 -6px 20px rgb(0 0 0 / 0.12)` | `0 -6px 20px rgb(0 0 0 / 0.5)` | Sheet edge |
| `--drawer-shadow` | `-8px 0 20px rgb(0 0 0 / 0.14)` | `-8px 0 20px rgb(0 0 0 / 0.5)` | Medium drawer's left edge, cast over the list |
| `--mark` | `#A3246F` | `#F29BD0` | Prototype group outline, `marks=1` outlines and tags |
| `--text-xs` | `0.75rem` (12 px) | same | Smallest text: header notes, chips, #. One exception outside the scale: the People and Planet header notes are `0.6875rem` (11 px), because at 12 px the two neighboring notes touch in their 70 px columns |
| `--text-data` | `0.8125rem` (13 px) | same | Table cells, panel tables, tabular numbers |
| `--leading-dense` | `1.3` | same | Table and panel tables |
| `--space-0`, `--space-1h` | `2px`, `6px` | same | Chip gaps, cell padding |
| `--row`, `--row-2`, `--row-narrow`, `--row-narrow-2` | `32px`, `52px`, `70px`, `90px` | same | Row heights: one line, Record wrapped, narrow, narrow with Record wrapped |
| `--rail-w`, `--panel-w`, `--panel-w-compare` | `200px`, `464px`, `840px` (`920px` from 1440 px) | same | Rail and panel widths |

Contrast figures were computed with the WCAG formula. Every part color is at least 4.4:1 on `--surface`, `--surface-2`, `--row-hover` and `--row-sel` in both themes. The four part colors are close in lightness, so color never carries a part alone: segments keep one fixed order (Sells it, People, Planet, Distance) with 1 px gaps (2 px in the panel bar), the results columns and their color-underlined heads run in that order, and the panel table and compare rows name each part beside its swatch. Part colors name a part and never a quality.

Type: wordmark, headline, band names, panel shop name and About prose use `--font-voice`; everything else `--font-ui`. Dense rows: name 13 px semibold (14 px at narrow), cells 13 px, header names 13 px semibold, notes and chips 12 px, numbers `font-variant-numeric: tabular-nums`. Inputs stay 16 px. Nothing is under 12 px.

Bars:

| Bar | Size | Drawing |
|---|---|---|
| Score bar | 72 x 10 (row), 44 x 8 (narrow row), 400 x 14 (panel) | `--track` full width = 1.0. Four segments, each as wide as its contribution. No hatch in rows. In the panel only, a hatched `--warn` outline after People or Planet shows what a finding took, labeled "-0.075" |
| People, Planet micro-bar | 44 x 10 | `--track` with a 1 px `--tick` at the middle (0.50). Unknown: a hollow 6 px `--tick` ring on the tick, no fill. Raised: solid `--accent` fill from the tick to the value, ending in a 2 px cap. Lowered: diagonal-hatched `--warn` fill from the tick down to the value. Value 0.50 reached by a certification and a finding together: a 2 px `--accent` cap right of the tick and a 2 px `--warn` notch left of it, no ring |

Fact kinds, each told apart without color:

| Kind | Shape | Fill and text | Words |
|---|---|---|---|
| Certification | Pill, fully rounded, 1 px solid `--accent` outline (so it keeps its shape on a `--row-sel` fill, which is the same color) | `--badge-bg`, `--accent` text | The certification label |
| Finding | Square corners, 3 px left bar | `--warn-bg`, `--warn` text and bar | "{Kind} {year}" |
| Chain | Square corners, 1 px dashed `--tick` outline, no fill | `--ink` text | "Chain, {count} stores" |
| Retailer association | Pill, 1 px solid `--tick` outline | `--assoc-bg`, `--ink-muted` text | "Retailer association" |
| Unknown | No box | `--ink-muted`, regular weight | "unknown" |

Chips are 12 px text, 20 px tall, 6 px side padding, always one line (`white-space: nowrap`). A cell that is too narrow moves whole chips to its next line. Inline SVG only: the creek mark, sort arrows, the close mark, the hatch pattern, the plot. No icon inside chips.

Plot (D4): inline SVG, square, drawn at 152 px (rail), 88 px (shop panel) and 296 px (About this search). A small square marks the zip-area center, "N" at the top. One solid ring at the nearby radius and one dashed ring at 100 mi, with their miles written on them. When the search has no farther shop, the nearby ring takes the space up to 4 px inside the 100 mi ring (3 px at 88 px), which stays as a thin dashed edge with "100 mi" in the box's lower right corner. The center square is 4 px. Dots closer than 7 px are pushed apart along the line between them, and each rank label goes to the side of its dot (right, left, above or below) that covers the fewest other dots and stays in the box, on a halo of the plot's own fill. Near shops are 6 px dots at their distance and compass direction inside the inner ring (linear scale); farther shops sit between the rings at their direction (not to scale). Online shops are not drawn. A near or farther shop with no coordinates is not drawn either, and the caption under the plot then adds "{n} shop without a position is not drawn." (16 px); in that shop's own Where block the 88 px plot shows the other shops with no dot filled and the caption "This shop has no position, so it is not drawn." Dots are `--ink-muted`; the opened or hovered shop is `--accent` with a ring and its rank label. The 296 px plot in About this search labels every dot with its rank in `--ink-muted`, so each dot can be matched to a row. The 88 px plot prints a "not drawn" caption only about its own shop. No tiles, nothing fetched.

Focus: `:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }`, and `outline-offset: -3px` inside the table so the sticky header never clips it. A row's name button reaches 4 px into its cell's padding on each side (wide and medium) and takes `outline-offset: -1px`, so the ring clears the first and last letters. A filled (primary) button inside the table or compare gets a 2 px `--accent-ink` ring inset on its fill and a 3 px `--focus` ring just outside it, since an inset `--focus` ring on `--accent` is about 1.2:1 to 1.4:1. A focused segment of a segmented control gets a 2 px `--surface` band between it and its ring, so the ring never sits on the neighboring filled segment. Selection (the opened row) is a fill plus a left bar, so it reads apart from focus.

Motion: sheets and the drawer slide 160 ms ease-out; the toast fades 120 ms. Under `prefers-reduced-motion: reduce` there is no transition and no smooth scroll. Searching has no animation at any setting.

`marks=1`: every element with `data-d` gets a 2 px dashed `--mark` outline and a small "D1" to "D4" tag in its corner, with two exceptions: bars inside table rows get the outline only (their column header carries the tag), and a compare row shows its tag in its label cell. Tags never cover a word: the column header gets a 16 px band above the names for its tags (a sort button's tag at the left, the column's own at the right), and rail rows make room at their right, where a label that no longer fits beside the tag wraps to a second line. At narrow the Sort and Group chips carry D2 and D3.

## 10. Made-up data

Four searches exist: `sparse-metro`, `sparse-rural`, `filled-metro`, `filled-rural`, picked by `data` and `place`. The Data switch changes `data` and keeps every other key, except that a note open on a certification or finding closes (section 7). Because ids follow rank, the same shop has different ids in the two sets (Example Home Center is sparse `n4` and filled `n6`), so the switch rewrites `shop`, `cmp` and `ref` by domain: each id becomes the id of the shop with the same domain in the new set. Where a domain has two branches, the first by rank maps to the first and the second to the second. An id whose domain is not in the new set is dropped, and the fallbacks in section 2 then apply. A shop of one name has one domain in both sets of a place, and the same position wherever both sets give one, so a carried shop is the same made-up shop with a fuller or emptier record. Example: `cmp=n1,n4,o1` in sparse metro becomes `cmp=n1,n6,o1` in filled metro. The Place switch changes the search itself and clears `shop`, `cmp`, `ref` and `dispute`.

BD1 (the first build step, section 12) writes each search as a short spec and one `build(spec)` function that returns an object in the live response shape (rd6 section 1). The page reads only the built object, so no field exists that the live search does not return.

```js
// spec (authoring form, not read by the page)
{ query: { product: 'cast iron skillet', city: 'Example City', state: 'ST',
           canonical_name: 'cast iron skillet', category: 'cookware',
           online_queries: ['cast iron skillet', 'cast iron frying pan'],
           local_queries: ['kitchen supply store', 'hardware store'], near_radius_mi: 10 },
  center: { lat: 40.00, lon: -90.00 }, ruca: 1,
  shops: [ { sec: 'near', rank: 4, name: 'Example Home Center', domain: 'home-center.example',
             mi: 0.8, dir: 'SE', sells: 'likely', address: '400 Example Blvd, Example City, ST 00000',
             snippet: 'hardware', certs: [], chain: { stores: 2347, label: 'Chain, 2,347 stores' },
             finds: [ { kind: 'governance', usd: 3000000, date: '2022-04-08', relation: 'self',
                        status: 'final', source: 'trade-office.example' } ] } ],
  dropped: [ { kind: 'local', domain: 'cafe.example', reason: 'sells_product' } ],
  usage: { brave_calls: 4, llm_tokens: 4610, estimated_cost_usd: 0.024 } }

// built (what the page reads): SearchResponse
{ query, weights: { relevance: 0.25, ethics: 0.3, env: 0.3, proximity: 0.15 },
  local: [SearchResult], local_farther: [SearchResult], online: [SearchResult], usage, dropped }
// SearchResult
{ id, kind, rank, retailer: { name, domain, url }, matched_product, snippet, address,
  distance_km, lat, lon, certifications: [{ kind, label, source_url, checked }],
  signals: [{ kind, polarity: 'negative', claim, source_url, origin: 'curated', action_date,
              penalty_usd, relation, status, citation_type, band, cost }],
  score, components: [{ name, value, weight, contribution, sources: [{ label, url }],
                        minor_cap_applied }], chain: { label, stores, source_url, checked } }
```

`build` fills what the spec leaves out: `retailer.url` (`https://{domain}/stores/example-city` for local shops, `https://{domain}/p/{product}` online, the bare homepage where the table says so); `matched_product` (the product for `named`, empty otherwise and for every local shop); certification `label`, `source_url` and `checked` (2026-09-23); chain `source_url` (`https://{domain}/about`) and `checked` (2026-09-28); finding `claim`, `source_url` (`https://{source}/cases/{n}`), `band` and `cost`; and each component's `sources` with the labels in rd6 section 2.7. For an online shop the live label of the Sells it source is the listing page's own title, so `build` writes one in that pattern ("Cast Iron Skillet | Example Cast Iron Works"). Like `snippet`, it is in the data and never printed: the page shows the link text "Shop's listing page" instead.

`build` rules (rd6 section 5): `distance_km` = miles / 0.621371 rounded to 0.1; `lat`, `lon` from the center, miles and direction; relevance 1.0 for `likely` and `named`, 0.5 for `may` and `category`, 0.2 for `unconfirmed`; ethics and env start at 0.5, add 0.25 per scored certification kind (cap 1.0), then subtract each finding's cost (0.25 x band weight x relation weight, minor findings capped at 0.25 per part, floor 0); proximity `max(0, 1 - km / 40)` for local shops, 0.5 online, 0 when distance is null; contribution and score rounded to 3 places. The page derives miles and compass direction from the built `distance_km`, `lat`, `lon` and the center. `snippet` is in the data and never shown.

Naming and sources: every shop name contains "Example". Every domain and source ends in `.example`. Finding sources are "Example Trade Commission" (`trade-office.example`), "Example State Labor Agency" (`labor-agency.example`) and "Example Environment Agency" (`environment-agency.example`); claims follow the pattern "Example Trade Commission announces settlement with Example Home Center requiring refunds to customers". Certification labels are the live labels (rd6 section 1), except that kind `independent_retailer_assoc` is always worded "Retailer association" on screen; source pages are `certifier-directory.example/...`. No Amazon-owned name appears anywhere.

### Sparse metro (19 shops; the counts in sections 3 and 4 come from this table)

"cast iron skillet", Example City, ST, nearby radius 10 mi. P and Pl are People and Planet values.

| Id | Name | mi, dir | Sells | P | Pl | Score | Facts |
|---|---|---|---|---|---|---|---|
| n1 | Example Kitchen Supply | 0.4 NE | likely | 0.50 | 0.50 | 0.698 | |
| n2 | Example Restaurant Supply | 1.3 S | likely | 0.50 | 0.50 | 0.692 | |
| n3 | Example Cookware and Cutlery Supply - Example City | 2.2 E | likely | 0.50 | 0.50 | 0.687 | (50-character name) |
| n4 | Example Home Center | 0.8 SE | likely | 0.25 | 0.50 | 0.620 | Governance finding 2022-04-08, $3,000,000, major, final; Chain, 2,347 stores |
| n5 | Example Hardware Dealers | 1.9 W | may | 0.50 | 0.50 | 0.563 | Chain, 5,000+ stores, dealer-owned. First of two branches: domain `hardware-dealers.example`, address "88 Example Ave, Example City, ST 00000" |
| n6 | Example Hardware Dealers | 3.6 NE | may | 0.50 | 0.50 | 0.553 | Chain, 5,000+ stores, dealer-owned. Second branch: same name, domain and chain fact, address "1420 Example Pike, Example City, ST 00000" |
| n7 | Example Variety Store | 4.4 NW | may | 0.50 | 0.50 | 0.548 | address is an empty string (it has coordinates and a distance) |
| n8 | Example Thrift and Home | 5.1 SW | may | 0.50 | 0.50 | 0.544 | empty snippet |
| n10 | Example Farm and Garden | 6.3 E | may | 0.50 | 0.50 | 0.537 | rank skips 9: a third Example Hardware Dealers branch was dropped by the 2-branch cap and is in the left-out list |
| o1 | Example Trail Outfitters | online | named | 0.50 | 0.75 | 0.700 | Climate Label certified; Chain, 195 stores |
| o2 to o8 | Example Cast Iron Works, Example Kitchen Online, Example Pan Company, Example Cookshop, Example Home Goods Online, Example Skillet Foundry, Example Chef Supply | online | named | 0.50 | 0.50 | 0.625 each | o6 Example Home Goods Online: Chain, 888 stores |
| o9 | Example Big Box Online | online | named | 0.50 | 0.25 | 0.550 | Environmental finding 2024-07-11, $12,000,000, major, final; Chain, 1,748 stores |
| o10 | Example General Goods | online | unconfirmed | 0.50 | 0.50 | 0.425 | `matched_product` empty, bare homepage url |

Derived counts: certification 1, findings 2, no finding 17, on the chain list 6, not on it 13, unknown record 16 of 19, none of the three facts 13 of 19 (68%), "likely or named" 13, People 2 values, Planet 3 values, 9 distances, 4 sells-it levels, one tie of 7 at 0.625, one company with two branches (n5, n6). Filter option counts: People raised 0, lowered 1; Planet raised 1, lowered 1. Left out: 11 sites (4 do not sell it, 2 not a shop, 2 articles, 2 not in the top 10, 1 third branch). Usage: 4 lookups, 4,610 tokens, $0.024.

### Sparse rural (17 shops)

"wool socks", Example Township, ST, radius 30 mi, category clothing.

| Section | Shops (name, mi dir, sells, score, facts) |
|---|---|
| Near (4) | n1 Example Outdoor Supply, 2.4 SE, likely, 0.685 · n2 Example Feed and Mercantile, 0.6 N, may, 0.571 · n3 Example Dollar Market, 3.8 W, may, 0.552, Chain, 20,959 stores · n4 Example Farm Store, 6.9 S, may, 0.533 |
| Farther (3) | f5 Example Wool Mill Shop, 38 NE, likely, 0.550 · f6 Example Sporting Goods, 52 S, likely, 0.550, Chain, 914 stores · f7 Example Country Clothing, 67 W, may, 0.425. Distance part 0 on all three |
| Online (10) | o1 Example Hiking Outfitters Online, 0.700, Climate Label certified, Chain, 195 stores · o2 to o8 at 0.625: Example Sock Company, Example Wool Works, Example Knit Shop, Example Footwear Online, Example Merino Goods, Example Workwear Online, Example Outdoor Basics · o9 Example Department Store Online, 0.550, Governance finding 2020-12-17, $3,000,000, Chain, 1,117 stores · o10 Example General Goods, unconfirmed, 0.425 |

Counts: certification 1, finding 1, chain 4, unknown record 15 of 17. Left out: 9 sites. Usage: 4 lookups, 4,480 tokens, $0.023.

### Filled metro (23 shops)

Same search as sparse metro. Every shop carries at least one fact; 6 of 23 still read "unknown" beside a chain or association chip.

| Id | Name | mi, dir | Sells | P | Pl | Score | Facts |
|---|---|---|---|---|---|---|---|
| n1 | Example Kitchen Supply | 0.4 NE | likely | 1.00 | 0.75 | 0.923 | Worker co-op, B Corp, 1% for the Planet |
| n2 | Example Cookware and Cutlery Supply - Example City | 2.2 E | likely | 0.75 | 0.50 | 0.762 | Sells Fair Trade Certified products |
| n3 | Example Market Hall | 2.9 SW | likely | 0.6875 | 0.50 | 0.739 | Sells Fair Trade Certified products; Labor finding 2025-03-03, $40,000, open, minor (cost 0.0625) |
| n4 | Example Camp and Trail | 3.6 N | may | 0.50 | 1.00 | 0.703 | Climate Label certified, 1% for the Planet; Chain, 190+ stores |
| n5 | Example Restaurant Supply | 1.3 S | likely | 0.50 | 0.50 | 0.692 | Retailer association |
| n6 | Example Home Center | 0.8 SE | likely | 0.125 | 0.4375 | 0.564 | Governance 2022, $3,000,000, major; Labor 2023, $145,000, citation `repeat`, standard; Environmental 2019, $60,000, minor; Chain, 2,347 stores |
| n7 | Example Hardware Dealers | 1.9 W | may | 0.50 | 0.50 | 0.563 | Retailer association; Chain, 5,000+ stores, dealer-owned. First of two branches |
| n8 | Example Hardware Dealers | 3.6 NE | may | 0.50 | 0.50 | 0.553 | Retailer association; Chain, 5,000+ stores, dealer-owned. Second branch: same name, domain and facts, its own address |
| n10 | Example Farm and Garden | 6.3 E | may | 0.50 | 0.4375 | 0.518 | Environmental 2021, amount not stated, related company (cost 0.0625); Chain, 2,000+ stores |
| n11 | Example Thrift and Home | not given | may | 0.75 | 0.50 | 0.500 | B Corp; `distance_km`, `lat`, `lon` null |
| f12 | Example Foundry Outlet | 14 N | likely | 0.50 | 0.75 | 0.691 | Climate Label certified (Distance part 0.438: farther, yet inside 25 mi) |
| f13 | Example Lodge Supply | 68 W | likely | 0.375 | 0.50 | 0.513 | Governance 2024, $250,000, `related-at-shop`, standard; Chain, 450 stores |
| f14 | Example Country Kitchen | 41 SE | may | 0.50 | 0.50 | 0.425 | Chain, 21 stores |
| o1 | Example Trail Outfitters | online | named | 1.00 | 1.00 | 0.925 | Climate Label certified, B Corp, Sells Fair Trade Certified products, 1% for the Planet; Chain, 195 stores |
| o2 | Example Cast Iron Works | online | named | 0.50 | 0.75 | 0.700 | 1% for the Planet |
| o3 | Example Kitchen Online | online | named | 0.75 | 0.50 | 0.700 | B Corp |
| o4 | Example Pan Company | online | named | 0.75 | 0.50 | 0.700 | Worker co-op |
| o5 | Example Cookshop | online | category | 0.75 | 0.75 | 0.650 | Sells Fair Trade Certified products, Climate Label certified |
| o6 | Example Home Goods Online | online | named | 0.50 | 0.50 | 0.625 | Chain, 888 stores |
| o7 | Example Skillet Foundry | online | named | 0.50 | 0.25 | 0.550 | 5 minor Environmental findings, 2018 to 2024 (cap applied: cost 0.25, not 0.3125); Chain, 30+ stores |
| o8 | Example Chef Supply | online | named | 0.25 | 0.50 | 0.550 | Labor 2023, $20,750,000, major; Chain, 600 stores |
| o9 | Example General Goods | online | unconfirmed | 0.50 | 0.50 | 0.425 | Chain, 8,000 stores |
| o10 | Example Big Box Online | online | named | 0.00 | 0.25 | 0.400 | Governance $2,500,000 and Labor $1,200,000 (People reaches 0), Environmental $12,000,000, all major; Chain, 1,748 stores |

Counts: certification 11, finding 7, chain 13, unknown record 6, ties of 3 at 0.700 and 2 at 0.550, one company with two branches (n7, n8), one shop with no position (n11: "Distance not given", not on the plot, hidden by any Within limit). Left out: 14 sites using all seven reasons.

Shops in both metro sets, sparse id to filled id: n1 to n1, n2 to n5, n3 to n2, n4 to n6, n5 to n7, n6 to n8, n8 to n11, n10 to n10, o1 to o8 unchanged, o9 to o10, o10 to o9. Only in sparse: n7. Only in filled: n3, n4, f12, f13, f14.

### Filled rural (16 shops, with only 8 online)

| Section | Shops |
|---|---|
| Near (5) | n1 Example Outdoor Supply, 2.4 SE, likely, 0.760, 1% for the Planet · n2 Example Grange Co-op, 12 E, likely, 0.703, Worker co-op · n3 Example Feed and Mercantile, 0.6 N, may, 0.571, Retailer association · n4 Example Farm Store, 6.9 S, may, 0.533, Chain, 2,446 stores · n5 Example Dollar Market, 3.8 W, may, 0.477, Labor 2024, $1,500,000, major, Chain, 20,959 stores |
| Farther (3) | f6 Example Wool Mill Shop, 38 NE, likely, 0.700, B Corp, Climate Label certified · f7 Example Sporting Goods, 52 S, likely, 0.513, Governance 2023, $500,000, standard, Chain, 914 stores · f8 Example Country Clothing, 67 W, may, 0.425, Chain, 57 stores |
| Online (8) | o1 Example Sock Company, 0.775, B Corp, 1% for the Planet · o2 Example Wool Works, 0.700, Sells Fair Trade Certified products · o3 Example Hiking Outfitters Online, 0.700, Climate Label certified, Chain, 195 stores · o4 Example Footwear Online, 0.625, Chain, 661 stores · o5 Example Workwear Online, 0.606, Environmental 2025, $300,000, open, minor, Chain, 1,598 stores · o6 Example Knit Shop, category, 0.575, Worker co-op · o7 Example Department Store Online, 0.550, Governance 2020, $3,000,000, major, Chain, 1,117 stores · o8 Example General Goods, unconfirmed, 0.425, Chain, 8,000 stores |

If a built score differs from a table here, the build function wins and the builder fixes the table's row in a comment in the HTML, not the formula.

## 11. Accessibility

- Landmarks: `header` (top bar), `nav` (About, prototype group), `aside` with label "Filters" (rail), `main` (list), `aside` with label "Details" (panel), `footer`. Results has a heading hidden from sight, "Shops for {product} near {city}, {state}". Skip links first in the page: "Skip to results", "Skip to filters".
- Table: one `table` with `caption` (hidden from sight) "Shops for {product} near {city}, {state}". Because narrow CSS changes `display`, every element carries its role in the markup: `role="table"`, `rowgroup`, `row`, `columnheader`, `cell`, and `rowheader` on the Shop cell. Each band is its own `tbody` whose first row is a header cell spanning all columns. The sorted column has `aria-sort`. At narrow the header row is hidden from sight only.
- Row text for screen readers: the score cell's accessible text lists all four parts ("Score 0.62. Sells it 0.250, People 0.075, Planet 0.150, Distance 0.145"), so nothing is lost when People and Planet cells are not drawn at narrow. Bars are `role="img"` with that text. Chips are text.
- Focus order: skip links, top bar, facts strip, rail (on Start it follows the form and the notes, so Tab reaches the product field first), column header buttons, then each row (compare box, name), then the footer (it follows `main` in the list column and is still the page's `footer` landmark, not a child of `main`), then the panel. Back or Forward to another view puts focus at that view's start: the product field on Start, the searching card's heading, the About section's heading, or the first row's name on results (the results heading when no row shows). "Clear filters" in the rail moves focus to the first row's name. Opening a panel moves focus to its heading; closing returns focus to the row's name button (when that row is folded at narrow, the fold's button; compare: the "Compare" button in the "To compare" band; About this search: the button that opens it). The same holds when browser Back or Forward opens or closes a panel or sheet. "Skip to results" lands on the first row's name button, or the panel's heading at narrow while a panel is the page; "Skip to filters" is hidden on views without filters and while a panel is the page at narrow. Search and Try again move focus to the searching card's heading, then to the first row's name when results arrive. A sheet traps focus while open and closes on Escape. Focus is never left on the page body: Clear in the "To compare" band moves it to the first row's box, and removing down to one shop moves it to that shop's box.
- Keyboard map: Tab and Shift+Tab move between controls. Enter or Space activates. Up and Down move between rows when a row's name or compare box has focus, staying in the same control. Escape closes the toast together with the sheet or, when no sheet is open, the panel, in one press. Arrow keys move inside radio groups. No single-letter shortcuts.
- Live region: one `role="status"` (polite) says the search state ("Searching for shops near {city}, {state}", then "Found ..."), "{n} of {N} shops shown" after a filter ("Saved for your next search." while no rows show), "Sorted by {name}" after a sort, "One list" or "Grouped by kind" after a Group change, "{name} added to compare, {n} of 4", "{name} removed from compare, {n} of 4", "Compare cleared", "Address copied", and each toast. Field errors use `aria-invalid` and `aria-describedby`.
- Names: the wordmark link is named "nottheriver, new search", since at narrow only its mark shows.
- Targets: 44 px at narrow for every control: the row compare box, chips, buttons, check box labels, the wordmark, Edit, the Data switch segments, About in the top bar and footer, the start view's Filters, "Only rows that differ", and links that stand alone (Source, Website, the About links, "Open the dispute form"). In the 44 px top bar a control's own box is 44 px tall and its visible part is drawn inside it. At least 24 by 24 px at wide (check boxes sit in 32 px cells).
- Contrast: text 4.5:1 or better; bars, ticks, rings, outlines and input borders 3:1 or better against the fill behind them; `--track` and `--rule` are decorative. No fact is told by color alone (section 9).
- Zoom: at 200% zoom on a 1280 px window the page falls to the narrow layout and never scrolls sideways. Reduced motion is honored (section 9).

## 12. Build order

Four builders edit `docs/ui-prototype/prototype.html` in turn. Each leaves the file working: no console errors, no outside request, every hash listed for an earlier step still rendering.

| Step | Must exist when it ends | Hashes that must render |
|---|---|---|
| BD1: tokens, shell, form, data, results | All tokens in section 9 in both themes, with `data-theme` set from `theme`. The hash parser and writer for every key in section 2 (keys owned by later steps are parsed and stored, not yet acted on) and one state object. The four specs, `build(spec)` and the four built searches. Page shell: top bar with the form, facts strip, empty rail box, list, empty panel box, sheet box, status region, footer. Start view with the headline, notes and working validation; searching view; Search moves start to searching to results. The results table at wide with every column, cell case, chip, bar, band, tie mark and the Record overflow rules of section 4, at `sort=score`, `group=kind` | `#view=start` · `#view=searching` · `#view=results` · `#view=results&data=filled` · `#view=results&place=rural` · `#view=results&data=filled&place=rural` · `#view=results&theme=dark` |
| BD2: opened shop and compare | The panel box at wide and as a plain full-screen layer below it. Opened shop with all nine blocks, previous and next, the dispute note, Copy address, the link toast, both sum lines and the missing distance and address cases. Compare boxes, the "To compare" band, the compare panel with every row, reference, differences, all four gap-sentence templates, the same-company line, "Only rows that differ". The two narrowed tables. The chosen panel. The id fallbacks of section 2 | `#view=results&panel=shop&shop=n4` · `#view=results&panel=shop&shop=o9&sec=record` · `#view=results&panel=shop&shop=n4&dispute=finding1` · `#view=results&data=filled&panel=shop&shop=n6` · `#view=results&cmp=n1,n4,o1` · `#view=results&panel=compare&cmp=n1,n4,o1` · `#view=results&panel=compare&cmp=n1,n4,o1&ref=n4&only=diff` · `#view=results&data=filled&panel=compare&cmp=n1,n6,o1,o10` · `#view=results&panel=compare&cmp=n1,o1` (parts nearly cancel) · `#view=results&panel=compare&cmp=n5,n6` (same company) · `#view=results&panel=compare&cmp=o2,o3` (same four parts) · `#view=results&panel=shop&shop=n7` (address not given) · `#view=results&data=filled&panel=shop&shop=n11` (distance not given) · `#view=results&data=filled&panel=shop&shop=n3` (sum line that misses by 0.001) · `#view=results&panel=chosen&shop=n1` · fallbacks: `#view=results&panel=shop&shop=n9` and `#view=results&panel=compare&cmp=n1` both render the plain results |
| BD3: sort, filters, grouping, plot | The rail with every control, live counts and the two notes. Sort buttons in the column header, header notes, the sort note row, all six sorts, `group=none`, every filter, the filtered-to-nothing row. "Why here" (every neighbor case in section 5) and "Next shop" following the shown order. The plot in the rail and in the shop panel, with its "not drawn" caption. The About this search panel. The rail on the start view. The "Filters" button and the rail as a sheet while compare is open at wide | `#view=results&sort=distance` · `#view=results&sort=people` · `#view=results&group=none` · `#view=results&group=none&sort=distance&kind=near,far` · `#view=results&f=nochain` · `#view=results&f=finding&data=filled` · `#view=results&within=3&people=down` · `#view=results&f=cert&kind=near` · `#view=results&panel=search` · `#view=results&sort=distance&panel=shop&shop=n4` · `#view=results&panel=compare&cmp=n1,n4,o1&sheet=filters` |
| BD4: states, switches, narrow, dark, keyboard | Every `state` value on start and results. The About view with its seven sections. The visible Data, Place and Theme controls, with the Data switch carrying `shop`, `cmp` and `ref` by domain. `marks=1` outlines and tags on every element in section 13. Medium and narrow layouts: three-line rows, chip row, Filters and Edit sheets, panel and compare as sheets, tie fold, footer switches. Dark theme checked on every view. Skip links, arrow keys in rows, focus moves, Escape order, live-region messages, reduced motion. A last check against the rules in the brief | `#view=start&state=typing` · `#view=start&state=err-zip` · `#view=results&state=empty` · `#view=results&place=rural&state=thin` · `#view=results&place=rural&state=thin&panel=search` · `#view=results&state=no-online` · `#view=results&state=failed` · `#view=results&state=rate` · `#view=results&state=budget` · `#view=about&sec=order` · `#view=about&sec=amazon` · `#view=results&marks=1` · `#view=results&theme=dark&data=filled` · at 360 px: `#view=results` · `#view=results&sheet=filters` · `#view=results&panel=shop&shop=n4` · `#view=results&panel=compare&cmp=n1,n4,o1` · `#view=results&group=none&ties=open` |

Shared contracts BD1 fixes for the others: `state` (parsed hash), `setState(patch, push)`, `getSearch(state)` (the built search or a canned state), `getRows(state)` (ordered, filtered, grouped rows; BD3 extends it), `gap(a, b)` (signed contribution differences of the four parts, used by "Why here", the "vs" column and compare), `fmtMiles`, `compass`, and one `render()` that redraws from `state`. Elements that later steps fill keep the ids `rail`, `list`, `panel`, `sheet`, `status`. Every builder puts `data-d="D1"` (or D2, D3, D4) on each element it builds that section 13 lists; BD4 only styles them.

## 13. Departures from standing rulings

| | Used | Where it shows (each carries `data-d`) |
|---|---|---|
| D1: score and parts as numbers or bars | Yes | The Score column (number and four-part bar), the People and Planet micro-bars, the "Why this score" table (value x weight = adds), the "vs" column beside compare, the Score and part rows in compare. Departs from the 2026-09-24 ruling (plain words only); the plain words stay beside each number in the "Why this score" table |
| D2: filter and sort by criteria | Yes | Sort buttons on Sells it, People and Planet. Rail: "Any record on file", "Has a finding", "No finding on file", "On the chain list", "Not on the chain list", "Likely or named", "Within", "People", "Planet". The two chain boxes reverse the 2026-09-27 ruling (badge only, no filter). Sort by Score, Distance and Name, the three Show boxes and "Has a certification" exist on the live site and are not departures |
| D3: one combined list | Yes, as an option | "Group: One list". The default keeps the three sections as bands. All kinds share one table and one set of columns in both groupings |
| D4: drop, shrink or move the street map | Yes | No street map and no tiles. A drawn plot in the rail, in the opened shop's Where block and in About this search |

## 14. Not in this prototype

| Left out | Why |
|---|---|
| Price, stock, opening hours, delivery, reviews, ratings, phone | The live search returns none of them |
| Real search, real zip lookup, any request | Made-up shops only; nothing leaves the page |
| Map tiles, "open in your map app", device location | Outside parties |
| Weight sliders or any second score | The site score is the only number; criteria reorder and hide rows |
| Reversing a sort | One direction per sort is enough to judge the design |
| Suggested shops, co-op badge, price level, per-company roll-up, dispute state, case counts per chain (RB1) | Planned or undecided fields, not returned today |
| Positive findings and model-written findings | Allowed by the type, never returned today |
| Saving anything between visits | No accounts, no storage; the product text lives in the field only |
| The names on the exclusion list (IV-D15; IV labels are items in `docs/wireframes/inventory.md`) | No Amazon-owned name is printed anywhere, About included (IV-F3). About says how many entries the list has and links to it; the link shows the toast |
| The raw evidence, the cost ledger, the source code (IV-D17, IV-D18, IV-D19) | Each is a labeled link in About to a made-up `project-repo.example` page. The link shows the toast and opens nothing |

### Judge findings that stay, and proposal ideas not taken

| Item | Decision |
|---|---|
| Two-place scores suggest more certainty than a 62 to 64% nearby accuracy supports | Stays. Offset by the accuracy statement in the facts strip, "a guess" in every nearby cell, tie marks, and three-place sums only in the panel |
| Sorting by People or Planet does little in sparse data | Stays. The header notes and the sort note row say so before and after the click |
| Compare of sparse shops is mostly "=" | Stays. The gap sentence says they differ only in sells-it level and distance |
| Opening a shop hides four columns of the other rows | Stays for width. Record and score remain (under a part or distance sort, the sorted column takes Score's place); compare brings the parts back for the picked shops |
| Three table layouts at wide (full, beside a shop, beside compare) | Stays. They are one table with columns hidden by a class on the table, not three components |
| Tied rows and unknown rows are still drawn one per shop at wide, so seven sparse online rows at 0.625 take 224 px | Stays. Every shop keeps its own row; the tie bracket and one muted word keep them quiet. The rows differ in name, which is what a shopper scans the online band for, and one carries a chain chip. Folding them at wide would hide five shops the screen has room for: all 19 fit at 1280x800 |
| At narrow, People and Planet are not separate cells | Stays. The score bar, the opened shop and compare carry them |
| The rail folds while compare is open | Stays for width (four full columns need 840 px). "Filters" stays in the facts strip, and a hidden shop says which filter hides it |
| People and Planet columns hold mostly rings in sparse data | Stays. They take 140 px and are the two parts the headline promises; their header notes say how little they vary |
| A bottom compare tray (proposal D) | Replaced by the sticky "To compare" band header, which shows the count and holds Compare and Clear without a second strip |
| Tie fold at narrow hides shops until a tap | Stays at narrow only. The button states the count and the score |
| "Not on the chain list" could be read as a virtue | Kept as the D2 trial the owner allowed. The side-effect note prints while the box is ticked, and no screen says what kind of business the remaining shops are |
| The finding chip omits the word "finding" ("Labor 2023") | Stays so a finding and a chain chip fit one line. Shape, the warn bar, the accessible name and the opened shop say it in full |
| Certification and finding chips inside the People or Planet cell (C) | Not taken. One Record cell matches the ruled record line, and it stays beside a shop, chosen or search panel and in the narrow row (the list beside compare drops it). The micro-bars sit next to it |
| Run-merged "unknown" cells (C); People and Planet auto-fold (A) | Not taken. Every row says its own "unknown", and both data sets keep the same columns |
| One-hue score bar (B); hatched baseline segments (C, D) | Not taken. The one-hue steps fell to 2.0:1 contrast, and hatching the middle value can read as a shortfall |
| Five-step sells-it glyph, in-cell 25 mi scale, compass arrow (A); spread strip of dots (B) | Cut to keep a 32 px row to two bars and words |
| Lead-with and then-by ordering with value bands, per-row "Why here" column (C) | Not taken: a second ordering idea. "Why here" lives in the panel and follows the shown order |
| Hold-as-reference keys H, M, C and a grid with active descendant (B) | Not taken. Compare uses labeled buttons and check boxes only |
| Combined rank numbering, part-floor sliders, drag-handle half sheet, rings view that replaces the list (D) | Not taken: a rule break, a false promise of fine distinctions, and two extra modes |
| One-criterion lens at 360 (A) | Replaced by the three-line row |
