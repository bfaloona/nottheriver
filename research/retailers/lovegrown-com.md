---
name: Hive (now Love Grown)
domain: lovegrown.com
type: brand
goods: [coffee, cereal, supplements]
ownership: unknown
parent: unknown
hq: unknown
marketplace: false
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns: []
ethics: 0.5
environment: 0.5
tier: acceptable
mentions: 3
mentioned_by: [goingzerowaste-com, goodgoodgood-co, vstyleblog-com]
checked: 2026-09-25
---

The lists name Hive (Hive Brands), an online sustainable grocery store with a "badging system" for brands (Going Zero Waste), a "robust recycling guide" (Good Good Good) and a five-pillar sustainability screen (V Style Blog). The Hive domain no longer leads to a grocery: plain curl on 2026-09-25 shows https://hivebrands.com/ and https://www.hivebrands.com/ answering 301 to https://lovegrown.com/. Lovegrown.com is now a direct-to-consumer food brand selling its own coffee, cereal and WellDrops supplements; the footer names "Love Grown, Inc", its help link is a Hive Brands support portal (hive-brands-...gorgias.help) and the store runs on a "hive-brands" Shopify store. Its about page says "We met working together on a grocery business" but states no acquisition, merger or rebrand, so the link between Hive and Love Grown is shown only by the redirect and those shared systems. The lists' grocery reasons no longer describe what the domain sells. Ownership, parent and headquarters are not stated on any page fetched (the about page calls a founder "Brooklyn-based", which is not a headquarters).

Love Grown's site says it is a Certified B Corporation. That claim could not be checked: bcorporation.net returned HTTP 403 for https://www.bcorporation.net/en-us/find-a-b-corp/company/hive-brands/ (a guessed profile URL), and data/certifications.json has no row for lovegrown.com or Hive. It does not count; logged for the operator.

Not scored, but on record: NLRB case searches for "Hive Brands" and "Love Grown" returned no cases. Neither name appears on The Climate Label directory page. No other concern search could be run: Violation Tracker, FTC and DOJ search pages were blocked or missing, and this session's web search budget ran out.

Second pass (2026-09-25): the FTC cases-and-proceedings search returned "No results found for these filters." for the phrases "Hive Brands" and "Love Grown" (the search for "Amazon" returned 26 and the phrase "Seven & i Holdings" returned 5, so plain and phrase searches work); the CourtListener agency-docket search returned 0 dockets for "Hive Brands" (filed since 2016), and a second run for "Love Grown" also returned 0; the ProPublica search used the list label "Hive (now Love Grown)" and returned no articles, which is not a useful negative for either name. No concern added.

## Rating
- Ethics: 0.5 baseline. B Corp claim on the retailer's own site only, not verified with the certifier (403) and no data/certifications.json row, so it does not count. No accepted concern. = 0.5
- Environment: 0.5 baseline. Not on The Climate Label directory page (explore.changeclimate.org). 1% for the Planet directory could not be searched (logged). = 0.5
- Total 1.0, not Amazon-owned: tier `acceptable`.
- Concern search partial: pass 2 checked FTC cases, CourtListener agency dockets since 2016 and ProPublica; no general news search, and DOJ, SEC and Violation Tracker were unreachable; tier is provisional.
- Blocklist: `node research/build-index.mjs --blocklist "Hive" lovegrown.com` returned "not on the blocklist".

## Sources
- https://lovegrown.com/
- https://lovegrown.com/pages/about-love-grown
- https://hivebrands.com/ (301 to https://lovegrown.com/, plain curl)
- https://www.nlrb.gov/search/case/Hive%20Brands
- https://www.nlrb.gov/search/case/Love%20Grown
- https://explore.changeclimate.org/
- https://www.bcorporation.net/en-us/find-a-b-corp/company/hive-brands/ (HTTP 403; logged)
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Hive%20Brands%22 ("No results found for these filters.")
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Love%20Grown%22 ("No results found for these filters.")
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Amazon (control: 26 results)
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Seven%20%26%20i%20Holdings%22 (phrase-search control: 5 results)
- CourtListener agency-docket search for "Hive Brands", filed since 2016 (0 results; URL in research/raw/concern-fetch/lovegrown-com.json)
- https://www.courtlistener.com/api/rest/v4/search/?type=r&order_by=dateFiled+desc&filed_after=2016-01-01&q=caseName:("Love Grown") AND caseName:(government party list as in the pass-2 fetch) (count 0)
- https://www.propublica.org/search?qss=%22Hive%20(now%20Love%20Grown)%22 (no articles)
