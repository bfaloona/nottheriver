---
name: Patagonia
domain: patagonia.com
type: brand
goods: [apparel, outdoor-gear, food, used-gear]
ownership: private
parent: Patagonia Purpose Trust (voting stock); Holdfast Collective (nonvoting stock)
hq: Ventura, CA
marketplace: false
sells_on_amazon: unknown
amazon_owned: false
certifications:
  - {kind: fair_trade, source: https://www.fairtradecertified.org/shop-fair-trade/, checked: 2026-09-25, verified_this_run: true}
  - {kind: b_corp, source: https://www.bcorporation.net/en-us/find-a-b-corp/company/patagonia-inc/, checked: 2026-09-25, verified_this_run: false}
  - {kind: one_percent_planet, source: https://directories.onepercentfortheplanet.org/profile/patagonia, checked: 2026-09-25, verified_this_run: false}
concerns: []
ethics: 1.0
environment: 0.75
tier: recommended
mentions: 4
mentioned_by: [adayinourshoes-com, fairtradecertified-org, goingzerowaste-com, goodgoodgood-co]
checked: 2026-09-25
---

Patagonia makes and sells "outdoor recreation clothing, equipment, and food" (Wikipedia) and runs Worn Wear, a trade-in and resale program for its own used gear started in 2017. Wikipedia describes it as a private benefit corporation headquartered in Ventura, California; after 2022 founder Yvon Chouinard transferred the voting stock to the Patagonia Purpose Trust and the nonvoting stock to the Holdfast Collective, a 501(c)(4) nonprofit. `ownership` is `private` because the closed list has no value for a trust-held company; the benefit-corporation form is noted here rather than chosen, since `public-benefit-corporation` names a Delaware form the source doesn't claim. It sells its own goods, not third-party sellers', so `marketplace` is false. No fetched source says whether it sells through Amazon's marketplace.

Lists recommend it for Worn Wear used gear, Fair Trade factories and activism ("Earth is their only shareholder", goodgoodgood-co); Fair Trade USA's own shop page lists it as a brand (fairtradecertified-org).

Certifications:
- Fair Trade USA: fetched this run; the shop page lists Patagonia in "Explore Brands Where You Can Buy Fair Trade". Counts.
- B Corp: bcorporation.net returned HTTP 403 to this run (logged in research/raw/blocked-retailers-R4.md); the data/certifications.json row (source above, "Certified Since December 2011", checked 2026-09-23) counts with `verified_this_run: false`.
- 1% for the Planet: the directory profile renders only in a browser, so a fetch can't confirm it (logged); the data/certifications.json row ("Whole Company Member", checked 2026-09-23) counts with `verified_this_run: false`.
- The Climate Label: explore.changeclimate.org/brand/patagonia returns "Brand Not Found". Not counted.

Concerns: none recorded. Wikipedia's controversy section mentions supply-chain labor reports (internal audits in 2007 and 2011 on trafficking in second-tier Taiwanese suppliers; a December 2021 criminal complaint by the European Center for Constitutional and Human Rights over Xinjiang cotton; a 2023 Dutch report on shared factories). None of their underlying sources were fetched this run (the ECCHR case URL tried returned 404, and the web-search budget had run out), so none is recorded. CourtListener lists federal dockets naming Patagonia, Inc. as a defendant (for example an employment civil-rights case filed 2025-03-07 in D. Nev. and website-accessibility cases); a docket search result shows no finding or settlement, so private suits without an outcome are not recorded as concerns. No agency action was found in the CourtListener search.

## Rating
- ethics: start 0.5; +0.25 fair_trade; +0.25 b_corp; no accepted labor or governance concern; = 1.0
- environment: start 0.5; +0.25 one_percent_planet; no accepted environmental concern; = 0.75
- tier: not on the blocklist (`--blocklist "Patagonia" patagonia.com`: "not on the blocklist"); ethics + environment = 1.75 ≥ 1.25 and no accepted concern in the last 5 years, so `recommended`.

## Sources
- https://en.wikipedia.org/wiki/Patagonia,_Inc.
- https://www.fairtradecertified.org/shop-fair-trade/
- https://www.bcorporation.net/en-us/find-a-b-corp/company/patagonia-inc/ (via data/certifications.json; blocked this run)
- https://directories.onepercentfortheplanet.org/profile/patagonia (fetched; content renders only in a browser; via data/certifications.json)
- https://explore.changeclimate.org/brand/patagonia (Brand Not Found)
- https://www.patagonia.com/ownership/ (returned a site-downtime page)
- https://www.courtlistener.com/api/rest/v4/search/?q=%22v.%20Patagonia%2C%20Inc.%22&type=r&format=json
- data/blocklist.md (no match)
