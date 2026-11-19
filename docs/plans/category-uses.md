# Plan: uses for product categories
Status: draft for owner discussion

Written 2026-11-18. No code changed. No search, Brave or model call was made. Companion to `docs/plans/dynamic-categorization.md` (the memo). The next agent builds the category list from the section "What the list must carry".

Terms: the **pick** is the general and specific category that the normalize model chooses from the fixed list. A **show** is advice, a note or a place that appears because of the pick. A line that only states the pick itself (IDEA-10) is not a show. Every wrong-pick risk below is a guess: the repo holds no measurement of how often the model picks wrong.

## Top ideas, in build order

| Idea | What changes | Level | Needs the rule change | Size |
|---|---|---|---|---|
| IDEA-1, local store types from the list | Code builds the two nearby searches from the store types of the pick. The model stops writing them | Both | No | M |
| IDEA-11, the pick as a tested output | The eval checks the pick for each test product and reports quality per general category | General | No | S |
| IDEA-10, show the reading | The results page says how the site read the product ("Read as: laptop, in computers") | Both | No | S |
| IDEA-2, "Before you buy" on the pick | An idea can show for a brand or model name ("DeWalt DCD771"), where today it shows nothing | Specific | Yes | M |
| IDEA-3, category words in the "sells it" check | The 0.5 relevance tier and the shop-judging prompt read fixed words per category in place of drifting free text | Both | No | M |

Three findings shape the rest:

- Most uses need the general level plus a few flags. The specific level earns its place in three ideas only (IDEA-1, IDEA-2, IDEA-3), and only where a specific category differs from its parent. A full 10 to 20 specific categories under every general one is more than these uses need (CQ4).
- The hide-only rule is narrower than "the owner's signed rule" suggests. The owner signed the idea table and its match, exception and keep-out terms on 2026-11-18 (`data/before-you-buy.json`, `signed` block). The rule that a model's reading can only hide entered as a default that agents took without asking (`docs/plans/before-you-buy-v1.md:524`), and none of the owner's rulings OR-1 to OR-7 names it (`:485-491`). It covers "Before you buy" ideas and the thrift trigger. Search never followed it: the model's reading already writes every query (`proxy/src/pipeline.ts:108-113`) and already raises a score (`proxy/ranking/score.ts:85-87`).
- No show-use can be measured on the free-test budget (`handoff/2026-11-18-dynamic-categorization.md:9`). All 20 eval products are generic names, and the brand-input check (RT-4) was never run (`docs/plans/before-you-buy-v1.md:442`). IDEA-2 should not ship before CQ3 is answered.

## The proposed rule

Replace the hide-only rule. Do not remove it outright: its keep-out half carries the owner's safety ruling (OR-6).

Why replace it:

- Its two stated reasons were "no evidence" (`docs/plans/before-you-buy-v1.md:34`) and a free-text category with 27 wordings for 20 products (`:124`). A fixed list removes the second reason. The first reason stays, and RULE-6 and CQ3 answer it.
- It blocks the site's first aim, "buy used or buy less" (`docs/goals.md:14`), for every input the word table misses. The walk-through counted 16 wrong hides in 118 products, brand and model names among them (`docs/plans/before-you-buy-v1.md:150`).
- It treats one feature more strictly than search itself, which the model already steers.

The replacement, "keep-out first, then a bounded show":

