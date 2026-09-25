---
name: Made Trade
domain: madetrade.com
type: retailer
goods: [home]
ownership: unknown
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
mentions: 2
mentioned_by: [amazonalts-org, goingzerowaste-com]
checked: 2026-09-25
---

Made Trade is an online store for homewares from makers it selects. Its own site could not be read this run: every request to madetrade.com, from the fetch tool and from plain curl, looped on a Cloudflare redirect back to the same URL (logged in `research/raw/blocked-retailers-R10.md`). No Wikipedia article or other fetched page describes the company, so ownership, parent, headquarters, marketplace status and Amazon sales are all `unknown`. A CourtListener search names the company "Made Trade Group, LLC" as a defendant. The `goods` value comes from how the two list sites describe it.

Lists name it for homeware that meets at least one of its values (fair trade, heritage, made in USA, POC-owned, women-owned, sustainable, vegan) and for giving 1% to environmental causes (AmazonAlts), and for vetting sourcing so the "maker paid a living wage" (Going Zero Waste). The 1% claim was not verified: the 1% for the Planet directory is closed to agents by its robots rules. B Lab's directory page for Made Trade returned HTTP 403, and `data/certifications.json` has no row for madetrade.com. Made Trade is not among the brands on Fair Trade USA's shop page. No certification is counted.

Concern checks: an NLRB case search for "made trade" returned no results. CourtListener shows one docket, an individual's suit against Made Trade Group, LLC (S.D.N.Y., filed 2024-12-31), a disability-access suit; it is an allegation that does not fit the labor, governance or environmental kinds and is not recorded as a concern.

Second pass (2026-09-25): the FTC cases-and-proceedings search for the phrase "Made Trade" returned "No results found for these filters." (the phrase "Seven & i Holdings" returned 5, so phrase search works); the CourtListener agency-docket search (Made Trade paired with a government party, filed since 2016) returned 0 dockets; ProPublica search returned 47 article links, none about the company by slug (they match "trade" and "made"). No concern added.

News pass (2026-09-25): two web searches, `"Made Trade" (madetrade OR "Made Trade Group") lawsuit OR settlement OR fine OR violation` and `"Made Trade" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general") ethical home goods`. Hits were other companies' FTC "Made in USA" cases (matching the words "made" and "trade") and agency landing pages. The FTC's April 2026 "Made in USA" sweep release was fetched because Made Trade sells a "made in USA" category: it names TouchTunes, Americana Liberty, Three Nations, Oak Street Manufacturing and two closing-letter recipients, not Made Trade. Nothing reports an agency or court action against Made Trade. No parent is named, so no third search. No concerns added.

## Rating
- Blocklist: `node research/build-index.mjs --blocklist "Made Trade" madetrade.com` says not on the blocklist, so `amazon_owned: false`.
- Certifications: none verified (B Corp page blocked, 1% for the Planet directory not readable, Climate Label not checked, not on Fair Trade USA's shop page).
- Ethics: 0.5 start, no certifications, no concerns = 0.5.
- Environment: 0.5 start, no certifications, no concerns = 0.5.
- Tier: ethics + environment = 1.0, so `acceptable`.
- Concern search: passes 1 to 3 (agency pages, FTC, CourtListener, ProPublica, general news search).

## Sources
- https://www.fairtradecertified.org/our-community/shop-fair-trade/
- https://www.nlrb.gov/search/case/made%20trade
- https://www.courtlistener.com/api/rest/v4/search/?q=%22Made+Trade%22&type=r&order_by=dateFiled+desc
- research/sites/amazonalts-org.md and research/sites/goingzerowaste-com.md (list sites' descriptions)
- data/blocklist.md (checked: no matching entry)
- data/certifications.json (checked: no row for madetrade.com)
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Made%20Trade%22 ("No results found for these filters.")
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Seven%20%26%20i%20Holdings%22 (phrase-search control: 5 results)
- CourtListener agency-docket search for "Made Trade", filed since 2016 (0 results; URL in research/raw/concern-fetch/madetrade-com.json)
- https://www.propublica.org/search?qss=%22Made%20Trade%22 (no article about the company)
- https://www.ftc.gov/news-events/news/press-releases/2026/04/ftc-announces-made-usa-sweep-including-three-law-enforcement-actions-protect-american-consumers (Made Trade not named)
