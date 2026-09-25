---
name: Tentree
domain: tentree.com
type: brand
goods: [clothing, accessories]
ownership: unknown
parent: unknown
hq: Vancouver, BC, Canada
marketplace: unknown
sells_on_amazon: unknown
amazon_owned: false
certifications:
  - {kind: climate_neutral, source: https://explore.changeclimate.org/brand/tentree, checked: 2026-09-25, verified_this_run: true}
concerns: []
ethics: 0.5
environment: 0.75
tier: recommended
mentions: 3
mentioned_by: [amazonalts-org, goingzerowaste-com, goodgoodgood-co]
checked: 2026-09-25
---

Tentree sells its own apparel (t-shirts, hoodies, jackets, pants, dresses) and accessories (hats, bags, water bottles). Its about page gives an address at 230 - 1275 Venables St, Vancouver, and says "For every item purchased we plant trees", with 100M+ trees planted to date. It also runs a trade-in program and "The Consignment Shop" for resale, which Good Good Good lists separately as "Circularity by Tentree". No fetched page this run gave its founding date, owners or legal entity, so ownership is `unknown`.

Lists recommend it for tree planting: AmazonAlts ("10 trees for each item purchased"), Going Zero Waste ("plant 10 trees" per purchase) and Good Good Good ("plant 10 trees for every item sold").

Tentree's about page claims B Corp certification (and a "Best For the World" award in Community, 2021), the Climate Label and Science Based Targets. The B Corp claim could not be checked on bcorporation.net (HTTP 403) and data/certifications.json has no row for tentree.com, so it does not count. The Climate Label claim was checked on the certifier's own directory (explore.changeclimate.org, run by Climate Neutral dba The Change Climate Project; climateneutral.org redirects to changeclimate.org), which shows "first certified 2021" and "current certification year 2025".

CourtListener shows Haker v. Tentree International Inc. (E.D.N.Y., filed 2020-03-20, copyright infringement, terminated 2021-09-08). A copyright claim is not a labor, governance or environmental concern, so it is not recorded as one.

## Rating
- ethics: 0.5 baseline. B Corp claimed but not verified this run (bcorporation.net 403, no fallback row).
- environment: 0.5 + 0.25 (The Climate Label, verified on explore.changeclimate.org; the directory showed 2025 as the current certification year when checked 2026-09-25, and the tier depends on this row) = 0.75. 1% for the Planet not checked: the directory returns no data to a plain fetch.
- concerns: none recorded. NLRB case search returned no cases (control search "Starbucks" returned 2,559); CourtListener API search found only the copyright case above; the web search budget ran out before the regulator and news searches, and Tentree is a Canadian company, which US regulator databases may not cover.
- tier: `recommended` (0.5 + 0.75 = 1.25, no accepted concern, not Amazon-owned per `node research/build-index.mjs --blocklist`).
- Concern search incomplete this run (see raw/blocked-retailers-R7.md); tier is provisional.

## Sources
- https://www.tentree.com/pages/about
- https://www.tentree.com/policies/terms-of-service
- https://explore.changeclimate.org/brand/tentree
- https://www.climatelabel.org/
- https://www.climateneutral.org/ (redirects to https://www.changeclimate.org/)
- https://www.courtlistener.com/api/rest/v4/search/?type=r&q=%22tentree%22
- https://www.nlrb.gov/search/case/tentree
- data/blocklist.md (no match)
