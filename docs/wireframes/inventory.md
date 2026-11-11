# Inventory: what a visitor needs, what exists, what a design must keep

This is the only description of the product that the wireframe designers read. It says why people come, what they ask, what information exists, what they can do, what is planned, and the rules. It deliberately says nothing about how the product presents any of this now. Where it says something "exists", that means the data or the function exists, not that it is displayed in any particular way.

- Product name: nottheriver. Stage: proof of concept, deployed, no public link yet (`docs/STATUS.md`).
- Purpose (paraphrased from `README.md`): help someone find who sells a product, near them or online, ordered by how the sellers treat people and the planet, with Amazon never among them.
- Every figure below is measured, with its source file, unless it says projection. Distances are in miles.
- Item labels (IV-B3, IV-D7 and so on) are for the designers' coverage tables.

## IV-A. Why people come

From the repo's own statements:

| Label | Statement | Source |
|---|---|---|
| IV-A1 | A visitor names a product and a US zip code and gets retailers that sell it or something close: some near them, some online | `README.md` |
| IV-A2 | Amazon and every business it owns or has owned never appear. "That exclusion is the reason the site exists." | `README.md` |
| IV-A3 | Results are ordered by ethical practice, environmental practice and distance, and every placement is explained with sources | `README.md`, `docs/ranking.md` |
| IV-A4 | Anyone, including the business itself, can dispute what is said about a shop | `docs/ranking.md` |
| IV-A5 | The zip code never leaves the browser; no accounts, cookies or analytics | `docs/privacy.md` |

