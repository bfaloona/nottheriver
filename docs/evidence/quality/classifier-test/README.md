# P5: stronger classifier or Shopify check for LOCAL precision

Run 2026-09-24. Offline only; nothing under `proxy/`, `src/`, `docs/`, `eval/` changed. LLM spend $0.574 of the $2.00 cap, all rounds included.

**Final verdict (round 2): `google/gemini-2.5-flash` with prompt variant v1 passes every ship guard in production-shaped calls, on two runs.**

It still has one open risk, which the ship rule allows: in eval60 it drops 12 of 72 relevant local shops (the reference drops 0), against 32 irrelevant ones.

Round 1 below measured local-only calls. Those results are superseded: without the prompt change, Gemini collapsed in mixed calls.

## Round 2: prompt variants, production-shaped calls only

**Setup.** Each search gets one call carrying its online and local candidates, under production caps (24 online / 16 local).

- Set M: the after3 online results (ungraded context) plus the 103 graded merge-test local rows. Three searches have more than 16 local rows, so they were split into 2 calls, and each call carries the same online rows.
- Set E: the graded online and local rows of each eval60 search.
- Reference: gemma with the current prompt, run in the same shape (arm `baseline`; its E calls are the pre-ship-check calls).
- Rule, fixed by the coordinator before the run: M local precision +10 points or more; M relevant local kept drops 5 points or less; E online relevant dropped share rises 5 points or less; E local drops more irrelevant than relevant rows; added cost $0.01 per search or less.

| Arm | M precision | M relevant kept | M place-only precision / kept | E online relevant dropped (of 189) | E local dropped: relevant / irrelevant (of 72 / 68) | E local precision after | Added $/search | Verdict |
|---|---|---|---|---|---|---|---|---|
| Reference: gemma + current prompt | 49.4% | 97.6% | 50.0% / 94.4% | 0 | 0 / 0 | 51.4% | $0 | reference |
| gemma + v1 | 52.6% | 97.6% | 54.8% / 94.4% | 0 | 1 / 10 | 55.0% | $0 | fail (precision +3.2) |
| gemma + v2 | 53.2% | 100% | 56.3% / 100% | 0 | 1 / 14 | 56.8% | $0 | fail (precision +3.8) |
| **gemini-2.5-flash + v1** | **62.5%** | **97.6%** | 73.9% / 94.4% | 3 | 12 / 32 | 62.5% | $0.0037 | **PASS** |
| gemini-2.5-flash + v2 | 63.3% | 92.7% | 71.4% / 83.3% | 3 | 14 / 37 | 65.2% | $0.0037 | PASS (relevant kept −4.9, at the limit) |

**Stability, gemini + v1 run 2** (fresh calls). Precision and relevant kept were identical to run 1. The two runs made the same drop decision on 475 of 479 graded-or-local rows. Two-run mean against the reference:

- M precision +13.1 points
- M relevant kept −0 points
- E online relevant dropped +1.6 points
- E local drops 12.5 relevant / 33.5 irrelevant
- Added cost $0.0037 per search

Every guard passes.

**Open risk to weigh before shipping (the rule allows it).** On eval60, v1 still drops 12 of 72 relevant local shops (17%), and the reference drops none. The dropped shops, all judged `sells_product: "no"`, are:

- Lowe's, Crate & Barrel, Bed Bath & Beyond and Pacific Kitchen and Home (skillet)
- Verizon ×2 and GameStop (USB-C cable)
- REI with a "bicycle" category (rain jacket), labeled `service`
- Camping World (tent), labeled `service`
- Adagio Teas and Chicago Teahouse (green tea), labeled `service`
- Lowe's Garden Center (LED bulbs), labeled `service`

Set M does not show this loss (40 of 41 kept). E-local precision still rises from 51.4% to 62.5%.

**Why v1 over v2:** v1 has the same precision gain on M, keeps 2 more relevant M rows, and drops fewer relevant E local rows.

### Implementation notes (gemini-2.5-flash + v1)

1. **Model list, enrich call only:** `['google/gemini-2.5-flash', 'google/gemma-4-31b-it']`. Normalize keeps `MODELS` (gemma-4-31b → gemma-4-26b) because it was not tested with Gemini. `proxy/src/llm.ts:5` defines one `MODELS` array used for both calls at `llm.ts:72`, so the list has to be passed per call.
   - Gemma as the fallback is safe with the v1 prompt: 0 online drops and 1/10 local drops in the table.
   - The request body is otherwise unchanged. It passed the zero-data-retention/`data_collection: "deny"` gate and `require_parameters`, served by provider "Google" with 0 reasoning tokens.
2. **Prompt diff** for `proxy/prompts/enrich.ts:10` (JSON schema unchanged):

