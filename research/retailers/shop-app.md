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

Second pass (2026-09-25): the FTC cases and proceedings search returned no results for "Shop app" or for the parent "Shopify" (a bare "Shop" search is too generic to be useful). The CourtListener agency-docket query for "Shop" since 2016 returned 46 dockets (20 listed); all listed ones are other businesses with "Shop" in their name or companies suing the United States, so none was kept, and the other 26 were not listed. A separate CourtListener query for "Shopify" returned 2 dockets filed 2026-09-15 in N.D. Cal., both applications for a grand jury subpoena to Shopify (USA), Inc. in an investigation, which name Shopify as a records holder rather than a defendant, so neither was kept. None of the 50 ProPublica articles matching "Shop" is about Shop or Shopify. No matching cases, so no concern rows were added.

News pass (2026-09-25): three web searches. Because "Shop" alone matches almost any retailer, the queries used the parent's name: `"Shop app" OR "Shopify" lawsuit OR settlement OR fine OR violation`, `"Shopify" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")` and, for Canada's regulators, `Shopify "Competition Bureau" OR "Privacy Commissioner" OR "Canada Revenue Agency" investigation OR finding OR penalty`. No agency or court action against Shop or Shopify was found. Seen and noted only: Sezzle's antitrust suit against Shopify over Shop Pay Installments (Payments Dive, Alston & Bird; a private suit, no ruling reported); a 2026 settlement of Shopify's copyright suit against Shopline (Shopify was the plaintiff; BetaKit); and the Canada Revenue Agency's court application for Shopify merchant records, which news reports say the Federal Court decided in Shopify's favor in June 2025, with the Federal Court of Appeal ordering Shopify in January 2026 to keep the data while the appeal runs (CTV News, BNN Bloomberg, The Globe and Mail). An order to produce or keep records is not a finding against the company, and none of these outlets is an accepted source, so nothing was recorded. The second search returned only generic agency pages. No concern rows added.

## Rating
- ethics: 0.5 baseline, no B Corp, Fair Trade USA or worker co-op listing verified (bcorporation.net blocked agents this run; no row in data/certifications.json).
- environment: 0.5 baseline. 1% for the Planet not checked (directory returns no data to a plain fetch); no Climate Label listing checked.
- concerns: none recorded. Briskin v. Shopify and the severance class action are noted above but do not count (private suits with no ruling on the merits, and about Shopify rather than Shop). NLRB case search for "Shopify" returned no cases (control search "Starbucks" returned 2,559). The first-pass FTC case-library search did not filter by name; pass 2 used the `search=` form, which did filter (Walmart control returned 14 results), and found no cases for "Shop app" or "Shopify". The 10-K's Legal Proceedings section was not readable through the fetch tool. The web search budget ran out before the news pass.
- tier: `acceptable` (0.5 + 0.5 = 1.0; not Amazon-owned per `node research/build-index.mjs --blocklist`).
- Concern search: passes 1 to 3 (agency pages, FTC, CourtListener, ProPublica, general news search).

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
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Shop%20app%22
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Shopify
- https://www.courtlistener.com/api/rest/v4/search/?type=r&order_by=dateFiled+desc&filed_after=2016-01-01&q=caseName%3A(%22Shopify%22)%20AND%20caseName%3A(%22Equal%20Employment%22%20OR%20%22EEOC%22%20OR%20%22Secretary%20of%20Labor%22%20OR%20%22Department%20of%20Labor%22%20OR%20%22Federal%20Trade%20Commission%22%20OR%20%22United%20States%22%20OR%20%22State%20of%22%20OR%20%22People%20of%22%20OR%20%22Commonwealth%22%20OR%20%22National%20Labor%20Relations%22%20OR%20%22Environmental%20Protection%22%20OR%20%22Consumer%20Product%20Safety%22%20OR%20%22Securities%20and%20Exchange%22%20OR%20%22Attorney%20General%22%20OR%20%22District%20of%20Columbia%22)
- https://www.courtlistener.com/api/rest/v4/search/?type=r&order_by=dateFiled+desc&filed_after=2016-01-01&q=caseName%3A(%22Shop%22)%20AND%20caseName%3A(%22Equal%20Employment%22%20OR%20%22EEOC%22%20OR%20%22Secretary%20of%20Labor%22%20OR%20%22Department%20of%20Labor%22%20OR%20%22Federal%20Trade%20Commission%22%20OR%20%22United%20States%22%20OR%20%22State%20of%22%20OR%20%22People%20of%22%20OR%20%22Commonwealth%22%20OR%20%22National%20Labor%20Relations%22%20OR%20%22Environmental%20Protection%22%20OR%20%22Consumer%20Product%20Safety%22%20OR%20%22Securities%20and%20Exchange%22%20OR%20%22Attorney%20General%22%20OR%20%22District%20of%20Columbia%22) (pass 2 agency-docket query)
- https://www.propublica.org/search?qss=%22Shop%22
