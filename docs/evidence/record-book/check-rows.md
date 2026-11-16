# Record book: second-agent row check

Answer: 787 rows and side-table cases checked against their sources (712 OSHA, 66 wage and hour, 3 FTC, 6 certification listings), plus 12 "none found" registry pages; 1 row mismatches its source (Walmart W204, FTC $3,000,000 order: the posted order carries the judge's signature, so it is final under G10's own test and meets the proposed rule), plus 2 text errors in sheet notes. Wrong-company rows: 1 likely (Walmart W156, $850, labeled Walmart Inc. but likely Wal-Mart Puerto Rico, Inc., another Walmart company), 0 tied to an unrelated business.

Checked 2026-11-15 by an agent that collected none of the rows. Raw replies and scripts: `handoff/record-book/raw/check/` (git-ignored). Saved raw replies of the first run were not used as evidence.

## S1 OSHA (712 case ids: every accepted and excluded row)

Re-fetched: violations with `penalties` (19 calls of up to 40) and inspection records with `query OSHA inspection` and an `in` filter on `activity_nr` (19 calls of up to 40). Amount, action date and final status recomputed with `summarizeInspection` from `research/fetch-osha-dol.mjs`. Name compared exactly; address compared ignoring letter case (the sheets title-case the DOL text). Control: comparing each sheet name with the next row's source name matched 93 of 708 (repeated names such as "TARGET CORPORATION"), so the name check does catch differences.

| Chain | Rows checked (accepted + excluded) | Amount | Action date | Final, and "was contested" | Meets rule (accepted rows) | Name as given | Address |
|---|---|---|---|---|---|---|---|
| Costco | 41 + 3 | 44 | 44 | 44 | 41 | 41 (excluded 3 not compared) | 41 (excluded 3 not compared) |
| Walmart | 191 + 28 | 219 | 219 | 219 | 191 | 219 | 219 |
| Home Depot | 122 + 1 | 123 | 123 | 123 | 122 | 123 | 123 |
| Lowe's | 66 + 11 | 77 | 77 | 77 | 66 | 77 | 77 |
| Target | 82 + 35 | 117 | 117 | 117 | 82 | 117 | 117 |
| Best Buy | 17 + 2 | 19 | 19 | 19 | 17 | 19 | 19 |
| DICK'S | 11 + 3 | 14 | 14 | 14 | 11 | 14 | 14 |
| REI | 6 + 0 | 6 | 6 | 6 | 6 | 6 | 6 |
| HomeGoods | 20 + 18 | 38 | 38 | 38 | 20 | 38 | 38 |
| Ace Hardware | 4 + 51 | 55 | 55 | 55 | 4 | 55 | 55 |
| Total | 560 + 152 | 712 of 712 | 712 of 712 | 712 of 712 | 560 of 560 | 709 of 709 | 709 of 709 |

For Costco's 3 excluded ids the sheet gives no amount, date, name or address, so only the window reason was checked (below).

Every inspection and every case's violation rows came back. `delete_flag` takes only two values in the replies ("X" on 219 violation rows, empty on 1,499), so "not deleted" and "no delete_flag" give the same sums.

Costco's three excluded ids (345036594, 345312805, 345366157), named in `trial-costco.md` but not in its table, were fetched as well (2 calls): action dates 2021-02-04, 2021-07-13 and 2021-09-13, all final, so "Final before the window" holds. Excluded rows the other sheets only count (before-window exclusions, Costco's three Innovel inspections with no penalty) have no ids on the sheets and were not checked.

Markdown claim tables (146 rows across the nine chain sheets) were diffed against their TSV rows column by column: no differences. Costco's four Washington rows sharing the final order date 2026-03-16 (C1, C29, C31, C38) are as the source gives them; a fifth case (Walmart W173, Redding, CA) has the same date.

## S2 wage and hour (66 cases)

Filtered by `case_id` with an `in` filter (2 calls), so no name query was needed.

| Chain | TSV rows (accepted + excluded) | $0 and undated side-table cases | Back wages, penalties, end date, names, address matched |
|---|---|---|---|
| Costco | 0 | 3 | all (city in upper case in the source; case only) |
| Walmart | 10 + 4 | 23 | all |
| Home Depot | 3 + 0 | 4 | all |
| Lowe's | 1 + 0 | 6 | all |
| Target | 1 + 2 | 3 | all |
| DICK'S | 0 + 1 | 0 | all |
| REI | 1 + 0 | 0 | all |
| HomeGoods | 0 + 1 | 1 | all |
| Ace Hardware | 0 + 2 | 0 | all |

The four undated cases (2005414, 5095165, 5093687, 5096722) have no `findings_start_date` or `findings_end_date` and $0, as the sheets say.

## S3 FTC (Walmart, 3 rows)

Case pages re-fetched; the two order PDFs whose court entry was in question were fetched and their signature pages read.

