# Record book pilot: results for ten chains

Answer: the fixed check ran on all ten chains inside the time bar, and a second agent matched 786 of 787 rows to their sources. By the rule the owner chose on 2026-11-16 (a final penalty or settlement of $100,000 or more, 2021-11-15 to 2026-11-15, shown with each chain's case count and rate) three chains have findings and seven have none. Nothing here shows on the site: five rulings are open and the owner has not read the rows. On 2026-11-16 the owner deferred the rest of this work: "defer remaining actions as unknown usefulness". Run 2026-11-15; method in [the plan](../../plans/record-book-pilot.md).

## The spread

Counts are cases dated in the window and accepted for the chain. "Final" follows the plan's definition per source; wage cases are counted final by the plan's assumption.

| Chain | OSHA / wage / FTC cases | $10,000 or more | $100,000 or more, final | $100,000 or more, not final | Sheet |
|---|---|---|---|---|---|
| Walmart | 182 / 10 / 3 | 46 | 3: FTC $100,000,000 (W202), FTC $10,000,000 (W203, see RB5) and FTC $3,000,000 (W204, see "Checks") | 1: OSHA $103,710 (W1) | [walmart.md](walmart.md) |
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

## Rulings made

**RB1, 2026-11-16: the $100,000 line, plus context.** Offered four rules, the owner chose "$100,000 line plus context":

- A named finding is a final penalty or settlement of $100,000 or more in one case, dated in the window.
- Every chain also shows its count of all cases and, where a store count is published, its cases per 100 stores.
- A chain under the line reads "no case of $100,000 or more", never "none found".

Cases that meet the line today: Walmart W202 (FTC, $100,000,000), W203 (FTC, $10,000,000, by RB5 below) and W204 (FTC, $3,000,000); Home Depot H1 (OSHA, $110,619) and H2 (OSHA, $100,425); Target T1 (OSHA, $176,000). The owner reads each of these six rows before any shows.

**RB5, 2026-11-16: Walmart's $10,000,000 FTC order (W203) counts as final.** The FTC's page posts only the unsigned draft (docket 102-1). The lead fetched the court's copy from CourtListener's public archive: [document 105](https://storage.courtlistener.com/recap/gov.uscourts.ilnd.416367/gov.uscourts.ilnd.416367.105.0.pdf) in case 1:22-cv-03372 (N.D. Ill.), filed 2025-06-23, enters a judgment of $10,000,000 and reads "SO ORDERED: June 23, 2025" above the signature of Judge Manish S. Shah. Shown this, the owner chose "Count it as final", for this case only. The case is dated 2025-06-23 (the sheet has 2025-06-20, the date the parties signed) and links the court's copy beside the FTC page. CourtListener is not one of the pilot's three fixed sources; whether court copies may be used this way in general is not ruled (see RB7).

**RB3, 2026-11-15: a company named with the chain's own name plus a company form counts as the chain, at every chain.** The owner ruled "Count them" for Walmart and "Same ruling for all". Each such case is labeled "name as given; parent inferred from the name". The basis offered: Walmart's subsidiary list says it leaves out subsidiaries that are not significant, and the Labor Department's wage data pairs the trade name "Walmart" with "Wal-Mart Associates, Inc." and "Sam's Club" with "Walmart Puerto Rico, Inc.". No second source was checked for any of the companies. Rows naming another business ("Target Piping Corp.") stay out. The sheets and case files stay as collected; the counts below apply the ruling.

| Chain | Cases added | OSHA cases, before and after | $10,000 or more (all sources), before and after | Largest added |
|---|---|---|---|---|
| Walmart | 28 OSHA: Wal-Mart Associates, Inc. (18), Wal-Mart Puerto Rico, Inc. (7), Wal-Mart Transportation, LLC (1), Wal-Mart Louisiana, LLC (1), Walmart Advanced Systems - Robotics Inc (1). 1 wage case of $6,288 (Sam's Club, Walmart Puerto Rico, Inc.) | 182, 210 | 46, 51 | $36,935 |
| Target | 5 OSHA: Target Stores, Inc. | 82, 87 | 21, 22 | $11,522 |
| Lowe's | 4 OSHA: Lowe's Home Improvement, LLC (3), Lowes Home Improvement Centers, LLC (1) | 60, 64 | 7, 9 | $13,240 |
| Home Depot | 1 OSHA: The Home Depot Puerto Rico Inc | 114, 115 | 48, 48 | $2,500 |

No added case reaches $100,000, so the "$100,000 or more" columns above do not change. Still held: the two bare "TARGET" and "SUPER TARGET" rows (RB6), the 18 TJX rows (RB4) and one "Westlake Ace Hardware" row. In [rates.md](rates.md) the "held rows added back" figures match this ruling for Walmart, Lowe's and Home Depot; for Target they also include the two bare banner rows (89 where the ruling gives 87).

## Rulings the owner owes before anything shows

Deferred by the owner on 2026-11-16 ("defer remaining actions as unknown usefulness"): the reading of the six cases over the line, and RB2, RB4, RB6 and RB7. RB8 was not among the actions offered then; it is open and nothing shows without it.

| | Ruling | What it changes |
|---|---|---|
| RB2 | Whether wage back pay counts toward the line, and whether wage cases are "final" when the source does not say | 16 wage cases in the window; the largest is $23,000 |
| RB4 | Two TJX cases of $167,504 and $115,000 that the source does not tie to HomeGoods | Whether HomeGoods has findings by the proposed rule |
| RB6 | A bare banner name, such as "COSTCO" with no company suffix, accepted as the chain | Rows that rest on that rule, most of them on Walmart's and Home Depot's sheets; "TARGET STORES, INC." and bare "TARGET" rows are excluded today |
| RB7 | Sources off the fixed list (Justice Department, EEOC, labor board, private settlements) | Six known cases the check cannot find |
| RB8 | Claim wording written by an agent, where the site's rule today shows only the source's own title | Every claim line on the sheets |

The run's 27 method gaps, with what the collecting agent did at each, are in [method-gaps.md](method-gaps.md). The FTC site's search likely misses names with an apostrophe (Lowe's, DICK'S), so "none found" is weak for those two.
