# Plan: why Brave returns different local shops from run to run

Status: steps 1-3 and 5 done 2026-09-25 (results: `docs/quality.md`, "Why local results change from run to run"); step 4 awaits the operator's answer to Q1. Wording dominates. Why it matters: the eval rerun (`docs/quality.md`, "Rerun after distance groups...") could not tell a ranking change from run-to-run churn. Target (Kyle) and Safeway (Burlingame) were returned in one run and not the next, and the offline gain for the nearby top 3 (23 to 29) did not show live.

## What is known

- The model writes the local queries, and they changed between runs for the same search even though the normalize call uses `temperature: 0` (`proxy/src/llm.ts:77`): "chocolatier shop" / "specialty food store" vs "chocolatier store" / "specialty food shop"; "clothing shop" vs "clothing boutique shop". OpenRouter may route to different providers, so temperature 0 does not make the output repeatable.
- Brave's place search can itself vary for an identical query (index updates, ranking); not yet measured.
- Saved evidence has both runs' `query.local_queries` and results: `docs/evidence/quality/eval60/responses/` and `docs/evidence/quality/eval20-0924/responses/`.

## Steps

1. **Measure from saved data (free).** For the 20 sampled searches, compare eval60 and eval20-0924: how many had different local queries, and local result overlap (same domain + street address) for searches whose queries matched vs differed.
2. **Isolate Brave's own churn (about 80 Brave calls, authorized through 2026-09-30).** Replay each search's eval20-0924 local queries directly to Brave place search twice, an hour or more apart, with the same coordinates and count (the Brave helper that reads the key from its file). Overlap between the two replays = Brave churn with the wording fixed.
3. **Isolate wording churn.** Run normalize alone 3 times per product (model cost only, no Brave), and count distinct local query sets.
4. **Decide by which source dominates.**
   - Wording: fix the queries per product, e.g. cache the normalize output by product text (Workers KV), or derive local queries from the category with fixed templates ("<category> store") and let the model only pick the category; pin the OpenRouter provider if that alone makes it repeatable.
   - Brave: nothing to fix upstream; make the eval robust instead: run each graded search twice and report both, or the shops found in either run.
5. Write the result into `docs/quality.md` (method limits) and record the decision in `docs/STATUS.md`.

## Open question for the operator

- Q1. If wording dominates, is a per-product cache acceptable? It makes results repeatable but means a stale query set for a product until the cache expires; the privacy impact is small (product text only, no location) but is a new store of search terms and needs a line in `docs/privacy.md`.
  - Measured options: always end local searches in "store" (one line in `storeQuery`, removes 4 of the 7 wording differences between eval runs, no cache); a normalize cache (fully repeatable until expiry; the normalize prompt includes city and state, `proxy/prompts/normalize.ts:7`, so the key is product only or product plus city); category templates (the category itself varied on 4 of 20 searches, and some are not shop types, e.g. "pantry staples"); pinning the provider (no help: wording varied on one provider).
