# Three wireframes from a blank page

Three low-fidelity designs for the site, each built on a different idea of what a visitor needs first. None is recommended for adoption here; choosing a direction is the operator's decision (WD1, at the end).

- The designers never saw the current site. All they had was [inventory.md](inventory.md), which lists needs, information, functions and rules and says nothing about screens.
- To view one, open its `wireframe.html` in a browser. Each file shows every state twice, at 360 px and at 1280 px wide, with buttons at the top to show one state at a time.
- Nothing was rendered in a browser during this work (the brief forbids it). Whether the 360 px frames really fit was reasoned from the markup, not seen.

## The three designs

| Design | Folder | In three lines |
|---|---|---|
| WF1, sequence | [wf1-sequence/](wf1-sequence/) | A path of six steps with one step open at a time: what, where, search, how soon, which shop, go. After the search the visitor says how soon they need it, then reads one shop at a time through three checks (does it sell it, can I reach it, what is on its record). Trust, cost and privacy answers sit at the step where the question comes up, and again on one page in step order. |
| WF2, place | [wf2-place/](wf2-place/) | One drawing, called the plan, that the browser makes from the zip alone: the zip-area center, a circle for the nearby distance, a circle at 100 miles, and a strip beside it for online shops, which have no place. The zip is asked before the product. Shops are listed by zone from the center outward, and accuracy is stated per zone. |
| WF3, evidence | [wf3-evidence/](wf3-evidence/) | The answer is a ledger of statements. Every statement about a shop is marked as one of five kinds: sourced, judged by the language model, measured by the site, nothing found, or the site's own claim. Nearby and online shops share one list in score order, an opened shop is compared part by part with its neighbor, and one view arranges the whole answer by who says so. |

Each folder holds four files:

| File | What it is |
|---|---|
| `why.md` | The designer's reasons, what the design makes harder, and its weakest point in the designer's own view |
| `wireframe.html` | The design |
| `coverage.md` | Where the design handles each inventory item |
| `check.md` | An independent checker's gaps, then a "Fix round" table saying what was done about each |

## Comparison

"Coverage gaps" comes from each folder's `coverage.md` after its fix round. The fixes were not checked a second time. Inventory labels are explained in the list under the table. The last two columns are the lead agent's judgments.

