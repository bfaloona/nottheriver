# Walled pages: archive copies and the operator's Chrome
Status: closed

Done by the lead on 2026-11-15, after the operator approved reading Wayback Machine copies and driving their own Chrome, attended. `web.archive.org/robots.txt` returned 404 (no file, so nothing disallowed). One index lookup and one copy fetch per page, 3 seconds apart, no retries. Deviation: the lead's throwaway Python fetcher sent the client name `curl/8.7.1` to archive.org, which was not its true client name; `research/fetch-page.mjs` sends Node's own. Copies are in `wayback/` (`index.json`, `wNN.body`, `text/wNN.txt`); they are untrusted data.

## Archive copies (14 pages: 12 walled, 1 expired certificate, 1 gone)

| Page | Copy date | What the copy holds |
|---|---|---|
| Violation Tracker home | 2026-11-13 | A saved challenge page ("One moment, please..."). No content |
| Violation Tracker /plans | 2026-06-30 | Real page (see answers below) |
| Violation Tracker /pages/user-guide | 2026-06-30 | Real page, 33,000 characters |
| B Corp directory | 2026-11-06 | A shell; listings load by script. No content |
| B Corp terms | none listed | |
| NY wage theft dashboard | 2026-06-01 | Real page text; the data sits in an embedded Tableau view that the copy does not hold |
| sec.gov company_tickers.json | 2026-11-02 | The real file: 10,423 entries (`wayback/w07.company_tickers.json`), fetched with the `id_` form of the copy address |
| WikiRate terms | none listed | |
| WikiRate licensing | 2025-06-13 | Real page, 4,300 characters; not read for content (low value, and license reading is skipped under the operator's ruling) |
| foe.org retailer report card | 2026-10-21 | Real page, 16,000 characters; not yet read for the question |
| progressivegrocer.com article | 2025-07-23 | Real page, 18,600 characters; not yet read |
| chainstoreage.com article | 2025-06-15 | Real page, 10,200 characters; not yet read |
| Dirty Dozen PDF (expired certificate) | 2025-09-22 | The real PDF, 699,546 bytes (`wayback/w13.raw.pdf`); not yet read |
| Good Shopping Guide supermarkets (gone) | 2026-04-12 | A saved challenge page. No content |

Count: 9 of 14 hold real content, 2 are saved challenge pages, 1 is a shell, 2 have no copy. The lead's first marker test missed the "One moment, please..." wording; the two challenge copies were found by reading the text.

## Answers the archive copies give

| Question (report section 10) | Answer | Source |
|---|---|---|
| Violation Tracker price | Searching and viewing results are free. Downloads need a subscription: "$25 a month (or $250 annually) allows up to 1,000 downloaded records per search", $45 a month for 5,000, $150 a month for 10,000 | `wayback/text/w02.txt` lines 45 to 59, copy dated 2026-06-30 |
| Violation Tracker parent coverage | "displays aggregated data for more than 3,000 parent companies"; entries are matched to the current parent, with parent-at-the-time data added in 2022 | `wayback/text/w03.txt` lines 84 to 95 |
| NY dashboard fields | Tabs include "Judgments – Allows you to search judgments by employer and year of judgment" and "Employer Search – Allows you to search wage theft cases by employer and year of case"; a linked guide covers downloading from Tableau | `wayback/text/w06.txt` lines 98 to 108 |
| SEC ticker file | Obtained from the archive, so no request to sec.gov with contact details is needed for a one-time copy. Fields: `cik_str`, `ticker`, `title` | `wayback/w07.company_tickers.json` |

## The operator's Chrome (attended, one tab, cookies declined, tab closed after)

Five navigations and two search submits across three sites: Violation Tracker (1 load, 1 search), B Corp (3 loads, 1 search), the New York dashboard (1 load). No interactive human check appeared on any page. No signed-in content was read or saved. Learned afterward: B Corp's robots.txt disallows `anthropic-ai` and `Claude-Web` as well as ClaudeBot, which the fetch script's default treats as closed; the operator had been told only about ClaudeBot.

| Page | Result |
|---|---|
| Violation Tracker home | Opened. A search for "Dollar General" returned "319 Violation Tracker results found" at `https://violationtracker.goodjobsfirst.org/?company_op=starts&company=Dollar+General`. So a link carrying a shop's name lands on that company's records, each row linked to a current parent |
| B Corp directory, "Alter Eco" | Opened. First result "Alter Eco LLC", "Certified since January 2009". Confirms the report's unconfirmed lead |
| B Corp directory, "Lake Champlain Chocolates" | First result "Champlain Chocolate Company" (logo: Lake Champlain Chocolates), "Certified since May 2018". Confirms the report's unconfirmed lead |
| B Corp link pattern | `https://www.bcorporation.net/en-us/find-a-b-corp/?query=<name>&sortBy=companies-production-en-us` puts the named company first. Without `sortBy` the list is ordered newest first and the company is not on the first screen. The match is loose (a three-word name returned 2,177 results), so a first result is not proof of membership: the name must be read |
| NY wage theft dashboard | Title "Access denied", body "the page that you are looking for is not found". Likely removed or restricted for everyone, not a bot wall; only the 2026-06-01 archive copy is readable |

Not opened in Chrome: B Corp terms and WikiRate terms (terms reading is skipped under the operator's ruling), Violation Tracker /plans and user guide (answered from the archive), the three low-value article pages (archive copies hold them).
