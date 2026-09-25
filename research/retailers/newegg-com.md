---
name: Newegg
domain: newegg.com
type: retailer
goods: [computer hardware, PC components, peripherals, gaming hardware, consumer electronics]
ownership: public
parent: unknown
hq: Diamond Bar, CA
marketplace: true
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns:
  - {kind: labor, title: "MAGNELL ASSOCIATE, INC. D/B/A NEWEGG.COM", source: https://www.nlrb.gov/case/21-CA-184553, date: 2019-07-31, accepted_source: true}
ethics: 0.25
environment: 0.5
tier: caution
mentions: 5
mentioned_by: [amazonalts-org, dollarsprout-com, moneypantry-com, pcworld-com, techradar-com]
checked: 2026-09-25
---

Newegg is an online retailer of computer hardware, PC components, peripherals and consumer electronics, and since 2010 it has also run Newegg Marketplace for third-party sellers (Wikipedia). Wikipedia describes it as founded in 2001 by Fred Chang, headquartered in Diamond Bar, California, and listed on Nasdaq (NEGG) as Newegg Commerce, Inc. since May 2021 after a merger with the SPAC Lianluo Smart; it says Hangzhou Liaison Interactive acquired a majority stake in 2016, and its infobox names the chairman of Hangzhou Lianluo as parent. Because the post-listing control structure was not confirmed from a filing this run, `parent` is left `unknown`. Lists recommend it as an electronics alternative: PCWorld as "a good place to start" with a broad inventory as "a storefront for many sellers", TechRadar for PCs and components, DollarSprout and MoneyPantry for deals and service, and AmazonAlts alongside B&H and Micro Center.

The one concern is NLRB unfair labor practice case 21-CA-184553 (Region 21, Los Angeles) alleging "8(a)(1) Coercive Rules": the NLRB's General Counsel issued a complaint and notice of hearing on 2017-03-01, approved a unilateral settlement agreement on 2019-07-09, and the unilateral compliance settlement agreement is dated 2019-07-31; the case is closed. It is older than five years, so it lowers ethics but does not by itself block a higher tier. A 2011 NLRB charge (26-CA-024071) was dismissed by the General Counsel, so it is not a row. Not scored: Wikipedia also describes a 2018 card-skimming data breach, a 2010 counterfeit CPU episode, a 2010 former-employee lawsuit that Newegg denied, and a 2022 returns controversy; no accepted-source page was fetched for any of them. The WebSearch budget was used up before this retailer, so ftc.gov, osha.gov, dol.gov, sec.gov and justice.gov were not searched; the concern list may be incomplete.

## Rating
- Ethics: 0.5 baseline. No verified certification. Minus 0.25 for the accepted labor concern (nlrb.gov, settled 2019-07-31). = 0.25
- Environment: 0.5 baseline. No verified certification (not in The Climate Label directory list of 188 brands; no B Corp or 1% for the Planet claim on any list page). No environmental concern. = 0.5
- Total 0.75: tier `caution`.
- Blocklist: `node research/build-index.mjs --blocklist "Newegg" newegg.com` returned "not on the blocklist".
- Concern search incomplete this run (see raw/blocked-retailers-R2.md); tier is provisional.

## Sources
- https://en.wikipedia.org/wiki/Newegg
- https://www.nlrb.gov/search/case/newegg
- https://www.nlrb.gov/case/21-CA-184553
- https://www.nlrb.gov/case/26-CA-024071
- https://explore.changeclimate.org/ (brand list)
