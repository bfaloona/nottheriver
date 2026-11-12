# WF3 Evidence: why this design

## The one question it answers first

"What is this placement based on, and how far can I rely on it?"

Every other question (where is the shop, how do I get there) is answered after that one, or inside it.

## The idea in one line

A search answer is a ledger of statements. Each shop is a row of four statements, and each statement is drawn as what it is: sourced, judged, measured, or nothing found.

| Kind of statement | Meaning | Drawn as |
|---|---|---|
| Sourced | An outside source says so; address and date given | Solid bar at the left |
| Judged | A language model's judgment, shown with how often such judgments were right | Dashed bar |
| Measured | Calculated or counted by the site, method public | Double bar |
| Nothing found | Counts as the middle, not as bad | Pale bar |
| Not scored | A fact for information (chain size, association membership) | Rounded outline |

## The order of information, and why

| Step | State in the wireframe | What comes first there | Why |
|---|---|---|---|
| 1 | State A (arriving) | One sentence, then the form, with the site's claims about itself and their evidence beside it | A visitor who doubts the site can check it before typing; the form is still second on the page |
| 2 | State B (asking) | A table of what leaves the browser and who receives it | The privacy claim is shown as a fact about this search, not as a promise elsewhere |
| 3 | State C (waiting) | The four steps and the kind of statement each will produce | The wait teaches the vocabulary the answer uses |
| 4 | State D (results, both kinds) | "What this answer rests on", then one list of nearby and online shops together | One score compares every shop, so one list; accuracy is stated before the first row |
| 5 | States E and F (nearby only, online only) | The reliability of that kind of "sells it", then the rows | The two kinds differ most in how sure "sells it" is (80% and 40% nearby, 98% online) |
| 6 | State H (one result opened) | Each score part with who says so and the arithmetic, then a part-by-part comparison with the neighboring shop | "Why is this shop behind that one" is a comparison, so it is drawn as one |
| 7 | State I (concern and dispute) | The concern in the source's words, then how it was counted, then the dispute path and its limits | A reader judges the concern before the site's handling of it |
| 8 | State J (sources) | The same answer arranged by who says so, with the search wording and what was left out | Lets a doubter audit the whole answer, not one shop at a time |
| 9 | State K (this site's record) | The site's own accuracy first, then ordering, exclusion, privacy, cost, code | The site is held to the standard it applies to shops |

## What it deliberately makes harder

| Made harder | How | Why accepted |
|---|---|---|
| Picking the closest shop at a glance | Nearby and online shops share one list; each row carries four statements; distance order is one press away (state E) | The lens puts the reasons for a placement ahead of speed |
| Seeing shops on a map | There is no map; state E gives miles, compass direction, street address and a 25 mile strip | A map would make the browser fetch from an outside party |
| Reading a shop as good or bad | No grades, stars or verdict words; "nothing found" is the most common entry | The site knows little about most shops, and the design shows that |
| Filing a dispute quickly | The dispute control is on every line of state H, but filing leaves the site and needs an account at the code host | That is the only intake that exists; state I, part I3 (the dispute path) says so before the visitor leaves |

## The weakest point, in the designer's own judgment

The visitor who needs one shop today (inventory item IV-A6) pays for the evidence everyone else gets.

- At 360 px each shop takes about seven lines, so nine shops is a long scroll.
- Most shops have "nothing found" for people and for planet, so much of the ledger displays the absence of evidence. That is honest, but it is a lot of space for it.
- The nearest shop is at place 4 in state D, under three online shops. A hurried visitor has to find the "Nearby and more distant" control.

A second weak point: state J (sources) may be a tab that few visitors open. It is the purest form of the lens and the least needed for choosing a shop.

## Guesses and open points

| Item | Status |
|---|---|
| State L, box L1 (budget spent) | This designer's proposal. The product has no such behavior and the inventory marks it undecided, so no reset date is shown |
| Telling budget spent, rate limit and failure apart | Assumed possible; the inventory does not say |
| Who funds the searches | Not in the inventory; state K, part K5 (cost and who pays) leaves a bracket for the operator |
| Service providers | Shown by role with a "[named here]" bracket, because the brief bars real business names; the real page must name them |
| The exclusion set | Shown as bracketed rows, with no brand examples, to keep those brands out of example text |
| "Under dispute" and "corrected" markers | Not built; shown only as a designer note in state I, part I3 (the dispute path) |
| The amount each concern takes, and the value of each sells-it level | Placeholders; only the caps come from the inventory |
| Keyboard and screen reader use | Stated in notes; a static gray wireframe cannot demonstrate it |
