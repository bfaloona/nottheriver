# Record book run: name patterns (step 0)

Answer: frozen at 16:47 on 2026-11-15. Nine chains get 1 to 5 patterns each; the probe added bare or variant forms for Walmart, Lowe's, Target, DICK'S and REI, and found no new form for Home Depot, Best Buy, Ace Hardware or HomeGoods. The patterns, attribution rules, window, row and "final" definitions do not change after this point.

## Probe design (written before any call)

- OSHA: one `query OSHA inspection` per candidate, `estab_name like <candidate>`, `site_state = CA`, `open_date > 2024-11-15` (gap G1).
- WHD: one `query WHD enforcement` per candidate, `trade_nm like <title-case candidate>`, no state or date limit (gap G2).
- Narrow step 2 patterns are read from the broader candidate's rows (gap G3).
- Rule for adding a pattern (gap G4, made exact here before freezing): a candidate is added when it returns a name, in the field it searched, that fits AT1, AT2 or AT2b for the chain and that no step 2 pattern matches in that same field. Step 2 patterns stay even when the probe saw no name for them (one state and two years is a small sample).

Raw replies: `handoff/record-book/raw/dol/step0/` (48 calls, log in `runner.log`).

## Names seen

Counts are rows; names fitting no rule are summarized, not listed.

| Chain | Candidate | OSHA (CA, opened after 2024-11-15) | WHD `trade_nm` (all states, all dates) |
|---|---|---|---|
| Walmart | `%WAL-MART%` | 5: WAL-MART ASSOCIATES, INC. (2); WAL-MART STORES INC.; WAL-MART TRANSPORTATION, LLC; WAL-MART INC. | 169 (77 distinct), mostly "Wal-Mart / Wal-Mart Stores, Inc."; also Wal-Mart Stores East, LP and Wal-Mart Stores Texas, LLC |
| Walmart | `%WALMART%` | 49: WALMART INC. (20); WALMART, INC. (7); WALMART (7); WALMART SUPERCENTER (5); WALMART, INC (3); WALMART STORE #4309; WALMART # 3081; WALMART SUPERCENTER #3081; WALMART DC 6561 REMOTE YARD; WALMART SUPPLY CHAIN; WALMART STORES INC; WALMART INC | 140 (98 distinct), mostly "Walmart / Walmart Inc." and variants |
| Walmart | `%WAL MART%` | 0 | 18, including "Wal Mart / WalMart Inc", "Wal Mart Super Center #1074 / Wal Mart Stores, Inc." (fit AT1 or AT2; no step 2 pattern matches the trade name); also Subway and KFC/Taco Bell stores at Walmart sites (AT3) |
| Walmart | `%SAM'S%` | 3: SAM'S CLUB (2); SAM'S ROADHOUSE CAFE, INC. | 161, of which "Sam's Club / Sam's Club" (3) and "Sam's Club / Wal-Mart Stores, Inc." (2) fit; the rest are other businesses (Fantastic Sam's, Sam's Chevron) |
| Walmart | `%SAMS CLUB%` | 0 | 3: "Sams Club / Sam's Club", "Sams Club / Sams Cub", "Sams Club / Walmart, Inc." |
| Home Depot | `%HOME DEPOT%` | 17: HOME DEPOT U.S.A., INC. (9); THE HOME DEPOT (4); HOME DEPOT; THE HOME DEPOT USA, INC.; HOME DEPOT U.S.A. INC. STORE 0649; HOME DEPOT NORTH UPLAND #1083 | 63 (43 distinct), "Home Depot" or "The Home Depot" with Home Depot U.S.A., Inc. and variants; also THD At-Home Services, Inc. and At-Home Services Inc. |
| Home Depot | `%HOMEDEPOT%` | 0 | 0 |
| Lowe's | `%LOWE'S%` | 7: LOWE'S HOME IMPROVEMENT (3); LOWE'S STORE #1926; LOWE'S HOME CENTERS; LOWE'S HOME CENTERS, INC; LOWE'S HOME CENTER LLC | 58 (48 distinct), mostly Lowe's Home Centers, LLC and Lowe's Companies, Inc.; others: Lowe's Foods, Lowe's Market (Pay & Save), Lowe's Construction, Lowe's Eatery |
| Lowe's | `%LOWES%` | 2: LOWES HOME CENTERS LLC STORE #1207; LOWES | 21, mostly Lowe's stores; others: Lowes Foods, Lowes Motor Speedway |
| Target | `%TARGET%` | 34: TARGET CORPORATION (20); TARGET (6); TARGET CONSTRUCTORS, INC. (2); TARGET STORE #0311; TARGET #1121; TARGET FOOD DISTRIBUTION CENTER T3712; TARGET STORE #3355; TARGET RDC; TARGET CORPORATION STORE # T0949 | 105 (79 distinct), "Target / Target Corporation" (22) and store-numbered forms; many other businesses (On Target Staffing, Target Drilling, Target Optical / Luxottica) |
| Best Buy | `%BEST BUY%` | 1: BEST BUY STORES, LP | 22, Best Buy Stores, LP and Best Buy Co., Inc. forms; others: Best Buy Carpet, Best Buy Liquors, Best Buy Auto Sales |
| Best Buy | `%BESTBUY%` | 0 | 0 |
| DICK'S | `%DICK'S%` | 1: HADDICK'S TOWING, LLC | 33; fitting: "Dick's Sporting Goods / Dick's Sporting Goods, Inc." (3), "Dick's Clothing and Sporting Goods / Dick's Sporting Goods, Inc."; others: Dick's Wings, Dick's Market, Dick's Drive-In |
| DICK'S | `%DICKS%` | 1: DICKSON, INC | 32, none fitting (Dicks Wings, Dickson businesses) |
| REI | `%RECREATIONAL EQUIPMENT%` | 0 | 0 |
| REI | `REI` | 0 | 1: "REI / Recreational Equipment, Inc." |
| REI | `REI %` | 0 | 3, none fitting (REI Steel, REI Property Managment, REI Food Service) |
| REI | `% REI`, `% REI %`, `%REI CO%` (`%REI Co%`) | 0 each | 0 each |
| Ace Hardware | `%ACE HARDWARE%` | 3: ACE HARDWARE, CORP; ACE HARDWARE CORPORATION; GRAND LAKE ACE HARDWARE, INC. | 67 (66 distinct): dealer stores under their own legal names, and Westlake Ace Hardware, Inc. (3) |
| HomeGoods | `%HOMEGOODS%` | 2: HOMEGOODS; HOMEGOODS LLC | 2: "HomeGoods / The TJX Companies, Inc.", "HomeGoods / HomeGoods, Inc." |
| HomeGoods | `%HOME GOODS%` | 0 | 2: "Home Goods - Marlton / T.J.X. Companies - Home Goods Division", "Home Goods / Home Goods Store #0161" |
| HomeGoods | `%TJX%` | 0 | 2: "The TJX Companies, Inc / The TJX Companies, Inc" (no banner named), "Subway - Toms River (TJX) / DaSari & Family, LLC." (AT3) |

