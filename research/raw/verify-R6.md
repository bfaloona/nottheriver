# Verification: retailers R6
checked: 2026-09-25

Files: kobo-com, lovegrown-com, overstock-com, poshmark-com, powells-com (all five exist). None has a certification row or a concern row, so the checks cover the front matter fields, the body notes that explain why nothing was recorded, and the "no match" controls.

| file | claim | source | result | why |
|---|---|---|---|---|
| all five | no certification row | data/certifications.json | kept | 0 matches for kobo, lovegrown, hive, overstock, poshmark or powell; control: the file has 28 `"domain"` rows (patagonia.com, cotopaxi.com, bombas.com first) |
| all five | not on The Climate Label | https://explore.changeclimate.org/ | kept | plain curl, 1.4 MB page: Etsy, Blueland, Reformation 4 hits each (control); Kobo, Love Grown, Hive, Overstock, Poshmark, Powell 0 hits |
| all five | tier `acceptable` (ethics 0.5 + environment 0.5 = 1.0) | section 5 recompute | kept | no counted certification, no accepted concern; no tier change |
| all five | concern search completeness | raw/blocked-retailers-R6.md | fixed | blocked file says osha/dol/epa/cpsc/AP/NPR/ProPublica checks "are still owed" for every R6 retailer; added "Concern search incomplete this run ...; tier is provisional." to each `## Rating` |
| kobo-com | ownership: public | https://en.wikipedia.org/wiki/Rakuten_Kobo | fixed -> unknown | article gives Type "Subsidiary", Parent "Rakuten Group", but never says Rakuten is listed; researcher's basis was a convention across files, not a source. Body phrase "publicly traded" replaced with the article's "technology conglomerate" |
| kobo-com | parent: Rakuten Group | https://en.wikipedia.org/wiki/Rakuten_Kobo | kept | infobox "Parent: Rakuten Group (2012–present)" |
| kobo-com | hq: Toronto, ON, Canada | https://en.wikipedia.org/wiki/Rakuten_Kobo | kept | "Headquartered in Toronto, Ontario, Canada" |
| kobo-com | Walmart partnership (2018), Kobo Writing Life | https://en.wikipedia.org/wiki/Rakuten_Kobo | kept | both in the article |
| kobo-com | Pop Top Corp. v. Rakuten Kobo; Canadian Competition Bureau case | none fetched (search snippets) | removed | cite or omit: the researcher's own note says neither was fetched |
| kobo-com | NLRB search: no cases | https://www.nlrb.gov/search/case/Kobo | kept | "Your Search for 'Kobo' did not match any cases"; positive control: same search for Powell's Books returns 10 cases |
| lovegrown-com | marketplace: false | https://lovegrown.com/ | kept | single brand selling its own coffee, cereal, WellDrops; no third-party sellers |
| lovegrown-com | ownership, parent, hq unknown | https://lovegrown.com/pages/about-love-grown | kept | page states none of them (Brooklyn and NYC are team members' personal locations) |
| lovegrown-com | Hive redirect | https://hivebrands.com/, https://www.hivebrands.com/ | kept | plain curl: both 301 to https://lovegrown.com/ |
| lovegrown-com | "every list's Hive link resolves there too" | no fetched URL in Sources | removed | not re-checkable from the file's sources |
| lovegrown-com | footer "Love Grown, Inc", gorgias help portal, hive-brands Shopify store, own "Certified B Corporation" text | https://lovegrown.com/ | kept | plain curl: "Love Grown, Inc" 11 hits, hive-brands-0l6fchpwncy-copy.gorgias.help 3, hive-brands.myshopify.com 20, "Certified B Corporation" 1 |
| lovegrown-com | about-page quote | https://lovegrown.com/pages/about-love-grown | fixed | page says "We met working together on a grocery business", not "met while working together"; quote corrected |
| lovegrown-com | B Corp not counted | https://www.bcorporation.net/en-us/find-a-b-corp/company/hive-brands/ | kept | directory blocked (researcher's log), no certifications.json row; claim stays uncounted |
| overstock-com | ownership: public | 10-K https://www.sec.gov/Archives/edgar/data/1130713/000113071326000018/bbby-20251231.htm | kept | cover: common stock "BBBY" on the "New York Stock Exchange"; Wikipedia: "Public", Nasdaq NXH |
| overstock-com | parent: Neighborhood Intelligence, Inc. (former names) | EDGAR company page (CIK 1130713) | kept | "NEIGHBORHOOD INTELLIGENCE, INC."; former names Overstock.com, Inc., Beyond, Inc., Bed Bath & Beyond, Inc. (through 2026-08-14) |
| overstock-com | hq: Murray, UT | EDGAR company page; 10-K cover | kept | business address and principal offices "433 W. Ascension Way, 3rd Floor, Murray, Utah"; Wikipedia says HQ moved to Nashville in 2026, already disclosed in the body |
| overstock-com | "www.overstock.com" named as a website; partner fulfillment quote | 10-K | kept | both quotes match |
| overstock-com | marketplace: unknown | 10-K | kept | filing describes partner fulfillment and "Marketplace Services" that list partners' goods on third-party sites; neither settles whether overstock.com hosts third-party sellers |
| overstock-com | Delaware judgment 2019-06-28, ~$7.3M then $8.6M | https://www.sec.gov/Archives/edgar/data/1130713/000113071320000014/R20.htm | kept | quotes match |
| overstock-com | Delaware Supreme Court reversal, June 2020 | https://www.sec.gov/Archives/edgar/data/1130713/000113071320000053/R18.htm | kept | "reversed the judgment of the trial court in its entirety", 6 months ended 2020-06-30 (the Q1 2020 page, .../000113071320000030/R14.htm, shows the appeal still pending); reversed, so body note only |
| overstock-com | tZERO ATS SEC censure, $800,000 penalty | https://www.sec.gov/Archives/edgar/data/1130713/000113071322000009/R22.htm | kept | party is "tZERO ATS, LLC, a wholly owned subsidiary of tZERO", not the retailer; body note only |
| overstock-com | 2025 10-K names no specific government action | https://www.sec.gov/Archives/edgar/data/1130713/000113071326000018/R23.htm | kept | general litigation language, liabilities "not material" |
| overstock-com | NLRB search: no cases | https://www.nlrb.gov/search/case/Overstock | kept | "did not match any cases"; Powell's control as above |
| poshmark-com | ownership: public | https://en.wikipedia.org/wiki/Poshmark | fixed -> unknown | Type "Subsidiary", Parent "Naver Corporation"; article does not say Naver is listed; convention sentence replaced |
| poshmark-com | parent: Naver Corporation; acquired Jan 2023, US$1.2B | https://en.wikipedia.org/wiki/Poshmark | kept | quotes match |
| poshmark-com | hq: Redwood City, CA | https://en.wikipedia.org/wiki/Poshmark | kept | "Redwood City, California, U.S." |
| poshmark-com | marketplace: true | https://poshmark.com/about | kept | "a leading fashion resale marketplace powered by a vibrant, highly-engaged community of buyers and sellers" |
| poshmark-com | 10K+ brands, 90+ categories, US and Canada, sustainability quote | https://poshmark.com/about | kept | match |
| poshmark-com | CourtListener names Poshmark in private suits (Reichman; patent and trademark cases) | search page 403; opinion page empty | fixed | kept only that the search page was blocked and the one opinion page had no readable content; case descriptions from unfetched results removed |
| poshmark-com | NLRB search: no cases | https://www.nlrb.gov/search/case/Poshmark | kept | "did not match any cases"; Powell's control as above |
| powells-com | ownership: private; parent: none; hq: Portland, OR | https://en.wikipedia.org/wiki/Powell%27s_Books | kept | family-owned, owner Emily Powell, Portland, Oregon; no parent named |
| powells-com | ILWU Local 5 since 1999 | https://en.wikipedia.org/wiki/Powell%27s_Books | kept | certified March 1999 |
| powells-com | 19-CA-374772 filed 2025-10-16, Refusal to Furnish Information, Open | https://www.nlrb.gov/case/19-CA-374772 | kept | match; only a signed charge on the docket |
| powells-com | 19-CA-325057 withdrawal approved 2024-01-19 | https://www.nlrb.gov/case/19-CA-325057 | kept | match |
| powells-com | 19-CA-330248 withdrawal approved 2024-03-28 | https://www.nlrb.gov/case/19-CA-330248 | fixed | dates match, but the charging party is an individual (name redacted), not ILWU; body now says so and calls these "charges filed by others" |
| powells-com | 19-CA-288783, 19-CA-288784 dismissed 2022-03-31; appeal denied 2022-05-02 | https://www.nlrb.gov/case/19-CA-288783, https://www.nlrb.gov/case/19-CA-288784 | kept | match |
| powells-com | 36-CA-010588 filed 2009-12-02, outcome not shown | https://www.nlrb.gov/case/36-CA-010588 | kept | page shows "data is not available" for docket; no finding |
| powells-com | NLRB search list | https://www.nlrb.gov/search/case/Powell%27s%20Books | kept | 10 cases; the two not in the file (19-CB-329905, 19-CB-327287) are charges against the union, not Powell's |
| powells-com | no accepted concern | all NLRB pages above | kept | every case is a charge that is open, withdrawn or dismissed; no complaint, settlement or Board decision |

Not re-checked: the withdrawal details for 19-CA-330070 and 19-CA-330340 (the search listing confirms both are closed charges, so no concern could arise); sells_on_amazon is `unknown` in all five files, so nothing to support.

build-index: `node research/build-index.mjs` -> "index.json: 26 sites, 53 retailers", no errors.
