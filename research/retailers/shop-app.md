---
name: Shop
domain: shop.app
type: marketplace
goods: [general merchandise]
ownership: public
parent: Shopify
hq: Ottawa, ON, Canada
marketplace: true
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns: []
ethics: 0.5
environment: 0.5
tier: acceptable
mentions: 3
mentioned_by: [antifamarketer-org, ilsr-org, thegoodtrade-com]
checked: 2026-09-25
---

Shop is Shopify's consumer shopping app and site. Shopify describes it as the place where "Millions use Shop + Shop Pay to find brands, track orders, and buy again" and tells merchants they can "Sell to millions of high-intent shoppers on Shop. Just by joining Shopify", so it sells goods from many independent Shopify merchants rather than its own stock. Wikipedia says the Shop app launched in April 2020 as a rebranding of Arrive. Shopify, founded in 2006, trades on the Toronto Stock Exchange and Nasdaq (ticker SHOP); its 10-K for the fiscal year ended 2025-12-31 gives offices at 151 O'Connor Street, Ottawa and 85 10th Avenue, New York. Wikipedia also records a 2017 integration that lets merchants "sell on Amazon from their Shopify stores"; that concerns Shopify merchants, not Shop itself, so `sells_on_amazon` stays `unknown`. shop.app itself returned 403 and 429 to fetches this run.

Lists name it as a way to buy from small businesses: ILSR ("AI-assisted shopping across Shopify small businesses"), The Good Trade ("Best for stocking up on sustainable brands", labeled "The Good Trade Partner") and Antifa Marketer (no reason given).

Lawsuits noted, not recorded as concerns (brief section 9, "What counts as a concern"):
- Briskin v. Shopify, Inc. (Ninth Circuit en banc opinion, filed 2025-04-21). Per the court's summary, Briskin "filed his putative class action alleging privacy-related torts" against Shopify, Inc. and two US subsidiaries after paying on a merchant's own site (iambecoming.com) through Shopify's checkout, and his complaint "alleged that Shopify used the data gathered by its cookies to compile consumer profiles and then sold them without the consumer's knowledge or consent". The court reversed a dismissal for lack of personal jurisdiction and held the complaint gave fair notice; it made no finding on the merits. A private suit with a jurisdiction ruling is not a concern, and the suit is about Shopify's merchant checkout, not Shop's own business.
- The Globe and Mail, 2023-05-30, "Shopify faces class-action lawsuit over severance offered to recently laid off staff": a private class action by laid-off Shopify staff; the article reports no ruling. Not a concern (a private suit with no ruling, against the parent, not about Shop).

Wikipedia also mentions a 2020 incident in which two support staff took customer data for up to 200 merchants, a 2021 textbook-publisher copyright suit settled out of court, and content-moderation criticism; none was checked at an original source this run, so none is recorded.

## Rating
- ethics: 0.5 baseline, no B Corp, Fair Trade USA or worker co-op listing verified (bcorporation.net blocked agents this run; no row in data/certifications.json).
- environment: 0.5 baseline. 1% for the Planet not checked (directory returns no data to a plain fetch); no Climate Label listing checked.
- concerns: none recorded. Briskin v. Shopify and the severance class action are noted above but do not count (private suits with no ruling on the merits, and about Shopify rather than Shop). NLRB case search for "Shopify" returned no cases (control search "Starbucks" returned 2,559). The FTC case-library search did not filter by name (inconclusive). The 10-K's Legal Proceedings section was not readable through the fetch tool. The web search budget ran out before the news pass.
- tier: `acceptable` (0.5 + 0.5 = 1.0; not Amazon-owned per `node research/build-index.mjs --blocklist`).
- Concern search incomplete this run (see raw/blocked-retailers-R7.md); tier is provisional.

## Sources
- https://www.shopify.com/shop
- https://en.wikipedia.org/wiki/Shopify
- https://www.sec.gov/Archives/edgar/data/0001594805/000159480526000007/shop-20251231.htm
- https://cdn.ca9.uscourts.gov/datastore/opinions/2025/04/21/22-15815.pdf
- https://www.courtlistener.com/api/rest/v4/search/?type=o&q=Briskin%20Shopify
- https://www.theglobeandmail.com/business/technology/article-shopify-faces-class-action-lawsuit-over-severance-offered-to-recently/
- https://www.nlrb.gov/search/case/Shopify
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search_api_fulltext=Shopify
- data/blocklist.md (no match)
