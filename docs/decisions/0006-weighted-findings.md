# 0006: Weighted findings

Status: Proposed (2026-09-26). Amends [0003](0003-scoring.md) (the finding step) and [0004](0004-down-ranking.md) (what a curated row records). Operator ruling on review finding R2 in [plans/amazon-alternatives-in-ranking-review.md](../plans/amazon-alternatives-in-ranking-review.md); Phase B0 of [plans/amazon-alternatives-in-ranking.md](../plans/amazon-alternatives-in-ranking.md). On acceptance, 0003 gets a one-line "Amended <date>: see 0006" note under its finding bullet, the repo's convention for amendments; this is a separate file so a proposal never reads as live text inside an accepted ADR.

## Context

Today every accepted negative finding costs a flat 0.25 on its dimension (`proxy/ranking/score.ts:68-85`: certifications capped at 1.0 first, then 0.25 per finding, floored at 0). With the four live rows that was harmless. The Amazon alternatives research adds 54 rows, and under the Q1 ruling (one row per case) the flat step produces the R2 outcome: Etsy (five Proposition 65 settlements of $6,000 to $40,000, `research/retailers/etsy-com.md:15-19`) and Patagonia (one $36,000 settlement plus three naming only its sister company Patagonia Provisions, `research/retailers/patagonia-com.md:18-21`) both reach environment 0, below Walmart at 0.25, whose one environmental row is an $11,000,000 criminal fine (`research/retailers/walmart-com.md:36`). Costco's three OSHA citations of $560 to $9,403 (`research/retailers/costco-com.md:31-33`) plus one open NLRB complaint put its ethics at 0, level with Walmart's $50,000,000 DOJ settlement, FTC order and EEOC consent judgment (`research/retailers/walmart-com.md:33-35`).

Two related problems the plan records: RISK-1 (severity is flat) and R10 (the number of rows tracks how deep the search went, not conduct; `research/method.md:136`). `docs/ideas.md:13` names three factors to weigh: severity, age and company size.

