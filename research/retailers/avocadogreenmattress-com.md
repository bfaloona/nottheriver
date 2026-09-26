---
name: Avocado Green Mattress
domain: avocadogreenmattress.com
type: brand
goods: [mattresses]
ownership: private
parent: Avocado Green Brands
hq: unknown
marketplace: unknown
sells_on_amazon: unknown
amazon_owned: false
certifications:
  - {kind: climate_neutral, source: https://explore.changeclimate.org/brand/avocado-green-brands, checked: 2026-09-25, verified_this_run: true}
  - {kind: one_percent_planet, source: https://directories.onepercentfortheplanet.org/profile/avocado-green-mattress, checked: 2026-09-25, verified_this_run: false}
concerns:
  - {kind: labor, title: "Inspection Detail | Occupational Safety and Health Administration", source: "https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1582670.015", date: 2022-08-11, accepted_source: true}
  - {kind: labor, title: "Inspection Detail | Occupational Safety and Health Administration", source: "https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1658946.015", date: 2023-08-16, accepted_source: true}
ethics: 0
environment: 1.0
tier: acceptable
mentions: 2
mentioned_by: [amazonalts-org, sustainablejungle-com]
checked: 2026-09-25
---

Avocado sells certified-organic mattresses under its own brand. Its "our story" page says every mattress is "handmade in our GOTS-certified facility in Fullerton, California" and that Avocado Green Mattress "is owned by Avocado Green Brands — a privately held company formed in 2018 when Avocado Mattress merged with Brentwood Home." Its help center says the company was founded in 2016 in Hoboken, New Jersey. The headquarters is left `unknown` because the two company pages disagree: the help center says corporate offices moved to Fullerton, California after the 2018 merger, while the story page says corporate offices are in Hoboken. Lists recommend it for natural, non-toxic mattresses; sustainablejungle-com quotes it as the "world's first mattress brand to be Climate Neutral Certified."

Claims on the company's own site that were not verified on the certifier's directory this run: Certified B Corporation "since 2014" with an Impact Score of 113.9 (bcorporation.net returned 403, and `data/certifications.json` has no B Corp row for this domain, so it does not count), and 1% for the Planet giving "since 2017" (see Rating).

Litigation seen on CourtListener, none counted as a concern because none shows a finding, a settlement or a regulator action: a suit (against Avocado Mattress L.L.C., N.D. Cal., filed 2023-04-28, nature of suit "370 Other Fraud", terminated 2023-08-11 per the docket), several ADA website-access suits, and pending suits filed in 2025 and 2026 (C.D. Cal., contract; E.D. Cal., "370 Other Fraud"; N.D. Cal.). They are allegations only.

OSHA (California state plan) inspections of the parent, Avocado Green Brands, LLC, in Fullerton, CA, both counted as labor concerns. The tie to this retailer comes from the company's own pages: the story page says Avocado Green Mattress "is owned by Avocado Green Brands" and that "Every Avocado mattress is handmade in our GOTS-certified facility in Fullerton, California". an accident inspection opened 2022-03-10 (2337 W Commonwealth Ave) after a worker was "struck by an object" from a belt sander, citations issued 2022-08-11, 2 other-than-serious, initial penalty $5,000, current $3,000 (one citation was contested and resolved by an administrative law judge's order; case closed 2024-11-18); and an accident inspection opened 2023-03-23 (570 N. Gilbert St.), citations issued 2023-08-16, 3 other-than-serious, penalty $935.

Second pass (2026-09-25): FTC cases search for "Avocado Green" (covers the retailer and its parent, Avocado Green Brands) returned 33 keyword matches ("Green", "Walgreens" and similar); the 20 shown, dated 2012 to 2026, include none naming Avocado as respondent; the CourtListener agency-docket query for "Avocado Green Mattress" since 2016 returned no dockets; ProPublica's one hit (a Philips CPAP story) is not about the company. No matching cases.

News pass (2026-09-25): three web searches, `"Avocado Green Mattress" lawsuit OR settlement OR fine OR violation`, `"Avocado Green Mattress" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")` and, for the parent, `"Avocado Green Brands" lawsuit OR settlement OR fine OR violation OR OSHA OR FTC OR "attorney general"`. Found: a CPSC recall notice dated 2024-08-01, "Mattress Pads Recalled Due to Fire Hazard; Violation of Federal Mattress Pad Flammability Regulation; Manufactured by Avocado Mattress", which says "The recalled mattress pads violate the mandatory federal flammability regulation for mattress pads, posing a fire hazard" (about 55,480 units; recalling firm Avocado Mattress LLC, d/b/a Avocado Green Mattress, Fullerton, CA). The recall was company-initiated in consultation with CPSC and shows no penalty; whether such a recall is a "finding" is a rule question left to the lead, so it is not recorded as a concern. It would not change the rating either way (ethics is already floored at 0). Also found: coverage of the 2023 class action (dismissed 2023-08-11, per the docket already noted) and a 2025 C.D. Cal. suit over allegedly fake sale prices (private suit, no ruling); neither is a concern. No agency action against the parent found. No concerns added.

Operator-rule pass (2026-09-25): searched the California AG's Proposition 65 60-day notice database (Alleged Violator field) for `"Avocado Green"`, `"Avocado Mattress"`: the retailer and its parent, Avocado Green Brands; no notices, so no settlement or judgment and no concern added.

## Rating
- Amazon-owned: no (`build-index.mjs --blocklist` reports "not on the blocklist").
- Ethics: 0.5 baseline. No ethics certification verified (B Corp claim unverifiable this run). −0.25 × 2 accepted labor concerns (osha.gov, parent company's factory) = −0.5. Result 0.
- Environment: 0.5 baseline, +0.25 `climate_neutral` (The Climate Label: explore.changeclimate.org, run by Climate Neutral dba The Change Climate Project, shows the brand as certified, first certified 2020, current certification year 2025), +0.25 `one_percent_planet` (the directory page renders no content to a fetch, so the row in `data/certifications.json` counts, `verified_this_run: false`; that row notes it is a Product Line Member, not whole-company). Result 1.0.
- Tier: ethics + environment = 1.0; accepted concerns in the last 5 years rule out `recommended`; 1.0 ≥ 1.0: `acceptable`.
- Concern search: passes 1 to 3 (agency pages, FTC, CourtListener, ProPublica, general news search).

## Sources
- https://www.avocadogreenmattress.com/pages/our-story
- https://help.avocadogreenmattress.com/en/articles/4650111-who-owns-avocado
- https://www.avocadogreenmattress.com/pages/about (404)
- https://explore.changeclimate.org/brand/avocado-green-brands
- https://www.climatelabel.org/
- https://directories.onepercentfortheplanet.org/profile/avocado-green-mattress (no content rendered; fallback row in data/certifications.json)
- https://www.bcorporation.net/en-us/find-a-b-corp/company/avocado-green-mattress (403)
- https://www.courtlistener.com/api/rest/v4/search/?q=%22Avocado%20Mattress%22&type=r (docket list: case names, courts, dates)
- https://www.courtlistener.com/?q=%22Avocado+Mattress%22&type=r (403)
- https://www.osha.gov/ords/imis/establishment.search?p_logger=1&establishment=Avocado&State=all&officetype=all&Office=all&sitezip=&p_case=all&p_violations_exist=all&startmonth=01&startday=01&startyear=2010&endmonth=09&endday=25&endyear=2026
- https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1582670.015
- https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1658946.015
- https://violationtracker.goodjobsfirst.org/?company_op=starts&company=Avocado (403)
- data/blocklist.md
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Avocado%20Green
- https://www.courtlistener.com/api/rest/v4/search/?type=r&order_by=dateFiled+desc&filed_after=2016-01-01&q=caseName%3A(%22Avocado%20Green%20Mattress%22)%20AND%20caseName%3A(%22Equal%20Employment%22%20OR%20%22EEOC%22%20OR%20%22Secretary%20of%20Labor%22%20OR%20%22Department%20of%20Labor%22%20OR%20%22Federal%20Trade%20Commission%22%20OR%20%22United%20States%22%20OR%20%22State%20of%22%20OR%20%22People%20of%22%20OR%20%22Commonwealth%22%20OR%20%22National%20Labor%20Relations%22%20OR%20%22Environmental%20Protection%22%20OR%20%22Consumer%20Product%20Safety%22%20OR%20%22Securities%20and%20Exchange%22%20OR%20%22Attorney%20General%22%20OR%20%22District%20of%20Columbia%22) (pass 2 agency-docket query)
- https://www.propublica.org/search?qss=%22Avocado%20Green%20Mattress%22
- https://www.cpsc.gov/Recalls/2024/Mattress-Pads-Recalled-Due-to-Fire-Hazard-Violation-of-Federal-Mattress-Pad-Flammability-Regulation-Manufactured-by-Avocado-Mattress (news pass: recall notice, not counted)
- https://oag.ca.gov/prop65/60-day-notice-search-results?field_prop65_defendant_value=%22Avocado+Green%22&items_per_page=100 (no matching settlement)
- https://oag.ca.gov/prop65/60-day-notice-search-results?field_prop65_defendant_value=%22Avocado+Mattress%22&items_per_page=100 (no matching settlement)
