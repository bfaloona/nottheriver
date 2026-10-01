# Confirming check: removing `store_breadth` from the enrich prompt (2026-10-01)

The 20 graded searches (ids in `../eval20-store-types/method/ids.json`) run once through the real Worker pipeline locally, under two code versions on identical inputs:

| Arm | Code |
|---|---|
| `alt-before-r1` | `6dfb72f`, with the `store_breadth` judgment |
| `default-r1` | `10cc13f`, without it |

Both arms used one shared in-memory normalize cache (same wording, same `similar_products`) and replayed each Brave reply (`stage-timing.ts`, `SHARED_CACHE=1 REPLAY_BRAVE=1`), so every difference comes from the prompt change and the model's answers to it. The model calls were live in both arms.

Bars set before the grading and before the comparison script (the relevance-shift count was seen first, so that row has no pre-set bar): all 20 searches succeed in both arms; model-verdict flips of shops returned in both arms at most 8 (the earlier sells-flip bar, `docs/quality.md`); graded flips not net worse.

| Measure | Result |
|---|---|
| Searches succeeded | 20 of 20 in both arms; same wording in all 20; same shops returned (Jaccard 1.0, by design) |
| Shown-shop overlap | Jaccard 0.95; nearby top 3 identical in 15 of 20 searches |
| Model-verdict flips (shown by one arm, dropped by the other for `sells_product` or `site_type`) | 4 of 251 shops returned in both (2 each), under the bar of 8 |
| Graded flips (blind; 2 rows graded new, 2 reused) | The version without the field drops 1 good, 1 bad and 1 not judgeable shop and newly shows 1 not judgeable shop |
| Relevance of shops shown by both arms | 14 of 157 local shops moved from "may sell it" to "likely sells it" with the field removed, none the other way; 11 have grades (9 good, 2 not judgeable, none bad) and 3 (Abt, Micro Center, Best Buy for rechargeable AA batteries) were never graded |
| Enrich output tokens (40 calls per arm, from `usage.llm`) | 14,206 with the field, 10,576 without (-25.6%) |
| Enrich model cost (same source) | $0.0711 with, $0.0650 without (-8.6%); prompt tokens 75,902 vs 72,542 |
| Median enrich wall time (`stage-timing.json`, both calls of a search) | 5.1 s with (19 searches), 4.1 s without (20 searches); the arms alternated order |

Limits: one round, so model sampling noise is not separated from the prompt effect (two arms on identical inputs, no same-code repeat). The 14 promotions come from 3 searches (LED bulbs rural, olive oil urban, rechargeable AA rural), so they are not 14 independent cases. 5 more shops differ only by rank (shown in one arm, below the top 10 in the other) and were not graded. About 72 Brave calls were real (the replay served the rest, `stage-timing.json`); the file lacks the last arm-search because the disk was full when it was written (`ENOSPC`), but all 40 response files saved, and that arm ran second so it was replayed.

Files: `alt-before-r1/responses/`, `default-r1/responses/` (shape `eval/run-searches.mjs` saves, readable by `eval/compare.mjs`), `stage-timing.json`, `grading/` (`to-grade.json` and `grades-a.json` for the two new rows, `reused-grades.json`, `directions.json`), `compare-arms.mjs` (shown-only-in-one-arm shops and relevance shifts with graded verdicts). Reproduce the model flips with `node docs/evidence/latency-0927/flips.mjs join docs/evidence/quality/eval20-breadth-removal/grading` and `node eval/compare.mjs docs/evidence/quality/eval20-breadth-removal/alt-before-r1/responses docs/evidence/quality/eval20-breadth-removal/default-r1/responses`.
