# Search latency: where a search's time goes

Measured 2026-09-27 on `main` at ab998fd. Zip 97214 (Portland, OR). Raw data in [evidence/latency-0927](evidence/latency-0927/). Companion to [caching-and-store-types.md](caching-and-store-types.md).

**Short answer:** one model call, enrich (`proxy/src/enrich.ts:189`), is 76-93% of a search's time, and its time is output tokens divided by whichever provider OpenRouter picks. Everything the browser does is under 1 s. Asking the model for one-line JSON halved its output and cut the median search from 25-29 s to 15-16 s with no measurable quality change; that shipped as 7c855e1 (see [Results](#results-2026-09-28)). Routing to the fastest provider, no longer asking for signals, and no longer sending editorial pages then cut the median to 7-8 s (see [Priority 6 changes](#priority-6-changes-2026-09-28)). A split enrich call, rerun on top of those changes, cut the median a further 0.8 s, showed about 13 fewer bad shops net, and moved about half of nearby shops from "may sell it" to "likely sells it" (graded 84% good), for 10% more model cost; it shipped on the operator's ruling (8de26ed, 50b1e1f) (see [Split enrich on top of priority 6](#split-enrich-on-top-of-priority-6-2026-09-28)).

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
- **OPT-2.** About as fast as OPT-3 but moved sell verdicts well past noise (12 and 9 flips vs 1 and 4), and nearby top 3 matched in only 7-8 of 20 searches (noise: 13-15). Graded-bad shown fell (45-46 vs 51-53), so it may be better, not worse; telling which needs graded review. Not tested combined with OPT-3 at the time; the graded review and rerun on current main are [below](#split-enrich-on-top-of-priority-6-2026-09-28).
- **OPT-5 shipped** separately as af6f2cd: the zip list starts downloading when the visitor first focuses the form (unit test watched fail without it; e2e passes).

Both are pushed (2026-09-28) and the site change is live; the prompt change is live only after `infra/deploy.sh` deploys the Worker (`.claude/skills/deploy/SKILL.md`).

### Priority 6 changes (2026-09-28)

Operator rulings LQ1 (route for throughput) and LQ4 (stop asking for signals), plus one change that follows from LQ4: editorial pages were sent to the model only as evidence for signals, so they are no longer sent. Commits c504d1a, e07c707, 64cdd9d; measured together against 208222d (the compact prompt) on all 60 eval20-0925 searches (20 products x 3 locations; the rows above used 20 of them, so counts are not comparable) x 2 rounds, arms alternating. Evidence: `evidence/latency-0927/runs/priority6/` and `runs/priority6-bisect/`.

| Arm | Median search (p90) | Enrich median | Recall online / local | Graded-good shown | Graded-bad shown | Model $ per search |
|---|---|---|---|---|---|---|
| 208222d | 14.8 s (40.8), 14.0 s (31.5) | 10.0 s | 0.35, 0.33 / 0.337 | 257, 247 | 53, 51 | $0.0022 |
| Priority 6 | 7.9 s (12.8), 7.0 s (9.6) | 4.8 s | 0.34, 0.35 / 0.349 | 251, 244 | 47, 44 | $0.0034 |

- **Speed.** Throughput routing sent 117 of 121 enrich calls to ModelRun (median 158 tok/s in this run, 265 in the bisect round); 208222d spread over six providers at a median 79 tok/s. Output tokens barely moved (785 to 756), so the gain is routing. ModelRun costs about 5x per call ($0.0032-0.0036 vs $0.0005-0.0007); model cost is still about 15% of a search's estimated $0.023, which is mostly Brave (estimated from the published price, not billed data).
- **Nearby sell verdicts moved past noise.** 30 and 35 shops flipped between shown and dropped-as-not-selling, against 21 and 15 for the same code run twice (`eval/compare.mjs`, local results only). The change is stricter: every graded shop it newly dropped was graded "doesn't sell" (7 and 8 per round), none graded "sells"; it newly showed 0 and 2 graded "doesn't sell". 18 newly dropped shops per round are ungraded. Online shown results moved at noise level, none by a sell verdict.
- **Cause: likely the prompt without signals, not routing or editorial pages.** Baseline searches that happened to run on ModelRun dropped 1.57 nearby shops per search as not selling, others 1.61, the priority 6 code 1.78. A bisect round with 64cdd9d reverted (same routing, both arms on ModelRun) dropped 1.78 vs 1.83, with 19 flips, inside noise. Median search in that round was 4 s for both arms.
- **Grading the ungraded flips (2026-09-28).** The 37 nearby shops that flipped and had no grade were graded by two agents that saw only the shop, product and place, not which version showed it (31 new grades, 6 reused from earlier runs; [grading/](evidence/latency-0927/grading/)). Good means sells the product or a close substitute and is at the address; bad means it does not sell it or is not there.

  | Flip | Shops | Good | Bad | Could not tell |
  |---|---|---|---|---|
  | Shown by 208222d, dropped by the new code | 26 | 4 | 18 | 4 |
  | Shown by the new code, dropped by 208222d | 10 | 2 | 6 | 2 |
  | Both, in different rounds | 1 | 0 | 0 | 1 |

  So the new code removes 18 bad shops for 4 good ones and adds 6 bad for 2 good: about 12 fewer bad shops and 2 fewer good ones across the two rounds. (Corrected 2026-09-28: two shops graded "does not sell" with existence unknown were first counted bad; `eval/summarize.mjs` `precision()` leaves them unknown, so the bad shops the new code adds fell from 8 to 6. `grading/joined.json` keeps the original verdicts.) Of the 4 good shops it drops, only YETI (Austin) sells the product itself; the other 3 sell a close substitute (a non-wool blanket at two Tattered Cover stores, a French press at Hobby Lobby). Two of the 4 unknowns (Great Wall Supermarket and Trader Joe's, Denver) needed a browser the graders did not use.
- **Cost of the measurement:** 360 searches, about $8.30 estimated (Brave $7.20 estimated, model $1.10 reported by OpenRouter).

### Split enrich on top of priority 6 (2026-09-28)

Shipped 2026-09-28 (operator ruling, merged as 8de26ed and 50b1e1f; Worker deployed at 50b1e1f). The measurement below ran on the split as first committed (26976c9 on branch `proto/split-enrich-v2`, since rebased and deleted) before a small refactor (50b1e1f: `llmView` takes a kind instead of the split parsing ids), which the unit tests cover but the A/B did not rerun. The branch recreates the split on current main. It judges online and local candidates in two parallel calls, and checks each reply only against the ids its own call was sent. The old prototype could not be rebased: it predated the compact prompt and edited code that no longer exists (signals, editorial evidence). Measured against 9f0a2be (`main`) on all 60 searches x 2 rounds, arms alternating. Evidence: `evidence/latency-0927/runs/split-enrich-v2/`, `grading-split/`, `flips.mjs`.

| Arm | Median search (p90) | Enrich median (p90) | Recall online / local | Graded-good shown | Graded-bad shown | Model $ per search |
|---|---|---|---|---|---|---|
| main | 4.4 s (6.3), 4.1 s (4.5) | 3.1 s (4.7) | 0.33, 0.32 / 0.337, 0.337 | 252, 254 | 47, 44 | $0.0037 |
| split | 3.6 s (4.5), 3.1 s (3.7) | 2.3 s (3.3) | 0.33, 0.32 / 0.349, 0.337 | 247, 254 | 40, 37 | $0.0040 |

- **Speed.** About 0.8 s (19%) off the median search. All 360 enrich calls ran on ModelRun (main about 246 tok/s, each split call about 207 tok/s), so this is the gain with routing already settled. The gain probably depends on provider speed; slower providers were not measured. (The old prototype, on the pre-compact prompt, reached 16.7 and 17.3 s from 25-29 s, about what the compact prompt alone reached, 16.0 and 15.3 s; the split was not tested on top of the compact prompt until now.)
- **Failures and retries.** None in 240 searches: every split search made exactly 2 enrich calls. A failed call in either half fails the whole search, and a reply that fails validation is retried per call (4 calls in the invalid-reply test).
- **Cost.** Model cost +10% ($0.0040 vs $0.0037 per search, reported by OpenRouter); the instructions go out twice (median prompt tokens 3,959 vs 3,459). Estimated total per search $0.0240 vs $0.0237 (Brave estimated).
- **Verdicts moved past noise, in the local section only.** Local shops dropped by the model's own verdict (`sells_product` or `site_type`) in one arm and shown in the other: 46 and 49 per round, against 20 and 16 for the same code run twice; online 0 and 2 against 1 and 1 (`flips.mjs counts`). `eval/compare.mjs` counts 33 and 37 sell flips against 18 and 14 for noise, and the nearby top 3 was identical in 23 of 60 searches (noise: 49 and 42). By the same count the priority 6 change moved 35 and 39 against 25 and 18, so the split moves verdicts more.
- **The main change is the yes/maybe judgment.** In `main`, 3% of shown nearby shops carry the model's "likely sells it" judgment (relevance 1.0; 14 and 11 of 482 and 469), against 52% and 49% in the split (244 and 232 of 472 and 469). Of the 391 and 383 shops shown in both arms, 185 and 175 moved from "may sell it" to "likely sells it" and none moved the other way; the same code run twice differs on 2 of 434 and 16 of 416, and priority 6 against its base on 13 of 424 and 16 of 412. Every earlier run in the evidence folders has 0-4% "likely sells it"; the old split prototype had 36% (60 of 168). Cause not isolated; each call now sees only one kind of candidate. Relevance is 0.25 of the score, so a shop moving from "may" to "likely" gains 0.125, which is likely why the nearby top 3 changed in 37 of 60 searches. Visitors see "Likely, by shop type" instead of "Maybe, by shop type" in "Why this rank" on about half of nearby results.
- **The extra "likely" labels hold up on the shops that have a grade** (27% to 49% of shown shops in each row; the rest are ungraded, and unknowns are left out of the shares):

  | Label | Arm | Shown (round 1, 2) | Graded good / bad (round 1; round 2) | Share good |
  |---|---|---|---|---|
  | May sell it | main | 468, 458 | 92 / 75; 93 / 64 | 55%, 59% |
  | Likely sells it | split | 244, 232 | 55 / 12; 50 / 10 | 82%, 83% |
  | May sell it | split | 228, 237 | 39 / 45; 44 / 54 | 46%, 45% |

  The shops moved from "may" to "likely" (360 shop-appearances over both rounds) are graded 93 good and 18 bad (84% good); the shops that stayed at "may" are graded 76 good and 78 bad (49%). Among graded shops in the nearby top 3 the split shows 35 good and 18 bad (round 1), 34 and 22 (round 2), against 30 and 28, 30 and 25 for `main` (40% to 46% of top-3 slots are graded in each arm). In a single call "may sell it" covers nearly every shop at 55-59% good; the split separates a group that is 82-83% good from one that is 45-46% good.
- **Grading the flips.** 68 shops flipped on a model verdict (flips that are only a shop falling below the top 10 are ranking effects and were not graded). 25 reused earlier grades matched on search, URL and address; 43 were graded blind by two agents that saw only the shop, product, place and address, not which arm showed it (page fetch only; 1 needs a browser, BOND'S Television & Electronics). Good, bad and could-not-tell follow `eval/summarize.mjs` `precision()` (good = sells the product or a close substitute and the shop exists; bad = does not sell it, or confirmed not to exist; could not tell = either answer unknown).

  | Flip | Shops | Good | Bad | Could not tell |
  |---|---|---|---|---|
  | Shown by main, dropped by the split | 45 | 5 | 25 | 15 |
  | Shown by the split, dropped by main | 21 | 4 | 12 | 5 |
  | Both, in different rounds | 2 | 0 | 2 | 0 |

  So the split removes 25 bad shops for 5 good ones and adds 12 bad for 4 good: about 13 fewer bad shops and 1 fewer good one across the two rounds. These counts cover all 68 model-verdict flips including 25 already graded; the priority 6 table above counted only the 37 ungraded flips, so its 18 and 4 are not like-for-like with the 25 and 5. The 5 good shops it drops are Hilton's Tent City (rain jackets), Breed & Co Ace Hardware (pour-over dripper), Specialized Atlanta (wool socks), Hobby Lobby (a close substitute) and Foot Locker (rain jackets; stock at that store not checked). Each shop counts once even if it flipped in both rounds.
- **Not measured.** Grades for every nearby top-3 shop (more than half of top-3 slots are ungraded, so the top-3 comparison above is a partial estimate); whether the label change would hold on searches outside these 60; the Playwright e2e test on the branch (unit tests, 878, and typecheck pass); slow-provider behavior. The grades are one agent's judgment each, and the graded flips include 25 reused grades from earlier graders.
- **Cost of the measurement:** 240 searches, about $5.70 estimated (model $0.92 reported by OpenRouter, the rest Brave estimated from the published price), plus two grading agents.

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

Rulings 2026-09-28: LQ1 yes (ship throughput routing), LQ2 yes (graded review of the split), LQ4 drop (stop asking for signals). LQ1 and LQ4 shipped (above). LQ3 open. LQ2 is STATUS priority 6.

- LQ1. Ship OPT-1? Measured: never slower, 0-75% faster depending on the moment, quality at noise level, model cost 1.3-2.3x (1-8% of a search's total). It is a one-line change at `proxy/src/llm.ts:75`. Agent's recommendation: ship it on top of OPT-3.
- LQ2. Graded review done ([above](#split-enrich-on-top-of-priority-6-2026-09-28)). Ruled 2026-09-28: ship (operator); merged and deployed at 50b1e1f. Measured: median search 0.8 s faster on ModelRun, about 13 fewer bad shops net for 1 fewer good one, model cost +10%, no failures; about half of nearby shops move from "may sell it" to "likely sells it" (graded 84% good), so the nearby top 3 changes in 37 of 60 searches and visitors see "Likely, by shop type" far more often; the speed gain depends on provider speed. Agent's recommendation: ship it, for the fewer bad shops and the more informative label rather than the speed, which is small once routing is settled.- LQ3. Beyond OPT-3, the remaining output-token cuts (short keys; `confidence` went with the signals) change the reply schema and parser; worth a session?
- LQ4. The model's `retailers`/`signals` output has put no signal on a shown result since 2026-09-24 (above). Keep asking for it (ADR 0004 still allows a positive signal cited from another site's page, such as an editorial one), or drop it and save its output tokens?
