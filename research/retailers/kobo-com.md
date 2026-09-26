---
name: Kobo
domain: kobo.com
type: retailer
goods: [ebooks, audiobooks, e-readers]
ownership: unknown
parent: Rakuten Group
hq: Toronto, ON, Canada
marketplace: unknown
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns: []
ethics: 0.5
environment: 0.5
tier: acceptable
mentions: 3
mentioned_by: [goodgoodgood-co, indiebound-org, sustainablejungle-com]
checked: 2026-09-25
---

Kobo (Rakuten Kobo) sells ebooks, audiobooks, a Kobo Plus subscription and its own e-readers. Wikipedia says it is headquartered in Toronto and has been a subsidiary of the Japanese technology conglomerate Rakuten Group since January 2012; it partners with Walmart for US ebook and audiobook sales (2018). Its Kobo Writing Life platform lets authors self-publish and sell through the store (Wikipedia); whether that counts as hosting third-party sellers is a judgment call, so `marketplace` is `unknown`. `ownership` is `unknown`: no fetched source says whether Rakuten Group is publicly traded. IndieBound recommends it because a reader who signs up through an independent bookstore's link sends "a percentage of the sale" to that store; Good Good Good says it offsets "100% of carbon emissions associated with shipping" (a list-site claim, not verified with a certifier); Sustainable Jungle names its DRM-free books and e-readers. Kobo's own about page and home page returned HTTP 403.

Not scored, but on record: NLRB case search for "Kobo" returned no cases. Good Jobs First Violation Tracker returned 403. FTC and DOJ search pages returned 404 or 403, and this session's web search budget ran out before a news search.

Second pass (2026-09-25): the FTC cases-and-proceedings search returned "No results found for these filters." for "Kobo" and for its parent "Rakuten" (the search for "Amazon" returned 26, so the search works). The CourtListener agency-docket search returned 2 entries for one case, "United States v. Kobo" (S.D. Cal., docket 3:22-po-01347, filed 2022-11-01); the search record lists parties "United States" and "Kobo" and entries "Citation Issued" and "Forfeiture of Collateral", a petty-offense citation docket (the "po" number) with no sign that the defendant is the company, so it is dropped as a name collision (the docket page itself returned HTTP 403). ProPublica returned one article, about Amazon's self-publishing arm (slug "the-hate-store-amazons-self-publishing-arm..."), not an action against Kobo. No concern added.

News pass (2026-09-25): three web searches, `"Rakuten Kobo" lawsuit OR settlement OR fine OR violation`, `"Rakuten Kobo" OR "Kobo Inc" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")` (no separate Rakuten Group search ran: the third search went to Canada's regulators, per the lead's instruction), and, for Canada's regulators, `Kobo "Competition Bureau" OR "Competition Tribunal" OR "Privacy Commissioner" Canada ebook`. Hits (from search-result summaries; the case pages were not fetched): private suits with Kobo as defendant (Pop Top Corp. v. Rakuten Kobo Inc., a patent case in which the Federal Circuit upheld an attorney-fee award to Kobo; Sinostar Global Ltd. v. Rakuten Kobo, Inc., E.D. Tex., dismissed with prejudice after a private settlement); a Japanese court ruling for Rakuten Group against a marketplace seller; and the Canadian ebooks matter, in which the Competition Bureau's consent agreements were with four publishers and Kobo was the party challenging them (its challenge was rejected by the Federal Court of Appeal), not the subject of an action. Canadian regulators are not accepted sources in any case. None is an agency or court action against Kobo, so nothing is recorded. No concerns added.

Operator-rule pass (2026-09-25): searched the California AG's Proposition 65 60-day notice database (Alleged Violator field) for `Kobo`, `Rakuten`: the retailer and its parent, Rakuten Group. "Kobo" returned no notices; "Rakuten" returned two with no settlement or judgment (2014-00668 naming Rakuten.com, tool grips; 2019-00683 naming Webgistix Corporation dba Rakuten Super Logistics, dietary supplements). Under the operator's rule that a parent's actions count, three web searches on Rakuten Group (`"Rakuten" (FTC OR "attorney general" OR "Department of Justice" OR SEC) settlement OR fine OR penalty`, `"Rakuten" lawsuit OR settlement OR fine OR violation regulator ordered`, and one on Japan's Fair Trade Commission and Financial Services Agency) found no agency or court action against Rakuten on an accepted source: FTC early-termination notices (merger clearances, not enforcement), private patent and consumer suits (IBM, Pop Top, browser-extension suits), a Japanese seller suit Rakuten won, Rakuten's own 2025 suit against Japan's Internal Affairs ministry, and Japan Fair Trade Commission matters that closed with a commitment plan (2019, 2021) or an injunction petition the commission withdrew (2020); jftc.go.jp is not an accepted source in any case. No concern added.

## Rating
- Ethics: 0.5 baseline. No verified certification (B Corp directory returned 403 on a search for Kobo; no row in data/certifications.json). No accepted concern. = 0.5
- Environment: 0.5 baseline. The shipping-offset claim comes from a list site, not a certifier. Not on The Climate Label directory page (explore.changeclimate.org). 1% for the Planet directory could not be searched (logged). = 0.5
- Total 1.0, not Amazon-owned: tier `acceptable`.
- Concern search: passes 1 to 3 (agency pages, FTC, CourtListener, ProPublica, general news search).
- Blocklist: `node research/build-index.mjs --blocklist "Kobo" kobo.com` returned "not on the blocklist".

## Sources
- https://en.wikipedia.org/wiki/Rakuten_Kobo
- https://www.nlrb.gov/search/case/Kobo
- https://explore.changeclimate.org/
- https://www.bcorporation.net/en-us/find-a-b-corp/search?query=kobo (HTTP 403; logged)
- https://www.kobo.com/us/en/p/about-us (HTTP 403; logged)
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Kobo ("No results found for these filters.")
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Rakuten ("No results found for these filters.")
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Amazon (control: 26 results)
- CourtListener agency-docket search for "Kobo", filed since 2016 (2 results, one case; URL in research/raw/concern-fetch/kobo-com.json)
- https://www.courtlistener.com/api/rest/v4/search/?type=r&q=caseName%3A(%22United%20States%20v.%20Kobo%22)&court=casd (docket 3:22-po-01347, parties "United States", "Kobo")
- https://www.courtlistener.com/docket/70666408/united-states-v-kobo/ (HTTP 403; logged)
- https://www.propublica.org/search?qss=%22Kobo%22 (one article, about Amazon)
- https://oag.ca.gov/prop65/60-day-notice-search-results?field_prop65_defendant_value=Kobo&items_per_page=100 (no matching settlement)
- https://oag.ca.gov/prop65/60-day-notice-search-results?field_prop65_defendant_value=Rakuten&items_per_page=100 (no matching settlement)
