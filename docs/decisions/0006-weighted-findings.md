# 0006: Weighted findings

Status: Accepted (2026-09-27); operator rulings applied 2026-09-26. Not yet implemented: Phase B0 of the plan puts it in code. Amends [0003](0003-scoring.md) (the finding step) and [0004](0004-down-ranking.md) (what a curated row records). Operator ruling on review finding R2 in [plans/amazon-alternatives-in-ranking-review.md](../plans/amazon-alternatives-in-ranking-review.md); Phase B0 of [plans/amazon-alternatives-in-ranking.md](../plans/amazon-alternatives-in-ranking.md). On acceptance, 0003 gets a one-line "Amended <date>: see 0006" note under its finding bullet, the repo's convention for amendments; this is a separate file so a proposal never reads as live text inside an accepted ADR. Every number below is recomputed by `docs/evidence/weighted-findings/recompute.mjs`.

## Context

Today every accepted negative finding costs a flat 0.25 on its dimension (`proxy/ranking/score.ts:68-85`: certifications capped at 1.0 first, then 0.25 per finding, floored at 0). With the four live rows that was harmless. The Amazon alternatives research adds 54 rows, and under the Q1 ruling (several same-kind rows per shop count, one row per case) the flat step produces the R2 outcome: Etsy (five Proposition 65 settlements of $6,000 to $40,000, `research/retailers/etsy-com.md:15-19`) and Patagonia (one $36,000 settlement plus three naming only its sister company Patagonia Provisions, `research/retailers/patagonia-com.md:18-21`) both reach environment 0, below Walmart at 0.25, whose one environmental row is an $11,000,000 criminal fine (`research/retailers/walmart-com.md:36`). Costco's three OSHA citations of $560 to $9,403 (`research/retailers/costco-com.md:31-33`) plus one open NLRB complaint put its ethics at 0, level with Walmart's $50,000,000 DOJ settlement, FTC order and EEOC consent judgment (`research/retailers/walmart-com.md:33-35`).

Two related problems the plan records: RISK-1 (severity is flat) and R10 (the number of rows tracks how deep the search went, not conduct; `research/method.md:136`). `docs/ideas.md:13` names three factors to weigh: severity, age and company size.

