# Local-results rerun: score

Scored 2026-09-23 by `score.mjs` (this folder; `node score.mjs` rewrites `score.json`). Inputs: `arms.json`,
`grades-blind.json`, and the 23 `confirmed: true` local baseline items in
`~/dev/ai/nottheriver/docs/evidence/quality/after3/grades.json` (28 local items, 5 unconfirmed).
Precision and recall copy `eval/summarize.mjs` `precision()` and `returned()` (registrable domain via `tldts`).
Every top-10 row had a grade (0 missing).

**Decision: C_osm fails the build rule** (45.1% precision, needs 55%; 26.1% recall, needs 40%). It also
does not beat production (A_prod) on either measure. Adding sources is not the lever; per the rule, the next
lever is automated stock checks (for example Shopify `/products.json`) or a stronger classifier model.

## Per arm

| Arm | Rows | Graded | Excluded (unknown) | Relevant | Precision | Recall, all (23) | Recall, no chains (4) | Recall, same branch (23) |
|---|---|---|---|---|---|---|---|---|
| A_prod | 53 | 38 | 15 | 18 | 47.4% | 6 (26.1%) | 0 | 5 |
| B_web | 56 | 47 | 9 | 21 | 44.7% | 10 (43.5%) | 0 | 5 |
| C_osm | 60 | 51 | 9 | 23 | 45.1% | 6 (26.1%) | 0 | 5 |
| D_all | 60 | 55 | 5 | 25 | 45.5% | 8 (34.8%) | 0 | 4 |

"Same branch" is a stricter check than `returned()`: same domain and same url path, so a national category
page or a different store of the chain does not count. It is here because B_web's recall gain is almost
all of that kind (see caveats).

Precision if the unknowns were resolved (bounds, not estimates):

| Arm | All unknowns irrelevant | Every unknown that could be relevant is relevant |
|---|---|---|
| A_prod | 34.0% | 59.2% (11 possible) |
| B_web | 37.5% | 51.9% (7) |
| C_osm | 38.3% | 51.7% (7) |
| D_all | 41.7% | 49.2% (4) |

C_osm stays below 55% even in its best case, so the decision does not depend on how unknowns are treated.

## Which way each arm lands

| Arm | Precision >= 55% | Recall >= 40% | Reading |
|---|---|---|---|
| C_osm (the rule) | no (45.1%) | no (26.1%) | Build rule fails. Precision sits between the two anchors (55% and ~38%), not a clean fallback to ~38%, but the lever named for the fallback branch applies. |
| D_all | no (45.5%) | no (34.8%) | Same; its extra recall comes from web category pages. |
| A_prod | no (47.4%) | no (26.1%) | Highest point precision, but also the most unknowns (15); range 34 to 59%. |

## Per source (rows credited to every source that fed them)

| Arm | Source | Top-10 rows | Only source | Graded | Precision | Baseline items supplied (items no other source supplied in brackets) |
|---|---|---|---|---|---|---|
| C_osm | brave_place_specialist | 18 | 4 | 15 | 60.0% | Crate & Barrel Natick, REI x2, DICK'S Plymouth Meeting, Cabela's Hamburg |
| C_osm | brave_place_broad | 21 | 7 | 16 | 56.3% | same 5 as specialist |
| C_osm | osm | 35 | 35 | 31 | 41.9% | REI x2, DICK'S Plymouth Meeting, Cabela's Hamburg (all duplicates of place rows) [Target Hadley] |
| D_all | brave_place_specialist | 17 | 4 | 15 | 60.0% | Crate & Barrel Natick, REI x2, DICK'S Plymouth Meeting, Cabela's Hamburg |
| D_all | brave_place_broad | 18 | 5 | 15 | 53.3% | same 5 as specialist |
| D_all | brave_web | 15 | 15 | 15 | 53.3% | [Home Depot Hadley, Walmart Northampton, Walmart Hamburg] (all by domain only, see caveats) |
| D_all | osm | 23 | 23 | 21 | 38.1% | REI x2, DICK'S Plymouth Meeting, Cabela's Hamburg (duplicates of place rows) |

OSM added exactly one baseline item no other source supplied (Target Hadley, same branch) and pushed out one
that A_prod had (Home Depot Somerville, A_prod rank 11), so C_osm recall equals A_prod's. OSM rows are the
least precise source in both arms; place rows stay at 53 to 60%.

