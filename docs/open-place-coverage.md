# Open place data coverage check

2026-10-09. STATUS priority 6, the third of the [first steps](feasibility-overview.md#first-steps-in-order) in the scale feasibility work: do OpenStreetMap (OSM) or Overture Places hold the shops the quality evaluation says a nearby search should find, with a category a classifier could use? Zero Brave calls, zero calls to the deployed Worker. Every figure below is from `docs/evidence/quality/open-place-coverage/summary.json` unless another file is named; the per-shop rows are in `results.json` there, the method and rerun steps in its [README](evidence/quality/open-place-coverage/README.md).

## Headline

The 86 rows are the graded "nearby" recall baseline of eval20-0925 (84 distinct stores; two sit in two searches each). A row counts as found when an object whose name or brand matches the baseline name lies within a hand-mapped radius of the shop's expected location (0.5 mi for a street address, 1 mi for a named mall or neighborhood, 6 to 10 mi for a city). "Usable" is a tag-only judgment from `category-rules.json`: yes when the tag names a shop type that stocks the product as a matter of course (`shop=outdoor` for a camping tent), weak when it names a general merchant (`shop=department_store`, `superstore`), no otherwise.

| Measure | OSM | Overture Places | Either |
|---|---|---|---|
| Found | 64 of 86 (74%) | 82 of 86 (95%) | 84 of 86 (98%) |
| Found with a usable category: yes | 39 (45%) | 59 (69%) | 60 (70%) |
| Found with a usable category: weak | 22 (26%) | 18 (21%) | |
| Found, category says nothing (no) | 3 (3%) | 5 (6%) | |
| Not found | 22 (26%) | 4 (5%) | 2 (2%) |

Sources: `summary.json` (`osm.found`, `osm.usable`, `overture.found`, `overture.usable`, `either_found`, `either_usable_yes`). OSM is the live database as of 2026-10-09 for 54 of the 56 queried places and a mirror's copy from 2026-07-28 and 2026-06-01 for the other two (`osm.data_timestamps`); Overture is release `2026-09-23.1`.

## By zip kind, product category and chain status

Found / yes / yes-or-weak, out of the rows in that group (`summary.json`, `by_zip_kind`, `by_category`, `by_chain`).

| Group | Rows | OSM found | OSM yes | OSM yes or weak | Overture found | Overture yes | Overture yes or weak |
|---|---|---|---|---|---|---|---|
| Urban zips | 30 | 20 (67%) | 14 | 19 | 29 (97%) | 22 | 27 |
| Suburban zips | 34 | 24 (71%) | 16 | 24 | 32 (94%) | 25 | 31 |
| Rural zips | 22 | 20 (91%) | 9 | 18 | 21 (95%) | 12 | 19 |
| kitchen (cast iron skillet) | 12 | 10 | 5 | 10 | 11 | 6 | 9 |
| outdoor (camping tent, headlamp) | 16 | 16 | 12 | 16 | 16 | 12 | 15 |
| clothing (wool socks, rain jacket) | 10 | 6 | 6 | 6 | 10 | 10 | 10 |
| electronics_accessories (USB-C cable, AA batteries) | 10 | 8 | 3 | 8 | 9 | 5 | 9 |
| hardware (cordless drill, LED bulbs) | 10 | 6 | 3 | 4 | 9 | 8 | 9 |
| books_toys (jigsaw puzzle, wooden train set) | 9 | 6 | 4 | 5 | 9 | 7 | 8 |
| home (wool blanket, bath towels) | 9 | 5 | 0 | 5 | 8 | 3 | 8 |
| grocery (green tea, olive oil, chocolate bar) | 10 | 7 | 6 | 7 | 10 | 8 | 9 |
| Chain stores (labelled 2026-09-27) | 64 | 52 (81%) | 31 | 52 | 60 (94%) | 42 | 58 |
| Independent shops | 20 | 11 (55%) | 8 | 9 | 20 (100%) | 15 | 17 |
| Not in the label file | 2 | 1 | 0 | 0 | 2 | 2 | 2 |

The chain labels come from `evidence/quality/eval20-0925/chain-labels/chain-labels-local.json`, joined by search id and name; DeWald & Lengle Hardware (row 34) and Hillsboro Hardware (row 47) have no row there. With 9 to 34 rows a group, the differences between groups are indicative, not measured.

What "weak" is in practice: 21 of the 22 OSM weak rows and 16 of the 18 Overture weak rows are chains whose tag names the format, not the stock (Target, Walmart and Macy's as `department_store` or `superstore`; Walmart Supercenter and H-E-B as `supermarket` or `grocery_store`; Tractor Supply and Murdoch's as `country_store`, `agrarian` or `sporting_goods_store`; Walgreens as `pharmacy`; Pendleton as `clothes` for a wool blanket); the exceptions are Boston General Store (`shop=general`), JAX Outdoor Gear (`outdoor_store` for a wool blanket) and Petite Violette (`restaurant`) (`results.json`, `category_usable: "weak"`). A rule per chain (the 41 rows of `data/chains.json` cover most of them) would move those to yes without the tag.

## Freshness signals

| Signal | OSM (of 64 found) | Overture (of 82 found) |
|---|---|---|
| Website | 51 (80%) | 77 (94%) |
| Phone | 47 (73%) | 82 (100%) |
| Opening hours | 50 (78%) | not in the Places schema |
| Brand Wikidata id | 49 (77%) | 0 |
| Last edit or source update within 1 year | 19 (30%) | 77 (94%) |
| Within 2 years | 31 (48%) | |
| Median age | 758 days (about 2.1 years) | 25 days |
| Operating status "open" | no such tag | 74 (90%); 8 have none |
| Source | OSM contributors | `meta` 71, `BrightQuery` 6, `Microsoft` 5 |

Sources: `summary.json` (`osm.freshness`, `overture.freshness`). Overture's `source_update_time` is the provider's last update, not a check that the shop is open; nothing here verified either dataset against the shops. One concrete freshness case: OSM holds the Orwigsburg store as `name=Heiser's True Value` with `brand=Ace Hardware` and `ref=17093` (the store number in the baseline URL), last edited 2024-07-13, so one of the two affiliations is stale (`results.json`, row 33).

Name matching: 52 of the 64 OSM matches have the same name as the baseline after normalization, 9 contain it or are contained by it (`REI` for "REI San Francisco (Brannan St)"), 3 link only through the pattern or the brand (`osm.name_match`); for Overture the split is 56, 23 and 3 of 82 (`overture.name_match`).

## The misses and their likely reasons

OSM, 22 rows not found (`summary.json`, `osm.misses`). The reasons are read off the shop type and the raw replies; whether an object exists under another name was not checked.

| Likely reason | Rows |
|---|---|
| Mall or shopping-center tenant, likely not mapped as its own object | 7: Sur La Table (Natick Mall, row 4), High Country Outfitters (Ansley Mall, 24), HomeGoods (Knollwood, 41), Barnes & Noble (Galleria Edina, 53), The North Face (Natick Mall, 56), Crate & Barrel (Galleria Edina, 72), Pottery Barn (Galleria Edina, 73) |
| Independent shop, no object with the name within the radius | 9: Blackstone's of Beacon Hill (1), Abbadabba's (26), Phillips Toy Mart (38), Hillsboro Hardware (47), JAX Outdoor Gear (55), Natick Outdoor Store (57), Petite Violette (60), Splash of Olive (61), VSOP (62) |
| Standalone chain store, no object with the name or brand within the radius | 4: Butters Ace Hardware (44), Harbor Freight Antioch (48), Seneca Ace Hardware (64), Lakeshore Learning (84) |
| Name found only outside the accept radius (likely a different store) | 2: AT&T Buda (27; the nearest AT&T is on I-35 in Austin, 6.0 mi from the Buda centroid), B & C Hardware (45; an Ace Hardware 6.9 mi away) |

OSM, 3 rows found with no usable tag (`osm.no_shop_tag`): DeWald & Lengle Hardware (34, no `shop` tag, last edited 2017-05-03), Denney Electric Supply (35, `craft=electrician`), The Store at Mia (50, the museum object, no shop tag).

Overture, 4 rows not found (`overture.misses`): Crate & Barrel at Natick Mall (5), Butters Ace Hardware (44), Walgreens Morris (65), Pottery Barn at Galleria Edina (73). Overture, 5 rows found with a category that says nothing (`overture.no_category`): Boston General Store (2, `flowers_and_gifts_store`), The Baker's Pin (9, `cooking_school`), Walmart Hamburg for the camping tent search (21; the only Walmart record in the box is its pharmacy, which the hardware rule counts as weak in row 86), The Store at Mia (50, `art_museum`), Target San Mateo (82; only `Target Optical` at Bridgepointe is in the box, the store record is not).

Neither dataset: Butters Ace Hardware (44) and Pottery Barn at Galleria Edina (73).

Fourteen rows have an expected location beyond the eval's nearby radius of their zip (10 mi for RUCA 1 to 3, 30 mi for 4 to 10), measured to the geocoded city or landmark, not the shop; the baseline was built without that radius (`summary.json`, `outside_nearby_radius`). They are counted like every other row.

## What this does and does not decide

It does say:

- Open place data holds a record for nearly every shop the graded baseline wants a nearby search to find: 98% in OSM or Overture, 95% in Overture alone. The 22 rural rows (OSM 91%, Overture 95%) and the 20 labelled independents (OSM 55%, Overture 100%) are the two groups that matter most for this project's aims, and both are small samples.
- A tag alone makes "plausibly sells it" a lookup for about 70% of the rows (60 of 86 in either dataset); most of the remainder are department stores and supercenters, which a per-chain rule would cover. The classifier would still be needed for the long tail and for anything the tag cannot say.
- Overture's records are fresher on paper (median source update 25 days against OSM's 2.1-year median last edit) and carry phone and website almost always; OSM carries opening hours (78%) and Wikidata brand ids (77%), which Overture Places does not.
- The public Overpass API is not a runtime dependency to build on: 56 small queries took about 50 minutes on 2026-10-09 with both backends returning dispatcher errors for stretches and two mirrors failing (README, Run notes). A shop table would be built offline from the Overture parquet or OSM extracts and served from the Worker.

It does not say:

- Anything about precision. The check measures whether known-good shops are present, not how many `shop=outdoor` objects near a zip would be shown and not sell a tent. That needs a sample of open-data shops graded the way the eval grades Brave's.
- Anything about shops the baseline does not know. The 86 are what an agent found with web search on 2026-09-23; a shop no one found is not measured here.
- Whether the shops are open. No row was checked against the shop; `operating_status` and update times are provider claims.
- Whether the name matching here transfers. The expected locations and patterns were hand-mapped per row (`shops.json`); a production table would match on address and brand, not on a reviewer's regex.
- License and cost. OSM is ODbL and Overture Places is published under its own permissive license; the terms for serving derived shop rows, and the storage and build cost of a US-wide table, were not examined.
