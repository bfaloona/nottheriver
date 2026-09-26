# Plan: the Amazon alternatives research in ranking, selection and exclusion

Status: planned 2026-09-26, not started. Reviewed: self-review 2026-09-26, file and line references checked; fresh-eyes review 2026-09-26 (`docs/plans/amazon-alternatives-in-ranking-review.md`), R1, R3, R4 (offline), R5, R7 to R10 applied; Operator rulings: R2 weighted findings (Phase B0), R4 live limits T1 to T4, R6 no response promise. Source: `research/amazon-alternatives.md` (54 retailer files, 26 list sites, built into `research/index.json`). Nothing under `research/` changes the live site today (`research/README.md`); the Worker imports only `data/*.json` at build (`proxy/src/pipeline.ts:1-3`).

## What the research can and cannot do for the site

The saved evaluation responses set the shape of this plan. In eval60 (60 searches, 1,147 result rows) the only researched retailers that appeared were `caution`-tier ones: Walmart (41 rows), Best Buy (21), Costco (14), Target (13), eBay (8), Patagonia (6), Etsy (2). The eval20-0924 and eval20-0925 runs show the same set plus Barnes & Noble. No `recommended` or `acceptable` retailer appeared in any saved response.

What this plan does not do: help a shopper find a better shop. Phases A to C improve the reasons shown for chains the site already finds, and those chains sink; the shops the 26 list sites recommend stay invisible until Phase D (deferred, Q4). Review: `docs/plans/amazon-alternatives-in-ranking-review.md`.

| Use | What feeds it | Effect today | Verdict |
|---|---|---|---|
| Down-rank | 54 accepted concerns (25 labor, 8 governance, 21 environmental) on 19 `caution` and 4 `acceptable` retailers, each citing an accepted-source page and ruled on by the operator | Large and visible: the seven retailers above move down wherever they appear | Do it (Phase B) |
| Boost | 6 certifications verified this run with no row in `data/certifications.json`: Avocado, Bookshop.org, Etsy, Tentree (`climate_neutral`); Bob's Red Mill, Mightly (`fair_trade`) | Correct but changes no saved result; Etsy's badge partly offsets its concerns | Do it, small (Phase B) |
| Select (surface alternatives) | `goods`, `mentions`, `mentioned_by` and tier for the 21 `recommended` or `acceptable` retailers named by 3 or more sites | Ranking cannot surface them: Brave never returns them. Needs a separately labeled list matched on the normalized category | Sketch only, gated on Q4 (Phase D) |
| Exclude | `amazon_owned: true` (4 files) | All 4 domains are already in `data/blocklist.json` | Nothing new; add the 4 as blocklist fixtures |
| Tiers | Research summary of the formula the site already uses (`research/brief.md` section 5) | Not imported: a tier label would be a second, unexplained verdict beside the components | Test target only (Q5) |
| List-site scores (26 sites) | `sites` in `research/index.json` | None: they are editorial pages, which the URL rule and classifier already drop | Out of scope |

**Not fit to drive exclusion** (all stay down-ranks, as the research itself says): concerns resting on one small closed OSHA citation (Costco $560, ThredUp $1,773, Thrive Market $3,306); Azure Standard, tied to the cited establishment only by a matching address (`research/raw/verify-R9.md`); Depop, penalized through its parent eBay; Patagonia, penalized through the sister company Patagonia Provisions; Etsy, whose Prop 65 settlements concern other sellers' goods on its marketplace; everything the research records as notes only (foreign regulators, unverified B Corp claims, private suits, dismissed actions); and `acceptable`, which for 21 of 25 means nothing was found, not that the shop was checked clean.

## Where the data lives and how it flows

- Direction: research into `data/`, never the Worker reading `research/index.json`. `data/negatives.json` and `data/certifications.json` stay the live source of truth (ADR 0004, "curated first"); each imported row gets a `note` naming its `research/retailers/<slug>.md` file.
- A subset test in `proxy/test/data.test.ts`: every `accepted_source: true` concern in `research/index.json` has a negatives row with the same domain, kind and source URL, and every `verified_this_run: true` certification has a certifications row. Drift fails CI; the 4 hand-curated rows are untouched.

Four conflicts between the research rows and the live rules:

