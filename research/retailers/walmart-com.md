---
name: Walmart
domain: walmart.com
type: retailer
goods: [general-merchandise, grocery, electronics, pharmacy, home, apparel]
ownership: public
parent: none
hq: Bentonville, AR
marketplace: true
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns:
  - {kind: governance, title: "Walmart Agrees to Pay $50 Million for Illegally Filling Unlawful Opioid Prescriptions", source: https://www.justice.gov/opa/pr/walmart-agrees-pay-50-million-illegally-filling-unlawful-opioid-prescriptions, date: 2026-08-28, accepted_source: true}
  - {kind: governance, title: "Federal Trade Commission v. Walmart Inc.", source: https://storage.courtlistener.com/recap/gov.uscourts.ilnd.416367/gov.uscourts.ilnd.416367.105.0.pdf, date: 2025-06-23, accepted_source: true}
  - {kind: labor, title: "United States Equal Employment Opportunity Commission v. Walmart, Inc.", source: https://storage.courtlistener.com/recap/gov.uscourts.iasd.78754/gov.uscourts.iasd.78754.82.0.pdf, date: 2024-01-11, accepted_source: true}
  - {kind: environmental, title: "United States v. Wal-Mart Stores, Inc.", source: https://www.courtlistener.com/api/rest/v4/search/?q=docket_id%3A6250398&type=rd&format=json, date: 2013-06-04, accepted_source: true}
ethics: 0
environment: 0.25
tier: caution
mentions: 4
mentioned_by: [fairtradecertified-org, moneypantry-com, pcworld-com, techradar-com]
checked: 2026-09-25
---

Walmart is an "American multinational omnichannel retail corporation" headquartered in Bentonville, Arkansas, running hypermarkets, discount stores, grocery stores, pharmacies and gas stations (Wikipedia). It trades on Nasdaq as WMT (moved from NYSE in December 2025), and Wikipedia says the Walton family owns "over 50 percent of Walmart through both their holding company Walton Enterprises and their individual holdings"; `ownership` is `public` because the shares are listed. Walmart Marketplace lets outside sellers sell through Walmart, paying "a competitive referral rate on items sold" (marketplace.walmart.com), so `marketplace` is true. No fetched source says whether Walmart sells through Amazon's marketplace.

Lists name it as the obvious big-box alternative: wide selection, Walmart+, free shipping over $35, ship-to-store (moneypantry-com, pcworld-com, techradar-com; techradar adds that "shopping with one massive sales conglomerate might rather defeat the object"). Fair Trade USA's shop page lists "Walmart" and "Walmart Canada" in its brand directory as retailers that carry Fair Trade Certified products; that shows it stocks certified goods, not that the company is certified, so it is not counted (data/certifications.json has no row for walmart.com either).

Certifications: none. B Corp not checked per retailer (bcorporation.net returned HTTP 403 earlier this run; logged); no data/certifications.json row for walmart.com.

Concerns (all from accepted sources; verbs are the sources'):
- governance, justice.gov, 2026-08-28: Walmart "agreed to pay" $50 million "to resolve allegations" that its pharmacies filled invalid opioid prescriptions; the release says "The claims resolved by the settlement are allegations only; there has been no determination of liability." The matching D. Del. case (*United States v. Walmart Inc.*, filed 2020-12-22) was closed by stipulation of dismissal on 2026-08-27; not recorded separately.
- governance, CourtListener, 2025-06-23: in *Federal Trade Commission v. Walmart Inc.* (N.D. Ill., filed 2022-06-28) the court entered a "STIPULATED ORDER FOR INJUNCTION AND MONETARY JUDGMENT"; the court called the stipulation "a reasonable compromise of this litigation". The order says the complaint charges unfair or deceptive practices under the FTC Act and the Telemarketing Sales Rule "in the course of providing money transfer services", and that Walmart "neither admits nor denies any of the allegations".
- labor, CourtListener, 2024-01-11: in *United States Equal Employment Opportunity Commission v. Walmart, Inc.* (S.D. Iowa, nature of suit "Civil Rights: Jobs") the court entered a "CONSENT JUDGMENT in favor of United States Equal Employment Opportunity Commission against Wal-Mart Stores East, LP, Walmart, Inc."
- environmental, CourtListener, 2013-06-04: in *United States v. Wal-Mart Stores, Inc.* (W.D. Mo., 4:13-cr-00135) "The defendant entered a plea of guilty to Count(s) One of the Information"; the judgment imposed an $11,000,000 fine, with $3,000,000 to "the Missouri Department of Natural Resources Hazardous Waste Program". Environmental kind is taken from that payment line. Wal-Mart Stores, Inc. was this company's name from 1970 until it became Walmart Inc. on February 1, 2018 (Wikipedia). Related 2013 criminal dockets in C.D. Cal. and N.D. Cal. (plea agreement; "payment of Fine in the amount of $40,000,000.00") don't state their subject in the entries read, so they are not recorded.

Not recorded: a second FTC case (*Federal Trade Commission v. WALMART INC.*, N.D. Cal., filed 2026-02-26 with several states, closed 2026-03-03 by "Order on Stipulation"; subject not shown in entries read), an April 2022 *United States v. WALMART INC.* docket in D.D.C. (filed and closed 2022-04-08; subject not shown), an open 2025 EEOC disability case in N.D. Cal. (no outcome yet), and a DOJ Foreign Corrupt Practices Act resolution (press release returned an empty page; logged). CourtListener docket pages return HTTP 403 to fetches, so the docket entries above were read through CourtListener's search API (URLs below).

Concern sources for court cases are the judgment PDFs on storage.courtlistener.com, or the CourtListener search API where no PDF is stored; the docket pages (listed in Sources) return HTTP 403 to fetches.

## Rating
- ethics: start 0.5; no verified ethics certification; −0.25 governance (justice.gov opioid settlement); −0.25 governance (FTC stipulated order); −0.25 labor (EEOC consent judgment); floored at 0; = 0
- environment: start 0.5; no verified environment certification; −0.25 environmental (2013 W.D. Mo. guilty plea); = 0.25
- tier: not on the blocklist (`--blocklist "Walmart" walmart.com`: "not on the blocklist"); ethics + environment = 0.25 < 1.0, so `caution`.
- Concern search incomplete this run (see raw/blocked-retailers-R4.md); tier is provisional.

## Sources
- https://en.wikipedia.org/wiki/Walmart
- https://en.wikipedia.org/w/api.php?action=parse&page=Walmart&prop=externallinks&format=json
- https://en.wikipedia.org/w/api.php?action=parse&page=Criticism_of_Walmart&prop=externallinks&format=json
- https://marketplace.walmart.com/
- https://www.fairtradecertified.org/shop-fair-trade/
- https://www.justice.gov/opa/pr/walmart-agrees-pay-50-million-illegally-filling-unlawful-opioid-prescriptions
- https://www.justice.gov/archives/opa/pr/walmart-inc-and-brazil-based-subsidiary-agree-pay-137-million-resolve-foreign-corrupt (empty page returned)
- https://www.courtlistener.com/api/rest/v4/search/?q=caseName%3A%28%22Federal+Trade+Commission%22+AND+Walmart%29&type=r&format=json&order_by=dateFiled+desc
- https://www.courtlistener.com/api/rest/v4/search/?q=caseName%3A%28%22United+States%22+AND+%22Walmart+Inc%22%29&type=r&format=json&order_by=dateFiled+desc
- https://www.courtlistener.com/api/rest/v4/search/?q=caseName%3A%28%22United+States%22+AND+%22Wal-Mart+Stores%22%29&type=r&format=json&order_by=dateFiled+desc
- https://www.courtlistener.com/api/rest/v4/search/?q=docket_id%3A63554833+&type=rd&format=json&order_by=entry_date_filed+desc
- https://www.courtlistener.com/api/rest/v4/search/?q=docket_id%3A62985776+&type=rd&format=json&order_by=entry_date_filed+desc
- https://www.courtlistener.com/api/rest/v4/search/?q=docket_id%3A6250398&type=rd&format=json
- https://storage.courtlistener.com/recap/gov.uscourts.ilnd.416367/gov.uscourts.ilnd.416367.105.0.pdf
- https://storage.courtlistener.com/recap/gov.uscourts.iasd.78754/gov.uscourts.iasd.78754.82.0.pdf
- https://www.courtlistener.com/api/rest/v4/search/?q=docket_id%3A19797673+&type=rd&format=json&order_by=entry_date_filed+desc
- https://www.courtlistener.com/api/rest/v4/search/?q=docket_id%3A72332394+&type=rd&format=json&order_by=entry_date_filed+asc
- https://www.courtlistener.com/api/rest/v4/search/?q=docket_id%3A4180072+&type=rd&format=json&order_by=entry_date_filed+asc
- https://www.courtlistener.com/docket/63554833/federal-trade-commission-v-walmart-inc/ (docket page, HTTP 403 this run)
- https://www.courtlistener.com/docket/62985776/united-states-equal-employment-opportunity-commission-v-walmart-inc/ (docket page, HTTP 403 this run)
- https://www.courtlistener.com/docket/6250398/united-states-v-wal-mart-stores-inc/ (docket page, HTTP 403 this run)
- data/blocklist.md (no match)
