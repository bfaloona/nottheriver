# P1: how three advocacy scorecards grade retailers
Status: closed (research only; all pages read 2026-11-11)

## Answer
- Two of the three give usable per-retailer grades: Toxic-Free Future (TFF) 2024 (50 retailers, letter grades) and Climate Friendly Supermarkets (CFS) 2026 (16 grocers, percent scores). Both grade the retailer, on one narrow topic each (chemicals; refrigerants).
- The third, EIA "The Dirty Dozen" (2013), could not be read: the PDF host's certificate is expired. Its landing pages show no grades, and it is 13 years old.
- Neither TFF nor CFS grants a reuse licence. TFF says "All Rights Reserved"; CFS states nothing. Ask both before republishing grades.
- Neither domain is in `data/negative-sources.md` (checked by grep, no match for toxicfreefuture, eia, climatefriendly). Both would need a policy decision: that file lists regulators, courts, news and watchdogs, and the formula only lets a source lower a score, not raise one.
- Both are topic scores, not "ethics". They fit the environment dimension at best, and cover few shops (see chains overlap).

## 1. Toxic-Free Future, Retailer Report Card 2024
URLs: https://toxicfreefuture.org/retailer-report-card/2024/grades/ ; https://toxicfreefuture.org/retailer-report-card/2024/methodology/ ; fact sheet https://toxicfreefuture.org/wp-content/uploads/RRC-Factsheet-2024-FINAL.pdf (read 2026-11-11).

