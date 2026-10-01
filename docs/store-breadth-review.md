# Review: what `store_breadth` is worth (2026-10-01)

Read-only review (Claude Fable 5.1). "Computed here" marks figures from a one-off script over the saved responses and grades, not in the repo.

**Outcome (2026-10-01).** The operator approved O1 (remove the field); done in commit `10cc13f`, not yet deployed. Correction to O5: `docs/STATUS.md` records the stronger classifier as not shipped (operator decision), so that question is closed, not pending; `docs/quality.md` now says so.

## 1. Verdict

`store_breadth` is worth nothing to a shopper today and cannot be made worth much: even a perfect version of the one useful signal near it (the shop mainly sells something else) moves about one top-3 shop per 20 searches. Remove the field at the next Worker deploy, keep the grader labels as evidence, and put the "will they have it" effort into `sells_product` itself. Do not build a seller-type taxonomy.

## 2. The user value proposition

A person typing "extension cord" wants, in order: will this shop have it when I get there; can I check before I go; how far; and whether the shop fits their values. "Breadth" is not on that list; it is a proxy for the first item. The archetypes differ on stock likelihood (very high, high, moderate, low), checkability (a catalog for 1 and 2 only) and values (3 is the one the app wants to lift; 1, and often 4, carry findings).

## 3. What `store_breadth` delivers against the four archetypes

| Archetype | Field says | Shopper needs | Can the data tell? |
|---|---|---|---|
| 1. Walmart | general | likely has it; chain; findings | Already told: `data/chains.json` (39 entries; Walmart, Home Depot, Ace, Dollar General included), `sells_product`, `data/negatives.json` |
| 2. Hardware chain with online store | "specialist" by definition (`proxy/prompts/enrich.ts:24`); the model said "general" for Ace, True Value, DICK'S, REI (28 rows in run 1, 0 the reverse, `breadth-measures.json` m5) | likely has it; checkable online | Badge plus `sells_product`; catalog presence is recorded nowhere |
| 3. Independent hardware, no online store | specialist | probably has common items; independent | Cannot be separated from 2 |
| 4. Convenience store | "general" by the wording; unknown or specialist in practice | might have one | Rare: about 15 of 158 graded local rows, mostly Dollar General, Target, Safeway (computed here); Dollar General was "yes" and right for batteries |
| 5. Narrow shop in a different line (not in the brief) | specialist or general at random (16 and 17 in run 1) | usually lacks it | The measured noise: 30 of 158 rows per run; of their "maybe" rows, 7 good against 13 bad (computed here; `docs/quality.md:109` gives 29% for all maybes the grader could not place) |

## 4. Why it fell short (evidence only)

- **Width, not fit.** A ski-tuning shop is as narrow as a hardware store; only one stocks a rain jacket. The scale has no value for the 30 wrong-line rows per run (`breadth-measures.json`, grader_unknown_by_kind).
- **The model reads "specialist" as "narrow".** Its specialists among grader-unknowns: a kitchen remodeler, a kayak-tour outfitter, Orvis for a tent, a card shop for a puzzle (computed here). Both readings are defensible; rewording fixes the model, not the margin (a fly shop did stock a headlamp).
- **The hypothesis inverted.** Maybe-specialists 47.5% good against maybe-generals 65.9% (`docs/quality.md:108`).
- **The real signal is small and already ranked low.** Wrong-line "maybe" rows per run: 7 good, 13 bad, mostly at ranks 4 to 10. With perfect wrong-line knowledge, top-3 good goes from 36 of 51 to 37 of 49 and from 36 of 52 to 37 of 51; removing those rows lifts local precision from 71% to 77% at the cost of 7 good shops per run, mostly narrow independents (computed here). A "yes" beats a "maybe" by 0.125 (`proxy/ranking/score.ts:61-73`), so these rows already sit low.
- **Cost is a non-issue.** The brief's $0.0036 is the whole enrich call; the field is a few tokens per candidate. Keeping it leaves a dead optional field in the public contract (`proxy/schemas/search-response.json:60`).

## 5. Options

| | Value | Cost | Risk | To test |
|---|---|---|---|---|
| O1. Remove the field | Honest contract | Small Worker change, next deploy | None | Phase 3a tests inverted |
| O2. Keep it quietly | None; the measurement has answered | A dead field in the contract | Misread as meaningful | Nothing |
| O3. Reword the slot to line fit (product's category / a different single line / many lines / can't tell), then a 0.2 tier for "different line" maybes | Ceiling: one top-3 row and 6 precision points per run | Prompt change, offline rerun (cents), two graded runs | Lands on narrow independents, 7 good per run, only "Model judgment" to dispute; reopens Q5 | Model against grader off_category on the 158 and 161 rows |
| O4. Sourced seller-kind hint, never scored: a `kind` column in `chains.json` plus Brave's place word | "Convenience chain, may stock a few" | Curation per row | None; unlisted independents stay unlabelled | Data test |
| O5. Spend the effort on `sells_product`: the stronger classifier held for a decision, +13 precision points (`docs/quality.md:129`) | The actual gap, including wrong-line "yes" rows (1 good, 4 bad per run) | $0.0037 per search | Drops 12 of 72 good local shops, 3 independents | Done; needs a ruling |

## 6. Recommendation

O1, with O5 as where attention goes. First step: one commit removing `store_breadth` from `proxy/prompts/enrich.ts`, `proxy/schemas/enrich.json`, `proxy/src/contract.ts:34,99` and `search-response.json:60`, shipped with the next Worker change. What would change my mind: an offline rerun of O3's question matching the grader's off_category label on at least 80% of those 30 rows while flagging under 5% of in-category rows; then the 0.2 tier earns two graded runs. Operator decides: (a) O1 or O3; (b) whether the Q5 "no" (an up-tier) also closes a down-tier; (c) the classifier ruling, the larger lever on the same problem.

**Where I disagree with the brief.** The four archetypes are a seller taxonomy, not the shopper's question, and the pipeline rarely meets archetype 4. The measured noise is a fifth kind, narrow shops in a different line, and that is a `sells_product` miss, not a breadth question.

## Sources read

`docs/quality.md:93-112`, `docs/plans/store-types.md`, `docs/caching-and-store-types.md`, `docs/ranking.md`, `docs/decisions/0003-scoring.md:7`, `proxy/prompts/enrich.ts`, `proxy/ranking/score.ts`, `src/render.ts:88-211`, `data/chains.json`, `docs/evidence/quality/eval20-store-types/` and its `run2/`. Web: Google Places and OpenStreetMap use category tags, not a breadth scale (https://developers.google.com/maps/documentation/places/web-service/place-types, https://wiki.openstreetmap.org/wiki/Shops); Google Maps' "in stock nearby" rests on merchant inventory feeds (https://searchengineland.com/google-maps-adds-products-nearby-for-product-searches-448326).
