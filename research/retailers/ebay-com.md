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
  - {kind: environmental, title: "EPA and Justice Department File Complaint Alleging Environmental Violations by eBay", source: https://www.epa.gov/newsreleases/epa-and-justice-department-file-complaint-alleging-environmental-violations-ebay, date: 2023-09-27, accepted_source: true}
ethics: 0.25
environment: 0.25
tier: caution
mentions: 6
mentioned_by: [antifamarketer-org, goodgoodgood-co, moneypantry-com, sustainablejungle-com, thegoodtrade-com, vstyleblog-com]
checked: 2026-09-25
---

eBay is an online marketplace where third-party sellers offer new and used goods by auction or fixed price ("Buy It Now"), with eBay charging sellers commissions. Wikipedia describes it as a public company (NASDAQ: EBAY), founded in 1995 by Pierre Omidyar and headquartered in San Jose, California. Lists name it mainly for secondhand and refurbished goods: The Good Trade and Sustainable Jungle link to eBay Refurbished for extending the life of electronics, Good Good Good cites "eBay for Charity", and MoneyPantry cites low prices and free shipping. Antifamarketer and V Style Blog list it without a specific reason.

The governance concern is NPR's report that eBay "agreed to pay a $3 million fine to resolve criminal charges" over a 2019 harassment campaign its then-employees waged against a Massachusetts couple who wrote a newsletter about the company. NPR separately reported the 2022 sentencing of former eBay executives in the same scheme (https://text.npr.org/1126078948); that is the same incident and is not a second row. The environmental concern is the EPA's 2023 release announcing a complaint "alleging" that eBay sold aftermarket defeat devices, pesticides and methylene chloride products. Wikipedia says the court later dismissed that case on Communications Decency Act grounds; the row stays because the rule counts the accepted source's record of the action, and the dismissal is noted here.

Not scored: justice.gov lists a 2025 release "eBay to Pay $59 Million to Settle Controlled Substances Act Allegations Related to Pill Presses Sold Through its Website" and a 2012 to 2014 antitrust "no poach" settlement, but justice.gov served a bot challenge to every fetch this run, so no claim is made from those pages (logged in raw/blocked-retailers-R2.md). NLRB's own case search lists five closed unfair labor practice charges against "TCGPlayer, Inc. and eBay Inc." (2023 to 2025, Region 03); the one opened, 03-CA-322767, shows the union's charge withdrawn with the General Counsel's approval on 2024-03-11, so none is a concern row. The WebSearch budget ran out partway through this retailer, so ftc.gov, osha.gov and dol.gov were not searched for eBay; the concern list may be incomplete.

## Rating
- Ethics: 0.5 baseline. No verified certification. Minus 0.25 for the accepted governance concern (NPR, 2024-01-11). = 0.25
- Environment: 0.5 baseline. No verified certification. Minus 0.25 for the accepted environmental concern (EPA, 2023-09-27). = 0.25
- Total 0.5, with accepted concerns in the last 5 years: tier `caution`.
- Blocklist: `node research/build-index.mjs --blocklist "eBay" ebay.com` returned "not on the blocklist".

## Sources
- https://en.wikipedia.org/wiki/EBay
- https://www.npr.org/2024/01/11/1224333712/ebay-stalking-settlement (fetched as https://text.npr.org/1224333712)
- https://text.npr.org/1126078948
- https://www.epa.gov/newsreleases/epa-and-justice-department-file-complaint-alleging-environmental-violations-ebay
- https://www.nlrb.gov/search/case/ebay
- https://www.nlrb.gov/case/03-CA-322767
