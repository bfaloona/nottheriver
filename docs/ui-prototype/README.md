# Interface prototype

A clickable prototype of a new search and results interface, in one HTML file. It passed the final scripted check at 1280 and 360 px wide (98 of 98) and at 1100 px (48 of 48). No person has used it. The first thing to judge is UP1 below: with data as empty as real results, most cells on the main screen read the same.

Paths in this file start at the repo root.

## What this is and how to open it

- The file is `docs/ui-prototype/prototype.html`. Open it in a browser. It is one file with its styles and script inside, and needs no build step or server.
- Every shop is made up and every shop name contains "Example". Every link out ends in `.example` and shows a short note instead of opening.
- Nothing is sent anywhere: no request, no storage, no cookies. Search returns the made-up set the switches pick, whatever is typed. Any five digits work as a zip; `00000` shows the unknown-zip error.
- The design spec is `docs/ui-prototype/design.md`. Sixteen screenshots from the final check are in `docs/ui-prototype/screens/`.

## How to drive it

Each view and state is set by the part of the address after `#`; the window width picks the layout. Paste one of the hashes below after the file's address, or click through from `#view=start`. Back and Forward work.

| Switch | Values | What it does |
|---|---|---|
| Data | Sparse, Filled | Sparse is as empty as real results: 16 of 19 shops read "unknown". Filled gives every shop at least one fact (23 shops). An open shop and the compare picks carry over to the same shops |
| Place | Metro, Rural | Metro is "cast iron skillet" in Example City, nearby within 10 mi. Rural is "wool socks" in Example Township, nearby within 30 mi, with Farther away shops. It closes an open shop and clears the picks |
| Theme | Auto, Light, Dark | Auto follows the system setting |

The switches sit in the dashed "Prototype" box in the top bar. Under 1280 px wide, Place and Theme move to the page footer.

`marks=1` has no control. Add `&marks=1` to any hash and each of the four departures (D1 to D4, below) gets a dashed outline and a tag. It also runs the file's data and wording self-checks, which report to the browser console.

| Hash | What it shows |
|---|---|
| `#view=start` | Start: headline, form, what is sent, filters to set before searching, two sample results |
| `#view=results` | The main screen. Sparse metro: 19 shops, 9 facts each, on one 1280x800 screen with no scrolling |
| `#view=results&data=filled` | Filled metro: 23 shops in three bands, chips on every row |
| `#view=results&panel=shop&shop=n4` | A shop opened beside the list: the score as a sum of four parts, a finding with its source, "Why here" |
| `#view=results&panel=compare&cmp=n1,n4,o1` | Compare of 3 shops: aligned rows, differences from one shop, a sentence naming the largest gap |
| `#view=results&data=filled&panel=compare&cmp=n1,n6,o1,o10` | Compare of 4 shops in the filled set |
| `#view=results&panel=compare&cmp=o2,o3` | Compare of two sparse shops: every difference reads "=" |
| `#view=results&panel=chosen&shop=n1` | The choosing step: address to copy, website, what the site does not know, a fallback shop |
| `#view=results&sort=people` | Sort by People in sparse data. A note row says 18 of 19 shops share one value |
| `#view=results&f=nochain` | The "Not on the chain list" filter, with the note it prints about what else it hides |
| `#view=results&place=rural&state=thin` | Rural search with no nearby shop and the "Why so few nearby?" box |
| `#view=results&marks=1` | The departures outlined and tagged |
| `#view=results&theme=dark&data=filled` | Dark theme, filled set |
| `#view=about&sec=order` | About: how the order works, with the weights |

For the phone layout, make the window narrower than 1024 px or use the browser's device mode at 360 px. Two checked states are for that layout: `#view=results&sheet=filters` (the filters as a full-screen layer) and `#view=results&group=none&ties=open` (a folded tie group opened).

## What is in it

