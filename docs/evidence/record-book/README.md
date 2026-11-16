# Record book pilot: results for ten chains

Answer: the fixed check ran on all ten chains inside the time bar, and a second agent matched 786 of 787 rows to their sources. By the proposed rule (a final penalty or settlement of $100,000 or more, 2021-11-15 to 2026-11-15) three chains have findings and seven have none. Nothing here shows on the site: the owner has not ruled on the rule or read the rows. Run 2026-11-15; method in [the plan](../../plans/record-book-pilot.md).

## The spread

Counts are cases dated in the window and accepted for the chain. "Final" follows the plan's definition per source; wage cases are counted final by the plan's assumption.

| Chain | OSHA / wage / FTC cases | $10,000 or more | $100,000 or more, final | $100,000 or more, not final | Sheet |
|---|---|---|---|---|---|
| Walmart | 182 / 10 / 3 | 46 | 2: FTC $100,000,000 (W202) and FTC $3,000,000 (W204, see "Checks") | 2: OSHA $103,710 (W1), FTC $10,000,000 (W203) | [walmart.md](walmart.md) |
| Home Depot | 114 / 3 / 0 | 48 | 2: OSHA $110,619 (H1), OSHA $100,425 (H2) | 0 | [homedepot.md](homedepot.md) |
| Target | 82 / 1 / 0 | 21 | 1: OSHA $176,000 (T1) | 0 | [target.md](target.md) |
| Lowe's | 60 / 1 / 0 | 7 | 0 | 0 | [lowes.md](lowes.md) |
| Costco | 41 / 0 / 0 | 7 | 0 | 0 | [trial-costco.md](trial-costco.md) |
| HomeGoods | 20 / 0 / 0 | 7 | 0 | 0 | [homegoods.md](homegoods.md) |
| Best Buy | 12 / 0 / 0 | 6 | 0 | 0 | [bestbuy.md](bestbuy.md) |
| DICK'S | 10 / 0 / 0 | 4 | 0 | 0 | [dicks.md](dicks.md) |
| REI | 5 / 1 / 0 | 1 | 0 | 0 | [rei.md](rei.md) |
| Ace | 4 / 0 / 0 | 1 | 0 | 0 | [ace.md](ace.md) |

Every case, accepted or excluded, is in the chain's `-cases.tsv` file beside its sheet.

## The plan's failure bars

| Bar | Result |
|---|---|
| Over 3 hours a chain | Passed. The longest was Walmart: 35 minutes of work and 37 waiting on the rate limit ([time-log-run.md](time-log-run.md)) |
| More than one claim tied to the wrong company | Passed, likely. The second agent found one accepted row likely labeled with the wrong Walmart company (W156, $850, likely Wal-Mart Puerto Rico, Inc.) and none tied to an unrelated business. It did not check the subsidiary lists the attribution rests on |
| Records differ in fewer than 2 of 3 peer groups | Passed with no margin, by the proposed rule: Walmart and Target differ from Costco; Home Depot differs from Lowe's; REI and DICK'S do not differ |

## Checks

| Check | Result | Report |
|---|---|---|
| Second agent re-fetched every row | 712 OSHA cases, 66 wage cases, 3 FTC cases and 6 registry listings: all match except W204, which the sheet marks "not final". The order posted on ftc.gov is signed and dated by the judge (2022-04-08), so it is final by the run's own test. The table above counts it as final; [walmart.md](walmart.md) still says "not final", because mismatches are recorded, not fixed | [check-rows.md](check-rows.md) |
| Known cases | Of 7 cases the repo already knew from these three sources, 5 were found and 2 were left out as $0 inspections. Of 6 known cases from other sources, all 6 were missed: the Justice Department ($50 million, Walmart), the EEOC, the labor board (Costco, Target), a class settlement (Costco, $14 million) and a Canadian tribunal are not on the fixed list. Seven is too few to give a rate | [check-known-cases.md](check-known-cases.md) |
| Lead's spot check | 21 OSHA cases fetched again: amount, date and final status match in all 21 | Raw data kept outside the repo |

## What the spread does not show

The three chains over the proposed line are Walmart, Home Depot and Target, which also have the most cases of any size. A later check computed OSHA cases per 100 US stores and per 10,000 US workers ([rates.md](rates.md)). Its answer: size explains much of the spread, likely not all. By the lead agent's bars, fixed before lookup:

| Measure | Raw counts differ by | Rates differ by | Call |
|---|---|---|---|
| Cases of any size, per store (ten chains) | 45 times | 4.8 times | More than size |
| Cases of any size, per US worker (Walmart, Home Depot, Costco: the only three with a published US figure) | 4.4 times | 2.4 times | Mostly size |
| Cases of $10,000 or more, per US worker (the same three) | 6.9 times | 4.5 times | More than size |
| Cases of $10,000 or more, per store | 48 times | 6.3 times | Cannot tell: it turns on Ace's single case and a store count taken from a results release |

Inside the peer groups, with cases counted as accepted on the sheets:

| Group | By raw count | By rate |
|---|---|---|
| Walmart, Target, Costco | Walmart has the most cases (182, 82, 41) | Walmart never has the highest rate. Per 100 stores: Costco 6.3, Target 4.1, Walmart 3.5. Per 10,000 US workers: Costco 1.8, Walmart 1.1. With Walmart's 28 held cases (RB3) added back, Walmart is 4.0 per 100 stores and its range touches Costco's; per worker their ranges overlap either way |
| Home Depot, Lowe's | Home Depot has more (114, 60) | The order holds on every measure. Per 100 stores: 5.6 and 3.4 for cases of any size, 2.4 and 0.4 for cases of $10,000 or more |
| REI, DICK'S | DICK'S has more (10, 5) | Too few cases to tell |

The rates cannot test the proposed $100,000 rule: cases that large are 0 to 2 per chain, and Walmart's are FTC cases. Store sizes, distribution centers and state-run inspection programs differ by chain, and none is corrected for.

## Rulings the owner owes before anything shows

| | Ruling | What it changes |
|---|---|---|
| RB1 | The rule for a finding: $100,000 a case, another line, or a total per company | Which of the rows above count. At $10,000 a case every chain has at least one |
| RB2 | Whether wage back pay counts toward the line, and whether wage cases are "final" when the source does not say | 16 wage cases in the window; the largest is $23,000 |
| RB3 | Wal-Mart Associates, Inc. and other Walmart companies missing from the subsidiary list in its annual filing | Walmart OSHA cases held as "excluded, owner to rule": 18 that name Wal-Mart Associates, Inc. (the largest $36,935) and 10 that name other Walmart companies |
| RB4 | Two TJX cases of $167,504 and $115,000 that the source does not tie to HomeGoods | Whether HomeGoods has findings by the proposed rule |
| RB5 | Walmart's $10,000,000 FTC order (W203): ftc.gov shows no court entry, while the repo's earlier research says the court entered it on 2025-06-23 | Whether Walmart has two or three final findings |
| RB6 | A bare banner name, such as "COSTCO" with no company suffix, accepted as the chain | Rows that rest on that rule, most of them on Walmart's and Home Depot's sheets; "TARGET STORES, INC." and bare "TARGET" rows are excluded today |
| RB7 | Sources off the fixed list (Justice Department, EEOC, labor board, private settlements) | Six known cases the check cannot find |
| RB8 | Claim wording written by an agent, where the site's rule today shows only the source's own title | Every claim line on the sheets |

The run's 27 method gaps, with what the collecting agent did at each, are in [method-gaps.md](method-gaps.md). The FTC site's search likely misses names with an apostrophe (Lowe's, DICK'S), so "none found" is weak for those two.
