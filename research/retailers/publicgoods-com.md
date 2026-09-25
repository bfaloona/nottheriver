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
concerns:
  - {kind: governance, title: "Don't Run Out dba Public Goods - 626847 - 03/11/2022", source: https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/dont-run-out-dba-public-goods-626847-03112022, date: 2022-03-11, accepted_source: false}
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

Second pass (2026-09-25): the FTC cases and proceedings search returned no results for "Public Goods" (no parent named to try); the CourtListener agency-docket query since 2016 returned no dockets; none of the 40 ProPublica articles matching "Public Goods" is about the company. No matching cases, so no concern rows were added.

News pass (2026-09-25): two web searches (no parent named, so no third), with the legal name added: `"Public Goods" OR "Don't Run Out, Inc." lawsuit OR settlement OR fine OR violation` and `"Public Goods" publicgoods.com (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general" OR "Proposition 65")`. One agency action found: an FDA warning letter to "Don't Run Out dba Public Goods" dated March 11, 2022 (Division of Northeast Imports), which says "we found that you are not in compliance with the requirements of 21 CFR part 1, subpart L" and that the company "did not develop, maintain, and follow an FSVP as required by section 805 of the FD&C Act" for imported ramen noodles (FSVP is the Foreign Supplier Verification Program). It is recorded as a governance row, but fda.gov is not an accepted source (`data/negative-sources.json`), so `accepted_source: false` and it does not change the score. The page mentions no close-out letter. Also seen: the Casillas v. Don't Run Out, Inc. docket (E.D. Cal. 22-1153, the 2022 private suit already noted above) and an NSF public notice about the company (NSF is a certifier, not an agency; not fetched). The second search returned only general Proposition 65 pages.

## Rating
- ethics: 0.5 baseline. No B Corp, fair trade or worker co-op listing verified (bcorporation.net returned 403; no fallback row in data/certifications.json for publicgoods.com).
- environment: 0.5 baseline. No 1% for the Planet or Climate Label listing verified (the 1% for the Planet directory returns no data to a plain fetch; not checked on the Climate Label directory).
- concerns: one row, the 2022 FDA warning letter, which is `accepted_source: false` (fda.gov is not an accepted source) and does not count. NLRB case search for "Public Goods" returned no cases (a control search for "Starbucks" returned 2,559). Other searches were limited: the web search budget ran out before the general news pass, and Violation Tracker returned 403.
- tier: `acceptable` (0.5 + 0.5 = 1.0, not Amazon-owned per `node research/build-index.mjs --blocklist`).
- Concern search: passes 1 to 3 (agency pages, FTC, CourtListener, ProPublica, general news search).

## Sources
- https://www.publicgoods.com/
- https://www.publicgoods.com/pages/about-us
- https://www.publicgoods.com/policies/terms-of-service
- https://beautymatter.com/articles/l-catterton-takes-15-million-stake-in-public-goods
- https://www.courtlistener.com/api/rest/v4/search/?q=%22Don%27t+Run+Out%22&type=r
- https://www.nlrb.gov/search/case/%22Public%20Goods%22
- data/blocklist.md (no match)
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Public%20Goods%22
- https://www.courtlistener.com/api/rest/v4/search/?type=r&order_by=dateFiled+desc&filed_after=2016-01-01&q=caseName%3A(%22Public%20Goods%22)%20AND%20caseName%3A(%22Equal%20Employment%22%20OR%20%22EEOC%22%20OR%20%22Secretary%20of%20Labor%22%20OR%20%22Department%20of%20Labor%22%20OR%20%22Federal%20Trade%20Commission%22%20OR%20%22United%20States%22%20OR%20%22State%20of%22%20OR%20%22People%20of%22%20OR%20%22Commonwealth%22%20OR%20%22National%20Labor%20Relations%22%20OR%20%22Environmental%20Protection%22%20OR%20%22Consumer%20Product%20Safety%22%20OR%20%22Securities%20and%20Exchange%22%20OR%20%22Attorney%20General%22%20OR%20%22District%20of%20Columbia%22) (pass 2 agency-docket query)
- https://www.propublica.org/search?qss=%22Public%20Goods%22
- https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/dont-run-out-dba-public-goods-626847-03112022
