# Path forward

Written 2026-11-15 by one agent (Fable) from the repo alone, with no web requests. The owner asked for one recommended path under three conditions: "simplicity is paramount. i want to build toward something with a good architecture."; "nothing is locked in. radical adjustments and pivots are ok to suggest."; "an ambitious goal that is hard to achieve should not be a reason to abandon the effort (e.g. rating stores on ethics and environmental topics)". "Computed this session" marks a figure from a throwaway script over saved files, not saved or reviewed.

Added by the lead agent the same day:

| Subject | Note |
|---|---|
| Rulings | OD1 (replace Amazon plan Phases B to D with ST1) and OD3 (shelve the scaling, wireframe and remaining review decisions): yes. OD2 (take ethics and environment out of the default order): not ruled; the lead recommended deciding it with ST1's results, since nothing before ST4 changes the order. Recorded in [STATUS.md](STATUS.md) |
| Checked against the repo | The ten chains are 395 of 2,182 saved results; 46 commits since 2026-10-02, 1 touching `proxy/`, `src/` or `data/`; 4 of the ten chains are among the 54 researched retailers; `data/negatives.json` has no Lowe's row; eleven cited lines say what this file says they say |
| Corrected | Section 6 first read "37 of 619 saved websites hold any record". 29 of the 37 hold only a chain-list entry, which the site does not count as a record |
| Not checked | That five companies hold every off-default row; the top-3 replay (7 and 8 of 20 searches); the count of 47 open decisions; the 137,000-word count; the 2,589-line count (the lead's own count over `proxy/src`, `proxy/ranking` and `src` was 2,549) |
| Caution for ST1 | The Department of Labor API route (`research/fetch-osha-dol.mjs`) stops answering for more than 90 seconds after about 8 calls, and its lookup by name found 12 of 18 known cases on 2026-09-25, so 1.5 hours a chain may be low |

## 1. The answer

- **Become a record book of the companies that turn up most in searches, with the product search as one way into it.** Each company in the book gets the same fixed check of public sources, every other shop says "unknown", and results are ordered by match and distance.
- **Next thing:** run that check on the ten chains seen most in saved searches (step ST1), in place of Amazon plan Phase B.
- **Two premises of the request need correcting.** The code is already small (2,589 lines of TypeScript outside tests, computed this session); the load is about 137,000 words of docs outside `docs/evidence/` (computed this session) and 47 open decisions (my count, `docs/STATUS.md`, "Decisions needed"). Rating is likely possible for companies and not for small local shops, where no record exists to load (`docs/ethics-data-strategies.md:105`).

## 2. The destination

What a visitor gets:

- Type a product and a zip code; get shops nearby and online that likely sell it, never Amazon.
- Each row shows the shop's record: who owns it and, for a company in the book, what each source on the fixed list says and when it was checked. Other shops say "unknown".
- Each company in the book has its own page, findable by name, with each fact sourced, dated and disputable. Results can be sorted by record.

The parts:

| Part | When it runs | What it stores |
|---|---|---|
| PA1, the record book (files in `data/`, in git) | Ahead of time: agents check, the owner signs each claim | Public facts per company website: Amazon-owned or not, chain, owner, certifications, findings, and each source's check date and result |
| PA2, the build | Ahead of time, on every push | Nothing. It tests that each row has a source and a date, runs the Amazon blocklist over the record (the Worker's second pass does this today, `docs/architecture.md:29`), then writes a page per company and one lookup file |
| PA3, the site (static pages) | In the visitor's browser | Nothing about visitors; the zip stays in the browser as today (`docs/privacy.md`, "What is kept") |
| PA4, the Worker (the one server program) | When a visitor searches | Only the 30-day cache of how a product was read (`docs/architecture.md:21`) |

What flows: the browser sends product, city, state and area center to the Worker. The Worker has the model read the product, asks Brave for shops, drops Amazon, has the model judge which shops sell it, and returns them. The browser finds each shop's website in the lookup file and shows the record.

What makes it simple:

- One store, files in git, no database. This fits the ruling that keeps corrections in `data/` as sourced rows (`docs/scale-feasibility.md:76`).
- No ethics work runs during a search; the Worker only finds shops and drops Amazon. Today it carries the data files inside it and scores with them (`proxy/src/pipeline.ts:1-4`, `proxy/src/enrich.ts:127-133`), so a data change needs a Worker deploy (`CLAUDE.md:3`). In the destination that is a site push, except for the blocklist.
- One rule for missing data: "unknown".

Why ethics leaves the order for now:

- 235 of 2,182 saved results (11%) are off the default scores, 166 of them from findings on three chains (`docs/ethics-data-strategies.md:15`).
- In the 20 graded searches of 2026-09-29, every off-default row belongs to five companies: Walmart, Home Depot, Dollar General, REI, Patagonia (computed this session from `docs/evidence/quality/eval20-store-types/responses/`, both runs).
- Leaving ethics and environment out changes the nearby top 3 in 7 and 8 of those 20 searches (computed this session by re-sorting the shown rows on 0.25 × match + 0.15 × distance; a lower bound). Online order cannot be replayed: ties keep Brave's order (`proxy/ranking/score.ts:197`), which is not saved.
- The page says "unknown" while the order treats an unchecked shop as better than a checked one with a finding. Home Depot sinks on one action from 2020 (`docs/ideas.md:13`); Lowe's is not among the 54 researched retailers (`research/retailers/`) and has no row in `data/negatives.json`.

## 3. Stop, delete or shelve

| What | Action | Reason |
|---|---|---|
| CUT1: Amazon plan Phase B (54 findings into the score), top of Priorities | Replace with ST1; keep the 54 files as leads | Its research went deeper on big retailers (`research/method.md:136`) and covers 4 of the 10 most-seen chains (`research/retailers/`); the plan says it does not help a shopper find a better shop (`docs/plans/amazon-alternatives-in-ranking.md:14`) |
| CUT2: Phases C and D | Shelve | C measures an effect on the order that ST4 removes; D stays "not yet" (ruling Q4, same plan) |
| CUT3: Ethics and environment weights and the finding arithmetic in the Worker (ADR 0003 scoring, ADR 0006 weighted findings) | Delete at ST4 | Section 2 |
| CUT4: Scaling work (AQ1 to AQ11) and the wireframe choice (WD1 to WD12) | Shelve until a public link is planned | "the repo holds no traffic data" (`docs/scaling-architecture.md:45`) and no user research (`docs/wireframes/README.md:122`) |
| CUT5: Ethics strategies ES4, ES5, ES6, ES11 | Shelve | New features, or outreach (ES11), before the record is shown to work (`docs/ethics-data-strategies.md`, section 5) |
| CUT6: New multi-option surveys and graded live reruns | Stop until a step below fails | The work of 2026-11-11 (26 changes, 26 options, 13 strategies, three wireframes) accounts for 39 of the 47 open decisions (my count); of 46 commits since 2026-10-02, one touched `proxy/`, `src/` or `data/` (git log) |

## 4. First steps

Sizes are estimates; none is timed.

| Step | What | Size | Shows | Failed if |
|---|---|---|---|---|
| ST1 | Check the ten most-seen chains (Walmart, Home Depot, REI, Best Buy, DICK'S, Lowe's, Ace, HomeGoods, Costco, Target: 395 of 2,182 saved results, `docs/evidence/ethics-data/shop-domains.tsv`) against one fixed list: OSHA cases through the Department of Labor API (`research/fetch-osha-dol.mjs`), wage cases (route untested), FTC cases, and the certification registries already in use. Proposed rule for what counts: final penalties of $100,000 or more in the last five years. Record findings or "checked, none found", log hours, owner reads every claim. Shown only, no effect on order. People side only: the environmental name search tried was unreliable (`docs/ethics-data-strategies.md:157`). The four live findings stay. Ace is dealer-owned: word it apart (same file, `:245`) | 15 h of agent time (1.5 h a chain, `docs/ethics-data-strategies.md:242`), plus the owner's reading | Whether a fair record can be built for the companies behind 18% of results (my arithmetic) and tells peers apart | Over 3 h a chain; or more than one claim tied to the wrong company; or the record differs in fewer than 2 of 3 peer groups (Walmart, Target, Costco; Home Depot, Lowe's; REI, DICK'S) |
| ST2 | From today: the owner uses the site for their next ten real purchases beside their usual tool, one log line each. No file records a shopper using it (`docs/value-proposition-review.md:7`) | About 40 Brave calls of the 1,000 free a month (`docs/costs.md:33`) | Whether the search is useful to one person | Fewer than 3 of 10 where the site gave something the usual tool did not |
| ST3 | A page per company in the book and a box to look one up; rows link to it | Days (`docs/value-proposition-review.md`, row R16) | Whether the record is usable without a paid search; a dispute can then start without one (`docs/wireframes/README.md:72`) | The owner opens no company page in the ten purchases after it ships |
| ST4 | Order by match and distance; the browser joins the record from the lookup file; "record" becomes a sort; delete CUT3 | Days | Whether the Worker can be a plain finder | A new data row does not show after a site push alone. Order floor: my replay gave 39 of 53 good in the nearby top 3 against today's 36 of 51 (`docs/quality.md:113`), inside noise |
| ST5 | Decide from ST1 and ST2. Both pass: grow the book to the top 99 websites, ownership first (26 to 30 h, half of results, `docs/ethics-data-strategies.md:209-212`). ST2 fails: retire the paid search, keep pages and lookup. ST1 fails: drop regulator records; keep ownership, certifications and links to graders | One sitting | | |

## 5. Decisions for the owner

| Decision | Recommendation |
|---|---|
| OD1: Replace Amazon Phases B to D at the top of Priorities with ST1. Reverses the approved order and execution approach (`docs/STATUS.md`, "Priorities") | Yes |
| OD2: Take ethics and environment out of the default order until half of shown results carry a checked record. Findings still show. Suspends the down-ranking ruling (ADR 0004; "Negative signals are allowed", `docs/STATUS.md`, "Decisions made by the operator"), changes ADR 0003, and answers ED3 against the report's advice (`docs/ethics-data-strategies.md:356`) | Yes; "we show what we know" is already the headline |
| OD3: Close the queue in one edit. This path answers VQ1, VQ6 and ED3 and leaves ED6 and ED12 to ST1's results; shelve AQ1 to AQ11, WD1 to WD12 and the remaining VQ and ED items | Yes |

Nothing above needs outreach. ST1's findings would carry "Dispute this" with no response promise, as accepted for the Amazon import on 2026-09-26 (same section); confirm that carries over.

## 6. The strongest argument against this path

No evidence shows anyone wants a record book either, and it starts thin: 8 of 619 saved websites hold a certification or finding today, and 29 more hold only a chain-list entry (`docs/evidence/ethics-data/shop-domains.tsv`, column `in_site_data_today`; the lead's count), and the 35% of results that are small local shops stay "unknown". With ethics out of the order, most searches are the map search the owner did not want (`docs/ethics-data-strategies.md:7`).

What would change my mind:

- ST1 shows every chain with similar findings: regulator records then measure size, and the rating needs another basis.
- ST2 shows the nearby search is the useful part: put the effort into its accuracy (71% of judged rows good, `docs/quality.md:100`).
- Five shoppers who avoid Amazon ignore the record, or want the order to follow it. Asking them needs the outreach deferral reversed, which I do not propose.

## 7. Alternatives rejected

- ALT1, carry on with the queue (Phases B to D, then the ethics sequence, itself 137 to 180 h by its own estimates, `docs/ethics-data-strategies.md:330-333`): it deepens a score that acts on five companies.
- ALT2, drop the search now and publish guide pages only: 26 list sites already do that (`docs/value-proposition-review.md`, row R19), and the owner has not yet tried the search on ten purchases.
