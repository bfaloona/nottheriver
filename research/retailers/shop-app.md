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
concerns:
  - {kind: governance, title: "Brandon Briskin v. Shopify, Inc.", source: https://cdn.ca9.uscourts.gov/datastore/opinions/2025/04/21/22-15815.pdf, date: 2025-04-21, accepted_source: true}
  - {kind: labor, title: "Shopify faces class-action lawsuit over severance offered to recently laid off staff", source: https://www.theglobeandmail.com/business/technology/article-shopify-faces-class-action-lawsuit-over-severance-offered-to-recently/, date: 2023-05-30, accepted_source: false}
ethics: 0.25
environment: 0.5
tier: caution
mentions: 3
mentioned_by: [antifamarketer-org, ilsr-org, thegoodtrade-com]
checked: 2026-09-25
---

Shop is Shopify's consumer shopping app and site. Shopify describes it as the place where "Millions use Shop + Shop Pay to find brands, track orders, and buy again" and tells merchants they can "Sell to millions of high-intent shoppers on Shop. Just by joining Shopify", so it sells goods from many independent Shopify merchants rather than its own stock. Wikipedia says the Shop app launched in April 2020 as a rebranding of Arrive. Shopify, founded in 2006, trades on the Toronto Stock Exchange and Nasdaq (ticker SHOP); its 10-K for the fiscal year ended 2025-12-31 gives offices at 151 O'Connor Street, Ottawa and 85 10th Avenue, New York. Wikipedia also records a 2017 integration that lets merchants "sell on Amazon from their Shopify stores"; that concerns Shopify merchants, not Shop itself, so `sells_on_amazon` stays `unknown`. shop.app itself returned 403 and 429 to fetches this run.

Lists name it as a way to buy from small businesses: ILSR ("AI-assisted shopping across Shopify small businesses"), The Good Trade ("Best for stocking up on sustainable brands", labeled "The Good Trade Partner") and Antifa Marketer (no reason given).

Concerns:
- Brandon Briskin v. Shopify, Inc. (Ninth Circuit en banc opinion, filed 2025-04-21). Per the court's summary, Briskin "filed his putative class action alleging privacy-related torts" against Shopify, Inc. and two US subsidiaries, and his complaint "alleged that Shopify used the data gathered by its cookies to compile consumer profiles and then sold them without the consumer's knowledge or consent" after he paid on a merchant's Shopify checkout. The court held only that Shopify is subject to personal jurisdiction in California; it made no finding on the merits. Recorded as governance (consumer privacy); the source is an allegation.
- The Globe and Mail, 2023-05-30: a class action over reduced severance for laid-off staff; the article says the lawsuit "claims" and "allegedly". Not an accepted source, so it does not change the score.

Wikipedia also mentions a 2020 incident in which two support staff took customer data for up to 200 merchants, a 2021 textbook-publisher copyright suit settled out of court, and content-moderation criticism; none was checked at an original source this run, so none is recorded.

## Rating
- ethics: 0.5 baseline, no B Corp, Fair Trade USA or worker co-op listing verified (bcorporation.net blocked agents this run; no row in data/certifications.json), −0.25 for the governance concern from uscourts.gov = 0.25.
- environment: 0.5 baseline. 1% for the Planet not checked (directory returns no data to a plain fetch); no Climate Label listing checked.
- concerns: 1 accepted (uscourts.gov), 1 not accepted (The Globe and Mail). NLRB case search for "Shopify" returned no cases (control search "Starbucks" returned 2,559). The FTC case-library search did not filter by name (inconclusive). The 10-K's Legal Proceedings section was not readable through the fetch tool. The web search budget ran out before the news pass.
- tier: `caution` (0.25 + 0.5 = 0.75, below 1.0; not Amazon-owned per `node research/build-index.mjs --blocklist`).

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
