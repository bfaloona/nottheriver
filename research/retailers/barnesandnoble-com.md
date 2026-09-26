---
name: Barnes & Noble
domain: barnesandnoble.com
type: retailer
goods: [books, magazines, toys, games, stationery, music, movies]
ownership: private
parent: Elliott (Elliott Investment Management)
hq: New York, NY
marketplace: unknown
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns:
  - {kind: labor, title: "Inspection Detail | Occupational Safety and Health Administration", source: "https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1700421.015", date: 2024-03-01, accepted_source: true}
ethics: 0.25
environment: 0.5
tier: caution
mentions: 3
mentioned_by: [dollarsprout-com, moneypantry-com, techradar-com]
checked: 2026-09-25
---

Barnes & Noble is a US bookseller with about 600 stores and an online shop, selling books, magazines, toys, games, stationery and music and film, with Starbucks-supplied cafés in its stores. Wikipedia states that "On August 7, 2019, Barnes & Noble became a privately held, wholly owned subsidiary of Elliott"; its CEO is James Daunt and it is headquartered at Union Square, New York City. Ownership is recorded as `private` because that is the source's word; Elliott is an investment firm, so readers may treat this as investor ownership. It is not on the Amazon blocklist. Barnes & Noble Education (bned.com, the college-bookstore operator) is a separate company and was not researched here.

List sites recommend it as the mainstream book alternative: DollarSprout calls it "the go-to retailer for books" with "over 600 bookstores throughout the U.S.", MoneyPantry cites its selection, free shipping over $35 and membership discounts, and TechRadar names it only in a US books summary line. Whether barnesandnoble.com hosts third-party sellers, or sells through Amazon, was not shown by any page fetched this run.

Labor notes (not scored). NLRB dockets fetched this run show unfair labor practice charges filed against Barnes & Noble, but none records an action by the Board: case 02-CA-347822 (Barnes & Noble Union Square, charge filed 2024-08-05 by the Retail, Wholesale and Department Store Union, "8(a)(5) Refusal to Furnish Information", status Open) and case 32-CA-024363 (Barnes & Noble Distribution, Reno, filed 2009-03-04, closed; the docket shows an abeyance letter and no disposition). An open or closed charge with no complaint, settlement or finding is not a concern under this run's rules. NLRB representation (RC) cases found in search are union elections, not wrongdoing. Good Jobs First's Violation Tracker returned HTTP 403 and was logged for the operator.

OSHA. The establishment search (2016 to 2026, violations only) returned five "Barnes & Noble" inspections. One is recorded as an accepted concern: inspection 1700421.015 at 1 Barnes and Noble Way, Monroe Township, NJ, where OSHA issued a serious citation on 2024-03-01 (forklift standard) with a current penalty of $13,828. Two others ended in citations with no penalty and are noted, not scored, under the rule used for this batch (a citation counts when OSHA attached a penalty): Monroe Township, NJ (1642640.015, cited 2023-02-21) and Spokane Valley, WA (1484432.015, cited 2020-07-30). The remaining two are Barnes & Noble College Booksellers sites (Barnes & Noble Education, a separate company) and were not used.

## Rating
- Ethics: 0.5 baseline. No B Corp, Fair Trade or worker co-op certification verified (bcorporation.net returned 403; no data/certifications.json row for this domain). One accepted labor concern (osha.gov, 2024-03-01): 0.5 − 0.25 = 0.25. Ethics 0.25.
- Environment: 0.5 baseline. No 1% for the Planet or Climate Label listing verified. No environmental concern. Environment 0.5.
- Tier: 0.25 + 0.5 = 0.75, below the `acceptable` floor of 1.0. Tier `caution`.
- Concern search incomplete this run (see raw/blocked-retailers-R5.md); tier is provisional.

## Sources
- DOL open data (robots-allowed): OSHA inspection 347004210 matches osha.gov 1700421.015 by establishment, issue date and penalty (research/raw/osha-dol/347004210.json)
- https://en.wikipedia.org/wiki/Barnes_%26_Noble
- https://www.nlrb.gov/case/02-CA-347822
- https://www.nlrb.gov/case/32-CA-024363
- https://www.osha.gov/ords/imis/establishment.search?p_logger=1&establishment=barnes+%26+noble&State=all&officetype=all&Office=all&sitezip=&p_case=all&p_violations_exist=yes&startmonth=01&startday=01&startyear=2016&endmonth=09&endday=25&endyear=2026
- https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1700421.015
- https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1642640.015
- https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1484432.015
- https://violationtracker.goodjobsfirst.org/?company=barnes+%26+noble (HTTP 403, logged in raw/blocked-retailers-R5.md)
- https://www.bcorporation.net/en-us/find-a-b-corp/?query=better%20world%20books (a query for another retailer in batch R5; its HTTP 403 shows the directory blocked agents; logged)
- data/blocklist.md (not on the blocklist: `build-index.mjs --blocklist`)
- research/sites/dollarsprout-com.md, research/sites/moneypantry-com.md, research/sites/techradar-com.md (reasons)
