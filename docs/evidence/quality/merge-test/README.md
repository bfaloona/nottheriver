# Local-results merge re-run (production classifier and ranking)

Run 2026-09-23. Script: `../rerun.mts` (ESM `.mts` because this folder has no package.json and tsx
would otherwise compile to CJS, which rejects top-level await). Command from the repo root:
`node <MT>/with-openrouter.mjs <MT>/rerun.mts`. Rerunning reuses `verdict-cache.json`, so it makes
no new LLM calls; delete that file to reclassify. `DRY=1 npx tsx <MT>/rerun.mts` prints the per-source
counts without calling the model or writing anything.

Uses the working-tree proxy code (uncommitted `mapPlaceResults` with the `rejected: Candidate[]`
argument). No Brave calls.

## What it does

| Step | Code |
|---|---|
| place1 / place2 to candidates | production `mapPlaceResults` (restaurant, amusement_park go to `rejected`) with the registry set built as in `pipeline.ts` |
| web to candidates | merge.mjs's directory regex, then production `mapWebResults` (name = profile name or host, snippet = description + extra snippets), `kind` set to `local`; no address, no coordinates |
| OSM to candidates | name = `name` or `brand`; url = `website` or `contact:website` (dropped if missing); snippet = the `shop` tag (the analog of the place icon hint); address built as `"<no> <street>, <city>, <ST> <zip>"` so `addressKey` reads the street, null when no street; `place_id = osm:<type>/<id>` |
| Classification | per source pool: `filterBlocked`, dedupe by url, batches of <=16 (`MAX_LLM_LOCAL`) through production `enrichAll` (production model list and prompt); verdict, certifications and signals cached by (search, url); drop rule is production `dropReason` |
| Ranking per arm | concat sources in order place1, place2, web, osm; production `dedupe`, `filterBlocked`, cached verdicts, `dropReason`, `scoreAll`, `finalizeResponse` (2 branches per domain, top 10, no distance cap) |
| Normalized | `canonical_name`, `category`, queries from `docs/evidence/quality/after3/responses/<id>.json`; `similar_products = []` (not saved there), so relevance can only match the canonical name or category |

Arms: A_prod = place1+place2, B_web = A+web, C_osm = A+OSM, D_all = all four.

## Counts per source

"No website" for places also includes registry-domain drops (none seen). Classified = unique urls in the
pool after the blocklist; a url seen earlier under another source reuses that verdict. The blocklist
removed nothing (checked: it does remove a "Whole Foods Market" control row; the only "amazon" text in
the raw files is in image URLs).

| search | source | raw | dir filter | no website | place_category | mapped | classified | classifier drops |
|---|---|---|---|---|---|---|---|---|
| cast-iron-skillet-urban | place_specialist | 20 | - | 2 | 0 | 18 | 18 | 12 |
| cast-iron-skillet-urban | place_broad | 20 | - | 1 | 1 | 18 | 16 | 6 |
| cast-iron-skillet-urban | brave_web | 10 | 1 | 0 | - | 9 | 9 | 2 |
| cast-iron-skillet-urban | osm | 131 | - | 63 | - | 68 | 67 | 7 |
| cast-iron-skillet-suburban | place_specialist | 20 | - | 2 | 1 | 17 | 17 | 5 |
| cast-iron-skillet-suburban | place_broad | 20 | - | 0 | 3 | 17 | 17 | 9 |
| cast-iron-skillet-suburban | brave_web | 10 | 1 | 0 | - | 9 | 9 | 2 |
| cast-iron-skillet-suburban | osm | 212 | - | 102 | - | 110 | 109 | 19 |
| cast-iron-skillet-rural | place_specialist | 3 | - | 1 | 0 | 2 | 2 | 1 |
| cast-iron-skillet-rural | place_broad | 20 | - | 2 | 0 | 18 | 18 | 3 |
| cast-iron-skillet-rural | brave_web | 10 | 0 | 0 | - | 10 | 10 | 1 |
| cast-iron-skillet-rural | osm | 35 | - | 20 | - | 15 | 15 | 0 |
| camping-tent-urban | place_specialist | 20 | - | 2 | 0 | 18 | 17 | 12 |
| camping-tent-urban | place_broad | 20 | - | 2 | 0 | 18 | 17 | 14 |
| camping-tent-urban | brave_web | 10 | 9 | 0 | - | 1 | 1 | 0 |
| camping-tent-urban | osm | 32 | - | 11 | - | 21 | 20 | 0 |
| camping-tent-suburban | place_specialist | 20 | - | 1 | 0 | 19 | 19 | 5 |
| camping-tent-suburban | place_broad | 20 | - | 1 | 0 | 19 | 19 | 10 |
| camping-tent-suburban | brave_web | 10 | 5 | 0 | - | 5 | 5 | 5 |
| camping-tent-suburban | osm | 21 | - | 3 | - | 18 | 18 | 3 |
| camping-tent-rural | place_specialist | 15 | - | 2 | 0 | 13 | 13 | 7 |
| camping-tent-rural | place_broad | 11 | - | 1 | 0 | 10 | 10 | 5 |
| camping-tent-rural | brave_web | 10 | 8 | 0 | - | 2 | 2 | 0 |
| camping-tent-rural | osm | 18 | - | 8 | - | 10 | 10 | 0 |

