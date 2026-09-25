---
name: Package Free
domain: packagefreeshop.com
type: retailer
goods: [home, cleaning, personal-care, kitchen, baby]
ownership: private
parent: none
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

Package Free sells low-waste household, cleaning, personal-care and baby goods, including its own lines (its about page names a plastic-free laundry pod) and, per its history page, other sustainable brands. Its history page says it opened on April 22, 2017 as "a 3-month popup shop at 137 Grand Street in Williamsburg, Brooklyn", was "initially funded by the brands that we sold", and "in 2019, we took on venture partners". Founder Lauren Singer (the "Trash is for Tossers" blog) is named on the about page and in Wikipedia. Ownership is recorded as `private` because the only source says venture partners, not a sale or a listing; no current headquarters address was found on a fetched page, so `hq` is unknown. The pages don't say whether outside sellers list their own goods, so `marketplace` is unknown.

Lists recommend it for plastic-free replacements for single-use items and plastic-free shipping materials (amazonalts-org, goodgoodgood-co, thegoodtrade-com, vstyleblog-com). The Good Trade calls it woman-owned; that is the list's claim, not checked here.

Certifications: none found. B Corp directory returned HTTP 403 (logged); 1% for the Planet profile pages render only in a browser (logged); The Climate Label has no brand page at explore.changeclimate.org/brand/package-free (404); Fair Trade USA's shop page does not list it. No row for packagefreeshop.com in data/certifications.json.

Concerns: none recorded. CourtListener shows two federal dockets naming Package Free, Inc.: *Blachowicz v. Package Free, Inc.* (W.D.N.Y., filed 2021-01-23, terminated 2021-07-12, an Americans with Disabilities Act civil-rights case) and a 2022 contract case where it is not the lead party. Neither docket entry shows a finding, and neither fits the labor, governance or environmental kinds, so neither is recorded as a concern. The session's web-search budget ran out before site-restricted searches of the other accepted sources, so this check is narrower than the brief asks (logged).

## Rating
- ethics: start 0.5; no verified ethics certification; no accepted labor or governance concern; = 0.5
- environment: start 0.5; no verified environment certification; no accepted environmental concern; = 0.5
- tier: not on the blocklist (`node research/build-index.mjs --blocklist "Package Free" packagefreeshop.com` says "not on the blocklist"); ethics + environment = 1.0, which meets the 1.0 bar for `acceptable` but not 1.25 for `recommended`.

## Sources
- https://packagefreeshop.com/pages/about
- https://packagefreeshop.com/pages/our-history
- https://en.wikipedia.org/wiki/Lauren_Singer
- https://www.fairtradecertified.org/shop-fair-trade/
- https://explore.changeclimate.org/brand/package-free (404)
- https://www.courtlistener.com/api/rest/v4/search/?q=%22Package%20Free%2C%20Inc.%22&type=r&format=json
- data/blocklist.md (no match)
