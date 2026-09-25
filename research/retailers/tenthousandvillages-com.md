---
name: Ten Thousand Villages
domain: tenthousandvillages.com
type: retailer
goods: [home decor, jewelry, accessories, personal care, gifts]
ownership: nonprofit
parent: none
hq: Akron, PA
marketplace: unknown
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns: []
ethics: 0.5
environment: 0.5
tier: acceptable
mentions: 3
mentioned_by: [borgenproject-org, goingzerowaste-com, goodgoodgood-co]
checked: 2026-09-25
---

Ten Thousand Villages sells handcrafted goods made by artisans around the world: home decor, kitchen and tabletop items, bath and personal care, fashion accessories and gifts. Wikipedia describes it as a nonprofit fair trade organization in Akron, Pennsylvania, founded by Edna Byler in 1946; it "entered into a partnership agreement" with the Mennonite Central Committee in 2012 and "is no longer owned by the MCC". Per the same article, "In January 2025, the organization announced the closure of its 13 company-owned US retail locations", continuing online and wholesale. ProPublica's Nonprofit Explorer lists many separately registered "Ten Thousand Villages" nonprofits (Ephrata, PA and a range of cities), consistent with independently run local stores. The site says "artisans earn fair wages in low income communities" and uses "upcycled, recycled + locally sourced materials".

Lists recommend it for fair trade: Borgen Project ("Founded in 1946", products "from an assortment of villages worldwide"), Going Zero Waste ("fair-trade" goods "designed to fight poverty") and Good Good Good (pays "artisans a living wage").

Wikipedia says it is "a founding member of the World Fair Trade Organization (WFTO) and a certified member of the Fair Trade Federation (FTF)". Neither is a certification kind this rating scores (`fair_trade` means Fair Trade USA), and neither was checked on the member organization's own directory this run, so they are noted here only.

CourtListener lists KHANNA v. TEN THOUSAND VILLAGES/MENNONITE CENTRAL COMMITTEE (E.D. Pa., filed 2003-11-26, terminated 2004-07-19) with no cause shown; what it alleged is unknown, so it is not recorded as a concern.

## Rating
- ethics: 0.5 baseline. No B Corp, Fair Trade USA or worker co-op listing verified (bcorporation.net blocked agents this run; the Fair Trade USA partner search URL returned 404; no row in data/certifications.json).
- environment: 0.5 baseline. 1% for the Planet not checked (directory returns no data to a plain fetch); no Climate Label listing checked.
- concerns: none recorded. NLRB case search returned no cases (the same search for "Starbucks" returned 2,559, so the search works); CourtListener API search found only the 2003 case above. OSHA establishment search and Violation Tracker returned 403, and the web search budget ran out before the news pass.
- tier: `acceptable` (0.5 + 0.5 = 1.0, not Amazon-owned per `node research/build-index.mjs --blocklist`).

## Sources
- https://en.wikipedia.org/wiki/Ten_Thousand_Villages
- https://www.tenthousandvillages.com/pages/about-us
- https://projects.propublica.org/nonprofits/search?q=%22Ten+Thousand+Villages%22
- https://www.nlrb.gov/search/case/%22Ten%20Thousand%20Villages%22
- https://www.nlrb.gov/search/case/%22Starbucks%22 (control search)
- https://www.courtlistener.com/api/rest/v4/search/?type=r&q=%22Ten%20Thousand%20Villages%22
- data/blocklist.md (no match)
