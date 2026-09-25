---
name: EarthHero
domain: earthhero.com
type: retailer
goods: [zero-waste home goods, kitchen, reusables, personal care, baby and kids]
ownership: unknown
parent: ZeroWasteStore
hq: unknown
marketplace: unknown
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns: []
ethics: 0.5
environment: 0.5
tier: acceptable
mentions: 5
mentioned_by: [goingzerowaste-com, goodgoodgood-co, sustainablejungle-com, thegoodtrade-com, vstyleblog-com]
checked: 2026-09-25
---

EarthHero is an online shop for sustainable and zero-waste products from other brands. earthhero.com returned HTTP 403 to every fetch this run, so what it sells is taken from The Climate Label directory's record (keywords: home goods, kitchen, stainless steel, reusables, zero waste, personal care) and from the list pages. The same directory's brand data marks EarthHero as a child brand with parent "ZeroWasteStore", and ZeroWasteStore's page says its certification "covers business activities and operations for the following other brands: EarthHero"; `parent` is set from that certifier record (not a corporate filing). Ownership and headquarters were not shown by any fetched source. Lists recommend it for vetted sourcing ("five-step sourcing process", "5-pillar sourcing"), filters by values such as zero waste or US-made, and baby and kids goods (The Good Trade, V Style Blog, Good Good Good), and cite B Corp, 1% for the Planet and Climate Neutral status (Going Zero Waste, Sustainable Jungle, The Good Trade). Those claims are not verification.

Certifications, not counted: The Climate Label's EarthHero page says "EarthHero's certification has expired" and that it is "no longer meeting the requirements", while the parent ZeroWasteStore page (current certification year 2025) says its certification covers EarthHero. The two pages conflict, so the cautious reading (not counted) is used and the pair is logged for the operator. The directory's record also flags EarthHero as B Corp certified and a 1% for the Planet member, but those are not the B Corp or 1% for the Planet directories. The B Corp directory blocked this run (HTTP 403) and has no fallback row for earthhero.com; the 1% for the Planet profile page renders only the directory title to a fetch.

Second pass (2026-09-25): the FTC cases-and-proceedings search returned "No results found for these filters." for "EarthHero" and for its certifier-listed parent "ZeroWasteStore" (the same search for "Amazon" returned 26, so the search works); the CourtListener agency-docket search (EarthHero paired with a government party, filed since 2016) returned 0 dockets; ProPublica search returned no articles. No concern added.

## Rating
- Ethics: 0.5 baseline. No verified certification (B Corp claimed by lists; directory blocked, no fallback row). No accepted concern. = 0.5
- Environment: 0.5 baseline. The Climate Label brand page says expired (not counted; conflict with the parent's page logged). 1% for the Planet unverifiable (page renders by script). No environmental concern. = 0.5
- Total 1.0, not Amazon-owned: tier `acceptable`.
- Concerns: NLRB's case search returned no cases for "earthhero". The WebSearch budget was used up, so ftc.gov, osha.gov, dol.gov and news were not searched; the concern list may be incomplete.
- Blocklist: `node research/build-index.mjs --blocklist "EarthHero" earthhero.com` returned "not on the blocklist".
- Concern search partial: pass 2 checked FTC cases, CourtListener agency dockets since 2016 and ProPublica; no general news search, and DOJ, SEC and Violation Tracker were unreachable; tier is provisional.

## Sources
- https://explore.changeclimate.org/brand/earthhero
- https://explore.changeclimate.org/brand/zerowastestore
- https://explore.changeclimate.org/ (brand list, EarthHero record)
- https://directories.onepercentfortheplanet.org/profile/earthhero (no content rendered)
- https://earthhero.com/ (HTTP 403)
- https://earthhero.com/pages/about-us (HTTP 403)
- https://www.nlrb.gov/search/case/earthhero
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=EarthHero ("No results found for these filters.")
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=ZeroWasteStore ("No results found for these filters.")
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Amazon (control: 26 results)
- CourtListener agency-docket search for "EarthHero", filed since 2016 (0 results; URL in research/raw/concern-fetch/earthhero-com.json)
- https://www.propublica.org/search?qss=%22EarthHero%22 (no articles)
