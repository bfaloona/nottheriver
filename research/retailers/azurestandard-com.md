---
name: Azure Standard
domain: azurestandard.com
type: grocer
goods: [food, produce, household]
ownership: unknown
parent: unknown
hq: Dufur, OR
marketplace: unknown
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns:
  - {kind: labor, title: "Inspection Detail | Occupational Safety and Health Administration", source: "https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1574338.015", date: 2022-03-10, accepted_source: true}
  - {kind: labor, title: "Inspection Detail | Occupational Safety and Health Administration", source: "https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1647478.015", date: 2023-03-08, accepted_source: true}
  - {kind: labor, title: "Inspection Detail | Occupational Safety and Health Administration", source: "https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1665055.015", date: 2023-05-26, accepted_source: true}
ethics: 0
environment: 0.5
tier: caution
mentions: 2
mentioned_by: [amazonalts-org, sustainablejungle-com]
checked: 2026-09-25
---

Azure Standard sells organic and non-GMO food, produce and household goods ("Organic, non-GMO Food and Produce Delivered", its site title), delivered to community drop points (the site menu has "Find A Drop" and drop-coordinator pages). The site footer gives its address as 79709 Dufur Valley Road, Dufur, OR. Its about, history and terms pages render their text in the browser from a content system, so a plain fetch returned no ownership or founding details; ownership, parent and whether outside sellers list on the site are left `unknown`. Lists recommend it for organic bulk food "connecting directly with independent growers and producers" (sustainablejungle-com) and "organic bulk food and natural household items" (amazonalts-org).

Company entity: the OSHA records below are for "Azure Farms Inc" at 500 Azure Ln, Moro, OR (NAICS 493190, warehousing). The tie to Azure Standard comes from a federal patent suit, Landmark Technology, LLC v. Azure Farms, Inc. (D. Or. 3:18-cv-01568, filed 2018-08-24). Its complaint says, "on information and belief", that Azure Farms, Inc. is an Oregon company "with a principal place of business located at 79709 Dufur Valley Road, Dufur, Oregon 97021" that sells through "the Internet website located at http://www.azurestandard.com"; that is the same street address as the Azure Standard site footer. An exhibit is titled "Sample Infringement of U.S. Patent No. 6,289,319 by Azure Standard". The suit itself is a patent claim with no finding and is not a concern.

OSHA (Oregon state plan) inspections of Azure Farms Inc: eight since 2017. Counted as concerns, each inspection whose citations carried a penalty: opened 2021-12-15, citations issued 2022-03-10, 3 serious and 8 other-than-serious, total penalty $1,800; opened 2022-12-30, issued 2023-03-08, 1 other-than-serious, $1,000; opened 2023-04-17, issued 2023-05-26, 2 serious and 4 other-than-serious, $570. Also cited with no penalty (not counted): opened 2017-03-08, 3 other-than-serious; opened 2025-04-25, 1 other-than-serious. Three more inspections (2020, October 2025, January 2026) list no violations. Counting the zero-penalty ones would not change the score, since ethics is already at its floor.

## Rating
- Amazon-owned: no (`build-index.mjs --blocklist` reports "not on the blocklist").
- Ethics: 0.5 baseline. No ethics certification found (bcorporation.net blocked agents this run; no row in `data/certifications.json` for this domain). −0.25 × 3 accepted labor concerns (osha.gov) = −0.75, floored at 0. Result 0.
- Environment: 0.5 baseline. No environmental certification found: The Climate Label's brand sitemap (310 brand pages) has no Azure Standard entry, and the 1% for the Planet directory renders no text to a fetch (no row in `data/certifications.json`). No environmental concern. Result 0.5.
- Tier: ethics + environment = 0.5 < 1.0: `caution`.
- Concern search incomplete this run (see raw/blocked-retailers-R9.md); tier is provisional.

## Sources
- https://www.azurestandard.com/about (site title, footer address, menu; body rendered client-side)
- https://www.azurestandard.com/about-us
- https://www.azurestandard.com/azure-life/blog/our-hearts-beat-for-healthy-food/29r2mKkb90WRryvL (no body text rendered)
- https://www.azurestandard.com/sitemap-static.xml
- https://en.wikipedia.org/wiki/Azure_Standard (404)
- https://www.osha.gov/ords/imis/establishment.search?p_logger=1&establishment=Azure&State=OR&officetype=all&Office=all&sitezip=&p_case=all&p_violations_exist=all&startmonth=01&startday=01&startyear=2010&endmonth=09&endday=25&endyear=2026
- https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1574338.015
- https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1647478.015
- https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1665055.015
- https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1820868.015
- https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1216088.015
- https://www.courtlistener.com/api/rest/v4/search/?q=%22Azure%20Standard%22&type=r (Landmark Technology v. Azure Farms docket entries and Exhibit G text)
- https://storage.courtlistener.com/recap/gov.uscourts.ord.139619/gov.uscourts.ord.139619.1.0.pdf (Landmark v. Azure Farms complaint: Azure Farms' principal place of business and website)
- https://explore.changeclimate.org/sitemap.xml
- data/blocklist.md
