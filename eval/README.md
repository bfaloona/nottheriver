# Quality evaluation

Measures whether searches return shops that really sell the product, how many good shops they miss, and how often retailer sites refuse an honestly identified bot. Results go in [`docs/quality.md`](../docs/quality.md); every number there comes from `docs/evidence/quality/report.json`.

| File | Purpose |
|---|---|
| `queries.json` | 20 products x 3 zips (urban, suburban, rural) = 60 searches |
| `run-searches.mjs` | Runs the searches against the deployed Worker, saves raw responses |
| `grade-schema.json` | Shape of the hand grades and the recall baseline |
| `access-probe/` | Throwaway Worker plus driver that fetches retailer pages as a declared bot |
| `summarize.mjs` | Computes `report.json` from the evidence files |
| `eval.test.mjs` | Unit tests for all of the above (`npx vitest run eval`) |

## Test set

Eight categories: kitchen, outdoor, clothing, hardware, grocery, books and toys, electronics accessories, home. Each product is paired with one of ten state triplets below, two products per triplet.

Zip kinds follow a fixed rule so they can be rechecked. Urban: an anchor ZCTA in a large metro's principal city with primary RUCA code 1 and under 5 sq mi of land. Suburban: the nearest ZCTA in the same state with a different place name, primary RUCA 1, at least 20 km from the anchor. Rural: the nearest ZCTA in the same state with primary RUCA 10, at least 100 km from the anchor. RUCA 1 is "Metropolitan core" and RUCA 10 is "Rural area: primary flow is to a tract outside an UA" ([ERS RUCA documentation](https://www.ers.usda.gov/data-products/rural-urban-commuting-area-codes/documentation)). Codes come from the [2020 RUCA ZIP code file](https://www.ers.usda.gov/media/5444/2020-rural-urban-commuting-area-codes-zip-codes.csv?v=96534) (ERS page last updated 2025-09-26); land area and distances from the [2026 Census Gazetteer ZCTA file](https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2026_Gazetteer/2026_Gaz_zcta_national.zip). Checked 2026-09-23.

| State | Urban (RUCA, land sq mi) | Suburban (RUCA, km) | Rural (RUCA, km) |
|---|---|---|---|
| MA | 02138 (1, 2.7) | 01760 (1, 21) | 01072 (10, 106) |
| PA | 19103 (1, 0.6) | 19462 (1, 20) | 19549 (10, 101) |
| GA | 30308 (1, 1.6) | 30272 (1, 20) | 31830 (10, 102) |
| TN | 37203 (1, 4.2) | 37069 (1, 21) | 38588 (10, 100) |
| IL | 60614 (1, 3.2) | 60164 (1, 21) | 61360 (10, 103) |
| MN | 55408 (1, 2.7) | 55075 (1, 21) | 56358 (10, 100) |
| TX | 78701 (1, 1.5) | 78610 (1, 23) | 77975 (10, 100) |
| CO | 80218 (1, 1.6) | 80129 (1, 21) | 80622 (10, 100) |
| AZ | 85004 (1, 2.1) | 85258 (1, 20) | 85137 (10, 103) |
| CA | 94110 (1, 2.4) | 94010 (1, 20) | 95385 (10, 104) |

## 1. Run the searches

```sh
WORKER_URL=<worker base URL> ORIGIN=<the Worker's ALLOWED_ORIGIN> npx tsx eval/run-searches.mjs
```

`tsx` lets the script use the browser's own zip lookup (`src/zip.ts`), so the Worker receives exactly what the site sends: city, state and the ZCTA centroid, never the zip. Searches run one at a time, 4 s apart (`DELAY_MS` overrides), well under the Worker's per-client and global limits. Each raw response goes to `docs/evidence/quality/responses/<id>.json`; per-search Brave calls, tokens and estimated cost, with totals, go to `run-summary.json`. A rerun skips searches already saved with status 200; pass ids as arguments to run a subset. No keys are needed; the Worker holds them.

## 2. Grade the results

