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

News pass (2026-09-25): two web searches, `"Uncommon Goods" OR "UncommonGoods" lawsuit OR settlement OR fine OR violation` and `"Uncommon Goods" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`. The first surfaced one old item: a Proposition 65 case by a private individual, Russell Brimer, against UncommonGoods, L.L.C. over lead in glassware (notice 2005-08-05; complaint in San Francisco Superior Court, CGC-05-445626). The California AG's summary page records an out-of-court settlement on 2006-05-11 ($1,600 civil penalty, $16,400 fees) and says "A court judgment was entered on December 21, 2006 pursuant to the settlement agreement." It is noted here, not recorded as a concern: the source (oag.ca.gov) is not on the accepted list, the claim is a product-safety warning claim rather than a labor, governance or environmental one, and it is about 20 years old, so it could not affect the tier (it would count as `accepted_source: false`). The search also surfaced a trademark dispute that another company ("Uncommon", a phone-case maker) brought against Uncommon Goods seeking a declaration of non-infringement, a private suit. The second search returned only agency pages and Wikipedia. The file names no parent company, so no third search applied. No concern added.

## Rating
- Ethics: 0.5 baseline, +0.25 `b_corp`. The B Corp directory returned HTTP 403 to this run's fetch, so the row in `data/certifications.json` counts (`verified_this_run: false`, "Certified Since May 2007", checked there 2026-09-23). No accepted concern. = 0.75
- Environment: 0.5 baseline. Not in The Climate Label directory's brand list; no 1% for the Planet claim on any list page. No environmental concern. = 0.5
- Total 1.25, no accepted concern in the last 5 years, not Amazon-owned: tier `recommended`.
- Concerns: NLRB's case search returned no cases for "uncommon goods". Pass 1 could not search ftc.gov, osha.gov, dol.gov or news (search budget used up); passes 2 and 3 added FTC cases, CourtListener, ProPublica and a general news search.
- Blocklist: `node research/build-index.mjs --blocklist "Uncommon Goods" uncommongoods.com` returned "not on the blocklist".
- Concern search: passes 1 to 3 (agency pages, FTC, CourtListener, ProPublica, general news search).

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
- https://www.oag.ca.gov/prop65/60-Day-Notice-2005-00214 (Prop 65 private case, glassware, settled 2006 with a court judgment; noted, not a concern)
