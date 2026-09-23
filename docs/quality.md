# Search quality

Status: **not yet measured.** Every number on this page will come from `docs/evidence/quality/report.json`, produced by `eval/summarize.mjs` from the saved responses and grades in the same folder. The About page shows the headline numbers from `src/quality.json`, or "Not yet measured."

## What is measured

| Measure | Question it answers |
|---|---|
| Precision, online and local | Of the shops returned, how many sell the product or a close equivalent (local: and exist at the listed address)? |
| Local precision by area | Does it hold up in suburban and rural zips, not only city centers? |
| Recall | Of the good shops an independent search found, how many did the site return? |
| Miss reasons | For each shop the site missed: not in Brave's index, weak snippet, ranked too low, filtered, or other |
| Bot access | How often retailer sites refuse or challenge an honestly identified bot, compared with what a person sees |
| Cost | Brave calls, LLM tokens and estimated spend for the evaluation run |

## Method

60 searches: 20 products in 8 categories, each in an urban, a suburban and a rural zip across 10 states. Zip kinds follow a fixed rule based on USDA RUCA codes. Every result is opened in a real browser and graded by hand; recall is measured against shops found by a separate search engine and confirmed in a browser. A throwaway probe fetches one page per retailer domain as a declared bot that obeys robots.txt. Full procedure, zip list and field definitions: [`eval/README.md`](../eval/README.md). Why the bot never pretends to be a person, and what could improve coverage: [ADR 0005](decisions/0005-site-access-and-mitigation.md).

## Results

Not yet measured.

| Measure | Online | Local |
|---|---|---|
| Precision | not yet measured | not yet measured |
| Recall | not yet measured | not yet measured |
| Bot blocked rate | not yet measured | not yet measured |
| Results with an unsupported badge source | not yet measured | not yet measured |
| Local distance implausible | n/a | not yet measured |

Evaluation cost: not yet measured.

## Limitations

- **Small sample.** 60 searches in 10 states cannot represent every product or place; treat the numbers as a rough level, not a precise rate.
- **Human judgment.** Grades are one grader's call at one point in time; there is no second grader to check agreement, and shop inventory changes.
- **Recall is relative.** The baseline is what another search engine found (up to 5 shops per section), so recall measures the site against that engine, not against every shop that exists.
- **The probe is a proxy.** It runs from Cloudflare's network and names itself, while Brave's crawler follows Googlebot's permissions and does not name itself, so the probe's blocked rate approximates what Brave meets rather than measuring it. Its challenge detection is a heuristic, scored against the browser pass.
- **One browser, one connection.** Sites can answer differently by location or network; the browser pass is one person's view.
- **Unknowns are left out.** Results the grader could not judge are excluded from precision and reported as a count.