place_category drops (all `restaurant`): skillet-urban 1 (Jackson's Kitchen); skillet-suburban 4 (Night
Shift Kitchen + Tap, Cilicia Mediterranean Market and Kitchen, Lola's Italian Kitchen & Market, Street
Kitchen Express). None in the tent searches.

## Per arm

"In top 10 by source" credits every source that fed a deduped row, so a row found by both place
queries counts under each and totals can exceed 10. Ranks in `arms.json` can skip a number: production
ranks before the branch cap and the UI never renumbers.

| search | arm | pass 1 | classifier drops | local shown | in top 10 by source | cut |
|---|---|---|---|---|---|---|
| skillet-urban | A_prod | 26 | 14 | 10 | broad 10, specialist 5 | branch_cap 2 |
| skillet-urban | B_web | 35 | 16 | 10 | web 4, broad 6, specialist 2 | branch_cap 3, below_top_10 6 |
| skillet-urban | C_osm | 94 | 21 | 10 | osm 8, broad 2, specialist 1 | branch_cap 25, below_top_10 35 |
| skillet-urban | D_all | 103 | 23 | 10 | web 3, osm 5, broad 2, specialist 1 | branch_cap 26, below_top_10 34 |
| skillet-suburban | A_prod | 22 | 9 | 10 | specialist 10, broad 6 | below_top_10 3 |
| skillet-suburban | B_web | 31 | 11 | 10 | web 3, specialist 7, broad 5 | branch_cap 1, below_top_10 9 |
| skillet-suburban | C_osm | 132 | 28 | 10 | osm 5, specialist 5, broad 4 | branch_cap 40, below_top_10 20 |
| skillet-suburban | D_all | 141 | 30 | 10 | web 3, osm 3, specialist 4, broad 3 | branch_cap 44, below_top_10 16 |
| skillet-rural | A_prod | 19 | 4 | 10 | broad 10, specialist 1 | below_top_10 5 |
| skillet-rural | B_web | 29 | 5 | 10 | web 7, broad 3, specialist 1 | branch_cap 1, below_top_10 13 |
| skillet-rural | C_osm | 34 | 4 | 10 | osm 5, broad 5, specialist 1 | branch_cap 1, below_top_10 19 |
| skillet-rural | D_all | 44 | 5 | 10 | web 7, broad 3, specialist 1 | branch_cap 5, below_top_10 24 |
| tent-urban | A_prod | 31 | 24 | 7 | specialist 5, broad 3 | |
| tent-urban | B_web | 32 | 24 | 8 | specialist 5, broad 3, web 1 | |
| tent-urban | C_osm | 52 | 24 | 10 | osm 7, specialist 2, broad 1 | branch_cap 8, below_top_10 10 |
| tent-urban | D_all | 53 | 24 | 10 | osm 7, specialist 2, broad 1 | branch_cap 8, below_top_10 11 |
| tent-suburban | A_prod | 26 | 11 | 10 | specialist 10, broad 7 | below_top_10 5 |
| tent-suburban | B_web | 31 | 16 | 10 | specialist 10, broad 7 | below_top_10 5 |
| tent-suburban | C_osm | 44 | 14 | 10 | osm 6, specialist 4, broad 4 | branch_cap 2, below_top_10 18 |
| tent-suburban | D_all | 49 | 19 | 10 | osm 6, specialist 4, broad 4 | branch_cap 2, below_top_10 18 |
| tent-rural | A_prod | 15 | 9 | 6 | specialist 5, broad 5 | |
| tent-rural | B_web | 17 | 9 | 8 | web 2, specialist 5, broad 5 | |
| tent-rural | C_osm | 25 | 9 | 10 | specialist 5, broad 5, osm 4 | below_top_10 6 |
| tent-rural | D_all | 27 | 9 | 10 | web 2, specialist 5, broad 5, osm 2 | below_top_10 8 |

