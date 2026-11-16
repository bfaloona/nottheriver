# Record book trial: time log

Answer: the Costco run took about 20 minutes of clock time (15:33 to 15:53), half of it waiting on the DOL API's rate limit; route probing took about 3 minutes more, mixed into the same span.

Times are from `date` calls in the agent's shell (PST, 2026-11-15), except those marked ~, which are estimates from the order of work. Probing and the Costco run overlapped: the first working query of each route was Costco's, so those minutes are listed once, under the run, and marked.

| Activity | Kind | Start | End | Minutes | DOL API calls | Web searches | Page fetches |
|---|---|---|---|---|---|---|---|
| Reading the brief's docs | Setup | 15:32:30 | 15:33:10 | 1 | 0 | 0 | 0 |
| Costco legal entities (SEC EDGAR, Exhibit 21.1) | Costco run | 15:33:10 | 15:34:01 | 1 | 0 | 1 | 4 (1 refused by robots.txt) |
| Attribution rules, file skeletons, advice | Method | 15:34:01 | ~15:35:30 | 1.5 | 0 | 0 | 0 |
| Script change and tests (test first) | Route probing | ~15:35:30 | 15:36:19 | 1 | 0 | 0 | 0 |
| S1 and S2 field lists | Route probing | 15:36:19 | 15:36:34 | 0.5 | 3 | 0 | 0 |
| S1 Costco inspections; case test | Costco run (also probing) | 15:36:52 | ~15:37:10 | 0.5 | 2 | 0 | 0 |
| S1 `in` filter: a shell word-split slip, 403 on a long list, fix, control | Route probing | 15:37:19 | 15:38:07 | 1 | 4 | 0 | 0 |
| S1 Costco violations (6 batches) and claim table | Costco run | 15:38:10 | 15:38:27 | 0.5 | 6 | 0 | 0 |
| S3 FTC search (wrong parameter, then right) | Costco run (also probing) | ~15:38:00 | ~15:39:20 | 1.5 | 0 | 1 | 4 |
| S4 registries | Costco run (also probing) | 15:39:34 | ~15:41:00 | 1.5 | 0 | 2 | 7 (1 challenge, 1 robots, 1 browser refused) |
| S2 Costco by legal name: rate limited, killed by the 590 s guard | Costco run | 15:41:02 | 15:50:59 | 10 | 3 (all HTTP 429) | 0 | 0 |
| S2 Costco by trade name | Costco run | 15:51:00 | 15:51:02 | 0 | 1 | 0 | 0 |
| S2 Costco: legal and trade name, upper and title case; control query | Costco run | 15:51:12 | 15:51:40 | 0.5 | 4 (one a Walmart control whose result line was cut off in the log; the Costco title-case rows are the positive control) | 0 | 0 |
| Claim sheet, routes, plan written | Costco run and method | 15:51:58 | 15:53:16 | 1.5 | 0 | 0 | 0 |
| Review pass: classifier test, paging test, attribution and wording fixes | Method | 15:53:52 | 15:59:04 | 5 | 3 | 0 | 0 |

Totals:

| Measure | Value |
|---|---|
| Costco run, wall clock | 15:33:10 to 15:53:16, about 20 minutes, of which about 10 were waiting out the DOL rate limit. Probing is mixed into this span (marked rows), so the run alone is an estimate: about 8 minutes of agent work plus the wait |
| Route probing alone | About 3 minutes (rows marked "Route probing") |
| Whole session | 15:32:30 to 15:59:04 |
| DOL API calls | 26 sent: 23 answered, 3 refused with HTTP 429 (the fourth try was killed by `gtimeout` while waiting) |
| Web searches | 4 of the 25 allowed |
| Page fetches | 15 (2 robots.txt refusals, 1 challenge page, 1 headless-browser refusal) |
| Against the 3-hour bar | Well under for Costco. Walmart and Home Depot will match more rows; the cost per chain is likely set by the rate limit (about 8 calls, then up to 10 minutes) more than by row counts (estimate) |