- RULE-1. Keep-out words stay in code and run first, over the typed product and the model's fields (`src/ideas.ts:57-58`). A pick can add a hide (FLD-8). A pick never lifts one. The owner's safety ruling OR-6 stands (`docs/plans/before-you-buy-v1.md:490`).
- RULE-2. A pick may choose which searches run and how they are worded.
- RULE-3. A pick may show general content: an owner-signed sentence about a kind of place or a kind of product, at the level "In general" (`docs/goals.md:64`). A pick never shows a statement about a named shop.
- RULE-4. A pick adds no new score effect. Today the model's category already feeds the 0.5 relevance tier (`proxy/ranking/score.ts:87`) and the shop-judging prompt (`proxy/src/prompts.ts:27`). The pick may take the free-text category's place in both, inside the same tiers. No new tier, weight, score part, checked fact or drop rule comes from the pick. This follows the rule that an In general item never changes a score (`docs/goals.md:67`).
- RULE-5. A pick never stops a search. "None of these" and any reply that is not on the list run the search as it runs today.
- RULE-6. Where a pick showed something, the page says how the product was read (IDEA-10), so a shopper can see a wrong reading.
- RULE-7. A show needs the specific level, or a general category that the list marks safe as a whole. A parent category alone is a weak reason: 115 open-map rows matched only a parent category and 1 of them sold the product (`docs/STATUS.md:38`).

The rule against four hard cases:

| Case | What happens under the rule |
|---|---|
| CASE-1, a wrong pick is cached for 30 days (`proxy/src/normalize-cache.ts:8`) | The harm is wrong nearby searches or one wrong general sentence, visible through RULE-6. Wrong searches can be cached for 30 days today too. The only repair today is to drop every reading (`normalize-cache.ts:10`); a per-product repair is not built |
| CASE-2, keep-out goods (helmet, car seat) | RULE-1: code hides first, whatever the pick says |
| CASE-3, "none of these" | RULE-5: the search runs as today and no show appears |
| CASE-4, a pick that would add a score effect | RULE-4: not allowed. IDEA-9 is rejected on this ground. IDEA-3 stays inside today's tiers, where a wrong category already costs a shop the 0.5 tier |

## The full idea list

Columns: "Rule" says whether the idea needs the replacement rule. "Risk" is what a wrong pick does.

### A. Search results

