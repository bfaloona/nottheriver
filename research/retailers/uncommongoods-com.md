---
name: Uncommon Goods
domain: uncommongoods.com
type: retailer
goods: [gifts, home accents, jewelry, kitchen and bar, art, games, books, food and drink, DIY kits]
ownership: private
parent: none
hq: Brooklyn, NY
marketplace: false
sells_on_amazon: unknown
amazon_owned: false
certifications:
  - {kind: b_corp, source: https://www.bcorporation.net/en-us/find-a-b-corp/company/uncommongoods/, checked: 2026-09-25, verified_this_run: false}
concerns: []
ethics: 0.75
environment: 0.5
tier: recommended
mentions: 5
mentioned_by: [amazonalts-org, goingzerowaste-com, goodgoodgood-co, ilsr-org, thegoodtrade-com]
checked: 2026-09-25
---

Uncommon Goods is an online gift retailer in Brooklyn, New York, founded in 1999 by David Bolotsky (Wikipedia). Its about page calls it "an independently owned business" with about 130 year-round team members, says starting pay for hourly staff "is more than double the federal minimum wage", and says it donates $1 per purchase to a partner of the customer's choice through its Better to Give program. Products are "handpicked by our buying team", who decide "to carry" items found at trade shows and online, and artists can submit work "for consideration" through a form; this is a curated retailer, not a platform where makers list their own goods, so `marketplace` is false. Wikipedia says about half the assortment is handmade and that it became a founding B Corp in 2007. Lists recommend it for unique gifts from independent artisans (The Good Trade, ILSR, AmazonAlts), and Going Zero Waste and Good Good Good cite its B Corp status.

Second pass (2026-09-25): the FTC cases and proceedings exact-phrase search for "Uncommon Goods" and the search for "Uncommongoods" both showed "No results found for these filters." The CourtListener agency-docket query since 2016 returned 0 dockets. ProPublica's search returned 48 article links, loose matches on the words (guardianship, elections, foster care and others); none is about Uncommon Goods, so none was opened. No matching cases; no concern added.

## Rating
- Ethics: 0.5 baseline, +0.25 `b_corp`. The B Corp directory returned HTTP 403 to this run's fetch, so the row in `data/certifications.json` counts (`verified_this_run: false`, "Certified Since May 2007", checked there 2026-09-23). No accepted concern. = 0.75
- Environment: 0.5 baseline. Not in The Climate Label directory's brand list; no 1% for the Planet claim on any list page. No environmental concern. = 0.5
- Total 1.25, no accepted concern in the last 5 years, not Amazon-owned: tier `recommended`.
- Concerns: NLRB's case search returned no cases for "uncommon goods". The WebSearch budget was used up, so ftc.gov, osha.gov, dol.gov and news were not searched; the concern list may be incomplete.
- Blocklist: `node research/build-index.mjs --blocklist "Uncommon Goods" uncommongoods.com` returned "not on the blocklist".
- Concern search partial: pass 2 checked FTC cases, CourtListener agency dockets since 2016 and ProPublica; no general news search, and DOJ, SEC and Violation Tracker were unreachable; tier is provisional.

## Sources
- https://en.wikipedia.org/wiki/Uncommon_Goods
- https://www.uncommongoods.com/about/our-story
- https://www.uncommongoods.com/about/our-products
- https://www.bcorporation.net/en-us/find-a-b-corp/company/uncommongoods/ (via data/certifications.json; directory blocked this run)
- https://www.nlrb.gov/search/case/uncommon%20goods
- https://explore.changeclimate.org/ (brand list)
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Uncommon%20Goods%22 (no results)
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Uncommongoods (no results)
- https://www.courtlistener.com/api/rest/v4/search/?type=r&order_by=dateFiled+desc&filed_after=2016-01-01&q=caseName%3A(%22Uncommon%20Goods%22)%20AND%20caseName%3A(%22Equal%20Employment%22%20OR%20%22EEOC%22%20OR%20%22Secretary%20of%20Labor%22%20OR%20%22Department%20of%20Labor%22%20OR%20%22Federal%20Trade%20Commission%22%20OR%20%22United%20States%22%20OR%20%22State%20of%22%20OR%20%22People%20of%22%20OR%20%22Commonwealth%22%20OR%20%22National%20Labor%20Relations%22%20OR%20%22Environmental%20Protection%22%20OR%20%22Consumer%20Product%20Safety%22%20OR%20%22Securities%20and%20Exchange%22%20OR%20%22Attorney%20General%22%20OR%20%22District%20of%20Columbia%22) (0 dockets)
- https://www.propublica.org/search?qss=%22Uncommon%20Goods%22 (48 articles, none about Uncommon Goods)