Situations that likely bring someone here (the lead agent's inferences, not sourced statements):

| Label | Situation | Wants to walk away with |
|---|---|---|
| IV-A6 | Needs a specific thing soon and does not want to buy it from Amazon | One shop they will go to today, or one online shop they will order from |
| IV-A7 | Can wait for delivery, cares more about how the seller behaves than about distance | An online shop whose record they have read and accept |
| IV-A8 | Was sent a result or heard of the site and doubts it | A reason to trust or dismiss the ordering: what it is based on, how often it is wrong |
| IV-A9 | Owns or works for a shop and learns something is said about it | A way to check the source and contest it |
| IV-A10 | Is wary of typing a location into a website | A plain account of what is sent, to whom, and what is kept, before typing anything |

No user research exists in the repo. No searches-per-visitor figure exists (`docs/feasibility-overview.md`).

## IV-B. The questions a visitor asks, in the order they arise

The order is the lead agent's judgment of when each question occurs to a person, not a record of any existing arrangement.

| Label | Question |
|---|---|
| IV-B1 | What is this, and what is it for? |
| IV-B2 | What do I have to give it, and is that safe to give? |
| IV-B3 | Is it working, and how long will this take? |
| IV-B4 | Can I get this near me today? Where, and how far? |
| IV-B5 | If not nearby, who sells it online? |
| IV-B6 | Does this shop really sell it, or is that a guess? |
| IV-B7 | Why is this shop placed ahead of that one? |
| IV-B8 | What is known about how this shop treats people and the planet, and who says so? |
| IV-B9 | Is this shop a chain or an independent? |
| IV-B10 | How bad is this concern: how old, how large, about this shop or a related company? |
| IV-B11 | This is wrong (about my shop, or a shop I know). How do I contest it? |
| IV-B12 | Why should I trust this ordering at all? How often is it wrong, and what does it miss? |
| IV-B13 | Why is there no Amazon, and what counts as Amazon? |
| IV-B14 | What do you know about me, and what do you keep? |
| IV-B15 | Who pays for this, what did my search cost, and is anyone paying to be placed? |
| IV-B16 | I got little or nothing. Is that my wording, my location, or the site's limit? What do I try next? |
| IV-B17 | It refused or failed. Is it broken, am I blocked, or has it run out of money? When can I try again? |
| IV-B18 | I chose a shop. How do I get to it? |

## IV-C. The information that exists

### IV-C1. What the visitor gives

| Field | Notes |
|---|---|
| Product text | 1 to 120 characters, free text. The browser can recall the last one typed until that browser tab closes |
| US zip code | Five digits. Looked up inside the browser against 33,791 zip areas (`docs/STATUS.md`). About 7,846 real postal codes (mostly PO-box codes) are not among them and cannot be resolved (`docs/debt.md`). Never recalled, never sent |

Derived in the browser from the zip: city, state, the center of the zip area (rounded to about 0.6 mile), and one of 10 rural-urban categories. These are what is sent.

### IV-C2. How the product was understood

One per search: a category, a generic name for the product, up to 6 similar products, and the search wording used (up to 3 online phrasings, up to 2 nearby phrasings). Written by a language model. The same reading is reused for everyone who types the same product for 30 days.

### IV-C3. A nearby shop (one of the two kinds of result)

| Field | Notes | Uncertain? |
|---|---|---|
| Name; address of its own website | | The shop may not exist at that address |
| Street address | | Sometimes missing |
| Distance | Straight line, in miles, from the center of the zip area, not from the visitor | Sometimes unknown |
| Coordinates | The shop's listed position on the earth | Sometimes missing |
| Whether it sells the product | A language model's judgment from the shop's name and type, at two levels: likely, or possibly. A likelihood, not a stock check | Yes, the most uncertain fact about a nearby shop. See IV-C12 |
| Distance group | A shop counts as nearby within 10 miles in metropolitan zip areas and within 30 miles elsewhere. More distant shops, out to 100 miles, can also be returned | |
| Score and place in the order | See IV-C5 | |
| Certifications, chain fact, concerns | See IV-C6 to IV-C8 | |

How many: up to 10 nearby, plus up to 3 more distant, at most 2 branches of one company. Often fewer; none is possible. More distant shops matter most when nearby ones are few or absent (in rural test zips 12 of 19 good shops were within 30 miles and 6 more within 100; `docs/ranking.md`).

### IV-C4. An online shop (the other kind of result)

| Field | Notes | Uncertain? |
|---|---|---|
| Name; address of the web page found | Usually a product or category listing on the shop's site | |
| Matched product | The title of the listing that matched | Sometimes empty |
| Whether it sells the product | From the listing text, at two levels: the product itself is named, or only its category is | Rarely wrong. See IV-C12 |
| Score and place in the order | See IV-C5 | |
| Certifications, chain fact, concerns | See IV-C6 to IV-C8 | |

No street address, no distance. How many: up to 10; none is possible.

### IV-C5. A score and its parts

Each result has one score from 0 to 1, built the same way for both kinds, so any two results can be compared. Whatever order a design puts results in, the explanation given for a shop must match its score.

| Part | Weight | What it measures | What is known for one shop |
|---|---|---|---|
| Does it sell the product | 0.25 | How sure the site is | One of five levels: product named in the shop's listing; only the category named; judged likely from the type of shop; judged possible from the type of shop; not confirmed |
| How it treats people | 0.30 | Starts at the middle (unknown, not bad). Each ethics certification raises it; each accepted labor or governance concern lowers it | Which certifications and concerns counted, each with its source; or that nothing was found |
| How it treats the planet | 0.30 | The same, with environmental certifications and concerns | The same |
| How close it is | 0.15 | Nearby: full at the center of the zip area, falling to nothing at 25 miles. Online: a fixed middle value | The miles; or that it is online; or that the distance is unknown |

- The same four weights apply to every search.
- For each part an exact number exists (its value, its weight and what it adds to the score), and so does the plain-words reading in the last column.
- A fuller written account of the formula exists (`docs/ranking.md`): what each certification adds (0.25, capped), what a concern costs (up to 0.25, less when the penalty was small, the amount is not stated, the case is open, or it was against a related company), and that small concerns together cost at most 0.25.
- Finding nothing is the common case. Most shops have no certification and no concern, so the two middle parts sit at the middle and the order among those shops comes from the first and last parts.

### IV-C6. A certification

Fields: kind, name, address of the certifier's or source's page, date checked. Six kinds: B Corp; sells Fair Trade Certified products; worker co-op; 1% for the Planet; Climate Label certified; member of an independent retailer association (this last one is a fact about the shop that never changes the score). 28 curated entries (`docs/STATUS.md`). How many per result: usually none, sometimes 1, rarely 2 or more.

### IV-C7. A chain fact

Fields: that the shop belongs to a chain, the number of stores the source states (an exact count such as 195, or a floor such as more than 5,000), the address of the source of the count, date checked. From a curated set of 41 chains with 10 or more US stores (`docs/STATUS.md`). It never changes the score. It can be disputed. A shop without this fact is not proven independent; it is only not in the curated set.

### IV-C8. A concern (a negative finding)

| Field | Notes |
|---|---|
| Kind | Labor, governance or environmental |
| Claim | The source's own title, or operator-reviewed wording that follows the source. Never written by the language model |
| Date of the action | Present on curated concerns |
| Source | Its web address and the name of the site it is on. Only accepted sources count: regulators, court records, established news organizations, recognized labor and environmental watchdogs (14 accepted sources, `docs/STATUS.md`) |
| A way to dispute it | Required (IV-F5) |
| How it was counted | The penalty amount, a size band (major: $1,000,000 or more; standard; minor: under $100,000 or still open), whether it is about the shop itself or a related company, whether the case is final or open, and what it cost the score |

How many: 4 concerns exist in total now, one each on four large chains, so most results have none and a few have one. A planned import (IV-E1) brings about 54 more across 23 retailers, with up to 7 on one retailer. For a shop with several, the count and the range of years they span are known.

### IV-C9. What a search cost

One per search: the number of web lookups (typically 4 or 5), the number of language-model tokens, and an estimated dollar cost (about $0.023 typical; the first live search was about $0.026; `docs/feasibility-overview.md`, `docs/STATUS.md`). A public cost ledger exists (`docs/costs.md`). Fixed running cost is zero; cost is per search (projection: 3,000 searches a month is about $65).

### IV-C10. How long a search takes

Median about 3 seconds, slowest about 5 (measured 2026-09-29 on 20 searches, `docs/STATUS.md`). During that time the service does four things in order: reads the product, searches the web and nearby places, judges which results are shops that sell it, scores them. The browser learns the outcome only when all four are done.

### IV-C11. What a search found, in summary

Counts of nearby, more distant and online shops; the nearby distance used (10 or 30 miles); the city and state the zip resolved to. Also part of every answer: what was left out and why (site name and reason only: not a shop, does not sell it, too far, more than 2 branches of one company, did not make the top 10), and how many of the returned results the language model did not get to judge.

### IV-C12. How accurate results are measured to be

| Figure | Value | Source |
|---|---|---|
| Online results that really sold the product or a close equivalent | 98% | `src/quality.json`, measured 2026-09-26 on 20 graded searches, each run twice |
| Nearby results that really did | 62 to 64% (a shop that does not exist counts as wrong) | Same |
| Share of the good online shops an independent search found that this site also found | 31% | Same |
| Share of the good nearby shops | 33 to 35% | Same |
| Nearby shops at the higher sells-it level that really sold it | 80% (53 of 66) | `docs/ranking.md`, graded 2026-09-24 |
| Nearby shops at the lower sells-it level that really sold it | 40% (58 of 146) | Same |

A later run (2026-09-29, `docs/STATUS.md`) measured 98.4% online and 71% nearby. Raw evidence and the method are public files. Coverage limit: results come from one search index (Brave Search); shops that block search crawlers, or that the index has not reached, are missing.

### IV-C13. What is sent, to whom, and what is kept

Sent with each search: the product, the city and state, the center of the zip area, the rural-urban category. Never the zip, never a street address.

| Who | Learns |
|---|---|
| The search provider (Brave Search) | Search wording derived from the product, and the zip-area center, so it learns the zip area of each search. Not the visitor's IP address |
| The language-model service (OpenRouter and the model provider it routes to) | The product text, then titles and excerpts of the results found, which can name nearby towns. No location fields |
| The hosts (Cloudflare, GitHub Pages) | Ordinary request records, including IP address |
| Any other party a design makes the browser fetch from (fonts, imagery, embedded media of any kind) | The visitor's IP address and whatever the request reveals about the search. See IV-F2 |

What happens to each thing afterward (`docs/privacy.md`):

| What | Afterward | How long |
|---|---|---|
| The search as a whole (product together with place) | Used for that search only, never stored by this site | |
| Shops found, whether each likely sells it, scores | Looked up anew every search, not stored | |
| The reading of a product (IV-C2) | Stored, shared by everyone who types the same product. In effect a record of products people searched for, with no location or IP address | 30 days |
| IP address (for IPv6, its first half) | Held by the rate limiter | One minute |
| The service's log line (worked or not, how long; never product or place) | Not stored | |
| Request records at the hosts | Under each host's own policy | |
| What the search provider, the model service and any other outside party receive | Under each one's own policy | |
| The last product typed | In that browser tab, for the visitor only. Never the zip | Until the tab closes |

### IV-C14. What is excluded

An exclusion set of 39 web domains and 14 business names (`docs/STATUS.md`), each with a public source and date: Amazon and every business it owns or has owned (examples the project names: Whole Foods Market, Zappos, Ring, Audible). Code removes them twice per search; the language model is never the only check. The set is a public file.

### IV-C15. Facts about the project

Open source under AGPL-3.0, with a public code repository. Public documents: ranking method, privacy, costs, quality method and evidence, the exclusion set, the accepted sources, known shortcuts. Credits the licenses require: zip data from the US Census Bureau and GeoNames (CC BY 4.0), plus whatever any other open data a design uses requires. No affiliate links and no paid placement (`research/competitors/README.md`, feature FT11).

### IV-C16. Things that can go wrong, and what is known when they do

| Case | What is known |
|---|---|
| No product given, or the zip is not five digits | Which one, and what is expected |
| Zip cannot be resolved | That it is not known; some real PO-box codes are not |
| Too many searches from one connection (30 a minute) | Trying again in about a minute will work |
| The search did not complete | Only that it failed; waiting and retrying may work |
| Nothing matched at all | The product text; a shorter or more general name may work |
| No nearby shops, more distant ones exist | The nearby distance that was tried |
| No nearby shops, online ones exist; or no online shops | Which kind is empty |
| A visitor narrows results (IV-D6) until none qualify | That results exist and their own choice excludes them |
| The search budget for the period is spent | Not built. See IV-E7 |

## IV-D. What a visitor can do

Every function below must be possible in a design. How is open.

| Label | Function |
|---|---|
| IV-D1 | Ask: give a product and a zip, start a search |
| IV-D2 | Be told what is wrong with what they gave and fix it |
| IV-D3 | Know a search is under way and roughly how long it takes |
| IV-D4 | Read nearby shops, more distant shops and online shops, with the facts in IV-C3 and IV-C4 |
| IV-D5 | Reorder results by score, by distance or by name |
| IV-D6 | Narrow results: nearby only, online only, only shops with a certification |
| IV-D7 | Judge which nearby and more distant shops are practical to reach: how far each is and where it is |
| IV-D8 | Go to a shop's own website (the shop is not told where the visitor came from) |
| IV-D9 | Learn why one shop is placed where it is: its score and the four parts |
| IV-D10 | Follow a certification, a chain fact or a concern to its source |
| IV-D11 | Read every concern on a shop, including when there are several |
| IV-D12 | Dispute a concern. The only intake that exists is a public form on the code host (GitHub) that asks for the retailer, what was shown, the source's address, and evidence. Filing needs an account on that host (the lead agent's observation). How disputes are reviewed is undecided and no response time is promised (`docs/STATUS.md`) |
| IV-D13 | Dispute a certification, a chain fact, or any part of a score. Promised in the project's text; same intake and same limits as IV-D12 |
| IV-D14 | Read how ordering works: the parts, the weights, what raises and lowers each |
| IV-D15 | Read why Amazon never appears and see the exclusion set |
| IV-D16 | Read what is sent, to whom, and what is kept (IV-C13) |
| IV-D17 | Read how accurate and how complete results are, and reach the raw evidence (IV-C12) |
| IV-D18 | Learn what their own search cost, and reach the cost ledger (IV-C9) |
| IV-D19 | Reach the source code and the license |
| IV-D20 | Search again with a changed product or zip |
| IV-D21 | Find the required data credits (IV-C15) |

