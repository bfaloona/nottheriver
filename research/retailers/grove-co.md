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

## Rating
- Ethics: 0.5 baseline, +0.25 `b_corp`. The B Corp directory returned HTTP 403 to this run's fetch of this page, so the row in `data/certifications.json` counts (`verified_this_run: false`, "Certified Since June 2014", checked there 2026-09-23). No accepted concern. = 0.75
- Environment: 0.5 baseline. The Climate Label: explore.changeclimate.org/brand/grove-collaborative and /brand/grove return "Brand Not Found", and Grove is not in the directory's list of 188 brands; not counted. No environmental concern. = 0.5
- Total 1.25, no accepted concern in the last 5 years, not Amazon-owned: tier `recommended`.
- Concerns: NLRB's case search returned no cases for "grove collaborative". The WebSearch budget was used up, so ftc.gov, osha.gov, dol.gov, sec.gov and news were not searched; the concern list may be incomplete.
- Blocklist: `node research/build-index.mjs --blocklist "Grove Collaborative" grove.co` returned "not on the blocklist".
- Concern search incomplete this run (see raw/blocked-retailers-R2.md); tier is provisional.

## Sources
- https://en.wikipedia.org/wiki/Grove_Collaborative
- https://www.bcorporation.net/en-us/find-a-b-corp/company/grove-collaborative/ (HTTP 403 this run; via data/certifications.json)
- https://explore.changeclimate.org/brand/grove-collaborative
- https://explore.changeclimate.org/brand/grove
- https://explore.changeclimate.org/ (brand list)
- https://www.nlrb.gov/search/case/grove%20collaborative