What the research actually records per concern (`research/index.json`, `concerns[]`): `kind`, `title`, `source`, `date`, `accepted_source`. Nothing else is structured. The penalty amount is in the title for 22 of the 54 rows (Prop 65 rows and agency press releases), in the file body for the 18 OSHA rows and for some court rows (Walmart's $11,000,000, Overstock's $6,828,000 at `research/retailers/overstock-com.md:35`, Target's $160,000 at `research/retailers/target-com.md:34`), and absent for the rest (NLRB settlements, two EEOC consent judgments, Walmart's FTC order, the FDA warning letter). Which company the page names is in the title for the Depop and Patagonia Provisions rows and in the body for Azure Standard (`research/retailers/azurestandard-com.md:27`) and Avocado (`research/retailers/avocadogreenmattress-com.md:32`). Whether a case is decided is in the body (Costco's NLRB complaint is open, `research/retailers/costco-com.md:34`). No file records revenue, headcount or store count.

## Decision

### The rule

A finding's cost is the old 0.25 step scaled by three factors, each read from fields on the row, never from the source text at request time:

```
cost = 0.25 × band × age × relation
value = max(0, min(1, 0.5 + 0.25 × certification kinds) − Σ cost)
```

| Factor | Field | Values |
|---|---|---|
| Band (how serious) | `penalty_usd`, `status` | **major** 1.0: penalty of $1,000,000 or more. **standard** 0.5: $100,000 to $999,999, or the source states no amount (`null`). **minor** 0.25: under $100,000, including $0, or the case is still open (`status: open`), whatever its amount |
| Age | `action_date` | 1.0 within 5 years of the scoring date; 0.5 when the action date plus 5 years is before the scoring date |
| Relation | `relation` | 1.0 when the page names the shop (`self`); 0.5 when it names a parent, subsidiary, sister company or an entity tied to the shop by evidence in the row's `note` (`related`) |

So the smallest cost is 0.25 × 0.25 × 0.5 × 0.5 = 0.015625 (an old, small, related-company finding) and the largest is the old 0.25 (a recent major finding against the shop itself). Nothing else about the dimension changes: certifications are capped at 1.0 before findings are subtracted, the result is floored at 0, and a finding counts once per kind and source page (the Q1 one-row-per-case rule and R8's "most authoritative page" rule keep that dedupe meaningful, because two rows for one major case would now cost 0.5).

Why these pieces and not others:

- **Penalty amount, not action type.** The amount is a number the source states and a reader can check; an action-type ladder (citation, complaint, consent order, plea) would be a taxonomy nobody has recorded and every row would need a judgment call. Thresholds of $100,000 and $1,000,000 are round numbers chosen so that today's rows split cleanly: six rows at $1,000,000 or more (AliExpress $600,000,000, Walmart $50,000,000 and $11,000,000, Overstock $6,828,000, Best Buy $3,800,000, eBay $3,000,000 and the same case for Depop), every OSHA and Prop 65 row under $100,000 ($560 to $40,000), and the middle band holding Target's $160,000 consent decree and the rows whose amount the source does not state.
- **An open complaint is minor.** No penalty has been imposed; the research itself calls Costco's row "an allegation, not a finding" (`research/retailers/costco-com.md:34`). Recording `status` keeps the row updatable when the case closes.
- **Age halves at 5 years, once.** Five years is the window the research already uses to gate `recommended` (`research/amazon-alternatives.md:100`). A finding never expires: ADR 0003 says a finding always costs something, and the row stays visible with its date. A second step at 10 years was considered and rejected because it would put Walmart's 2013 fine level with Etsy (see the R2 check below).
- **Relation halves.** OC32, OC33 and OC37 (`research/method.md:112-113,186`) make parent and sister-company actions count. Half weight says: this happened in the same corporate family, and the page does not name the shop, so it is weaker evidence about the shop than a finding against the shop itself. RISK-5 in the plan calls these rows the most disputable.
- **No company size factor.** Nothing in the research records size, and a size-relative penalty would call Walmart's $50,000,000 small (about the opposite of what R2 asks). The bands already treat a $560 citation as minor whoever received it. Size belongs with the separate independence idea (`docs/ideas.md:13`, item 3).
- **No depth cap.** Weighting shrinks the search-depth problem (eight minor findings cost 0.5, the same as two major ones) but does not remove it; Bob's Red Mill is the case that shows it (below). A cap is question W4.

Alternatives considered: an operator-assigned weight per row (simplest code, but a number nobody can recompute from the source, against ADR 0003's "every rank must be explainable"); a continuous log scale on the amount (no cleaner than bands for these rows, harder to say in words, and needs a size denominator to mean anything).

### Scoring date

Age makes a score depend on when it is computed. `dimension()` takes an as-of date: the request date in production, a fixed date in unit tests and in Phase C's replay (recorded in the run's method file). "Within 5 years" means the action date plus five calendar years is on or after the as-of date; a row crossing that line changes its cost by exactly half its band, so a rank change on a live rerun can be traced to the date.

### What a `data/negatives.json` row records

Existing fields stay (`domain`, `name`, `kind`, `claim`, `source_url`, `action_date`, `checked`, optional `note`). New, all required unless stated:

| Field | Allowed values | When unknown |
|---|---|---|
| `penalty_usd` | Whole dollars, 0 or more, or `null`. The civil penalty, fine or payment the source says the company agreed or was ordered to pay under this action; not attorneys' fees, costs or interest (a Prop 65 page lists them separately). Several figures: the one the source calls the penalty or fine, else the largest payment | `null` when the source states no figure (standard band). `0` only when the source says no money was due. The data test requires a number for rows on `osha.gov` and `oag.ca.gov`, whose pages always state one |
| `relation` | `self` or `related` | Never unknown: the import decides from the page. `related` requires `note` naming the tie and its source (the plan already requires this note; R5) |
| `status` | `final` or `open` | Never unknown. `open` requires `penalty_usd: null` |

A model-suggested finding (`origin: llm`, a path that cannot fire today per ADR 0004) has none of these fields and scores as standard, self, final and recent: 0.125.

### How the shopper sees it

Words on the page, numbers in the API, every word derived from a recorded field:

- Each finding keeps its kind, the claim, `Source: <host>`, the action date (Phase A) and "Dispute this", and gains one line: **"Counted as minor: $2,000 civil penalty, names a related company (Patagonia Provisions)"**, **"Counted as major: $50 million settlement"**, **"Counted as standard: amount not stated by the source"**, **"Counted as minor: case still open"**, with "over 5 years old" appended when age applies. The dollar figure is `penalty_usd` formatted, so it is the source's number.
- "Why this rank" keeps one plain-words line per component and adds the count by band: "Environment: Climate Label certified; 5 minor concerns" with each concern linked as today (`src/render.ts:113-126`).
- The About page's ethics and environment bullets change from "each finding subtracts 0.25" to "a finding subtracts up to 0.25: less when the penalty was small, the case is old, still open, or against a related company; the ranking page has the table".
- The API response carries, per finding, the band and each factor as words plus the cost as a number, so anyone can recompute the component; the page renders words only (ADR 0003, amended 2026-09-24).

### Worked examples

As of 2026-09-26, from the rows in `research/index.json` and the amounts cited above. "Before" is the flat rule on the same rows (the research's own `ethics` and `environment`), which never shipped.

| Shop | Rows (kind, date, amount, factors) | Ethics before → after | Environment before → after |
|---|---|---|---|
| Walmart | governance 2026-08-28 $50,000,000 major; governance 2025-06-23 amount not stated, standard; labor 2024-01-11 not stated, standard; environmental 2013-06-04 $11,000,000 major, over 5 years | 0 → **0** (0.5 − 0.25 − 0.125 − 0.125) | 0.25 → **0.375** (0.5 − 0.125) |
| Costco | labor OSHA 2024-12-06 $9,403 minor; 2023-03-15 $1,330 minor; 2019-03-05 $560 minor, over 5 years; labor NLRB 2025-08-12 open, minor | 0 → **0.28125** (0.5 − 0.0625 − 0.0625 − 0.03125 − 0.0625) | 0.5 → 0.5 |
| Patagonia | labor NLRB 2020-03-25 not stated, standard, over 5 years; environmental Prop 65 2021-08-12 $36,000 minor, over 5 years; 2022-12-07 $4,000 minor, related; 2023-02-17 $5,000 minor, related (the amount is on the AG page, not yet in the research row); 2025-04-01 $2,000 minor, related | 0.75 → **0.9375** (three certifications cap at 1.0, then − 0.0625) | 0 → **0.625** (0.75 − 0.03125 × 4) |
| Etsy | environmental Prop 65 2022-02-17 $20,000; 2022-02-17 $40,000; 2024-11-22 $6,000; 2025-02-24 $24,300; 2026-01-27 $10,000; all minor, self, recent | 0.5 → 0.5 | 0 → **0.4375** (0.75 − 0.0625 × 5) |
| Bob's Red Mill | labor OSHA 2023-01-03 $1,350 minor; seven environmental Prop 65 rows $1,000 to $19,000, all minor, two over 5 years (`research/retailers/bobsredmill-com.md:16-22,35`) | 0.5 → **0.6875** | 0 → **0.125** (0.5 − 0.03125 × 2 − 0.0625 × 5) |

**R2 check: resolved, narrowly for Etsy.** Environment now orders Patagonia 0.625, Etsy 0.4375, Walmart 0.375: a $11,000,000 criminal fine from 2013 outranks five recent settlements under $50,000 by 0.0625 (0.019 of total score). Without the age factor Walmart would sit at 0.25; with a further halving at 10 years it would tie Etsy at 0.4375. Ethics orders Patagonia 0.9375, Costco 0.28125, Walmart 0, so the small-citation and DOJ-settlement examples separate as R2 asked. In the plan's "not fit to drive exclusion" list, ThredUp and Thrive Market (one OSHA row each, $1,773 and $3,306) go from ethics 0.25 to 0.4375, Depop from 0.25 to 0.375 (its parent's $3,000,000 fine at half weight) while eBay itself stays at 0.25, and Azure Standard from 0 to 0.40625 if its address-matched rows are `related` (W6).

**Honest edge.** Bob's Red Mill at environment 0.125 is the depth problem R10 describes: seven lead-in-flour settlements totaling $53,000 cost more than Walmart's $11,000,000 fine, because there are seven of them. Weighting alone does not fix a count; W4 asks whether to cap it.

### Testability

Unit tests in `proxy/test/score.test.ts`, each with a fixed as-of date:

- Band boundaries: `penalty_usd` 99,999 and 100,000 (minor, standard), 999,999 and 1,000,000 (standard, major), `null` (standard), 0 (minor), `status: open` with `null` (minor).
- Age boundary: action date exactly 5 years before the as-of date is full weight; one day earlier is half. Feb 29 handled.
- Relation halves; the three factors multiply (an old, related, minor row costs 0.015625).
- Cap before subtract unchanged (three ethics certifications and one major finding: 0.75); floor at 0 unchanged; dedupe by kind and source page unchanged; a labor and a governance row on one page still count twice.
- An `llm` origin finding with no fields costs 0.125.
- Equivalence: when every row is major, self, final and recent, the value equals the old flat rule, so the rule generalizes rather than replaces it.
- The response carries band, factors and cost per finding; the render tests check the "Counted as" line for each band and factor combination and that no line shows a number other than the source's dollar figure.

`proxy/test/data.test.ts`: `penalty_usd` is a non-negative integer or `null`; a number on every `osha.gov` and `oag.ca.gov` row; `relation` and `status` in their sets; `related` rows have a non-empty `note`; `open` rows have `null` penalty.

The plan's research-vs-live arithmetic test changes: `research/index.json` keeps the flat values (`research/build-index.mjs` is out of scope), so the live scorer can no longer be checked against it. Instead: (a) the subset test on row identity stays as planned; (b) the test pins the five worked examples above, computed by `ethics()` and `env()` from `data/*.json` at as-of 2026-09-26, so a changed row or rule fails by name.

Phase C's offline replay computes the weighted values with the as-of date fixed to the replay date and written into the run's method file; it reports today's live state (four flat rows) against the weighted import, and may print the flat-57 state as a third column for the record. T1 to T4 do not change. The live rerun records its date, so a rank change that coincides with a row crossing five years is explained.

## Consequences

- Scores depend on the date, but only when a row crosses five years; the as-of date is explicit everywhere a score is computed.
- Every imported row needs three more fields, and the amount for the 18 OSHA rows and several court rows must be copied from the file bodies or the source page (Patagonia's 2023 row above shows the row itself lacks it). The import checklist in Phase B grows by one column per row.
- The research files' `ethics` and `environment` values no longer match the site's; tiers are not shown (Q5), and the record link opens the file that explains its own arithmetic.
- ADR 0003's line "one negative finding moves a score by 0.075" becomes "at most 0.075". `docs/ranking.md` (Components table, Baseline section, "Negative findings") and `about.html:36-41` need the new wording (already in Phase B's amendment list).
- A certified shop with many small findings keeps most of its score; a shop with one large recent finding loses the full step. Whether that is right for Bob's Red Mill is W4.

## Open questions for the operator

| Label | Question | Recommendation |
|---|---|---|
| W1 | Thresholds: $100,000 and $1,000,000, and the standard band for an unstated amount | Keep. They split today's rows cleanly and are easy to say on the page. An unstated amount is neither small nor large; standard is the honest middle, and the data test forces a number where the source always gives one |
| W2 | Age: halve at 5 years and stop, or step again at 10 years | Halve once. A second step ties Walmart's 2013 fine with Etsy and reopens R2; revisit when a row the operator thinks is unfair appears |
| W3 | Company size: scale the penalty by revenue, headcount or store count | No. No size data is recorded, a relative penalty excuses large chains, and size is the independence idea, not a finding weight |
| W4 | Depth cap: leave as is, or cap the minor band's total at 0.25 per dimension (four minor findings) | Leave as is for Phase B, and decide after Phase C's replay shows whether any rank is driven by a pile of minor rows. Bob's Red Mill does not appear in any saved evaluation response, so the cap changes no measured result today |
| W5 | Open complaints: minor band, or keep the row unscored until decided | Minor. The operator already ruled it counts (OC12); minor says "an allegation" in the weight as well as the words |
| W6 | Azure Standard's OSHA rows name Azure Farms Inc, tied by address: `related` or `self` | `related`. The page does not name the shop, which is the R5 condition, and the note carries the tie |
| W7 | Should the related factor be 0.5, or should parent-company rows (Depop) count in full while sister-company rows (Patagonia Provisions) count half | One factor at 0.5. Two rules need two definitions of "parent" that the research does not record cleanly (Avocado's rows are the parent's own inspections at the shop's factory); one rule and a note per row is enough until a dispute says otherwise |
