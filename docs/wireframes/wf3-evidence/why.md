# WF3 Evidence: why this design

## The one question it answers first

"What is this placement based on, and how far can I rely on it?"

Every other question (where is the shop, how do I get there) is answered after that one, or inside it.

## The idea in one line

A search answer is a ledger of statements. Each shop is a row of four statements, and each statement is drawn as one of five kinds. A sixth mark is kept for chain size alone.

| Kind of statement | Meaning | Drawn as |
|---|---|---|
| Sourced | An outside source says so; address and date given | Thick solid bar at the left |
| Judged | A language model's judgment, shown with how often such judgments were right | Dashed bar |
| Measured | Calculated or counted by the site, method public | Double bar |
| Nothing found | Counts as the middle, not as bad | Pale bar |
| This site says | The site's own claim about itself, with no outside source; a link to a public file sits beside it | Thin bar, and the words "This site says" |
| Size, not a rating | Chain size only; never scored | Rounded outline |

Membership of an independent retailer association is a certification kind that is never scored. It is drawn as sourced, with the words "never scored", so it cannot be taken for the chain mark.

## The order of information, and why

| Step | State in the wireframe | What comes first there | Why |
|---|---|---|---|
| 1 | State A (arriving) | One sentence, then the form, with the site's claims about itself and their evidence beside it | A visitor who doubts the site can check it before typing; the form is still second on the page |
| 2 | State B (asking) | A table of what leaves the browser and who receives it | The privacy claim is shown as a fact about this search, not as a promise elsewhere |
| 3 | State C (waiting) | The four steps and the kind of statement each will produce | The wait teaches the vocabulary the answer uses |
| 4 | State D (results, both kinds) | "What this answer rests on", then one list of nearby and online shops together | One score compares every shop, so one list; accuracy is stated before the first row |
| 5 | States E and F (nearby and more distant, online only) | The reliability of that kind of "sells it", then the rows | The two kinds differ most in how sure "sells it" is (80% and 40% nearby, 98% online) |
| 6 | State H (one result opened) | Each score part with who says so and the arithmetic, then a part-by-part comparison with the neighboring shop, named on every line. Two records are drawn: a nearby shop with a concern, and an online shop with certifications | "Why is this shop behind that one" is a comparison, so it is drawn as one |
| 7 | State I (concern and dispute) | The concern in the source's words, then how it was counted, then the dispute path and its limits | A reader judges the concern before the site's handling of it |
| 8 | State J (sources) | The same answer arranged by who says so, with the search wording and what was left out | Lets a doubter audit the whole answer, not one shop at a time |
| 9 | State K (this site's record) | The site's own accuracy first, then ordering, exclusion, privacy, cost, code, in that order at both widths | The site is held to the standard it applies to shops: its unsourced claims are marked "This site says", not "Sourced" |

The top bar always holds "Ask" and "This site's record"; "Shops" and "Sources" join them after a search. "Ask" reopens the form from any state.

## What it deliberately makes harder

| Made harder | How | Why accepted |
|---|---|---|
| Picking the closest shop at a glance | Nearby and online shops share one list; each row carries four statements; distance order is one press away (state E) | The lens puts the reasons for a placement ahead of speed |
| Seeing shops on a map | There is no map; state E gives miles, compass direction, street address and a 25 mile strip | A map would make the browser fetch from an outside party |
| Reading a shop as good or bad | No grades, stars or verdict words; "nothing found" is the most common entry | The site knows little about most shops, and the design shows that |
| Filing a dispute quickly | The dispute control is on every line of state H, but filing leaves the site and needs an account at the code host | That is the only intake that exists; state I, part I3 (the dispute path) says so before the visitor leaves |

## The weakest point, in the designer's own judgment

The visitor who needs one shop today (inventory item IV-A6) pays for the evidence everyone else gets.

- At 360 px each shop takes about seven lines or more (each statement now carries its weight and who says so), so nine shops is a long scroll.
- Most shops have "nothing found" for people and for planet, so much of the ledger displays the absence of evidence. That is honest, but it is a lot of space for it.
- The nearest shop is at place 4 in state D, under three online shops. A hurried visitor has to find the "Nearby and more distant" control.

A second weak point: state J (sources) may be a tab that few visitors open. It is the purest form of the lens and the least needed for choosing a shop.

## Guesses and open points

| Item | Status |
|---|---|
| State L, box L1 (budget spent) | This designer's proposal. The product has no such behavior and the inventory marks it undecided, so no reset date is shown |
| Telling budget spent, rate limit and failure apart | Assumed possible; the inventory does not say |
| Who funds the searches | Not in the inventory; state K, part K5 (cost and who pays) leaves a bracket for the operator |
| Outside parties | Named as the inventory names them (the search provider, the language-model service, two hosts, the code host). This designer reads the brief's bar on real business names as applying to shops |
| The reopened form | Product filled in, zip always empty, following the rule that the zip is never recalled (state B, second box) |
| "Search again" after a refusal or failure (state L) | A guess: the page reuses the city, state and zip-area center it already worked out, so the zip need not be typed again. If that counts as recalling the zip, the control must reopen the form instead |
| A shop with unknown distance | Drawn as a variant outside the 9 shops in state E. The closeness value the formula uses for it is not in the inventory, so it is a bracket |
| Distance order on the mixed list | This designer's rule: known distances first, then unknown, then online shops in score order |
| The value of the online closeness part | Shown as 0.50, read from "a fixed middle value" on a 0 to 1 scale |
| The exclusion set | Shown as bracketed rows, with no brand examples, to keep those brands out of example text |
| "Under dispute" and "corrected" markers | Not built; shown only as a designer note in state I, part I3 (the dispute path) |
| The amount each concern takes, and the value of each sells-it level | Placeholders; only the caps come from the inventory |
| Keyboard and screen reader use | Stated in the designer note of state D (focus order, how the selected control and each statement's kind are announced); a static gray wireframe cannot demonstrate it |
| The page before any search | State K is drawn as reached after a search; the before-search top bar and the "No search yet" row are stated in its note, not drawn as a separate frame |
