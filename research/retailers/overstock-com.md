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
concerns: []
ethics: 0.5
environment: 0.5
tier: acceptable
mentions: 3
mentioned_by: [dollarsprout-com, gobankingrates-com, moneypantry-com]
checked: 2026-09-25
---

Overstock.com is an online home-goods retailer. The company that ran it, Overstock.com, Inc., renamed itself Beyond, Inc. and then Bed Bath & Beyond, Inc.; SEC EDGAR now lists it as Neighborhood Intelligence, Inc. (former names shown on its EDGAR page), with its business address in Murray, Utah. Its 10-K for 2025 (filed 2026-02-24) names www.bedbathandbeyond.com and www.overstock.com as its "Website", lists the stock on the New York Stock Exchange, and says "the vast majority of our retail transactions are fulfilled through our network of partners", shipping "from our partners' owned inventory". Whether that partner model counts as hosting third-party sellers is not clear from the filing, so `marketplace` is `unknown`. Wikipedia says the company moved its headquarters to Nashville in 2026 and trades on Nasdaq as NXH; the SEC pages fetched this run still show Murray, Utah and do not confirm the listing change, so the SEC address is used. Lists name Overstock as a cheaper general-merchandise site "most like Amazon" (DollarSprout, GOBankingRates); MoneyPantry calls it a "Conservative alternative to Amazon".

Not scored, but on record:
- Delaware unclaimed-property case: the 2019 10-K reports that on 2019-06-28 a Delaware court "entered a judgment against us" (about $7.3 million, then $8.6 million with fees) in a suit by William French and the State of Delaware. The Q2 2020 10-Q reports that in June 2020 "the Delaware Supreme Court reversed the judgment of the trial court in its entirety". Reversed, so not a concern row.
- SEC and tZERO: the 2021 10-K (filed 2022-02-25) reports that tZERO ATS, LLC, "a wholly owned subsidiary of tZERO", agreed with the SEC "to be censured, and pay a $800,000 civil penalty" over Regulation ATS rules. The party is a subsidiary of tZERO, not Overstock.com, Inc., and the SEC's own order was not fetched (no date found), so it is not a concern row.
- The 2025 10-K's legal note names no specific government action, only litigation "from time to time" and liabilities "not material".
- Good Jobs First Violation Tracker has a parent page for Overstock.com but returned HTTP 403 (logged in raw/blocked-retailers-R6.md). NLRB case search for "Overstock" returned no cases. Other agency searches (FTC, DOJ, CourtListener) could not be run: their search pages returned 403 or 404, and this session's web search budget ran out.

## Rating
- Ethics: 0.5 baseline. No verified certification (B Corp directory returned 403; no row in data/certifications.json; not checked for Fair Trade or worker co-op, which do not fit a public company). No accepted concern. = 0.5
- Environment: 0.5 baseline. Not on The Climate Label directory page (explore.changeclimate.org, full brand list in the served page; control names Etsy, Blueland and Reformation found). 1% for the Planet directory is script-rendered and could not be searched (logged). No accepted concern. = 0.5
- Total 1.0, not Amazon-owned: tier `acceptable`.
- Blocklist: `node research/build-index.mjs --blocklist "Overstock" overstock.com` returned "not on the blocklist".

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
