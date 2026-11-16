# Record book pilot: method for the ten-chain run

Answer: run these steps per chain, in order, with no other route. Tried on Costco 2026-11-15.

## Status

- [x] Routes probed; Costco run (`docs/evidence/record-book/`)
- [x] Lead's review of the trial: two OSHA rows fetched again match the sheet; both known in-window Costco OSHA cases were found; the wage route returns rows with money owed (Costco, 2004 to 2008) and the FTC route returns a known 2022 case (Kohl's)
- [x] Name patterns probed for the nine other chains, then frozen (step 0)
- [x] Nine chains run, Walmart first (results: `docs/evidence/record-book/README.md`)
- [x] Second-agent check (`docs/evidence/record-book/check-rows.md`: 1 row of 787 mismatches, Walmart W204); comparison with held-back files (`docs/evidence/record-book/check-known-cases.md`: 5 of 7 known cases found, 2 left out as $0, none missed)
- [x] Owner ruled on AT4 (RB3, 2026-11-15): a company named with the chain's own name plus a company form counts as the chain, labeled "name as given; parent inferred from the name", at every chain (`docs/evidence/record-book/README.md`, "Rulings made"). The sheets stay as collected
- [x] Owner ruled on the threshold (RB1, 2026-11-16): the $100,000 line stands, shown with each chain's count of all cases and its cases per 100 stores; a chain under the line reads "no case of $100,000 or more", never "none found"
- [ ] Owner rules on back wages, AT2b, and agent-written claim wording. These are filters over rows already collected, so collection does not wait for them
- [ ] Owner takes advice on wording
- [ ] Owner reads every row that meets the chosen rule

## Fixed terms

| Term | Value |
|---|---|
| Window | Action dated 2021-11-15 to 2026-11-15 |
| Rule (chosen by the owner 2026-11-16) | Final penalty or settlement of $100,000 or more, per case. Every case is recorded; the rule filters |
| Row | S1: inspection with penalty above $0. S2: case with back wages or penalties above $0 ($0 cases in a side table). S3: case naming the chain's entity as respondent or defendant. S4: registry listing |

| Source | Final when | Action date |
|---|---|---|
| S1 OSHA | No live violation contested without a final order, and the case closed or every live violation has a final order | Latest final order, else latest issuance |
| S2 WHD | Assumed always (not stated by DOL) | `findings_end_date` |
| S3 FTC | Signed consent order, court judgment, or court-entered stipulated order | Order date |

## Attribution

Written before lookup; AT1's case numbers and AT2b added after the Costco trial.

| Rule | Accept | Label |
|---|---|---|
| AT1 | Parent or an Exhibit 21 subsidiary, allowing case, punctuation, "Corp", "Inc", a store number, place or state case number | Entity |
| AT2 | Banner plus store number, warehouse, depot or distribution center, naming no other employer | Name as given; entity inferred |
| AT2b | Bare banner name, only for a chain running its own stores whose banner is not a common word (so not Target, Best Buy) | Name as given; entity inferred |
| AT3 | Banner word plus another business (contractor, staffing agency, dealer, franchisee) | Excluded |
| AT4 | A business the chain runs that is not in Exhibit 21 | Excluded, owner to rule |
| AT5 | Anything else | Excluded |

