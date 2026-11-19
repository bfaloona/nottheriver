# Category picks: what the normalize model chooses from the draft list

Run on 2026-11-18, 10:35 PM to 10:38 PM Pacific. It tests the two reply fields that `docs/plans/category-list.md` proposes (`general` and `specific`) with real model calls. The owner approved the calls on 2026-11-18 (`docs/plans/category-uses.md`, "Owner rulings", CQ3 and LQ7). No Brave call was made and the live site was not used.

A second run on 2026-11-19 tested a revised draft prompt against six pass marks. It is in the "Second run" section below. The sections before it describe the first run and its first draft prompt.

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

| Calls | Count | Reported cost | Median per call | Calls with cached prompt tokens |
|---|---|---|---|---|
| Today's prompt, run 1 | 48 | $0.016614 | $0.000339 | 0 |
| Draft prompt, run 1 | 48 | $0.033706 | $0.000698 | 0 |
| Draft prompt, run 2 | 48 | $0.019123 | $0.000263 | 33 |
| Draft prompt, run 3 | 48 | $0.019130 | $0.000263 | 33 |

Runs 2 and 3 cost less because the provider had the same prompt in its own cache for 33 of 48 calls in each run and billed those prompt tokens at a lower rate. A first search for a product gets no such discount, so run 1 is the figure to plan with: $0.000698 per call against $0.000339 today.

## Findings

**FIND-1. The model reads brand and model names well.** The general pick matched the label in 72 of 72 calls and both levels matched in 69 of 72. The 3 misses are one input: "LEGO 10311" got `toys_hobbies/models_collectibles` in all 3 runs, where the label says `toys`. A brand with a model number worked ("DeWalt DCD771", "Makita XFD131", "Stihl MS 170").

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

**FIND-5. Repeat runs agree; one input changed.** "firewood" is the only input whose pick changed between runs. All 144 draft calls were answered by the same model (`google/gemma-4-31b-it`) and the same provider (ModelRun) within three minutes, so this measures repeatability under the best conditions. In 66 of the 96 calls of runs 2 and 3 the provider read the prompt from its own cache. The replies were still generated anew: all 192 replies have distinct ids, and the other fields differ between runs (FIND-9).

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

**FIND-8. `canonical_name` already turns a brand into a generic name, with or without the new fields.** No brand or model word was in `canonical_name` in 72 of 72 draft calls and in 24 of 24 calls of today's prompt ("macbook" gives "laptop", "Stihl MS 170" gives "chainsaw"). With the draft prompt the name differed for 5 of 24 brand inputs (`canonical_name.inputs_where_draft_run_1_differs_from_today` in `results.json`) and was less specific in each: "MacBook Air M3" gives "laptop" where today's prompt gives "ultraportable laptop"; "Brooks Ghost 16" gives "running shoes" where today's gives "neutral running shoes". No brand word was in any search query in either arm.

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

**FIND-10. The draft prompt costs about twice as much per call. Median latency was 37.5 ms higher in run 1.**

| Per call, median (min to max) | Today's prompt, 48 calls | Draft prompt run 1, 48 calls |
|---|---|---|
| Prompt tokens | 348.5 (347 to 354) | 802.5 (801 to 808) |
| Output tokens | 78 (65 to 128) | 94 (52 to 143) |
| Latency, ms | 609.5 (432 to 995) | 647 (398 to 1,241) |
| Cost reported by OpenRouter | $0.000339 | $0.000698 |

The plan estimated about 740 prompt tokens for the draft; the measured figure is about 800. Latency is the time from sending the request to reading the full reply, on the machine that ran the script. The two latency ranges overlap, and 48 calls per prompt is too few to call the 37.5 ms gap a real difference. Median latency was 628 ms in draft run 2 and 637 ms in run 3.

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
- Three runs per input catch only large instability. The provider's prompt cache served 66 of the 96 repeat calls.
- Every brand probe names the brand. A bare model number ("DCD771") was not probed.
- The run measures the pick. It does not measure whether list-built store types find better shops; that needs Brave calls.
- The checks on the existing fields are rule checks in code (counts, endings, banned words, equal text). No person graded which wording is better.
- The brand-word check is a substring match against a hand list.
- Latency was measured from a laptop with calls one at a time. It is a comparison between the two prompts, not a forecast of Worker latency.
- The draft schema puts `general` and `specific` first. Another field order may change the replies.

## Second run

Run on 2026-11-19, 12:19 AM to 12:30 AM Pacific. The owner approved it (model calls only). No Brave call was made and the live site was not used. Every figure comes from `results-2.json` or a pilot's results file, which `grade.ts` computes from the raw files.

### Result against the six pass marks

All six marks were set before the run. The grading code for PM-4, PM-5 and PM-6 was committed before the first second-run call. "The 48" is the probe set of the first run, on which the prompt was revised. "Held-out" is the 19 new probes of `held-out.json`, committed before any second-run call and never used to revise the prompt.