| Conflict | Where | Resolved by |
|---|---|---|
| Live data allows one negatives row per domain and kind (`proxy/test/data.test.ts:69-71`); scoring and ADR 0003 count once per kind and source page (`proxy/ranking/score.ts:74-77`); 10 research retailers have several same-kind concerns (Etsy 5 environmental, Bob's Red Mill 7) | data test vs research arithmetic | Q1 |
| ADR 0004: the claim shown is the source's own title. Research `title` fields follow the source's wording but are agent-composed for the 19 oag.ca.gov Prop 65 rows; OSHA and court rows look like page titles | ADR wording | Q2 |
| Overstock's Air Resources Board settlement has `date: unknown`; negatives rows require `action_date` | schema | Q3 |
| `src/render.ts:160-177` draws one warning box with a dispute link per negative and never shows `action_date`, though ADR 0004 says curated rows show it | site rendering | Phase A, before any import |

## How the shopper sees the reason

- Every imported finding keeps today's contract: kind label, claim, `Source: <host>` link to the accepted-source page, "Dispute this", plus the action date (new on the page).
- Several findings on one shop collapse to one line ("3 concerns, 2019 to 2025") that expands to the list. `docs/ideas.md` ("Fuller, fairer concerns") asks for this.
- A "Full record" link to the research retailer file needs a new optional field on `Signal` (`proxy/src/contract.ts:35-42`; `NegativeRow` in `proxy/src/enrich.ts:15` drops `note` today), so it ships in Phase B, not A; the site must work without it.
- "Why this rank" already links each counted concern under Ethics and Environment (`src/render.ts:108-126`); no change there.

## Steps

**Phase A. Site only: grouped concerns with dates.** Group negatives per result in `src/render.ts`, show `action_date`, one dispute link per finding. Render tests with 0, 1 and 5 findings; e2e screenshot. Push to `main`; no Worker deploy. Ships alone so the first import never shows five boxes.

**Phase B0. Weighted findings (operator ruling on review R2, 2026-09-26).** Replace the flat 0.25 step per finding with a weight, so a $2,000 sister-company settlement no longer costs the same as a $50 million DOJ settlement. Design first, as an amendment to ADR 0003, then code in `proxy/ranking/score.ts` with tests; lands before Phase B's Worker deploy so flat penalties never go live on the new rows. Design questions (from `docs/ideas.md:13`), open: what measures severity (penalty amount, kind of action, open complaint vs final ruling), how age discounts a finding, whether and how company size scales it, and what each weight needs recorded per row in `data/negatives.json`. The research-vs-live arithmetic test in Testability then compares against re-computed weighted values, not `research/index.json`'s flat ones.

**Phase B. Data import, Worker deploy.**
- Operator sign-off first: the operator reads and approves the `claim` string of every row to be imported (including the 19 agent-composed Prop 65 titles), recorded as a checklist under `docs/evidence/`; the ADR 0004 amendment names that file.
- Add the 6 certification rows and the concern rows under the Q1 to Q3 rulings. One row per case, citing the most authoritative page; the record link lists the others (keeps `docs/ranking.md:50`, "the same case cannot lower a score twice", true after Q1 loosens the uniqueness test).
- Every row whose page does not name the shop (Azure Standard's address-matched OSHA pages, Depop's eBay case, the Patagonia Provisions rows) carries a `note` stating the tie and its source; the data test checks the note is present for those rows.
- Walmart's environmental row: cite the CourtListener docket page, not the JSON API URL.
- Add an `abebooks.com` case to `tests/fixtures/blocklist-cases.json` (the other 3 Amazon-owned domains are already covered).
- Adjust the uniqueness test per Q1; add the subset test; add the optional record link field and render it.
- Amend ADR 0003, ADR 0004 (carry the concern definition from `research/brief.md:212`: open agency complaints and sister-company settlements now count), `docs/ranking.md` ("What can appear today" and rule 3 at lines 84-89), `about.html:36-41`, and the comments at `src/render.ts:159` and `proxy/src/contract.ts:38`. Run `infra/deploy.sh` (agent-runnable: bundle only).

**Phase C. Measure.** Offline replay, then copy T1 to T4 into `docs/quality.md` and commit before the live rerun (Testability). Record in `docs/quality.md` and `docs/STATUS.md`.

**Phase D. Suggested shops, only if Q4 is yes.** New `data/alternatives.json` derived from the research (domain, name, goods, tier, the list sites naming it and their scores). The Worker matches `goods` against the normalized `category` and returns up to 3 in a new response field, shown under its own heading ("Shops that others recommend for books"), never scored or mixed into the ranked sections, each citing its list sites. The site must work without the field, so either deploy order is fine (`.claude/skills/deploy/SKILL.md`). Needs a category-match test and its own precision check: a research file does not say a shop sells the product searched.

## Testability

| Check | How | Expected |
|---|---|---|
| Data integrity | `proxy/test/data.test.ts`: subset test; every negatives source domain is in `data/negative-sources.json` (exists, `data.test.ts:66`); dates well formed | Green, or the drifted row named |
| Research and live arithmetic agree | New test: for each research retailer, run `ethics()` and `env()` from `proxy/ranking/score.ts` on that domain's `data/*.json` rows and compare with `ethics` and `environment` in `research/index.json` | Equal for every retailer except those a Q1 or Q3 ruling excludes, listed by name in the test |
| Scoring edge cases | `proxy/test/score.test.ts`: 5 same-kind findings floor at 0, with or without a certification | As ADR 0003 states |
| Rendering | `src/render.test.ts`: grouping, date, one dispute link per finding (Phase A); record link present or absent (Phase B); `npm run e2e` | Green; `docs/evidence/results.png` updated |
| Offline before and after (free) | Script under `docs/evidence/quality/<run>/method/`: for each saved eval60 response, recompute ethics and env for the 7 researched retailers that appear from the new certification and finding counts (cap, then floor, `proxy/ranking/score.ts:79`), re-sum with the weights, re-rank, list rank changes per search | Only the 7 change score; every rank change is explained by one of the 7 moving. Limit: the saved `dropped` list has only domain and reason, so the replay cannot show a new top-10 entrant |
| Live after deploy | One live search where Walmart ranked online in eval60 (cast iron skillet, Cambridge MA: rank 9); then the 20 graded searches once (80 Brave calls, about $0.42), grades reused by URL and address | Findings render with dates; T1 to T4 below |
| Metric effect, pre-registered | Precision should not move (every affected shop sells the product). Recall as measured will likely fall, because the baseline counts chains as good shops (63 of the 86 local baseline shops are chains, `docs/quality.md`) | Written into `quality.md` before the rerun, so the drop is not read as a regression |

Live rerun limits (operator ruling on review R4, 2026-09-26), against eval20-0925 (two runs: online precision 98%, local precision 64% and 62.5%, top 3 good 32 of 49 and 32 of 50, local recall 28 and 30 of 86, online recall 31 of 100). The offline replay is the exact test; the live rerun checks nothing broke, so T1 and T2 are floors.

| Label | Metric | Pass if |
|---|---|---|
| T1 | Online precision | 96% or higher |
| T2 | Local precision | 57.5% or higher (5 points below the lower run) |
| T3 | Recall, online and local | Every lost baseline shop is a down-ranked chain that fell out of the top 10; more than 2 other losses in either section fails |
| T4 | Good shops in nearby top 3 | Reported, no pass/fail; each change listed with the shop that moved |

## Operator rulings (2026-09-26)

- Q1. Several same-kind findings for one shop: loosen the data test to one row per domain, kind and source page (matches `score.ts` and ADR 0003; Etsy's environment goes to 0 as the research says), or keep one per domain and kind (caps any kind at one 0.25 step; Etsy stays at 0.5 with its badge, disagreeing with the published tier). Recommendation: loosen. The operator ruled on these rows as counted, and the site should not quietly disagree with research it links to. **Ruling: loosen.**
- Q2. Claim text for curated rows: amend ADR 0004 so a curated claim may be operator-reviewed wording that follows the source (the model path keeps the strict rule), or import only rows whose title is the page's own. Recommendation: amend. The second option drops most Prop 65 rows the operator ruled to count, and an OSHA page title ("Inspection Detail") explains nothing. **Ruling: amend.**
- Q3. Overstock's undated concern: skip the row (Overstock keeps its dated 2017 court row) or allow `action_date: null` for curated rows. Recommendation: skip; the schema stays strict and Overstock still down-ranks. **Ruling: skip.**
- Q4. Build Phase D? Recommendation: not yet. It is a new kind of result with no relevance evidence, the category match is untested, and 21 of the 25 `acceptable` shops were never checked clean. Revisit after Phase C, for `recommended` shops and `acceptable` ones with a counted certification only. **Ruling: not yet.**
- Q5. Show the tier label on the site? Recommendation: no. Components and sources explain the rank; a label invites disputes about the word rather than the evidence. **Ruling: no.**

## Risks

- RISK-1. Severity is flat today (Phase B0 replaces it): a $560 OSHA citation and a $50 million DOJ settlement each cost 0.075 (0.30 × 0.25). `docs/ideas.md` lists severity, age and size weighting as undesigned; Phase A makes the dates visible, this plan does not weigh them. Related: concern counts track how deep the search went, not conduct (`research/method.md:136`), so a well-documented shop loses more than a poorly documented one; the same weighting fix covers it.
- RISK-2. Dispute load: 54 new findings each carry "Dispute this" while the review process is TBD (`docs/ranking.md`). Operator ruling on review R6 (2026-09-26): no response promise; the gap is accepted and recorded in `docs/STATUS.md`.
- RISK-3. Staleness: every research row is checked 2026-09-25 and nothing re-checks it (the certifier-row gap in `docs/debt.md`, wider). Open cases such as Costco's 2025 NLRB complaint can close the other way.
- RISK-4. Nearby chain branches drop below independents whose practices are unknown (baseline 0.5). That is the design, but recall and the "nearby top 3 good" count may read worse; Phase C pre-registers it.
- RISK-5. Parent and sister-company rows (Depop, Patagonia) are the most disputable; a wrong one harms a real business. Both carry the operator's ruling in the file the record link opens.
