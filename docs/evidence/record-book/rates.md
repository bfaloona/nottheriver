# Record book: OSHA case rates per store and per worker

Answer: size explains much of the raw spread but likely not all of it. Across the ten chains, OSHA cases of any size (NM1) run from 4 to 182, a 45-fold spread; per 100 US stores they run from 1.33 (Best Buy) to 6.34 (Costco), a 4.8-fold spread whose end intervals do not overlap, so by the lead agent's bar (RT2) the call is "more than size". Per US worker, only Walmart, Home Depot and Costco publish a US headcount; among them NM1 is "mostly size" (2.4-fold) and cases of $10,000 or more (NM2) are "more than size" (Home Depot 4.5 times Walmart). NM2 per store is "cannot tell" as the bar is written, because the lowest rate is Ace's (1 case, a weak rate); without Ace it is "more than size". Ranking by rate often reverses ranking by count (RT1): in the Walmart, Target, Costco group, Walmart has the most cases and the lowest rate on every measure; Home Depot stays above Lowe's on every measure; REI moves above DICK'S per store on NM1 only, from 5 cases and a store count that is a floor. These rates cannot test the proposed $100,000 rule, and the limits below (distribution centers, state-run programs, one year-end store count, complaint-driven inspections) could move any of these calls. Computed 2026-11-15 by [rates.mjs](rates.mjs) from [rates-denominators.tsv](rates-denominators.tsv).

## Fixed before lookup

Written 2026-11-15 before any denominator was fetched or any numerator counted. These terms were set by the lead agent, copied here as given, and are not changed to fit the data. Where a term cannot be applied, the gap is stated below under "What could not be done".

### Numerators

OSHA rows only (Source S1), action date in the window (2021-11-15 to 2026-11-15).

| Term | Definition |
|---|---|
| NM1 | Cases of any size |
| NM2 | Cases of $10,000 or more |
| NM3 | Total penalty dollars |

Each in two versions:

- **As accepted:** rows whose Row is not "excluded".
- **Held rows added back:** the accepted rows plus in-window excluded rows that name the chain itself and were excluded only because of an attribution rule the owner has not ruled on: AT4 ("owner to rule", for example Walmart companies missing from its subsidiary list), the bare banner name exclusions under AT2b (Target, Best Buy), and "TARGET STORES, INC.". Never added back: rows naming another business (AT3), AT5 rows, rows outside the window, $0 rows.
- **HomeGoods:** the excluded TJX rows are not added back, because the search patterns did not look for TJX's other store names, so a TJX-wide count would be incomplete. Report how many there are, and no "added back" rate.
- For every chain, table the distinct exclusion reasons found in its file with a row count each, and mark which were added back, so a reader can check the sorting.

### Denominators

- **DN1, US stores:** the number of US stores at the latest fiscal year-end in the company's latest annual filing, for the store names the frozen patterns search for (so Walmart includes Sam's Club; HomeGoods is that banner only; a chain's other banners that the patterns do not search for are left out). State per chain exactly which line of the filing was used and what it includes.
- **DN2, US workers:** only where the filing states a US figure, or states that substantially all workers are in the US. Otherwise "not published" and no rate. No estimates, and no figures from news sites or Wikipedia. A worldwide figure may be listed in a separate column marked "not used".
- **Ace:** its accepted cases cover only two corporate entities (see the plan), not dealer-owned stores. Report Ace's counts and no rate, unless the filing gives a count of company-owned stores, in which case say what it is and still flag the rate as weak.
- Every denominator carries: the figure, the source URL, the filing date, and where in the document it sits (section or table name).

### Rates

- Cases per 100 US stores and per 10,000 US workers, for NM1 and NM2, both versions.
- For each rate, a 95% interval treating the case count as a Poisson count (exact interval).
- Any chain with fewer than 10 cases is flagged "small count".

### Readout

These bars are the lead agent's, not the owner's.

