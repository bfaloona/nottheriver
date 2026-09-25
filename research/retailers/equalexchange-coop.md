---
name: Equal Exchange
domain: equalexchange.coop
type: co-op
goods: [coffee, tea, chocolate, cocoa, sugar, bananas, avocados]
ownership: cooperative
parent: none
hq: West Bridgewater, MA
marketplace: unknown
sells_on_amazon: unknown
amazon_owned: false
certifications:
  - {kind: worker_coop, source: "https://info.usworker.coop/iframe/directory/worker-co-op-dem-workplaces?page=8", checked: 2026-09-25, verified_this_run: true}
concerns: []
ethics: 0.75
environment: 0.5
tier: recommended
mentions: 3
mentioned_by: [adayinourshoes-com, greenamerica-org, workerowned-info]
checked: 2026-09-25
---

Equal Exchange is a worker-owned cooperative, founded in 1986 and based in West Bridgewater, Massachusetts, that sells organic coffee, tea, chocolate, cocoa, sugar, bananas and avocados sourced from farmer cooperatives in Latin America, Africa and Asia, per Wikipedia. The same article quotes its pay rule: "The highest paid employee of Equal Exchange may not make more than four times what the lowest paid employee receives." It is not on the Amazon blocklist. Whether it hosts third-party sellers or sells through Amazon was not shown by any page fetched this run.

The US Federation of Worker Cooperatives directory lists it this run: "Equal Exchange, West Bridgewater, Massachusetts, Food & Beverage - Production & Manufacturing, Worker Co-op". Wikipedia calls it "Fairtrade" certified without naming the certifier; Fair Trade USA's brand page (fairtradecertified.org/shop-fair-trade) does not list it, so no `fair_trade` certification is scored. The Climate Label directory returned "Brand Not Found" for `equal-exchange`, and the 1% for the Planet profile page rendered no listing content.

List sites recommend it for ethically sourced food: Workerowned.info as "a pioneer worker co-op since 1986", Green America for direct-trade coffee, and A Day In Our Shoes for "Fair Trade organic coffee, tea, and hot cocoa" from "40 co-operatives".

Concerns checked: NLRB case search for "equal exchange" returned no cases. OSHA's establishment search (2016 to 2026, violations only) returned one inspection, 1880169.015 at its Portland, OR site (opened 2026-02-27, still open), with two citations issued 2026-04-01 carrying no penalty ($0); under the rule used for this batch (a citation counts as a concern when OSHA attached a penalty), it is noted here and not scored. No general news search was possible (the run's web search budget was used up).

## Rating
- Ethics: 0.5 baseline + 0.25 `worker_coop` (US Federation of Worker Cooperatives directory, verified this run) = 0.75. Fair Trade USA not verified; B Corp not checked (directory blocked, no data/certifications.json row of that kind). No accepted concern. Ethics 0.75.
- Environment: 0.5 baseline. No 1% for the Planet or Climate Label listing verified. No environmental concern. Environment 0.5.
- Tier: 0.75 + 0.5 = 1.25, meets `recommended` (≥ 1.25) with no accepted concern in the last 5 years. Tier `recommended`.
- Concern search incomplete this run (see raw/blocked-retailers-R5.md); tier is provisional.

## Sources
- https://en.wikipedia.org/wiki/Equal_Exchange
- https://info.usworker.coop/iframe/directory/worker-co-op-dem-workplaces
- https://info.usworker.coop/iframe/directory/worker-co-op-dem-workplaces?search=equal%20exchange
- https://info.usworker.coop/iframe/directory/worker-co-op-dem-workplaces?Name=Equal%20Exchange
- https://info.usworker.coop/iframe/directory/worker-co-op-dem-workplaces?page=6
- https://info.usworker.coop/iframe/directory/worker-co-op-dem-workplaces?page=7
- https://info.usworker.coop/iframe/directory/worker-co-op-dem-workplaces?page=8
- https://www.fairtradecertified.org/shop-fair-trade/
- https://explore.changeclimate.org/brand/equal-exchange
- https://directories.onepercentfortheplanet.org/profile/equal-exchange
- https://www.nlrb.gov/search/case/equal%20exchange
- https://www.osha.gov/ords/imis/establishment.search?p_logger=1&establishment=equal+exchange&State=all&officetype=all&Office=all&sitezip=&p_case=all&p_violations_exist=yes&startmonth=01&startday=01&startyear=2016&endmonth=09&endday=25&endyear=2026
- https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1880169.015
- https://www.bcorporation.net/en-us/find-a-b-corp/?query=better%20world%20books (HTTP 403, logged in raw/blocked-retailers-R5.md)
- data/blocklist.md (not on the blocklist: `build-index.mjs --blocklist`)
- research/sites/adayinourshoes-com.md, research/sites/greenamerica-org.md, research/sites/workerowned-info.md (reasons)
