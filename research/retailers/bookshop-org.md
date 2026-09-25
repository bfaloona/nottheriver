---
name: Bookshop.org
domain: bookshop.org
type: retailer
goods: [books, ebooks, audiobooks]
ownership: private
parent: none
hq: unknown
marketplace: unknown
sells_on_amazon: unknown
amazon_owned: false
certifications:
  - {kind: climate_neutral, source: https://explore.changeclimate.org/brand/bookshop, checked: 2026-09-25, verified_this_run: true}
concerns: []
ethics: 0.5
environment: 0.75
tier: recommended
mentions: 10
mentioned_by: [amazonalts-org, antifamarketer-org, goingzerowaste-com, goodgoodgood-co, ilsr-org, indiebound-org, sustainablejungle-com, techradar-com, thegoodtrade-com, vstyleblog-com]
checked: 2026-09-25
---

Bookshop.org is an online bookstore founded by Andy Hunter in January 2020; Wikipedia describes Bookshop, Inc. as a privately held company, certified as a B Corporation. It sells printed books, ebooks (since January 2025) and, in the UK, audiobooks. It works on an affiliate model: it "returns 30% off the cover price to the bookseller" whose storefront made the sale, and "10% of sales go into a pool to be split up among independent booksellers" (Wikipedia). In 2023 it replaced IndieBound as the American Booksellers Association's official online sales platform. Lists recommend it as the way to buy books online while supporting independent bookstores.

The B Corp status is not counted: bcorporation.net returned HTTP 403, and data/certifications.json has no Bookshop.org row. Wikipedia and The Climate Label's record (`isBCorpCertified: true`) both say it is a B Corp, but neither is B Lab's own directory. NLRB case search for "Bookshop" returned only unrelated independent stores (Savoy Bookshop, Bookshop Santa Cruz), not Bookshop.org. OSHA's establishment search for "Bookshop" (2016 to 2026) returned no results. No general news search was possible (the session's web search budget was used up), so the concern search covered NLRB and OSHA only.

## Rating
- Ethics: 0.5 baseline. B Corp not verified (certifier page blocked, no fallback row). No accepted concern. = 0.5
- Environment: 0.5 baseline + 0.25 The Climate Label (`climate_neutral`; profile says "certified Climate Neutral in 2020, 2021, 2022, 2023 and 2024", current certification year 2025). = 0.75
- 1% for the Planet: directory is script-rendered and returned no content; inconclusive, not counted.
- Total 1.25, no accepted concern in the last 5 years, not Amazon-owned: tier `recommended`.
- Blocklist: `node research/build-index.mjs --blocklist "Bookshop.org" bookshop.org` returned "not on the blocklist".

## Sources
- https://en.wikipedia.org/wiki/Bookshop.org
- https://explore.changeclimate.org/brand/bookshop
- https://www.climateneutral.org/brands (301 to https://www.changeclimate.org/brands, which redirects to https://explore.changeclimate.org/, The Climate Label's certified brand directory)
- https://www.nlrb.gov/search/case/Bookshop
- https://www.osha.gov/ords/imis/establishment.search?p_logger=1&establishment=Bookshop&State=all&officetype=all&Office=all&startmonth=01&startday=01&startyear=2016&endmonth=09&endday=25&endyear=2026&p_case=all&p_violations_exist=all (no results)
- https://www.bcorporation.net/en-us/find-a-b-corp/company/bookshop-org/ (HTTP 403)
- https://bookshop.org/info/about-us (HTTP 403)
- https://bookshop.org/info/faq (HTTP 403)
