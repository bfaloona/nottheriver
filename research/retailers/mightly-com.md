---
name: Mightly
domain: mightly.com
type: brand
goods: [clothing, kids clothing, bedding]
ownership: unknown
parent: none
hq: Oakland, CA
marketplace: false
sells_on_amazon: unknown
amazon_owned: false
certifications:
  - {kind: fair_trade, source: "https://www.fairtradecertified.org/our-community/shop-fair-trade/", checked: 2026-09-25, verified_this_run: true}
concerns: []
ethics: 0.75
environment: 0.5
tier: recommended
mentions: 2
mentioned_by: [fairtradecertified-org, goodgoodgood-co]
checked: 2026-09-25
---

Mightly sells kids' clothing, which its about page calls "Organic, Fair Trade Certified kids' clothing for newborns through size 14" in "100% GOTS-certified organic cotton". Its site is run by Mightly, Inc. (terms of service), with a mailing address at 4200 Park Blvd, Oakland, CA 94602 (privacy policy). The about page says "Mightly, Inc. is home to three brands with one shared purpose": Mightly, Of an Origin ("certified organic bedding for the whole family and tops thoughtfully designed for nursing moms") and Rockets of Awesome ("Now part of the Mightly, Inc. family"). No fetched source says who owns Mightly, Inc., so ownership is `unknown`; `parent: none` because Mightly, Inc. is itself the parent of the three brands on the site. It sells only its own brands (`marketplace: false`); the "Amazon" on its pages is a payment icon (Amazon Pay), not a storefront, and no fetched source says whether it sells through Amazon.

Lists recommend it for fair trade organic clothing: Fair Trade USA's shop page shows it as a brand tile (apparel, clothing), and Goodgoodgood lists both Mightly ("Certified Fair Trade brand", organic cotton) and Of an Origin (Mightly's maternity line), which is why this file covers both names.

Fair trade. Fair Trade USA's "Shop Fair Trade" page, fetched this run, shows a Mightly brand tile under the apparel and clothing filters, linking to mightly.com/pages/sustainability#fair-trade. The page presents its tiles as "brands that offer Fair Trade Certified products", so this is a brand that carries the label on its products, not a whole-company certification; Mightly's own sustainability page says it ranks production partners with "Fair Trade Certified" as "Our first filter".

Concerns. None recorded. The NLRB case search for "mightly" returned no cases, OSHA's establishment search returned no results, and CourtListener returned no dockets with "mightly" in the case name. Good Jobs First's Violation Tracker blocked agents this run, and no general news search was possible (session search limit used up).

## Rating
- Certifications: `fair_trade` verified on Fair Trade USA's own shop page this run (+0.25 ethics). B Corp directory returned 403 and `data/certifications.json` has no row for mightly.com; not found in the US Federation of Worker Cooperatives directory or the 188 brands on The Climate Label's directory; not found by the 1% for the Planet directory search (the data service behind directories.onepercentfortheplanet.org; control search "patagonia" found Patagonia).
- Ethics: 0.5 baseline + 0.25 (fair_trade) = 0.75; no accepted concern.
- Environment: 0.5 baseline, no environmental certification, no environmental concern = 0.5.
- Tier: not Amazon-owned (blocklist lookup: not on the blocklist); ethics + environment = 1.25 and no accepted concern in the last 5 years, so `recommended`.

## Sources
- https://www.mightly.com/pages/about
- https://www.mightly.com/pages/about-us
- https://www.mightly.com/pages/contact
- https://www.mightly.com/pages/sustainability
- https://www.mightly.com/policies/terms-of-service
- https://www.mightly.com/policies/privacy-policy
- https://www.fairtradecertified.org/our-community/shop-fair-trade/ (Mightly brand tile)
- https://www.nlrb.gov/search/case/mightly (no cases)
- https://www.osha.gov/ords/imis/establishment.search?establishment=mightly&state=all&officetype=all&office=all&startmonth=01&startday=01&startyear=2016&endmonth=09&endday=25&endyear=2026&p_case=all&p_violations_exist=all (no results)
- https://www.courtlistener.com/api/rest/v4/search/?q=caseName%3A%28%22mightly%22%29&type=r (no dockets)
- https://info.usworker.coop/iframe/directory/worker-co-op-dem-workplaces (not listed)
- https://explore.changeclimate.org/ (not listed)
- https://dueekpzk7aquu.cloudfront.net/search?q=mightly (data service behind directories.onepercentfortheplanet.org; no match; control "patagonia" found)
- data/blocklist.md (no match)
