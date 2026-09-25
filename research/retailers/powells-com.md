---
name: Powell's Books
domain: powells.com
type: retailer
goods: [books, used books, rare books]
ownership: private
parent: none
hq: Portland, OR
marketplace: unknown
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns: []
ethics: 0.5
environment: 0.5
tier: acceptable
mentions: 3
mentioned_by: [dollarsprout-com, ilsr-org, techradar-com]
checked: 2026-09-25
---

Powell's Books is an independent bookstore in Portland, Oregon, selling new, used, rare and out-of-print books in its stores and at powells.com. Wikipedia describes it as private and family-owned: founded by Walter Powell, run by Michael Powell from 1982 and by Emily Powell since 2010. Its workers have been represented by ILWU Local 5 since 1999 (Wikipedia). The Institute for Local Self-Reliance lists it as an independent bookstore that ships worldwide, TechRadar notes it "ships across the country", and DollarSprout names it in passing. Powell's own about page and home page returned HTTP 403, so nothing here comes from Powell's itself.

Not scored, but on record:
- NLRB unfair labor practice charges against Powell's Books, Inc., filed by ILWU Local 5 or, for 19-CA-330248, by an individual whose name the case page redacts. These are charges filed by others, not agency findings, so none is a concern row:
  - 19-CA-374772, filed 2025-10-16, "8(a)(5) Refusal to Furnish Information", status Open.
  - 19-CA-325057 (filed 2023-09-01, bad-faith bargaining), 19-CA-330070 (filed 2023-11-14, discipline and coercive statements), 19-CA-330340 (filed 2023-11-17, coercive statements) and 19-CA-330248 (filed 2023-11-17, domination of a labor organization): each closed after the NLRB General Counsel approved a withdrawal request (2024-01-19 or 2024-03-28).
  - 19-CA-288783 and 19-CA-288784 (filed 2022-01-11, discharge and surveillance): dismissed by the General Counsel on 2022-03-31; the union's appeal on 19-CA-288784 was denied 2022-05-02.
  - 36-CA-010588 (filed 2009-12-02, Weingarten rights): closed; outcome not shown.
- Wikipedia also reports layoffs in 2011 and 2020 and a Labor Day strike on 2023-09-04; no accepted source was fetched for these.
- Good Jobs First Violation Tracker returned HTTP 403 (logged). Other agency and news searches could not be run: search pages returned 403 or 404, and this session's web search budget ran out.

Second pass (2026-09-25): the FTC cases and proceedings search returned no results for "Powell's" or for the broader "Powell" (no parent to try); the CourtListener agency-docket query since 2016 returned no dockets; none of the 23 ProPublica articles matching "Powell's Books" is about the company. No matching cases, so no concern rows were added.

## Rating
- Ethics: 0.5 baseline. No verified certification (B Corp directory returned 403; no row in data/certifications.json; no worker co-op or Fair Trade listing expected for a family-owned bookstore, none checked). No accepted concern (NLRB charges are allegations that were withdrawn, dismissed or are still open). = 0.5
- Environment: 0.5 baseline. Not on The Climate Label directory page (explore.changeclimate.org). 1% for the Planet directory could not be searched (logged). = 0.5
- Total 1.0, not Amazon-owned: tier `acceptable`.
- Concern search partial: pass 2 checked FTC cases, CourtListener agency dockets since 2016 and ProPublica; no general news search, and DOJ, SEC and Violation Tracker were unreachable; tier is provisional.
- Blocklist: `node research/build-index.mjs --blocklist "Powell's Books" powells.com` returned "not on the blocklist".

## Sources
- https://en.wikipedia.org/wiki/Powell%27s_Books
- https://www.nlrb.gov/search/case/Powell%27s%20Books
- https://www.nlrb.gov/case/19-CA-374772
- https://www.nlrb.gov/case/19-CA-325057
- https://www.nlrb.gov/case/19-CA-330070
- https://www.nlrb.gov/case/19-CA-330340
- https://www.nlrb.gov/case/19-CA-330248
- https://www.nlrb.gov/case/19-CA-288783
- https://www.nlrb.gov/case/19-CA-288784
- https://www.nlrb.gov/case/36-CA-010588
- https://explore.changeclimate.org/
- https://www.powells.com/about-us (HTTP 403; logged)
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Powell%27s%22
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Powell
- https://www.courtlistener.com/api/rest/v4/search/?type=r&order_by=dateFiled+desc&filed_after=2016-01-01&q=caseName%3A(%22Powell's%20Books%22)%20AND%20caseName%3A(%22Equal%20Employment%22%20OR%20%22EEOC%22%20OR%20%22Secretary%20of%20Labor%22%20OR%20%22Department%20of%20Labor%22%20OR%20%22Federal%20Trade%20Commission%22%20OR%20%22United%20States%22%20OR%20%22State%20of%22%20OR%20%22People%20of%22%20OR%20%22Commonwealth%22%20OR%20%22National%20Labor%20Relations%22%20OR%20%22Environmental%20Protection%22%20OR%20%22Consumer%20Product%20Safety%22%20OR%20%22Securities%20and%20Exchange%22%20OR%20%22Attorney%20General%22%20OR%20%22District%20of%20Columbia%22) (pass 2 agency-docket query)
- https://www.propublica.org/search?qss=%22Powell's%20Books%22