## IV-E. Headed towards

| Label | Addition | State | Source |
|---|---|---|---|
| IV-E1 | Many more concerns: about 54 findings and 6 certifications imported from research on 54 retailers. Several concerns on one shop becomes common for large retailers | Planned | `docs/plans/amazon-alternatives-in-ranking.md` |
| IV-E2 | For each concern, a statement of how it was counted (its size band and whether it is about the shop or a related company) and a way to reach the full research record for that retailer | Planned | Same |
| IV-E3 | Suggested shops: up to 3 shops that other recommendation sites name for the product's category, each citing those sites. Never scored, because nothing confirms they sell the product searched | Undecided (operator: not yet) | Same |
| IV-E4 | Consumer co-ops as a positive fact about a shop, either shown only or with a score effect | Proposed | `docs/STATUS.md` |
| IV-E5 | A price-level indication per shop (low-cost, average or no data, high-end), usable for reordering, not for the score | Proposed | `docs/ideas.md` |
| IV-E6 | The service reporting each step of a search as it happens, so a visitor can be told what is going on | Proposed | `docs/ideas.md` |
| IV-E7 | Honest behavior when the money for searches runs out: the site should say the budget is spent rather than fail silently. What the visitor is told or offered is not designed; whether a monthly limit exists is deferred | Undecided | `docs/feasibility-overview.md`, `docs/scale-feasibility.md` |
| IV-E8 | A written dispute process with a response time, and after it a record per shop of facts, corrections and dispute state, so a visitor could learn that an item is under dispute or was corrected | Undecided, then proposed | `docs/STATUS.md`, `docs/scale-feasibility.md` |
| IV-E9 | Wider kinds of places to get a thing: free, used, lending libraries, thrift shops, person-to-person marketplaces, places near public transit | Proposed; whether marketplaces appear at all is undecided | `docs/ideas.md`, `docs/STATUS.md` |
| IV-E10 | Favoring independent shops: in what is found, or in the score | Undecided | `docs/STATUS.md` |
| IV-E11 | A fallback or clearer explanation for real zip codes that cannot be resolved | Undecided | `docs/STATUS.md` |
| IV-E12 | Nearby shops from a curated, sourced directory of shops built on open place data, with web search as the fallback. Would keep the zip area away from the search provider and make "sells it" a lookup. A first check found open data alone too imprecise | Proposed direction | `docs/feasibility-overview.md` |
| IV-E13 | Daily totals (searches, cost). Kept by the site once built; whether visitors can read them is not stated | Deferred | `docs/scale-feasibility.md` |
| IV-E14 | Weighing concerns by age | Deferred | `docs/plans/amazon-alternatives-in-ranking.md` |