| Idea | What it changes | Level | Data per category | Risk | Rule | Size |
|---|---|---|---|---|---|---|
| IDEA-1, local store types | Code builds the two nearby searches from a table, in place of the model's `local_queries` (`proxy/prompts/normalize.ts:15`). Similar products send the same searches, and a prompt edit no longer rewords them. Wording is likely the main cause of run-to-run change (`docs/quality.md:65`), and 57 missed nearby shops were never returned by the site's searches (`docs/quality.md:121`). Whether table store types return more of them is a guess. It uses the same two place calls. A reading with no `local_queries` is not cached today (`proxy/src/pipeline.ts:311`), so that check must move to the built searches | Both: the general level gives the default, a specific category overrides it | Two store types per general category (specialist, broader), each ending in "store". An override on a specific category only where its shops differ ("running shoe store") | The whole nearby section points at the wrong kind of shop for 30 days. The same risk exists today with free wording | No | M |
| IDEA-2, "Before you buy" matching | The browser shows borrow, repair and used ideas from the pick, after the keep-out words and beside the typed-word rows (`src/ideas.ts:59-66`). The Worker passes the pick in the response. It fixes brand and model inputs only if the model reads them right, which is unmeasured | Specific. General only where the list marks every child safe | Per specific category: borrow kind, repair kind, used kind (the seven kinds in `data/before-you-buy.json`) or none; a `no_used` flag | A wrong idea shows ("buy used" on a product where used is bad advice). RULE-1 covers the listed keep-out goods only | Yes | M |
| IDEA-3, "sells it" check | (a) The 0.5 tier matches a listing against fixed words per category, not the free-text label (`proxy/ranking/score.ts:87`). (b) The shop-judging prompt receives the pick's names and store types (`proxy/src/prompts.ts:27`). The measured noise is shops whose main line is a different category (`docs/quality.md:110`). A model-read store-type label missed its bar before (`docs/quality.md:105`), so test first. Free test for (a): rescore the saved graded responses with the new words and count good and bad shops that move | Both | Match words per general and specific category; store types (shared with IDEA-1) | A wrong pick sends wrong words, so good shops fall from 0.5 to 0.2 and the judge is told the wrong shop kind | No (stays inside today's tiers, RULE-4) | M |
| IDEA-4, non-product inputs | The list has a "not a product" value with a reason (service, meal, place to stay, unclear). Step one: the page shows a note and the search still runs. Step two, by the owner's choice (CQ2): skip the Brave calls and offer "search anyway". Today nothing refuses such an input (memo, `docs/plans/dynamic-categorization.md:69`). How often shoppers type one is unknown | Neither: a reserved value beside the list | The reserved values and one note per reason | A real product gets a wrong note. If step two is built, a real product gets no results until the shopper asks again | Yes (a note is a show). Step two also breaks RULE-5 unless "search anyway" exists | S, then M |
| IDEA-5, wrong-shop filter | Per category, place types that never sell it, beyond the two types dropped for every search (`proxy/src/brave.ts:83`). A hard drop on the pick alone breaks RULE-4, so it ships as a hint to the shop-judging prompt, or not at all. Free test: count graded good and bad nearby rows by place type per eval category | General | Place types to treat as "unlikely" per general category | As a hint: the judge drops more good shops. As a hard drop: good shops vanish with no trace for the shopper | No as a hint. A hard drop needs an owner exception to RULE-4 | M |
| IDEA-6, thrift and used places | A search whose pick has a used kind adds one place search for that kind of place and shows named places apart from the ranked shops. It takes the one spare Brave call (typical search 4, cap 5 by truncation, `proxy/src/pipeline.ts:318`). It waits on the gate for naming a place (`docs/plans/before-you-buy-v1.md:365`) | Specific | The used kind (shared with IDEA-2) and one place query per kind | A thrift block on a product thrift stores do not carry, and one paid call spent | Yes | L |
| IDEA-7, online query templates | Code builds online queries from `canonical_name` and a template per category. Little room: online precision is 98.4% (`docs/quality.md:99`). Online misses come from what two queries return (`docs/quality.md:123`), and a template cannot be tested without paid calls | General | One or two templates per general category | Low: the product name still leads the query | No | S |
| IDEA-8, lists that apply | Certifications are found by shop website, not by product (`proxy/src/enrich.ts:50-52`), so the pick changes no lookup. Two uses remain: a general line naming the labels that matter for the category, and a per-category list of trade-association directories to guide data work (the site holds 3 membership rows, `docs/plans/before-you-buy-v1.md:301`) | General | Label kinds that apply; association directories, each with a source | A label line on a product it does not apply to | Yes for the line. No for the data work | S |
| IDEA-9, ranking by category | Per-category weights or a per-category nearby radius (10 or 30 miles today, `proxy/src/pipeline.ts:32-34`). Rejected: it lets a model reading change a score (RULE-4), and no evidence in the repo supports any per-category value | General | None | A wrong pick reorders every shop | Rejected | M |

### B. Other site features

| Idea | What it changes | Level | Data per category | Risk | Rule | Size |
|---|---|---|---|---|---|---|
| IDEA-10, show the reading | One line on the results page with the pick's display names. The page does not show the model's category today: the only match for "category" in `src/render.ts` and `src/main.ts` is the relevance wording "Category named in listing" (`src/render.ts:109`). The exact placement needs a check against the page's patterns before build | Both | A display name per category | The line shows the wrong pick, which is its purpose | No | S |
| IDEA-11, evals and reporting | `eval/queries.json` already tags its 20 products with 8 categories. Add the expected pick per product and for about 30 hand-written probes (brands, models, non-products, keep-out goods). Report the pick's agreement with the expected value and its agreement between runs. Report precision per general category, with the limit that each category holds 2 or 3 products | General for reports; both for the pick check | An eval tag; two or three example products per category | None for shoppers. A report by category misleads if read past its sample size | No | S |
| IDEA-12, caching | The whole prompt is in the cache key (`proxy/src/normalize-cache.ts:17`). Put only category names in the prompt and keep store types, flags and words in a data file. Then a data edit ships without dropping the cache. Later: with IDEA-1 the nearby searches become a small fixed set of phrases, which a place-search cache could share across products. That cache is ruled out for now (`docs/STATUS.md:117`) and no cache is a money decision at this size (`docs/scale-feasibility.md:8`) | Both | A stable id per category, kept when a name changes | A renamed category in the prompt drops every reading once | No | S for the split; L for a place cache |
| IDEA-13, About page | Publish the list and what each category triggers (store types, ideas), and correct the line that describes the model's reading (`about.html:55`) and the relevance line (`about.html:35`). Serves G3 | Both | The data file itself | None | No | S |
| IDEA-14, cost | Two small effects. IDEA-4 step two saves the Brave calls of a non-product search (4 calls, $0.020 at list price, `docs/costs.md:31`). IDEA-1 removes `local_queries` from the model's reply; a normalize call costs about $0.0003 (`docs/costs.md:27`), so the saving is negligible and the longer prompt may cancel it | Neither | None | See IDEA-4 | See IDEA-4 | S |

