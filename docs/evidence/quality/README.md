# Evaluation runs

One row per graded run, newest first. Figures are each run's own `report.json`; a run's own folder has the raw responses and grades behind it. Prose write-ups, method notes and limitations are in [`docs/quality.md`](../../quality.md).

| Date | Run (folder / report) | What changed in the pipeline | Searches graded | Online precision | Local precision | Local recall |
|---|---|---|---|---|---|---|
| 2026-09-29 | [eval20-store-types/run2](eval20-store-types/run2/) ([report](eval20-store-types/run2/report.json)) | Second run of the store types measure, about an hour later; grades also carry `store_breadth` and chain badge sources | 20 | 98% (184 of 187) | 71% (102 of 144; 17 not judgeable) | 35% (30 of 86) |
| 2026-09-29 | [eval20-store-types](eval20-store-types/) ([report](eval20-store-types/report.json)) | Chain badge, `store_breadth` judgment, compact prompt, throughput routing, no signals, no editorial pages, split enrich call (two `enrich` calls per search) | 20 | 98% (182 of 185) | 71% (99 of 140; 18 not judgeable) | 35% (30 of 86) |
| 2026-09-26 | [eval20-0925/run2](eval20-0925/run2/) ([report](eval20-0925/run2/report.json)) | Second run of the wording-fix rerun, about an hour later | 20 | 98% (187 of 191) | 62% (95 of 154; 20 not judgeable) | 35% (30 of 86) |
| 2026-09-26 | [eval20-0925](eval20-0925/) ([report](eval20-0925/report.json)) | Local searches always end in "store"; the model's product reading is cached | 20 | 98% (188 of 192) | 64% (96 of 151; 19 not judgeable) | 33% (28 of 86) |
| 2026-09-24 | [eval20-0924](eval20-0924/) ([report](eval20-0924/report.json)) | Distance groups (nearby, rural, "Farther away"); local relevance from the classifier's sells judgment | 20 | 98% (184 of 188) | 59% (90 of 153; 18 not judgeable) | 28% (24 of 86) |
| 2026-09-23 | [eval60](eval60/) ([report](eval60/report.json)) | Store-type filter; first full 60-search run, 20 graded (stratified sample) | 20 | 99% (189 of 191) | 51% (72 of 140; 45 not judgeable) | 30% (26 of 86) |
| 2026-09-23 | [after3](after3/) ([report](after3/report.json)) | Local results fix (pilot subset of 6 searches) | 6 | 100% (55 of 55) | 38% (17 of 45; 10 not judgeable) | 26% (6 of 23) |
| 2026-09-23 | [after](after/) ([report](after/report.json)) | Retailer filtering (pilot subset of 6 searches) | 6 | 100% (57 of 57) | 47% (18 of 38; 10 not judgeable) | 26% (6 of 23) |

The two 9-25 runs' local precision above uses the non-existent-shop rule (operator ruling, 2026-09-26): a local shop confirmed not to exist counts as bad even when whether it sells the product is unknown. Earlier rows keep the figures as originally reported; `docs/quality.md` notes where the rule would move them.
