---
name: Best Buy
domain: bestbuy.com
type: retailer
goods: [electronics, appliances, video games, phones, cameras]
ownership: public
parent: none
hq: Richfield, MN
marketplace: true
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns:
  - {kind: governance, title: "Best Buy Agrees to Pay $3.8 Million Civil Penalty, Implement Internal Compliance Program for Distributing and Selling Recalled Products", source: https://www.cpsc.gov/Best-Buy-Agrees-to-Pay-38-million-civil-penalty, date: 2016-10-03, accepted_source: true}
ethics: 0.25
environment: 0.5
tier: caution
mentions: 4
mentioned_by: [amazonalts-org, moneypantry-com, pcworld-com, techradar-com]
checked: 2026-09-25
---

Best Buy Co., Inc. is a US consumer-electronics retailer selling electronics, home appliances, video games, phones and cameras. It is a public company (common stock traded on the New York Stock Exchange as BBY, per its 10-K for the fiscal year ended 2026-01-31), incorporated in Minnesota with its business address at 7601 Penn Ave South, Richfield, MN (SEC EDGAR). Wikipedia says it ran a third-party marketplace from 2011 to 2016 and announced a relaunch in January 2025; the 2026 10-K refers to Best Buy Marketplace as "our recently launched U.S. platform", so `marketplace: true`. Neither source says it sells through Amazon's marketplace.

The list sites name it for range and convenience, not ethics: "massive inventory" plus its recycling and carbon claims ("1.7 billion pounds of electronics recycled since 2009", "51% absolute carbon reduction", amazonalts-org), clearance and open-box savings and free 2-day shipping (moneypantry-com), curbside pickup and delivery "from local warehouses" (pcworld-com), and "an excellent range of home gadgets" (techradar-com). The recycling and carbon figures are the list site's claims, not verified here. No list site or fetched page claims one of the five scored certifications.

Concern search was limited: the session's WebSearch budget ran out before this retailer, the ftc.gov, nlrb.gov and osha.gov site searches were inconclusive (search terms ignored, or a known-positive control also returned nothing), and justice.gov search returned HTTP 403. A CourtListener API search for federal dockets with Best Buy against the United States, the EEOC, the FTC, the Secretary of Labor, the NLRB or the SEC since 2016 found only cases Best Buy or an unrelated "Star Best Buy Inc." brought against the United States (trade and tax claims), which are not concerns. Wikipedia lists older matters (a 2008 FCC fine over analog-TV notices, class-action settlements, a 2026 B.C. Human Rights Tribunal order) that are not from accepted sources and were not fetched at their source, so none is recorded. Rechecked in the news pass below.

Second pass (2026-09-25): FTC cases search for "Best Buy" sorted by relevance returned 72 keyword matches; the top results (Appliancebestbuys.com, BUY.COM, Best Priced Brands and similar) include no Best Buy Co. respondent, and a quoted-phrase search returned nothing (inconclusive, the quoted syntax returns nothing for any name tried). The CourtListener agency-docket query since 2016 returned 4 dockets, all brought against the United States (Best Buy Purchasing LLC and an unrelated Star Best Buy Inc. in the Court of International Trade, and Best Buy Co. in the Court of Federal Claims), so none is a concern. ProPublica's 45 hits include none about an action against Best Buy. No matching cases.

News pass (2026-09-25): two web searches, `"Best Buy" lawsuit OR settlement OR fine OR violation` and `"Best Buy" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`, plus one follow-up, `Best Buy civil penalty CPSC OR "hazardous waste" OR "district attorneys" settlement Best Buy Stores`, to find the agency's own page (a fourth, limited to accepted domains, was refused by the search tool because apnews.com was in the list). Found and counted: CPSC's release of 2016-10-03, "Best Buy Agrees to Pay $3.8 Million Civil Penalty, Implement Internal Compliance Program for Distributing and Selling Recalled Products", which says Best Buy Co., Inc. "has agreed to pay a $3.8 million civil penalty for distributing and selling previously recalled consumer products"; CPSC staff charged that it "knowingly sold and distributed 16 different recalled products during a five year period from 2010 through 2015". The release says the settlement "does not constitute an admission of CPSC staff's charges"; an agency settlement with a penalty counts under brief section 9. Recorded as `governance`, following the FTC and state consumer-protection rows in other files. Found but not counted: a consumer-protection settlement with the Santa Barbara, Alameda, Riverside and San Diego County district attorneys ($558,570 in civil costs and penalties plus $75,000 restitution, over pricing accuracy and return policy), reported by rivcoda.org and edhat.com, neither an accepted source, with no accepted-source page found (`accepted_source: false`; Violation Tracker, which lists Best Buy, was not retried because it returns HTTP 403); a $4.5 million TCPA robocall class settlement and a $3.25 million California employee-misclassification class settlement (private suits); and 2013 to 2014 LCD price-fixing settlements in which Best Buy was the plaintiff. Tier moves from `acceptable` to `caution`.

## Rating
- Blocklist: `node research/build-index.mjs --blocklist "Best Buy" bestbuy.com` returned "not on the blocklist".
- Certifications: none claimed or found; none counted.
- Ethics: 0.5 baseline, no counted certification, −0.25 for one accepted governance concern (cpsc.gov, 2016 civil penalty for selling recalled products). Result 0.25.
- Environment: 0.5 baseline, no counted certification, no environmental concern. Result 0.5.
- Tier: ethics + environment = 0.75 < 1.0, so `caution` (was `acceptable` before the news pass).
- Concern search: passes 1 to 3 (agency pages, FTC, CourtListener, ProPublica, general news search).

## Sources
- https://en.wikipedia.org/wiki/Best_Buy
- https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000764478&type=10-K&dateb=&owner=include&count=10
- https://www.sec.gov/Archives/edgar/data/764478/000076447826000009/0000764478-26-000009-index.htm
- https://www.sec.gov/Archives/edgar/data/764478/000076447826000009/bby-20260131.htm
- https://www.courtlistener.com/api/rest/v4/search/?q=caseName%3A%22Best+Buy%22+AND+caseName%3A(%22United+States%22+OR+%22Equal+Employment%22+OR+%22Federal+Trade%22+OR+%22Secretary+of+Labor%22+OR+%22National+Labor+Relations%22+OR+%22Securities+and+Exchange%22)&type=r&filed_after=2016-01-01
- https://www.courtlistener.com/api/rest/v4/search/?q=caseName%3A%22Best+Buy%22&type=o&order_by=dateFiled+desc&filed_after=2021-01-01
- research/sites/amazonalts-org.md, moneypantry-com.md, pcworld-com.md, techradar-com.md (reasons)
- data/blocklist.md (checked: no match)
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Best%20Buy%22 (no results; quoted syntax inconclusive)
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Best%20Buy&sort_by=search_api_relevance
- https://www.courtlistener.com/api/rest/v4/search/?type=r&order_by=dateFiled+desc&filed_after=2016-01-01&q=caseName%3A(%22Best%20Buy%22)%20AND%20caseName%3A(%22Equal%20Employment%22%20OR%20%22EEOC%22%20OR%20%22Secretary%20of%20Labor%22%20OR%20%22Department%20of%20Labor%22%20OR%20%22Federal%20Trade%20Commission%22%20OR%20%22United%20States%22%20OR%20%22State%20of%22%20OR%20%22People%20of%22%20OR%20%22Commonwealth%22%20OR%20%22National%20Labor%20Relations%22%20OR%20%22Environmental%20Protection%22%20OR%20%22Consumer%20Product%20Safety%22%20OR%20%22Securities%20and%20Exchange%22%20OR%20%22Attorney%20General%22%20OR%20%22District%20of%20Columbia%22) (pass 2 agency-docket query)
- https://www.propublica.org/search?qss=%22Best%20Buy%22
- https://www.cpsc.gov/Best-Buy-Agrees-to-Pay-38-million-civil-penalty (news pass: counted concern)
