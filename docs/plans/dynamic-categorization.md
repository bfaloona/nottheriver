# Plan: dynamic categorization of search terms
Status: draft for owner discussion

Written 2026-11-18. No code changed. No search, Brave or model call was made for this memo.

## Short answer

The blocking first model call already exists. It is the normalize step. Do not add a second call, and do not switch to Haiku on the strength of this memo: the repo holds no Haiku measurement.

The new part of the idea is a fixed list of product groups, with more than one group per product, ordered broad to narrow ("macbook": computer, laptop). That is worth testing, in two steps:

- Free: write a draft group list and run it in code over the saved responses. Count the misses.
- Paid, small, needs a yes: send about 30 brand, model and non-product inputs through normalize and read what comes back.

Add a group field to the normalize reply only when a named feature needs it and the free check shows that code alone misses too often. Two specs already rejected a model-picked group (`docs/plans/thrift-store-pilot.md:46`, `docs/plans/before-you-buy-v1.md:340`). The thrift spec names it as the route back if its word list misses too often (`docs/plans/thrift-store-pilot.md:200`).

## What exists today

| Fact | Where |
|---|---|
| Normalize runs first and every other call waits for it | `proxy/src/pipeline.ts:321-324` |
| It returns `category`, `canonical_name`, `similar_products`, `online_queries`, `local_queries` | `proxy/prompts/normalize.ts:11-15`, `proxy/schemas/normalize.json:4` |
| The model is Gemma through OpenRouter (`google/gemma-4-31b-it`, fallback `gemma-4-26b-a4b-it`), not Haiku. `proxy/wrangler.jsonc` sets no model | `proxy/src/llm.ts:5` |
| The reply is cached per product text for 30 days. The prompt and the model list are part of the cache key | `proxy/src/normalize-cache.ts:8`, `:16-17` |
| `category` is free text, one string, 60 characters at most | `proxy/schemas/normalize.json:6` |
| The model writes the search queries itself. No code builds a query from `category` | `proxy/prompts/normalize.ts:14-15`, `proxy/src/pipeline.ts:108-113` |
| Brave receives the query text and the location, nothing else | `proxy/src/brave.ts:157`, `:173` |

`category` has four uses today:

- The enrich prompt receives it with the product name (`proxy/src/prompts.ts:27`).
- A result whose text contains it gets relevance 0.5 (`proxy/ranking/score.ts:87`, `docs/ranking.md:38`).
- The response carries it to the browser (`proxy/src/pipeline.ts:272`).
- "Before you buy" reads it for keep-out words only. A model reading can hide an idea and can never show one (`src/ideas.ts:54-58`).

So the owner's idea is half built. The call blocks, it reads the product, and its output shapes every search. The missing half is a category that code can branch on.

### Why today's category cannot steer anything

- It drifts. The category changed between runs on 4 of 20 searches, and some values are not shop types ("pantry staples") (`docs/plans/search-variation.md:24`). 20 products drew 27 category wordings in the saved responses (`docs/plans/before-you-buy-v1.md:124`).
- The cache hides the drift for 30 days per product. It does not make two similar products agree ("rain jacket" drew "outerwear", "wool socks" drew "clothing" and "apparel", `docs/plans/thrift-store-pilot.md:56`).
- It is one label at one level. `canonical_name` is the narrow level, `category` the broad one.

### The "macbook" example

The prompt already asks for a generic name without brands (`proxy/prompts/normalize.ts:12`). Whether the model does that for "macbook" is not known:

- All 20 eval products are generic names (`eval/queries.json`).
- `canonical_name` equaled the typed product in 1,101 of 1,101 saved responses (`docs/plans/before-you-buy-v1.md:34`).
- The check that would answer it (RT-4, about 30 brand, model and misspelled inputs) is listed and not run (`docs/plans/before-you-buy-v1.md:442`).

The one brand input tried so far missed: the "Before you buy" matcher shows nothing for "DeWalt DCD771" (`handoff/before-you-buy-spec/12-count-match-fields.out.txt:107`, matcher only, no model call).

A code table cannot know every brand and model name. Mapping "macbook" to "laptop" needs a model, and it is the strongest case for a model-picked group. Several labels per product is new. So is a fixed broad-to-narrow order.

