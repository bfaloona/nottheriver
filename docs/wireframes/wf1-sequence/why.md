# WF1 Sequence: why this design

## The one question it answers first

"What is the next thing I need to know to get from this need to one shop?"

The page never shows more than one step open. It is a path of six steps, and a visitor is always at exactly one of them.

## The order it chose, and why

| Step | The visitor learns or decides | Why here |
|---|---|---|
| 1 What | Names the product | The only thing a visitor certainly has on arrival |
| 2 Where | Gives a zip, with what is sent and kept beside the field | The privacy question (IV-B2) arises at the moment of typing a location, not on a separate page |
| 3 Search | Waits about 3 seconds; reads the four things that happen | The only moment a visitor has nothing to do, so it carries "what was just sent" |
| 4 How soon | Picks one: go and get it, drive farther, wait for delivery, or no preference | The first decision after results is about time, and it settles which kind of shop to read. It doubles as the nearby-only and online-only narrowing |
| 5 Which shop | Reads one shop at a time through three checks in a fixed order: does it sell it, can I reach it, what is on its record. Then "choose" or "next shop" | Each check can end the consideration of a shop, so the cheapest check to fail comes first. "Sells it" comes first because for nearby shops it is the least certain fact (62 to 64% right) |
| 6 Go | Check first, get there, fall back to the next shop; what the search cost; what is kept | Cost and retention are after-the-fact questions |

Other choices that follow from the lens:

- Finished steps fold to one line each and stay on screen, so the visitor can see the path taken and change any step.
- Trust, cost and privacy answers are attached to the step where the question arises ("Asked at this step"). The same answers appear as one page, "Every question, in order", sorted by step, for people who will not search.
- A thin result is answered at step 4 as a sequence too: wording first, location second, the site's limit third.
- A dispute is a four-step path of its own.
- The score explanation lists the four parts in the order of the three checks (sells it, how close, people, planet), not in order of weight.

## What it deliberately makes harder

| Harder | Why accepted |
|---|---|
| Comparing many shops side by side | The design shows one shop in full and the rest as one-line rows |
| Seeing nearby and online shops together | Needs the "no preference" answer at step 4 |
| Seeing where shops are in relation to each other | Distance is a ruler and a compass direction in words, not a plan of the area |
| Reading the method as a document | It is cut up by step; the full method is a link out |
| Skipping ahead | Product and zip are two steps, one more action than a single form |

## Weakest point, in this designer's view

Step 4 asks "how soon" and the site knows nothing about time: no stock, no opening hours, no delivery times. The step stands in for time with distance and kind of shop, and says so, but a visitor may still read "I will go and get it" as a promise that they can. With nearby shops right 62 to 64% of the time, the path leads people to a single shop at the point where the data is least reliable. The "check first" line at step 6 and the fallback to the next shop soften this, they do not fix it.

Second weakness: the default order inside a step-4 answer is the score, but grouping by "how soon" first means a higher-scoring online shop is out of sight for a visitor who chose "go and get it".

## Calls made that the inventory left open

| Call | Basis |
|---|---|
| Amazon is named only in the purpose line and the exclusion answer; none of its brands are named anywhere | The brief forbids them in example text; IV-B13 and IV-D15 need the exclusion stated |
| "Open in my device's map app" hands the address to the visitor's own app; the site fetches no map | IV-F2. This designer's proposal, not an existing function |
| Budget-spent wording, and showing it at step 1 before typing | IV-E7 is undesigned. No date or offer is invented |
| Compass direction of a shop from the zip-area center | Derived from the coordinates in IV-C3; absent when coordinates are missing |
| Score part values in the frames (0.60 for "likely" and so on) | Example values only; the inventory gives weights, not level values |