```diff
-Some candidates are map listings of physical stores. Their snippet is a short list of map categories and is often empty, so judge those from the name and URL.
+Some candidates are map listings of physical stores. Their snippet is a short list of map categories and is often empty, so judge those from the name and URL. Judge each map listing on its own, from its store type and name. Never compare it with the web pages in the list: a map listing never shows products, so that is not evidence against it. For a map listing, sells_product is "no" only when its type or name shows it sells a different kind of goods. Big-box, department, discount, warehouse, and general-merchandise stores are "maybe" for common goods, or "yes" when they are widely known to carry the product.
```

3. **Expected cost:** about $0.0045 per search for enrich, +$0.0037 over gemma. Measured mixed calls averaged $0.0034 for about 20 candidates; the estimate is scaled to production's ~40. The cost estimate in `proxy/src/pricing.ts` needs updating.
4. **Tests to add:** a fixture of a mixed call that asserts map listings of big-box chains are not dropped. The eval60 local-precision rerun after shipping should report relevant local drops explicitly, since that is the known weak spot.
5. **Not measured:** the online page titles (the retailer name stood in for them) and the effect on normalize.

---

# Round 1 (superseded)

## Pre-ship checks (added after the main run; same cache and cap, new cache keys)

**1. Online do-no-harm: guard passes.** One call per eval60 search held all graded online rows (≤10) plus that search's graded local rows (set E), which is closer to production's mixed call. That gave 20 calls per arm. Online: 191 graded, 189 relevant.

| Arm | Online relevant dropped | Online irrelevant dropped | Relevant dropped share |
|---|---|---|---|
| 1. gemma baseline | 0 | 0 | 0% |
| 3. gemini-2.5-flash | 4 | 1 | 2.1% |

The guard is at most 5 points more than arm 1; arm 3 is at +2.1 points. Gemini's online drops: Core Equipment and Kodiak Canvas (`manufacturer_no_cart`), Camping World (`service`), REI headlamp page (`editorial`); the irrelevant one is RIDGID.

**Blocking finding from the same calls: the local rows.** Of the 72 relevant local rows sent alongside online rows, Gemini dropped **27** (plus 33 irrelevant and 16 excluded). Arm 1 dropped 0. In local-only batches, Gemini dropped only 2 of the same 72.

- In 5 searches Gemini marked every local row `sells_product: "no"`. Examples: Best Buy and Walmart for a USB-C cable; DICK'S, REI and Patagonia for wool socks.
- In local-only batches it had called the same rows "maybe" or "yes".
- Likely cause: next to online pages whose snippets show the product, a map listing with only a category word looks like it "plainly does not" sell it.

The set M win and the local E numbers above were all measured in local-only batches. Production sends one mixed call, so they do not predict production behavior for this model. Gemma is steady across the two batch shapes (0 relevant local drops in mixed calls).

**2. Stability: guard passes.** Run 2 of arm 3 on set M, with fresh calls, reached 61.9% precision and 95.1% relevant kept (39/41). That is identical to run 1: the two runs made the same drop decision on 103 of 103 rows. The two-run mean is 61.9% precision (+12.5 points vs arm 1) and 95.1% relevant kept. Guards: mean relevant kept ≥ 95% passes, and mean gain ≥ 10 points passes.

**Mixed-call cost** (about 20 candidates per call): gemma $0.00066 per call, Gemini $0.00317 per call. A production call has about 40 candidates, so the added cost is roughly $0.005 per search, still under $0.01.

**What would unblock it:** a prompt change telling the model to judge map listings independently of the web results, and to use "maybe" when a listing's category plausibly covers the product. Rerun Gemini on set M and on the mixed E calls with that prompt, where the guard is relevant local drops in mixed calls ≤ 5% of relevant rows. Untested.

## Set M (merge test: 103 graded rows, 85 graded / 18 excluded for unknown, 41 relevant)

| Arm | Model id(s) | Precision | Relevant kept | Kept | Δ precision vs arm 1 (95% bootstrap) | Relevant-kept drop vs arm 1 | Est. added $/search | Win rule |
|---|---|---|---|---|---|---|---|---|
| 0. Production as run (reference) | gemma-4-31b (cached verdicts) | 48.2% | 100% (41/41) | 85 | | | | |
| 1. Baseline re-run | `google/gemma-4-31b-it` → `google/gemma-4-26b-a4b-it` (served 31b every time) | 49.4% | 100% (41/41) | 83 | | | $0 | reference |
| 2. Haiku | `anthropic/claude-haiku-4.5` | 50.0% | 95.1% (39/41) | 78 | +0.6 (−2.7 to +3.8) | 4.9 pts | $0.0094 | no (precision) |
| 3. Gemini | `google/gemini-2.5-flash` | **61.9%** | 95.1% (39/41) | 63 | **+12.5 (+6.5 to +19.5)** | 4.9 pts | $0.0037 | **WIN** |
| 4. Shopify only | none | 50.6% | 100% | 81 | +1.2 (−1.6 to +4.3) | 0 | $0 LLM | no (precision) |
| 1 + 4 | gemma + Shopify | 51.9% | 100% | 79 | +2.5 (+0.6 to +5.3) | 0 | $0 LLM | no (precision) |

