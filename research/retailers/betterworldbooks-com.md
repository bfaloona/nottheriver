---
name: Better World Books
domain: betterworldbooks.com
type: secondhand
goods: [books]
ownership: nonprofit
parent: Better World Libraries
hq: Mishawaka, IN
marketplace: unknown
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns: []
ethics: 0.5
environment: 0.5
tier: acceptable
mentions: 3
mentioned_by: [amazonalts-org, antifamarketer-org, sustainablejungle-com]
checked: 2026-09-25
---

Better World Books is an online seller of used and new books, stocked from college book drives, library donations and community collection boxes. Wikipedia says it was founded in 2002 by University of Notre Dame students, is based in Mishawaka, Indiana, and was acquired on 2019-11-06 by Better World Libraries, "a mission-aligned, not-for-profit organization affiliated with the Internet Archive". Ownership is recorded as `nonprofit` because its owner is a not-for-profit; the operating company itself is described in the Wikipedia infobox as a private company. It is not on the Amazon blocklist.

Wikipedia also describes it as a certified B Corporation that donates books or a share of profit to literacy programs; that is not the certifier's own page, and bcorporation.net returned HTTP 403 this run with no data/certifications.json row for this domain, so the B Corp status is noted here but not scored. Whether it hosts third-party sellers or sells through Amazon was not shown by any page fetched this run (its own about page returned HTTP 403).

List sites recommend it for used books with a literacy mission: AmazonAlts lists it under books as "a better place to get books", Antifa Marketer as "Books that support literacy programs", and Sustainable Jungle for "affordable used books" and having "raised almost $10 million for local bookstores".

Concerns checked: NLRB case search for "better world books" returned no cases; OSHA's establishment search for "better world books" (2016 to 2026) returned no inspections; a CourtListener opinion search surfaced only Hachette Book Group v. Internet Archive, in which Better World Books is not a party. No general news search was possible (the run's web search budget was used up), so this check is narrower than intended.

## Rating
- Ethics: 0.5 baseline. No B Corp, Fair Trade or worker co-op certification verified on a certifier's page (B Corp directory blocked, no fallback row). No accepted concern. Ethics 0.5.
- Environment: 0.5 baseline. The Climate Label directory (explore.changeclimate.org) returned "Brand Not Found" for `better-world-books`; the 1% for the Planet directory profile page rendered no listing content, so membership is unverified. No environmental concern. Environment 0.5.
- Tier: 0.5 + 0.5 = 1.0 meets `acceptable` (≥ 1.0), not `recommended` (≥ 1.25). Tier `acceptable`.
- Concern search incomplete this run (see raw/blocked-retailers-R5.md); tier is provisional.

## Sources
- https://en.wikipedia.org/wiki/Better_World_Books
- https://www.betterworldbooks.com/about-us (HTTP 403, logged in raw/blocked-retailers-R5.md)
- https://www.bcorporation.net/en-us/find-a-b-corp/?query=better%20world%20books (HTTP 403, logged)
- https://explore.changeclimate.org/brand/better-world-books
- https://explore.changeclimate.org/brand/rei (control query for the Climate Label check)
- https://directories.onepercentfortheplanet.org/profile/better-world-books
- https://www.nlrb.gov/search/case/better%20world%20books
- https://www.osha.gov/ords/imis/establishment.html?p_message=2&establishment=better%20world%20books&state=all&office=all&officetype=all&sitezip=&startmonth=09&startday=25&startyear=2016&endmonth=09&endday=25&endyear=2026&p_case=all&p_violations_exist=both
- https://www.courtlistener.com/api/rest/v4/search/?q=%22Better%20World%20Books%22
- data/blocklist.md (not on the blocklist: `build-index.mjs --blocklist`)
- research/sites/amazonalts-org.md, research/sites/antifamarketer-org.md, research/sites/sustainablejungle-com.md (reasons)
