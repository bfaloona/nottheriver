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
certifications: []
concerns: []
ethics: 0.5
environment: 0.5
tier: acceptable
mentions: 2
mentioned_by: [amazonalts-org, antifamarketer-org]
checked: 2026-09-25
---

World of Books (Wikipedia gives "Wob" as a trade name for 2021 to 2024) is a British online seller of used, out-of-print and rare books, textbooks and media, headquartered in Goring-by-Sea, UK, and serving customers worldwide (Wikipedia). It was founded by Simon Downes, Ben Maxfield and Michael Laundon, who started by auctioning books on eBay in 2002. Wikipedia says Bridges Fund Management bought a majority stake in 2016 and sold it in July 2021 to Livingbridge, a British private equity firm, so ownership is `private-equity`; its group also ran the Ziffit and Shopiago resale platforms. Books are "resold either to consumers through Wob's website and online, or wholesale to recyclers". No fetched page says whether it sells through Amazon or hosts other sellers, so both are `unknown`.

Lists name it as a used-book alternative (antifamarketer) that donates books and recycles "80 million books a year" (AmazonAlts). Wikipedia says it "was certified as a B Corporation in 2019", and the site footer shows B Corp and carbon-neutral badges. None of these is the certifier's own page: the B Lab directory page (bcorporation.net) returned HTTP 403, and `data/certifications.json` has no row for worldofbooks.com, so no certification is counted. The 1% for the Planet and Climate Label directories could not be checked (see `research/raw/blocked-retailers-R10.md`).

Concern checks: an NLRB case search for "world of books" returned no results. A CourtListener search found Global Brother SRL v. World of Books Group LTD (D. Del., filed 2025-02-19); the search result gives no nature of suit and the docket was not opened, so nothing is recorded. It is a UK company, so US regulators are unlikely to list it; UK sources were not searched.

## Rating
- Blocklist: `node research/build-index.mjs --blocklist "World of Books" worldofbooks.com` says not on the blocklist, so `amazon_owned: false`.
- Certifications: none verified. B Corp is stated by Wikipedia and the site's footer badge, but the certifier's page was blocked and there is no fallback row.
- Ethics: 0.5 start, no certifications, no concerns = 0.5.
- Environment: 0.5 start, no certifications, no concerns = 0.5.
- Tier: ethics + environment = 1.0, so `acceptable`.
- Concern search incomplete this run (see raw/blocked-retailers-R10.md); tier is provisional.

## Sources
- https://en.wikipedia.org/wiki/World_of_Books
- https://www.worldofbooks.com/en-us
- https://www.nlrb.gov/search/case/world%20of%20books
- https://www.courtlistener.com/api/rest/v4/search/?q=%22World+of+Books%22&type=r&order_by=dateFiled+desc
- data/blocklist.md (checked: no matching entry)
- data/certifications.json (checked: no row for worldofbooks.com)