| View | Hash | What it holds |
|---|---|---|
| Start | `view=start` | Headline, form, what is sent in place of the zip, cost line, filters to set first. Also `state=typing` and three field-error states |
| Searching | `view=searching` | The four steps a search takes and what was sent. Loaded by hash it holds still |
| Results | `view=results` | A facts strip with the measured accuracy, a filter rail with counts, and one table: rank, shop, sells it, People, Planet, distance, score with a four-part bar, record. Bands for Near you, Farther away and Online, or one list. Six sorts |
| Opened shop | `panel=shop&shop=n4` | "Why this score" (value x weight = adds for each part, with a source and a Dispute control), the record (finding cards, certifications), "Why here", the sells-it sentence, the chain fact, where (plot, address, website), what the site does not know |
| Compare | `panel=compare&cmp=n1,n4,o1` | 2 to 4 shops as columns over 15 aligned rows, each difference signed against one shop, "Only rows that differ", a Choose button per shop. The list beside it shows each shop's difference from that shop |
| Chosen | `panel=chosen&shop=n1` | Address with Copy, website, straight-line distance, the sells-it sentence, a fallback shop |
| About this search | `panel=search` | How the product was read, the search wording, counts, the sites left out and why, cost, a labeled plot |
| Message states | `state=empty`, `thin`, `no-online`, `no-near`, `failed`, `rate`, `budget` | Nothing found, few nearby, one kind empty, failed, too many requests, budget spent |
| About | `view=about&sec=order` | Seven sections: order, sold it in tests, privacy, why Amazon never appears, cost, disputing, source and credits |

| Window width | Layout |
|---|---|
| 1280 px and up | Rail on the left, list in the middle, panel on the right, each scrolling on its own |
| 1024 to 1279 px | The rail opens from a "Filters" button. A shop sits beside the list. Compare slides over the list |
| Under 1024 px | Each table row becomes a block of two to four lines. Filters, the search form, a shop and compare are full-screen layers |

## Where it came from

The spec is built on design proposal A, "the comparison grid" (spec section 1). A to D are four proposals written from the wireframes (`handoff/ui-prototype/design-a.md` to `design-d.md`). The wireframe sources below are from proposal A's own table (its section 8). WF1 is the sequence wireframe, WF2 place, WF3 evidence (`docs/wireframes/`).

| Part of the prototype | Wireframe |
|---|---|
| The table: one row per shop with the score parts as columns, the search's own rank (N4, O2) kept under any sort, filter boxes with counts | WF3; the counts also from WF1 |
| Opened shop: the "Why this score" table, the finding card, the "Why here" comparison with the neighboring shop | WF3 and WF2 for the table and the card; WF3 and WF1 for the comparison |
| Facts strip count line, section band headers, the list of sites left out, Copy address, the website link | WF2; the left-out list also from WF3, Copy address also from WF1 |
| The four waiting steps, "Why so few nearby?", the failure messages, the sells-it sentence with its measured share, the chain fact drawn apart, a fallback shop after choosing | WF1; the sells-it sentence also in WF2, and the waiting steps, the few-nearby box, the failure messages and the chain fact also in WF3 |
| The plot | Not stated in the spec. It has the elements of WF2's plan (zip-area center, nearby ring, 100 mi ring), drawn small |
| Compare of 2 to 4 shops, the four-part score bar, the People and Planet bars, tie marks, the phone row, state in the address, the Sparse and Filled switch, `marks=1` | Not in proposal A's table, so new as far as the proposals record |

Proposal ideas that were not taken are in the last table of spec section 14.

## The four departures from standing rulings

The owner allowed all four to be tried and judged after seeing them (2026-11-16). `marks=1` outlines each.

| | Departs from | Where it shows |
|---|---|---|
| D1 (score and parts as numbers and bars) | 2026-09-24 ruling: "Why this rank" is plain words | The Score column (number and four-part bar), the People and Planet bars, the "Why this score" table in an opened shop, the "vs" column beside compare, the Score and part rows in compare. The plain words stay beside each number in the "Why this score" table |
| D2 (filter and sort by criteria) | 2026-09-27 ruling: chain or not shows as a badge only, with no filter. The spec names that ruling for the two chain boxes; it names none for the other D2 controls | Sort buttons on Sells it, People and Planet. In the rail: Any record on file, Has a finding, No finding on file, On the chain list, Not on the chain list, Likely or named, Within, People, Planet |
| D3 (one combined list) | The live site's three separate sections. No ruling date is recorded in the spec or `docs/STATUS.md` | "Group: One list" in the rail (the Group chip under 1024 px). The default keeps the three sections as bands. `#view=results&group=none` |
| D4 (no street map) | Operator decision in `docs/STATUS.md`, no date recorded: the map of nearby shops loads with OpenStreetMap tiles | No map and no tiles. A drawn plot at the foot of the rail, in an opened shop's Where block and in About this search |

