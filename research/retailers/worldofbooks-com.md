---
name: World of Books
domain: worldofbooks.com
type: secondhand
goods: [books, media]
ownership: private-equity
parent: World of Books Group
hq: Goring-by-Sea, UK
marketplace: unknown
sells_on_amazon: unknown
amazon_owned: false
certifications:
  - {kind: b_corp, source: "https://www.bcorporation.net/en-us/find-a-b-corp/company/world-of-books-group/", checked: 2026-09-25, verified_this_run: true}
concerns: []
ethics: 0.75
environment: 0.5
tier: recommended
mentions: 2
mentioned_by: [amazonalts-org, antifamarketer-org]
checked: 2026-09-25
---

World of Books (Wikipedia gives "Wob" as a trade name for 2021 to 2024) is a British online seller of used, out-of-print and rare books, textbooks and media, headquartered in Goring-by-Sea, UK, and serving customers worldwide (Wikipedia). It was founded by Simon Downes, Ben Maxfield and Michael Laundon, who started by auctioning books on eBay in 2002. Wikipedia says Bridges Fund Management bought a majority stake in 2016 and sold it in July 2021 to Livingbridge, a British private equity firm, so ownership is `private-equity`; its group also ran the Ziffit and Shopiago resale platforms. Books are "resold either to consumers through Wob's website and online, or wholesale to recyclers". No fetched page says whether it sells through Amazon or hosts other sellers, so both are `unknown`.

Lists name it as a used-book alternative (antifamarketer) that donates books and recycles "80 million books a year" (AmazonAlts). Wikipedia says it "was certified as a B Corporation in 2019", and the site footer shows B Corp and carbon-neutral badges. None of these is the certifier's own page: the B Lab directory page (bcorporation.net) returned HTTP 403, and `data/certifications.json` has no row for worldofbooks.com, so no certification is counted. The 1% for the Planet directory could not be read and The Climate Label was not checked (see `research/raw/blocked-retailers-R10.md`).

Concern checks: an NLRB case search for "world of books" returned no results. A CourtListener search found Global Brother SRL v. World of Books Group LTD (D. Del., filed 2025-02-19); the search result gives no nature of suit and the docket was not opened, so nothing is recorded. It is a UK company, so US regulators are unlikely to list it; UK sources were not searched.

Second pass (2026-09-25): the FTC cases and proceedings search returned no results for "World of Books" (the phrase also covers the parent, World of Books Group); the CourtListener agency-docket query since 2016 returned no dockets; none of the 40 ProPublica articles matching "World of Books" is about the company. No matching cases, so no concern rows were added.

News pass (2026-09-25): three web searches, `"World of Books" OR "Wob" Ziffit lawsuit OR settlement OR fine OR violation`, `"World of Books" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")` and, for UK regulators, `"World of Books" OR Ziffit "Health and Safety Executive" OR "Environment Agency" OR ICO OR CMA OR "Advertising Standards Authority" fine OR ruling OR prosecution`. No agency or court action against World of Books, Wob or Ziffit was found: results were the company's own pages, Wikipedia, review sites (Trustpilot, BBB complaints, which are customer complaints, not agency actions), generic US agency pages and general articles on CMA and ICO enforcement that do not name the company. No concern rows added.

## Rating
- Blocklist: `node research/build-index.mjs --blocklist "World of Books" worldofbooks.com` says not on the blocklist, so `amazon_owned: false`.
- (Before the 2026-09-25 operator decision below) Certifications: none verified. B Corp is stated by Wikipedia and the site's footer badge, but the certifier's page was blocked and there is no fallback row.
- (Before the 2026-09-25 operator decision below) Ethics: 0.5 start, no certifications, no concerns = 0.5.
- Environment: 0.5 start, no certifications, no concerns = 0.5.
- Tier: ethics + environment = 1.0, so `acceptable`.
- Concern search: passes 1 to 3 (agency pages, FTC, CourtListener, ProPublica, general news search).
- Operator check (2026-09-25): the operator opened the B Lab directory page for World of Books Group (403 to agents) and confirmed a current B Corp certification (OC36). Ethics 0.5 -> 0.75. Total 1.25 with no accepted concern: `recommended` (was `acceptable`).

## Sources
- https://en.wikipedia.org/wiki/World_of_Books
- https://www.worldofbooks.com/en-us
- https://www.nlrb.gov/search/case/world%20of%20books
- https://www.courtlistener.com/api/rest/v4/search/?q=%22World+of+Books%22&type=r&order_by=dateFiled+desc
- data/blocklist.md (checked: no matching entry)
- data/certifications.json (checked: no row for worldofbooks.com)
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22World%20of%20Books%22
- https://www.courtlistener.com/api/rest/v4/search/?type=r&order_by=dateFiled+desc&filed_after=2016-01-01&q=caseName%3A(%22World%20of%20Books%22)%20AND%20caseName%3A(%22Equal%20Employment%22%20OR%20%22EEOC%22%20OR%20%22Secretary%20of%20Labor%22%20OR%20%22Department%20of%20Labor%22%20OR%20%22Federal%20Trade%20Commission%22%20OR%20%22United%20States%22%20OR%20%22State%20of%22%20OR%20%22People%20of%22%20OR%20%22Commonwealth%22%20OR%20%22National%20Labor%20Relations%22%20OR%20%22Environmental%20Protection%22%20OR%20%22Consumer%20Product%20Safety%22%20OR%20%22Securities%20and%20Exchange%22%20OR%20%22Attorney%20General%22%20OR%20%22District%20of%20Columbia%22) (pass 2 agency-docket query)
- https://www.propublica.org/search?qss=%22World%20of%20Books%22
