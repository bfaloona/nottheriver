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
concerns: []
ethics: 0.5
environment: 0.5
tier: acceptable
mentions: 4
mentioned_by: [amazonalts-org, moneypantry-com, pcworld-com, techradar-com]
checked: 2026-09-25
---

Best Buy Co., Inc. is a US consumer-electronics retailer selling electronics, home appliances, video games, phones and cameras. It is a public company (common stock traded on the New York Stock Exchange as BBY, per its 10-K for the fiscal year ended 2026-01-31), incorporated in Minnesota with its business address at 7601 Penn Ave South, Richfield, MN (SEC EDGAR). Wikipedia says it ran a third-party marketplace from 2011 to 2016 and announced a relaunch in January 2025; the 2026 10-K refers to Best Buy Marketplace as "our recently launched U.S. platform", so `marketplace: true`. Neither source says it sells through Amazon's marketplace.

The list sites name it for range and convenience, not ethics: "massive inventory" plus its recycling and carbon claims ("1.7 billion pounds of electronics recycled since 2009", "51% absolute carbon reduction", amazonalts-org), clearance and open-box savings and free 2-day shipping (moneypantry-com), curbside pickup and delivery "from local warehouses" (pcworld-com), and "an excellent range of home gadgets" (techradar-com). The recycling and carbon figures are the list site's claims, not verified here. No list site or fetched page claims one of the five scored certifications.

Concern search was limited: the session's WebSearch budget ran out before this retailer, the ftc.gov, nlrb.gov and osha.gov site searches were inconclusive (search terms ignored, or a known-positive control also returned nothing), and justice.gov search returned HTTP 403. A CourtListener API search for federal dockets with Best Buy against the United States, the EEOC, the FTC, the Secretary of Labor, the NLRB or the SEC since 2016 found only cases Best Buy or an unrelated "Star Best Buy Inc." brought against the United States (trade and tax claims), which are not concerns. Wikipedia lists older matters (a 2008 FCC fine over analog-TV notices, class-action settlements, a 2026 B.C. Human Rights Tribunal order) that are not from accepted sources and were not fetched at their source, so none is recorded. This file should be rechecked with a working search.

## Rating
- Blocklist: `node research/build-index.mjs --blocklist "Best Buy" bestbuy.com` returned "not on the blocklist".
- Certifications: none claimed or found; none counted.
- Ethics: 0.5 baseline, no counted certifications or accepted concerns found (search limited).
- Environment: 0.5 baseline, no counted certifications or accepted concerns found (search limited).
- Tier: ethics + environment = 1.0, so `acceptable`.

## Sources
- https://en.wikipedia.org/wiki/Best_Buy
- https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000764478&type=10-K&dateb=&owner=include&count=10
- https://www.sec.gov/Archives/edgar/data/764478/000076447826000009/0000764478-26-000009-index.htm
- https://www.sec.gov/Archives/edgar/data/764478/000076447826000009/bby-20260131.htm
- https://www.courtlistener.com/api/rest/v4/search/?q=caseName%3A%22Best+Buy%22+AND+caseName%3A(%22United+States%22+OR+%22Equal+Employment%22+OR+%22Federal+Trade%22+OR+%22Secretary+of+Labor%22+OR+%22National+Labor+Relations%22+OR+%22Securities+and+Exchange%22)&type=r&filed_after=2016-01-01
- https://www.courtlistener.com/api/rest/v4/search/?q=caseName%3A%22Best+Buy%22&type=o&order_by=dateFiled+desc&filed_after=2021-01-01
- research/sites/amazonalts-org.md, moneypantry-com.md, pcworld-com.md, techradar-com.md (reasons)
- data/blocklist.md (checked: no match)