## Decisions it raises for the owner

| Label | Decision | Where to look |
|---|---|---|
| UP1 (build it or not, given sparse data) | Whether this design is worth building while real results look like the sparse set. There, 16 of 19 Record cells read "unknown", 18 People bars and 17 Planet bars are the same empty ring, and seven online shops tie at 0.63, six of them differing only by name. A compare of two such shops is all "=" | `#view=results`, `#view=results&sort=people`, `#view=results&panel=compare&cmp=o2,o3`; then the same with Data set to Filled |
| UP2 (D1, numbers) | Keep the score numbers and bars beside the words, or go back to words only. Two-place scores sit next to a 62 to 64% nearby accuracy | Score column; `#view=results&panel=shop&shop=n4` |
| UP3 (D2, criteria) | Keep the criteria filters and part sorts, and whether to reverse the 2026-09-27 ruling for the two chain boxes. "Not on the chain list" can be read as a virtue | `#view=results&f=nochain` |
| UP4 (D3, one list) | Offer "One list" beside the three sections | `#view=results&group=none` |
| UP5 (D4, map) | Replace the street map with the drawn plot, keep the map, or have neither | Foot of the rail; `#view=results&panel=search` |
| UP6 (budget wording) | The budget-spent message is a proposal, tagged "Wording proposal, not yet ruled on" on screen | `#view=results&state=budget` |

## What was checked and how

