# Record book run: time log

Answer: the nine chains plus step 0 took 2 hours 55 minutes of clock time (16:04 to 18:59), of which 157 minutes (2 hours 37 minutes) were DOL calls held by HTTP 429. Agent working time was about 1 hour 50 minutes (estimate), most of it done while calls were held. Every chain stayed under the 3-hour bar; the longest was Walmart at about 35 minutes of work and 37 of waiting.

Times are from `date` and the runner logs (PST, 2026-11-15); minutes of working time are estimates from the order of work. Waiting time is time a DOL call spent held by HTTP 429, read from the runner logs (`handoff/record-book/raw/dol/step0/runner.log`, `handoff/record-book/raw/dol/run/runner-*.log`). Work for one chain often ran while another chain's calls were held, so working and waiting minutes overlap in clock time.

## Per chain

Shared work (entities for the seven SEC filers, all FTC searches, all registry pages, all 20 web searches: about 14 minutes, done during step 0's holds) is split evenly, about 1.5 minutes a chain.

| Chain | DOL calls | Working min (estimate) | Waiting min | Clock span of its DOL calls |
|---|---|---|---|---|
| Walmart | 51 | 35 | 37 | 16:46 to 17:25 |
| Home Depot | 16 | 13 | 12 | 17:25 to 17:38 |
| Lowe's | 18 | 15 | 12 | 17:39 to 17:52 |
| Target | 17 | 13 | 12 | 17:52 to 18:05 |
| Best Buy | 7 | 7 | 0 | 18:05 to 18:06 |
| DICK'S | 16 | 6 | 12 | 18:06 to 18:19 |
| REI | 11 | 6 | 12 | 18:19 to 18:32 |
| HomeGoods | 19 | 7 | 24 | 18:32 to 18:57 |
| Ace Hardware | 8 | 5 | 0 | 18:58 to 18:58 |
| Step 0 (all nine) | 48 | 11 | 36 | 16:07 to 16:46 |

## Activities

| Activity | Chain | Start | End | Working min | Waiting min | DOL calls | Web searches | Page fetches |
|---|---|---|---|---|---|---|---|---|
| Reading the brief's files, writing gap and pattern drafts | Setup | 16:04 | 16:07 | 3 | 0 | 0 | 0 | 0 |
| Step 0 probe, 48 DOL calls in one background sequence | Step 0 | 16:07 | 16:46 | | 36 (holds 16:08:23 to 16:20:27, 16:21:14 to 16:33:18, 16:34:11 to 16:46:15) | 48 | 0 | 0 |
| During step 0 holds: step 1 entities for the seven SEC filers (submissions, 10-K index, Exhibit 21) | Seven chains | 16:08 | 16:10 | 2 | | 0 | 0 | 21 |
| During step 0 holds: S4 shared registry pages and nine Climate Label slugs | All nine | 16:09 | 16:10 | 1 | | 0 | 0 | 12 |
| During step 0 holds: S3 FTC searches and paging for all nine; Walmart case pages and two order PDFs | All nine | 16:10 | 16:18 | 8 | | 0 | 0 | about 50 (estimate; 94 in the whole run) |
| During step 0 holds: B Corp and 1% for the Planet searches; REI and Ace annual reports | All nine | 16:18 | 16:21 | 3 | | 0 | 20 | 4 (1 challenge page) |
| Step 0 reading names, freezing patterns, plan edit | Step 0 | 16:34 | 16:48 | 8 | | 0 | 0 | 0 |
| Walmart DOL: 25 query calls and 26 penalties calls in 4 parts | Walmart | 16:46 | 17:25 | | 37 (holds 16:47:24 to 16:59:28, 17:00:03 to 17:12:29, 17:12:54 to 17:25:19) | 51 | 0 | 0 |
| Walmart attribution, builder script, sheet | Walmart | 16:48 | 17:28 | 33 | | 0 | 0 | 0 |
| Home Depot DOL: 5 query calls and 11 penalties calls; started while the Walmart sheet was being finished | Home Depot | 17:25 | 17:38 | | 12 | 16 | 0 | 0 |
| Home Depot attribution and sheet | Home Depot | 17:28 | 17:39 | 11 | | 0 | 0 | 0 |
| Lowe's DOL: 10 query calls and 8 penalties calls | Lowe's | 17:39 | 17:52 | | 12 | 18 | 0 | 0 |
| Lowe's attribution and sheet; rules for the later chains written during the hold | Lowe's | 17:40 | 17:52 | 13 | | 0 | 0 | 0 |
| Target DOL: 5 query calls and 12 penalties calls | Target | 17:52 | 18:05 | | 12 | 17 | 0 | 0 |
| Target attribution (one fix: "ACTION TARGET INC." had been read as the parent) and sheet; notes for later chains | Target | 17:53 | 18:05 | 11 | | 0 | 0 | 0 |
| Best Buy DOL: 5 query calls and 2 penalties calls | Best Buy | 18:05 | 18:06 | | 0 | 7 | 0 | 0 |
| Best Buy attribution (entity labels split so claims name one entity) and sheet | Best Buy | 18:06 | 18:06 | 5 | | 0 | 0 | 0 |
| DICK'S DOL: 15 query calls and 1 penalties call | DICK'S | 18:06 | 18:19 | | 12 (hold 18:06:41 to 18:18:41) | 16 | 0 | 0 |
| DICK'S attribution and sheet | DICK'S | 18:19 | 18:19 | 4 | | 0 | 0 | 0 |
| REI DOL: 10 query calls and 1 penalties call | REI | 18:19 | 18:32 | | 12 (hold 18:19:54 to 18:31:55) | 11 | 0 | 0 |
| REI attribution and sheet | REI | 18:32 | 18:32 | 4 | | 0 | 0 | 0 |
| HomeGoods DOL: 15 query calls and 4 penalties calls | HomeGoods | 18:32 | 18:57 | | 24 (holds 18:32:52 to 18:44:52, 18:45:38 to 18:57:46) | 19 | 0 | 0 |
| HomeGoods attribution (entity labels split) and sheet | HomeGoods | 18:57 | 18:58 | 5 | | 0 | 0 | 0 |
| Ace DOL: 5 query calls and 3 penalties calls | Ace Hardware | 18:58 | 18:58 | | 0 | 8 | 0 | 0 |
| Ace attribution and sheet; rebuild of all nine sheets | Ace Hardware | 18:58 | 18:59 | 3 | | 0 | 0 | 0 |

## Totals

| Measure | Value |
|---|---|
| Clock time | 16:04 to 18:59, 2 hours 55 minutes |
| Waiting on the DOL rate limit | 157 minutes (13 holds of about 12 minutes each; each followed a burst of 4 to 15 calls) |
| DOL calls | 211 answered; 39 more tries refused with HTTP 429 and retried by the script (3 per hold); none failed |
| Web searches | 20 of the 40 allowed |
| Page fetches | 94 (76 pages, 17 files such as JSON and PDF, 1 challenge page: Ace annual report) |
| Rate limit as seen | Bursts of 4 to 15 calls went through, then every call was refused for about 12 minutes; the script's backoff (2, 4, 6 minutes) cleared each hold on its third retry, so a part of at most 8 calls never outlasted the 1,500 second guard |
