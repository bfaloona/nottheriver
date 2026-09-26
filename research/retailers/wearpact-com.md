---
name: Pact
domain: wearpact.com
type: brand
goods: [apparel, baby, home-textiles]
ownership: unknown
parent: unknown
hq: Boulder, CO
marketplace: unknown
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

Pact sells its own organic-cotton clothing basics for adults, kids and babies, plus home textiles. Its privacy policy names the company as "Wear Pact LLC, 4725 Walnut St, Boulder, CO 80301" and mentions unnamed "affiliated business entities"; no fetched page says who owns the LLC, so `ownership` and `parent` are unknown. No fetched page says whether it hosts outside sellers, so `marketplace` is unknown. No fetched source says whether it sells through Amazon's marketplace. The about page renders only in a browser, so its text could not be read.

Lists recommend it for organic cotton basics made in Fair Trade Certified factories; goodgoodgood-co also cites GOTS-certified cotton (a list claim, not checked here, and not a scored kind). Fair Trade USA's own shop page features its Classic Fine Knit Crew Sweater ("100% organic cotton") and lists it in the brand directory.

Certifications:
- Fair Trade USA: fetched this run; the shop page features a Pact product and lists Pact as a brand. Counts. (data/certifications.json has a matching row from 2026-09-23.)
- B Corp: not checked per brand (bcorporation.net returned HTTP 403 to this run; logged); no data/certifications.json row for wearpact.com.
- 1% for the Planet: directory profiles render only in a browser (logged); no fallback row.
- The Climate Label: explore.changeclimate.org/brand/pact returns "Brand Not Found".

Concerns: none recorded. An NLRB case search for "Wear Pact" returns no cases. CourtListener lists two federal dockets naming Wear Pact LLC as a defendant: an Americans with Disabilities Act case (W.D. Pa., filed 2020-04-16, terminated 2020-04-27) and an individual's suit against Wear Pact LLC (D. Colo., filed 2025-06-18, open, nature of suit not shown). The search results show no finding or settlement, so neither is recorded. The session's web-search budget had run out, so no site-restricted searches of the other accepted sources were possible (logged).

Second pass (2026-09-25): the FTC cases and proceedings search for "Pact" returned 12 results; the only one named Pact is "Pact, Inc." (FTC matter 152 3010), and its case page shows it is a different company: "Federal Trade Commission v. Pact, Inc." (W.D. Wash., 2:17-cv-1429, 2017-09-21) against "Pact, Inc., a Delaware corporation; Yifan Zhang ... and Geoffrey Oberhofer", over a mobile app that the FTC alleged failed to deliver promised cash rewards, while this retailer is Wear Pact LLC of Boulder, Colorado. That case is a name collision and is not recorded. The same case was the only CourtListener agency docket returned for the retailer's names since 2016. ProPublica's search returned 49 article links, loose matches on "pact" (veterans' cancer coverage, trade policy and others); none is about the retailer, so none was opened. No matching cases; no concern added.

News pass (2026-09-25): two web searches, `"Wear Pact" OR "Pact organic" lawsuit OR settlement OR fine OR violation` and `"Wear Pact" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")` (the name is searched as "Wear Pact" because "Pact" alone matches unrelated uses). The only enforcement hit was the FTC's 2017 case against Pact, Inc., the mobile-app company already identified above as a name collision. Other hits were Better Business Bureau consumer complaints about unsubscribe and data-deletion requests, a consumer blog's PFAS lab test of Pact leggings and review sites; none is an agency or court action. The file names no parent company, so no third search applied. No concern added.

Operator-rule pass (2026-09-25): searched the California AG's Proposition 65 60-day notice database (Alleged Violator field) for `"Pact, Inc"`, `"Wear Pact"`: the legal names Pact, Inc. and Wear Pact LLC (the bare word "Pact" is too generic); no notices, so no settlement or judgment and no concern added.

## Rating
- ethics: start 0.5; +0.25 fair_trade; no accepted labor or governance concern; = 0.75
- environment: start 0.5; no verified environment certification; no accepted environmental concern; = 0.5
- tier: not on the blocklist (`--blocklist "Pact" wearpact.com`: "not on the blocklist"); ethics + environment = 1.25 ≥ 1.25 and no accepted concern in the last 5 years, so `recommended`.
- Concern search: passes 1 to 3 (agency pages, FTC, CourtListener, ProPublica, general news search).

## Sources
- https://wearpact.com/privacy
- https://wearpact.com/about (renders only in a browser; no text read)
- https://wearpact.com/page-sitemap.xml
- https://www.fairtradecertified.org/shop-fair-trade/
- https://explore.changeclimate.org/brand/pact (Brand Not Found)
- https://www.courtlistener.com/api/rest/v4/search/?q=%22Wear%20Pact%22&type=r&format=json
- https://www.nlrb.gov/search/case/Wear%20Pact
- data/blocklist.md (no match)
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Pact (12 results; only "Pact, Inc." named Pact)
- https://www.ftc.gov/legal-library/browse/cases-proceedings/152-3010-pact-inc (FTC v. Pact, Inc., a mobile-app company; name collision)
- https://www.courtlistener.com/api/rest/v4/search/?type=r&order_by=dateFiled+desc&filed_after=2016-01-01&q=caseName%3A(%22Pact%22%20OR%20%22Pact%20Apparel%22%20OR%20%22Pact%2C%20LLC%22)%20AND%20caseName%3A(%22Equal%20Employment%22%20OR%20%22EEOC%22%20OR%20%22Secretary%20of%20Labor%22%20OR%20%22Department%20of%20Labor%22%20OR%20%22Federal%20Trade%20Commission%22%20OR%20%22United%20States%22%20OR%20%22State%20of%22%20OR%20%22People%20of%22%20OR%20%22Commonwealth%22%20OR%20%22National%20Labor%20Relations%22%20OR%20%22Environmental%20Protection%22%20OR%20%22Consumer%20Product%20Safety%22%20OR%20%22Securities%20and%20Exchange%22%20OR%20%22Attorney%20General%22%20OR%20%22District%20of%20Columbia%22) (1 docket, the same FTC v. Pact, Inc. case)
- https://www.propublica.org/search?qss=%22Pact%22 (articles, none about the retailer)
- https://oag.ca.gov/prop65/60-day-notice-search-results?field_prop65_defendant_value=%22Pact%2C+Inc%22&items_per_page=100 (no matching settlement)
- https://oag.ca.gov/prop65/60-day-notice-search-results?field_prop65_defendant_value=%22Wear+Pact%22&items_per_page=100 (no matching settlement)
