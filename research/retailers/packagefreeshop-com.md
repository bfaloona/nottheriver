---
name: Package Free
domain: packagefreeshop.com
type: retailer
goods: [home, cleaning, personal-care, kitchen, baby]
ownership: private
parent: unknown
hq: unknown
marketplace: unknown
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns: []
ethics: 0.5
environment: 0.5
tier: acceptable
mentions: 4
mentioned_by: [amazonalts-org, goodgoodgood-co, thegoodtrade-com, vstyleblog-com]
checked: 2026-09-25
---

Package Free sells low-waste household, cleaning, personal-care and baby goods, including its own lines (its about page names a plastic-free laundry pod) and, per its history page, other sustainable brands. Its history page says it opened on April 22, 2017 as "a 3-month popup shop at 137 Grand Street in Williamsburg, Brooklyn", was "initially funded by the brands that we sold", and "in 2019, we took on venture partners". Founder Lauren Singer (the "Trash is for Tossers" blog) is named on the about page and in Wikipedia. Ownership is recorded as `private` because the only source says venture partners, not a sale or a listing; no fetched page names or rules out a parent, so `parent` is unknown; no current headquarters address was found on a fetched page, so `hq` is unknown. The pages don't say whether outside sellers list their own goods, so `marketplace` is unknown.

Lists recommend it for plastic-free replacements for single-use items and plastic-free shipping materials (amazonalts-org, goodgoodgood-co, thegoodtrade-com, vstyleblog-com). The Good Trade calls it woman-owned; that is the list's claim, not checked here.

Certifications: none found. B Corp directory returned HTTP 403 (logged); 1% for the Planet profile pages render only in a browser (logged); The Climate Label has no brand page at explore.changeclimate.org/brand/package-free (404); Fair Trade USA's shop page does not list it. No row for packagefreeshop.com in data/certifications.json.

Concerns: none recorded. An NLRB case search for "Package Free" returns no cases. CourtListener shows two federal dockets naming Package Free, Inc.: an individual's suit against Package Free, Inc. (W.D.N.Y., filed 2021-01-23, terminated 2021-07-12, an Americans with Disabilities Act civil-rights case) and a 2022 contract case where it is not the lead party. Neither docket entry shows a finding, and neither fits the labor, governance or environmental kinds, so neither is recorded as a concern. The session's web-search budget ran out before site-restricted searches of the other accepted sources, so this check is narrower than the brief asks (logged).

Second pass (2026-09-25): the FTC cases and proceedings search returned no results for "Package Free" (no parent named to try); the CourtListener agency-docket query since 2016 returned no dockets; none of the 47 ProPublica articles matching "Package Free" is about the company. No matching cases, so no concern rows were added.

## Rating
- ethics: start 0.5; no verified ethics certification; no accepted labor or governance concern; = 0.5
- environment: start 0.5; no verified environment certification; no accepted environmental concern; = 0.5
- tier: not on the blocklist (`node research/build-index.mjs --blocklist "Package Free" packagefreeshop.com` says "not on the blocklist"); ethics + environment = 1.0, which meets the 1.0 bar for `acceptable` but not 1.25 for `recommended`.
- Concern search partial: pass 2 checked FTC cases, CourtListener agency dockets since 2016 and ProPublica; no general news search, and DOJ, SEC and Violation Tracker were unreachable; tier is provisional.

## Sources
- https://packagefreeshop.com/pages/about
- https://packagefreeshop.com/pages/our-history
- https://en.wikipedia.org/wiki/Lauren_Singer
- https://www.fairtradecertified.org/shop-fair-trade/
- https://explore.changeclimate.org/brand/package-free (404)
- https://www.courtlistener.com/api/rest/v4/search/?q=%22Package%20Free%2C%20Inc.%22&type=r&format=json
- https://www.nlrb.gov/search/case/Package%20Free
- data/blocklist.md (no match)
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Package%20Free%22
- https://www.courtlistener.com/api/rest/v4/search/?type=r&order_by=dateFiled+desc&filed_after=2016-01-01&q=caseName%3A(%22Package%20Free%22)%20AND%20caseName%3A(%22Equal%20Employment%22%20OR%20%22EEOC%22%20OR%20%22Secretary%20of%20Labor%22%20OR%20%22Department%20of%20Labor%22%20OR%20%22Federal%20Trade%20Commission%22%20OR%20%22United%20States%22%20OR%20%22State%20of%22%20OR%20%22People%20of%22%20OR%20%22Commonwealth%22%20OR%20%22National%20Labor%20Relations%22%20OR%20%22Environmental%20Protection%22%20OR%20%22Consumer%20Product%20Safety%22%20OR%20%22Securities%20and%20Exchange%22%20OR%20%22Attorney%20General%22%20OR%20%22District%20of%20Columbia%22)
- https://www.propublica.org/search?qss=%22Package%20Free%22