## Chain labels (fixed before recall was computed; chain = 10 or more US stores under the same name)

| Search | Baseline item | Chain | Reason |
|---|---|---|---|
| skillet-urban | Blackstone's of Beacon Hill | no | single independent shop |
| skillet-urban | Boston General Store (Brookline) | no | independent, one or two shops |
| skillet-urban | The Home Depot (Somerville) | yes | about 2,000 US stores |
| skillet-suburban | Sur La Table (Natick) | yes | about 50+ US stores |
| skillet-suburban | Crate & Barrel (Natick Mall) | yes | about 80+ US stores |
| skillet-suburban | The Home Depot (Natick) | yes | about 2,000 US stores |
| skillet-suburban | Target (Framingham) | yes | about 1,900 US stores |
| skillet-suburban | Kitchen Outfitters (Acton) | no | single independent shop |
| skillet-rural | The Baker's Pin (Northampton) | no | single independent shop |
| skillet-rural | Target (Hadley) | yes | about 1,900 US stores |
| skillet-rural | The Home Depot (Hadley) | yes | about 2,000 US stores |
| skillet-rural | Walmart (Northampton) | yes | about 4,600 US stores |
| tent-urban | Walmart (Roosevelt Blvd) | yes | about 4,600 US stores |
| tent-urban | REI (Conshohocken) | yes | about 190 US stores |
| tent-suburban | REI (Conshohocken/Plymouth Meeting) | yes | about 190 US stores |
| tent-suburban | DICK'S (Plymouth Meeting Mall) | yes | about 850 US stores |
| tent-suburban | REI (King of Prussia) | yes | about 190 US stores |
| tent-suburban | L.L.Bean (King of Prussia) | yes | about 50+ retail and outlet stores |
| tent-suburban | Walmart Supercenter (Norristown) | yes | about 4,600 US stores |
| tent-rural | Cabela's (Hamburg) | yes | about 70+ US stores under that name |
| tent-rural | Walmart Supercenter (Hamburg) | yes | about 4,600 US stores |
| tent-rural | Dunham's Sports (Pottsville) | yes | about 250 US stores |
| tent-rural | DICK'S (Reading) | yes | about 850 US stores |

Store counts are from general knowledge, not checked for this run. Only 4 of 23 items are independents, so
"no chains" recall is 0 of 4 in every arm and says little beyond "no arm finds them".

## Caveats

| ID | Caveat |
|---|---|
| CAV-1 | Small n: 6 searches, 53 to 60 rows per arm. One row moves precision by about 2 points; the arms' precision spread (44.7 to 47.4%) is inside that noise. |
| CAV-2 | Domain matching (`returned()`) over-credits. One REI Conshohocken row counts for both REI items in tent-suburban (every arm). Most of B_web and D_all's web hits are national category pages (Home Depot and Walmart cast-iron pages) or the wrong branch (tent-rural D_all's Walmart row is the Philadelphia store page, credited as Walmart Hamburg). Same-branch recall is 4 to 5 of 23 in every arm. |
| CAV-3 | Known duplicates in C_osm and D_all: the same store via place and OSM ("Ave" vs "Avenue", `www.` host) survives dedupe (REI, DICK'S, Cabela's in tent searches; Tags Hardware in skillet-urban D_all), using up top-10 slots that could hold new stores. Each duplicate counts as its own graded row. |
| CAV-4 | Web rows outrank shops: a missing distance costs 0.15 while a title naming the product earns about 0.2 relevance, so category pages sit at the top of B_web and D_all (README S1). |
| CAV-5 | `similar_products` was empty in this rerun, so relevance matched only the canonical name or category; production may rank differently. |
| CAV-6 | OSM misses are ranking, not supply: the OSM pools held The Baker's Pin (classifier "yes"), Walmart Northampton ("yes") and Target Framingham ("maybe"), none dropped, all ranked below the top 10 behind Dollar Tree, Lowe's and similar near-equal scores. Blackstone's of Beacon Hill was in both place pools but dropped by the classifier as a "service" site. Source: `verdicts.json`. |
| CAV-7 | A_prod here is not the after3 production run: each source was classified in its own batches, so verdicts can differ (README S7). |
| CAV-8 | The chain threshold and store counts are general-knowledge calls; none of the 4 independents was returned, so relabeling a borderline chain would only move the "no chains" denominator. |
