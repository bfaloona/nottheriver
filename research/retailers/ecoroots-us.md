---
name: EcoRoots
domain: ecoroots.us
type: brand
goods: [personal care, household, zero-waste]
ownership: unknown
parent: unknown
hq: unknown
marketplace: false
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns: []
ethics: 0.5
environment: 0.5
tier: acceptable
mentions: 2
mentioned_by: [goingzerowaste-com, sustainablejungle-com]
checked: 2026-09-25
---

EcoRoots sells zero-waste personal care and household goods ("beauty, hair, and household essentials", vegan, "made in small batches") with plastic-free shipping and reusable or recyclable packaging, per its about page, which names a founder, Antonia, but gives no founding year, legal entity or ownership. The store's public product feed lists 171 of 172 products under the vendor "EcoRoots" (the other is a tip jar), so it sells its own brand and does not host outside sellers. The contact page gives a mailing address in Phoenix, Arizona; headquarters is left `unknown` because a mailing address is not stated as a head office. "Amazon" appears on the site only as a payment method (Amazon Pay), which says nothing about selling on Amazon. Lists recommend it for "sustainable personal care and zero-waste essentials" (sustainablejungle-com) and as "ethically and sustainably sourced" with donations to Ocean Conservancy (goingzerowaste-com); the donation claim was not checked with Ocean Conservancy.

No certification claim appears on its about page. Concern checks found nothing: no OSHA establishment matches "EcoRoots" (2016 to 2026), and CourtListener's docket search returns no case for "EcoRoots" or "Eco Roots".

## Rating
- Amazon-owned: no (`build-index.mjs --blocklist` reports "not on the blocklist").
- Ethics: 0.5 baseline. No ethics certification found (bcorporation.net blocked agents this run; no row in `data/certifications.json`). No accepted concern. Result 0.5.
- Environment: 0.5 baseline. No environmental certification found: The Climate Label's brand sitemap (310 brand pages) has no EcoRoots entry, and the 1% for the Planet directory renders no text to a fetch (no row in `data/certifications.json`). No environmental concern. Result 0.5.
- Tier: ethics + environment = 1.0 < 1.25, ≥ 1.0: `acceptable`.
- Concern search incomplete this run (see raw/blocked-retailers-R9.md); tier is provisional.

## Sources
- https://ecoroots.us/pages/about-us
- https://ecoroots.us/pages/contact-us
- https://ecoroots.us/policies/terms-of-service
- https://ecoroots.us/products.json?limit=250 (Shopify product feed: vendor names)
- https://explore.changeclimate.org/sitemap.xml
- https://www.osha.gov/ords/imis/establishment.search?p_logger=1&establishment=EcoRoots&State=all&officetype=all&Office=all&sitezip=&p_case=all&p_violations_exist=all&startmonth=01&startday=01&startyear=2010&endmonth=09&endday=25&endyear=2026 (redirected to the no-results message)
- https://www.courtlistener.com/api/rest/v4/search/?q=%22EcoRoots%22&type=r (0 results)
- https://www.courtlistener.com/api/rest/v4/search/?q=%22Eco%20Roots%22&type=r (0 results)
- data/blocklist.md
