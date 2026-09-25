# Run-to-run variation in local results (2026-09-25)

Summary and conclusions: [quality.md, "Why local results change from run to run"](../../../quality.md#why-local-results-change-from-run-to-run).

Run every script from the repo root.

| File | What it is |
|---|---|
| `step1-compare.mjs` → `step1.json` | eval60 vs eval20-0924 from saved responses: same vs different local wording, overlap of local shops returned and shown |
| `step2-replay.mjs` → `replay-1/`, `replay-2/` | Each eval20-0924 search's local wording sent to Brave place search with the Worker's coordinates and count; replay 1 at 07:04 UTC, replay 2 at 08:06 UTC. Brave results trimmed to the fields the Worker reads |
| `step2-compare.mts` → `step2.json` | replay 1 vs replay 2, and replay 1 vs the saved eval20-0924 run (`npx tsx`) |
| `step3-normalize.mts` → `step3.json`, `step3b.json` | Production normalize prompt and request settings, 3 + 3 runs per search; `step3b` also records the category |
| `trace-missing.mjs` | Where Target (Kyle), Safeway (Burlingame) and DICK'S (Buckhead) went |
| `extra-checks.mjs` → `extra-checks.json` | Store/shop-only wording differences, sells judgment flips, overlap by domain + street address |

`step2-replay.mjs` and `step3-normalize.mts` call local helpers (`brave.mjs`, `with-openrouter.mjs`) that read the API keys from files outside the repo; they are not committed.
