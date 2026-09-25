---
name: Grove Collaborative
domain: grove.co
type: retailer
goods: [household cleaning products, personal care, home goods]
ownership: public-benefit-corporation
parent: none
hq: San Francisco, CA
marketplace: unknown
sells_on_amazon: unknown
amazon_owned: false
certifications:
  - {kind: b_corp, source: https://www.bcorporation.net/en-us/find-a-b-corp/company/grove-collaborative/, checked: 2026-09-25, verified_this_run: false}
concerns: []
ethics: 0.75
environment: 0.5
tier: recommended
mentions: 6
mentioned_by: [amazonalts-org, gobankingrates-com, goingzerowaste-com, goodgoodgood-co, thegoodtrade-com, vstyleblog-com]
checked: 2026-09-25
---

Grove Collaborative sells household cleaning and personal care products online, both under its own Grove Co. brand and from third-party brands (Wikipedia). Wikipedia describes it as a benefit corporation listed on the stock exchange as GROV since a 2022 SPAC merger, founded in 2012 as ePantry, headquartered in San Francisco with an office in Portland, Maine, and sold in stores through Target (from 2021) and later Kohl's, Meijer and Giant Eagle. Whether it hosts independent third-party sellers, and whether it sells through Amazon, was not shown by any fetched source, so both are `unknown`. Lists recommend it for lower-cost, natural cleaning and personal care with flexible subscriptions (The Good Trade, GOBankingRates), and cite B Corp status, carbon-neutral shipping and a plastic-free pledge (Good Good Good, Going Zero Waste, V Style Blog, AmazonAlts). The "CarbonNeutral" shipping claim is from another certifier than The Climate Label and is not a scored kind.

Second pass (2026-09-25): the FTC cases and proceedings search for "Grove Collaborative" returned 6 loosely matched results (Hargrove & Associates, Hikma/Custopharm, viagogo and Grover Street, Grover Stewart); none names Grove Collaborative. The CourtListener agency-docket query since 2016 returned 0 dockets. ProPublica's search returned 13 article links (Terrorgram, Utah solar, public-lands grazing and others); none is about an action against Grove, so none was opened. No matching cases; no concern added.

News pass (2026-09-25): two web searches, `"Grove Collaborative" lawsuit OR settlement OR fine OR violation` and `"Grove Collaborative" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`, plus one follow-up, `Grove Collaborative automatic renewal district attorney settlement judgment`. Found: (1) a Proposition 65 settlement filed with the California Attorney General between APS&EE, LLC, a private organization, and Grove Collaborative, Inc. over lead in 8 Greens supplements and lollipops (60-day notices served 2025-06-26 and 2025-07-23); the agreement states "Grove denies all allegations" and is "a compromise of claims that are expressly contested and denied". It is a private party's out-of-court settlement, not an agency or court action, so it is noted, not recorded (same treatment as Etsy's Prop 65 settlement). (2) Search snippets of Grove's SEC 10-K filings (sec.gov, not fetched) say the Santa Clara County District Attorney's consumer protection division, with other county and city prosecutors, is investigating Grove's automatic renewal practices, and that no legal proceeding had commenced; the follow-up search found no settlement or judgment. An open investigation is not a finding, so it is noted, not recorded. (3) A 2020 website-accessibility suit by an individual (D. Mass.), a private suit. The second search found only agency pages and EPA's 2020 and 2021 Safer Choice Partner of the Year awards to Grove. The file names no parent company, so no third search applied. No concern added.

## Rating
- Ethics: 0.5 baseline, +0.25 `b_corp`. The B Corp directory returned HTTP 403 to this run's fetch of this page, so the row in `data/certifications.json` counts (`verified_this_run: false`, "Certified Since June 2014", checked there 2026-09-23). No accepted concern. = 0.75
- Environment: 0.5 baseline. The Climate Label: explore.changeclimate.org/brand/grove-collaborative and /brand/grove return "Brand Not Found", and Grove is not in the directory's brand list; not counted. No environmental concern. = 0.5
- Total 1.25, no accepted concern in the last 5 years, not Amazon-owned: tier `recommended`.
- Concerns: NLRB's case search returned no cases for "grove collaborative". Pass 1 could not search ftc.gov, osha.gov, dol.gov, sec.gov or news (search budget used up); passes 2 and 3 added FTC cases, CourtListener, ProPublica and a general news search.
- Blocklist: `node research/build-index.mjs --blocklist "Grove Collaborative" grove.co` returned "not on the blocklist".
- Concern search: passes 1 to 3 (agency pages, FTC, CourtListener, ProPublica, general news search).

## Sources
- https://en.wikipedia.org/wiki/Grove_Collaborative
- https://www.bcorporation.net/en-us/find-a-b-corp/company/grove-collaborative/ (HTTP 403 this run; via data/certifications.json)
- https://explore.changeclimate.org/brand/grove-collaborative
- https://explore.changeclimate.org/brand/grove
- https://explore.changeclimate.org/ (brand list)
- https://www.nlrb.gov/search/case/grove%20collaborative
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Grove%20Collaborative (6 loose matches, none about Grove Collaborative)
- https://www.courtlistener.com/api/rest/v4/search/?type=r&order_by=dateFiled+desc&filed_after=2016-01-01&q=caseName%3A(%22Grove%20Collaborative%22%20OR%20%22Grove%20Collaborative%22)%20AND%20caseName%3A(%22Equal%20Employment%22%20OR%20%22EEOC%22%20OR%20%22Secretary%20of%20Labor%22%20OR%20%22Department%20of%20Labor%22%20OR%20%22Federal%20Trade%20Commission%22%20OR%20%22United%20States%22%20OR%20%22State%20of%22%20OR%20%22People%20of%22%20OR%20%22Commonwealth%22%20OR%20%22National%20Labor%20Relations%22%20OR%20%22Environmental%20Protection%22%20OR%20%22Consumer%20Product%20Safety%22%20OR%20%22Securities%20and%20Exchange%22%20OR%20%22Attorney%20General%22%20OR%20%22District%20of%20Columbia%22) (0 dockets)
- https://www.propublica.org/search?qss=%22Grove%20Collaborative%22 (13 articles, none about Grove)
- https://oag.ca.gov/system/files/prop65/settlements/2025-02024S7130.pdf (Prop 65 private settlement, APS&EE and Grove, 2025; noted, not a concern)