- The browser was a cached Chromium build driven by script (`handoff/ui-prototype/shoot.mjs`). No person has used the prototype. Every shop is made up.
- Final check, 1280x800 and 360x740: 50 states, 98 checks (48 states at 1280 and all 50 at 360; two states are listed for 360 only). 98 ok, 0 failed. Console errors 0, page errors 0, outside requests 0, horizontal overflows 0, empty pages 0. Report: `handoff/ui-prototype/shots/closing/report.json`.
- Final check, 1100 px wide: 48 states, 48 checks, 48 ok, 0 failed. Console errors 0, page errors 0, outside requests 0, empty pages 0, overflows 0. Report: `handoff/ui-prototype/shots/closing-1100/report.json`.
- Scan of the file's source for anything that could reach outside it or store data (web addresses, `src=`, `url(`, `@import`, `<link`, `fetch(`, `XMLHttpRequest`, storage, cookies): 1 match in both runs, `const WEB = 'https://';` at line 1494. The scan's positive control worked in both runs.
- Scan of the file for the names and domains in `data/blocklist.json`: "amazon" 6 times (the headline's "never Amazon", and the About section "Why Amazon never appears" with its key in the address) and no other brand name. "ring" matched 25 times as the common word: the mark for unknown, the plot's rings, focus rings.
- Before the final check: two review rounds, each followed by fixes. Round 1 had seven reviewers (layout at 1280, layout at 360, shopper walks with real clicks and keys, the rules, accessibility, code, wording): 86 findings, 84 confirmed, 81 fixed (2 in part). Round 2 had four (the two layouts, walks, code): 43 findings, 39 confirmed, 39 fixed, 3 of them in part.
- After round 2's fixes, two more defects were fixed by the lead agent: the People and Planet header notes ran together, and at 1100 px the page measured 1,940 px wide with Filters opened over compare. Only the scripted check ran after those fixes. The rules, accessibility and wording reviews were done once, in round 1, and not repeated on the final file.
- The final run does not load `sheet=edit`, `state=err-product`, `state=err-zip-unknown` or `state=no-near`, and loads the dark theme on results only.
- For this README, 46 screenshots from before the last two fixes were read by an agent: 23 at 1280, 18 at 360, 5 at 1100, in both data sets and both themes. The lead agent read 16 more, 6 of them after the fixes.
- No report lists a run in any browser but Chromium, with a screen reader, or under browser zoom.

## What falls short

Against the request ("a cohesive interface that allows users to search, scan results, evaluate tradeoffs, and select a store/company based on various criteria", data-rich and tight on space first, then attractive):

| | Serves it | Falls short |
|---|---|---|
| One cohesive interface | The same rail, list and panel in every state; under 1024 px the same parts restack | At 1280 the list has three column sets (alone, beside a shop, beside compare), so columns change under the reader. From 1024 to 1279 px compare covers the list |
| Search | Form on Start and in the top bar; what is sent is said before the zip is typed; field errors; filters can be set before searching | Under 1024 px the form on results is behind "Edit". Search returns the same made-up set whatever is typed, so real wording and waiting are untested |
| Scan results | 19 sparse shops with 9 facts each on one 1280x800 screen; header notes count how many shops share a value; tie marks | In sparse data the rows look alike (UP1). At 360 px 7 sparse or 6 filled shops fit a screen. In the filled set 16 of 23 fit at 1280 and five of the first ten rows take two lines |
| Evaluate tradeoffs | Compare with signed differences per part; the "vs" column in the list; "Why here" in an opened shop | Sparse compares are mostly "=". Opening a shop takes Sells it, People, Planet and Distance away from every other row. Only the four score parts can be weighed: the site holds no price, stock or hours |
| Select by criteria | Filter boxes that show their count before a tick; six sorts; Choose leads to an address and a website | In sparse data "Any record on file", "Has a certification" and "Has a finding" hold 3, 1 and 2 shops, and "No finding on file" holds 17 of 19. One direction per sort. No way to weigh one criterion against another |
| Data-rich views | 9 facts in each row; the score sum, each source and each finding in full are one click away | In sparse data most of those facts are the same word |
| Use of the viewport | No scrolling for 19 shops at 1280; a shop or a compare opens beside the list | People, Planet and Record take 432 of the table's 1,032 px and hold something other than a ring or "unknown" on 6 of 19 sparse rows. The Start page's main column ends about 540 px down an 800 px screen |
| Attractive and compelling | One set of colors and type across views; both themes are legible | It is a plain dense table. No person has judged the look |

Defects and limits. SF6, SF8, SF10 and SF11 come from the build, review and fix reports and SF12 from the spec; the rest were seen in the final screenshots or the file.

| Label | Where | What falls short |
|---|---|---|
| SF1 | Rail plot at 1280x800 | Its bottom edge and the "100 mi" label need a scroll inside the rail. With "Not on the chain list" ticked, the note pushes about half of the plot off screen. A dot carries no rank label there until its row is hovered or opened |
| SF2 | List beside an opened shop at 1280 | Four sparse rows wrap to two lines (N5, N6, O1, O9), so O9 is cut and O10 is below the screen |
| SF3 | Compare at 360 px | Shop names in the column heads are cut after three lines ("Example Kitchen..."). The gap sentence is cut to two lines behind "More". The rows after Findings sit under the Choose bar. A fourth shop is off screen to the right until the table is scrolled |
| SF4 | Opened shop at 360 px | The four part rows take 80 px each, so the first finding's card starts about 636 px down a 740 px screen and its last lines are cut |
| SF5 | Rows under 1024 px | People and Planet are not shown as separate values. Under the score sort a tie of four or more shops is folded behind a button |
| SF6 | Ticking a compare box far down the list | The new copy in "To compare" can sit above the visible area until the list is scrolled up |
| SF7 | Score bar | The blue for Sells it and the slate for Distance are close. Segment order and the colored column heads carry the meaning |
| SF8 | Windows under 360 px | Not supported. At 320 px the page scrolls sideways (it first overflows at about 330 px) |
| SF9 | `marks=1` | The D4 tag on the rail's plot sits at the plot's bottom edge, which is out of view at 1280x800 until the rail is scrolled |
| SF10 | Spec and file | `design.md` was edited in each fix round, in places to record what the file does (for example the narrow chip widths and the narrow compare head). A match between the two does not show the file meets the first design |
| SF11 | Compare at 1024 to 1279 px | It slides over the list with nothing dimmed behind it and no focus trap (the trap code covers the full-screen layers only). Escape closes it. The spec asks for neither |
| SF12 | Left out on purpose (spec section 14) | Reversing a sort, weight sliders, price, stock, hours, phone, reviews, map tiles, saving anything between visits |
