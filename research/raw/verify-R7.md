# Verification, retailer batch R7 (2026-09-25)

All five R7 files exist. Every source below was fetched this run (WebFetch or plain curl). No web search used. data/certifications.json has no row for any R7 domain (grep control: 28 `domain` rows matched).

| file | claim | source | result | why |
|---|---|---|---|---|
| shop-app.md | concern: governance, "Brandon Briskin v. Shopify, Inc.", 2025-04-21 | https://cdn.ca9.uscourts.gov/datastore/opinions/2025/04/21/22-15815.pdf | removed (kept in body as a noted lawsuit) | Title and date match, but it is a private putative class action; the en banc court reversed a dismissal for lack of personal jurisdiction and held the complaint met Rule 8(a)(2). No finding on the merits, so it fails "What counts as a concern". It also concerns Shopify's merchant checkout (plaintiff paid on iambecoming.com), not Shop's own business |
| shop-app.md | concern: labor, "Shopify faces class-action lawsuit over severance offered to recently laid off staff", 2023-05-30 | https://www.theglobeandmail.com/business/technology/article-shopify-faces-class-action-lawsuit-over-severance-offered-to-recently/ | removed (kept in body) | Title and date match; the article reports a filed private suit with no ruling, against the parent about its own staff, not Shop's business |
| shop-app.md | ownership: public | https://en.wikipedia.org/wiki/Shopify | kept | "Traded as TSX: SHOP, Nasdaq: SHOP" (Shop is Shopify's) |
| shop-app.md | parent: Shopify | https://www.shopify.com/shop | kept | Shopify's own page presents Shop as its product ("Sell to millions of high-intent shoppers on Shop. Just by joining Shopify") |
| shop-app.md | hq: Ottawa, ON, Canada | https://en.wikipedia.org/wiki/Shopify | kept | Headquarters "Ottawa, Ontario, Canada" |
| shop-app.md | marketplace: true | https://www.shopify.com/shop | kept | Merchants join Shopify to sell to Shop's shoppers; "Shop has no marketplace fees" |
| shop-app.md | rating | recomputed | fixed | ethics 0.25 -> 0.5; tier caution -> acceptable (1.0); provisional line added |
| tentree-com.md | certification: climate_neutral, verified_this_run: true | https://explore.changeclimate.org/brand/tentree | kept | Title "tentree \| A Climate Label Certified Brand"; "first certified 2021", "current certification year 2025"; page data shows `"status":"Completed","year":2025,"isExpired":false`. Footer: "Climate Neutral dba The Change Climate Project", the same operator named on climatelabel.org; changeclimate.org's nav link "Find Certified Brands" points to explore.changeclimate.org, so it is the certifier's own directory |
| tentree-com.md | hq: Vancouver, BC, Canada | https://www.tentree.com/pages/about | kept | Address "230 - 1275 Venables St, Vancouver" |
| tentree-com.md | rating | recomputed | kept | 0.5 + 0.75 = 1.25, recommended; provisional line added |
| publicgoods-com.md | ownership: private | https://beautymatter.com/articles/l-catterton-takes-15-million-stake-in-public-goods | fixed -> unknown | Article reports a $15M L Catterton investment but does not say who owns the company or that it is privately held; the other sources don't either |
| publicgoods-com.md | parent: none | (no source states it) | fixed -> unknown | No fetched page says there is no parent |
| publicgoods-com.md | hq: New York, NY | https://www.publicgoods.com/policies/terms-of-service | kept | "Don't Run Out, Inc. d/b/a Public Goods", "85 Delancey St. New York, NY 10002" |
| publicgoods-com.md | rating | recomputed | kept | 1.0, acceptable; provisional line added |
| tenthousandvillages-com.md | ownership: nonprofit | https://en.wikipedia.org/wiki/Ten_Thousand_Villages | kept | "a nonprofit fair trade organization" |
| tenthousandvillages-com.md | parent: none | https://en.wikipedia.org/wiki/Ten_Thousand_Villages | kept | "is no longer owned by the MCC" |
| tenthousandvillages-com.md | hq: Akron, PA | https://en.wikipedia.org/wiki/Ten_Thousand_Villages | kept | Located in Akron, Pennsylvania |
| tenthousandvillages-com.md | rating | recomputed | kept | 1.0, acceptable; provisional line added |
| thedetoxmarket-com.md | hq: Van Nuys, CA | https://www.thedetoxmarket.com/policies/terms-of-service | kept | "6910 Hayvenhurst Ave, Suite 100, Van Nuys, CA, 91406" |
| thedetoxmarket-com.md | rating | recomputed | kept | 1.0, acceptable; provisional line added |

Not fetched by the verifier (no claim depends on them beyond what is noted): shop.app itself (403/429 per researcher). All R7 files: the researcher logged that the web search budget ran out before the news pass, so each Rating now says the concern search is incomplete.
