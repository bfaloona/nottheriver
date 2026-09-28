# Search latency: where a search's time goes

Measured 2026-09-27 on `main` at ab998fd. Zip 97214 (Portland, OR). Raw data in [evidence/latency-0927](evidence/latency-0927/). Companion to [caching-and-store-types.md](caching-and-store-types.md).

**Short answer:** one model call, enrich (`proxy/src/enrich.ts:189`), is 76-93% of a search's time, and its time is output tokens divided by whichever provider OpenRouter picks. Everything the browser does is under 1 s. Asking the model for one-line JSON halved its output and cut the median search from 25-29 s to 15-16 s with no measurable quality change; that shipped as 7c855e1 (see [Results](#results-2026-09-28)). Provider routing and a split enrich call are measured but not shipped.

## Method

| Trace | What | Tool |
|---|---|---|
| T1. Browser | Live site, fresh profile, 4 searches (bike pump twice, beeswax candles, hiking boots); CDP network timings | `node trace-search.mjs <out.json>` → `browser-trace.json` |
| T2. Worker stages | The real `runSearch` run locally with a timing `fetch`, no KV cache (normalize always runs), 4 products; keys read from the files `infra/deploy.local.env` names, never printed | `npx tsx stage-timing.ts <outdir> "product" ...` → `stage-timing.json`, `*-enrich-out.json` |
| T3. History | `elapsed_ms` from saved eval responses | `docs/evidence/quality/{eval20-0925,eval60}/responses` |

T2 runs from a home network, not Cloudflare's edge; network time to OpenRouter and Brave is tens of ms either way, which does not change the ranking below.

## T1. Browser: the POST is the search

| Step | Measured |
|---|---|
| Page load (first contentful paint) | 0.45 s |
| `zips.json`, 341 KB gzip, fetched on first submit before the POST (`src/main.ts:90`) | 0.22 s |
| CORS preflight | 0.04-0.20 s (first one includes DNS + TLS to the Worker) |
| `/search` POST | 63.1 s, 27.3 s (same product, normalize cached), 65.9 s, 40.0 s |
| Render after the response | 17-61 ms |
| Map chunk + tiles, after render | ~0.4 s, off the critical path |

Two of four live searches passed the eval client's 60 s limit. History (T3): eval60 p50 19.0 s, p90 30.5 s; eval20-0925 p50 29.7 s, p90 38.7 s, max 59.3 s.

## T2. Worker stages (serial: normalize, then Brave, then enrich)

| Product | Normalize | Brave (4 calls, parallel) | Enrich | Enrich share | Enrich output tokens | Enrich tokens/s | Enrich provider |
|---|---|---|---|---|---|---|---|
| bike pump | 2.1 s | 0.9 s | 42.2 s | 93% | 1,634 | 39 | CoreWeave |
| beeswax candles | 7.8 s | 0.8 s | 26.7 s | 76% | 2,229 | 84 | CoreWeave |
| hiking boots | 0.9 s | 0.8 s | 12.2 s | 88% | 1,409 | 116 | CoreWeave |
| cast iron skillet | 6.6 s | 0.8 s | 37.9 s | 84% | 1,802 | 47 | DeepInfra |

- Headers arrived in 0.2-0.5 s on 7 of 8 model calls; the rest is generation. Speed varied 3x on the same provider, so it is load, not only provider choice.
- Normalize emits ~76 tokens yet took 0.9-7.8 s; the 6.6 s one waited 3.2 s for headers from Reka. It is provider queueing, not work.
- Brave is under 1 s and not worth optimizing.

### What enrich's output tokens are

| Product | Output chars | Whitespace | Candidate verdicts | Signals emitted | Signals the code then discards |
|---|---|---|---|---|---|
| bike pump | 4,256 | 1,398 (33%) | 33 rows, 2,828 chars | 0 | 0 |
| beeswax candles | 6,502 | 1,192 (18%) | 34 rows, 2,928 chars | 10 | 10 |
| hiking boots | 3,763 | 1,218 (32%) | 2,256 chars | 1 | 1 |
| cast iron skillet | 5,166 | 1,731 (34%) | 2,154 chars | 6 | 6 |

