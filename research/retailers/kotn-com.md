---
name: Kotn
domain: kotn.com
type: brand
goods: [clothing, accessories, home]
ownership: unknown
parent: unknown
hq: Toronto, ON, Canada
marketplace: unknown
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns: []
ethics: 0.5
environment: 0.5
tier: acceptable
mentions: 2
mentioned_by: [adayinourshoes-com, amazonalts-org]
checked: 2026-09-25
---

Kotn is a Canadian clothing brand, founded in 2015 by Benjamin Sehl, Mackenzie Yeates and Rami Helali and based in Toronto (Wikipedia). It sells women's and men's clothing, accessories and home goods online and in its own shops in Toronto, Montreal, London and Vancouver. It sources cotton from farmers in Egypt and has built schools for their children, which won it the 2019 Canadian Arts and Fashion Awards sustainability award (Wikipedia). No fetched page gives its ownership or investors, whether it sells through Amazon, or whether it hosts other sellers, so those fields are `unknown`.

Lists name it as an ethical clothing brand (A Day In Our Shoes) and for staples made "in a safe and fair production environment" with profits funding schools and farm support (AmazonAlts). Kotn's own about page says it is "A certified B Corporation voted Best for the World™". That is the company's own claim: the B Lab directory page it links to (bcorporation.net) returned HTTP 403, and `data/certifications.json` has no row for kotn.com, so no B Corp certification is counted. Kotn is not among the brands on Fair Trade USA's shop page. The 1% for the Planet and Climate Label directories could not be checked this run (see `research/raw/blocked-retailers-R10.md`).

Concern checks: an NLRB case search for "kotn" returned no results (the same search for "costco" returned 180, so the search works). A CourtListener search found one docket naming Kotn America, Inc., a 2025 disability civil-rights suit (Anderson v. Kotn America, Inc., E.D.N.Y.); it is an allegation that does not fit the labor, governance or environmental kinds and is not recorded as a concern.

## Rating
- Blocklist: `node research/build-index.mjs --blocklist "Kotn" kotn.com` says not on the blocklist, so `amazon_owned: false`.
- Certifications: none verified. B Corp is claimed on kotn.com but the certifier's page was blocked and there is no fallback row.
- Ethics: 0.5 start, no certifications, no concerns = 0.5.
- Environment: 0.5 start, no certifications, no concerns = 0.5.
- Tier: ethics + environment = 1.0, so `acceptable` (below the 1.25 needed for `recommended`).
- Concern search incomplete this run (see raw/blocked-retailers-R10.md); tier is provisional.

## Sources
- https://en.wikipedia.org/wiki/Kotn
- https://kotn.com/
- https://kotn.com/about
- https://www.fairtradecertified.org/our-community/shop-fair-trade/
- https://www.nlrb.gov/search/case/kotn
- https://www.nlrb.gov/search/case/costco
- https://www.courtlistener.com/api/rest/v4/search/?q=%22Kotn%22&type=r&order_by=dateFiled+desc
- data/blocklist.md (checked: no matching entry)
- data/certifications.json (checked: no row for kotn.com)
