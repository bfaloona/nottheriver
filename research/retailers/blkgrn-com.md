---
name: BLK + GRN
domain: blkgrn.com
type: marketplace
goods: [skin care, hair care, home care, wellness]
ownership: unknown
parent: none
hq: unknown
marketplace: true
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns: []
ethics: 0.5
environment: 0.5
tier: acceptable
mentions: 4
mentioned_by: [amazonalts-org, goingzerowaste-com, goodgoodgood-co, thegoodtrade-com]
checked: 2026-09-25
---

BLK + GRN calls itself "An all-natural wellness ecosystem", a marketplace of non-toxic personal care, home care and wellness products made by Black artisans ("More Than a Marketplace. A Movement."). Its about page says Dr. Kristian J. Edwards launched it in 2017, "dedicated to empowering Black women to live healthier, more intentional lives through education, advocacy, and a curated selection of toxic-free products by Black artisans", and that it screens products against its own ingredient list (the "Toxic Twenty"). It presents itself as a curated marketplace of independent artisan brands, so `marketplace: true`. The pages fetched give no headquarters, ownership structure or investors, so those fields are `unknown`.

The list sites name it for Black-owned, non-toxic goods: "all-natural marketplace of Black artisans; non-toxic, plant-based, cruelty-free" (amazonalts-org), "non-toxic, plant-based, and cruelty-free" products by "Black artisans" (goingzerowaste-com), uplifting "Black women entrepreneurs" (goodgoodgood-co, via a discount-code link), and "all-natural and nontoxic goods" curated by "Black health experts" (thegoodtrade-com). Its homepage labels products "QUALITY TESTED" and "NON-TOXIC" but claims no third-party certification; no list site claims one of the five scored certifications.

Concern search was limited: the session's WebSearch budget ran out before this retailer, and the regulator site searches were inconclusive (see Best Buy's file and `raw/blocked-retailers-R3.md`). A CourtListener API search for "BLK + GRN", "BLK & GRN" and "BLK GRN" returned no case naming it. No concerns recorded.

Second pass (2026-09-25): FTC cases search for "BLK GRN" returned no results (the same unquoted search returns matches for other names this pass); the CourtListener agency-docket query for "BLK + GRN" since 2016 returned no dockets; ProPublica returned no articles for the name. No matching cases.

News pass (2026-09-25): two web searches, `"BLK + GRN" OR "BLK+GRN" lawsuit OR settlement OR fine OR violation` and `"BLK + GRN" OR "BLK+GRN" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`. The search engine matched the name to BlackRock (ticker BLK) and to generic agency pages; no hit was about this company, so the search is weak evidence of absence for a name this short. No parent is named, so no third search. No concerns added.

Operator-rule pass (2026-09-25): searched the California AG's Proposition 65 60-day notice database (Alleged Violator field) for `BLK`: the only match was an unrelated "Blk Dot Coffee"; no notice names BLK + GRN, so no concern added.

## Rating
- Blocklist: `node research/build-index.mjs --blocklist "BLK + GRN" blkgrn.com` returned "not on the blocklist".
- Certifications: none claimed or found; none counted.
- Ethics: 0.5 baseline, no counted certifications or accepted concerns found (search limited).
- Environment: 0.5 baseline, no counted certifications or accepted concerns found (search limited).
- Tier: ethics + environment = 1.0, so `acceptable`.
- Concern search: passes 1 to 3 (agency pages, FTC, CourtListener, ProPublica, general news search).

## Sources
- https://blkgrn.com/
- https://blkgrn.com/pages/about
- https://www.courtlistener.com/api/rest/v4/search/?q=%22BLK+%2B+GRN%22+OR+%22BLK+%26+GRN%22+OR+%22BLK+GRN%22+OR+%22Misfits+Market%22&type=r
- research/sites/amazonalts-org.md, goingzerowaste-com.md, goodgoodgood-co.md, thegoodtrade-com.md (reasons)
- data/blocklist.md (checked: no match)
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=BLK%20GRN&sort_by=search_api_relevance
- https://www.courtlistener.com/api/rest/v4/search/?type=r&order_by=dateFiled+desc&filed_after=2016-01-01&q=caseName%3A(%22BLK%20%2B%20GRN%22)%20AND%20caseName%3A(%22Equal%20Employment%22%20OR%20%22EEOC%22%20OR%20%22Secretary%20of%20Labor%22%20OR%20%22Department%20of%20Labor%22%20OR%20%22Federal%20Trade%20Commission%22%20OR%20%22United%20States%22%20OR%20%22State%20of%22%20OR%20%22People%20of%22%20OR%20%22Commonwealth%22%20OR%20%22National%20Labor%20Relations%22%20OR%20%22Environmental%20Protection%22%20OR%20%22Consumer%20Product%20Safety%22%20OR%20%22Securities%20and%20Exchange%22%20OR%20%22Attorney%20General%22%20OR%20%22District%20of%20Columbia%22) (pass 2 agency-docket query)
- https://www.propublica.org/search?qss=%22BLK%20%2B%20GRN%22
- https://oag.ca.gov/prop65/60-day-notice-search-results?field_prop65_defendant_value=BLK&items_per_page=100 (no matching settlement)
