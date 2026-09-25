---
name: Libro.fm
domain: libro.fm
type: retailer
goods: [audiobooks]
ownership: employee-owned
parent: none
hq: Seattle, WA
marketplace: unknown
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns: []
ethics: 0.5
environment: 0.5
tier: acceptable
mentions: 7
mentioned_by: [antifamarketer-org, goodgoodgood-co, ilsr-org, indiebound-org, sustainablejungle-com, vstyleblog-com, workerowned-info]
checked: 2026-09-25
---

Libro.fm sells DRM-free digital audiobooks through its app and splits its profits with an independent bookstore the customer chooses. Wikipedia says it was founded in 2014 by Mark Pearson, Carl Hartung and Nick Johnson, is based in Seattle, is "employee-owned and a social purpose corporation", partnered with Bookshop.org in 2020, and operates in the US, Canada, the UK, Australia and New Zealand. Lists recommend it as the independent-bookstore alternative to Amazon's Audible.

Certifications not counted: one list site calls it a B Corp, but bcorporation.net returned HTTP 403 and data/certifications.json has no Libro.fm row. Employee ownership is not the `worker_coop` certification: Libro.fm does not appear in the US Federation of Worker Cooperatives directory (all pages scanned; a known member, Arizmendi Cooperative, did appear). The Climate Label directory has no Libro.fm profile ("Brand Not Found") and it is not in the directory's brand list. NLRB case search for "Libro.fm" returned no cases, and OSHA's establishment search for "Libro" (2016 to 2026) returned no results. No general news search was possible (the session's web search budget was used up), and its about page returned HTTP 403.

Second pass (2026-09-25): the FTC cases-and-proceedings search for "Libro.fm" returned "No results found for these filters." (the search for "Amazon" returned 26, so the search works); the CourtListener agency-docket search (Libro.fm paired with a government party, filed since 2016) returned 0 dockets; ProPublica search returned no articles. No concern added.

News pass (2026-09-25): two web searches, `"Libro.fm" lawsuit OR settlement OR fine OR violation` and `"Libro.fm" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`. Hits were Libro.fm's own terms and support pages, Wikipedia, the American Booksellers Association's partner page, Book Riot, other cases and agency or law-firm landing pages; none reports an agency or court action against Libro.fm. No parent is named, so no third search. No concerns added.

## Rating
- Ethics: 0.5 baseline. B Corp not verified (certifier page blocked, no fallback row); not in the worker co-op directory. No accepted concern. = 0.5
- Environment: 0.5 baseline. Not in The Climate Label directory; 1% for the Planet directory is script-rendered and returned no content (inconclusive). = 0.5
- Total 1.0, not Amazon-owned: tier `acceptable`.
- Blocklist: `node research/build-index.mjs --blocklist "Libro.fm" libro.fm` returned "not on the blocklist".
- Concern search: passes 1 to 3 (agency pages, FTC, CourtListener, ProPublica, general news search).

## Sources
- https://en.wikipedia.org/wiki/Libro.fm
- https://info.usworker.coop/iframe/directory/worker-co-op-dem-workplaces (pages 0 to 24)
- https://explore.changeclimate.org/brand/libro-fm ("Brand Not Found")
- https://explore.changeclimate.org/ (certified brand directory)
- https://www.nlrb.gov/search/case/Libro.fm
- https://www.osha.gov/ords/imis/establishment.html?p_message=2&establishment=Libro&state=all&office=all&officetype=all&sitezip=&startmonth=01&startday=01&startyear=2016&endmonth=09&endday=25&endyear=2026&p_case=all&p_violations_exist=both ("Your search did not return any results.")
- https://www.bcorporation.net/en-us/find-a-b-corp/company/libro-fm/ (HTTP 403)
- https://libro.fm/about (HTTP 403)
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Libro.fm ("No results found for these filters.")
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Amazon (control: 26 results)
- CourtListener agency-docket search for "Libro.fm", filed since 2016 (0 results; URL in research/raw/concern-fetch/libro-fm.json)
- https://www.propublica.org/search?qss=%22Libro.fm%22 (no articles)