| Row | Date | Amount | Defendant | Final reading under G10 (label "Entered by the Court" or court's signature in the PDF) |
|---|---|---|---|---|
| W202 (232 3055) | match (2026-03-03) | match | match | match: order labeled "Entered by the Court" |
| W203 (182 3012) | match (2025-06-20) | match | match | match: docket 102-1, "SO ORDERED this ___ day of ______, 2025" left blank, no signature |
| W204 (2023173) | match (2022-04-08) | match: order section III, "Judgment in the amount of Three Million Dollars ($3,000,000)", page 8; case page says Kohl's and Walmart pay "$2.5 million and $3 million, respectively" | match | mismatch: docket 3 page 13 reads "SO ORDERED this 8 day of April, 2022" with a handwritten signature over "UNITED STATES DISTRICT JUDGE" |

All three case pages show "Case Status: Pending", which G10 says to ignore.

## S4 certifications

| Item | Result |
|---|---|
| W205 Walmart, W206 Sam's Club, W207 Walmart Canada, R9 REI, C42 Costco (Fair Trade brand tiles) | match: tiles and link targets as stated |
| R8 REI (Climate Label) | match: certified, first certified 2021, current certification year 2026 |
| Climate Label "Brand Not Found" for the 9 other slugs (walmart, home-depot, lowes, target, best-buy, dicks-sporting-goods, homegoods, ace-hardware, costco) | match |
| Worker co-op directory and Grassroots list: none of the ten chains | match (name search of saved HTML and text). Controls: Rainbow, Equal Exchange and Box Dog each found once in the co-op page; the Grassroots page holds 525 logo file names (for example alpenglow-sports, appalachian-outfitters) |
| Fair Trade page: a "Member's Mark" tile links to samsclub.com/content/fair-trade | not on the Walmart sheet; a second Sam's Club listing the sheet likely missed (not a row mismatch) |
| B Corp and 1% for the Planet | not re-checked: the fetch script is refused there, and 20 chain-registry pairs would need 20 searches against a cap of 5 |

## Mismatches

| Chain | Row | Column | Sheet value | Source value | Likely cause |
|---|---|---|---|---|---|
| Walmart | W204 (FTC 2023173) | Final | "no: court entry not shown on ftc.gov (gap G10)" | Order PDF posted on ftc.gov is signed and dated by the judge, 2022-04-08 | The signature page (page 13 of 16) was likely not read; G10's own test makes this final |
| Walmart | W204 | Meets rule | no | yes ($3,000,000, final, in the window) | Follows from the row above; Walmart then has two findings, and the S3 count line reads 2 final, 1 not final |
| Lowe's | sheet text, S1 counts | "6 are dated before the window" | 5 before the window; L27 (348341207, $5,025) has action date 2026-11-18, after the window end | Wording; the count of 60 in the window is right. The final order date is three days after this check and after the 2026-11-13 data load |
| Ace | sheet note | "Westlake and Great Lakes rows are excluded" | Only a Westlake row exists; "GRAND LAKE ACE HARDWARE, INC." (348792136, Piedmont, CA) is a dealer row under the dealer reason | Likely a name mix-up in the note |

## Attribution (step 2)

Judged every row's "Legal entity" and "Why it belongs" against AT1 to AT5, AT2b, the Ace and sibling rules, and each sheet's entity list. Inspection mail addresses (not used by the collector) were read as extra evidence.

### A. Accepted rows likely tied to the wrong company

| Chain | Row | Case id | Amount | Name as given | Sheet entity | Read |
|---|---|---|---|---|---|---|
| Walmart | W156 | 345688592 | $850 | WALMART SUPERCENTER #2423, Carolina, PR | Walmart Inc. (inferred), AT2 | AT2 as written accepts it, but the record's mail address (PMB 725, PO Box 4960, Caguas, PR) is the one on all 7 "WAL-MART PUERTO RICO, INC." rows the sheet excludes under AT4. The employer is likely Wal-Mart Puerto Rico, Inc. Still a Walmart business, so likely not "wrong company" for the failure bar, but the row conflicts with the AT4 exclusions |
Checked and likely right: HomeGoods G8 (348922378, $9,458, "HOME GOODS LLC", Vernon Hills, IL), which the collector flagged. Its industry code (NAICS 453998) and staff count (52) match accepted HomeGoods store rows G1, G3, G11 and G14 (453998; 33 to 50 staff). Whether a HomeGoods store is at 901 North Milwaukee Avenue was not checked.

Industry-code screen: the NAICS code of every accepted S1 row was tabled per chain. Odd codes appear (for example W36 landscaping 561730, W156 furniture stores 442110, T71 snack bars 722515, H98 equipment repair 811411, L29 building construction 236220), but each of those rows names the chain's own entity or banner, and inspectors' codes vary. No accepted row's name and code together point to another business; likely none is tied to an unrelated company.

### B. Accepted rows that fit no rule, or fit only by a reading

| Chain | Row | Read |
|---|---|---|
| Walmart | W207 (Walmart Canada, Fair Trade tile) | AT1 only if Exhibit 21 lists Wal-Mart Canada Corp.; the sheet's entity list names US entities only. Not checked |
| Walmart, REI, Costco | W205, W206, W207, R8, R9, C42 | S4 listings cite AT2b ("banner name linking to the chain's own site"). AT2b is written for records naming a bare banner; its use for registry tiles is a reading, not covered by a method-gaps id |
| HomeGoods | G2, G6, G9, G10, G12, G13, G14, G16 | "HomeGoods, Inc." and "HomeGoods Corporation" read as suffix variants of HomeGoods, LLC (G20) |
| Lowe's | L6, L13, L45, L54 (Lowe's Home Centers, Inc.); L60 (Lowe's Companies, LLC) | Suffix variants read under AT1 (G20) |
| Lowe's | L57 (LOWE'S HOME CENTERS LLC STORE 2481) | Labeled AT2, but the name is the AT1 entity; label only |

