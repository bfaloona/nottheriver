# WF2 Place: why this design

## The one question answered first

**"Where, from where I am, can I get this?"**

Every other question (who is better, why, who says so, can I trust it) is answered inside that frame, at a place on one drawing.

## The frame: one plan

The page is built on a single drawing, called the plan. The browser draws it from the zip alone: no map service, no outside request.

| Part of the plan | What it holds |
|---|---|
| Black square at the center | The center of the visitor's zip area (not the visitor) |
| Inner circle | The nearby distance: 10 miles in metropolitan zip areas, 30 miles elsewhere |
| Outer circle | 100 miles, the limit for more distant shops |
| Strip off the plan, left | Nearby shops whose position or distance is not listed |
| Strip off the plan, right | "No place": online shops |
| Number on each mark | The shop's place in the one order by score (1 is highest) |
| Solid or dashed mark | How sure "sells it" is. Solid: product or category named in a listing, or judged likely. Dashed: judged possible, or not confirmed. Never good or bad |
| Mark with a plus (4+) | Several shops too close to draw apart. A stated rule, not drawn |
| Legend under the plan | What the marks mean and open, accuracy per zone, what is never on the plan, and the links to trust, privacy, cost, method, dispute and source code |

All frames are views inside one page (the designer's judgment). Opening a card or the trust or privacy view loads nothing, so going back needs no new search and the zip, which is never stored, is still in its field. A reload empties it.

## Order of information, and why

| Step | What comes | Why the lens puts it here |
|---|---|---|
| A1 | Zip, before product | Place is the frame, so it is set first. The browser answers at once with the city and the nearby distance, which also shows the lookup is local |
| A2 | The privacy promise, on the zip field | A visitor wary of giving a location decides at the field, not on another page |
| A3 | Product | The second thing asked |
| A4 | The empty ground while waiting | The wait is spent on the visitor's own area. The answer arrives at once, so nothing is placed early |
| A5 | Counts per zone, then the plan | "Is there anything near me" is answered by a glance at the inner circle, including when it is empty |
| A6 | Rows by zone, center outward: nearby, position not listed, farther, no place | Reachability first. Score orders shops inside a zone |
| A7 | One shop: where it is and how to get there, then whether it sells it, then the score and its four parts (closeness first), then what is known and who says so | The visitor who chose a shop needs the address first. The reasons follow |
| A8 | A concern: what it is about (the shop's own company or a related company), who said it, when, how it was counted, then the dispute path as a route with places that leave the site | "Where does this finding point" is a place question, and it is the fact most easily misread on a branch's card |
| A9 | Trust, cost and privacy, reached from the legend | Trust is stated per zone (nearby 62 to 64%, online 98%, no separate figure for farther shops). Privacy and cost are a path of the places a search travels to |

## What it deliberately makes harder

| Harder | Why accepted | How it stays possible |
|---|---|---|
| Seeing the single best shop by score. The highest score can sit in the last zone when it is online | The lens ranks reachability over score | The numbers on marks and rows, and "Order: score" |
| Comparing an online shop with a nearby shop side by side | They sit in different zones | Same numbers, same four parts, same card layout |
| Reading the ranking method before seeing results | It lives behind the legend and the shop card | One link from the arriving frame, every result frame, every shop card and the refusal frames. Not linked from the waiting frame, the fix-it messages or the change form (frame 2c); at 360 px the asking frame reaches it in two steps through "Legend and limits" |
| Treating the site as an online-only finder | Online is the outermost zone, so it comes last in the list | "Show zones: online" narrows to it |
| Asking for a product before giving a place | Zip is the first field | None. Both are required anyway |

## Weakest point (the designer's own judgment)

The lens leads with the weakest data and the lightest part of the score.

- Closeness carries 0.15 of the score, the smallest weight, yet it sets the page structure.
- Nearby results are the least accurate (62 to 64% really sell it, against 98% online), yet they come first. The zone heading and the legend state the figure and say "call first", but position on a drawing looks more certain than it is.
- "Here" is the center of a zip area, distances are straight lines, and the plan is not to scale beyond the inner circle. A visitor can read it as a street map. It is not one.
- A visitor who cares about conduct more than distance (inventory IV-A7) has to switch the order to score, or read to the last zone.
- Direction (NE, S) needs coordinates, which are sometimes missing. Those shops fall into "position not listed", a zone a visitor may skip.

## Judgments that are the designer's, not the inventory's

- Zip first, product second.
- Showing compass direction, derived from the shop's listed coordinates and the zip-area center.
- Advising "try the zip of a street address near you" when a zip cannot be resolved.
- All score values in the wireframe are placeholders. The inventory gives the weights, not the value of each sells-it level, the online closeness value or how an unknown distance is counted.
- The explanation of the exclusion names Amazon once per place it is needed and names none of its brands; it points to the public exclusion set instead.
- "Open in your device's map app" is offered on a shop card as the visitor's own choice. The card names the app as an outside party, says what it receives and what a map app normally already knows (the device's location, possibly the person), and marks it as a cost the operator has to accept or remove. The page itself fetches nothing from it.
- Treating every frame as a view inside one page, with the zip left in its field while the page is open. The inventory says the zip is never recalled; this design reads that as never stored, not as cleared from the field after each search.
- Drawing an unknown distance as adding nothing to the score (frame 6c), and a B Corp certification as raising "treats people" (frame 6b). The inventory states neither.
- Frame 10c, arriving while the budget is spent, assumes the site can know that before a search is tried. That is not decided.
- The rule for crowded marks (one mark with a plus that opens a short list).
- On result rows a chain fact is an unboxed italic line and certifications and concerns are boxed tags, so a chain fact cannot be taken for either.