`to-grade.json`: 103 unique (search, url) rows, seeded shuffle (mulberry32, seed 20260923).
Per search: skillet-urban 21, skillet-suburban 18, skillet-rural 22, tent-urban 15, tent-suburban 15, tent-rural 12.

## LLM cost

41 enrich calls, 0 failures or retries, all `google/gemma-4-31b-it`. 55,515 prompt + 14,427 completion
= 69,942 tokens; OpenRouter-reported cost $0.0129. Every classified row got a valid verdict (0 unjudged,
`stats.json` `sources.*.unjudged`).

## Surprises and caveats

| ID | Finding |
|---|---|
| S1 | Web rows float to the top of B and D. A web page title names the product (relevance 1.0) while place titles almost never do (0.2); web rows have no coordinates, so proximity is 0, but that costs only 0.15 against the 0.2 relevance gap. Skillet-rural D_all's top 7 are all web pages: national chain category pages (Lowe's, Home Depot x2, Walmart), a maker's shop page (Lodge), and a co-op product page for a skillet handle. This is production scoring applied to a source it was not built for, not a bug in the run. |
| S2 | Some web "local" rows are not local: the same Greenfield co-op product page appears in both skillet-urban and skillet-rural. |
| S3 | Place and OSM rows for the same store often survive dedupe: OSM addresses spell out "Avenue"/"Street" where Brave abbreviates, and hosts differ (`acehardware.com` vs `www.acehardware.com`). Tags Hardware sits at ranks 9 and 10 of skillet-urban D_all as two rows, which also uses up acehardware.com's two branch slots. Left unfixed on purpose (production dedupe). |
| S4 | The classifier dropped few OSM rows: 29 of 239 overall, and none in three pools (skillet-rural, tent-urban, tent-rural), vs 12 of 18 for skillet-urban place_specialist. OSM snippets carry a shop tag ("hardware", "houseware"), which may read as a stronger "this is a store" hint than the place icon. The graders will show whether that leniency is right. |
| S5 | A_prod has no distance cap: skillet-rural A_prod ranks 6-10 are 82-236 km away (proximity 0, ranked on relevance/ethics/env ties). |
| S6 | tent-urban and tent-rural A_prod show only 7 and 6 local rows; the classifier dropped 24 of 31 and 9 of 15. OSM fills both to 10. |
| S7 | Unlike production, each source pool was classified in its own call(s) with no online candidates alongside, and without `similar_products`. Verdicts can shift with batch context; this is the controlled choice, but A_prod here will not exactly match the after3 production run. |

## Blinding

No forbidden file was opened. Filenames `grades.json`, `score.json`, `draft.json`, `merged.json`,
`after3/grades.json` and `after3/report.json` appeared in directory listings only; none was read,
grepped or listed. The only after3 files read were the six `responses/*.json`.

`to-grade.json` hides arm, source, score and rank, but web rows are recognizable: `address` is null and
the name is the site's profile name or host ("Fbgcastiron", "Lowe's" on a category-page URL). Production
names web rows the same way; there is no address to add.
