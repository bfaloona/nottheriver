---
name: Public Goods
domain: publicgoods.com
type: brand
goods: [personal care, cleaning, home goods, food]
ownership: unknown
parent: unknown
hq: New York, NY
marketplace: unknown
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns: []
ethics: 0.5
environment: 0.5
tier: acceptable
mentions: 3
mentioned_by: [goodgoodgood-co, sustainablejungle-com, vstyleblog-com]
checked: 2026-09-25
---

Public Goods sells everyday essentials in four groups on its own site: bath and body, home (kitchen, bedroom, food), cleaning and paper goods, and bundles. It runs a paid membership ($65 a year for "20% off everything", free US shipping and an "$80 yearly credit"), and its product badges say cruelty free, vegan friendly, paraben free and sulfate free. Its about page says "We started with a vision a decade ago". The terms of service name the operator as "Don't Run Out, Inc. d/b/a Public Goods" with an address at 85 Delancey St, New York, NY 10002, and say the store is hosted on Shopify. BeautyMatter reported on 2020-08-17 that "Public Goods received a $15 million investment from L Catterton" (the article does not say whether the stake is a majority or a minority, and no fetched page states who owns the company or whether it has a parent), so ownership and parent are `unknown`. The same article gives a founding year of 2017 and a first retail deal with CVS in 2,000 stores.

Lists recommend it for packaging: Good Good Good cites bottles of "100% recycled, post-consumer plastic"; Sustainable Jungle cites "glass jars, recycled paper, or compostable bioplastics" and "for every order, they plant a tree"; V Style Blog cites minimal, non-toxic home essentials. Two of the three list pages carry discount codes.

Court records (CourtListener search API, fetched this run) show private lawsuits naming Don't Run Out, Inc.: one against Don't Run Out, Inc. (E.D. Cal., filed 2022-07-01, cause "Diversity-Fraud", terminated 2023-01-10), one against Dont Run Out, Inc. (C.D. Cal., removed 2024-04-25, "Notice of Removal - Fraud", terminated 2024-05-07), one against Dont Run Out, Inc. (N.D. Ill., filed 2025-02-19, Americans with Disabilities Act, docket shows a "Notice of Settlement" on 2025-07-01) and one against Don't Run Out, Inc. (C.D. Cal., filed 2026-06-18, contract, open). The docket pages and complaints could not be fetched (HTTP 403), so what each suit alleges is unknown; they are not recorded as concerns. Operator: check the dockets.

## Rating
- ethics: 0.5 baseline. No B Corp, fair trade or worker co-op listing verified (bcorporation.net returned 403; no fallback row in data/certifications.json for publicgoods.com).
- environment: 0.5 baseline. No 1% for the Planet or Climate Label listing verified (the 1% for the Planet directory returns no data to a plain fetch; not checked on the Climate Label directory).
- concerns: none recorded. NLRB case search for "Public Goods" returned no cases (a control search for "Starbucks" returned 2,559). Other searches were limited: the web search budget ran out before the general news pass, and Violation Tracker returned 403.
- tier: `acceptable` (0.5 + 0.5 = 1.0, not Amazon-owned per `node research/build-index.mjs --blocklist`).
- Concern search incomplete this run (see raw/blocked-retailers-R7.md); tier is provisional.

## Sources
- https://www.publicgoods.com/
- https://www.publicgoods.com/pages/about-us
- https://www.publicgoods.com/policies/terms-of-service
- https://beautymatter.com/articles/l-catterton-takes-15-million-stake-in-public-goods
- https://www.courtlistener.com/api/rest/v4/search/?q=%22Don%27t+Run+Out%22&type=r
- https://www.nlrb.gov/search/case/%22Public%20Goods%22
- data/blocklist.md (no match)