- The model pretty-prints its JSON: 18-34% of output characters (not tokens) are indentation and newlines.
- Every candidate row repeats three long key names (`site_type`, `sells_product`, `store_breadth`) around three one-word values.
- All 17 signals in this sample were a shop citing its own page as a positive, which `acceptSignals` drops (`proxy/src/enrich.ts:167,174`: a citation of a URL not among the candidates, or of the shop's own domain). Model signals do still reach results in principle, but none have since 552ef4b (2026-09-24) dropped self-citations: 0 in the 40 graded eval20-0925 searches and 0 in the ~320 searches of the Results below. The 70 seen in eval60 all predate that commit.
- `confidence` is requested for every signal (`proxy/prompts/enrich.ts:33`) and never read.
- `ENRICH_MAX_TOKENS` is 3,000 (`proxy/src/llm.ts:7`); T1 saw 2,524. A reply cut off at the cap fails validation and is retried once (`llm.ts:79-82`), which about doubles that search's time before a 502.

## Results (2026-09-28)

Each change ran on the 20 eval20-0925 searches through the real pipeline, alternating arms search by search so provider load hit every arm alike, and was scored against the eval20-0925 hand grades without new grading (`score-arms.mjs`). "Noise" is two runs of the unchanged code. Evidence and commands: [evidence/latency-0927/README.md](evidence/latency-0927/README.md).

| Change | Runs | Median search (p90) | Recall online / local | Graded-bad shown | Sell flips vs current (noise) | Model $ per search | Verdict |
|---|---|---|---|---|---|---|---|
| Current code | 4 | 25.3-29.1 s (33-43 s) | 0.33-0.34 / 0.28-0.30 | 51-53 | (1 and 4) | $0.0008-0.0013 | Baseline |
| OPT-3, one-line JSON + no self-citations | 2 | 16.0 s (20.7), 15.3 s (20.9) | 0.33-0.34 / 0.33-0.34 | 50, 53 | 5 of 227, 1 of 235 | $0.0007 | **Shipped, 7c855e1** |
| OPT-1, `provider.sort: "throughput"` | 3 | 7.4 s, 25.2 s, 20.4 s | 0.34-0.35 / 0.28-0.29 | 52 | 2-4 | $0.0011-0.0029 | Not shipped: see LQ1 |
| OPT-2, split enrich (branch `proto/split-enrich`) | 2 | 16.7 s, 17.3 s (30-32 s) | 0.32-0.33 / 0.29-0.30 | 45-46 | 12 and 9 | $0.0011 | Not shipped: changes verdicts |
| OPT-1 + OPT-3 | 1 | 13.5 s (22.3) | 0.32 / 0.34 | 55 | 3 | $0.0014 | Follows OPT-1 |

- **OPT-3.** Output tokens fell from a median 1,443 to 744 (round 1) and 1,422 to 760 (round 2, where both arms ran on DeepInfra), so the gain is fewer tokens, not routing. Of the 5 flips in round 1, 2 dropped graded-bad shops and 2 dropped graded-good ones. It cannot have cost shown signals: every arm, the current code included, showed 0 model signals (curated ones, 28-29 per run, are unaffected), and results the model left unjudged stayed at 0-2 of about 360 per arm. The whitespace share turned out larger in tokens than the caution under OPT-3 below assumed: one provider (ModelRun) already wrote compact JSON and used about half the tokens for the same verdicts.
- **OPT-1.** Never slower in 3 paired runs, but the gain depends on the moment: throughput sorting sent 14 of 20 enrich calls to ModelRun (up to about 250 tok/s) in one round and 1 of 20 in the next, which went mostly to DeepInfra (about 55 tok/s, same as the default). Model cost rose 1.3-2.3x, which is 1-8% of a search's total cost because Brave dominates.
- **OPT-2.** About as fast as OPT-3 but moved sell verdicts well past noise (12 and 9 flips vs 1 and 4), and nearby top 3 matched in only 7-8 of 20 searches (noise: 13-15). Graded-bad shown fell (45-46 vs 51-53), so it may be better, not worse; telling which needs graded review. Not tested combined with OPT-3; parked on its branch, whose 11 tests still assume one enrich call.
- **OPT-5 shipped** separately as af6f2cd: the zip list starts downloading when the visitor first focuses the form (unit test watched fail without it; e2e passes).

Neither commit is pushed or deployed; that is the operator's step (`.claude/skills/deploy/SKILL.md`: push, then `infra/deploy.sh` for the prompt change).

## Optimizations, ranked by expected seconds saved (before the results)

"Estimated" figures are arithmetic on the tables above, not measurements. The Results section supersedes the expected effects below.

| Rank | Change | Expected effect | Evidence | Risk / cost | Where |
|---|---|---|---|---|---|
| OPT-1 | Route for throughput: OpenRouter `provider.sort: "throughput"` (or `preferred_min_throughput`), keeping `data_collection: 'deny'` and `require_parameters`. OpenRouter ranks on throughput measured over a rolling 5-minute window ([provider routing docs](https://openrouter.ai/docs/features/provider-routing)), so it can steer around a busy endpoint, not just a slow provider | Enrich ran 39-116 tok/s, with a 3x spread on CoreWeave alone, so the gain depends on how well a 5-minute window predicts the next 30 s. If it held enrich near 100 tok/s, the four searches' enrich would take ~14-22 s instead of 12-42 s (estimated upper bound) | T2 speed column | One-line change, easy to A/B; price may differ per provider. A sort across both `MODELS` (`partition: "none"`) would also reach the smaller gemma-4-26b-a4b, a quality change, not just speed | `proxy/src/llm.ts:5,75` |
| OPT-2 | Split enrich into two parallel calls, online and local | Output generation runs side by side, so enrich wall time roughly halves (estimated); also keeps each reply far from the 3,000 cap | Output tokens scale with candidates (T2); calls are independent after Brave | Input tokens rise because the instructions are sent twice (cheap next to Brave); editorial pages (all online) are sent as evidence for signals about any shop (`proxy/src/pipeline.ts:165-169`), so a plain split by kind leaves local shops with no evidence pages; the editorial rows must go to both calls, or signals stay in the online call only. Needs an eval rerun for verdict drift | `enrichAll`, `proxy/src/enrich.ts:186-199` |
| OPT-3 | Emit fewer output tokens: ask for compact JSON, short keys or one-letter codes mapped back in code, drop `confidence`, tell the model a shop's own page is never a signal | Seconds fall in proportion to output tokens. The whitespace share above is in characters; a run of spaces is often one token, so the token saving is smaller than 18-34% and unmeasured. Key names and self-citations are the surer part | Output breakdown table | Schema, prompt and parser change; wording change can move verdicts, so eval rerun; whitespace instructions are not always obeyed under `json_schema` | `proxy/prompts/enrich.ts`, `proxy/schemas`, `enrich.ts:39-45,112-124` |
| OPT-4 | Raise normalize cache hit rate (pre-warm common products, or key on a looser product form) | Saves the normalize call, 0.9-7.8 s, on a hit | T1: same product 63.1 s cold, 27.3 s cached (that gap also includes enrich variance) | Live hit rate unknown; a looser key changes wording for near-duplicates | `proxy/src/normalize-cache.ts` |
| OPT-5 | Fetch `zips.json` at page load instead of on submit | 0.2 s on broadband, first search only; ~1.7 s on slow mobile (estimated: 341 KB at 1.6 Mbps) | T1 | None worth naming; 341 KB loads for visitors who never search | `src/main.ts:90` at ab998fd; shipped as af6f2cd (on first form focus instead) |
| OPT-6 | Stage timings in the Worker (`Server-Timing` header or the existing log line): normalize, Brave, enrich ms and provider only | Nothing directly; makes OPT-1 to OPT-4 measurable in production (observability is off today) | `proxy/src/handler.ts:178` logs only total ms | Must stay free of query text and coordinates, like the current log line | `handler.ts`, `pipeline.ts:320-337` |

Not worth doing for speed: Brave caching (under 1 s; see caching doc Q1), map or tile loading (after render), the site's JS/CSS (0.45 s cold).

Perceived speed is a separate lever: the page shows only "Searching" for 15-60 s. Streaming stages (e.g. "found 34 shops, checking them") would not make a search faster; it is a product decision, not listed above.

## Open questions for the operator

- LQ1. Ship OPT-1? Measured: never slower, 0-75% faster depending on the moment, quality at noise level, model cost 1.3-2.3x (1-8% of a search's total). It is a one-line change at `proxy/src/llm.ts:75`. Agent's recommendation: ship it on top of OPT-3.
- LQ2. Answered by doing it: OPT-2 and OPT-3 were each run twice on the graded searches (above). Open part: does OPT-2's verdict shift (fewer graded-bad shops shown) warrant a graded review of the split?
- LQ3. Beyond OPT-3, the remaining output-token cuts (short keys, dropping the unread `confidence` field) change the reply schema and parser; worth a session?
- LQ4. The model's `retailers`/`signals` output has put no signal on a shown result since 2026-09-24 (above). Keep asking for it (ADR 0004 still allows a positive signal cited from another site's page, such as an editorial one), or drop it and save its output tokens?
