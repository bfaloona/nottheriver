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

## Result, 2026-11-19

Run on commit d6cf96a at 7:52 AM Pacific. All 24 searches returned. Figures: `results.json` (from `score-ab.ts`); raw map replies and call counts: `runs/calls.json`; responses: `runs/<arm>-r<round>/responses/`.

**The list wording finds no more baseline shops than the model's wording on these six searches.** The run does not test the other claim for IDEA-1, that fixed wording gives the same searches every time. By the reading rule it is not "no worse": its map searches returned one baseline shop fewer in both rounds. The page showed the same number of baseline shops in both arms.

| Measure | `model` round 1 | `model` round 2 | `list` round 1 | `list` round 2 |
|---|---|---|---|---|
| M1, baseline shops returned by the map searches (of 29) | 6 | 6 | 5 | 5 |
| M2, baseline shops shown on the page (of 29) | 5 | 5 | 5 | 5 |
| M3, nearby shops shown | 48 | 49 | 48 | 45 |
| M3, graded good | 18 | 18 | 15 | 14 |
| M3, graded bad | 14 | 16 | 12 | 12 |
| M3, no usable grade (never graded, or graded "unknown") | 16 | 15 | 21 | 19 |

- **M1 and M2.** The one-shop gap on M1 is Barnes & Noble for jigsaw puzzle: "hobby store" returned it and "game store" did not. On the page the arms differ by one shop each way in that search (the `model` arm shows Barnes & Noble, the `list` arm shows Pinwheels and Play Toys). The other five searches give the same baseline shops in both arms.
- **M3.** Among graded shops the share that is good is about the same: 18 of 32 and 18 of 34 for `model`, 15 of 27 and 14 of 26 for `list`. The `list` arm shows more shops with no usable grade. Control for the grade join: the same join on the saved run of these six searches (`docs/evidence/quality/eval20-store-types`) gives 28 good, 13 bad and 10 graded "unknown" of 51 shown shops, with none unmatched. The join is by exact shop URL: of the shown shops with no grade under that URL, 1 or 2 per arm and round have a grade under another URL of the same domain in that search (another branch, or another page), so the join does not explain the gap between the arms.
- **M4, noise.** M1 and M2 did not change between rounds in either arm. Shown nearby shops in common between the two rounds: 47 of 50 (`model`) and 44 of 49 (`list`). Between the arms: 33 of 63 in round 1 and 31 of 63 in round 2. The list wording changes about half of the shops shown and does not change how many baseline shops the page shows (M2).
- **M5, wording.** The pairs differ in all six searches, by one phrase each: every search has one phrase that both arms sent.

**Other findings.**

- **The model's wording had already moved.** The live reading differs from the wording saved on 2026-09-29 (`docs/evidence/quality/eval20-store-types`) in 2 of the 6 searches: wool socks ("outdoor gear store" became "clothing store") and LED light bulbs ("electrical supply store" became "hardware store"). The saved run shows 9 of these 29 baseline shops; both arms here show 5. The loss is in wool socks: 4 shown then, 0 now in both arms. `proxy/prompts/normalize.ts` and the model list did not change between the two dates (`git log`), so the model reworded the same prompt.
- **Wool socks is a wrong-category case for the list (FAIL-1 of the plan).** Its four found baseline shops are outdoor shops. The hand pick is `clothing`, whose pair ("clothing store", "shoe store") returned none of the five. The second defensible pick, `outdoor`, was not run.
- **Cordless drill and wool blanket found no baseline shop in any arm or round**, here and in the saved run.
- **The live category pick matched the hand pick at both levels in all six searches.** This is the first run of the category call inside the pipeline. The call ran once per product (569 prompt tokens, $0.000444 reported for wool socks) and later searches read the saved reply.

**Cost.** 60 live Brave calls and 36 replayed: $0.30 at the list price of $0.005 a call (an estimate from the price list, `proxy/src/pricing.ts`). Model calls: $0.061 (the sum of OpenRouter's reported `usage.cost` in the 24 responses; no call lacked a reported cost).

**Limits.**

- Six searches, one zip each, 29 baseline shops. The baseline was collected for the 2026-09 runs, and 15 to 21 shown shops per arm and round have no usable grade.
- Each pair shares one phrase, so the test compares six single phrases, not twelve.
- One reading per search. The test does not measure the benefit IDEA-1 claims from fixed wording: the model's own wording changed for 2 of 6 products since September, and the list's would not have.
- The `list` arm used the hand pick. A wrong live pick would change its pair.
- After a code review, `run-ab.ts` got two guards (the Brave stop now ends the run; a `list` search that did not send the list pair ends the run) and `score-ab.ts` compares the pairs without regard to order. `results.json` did not change.
- `score-ab.ts` was changed once after the run: one `grades.json` under `docs/evidence/quality` has another shape and stopped the script. No measure changed.
