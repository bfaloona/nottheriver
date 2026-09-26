# Amazon alternatives research

A sourced index of US websites that list alternatives to Amazon, and a small database of the retailers they name, rated the nottheriver way. Checked 2026-09-25.

- Start with [amazon-alternatives.md](amazon-alternatives.md), the overview for people.
- [method.md](method.md) says how it was done, what was trimmed and what the operator still needs to check.
- [brief.md](brief.md) is the brief every agent in the run followed (rubric, file formats, rules).

Nothing here changes the live site. The live data stays in `data/`.

## Layout

| Path | What it holds |
|---|---|
| `README.md` | This file |
| `amazon-alternatives.md` | The overview report |
| `method.md` | Rubric pointers, search log summary, caps and trims, decisions, limits, operator checks |
| `brief.md` | The research brief, with the run tuning in section 9 |
| `sites/<slug>.md` | One file per list site, app, directory or campaign (26 files) |
| `retailers/<slug>.md` | One file per retailer (54 files: 50 rated, 4 Amazon-owned and excluded) |
| `build-index.mjs` | Checks every file's front matter and builds `index.json` |
| `build-index.test.mjs` | Tests for the build script |
| `index.json` | Built from the front matter of `sites/` and `retailers/`; don't edit by hand |
| `raw/` | Source material, listed below |

`<slug>` is the registrable domain with dots as hyphens (`thegoodtrade.com` becomes `thegoodtrade-com`). Each file is Markdown with YAML front matter, so the files are both the source material and the database.

### `raw/`

| File | What it holds |
|---|---|
| `discovery-<angle>.md` | Search queries and candidates, one file per angle (generic, product-types, motive-ethics, motive-local, formats, news) |
| `discovery-critic.md` | The completeness critic's gap checks and added candidates |
| `candidates.md` | All 116 candidate pages, merged and deduplicated |
| `shortlist.md` | The 30 pages chosen for assessment, and every trimmed candidate with a reason |
| `out-of-scope-<angle>.md` | Notable non-US lists that were skipped |
| `blocked-assess-<group>.md` | Pages the site assessors could not fetch |
| `calibration.md` | Rules K1 to K10 and every change made when the site files were aligned |
| `tally.md` | Retailer mentions per domain across the site files (313 domains) |
| `retailer-selection.md` | The 50 retailers chosen for rating, in batches R1 to R10, and the cut rule |
| `blocked-retailers-R<n>.md` | Pages the retailer researchers could not fetch, per batch |
| `verify-R<n>.md` | The verifier's check of every certification, concern and field, per batch |
| `concern-pass-2-brief.md`, `concerns2-C<n>.md` | Concern pass 2 (agency pages, FTC, CourtListener, ProPublica), per batch |
| `news-search-brief.md`, `news-N<n>.md` | Concern pass 3 (general news search), per batch: queries, hits, outcomes |
| `prop65-P1.md` | Proposition 65 lookups on oag.ca.gov for the 34 non-caution retailers, after the operator's rulings |
| `osha-status.md`, `osha-dol-match.md` | OSHA concern checks: closed status, and matches in DOL's open data |
| `run-log.md` | Stage status and the lead's decisions during the run |
| `qa.md` | The final QA check of every file: what was fixed and what is flagged for the operator |

## Rebuild

Run these from the repository root.

| Command | What it does |
|---|---|
| `node research/build-index.mjs` | Checks every site and retailer file and writes `research/index.json`. It re-derives `accepted_source`, `ethics`, `environment`, `tier`, `mentions` and `score`, and fails on a mismatch or a missing field. |
| `node research/build-index.mjs --tally` | Counts retailer mentions across `sites/` and writes `research/raw/tally.md` |
| `node research/build-index.mjs --blocklist "<name>" <domain>` | Says whether a retailer is Amazon-owned per `data/blocklist.json` |
| `npm test -- research` | Runs the build script's tests (`research/**/*.test.mjs` is in `vitest.config.ts`) |

The script reads `data/blocklist.json`, `data/negative-sources.json` and `data/certifications.json`, so a change there can change a derived tier on the next build.
