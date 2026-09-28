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

Each `runs/*/<arm>-r<round>/responses/<id>.json` has the shape `eval/run-searches.mjs` saves, so `eval/compare.mjs` reads it. Arm `default` is the code on `main` before 7c855e1.

Reproduce the tables:

```sh
node docs/evidence/latency-0927/score-arms.mjs docs/evidence/latency-0927/runs/compact-output
node docs/evidence/latency-0927/providers.mjs docs/evidence/latency-0927/runs/compact-output/stage-timing.json
node eval/compare.mjs <run A>/responses <run B>/responses
```

`score-arms.mjs` scores against the eval20-0925 hand grades without new grading; on the graded eval20-0925 responses it reproduces `report.json` recall (online 0.31, local 0.326).