Place-source rows only (52 rows, 38 graded, 18 relevant; the only rows production sees locally): baseline 50.0% / 100%, Haiku 48.5% / 88.9%, Gemini **66.7% / 100%**.

Gemini's two lost relevant rows on M are both Target (camping-tent-urban, snippet "department store") judged `sells_product: no`. Haiku's are Le Creuset Outlet and Hobby Lobby (cast iron skillet).

## Set E (eval60 sample: 185 local rows, all kept by production; 140 graded, 72 relevant)

| Arm | Extra drops: relevant | irrelevant | excluded | Precision after drops (production 51.4%) | E consistent? |
|---|---|---|---|---|---|
| 1. Baseline re-run | 2 | 8 | 3 | 53.8% | yes |
| 2. Haiku | 5 | 18 | 5 | 57.3% | yes |
| 3. Gemini | 2 | 19 | 6 | 58.8% | yes |
| 4. Shopify | 3 | 16 | 3 | 52.2% | yes |
| 1 + 4 | 5 | 23 | 6 | 54.8% | yes |

Gemini's relevant E drops: Pacific Kitchen and Home (skillet, snippet "electronics"), RevZilla (tent). Haiku's add GameStop (USB-C cable), JD Sports and Urban Outfitters (rain jacket).

## Cost

| Arm | Calls (attempts) | Measured $/call (local-only batch ≤16) | Token ratio vs gemma (prompt / completion) | Est. $/search at production size | Added vs production ($0.00078) |
|---|---|---|---|---|---|
| Baseline | 29 (29) | $0.00024 | 1 / 1 | $0.0007 | $0 |
| Haiku 4.5 | 29 (29) | $0.00340 | 1.45 / 0.87 | $0.0102 | $0.0094 |
| Gemini 2.5 Flash | 29 (29) | $0.00141 | 0.99 / 1.19 | $0.0045 | $0.0037 |

Method: production eval60 enrich calls average 3,637 prompt / 1,131 completion gemma tokens (~16 local + ~24 online candidates). Scaled by each model's token ratio against gemma on identical batches, then priced at the OpenRouter list price (Haiku $1/$5, Gemini 2.5 Flash $0.30/$2.50 per M tokens). No retries and zero reasoning tokens were observed for any arm. Haiku's estimate rests on local-only batches; production prompts carry longer online snippets, so its true added cost could cross $0.01.

## Shopify arm (4)

- 189 hosts fetched (1 GET each, `www.` stripped, 1 s apart, 10 s timeout, UA `nottheriver-research/0.1`); 38 served Shopify JSON.
- Coverage: 14.9% of rows (M 9.7%, E 17.8%). Where it had an opinion on a graded row (37 rows): "yes" was right about selling 13/14 (but only 9/14 relevant, because Lodge and FBG Cast Iron sell skillets without a local store); "no" was right 20/23 (87%).
- Wrong "no"s: Vermont Kitchen Supply (skillet) and two Sports Basement store pages (headlamp). 16 of the 23 "no"s came from catalogs cut off at the 250-product limit, so a real product can be missed on page 2.
- Too little coverage to move precision: +1.2 pts alone, +2.5 pts on top of the baseline.

Key nouns (word-bounded, plural allowed, matched against title + product_type + tags): skillet, tent, bulb, cable, towel, drill, chocolate, olive oil, headlamp/head lamp, puzzle, tea, jacket, battery/batteries, train, blanket, sock.

## Model selection and gate

- Candidates came from the public OpenRouter list, ranked by estimated production cost (≤ $0.01 added per search). A routing probe (`p5-probe.mts`, results in `probe.json`) sent production request settings: `json_schema` strict, `provider: { require_parameters: true, data_collection: "deny" }`, `temperature: 0`.
- `google/gemini-3.8-flash`, `openai/gpt-5.4-mini`, `openai/gpt-5.4-nano`, `google/gemini-3.5-flash-lite`: the account's zero-data-retention setting left one endpoint, which then failed "Filter by Parameters". Out under production settings.
- `x-ai/grok-4.3` (ignored provider) and `meta/muse-spark-1.3` (attestation gate): out.
- Passed: Haiku 4.5, Gemini 2.5 Flash, GPT-4.1 (too expensive at list price), GPT-4.1-mini, Qwen3.7-plus, DeepSeek-v4.1-flash, Mistral-medium-3.1, GLM-5.3, Kimi-k2.6, Gemini-3.1-flash-lite. Gemini 2.5 Flash was picked as the strongest affordable non-Anthropic option that answers without reasoning tokens. It is also the newest Google Flash-tier model that passes the account's ZDR + `require_parameters` gate, since 3.5 Flash Lite and 3.8 Flash do not. Whether a 2025 model is "stronger" than Gemma 4 31B was an assumption; the results bear it out on M. This choice was made on the gate results, before any scoring.