| | WF1, sequence | WF2, place | WF3, evidence |
|---|---|---|---|
| Question answered first | What is the next thing I need to know to get from this need to one shop? | Where, from where I am, can I get this? | What is this placement based on, and how far can I rely on it? |
| Made harder (from `why.md`) | Comparing many shops side by side; seeing nearby and online shops together; skipping ahead | Seeing the single best shop by score; comparing an online shop with a nearby one; reading the method before results | Picking the closest shop at a glance; seeing shops on a map; filing a dispute quickly |
| Weakest point (designer's view) | Asks "how soon" though the site knows nothing about stock, hours or delivery, then leads to one nearby shop where the data is least reliable | Leads with the least accurate results and the lightest part of the score; the plan can be read as a street map | The visitor who needs one shop today reads a long list; much of it shows that nothing was found |
| Functions partly handled | IV-D5, IV-D7, IV-D12, IV-D13 | IV-D5, IV-D6 | IV-D5 |
| Rules partly handled | IV-F11 | IV-F2, IV-F10, IV-F11 | IV-F11 |
| Planned additions not drawn | IV-E12, IV-E14 | IV-E3 to IV-E6, IV-E8 to IV-E14 (IV-E7 partly) | IV-E3 to IV-E5, IV-E9, IV-E10, IV-E12, IV-E13 (IV-E6, IV-E8, IV-E11, IV-E14 partly) |
| Checker's gaps | 24: 2 block a visitor, 2 mislead, 20 minor | 21: 1 blocks, 4 mislead, 16 minor | 17: 0 block, 3 mislead, 14 minor |
| After the fix round | 22 fixed, 2 in part | 21 addressed, 3 of them by a stated rule, not drawn | 13 fixed, 4 in part |
| Distance from the current site | Farthest | Closest | In between |
| Rough build size | Largest | Middle | Middle; larger with the by-source view |

Inventory items named in the table:

| Label | Item |
|---|---|
| IV-D5 | Reorder results by score, distance or name. All three draw the control; none draws every reordered list |
| IV-D6 | Narrow results (nearby only, online only, certified only) |
| IV-D7 | Judge which shops are practical to reach |
| IV-D12, IV-D13 | Dispute a concern; dispute a certification, a chain fact or a score part. WF1 marks these partly because filing needs a GitHub account and no lookup of a shop exists outside a search. Those limits come from the product and apply to all three |
| IV-E3 to IV-E14 | Planned or proposed additions: suggested shops, consumer co-ops, price level, step-by-step progress, budget spent, dispute records, wider kinds of places, favoring independents, zip fallback, a curated shop directory, daily totals, concern age |
| IV-F2 | Nothing fetched from an outside party by default. WF2 marks it partly because of its optional "open in your map app" exit |
| IV-F10 | Usable at 360 px. WF2 marks it partly because its plan is small at that width |
| IV-F11 | Keyboard and screen-reader use. All three state the behavior; a static wireframe cannot show it |

Why the last two columns read as they do (lead agent's judgment):

- WF2 keeps the current shape (a picture of the area, then nearby, farther and online shops in that order) and replaces its parts. WF1 replaces the shape itself with a path. WF3 keeps a list with shops that open, and changes what a row is.
- WF1 needs a step-by-step flow, a one-shop view, a dispute path and a question page, and removes the map. WF2 needs the plan drawn in the browser with a text equivalent and a rule for crowded marks. WF3 needs each statement tagged by kind, which the search answer already carries in part, plus the by-source view.
- No estimate in hours or lines was made.

## What each design would force the operator to decide

| Label | Design | Decision |
|---|---|---|
| WD2 | WF1 | Whether the site may ask "how soon do you need it" when it has no stock, opening hours or delivery times |
| WD3 | WF1 | Whether product and zip become two steps, and whether showing one shop in full at a time is acceptable when nearby results are right about two times in three |
| WD4 | WF1 | Whether a dispute can start without a search. The design draws the path, but no lookup of a shop exists |
| WD5 | WF2 | Whether the street map is replaced by a drawing made in the browser. This reverses a decision already made (see "Map imagery" below) |
| WD6 | WF2 | Whether the zip is asked before the product, and whether the default order is by zone, with score ordering shops only inside a zone |
| WD7 | WF1, WF2 | Whether to offer "open in your device's map app". Both designers mark it as an outside party the operator must accept |
| WD8 | WF3 | Whether nearby and online shops share one list by score. In the designer's example the nearest shop is fourth, under three online shops |
| WD9 | WF3 | Whether there is no map at all, and whether visitors are asked to learn five kinds of statement |
| WD10 | WF3 | Who is named as paying for searches (the design leaves a blank), and whether "search again" may reuse the city and zip-area center the browser already worked out |
| WD11 | All three | Whether an opened result shows numbers for the score parts. The operator ruled on 2026-09-24 that the reasons are plain words (`docs/STATUS.md`); the inventory says both forms exist, and all three designers drew the numbers |
| WD12 | All three | What a visitor is told when the search budget is spent. Each designer proposed wording; the inventory marks this undecided (IV-E7) |

## Map imagery: a gap in the inventory, not a design finding

- The operator has already accepted OpenStreetMap map images on the site, knowing OpenStreetMap sees the visitor's IP address and the area (`docs/STATUS.md`, "Decisions made by the operator").
- The inventory does not say so. That sentence was removed during the leak checks because it told a reader the current site has a map.
- The designers therefore read rule IV-F2 (nothing fetched from an outside party by default) as ruling map images out. None of the three uses any: WF2 draws its own plan, WF3 gives up the map and says why, WF1 uses a ruler and a compass direction.
- So "no street map" in all three is partly an effect of what the designers were told. Any of the three could carry a street map at the cost the operator has already accepted; in WF2 it could sit under the plan.

## The current site against the three

Written after the designers' briefs were all sent. The lead agent has read `index.html`, `about.html` and `src/render.ts`; the designers and checkers have not.

What the current design does that none of the three does:

| Label | Current site |
|---|---|
| CS1 | Shows nearby shops on a street map, with numbered pins that lead to the matching shop in the list |
| CS2 | Gives the reasons for a placement in plain words only, with no numbers beside the parts |
| CS3 | Names four Amazon-owned brands as examples where it explains the exclusion. All three designers named none, reading rule IV-F3 (Amazon and its brands never appear, including in example text) strictly |
| CS4 | Keeps every trust, privacy, quality and cost explanation on one separate page of prose. The three each draw such a place too, and also move parts of it next to the form and the results |

What all three do that the current design does not:

| Label | All three wireframes |
|---|---|
| WA1 | Say what is sent and what is kept at the zip field, before anything is typed. The current site says it on the About page |
| WA2 | State measured accuracy beside the results (about 62 to 64% of nearby shops and 98% of online shops really sell the product). The current site states it on the About page |
| WA3 | Name the four things a search does while the visitor waits. The current site shows one sentence |
| WA4 | Offer a dispute on certifications, chain facts and score parts at the result. The current site offers "Dispute this" on concerns only, and promises the rest in text |
| WA5 | Say before the visitor leaves that filing a dispute needs a GitHub account and that no response time is promised |
| WA6 | Draw a budget-spent state. The current site has none |
| WA7 | Show a compass direction for a nearby shop, worked out from its coordinates |
| WA8 | Show numbers for the score parts in an opened result (see WD11) |
| WA9 | Show what the search left out and why. The search answer carries it; the current site does not show it |

WF1 and WF2 also add a "how to get there" step with the address to copy.

## Which I would test first

WF1 (sequence), in the lead agent's judgment. This is a choice of what to learn first, not of what to build.

- It is the farthest from the current site, so a test of it says the most that is not already known.
- Its main risk is about people, not data: whether someone led one step at a time to a single nearby shop notices that the shop may not sell the product. A click-through of the existing file with a few people would show that. No such test has been run, and the repo holds no user research.
- WF2's open questions depend on how a real plan looks with real shop positions, and WF3's on how long a real ledger is. Both need live data to judge.

## Limits of this work

- Each design had one check and one fix round. The fixes were not checked again.
- Example shops, scores and concerns in the wireframes are invented placeholders. The outside services the inventory names (Brave Search, OpenRouter, Cloudflare, GitHub) appear by name because rule IV-F2 asks that outside parties be named.
- WF3 was finished by a second designer after the first was cut off; the second read the first's file and worked from the same lens.
- Scans of the three HTML files found no images, external files, links out, colors other than gray, or shop names without "Example". The folder is about 0.5 MB.

## Decision for the operator

WD1 (which wireframe direction to pursue): WF1, WF2, WF3, a mix, or none. Decisions WD2 to WD12 above follow from that choice.
