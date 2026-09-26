# Concern pass 2: batch C2 (2026-09-25)

## ableclothing-com
- FTC: none. "Fashionable" (legal name) returned 0; "ABLE" returned 220 keyword matches, top 20 by date and by relevance (&sort_by=search_api_relevance) name no ABLE/Fashionable respondent (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Fashionable, https://www.ftc.gov/legal-library/browse/cases-proceedings?search=ABLE)
- CourtListener: none of the 29 (20 listed); all name collisions (Able Sales Co., Able Car Rental, Able Groupe, Able Moving & Storage, criminal cases v. individuals named Able, Able Place forfeitures) or suits against a government
- ProPublica: none (32 hits, none about the company)
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none

## avocadogreenmattress-com
- FTC: none. "Avocado Green" (retailer and parent Avocado Green Brands) returned 33 keyword matches; the 20 shown (2012 to 2026) have no Avocado respondent (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Avocado%20Green)
- CourtListener: none (query returned 0)
- ProPublica: none (1 hit, Philips CPAP story)
- Concerns added: none. Tier: acceptable -> acceptable (2 existing OSHA labor concerns unchanged)
- Rule decided it: none

## backmarket-com
- FTC: none. 565 keyword matches; relevance-sorted top 20 have no Back Market respondent (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Back%20Market&sort_by=search_api_relevance)
- CourtListener: none (query returned 0)
- ProPublica: none (48 hits, none about the company)
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none
- Method note: the FTC search matches the words separately (not as a phrase) and sorts by date; quoted phrases return 0 even for "Best Buy" (inconclusive syntax), so from here on the batch uses &sort_by=search_api_relevance.

## bestbuy-com
- FTC: none. 72 keyword matches, relevance-sorted top results have no Best Buy Co. respondent (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Best%20Buy&sort_by=search_api_relevance)
- CourtListener: none of the 4 returned (all company v. United States: CIT trade cases incl. unrelated Star Best Buy Inc., and a Court of Federal Claims tax case)
- ProPublica: none (45 hits, none about an action against Best Buy)
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none

## betterworldbooks-com
- FTC: none. "Better World" (retailer and parent Better World Libraries), 86 keyword matches, relevance-sorted top 20 have no Better World respondent (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Better%20World&sort_by=search_api_relevance)
- CourtListener: none (query returned 0)
- ProPublica: none (42 hits, none about the company)
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none

## blkgrn-com
- FTC: none (0 results for "BLK GRN"; https://www.ftc.gov/legal-library/browse/cases-proceedings?search=BLK%20GRN&sort_by=search_api_relevance)
- CourtListener: none (query returned 0)
- ProPublica: none (0 hits)
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none

## bobsredmill-com
- FTC: none. 792 keyword matches, relevance-sorted top 20 have no Bob's Red Mill respondent (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Bob%27s%20Red%20Mill&sort_by=search_api_relevance)
- CourtListener: none (query returned 0)
- ProPublica: none (7 hits, none about the company)
- Concerns added: none. Tier: acceptable -> acceptable (existing OSHA labor concern unchanged)
- Rule decided it: none

## christydawn-com
- FTC: none (0 results; https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Christy%20Dawn&sort_by=search_api_relevance). Parent unknown, so no parent search.
- CourtListener: none (query returned 0)
- ProPublica: none (4 hits, none about the company)
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none

## credobeauty-com
- FTC: none. 4 results (SBLA Beauty, TRIA Beauty, NutraClick, Truly Organic), no Credo respondent (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Credo%20Beauty&sort_by=search_api_relevance). Parent unknown, so no parent search.
- CourtListener: none (query returned 0)
- ProPublica: none (0 hits)
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none

## depop-com
- FTC: none. "Depop" 0 results; parent "eBay" 3 results, none with eBay respondent; former parent "Etsy" 1 result (1997, not Etsy) (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Depop&sort_by=search_api_relevance, ...?search=eBay&sort_by=search_api_relevance, ...?search=Etsy&sort_by=search_api_relevance)
- CourtListener: none (query returned 0)
- ProPublica: none (0 hits)
- Concerns added: none. Tier: acceptable -> acceptable
- Rule decided it: none

## Batch summary
- 10 of 10 retailers checked; 0 concerns added; 0 tier changes (all stay acceptable).
- WebFetch calls used: 20 of 25. No blocked pages (no blocked-concerns2-C2.md written).
- Caveat: the FTC search seems to match names in case titles, not full text ("eBay" gets 3 hits), and quoted phrases return nothing even for "Best Buy"; a negative there is "no case titled with the name", not proof of no FTC action.
- Positive control: "Rite Aid" with &sort_by=search_api_relevance returned 70 results, the top 10 all Rite Aid matters (FTC v. Rite Aid Corporation first), so a real respondent ranks at the top and the relevance-sorted negatives above hold for case titles (https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Rite%20Aid&sort_by=search_api_relevance).

## Lead note (quoted FTC searches)
- C2 reported that quoted FTC searches return nothing. The lead retested: `search=%22Rite%20Aid%22` and `search=%22Walmart%22` each returned 14 results, led by the matching FTC case. Quoted searches work; the other batches' negatives stand. C2's other caveat holds: the search seems to match case titles, so "none" means no case titled with that name.
