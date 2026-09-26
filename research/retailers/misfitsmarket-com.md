---
name: Misfits Market
domain: misfitsmarket.com
type: grocer
goods: [produce, groceries]
ownership: unknown
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
mentioned_by: [adayinourshoes-com, amazonalts-org, goingzerowaste-com, goodgoodgood-co]
checked: 2026-09-25
---

Misfits Market is a subscription online grocery delivery service founded in 2018 by Abhi Ramesh in Philadelphia (Wikipedia). It started with "produce which does not meet size or aesthetic standards of retail grocery stores"; Wikipedia says that by 2026 only 10% of revenue came from such produce. It announced the acquisition of Imperfect Foods in 2022 and bought The Rounds, a reusable-packaging delivery startup, in 2025. The article does not state its ownership structure or current headquarters, so `ownership` and `hq` are `unknown`. No fetched source says whether it hosts third-party sellers, so `marketplace` is `unknown`. Its about page (misfitsmarket.com/about) returned HTTP 404.

The list sites name it for cutting food waste and price: "rescued" produce, "certified organic and non-GMO" (goingzerowaste-com), "rescues" food and is "up to 40%" cheaper than grocers (goodgoodgood-co), "saved more than 139 million pounds of food" (amazonalts-org), and online grocery alongside Thrive Market (adayinourshoes-com). These are the list sites' claims, not verified here. No list site claims one of the five scored certifications.

Concern search was limited: the session's WebSearch budget ran out before this retailer, and the regulator site searches were inconclusive (see `raw/blocked-retailers-R3.md`). A CourtListener API search for "Misfits Market" or "Imperfect Foods" (filed since 2021-09-25) listed several private suits, including three open labor cases: an FLSA suit against Imperfect Foods, Inc. d/b/a Misfits Market (D. Md., filed 2026-08-14, nature of suit "710 Labor: Fair Standards", cause Fair Labor Standards Act; docket /docket/74653916/) and two suits by one plaintiff against Imperfect Foods Inc. (N.D. Cal., filed 2025-12-04 and 2026-04-13, "Labor: Other"; dockets /docket/71997104/ and /docket/73184987/), plus closed employment and civil-rights suits. These are complaints only: no fetched page states what was alleged or any finding or settlement, and the docket pages were not fetched, so none is recorded as a concern. The operator can check the two labor dockets (listed in the blocked file).

Second pass (2026-09-25): the FTC cases-and-proceedings search returned "No results found for these filters." for the phrases "Misfits Market" and "Imperfect Foods" (the company it acquired, and the name on its FLSA docket; the phrase "Seven & i Holdings" returned 5, so phrase search works); the CourtListener agency-docket search (company paired with a government party, filed since 2016) returned 0 dockets for "Misfits Market" and, in an extra run, 0 for "Imperfect Foods"; ProPublica search returned 2 article links (Oath Keepers; a civil rights law), neither about the company. The private labor suits noted above stay unscored. No concern added.

News pass (2026-09-25): two web searches, each covering both names, `("Misfits Market" OR "Imperfect Foods") lawsuit OR settlement OR fine OR violation` and `("Misfits Market" OR "Imperfect Foods") (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`. Hits were acquisition coverage, Consumer Reports, an Oregon WARN notice (Clackamas fulfillment center closing at the end of 2024, per the search snippet; not fetched), the Maryland FLSA docket already noted above, and two NLRB case pages, both fetched. Case 20-CA-346490 ("Misfits Market d/b/a Imperfect Foods", filed 07/17/2024) is a union's charge (UFCW Local 5) alleging "8(a)(5) Refusal to Bargain/Bad Faith Bargaining"; its docket ends with a "Letter Approving Withdrawal Request" (10/29/2024) and status "Closed", so it is a charge by others that was withdrawn and is not recorded. Case 19-RD-336776 (Imperfect Foods, Inc., Clackamas, OR, filed 02/28/2024) is an employee's decertification petition, a representation election (tally: 15 votes against the union, 5 for) with no action against the company, so it is not a concern either. No parent is named (`parent: none`), so no third search. No concerns added.

Operator-rule pass (2026-09-25): searched the California AG's Proposition 65 60-day notice database (Alleged Violator field) for `"Misfits Market"`, `"Imperfect Foods"`: no notices, so no settlement or judgment and no concern added.

## Rating
- Blocklist: `node research/build-index.mjs --blocklist "Misfits Market" misfitsmarket.com` returned "not on the blocklist".
- Certifications: none claimed or found; none counted.
- Ethics: 0.5 baseline, no counted certifications or accepted concerns recorded (search limited; open labor complaints noted above, not scored).
- Environment: 0.5 baseline, no counted certifications or accepted concerns found (search limited).
- Tier: ethics + environment = 1.0, so `acceptable`.
- Concern search: passes 1 to 3 (agency pages, FTC, CourtListener, ProPublica, general news search).

## Sources
- https://en.wikipedia.org/wiki/Misfits_Market
- https://www.misfitsmarket.com/about (HTTP 404)
- https://www.courtlistener.com/api/rest/v4/search/?q=%22Misfits+Market%22+OR+%22Imperfect+Foods%22&type=r&filed_after=2021-09-25
- https://www.courtlistener.com/api/rest/v4/search/?q=%22BLK+%2B+GRN%22+OR+%22BLK+%26+GRN%22+OR+%22BLK+GRN%22+OR+%22Misfits+Market%22&type=r
- research/sites/adayinourshoes-com.md, amazonalts-org.md, goingzerowaste-com.md, goodgoodgood-co.md (reasons)
- data/blocklist.md (checked: no match)
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Misfits%20Market%22 ("No results found for these filters.")
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Imperfect%20Foods%22 ("No results found for these filters.")
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Seven%20%26%20i%20Holdings%22 (phrase-search control: 5 results)
- CourtListener agency-docket search for "Misfits Market", filed since 2016 (0 results; URL in research/raw/concern-fetch/misfitsmarket-com.json)
- https://www.courtlistener.com/api/rest/v4/search/?type=r&order_by=dateFiled+desc&filed_after=2016-01-01&q=caseName:("Imperfect Foods") AND caseName:(government party list as in the pass-2 fetch) (count 0)
- https://www.propublica.org/search?qss=%22Misfits%20Market%22 (2 unrelated articles)
- https://www.nlrb.gov/case/20-CA-346490 (union charge, withdrawal approved 10/29/2024, closed)
- https://www.nlrb.gov/case/19-RD-336776 (decertification petition, election held, closed)
- https://oag.ca.gov/prop65/60-day-notice-search-results?field_prop65_defendant_value=%22Misfits+Market%22&items_per_page=100 (no matching settlement)
- https://oag.ca.gov/prop65/60-day-notice-search-results?field_prop65_defendant_value=%22Imperfect+Foods%22&items_per_page=100 (no matching settlement)
