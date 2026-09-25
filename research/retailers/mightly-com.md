---
name: Mightly
domain: mightly.com
type: brand
goods: [clothing, kids clothing, bedding]
ownership: unknown
parent: unknown
hq: Oakland, CA
marketplace: false
sells_on_amazon: unknown
amazon_owned: false
certifications:
  - {kind: fair_trade, source: https://www.fairtradecertified.org/our-community/shop-fair-trade/, checked: 2026-09-25, verified_this_run: true}
concerns: []
ethics: 0.75
environment: 0.5
tier: recommended
mentions: 2
mentioned_by: [fairtradecertified-org, goodgoodgood-co]
checked: 2026-09-25
---

Mightly sells kids' clothing, which its about page calls "Organic, Fair Trade Certified kids' clothing for newborns through size 14" in "100% GOTS-certified organic cotton". Its site is run by Mightly, Inc. (terms of service), with a mailing address in Oakland, CA (privacy policy); its about page says it was founded in Oakland in 2019. The about page says "Mightly, Inc. is home to three brands with one shared purpose": Mightly, Of an Origin ("certified organic bedding for the whole family and tops thoughtfully designed for nursing moms") and Rockets of Awesome ("Now part of the Mightly, Inc. family"). No fetched source says who owns Mightly, Inc., so ownership and parent are `unknown` (Mightly, Inc. owns the three brands on the site, but no source shows whether anyone owns Mightly, Inc.). It sells only its own brands (`marketplace: false`); the "Amazon" on its pages is a payment icon (Amazon Pay), not a storefront, and no fetched source says whether it sells through Amazon.

Lists recommend it for fair trade organic clothing: Fair Trade USA's shop page shows it as a brand tile (apparel, clothing), and Goodgoodgood lists both Mightly ("Certified Fair Trade brand", organic cotton) and Of an Origin (Mightly's maternity line), which is why this file covers both names.

Fair trade. Fair Trade USA's "Shop Fair Trade" page, fetched this run, shows a Mightly brand tile under the apparel and clothing filters, linking to mightly.com/pages/sustainability#fair-trade. The page presents its tiles as "brands that offer Fair Trade Certified products", so this shows a brand that sells certified products; Mightly's own sustainability page says of factory partners, "Fair Trade Certified: Our first filter". The project's `fair_trade` kind means "Sells Fair Trade Certified products" (docs/ranking.md), and the curated rows in data/certifications.json use this same brand listing, so `fair_trade` counts (lead decision; the verifier had removed it, see raw/verify-R8.md).

Concerns. None recorded. The NLRB case search for "mightly" returned no cases, OSHA's establishment search returned no results, and CourtListener returned no dockets with "mightly" in the case name. Good Jobs First's Violation Tracker blocked agents this run, and no general news search was possible (session search limit used up).

Second pass (2026-09-25): the FTC cases and proceedings search for "Mightly" showed "No results found for these filters." The CourtListener agency-docket query since 2016 returned 0 dockets. ProPublica's search returned 39 article links, apparently loose matches on the word (school discipline, national parks, EPA lead cleanup and others); none is about Mightly, so none was opened. No matching cases; no concern added.

## Rating
- Certifications: `fair_trade` counted: Fair Trade USA's shop page lists Mightly among "brands that offer Fair Trade Certified products", which is what the project's `fair_trade` kind means ("Sells Fair Trade Certified products", docs/ranking.md). B Corp directory returned 403 and `data/certifications.json` has no row for mightly.com; not found in the US Federation of Worker Cooperatives directory or the brand list on The Climate Label's directory; not found by the 1% for the Planet directory search (the data service behind directories.onepercentfortheplanet.org; control search "patagonia" found Patagonia).
- Ethics: 0.5 baseline + 0.25 (fair_trade), no accepted concern = 0.75.
- Environment: 0.5 baseline, no environmental certification, no environmental concern = 0.5.
- Tier: not Amazon-owned (blocklist lookup: not on the blocklist); ethics + environment = 1.25 and no accepted concern, so `recommended`.
- Concern search partial: pass 2 checked FTC cases, CourtListener agency dockets since 2016 and ProPublica; no general news search, and DOJ, SEC and Violation Tracker were unreachable; tier is provisional.

## Sources
- https://www.mightly.com/pages/about
- https://www.mightly.com/pages/about-us
- https://www.mightly.com/pages/contact
- https://www.mightly.com/pages/sustainability
- https://www.mightly.com/policies/terms-of-service
- https://www.mightly.com/policies/privacy-policy
- https://www.fairtradecertified.org/our-community/shop-fair-trade/ (Mightly brand tile under "brands that offer Fair Trade Certified products")
- https://www.nlrb.gov/search/case/mightly (no cases)
- https://www.osha.gov/ords/imis/establishment.search?establishment=mightly&state=all&officetype=all&office=all&startmonth=01&startday=01&startyear=2016&endmonth=09&endday=25&endyear=2026&p_case=all&p_violations_exist=all (no results)
- https://www.courtlistener.com/api/rest/v4/search/?q=caseName%3A%28%22mightly%22%29&type=r (no dockets)
- https://info.usworker.coop/iframe/directory/worker-co-op-dem-workplaces (not listed)
- https://explore.changeclimate.org/ (not listed)
- https://dueekpzk7aquu.cloudfront.net/search?q=mightly (data service behind directories.onepercentfortheplanet.org; no match; control "patagonia" found)
- data/blocklist.md (no match)
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Mightly (no results)
- https://www.courtlistener.com/api/rest/v4/search/?type=r&order_by=dateFiled+desc&filed_after=2016-01-01&q=caseName%3A(%22Mightly%22)%20AND%20caseName%3A(%22Equal%20Employment%22%20OR%20%22EEOC%22%20OR%20%22Secretary%20of%20Labor%22%20OR%20%22Department%20of%20Labor%22%20OR%20%22Federal%20Trade%20Commission%22%20OR%20%22United%20States%22%20OR%20%22State%20of%22%20OR%20%22People%20of%22%20OR%20%22Commonwealth%22%20OR%20%22National%20Labor%20Relations%22%20OR%20%22Environmental%20Protection%22%20OR%20%22Consumer%20Product%20Safety%22%20OR%20%22Securities%20and%20Exchange%22%20OR%20%22Attorney%20General%22%20OR%20%22District%20of%20Columbia%22) (0 dockets)
- https://www.propublica.org/search?qss=%22Mightly%22 (39 articles, none about Mightly)