A grader opens each result's URL in an ordinary browser session and records one entry in `docs/evidence/quality/grades.json` under `grades` (fields and allowed values in `grade-schema.json`). Copy `url` verbatim from `retailer.url` in the saved response, not from the browser's address bar; the probe comparison joins on it. Graders never log in, buy, or submit forms.

| Field | Judged as |
|---|---|
| `sells_product` | `yes`: the page offers the product; `equivalent`: a close substitute; `no`; `unknown`: could not tell |
| `local_exists` | Local results: the shop is at the listed address per its own site or listing. `unknown` when the evidence conflicts, such as a dead website with a current map listing. `n/a` for online |
| `distance_plausible` | Local results: shown distance roughly matches the address. `n/a` for online |
| `badges_sourced` | Every certification badge's source link supports the badge; `n/a` when there are none |
| `page_access` | What the person got: `ok`, `challenge` (CAPTCHA or "checking your browser"), `blocked` (refusal page), `error` |

## 3. Recall baseline

For each search, a separate web search (a different index from Brave's; never automated Google queries through a browser) collects up to 5 good retailers per section, excluding Amazon-owned businesses. Each is opened in a browser and recorded under `baseline` with `confirmed: true` only if it sells the product. `summarize.mjs` decides whether the site returned it (same registrable domain, or same name for a local shop without a website). For each miss the grader sets `miss_reason`: `not_in_brave_index` (a Brave `site:` query finds nothing), `weak_snippet`, `ranked_low`, `filtered` (blocklist or text rule), or `other`.

## 4. Access probe

The probe Worker fetches a page the way a well-behaved crawler would: its User-Agent names it and links the site's About page, it reads robots.txt first and obeys the group for its own token or `*` ([RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html)), and it returns only status, three headers (`server`, `cf-mitigated`, `content-type`), the page title, a challenge classification, and a SHA-256 and length of the first 1 MB. The title is kept so spot checks can see challenge pages such as "Just a moment..." without refetching. Redirects are followed one hop at a time (up to 5), and robots.txt is checked again for every new host and path; `final_url` records where it landed. A robots.txt that answers 5xx or not at all means no page fetch, recorded as `error` (with `robots: unreachable`) rather than as blocking. It never imitates a browser, rotates addresses, or solves challenges. The classification is a heuristic; the browser grading pass is what it is scored against.

```sh
npx wrangler deploy -c eval/access-probe/wrangler.jsonc --var ABOUT_URL:<site about page URL>
export PROBE_TOKEN="$(openssl rand -hex 32)"
printf %s "$PROBE_TOKEN" | npx wrangler secret put PROBE_TOKEN -c eval/access-probe/wrangler.jsonc
PROBE_URL=<probe workers.dev URL> node eval/access-probe/run-probe.mjs
npx wrangler delete -c eval/access-probe/wrangler.jsonc
```

The driver takes the first result URL per registrable domain from the saved responses, sends them one at a time 2 s apart, and saves `docs/evidence/quality/probe.json` after each. A rerun skips domains already in that file; delete a row to probe it again. The probe checks robots.txt and then fetches the page 2 s later, so each domain sees two requests (more if it redirects to another host). The driver stops on the first non-200 answer from the probe itself (wrong token or URL) or a network error reaching it. The method and token checks run only in the Workers runtime; test them by hand with `wrangler dev`. Delete the Worker as soon as the run ends. `ABOUT_URL` and the workers.dev host are passed at deploy time and never committed.

## 5. Summarize

```sh
node eval/summarize.mjs          # writes docs/evidence/quality/report.json
node eval/summarize.mjs --site   # also writes src/quality.json for the About page
```

Precision counts `yes` and `equivalent` as relevant (local results also need `local_exists: yes`) and leaves `unknown` (on either question) out of the denominator, reporting how many were left out. `badges_sourced` and `distance_plausible` are reported as counts of each answer. The bot blocked rate is `challenge`, `blocked` and `robots_disallow` over all probed domains except `error`. `--site` writes numbers only when precision and recall are all measured for both sections; otherwise the About page keeps saying "Not yet measured." The probe table compares the probe's verdict with what a person saw on the same URL: `bot_only` is bot-specific blocking.
