# WF1 Sequence: why this design

## The one question it answers first

"What is the next thing I need to know to get from this need to one shop?"

The page is a path of six steps and a visitor is always at exactly one of them. One step is current. The step-4 choice ("how soon") stays open above step 5, because changing it is the way to switch between nearby, farther and online shops.

## The order it chose, and why

| Step | The visitor learns or decides | Why here |
|---|---|---|
| 1 What | Names the product | The only thing a visitor certainly has on arrival |
| 2 Where | Gives a zip, with what is sent and kept beside the field | The privacy question (IV-B2) arises at the moment of typing a location, not on a separate page |
| 3 Search | Waits about 3 seconds; reads the four things that happen | The only moment a visitor has nothing to do, so it carries "what was just sent". When the search ends, the folded step shows what it found and what it cost |
| 4 How soon | Picks one: go and get it, drive farther, wait for delivery, or no preference | The first decision after results is about time, and it settles which kind of shop to read. It doubles as the nearby-only and online-only narrowing |
| 5 Which shop | Reads one shop at a time through three checks in a fixed order: does it sell it, can I reach it, what is on its record. Then "choose", "next shop" or any shop by name | Each check can end the consideration of a shop, so the cheapest check to fail comes first. "Sells it" comes first because for nearby shops it is the least certain fact (62 to 64% right) |
| 6 Go | Check first, get there, fall back to the next shop; what the search cost; what is kept | Retention is an after-the-fact question. Cost is repeated here from step 3 |

Other choices that follow from the lens:

- Finished steps fold to one line each and stay on screen, so the visitor can see the path taken and change any step.
- Trust, cost and privacy answers are attached to the step where the question arises ("Asked at this step"). The standing answers also appear as one page, "Every question, in order" (frame S10), sorted by step, for people who will not search. Answers about one search or one shop (its cost, why one shop is ahead of another) appear only at their step.
- A thin result is answered at step 4 as a sequence too: wording first, location second, the site's limit third.
- A dispute is a path of its own: four steps from a search (frame S8), five for someone who is not searching (frame S8b), where the added first step is finding what is said.
- The score explanation lists the four parts in the order of the three checks (sells it, how close, people, planet), not in order of weight.

## What it deliberately makes harder

| Harder | Why accepted |
|---|---|
| Comparing many shops side by side | The design shows one shop in full and the rest as one-line rows |
| Seeing nearby and online shops together | Needs the "no preference" answer at step 4 (frame S5b) |
| Seeing where shops are in relation to each other | Distance is a ruler and a compass direction in words, not a plan of the area |
| Reading the method as a document | It is cut up by step; the full method is a link out |
| Skipping ahead | Product and zip are two steps, one more action than a single form |
| Finding what is said about one shop without searching | No lookup by shop exists; frame S8b says so and sends the person to a search |

## Weakest point, in this designer's view

Step 4 asks "how soon" and the site knows nothing about time: no stock, no opening hours, no delivery times. The step stands in for time with distance and kind of shop, and says so, but a visitor may still read "I will go and get it" as a promise that they can. With nearby shops right 62 to 64% of the time, the path leads people to a single shop at the point where the data is least reliable. The "check first" line at step 6 and the fallback to the next shop soften this, they do not fix it.

Second weakness: the default order inside a step-4 answer is the score, but grouping by "how soon" first means a higher-scoring online shop is out of sight for a visitor who chose "go and get it" or "drive farther". Frame S6b names the online shop it hides; frame S4 does not.

Third weakness, found in the fix round: a shop owner who is not searching has no sure way to see everything said about the shop (frame S8b).

## Calls made that the inventory left open

| Call | Basis |
|---|---|
| Amazon is named only where the purpose or the exclusion is explained: the purpose line and the "What is this for?" answer in frame S1, and the exclusion question and answer in frames S1 and S10. None of its brands are named anywhere | The brief forbids them in example text; IV-B13 and IV-D15 need the exclusion stated |
| "Open in my device's map app" hands the address to the visitor's own app; the site fetches no map. Marked in frame S9 as a cost the operator has to accept | IV-F2. This designer's proposal, not an existing function |
| Budget-spent wording, and showing it at step 1 before typing | IV-E7 is undesigned. No date, period or offer is invented |
| Compass direction of a shop from the zip-area center | Derived from the coordinates in IV-C3; absent when coordinates are missing |
| Score part values in the frames (1.00 named, 0.80 category, 0.60 likely, 0.40 possibly, 0.50 fixed middle for online closeness) | Example values only; the inventory gives weights, not level values |
| Search cost is shown on the folded step 3 as soon as a search ends; a search that did not finish shows no cost | IV-C9 says one cost exists per search; IV-C16 says a failed search reports only that it failed |
| Changing the product keeps the place from step 2 while the page stays open; a reload empties step 2 | This designer's reading of "never recalled" in IV-F1: the place is held by the open page only and saved nowhere. The operator may prefer that the zip is typed every time |
| When ordered by distance, shops with known miles come first; online shops and shops with unknown distance follow by score | The inventory does not say where they go |
| The distance ruler changes scale: full width is the nearby limit (10 or 30 miles) for nearby shops and 100 miles for more distant ones, and each ruler states its scale | Needed to draw both kinds of shop at 360 px |
| For a more distant shop, the "likely" and "possibly" accuracy figures are quoted as nearby-shop figures, with a statement that no separate figure exists | IV-C12 gives figures for nearby shops only |
| One "left out" and "not judged" summary per search, the same under every step-4 answer | IV-C11 does not say the counts are per kind of shop |
| Dispute links copy the retailer, the item shown and the source address for the visitor; a visitor arriving without a search types them | This designer's proposal; the form's fields are in IV-D12 |
| Keyboard and screen-reader behavior stated at the top of the wireframe (focus moves to the new step's heading, one announcement per outcome, single-choice groups) | IV-F11 gives the rule, not the behavior |
