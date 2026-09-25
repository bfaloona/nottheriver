---
name: Costco
domain: costco.com
type: retailer
goods: [groceries, household, electronics, clothing, pharmacy, gasoline]
ownership: public
parent: none
hq: Issaquah, WA
marketplace: unknown
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns:
  - {kind: labor, title: "Inspection: 1763330.015 - Costco Wholesale", source: "https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1763330.015", date: 2024-12-06, accepted_source: true}
  - {kind: labor, title: "Inspection: 1640222.015 - Costco Wholesale Corp #781", source: "https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1640222.015", date: 2023-03-15, accepted_source: true}
  - {kind: labor, title: "Inspection: 1356334.015 - Costco Wholesale Corporation", source: "https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1356334.015", date: 2019-03-05, accepted_source: true}
  - {kind: labor, title: "Costco Wholesale Corp.", source: "https://www.nlrb.gov/case/01-CA-355597", date: 2025-08-12, accepted_source: true}
  - {kind: governance, title: "$14M Costco Settlement Resolves Class Action Lawsuit Over Promo Emails With Allegedly Misleading Subject Lines", source: "https://www.classaction.org/news/14m-costco-settlement-resolves-class-action-lawsuit-over-promo-emails-with-allegedly-misleading-subject-lines", date: 2026-07-22, accepted_source: false}
ethics: 0
environment: 0.5
tier: caution
mentions: 2
mentioned_by: [fairtradecertified-org, vstyleblog-com]
checked: 2026-09-25
---

Costco is a membership-only warehouse club selling groceries, household goods and other general merchandise, with gas stations, pharmacies and optical centers. It is a public company (NASDAQ: COST) headquartered in Issaquah, Washington, and Wikipedia counts 924 warehouses as of November 2025. Wikipedia also records a 2023 Teamsters union win at its Norfolk, Virginia warehouse and a January 2025 strike authorization vote by Teamsters representing more than 18,000 Costco employees. Neither Wikipedia nor any other page fetched this run says whether costco.com hosts third-party sellers or whether Costco sells through Amazon, so both are `unknown`.

Lists name it for its treatment of workers and its DEI stance (vstyleblog) and as a retailer where Fair Trade Certified products can be bought (Fair Trade USA's shop page). That Fair Trade USA tile sits in the page's retailer group, as a place that carries "brands that offer Fair Trade Certified products"; it does not certify Costco itself, so no `fair_trade` certification is counted. Good Jobs First's Violation Tracker page for Costco returned HTTP 403 and is logged in `research/raw/blocked-retailers-R10.md`.

Concerns, in the sources' own terms:
- OSHA inspection 1763330.015 (Overland Park, KS): one "Other" citation issued 2024-12-06, current penalty $9,403, resolved by formal settlement; case closed 2025-08-28.
- OSHA inspection 1640222.015 (Chula Vista, CA, store #781): six citations issued 2023-03-15; three deleted (including the one "Serious" item) and three "Other" citations remain, current penalty $1,330; case closed 2026-03-25.
- OSHA inspection 1356334.015 (Tracy, CA): five citations issued 2019-03-05; three deleted (including the "Serious" item) and two "Other" citations remain, current penalty $560; case closed 2019-09-03.
- NLRB case 01-CA-355597 (Milford, CT): an "8(a)(1) Coercive Rules" charge filed 2024-11-27; the NLRB General Counsel issued a complaint and notice of hearing on 2025-08-12, and the case is open. This is an allegation, not a finding.
- Class action Aaland v. Costco over emails sent to Washington residents (emails with "allegedly misleading subject lines"): Costco agreed to a $14 million settlement without admitting wrongdoing; final approval hearing set for 2026-10-02. The source (classaction.org) is not an accepted source, so it does not change the score.

These are a sample, not a full count: an NLRB case search for "costco" returns 180 cases, of which only the six named here were opened, and an OSHA establishment search for "costco" (2016 to 2026-09-25) lists 302 inspections, of which only the five named here were opened.

Checked and not recorded: NLRB cases 03-CA-356842 and 03-CA-355134 (Brighton, NY) were dismissed in 2025, and 25-CA-344136 (Morris, IL) got a merit dismissal letter on 2026-04-07. OSHA inspection 1670176.015 (San Marcos, CA) had both citations deleted. OSHA inspection 1368205.015 (Monrovia, MD) shows an accident investigation but no citations. Cases 31-CB-173898 and 22-CB-284296 are charges against Teamsters locals, not against Costco. A CourtListener search lists Costco Wholesale Corporation among the defendants in California Department of Toxic Substances Control v. Calistoga Holdings, LLC (N.D. Cal., filed 2026-09-03); the docket returned HTTP 403, so what is alleged is unknown and nothing is recorded.

## Rating
- Blocklist: `node research/build-index.mjs --blocklist "Costco" costco.com` says not on the blocklist, so `amazon_owned: false`.
- Certifications: none verified. Fair Trade USA lists Costco as a retailer that carries certified products, not as a certified company.
- Ethics: 0.5 start, no certifications, minus 4 accepted labor concerns (3 OSHA inspection pages, 1 NLRB case page) × 0.25 = −1.0, floored at 0.
- Environment: 0.5 start, no certifications, no environmental concerns = 0.5.
- Tier: ethics + environment = 0.5, below 1.0, so `caution`. It also has accepted concerns in the last 5 years.
- The four concerns are a sample of many cases: NLRB lists 180 cases and OSHA 302 inspections for "costco", and only a handful were opened. Each OSHA concern is one closed inspection with at least one surviving citation that carries a penalty.
- Concern search incomplete this run (see raw/blocked-retailers-R10.md); tier is provisional.

## Sources
- https://en.wikipedia.org/wiki/Costco
- https://www.fairtradecertified.org/our-community/shop-fair-trade/
- https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1763330.015
- https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1640222.015
- https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1356334.015
- https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1670176.015
- https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1368205.015
- https://www.nlrb.gov/case/01-CA-355597
- https://www.nlrb.gov/case/03-CA-356842
- https://www.nlrb.gov/case/03-CA-355134
- https://www.nlrb.gov/case/25-CA-344136
- https://www.nlrb.gov/case/31-CB-173898
- https://www.nlrb.gov/case/22-CB-284296
- https://www.nlrb.gov/search/case/costco
- https://www.osha.gov/ords/imis/establishment.search?establishment=costco&state=all&officetype=all&Office=all&sitezip=&startmonth=01&startday=01&startyear=2016&endmonth=09&endday=25&endyear=2026&p_case=all&p_violations_exist=all
- https://www.classaction.org/news/14m-costco-settlement-resolves-class-action-lawsuit-over-promo-emails-with-allegedly-misleading-subject-lines
- https://www.courtlistener.com/api/rest/v4/search/?q=%22Costco+Wholesale%22+settlement&type=r&order_by=dateFiled+desc
- data/blocklist.md (checked: no matching entry)
