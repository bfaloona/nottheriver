---
name: ABLE
domain: ableclothing.com
type: brand
goods: [clothing, leather goods, jewelry, accessories]
ownership: public-benefit-corporation
parent: none
hq: Nashville, TN
marketplace: false
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns: []
ethics: 0.5
environment: 0.5
tier: acceptable
mentions: 2
mentioned_by: [adayinourshoes-com, amazonalts-org]
checked: 2026-09-25
---

ABLE (legal name Fashionable, Inc.) makes women's clothing, leather goods and jewelry; its about page says "ABLE creates timeless leather goods and jewelry designed for real life" and that it "has always believed that work creates dignity," stressing "fair pay, and long-term stability." Wikipedia says it was founded in 2010 as a nonprofit by Barrett Ward and Rachel Ward to employ women in Addis Ababa, Ethiopia, then "converted into a for-profit company and is classified as a benefit corporation"; it lists the company as privately held with headquarters at 5022 Centennial Blvd, Nashville, Tennessee. The store's product feed lists its products under the vendors ABLE, "ABLE | NAVEDA" and FASHIONABLE (plus one "Onward" item), so it does not host outside sellers. Lists recommend it for bags and accessories made by "fairly paid women" (amazonalts-org); the adayinourshoes-com page links livefashionable.com, which now redirects to ableclothing.com.

CourtListener shows that Fashionable, Inc. filed a Chapter 11 bankruptcy case (M.D. Tenn., 3:25-bk-01501, filed 2025-04-08), still open with settlement motions in 2026. A bankruptcy filing is not a finding of wrongdoing and is not a concern; it may mean ownership changes, so ownership should be rechecked. Also seen: an ADA website-access suit (Davis v. Fashionable, Inc., N.D. Ill., filed 2025-07-16, terminated 2025-09-17), not counted. No OSHA establishment matches "Fashionable" in Tennessee (2016 to 2026).

## Rating
- Amazon-owned: no (`build-index.mjs --blocklist` reports "not on the blocklist").
- Ethics: 0.5 baseline. No ethics certification found (bcorporation.net blocked agents this run; no row in `data/certifications.json` for this domain; not on Fair Trade USA's shop page). Benefit-corporation status is a legal form, not a scored certification. No accepted concern. Result 0.5.
- Environment: 0.5 baseline. No environmental certification found: The Climate Label's brand sitemap (310 brand pages) has no ABLE entry, and the 1% for the Planet directory renders no text to a fetch (no row in `data/certifications.json`). No environmental concern. Result 0.5.
- Tier: ethics + environment = 1.0 < 1.25, ≥ 1.0: `acceptable`.

## Sources
- https://www.ableclothing.com/pages/about-us
- https://ableclothing.com/products.json?limit=250 (Shopify product feed: vendor names)
- https://en.wikipedia.org/wiki/Fashionable,_Inc.
- https://www.fairtradecertified.org/our-community/shop-fair-trade/
- https://explore.changeclimate.org/sitemap.xml
- https://www.osha.gov/ords/imis/establishment.search?p_logger=1&establishment=Fashionable&State=TN&officetype=all&Office=all&sitezip=&p_case=all&p_violations_exist=all&startmonth=01&startday=01&startyear=2010&endmonth=09&endday=25&endyear=2026 (redirected to the no-results message)
- https://www.courtlistener.com/api/rest/v4/search/?q=%22Fashionable%20Inc%22%20Nashville&type=r (docket list, bankruptcy docket entries)
- https://www.courtlistener.com/api/rest/v4/search/?q=%22ableclothing%22&type=r
- data/blocklist.md
