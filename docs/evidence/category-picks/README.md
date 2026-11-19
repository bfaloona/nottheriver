# Category picks: what the normalize model chooses from the draft list

Run on 2026-11-18, 10:35 PM to 10:38 PM Pacific. It tests the two reply fields that `docs/plans/category-list.md` proposes (`general` and `specific`) with real model calls. The owner approved the calls on 2026-11-18 (`docs/plans/category-uses.md`, "Owner rulings", CQ3 and LQ7). No Brave call was made and the live site was not used.

## Result against the pass marks

The pass marks were set before the run. All three passed.

| Mark | Pass mark | Result | Verdict |
|---|---|---|---|
| Brand and model inputs: the general pick matches the hand label | at least 90% of calls | 72 of 72 calls (100%) | pass |
| Non-products: the pick is "not a product" | at least 80% of calls | 27 of 30 calls (90%) | pass |
| Repeatability: the same input gets the same pick in all 3 runs | at least 90% of inputs | 47 of 48 inputs (97.9%) | pass |

"Same pick" counts both levels. The count for the general level alone is also 47 of 48. Every figure in this file comes from `results.json`, which `grade.ts` computes from `raw.json`.

## Method

- **Probes.** The 48 inputs in the `probes` array of `docs/evidence/category-list/hand-labels.json`: 24 brand or model names, 10 non-products, 5 products that the label places in no category ("gap"), and 9 products that two categories could claim ("two"). The labels were written before any model call and were not edited.
- **Calls.** The draft prompt ran 3 times per probe (144 calls). Today's prompt ran once per probe (48 calls), beside the first draft run and in alternating order. Calls ran one at a time.
- **Same request as production.** `run-picks.ts` asks `createLlmClient` in `proxy/src/llm.ts` to build each request (URL, headers, models, temperature 0, 400-token limit, provider settings, strict JSON schema) and sends that request unchanged. For the draft prompt it swaps in the draft schema, and nothing else differs. The script retries once when a reply fails the schema, as production does. No retry was needed.
- **Draft prompt.** Today's prompt plus the two field lines and the CATEGORIES block from the "Prompt draft" section of the plan. The block is built from `data/categories.draft.json`. For "cast iron skillet" the prompt has 3,113 characters, the figure in the plan. The full text is in `raw.json` under `prompts`.
- **Draft schema.** Today's schema plus `general` and `specific`, each any string of up to 60 characters, both required. They come first in the schema, as they come first in the prompt.
- **Mapping.** Code maps each reply with rules MAP-1 to MAP-7 of the plan (`mapPick` in `lib.ts`). A value that is not on the list becomes "none". The grades use the mapped pick.
- **Grading.** `grade.ts` compares each mapped pick with the hand label. A call with no valid reply would count as a miss. There was none.
- **Brand words.** To see whether `canonical_name` still carries a brand, `grade.ts` holds a list of brand and model words for each brand probe. The list was written before the first call.

## Rerun

```sh
npx tsx docs/evidence/category-picks/run-picks.ts   # paid calls; resumes from raw.json, so delete raw.json for a fresh run
npx tsx docs/evidence/category-picks/grade.ts       # no calls; rewrites results.json
```

`run-picks.ts` reads the OpenRouter key from the file that `infra/deploy.local.env` names. Set `DEPLOY_ENV=<path>` when that file is in another checkout. The key is never printed or saved. `LIMIT=1` runs one probe as a smoke test. `MAX_USD` (default 1) stops the run when the reported cost passes it.

## Cost

Total: **$0.088572** for 192 calls. The source is the `usage.cost` figure that OpenRouter returned in each of the 192 replies, summed. This total includes the 2 smoke-test calls, which are the first probe's first-run calls.

| Calls | Count | Reported cost | Median per call |
|---|---|---|---|
| Today's prompt | 48 | $0.016614 | $0.000339 |
| Draft prompt | 144 | $0.071958 | $0.000686 |

## Findings

**FIND-1. The model reads brand and model names well.** The general pick matched the label in 72 of 72 calls and both levels matched in 69 of 72. The 3 misses are one input: "LEGO 10311" got `toys_hobbies/models_collectibles` in all 3 runs, where the label says `toys`. A bare model number worked ("DeWalt DCD771", "Makita XFD131", "Stihl MS 170").

**FIND-2. The model names a specific category when none fits.** In 15 calls the label has a general category and no specific one, and the general pick was right. The model named a specific category in 12 of them. It never left `specific` empty for a product that had a general pick, except "dog bed" (`pets`, 3 calls).

