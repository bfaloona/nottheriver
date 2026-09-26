---
name: Overstock
domain: overstock.com
type: retailer
goods: [furniture, home decor, bedding, home goods]
ownership: public
parent: Neighborhood Intelligence, Inc. (formerly Bed Bath & Beyond, Inc., Beyond, Inc. and Overstock.com, Inc.)
hq: Murray, UT
marketplace: unknown
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns:
  - {kind: governance, title: "People v. Overstock.com, Inc.", source: https://www.courtlistener.com/opinion/6238839/people-v-overstockcom-inc/, date: 2017-06-02, accepted_source: true}
  - {kind: environmental, title: "Beyond, Inc., dba Bed, Bath & Beyond and Overstock.com Settlement", source: https://ww2.arb.ca.gov/beyond-inc-dba-bed-bath-beyond-and-overstock-com-settlement, date: unknown, accepted_source: true}
ethics: 0.25
environment: 0.25
tier: caution
mentions: 3
mentioned_by: [dollarsprout-com, gobankingrates-com, moneypantry-com]
checked: 2026-09-25
---

Overstock.com is an online home-goods retailer. The company that ran it, Overstock.com, Inc., renamed itself Beyond, Inc. and then Bed Bath & Beyond, Inc.; SEC EDGAR now lists it as Neighborhood Intelligence, Inc. (former names shown on its EDGAR page), with its business address in Murray, Utah. Its 10-K for 2025 (filed 2026-02-24) names www.bedbathandbeyond.com and www.overstock.com as its "Website", lists the stock on the New York Stock Exchange, and says "the vast majority of our retail transactions are fulfilled through our network of partners", shipping "from our partners' owned inventory". Whether that partner model counts as hosting third-party sellers is not clear from the filing, so `marketplace` is `unknown`. Wikipedia says the company moved its headquarters to Nashville in 2026 and trades on Nasdaq as NXH; the SEC pages fetched this run still show Murray, Utah and do not confirm the listing change, so the SEC address is used. Lists name Overstock as a cheaper general-merchandise site "most like Amazon" (DollarSprout, GOBankingRates); MoneyPantry calls it a "Conservative alternative to Amazon".

Not scored, but on record:
- Delaware unclaimed-property case: the 2019 10-K reports that on 2019-06-28 a Delaware court "entered a judgment against us" (about $7.3 million, then $8.6 million with fees) in a suit brought by an individual and the State of Delaware. The Q2 2020 10-Q reports that in June 2020 "the Delaware Supreme Court reversed the judgment of the trial court in its entirety". Reversed, so not a concern row.
- SEC and tZERO: the 2021 10-K (filed 2022-02-25) reports that tZERO ATS, LLC, "a wholly owned subsidiary of tZERO", agreed with the SEC "to be censured, and pay a $800,000 civil penalty" over Regulation ATS rules. The party is a subsidiary of tZERO, not Overstock.com, Inc., and the SEC's own order was not fetched (no date found), so it is not a concern row.
- The 2025 10-K's legal note names no specific government action, only litigation "from time to time" and liabilities "not material".
- Good Jobs First Violation Tracker has a parent page for Overstock.com but returned HTTP 403 (logged in raw/blocked-retailers-R6.md). NLRB case search for "Overstock" returned no cases. Other agency searches (FTC, DOJ, CourtListener) could not be run: their search pages returned 403 or 404, and this session's web search budget ran out.

Second pass (2026-09-25): the FTC cases and proceedings search returned no results for "Overstock" or for the parent's current name "Neighborhood Intelligence"; the CourtListener agency-docket query since 2016 returned no dockets; none of the five ProPublica articles matching "Overstock" is about an agency or court action against the company. No matching cases, so no concern rows were added.

News pass (2026-09-25): searched the web for "Overstock" with lawsuit, settlement, fine or violation; for "Overstock" with EEOC, OSHA, Department of Labor, FTC, EPA or attorney general; and for the parent ("Beyond, Inc." or "Neighborhood Intelligence") with SEC or attorney general. Found two agency or court actions:
- People v. Overstock.com, Inc. (California Court of Appeal, opinion filed 2017-06-02, 12 Cal. App. 5th 1064). Overstock "appeals a judgment entered after the trial court found it had engaged in unfair business practices"; the trial court granted "injunctive relief and imposed $6,828,000 in civil penalties"; "The judgment is affirmed." Search-result summaries (not opened) say eight California counties brought the case over "Compare At" reference prices. Recorded as a governance concern on CourtListener, an accepted source. The opinion page renders no text to the fetch tool, so the quotes come from CourtListener's search API for the same opinion (URLs in Sources).
- California Air Resources Board settlement (June 2025): "Beyond, Inc. violated the Indoor ACD Regulation because they sold, supplied, offered for sale, and introduced into commerce in California, indoor air cleaning devices that were not certified by CARB", penalty $13,485. CARB is not an accepted source and no accepted page was found, so the row has `accepted_source: false` and does not count.
- Also seen, not concerns: a 2016 GlobeNewswire release headlined "Overstock.com Accepts $20 Million to Settle Market Manipulation Case" (Overstock accepting money, so not an action against it; not fetched); a Missouri sales-tax class action (private, no ruling found); a 2024 Tenth Circuit decision in the company's favor (Cooley). The Delaware unclaimed-property judgment is covered above (reversed).

## Rating
- Ethics: 0.5 baseline. No verified certification (B Corp directory returned 403; no row in data/certifications.json; not checked for Fair Trade or worker co-op, which do not fit a public company). One accepted governance concern (People v. Overstock.com, 2017): -0.25. = 0.25
- (Before the 2026-09-25 operator decision below) Environment: 0.5 baseline. Not on The Climate Label directory page (explore.changeclimate.org, full brand list in the served page; control names Etsy, Blueland and Reformation found). 1% for the Planet directory is script-rendered and could not be searched (logged). No accepted concern (the CARB settlement is not on an accepted source). = 0.5
- (Before the 2026-09-25 operator decision below) Total 0.75, not Amazon-owned: tier `caution` (was `acceptable` before the news pass).
- Concern search: passes 1 to 3 (agency pages, FTC, CourtListener, ProPublica, general news search).
- Blocklist: `node research/build-index.mjs --blocklist "Overstock" overstock.com` returned "not on the blocklist".
- Operator decision (2026-09-25): ca.gov joined the accepted sources, so the California Air Resources Board settlement now counts: environment 0.5 -> 0.25. Total 0.5, still `caution`.

## Sources
- https://en.wikipedia.org/wiki/Overstock.com
- https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001130713&type=10-K&dateb=&owner=include&count=10
- https://www.sec.gov/Archives/edgar/data/1130713/000113071326000018/bbby-20251231.htm
- https://www.sec.gov/Archives/edgar/data/1130713/000113071326000018/R23.htm
- https://www.sec.gov/Archives/edgar/data/1130713/000113071320000014/R20.htm
- https://www.sec.gov/Archives/edgar/data/1130713/000113071320000030/R14.htm
- https://www.sec.gov/Archives/edgar/data/1130713/000113071320000053/R18.htm
- https://www.sec.gov/Archives/edgar/data/1130713/000113071322000009/R22.htm
- https://www.nlrb.gov/search/case/Overstock
- https://explore.changeclimate.org/
- https://directories.onepercentfortheplanet.org/ (script-rendered; no listing readable)
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Overstock
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Neighborhood%20Intelligence%22
- https://www.courtlistener.com/api/rest/v4/search/?type=r&order_by=dateFiled+desc&filed_after=2016-01-01&q=caseName%3A(%22Overstock%22)%20AND%20caseName%3A(%22Equal%20Employment%22%20OR%20%22EEOC%22%20OR%20%22Secretary%20of%20Labor%22%20OR%20%22Department%20of%20Labor%22%20OR%20%22Federal%20Trade%20Commission%22%20OR%20%22United%20States%22%20OR%20%22State%20of%22%20OR%20%22People%20of%22%20OR%20%22Commonwealth%22%20OR%20%22National%20Labor%20Relations%22%20OR%20%22Environmental%20Protection%22%20OR%20%22Consumer%20Product%20Safety%22%20OR%20%22Securities%20and%20Exchange%22%20OR%20%22Attorney%20General%22%20OR%20%22District%20of%20Columbia%22)
- https://www.propublica.org/search?qss=%22Overstock%22
- https://www.courtlistener.com/api/rest/v4/search/?type=o&q=%22Overstock.com%22%20AND%20%22People%22%20AND%20%22compare%20at%22
- https://www.courtlistener.com/opinion/6238839/people-v-overstockcom-inc/ (renders no text to the fetch tool)
- https://www.courtlistener.com/api/rest/v4/search/?type=o&highlight=on&q=cluster_id%3A6238839%20AND%20%22judgment%20is%20affirmed%22
- https://www.courtlistener.com/api/rest/v4/search/?type=o&highlight=on&q=cluster_id%3A6238839%20AND%20%22civil%20penalties%22%20AND%20million
- https://ww2.arb.ca.gov/beyond-inc-dba-bed-bath-beyond-and-overstock-com-settlement