| Field | Finding |
|---|---|
| What is graded | Retailer (chain). Parent companies appear where the chain is a parent (Ahold Delhaize, Inspire Brands, Yum! Brands, TJX, Restaurant Brands International). 50 U.S. and Canadian retailers, chosen as "among the top 50 U.S. or Canadian retailers by sales" or major share of one of 13 consumer sectors. Includes restaurants. |
| Topic | Hazardous chemicals and plastics in products and packaging. Narrow. Grades say nothing on labor, climate or sourcing. |
| Criteria and points | Four elements. Total points 165 (beauty retailers) or 155 (others). Corporate Commitment 20/20; Transparency 44/40; Ban the Bad 51/45; Safer Solutions 50/50 (beauty/other). Sub-criteria: safer chemicals policy, Chemical Footprint Project participation, external collaboration, support for public policy; knowledge of chemicals, consumer disclosure, supplier accountability; scope of banned chemicals, time-bound goals, progress on priority chemicals; sale of safer products, investment, supplier transition. Sub-criterion points are in a rubric PDF the page mentions; not read. Beauty retailers can earn up to 10 bonus points. Weighted toward Ban the Bad and Safer Solutions. |
| Evidence | Public documents from 2023-2024 (sustainability reports, websites, releases, blogs) plus written replies to correspondence. Draft scores emailed to every retailer; replies adjusted scores only for written disclosures. No regulator records or own testing. |
| Scale and output | A+ to F, from percent of total possible points: A+ 91-100, A 73-90, A- 65-72, B+ 59-64, B 51-58, B- 45-50, C+ 39-44, C 31-38, C- 25-30, D+ 20-24, D 15-19, D- 10-14, F 0-9. A retailer page shows grade, total points and per-element points (example, Target: A-, 107.5 of 165, rank 3 of 50). |
| Non-response | 28 of 50 retailers (56%) responded. No separate rule: grades reflect "the policies and practices that they publicly announce or that they disclosed to the authors in response to correspondence." Confidential practices are not assessed. So silence scores low, not "unknown". |
| Year and cadence | 2024, sixth edition; earlier archived report cards 2016 to 2019 on the site; fact sheet note: raised scale from 2021. No schedule stated. No newer edition found in one search and the pages read (not proof). |
| Access and reuse | Free to read. No data file. Fact sheet PDF (English, Spanish) holds the full table. Terms of use: none found. Copyright line on the methodology page and the legal page: "© 2016-2026 Toxic‑Free Future · All Rights Reserved." (https://toxicfreefuture.org/privacy-policy-and-legal-information/). The legal page covers privacy only. |
| Overlap with `chains.json` | 14 of 50 by name: Best Buy, Costco, DICK'S Sporting Goods, Dollar General, Lowe's, Macy's, Office Depot, Publix, REI, Target, The Home Depot, Trader Joe's, Walgreens, Walmart. TJX is graded; only its HomeGoods brand is in `chains.json`. |

Table source: the fact sheet table, pages 3 to 6 (read as images). The web grades page loaded without row values in my fetch tool, so the PDF is the source. Percent columns are percent of points earned per element: CC (Corporate Commitment), TR (Transparency), BB (Ban the Bad), SS (Safer Solutions). Year 2024 for all rows.

| Company | Grade | CC | TR | BB | SS |
|---|---|---|---|---|---|
| 7-Eleven | F | 0% | 0% | 0% | 0% |
| Ahold Delhaize | F | 0% | 0% | 12% | 0% |
| Albertson's | D- | 18% | 5% | 20% | 12% |
| ALDI | D+ | 60% | 14% | 31% | 0% |
| Alimentation Couche-Tard | F | 0% | 0% | 0% | 0% |
| Amazon | C+ | 43% | 25% | 41% | 54% |
| Apple | A | 73% | 76% | 96% | 86% |
| Best Buy | C | 60% | 23% | 53% | 16% |
| Canadian Tire | D+ | 60% | 14% | 38% | 6% |
| Chipotle | F | 13% | 1% | 16% | 0% |
| Costco | C- | 48% | 23% | 37% | 12% |
| CVS Health | C- | 65% | 26% | 31% | 12% |
| Dick's Sporting Goods | D+ | 13% | 8% | 53% | 12% |
| Dollar General | D+ | 60% | 15% | 22% | 6% |
| Dollar Tree | D | 68% | 17% | 18% | 0% |
| Five Below | F | 0% | 0% | 0% | 0% |
| IKEA | B | 73% | 58% | 67% | 40% |
| Inspire Brands | F | 0% | 0% | 22% | 0% |
| Kohl's | D+ | 60% | 9% | 40% | 0% |
| Kroger | C- | 48% | 26% | 41% | 0% |
| LL Flooring (Lumber Liquidators) | F | 0% | 0% | 4% | 0% |
| Loblaw | D | 25% | 5% | 29% | 6% |
| Lowe's | C+ | 60% | 35% | 67% | 20% |
| Macy's | F | 18% | 0% | 12% | 0% |
| McDonald's | F | 0% | 5% | 24% | 0% |
| Metro | D- | 48% | 0% | 14% | 6% |
| Nordstrom | F | 0% | 5% | 24% | 0% |
| Office Depot | C- | 48% | 17% | 33% | 22% |
| Panera Bread | C- | 13% | 36% | 49% | 0% |
| PetSmart | D- | 13% | 28% | 13% | 0% |
| Publix | F | 0% | 0% | 0% | 0% |
| REI | C | 73% | 26% | 33% | 18% |
| Restaurant Brands International | D- | 13% | 0% | 31% | 0% |
| Rite Aid | C- | 58% | 32% | 41% | 6% |
| Sally Beauty | F | 0% | 0% | 0% | 0% |
| Sephora | A- | 73% | 86% | 75% | 48% |
| Sherwin-Williams | F | 0% | 0% | 0% | 0% |
| Sobeys | F | 13% | 0% | 6% | 5% |
| Staples | C- | 65% | 22% | 18% | 28% |
| Starbucks | D | 13% | 0% | 42% | 6% |
| Subway | F | 0% | 0% | 24% | 0% |
| Target | A- | 73% | 36% | 92% | 60% |
| The Home Depot | C- | 60% | 12% | 62% | 0% |
| TJX | D | 43% | 0% | 31% | 12% |
| Trader Joe's | F | 0% | 0% | 0% | 0% |
| Ulta Beauty | B- | 60% | 69% | 53% | 20% |
| Walgreens | C | 60% | 36% | 57% | 6% |
| Walmart | A- | 100% | 54% | 75% | 50% |
| Whole Foods Market | B | 80% | 67% | 75% | 20% |
| Yum! Brands | F | 13% | 0% | 22% | 0% |

My judgment, ideas to copy:
- Publish the rubric and show each shop's points by element, so a reader sees why.
- Send each company its draft score before publishing and say how many answered.
- Letter bands show fast; but a raised scale (2024 vs 2021) breaks year-to-year comparison, so label the edition year on every grade.

## 2. Climate Friendly Supermarkets scorecard (EIA), 2026 US
URLs: https://www.climatefriendlysupermarkets.org/scorecard ; https://www.climatefriendlysupermarkets.org/scorecard-faq ; /technology-adoption ; /refrigerant-management ; /engaging-in-industry-and-policy-dialogue (read 2026-11-11).

| Field | Finding |
|---|---|
| What is graded | Retailer/parent (grocers). 16 largest U.S. food retailers by retail sales; the FAQ also lists 5 large Canadian ones (separate scorecard, not read). |
| Topic | Refrigerant climate impact in stores. Narrow. |
| Criteria | Three categories: Technology Adoption, Refrigerant Management, Policy & Commitments. Points: not stated on the pages read; the page says total points "remains the same as previous editions" and that 2026 weighting changed (less credit for mid-GWP technology and ultra-low GWP standalone equipment; more for refrigerant management, policy, and rapid HFC transition in new and retrofitted stores). Practices named without weights: leak-rate target under 10% (best-in-class under 5%), leak detection, public leak-rate disclosure, reclaim or destroy recovered refrigerant, HFC phase-out by 2035 with 50% cut by 2030, HFC-free new stores and standalone units, membership in EPA GreenChill, NASRC (North American Sustainable Refrigeration Council), UL, ASHRAE. GWP bands: ultra-low below 10, medium 150 to 1,400, high above 1,400. |
| Evidence | Questionnaire sent to companies two months before publication; for non-responders, "best available information": ESG reports, industry articles, map submissions, public records, press releases. Draft shared three weeks before publication. |
| Scale and output | Percent, overall and per category. No letter grades shown. Example: ALDI 72% overall (Technology 68%, Refrigerant 46%, Policy 88%). |
| Non-response | Scored on public information only, no extra penalty described. Listed non-responders: Whole Foods, Target, Costco, Walmart, Publix, H-E-B, Albertsons, Giant Eagle, Trader Joe's, Wegmans, Wakefern, Winn Dixie. |
| Year and cadence | 2026 US (fourth US scorecard; earlier US editions 2020, 2022, 2024; Canada 2022 to 2026). Biennial. Publication date inside 2026: not found. Newer edition: none listed. |
| Access and reuse | Free to read. No download or data file. No copyright line or terms found on any page read. Only text: "EIA gives no warranties as to accuracy or completeness for any particular technology or company." |
| Overlap with `chains.json` | 6 of 16: Costco, H-E-B, Publix, Target, Trader Joe's, Walmart. Albertsons (not in `chains.json`) owns Safeway (in `chains.json`); that tie comes from my knowledge, not these pages. |

| Company | Overall | Technology | Refrigerant | Policy | Year |
|---|---|---|---|---|---|
| ALDI | 72% | 68% | 46% | 88% | 2026 |
| Whole Foods | 50% | 50% | 27% | 63% | 2026 |
| Ahold Delhaize | 46% | 44% | 27% | 50% | 2026 |
| Target | 45% | 42% | 46% | 25% | 2026 |
| Kroger | 44% | 36% | 36% | 63% | 2026 |
| Costco | 38% | 38% | 32% | 31% | 2026 |
| Meijer | 34% | 18% | 68% | 31% | 2026 |
| Walmart | 28% | 25% | 21% | 38% | 2026 |
| Publix | 28% | 27% | 21% | 25% | 2026 |
| H-E-B | 26% | 35% | 0% | 6% | 2026 |
| Albertsons | 21% | 21% | 0% | 31% | 2026 |
| Giant Eagle | 17% | 15% | 0% | 44% | 2026 |
| Trader Joe's | 17% | 23% | 0% | 0% | 2026 |
| Wegmans | 17% | 24% | 0% | 0% | 2026 |
| Wakefern | 17% | 21% | 11% | 0% | 2026 |
| Winn Dixie (formerly SEG) | 0% | 0% | 0% | 0% | 2026 |

Order is page order; the page shows no rank numbers.

My judgment, ideas to copy:
- Three plain categories with a percent each is easy to explain and easy to recheck.
- Separating "answered the questionnaire" from "scored on public info" is honest. Showing which row is which on our page would help.
- Biennial cadence means a stored grade carries a visible expiry year.

## 3. EIA, The Dirty Dozen (2013)
PDF https://content.eia-global.org/assets/2013/10/The_Dirty_Dozen.pdf: BLOCKED (fetch error "certificate has expired"; I did not work around it). Everything below comes from other pages, read 2026-11-11, and is partial.

| Field | Finding |
|---|---|
| What is graded | A survey of "a dozen of the largest and most important US supermarket chains and retailers" (https://www.climatefriendlysupermarkets.org/dirty-dozen ; https://old-vp-site.eia-global.org/reports/the-dirty-dozen-how-your-local-supermarket-is-killing-the-climate). Whether the PDF gives grades or scores: not found on the pages read. |
| Chain list | Not on those pages. A web search summary (trade press, not checked against the PDF) names: AholdUSA, Costco, Delhaize, HEB, Kroger, Meijer, Publix, Safeway, Supervalu, Target, Walmart, Whole Foods. Treat as unverified. Year 2013. |
| Topic | HFC leaks from refrigeration and HFC phase-out plans. Narrow. |
| Criteria, evidence, scale | Landing pages say only that EIA surveyed retailers on "what policies and actions were being taken" to reduce leaks and phase out HFCs. Points, weights, scale: not found on the pages read. |
| Non-response | not found on the pages read |
| Year and cadence | 2013 (published October 2013). Follow-up "Beyond the Dirty Dozen" (2015, per search results). Superseded by the scorecards in section 2. |
| Access and reuse | Free to read. Footer on the EIA archive page: "Copyright 2015 Environmental Investigation Agency." No licence text found. |
| Overlap with `chains.json` | 6 of the unverified 12: Costco, H-E-B, Publix, Safeway, Target, Walmart. |

## Comparison

| | TFF 2024 | CFS 2026 | Dirty Dozen 2013 |
|---|---|---|---|
| Graded | 50 retailers/parents | 16 grocers | 12 chains (unverified list) |
| Topic | Chemicals, plastics | Refrigerants | Refrigerant HFCs |
| Output | A+ to F, element percents | Percent, 3 categories | Unknown |
| Points published | Totals and 4 elements; rubric PDF not read | No | No |
| Non-responder | Public info, low score | Public info | Not found |
| Responders | 28 of 50 | Not stated | Not found |
| Last edition | 2024 (6th) | 2026 (4th US) | 2013 |
| Reuse terms | All Rights Reserved | None stated | Copyright 2015 notice |
| In `chains.json` | 14 | 6 | 6 (unverified) |

## Blocked pages for the operator to open
- https://content.eia-global.org/assets/2013/10/The_Dirty_Dozen.pdf : want the chain list, any grades, survey method, non-responder handling, copyright page.
- TFF scoring rubric PDF (linked from https://toxicfreefuture.org/retailer-report-card/2024/methodology/, URL not captured): want sub-criterion points.
- Terms or permission: neither TFF nor EIA states one. Operator could email both asking for permission to republish grades with attribution.

## Leads
Grade, certify or collect data on US retailers (topic in brackets). Mentioned by the pages read; none opened.

| Lead | Where mentioned | Notes |
|---|---|---|
| EPA GreenChill Partnership (refrigerant leaks, supermarkets) | CFS refrigerant and policy pages | Government program; might be a regulator-grade source for the site |
| Chemical Footprint Project (company chemical management) | TFF methodology | Corporate benchmark |
| ChemFORWARD "Know Better Do Better" (chemical hazard data for beauty retailers) | TFF fact sheet | Database, not a retailer grade |
| Campaign for Healthier Solutions, Safer States, Defend Our Health, Environmental Defence (Canada) | TFF fact sheet | Partners; whether they publish retailer data: not found |
| TFF earlier report cards 2016 to 2019 (archived PDFs) | TFF Target retailer page | History of the same grades |
| CFS earlier scorecards: US 2020, 2022, 2024; Canada 2022, 2024, 2026 | CFS site navigation | Canada out of scope |
| CFS Company Actions and Map pages; Leaking Havoc series; Search, Reuse & Destroy; 2019 Assessment | https://www.climatefriendlysupermarkets.org/engaging-in-industry-and-policy-dialogue | Company Actions and Map may hold per-store or per-company data; not read |
| NASRC (membership group) | CFS policy page | Membership, not a grade |
