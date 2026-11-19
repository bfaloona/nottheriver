# Draft spec: thrift store pilot (G5, G3)

Status: DRAFT 2026-11-17. Written by agents in one design workflow. Not reviewed or approved by the owner. Nothing here is built.

Working files: `/Users/brandon/dev/ai/nottheriver/handoff/thrift-pilot-spec/` (two research files, four lens files, the working draft, an adversarial critique, a claim check, two counting scripts, saved web pages under `pages/`).

Goals named here: G5 is "Useful information without a data feed"; G3 is "What the site says can be checked", which `docs/goals.md:36` marks inferred. Paths are relative to `/Users/brandon/dev/ai/nottheriver`.

## 1. Answer

- **Recommended:** three steps, each waiting on the one before: (1) a hand check with no build; (2) one sentence on the results page for clothing searches, naming no store, with no change to the search Worker; (3) a block of up to 3 nearby thrift stores by miles, with no score, built only if step 1 finds something to list and the owner has set a pass mark.
- **Changed from the working draft,** which built the block first. The adversarial critique earned the change (section 8): the block spent a Worker change, a prompt change and the last spare search call on three names and one sentence.
- **Less than asked:** step 2 names no store, and no step says "this store likely carries it". No free source was found for the per-store description in G5 (size, main goods, donation or consignment, `docs/goals.md:79`).
- **Smallest first step:** no code, no paid calls. Hand-check the 5 nearest open-map thrift places per graded zip code (exists, is a thrift store, has a website, its page says what it carries), and write one mock block as text for the owner to read.
- **Biggest doubt:** a sentence, or a block of names and miles, might tell a shopper nothing a map app does not. Nothing measured today says otherwise.

## 2. Recommended approach, a sketch

Two claims stay apart throughout. KIND-CLAIM: what thrift stores carry in general, said once, level In general. STORE-CLAIM: what is known about one store. In this spec a store row carries its name, address, miles and its record line, and nothing about stock; "has the item" is said only as Unknown, once per block.