Full order: IDEA-1, IDEA-11, IDEA-10, IDEA-2, IDEA-3, IDEA-4 (step one), IDEA-12 (the split), IDEA-13, IDEA-8, IDEA-5, IDEA-6, IDEA-7, IDEA-14. IDEA-9 is rejected.

Why this order: IDEA-1 is what the list is for and needs no rule change. IDEA-11 and IDEA-10 make wrong picks visible, to the owner and to the shopper, before any show depends on a pick. IDEA-2 serves the first aim and is the reason to change the rule. IDEA-3 has a free test on saved graded data. The reserved values of IDEA-4 and the data split of IDEA-12 belong in the first version of the list at almost no cost.

## Objections

| Objection | Strength | What it does to the ideas |
|---|---|---|
| OBJ-1. A fixed list does worse than today for nearby searches. The model writes a specialist store type for any product today (`proxy/prompts/normalize.ts:15`). A table row is coarser, and a product outside the list has no row | Strong for IDEA-1 | IDEA-1 survives only with specific overrides and a fallback for "none of these" (CQ5). It needs the free comparison in "First tests" before build |
| OBJ-2. A longer prompt on every uncached search. The normalize prompt is 348 to 351 tokens today (`docs/costs.md:27`). A list of 150 to 300 names would be several times that; no count was made. Money is not the issue at $0.0003 a call. Time is unmeasured, and how often a search misses the cache is unknown (`docs/STATUS.md:95`) | Medium | Argues for a short list: general names always, specific names only where a use needs them (CQ4) |
| OBJ-3. Wrong picks by a small model. Normalize runs on Gemma (`google/gemma-4-31b-it`, `proxy/src/llm.ts:5`). The last fixed-value judgment asked of this setup agreed with a grader 76% of the time (`docs/quality.md:104`); that task judged shops from thin listings, so it is not a forecast for product names. The model is not held to a value list: the schema sent to it carries structure only (`proxy/src/validate.ts:31-43`, `proxy/src/llm.ts:12-15`). Today's schema has no value list. If the full schema lists the values, an off-list reply fails validation, and a second failure fails the search (`proxy/src/llm.ts:82-86`) | Strong for every show-use | The schema must accept any string for the pick, and code must map an off-list value to "none of these". IDEA-2, IDEA-4 and IDEA-6 wait for a measured pick accuracy (CQ3). IDEA-1 and IDEA-3 are exposed too, with a milder failure |
| OBJ-4. A prompt change drops the cache and rewords the queries. The last fresh cache changed the wording of 18 of 20 searches (`docs/quality.md:86`), and the eval needs a new starting point | Strong, one time | IDEA-1 removes nearby wording from the model, so later prompt edits stop rewording nearby searches. Online wording still changes. IDEA-12 keeps list data out of the prompt. Plan one prompt change, not several |
| OBJ-5. `canonical_name` may already be the specific level. It equaled the typed product in 1,101 of 1,101 saved responses (`docs/plans/before-you-buy-v1.md:34`), all generic inputs. Its behavior on brands is unknown | Medium | It is free text, so code needs a word table to branch on it; that table is today's `data/before-you-buy.json`. If the model strips brands well, a word table over `canonical_name` gives IDEA-2 with no list (the memo's CAT-B). The same paid check answers both (CQ3). IDEA-1 needs a closed list either way, because code cannot look up store types by free text |
| OBJ-6. A shop-based list forces one branch on products that several kinds of shop sell (a wool blanket: bedding, camping) | Medium for IDEA-1 | The second store type of IDEA-1 partly covers it. A second branch per product is the memo's Q8, still open |
| OBJ-7. Upkeep. Every flag in every row is a judgment that one person keeps (G4, `docs/goals.md:71`). The thrift critique found the same of its keep-out list (`docs/plans/thrift-store-pilot.md:297`) | Strong for IDEA-2, IDEA-5, IDEA-8 | Flags default to "nothing shows". A row gets a flag only when the owner signs it, as with the idea table today |
| OBJ-8. Two specs turned a model-picked group down (`docs/plans/thrift-store-pilot.md:46`, `:293`; `docs/plans/before-you-buy-v1.md:384`). Their reasons: every product is read again once, and the model would make the keep-out call | Answered in part | RULE-1 keeps the keep-out call in code. The one-time re-read stands (OBJ-4) |