### C. Excluded rows a rule may accept

None that a rule as written accepts. Rows where the record points at the chain and the owner may want to look:

| Chain | Case id | Amount | Name as given | Rule applied | Read |
|---|---|---|---|---|---|
| Ace | 348296708 | $5,296 | ACE HARDWARE DISTRIBUTION CENTER, West Jefferson, OH | Ace rule (no AT2) | Excluded as written; a distribution center is likely Ace Hardware Corporation's, not a dealer's |
| Lowe's | 348610817, 346216914, 347480063, 346654338 | $13,240; $2,100; $5,600; $10,000 | LOWE'S HOME IMPROVEMENT, LLC and variants | "none: fits no rule" | The bare form "LOWE'S HOME IMPROVEMENT" is accepted under AT2b (L15, L18, L21, L30, L40, L51); adding "LLC" excludes it. 348610817's mail address is Lowe's head office (1000 Lowe's Blvd, Mooresville, NC). AT4 would be the closer label; rule unclear, no method-gaps id |
| Target | 348671512, 348338179, 347712705, 346361587, 346011885 | $8,390 to $11,522 | TARGET STORES, INC. | AT4 | All five mail addresses are Target head office (Nicollet Mall or Target Parkway, Minneapolis area); AT4 as written still excludes |
| Target | 348439597, 347479008 | $15,960; $450 | SUPER TARGET; TARGET | Not AT2b (G25) | Mail addresses are Target head office; excluded by the plan's denial of AT2b for Target |
| Walmart | 28 AT4 rows | up to $36,935 | WAL-MART ASSOCIATES, PUERTO RICO, TRANSPORTATION, LOUISIANA, ROBOTICS | AT4 (G20) | Excluded as written, owner to rule |
| Target, Walmart | 348081464, 347396681, 347012312, 346838162; S2 1963272 | | TARGET PIPING CORP.; CURTISS WRIGHT TARGET ROCK; Shahs Halal Food Walmart LLC | "none: fits no rule" | Other businesses; AT5 (or AT3 for the Walmart S2 case) fits. Label only; exclusion stands |

The HomeGoods sibling exclusions (18 OSHA, 1 WHD) follow the rule as written; none of the records names HomeGoods.

## Arithmetic

Recounted from each TSV (Costco from its markdown table): cases in the window per source, the three bands, final and not final, meets rule and final total. Every number matches its markdown, for all ten sheets. The only change needed is the one W204 causes in `walmart.md` (S3: 2 final, 1 not final; meets the rule: 2). Excluded-table counts and their "$10,000 or more" case ids also match the TSVs.

## Not checked

| Item | Why |
|---|---|
| Exhibit 21 and annual report entity lists | Outside the brief; W207 and the AT4 calls rest on them |
| B Corp and 1% for the Planet | Fetch refused in the first run; no web search spent |
| FTC "checked, none found" searches for the other nine chains | The brief named the Walmart case pages only |
| Whether a HomeGoods store is at 901 North Milwaukee Avenue, Vernon Hills, IL (G8) | Would need a web search or the store locator |
| Rows the patterns cannot find (misses) | For the third agent's comparison |

No 429 was returned, and no fetched page or API reply contained text addressed to an agent.

Four shell commands were refused by the session's permission check; each read was done another way, with no change in the data reached:

| Refused | Done instead |
|---|---|
| `awk` loop over the TSVs | node script `sheets.mjs` |
| `grep` piped to `cut` over the sheets | node one-liner |
| shell `for` loop over saved FTC page text | node script `grep-pages.mjs` |
| `pdftotext` on the two FTC order PDFs | the Read tool on PDF pages 1, 7, 8, 10, 11, 13 and 14 |

## Time

| Item | Value |
|---|---|
| Start | 2026-11-15 19:07 |
| End | 2026-11-15 20:16 |
| DOL calls | 40 (19 violation, 19 inspection, 2 wage and hour), 19:08 to 20:12 |
| Waiting on the rate limit | 60 minutes (six planned 10 minute pauses; no 429 seen) |
| Working time apart from waiting | about 8 minutes (most page checks and attribution reading ran during the pauses) |