| Input | Pick in all 3 runs | What that specific category carries in the draft list |
|---|---|---|
| garden gloves | `garden/yard_power_equipment` | "lawn mower store"; proposed borrow, repair and used ideas for tools |
| bird feeder | `garden/grills_patio` | "barbecue store", "patio furniture store" |
| baby monitor | `baby_kids/nursery_furniture` | "furniture store"; the proposed `no_used` flag |
| pocket knife | `outdoor/fishing_hunting` | "fishing tackle store" |

The specific level decides store types, idea kinds and `no_used`, so a forced specific pick would steer those wrongly. The general level did not have this problem.

**FIND-3. Non-products: 9 of 10 inputs were right in every run, with the right reason.** "kitchen", "camping" and "yoga class", which the code-only map sent to product categories, all got "not a product". The 3 misses are "asdfgh", which got `none` in all 3 runs. The draft prompt lists a service, a meal, a place to stay, an activity and a whole room as uses of `not_a_product`; it does not mention input that cannot be read.

**FIND-4. Products with no category rarely got "none".** 6 of 15 calls (2 of 5 inputs: dishwasher tablets, laundry detergent). "eyeglasses" got `health_beauty/medicine_medical`, "gift card" got `not_a_product/service`, and "firewood" got `tools_hardware/building_materials` once and `garden/grills_patio` twice. This kind has no pass mark.

**FIND-5. Repeat runs agree; one input changed.** "firewood" is the only input whose pick changed between runs. All 144 draft calls were answered by the same model (`google/gemma-4-31b-it`) and the same provider (ModelRun) within three minutes, so this measures repeatability under the best conditions.

**FIND-6. Two-category products (owner question CQ6).** For all 9 inputs the model picked the label's general category in all 27 calls and never picked the other one. Each input got the same pick in all 3 runs.

| Input | Label | Other defensible pick | Model, all 3 runs |
|---|---|---|---|
| notebook | `books_media/stationery_office` | `electronics/computers` | `books_media/stationery_office` |
| pocket knife | `outdoor` | `kitchen/kitchen_knives` | `outdoor/fishing_hunting` |
| sewing machine | `toys_hobbies/fabric_yarn` | `appliances` | `toys_hobbies/craft_supplies` |
| yoga mat | `sports/fitness_equipment` | `outdoor` | `sports/fitness_equipment` |
| baby monitor | `baby_kids` | `electronics` | `baby_kids/nursery_furniture` |
| dog bed | `pets` | `home/bedding_bath` | `pets` |
| work boots | `clothing/workwear` | `clothing/shoes` | `clothing/workwear` |
| garden gloves | `garden` | `clothing/workwear` | `garden/yard_power_equipment` |
| bird feeder | `garden` | `pets` | `garden/grills_patio` |

Both levels matched the label in 12 of 27 calls; the misses are the forced specific picks of FIND-2 and "sewing machine". On these 9 inputs one pick was stable, so the run gives no evidence that a second general pick is needed. The run cannot say which pick finds more shops.

**FIND-7. No reply was off the list.** All 144 draft replies passed the schema on the first attempt. Every `general` value was a list id, `none` or `not_a_product`, written exactly as in the prompt. Every non-empty `specific` value was an id under its own general category. By rule: MAP-2 102 replies, MAP-3 3, MAP-6 30, MAP-7 9; MAP-4 and MAP-5 never applied.

**FIND-8. `canonical_name` already turns a brand into a generic name, with or without the new fields.** No brand or model word was in `canonical_name` in 72 of 72 draft calls and in 24 of 24 calls of today's prompt ("macbook" gives "laptop", "Stihl MS 170" gives "chainsaw"). With the draft prompt the name differed for 5 of 24 brand inputs and was less specific in each: "MacBook Air M3" gives "laptop" where today's prompt gives "ultraportable laptop"; "Brooks Ghost 16" gives "running shoes" where today's gives "neutral running shoes". No brand word was in any search query in either arm.

**FIND-9. The existing fields keep their shape, and their wording moves.**

| Check on the reply | Today's prompt, 48 calls | Draft prompt run 1, 48 calls |
|---|---|---|
| Valid against the schema | 48 | 48 |
| 3 to 6 similar products | 48 | 47 |
| 2 or 3 online queries | 48 | 47 |
| Exactly 2 nearby searches, each ending in "store" or "shop" | 48 | 48 |
| A banned word in an online query | 0 | 0 |
| `category` is the word "none" | 0 | 1 |

