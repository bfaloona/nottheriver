---
name: Depop
domain: depop.com
type: marketplace
goods: [clothing, accessories]
ownership: public
parent: eBay Inc.
hq: London, United Kingdom
marketplace: true
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns: []
ethics: 0.5
environment: 0.5
tier: acceptable
mentions: 2
mentioned_by: [adayinourshoes-com, goodgoodgood-co]
checked: 2026-09-25
---

Depop is a peer-to-peer marketplace where users list and sell mainly secondhand, vintage and designer clothing themselves. Wikipedia gives its headquarters as London, founding in 2011 in Roncade, Italy, and US offices in New York City and Los Angeles. Etsy bought it in 2021 (Wikipedia). eBay's 10-Q for the quarter ended 2026-06-30 says eBay agreed in February 2026 to buy "Depop Limited, a leading consumer-to-consumer ("C2C") fashion marketplace, for $1.2 billion in cash" and that "The transaction closed on July 30, 2026", so the parent is eBay; the 10-Q's cover lists eBay Inc. common stock on The Nasdaq Global Select Market (EBAY), so ownership is `public`. No fetched source says whether Depop sells through Amazon.

Lists recommend it for secondhand clothing: A Day in Our Shoes (secondhand clothing platform) and Goodgoodgood (resale, "100% of its electricity from renewable sources"). That electricity claim was not checked: depop.com returned 403 this run, and none of the certifier directories checked lists Depop.

Concerns. None recorded. The NLRB case search returned no cases for "depop", and OSHA's establishment search returned no results. CourtListener lists federal dockets naming Depop, Inc. (an ADA suit filed 2019 in S.D.N.Y., a fraud suit filed 2026 in N.D. Cal., and two 2026 suits with no nature of suit given); no order, finding or settlement was fetched, so none is recorded. Good Jobs First's Violation Tracker blocked agents this run, and no general news search was possible (session search limit used up). Wikipedia describes 2020 reports of scams and of user data sold on the dark web, citing outlets that are not accepted sources; those articles were not fetched, so nothing is recorded from them.

## Rating
- Certifications: none verified. B Corp directory returned 403 and `data/certifications.json` has no row for depop.com; not found in the Fair Trade USA shop page, the US Federation of Worker Cooperatives directory, or the brand list on The Climate Label's directory; not found by the 1% for the Planet directory search (the data service behind directories.onepercentfortheplanet.org; control search "patagonia" found Patagonia).
- Ethics: 0.5 baseline, no certification, no accepted concern = 0.5.
- Environment: 0.5 baseline, no certification, no environmental concern = 0.5.
- Tier: not Amazon-owned (blocklist lookup: not on the blocklist); ethics + environment = 1.0, so `acceptable` (below 1.25 for `recommended`).
- Concern search incomplete this run (see raw/blocked-retailers-R8.md); tier is provisional.

## Sources
- https://en.wikipedia.org/wiki/Depop
- https://www.sec.gov/Archives/edgar/data/1065088/000106508826000177/ebay-20260630.htm (eBay 10-Q, Q2 2026: Depop acquisition; cover page Nasdaq listing)
- https://data.sec.gov/submissions/CIK0001065088.json (eBay filing list)
- https://www.nlrb.gov/search/case/depop (no cases)
- https://www.osha.gov/ords/imis/establishment.search?establishment=depop&state=all&officetype=all&office=all&startmonth=01&startday=01&startyear=2016&endmonth=09&endday=25&endyear=2026&p_case=all&p_violations_exist=all (no results)
- https://www.courtlistener.com/api/rest/v4/search/?q=caseName%3A%28depop%29&type=r (docket list only)
- https://www.fairtradecertified.org/our-community/shop-fair-trade/ (not listed)
- https://info.usworker.coop/iframe/directory/worker-co-op-dem-workplaces (not listed)
- https://explore.changeclimate.org/ (not listed)
- https://dueekpzk7aquu.cloudfront.net/search?q=depop (data service behind directories.onepercentfortheplanet.org; no match; control "patagonia" found)
- data/blocklist.md (no match)