- **RT1, peer groups:** the pilot's groups are (Walmart, Target, Costco), (Home Depot, Lowe's), (REI, DICK'S). For each group, each of NM1 and NM2, and each denominator available: is the order of the chains by rate the same as their order by raw count? Tabled.
- **RT2, spread:** across the chains that have a rate, the ratio of the highest to the lowest raw count and the ratio of the highest to the lowest rate. "Mostly size" if the rate ratio is under 3; "more than size" if the rate ratio is 3 or more and the 95% intervals of the highest and lowest chains do not overlap; otherwise "cannot tell".
- These rates cannot test the proposed $100,000 rule itself: cases that large are 0 to 2 per chain, and Walmart's are FTC cases, not OSHA.

### Limits to name, not fix

- Many cases are at distribution centers, not stores.
- State-run safety programs inspect at different rates, and the chains are spread across states differently.
- The store count is one year-end while cases span five years.
- Inspections often start from complaints.

## Denominators

Full lines and notes are in [rates-denominators.tsv](rates-denominators.tsv). Saved copies of the 10-Ks are in `handoff/record-book/raw/pages-rates/` (not in the repo); the REI and Ace pages are in `handoff/record-book/raw/pages-annual/`.

| Chain | DN1 US stores | What it includes | DN2 US workers | Worldwide or other figure (not used) | Source | Filed | Where |
|---|---|---|---|---|---|---|---|
| Walmart | 5,212 | Walmart U.S. 4,611 + Sam's Club U.S. 601 retail units, incl. Puerto Rico; International left out | 1,600,000 ("approximately 1.6 million associates in the U.S.") | ~2.1 million | [10-K](https://www.sec.gov/Archives/edgar/data/104169/000010416926000055/wmt-20260131.htm) | 2026-03-13 | Item 2 Properties, "Owned and Leased Properties"; Item 1 Human Capital Management |
| Home Depot | 2,035 | "Total U.S." stores, Primary segment, incl. Puerto Rico, USVI, Guam; SRS locations, Canada, Mexico left out | 422,500 (United States row) | ~472,400 | [10-K](https://www.sec.gov/Archives/edgar/data/354950/000162828026019436/hd-20260201.htm) | 2026-03-18 | Item 2 Properties, U.S. store table; Item 1 "Our Workforce" table |
| Target | 1,995 | "Stores as of January 31, 2026", Total | not published | ~415,000 | [10-K](https://www.sec.gov/Archives/edgar/data/27419/000002741926000016/tgt-20260131.htm) | 2026-03-11 | Item 2 Properties; Item 1 Human Capital |
| Lowe's | 1,759 | "stores and outlets in the United States"; 540+ branch locations left out | not published ("primarily in the United States and India") | ~276,000 | [10-K](https://www.sec.gov/Archives/edgar/data/60667/000006066726000029/low-20260130.htm) | 2026-03-23 | Item 2 Properties; Item 1 Our People |
| Costco | 647 | "United States and Puerto Rico" warehouses | 232,000 (United States row) | 355,000 | [10-K](https://www.sec.gov/Archives/edgar/data/909832/000090983226000093/cost-20260830.htm) | 2026-10-07 | Item 2 Properties, Warehouse Properties; Item 1 Human Capital, Employee Base |
| HomeGoods | 963 | HomeGoods banner only; Homesense (79) left out | not published (TJX-wide only) | ~377,000 (all TJX) | [TJX 10-K](https://www.sec.gov/Archives/edgar/data/109198/000010919826000008/tjx-20260131.htm) | 2026-03-31 | Item 7 MD&A, HomeGoods "Stores in operation at end of period" |
| Best Buy | 904 | "Total Domestic store count" 926 less 20 Pacific Sales and 2 Yardbird (footnoted banners the patterns do not search); 18 Outlet Centers kept on the assumption that they trade under the Best Buy name, which the filing does not state (its Item 7 "Store Summary" lists "Best Buy" 886 and "Outlet Centers" 18 apart). At 886 the NM1 rate is about 1.35 and no call changes | not published ("U.S. and Canada") | ~82,000 | [10-K](https://www.sec.gov/Archives/edgar/data/764478/000076447826000009/bby-20260131.htm) | 2026-03-18 | Item 2 Properties, Domestic Stores |
| DICK'S | 721 | "Total DICK'S" ending stores (DICK'S 644, Field House 42, House of Sport 35), all US; Golf Galaxy, Going Going Gone!, Public Lands, Foot Locker left out | not published (no US figure; Foot Locker not subtracted) | ~105,200 | [10-K](https://www.sec.gov/Archives/edgar/data/1089063/000108906326000007/dks-20260131.htm) | 2026-03-27 | Item 7 MD&A store count table; Item 2 shows the 888 DICK'S Business stores are all US |
| REI | 190 (floor) | "more than 190 retail stores located throughout the United States" | not published (12,478 employees, no US statement) | 12,478 | [Financial statements](https://www.rei.com/dam/25671793_rei-fy25-issued-financial-statements-2.pdf); workers from [rei.com/impact](https://www.rei.com/impact) | 2026-03-26 (auditor's report) | Note 1(a) Business Overview |
| Ace | 268 (weak) | Stores run by Ace Retail Holdings LLC (company-owned); dealer stores left out | not published | none found | [Results release](https://newsroom.acehardware.com/2026-02-18-ACE-HARDWARE-REPORTS-FOURTH-QUARTER-AND-FULL-YEAR-2025-RESULTS) | 2026-02-18 | Retail segment paragraph |

Notes:

- Ace: the 268 is from the year-end results release, not an annual filing; the 2025 annual report page returned 403 (a challenge page) in the earlier run and was not retried. Ace's 4 accepted cases all name Ace Hardware Corporation, not Ace Retail Holdings, so the cases and the stores are different parts of the company. Its rate is computed and flagged weak.
- Home Depot's US worker figure is company-wide and likely includes SRS staff, whom the patterns do not search for.
- REI: "more than 190" is a floor, so REI's per-store rates are ceilings.

## Numerators

OSHA rows (S1) with a penalty above $0, action dated 2021-11-15 to 2026-11-15. NM3 is total penalty dollars on the NM1 rows.

| Chain | NM1 as accepted | NM2 as accepted | NM3 as accepted | NM1 added back | NM2 added back | NM3 added back |
|---|---|---|---|---|---|---|
| Walmart | 182 | 40 | $1,362,187 | 210 | 45 | $1,530,591 |
| Home Depot | 114 | 48 | $1,642,421 | 115 | 48 | $1,644,921 |
| Target | 82 | 20 | $862,355 | 89 | 22 | $911,747 |
| Lowe's | 60 | 7 | $309,192 | 64 | 9 | $340,132 |
| Costco | 41 | 7 | $251,669 | 41 | 7 | $251,669 |
| HomeGoods | 20 | 7 | $367,958 | none: 18 TJX rows held, not added back | | |
| Best Buy | 12 | 6 | $114,357 | 12 | 6 | $114,357 |
| DICK'S | 10 | 4 | $106,685 | 10 | 4 | $106,685 |
| REI | 5 | 1 | $37,193 | 5 | 1 | $37,193 |
| Ace | 4 | 1 | $61,015 | 5 | 1 | $66,575 |

Parse check: "as accepted" NM1 matches the first number in the OSHA / wage / FTC column of [README.md](README.md) for all ten chains (no differences). The README's "$10,000 or more" column counts all sources: Walmart's 46 is 40 OSHA plus 3 wage and 3 FTC cases, and Target's 21 is 20 OSHA plus 1 wage case; the other eight equal NM2. Every Amount cell parsed; Costco's were read from "$1,234" text in its sheet.

### Exclusion reasons

Every excluded OSHA row in each chain's file, as the file words it. "In window" means dated in the window with a penalty above $0.

**Walmart** ([walmart-cases.tsv](walmart-cases.tsv))

| Reason | Rows | In window | Sorted as | Names given |
|---|---|---|---|---|
| AT4: A Walmart-named company not in Exhibit 21; owner to rule | 28 | 28 | added back: 28 | WAL-MART ASSOCIATES INC (and spellings), WAL-MART PUERTO RICO INC, WAL-MART TRANSPORTATION LLC, WAL-MART LOUISIANA LLC, WALMART ADVANCED SYSTEMS - ROBOTICS INC |

**Home Depot** ([homedepot-cases.tsv](homedepot-cases.tsv))

| Reason | Rows | In window | Sorted as | Names given |
|---|---|---|---|---|
| AT4: A Home Depot-related business not in Exhibit 21 under that name; owner to rule | 1 | 1 | added back: 1 | THE HOME DEPOT PUERTO RICO INC |

**Target** ([target-cases.tsv](target-cases.tsv))

| Reason | Rows | In window | Sorted as | Names given |
|---|---|---|---|---|
| AT5: Another business with Target in its name, or Target words with another business named | 24 | 24 | not added back: 24 | TARGET METAL BLANKING, TARGET STEEL, TARGET 10 CONSTRUCTION and 14 more names |
| AT4: A Target-named company not in Exhibit 21; owner to rule | 5 | 5 | added back: 5 | TARGET STORES, INC (and with period) |
| Not AT2b: Bare banner name; the plan denies AT2b for Target (common word) | 2 | 2 | added back: 2 | SUPER TARGET; TARGET |
| none: Fits no rule; owner to rule | 4 | 4 | not added back: 4 (other businesses) | TARGET PIPING CORP.; CURTISS WRIGHT TARGET ROCK |

**Lowe's** ([lowes-cases.tsv](lowes-cases.tsv))

| Reason | Rows | In window | Sorted as | Names given |
|---|---|---|---|---|
| none: Fits no rule; owner to rule | 4 | 4 | added back: 4 (sorting call, below) | LOWE'S HOME IMPROVEMENT, LLC; 67007 - LOWES HOME IMPROVEMENT LLC; LOWES HOME IMPROVEMENT CENTERS, LLC. |
| AT5: Another business with Lowe or Lowes in its name | 6 | 6 | not added back: 6 | LOWE'S MARKET; LOWES FOODS; LOWEST PRICE AUTO SALES; FELLOWES |
| AT3: Banner word with another business named | 1 | 1 | not added back: 1 | LOWES ROOFING AND REMODELING LLC |

Sorting call: the four "none" rows name Lowe's own company form missing from Exhibit 21, which the Walmart and Target files label AT4, so they are added back. Without them, Lowe's "added back" equals "as accepted" (NM1 60, NM2 7, $309,192).

**Costco** ([trial-costco.md](trial-costco.md)): no TSV. Rows were parsed from the sheet's claims table. Its excluded rows are summarized there, not listed: 3 Innovel inspections with no penalty (AT4), 3 rows before the window, 173 inspections with no penalty. None has a penalty in the window, so nothing is added back.

**HomeGoods** ([homegoods-cases.tsv](homegoods-cases.tsv))

| Reason | Rows | In window | Sorted as | Names given |
|---|---|---|---|---|
| SIB-excluded: TJX or another TJX banner; the source does not tie the record to HomeGoods (sibling rule) | 18 | 18 | held, not added back: 18 | THE TJX COMPANIES INC (several spellings), THE TJX COMPANIES INC DBA TJ MAXX and 3 more |

**Best Buy** ([bestbuy-cases.tsv](bestbuy-cases.tsv)): no bare-banner exclusions in the file, so its two versions are equal.

| Reason | Rows | In window | Sorted as | Names given |
|---|---|---|---|---|
| AT5: Another business with Best Buy in its name, or Best Buy words with another business named | 2 | 2 | not added back: 2 | BEST BUY SHUTTERS LLC; BEST BUY AUTO SALES LLC |

**DICK'S** ([dicks-cases.tsv](dicks-cases.tsv))

| Reason | Rows | In window | Sorted as | Names given |
|---|---|---|---|---|
| AT5: Another business with Dick's or Dicks in its name | 3 | 3 | not added back: 3 | MARKQUART RV DICK'S LLC; HADDICK'S TOWING, LLC; DICK'S ROOF REPAIR SERVICE, INC. |

**REI** ([rei-cases.tsv](rei-cases.tsv)): no excluded OSHA rows.

**Ace** ([ace-cases.tsv](ace-cases.tsv))

| Reason | Rows | In window | Sorted as | Names given |
|---|---|---|---|---|
| Ace rule: Owner not shown; may be a dealer | 50 | 50 | not added back: 50 | dealer-style names, e.g. GRAND LAKE ACE HARDWARE, INC.; PELLICCI INC DBA ACE HARDWARE |
| Ace rule: A chain the 2026-02-18 release places under Ace Retail Holdings, but the record does not name Ace Hardware Corporation or Ace Retail Holdings LLC; owner to rule | 1 | 1 | added back: 1 (sorting call: a company-owned Ace chain held for the owner) | WESTLAKE ACE HARDWARE |

## Rates

Exact 95% Poisson intervals on the case count, scaled by the denominator. "Small count" marks a count under 10.

### Cases per 100 US stores

| Chain | Version | NM1 cases | NM1 rate (95% interval) | NM2 cases | NM2 rate (95% interval) | Flags |
|---|---|---|---|---|---|---|
| Walmart | as accepted | 182 | 3.49 (3.00 to 4.04) | 40 | 0.77 (0.55 to 1.05) | |
| Walmart | added back | 210 | 4.03 (3.50 to 4.61) | 45 | 0.86 (0.63 to 1.16) | |
| Home Depot | as accepted | 114 | 5.60 (4.62 to 6.73) | 48 | 2.36 (1.74 to 3.13) | |
| Home Depot | added back | 115 | 5.65 (4.67 to 6.78) | 48 | 2.36 (1.74 to 3.13) | |
| Target | as accepted | 82 | 4.11 (3.27 to 5.10) | 20 | 1.00 (0.61 to 1.55) | |
| Target | added back | 89 | 4.46 (3.58 to 5.49) | 22 | 1.10 (0.69 to 1.67) | |
| Lowe's | as accepted | 60 | 3.41 (2.60 to 4.39) | 7 | 0.40 (0.16 to 0.82) | small count (NM2) |
| Lowe's | added back | 64 | 3.64 (2.80 to 4.65) | 9 | 0.51 (0.23 to 0.97) | small count (NM2) |
| Costco | as accepted | 41 | 6.34 (4.55 to 8.60) | 7 | 1.08 (0.43 to 2.23) | small count (NM2) |
| Costco | added back | 41 | 6.34 (4.55 to 8.60) | 7 | 1.08 (0.43 to 2.23) | small count (NM2) |
| HomeGoods | as accepted | 20 | 2.08 (1.27 to 3.21) | 7 | 0.73 (0.29 to 1.50) | small count (NM2) |
| Best Buy | as accepted | 12 | 1.33 (0.69 to 2.32) | 6 | 0.66 (0.24 to 1.44) | small count (NM2) |
| Best Buy | added back | 12 | 1.33 (0.69 to 2.32) | 6 | 0.66 (0.24 to 1.44) | small count (NM2) |
| DICK'S | as accepted | 10 | 1.39 (0.67 to 2.55) | 4 | 0.55 (0.15 to 1.42) | small count (NM2) |
| DICK'S | added back | 10 | 1.39 (0.67 to 2.55) | 4 | 0.55 (0.15 to 1.42) | small count (NM2) |
| REI | as accepted | 5 | 2.63 (0.85 to 6.14) | 1 | 0.53 (0.01 to 2.93) | small count; store count is a floor, rate is a ceiling |
| REI | added back | 5 | 2.63 (0.85 to 6.14) | 1 | 0.53 (0.01 to 2.93) | small count; store count is a floor, rate is a ceiling |
| Ace | as accepted | 4 | 1.49 (0.41 to 3.82) | 1 | 0.37 (0.01 to 2.08) | small count; weak (cases and stores are different parts of the company) |
| Ace | added back | 5 | 1.87 (0.61 to 4.35) | 1 | 0.37 (0.01 to 2.08) | small count; weak |

### Cases per 10,000 US workers

Only three chains publish a US worker figure.

| Chain | Version | NM1 cases | NM1 rate (95% interval) | NM2 cases | NM2 rate (95% interval) | Flags |
|---|---|---|---|---|---|---|
| Walmart | as accepted | 182 | 1.137 (0.978 to 1.315) | 40 | 0.250 (0.179 to 0.340) | |
| Walmart | added back | 210 | 1.313 (1.141 to 1.503) | 45 | 0.281 (0.205 to 0.376) | |
| Home Depot | as accepted | 114 | 2.698 (2.226 to 3.241) | 48 | 1.136 (0.838 to 1.506) | |
| Home Depot | added back | 115 | 2.722 (2.247 to 3.267) | 48 | 1.136 (0.838 to 1.506) | |
| Costco | as accepted | 41 | 1.767 (1.268 to 2.397) | 7 | 0.302 (0.121 to 0.622) | small count (NM2) |
| Costco | added back | 41 | 1.767 (1.268 to 2.397) | 7 | 0.302 (0.121 to 0.622) | small count (NM2) |

## Readout

The bars below are the lead agent's, not the owner's.

### RT1: does the order by rate match the order by raw count?

| Group | Measure | Version | Denominator | Order by raw count | Order by rate | Same order? |
|---|---|---|---|---|---|---|
| Walmart, Target, Costco | NM1 | as accepted | per store | Walmart > Target > Costco | Costco > Target > Walmart | no |
| Walmart, Target, Costco | NM1 | added back | per store | Walmart > Target > Costco | Costco > Target > Walmart | no |
| Walmart, Target, Costco | NM2 | as accepted | per store | Walmart > Target > Costco | Costco > Target > Walmart | no |
| Walmart, Target, Costco | NM2 | added back | per store | Walmart > Target > Costco | Target > Costco > Walmart | no |
| Walmart, Costco (no worker figure for Target) | NM1 | both | per worker | Walmart > Costco | Costco > Walmart | no |
| Walmart, Costco (no worker figure for Target) | NM2 | both | per worker | Walmart > Costco | Costco > Walmart | no |
| Home Depot, Lowe's | NM1 | both | per store | Home Depot > Lowe's | Home Depot > Lowe's | yes |
| Home Depot, Lowe's | NM2 | both | per store | Home Depot > Lowe's | Home Depot > Lowe's | yes |
| REI, DICK'S | NM1 | both | per store | DICK'S > REI | REI > DICK'S | no |
| REI, DICK'S | NM2 | both | per store | DICK'S > REI | DICK'S > REI | yes |

No per-worker comparison exists for the Home Depot and Lowe's group or the REI and DICK'S group: Lowe's, REI and DICK'S publish no US worker figure. REI's store count is a floor: its NM1 rate drops to DICK'S level only at 361 stores, so the NM1 row holds unless REI has 361 or more; its NM2 order (below DICK'S) holds at any count of 180 or more, so the floor cannot change that row. Every REI and DICK'S count is under 11, and their intervals overlap widely.

### RT2: spread across chains with a rate

"Mostly size": rate ratio under 3. "More than size": rate ratio 3 or more and the intervals of the highest and lowest chains do not overlap. Otherwise "cannot tell".

| Measure | Version | Denominator | Chains | Highest / lowest count | Highest / lowest rate | Highest rate | Lowest rate | Overlap? | Call |
|---|---|---|---|---|---|---|---|---|---|
| NM1 | as accepted | per store | all 10 | 45.5 | 4.8 | Costco 6.34 (4.55 to 8.60) | Best Buy 1.33 (0.69 to 2.32) | no | more than size |
| NM1 | added back | per store | 9 (no HomeGoods) | 42.0 | 4.8 | Costco 6.34 (4.55 to 8.60) | Best Buy 1.33 (0.69 to 2.32) | no | more than size |
| NM2 | as accepted | per store | all 10 | 48.0 | 6.3 | Home Depot 2.36 (1.74 to 3.13) | Ace 0.37 (0.01 to 2.08), 1 case, weak | yes | cannot tell |
| NM2 | added back | per store | 9 (no HomeGoods) | 48.0 | 6.3 | Home Depot 2.36 (1.74 to 3.13) | Ace 0.37 (0.01 to 2.08), 1 case, weak | yes | cannot tell |
| NM1 | as accepted | per worker | Walmart, Home Depot, Costco | 4.4 | 2.4 | Home Depot 2.698 (2.226 to 3.241) | Walmart 1.137 (0.978 to 1.315) | no | mostly size |
| NM1 | added back | per worker | Walmart, Home Depot, Costco | 5.1 | 2.1 | Home Depot 2.722 (2.247 to 3.267) | Walmart 1.313 (1.141 to 1.503) | no | mostly size |
| NM2 | as accepted | per worker | Walmart, Home Depot, Costco | 6.9 | 4.5 | Home Depot 1.136 (0.838 to 1.506) | Walmart 0.250 (0.179 to 0.340) | no | more than size |
| NM2 | added back | per worker | Walmart, Home Depot, Costco | 6.9 | 4.0 | Home Depot 1.136 (0.838 to 1.506) | Walmart 0.281 (0.205 to 0.376) | no | more than size |

Check without Ace, added to the script after the first run showed Ace as the lowest NM2 rate (its rate is weak; this does not replace the calls above). The NM2 per-store call turns on whether Ace's results release counts as its filing: if it does, Ace has a rate and the call is "cannot tell"; if not, Ace has no rate and the call is the one below. NM1 per store is unchanged ("more than size", Costco against Best Buy). NM2 per store becomes "more than size" in both versions: Home Depot 2.36 against Lowe's 0.40 (0.16 to 0.82, 7 cases, small count) as accepted, 5.9-fold, and against Lowe's 0.51 (0.23 to 0.97, 9 cases) added back, 4.6-fold. The per-worker rows do not include Ace.

### The $100,000 rule

These rates cannot test the proposed $100,000 rule itself: cases that large are 0 to 2 per chain, and Walmart's are FTC cases, not OSHA.

## Limits

Named, not fixed:

- Many cases are at distribution centers, not stores, while DN1 counts stores only.
- State-run safety programs inspect at different rates, and the chains are spread across states differently.
- The store count is one year-end while cases span five years.
- Inspections often start from complaints.
- Worker figures are headcounts (full- and part-time), not hours worked; Home Depot's likely includes SRS staff.
- The numerators carry the pilot's own limits: frozen name patterns, and names without the banner are missed ([patterns.md](patterns.md), [method-gaps.md](method-gaps.md)).

## What could not be done

Including terms applied with a judgment call.

| | Gap | What was done |
|---|---|---|
| GP1 | US worker figure (DN2) for Target, Lowe's, HomeGoods, Best Buy, DICK'S, REI, Ace | Not published in the filing used; no rate, worldwide figure listed as not used |
| GP2 | Exact REI store count | Used the stated floor of 190; REI's per-store rates are ceilings |
| GP3 | Ace store count from an annual filing | The annual report page returned 403 in the earlier run and was not retried; 268 company-owned stores taken from the year-end results release; rate flagged weak |
| GP4 | HomeGoods "added back" rate | Not computed, per the fixed terms; 18 TJX rows held |
| GP5 | Rows filed under "none" or the Ace rule rather than AT4 | Sorted by name: the four Lowe's Home Improvement rows and the one Westlake Ace Hardware row are added back; Target Piping and Curtiss Wright Target Rock are not. Lowe's counts without the four are given above |
| GP6 | Best Buy banners | Pacific Sales and Yardbird taken out of the domestic count; Outlet Centers kept on an assumption the filing does not state (904; 886 without them) |
