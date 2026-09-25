---
name: Bob's Red Mill
domain: bobsredmill.com
type: brand
goods: [food, flour, grains, baking]
ownership: employee-owned
parent: none
hq: Milwaukie, OR
marketplace: unknown
sells_on_amazon: unknown
amazon_owned: false
certifications:
  - {kind: fair_trade, source: https://www.fairtradecertified.org/our-community/shop-fair-trade/, checked: 2026-09-25, verified_this_run: true}
concerns:
  - {kind: labor, title: "Inspection Detail | Occupational Safety and Health Administration", source: "https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1637323.015", date: 2023-01-03, accepted_source: true}
ethics: 0.5
environment: 0.5
tier: acceptable
mentions: 2
mentioned_by: [fairtradecertified-org, workerowned-info]
checked: 2026-09-25
---

Bob's Red Mill mills and sells whole grains, flours, oats, baking mixes, beans and seeds under its own brand. Wikipedia says it was founded in 1978 by Bob and Charlee Moore, is based in Milwaukie, Oregon, and that "In February 2010, owner Bob Moore transferred one-third of the company to his employees using an employee stock ownership plan"; "By April 2020, 100% of the company was owned by its more than 700 employees." The company's own about page calls it "an employee-owned business." Employee ownership through a stock plan is not a worker cooperative, so no `worker_coop` certification applies. workerowned-info recommends it as "Employee-owned"; fairtradecertified-org shows it as a brand tile (baking, food).

Fair Trade USA's shop page lists Bob's Red Mill among "brands that offer Fair Trade Certified products" (the tile links to bobsredmill.com/food-safety). That is product-level, not whole-company certification.

OSHA (Oregon state plan) inspections of Bob's Red Mill Natural Foods Inc, 13521 SE Pheasant Ct, Portland, OR: seven since 2018. Counted: a complaint inspection opened 2022-10-25, citations issued 2023-01-03, 3 serious citations with penalties, total $1,350. Not counted: a planned inspection opened 2025-09-25, still open, with one other-than-serious citation (issued 2025-10-29) and no penalty; the other five list no violations.

Litigation seen on CourtListener, none counted because the docket list shows no finding or settlement: an employment civil-rights suit (Santos, D. Or., 2011), consumer fraud and contract suits (Frankel, N.D. Cal., 2018; Hayden, N.D. Cal., 2023), a product-liability suit (Sturdivant, S.D. Fla., 2014) and an ADA website-access suit (Dawson, S.D.N.Y., 2020). All are terminated.

## Rating
- Amazon-owned: no (`build-index.mjs --blocklist` reports "not on the blocklist").
- Ethics: 0.5 baseline, +0.25 `fair_trade` (fairtradecertified.org brand listing, fetched this run), −0.25 × 1 accepted labor concern (osha.gov). B Corp not checked: bcorporation.net blocked agents this run and `data/certifications.json` has no row for this domain. Result 0.5.
- Environment: 0.5 baseline. No environmental certification found: The Climate Label's brand sitemap (explore.changeclimate.org/sitemap.xml, 310 brand pages) has no Bob's Red Mill entry, and the 1% for the Planet directory renders no text to a fetch (no row in `data/certifications.json`). No environmental concern. Result 0.5.
- Tier: ethics + environment = 1.0; an accepted concern in the last 5 years rules out `recommended`; 1.0 ≥ 1.0: `acceptable`.
- Concern search incomplete this run (see raw/blocked-retailers-R9.md); tier is provisional.

## Sources
- https://en.wikipedia.org/wiki/Bob%27s_Red_Mill
- https://www.bobsredmill.com/about-us
- https://www.fairtradecertified.org/our-community/shop-fair-trade/
- https://www.osha.gov/ords/imis/establishment.search?p_logger=1&establishment=Bob%27s+Red+Mill&State=OR&officetype=all&Office=all&sitezip=&p_case=all&p_violations_exist=all&startmonth=01&startday=01&startyear=2010&endmonth=09&endday=25&endyear=2026
- https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1637323.015
- https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1855840.015
- https://www.courtlistener.com/api/rest/v4/search/?q=%22Bob's%20Red%20Mill%22&type=r (docket list)
- https://www.ftc.gov/search?search_api_fulltext=%22Bob%27s+Red+Mill%22 (404)
- https://explore.changeclimate.org/sitemap.xml
- data/blocklist.md
