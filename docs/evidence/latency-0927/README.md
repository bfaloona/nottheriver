# Latency evidence, 2026-09-27/28

Backs [docs/search-latency.md](../../search-latency.md). Every search here ran the real Worker pipeline locally (`stage-timing.ts`) against live Brave and OpenRouter, without the normalize cache, except `browser-trace.json`, which is the live site.

| File or folder | What |
|---|---|
| `browser-trace.json` | T1: live site, 4 searches, CDP network timings (`trace-search.mjs`) |
| `stage-timing.json`, `*-enrich-out.json` | T2: first per-call timing of 4 products, and the model's enrich replies |
| `runs/provider-sort-ab/` | OPT-1: 4 products x current routing vs `provider.sort: "throughput"` x 2 rounds |
| `runs/split-enrich/` | 20 eval20-0925 searches x 4 arms x 2 rounds. Here `alt` = the split-enrich prototype (branch `proto/split-enrich`) |
| `runs/compact-output/` | 20 searches x 4 arms x 1 round. Here `alt` = the compact-output prompt (7c855e1) |
| `runs/compact-output-round2/` | 20 searches, current vs compact prompt, second round |
| `runs/priority6/` | All 60 eval20-0925 searches (20 products x 3 locations) x 2 rounds. `alt-base` = 208222d (compact prompt); `p6` = c504d1a (throughput routing, no signals, no editorial pages) |
| `runs/priority6-bisect/` | 60 searches x 1 round. `p6` = c504d1a; `alt-noedit` = c504d1a with 64cdd9d reverted |
| `grading/` | Blind grades of the 37 ungraded nearby shops that flipped in `runs/priority6/`: `to-grade.json` (the graders' input), `grades-new-a.json` and `grades-new-b.json` (two graders), `reused-grades.json` (6 from earlier grade sets, matched on URL and address), `directions.json` (which arm showed each shop, kept from the graders), `joined.json` (grade and direction per shop) |
| `runs/split-enrich-v2/` | All 60 searches x 2 rounds. `main` = 9f0a2be; `alt-split` = branch `proto/split-enrich-v2` (26976c9), which judges online and local candidates in two parallel calls |
| `flips.mjs` | Local shops that flip between two arms on a model verdict: `build` (grading input), `join` (grades by direction), `counts` (flips, ranked-out flips and yes/maybe shifts against same-code noise), `relevance` (yes/maybe split of shown shops and the graded verdicts behind each label) |
| `grading-split/` | Blind grades of the shops the split flips: `to-grade.json` (graders' input; 43 rows), `grades-a.json` and `grades-b.json` (two graders, rows 0-21 and 22-42), `reused-grades.json` (25 rows graded in earlier runs), `directions.json` (which arm showed each shop, kept from the graders), `joined.json` (grade and direction per shop) |

Each `runs/*/<arm>-r<round>/responses/<id>.json` has the shape `eval/run-searches.mjs` saves, so `eval/compare.mjs` reads it. Arm `default` is the code on `main` before 7c855e1.

Reproduce the tables:

```sh
node docs/evidence/latency-0927/score-arms.mjs docs/evidence/latency-0927/runs/compact-output
node docs/evidence/latency-0927/providers.mjs docs/evidence/latency-0927/runs/compact-output/stage-timing.json
node eval/compare.mjs <run A>/responses <run B>/responses
node docs/evidence/latency-0927/flips.mjs counts docs/evidence/latency-0927/runs/split-enrich-v2 main alt-split
node docs/evidence/latency-0927/flips.mjs join docs/evidence/latency-0927/grading-split
node docs/evidence/latency-0927/flips.mjs relevance docs/evidence/latency-0927/runs/split-enrich-v2 main alt-split docs/evidence/latency-0927/grading-split
```

`score-arms.mjs` scores against the eval20-0925 hand grades without new grading; on the graded eval20-0925 responses it reproduces `report.json` recall (online 0.31, local 0.326).
