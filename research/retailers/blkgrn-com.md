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

## Rating
- Blocklist: `node research/build-index.mjs --blocklist "BLK + GRN" blkgrn.com` returned "not on the blocklist".
- Certifications: none claimed or found; none counted.
- Ethics: 0.5 baseline, no counted certifications or accepted concerns found (search limited).
- Environment: 0.5 baseline, no counted certifications or accepted concerns found (search limited).
- Tier: ethics + environment = 1.0, so `acceptable`.
- Concern search incomplete this run (see raw/blocked-retailers-R3.md); tier is provisional.

## Sources
- https://blkgrn.com/
- https://blkgrn.com/pages/about
- https://www.courtlistener.com/api/rest/v4/search/?q=%22BLK+%2B+GRN%22+OR+%22BLK+%26+GRN%22+OR+%22BLK+GRN%22+OR+%22Misfits+Market%22&type=r
- research/sites/amazonalts-org.md, goingzerowaste-com.md, goodgoodgood-co.md, thegoodtrade-com.md (reasons)
- data/blocklist.md (checked: no match)