What the research actually records per concern (`research/index.json`, `concerns[]`: 55 rows, 54 on accepted sources, 53 of those dated; Overstock's undated Air Resources Board environmental row is excluded under Q3): `kind`, `title`, `source`, `date`, `accepted_source`. Nothing else is structured. The penalty amount is in the title for 22 of the 54 rows (Prop 65 rows and agency press releases), in the file body for the 18 OSHA rows and for some court rows (Walmart's $11,000,000, Overstock's $6,828,000 at `research/retailers/overstock-com.md:35`, Target's $160,000 at `research/retailers/target-com.md:34`), and not recorded in the research for the rest (NLRB settlements, Walmart's 2024 and Target's 2020 EEOC consent decrees, Walmart's 2025 FTC stipulated order at `research/retailers/walmart-com.md:34`, the FDA warning letter). "Not recorded" is not "not stated": Phase B must read each of those source pages or PDFs before writing `null`, and the Walmart stipulated order and Target's 2020 consent decree are the two most likely to state a figure. Which company the page names is in the title for the Depop and Patagonia Provisions rows and in the body for Azure Standard (`research/retailers/azurestandard-com.md:27`) and Avocado (`research/retailers/avocadogreenmattress-com.md:32`). Whether a case is decided is in the body (Costco's NLRB complaint is open, `research/retailers/costco-com.md:34`). For OSHA rows, the citation class (other, serious, willful, repeat) is on the inspection page and in the DOL open-data record the research saved for each (`research/raw/osha-dol/*.json`, field `viol_type`; `research/raw/osha-dol-match.md`). No file records revenue, headcount or store count.

## Decision

### The rule

A finding's cost is the old 0.25 step scaled by two factors, each read from fields on the row, never from the source text at request time. Minor findings together can take at most 0.25 off a dimension.

```
cost = 0.25 × band × relation
value = max(0, min(1, 0.5 + 0.25 × certification kinds) − min(0.25, Σ minor costs) − Σ other costs)
```

| Factor | Field | Values |
|---|---|---|
| Band (how serious) | `penalty_usd`, `status`, `citation_type` | **major** 1.0: penalty of $1,000,000 or more. **standard** 0.5: $100,000 to $999,999; or the source states no amount (`null`); or an OSHA row whose counted citation is willful or repeat, whatever its amount. **minor** 0.25: under $100,000, including $0, or the case is still open (`status: open`, which has no penalty yet) |
| Relation | `relation` | 1.0 when the page names the shop (`self`), and also when it names a parent, subsidiary or sister company for something at the shop's own site or workplace (`related-at-shop`: Avocado's rows are the parent's OSHA inspections of the factory where every Avocado mattress is made); 0.5 for any other parent, subsidiary, sister-company or address-tied finding (`related`: Depop's row is eBay's case, the Patagonia Provisions rows are food products of a sister company) |
| Minor cap | none (computed) | The minor findings on a dimension cost at most 0.25 in total: four minor findings against the shop, or eight `related` ones, and further minor findings cost nothing more. Major and standard findings are never capped |

So a single finding costs 0.25 (major), 0.125 (standard) or 0.0625 (minor), each halved for a `related` row; the smallest cost is 0.03125. Every cost is a multiple of 1/32, so component values are exact; contributions and the score round to 3 decimals as before. Nothing else about the dimension changes: certifications are capped at 1.0 before findings are subtracted, the result is floored at 0, and a finding counts once per kind and source page (the Q1 one-row-per-case rule and R8's "most authoritative page" rule keep that dedupe meaningful, because two rows for one major case would now cost 0.5).

Why these pieces and not others:

- **Penalty amount, not action type.** The amount is a number the source states and a reader can check; an action-type ladder (citation, complaint, consent order, plea) would be a taxonomy nobody has recorded and every row would need a judgment call. Thresholds of $100,000 and $1,000,000 are round numbers chosen so that today's rows split cleanly: seven rows (six cases) at $1,000,000 or more (AliExpress $600,000,000, Walmart $50,000,000 and $11,000,000, Overstock $6,828,000, Best Buy $3,800,000, eBay $3,000,000 and the same case for Depop), every OSHA and Prop 65 row under $100,000 ($560 to $40,000), and the middle band holding Target's $160,000 consent decree and the rows whose amount the source does not state.
- **Willful or repeat OSHA citations are standard** (operator ruling 3, on review RV2). OSHA's per-citation maximums keep every OSHA amount under $100,000, so amount alone would make every labor row from OSHA minor by construction. The citation class is OSHA's own severity signal and is on every inspection page. None of the 18 counted inspections has a willful or repeat citation today (every counted citation in `research/raw/osha-dol/*.json` is `O` or `S`), so the ruling changes no current row.
- **An open complaint is minor.** No penalty has been imposed; the research itself calls Costco's row "an allegation, not a finding" (`research/retailers/costco-com.md:34`). Recording `status` keeps the row updatable when the case closes.
- **A cap on minor findings** (operator ruling 2, replacing W4 as recommended; also the answer to review R10). Depth of search, not conduct, decides how many small rows a shop has (`research/method.md:136`), so beyond four the count says little. Four minor findings cost what one major finding costs, and no pile of citations can outweigh a $50,000,000 settlement.
- **Relation, split** (operator ruling 4, on W7). A parent's action at the shop's own workplace is about the shop's own conditions and counts in full; a parent's or sister's action elsewhere is weaker evidence about the shop and counts half. OC32, OC33 and OC37 (`research/method.md:112-113,186`) make these rows count at all; RISK-5 in the plan calls them the most disputable.
- **No age factor** (operator ruling 1, on review RV1; deferred, not rejected). An age discount needs an as-of date wherever a score is computed, makes scores change on anniversaries, and puts date plumbing into the replay and the live rerun. It gets its own ADR after Phase C. Until then a 2006 settlement (Uncommon Goods) and a 2011 decree (Target) cost the same as a 2026 one; the row shows its date, so a reader can weigh it.
- **No company size factor.** Nothing in the research records size, and a size-relative penalty would call Walmart's $50,000,000 small (about the opposite of what R2 asks). The bands already treat a $560 citation as minor whoever received it. Size belongs with the separate independence idea (`docs/ideas.md:13`, item 3).

Alternatives considered: an operator-assigned weight per row (simplest code, but a number nobody can recompute from the source, against ADR 0003's "every rank must be explainable"); a continuous log scale on the amount (no cleaner than bands for these rows, harder to say in words, and needs a size denominator to mean anything).

### What a `data/negatives.json` row records

Existing fields stay (`domain`, `name`, `kind`, `claim`, `source_url`, `action_date`, `checked`, optional `note`). New, all required unless stated:

| Field | Allowed values | When unknown |
|---|---|---|
| `penalty_usd` | Whole dollars, 0 or more, or `null`. The civil penalty, fine or payment the source says the company agreed or was ordered to pay under this action; not attorneys' fees, costs or interest. For `oag.ca.gov` rows it is the page's "Civil Penalty" figure only, never fees or total payments. For `osha.gov` rows it is the inspection's current penalty, as the research recorded. Several figures elsewhere: the one the source calls the penalty or fine, else the largest payment | `null` only after the source page or PDF has been read and states no figure (standard band); an amount that is merely not recorded in the research is not `null`. `0` only when the source says no money was due. The data test requires a number for rows on `osha.gov` and `oag.ca.gov`, whose pages state one for every row in the research |
| `relation` | `self`, `related-at-shop` or `related` | Never unknown: the import decides from the page. Both `related-*` values require `note` naming the tie and its source (the plan already requires this note; R5); `related-at-shop` also names the site and why it is the shop's own |
| `status` | `final` or `open` | Never unknown. `open` requires `penalty_usd: null` |
| `citation_type` | `osha.gov` rows only: `willful`, `repeat`, `serious` or `other`, the highest class among the inspection's surviving citations that carry a penalty (willful, else repeat, else serious, else other), as the inspection page's citation type column shows and the DOL open-data record confirms (`viol_type` W, R, S, O; the `note` names the DOL activity number, as the research files do). Absent on other rows | Never unknown for an OSHA row; the data test requires it there and forbids it elsewhere |

A model-suggested finding (`origin: llm`, a path that cannot fire today per ADR 0004) has none of these fields and scores as standard and self: 0.125.

### How the shopper sees it

Words on the page, numbers in the API, every word derived from a recorded field:

- Each finding keeps its kind, the claim, `Source: <host>`, the action date and "Dispute this" (`src/render.ts:125-135`, Phase A), and gains one line built only from the row's fields: **"Counted as minor (under $100,000): civil penalty $4,000; names a related company, not this shop"** (for an `oag.ca.gov` row the words match the page's own field), **"Counted as major ($1,000,000 or more): $50,000,000"**, **"Counted as standard: amount not stated by the source"**, **"Counted as standard: willful violation"**, **"Counted as minor: case still open"**, and for a `related-at-shop` row **"names a related company, at this shop's own site"**. The dollar figure is `penalty_usd` formatted, so it is the source's number; the claim and the record link say what kind of action it was, because no field records that and the page must not guess.
- The grouped concerns summary (`src/render.ts:145-156`) keeps its count and year range; "Why this rank" keeps one plain-words line per component and adds the count by band: "Environment: Climate Label certified; 5 minor concerns (counted up to the minor limit)" with each concern linked as today (`src/render.ts:159-162`). The parenthesis appears only when the cap bit.
- The About page's ethics and environment bullets change from "each finding subtracts 0.25" to "a finding subtracts up to 0.25: less when the penalty was small, the case is still open, or it was against a related company; small findings together subtract at most 0.25; the ranking page has the table".
- The API response carries, per finding, the band and relation as words plus the cost as a number, and per dimension whether the minor cap applied, so anyone can recompute the component; the page renders words only (ADR 0003, amended 2026-09-24).

### Worked examples

From the rows in `research/index.json` and the amounts cited above, recomputed by `docs/evidence/weighted-findings/recompute.mjs`. "Before" is the flat rule on the same rows (the research's own `ethics` and `environment`), which never shipped.

| Shop | Rows (kind, date, amount, band, relation) | Ethics before → after | Environment before → after |
|---|---|---|---|
| Walmart | governance 2026-08-28 $50,000,000 major; governance 2025-06-23 amount not recorded in the research (read the stipulated order in Phase B), standard; labor 2024-01-11 not recorded (read the consent judgment in Phase B), standard; environmental 2013-06-04 $11,000,000 major | 0 → **0** (0.5 − 0.25 − 0.125 − 0.125) | 0.25 → **0.25** (0.5 − 0.25) |
| Costco | labor OSHA 2024-12-06 $9,403 minor; 2023-03-15 $1,330 minor; 2019-03-05 $560 minor; labor NLRB 2025-08-12 open, minor | 0 → **0.25** (0.5 − four minor at 0.0625, exactly the cap) | 0.5 → 0.5 |
| Patagonia | labor NLRB 2020-03-25 not recorded in the research, standard; environmental Prop 65 2021-08-12 $36,000 minor, self; 2022-12-07 civil penalty $4,000 minor, related; 2023-02-17 civil penalty $5,000 minor, related (read 2026-09-26 from the row's source URL, `https://oag.ca.gov/prop65/60-Day-Notice-2022-02550`, "Civil Penalty: $5,000.00"; the research row has no amount, so Phase B must record it); 2025-04-01 civil penalty $2,000 minor, related | 0.75 → **0.875** (Fair Trade and B Corp reach 1.0, then − 0.125) | 0 → **0.59375** (0.75 − 0.0625 − 0.03125 × 3). If the $5,000 were left unrecorded that row would score standard at half weight, 0.0625, and environment would be 0.5625 |
| Etsy | environmental Prop 65 2022-02-17 $20,000; 2022-02-17 $40,000; 2024-11-22 $6,000; 2025-02-24 $24,300; 2026-01-27 $10,000; all minor, self | 0.5 → 0.5 | 0 → **0.5** (0.75 − five minor, capped at 0.25) |
| Bob's Red Mill | labor OSHA 2023-01-03 $1,350 minor; seven environmental Prop 65 rows $1,000 to $19,000, all minor, self (`research/retailers/bobsredmill-com.md:16-22,35`) | 0.5 → **0.6875** | 0 → **0.25** (0.5 − seven minor, capped at 0.25) |

**R2 check: resolved.** Environment now orders Patagonia 0.59375, Etsy 0.5, Walmart 0.25: an $11,000,000 criminal fine costs the full step, and five settlements under $50,000 together cost the same 0.25 against a certification. Ethics orders Patagonia 0.875, Costco 0.25, Walmart 0, so the small-citation and DOJ-settlement examples separate as R2 asked. In the plan's "not fit to drive exclusion" list, ThredUp and Thrive Market (one OSHA row each, $1,773 and $3,306) go from ethics 0.25 to 0.4375, Depop from 0.25 to 0.375 (its parent's $3,000,000 fine at half weight) while eBay itself stays at 0.25, Azure Standard from 0 to 0.3125 (three warehouse rows as `related-at-shop`, W6), and Avocado from 0 to 0.375 (two `related-at-shop` rows in full).

**What the cap does.** Costco (four minor), Chewy (four), Etsy (five) and Bob's Red Mill (seven environmental) all land exactly 0.25 below their certification level: past four, a shop's count of small findings no longer moves its score. That is the intended answer to R10, and it means the site shows more concerns than it charges for; the "counted up to the minor limit" words say so.

### Testability

Unit tests in `proxy/test/score.test.ts`:

- Band boundaries: `penalty_usd` 99,999 and 100,000 (minor, standard), 999,999 and 1,000,000 (standard, major), `null` (standard), 0 (minor), `status: open` with `null` (minor), `citation_type: willful` and `repeat` with a $5,000 penalty (standard), `serious` and `other` (minor).
- Relation: `self` and `related-at-shop` full, `related` half; a related minor row costs 0.03125.
- Minor cap: four minor rows cost 0.25, five cost 0.25, nine related minor rows cost 0.25; a major row beside five minor rows costs 0.5 in total (the cap never touches major or standard); the cap applies per dimension, not per kind, so five minor labor rows plus one minor governance row cost 0.25 together, while five minor labor rows and five minor environmental rows cost 0.25 each.
- Cap before subtract unchanged (three ethics certifications and one major finding: 0.75); floor at 0 unchanged (two major rows and a standard row on a baseline shop); dedupe by kind and source page unchanged; a labor and a governance row on one page still count twice.
- An `llm` origin finding with no fields costs 0.125.
- Equivalence: when every row is major and self, the value equals the old flat rule, so the rule generalizes rather than replaces it.
- The response carries band, relation, cost per finding and the cap flag per dimension; the render tests check the "Counted as" line for each band and relation value, the cap parenthesis, and that no line shows a number other than the source's dollar figure.

`proxy/test/data.test.ts`: `penalty_usd` is a non-negative integer or `null`; a number on every `osha.gov` and `oag.ca.gov` row; `relation` and `status` in their sets; `related` and `related-at-shop` rows have a non-empty `note`; `open` rows have `null` penalty; `citation_type` present and in its set on every `osha.gov` row and absent elsewhere.

The plan's research-vs-live arithmetic test changes: `research/index.json` keeps the flat values (`research/build-index.mjs` is out of scope), so the live scorer can no longer be checked against it. Instead: (a) the subset test on row identity stays as planned; (b) the test pins the five worked examples above, computed by `ethics()` and `env()`, so a changed row or rule fails by name. In Phase B0 the pinned test runs on fixture rows copied from the table (the real rows do not exist yet); Phase B switches it to read `data/*.json`. `recompute.mjs` is the hand check for both: it reads the research index and the amounts table and must agree with the pinned values.

Phase C's offline replay recomputes the weighted values for the researched retailers that appear in the saved responses; it reports today's live state (four flat rows) against the weighted import, and may print the flat-57 state as a third column for the record. T1 to T4 do not change. No date enters the computation, so a replay gives the same answer whenever it runs.

## Consequences

- Scores do not depend on the date. Old findings cost as much as new ones until the age ADR lands (Uncommon Goods' 2006 row, Target's 2011 row, Walmart's 2013 row).
- Every imported row needs three more fields, four for OSHA rows, and the amount for the 18 OSHA rows and several court rows must be copied from the file bodies or read from the source page (Patagonia's 2023 row above shows the row itself lacks it). The import checklist in Phase B grows by those columns.
- Beyond four minor findings on a dimension, more rows are shown but not charged. A shop with twenty citations scores like one with four.
- The research files' `ethics` and `environment` values no longer match the site's; tiers are not shown (Q5), and the record link opens the file that explains its own arithmetic.
- ADR 0003's line "one negative finding moves a score by 0.075" becomes "at most 0.075". On acceptance `docs/ranking.md` (Components table, Baseline section, "Negative findings") must carry the band table with its costs (major 0.25, standard 0.125, minor 0.0625, halved for a `related` row, minor findings capped at 0.25 together), and `about.html:36-41` needs the new wording (already in Phase B's amendment list).
- A certified shop with many small findings keeps most of its score; a shop with one large finding loses the full step.

## Limitations

- **The band still follows each agency's penalty ceiling more than the harm.** The willful-or-repeat rule (ruling 3) lifts OSHA's own worst class to standard, but every OSHA row in the research today is `other` or `serious`, so in the current data every labor row from OSHA is minor while FTC, DOJ and EPA actions reach the major band as a matter of course. The weighting leans lighter on labor findings than on governance and environmental ones (review RV2). Known; the willful-or-repeat rule is the fix the operator chose for now.
- **The minor cap hides count.** It is deliberate (R10), but a shop with a long record of small violations reads the same as one with four.
- **No age discount yet** (RV1, deferred to its own ADR after Phase C).

## Rulings and review fixes

| Label | Question or finding | Ruling or fix (2026-09-26) |
|---|---|---|
| W1 | Thresholds $100,000 and $1,000,000; unstated amount is standard | Accepted as recommended |
| W2 | Age: halve at 5 years and stop, or step again at 10 years | Deferred with the age factor (ruling 1); own ADR after Phase C |
| W3 | Company size factor | Accepted as recommended: no |
| W4 | Depth cap: leave, or cap minor findings at 0.25 per dimension | Ruled: cap now (ruling 2), replacing the "leave" recommendation; answers R10 |
| W5 | Open complaints: minor band | Accepted as recommended |
| W6 | Azure Standard's address-tied OSHA rows: `related` | Accepted as recommended on 2026-09-26 (`related`, ethics 0.40625). Note: that recommendation predated the split in ruling 4. The three inspections are of a warehouse (`research/retailers/azurestandard-com.md:29`) that the patent-suit tie says belongs to the company selling through azurestandard.com, which reads closer to `related-at-shop` than to Depop's eBay case. **Operator ruling 2026-09-27: `related-at-shop` (full weight); the inspections are of the warehouse the shop ships from. Ethics is 0.3125 (0.5 − 3 × 0.0625).** |
| W7 | Relation: one 0.5 factor, or split parent and sister | Ruled: split by place, not by kind of relative (ruling 4): `related-at-shop` full, `related` half |
| RV1 | Age discount needs date plumbing and makes scores drift | Age removed from B0; future work |
| RV2 | Band tracks agency penalty ceilings; OSHA labor rows minor by construction | Willful or repeat OSHA citations are standard (ruling 3); `citation_type` field; the remaining bias is listed under Limitations |
| RV3 | `null` means "not stated", not "not recorded" | Reworded throughout; Walmart's stipulated order and Target's 2020 decree flagged for Phase B reading |
| RV4 | Patagonia's $5,000 is not in the repo | Recorded with its source in the worked example, with the value if left unrecorded; also in `recompute.mjs` |
| RV5 | Pinned test needs rows that do not exist in B0 | Fixtures in B0, `data/*.json` in Phase B |
| RV6 | Row counts and the $1,000,000 list | 55, 54, 53 with Overstock's undated row named; seven rows, six cases |
| RV7 | Prop 65 band uses the civil penalty only | Field definition and shopper line say so |
