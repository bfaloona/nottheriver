---
name: Thrive Market
domain: thrivemarket.com
type: grocer
goods: [groceries, snacks, supplements, personal care, cleaning products, baby products, pet care]
ownership: public-benefit-corporation
parent: none
hq: Los Angeles, CA
marketplace: unknown
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns:
  - {kind: labor, title: "Inspection Detail: Thrive Market, Inc. (Activity 1724624.015)", source: "https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1724624.015", date: 2024-03-25, accepted_source: true}
  - {kind: labor, title: "Inspection Detail: Thrive Market, Inc. (Activity 1724652.015)", source: "https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1724652.015", date: 2024-03-25, accepted_source: true}
ethics: 0
environment: 0.5
tier: caution
mentions: 10
mentioned_by: [adayinourshoes-com, amazonalts-org, fairtradecertified-org, gobankingrates-com, goingzerowaste-com, goodgoodgood-co, ilsr-org, sustainablejungle-com, thegoodtrade-com, vstyleblog-com]
checked: 2026-09-25
---

Thrive Market is a membership online grocer selling organic and natural food, supplements, personal care, cleaning, baby and pet products; its site says it has "1.7 Million Members" and a mission "to make healthy and sustainable living easy and affordable for everyone." Wikipedia says it was founded in November 2014, is based in Los Angeles, was backed by venture investors (Greycroft Partners, E-Ventures, Invus and others) and "converted from a C-corporation to a Delaware Public Benefit Corporation" in 2023. Lists recommend it as an organic-grocery alternative (one names it as the alternative to Amazon-owned Whole Foods) and repeat its carbon-neutral shipping and B Corp claims.

Certifications not counted: the Thrive Market site shows a B Corp badge and Wikipedia says it became a B Corp in October 2020, but bcorporation.net returned HTTP 403 and data/certifications.json has no Thrive Market row. The Climate Label's profile says "Thrive Market's certification has expired", so `climate_neutral` does not count either.

Concerns: OSHA's establishment search lists four inspections from 2016 to 2026. Two planned inspections opened 01/31/2024 at the same site (700 Milan Dr., Nevada, Reno office) each ended in a citation issued 03/25/2024: activity 1724624.015 cited one Serious violation (initial penalty $6,612, current $3,306) and one Other violation ($0); activity 1724652.015 cited one Serious violation (initial $6,222, current $3,111). Both cases are "CLOSED". They are recorded as two rows because they are two OSHA records, though they come from the same visit. The Indiana (2026) and Pennsylvania (2025) inspections list no violations and are not concerns. NLRB case search for "Thrive Market" returned no cases. No general news search was possible (the session's web search budget was used up).

## Rating
- Ethics: 0.5 baseline. B Corp not verified (certifier page blocked, no fallback row). Minus 0.25 for each of two accepted labor concerns (osha.gov, 2024-03-25). 0.5 - 0.5 = 0
- Environment: 0.5 baseline. Climate Label certification expired; no other verified certification; no environmental concern. = 0.5
- Total 0.5, with accepted concerns inside the last 5 years: tier `caution`.
- 1% for the Planet: directory is script-rendered and returned no content; inconclusive, not counted.
- Blocklist: `node research/build-index.mjs --blocklist "Thrive Market" thrivemarket.com` returned "not on the blocklist".

## Sources
- https://thrivemarket.com/about
- https://en.wikipedia.org/wiki/Thrive_Market
- https://explore.changeclimate.org/brand/thrive-market
- https://www.climateneutral.org/brands (301 to https://www.changeclimate.org/brands, which redirects to https://explore.changeclimate.org/, The Climate Label's certified brand directory)
- https://www.osha.gov/ords/imis/establishment.search?p_logger=1&establishment=Thrive+Market&State=all&officetype=all&Office=all&startmonth=01&startday=01&startyear=2016&endmonth=09&endday=25&endyear=2026&p_case=all&p_violations_exist=all
- https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1724624.015
- https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1724652.015
- https://www.nlrb.gov/search/case/Thrive%20Market
- https://www.bcorporation.net/en-us/find-a-b-corp/company/thrive-market/ (HTTP 403)
