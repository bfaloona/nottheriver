---
name: AliExpress
domain: aliexpress.com
type: marketplace
goods: [general merchandise, electronics, clothing, home goods]
ownership: public
parent: Alibaba Group
hq: unknown
marketplace: true
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns:
  - {kind: governance, title: "Alibaba Group and AUS Merchant Services Agree to Pay $600 Million to Resolve Allegations that they Failed to Prevent Illegal Sales of Pharmaceuticals, Pharmaceutical Equipment, and Other Illegal Products", source: https://www.justice.gov/opa/pr/alibaba-group-and-aus-merchant-services-agree-pay-600-million-resolve-allegations-they, date: 2026-07-01, accepted_source: true}
  - {kind: governance, title: "Commission fines AliExpress €550 million for breaching the Digital Services Act", source: https://digital-strategy.ec.europa.eu/en/news/commission-fines-aliexpress-eu550-million-breaching-digital-services-act, date: 2026-07-20, accepted_source: false}
ethics: 0.25
environment: 0.5
tier: caution
mentions: 4
mentioned_by: [antifamarketer-org, dollarsprout-com, gobankingrates-com, moneypantry-com]
checked: 2026-09-25
---

AliExpress is a business-to-consumer online marketplace launched by Alibaba Group in 2010, "made up of mostly small Chinese businesses offering products to international online buyers" (Wikipedia). Its sellers are third-party companies or individual merchants, so it counts as a marketplace. Its owner, Alibaba Group, is a public company listed on the NYSE (BABA) and the Hong Kong Stock Exchange (9988), headquartered in Hangzhou, China; `ownership: public` records the parent's status, since AliExpress itself is not separately listed. AliExpress's own headquarters is not given in the sources fetched, so `hq` is `unknown`. Wikipedia also notes that the US Trade Representative added AliExpress to its list of Notorious Markets for Counterfeiting and Piracy in 2022 (not a concern here: not an accepted source, and fetched only through Wikipedia).

The list sites name it on price, not ethics: "much lower prices than you'd find on Amazon" and a "factory-direct store model" (antifamarketer-org), "free shipping on more than 75% of items" and buyer protection (moneypantry-com), "rock bottom prices" with waits of up to three weeks and items that "may look and function a little differently than advertised" (gobankingrates-com), and a bare entry under Amazon shopping (dollarsprout-com).

Concerns: the US Department of Justice announced on 2026-07-01 that Alibaba Group and AUS Merchant Services agreed to pay $600 million under a non-prosecution agreement; per the release, "Alibaba admitted that, between January 2016 and December 2024, it failed to prevent merchants using its Alibaba.com and AliExpress.com platforms" from making about 80,000 illegal sales into the US. The European Commission fined AliExpress €550 million on 2026-07-20 under the Digital Services Act; the Commission is not on the accepted-source list, so it is shown but not scored.

## Rating
- Blocklist: `node research/build-index.mjs --blocklist "AliExpress" aliexpress.com` returned "not on the blocklist".
- Certifications: none claimed by the list sites or found; none counted.
- Ethics: 0.5 baseline − 0.25 (DOJ governance concern, justice.gov, accepted) = 0.25.
- Environment: 0.5 baseline, no environmental certifications or concerns.
- The EC fine is `accepted_source: false` and does not change the score.
- Tier: ethics + environment = 0.75, below 1.0, so `caution`.
- Concern search incomplete this run (see raw/blocked-retailers-R3.md); tier is provisional.

## Sources
- https://en.wikipedia.org/wiki/AliExpress
- https://en.wikipedia.org/wiki/Alibaba_Group
- https://www.justice.gov/opa/pr/alibaba-group-and-aus-merchant-services-agree-pay-600-million-resolve-allegations-they
- https://digital-strategy.ec.europa.eu/en/news/commission-fines-aliexpress-eu550-million-breaching-digital-services-act
- research/sites/antifamarketer-org.md, dollarsprout-com.md, gobankingrates-com.md, moneypantry-com.md (reasons)
- data/blocklist.md (checked: no match)
