---
name: Target
domain: target.com
type: retailer
goods: [general-merchandise, grocery, apparel, home, electronics]
ownership: public
parent: none
hq: Minneapolis, MN
marketplace: true
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns:
  - {kind: labor, title: "Target Corporation", source: https://www.nlrb.gov/case/10-CA-295461, date: 2023-03-17, accepted_source: true}
  - {kind: labor, title: "U.S. Equal Employment Opportunity Commission v. Target Corporation, Inc.", source: https://storage.courtlistener.com/recap/gov.uscourts.cand.332406/gov.uscourts.cand.332406.66.0.pdf, date: 2020-03-27, accepted_source: true}
  - {kind: labor, title: "US Equal Employment Opportunity Commission v. Target Stores Inc", source: https://storage.courtlistener.com/recap/gov.uscourts.cacd.452020/gov.uscourts.cacd.452020.20.0.pdf, date: 2011-07-21, accepted_source: true}
ethics: 0
environment: 0.5
tier: caution
mentions: 4
mentioned_by: [dollarsprout-com, gobankingrates-com, moneypantry-com, pcworld-com]
checked: 2026-09-25
---

Target Corporation is a public company ("Traded as NYSE: TGT", an S&P 500 component) headquartered at Target Plaza in Minneapolis, Minnesota, selling "general merchandise, including hardlines and softlines", with full grocery in SuperTarget stores (Wikipedia). Its corporate site cites "2,000+ Stores in the U.S." and "400k+ team members". Target Plus's own site is titled "Marketplace for Sellers" (plus.target.com), so `marketplace` is true. Wikipedia notes Amazon ran Target.com's fulfillment from 2002 until the relaunch on August 23, 2011; no fetched source says whether Target sells through Amazon's marketplace today.

Lists name it as a mainstream big-box alternative: similar range of goods, competitive prices, 5% off with the RedCard, same-day delivery and pickup, and an easy-to-browse computers section (dollarsprout-com, gobankingrates-com, moneypantry-com, pcworld-com).

Certifications: none. Not listed on Fair Trade USA's shop page; B Corp not checked per retailer (bcorporation.net returned HTTP 403 earlier this run; logged); no data/certifications.json row for target.com.

Concerns (all from accepted sources; verbs are the sources'):
- labor, nlrb.gov, 2023-03-17: NLRB case 10-CA-295461 (Christiansburg, VA, filed 2022-05-10), allegation "8(a)(1) Coercive Statements (Threats, Promises of Benefits, etc.)", closed with a "Conformed Settlement Agreement Bilateral" on 2023-03-17.
- labor, CourtListener, 2020-03-27: *U.S. Equal Employment Opportunity Commission v. Target Corporation, Inc.* (N.D. Cal., nature of suit "American with Disabilities - Employment"), "CONSENT DECREE ... Signed by Judge Edward M. Chen on 3/27/2020".
- labor, CourtListener, 2011-07-21: *US Equal Employment Opportunity Commission v. Target Stores Inc* (C.D. Cal., "Civil Rights: Jobs"), "CONSENT DECREE AND ORDER"; "In settlement of this lawsuit, Defendant shall pay" $160,000 to the charging employee.

Not recorded: the NLRB lists 53 cases naming Target Corporation; of the three opened, 10-CA-296088 (Christiansburg, filed 2022-05-19) and 21-CA-300653 (Long Beach, filed 2022-08-02) closed by approved withdrawal, with no finding. The rest were not opened. Wikipedia mentions a 2009 California Attorney General hazardous-waste suit, a 2018 Alameda County e-waste settlement and 2013 data-breach settlements; none of those sources is on the accepted list, and the one fetched (alcoda.org) returned 404, so none is recorded. Ethics is already at 0, so further labor findings would not change the rating.

Concern sources for the two EEOC cases are the consent-decree PDFs on storage.courtlistener.com; the docket pages (listed in Sources) return HTTP 403 to fetches.

## Rating
- ethics: start 0.5; no verified ethics certification; −0.25 labor (NLRB settlement, 2023); −0.25 labor (EEOC consent decree, 2020); −0.25 labor (EEOC consent decree, 2011); floored at 0; = 0
- environment: start 0.5; no verified environment certification; no accepted environmental concern; = 0.5
- tier: not on the blocklist (`--blocklist "Target" target.com`: "not on the blocklist"); ethics + environment = 0.5 < 1.0, so `caution`.
- Concern search incomplete this run (see raw/blocked-retailers-R4.md); tier is provisional.

## Sources
- https://en.wikipedia.org/wiki/Target_Corporation
- https://en.wikipedia.org/w/api.php?action=parse&page=Target_Corporation&prop=externallinks&format=json
- https://corporate.target.com/about
- https://plus.target.com/
- https://www.fairtradecertified.org/shop-fair-trade/
- https://www.nlrb.gov/search/case/Target%20Corporation
- https://www.nlrb.gov/case/10-CA-295461
- https://www.nlrb.gov/case/10-CA-296088
- https://www.nlrb.gov/case/21-CA-300653
- https://www.courtlistener.com/api/rest/v4/search/?q=caseName%3A%28%28%22Federal+Trade+Commission%22+OR+%22United+States%22+OR+%22Equal+Employment+Opportunity+Commission%22+OR+%22Secretary+of+Labor%22+OR+%22National+Labor+Relations+Board%22+OR+%22Environmental+Protection+Agency%22%29+AND+%22Target+Corporation%22%29&type=r&format=json&order_by=dateFiled+desc
- https://www.courtlistener.com/api/rest/v4/search/?q=docket_id%3A7927467+&type=rd&format=json&order_by=entry_date_filed+desc
- https://www.courtlistener.com/api/rest/v4/search/?q=docket_id%3A50668526+&type=rd&format=json&order_by=entry_date_filed+desc
- https://storage.courtlistener.com/recap/gov.uscourts.cand.332406/gov.uscourts.cand.332406.66.0.pdf
- https://storage.courtlistener.com/recap/gov.uscourts.cacd.452020/gov.uscourts.cacd.452020.20.0.pdf
- http://www.alcoda.org/newsroom/2018/dec/target_settlement (404)
- https://www.courtlistener.com/docket/7927467/us-equal-employment-opportunity-commission-v-target-corporation-inc/ (docket page, HTTP 403 this run)
- https://www.courtlistener.com/docket/50668526/us-equal-employment-opportunity-commission-v-target-stores-inc/ (docket page, HTTP 403 this run)
- data/blocklist.md (no match)
