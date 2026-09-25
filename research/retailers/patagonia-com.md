---
name: Patagonia
domain: patagonia.com
type: brand
goods: [apparel, outdoor-gear, food, used-gear]
ownership: private
parent: Patagonia Purpose Trust (voting stock); Holdfast Collective (nonvoting stock)
hq: Ventura, CA
marketplace: unknown
sells_on_amazon: unknown
amazon_owned: false
certifications:
  - {kind: fair_trade, source: https://www.fairtradecertified.org/shop-fair-trade/, checked: 2026-09-25, verified_this_run: true}
  - {kind: b_corp, source: https://www.bcorporation.net/en-us/find-a-b-corp/company/patagonia-inc/, checked: 2026-09-25, verified_this_run: false}
  - {kind: one_percent_planet, source: https://directories.onepercentfortheplanet.org/profile/patagonia, checked: 2026-09-25, verified_this_run: false}
concerns:
  - {kind: labor, title: "Patagonia Works", source: https://www.nlrb.gov/case/32-CA-254886, date: 2020-03-25, accepted_source: true}
ethics: 0.75
environment: 0.75
tier: recommended
mentions: 4
mentioned_by: [adayinourshoes-com, fairtradecertified-org, goingzerowaste-com, goodgoodgood-co]
checked: 2026-09-25
---

Patagonia makes and sells "outdoor recreation clothing, equipment, and food" (Wikipedia) and runs Worn Wear, "a trade-in and exchange program" started in 2017 (Wikipedia). Wikipedia describes it as a private benefit corporation headquartered in Ventura, California; in 2022 founder Yvon Chouinard transferred the voting stock to the Patagonia Purpose Trust and the nonvoting stock to the Holdfast Collective, a 501(c)(4) nonprofit. `ownership` is `private` because the closed list has no value for a trust-held company; the benefit-corporation form is noted here rather than chosen, since `public-benefit-corporation` names a Delaware form the source doesn't claim. No fetched page says whether it hosts outside sellers (patagonia.com returned a site-downtime page), so `marketplace` is unknown. No fetched source says whether it sells through Amazon's marketplace.

Lists recommend it for Worn Wear used gear, Fair Trade factories and activism ("Earth is their only shareholder", goodgoodgood-co); Fair Trade USA's own shop page lists it as a brand (fairtradecertified-org).

Certifications:
- Fair Trade USA: fetched this run; the shop page lists Patagonia in "Explore Brands Where You Can Buy Fair Trade". Counts.
- B Corp: bcorporation.net returned HTTP 403 to this run (logged in research/raw/blocked-retailers-R4.md); the data/certifications.json row (source above, "Certified Since December 2011", checked 2026-09-23) counts with `verified_this_run: false`.
- 1% for the Planet: the directory profile renders only in a browser, so a fetch can't confirm it (logged); the data/certifications.json row ("Whole Company Member", checked 2026-09-23) counts with `verified_this_run: false`.
- The Climate Label: explore.changeclimate.org/brand/patagonia returns "Brand Not Found". Not counted.

Concerns:
- labor, nlrb.gov, 2020-03-25: NLRB case 32-CA-254886, "Patagonia Works" (Reno, NV, filed 2020-01-17 by an individual), allegation 8(a)(1) "Concerted Activities (Retaliation, Discharge, Discipline)", resolved by a "Unilateral Settlement Agreement Approval Letter" on 2020-03-25. More than 5 years old, so it lowers ethics but does not block `recommended`.

Not recorded: NLRB case 32-CA-360724 (Patagonia, Inc., Reno, filed 2025-02-20 by the UFCW) closed when the General Counsel approved a withdrawal request on 2025-09-26, with no finding. Wikipedia's controversy section mentions supply-chain labor reports (internal audits in 2007 and 2011 on trafficking in second-tier Taiwanese suppliers; a December 2021 criminal complaint by the European Center for Constitutional and Human Rights over Xinjiang cotton; a 2023 Dutch report on shared factories). None of their underlying sources were fetched this run (the ECCHR case URL tried returned 404, and the web-search budget had run out), so none is recorded. CourtListener lists federal dockets naming Patagonia, Inc. as a defendant (for example an employment civil-rights case filed 2025-03-07 in D. Nev. and website-accessibility cases); a docket search result shows no finding or settlement, so private suits without an outcome are not recorded as concerns. No agency case was found in the CourtListener search.

Second pass (2026-09-25): the FTC cases and proceedings search for "Patagonia" (which also covers "Patagonia Works") showed "No results found for these filters." For the owner named above, the search for "Holdfast Collective" returned 47 loose matches on "collective" (the first 20 read, none naming Holdfast), and the search for "Holdfast" showed no results. The CourtListener agency-docket query since 2016 returned 8 dockets, none kept: two are "Patagonia, Inc. v. United States" at the Court of International Trade (2020-09-18, 2026-01-15; the company sues the government), one is "Patagonia Food Group, LLC v. United States" (a different company), one is "Patagonia Area Resource Alliance v. United States Forest Service" (a different party suing the government), and four are "United States v. Patagonia Duffel Bag" (E.D. Mo., 2022-11-15), a case against a bag, not against the company. ProPublica's one hit (tire and rubber import prices) is not about the company. No matching cases; no concern added.

News pass (2026-09-25): three web searches, `"Patagonia" lawsuit OR settlement OR fine OR violation`, `"Patagonia" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")` and, for the owners named above, `"Holdfast Collective" OR "Patagonia Purpose Trust" lawsuit OR settlement OR fine OR violation OR IRS`. Found: (1) Patagonia's January 2026 trademark suit against the drag performer Pattie Gonia, where Patagonia is the plaintiff, so not a concern. (2) A Proposition 65 notice (California AG notice 2022-00855) by a private individual against Patagonia Provisions, Inc. and Sprouts Farmers Market over lead in Breadfruit Crackers; the AG's summary page records an "Out of court settlement" on 2022-12-07 with $4,000 in civil penalties and $26,000 in fees. A private party's out-of-court settlement, on a non-accepted source, is noted here, not recorded. (3) A May 2024 email pixel-tracking class action (private suit, no ruling found). (4) A California Air Resources Board settlement with "Patagonia Building Supplies, Inc." (2009), a different company. The second search returned only agency pages and Patagonia's Fair Labor Association profile. The owner search returned commentary on the tax treatment of the 2022 ownership transfer (Sierra Club, Kentucky Law Journal and others) but no lawsuit, fine or agency action. No concern added.

## Rating
- ethics: start 0.5; +0.25 fair_trade; +0.25 b_corp; −0.25 labor (NLRB settlement, 2020-03-25); = 0.75
- environment: start 0.5; +0.25 one_percent_planet; no accepted environmental concern; = 0.75
- tier: not on the blocklist (`--blocklist "Patagonia" patagonia.com`: "not on the blocklist"); ethics + environment = 1.5 ≥ 1.25 and no accepted concern in the last 5 years (the 2020-03-25 settlement is before the 2021-09-25 cutoff), so `recommended`.
- Concern search: passes 1 to 3 (agency pages, FTC, CourtListener, ProPublica, general news search).

## Sources
- https://en.wikipedia.org/wiki/Patagonia,_Inc.
- https://www.fairtradecertified.org/shop-fair-trade/
- https://www.bcorporation.net/en-us/find-a-b-corp/company/patagonia-inc/ (via data/certifications.json; blocked this run)
- https://directories.onepercentfortheplanet.org/profile/patagonia (fetched; content renders only in a browser; via data/certifications.json)
- https://explore.changeclimate.org/brand/patagonia (Brand Not Found)
- https://www.patagonia.com/ownership/ (returned a site-downtime page)
- https://www.courtlistener.com/api/rest/v4/search/?q=%22v.%20Patagonia%2C%20Inc.%22&type=r&format=json
- https://www.nlrb.gov/search/case/Patagonia
- https://www.nlrb.gov/case/32-CA-254886
- https://www.nlrb.gov/case/32-CA-360724
- data/blocklist.md (no match)
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Patagonia (no results)
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Holdfast%20Collective (47 loose matches, none about Holdfast Collective)
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=%22Holdfast%22 (no results)
- https://www.courtlistener.com/api/rest/v4/search/?type=r&order_by=dateFiled+desc&filed_after=2016-01-01&q=caseName%3A(%22Patagonia%22)%20AND%20caseName%3A(%22Equal%20Employment%22%20OR%20%22EEOC%22%20OR%20%22Secretary%20of%20Labor%22%20OR%20%22Department%20of%20Labor%22%20OR%20%22Federal%20Trade%20Commission%22%20OR%20%22United%20States%22%20OR%20%22State%20of%22%20OR%20%22People%20of%22%20OR%20%22Commonwealth%22%20OR%20%22National%20Labor%20Relations%22%20OR%20%22Environmental%20Protection%22%20OR%20%22Consumer%20Product%20Safety%22%20OR%20%22Securities%20and%20Exchange%22%20OR%20%22Attorney%20General%22%20OR%20%22District%20of%20Columbia%22) (8 dockets, none an agency action against the company)
- https://www.propublica.org/search?qss=%22Patagonia%22 (1 unrelated article)
- https://oag.ca.gov/prop65/60-Day-Notice-2022-00855 (Prop 65 private settlement, Patagonia Provisions, 2022; noted, not a concern)
- https://ww2.arb.ca.gov/w-los-angeles-building-materials-settlement-0 (CARB settlement with Patagonia Building Supplies, Inc., 2009; a different company)
