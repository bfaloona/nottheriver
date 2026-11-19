# Nearby searches from the category list: A/B on six searches

Tests IDEA-1 of [docs/plans/category-uses.md](../../plans/category-uses.md): code builds the two nearby map searches from the store types of the category list, in place of the model's own wording. The owner approved the Brave calls on 2026-11-18 (LQ7 of [docs/plans/category-list.md](../../plans/category-list.md)).

## Plan, written before the first call

**Searches.** The six graded searches of `docs/evidence/quality/eval20-store-types` whose saved nearby wording differs from the list's store types (`docs/evidence/category-list/results.json`, `test1.per_search`): cordless-drill-suburban, jigsaw-puzzle-urban, led-light-bulbs-rural, rechargeable-aa-batteries-rural, wool-blanket-rural, wool-socks-urban. They hold 29 confirmed nearby baseline shops.

**Arms.** Both arms run the Worker pipeline of this commit locally (`run-ab.ts`), against live Brave and OpenRouter.

| Arm | The two nearby map searches |
|---|---|
| `model` | The model's own `local_queries`, as the site runs today |
| `list` | The store types of the product's hand pick in `eval/picks.json`, read from `data/categories.draft.json` (the specific category's pair, else the general category's) |

The hand pick is used, not the live category call, so that the test is about the wording alone. The live pick is saved in each response for comparison.

**Controls.**

- One reading per search. The first `model` search of round 1 calls the normalize model; every later search of that product, in both arms and both rounds, reads the same saved reply. The `list` arm changes only `local_queries` in it.
- Within a round, a Brave request that an earlier search of the round already made (the same URL) gets the saved reply. The web searches are then the same in both arms, and so is a map search phrase that both arms send.
- Two rounds. Each round makes its Brave calls again. The difference between the two rounds of one arm is the noise that a difference between arms must exceed.
- The model's judgment of each shop (the enrich calls) runs live in every search.

**Measures.**

| Measure | What is counted |
|---|---|
| M1, returned by the map searches | Of the 29 baseline shops, how many appear in the raw replies of the arm's two map searches (same registrable domain, or same name for a shop with no website) |
| M2, shown on the page | Of the 29, how many the response shows under Near you or Farther away (`recall` of `eval/summarize.mjs`) |
| M3, shown shops by grade | Shown nearby shops that an earlier graded run judged (sells it, does not), and the count never graded. A shop is matched to a grade by search and URL across every `docs/evidence/quality/*/grades.json` |
| M4, same-arm noise | M1 and M2 per round, and the share of shown nearby shops that both rounds of one arm show |
| M5, wording check | Whether the model's live pair still differs from the list pair for each search |

**Reading rule.** Six searches and 29 shops are a screen, not a measurement of the site. The list wording counts as "no worse" when its M1 and M2 totals are at least the model wording's in both rounds. It counts as "better" only when the gap between arms is larger than the gap between the two rounds of either arm, on M1 and on M2. A shop that no earlier run graded is reported as ungraded and is not counted for or against an arm.

**Budget.** At most 7 Brave calls per search in round 1 (3 web, 2 map, then 2 new map searches for the `list` arm) and the same in round 2: 84 calls at most, fewer when the arms share a phrase. The script stops at 100 live Brave calls. At the list price in `proxy/src/pricing.ts` ($0.005 a call) that is at most $0.50, an estimate from the price list. Model cost is read from OpenRouter's reported `usage.cost`.

**Rerun.** `npx tsx docs/evidence/category-ab/run-ab.ts`, then `npx tsx docs/evidence/category-ab/score-ab.ts`. A rerun makes new paid calls and overwrites `runs/`.
