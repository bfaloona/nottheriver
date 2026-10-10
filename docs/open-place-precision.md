# Open place data precision check

2026-10-09. Decision OQ1 in [scale-feasibility.md](scale-feasibility.md#decisions-for-the-operator-in-the-order-they-unblock-each-other) (item 6), the fourth of the [first steps](feasibility-overview.md#first-steps-in-order): if the site showed every Overture Places shop near a zip whose category passes the [coverage check's](open-place-coverage.md) rule, how many would really sell the product, and how many really exist? The coverage check measured the other direction (95% of the graded baseline shops are in Overture, 70% with a usable category). Zero Brave calls, zero calls to the deployed Worker. Every figure below is from `docs/evidence/quality/open-place-precision/summary.json` unless another file is named; the per-row grades are in `grades.json` there, the method and rerun steps in its [README](evidence/quality/open-place-precision/README.md).

## Headline

The sample is, for each of the 20 graded searches of eval20-0925, the 10 nearest Overture Places rows (release `2026-09-23.1`) inside the nearby radius of the zip centroid (10 mi for RUCA 1 to 3, 30 mi for 4 to 10) whose category the coverage check's `category-rules.json` calls `yes` for the product category, and separately the 5 nearest it calls `weak`, after dropping rows Overture marks closed and exact duplicates. 300 rows, graded blind to tier by ten page-reading graders the way `eval/README.md` section 2 grades local results (`sample.json`, `grades.json`, `summary.json` `graded`).

| Tier | Rows | Sells it (yes or equivalent), unknown counted as not | Sells it, among rows the grader could tell | Exists at the address | Confirmed not there | Could not tell it exists |
|---|---|---|---|---|---|---|
| `yes` (category names a shop type that stocks it) | 200 | 4 (2.0%) | 4 of 87 (4.6%) | 63 (31.5%) | 17 | 120 |
| `weak` (general merchant) | 100 | 2 (2.0%) | 2 of 26 (7.7%) | 38 (38.0%) | 3 | 59 |
| All | 300 | 6 (2.0%) | 6 of 113 (5.3%) | 101 (33.7%) | 20 | 179 |

Sources: `summary.json` `tiers.{yes,weak,all}` (`precision_all`, `precision_excl_unknown`, `existence`, `exists`). By the eval's own local rule (sells and exists, over rows where neither is unknown, a shop confirmed not there counted bad), 4 of 73 judgeable rows are good (5.5%) and 227 are not judgeable (`tiers.all.good_eval_rule`).

The six that sell it (`grades.json`, `sells_product` yes or equivalent): Publix at Piedmont for extra virgin olive oil, Dollar Tree Hamburg for LED bulbs, Star's at Cambridge (a one-tenant center whose tenant is Star Market) for a cast iron skillet, CB2 Minneapolis for bath towels, the Camping World dealership that replaced Gander Outdoors in Hamburg for a camping tent, and Burberry Natick as an equivalent (trench coats) for a rain jacket.

Sells-it is the number the decision turns on, and it has to be read with its unknowns: 187 of 300 rows (62%) the grader could not judge. Of those, 44 have no website in Overture, 36 were refused by the site (403 or 401), 5 hit a bot challenge, 45 had a site that no longer loads (dead domain, 404, parked), and 57 loaded a site that shows no stock information (`reasons.unknown_by_access`). The 19 rows that join to `data/chains.json` (all by website domain: Ace Hardware, Barnes & Noble, Cabela's, DICK'S, Dollar General, HomeGoods, Lowe's, Macy's, Publix, Tractor Supply, Walgreens, Walmart) are the clearest case: 17 are unknown because the chain's site refused the grader, and a person who can open lowes.com or cabelas.com would likely settle most of them (`chains`, `sensitivity.chain_unknown_rows`). If every one of those 17 sold the product, precision would be 23 of 300 (7.7%), and 14 of 200 (7.0%) in the `yes` tier (`sensitivity`). That is the ceiling the unknowns hide, not a measurement.

## Why the `yes` tier is this wide

The coverage check's rule matches a rule entry against every element of Overture's `taxonomy.hierarchy` and against `basic_category`, which is a coarse group. Applied to known-good shops that was harmless; applied to an area it admits the whole branch. `hardware_home_and_garden_store` (a `yes` for kitchen, outdoor, hardware, electronics and home) sits above furniture, mattress, appliance, carpet and flooring stores, garden centers, roofers and lumber yards; `fashion_and_apparel_store` (a `yes` for clothing) sits above jewelry and eyewear stores; `food_and_beverage_store` (grocery) above tobacco and liquor shops. `sample.json` records per row whether the deciding category is the row's own `taxonomy.primary` (`leaf`) or only an ancestor or the coarse group (`ancestor`):

| `yes` tier by match level | Rows | Sells it | Sells it, among judgeable | Does not sell it | Exists |
|---|---|---|---|---|---|
| Leaf: the row's own category is in the list | 85 | 3 (3.5%) | 3 of 21 (14.3%) | 18 | 30 (35.3%) |
| Ancestor: only a parent or the coarse group is | 115 | 1 (0.9%) | 1 of 66 (1.5%) | 65 | 33 (28.7%) |

Source: `by_tier_by_level`. 81 of the 200 `yes` rows came in through `hardware_home_and_garden_store` alone and none of them sells the product (0 of 81; 51 graded no, 30 unknown; `by_tier_by`). The sample is also the nearest shops, not a random draw: in the seven urban searches the tenth `yes`-tier shop is 0.1 to 0.82 mi from the centroid, in the seven suburban ones 0.34 to 4.4 mi (`candidates.farthest_sampled_yes_mi`), so it measures what a distance-sorted list would show first.

## By zip kind and product category

Sells it over rows, then over judgeable rows; exists over rows (`by_zip_kind`, `by_category`, the `all` measure). With 30 to 105 rows a group and six sellers in all, the differences between groups are noise.

| Group | Rows | Sells it | Sells it, judgeable | Exists | Not there |
|---|---|---|---|---|---|
| Urban zips | 105 | 3 (2.9%) | 3 of 36 | 26 (24.8%) | 10 |
| Suburban zips | 105 | 1 (1.0%) | 1 of 43 | 40 (38.1%) | 7 |
| Rural zips | 90 | 2 (2.2%) | 2 of 34 | 35 (38.9%) | 3 |
| kitchen (cast iron skillet) | 45 | 1 | 1 of 20 | 12 | 3 |
| outdoor (camping tent, headlamp) | 60 | 1 | 1 of 29 | 25 | 3 |
| clothing (wool socks, rain jacket) | 30 | 1 | 1 of 7 | 7 | 2 |
| hardware (cordless drill, LED bulbs) | 30 | 1 | 1 of 17 | 18 | 0 |
| grocery (green tea, olive oil, chocolate bar) | 45 | 1 | 1 of 11 | 15 | 2 |
| books_toys (jigsaw puzzle, wooden train set) | 30 | 0 | 0 of 9 | 9 | 6 |
| electronics_accessories (USB-C cable, AA batteries) | 30 | 0 | 0 of 9 | 8 | 1 |
| home (wool blanket, bath towels) | 30 | 1 | 1 of 11 | 7 | 3 |

By Overture source: the 177 rows from `meta` exist at the address in 80 cases (45%) with 5 confirmed gone; the 45 from `Foursquare` exist in 3 (7%) with 9 confirmed gone; `BrightQuery` 7 of 46, `Microsoft` 7 of 27 (`by_source_dataset`). Rows with no website (56) exist in 8 cases (14%) against 93 of 244 (38%) with one (`by_website`); a shop with no website gave the grader almost nothing to read.

## Thin nearby sections

None. Every search had at least 65 `yes`-tier candidates inside its radius (wooden train set, Franklin TN) and up to 2,293 (wool socks, Atlanta), 18,631 in all, plus 22,577 `weak` (`candidates.per_search`, `thin_yes_sections`, `yes_in_radius_total`). Overture's `operating_status` removed 981 rows, all `permanently_closed`; 325 exact duplicates (same name and street) were dropped (`dropped_not_open_total`, `dropped_duplicates_total`). The empty-section risk the task asked about does not arise with this rule; the opposite does.

## Comparison with the Brave-sourced eval

The quality evaluation's local precision on the same 20 searches was 70.9% and 71.0% in the store-types Phase 4 runs and 63.6% and 61.7% in eval20-0925 ([quality.md](quality.md)). Those grades were of the site's top 10 after Brave's local search and the model's classifier had chosen and ordered them, with unknowns left out of the denominator. This check graded a category-only lookup with no classifier, no name rule and no ranking beyond distance, and counts unknowns against it. The two are not the same measure. The fair reading is that 2% (5% among judgeable rows, at most 8% if every bot-blocked chain row sold it) is what a classifier would start from if open place data replaced Brave's local search with the coverage check's rule as the only filter; Brave's local search plus the classifier starts from a candidate list the eval found 39% to 44% "likely sells it" ([quality.md](quality.md), the Phase 4 comparison) and ends at 62 to 71%. A classifier would have to do far more work on this list than it does on Brave's, and 62% of the rows give it nothing to read.

## The misses and their likely reasons

107 rows graded does-not-sell and 20 confirmed not at the address (`misses`, `reasons`); the groups overlap.

| Likely reason | Rows | Examples (`grades.json`) |
|---|---|---|
| Category too broad: the rule matched a parent category, and the shop's own category says it does not stock the product | 75 of the 107 no rows are ancestor matches (`reasons.no_by_level_and_closed`); by own category, furniture 15, building supply 15, mattress 5, garden center 4, carpet 3, home decor 3, jewelry 3 (`no_by_taxonomy_primary`) | Reside (vintage furniture) for a cast iron skillet; Mattress Firm for a camping tent; Kendra Scott (jewelry) for a rain jacket; D&R Roofing for a wool blanket; Brooklinen (bedding) for a camping tent |
| Category right in kind, wrong in practice: the rule's own `yes` or `weak` entry names a type that does not carry this product | 32 no rows are leaf matches | 3rd Bar (a `bar_and_grill_restaurant`, which the grocery rule counts as `weak` through `restaurant`) for loose leaf tea; Publix for a cordless drill; a `music_and_dvd_store` (Redbox kiosk) for a jigsaw puzzle |
| Closed or moved | 20 rows with `local_exists: no` (11 also graded no, 9 unknown) | Fresh Pond Market (closed 2019), La Mongerie (closed 2013), Building #19 (chain bankrupt 2013), Toys R Us Franklin, two Redbox kiosks (chain liquidated 2024), Bound Booksellers and Flora Grubb (moved) |
| Website points at another business or a dead domain | 45 unknown rows with `page_access: error`; the graders also name sites that now belong to a university, an excavation contractor, a law firm, a trash hauler, Seneca Foods, and several gambling or parked pages | Silver Health Guide (an excavation contractor's site), GRS Jewelry (Stucchi Jewelers' site) |
| No website | 56 rows; 44 unknown, 11 no, 1 yes | Huron Village (a shopping district, not a shop), Shoshana (nothing found), Ah Nich Shop |
| Bot-blocked | 41 blocked and 7 challenged; 17 of the 19 chain rows | Lowe's, Cabela's, DICK'S, Ace Hardware, Dollar General, Barnes & Noble, Macy's, HomeGoods, Tractor Supply |

Two rows the graders flagged as likely bogus Overture records: a keychain maker with a Tennessee street, a Texas zip and a Chinese phone number (r270), and "Silver Health Guide" whose website, address and phone all belong to an excavation contractor (r160).

## What this does and does not decide

It does say:

- The coverage check's category rule, used alone over an area, is not a local-shop filter. Two in a hundred of the nearest shops it admits were seen to sell the product, five in a hundred of the ones a grader could judge, and a third were confirmed to exist at the address. The `yes` and `weak` tiers came out the same (`tiers`).
- Most of the loss is the rule, not the data: 115 of the 200 `yes` rows came in through a parent category or the coarse `basic_category`, and 1 of them sells the product. Matching the rule to `taxonomy.primary` only, and dropping entries that name a group rather than a shop type (`hardware_home_and_garden_store`, `fashion_and_apparel_store`, `food_and_beverage_store`, `restaurant`), is the first thing to try; on this sample it would have removed 75 of the 107 no rows (65 in the `yes` tier, 10 in `weak`) and 1 of the 6 sellers (`by_tier_by_level`, `reasons.no_by_level_and_closed`). What the leaf-only precision would be on a fresh sample is not measured here; the 85 leaf rows in this one are 3.5% (14.3% judgeable).
- Overture's rows are not a check that a shop is open. After dropping what Overture itself marks closed, 20 of 300 rows were confirmed gone or moved and 179 could not be confirmed either way; the 45 rows sourced from Foursquare existed in 3 cases.
- Shops with no website, or whose site refuses bots, are a large share (56 and 48 of 300) and give a page-reading classifier nothing. Brave's local results carry the same problem, but the eval's grades show it reaching 62 to 71% after the classifier; this list would need a different signal (a chain rule, a name rule, a stock feed) before a classifier sees it.

It does not say:

- What precision a better rule reaches. The rule was measured as written; the leaf-only figure above is a re-cut of the same 300 rows, which were chosen by the wide rule and sorted by distance, not a new sample.
- What the 17 bot-blocked chain rows sell. A person opening those pages would settle them; the ceiling if all sold it is 7.7%.
- Anything about shops farther than the nearest 10 or 15. The sample is distance-sorted, so in dense zips it is the few blocks around the centroid (0.1 to 0.82 mi to the tenth `yes` row in the seven urban searches); a ranking that favored named chains or shops with websites would see a different list.
- Whether a shop that was `unknown` sells the product. `unknown` is counted as not selling in the headline and left out in the second column; neither is the truth.
- Recall. The coverage check measured that direction (95% of the graded baseline shops are in Overture); this check says nothing about it.
- License and cost of a shop table built from Overture; the coverage report's open items stand.