## IV-F. Rules any design must keep

| Label | Rule |
|---|---|
| IV-F1 | The zip never leaves the browser, is never recalled, and never appears in a web address a visitor could share. The site never asks for a street address or the device's location |
| IV-F2 | No accounts, cookies, analytics or tracking. By default the browser fetches nothing from a third party. A design that needs an outside party (IV-C13) must name it, say what that party learns, and mark it as a cost the operator has to accept |
| IV-F3 | Amazon and its brands never appear: not in any kind of result or suggestion, and not in example text |
| IV-F4 | Every placement is explained, with a source for each certification and concern that counted |
| IV-F5 | Every concern a visitor can read can be disputed by that visitor. Certifications, chain facts and score parts must be disputable too |
| IV-F6 | A concern's text is the source's wording, with its source and date. The site invents no verdict words or grades for shops |
| IV-F7 | Unknown is not bad: a shop with nothing found must not look penalized, and a shop without a chain fact must not be called independent |
| IV-F8 | A chain fact is neither praise nor criticism and must not be mistakable for a certification or a concern |
| IV-F9 | Suggested shops (IV-E3), if built, are never mixed with scored results |
| IV-F10 | Usable at 360 px wide |
| IV-F11 | Usable by keyboard alone and with a screen reader; motion respects a reduced-motion preference |
| IV-F12 | Honest when results are thin, when a judgment is a guess, when the search failed, and when the budget is spent. Measured accuracy is stated, not implied |
| IV-F13 | Distances in miles |
| IV-F14 | Raw web excerpts about a shop are not shown, since they could carry an excluded brand's name |
| IV-F15 | No affiliate links, no paid placement, no advertising |
| IV-F16 | The required data credits can be found (IV-C15) |