Survivors: IDEA-10, IDEA-11, IDEA-12 and IDEA-13 pass every objection. IDEA-1 and IDEA-3 pass if their free tests show no loss. IDEA-2 passes OBJ-8 and waits on OBJ-3 and OBJ-5. IDEA-4 step one passes; step two waits on OBJ-3. IDEA-5, IDEA-6, IDEA-7 and IDEA-8 do not have enough evidence to schedule.

## What the list must carry

For the agent that builds the list. Only names and ids go into the prompt (FLD-1, FLD-2, FLD-9); everything else stays in a data file that code reads.

| Field | On | Used by | Note |
|---|---|---|---|
| FLD-1, stable id | Every category | All | Never changes when a display name changes |
| FLD-2, display name | Every category | IDEA-10, IDEA-13, the prompt | Plain words a shopper would recognize |
| FLD-3, parent | Specific | All | One parent only, unless the owner rules for two branches (memo Q8) |
| FLD-4, store types | General; optional override on specific | IDEA-1, IDEA-3, IDEA-12 | Two phrases ending in "store": the specialist type, then the broader one. No product name, no place name (the rules at `proxy/prompts/normalize.ts:15`) |
| FLD-5, match words | General and specific | IDEA-3 | Short words a shop listing would contain ("laptop", "computer"). Three places read today's free-text category as text: `proxy/ranking/score.ts:87`, `src/ideas.ts:58`, `proxy/src/prompts.ts:27`. A label such as "electronics/computers" matches no listing, so these words replace it there |
| FLD-6, idea kinds | Specific; general only where every child agrees | IDEA-2, IDEA-6 | Borrow, repair and used, each a kind id from `data/before-you-buy.json` or none. Empty by default; owner-signed |
| FLD-7, safe as a whole | General | RULE-7 | True only when a show is right for every product in the category |
| FLD-8, `no_used` | Specific | RULE-1, IDEA-2 | A hide that the pick can add. It does not replace the keep-out words |
| FLD-9, reserved values | Beside the list | IDEA-4, RULE-5 | "None of these", and "not a product" with a reason: service, meal, place to stay, unclear |
| FLD-10, examples | Every category | IDEA-11, the prompt if examples help | Two or three products, one a brand or model name where one exists |
| FLD-11, eval tag | General | IDEA-11 | Maps to the 8 categories in `eval/queries.json` |
| Later, only if their ideas are scheduled | General | IDEA-5, IDEA-7, IDEA-8 | Unlikely place types, online templates, labels and association directories with sources |

