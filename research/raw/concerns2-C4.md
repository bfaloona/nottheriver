# Concern pass 2, batch C4 (2026-09-25)

FTC search control: `https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Walmart` returned 14 results (including "Walmart, FTC v."), so the search URL form works and a zero there means no results.

## overstock-com
- FTC: none (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Overstock); parent "Neighborhood Intelligence": none (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Neighborhood%20Intelligence%22)
- CourtListener: none (query returned 0)
- ProPublica: none (5 articles; none about Overstock)
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none

Quoted-phrase control: `?search=%22Spark%20Driver%22` returned 2 Walmart Spark Driver results, so quoted multi-word searches work.

## packagefreeshop-com
- FTC: none (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Package%20Free%22); no parent named
- CourtListener: none (query returned 0)
- ProPublica: none (47 articles; none about Package Free)
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none

## poshmark-com
- FTC: none (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Poshmark); parent Naver: none (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Naver)
- CourtListener: none (query returned 0)
- ProPublica: none (search returned 0 articles)
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none

## powells-com
- FTC: none (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Powell%27s%22 and the broader https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Powell); no parent
- CourtListener: none (query returned 0)
- ProPublica: none (23 articles; none about Powell's)
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none

## publicgoods-com
- FTC: none (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Public%20Goods%22); no parent named
- CourtListener: none (query returned 0)
- ProPublica: none (40 articles; none about Public Goods)
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none

## shop-app
- FTC: none (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Shop%20app%22); parent Shopify: none (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Shopify). Bare "Shop" not searched (too generic).
- CourtListener: none of the 46 returned for "Shop" (20 listed in JSON: all name collisions such as gun shops, liquor shops, or companies suing the United States; 26 unlisted, not checked). Extra query for "Shopify" (one WebFetch of the same API form): 2 dockets, both 2026-09-15 N.D. Cal. grand jury subpoena applications to Shopify (USA), Inc.; Shopify is a records holder, not sued; dropped. Titles are from the WebFetch summary and were not opened, since nothing was recorded from them.
- ProPublica: none (50 articles; none about Shop or Shopify)
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none

## tenthousandvillages-com
- FTC: none (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Ten%20Thousand%20Villages%22); no parent
- CourtListener: none (query returned 0)
- ProPublica: none (46 articles; none about Ten Thousand Villages)
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none

## thedetoxmarket-com
- FTC: none (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Detox%20Market%22); no parent named
- CourtListener: none (query returned 0)
- ProPublica: none (6 articles; none about The Detox Market)
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none

## worldofbooks-com
- FTC: none (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22World%20of%20Books%22); the phrase also covers parent World of Books Group
- CourtListener: none (query returned 0)
- ProPublica: none (40 articles; none about World of Books)
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none

## Totals
- 9 of 9 retailers checked; 0 concerns added; no tier changes.
- WebFetch calls: 17 of 25 (2 FTC search controls, 14 FTC retailer or parent searches, 1 CourtListener "Shopify" query).
- Blocked pages: none, so no blocked-concerns2-C4.md file.