| Step | What | Shows a shopper | Worker change | Paid calls | Waits on |
|---|---|---|---|---|---|
| PH-1, the hand check | Hand-check open-map thrift places near the graded zip codes (RT-1); two counts over saved responses (done today, RT-8); draft the sentence with its source; one mock block as text | Nothing | None | None | The owner allowing no-build work now (TD-13) |
| PH-1b, the sentence | For a clothing search, one line: "Thrift stores usually carry clothing." and that stock is unknown | The KIND-CLAIM only; no store | None; the browser decides from fields the response already carries (`proxy/src/pipeline.ts:270-273`) | None | TD-1 (lifting the shelving), TD-5 (trigger words), TD-14 (the sentence's source), TD-16 (a map link or none) |
| PH-2 to PH-4, the block | Up to 3 nearby thrift stores from one more place search | Names, miles, each store's record line, the same sentence | Yes | PH-3 only | GATE-1 and GATE-2 below |

| Gate | Before | Passes when |
|---|---|---|
| GATE-1, is there something to list | PH-2 | The owner has read the PH-1 results and the mock block beside today's ranked row for the same store, and chosen to go on (TD-0). The numbers that would count as enough: TBD, the owner to fill. One earlier proposal for the same hand check: 8 in 10 exist and match, and at least 3 in 4 zip codes have 3 or more nearby (`docs/value-proposition/different-product.md:102`) |
| GATE-2, a bar set beforehand | PH-3 (paid) | The owner has set the G5 pass mark (TD-2) and the share of returned places that must be thrift stores, before any place is graded |

### Where the lenses disagreed

"Picked" is the final pick after the critique. A lens is one of four design agents (architecture, data, shopper, vision).

| Label | Disagreement | Sides | Picked |
|---|---|---|---|
| DIS-1 | Per-store description in the first version | The shopper lens's sketch shows "Carries", "Stocked by", "Size" lines; the architecture, data and vision lenses hold them back | Hold back. A saved thrift row carries the one-word snippet "shop" (`docs/evidence/latency-0927/runs/split-enrich-v2/main-r2/responses/wool-blanket-suburban.json:492-497`), and the search reads no store pages (`docs/caching-and-store-types.md:36`). Kept as ALT-4 |
| DIS-2 | Stores shown | 5 (architecture); 3 (shopper, vision, and ES5, the earlier "used and repair options first" strategy, `docs/ethics-data-strategies.md:178`) | 3; owner decision TD-9. 5 is kept as ALT-13 |
| DIS-3 | A "Likely a thrift store" line on each row, and what it rests on | The place came back for a fixed "thrift store" query (architecture); the model's reading of the name (data) | Neither: no line. The working draft picked the fixed query; the critique showed "likely" already means "likely sells it" on the same screen (`src/render.ts:107`), and that no one has graded what the query returns (CRIT-2 and CRIT-9, section 8). Where the list came from is said once in the block note, with no level word (departure DEP-7). Both sides are kept as ALT-14 |
| DIS-4 | Wording for gray products (a blender) | A second word, "sometimes" (data); the same "usually" sentence (shopper) | Gray groups do not trigger in the pilot: clothing only (TD-5). The second word is kept as ALT-15 |
| DIS-5 | A table of thrift operators (chains) with Checked facts such as "Nonprofit (IRS listing)" | In the first build (architecture, data); left out (vision) | Left out. The IRS file lists an organization at its headquarters address, and no match to a store was tested (research file 01, source SRC-A4). Kept as ALT-5 and research topic RT-5 |
| DIS-6 | Does a Checked item show its date on its face | No, keep rows short (shopper); the strongest level travels with a date (research file 02, pattern PAT-4; `docs/goals.md:49`) | Passed to the owner (TD-7). The pilot does not wait on it |
| DIS-7 | Block position, and whether it shows when empty | After the ranked nearby shops (shopper); first (ES5); position is a value statement nobody has recorded (vision) | After, and an empty block shows a note; owner decision TD-8 |
| DIS-8 | Search radius | "5 mi" as a stand-in (shopper); the existing nearby radius (architecture) | The existing radius: 10 miles, or 30 in zip codes outside metropolitan areas (`proxy/src/pipeline.ts:32-34`, `docs/STATUS.md:110`) |
| DIS-9 | How the trigger is decided | A new fixed `product_group` field from the normalize model (architecture, data); a word list in code (the critique, CRIT-8) | The word list. The prompt change would re-read every product once and touch searches that never trigger. Kept as ALT-18 |

### 2a. Data

| Label | Data | Source | Level | Step | Kept where |
|---|---|---|---|---|---|
| DATA-1 | The list of nearby thrift stores | One more place search with the fixed query "thrift store", through the place search the site already uses (`proxy/src/brave.ts:83-110`). What it returns has never been run or graded (UNV-1) | No level word. The block note says "Found by a map search for thrift stores" and "not checked" (DEP-7). Whether this may ever read "Likely" is TD-15, after PH-3's grades | PH-2 on | Not cached (`docs/caching-and-store-types.md:92`) |
| DATA-2 | Each store's name, address, miles | The same place result | Shown as given, no level word (TD-11) | PH-2 on | Not cached |
| DATA-3 | Each store's record: certifications, findings, chain badge | The site's own data files, joined by website with no model call, as the enrich step does for every candidate (`proxy/src/enrich.ts:127-133`) | Checked, as on any row; "People and planet: unknown" when there is none. Today no thrift-like name is in `data/chains.json`, `data/negatives.json` or `data/certifications.json` (searched today; a control word matched) | PH-2 on | Git |
| DATA-4 | Each store's size, main goods, donation or consignment | No free structured source found (research file 01, "Answer") | Not shown; would be Likely at best. PH-1 measures whether store pages say it | Not planned (ALT-4) | n/a |
| DATA-5 | The trigger list: words that bring the sentence or block in, and keep-out words checked first | A short word list in git. One group, clothing, from the owner's example at `docs/goals.md:79` ("is_clothing==true"). Matched against the typed product, the normalized name and the free-text category. In 1,101 saved responses the 20 test products drew these clothing categories: "outerwear" (rain jacket, 54 of 54), "clothing" and "apparel" (wool socks, 50 and 4), so the list needs all three words (script `handoff/thrift-pilot-spec/40-count-saved-thrift-rows.py`). Keep-out words: helmet and car seat (`docs/ethics-data-strategies.md:185`); socks, underwear and swimwear are an agent's judgment (TD-5) | None: a rule, not a statement | PH-1b on | Git; in the site for PH-1b, in the Worker for PH-2 |
| DATA-6 | The In general guide | One sentence, "Thrift stores usually carry clothing." Sources so far: the owner's example at `docs/goals.md:51`. Candidate outside sources: one Goodwill region's accepted-items page (file 01, SRC-B3), a trade group's page saying apparel leads secondhand sales (SRC-D5). Other regions' pages were seen as search snippets only, so whether one national sentence holds is not checked (RT-4) | In general | PH-1b on | Git, with source link and check date |
| DATA-7 | Whether a store has the item today | No source of any kind found (file 01, NF-2) | Unknown, said once | PH-1b on | n/a |

Code sets every level from a fixed list of bases; the model never does, and every phrase on screen is a fixed string, following "No model-authored text" (`docs/ranking.md:111`).

### 2b. Pipeline and architecture

**PH-1b, the sentence.** No step of the search changes. After the response arrives, the browser checks the trigger list against `query.product`, `query.canonical_name` and `query.category`, and on a match adds the note. A miss shows nothing. Search calls added: 0. Model calls added: 0. A change to the list or the sentence ships with a site push alone.

**PH-2 to PH-4, the block.** Changes against the ten steps in `docs/architecture.md`, "Request flow":

| Step | Change |
|---|---|
| 1 Normalize | None. No prompt, schema or cache change |
| Trigger (new, code only, after step 1) | Keep-out words first, then the clothing words, against the typed product, the normalized name and the category. No match means no block |
| 2 Fetch | On a match, one more place search ("thrift store") starts last, beside the others. Today every search call runs under one `Promise.all` and a failed call throws (`proxy/src/pipeline.ts:110-113`, `proxy/src/brave.ts:126-136`), so the thrift call is wrapped: a failed or refused call means no block, never a failed search. Its results are kept apart from the ordinary candidates |
| 3 Dedupe, 4 first Amazon filter | Thrift places pass the blocklist. The ordinary candidates are left as they are: a thrift store the ordinary search found stays in the ranked list and may also show in the block (DEP-8, TD-17) |
| 6 Enrich | No model call for thrift places. Their certifications, findings and chain badge are joined by website, the lookup at `proxy/src/enrich.ts:127-133` |
| 7 Drop, 8 Score | Skipped: no model verdict, no score, no rank |
| 9 Second Amazon filter | Runs over thrift places and over the sources of their badges and findings |
| 10 Respond | Inside the nearby radius, sorted by miles, one branch per website (the ranked list allows 2, `proxy/src/pipeline.ts:25`), capped at 3 |

| Label | Item | PH-1b | The block (PH-2 on) |
|---|---|---|---|
| COST-1 | Search calls | 0 | +1 when triggered: typical 5, maximum 6, the client's limit (`docs/costs.md:26`, `proxy/src/brave.ts:5`). About $0.005 more per triggered search, an estimate (`docs/ethics-data-strategies.md:182`) |
| COST-2 | Model calls | 0 | 0 |
| COST-3 | Time (G2) | None added | Not measured. The 4 parallel calls took 0.8 to 0.9 seconds together (`docs/search-latency.md:34-37`) |
| COST-4 | Response | No change | One optional section, `place_kinds`, with `kind`, `label`, `query`, a `guide` and `places`. A place has name, website, address, distance, coordinates, `certifications`, `signals` and `chain`, and the schema forbids `score` and `rank` on it. A guide entry is a fact: `{text, level, basis, source_url?, checked?}`; level Checked requires a source link and a check date. Today's response has no field for a fact that carries a level (`proxy/schemas/search-response.json`) |
| COST-5 | Caching | Nothing new | Nothing new. The word list ships with the Worker (`infra/deploy.sh`) |
| COST-6 | Ranked or not | n/a | Not ranked. In the scored list a nearby shop's match value comes from a model reading (`proxy/ranking/score.ts:61-73`); the block has no score to move |

A second kind of place (tool libraries) would add its own trigger words, sentence and fixed query to the same list. One limit: a search that fits two kinds needs a seventh call the client refuses.

| Phase | What | Paid calls | Deploy |
|---|---|---|---|
| PH-1 | No code. The RT-1 hand check; the sentence with its source; one mock block as text beside today's ranked row for the same store | None | None |
| PH-1b | Site only: the word list, the note, unit tests that run the list over saved responses (rain jacket matches, wool blanket does not, a bike helmet search does not; wool socks follows the owner's ruling on keep-out words, TD-5) | None | Site push |
| PH-2 | Offline Worker build: the trigger, the wrapped call, the records join, the response section, unit tests on saved fixtures. Tests the critique asked for: the thrift call failing; a thrift place whose website has a curated record; three branches of one website; a blocked place injected after the first filter (as `proxy/test/pipeline.test.ts:465` does) | None | None |
| PH-3 | Paid check, needs the owner's go-ahead (TD-10) and GATE-2: the extra place query for the 20 graded searches, each place hand-graded (`docs/ethics-data-strategies.md:186`), with counts of stores sharing a website; time added by the call | About 20 added place calls plus the timing harness's usual calls for those searches (lens 11, its phase PH-2) | None |
| PH-4 | Worker deploy, then site: render the block | | Worker first, then site |

### 2c. The certainty marks and the screen

The marks are words, extending a pattern already on screen ("Sells it: likely, by shop type", `src/render.ts:107`; "People and planet: unknown", `src/render.ts:216`). No new icon, color or type size. All strings below are proposals; none was shown to anyone.

| Mark | Word | Drawn as | Covers which claim | Used by the pilot |
|---|---|---|---|---|
| MK-1 Checked | The fact's own label | A link to a public source, usually in a box (today's badges, `src/styles.css:298`) | One store or company | Only when a thrift store has a record or chain badge. A chain badge is a sourced store count and says nothing about stock (`docs/ranking.md:103`) |
| MK-2 Likely | "likely", then its basis | Plain text in the row | One store | No. It stays where it is today, on "Sells it" in ranked rows |
| MK-3 In general | "usually", in a sentence about the kind of place | A note, never inside a store row | The kind of place | Yes, first use |
| MK-4 Unknown | "unknown" | Plain muted text (`src/styles.css:295`) | One store, or the block | Yes: stock today, and the record line |

Each mark's meaning sits in the text beside it, because a meaning kept behind a click did not fix misreading in the one controlled test the research opened (file 02, FAIL-2). No percentage is attached to "likely" (file 02, SUG-2). The help box "What unknown means" (`src/render.ts:306-316`) becomes "What these words mean", with one sentence per mark.

PH-1b, the sentence, as a note at the end of "Near you":

```
Thrift stores usually carry clothing. Whether one
near you has a rain jacket today: unknown.
```

The block (PH-4) replaces that note. It is a third group inside "Near you", after the ranked shops and before "Farther away":

```
Thrift stores near you
Thrift stores usually carry clothing. Whether any
of these has a rain jacket today: unknown.
Found by a map search for thrift stores, not
checked. Stores without a website are not listed.

A  Example Thrift Shop  [>]
   0.9 mi, 40 Example St
   People and planet: unknown
```

| Label | Case | PH-1b note | Block note | Store row |
|---|---|---|---|---|
| STR-1 | Fits: rain jacket (its saved category is "outerwear") | As above | As above | Name, miles, address, record line |
| STR-2 | Gray: blender | Nothing | Nothing: only clothing triggers (TD-5) | None |
| STR-3 | Must not trigger: bike helmet | Nothing, and no reason given. A reason on screen would be a safety claim the site cannot source | Nothing | None |
| STR-4 | Empty: rain jacket, no store found | Does not arise: no store search is made | "No thrift store with a website found within {n} mi. One may exist that this search missed." ({n} is the nearby radius, 10 or 30) | None |
| STR-5 | The thrift call failed | Does not arise | No block. The PH-1b sentence shows in its place, and the other results show as usual | None |

The product's name appears only in the unknown sentence. A thrift row never has a "Sells it" line and never the word "likely".

| Label | Departure from today's site | Pattern-consistent alternative |
|---|---|---|
| DEP-1 | A letter (A, B, C) in the rank column | Leave the column empty; map pins then have no label |
| DEP-2 | The store name is plain text, not the "why this rank" button (`src/render.ts:241-246`) | Keep the button; its panel says what each line rests on |
| DEP-3 | A square map pin (solid means near and hollow means farther today) | Leave thrift stores off the map in the pilot |
| DEP-4 | The help button is renamed and always shown | Add a second button beside it |
| DEP-5 | A group that shows a note when empty ("Farther away" hides, `src/render.ts:410`) | Hide it when empty |
| DEP-6 | MK-1 Checked has several shapes today (badge, chain badge, finding box, a bare source link), which strains "one visual mark used site-wide" (`docs/goals.md:45`) | Define the mark as "a link to a public source" and treat the box as dress; owner decision TD-7 |
| DEP-7 | "Found by a map search for thrift stores, not checked" carries none of the four level words, against "Every item shown carries one of four levels" (`docs/goals.md:45`) | Call it Likely once graded (TD-15), or Unknown ("Whether each is a thrift store: unknown") |
| DEP-8 | A store may show twice, once ranked and once in the block | Move it to the block only, which is a demotion (TD-17) |
| DEP-9 | If the owner picks a map link for PH-1b (TD-16): a new kind of outbound link, to a map service | No link |

## 3. How this does and does not satisfy the goals

| Goal line | Satisfies | Does not satisfy | Not touched | Basis |
|---|---|---|---|---|
| G3: Amazon never appears | Block: thrift places pass both blocklist passes | | PH-1b | Section 2b; not tested |
| G3: source and date on certifications and findings | Block: a thrift store's badges and findings carry theirs, as on any row | | PH-1b | The records join, section 2b |
| G3: no record says "unknown" | Block rows carry the same record line | | PH-1b | Section 2c |
| G3: zip stays in the browser | PH-1b with no link sends nothing new | A map link that carried a place would break it (TD-16). What the extra search in the block sends was not checked | | `docs/privacy.md:7`, `:10`; lens 14, GOAL-9 |
| G3 level: Checked | The mark is defined | Not reachable for stock. In the block it appears only if a thrift store has a record, and none does today | | DATA-3; file 01 "Answer" |
| G3 level: Likely | | Not used by the pilot at all. The existing "likely" sells-it reading still scores (TD-3) | | DIS-3; `proxy/ranking/score.ts:61-73` |
| G3 level: In general | First use, one sentence with a source | G3's title is "can be checked", and an In general line is by definition not checked for this store | | `docs/goals.md:51` |
| G3 level: Unknown | Stock today is stated as unknown | | | Section 2c |
| G3: one mark per level, site-wide | Words reuse the site's pattern | The pilot draws two of the four marks anew. Checked has several shapes today (DEP-6); the provenance line has no level (DEP-7); "Not confirmed" (`src/render.ts:109`) would need rewording, and "Maybe, by shop type" fits no level | | Lens 13, table EX |
| G3: Likely or In general never changes a score | The block has no score, and the ranked list is left as it is | | | COST-6, DEP-8 |
| G5 | A trigger rule; in the block, places no feed supplied | No per-store description at any step. PH-1b is a fixed sentence, which might not count as "information dynamically" (`docs/goals.md:79`). The one dynamic part of the block is one more place search | | Lens 14, AGAINST-1; critique CRIT-5 |
| G1 | Might help G1a, the ten-purchase log | Block rows add results with no checked fact (G1c) unless the owner rules them out of the count (TD-12) | G1b; G1d, since the ranked list is unchanged | Lens 14, GOAL-1 to GOAL-4 |
| G2 | PH-1b adds no time | Block: one more search call; time not measured | | COST-3 |
| G4 | PH-1b: a word list and a sentence in the site, no Worker deploy | Block: one more list to keep by hand, each edit a Worker deploy, and a triggered search uses the last spare call. If every search triggered, the free credit would cover about 200 searches against about 250 today (arithmetic from `docs/costs.md:33`) | | Lens 11, FIND-1 |
| V1, record first, size second | Block rows show their record where one exists | A thrift store enters for its kind, with no record, and stores without a website are left out | | `docs/goals.md:11`; critique CRIT-10 |
| V2, broader than Amazon | "Where to buy instead" now includes used | | | `docs/goals.md:12` |
| V3, the size of the project | PH-1 and PH-1b are sized for a site friends would use | The block asks for a Worker change and several rulings | | `docs/goals.md:13`; critique CRIT-13 |

**What the pilot can tell the owner about G5 beyond thrift stores.** PH-1 can tell whether free sources say anything about one thrift store, which is G5's open question. PH-1b can show the trigger rule and the In general mark working. The block can show an unscored group ordered by miles. None of it can show that a second kind is cheap: tool libraries would need their own trigger words, sentence, fixed query and hand check. The one tool-library map the research opened calls itself "work in progress and not a comprehensive resource" (https://www.toollibraryalliance.org/map), and whether a tool library shows up in the place search was not checked. The stock problem might differ for a lending place, which is not checked either.

## 4. Alternatives considered

| Label | Alternative | Argued by | Outcome and reason |
|---|---|---|---|
| ALT-0 | Much smaller: PH-1 only, then stop and decide | The critique (CRIT-5, CRIT-13) | It is the first step of the recommendation. Stopping there shows a shopper nothing |
| ALT-1 | The general sentence and a link to a map search, no store named | Vision lens, as a fallback; the critique (CRIT-6) | Picked, as PH-1b. The working draft turned it down because the candidate pass mark could not grade it; that mark is not set (`docs/goals.md:68`). The link is the owner's call (TD-16) |
| ALT-2 | One line under the results ("3 thrift stores within 2 mi: A, B, C") | Shopper lens | No room for a record line. A fair shape for the block if it feels heavy for what it says |
| ALT-3 | Swap one of the two nearby queries for the thrift query, adding no call | Architecture lens | Trades away ordinary nearby shops at a cost nobody measured. The fallback if the owner wants a spare call kept (TD-4) |
| ALT-4 | Larger, the Upcoming work row in full: size, main goods, donation or consignment per store | The request; shopper lens's sketch | Needs a page read per store during the search, which the Worker does not do; 14 to 16% of pages refuse a declared bot (`docs/quality.md:11`). Waits on RT-1 |
| ALT-5 | A hand-kept table of thrift operators with Checked facts | Architecture and data lenses | No tested way to tie a store to a public listing (DIS-5). Waits on the IRS matching test (RT-5) |
| ALT-6 | A prebuilt file of secondhand places from OpenStreetMap instead of a live search | Architecture lens, as a research topic | Coverage of thrift stores is unknown; the median edit was about 2.1 years old (`docs/open-place-coverage.md:54`). License: ODbL. Used for the PH-1 hand check only |
| ALT-7 | Thrift stores in the ranked list, with a badge | Weighed by three lenses | Needs a score, so a guess sets the order. It is what happens by accident today: arc Thrift Stores, nearby rank 6 or 7 for "wool blanket" depending on the run |
| ALT-8 | Larger: "likely has it" per store, or a reuse-first product (shape S3, "Reuse first, nearby") | The request's wording; `docs/value-proposition/different-product.md` | A stock claim with no source. S3 itself drops per-product judgments (`docs/value-proposition/different-product.md:94`) |
| ALT-9 | A keyword table over today's free-text category, no model field | Architecture lens (turned down there); the critique | Picked in a narrow form: one group, three category words (DATA-5). Its weak spot stands: 20 products drew 27 category wordings in saved responses, so a new wording is a silent miss |
| ALT-10 | One true/false per kind ("is_clothing") as the model's reply | The owner's example, `docs/goals.md:79` | Needs a prompt change (see ALT-18). Kept in spirit: the word list answers "is it clothing" |
| ALT-11 | A small icon per level, with a legend | Shopper lens | A new icon set to learn; revisit with the clickable prototype, whose building is put off |
| ALT-12 | The block first, above the ranked shops | ES5 | It puts places with unknown stock above shops with a sells-it reading, and is a value statement no file records the owner making (DIS-7) |
| ALT-13 | Show 5 stores | Architecture lens | ES5 and two lenses say 3. Owner decision TD-9 |
| ALT-14 | "Likely a thrift store" on each row, from the fixed query or from the model's reading of the name | Architecture and data lenses; the working draft | The word already means "likely sells it" on the same screen, and neither basis has been graded; an earlier model-read store-type field missed its bar (`docs/STATUS.md:120`). Revisit after PH-3 (TD-15) |
| ALT-15 | A second guide word, "sometimes", for gray groups | Data lens | A fifth shade beside four levels, against "(Obviously we don't want a bunch of levels!)" (`docs/goals.md:45`) |
| ALT-16 | The working draft's plan: build the block first, with a prompt change, "Likely a thrift store" on each row, and thrift stores moved out of the ranked list | The working draft | Not picked. It cost a Worker change, a prompt change and the last spare call before anyone had checked that there is something to say about a store (section 8, CRIT-5, CRIT-6, CRIT-13) |
| ALT-17 | A thrift store shown in the block only, removed from the ranked list | Architecture and shopper lenses | It moves a ranked shop below every ranked shop because of its kind (CRIT-4). Owner decision TD-17 |
| ALT-18 | A fixed `product_group` list the normalize model picks from | Architecture and data lenses | Every product is read again once, triggered or not; normalize took 0.9 to 7.8 seconds in four searches timed on 2026-09-27 (`docs/search-latency.md:3`, `:34-37`); and the group list would have the model make the keep-out call (CRIT-8). The route back if the word list misses too often |
| ALT-19 | A trigger list of many groups (housewares, books, furniture, tools) with keep-out words | Data lens, table TRIG | Every row but clothing, housewares, helmets and car seats is an agent's judgment, and a keep-out list lets through whatever it missed (CRIT-12). Add a group when it has a source (RT-4) |

## 5. Concerns and risks

"How likely" is the agents' judgment; no lens measured it.

| Label | Risk | How likely | What would show it early |
|---|---|---|---|
| RISK-1 | The sentence and the block tell nothing beyond a map app. The block shows less about a store than today's ranked row does (CRIT-1) | Likely | The owner reads the mock beside today's row in PH-1 |
| RISK-2 | The fixed query returns places that are not thrift stores (pawn shops, consignment boutiques, drop boxes), and no model judges them. The saved store-type hint for a thrift row is the one word "shop" | Not known | PH-3 hand grades against the bar set at GATE-2. A name rule is a weak fix: matching thrift-like names over saved responses hit `hardwarestore.com` 12 times on the letters "restore" (lens 11; recounted in the claim check) |
| RISK-3 | Stores with no website are dropped, because the blocklist needs a domain (`proxy/src/brave.ts:85-93`), which tilts the block toward larger operators | Likely for small shops | RT-1 counts stores without a site |
| RISK-4 | "Likely" follows two rules site-wide: the existing sells-it reading scores, and `docs/goals.md:54` says a Likely item never does | Present today | The owner's ruling (TD-3). The pilot no longer adds a second use |
| RISK-5 | The word list misses clothing searches whose category wording it has not seen, and lets in clothing better not bought used | Likely, small | The PH-1b unit tests over saved responses; the owner's read of the keep-out words (TD-5) |
| RISK-6 | A triggered search uses all 6 calls; ES4 (opt-in search for certified sellers) and the block together need 7 (`docs/ethics-data-strategies.md:185`) | Certain if both are built | The owner's ruling on the sixth call (TD-4) |
| RISK-7 | PH-1b's sentence alone gives a shopper nothing to act on, and a map link with no place in it might return little | Might | The owner tries the link by hand before choosing (TD-16); not checked today |
| RISK-8 | One national sentence is wrong for some regions or chains. One Goodwill region's page was read; others were seen as snippets only | Might | RT-4 |
| RISK-9 | The used-and-repair strategy was shelved on 2026-11-15 "before the record is shown to work" (`docs/STATUS.md:74`); G5 opened the same idea on 2026-11-17 (`docs/STATUS.md:127`) | Present today | The owner's ruling (TD-1) |
| RISK-10 | Closed or moved stores: 20 of 300 open place rows were gone or moved (`docs/open-place-precision.md:81`); not measured for thrift stores | Might | RT-1 |
| RISK-11 | A store shown twice (ranked and in the block) reads as a mistake | Might, rare: 3 thrift-like rows in 1,101 saved responses (script `40-count-saved-thrift-rows.py`) | The mock block |
| RISK-12 | "No thrift store found" read as "none exist"; an unranked row read as penalized or favored | Might | Not testable without readers (RT-7) |
| RISK-13 | A pass mark that counts correct "is a thrift store" labels can pass while grading neither usefulness nor stock. The working draft proposed one; it is withdrawn | Likely if such a mark is chosen | The owner's pass mark (TD-2) |
| RISK-14 | A boxed chain badge beside plain unchecked lines might lend them weight (CRIT-11) | Might | The mock block |
| RISK-15 | The spec outruns its place in the order of work: targets are still owed and the record book was deferred (`docs/goals.md:82`, `docs/STATUS.md:145`) | Present today | The owner's ruling (TD-13) |

## 6. Open research topics

| Label | Question | Why it matters | Cheapest way |
|---|---|---|---|
| RT-1 | Near the graded zip codes, do open-map thrift places exist, are they thrift stores, do they have a website, and does the page say what it carries | It is G5's question for thrift stores, and GATE-1. Sizes RISK-3 and RISK-10, and decides whether ALT-4 is worth building | Hand-check the 5 nearest per zip from OpenStreetMap tags; no search calls (the test at `docs/value-proposition/different-product.md:100-102`) |
| RT-2 | What does a "thrift store" place search return near those zip codes, and how many results share a website | DATA-1 rests on it | PH-3: about 20 paid place calls, hand-graded |
| RT-3 | How often does the word list fire on real clothing searches, and on searches it should not | The trigger | Unit tests over saved responses (PH-1b); the ten-purchase log |
| RT-4 | A source for the clothing sentence that holds across chains and regions, and for each keep-out word | DATA-5, DATA-6, RISK-8 | Read the CPSC resale page and guide (file 01, SRC-D1, SRC-D2) and three chains' pages |
| RT-5 | Can the IRS file tie a store to a nonprofit: which activity code marks thrift, and how many store names match | ALT-5, the only route found to a Checked fact about a thrift store | Open one state's file and try 10 known stores |
| RT-6 | Time added by a fifth parallel search call | G2 | Measured during PH-3 with the existing timing harness |
| RT-7 | Do readers tell "usually" (the kind) from a statement about one store | The marks | No user research exists (`docs/ethics-data-strategies.md:424`); whether to run any is TBD, the owner to fill |
| RT-8 | What saved responses already carry for thrift stores | What a block row can rest on | Partly done today, no calls: 3 thrift-like rows in 1,101 saved responses (arc Thrift Stores twice at nearby ranks 6 and 7, Habitat Denver ReStore once at rank 8), by a name list an agent wrote. The 28 resale rows (`docs/ethics-data-strategies.md:180`) were not recounted |
| RT-9 | Tool libraries: coverage, file access, whether a record says what is held, whether the place search finds any | G5 beyond thrift | The sources in file 01, SRC-C6 to SRC-C8 |
| RT-10 | Does the place search return a phone number or hours in fields the code does not read | Whether "call first" could ever be offered | Read one saved raw response, if one exists; not checked |
| RT-11 | Does any map service give useful results for a search with no place in it | TD-16 | The owner tries one link by hand |

## 7. Existing solutions and data feeds

The owner's rule (`docs/goals.md:79`): "We can't purchase data feeds."

"Read" means a research agent opened the page on 2026-11-17 (saved under `pages/`); "snippet" means a search summary only. IDs are those of research file 01.

| Source or product | Cost | What it gives | Used here | Status |
|---|---|---|---|---|
| SRC-A1, the place search in use (Brave) | Pay per call, already budgeted (`docs/costs.md:11`) | Name, address, coordinates, website | Yes, from PH-2 on: DATA-1 | Repo read |
| SRC-A2, OpenStreetMap secondhand and charity tags (https://wiki.openstreetmap.org/wiki/Tag:shop%3Dsecond_hand) | Free, ODbL | A type tag; US counts 4,795 and 4,206 (`docs/evidence/ethics-data/p3-datasets-certifications-and-small-shops.md:240`) | PH-1 hand check only (ALT-6) | Read |
| SRC-A3, Overture Maps Places (https://docs.overturemaps.org/guides/places/) | Free, open license | Point, name, address, website, category | No: its thrift category name was not found | Read |
| SRC-A4, IRS Exempt Organizations file (https://www.irs.gov/charities-non-profits/exempt-organizations-business-master-file-extract-eo-bmf) | Free | An organization's tax-exempt status, at its headquarters address | No: matching a store to an organization is untested (RT-5) | Page read, no file opened |
| SRC-A5, chain store locators (Goodwill, Habitat ReStore and others) | Free to view | Locations per chain | No | Goodwill locator not fetched (its robots.txt could not be read, status 403); ReStore read, finder untested |
| SRC-A6, AllThePlaces | Free, CC0 per snippet | Chain store points | No | Snippet |
| SRC-A7, NARTS member finder (https://www.narts.org/) | Free to search, likely | Member resale stores | No: directory not reached | Landing page read |
| SRC-A8, Census County Business Patterns | Free (from memory, not checked today) | Counts, no names | No | Via the NARTS page only |
| SRC-B1, OpenStreetMap tags on one object (same wiki page as SRC-A2) | Free, ODbL | Operator, website, opening hours; no size or consignment tag found | No | Read |
| SRC-B2, the store's own page read by a model | A new page fetch and model cost per store, not measured | Whatever the store says about itself; Likely at best | No: not done today. The model reads a title and snippet only (`proxy/src/enrich.ts:9-10`); see ALT-4 | Repo read |
| SRC-B3, a Goodwill region's accepted-items page (https://goodwillng.org/ways-to-support/donate-goods/items-we-do-and-dont-accept/) | Free | Accepted and refused categories for one region | Candidate source for DATA-6 | Read |
| SRC-B4, Habitat ReStores page (https://www.habitat.org/restores) | Free | What ReStores sell | Candidate source for DATA-6 | Read |
| SRC-D1, CPSC resale information (https://www.cpsc.gov/resale) | Free | Federal rules for resellers; nursery furniture | Candidate source for keep-out words | Read |
| SRC-D2, CPSC Reseller's Guide (https://www.cpsc.gov/s3fs-public/ResellersGuide_0.pdf) | Free | A screening guide for resellers | Candidate source for keep-out words | Snippet |
| SRC-D3, NARTS product safety page (https://www.narts.org/product-safety-in-resale) | Free | "Car seats should never be resold. Period." | Candidate source | Read |
| SRC-D4, NHTSA recalls (https://www.nhtsa.gov/recalls) | Free | Car seat recalls, linked by NARTS | No | Not opened |
| SRC-D5, NARTS State of Resale (https://www.narts.org/state-of-resale) | Free | Apparel leads secondhand sales | Candidate source | Read |
| SRC-D7, press "never buy used" lists | Free | Car seats, cribs, helmets | No: not primary sources | Snippet |
| SRC-C1 to SRC-C5, thrift map apps (Thrift Map, Thriftmap, SecondShopper, Thrifters, Ganddee) | Mixed; one names a subscription | Maps of thrift stores | No. Whether any shows how sure it is: not stated in the snippets | Snippet, none opened |
| SRC-C6, Tool Library Alliance map (https://www.toollibraryalliance.org/map) | Free | US tool libraries; states its own coverage limit | No: a question for the tool-library topic (RT-9) | Read |
| SRC-C7, Local Tools (https://localtools.org/find/) | Free | Points to the map above | No | Read |
| SRC-C8, Share Starter, public-library lending pages | Not checked | Tool-library maps | No | Snippet |
| SRC-C9, map apps' category search | Not checked | "Thrift store" as a category | No | From memory, not checked today |
| SRC-C10, the repo's competitor sweep (`research/competitors/directories.md`) | n/a | 28 profiles (25 live); none lists thrift or secondhand shops | Background | Repo read by the research agent |
| SRC-E1, Google Places, Yelp, Foursquare APIs | paid, ruled out | Place data | No | From memory, not checked today |
| SRC-E2, Data Axle, Dun & Bradstreet | paid, ruled out | Business lists | No | From memory, not checked today |
| SRC-E3, Placer.ai, SafeGraph | paid, ruled out | Foot-traffic data | No | From memory, not checked today |
| SRC-E4, IBISWorld report | paid, ruled out | Industry figures | No | From memory, not checked today |

Not found by the research: a free national thrift store file with descriptions, and any thrift stock feed (file 01, NF-1, NF-2). The research on certainty marks (file 02) lists 11 marking systems, 10 with a page read and 1 from a snippet, among them GRADE (4 levels), IPCC, PolitiFact (6) and Snopes (16 current labels on the saved page); it found no test of a four-word scale on a shopping page.

## 8. Adversarial critique and responses

An adversary agent attacked the working draft (`handoff/thrift-pilot-spec/31-adversarial-critique.md`). Its repo citations for the rows below were re-opened today and matched, except where a row says otherwise. Seriousness is the adversary's rating.

| Label | The critique | Seriousness | Response | Where the spec changed |
|---|---|---|---|---|
| CRIT-1, the store line says nothing | "Likely a thrift store" repeats the block heading on every row; today's ranked row already says more about the same store | Changes the design | Accepted. The per-store line is gone; where the list came from is said once in the block note | DIS-3, DATA-1, section 2c. What remains is in "still stand" below |
| CRIT-2, "likely" already means stock | On the same screen "Likely, by shop type" means "likely sells it" (`src/render.ts:107`) and scores; "Likely" on a thrift row invites the stock reading | Changes the design | Accepted. No "likely" on a thrift row or in the block | DIS-3, MK-2, STR table, DEP-7, TD-15 |
| CRIT-3, records are lost | Skipping the enrich step also skips the join of certifications, findings and the chain badge (`proxy/src/enrich.ts:127-133`), so a thrift store with a finding would read "unknown" | Changes the design | Accepted. The join runs for thrift places with no model call; a unit test covers it. The chain badge's meaning (store count only) is stated at MK-1 | DATA-3, section 2b steps 6 and 9, PH-2, RISK-14 |
| CRIT-4, a quiet demotion | Removing a ranked thrift store from the ranked list puts it below every ranked shop because of its kind | Changes the design | Accepted. The ranked list is left as it is; a store may show in both places. The rank citation is fixed (6 or 7 by run) | Section 2b step 3, DEP-8, ALT-7, ALT-17, TD-17 |
| CRIT-5, the pilot does not test G5 | The draft dropped the per-store description, then proposed a pass mark the cut-down design could pass. The hand check of store pages (RT-1) is the G5 question and needs no build | Blocks the pilot from PH-2 on | Partly accepted. RT-1 is now the first step and the gate before any Worker work, and the substitute pass mark is withdrawn. Not accepted: dropping the block from the spec. The owner's request is to display thrift stores in results, so the block stays as the gated third step. What would change this: PH-1 finding too few stores with websites to fill a block | Sections 1 and 2 (GATE-1, GATE-2), TD-2, RISK-13 |
| CRIT-6, the rival is rejected in a circle | ALT-1 was turned down because an unset pass mark could not grade it. It needs no Worker change: the response already carries the category and name (`proxy/src/pipeline.ts:272`) | Changes the design | Accepted. ALT-1 is the first build (PH-1b). The link is an owner decision, since a link that carried the zip would break the privacy rule (`docs/privacy.md:10`) | Sections 1, 2, 2b; ALT-1; TD-16 |
| CRIT-7, the sixth call can fail the search | All search calls run under one `Promise.all` and any failure throws, so an optional block could take down the main results | Changes the design | Accepted. A failed or refused thrift call means no block; a unit test covers it | Section 2b step 2, STR-5, PH-2 |
| CRIT-8, the normalize change touches every search | A new prompt re-reads every product, normalize runs before the search calls, and a model-picked group would make the keep-out call | Changes the design | Accepted. No normalize change; the trigger and every keep-out word are in code | DIS-9, section 2b, ALT-18. The 60-call check is removed from PH-3 |
| CRIT-9, no judge on the place type | Ordinary nearby shops are judged by a model and 71% were graded good (`docs/goals.md:26`); thrift places get no judge and a one-word type hint, yet the draft printed "Likely" | Blocks any level word above Unknown | Accepted. No level word on the list; the owner sets the bar before the paid check (GATE-2) | DATA-1, GATE-2, RISK-2, TD-15 |
| CRIT-10, the block tilts to large operators | No-website stores are dropped and the block had no branch limit, so one operator could fill it | Changes the design | Accepted for the two fixes: one branch per website, and the note says stores without a website are not listed. PH-3 counts repeats. The V1 tension is unchanged and is stated in section 3 | Section 2b step 10, section 2c, RISK-3, the V1 row |
| CRIT-11, unmarked claims in the block's own text | "Stock changes daily, so call or visit first" is an unsourced general statement with no level word, and no phone number exists to offer | Worth a note | Partly accepted. The sentence is cut. Not done: the critique asked for the note to end at the unknown sentence, and two sentences were added after it (where the list came from, and that stores without a website are left out), neither with a level word (DEP-7). They answer CRIT-1 and CRIT-10; the owner can cut them (TD-15). The point that a boxed badge might lend weight to unchecked lines is carried as RISK-14 | Section 2c, RISK-14, DEP-7 |
| CRIT-12, the keep-out list is mostly judgment | Only helmets and car seats have a repo source; a list of exclusions lets through whatever it missed | Blocks triggering beyond the owner's own example | Accepted. One group, clothing, as an allow list; everything else shows nothing | DATA-5, DIS-4, ALT-19, TD-5 |
| CRIT-13, the spec outruns its place in the order | A schema, four phases and 16 rulings for one person are not sized to G4; the goals file's next step for this row is a draft list, a guide and the marks | Changes the design | Partly accepted. The recommendation now opens with the no-build step and the site-only sentence, and section 9 separates what is needed now from what waits on the block. Not accepted: moving the block to an appendix, because the section order is fixed by the workflow and the request asks for the sketch. Eight decisions are still needed now, twice the four the critique named | Sections 1, 2, 9; RISK-15 |

### Critiques that still stand

| Label | What still stands |
|---|---|
| STAND-1 (from CRIT-1) | The block still says little: names, miles, a record line that reads "unknown" for every thrift store today, and one sentence. Today's ranked row says more about a thrift store ("Model judgment: may sell it"), by a guess |
| STAND-2 (from CRIT-5) | Nothing recommended here shows a per-store description, so nothing here tests what G5 asks for beyond the trigger. Only PH-1 speaks to it, and only by measuring whether store pages say what they carry |
| STAND-3 (from CRIT-6) | The word list will miss clothing searches whose category wording it has not seen |
| STAND-4 (from CRIT-10) | The site would add, on purpose, a kind of place with no record, and leave out stores without a website |
| STAND-5 (from CRIT-11) | The pilot draws two of the four marks anew. Checked's several shapes (DEP-6) are still put off |
| STAND-6 (from CRIT-13) | The used-goods strategy is still shelved, the pass mark is unset, and three targets are owed; this spec adds decisions to that list |

## 9. Open decisions for the owner

Labels keep the working draft's numbers so the critique's references hold; TD-16 and TD-17 are new.

### Needed for PH-1 and PH-1b

| Label | Decision | Options | Agents' suggested default | What waits on it |
|---|---|---|---|---|
| TD-0 | How far to go | Stop after the hand check; the sentence (PH-1b); the block (PH-2 on); or the Upcoming work row with per-store descriptions (ALT-4) | The hand check, then the sentence; decide on the block at GATE-1 | Everything |
| TD-1 | Does G5 lift the 2026-11-15 shelving of used-and-repair options (RISK-9) | Yes for thrift only; no | Yes for thrift only, recorded in `docs/STATUS.md` | PH-1b on |
| TD-2 | The G5 pass mark | TBD, the owner to fill. Candidate in `docs/goals.md:68`: in a hand check of 20 thrift stores near 3 zip codes, at least 8 in 10 Likely items are right. As recommended here no Likely item is shown, so that candidate has nothing to grade until per-store descriptions exist | None. The agents suggest only that it be set before PH-3 runs | GATE-2, PH-3 |
| TD-5 | The trigger words and the keep-out words | Clothing only; or more groups | Clothing only: "clothing", "apparel", "outerwear". Keep out helmet and car seat (sourced), and the owner rules on socks, underwear and swimwear (an agent's judgment) | PH-1b |
| TD-6 | May the site say "this store likely has it" for used goods | Yes; no | No, at any level | Section 2c wording |
| TD-13 | Where the pilot sits in the order of work. "After 5" is an agent's proposal under "Inferred, not yet ordered by the owner" (`docs/goals.md:88`, `:97`; `docs/STATUS.md:145`) | Keep; move | Keep for building; allow PH-1 now | PH-1 |
| TD-14 | May the sentence show with only the owner's example as its source | Yes, labeled; no, wait for an outside source (RT-4) | Yes, labeled as the owner's judgment with a date | PH-1b |
| TD-16 | Does the sentence carry a link to a map search | No link; a link with no place in it ("thrift stores near me"), which is a new kind of outbound link; a link naming the city, which tells the map service where the shopper is | A link with no place in it, if the owner finds one that returns something useful (RT-11); otherwise no link. Which map service: TBD, the owner to fill | PH-1b |

### Only if the block is built

| Label | Decision | Options | Agents' suggested default | What waits on it |
|---|---|---|---|---|
| TD-4 | May a triggered search use the sixth and last search call | Yes; swap a nearby query (ALT-3) | Yes for the pilot | PH-2 |
| TD-8 | Block position, and a note when empty | After the nearby shops or first; note or hidden | After; note | PH-4 |
| TD-9 | Stores shown | 3; 5 | 3 | PH-2 |
| TD-10 | Paid calls for PH-3 (about 20 added place calls plus the timing harness's usual calls) | Yes; no | Yes, after PH-2's tests pass and GATE-2 | PH-3 |
| TD-11 | Departures DEP-1 to DEP-5; whether miles and address carry a level word | Accept each or take its alternative | The shopper lens suggests accepting all five, and no level word on miles | PH-4 |
| TD-12 | Do block rows count toward G1c (half of results carry a checked fact) | Yes; no | No. G1d (nearby list mostly right) is not affected, since the ranked list is unchanged | The eval scripts |
| TD-15 | How the block says where its list came from (DEP-7) | Provenance with no level word; "Likely" once PH-3's grades meet the owner's bar; "unknown" | Provenance with no level word for the pilot | The block note |
| TD-17 | A thrift store the ordinary search also ranks | Show it in both places; move it to the block only, which lowers it below every ranked shop | Both places | PH-2 |

### Site-wide marks, not needed for the pilot

| Label | Decision | Options | Agents' suggested default | What waits on it |
|---|---|---|---|---|
| TD-3 | Does "A Likely or In general item never changes a score" (`docs/goals.md:54`) cover the model's sells-it reading, which scores today | Reword the goal to match `docs/ranking.md:118` (the rule is about what a shop says about itself); or stop the reading scoring; or rename the sells-it word | Reword the goal; "Maybe" stays a sells-it word outside the four levels | The legend text |
| TD-7 | The Checked mark: one definition across its shapes (DEP-6), and whether its date shows on the face | Date on the face; in the panel and screen-reader name only | Define it as a link to a public source; date off the face | The legend text |

G3 stays labeled "inferred" (`docs/goals.md:36`).

## 10. What is unverified

| Label | Claim | Rests on |
|---|---|---|
| UNV-1 | A "thrift store" place search returns thrift stores, enough of them, quickly | Nothing: no live search was run |
| UNV-2 | A fifth parallel call adds little time | An agent's inference from the 4-call timing |
| UNV-3 | The old site ignores an unknown response section | Inferred from `src/api.ts:35`, not tested |
| UNV-4 | 27 category wordings for 20 products; `hardwarestore.com` matched 12 times | A one-off script the architecture lens did not save; the claim checker recounted both (`handoff/thrift-pilot-spec/32-recount-categories.py`) |
| UNV-5 | The keep-out words socks, underwear and swimwear; that "clothing", "apparel" and "outerwear" are the right trigger words beyond the 20 test products | Agents' judgment |
| UNV-6 | All "how likely" entries in section 5; every suggested default in section 9 | Agents' judgment |
| UNV-7 | Every on-screen string and the layout | Proposals; not rendered, not shown to anyone |
| UNV-8 | The thrift apps (SRC-C1 to SRC-C5), AllThePlaces, the press lists, the CPSC guide, differences between Goodwill regions on accepted goods, reader studies on weather words, GRADE wording, X's check mark and Nutri-Score | Search snippets only |
| UNV-9 | The paid feeds (SRC-E1 to SRC-E4), Census data being free, map apps' category search | From memory, not checked today |
| UNV-10 | The Goodwill national locator (its robots.txt could not be read, status 403) and the IRS bulk-downloads page (disallowed by robots.txt) | Not fetched |
| UNV-11 | The 28 resale results (1.3%) | A count carried from an earlier file, never recomputed |
| UNV-12 | Thrift places would pass the blocklist; the extra search sends only what today's searches send; the browser can read `query.category` | Design intent. The response carries the field (`proxy/src/pipeline.ts:272`) and the browser reads `response.query` (`src/render.ts:483`); nothing was run |
| UNV-13 | A lending place might list what it lends; some thrift chains are for-profit | From memory in the lens files; left out of the design |
| UNV-14 | The "about 200 triggered searches" figure | Arithmetic from `docs/costs.md:33`; it assumes every search triggers, and with a clothing-only trigger few would |
| UNV-15 | Path:line citations not listed in section 11 as opened by the final writer | Carried from the lens files; the claim checker matched most (`handoff/thrift-pilot-spec/32-claim-check.md`, "Spot checks that matched") |
| UNV-16 | Hours and cost of the build | Not estimated. ES5's 12 to 16 hours was for its own version (`docs/ethics-data-strategies.md:182`) |
| UNV-17 | 3 thrift-like rows in 1,101 saved responses; no thrift-like name in the three data files | A script and a search run today by the final writer, using name lists the writer made up: for saved responses, thrift, goodwill, salvation army, savers, value village, consign, second hand, resale, restore, st vincent; for the data files, thrift, goodwill, salvation, savers, restore. A store with another kind of name is missed |
| UNV-18 | A map search link with no place in it returns something useful | Not checked (RT-11) |
| UNV-19 | That PH-1b might not count as "information dynamically" | An agent's reading of the owner's words at `docs/goals.md:79` |
| UNV-20 | That the records join needs no model call | Read from `proxy/src/enrich.ts:127-133`, where the three lookups take only a domain and a data file; not run |

## 11. Sources

**Working files** (all under `/Users/brandon/dev/ai/nottheriver/handoff/thrift-pilot-spec/`):

| File | Role |
|---|---|
| `01-data-sources-and-existing-solutions.md` | Research: data sources and existing products |
| `02-certainty-marks-elsewhere.md` | Research: certainty marks used elsewhere |
| `11-lens-architecture.md` | Lens 1, architecture |
| `12-lens-data-and-evidence.md` | Lens 2, data and evidence |
| `13-lens-shopper-and-marks.md` | Lens 3, shopper and marks |
| `14-lens-vision-and-goals.md` | Lens 4, vision and goals |
| `20-working-draft.md` | The working draft this spec was revised from |
| `31-adversarial-critique.md` | The adversarial critique answered in section 8 |
| `32-claim-check.md`, `32-recount-categories.py` | The claim check and its recount script |
| `40-count-saved-thrift-rows.py` | The final writer's counts over saved responses (thrift-like rows, clothing categories) |
| `pages/data-sources/`, `pages/certainty-marks/` | Web pages saved by the research agents |

**Repo paths opened by the final writer on 2026-11-17:** `docs/goals.md:1-100`; `docs/architecture.md:15-32`; `docs/privacy.md:5-12`; `docs/quality.md:7-12`; `docs/search-latency.md:1-12`, `:30-38`; `docs/ranking.md:103-112`; `docs/STATUS.md:70-76`, `:127`, `:140-147`; `docs/ethics-data-strategies.md:176-186`; `docs/value-proposition/different-product.md:92-102`; `proxy/src/pipeline.ts:20-27`, `:100-116`, `:225-242`, `:266-276`; `proxy/src/brave.ts:83-95`, `:120-137`; `proxy/src/enrich.ts:6-10`, `:120-135`; `src/render.ts:105-110`, `:172-180`, `:214-216`, `:483`; `proxy/ranking/score.ts:59-65`; `proxy/src/normalize-cache.ts:12-18`; `docs/evidence/latency-0927/runs/split-enrich-v2/main-r2/responses/wool-blanket-suburban.json:15-22`, `:480-560`; the 1,101 files under `docs/evidence/**/responses/` (by script); `data/chains.json`, `data/negatives.json`, `data/certifications.json` (by search).

**Repo paths cited by the lens files and carried here:** `docs/caching-and-store-types.md`, `docs/costs.md`, `docs/open-place-coverage.md`, `docs/open-place-precision.md`, `docs/store-breadth-review.md`, `docs/evidence/ethics-data/p3-datasets-certifications-and-small-shops.md`, `research/competitors/directories.md`, `proxy/schemas/normalize.json`, `proxy/schemas/search-response.json`, `proxy/test/pipeline.test.ts`, `eval/queries.json`, `src/styles.css`, `src/api.ts`, and the `src/render.ts` lines other than those above.

**URLs opened by the research agents on 2026-11-17** (the final writer opened none): the URLs in section 7 marked "Read", plus, from file 02: https://en.wikipedia.org/wiki/Template:Citation_needed, https://www.snopes.com/fact-check-ratings/, https://www.politifact.com/article/2018/feb/12/principles-truth-o-meter-politifacts-methodology-i/, https://www.ipcc.ch/site/assets/uploads/2018/05/uncertainty-guidance-note.pdf, https://en.wikipedia.org/wiki/Words_of_estimative_probability, https://research.monash.edu/en/publications/verbal-probabilities-ivery-likelyi-to-be-isomewhati-more-confusin/, https://www.weather.gov/bgm/forecast_terms, https://www.gradeworkinggroup.org/, https://www.ftc.gov/business-guidance/resources/native-advertising-guide-businesses, https://support.google.com/business/answer/7107242, https://wiki.openstreetmap.org/wiki/Key:check_date, https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html.