## Frozen patterns

OSHA searches use the upper-case form. WHD searches use the upper-case and the title-case form on both `legal_name` and `trade_nm` (step 4).

| Chain | OSHA patterns | WHD title-case forms | Change from step 2, and why |
|---|---|---|---|
| Walmart | `%WAL-MART%`, `%WALMART%`, `%SAM'S CLUB%`, `%WAL MART%`, `%SAMS CLUB%` | `%Wal-Mart%`, `%Walmart%`, `%Sam's Club%`, `%Wal Mart%`, `%Sams Club%` | Added `%WAL MART%` and `%SAMS CLUB%`: fitting WHD trade names that no step 2 pattern matches |
| Home Depot | `%HOME DEPOT%` | `%Home Depot%` | None |
| Lowe's | `%LOWE'S%`, `%LOWES%` | `%Lowe's%`, `%Lowes%` | Replaced `%LOWE'S HOME%` and `%LOWES HOME%` with the broader forms, which contain them: "LOWE'S STORE #1926" (AT2) and bare "LOWES" (AT2b) are missed by the step 2 forms |
| Target | `%TARGET%` | `%Target%` | Replaced `%TARGET CORP%` and `%TARGET STORE%` with `%TARGET%`, which contains them: "TARGET #1121", "TARGET RDC" and "TARGET FOOD DISTRIBUTION CENTER T3712" (AT2) are missed by the step 2 forms. Bare "TARGET" stays excluded (AT2b denied) |
| Best Buy | `%BEST BUY%` | `%Best Buy%` | None |
| DICK'S | `%DICK'S SPORTING%`, `%DICKS SPORTING%`, `%DICK'S%` | `%Dick's Sporting%`, `%Dicks Sporting%`, `%Dick's%` | Added `%DICK'S%`: trade name "Dick's Clothing and Sporting Goods" (legal name Dick's Sporting Goods, Inc.) is missed by the step 2 forms in the trade name field |
| REI | `%RECREATIONAL EQUIPMENT%`, `REI` (whole name only) | `%Recreational Equipment%`, `REI` (upper case), `Rei` (title case) | Added bare `REI` as a whole-name match: trade name "REI" (legal name Recreational Equipment, Inc.). The probe showed no other employer named exactly "REI", so AT2b applies (gap G6). Names that start or end with "REI" plus other words stay missed |
| Ace Hardware | `%ACE HARDWARE%` | `%Ace Hardware%` | None. Ace Retail Holdings LLC, which the plan's Ace rule accepts, is not in step 2's list and was not probed, so a record naming only "Ace Retail Holdings" is missed (gap G18) |
| HomeGoods | `%HOMEGOODS%`, `%HOME GOODS%`, `%TJX%` | `%HomeGoods%`, `%Home Goods%`, `%TJX%` | None. "T.J.X. Companies" is missed by `%TJX%` in the legal name field, but its trade name is found by `%Home Goods%` |

Known misses after freezing: spellings with other case in WHD (for example "WalMart" or "Homegoods" in a field the title-case form does not match), names written without the banner, and subsidiaries without the banner in their name (gap G17).
