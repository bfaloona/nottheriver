# First-visit review: what a stranger sees

Read on 2026-11-11 from the page files, the visitor-facing strings in `src/`, and four screenshots. No web pages were fetched and the live site was not opened.

## Answer

The site promises three things in one sentence and, on the evidence in its own files, likely delivers one of them well.

| Promise in the headline (`index.html:25`) | What the files show | My verdict |
|---|---|---|
| "never Amazon" | Removed twice by code, with a sourced list (`about.html:29-30`) | Delivered. This is the only promise a visitor can take on trust. |
| "Find who sells it near you or online" | Online: 98% of results sold the product. Nearby: 62 to 64% did. The site found about a third of the good shops an independent search found. All measured, `src/quality.json:7-18`, 2026-09-26, 20 searches run twice; the file itself notes the nearby figure mixes two graders' answers. | Half delivered. Online yes; nearby, about 1 result in 3 is a shop that does not sell the thing. |
| "ranked by how they treat people and the planet" | Both scores start at 0.5 and stay there unless a shop is on a short curated list or has an accepted finding (`about.html:36-37`, `about.html:41`). The result then says "Nothing found" (`src/render.ts:173`). | Unproven. How often a real result carries any ethics or environment data is not in the files I could read. If it is rare, this promise is mostly empty. |

Should the project stop? My judgment: no, but the headline should shrink to what is measured, and the results page needs one thing to act on per result. As built, a shopper ends a search with a list of shop names and no price, no stock, no hours and no directions.

Limit of this review: `docs/evidence/results.png` (results page screenshot) shows test data, not a real search. I judged layout and wording from it, not result quality.

## 1. What the site says it does

| Where | Its own words |
|---|---|
| First screen headline, `index.html:25` | "Find who sells it near you or online, ranked by how they treat people and the planet, never Amazon." |
| About page, first paragraph, `about.html:26` | "Type a product and a US zip code. You get shops near you and online retailers that sell it or something close, each ranked with its reasons shown. There are no accounts, cookies, or analytics." |
| While searching, `src/render.ts:353` | "Searching shops near {city}, {state} and online. This takes a few seconds." |

The About paragraph is clearer than the headline: it says what to type, what comes back, and admits "or something close". None of it is on the first screen.

## 2. What a stranger expects, and whether results deliver

My judgment of the expectation after the first screen (`docs/evidence/landing.png`): type a product, get a list of places that have it, with the kinder businesses on top, and be able to go buy it.

| Expectation | Results page | Delivered? |
|---|---|---|
| Places that sell the product | Shop name, an optional "Matched: cookware" line, distance and address (`src/render.ts:188-198`). Nearby shops can be included on the language model's guess from the shop's name and type (`about.html:35`); that only shows as "Likely, by shop type" or "Maybe, by shop type" inside the closed "Why this rank" panel (`src/render.ts:100-105`). | Partly. A guess and a confirmed listing look the same in the list. |
| Better businesses on top | A line reading "Ranked by relevance 0.25, ethics 0.30, environment 0.30, proximity 0.15" (`src/render.ts:246-255`, weights as shown in the screenshot). The score itself is hidden in the panel. When ethics and environment are both at their 0.5 start, they add the same amount to every result, so the order comes only from "sells it" and distance. | Unknown, likely weak. Nothing visible in the list tells me why shop 1 beat shop 2 unless I open each panel. |
| No Amazon | Never shown | Yes |
| A way to buy | A link to the retailer. Whether it lands on the product or the shop's home page is not visible from the files I could read. | No |

The strongest thing on the results page, in my judgment, is the concern box: a dated finding, the source's own title, a link to the source and "Dispute this" (`src/render.ts:125-135`). That is the one place the "how they treat people" promise becomes something I can see.

## 3. Where a first visit stalls

Listed in the order a visitor meets them. Each is my judgment unless a file is cited.

| Stall | Evidence |
|---|---|
| S1. Blank first screen. No example search, no hint in the box, no line saying what comes back, how long it takes, or that it is US only. | `index.html:27-39`, `docs/evidence/landing.png` |
| S2. The zip is required even for someone who only wants to order online. The privacy answer ("Your zip code never leaves your browser") is on the About page, not next to the field. | `index.html:35`, `about.html:48` |
| S3. The name is unexplained. "nottheriver" next to "never Amazon" is a pun a visitor may or may not get; the browser tab says "Search" until the script runs. | `index.html:7`, `src/config.ts:4` |
| S4. The first line of results is a formula with four decimal weights. A shopper has to learn a scoring system before reading a shop name. | `src/render.ts:246-255` |
| S5. The same four things have two sets of names: "relevance, proximity" above the list, "Sells it, Distance" in the panel. | `src/render.ts:29-34`, `src/render.ts:91-96` |
| S6. "Matched: cookware" for a search on "cast iron skillet" does not say whether the shop has a skillet. Some nearby results have no "Matched" line at all. | `src/render.ts:194`, `docs/evidence/results.png` |
| S7. Sort defaults to "Score", a number the list never shows. | `index.html:47`, `src/render.ts:233` |
| S8. "Has certification" filter: if few shops are certified, ticking it likely ends in "Every result is hidden by the filters." | `index.html:53`, `src/render.ts:359` |
| S9. A map sits above the list and takes the first screen of results; its pins only jump to the list. It has no directions. | `src/map.ts:64-65`, `docs/evidence/results.png` |
| S10. Dead end after the list: the page ends with a note about "Brave Search's index" and what the search cost in "model tokens". Neither helps a shopper who did not find the item. | `index.html:56`, `src/render.ts:371-376` |
| S11. A visitor who clicks About to decide whether to trust the site meets a long page (several screens, not counted) on scoring and data retention, "How disputes are reviewed and resolved: TBD", and a typo (", Like a certification"). | `about.html:44`, `about.html:41`, `docs/evidence/about.png` |

