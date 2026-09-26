# Concern pass 2: batch C3 (2026-09-25)

FTC search control: `https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Amazon` showed "Displaying 1 - 20 of 26", so a "No results found for these filters." answer is a real negative.

## earthhero-com
- FTC: none (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=EarthHero; parent https://www.ftc.gov/legal-library/browse/cases-proceedings?search=ZeroWasteStore; both "No results found for these filters.")
- CourtListener: none of the 0 returned
- ProPublica: none (0 articles)
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none

## ecoroots-us
- FTC: none (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=EcoRoots, "No results found for these filters.")
- CourtListener: none of the 0 returned
- ProPublica: none (0 articles)
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none

## girlfriend-com
- FTC: none (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Girlfriend%20Collective%22, "No results found for these filters."; unquoted search gave 47 word matches, none on page 1 about the company)
- CourtListener: none of the 0 returned
- ProPublica: none (47 slugs, all unrelated; the search matched "girlfriend")
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none

## kobo-com
- FTC: none (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Kobo; parent https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Rakuten; both "No results found for these filters.")
- CourtListener: none kept of 2 returned. Both are one case, United States v. Kobo, S.D. Cal. 3:22-po-01347 (https://www.courtlistener.com/docket/70666408/united-states-v-kobo/, https://www.courtlistener.com/docket/65654124/united-states-v-kobo/): petty-offense citation ("Citation Issued", "Forfeiture of Collateral" per the search API record), dropped as a name collision / case against an individual. Docket page returned HTTP 403.
- ProPublica: none (1 slug, about Amazon's self-publishing arm)
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none (pass-2 brief step 3 drop rule for criminal cases against individuals and name collisions)

## kotn-com
- FTC: none (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Kotn, "No results found for these filters.")
- CourtListener: none of the 0 returned
- ProPublica: none (0 articles)
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none

## libro-fm
- FTC: none (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Libro.fm, "No results found for these filters.")
- CourtListener: none of the 0 returned
- ProPublica: none (0 articles)
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none

## lovegrown-com
- FTC: none (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Hive%20Brands%22 and ?search=%22Love%20Grown%22, both "No results found for these filters."). Phrase-search control ?search=%22Seven%20%26%20i%20Holdings%22 returned 5.
- CourtListener: none of the 0 returned for "Hive Brands"; an extra WebFetch of the same agency query for "Love Grown" also returned count 0
- ProPublica: none; the pre-fetch searched the label "Hive (now Love Grown)", so this is a weak negative (not re-run)
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none

## madetrade-com
- FTC: none (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Made%20Trade%22, "No results found for these filters.")
- CourtListener: none of the 0 returned
- ProPublica: none (47 slugs, all unrelated: tariffs, trading, drug makers)
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none

## misfitsmarket-com
- FTC: none (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Misfits%20Market%22 and ?search=%22Imperfect%20Foods%22, both "No results found for these filters.")
- CourtListener: none of the 0 returned for "Misfits Market"; an extra WebFetch of the same agency query for "Imperfect Foods" also returned count 0
- ProPublica: none (2 slugs: ap3-oath-keepers-militia-mole, living-apart-how-the-government-betrayed-a-landmark-civil-rights-law)
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none

## Batch summary
- 9 of 9 retailers checked; 0 concerns added; no tier changes.
- WebFetch calls: 20 of 25 (FTC 16 incl. 2 controls, CourtListener 4 incl. 1 blocked docket page).
- Blocked: 1 page (see blocked-concerns2-C3.md).

## Lead note (lovegrown-com ProPublica)
- Lead reran ProPublica for "Hive Brands" and "Love Grown": no article about the company (only name collisions). No change.
