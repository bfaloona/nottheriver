---
name: Pact
domain: wearpact.com
type: brand
goods: [apparel, baby, home-textiles]
ownership: unknown
parent: unknown
hq: Boulder, CO
marketplace: false
sells_on_amazon: unknown
amazon_owned: false
certifications:
  - {kind: fair_trade, source: https://www.fairtradecertified.org/shop-fair-trade/, checked: 2026-09-25, verified_this_run: true}
concerns: []
ethics: 0.75
environment: 0.5
tier: recommended
mentions: 4
mentioned_by: [adayinourshoes-com, fairtradecertified-org, goingzerowaste-com, goodgoodgood-co]
checked: 2026-09-25
---

Pact sells its own organic-cotton clothing basics for adults, kids and babies, plus home textiles. Its privacy policy names the company as "Wear Pact LLC, 4725 Walnut St, Boulder, CO 80301" and mentions unnamed "affiliated business entities"; no fetched page says who owns the LLC, so `ownership` and `parent` are unknown. It sells its own label, not third-party sellers' goods, so `marketplace` is false. No fetched source says whether it sells through Amazon's marketplace. The about page renders only in a browser, so its text could not be read.

Lists recommend it for organic cotton basics made in Fair Trade Certified factories; goodgoodgood-co also cites GOTS-certified cotton (a list claim, not checked here, and not a scored kind). Fair Trade USA's own shop page features its Classic Fine Knit Crew Sweater ("100% organic cotton") and lists it in the brand directory.

Certifications:
- Fair Trade USA: fetched this run; the shop page features a Pact product and lists Pact as a brand. Counts. (data/certifications.json has a matching row from 2026-09-23.)
- B Corp: not checked per brand (bcorporation.net returned HTTP 403 to this run; logged); no data/certifications.json row for wearpact.com.
- 1% for the Planet: directory profiles render only in a browser (logged); no fallback row.
- The Climate Label: explore.changeclimate.org/brand/pact returns "Brand Not Found".

Concerns: none recorded. An NLRB case search for "Wear Pact" returns no cases. CourtListener lists two federal dockets naming Wear Pact LLC as a defendant: an Americans with Disabilities Act case (W.D. Pa., filed 2020-04-16, terminated 2020-04-27) and *Johnston v. Wear Pact LLC* (D. Colo., filed 2025-06-18, open, nature of suit not shown). The search results show no finding or settlement, so neither is recorded. The session's web-search budget had run out, so no site-restricted searches of the other accepted sources were possible (logged).

## Rating
- ethics: start 0.5; +0.25 fair_trade; no accepted labor or governance concern; = 0.75
- environment: start 0.5; no verified environment certification; no accepted environmental concern; = 0.5
- tier: not on the blocklist (`--blocklist "Pact" wearpact.com`: "not on the blocklist"); ethics + environment = 1.25 ≥ 1.25 and no accepted concern in the last 5 years, so `recommended`.

## Sources
- https://wearpact.com/privacy
- https://wearpact.com/about (renders only in a browser; no text read)
- https://wearpact.com/page-sitemap.xml
- https://www.fairtradecertified.org/shop-fair-trade/
- https://explore.changeclimate.org/brand/pact (Brand Not Found)
- https://www.courtlistener.com/api/rest/v4/search/?q=%22Wear%20Pact%22&type=r&format=json
- https://www.nlrb.gov/search/case/Wear%20Pact
- data/blocklist.md (no match)
