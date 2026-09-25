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

## Rating
- Ethics: 0.5 baseline. No verified certification (B Corp directory returned 403 on a search for Kobo; no row in data/certifications.json). No accepted concern. = 0.5
- Environment: 0.5 baseline. The shipping-offset claim comes from a list site, not a certifier. Not on The Climate Label directory page (explore.changeclimate.org). 1% for the Planet directory could not be searched (logged). = 0.5
- Total 1.0, not Amazon-owned: tier `acceptable`.
- Concern search partial: pass 2 checked FTC cases, CourtListener agency dockets since 2016 and ProPublica; no general news search, and DOJ, SEC and Violation Tracker were unreachable; tier is provisional.
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