- **Ace Hardware:** no AT2 or AT2b. Accept only Ace Hardware Corporation and Ace Retail Holdings LLC (company-owned stores) when named; "Ace Hardware" alone is excluded: "owner not shown; may be a dealer".
- **Sibling banners** (HomeGoods in TJX; Sam's Club in Walmart): a record at the banner counts for that banner, labeled with the parent. A company-wide parent order counts for each banner, labeled "parent <name>, which also runs <others>". Records at other banners, or at shared sites the source does not tie to the banner, are excluded.

## Rules for the run

- The attribution rules, the terms above and the scripts are frozen once step 0 is done. A row that fits no rule goes to "Excluded" with "owner to rule"; the rules are not changed to fit the data. If a script must change, stop and report.
- Walmart runs first: its inspection list is the longest, so a break in the penalties step shows early.
- One process makes the DOL calls, one call at a time.

## Step 0, once, before any chain

For each of the nine chains, find the names the sources use: one `query` per candidate pattern on OSHA inspections opened after 2024-11-15 in one state where the chain has stores, and one on WHD `trade_nm`; list the distinct names returned. Fix the patterns in step 2 from what is seen (bare "REI", "TARGET" and "LOWE'S" are the known risks), write the names seen and the final patterns to `docs/evidence/record-book/patterns.md`, then freeze them.

## Steps per chain

1. **Entities.** Fetch (always by `research/fetch-page.mjs`) `https://data.sec.gov/submissions/CIK<10 digits>.json`, the latest 10-K's `index.json`, then its `ex21` file. Ace and REI file no 10-K: use their annual report (one web search).
2. **Patterns.** Case-sensitive: OSHA names were upper case, WHD mixed. `%COSTCO%`, `%WAL-MART%`, `%WALMART%`, `%SAM'S CLUB%`, `%WAL MART%`, `%SAMS CLUB%`, `%HOME DEPOT%`, `%RECREATIONAL EQUIPMENT%`, `REI` (whole name), `%BEST BUY%`, `%DICK'S SPORTING%`, `%DICKS SPORTING%`, `%DICK'S%`, `%LOWE'S%`, `%LOWES%`, `%ACE HARDWARE%`, `%HOMEGOODS%`, `%HOME GOODS%`, `%TJX%`, `%TARGET%`; title case too for WHD. Frozen 2026-11-15 16:47 after the step 0 probe (`docs/evidence/record-book/patterns.md`). Known gap: names that put "REI" beside other words are missed; bare "TARGET" is found but excluded (AT2b).
3. **S1.** Per pattern: `node research/fetch-osha-dol.mjs query OSHA inspection --where '[["estab_name","like","<pattern>"],["open_date","gt","2020-11-15"]]' --page 1000 --sort-by activity_nr --save handoff/record-book/raw/dol/<chain>-osha-<n>.json`; over 10,000 rows, split by `open_date` year. Then `penalties --ids-from <file> --save ...` and `node docs/evidence/record-book/osha-claims.mjs <inspections> <violations>`. Run DOL calls singly, backgrounded, under `gtimeout 1500`; after about 8, expect HTTP 429 for up to 10 minutes.
4. **S2.** `query WHD enforcement` on `legal_name`, then `trade_nm`, both cases, no date filter.
5. **S3.** Fetch `https://www.ftc.gov/legal-library/browse/cases-proceedings?search=<name>&sort_by=search_api_relevance` and the same on `/news-events/news/press-releases`, adding `&page=1`, `&page=2` until results predate the window. Keep a result only if the chain's entity is respondent or defendant.
6. **S4.** Fetch `explore.changeclimate.org/brand/<slug>`; fetch the Fair Trade page, worker co-op directory and Grassroots list once and search them for each name. B Corp and 1% for the Planet: one domain-limited web search each, reported "not shown either way". Never fetch a refused page another way.
7. **Sheet.** Every case goes in `docs/evidence/record-book/<chain>-cases.tsv` (the columns of `trial-costco.md`, without the proposed claim). `docs/evidence/record-book/<chain>.md` holds: the gate; the entities; counts per source, with S1 and S2 cases also counted in three bands (under $10,000; $10,000 to under $100,000; $100,000 or more), final and not final apart, and the final total; "checked, none found" with what was searched; a claims table for cases of $10,000 or more only; excluded rows. The $10,000 line only keeps the page readable. It is not a second rule.
8. **Time.** `date` at start and end; log calls, and log time spent waiting on the rate limit apart from working time.

## Checks after the run

1. **Second agent.** One that collected no rows re-fetches every row by case id and checks each column and exclusion; mismatches are tabled, not fixed.
2. **Comparison.** Then a third agent lists known in-window cases for the ten chains from `data/negatives.json`, `research/retailers/` and the other held-back files, counting found, missed (with why) and excluded.

## Failure bars (ST1, `docs/path-forward.md`)

- Over 3 hours a chain.
- More than one claim tied to the wrong company.
- Records differ in fewer than 2 of 3 peer groups (Walmart, Target, Costco; Home Depot, Lowe's; REI, DICK'S).

## Gates on display

- Nothing shows until the owner has read every row that meets the chosen rule and taken advice on wording of findings and "checked, none found".
- Claims are agent-written; ADR 0004 shows only the source's own title, so the owner rules first.
- Shown only, no effect on order, with "Dispute this". S1 rows need a public link; the API link needs a key.
