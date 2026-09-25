---
name: Misfits Market
domain: misfitsmarket.com
type: grocer
goods: [produce, groceries]
ownership: private
parent: none
hq: Philadelphia, PA
marketplace: unknown
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns: []
ethics: 0.5
environment: 0.5
tier: acceptable
mentions: 4
mentioned_by: [adayinourshoes-com, amazonalts-org, goingzerowaste-com, goodgoodgood-co]
checked: 2026-09-25
---

Misfits Market is a subscription online grocery delivery service founded in 2018 by Abhi Ramesh and based in Philadelphia (Wikipedia). It started with "produce which does not meet size or aesthetic standards of retail grocery stores"; Wikipedia says that by 2026 only 10% of revenue came from such produce. It announced the acquisition of Imperfect Foods in 2022 and bought The Rounds, a reusable-packaging delivery startup, in 2025. Wikipedia describes it as privately held and venture-backed. No fetched source says whether it hosts third-party sellers, so `marketplace` is `unknown`. Its about page (misfitsmarket.com/about) returned HTTP 404.

The list sites name it for cutting food waste and price: "rescued" produce, "certified organic and non-GMO" (goingzerowaste-com), "rescues" food and is "up to 40%" cheaper than grocers (goodgoodgood-co), "saved more than 139 million pounds of food" (amazonalts-org), and online grocery alongside Thrive Market (adayinourshoes-com). These are the list sites' claims, not verified here. No list site claims one of the five scored certifications.

Concern search was limited: the session's WebSearch budget ran out before this retailer, and the regulator site searches were inconclusive (see `raw/blocked-retailers-R3.md`). A CourtListener API search for "Misfits Market" or "Imperfect Foods" (filed since 2021-09-25) listed several private suits, including two open labor cases: Gonzalez v. Imperfect Foods, Inc. d/b/a Misfits Market (D. Md., filed 2026-08-14, nature of suit "710 Labor: Fair Standards", cause Fair Labor Standards Act; docket /docket/74653916/) and Brown, Jr. v. Imperfect Foods Inc. (N.D. Cal., filed 2025-12-04, "Labor: Other", ordered remanded; docket /docket/71997104/), plus closed employment and civil-rights suits. These are complaints only: no fetched page states what was alleged or any finding or settlement, and the docket pages were not fetched, so none is recorded as a concern. The operator can check the two labor dockets (listed in the blocked file).

## Rating
- Blocklist: `node research/build-index.mjs --blocklist "Misfits Market" misfitsmarket.com` returned "not on the blocklist".
- Certifications: none claimed or found; none counted.
- Ethics: 0.5 baseline, no counted certifications or accepted concerns recorded (search limited; open labor complaints noted above, not scored).
- Environment: 0.5 baseline, no counted certifications or accepted concerns found (search limited).
- Tier: ethics + environment = 1.0, so `acceptable`.

## Sources
- https://en.wikipedia.org/wiki/Misfits_Market
- https://www.misfitsmarket.com/about (HTTP 404)
- https://www.courtlistener.com/api/rest/v4/search/?q=%22Misfits+Market%22+OR+%22Imperfect+Foods%22&type=r&filed_after=2021-09-25
- https://www.courtlistener.com/api/rest/v4/search/?q=%22BLK+%2B+GRN%22+OR+%22BLK+%26+GRN%22+OR+%22BLK+GRN%22+OR+%22Misfits+Market%22&type=r
- research/sites/adayinourshoes-com.md, amazonalts-org.md, goingzerowaste-com.md, goodgoodgood-co.md (reasons)
- data/blocklist.md (checked: no match)