Three constraints on the list's shape:

- A specific category exists only where it differs from its parent in FLD-4, FLD-5, FLD-6 or FLD-8. A product with no such row gets the general category alone.
- The reply schema accepts any string for the pick. Code maps an unknown value to "none of these" (OBJ-3).
- The old `category` field stays in the response until the three text readers move to FLD-5, so the Worker and the site can deploy in either order.

## First tests, all free

- TEST-1 (IDEA-1). Map the 20 eval products to the draft list by hand. Compare the list's store types with the nearby wording in the saved responses and with the kinds of the 86 graded baseline shops. Count baseline shops whose kind the list names and today's wording does not, and the reverse. The baseline rows carry a name and a website and no shop kind (`docs/evidence/quality/eval20-0925/grades.json`), so the kind is a hand label.
- TEST-2 (IDEA-3). Rescore the saved graded responses with FLD-5 words in place of the free-text category. Count good and bad shops that change tier. Check first that the saved responses hold the text the rule reads: a nearby row's title is its name (`proxy/src/brave.ts:101`), and an online row's page title may not be in the response. An earlier offline replay did not carry over to live results (`docs/quality.md:51`), so treat the result as a screen.
- TEST-3 (IDEA-2). Run the 118 walk-through products through the list by hand: which of the 16 wrong hides would a right pick fix, and which unsafe shows would a wrong pick cause.

None of these measures the model's picks. That needs CQ3.

## Open questions for the owner

- CQ1. Do you accept the replacement rule (RULE-1 to RULE-7)? The alternative is to keep hide-only, which leaves IDEA-1, IDEA-3, IDEA-10, IDEA-11, IDEA-12 and IDEA-13 buildable and drops IDEA-2, IDEA-4 and IDEA-6.
- CQ2. For a non-product input: a note and the search still runs, or no search and a "search anyway" button? The second saves Brave calls and adds a request field.
- CQ3. Will you approve model calls to measure the pick before any show-use ships? The memo's Q7 asks for about 90 normalize calls for 30 brand, model and non-product inputs. It also needs a pass mark, set before the run. The free-test budget cannot answer this.
- CQ4. May the specific level be sparse (only where a category differs from its parent), in place of 10 to 20 under every general category?
- CQ5. When the pick is "none of these", which nearby searches run: the model's own two (the prompt keeps asking for them), or one code default? The first keeps today's behavior as the fallback and costs output tokens on every uncached search.
- CQ6. One branch per product, or two for products that two kinds of shop sell (memo Q8)? Two branches give IDEA-1 one store type from each.
- CQ7. Is the "Read as" line wanted on the results page (IDEA-10)? RULE-6 depends on it.
- CQ8. Should the Fair Trade credit apply only in categories where the label exists? Today a shop's certification counts for any product (`proxy/src/enrich.ts:50-52`). This would change scores, so it is a question, not a proposal.

## Owner rulings, 2026-11-18

- CQ1: accepted. The replacement rule (RULE-1 to RULE-7) replaces hide-only.
- CQ2: a non-product input gets a note, and the search still runs.
- CQ3: yes. Model calls measure the pick before any show-use ships. Pass marks, set before the run: for brand and model inputs, the general pick matches the hand label at least 90% of the time; non-products get "not a product" at least 80% of the time; the same input gets the same pick in at least 90% of three runs.
- CQ4: yes, the specific level is sparse (also `docs/plans/category-list.md` LQ1).
- CQ5: when the pick is "none of these", the model's own two nearby searches run, as today.
- CQ6: one pick per product until the model tests show how often a product fits two.
- CQ7: yes, with the wording "We looked for: <product>" in place of "Read as".
- CQ8: no. A certification counts for any product, as today.
- In `docs/plans/category-list.md`: LQ7 (paid calls) yes; LQ8 (who signs the 32 proposed entries): the owner, after review.
