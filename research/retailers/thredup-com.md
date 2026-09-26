---
name: ThredUp
domain: thredup.com
type: secondhand
goods: [clothing, shoes, accessories]
ownership: public
parent: none
hq: Oakland, CA
marketplace: false
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns:
  - {kind: labor, title: "Inspection Detail | Occupational Safety and Health Administration", source: "https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1815510.015", date: 2025-05-07, accepted_source: true}
ethics: 0.25
environment: 0.5
tier: caution
mentions: 3
mentioned_by: [adayinourshoes-com, goingzerowaste-com, goodgoodgood-co]
checked: 2026-09-25
---

ThredUp is "an online resale platform specializing in the sale of second-hand clothing, footwear, and accessories" (Wikipedia), a public company on Nasdaq (TDUP) with principal offices at 969 Broadway, Oakland, California (FY2025 10-K). Per the 10-K, sellers mail items in with a "Clean Out" kit and ThredUp inspects, prices, photographs and lists them; items are sold on consignment, so sellers keep ownership until sale, but they do not list directly. For that reason `marketplace` is `false` here: ThredUp does not host independent third-party sellers. The same filing records that ThredUp divested 91.0% of Remix, its European business, on 2024-11-30. The filing's cover lists its Class A common stock on the Nasdaq (TDUP) and the Long-Term Stock Exchange; it is the top-level registrant, so `parent` is `none`. Neither Wikipedia nor the 10-K text searched this run says whether ThredUp sells through Amazon, so `sells_on_amazon` is `unknown`.

Lists recommend it as a large online secondhand clothing platform: A Day in Our Shoes (secondhand clothing platform), Going Zero Waste ("largest online thrift store", referral link) and Goodgoodgood (large secondhand platform, with emissions figures).

Concerns. OSHA's establishment search returned two complaint inspections, each with one "Other" (not serious) citation. Mechanicsburg, PA distribution center (inspection 1815510.015, opened 2025-04-03, closed 2025-08-05): citation issued 2025-05-07 under 29 CFR 1904.32(a)(3) (injury and illness recordkeeping), initial penalty $2,364, current penalty $1,773 (latest event "Informal Settlement"). It carries a penalty and the case is closed, and osha.gov is an accepted source, so it counts. Duluth, GA (inspection 1257615.015, opened 2017-08-23, closed 2018-01-16): citation issued 2017-10-26 under 29 CFR 1910.22(a)(1) (walking-working surfaces), initial and current penalty $0. Under the run's OSHA rule (a $0 citation is noted, not counted) it is not recorded as a concern. CourtListener lists federal dockets naming ThredUp (among them an employment discrimination suit by an individual against ThredUp Inc., E.D. Pa., filed 2022-12-07, and fraud, trademark, ADA and qui tam cases); no order, finding or settlement was fetched for any of them, so none is recorded as a concern. The NLRB case search returned no cases for "thredup". Good Jobs First's Violation Tracker returned 403 (blocked file). A general news search was not possible: the session's web search limit was used up.

## Rating
- Certifications: none verified. B Corp directory returned 403 and `data/certifications.json` has no row for thredup.com; not found in the Fair Trade USA shop page, the US Federation of Worker Cooperatives directory, or the brand list on The Climate Label's directory; not found by the 1% for the Planet directory search (the data service behind directories.onepercentfortheplanet.org; control search "patagonia" found Patagonia).
- Ethics: 0.5 baseline, −0.25 (OSHA inspection 1815510.015, labor, $1,773 penalty, closed) = 0.25. OSHA inspection 1257615.015 ($0 penalty) is noted in the body, not counted.
- Environment: 0.5 baseline, no certification, no environmental concern = 0.5.
- Tier: not Amazon-owned (blocklist lookup: not on the blocklist); ethics + environment = 0.75, below 1.0, so `caution`.
- Concern search incomplete this run (see raw/blocked-retailers-R8.md); tier is provisional.

## Sources
- DOL open data (robots-allowed): OSHA inspection 348155102 matches osha.gov 1815510.015 by establishment, issue date and penalty (research/raw/osha-dol/348155102.json)
- https://en.wikipedia.org/wiki/ThredUp
- https://www.sec.gov/Archives/edgar/data/1484778/000148477826000007/tdup-20251231.htm (FY2025 10-K: address, Nasdaq listing, consignment model, Remix divestiture; Item 3 text not reached by the fetch)
- https://www.osha.gov/ords/imis/establishment.search?establishment=thredup&state=all&officetype=all&office=all&startmonth=01&startday=01&startyear=2016&endmonth=09&endday=25&endyear=2026&p_case=all&p_violations_exist=all
- https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1815510.015
- https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1257615.015
- https://www.nlrb.gov/search/case/thredup (no cases; control search "starbucks" returned 2,559)
- https://www.courtlistener.com/api/rest/v4/search/?q=caseName%3A%28thredup%29&type=r (docket list only)
- https://www.fairtradecertified.org/our-community/shop-fair-trade/ (not listed)
- https://info.usworker.coop/iframe/directory/worker-co-op-dem-workplaces (not listed)
- https://explore.changeclimate.org/ (not listed)
- https://dueekpzk7aquu.cloudfront.net/search?q=thredup (data service behind directories.onepercentfortheplanet.org; no match; control "patagonia" found)
- data/blocklist.md (no match)