"Several labels" has two meanings, and the owner picks (Q8). The owner's example is one branch of a tree, broad to narrow: computer, laptop. The other meaning is two unrelated groups for one product (a wool blanket as bedding and as camping gear). The first is simple to check. The second lets one search trigger two routes.

One caution on the broad level: in the open place check, 115 of 200 rows matched only a parent category, and 1 of them sold the product. The parent "hardware, home and garden store" admitted roofers and mattress stores (`docs/STATUS.md:38`). A broad label is safe for hiding and for wording. It is a weak reason to show a shop.

## What a fixed group list could steer

| Use | Today | With a group list | Evidence or guess |
|---|---|---|---|
| Local store types | The model writes 2 queries (`normalize.ts:15`) | A table gives each group its store types; the model picks the group | Raised and not chosen in `docs/plans/search-variation.md:17`, `:24` |
| Online query wording | The model writes 2 or 3 | Fixed templates per group | Guess: little gain. Online precision is already 98.4% (`docs/STATUS.md:3`) |
| Thrift and used routes | Word list, clothing only (`docs/plans/thrift-store-pilot.md:322`) | The group triggers the route | The owner's own example: "is_clothing==true" (`docs/goals.md:79`) |
| "Before you buy" | Hand-kept table in the browser, typed words only (`src/ideas.ts:59-66`) | Server-side group; brand inputs could match | Rejected for version one (`docs/plans/before-you-buy-v1.md:340`) |
| Which certification lists apply | Not checked for this memo | Skip lists that cannot apply | Guess; not measured |
| Non-products (a service, a meal, a room) | The request schema checks only the length of the product text (`proxy/schemas/search-request.json:7`); I found no other refusal. Single results are judged: restaurants are dropped (`proxy/src/brave.ts:83`) and the enrich prompt has a "service" type (`proxy/prompts/enrich.ts:21`) | A "not a product" label stops the search before Brave | Guess: saves Brave cost per such search. How often shoppers type one is unknown |

## Options

| Option | What changes | For | Against |
|---|---|---|---|
| CAT-A. No change | Nothing | No cost. Honors both spec rulings | Brand inputs and non-products stay untested. Each new feature writes its own word list |
| CAT-B. One group list, matched in code | A data file of groups. Code maps the typed product, `canonical_name` and `category` to zero or more groups. No prompt change | No model change, no cache drop, no added wait. Repeatable. One list replaces per-feature word lists | Misses whatever the words miss, brand names first. Someone keeps the word list. If the map reads the model's `category` to show something, it breaks the ruling that no row reads it (`docs/plans/before-you-buy-v1.md:124`, `:385`); see Q2 |
| CAT-C. Group field in the normalize reply | The prompt and schema gain `groups`: 1 to 3 values from a fixed list, broad first, plus "none of these" and "not a product" | Handles "macbook". One call, so no added serial wait | Changes the cache key, so every product is read and worded again once (18 of 20 searches changed wording after the last fresh cache, `docs/quality.md:86`). A wrong group stays cached 30 days. Extra reply fields cost time: removing `store_breadth` from the enrich reply cut output tokens 25.6% (14,206 to 10,576) (`docs/quality.md:108`) |
| CAT-D. A separate first call (Haiku) | A new call before normalize, or in its place | A stronger model may read brands better (guess) | A serial call adds its full wait. Normalize took 0.9 to 7.8 s in four timed searches (`docs/search-latency.md:34-40`, before throughput routing), against a median search of 2.9 and 3.3 s on 2026-09-29 (`docs/quality.md:95`). New model route and price. One model list serves both calls (`proxy/src/llm.ts:5`, `:72`), so a normalize-only model needs a code change. No Haiku data in the repo. Run in parallel, it cannot shape the queries |

Notes that apply to CAT-C and CAT-D:

- A fixed list removes the label drift. It does not remove query drift unless code builds the queries from the group. Query wording is what moved shops between runs (`docs/plans/search-variation.md:3`).
- On a miss ("none of these"), the search must run as it does today. A group may narrow or add; it must not block a real product.
- Both earlier specs objected that the model would make the keep-out call (`docs/plans/thrift-store-pilot.md:293`, `docs/plans/before-you-buy-v1.md:384`). Keep that rule: keep-out words stay in code and are checked first.

