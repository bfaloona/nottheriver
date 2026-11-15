# Blocked pages: what was read on 2026-11-15

Section 10 of [../../../ethics-data-strategies.md](../../../ethics-data-strategies.md) listed 58 pages the research agents could not read. These files record why each one failed and what the pages say once read. No stealth tool, proxy, CAPTCHA solving or login was used, and scripted requests followed each site's crawler rules. Two departures are recorded in `walled-pages.md`: the Wayback Machine requests sent a client name that was not the true one, and the B Corp directory was opened in the owner's browser before the lead saw that the site's crawler rules close it to Anthropic's assistants.

| File | What it holds | Written by |
|---|---|---|
| [triage.md](triage.md), [triage.tsv](triage.tsv) | One plain request per page: the crawler-rules verdict and the cause of the failure | Sonnet agent |
| [answers.md](answers.md) | The 25 pages a plain request returns: the answer to each section 10 question, with the line quoted | Sonnet agent; the lead checked 8 quotes and counts |
| [answers-script-pages.md](answers-script-pages.md) | 11 pages filled in by script, loaded in a headless browser | Sonnet agent; the lead checked 2 counts |
| [walled-pages.md](walled-pages.md) | 14 pages behind a bot wall, an expired certificate or a removed address: Wayback Machine copies, and three sites opened in the owner's own browser with the owner present | Lead agent |
| [answers-gov-files.md](answers-gov-files.md) | Three government file sets: Form 5500, GreenChill, EPA green power | Lead agent |

How to read them:

- **Saved pages are not in the repo.** Citations such as `text/p04.txt:98`, `bodies/p15.body`, `headless/p6.txt` and `wayback/w02.txt` name the working copies kept on the machine that fetched them. `pNN` is a page id from the triage; `wNN` is an archive copy.
- **Each answer rests on one fetch on one day.** An answer from an archive copy is as old as the copy; `walled-pages.md` gives each date.
- **Terms and license questions were skipped**, by the owner's ruling of 2026-11-15 (`docs/STATUS.md`, "Decisions made by the operator"). Where a page states a reuse sentence plainly it is quoted without analysis.
- **Three triage rows were corrected by the later reads.** The EPA ecolabel page (p08) and the green power page (p36) load their rows by script, so the triage's row counts for them are template rows; the Fair Labor page (p44) holds 20 members and a "Load more" button, not the full list.
- **The fetch script is `research/fetch-page.mjs`.** Run `node research/fetch-page.mjs --out DIR [--browser] URL...`; `research/README.md` describes it.