| Mark | Pass mark | The 48 | Held-out |
|---|---|---|---|
| PM-1. Brand and model inputs: the general pick matches the label | at least 90% of calls | 72 of 72 (100%), pass | 18 of 18 (100%), pass |
| PM-2. Non-products get "not a product" | at least 80% of calls | 25 of 30 (83.3%), pass | 15 of 21 (71.4%), **fail** |
| PM-3. Same pick in all 3 runs, both levels | at least 90% of inputs | 45 of 48 (93.8%), pass | 19 of 19 (100%), pass |
| PM-4. Label has no specific category: the reply has none | at least 80% of calls | 24 of 30 (80.0%), pass | 15 of 18 (83.3%), pass |
| PM-5. `category` is never "none" or a reserved id; every product input has at least 1 online query and exactly 2 nearby searches | no exception | 0 reserved values; 114 of 114 product calls, pass | 0 reserved values; 36 of 36 product calls, pass |
| PM-6. Nearby wording is the same as today's prompt gives | at least 70% of inputs | 28 of 48 (58.3%), **fail** | 8 of 19 (42.1%), **fail** |

PM-4 passed on the 48 with no call to spare. PM-6 is a target for unchanged wording. It is not a measure of which wording finds better shops.

### What changed in the draft prompt

The second draft is in the "Prompt draft" section of `docs/plans/category-list.md` and in `raw-2.json` under `prompts`.

| Fix | Change |
|---|---|
| FIX-1, specific is optional | The `specific` line now reads: an id "only when it names exactly this kind of product; otherwise "none"". The first draft asked for an id "when one fits" |
| FIX-2, old fields unchanged | Today's prompt stays whole. The lead-in, the two field lines and the list follow its last line. The schema puts `general` and `specific` last, so the model writes the five old fields first (every saved reply has that key order). The lead-in tells the model to write the five fields as it would without the new part, for every input, with no field empty |
| FIX-3, nonsense input | The `general` line adds "or text you cannot read as a product" to the uses of `not_a_product` |

### Method