## Caveats

- Small sample: M has 41 relevant rows, so one row is 2.4 points. Gemini sits at 4.9 of the 5.0-point allowance. One run per arm at temperature 0 (not deterministic across providers).
- The M grades were made on rows production had already kept, so "relevant kept" can only fall. Rows production drops are never graded, so recovered good shops cannot show up.
- The enrich call also classifies ONLINE candidates. Swapping the model changes online results too, and that was **not measured here**.
- Batch shape differs from production: every arm saw local-only batches of 5-16 graded rows, while production sends ~16 local + ~24 online in one prompt. The comparison between arms is fair because every arm ran the same way, but absolute behavior can shift. For example, the baseline re-run dropped 2 relevant E rows that production (same model and prompt, mixed batch) had kept.
- Gemini's gain comes almost entirely from saying `sells_product: "no"` more often (50 of 52 drops are `retailer` + `no`). That is where its errors are as well. The Target "no" is isolated to one batch (camping-tent-urban, 2 rows). Across the other 70 big-box and chain rows in M and E (Target, Walmart, Home Depot, Lowe's, Dick's, REI, Costco, HomeGoods, Cabela's), Gemini said "maybe" or "yes", apart from Harbor Freight, TJ Maxx and Ross ("no"; all irrelevant or excluded) and Cabela's for LED bulbs ("no"; irrelevant). On E it moved some clear "yes" chains to "maybe" (REI, Costco, Target), which does not drop them.

## Round 1 implementation notes (superseded by the round 2 notes at the top)

1. Model list for **enrich only**: `['google/gemini-2.5-flash', 'google/gemma-4-31b-it']`. `proxy/src/llm.ts` has one `MODELS` array shared by the `normalize` and `enrich` calls (`llm.ts:5`, used at `llm.ts:72`). Either make the list per call, or accept that normalize moves to Gemini too, which was not measured. Keep gemma as the fallback for availability; when the fallback serves a call, results return to baseline quality. The request body is otherwise unchanged: it passed the ZDR/deny and `require_parameters` gate with provider "Google".
2. No prompt changes were tested; this ran on the production `proxy/prompts/enrich.ts` as-is.
3. Expected cost is about $0.0045 per search for enrich (+$0.0037 over gemma). The site's per-search estimate (`pricing.ts`) and any cost copy need updating.
4. Before shipping: (a) rerun eval60 online grades with the new model (see caveat on online results); (b) watch completion tokens, because Gemini 2.5 Flash can reason if a default changes. Setting `reasoning` explicitly would pin that, but it is untested here.
5. A possible follow-up is a prompt line saying that department stores and big-box general retailers "maybe" carry common goods. It would address the Target misses. Untested.

## Files

- `../p5-classify.mts`: LLM arms. It sits in MT because `with-openrouter.mjs` only runs scripts from its own folder. `PREP=1` writes `rows.json`.
- Round 2: `MIXED=1 ... p5-classify.mts baseline baseline@v1 baseline@v2 google/gemini-2.5-flash@v1 google/gemini-2.5-flash@v2`, then `'google/gemini-2.5-flash@v1#run2'` (logs `run-variants*.log`, rows `rows-mixed.json`, results under `round2` in `results.json`). The variant texts are `VARIANTS` in `../p5-classify.mts`.
- Pre-ship runs: `ONLINE=1 ... p5-classify.mts baseline google/gemini-2.5-flash` (rows in `rows-online.json`, log `run-online.log`) and `SETS=M ... p5-classify.mts 'google/gemini-2.5-flash#run2'` (`run-stability.log`). Results under `preship_online`, `preship_stability` and `preship_cost_mixed_calls` in `results.json`.
- `../p5-probe.mts`: routing gate; output in `probe.json`.
- `shopify.mjs` → `shopify-cache.json`, `shopify.log`.
- `score.mjs` → `results.json` (per-arm metrics, costs, win flags, per-row detail).
- `cache.json`: every attempt (model, provider, tokens, cost) and every verdict, keyed `arm|set|search|url`; `spend_usd` is cumulative. Reruns cost nothing.
- `models.json`: OpenRouter model list snapshot used for pricing. `run.log`, `NOTES.md`.
