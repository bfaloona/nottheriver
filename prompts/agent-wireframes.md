# Brief: three very different wireframes from a blank page

First read `prompts/agent-shared-rules.md` and follow it. Handoff note: `handoff/2026-11-11-wireframes.md`.

## Goal

Three wireframes that differ in kind, each letting a visitor do everything the site lets them do today or is planned to, designed by agents who have never seen the current design. The method is information design: settle why a visitor is here and what they need to know, in what order, before anyone decides how it looks.

You are the lead. Your one job that nobody else can do is to keep the current design away from the designers. You will read the site; they must not. Everything they learn about it passes through one document, the inventory, and that document must describe needs and information, never screens.

If you cannot start subagents, this overrides the shared fallback: finish stages 1 and 2 as far as you can, write the three designer briefs to `docs/wireframes/briefs/`, push, stop and report. Never design a wireframe yourself; you have seen the site.

## Stage 1: the inventory (you write it)

Read the site (`index.html`, `about.html`, `src/`), `docs/STATUS.md` (Done, Priorities, "Decisions needed"), `docs/feasibility-overview.md`, `docs/ranking.md`, `docs/privacy.md`, `docs/plans/`, `docs/ideas.md` and `research/competitors/README.md`.

Write `docs/wireframes/inventory.md` with:

| Section | Content |
|---|---|
| IV-A, why people come | The situations that bring someone here and what they want to walk away with. From the repo's own statements; your inferences labeled as yours |
| IV-B, the questions a visitor asks, in the order they arise | For example "can I get this near me today?", "why should I trust this ranking?", "what do you know about me?" |
| IV-C, the information that exists | Each kind of thing the site knows (a shop, a distance, a certification, a concern with its source and date, a chain label, a score and its parts, what a search cost, how accurate results are measured to be, what is kept), with its fields, how many of each a visitor typically gets, and which are uncertain |
| IV-D, what a visitor can do | Every function, including ones that exist only as a link today (dispute a finding) |
| IV-E, headed towards | Planned or likely additions, each marked planned, proposed or undecided, with its source file |
| IV-F, rules any design must keep | The zip never leaves the browser; no accounts or tracking; Amazon and its brands never appear; every ranking is explained with sources; every concern can be disputed; usable at 360 px wide; keyboard and screen-reader usable; honest when results are thin or the budget is spent |

The inventory must contain no layout: no page names, section names or headings from the site, no order of elements on a screen, no component words (card, tab, sidebar, modal, badge, map above the list), no colors or fonts. Describe a nearby shop and an online shop as two kinds of result with different fields, not as two sections.

## Stage 2: check the inventory for leaks

Start one fresh subagent with only `docs/wireframes/inventory.md`. Ask it two things: list every phrase that tells a reader how the current site is laid out or styled, and sketch in three sentences what it guesses the current site looks like. Remove every phrase it lists. If its guess is close to the real site, rewrite the leaking parts and run a new checker; repeat until the guess is generic.

## Stage 3: three designers, in parallel, blind

Start three fresh subagents. Each gets `docs/wireframes/inventory.md`, one lens from the table, the output rules below, and this restriction: read nothing in the repo except the inventory and your own output folder; do not open `src/`, any `.html` or image file outside your folder, `docs/`, `research/` or `handoff/`; do not browse the web for shopping sites to imitate.

| Designer | Organizing lens | Folder |
|---|---|---|
| WF1 | The visitor's decision as a sequence in time: what they need to know first, second, third to get from a need to a shop they will go to | `docs/wireframes/wf1-sequence/` |
| WF2 | Place: where the visitor is and where things are is the frame that everything else hangs on, including shops with no physical place | `docs/wireframes/wf2-place/` |
| WF3 | Evidence: the visitor is weighing claims, so sources, comparisons and reasons are the main material and the shops are what the evidence is about | `docs/wireframes/wf3-evidence/` |

A lens is a starting commitment, not a layout. If two designs end up alike, the difference was not taken far enough.

Each designer writes, in its folder:

- `why.md`: the one visitor question this design answers before all others, the order of information it chose and why, what it deliberately makes harder, and the weakest point of the design in its own view.
- `wireframe.html`: one self-contained low-fidelity file (boxes, labels and realistic placeholder text; gray only; system font; no images, no scripts beyond showing and hiding states, no external files) showing every state the design needs at 360 px and at 1280 px wide: arriving, asking, waiting, results of both kinds, a thin or empty result, one result opened to its reasons and sources, a concern and its dispute path, the information about trust, cost and privacy, and the budget-spent state. Placeholder shops are invented and say "Example"; no real business names.
- `coverage.md`: a table with one row per item in inventory sections IV-B, IV-D, IV-E and IV-F and where the design handles it, or "not handled" with the reason.

## Stage 4: check and compare

1. Start one fresh subagent per wireframe (or one for all three, sequentially) with the inventory and that folder. It verifies `coverage.md` row by row against `wireframe.html`, checks the IV-F rules, and lists what a visitor cannot do. Send gaps back to that designer once for a fix.
2. You write `docs/wireframes/README.md`: the three designs in three lines each, a comparison table (what each answers first, what each makes harder, coverage gaps, how far each is from the current site, rough build size), what each would force the operator to decide, and how to view them (open the HTML file in a browser). Now that you may compare with the current site, add one section naming what the current design does that none of the three does, and the reverse. No recommendation to adopt one; say which you would test first and why.

## Merge

Everything under `docs/wireframes/` and the STATUS row goes to `main` without approval; it is documentation and nothing under `docs/` ships on the site. Change nothing in `src/`, `index.html`, `about.html` or `public/`. Choosing a direction is the operator's decision; list it under "Decisions needed" in `docs/STATUS.md`.

## Size

No `npm ci`, no browser, no screenshots. The whole `docs/wireframes/` folder stays under 1 MB.

## Model

Fable for the lead, the three designers and the checkers.