- **Probes.** The 48 of the first run and 19 held-out inputs: 6 brand or model names, 4 products with a general category and no specific one, 2 products with no category, 4 non-products and 3 nonsense strings. The nonsense strings have kind `nonproduct` and the label `not_a_product/unclear`, as the data file says.
- **Calls.** The second draft ran 3 times per probe (201 calls). Today's prompt ran once per probe (67 calls). The request, schema swap, retry rule, mapping and grading are those of the first run. No retry was needed in any of the 556 second-run calls.
- **Pilots.** Before the run, five drafts ran once each on the 48 only (288 calls, with one run of today's prompt). Pilot e became the second draft and was frozen in a commit before the first held-out call. The prompt did not change after that.
- **PM-4.** Counts every call whose label has no specific category: 10 of the 48 (5 "gap", 5 "two") and 6 held-out inputs. It uses the mapped pick and does not require a right general pick, so `not_a_product` with a reason is a miss.
- **PM-5.** Counts all three draft runs. A product input is every kind except `nonproduct`.
- **PM-6.** Both nearby searches the same, in the same order, between today's prompt and draft run 1. This is the measure that gave 23 of 48 in the first run.

### Pilots on the 48 probes

One run each, so the call counts are out of 10 inputs where the full run has 30 calls.

| Pilot | Layout | PM-2 | PM-4 | PM-5 | PM-6 | Brand, both levels | Median prompt tokens |
|---|---|---|---|---|---|---|---|
| First run | New lines above `- category:`, list above the last line, new fields first in the reply | 9 of 10 | 3 of 10 | fail: `category` "none" for "kitchen" | 23 of 48 | 23 of 24 | 802.5 |
| a | New lines after today's field lines, list after the last line, new fields last in the reply | 10 of 10 | 7 of 10 | fail: `category` "not_a_product" for "kitchen" and "none" for "asdfgh", both with no queries | 24 of 48 | 24 of 24 | 834.5 |
| b | Today's prompt whole, then a lead-in, the new lines and the list | 10 of 10 | 6 of 10 | pass | 23 of 48 | 24 of 24 | 849.5 |
| c | List near the top, above the shopper's request | 8 of 10 | 10 of 10 | fail: `category` "none" for "asdfgh" | 22 of 48 | 22 of 24 | 840.5 |
| d | Layout b, shorter lead-in, stricter `specific` line | 10 of 10 | 8 of 10 | pass | 24 of 48 | 23 of 24 | 846.5 |
| e (chosen) | Layout d, lead-in also says "leave no field empty" | 9 of 10 | 8 of 10 | pass | 26 of 48 | 24 of 24 | 862.5 |

The first-run row uses its run 1 and the second run's definitions. Pilot e was chosen over d because d returned no nearby searches for "asdfgh".

### Cost

Total for the second run: **$0.283918** for 556 calls. The source is the `usage.cost` figure that OpenRouter returned in each reply, summed over `raw-2.json` and the five pilot files. The limit was $1.

| Calls | Count | Reported cost |
|---|---|---|
| Pilot a, with one run of today's prompt | 96 | $0.046814 |
| Pilots b, c, d, e | 48 each | $0.031165, $0.025588, $0.031716, $0.031743 |
| Second run, today's prompt | 67 | $0.017977 |
| Second run, draft run 1 | 67 | $0.039871 |
| Second run, draft run 2 | 67 | $0.028823 |
| Second run, draft run 3 | 67 | $0.030220 |

The provider's prompt cache billed part of the prompt at a lower rate in 207 of the 316 calls of pilot e and the run, because the pilots had sent the same prompts minutes earlier. A first search gets no such discount, so the figure to plan with is the median of the calls with no cached tokens:

| Per call, median | Today's prompt | First draft (first run) | Second draft |
|---|---|---|---|
| Prompt tokens | 348.5 | 802.5 | 862.5 |
| Output tokens | 78 | 94 | 92 |
| Cost with no cached tokens | $0.000339 (63 calls) | $0.000698 (48 calls) | $0.000740 (78 calls) |
| Latency with no cached tokens, ms | 522 (63 calls) | 647 (48 calls) | 721.5 (78 calls) |

Today's prompt in the first run: $0.000339 and 609.5 ms (48 calls). The second draft costs about 2.2 times today's prompt per call and has 60 more prompt tokens than the first draft. Its median latency was about 200 ms above today's on this night. The first run measured a gap of 37.5 ms, so the latency gap is not a stable figure.

### Findings

**SR-1. FIX-1 worked: forced specific picks are nearly gone, and brand picks did not suffer.** Where the label has no specific category and the general pick was right, the model named a specific category in 3 of 15 calls on the 48 (12 of 15 in the first run) and in 0 of 12 held-out calls. The 3 are "pocket knife" (`outdoor/fishing_hunting`). "garden gloves", "bird feeder" and "baby monitor" now get the general category alone. Brand inputs matched the label on both levels in 72 of 72 calls and 18 of 18 held-out calls, so the stricter line did not strip right specific picks. "LEGO 10311" now gets `toys`.

**SR-2. PM-4 misses come from the general pick.** On the 48: "gift card" (`not_a_product/service` twice, `books_media/stationery_office` once) and "pocket knife". Held-out: "toilet paper" got `home/bedding_bath` in all 3 runs, a wrong specific pick under a general pick the label does not have.

**SR-3. FIX-2 holds the shape of the old fields and not their wording.** PM-5 passed on both sets: no `category` was "none" or a reserved id, and every product call had 2 online queries and 2 nearby searches (150 of 150). "kitchen" got `category` "kitchenware" and "asdfgh" got its queries in all 3 runs. The wording still moved:

| Same value for the same input, today vs draft run 1 | First run, 48 | Second run, 48 | Second run, held-out |
|---|---|---|---|
| `category` | 30 of 48 | 24 of 48 | 14 of 19 |
| `canonical_name` | 42 of 48 | 42 of 48 | 19 of 19 |
| Both nearby searches, same order (PM-6) | 23 of 48 | 28 of 48 | 8 of 19 |
| First nearby search | 30 of 48 | 33 of 48 | 13 of 19 |
| Online queries, same set | 24 of 48 | 29 of 48 | 14 of 19 |
| Similar products, same set | 3 of 48 | 12 of 48 | 1 of 19 |

**SR-4. No layout kept the nearby wording, so the list in the prompt is the likely cause.** Six layouts gave 22 to 28 of 48. Today's prompt against itself gave 45 of 48 (first run against pilot a, about two hours apart) and 42 of 48 (pilot a against the second run, six minutes apart). The second draft against itself gave 42 and 45 of 48 between runs. Writing the old fields first in the reply did not help. Some changes are a "store" and "shop" swap ("garden gloves": "hardware store" to "hardware shop"). Others take words from the list: "yoga mat" gives "fitness equipment store" (today "yoga gear store"), "work boots" gives "workwear store" (today "footwear store"), "Stihl MS 170" gives "garden power equipment store" (today "power tool store"). A separate model call for the two new fields would leave today's reply untouched. That design was not tested, and it adds a call.

**SR-5. FIX-3 did not work reliably.** Nonsense input got `not_a_product` in 4 of 12 calls: "zxcvbnm" 3 of 3, "asdfgh" 1 of 3, "???" 0 of 3, "ghjk 4477" 0 of 3. The rest got `none`. This is the held-out PM-2 failure: the 4 real non-products there got `not_a_product` in 12 of 12 calls. All five pilots read "asdfgh" as `not_a_product`, and the full run read it so once in three, so this pick is not stable.

**SR-6. "camping" changed to `outdoor` in all 3 runs.** The first run and pilots a, b and d read it as `not_a_product/activity`. Pilots c and e and the second run read it as a product. The lead-in of pilot e ("even when the input is not a product") is the only text that differs from pilot d. Small prompt edits flip single picks: across the six layouts "pocket knife" got `outdoor/fishing_hunting`, `tools_hardware/hand_tools` and `outdoor`, and "gift card" got `not_a_product/service`, `books_media/stationery_office` and `none`.

**SR-7. Repeat runs agree less than in the first run on the 48, and fully on the held-out set.** Three of the 48 changed between runs: "asdfgh", "gift card" and "yoga class" (the reason changed, `service` or `activity`). The general level alone was the same for 46 of 48. All 201 draft calls were answered by `google/gemma-4-31b-it` from the provider ModelRun, as in the first run.

**SR-8. Products with no category still rarely get "none".** 6 of 15 calls on the 48 (the same two inputs as in the first run) and 0 of 6 held-out calls ("toilet paper" and "trash bags" got `home`). "firewood" got `garden` and "eyeglasses" got `health_beauty`, both now with no specific category. No pass mark covers the general pick of this kind.

**SR-9. The reason for a non-product is less exact than the pick.** The reason matched the label in 20 of 25 calls on the 48 and 12 of 15 held-out calls. "bathroom remodel", "yoga class" and "guitar lessons" got `service`.

**SR-10. No reply was off the list.** All 201 draft replies passed the schema on the first attempt and every value was an id, `none` or `not_a_product`. No brand or model word was in `canonical_name` in any draft call (90 of 90 brand calls).

**SR-11. "???" gets empty fields from today's prompt too.** Today's prompt returned no similar products, no online queries and no nearby searches for "???". The second draft did the same in all 3 runs. This is the only input with an empty field in the second run. The schema accepts empty lists.

### Hand labels that look wrong (second run)

The grades use every label as written. No label was edited after a model call.

| Input | Label | Model | Comment |
|---|---|---|---|
| ghjk 4477 | `not_a_product/unclear` | `none` | The input looks like a model number, so "a product with no category" is defensible. With that reading the held-out PM-2 figure would be 15 of 18 |
| toilet paper, trash bags | `none` | `home` | `home` is defensible for both. The specific `bedding_bath` for toilet paper is not |
| guitar lessons | `not_a_product/activity` | `not_a_product/service` | Either reason is defensible |
| gift card, eyeglasses, sewing machine | as in the first run | | The comments of the first run still apply |

### Limits of the second run

- The limits of the first run apply: one model, one provider, one night, inputs written by an agent, three runs per input.
- The held-out set is small. One input is 3 of 18 or 21 calls, so one input moves PM-1, PM-2 or PM-4 by 14 to 17 points and PM-6 by 5 points. The held-out labels were written by the agent that revised the prompt.
- PM-4 passed on the 48 at exactly 80%, on the probes the prompt was tuned on. The held-out figure (83.3%) rests on 6 inputs.
- Each pilot is one run of 48 inputs. A gap of 2 or 3 inputs between pilots is inside the repeat-run noise (3 to 6 of 48 for nearby wording).
- The pilots warmed the provider's prompt cache, so the cost and latency tables mix cached and uncached calls. The planning figures use only calls with no cached tokens, which are not a random sample of the probes.
- PM-6 compares wording as text. This run cannot say whether the changed nearby searches find better or worse shops; that needs Brave calls.
- The two-call design named in SR-4 is a guess about a remedy. No call tested it.

## Files

| File | What |
|---|---|
| `run-picks.ts` | Makes the calls and writes the run's raw file after every call |
| `grade.ts` | Grades a raw file and writes its results file |
| `lib.ts` | Draft prompts (first draft and pilots a to e), draft schemas, mapping rules, shared types |
| `raw.json` | First run. Every reply as OpenRouter returned it (content, usage, cost, model, provider), with start time and latency |
| `results.json` | First run. All its figures, plus the pick for every input and run |
| `held-out.json` | The 19 held-out probes and their labels, committed before the second run |
| `raw-2.json`, `results-2.json` | Second run: both probe sets, graded apart under `sets.tuned` and `sets.held_out` |
| `raw-2-pilot.json` and `raw-2-pilot-b.json` to `-e.json`, with their `results-` files | The five pilots on the 48 probes. Pilot a also holds the run of today's prompt that pilots b to e are compared with |

Rerun the second run with `RUN=2` in front of both commands in "Rerun". A pilot uses `RUN=2-pilot` or `RUN=2-pilot-b` to `-e`, with `DRAFT_ONLY=1 ROUNDS=1` for b to e.
