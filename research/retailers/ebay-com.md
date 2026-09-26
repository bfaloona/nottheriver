---
name: eBay
domain: ebay.com
type: marketplace
goods: [general merchandise, used goods, refurbished electronics, collectibles]
ownership: public
parent: none
hq: San Jose, CA
marketplace: true
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns:
  - {kind: governance, title: "eBay will pay a $3 million fine over former employees' harassment campaign", source: https://www.npr.org/2024/01/11/1224333712/ebay-stalking-settlement, date: 2024-01-11, accepted_source: true}
ethics: 0.25
environment: 0.5
tier: caution
mentions: 6
mentioned_by: [antifamarketer-org, goodgoodgood-co, moneypantry-com, sustainablejungle-com, thegoodtrade-com, vstyleblog-com]
checked: 2026-09-25
---

eBay is an online marketplace where third-party sellers offer new and used goods by auction or fixed price ("Buy It Now"), with eBay charging sellers commissions. Wikipedia describes it as a public company (NASDAQ: EBAY), founded in 1995 by Pierre Omidyar and headquartered in San Jose, California. Lists name it mainly for secondhand and refurbished goods: The Good Trade and Sustainable Jungle link to eBay Refurbished for extending the life of electronics, Good Good Good cites "eBay for Charity", and MoneyPantry cites low prices and free shipping. Antifamarketer and V Style Blog list it without a specific reason.

The governance concern is NPR's report that eBay "agreed to pay a $3 million fine to resolve criminal charges" over a 2019 harassment campaign its then-employees waged against a Massachusetts couple who wrote a newsletter about the company. NPR separately reported the 2022 sentencing of former eBay executives in the same scheme (https://text.npr.org/1126078948); that is the same incident and is not a second row.

Not counted (dismissed): the EPA's 2023-09-27 release "EPA and Justice Department File Complaint Alleging Environmental Violations by eBay" announced a DOJ complaint, filed on EPA's behalf, over alleged sales of products in violation of the Clean Air Act, FIFRA and TSCA. CourtListener's record of that case (E.D.N.Y. 1:23-cv-07173) shows an "ORDER granting 25 eBay's motion to dismiss" and a clerk's judgment on 2024-09-30; the United States appealed (2d Cir. 24-3104), filed a motion to dismiss its own appeal on 2025-04-24, and the appeals court's mandate was entered in the district case on 2025-04-25. Wikipedia says the court found the Communications Decency Act shielded eBay; the docket entries fetched do not state the ground. Under the run's rule a dismissed action is a note, not a concern; flagged for the operator.

Not scored: justice.gov pages about eBay served a bot challenge to every fetch this run, so no claim is made from them (URLs logged in raw/blocked-retailers-R2.md for the operator). NLRB's own case search lists five closed unfair labor practice charges by the Communications Workers of America against "TCGPlayer, Inc. and eBay Inc." (2023 to 2025, Region 03); each case page shows the charge closed by an approved withdrawal (03-CA-342230 also has a 2024-10-28 dismissal letter), with no complaint or settlement, so none is a concern row. The WebSearch budget ran out partway through this retailer, so ftc.gov, osha.gov and dol.gov were not searched for eBay; the concern list may be incomplete.

## Rating
- Ethics: 0.5 baseline. No verified certification. Minus 0.25 for the accepted governance concern (NPR, 2024-01-11). = 0.25
- Environment: 0.5 baseline. No verified certification. The EPA complaint is not counted because the case was dismissed (see above). = 0.5
- Total 0.75: tier `caution`.
- Blocklist: `node research/build-index.mjs --blocklist "eBay" ebay.com` returned "not on the blocklist".
- Concern search incomplete this run (see raw/blocked-retailers-R2.md); tier is provisional.

## Sources
- https://en.wikipedia.org/wiki/EBay
- https://www.npr.org/2024/01/11/1224333712/ebay-stalking-settlement (fetched as https://text.npr.org/1224333712)
- https://text.npr.org/1126078948
- https://www.epa.gov/newsreleases/epa-and-justice-department-file-complaint-alleging-environmental-violations-ebay
- https://www.nlrb.gov/search/case/ebay
- https://www.nlrb.gov/case/03-CA-322767
- https://www.nlrb.gov/case/03-CA-322768
- https://www.nlrb.gov/case/03-CA-342230
- https://www.nlrb.gov/case/03-CA-345878
- https://www.nlrb.gov/case/03-CA-366163
- https://www.courtlistener.com/docket/67832171/united-states-v-ebay-inc/ (HTML page 403; entries read via https://www.courtlistener.com/api/rest/v4/search/?q=docket_id%3A67832171&type=rd)
- https://www.courtlistener.com/docket/69431401/united-states-of-america-v-ebay-inc/ (entries read via https://www.courtlistener.com/api/rest/v4/search/?q=docket_id%3A69431401&type=rd)
