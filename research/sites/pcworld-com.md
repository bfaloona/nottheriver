---
name: PCWorld
domain: pcworld.com
url: https://www.pcworld.com/article/398976/the-best-alternatives-to-amazon-for-buying-tech-right-now.html
kind: article
category: affiliate-funnel
also: []
score: 42
score_parts: {independence: 13, evidence: 5, substance: 8, currency: 2, usefulness: 7, no_dark_patterns: 7}
affiliate_links: disclosed
owner: FoundryCo, Inc.
updated: 2020-04-03
retailers_listed: 9
amazon_owned_recommended: ["Amazon (affiliate-tagged link to an amazon.com listing, shown sold out)"]
checked: 2026-09-25
---

"The best alternatives to Amazon for buying tech right now", a feature bylined Mark Hachman, dated Apr 3, 2020, with no update shown. PCWorld's footer reads "© 2026 FoundryCo, Inc." The article is a COVID-19 stock check, not an ethics list: it says Amazon was prioritizing household goods and that "a wide swath of tech products" were delayed, cites NPD sales figures and a quote from Newegg's chief executive, then reports on the author's own tests of availability, shipping and curbside pickup at Newegg, Best Buy, Target, Walmart, Staples, Office Depot/OfficeMax and B&H. The disclosure "When you purchase through links in our articles, we may earn a small commission. This doesn't affect our editorial independence" sits at the top of the page, above the headline, and links to the affiliate-link policy, which says "Our journalists are generally unaware of how much commission – if any – PCWorld receives from a purchase." Nearly every product link is affiliate-wrapped (Skimlinks, Rakuten, ncls1), including one link to Amazon itself carrying a PCWorld tag. It has no top pick; `affiliate-funnel` is the closest category (a commerce piece monetized through affiliate links), not a strong fit.

## Score
- Independence (13/20): disclosure at the very top with a linked policy, owner named; deducted because every retailer product link is affiliate-wrapped, including one to Amazon, and the policy doesn't say whether retailers pay for placement.
- Evidence (5/20): availability claims are backed by the author's own screenshots and an NPD citation, but the page makes no ethics or sustainability claims, and its ownership notes (B&H "privately held", Office Depot "bought OfficeMax in 2013") carry no source.
- Substance (8/20): calibrated from 9 under rule K2: −1 for the link to Amazon, which is not offered as a pick. 8 real US retailers, each with a specific reason about stock or shipping, but all tech, mostly large chains (Walmart, Target, Best Buy, Staples), chosen for availability rather than as a different kind of shop.
- Currency (2/15): dated 2020-04-03 and written for the spring-2020 shortage ("the entire business closes down for Passover, April 8-16 in 2020"); retailers checked only by decoding link destinations.
- Usefulness (7/15): one section per retailer with practical tips on reading stock and pickup status, US only; the tips describe 2020 site behaviour and the product links point at 2020 listings.
- No dark patterns (7/10): an affiliate-tagged link to Amazon's own listing sits in a list of Amazon alternatives (shown as sold out, not recommended); no top pick repeated; the stale "right now" headline is scored under currency only.

## Retailers named
| # | Retailer | Domain | Reason the page gives |
|---|---|---|---|
| 1 | Newegg | newegg.com | "A good place to start"; "good availability and reasonable prices", broader inventory as "a storefront for many sellers" |
| 2 | B&H | bhphotovideo.com | "Crystal-clear inventory and shipping data"; "a good handle on its inventory and delivery data", "fairly ample inventory" |
| 3 | Best Buy | bestbuy.com | "Curbside pickup means quick availability"; delivery "from local warehouses" |
| 4 | Office Depot / OfficeMax | officedepot.com | "Don't sleep on these giants"; curbside pickup, "$45 for next-day shipping"; page says they are "the same store" (no link) |
| 5 | Target | target.com | Its "Computers & Office page offers an easily navigated arrangement of popular tech products" |
| 6 | Antonline | antonline.com | Named as Target's fulfilment partner: a Target listing with "antonline" as the partner "seems to stand a good chance of being available" (no link) |
| 7 | Walmart | walmart.com | "Using its supply chain to its advantage, with either direct shipping or ship-to-store options" |
| 8 | Staples | staples.com | "Will ship for free with no minimum", curbside pickup, "tell[s] you clearly whether a product is in stock" |
| 9 | Amazon | amazon.com | Not a pick: an affiliate-tagged link (`tag=pcworld02-20`) to an Amazon listing to show "Amazon was entirely sold out" |

Domains for #1, #3, #5, #7 and #8 come from the affiliate link's destination parameter (`murl`, `d`); #2 links straight to bhphotovideo.com with tracking parameters. #4 and #6 have no link; officedepot.com loaded on a plain request and antonline.com answered (403). Amazon matches `data/blocklist.json` entry "amazon" (checked with `build-index.mjs --blocklist`; source `data/blocklist.md`); no other retailer matched.

## Sources
- https://www.pcworld.com/article/398976/the-best-alternatives-to-amazon-for-buying-tech-right-now.html
- https://www.pcworld.com/about/affiliate-link-policy