- The short reply is "asdfgh": the draft prompt returned no similar products and no online queries in all 3 runs. Today's prompt returned 2 online queries ("buy asdfgh", "asdfgh shop").
- The "none" is the input "kitchen": the draft prompt wrote `category: "none"` in all 3 runs, where today's prompt wrote "kitchenware". The new field's vocabulary leaked into the old field. Three places in the code read `category` as text.
- Wording changed more than repeat runs explain. The table shows how often two replies for the same input hold the same value.

| Field | Today vs draft run 1 | Draft run 1 vs run 2 | Draft run 2 vs run 3 |
|---|---|---|---|
| `category` | 30 of 48 | 47 of 48 | 47 of 48 |
| `canonical_name` | 42 of 48 | 48 of 48 | 48 of 48 |
| Both nearby searches, same order | 23 of 48 | 43 of 48 | 45 of 48 |
| First nearby search | 30 of 48 | 45 of 48 | 47 of 48 |
| Online queries, same set | 24 of 48 | 44 of 48 | 47 of 48 |
| Similar products, same set | 3 of 48 | 36 of 48 | 43 of 48 |

- Some draft nearby searches use words from the list: "firewood" gives "building materials store" (today "firewood store"), "work boots" gives "workwear store" (today "footwear store"), "Stihl MS 170" gives "garden power equipment store" (today "power tool store"). This run cannot say which wording finds better shops, because that needs Brave calls. `results.json` holds every pair under `existing_fields.side_by_side`.

**FIND-10. The draft prompt costs about twice as much per call and is slightly slower.**

| Per call, median (min to max) | Today's prompt, 48 calls | Draft prompt run 1, 48 calls | Draft prompt, all 144 calls |
|---|---|---|---|
| Prompt tokens | 348.5 (347 to 354) | 802.5 (801 to 808) | 802.5 (801 to 808) |
| Output tokens | 78 (65 to 128) | 94 (52 to 143) | 94 (52 to 143) |
| Latency, ms | 609.5 (432 to 995) | 647 (398 to 1,241) | 637.5 (369 to 1,241) |
| Cost reported by OpenRouter | $0.000339 | $0.000698 | $0.000686 |

The plan estimated about 740 prompt tokens for the draft; the measured figure is about 800. Latency is the time from sending the request to reading the full reply, on the machine that ran the script.

## Hand labels that look wrong

The grades above use every label as written. These labels are open to question:

| Input | Label | Model | Comment |
|---|---|---|---|
| asdfgh | `not_a_product/unclear` | `none` | The draft prompt does not tell the model to use `not_a_product` for unreadable input. The label follows the data file; the prompt and the data file disagree. This one input is all 3 non-product misses |
| eyeglasses | `none` | `health_beauty/medicine_medical` | The model's pick is defensible |
| gift card | `none` | `not_a_product/service` | Either reading is defensible; the two give different results under ruling CQ2 (a note for non-products) |
| LEGO 10311 | `toys_hobbies/toys` | `toys_hobbies/models_collectibles` | Depends on which set 10311 is. That was not checked, because the run made no web request |
| sewing machine | `toys_hobbies/fabric_yarn` | `toys_hobbies/craft_supplies` | Neither id names sewing machines |

## Limits

- 48 inputs, written and labeled by the agent that wrote the category list. The inputs are not real shopper searches.
- One model, one provider, one three-minute window. The fallback model (`google/gemma-4-26b-a4b-it`) never answered. Picks on another day, from another provider or from the fallback model are not measured.
- Three runs per input catch only large instability.
- The run measures the pick. It does not measure whether list-built store types find better shops; that needs Brave calls.
- The checks on the existing fields are rule checks in code (counts, endings, banned words, equal text). No person graded which wording is better.
- The brand-word check is a substring match against a hand list.
- Latency was measured from a laptop with calls one at a time. It is a comparison between the two prompts, not a forecast of Worker latency.
- The draft schema puts `general` and `specific` first. Another field order may change the replies.

## Files

| File | What |
|---|---|
| `run-picks.ts` | Makes the calls and writes `raw.json` after every call |
| `grade.ts` | Grades `raw.json` and writes `results.json` |
| `lib.ts` | Draft prompt, draft schema, mapping rules, shared types |
| `raw.json` | Every reply as OpenRouter returned it (content, usage, cost, model, provider), with start time and latency |
| `results.json` | All figures in this file, plus the pick for every input and run |