## Recommendation

- REC-1. Do CAT-B as a measurement, not a feature. It is free and shows how far code gets.
- REC-2. Run the brand-input check (RT-4) once. It answers the "macbook" question for both today's fields and a group field.
- REC-3. Go to CAT-C only if both hold: a named feature needs the group (the thrift route past clothing, or refusing non-products), and REC-1 or REC-2 shows the code map misses too often. Set the "too often" number before the run (Q3).
- REC-4. Drop CAT-D. Folding the field into normalize gives the same information without a second wait. A model swap is a separate question with its own A/B.

Upkeep, for any option: the group list is a file in git, owner-signed like the "Before you buy" table (`data/before-you-buy.json`, `signed` block). Start with the eight eval categories (`eval/README.md:17`) plus the groups in that table. A guess: 12 to 20 groups is enough to steer store types, and more is upkeep without a consumer.

## Open questions for the owner

- Q1. Which feature is the first consumer: the thrift route beyond clothing, local store types, refusing non-products, or brand inputs for "Before you buy"? Without one, CAT-A is the right answer.
- Q2. May a model reading show something (a thrift block, an idea), or only hide and reword? Today's signed rule is hide only (`src/ideas.ts:54-55`). The question covers CAT-C's group field and a CAT-B map that reads `category` or `canonical_name`.
- Q3. What miss rate for the code map sends the work to CAT-C? A proposal: more than 1 in 10 of the brand and model inputs.
- Q4. Is a one-time re-read of every cached product acceptable? It gives each product new search wording once, and the eval needs a new starting point (`docs/quality.md:86`).
- Q5. Should a non-product search be refused with a message, or run as today? The site has no such message yet.
- Q6. Is Haiku wanted for a reason this memo missed (quality on brand names, one provider, price)? If yes, that is a model A/B on normalize as it stands, before any new field.
- Q7. Are about 90 normalize calls approved for the brand-input check (30 inputs, three times each)? For scale: the earlier wording check, 6 normalize runs per search, cost $0.008 in model use (`docs/quality.md:69`).
- Q8. Does "several categories" mean one broad-to-narrow branch (computer, laptop), or also unrelated groups for one product?
- Q9. If CAT-C goes ahead, are the model calls and Brave calls for a local A/B on the 20 graded searches approved (EXP-6)? The count depends on the design chosen there.

## First experiment

Free, no approval needed:

- EXP-1. Write a draft group list (broad and narrow level) and a word map, in the scratch area, not in `data/`.
- EXP-2. Run it over the saved responses that `handoff/before-you-buy-spec/12-count-match-fields.py` reads (1,101 responses, 20 products).
- EXP-3. Report per product: groups matched, no match, and two unrelated groups matched. Report how many of the 27 category wordings map to a group.
- EXP-4. Extend the hand-written probe strings in Part 4 of that script (keep-out goods, one brand input today) to about 30: more brands and models, a service, a meal, a room. Report what the typed words alone match.

Needs Q7:

- EXP-5. Send the same 30 inputs through the unchanged normalize prompt, three times each. Record `category`, `canonical_name` and the queries. This shows whether "macbook" already comes back as "laptop", and how much the fields drift on brand inputs.

Only if CAT-C goes ahead (needs Q9):

- EXP-6. Add the field in a worktree and run the local A/B harness on the 20 graded searches, two rounds (`docs/evidence/latency-0927/README.md:22`). One limit: the new prompt can reword the queries, and the harness replays a Brave reply only for an identical request (`docs/evidence/latency-0927/stage-timing.ts:82`). So a plain A/B pays for new Brave calls and mixes wording churn with the field's effect. The cleaner design takes the queries from the control arm and only the groups from the new prompt; that needs a harness change.
- EXP-7. Compare: query wording changed or not (`eval/compare.mjs`), group agreement across rounds, graded good and bad shops shown, normalize output tokens and time.
- EXP-8. The 20 graded products are all generic, so they test "no harm". The 30 probes test the gain. Both run twice, per the two-run rule (`eval/README.md:36`). Nothing deploys before the owner reads the numbers.
