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
concerns:
  - {kind: environmental, title: "Prop 65 out-of-court settlement, APS&EE, LLC v. Grove Collaborative, Inc. (lead, 8 Greens supplement; $3,000 civil penalty)", source: https://oag.ca.gov/prop65/60-Day-Notice-2025-02024, date: 2026-02-12, accepted_source: true}
ethics: 0.75
environment: 0.25
tier: acceptable
mentions: 6
mentioned_by: [amazonalts-org, gobankingrates-com, goingzerowaste-com, goodgoodgood-co, thegoodtrade-com, vstyleblog-com]
checked: 2026-09-25
---

Grove Collaborative sells household cleaning and personal care products online, both under its own Grove Co. brand and from third-party brands (Wikipedia). Wikipedia describes it as a benefit corporation listed on the stock exchange as GROV since a 2022 SPAC merger, founded in 2012 as ePantry, headquartered in San Francisco with an office in Portland, Maine, and sold in stores through Target (from 2021) and later Kohl's, Meijer and Giant Eagle. Whether it hosts independent third-party sellers, and whether it sells through Amazon, was not shown by any fetched source, so both are `unknown`. Lists recommend it for lower-cost, natural cleaning and personal care with flexible subscriptions (The Good Trade, GOBankingRates), and cite B Corp status, carbon-neutral shipping and a plastic-free pledge (Good Good Good, Going Zero Waste, V Style Blog, AmazonAlts). The "CarbonNeutral" shipping claim is from another certifier than The Climate Label and is not a scored kind.

Second pass (2026-09-25): the FTC cases and proceedings search for "Grove Collaborative" returned 6 loosely matched results (Hargrove & Associates, Hikma/Custopharm, viagogo and Grover Street, Grover Stewart); none names Grove Collaborative. The CourtListener agency-docket query since 2016 returned 0 dockets. ProPublica's search returned 13 article links (Terrorgram, Utah solar, public-lands grazing and others); none is about an action against Grove, so none was opened. No matching cases; no concern added.

News pass (2026-09-25): two web searches, `"Grove Collaborative" lawsuit OR settlement OR fine OR violation` and `"Grove Collaborative" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`, plus one follow-up, `Grove Collaborative automatic renewal district attorney settlement judgment`. Found: (1) a Proposition 65 settlement filed with the California Attorney General between APS&EE, LLC, a private organization, and Grove Collaborative, Inc. over lead in 8 Greens supplements and lollipops (60-day notices served 2025-06-26 and 2025-07-23); the agreement states "Grove denies all allegations" and is "a compromise of claims that are expressly contested and denied". At the time a private party's out-of-court settlement was not counted, so it was noted only; the operator-rule pass below makes it a concern. (2) Search snippets of Grove's SEC 10-K filings (sec.gov, not fetched) say the Santa Clara County District Attorney's consumer protection division, with other county and city prosecutors, is investigating Grove's automatic renewal practices, and that no legal proceeding had commenced; the follow-up search found no settlement or judgment. An open investigation is not a finding, so it is noted, not recorded. (3) A 2020 website-accessibility suit by an individual (D. Mass.), a private suit. The second search found only agency pages and EPA's 2020 and 2021 Safer Choice Partner of the Year awards to Grove. The file names no parent company, so no third search applied. No concern added.

Operator-rule pass (2026-09-25): the California AG's 60-day notice search (Alleged Violator field, "Grove Collaborative") returned 4 notices naming Grove Collaborative, Inc.; the one with a recorded settlement (2025-02024) was opened. Its settlement record (APS&EE, LLC v. Grove Collaborative, Inc., out of court, $3,000 civil penalty) is dated 2026-02-12, not 2025 as the news pass read from the notice dates. Under the operator's 2026-09-25 rule (Prop 65 settlements and judgments recorded on oag.ca.gov count as environmental concerns, private enforcers included), it is now a row. The other notices (2025-02590, 2025-03633, 2026-01615) show no settlement or judgment. Environment falls to 0.25; total 1.0 with a concern in the last 5 years, tier `recommended` to `acceptable`.

## Rating
- Ethics: 0.5 baseline, +0.25 `b_corp`. The B Corp directory returned HTTP 403 to this run's fetch of this page, so the row in `data/certifications.json` counts (`verified_this_run: false`, "Certified Since June 2014", checked there 2026-09-23). No accepted labor or governance concern. = 0.75
- Environment: 0.5 baseline. The Climate Label: explore.changeclimate.org/brand/grove-collaborative and /brand/grove return "Brand Not Found", and Grove is not in the directory's brand list; not counted. −0.25 × 1 accepted environmental concern (Prop 65 settlement on oag.ca.gov, 2026-02-12). = 0.25
- Total 1.0, with an accepted concern in the last 5 years, not Amazon-owned: tier `acceptable` (was `recommended` before the 2026-09-25 operator-rule pass).
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
- https://oag.ca.gov/system/files/prop65/settlements/2025-02024S7130.pdf (Prop 65 private settlement, APS&EE and Grove, dated 2026-02-12; a concern since the 2026-09-25 operator rule)
- https://oag.ca.gov/prop65/60-day-notice-search-results?field_prop65_defendant_value=%22Grove%20Collaborative%22&items_per_page=100 (4 notices)
- https://oag.ca.gov/prop65/60-Day-Notice-2025-02024