## 4. What a shopper needs before acting, and does not get

| Need | On the site? | Evidence |
|---|---|---|
| Price | No | `src/render.ts:188-244` builds the whole result; no price field is drawn |
| In stock | No. For nearby shops the site may not know the shop sells it at all. | `src/render.ts:100-105` |
| Opening hours | No | same |
| Phone number, to call and ask | No | same |
| Directions | No. The address is plain text, not a map link. | `src/render.ts:195-198` |
| Link to the product itself | Not visible from the files I could read | `src/render.ts:192` |
| Shipping cost, delivery time, returns (online) | No | same |
| Whether an online retailer ships to my state | No | same |
| How sure the site is that this shop has it | Hidden in a closed panel | `src/render.ts:100-105`, `src/render.ts:229` |
| What to do when nothing fits | Only "Try a shorter or more general name." | `src/render.ts:357` |

My judgment: for a nearby shop the honest next step is "call first", and the site gives neither the number nor the warning.

## Ranked changes

Ranked by how much I think each moves a first visit, per unit of work. "Size" is one of wording, screen, feature, pivot. Confidence is mine.

| Rank | Change | Evidence | Size | Cheapest test | Confidence |
|---|---|---|---|---|---|
| C1 | Show how sure each result is, in the list, not in the panel. Three plain labels: "Lists this product", "Lists this kind of product", "Probably carries it, call first". | `src/render.ts:100-105` has the three levels already; nearby precision 62 to 64%, measured, `src/quality.json:8-11` | wording | Re-grade the existing 20 test searches by label. It works if "Lists this product" results are right far more often than "Probably carries it" results. | High that it helps; the split by label is unmeasured |
| C2 | Count how often ranking by ethics and environment changes anything. If it is rare, drop "ranked by how they treat people and the planet" from the headline and say "flags known labor and environmental findings" instead. | `about.html:36-37`, `src/render.ts:173`; no count in the files I could read | wording (after a count) | From the saved test-search results, count results with any certification or finding, and count searches where the order differs from an order by "sells it" and distance alone. | High that the count is needed; no view on what it will show |
| C3 | Give each result one thing to do. Nearby: address as a directions link, plus phone and hours if the map data has them. Online: link to the product page, not the home page, when the search result was a product page. | `src/render.ts:192-198`; table in section 4 | feature | Hand-check 20 results from real searches: how many have a phone, hours or product page available in data the site already receives. | Medium; depends on what the search data carries, which I could not see |
| C4 | Rewrite the first screen: one line under the headline taken from `about.html:26`, an example in the product box, "US only", and "your zip stays in your browser" under the zip field. | `index.html:25-39`, `about.html:26`, `about.html:48` | wording | Show both versions to five people who have not seen the site; ask each to say what they will get before they search. | High |
| C5 | Replace the weights line with a sentence ("Shops that sell it, closest first, with known labor and environmental records counted") and use one set of names for the four parts everywhere. | `src/render.ts:29-34`, `src/render.ts:91-96`, `src/render.ts:246-255` | wording | Same five-person test: ask why result 1 is above result 2. | High |
| C6 | Lead with online, and reframe nearby as "shops worth a call". Online is the part that measures well. | Online precision 98%, nearby 62 to 64%, measured, `src/quality.json:7-11` | pivot | Put the Online section first on a test build and make zip optional; compare how many of the first five results sell the product, using the existing graded searches. | Medium. It gives up "near you", which may be why a person avoiding Amazon came. |
| C7 | Say on the results page that the list is partial, in shopper words: "We find about a third of the shops a wider search finds. Not here? Try a map search for {product} near {city}." | Recall 31% online and 33 to 35% nearby, measured, `src/quality.json:13-18`; current note at `index.html:56` | wording | None needed beyond checking the sentence against the measured figure each time it is re-run. | High |
| C8 | Show price for online results when the listing states one. | No price drawn, `src/render.ts:188-244` | feature | Hand-check 20 online results: how many source listings state a price the site could show without a new data source. | Low to medium; stale or wrong prices would cost trust |
| C9 | Move cost and "model tokens" from the results footer to the About page; drop "Brave Search's index" from the results note. | `src/render.ts:371-376`, `index.html:56` | wording | None; it removes words that are not for shoppers. Keep them on About, where the open-cost stance belongs. | Medium. The operator may want cost shown on every search on principle; that is a fair reason to keep it. |
| C10 | Fix About: resolve or remove "TBD" in the dispute section, fix ", Like", and put a five-line summary above the detail. | `about.html:44`, `about.html:41` | wording | Read-through by one person who has not seen it. | High |
| C11 | Hide the "Has certification" filter when no result has one; show the score beside the rank or rename the sort to "Best match". | `index.html:47-53`, `src/render.ts:233` | screen | Run the 20 test searches and count how many would show the filter. | Medium |
| C12 | If C2 shows ethics data is rare and C3 finds no phone, hours or product links to show: narrow the product to "an Amazon-free shop finder" and stop claiming a ranking by ethics. | Depends on C2 and C3 results | pivot | The C2 and C3 counts decide it. | Low until those counts exist |

### The case for stopping, stated plainly

If the C2 count shows ethics and environment data on only a handful of results, and nearby accuracy stays near 62 to 64% (measured, `src/quality.json`), then what is left is a web search with Amazon removed that finds about a third of the shops available. My judgment is that this is still worth keeping for the online half, but only with a headline that claims that and no more.
