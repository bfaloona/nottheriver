# Open place data precision check (2026-10-09)

Evidence behind [docs/open-place-precision.md](../../../open-place-precision.md): a sample of Overture Places shops near the 20 graded searches' zips whose category passes the [coverage check's](../open-place-coverage/README.md) rule, graded the way the quality eval grades local results. Decision OQ1 in `docs/scale-feasibility.md`. No Brave calls, no calls to the deployed Worker; Overture Places and the shops' own websites (or one public listing) were the only sources read.

## Files

| File | What it is |
|---|---|
| `query-overture.py` -> `raw/<search_id>.json` (not committed, 39 MB; `.gitignore`) | For each of the 20 searches in `eval20-0925/method/ids.json`: product, category and zip from `eval/queries.json`, centroid and RUCA from `public/zips.json`, nearby radius 10 mi for RUCA 1 to 3 and 30 mi for 4 to 10 (`docs/ranking.md`, Distance groups), then every Overture Places row (release `2026-09-23.1`, read from the public parquet on S3 with DuckDB, no credentials) in the radius's bounding box whose `basic_category`, `taxonomy.primary` or `taxonomy.hierarchy` carries any category the coverage check's `category-rules.json` lists as `yes` or `weak` for the product category (the category's own lists plus `overture_weak_all`) |
| `build-sample.mjs` -> `sample.json`, `counts.json`, `to-grade.json`, `briefs/batch-NN.md` | Haversine cut to the radius; tier judged with the same function as the coverage check's `match.mjs` (`judgeOverture`: any `yes` category wins, then any `weak`); rows whose `operating_status` is set and not `open` dropped and counted; exact duplicates (same normalized name and street address) dropped, nearest kept; then the 10 nearest `yes` and 5 nearest `weak` rows per search. `sample.json` holds every Overture field the report uses plus `tier_by` (the deciding category) and `tier_by_level` (`leaf` when that is the row's own `taxonomy.primary`, `ancestor` when only a parent in the hierarchy or the coarse `basic_category` matched). `counts.json` holds the per-search candidate counts, since `raw/` is not committed. `to-grade.json` is the blinded view: row id, product, name, address, website, phone, in a seeded shuffle so neither the id nor the position says which search or tier a row came from |
| `briefs/TEMPLATE.md`, `briefs/batch-NN.md` | The grader brief: the rules (eval README section 2 field meanings, the identity rule, the no-website rule, the two-loads cap) plus one batch's rows and nothing else |
| `grades/batch-NN.json` | Each grader's output, one object per row: `row_id`, `sells_product`, `local_exists`, `page_access`, `basis`, `notes`, `checked` |
| `summarize.mjs` -> `grades.json`, `summary.json` | Joins the batch files back to `sample.json` by row id. `grades.json` uses the eval grade schema's field names (`distance_plausible` and `badges_sourced` are `n/a`) plus `tier`, `overture_id`, `name`, `product`, `basis`, `batch`, `chain`, `chain_by`. `summary.json` holds every count the report cites: per tier and overall, by zip kind, product category, search, `tier_by_level`, deciding category, source dataset, website presence, operating status and confidence; chain share; candidate counts and thin sections; the miss and unknown rows |

## Measures

- Precision: `sells_product` of `yes` or `equivalent` over graded rows, with `unknown` counted as not selling (`precision_all`), and over rows where the grader could tell (`precision_excl_unknown`).
- Existence: `local_exists: yes` over graded rows.
- `good_eval_rule`: the eval's own local rule (`eval/README.md` section 5): sells and exists, over rows where neither is unknown, with `local_exists: no` counted as bad even when sells is unknown. This is the figure nearest to the local precision in `docs/quality.md`, with the caveat in the report's comparison section.
- Chains: joined to `data/chains.json` by the website's host (equal to or under the chain's domain), else by normalized name (equal to the chain's name or starting with it plus a space). `chain_by` says which; a shop neither test matches is unlabelled, not independent.

## Rerun

From the repo root, with a venv holding `duckdb` (the coverage check's instructions; this run used one under the session scratchpad):

```
<venv>/bin/python -I docs/evidence/quality/open-place-precision/query-overture.py   # skips searches already in raw/
node docs/evidence/quality/open-place-precision/build-sample.mjs
# grade: one subagent per briefs/batch-NN.md, writing grades/batch-NN.json
node docs/evidence/quality/open-place-precision/summarize.mjs
```

The Overture query is deterministic against the pinned release, so `raw/` and `sample.json` rebuild exactly; the grades are a reading of live websites on the `checked` date and will drift.

## Run notes

- Overture: all 20 queries answered in 0.3 to 6.5 s each (368 to 8,973 rows in a box; `counts.json`, `rows_in_bbox`). Rows dropped for `operating_status` were all `permanently_closed` (`counts.json`, `dropped_not_open`).
- The coverage check's rule, applied to a whole area rather than to known shops, is wider than its names suggest: Overture's `basic_category` is a coarse group and `taxonomy.hierarchy` lists every ancestor, so a rule entry such as `hardware_home_and_garden_store` (a `yes` for kitchen, outdoor, hardware, electronics and home) admits every roofer, mattress store, appliance store and garden center under that branch. `sample.json` records this per row as `tier_by_level`, and `summary.json` splits the measures by it (`by_tier_by_level`); the rule itself was not changed, since the task was to measure it as written.
- Grading: 10 non-forked Opus graders, one batch of 30 rows each, run concurrently on 2026-10-09; each saw only its brief. User-Agent `nottheriver-precision-check/0.1`; no operator identity in any request.
- Grader reports, kept for the record: chain sites refused the plain fetch almost everywhere (lowes.com, cabelas.com, dickssportinggoods.com, acehardware.com, dollargeneral.com, barnesandnoble.com, macys.com, homegoods.com, mattressfirm.com 403 or 401; Walgreens, Walmart and Star Market product search behind a bot check; Shopify shops 429), so 17 of the 19 chain rows are `unknown`. Dead domains, parked domains and domains taken over by unrelated sites were common (`page_access: error`, 59 rows). Two graders used WebSearch for a blocked (not dead) site, which the brief reserves for shops with no or a dead website; one used a business name that is a person's name as a search query (nothing found). Batch 05 graded four blocked rows `no` from an outside listing, which the brief allows. One grader's page dumps landed in the repo root and were deleted before the commit; nothing from them is in the evidence.
- Reviewer spot check of 10 grades against the pages (the run's handoff note has the list): all 10 agreed with the grader; for two `yes` rows (Camping World Hamburg, Dollar Tree Hamburg) the reviewer saw the store page and the chain's category, not the product page.
