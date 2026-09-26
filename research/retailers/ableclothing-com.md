---
name: ABLE
domain: ableclothing.com
type: brand
goods: [clothing, leather goods, jewelry, accessories]
ownership: public-benefit-corporation
parent: unknown
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

ABLE (legal name Fashionable, Inc.) makes women's clothing, leather goods and jewelry; its about page says "ABLE creates timeless leather goods and jewelry designed for real life" and that it "has always believed that work creates dignity," stressing "fair pay, and long-term stability." Wikipedia says it was founded in 2010 as a nonprofit by Barrett Ward and Rachel Ward to employ women in Addis Ababa, Ethiopia, then "converted into a for-profit company and is classified as a benefit corporation"; it lists the company as privately held with headquarters at 5022 Centennial Blvd, Nashville, Tennessee. No source fetched names a parent company, so `parent` is `unknown`. The store's product feed lists its products under the vendors ABLE, "ABLE | NAVEDA" and FASHIONABLE (plus one "Onward" item), so it does not host outside sellers. Lists recommend it for bags and accessories made by "fairly paid women" (amazonalts-org); the adayinourshoes-com page links livefashionable.com, which now redirects to ableclothing.com.

CourtListener shows that Fashionable, Inc. filed a Chapter 11 bankruptcy case (M.D. Tenn., 3:25-bk-01501, filed 2025-04-08), still open with settlement motions in 2026. A bankruptcy filing is not a finding of wrongdoing and is not a concern; it may mean ownership changes, so ownership should be rechecked. Also seen: an ADA website-access suit (against Fashionable, Inc., N.D. Ill., filed 2025-07-16, terminated 2025-09-17), not counted. No OSHA establishment matches "Fashionable" in Tennessee (2016 to 2026).

Second pass (2026-09-25): FTC cases search for "Fashionable" (the legal name) returned no results, and a search for "ABLE" returned 220 keyword matches (substrings such as "Accountable" and "Adjustable") whose top 20 by date and by relevance name no ABLE or Fashionable, Inc. respondent; the CourtListener agency-docket query for "ABLE" since 2016 returned 29 dockets (20 listed), all name collisions (Able Sales Company, Able Car Rental, Able Groupe, Able Moving & Storage, criminal cases against individuals named Able, forfeitures of property on Able Place) or suits against a state or the United States; ProPublica's 32 hits for "ABLE" include none about the company. No matching cases.

News pass (2026-09-25): two web searches, `"ABLE" "Fashionable" Nashville clothing lawsuit OR settlement OR fine OR violation` and `"ABLE" Nashville "Fashionable Inc" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`. Hits were the 2025 Chapter 11 filing already noted (Nashville Post, BKData), the company's Wikipedia page, and other companies' cases (Fashion Nova); none reports an agency or court action against the company. No parent is named, so no third search. No concerns added.

Operator-rule pass (2026-09-25): searched the California AG's Proposition 65 60-day notice database (Alleged Violator field) for `Fashionable`: the legal name Fashionable, Inc. (the brand name "ABLE" is too generic for a substring search and was not searched); no notices, so no settlement or judgment and no concern added.

## Rating
- Amazon-owned: no (`build-index.mjs --blocklist` reports "not on the blocklist").
- Ethics: 0.5 baseline. No ethics certification found (bcorporation.net blocked agents this run; no row in `data/certifications.json` for this domain; not on Fair Trade USA's shop page). Benefit-corporation status is a legal form, not a scored certification. No accepted concern. Result 0.5.
- Environment: 0.5 baseline. No environmental certification found: The Climate Label's brand sitemap (310 brand pages) has no ABLE entry, and the 1% for the Planet directory renders no text to a fetch (no row in `data/certifications.json`). No environmental concern. Result 0.5.
- Tier: ethics + environment = 1.0 < 1.25, ≥ 1.0: `acceptable`.
- Concern search: passes 1 to 3 (agency pages, FTC, CourtListener, ProPublica, general news search).

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
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=ABLE
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Fashionable%2C%20Inc.%22
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Fashionable
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=ABLE&sort_by=search_api_relevance
- https://www.courtlistener.com/api/rest/v4/search/?type=r&order_by=dateFiled+desc&filed_after=2016-01-01&q=caseName%3A(%22ABLE%22)%20AND%20caseName%3A(%22Equal%20Employment%22%20OR%20%22EEOC%22%20OR%20%22Secretary%20of%20Labor%22%20OR%20%22Department%20of%20Labor%22%20OR%20%22Federal%20Trade%20Commission%22%20OR%20%22United%20States%22%20OR%20%22State%20of%22%20OR%20%22People%20of%22%20OR%20%22Commonwealth%22%20OR%20%22National%20Labor%20Relations%22%20OR%20%22Environmental%20Protection%22%20OR%20%22Consumer%20Product%20Safety%22%20OR%20%22Securities%20and%20Exchange%22%20OR%20%22Attorney%20General%22%20OR%20%22District%20of%20Columbia%22) (pass 2 agency-docket query)
- https://www.propublica.org/search?qss=%22ABLE%22
- https://oag.ca.gov/prop65/60-day-notice-search-results?field_prop65_defendant_value=Fashionable&items_per_page=100 (no matching settlement)
