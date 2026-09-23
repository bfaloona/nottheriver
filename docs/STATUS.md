# Status

As of 2026-09-23. Pushed to `main`; CI and Pages green; the Worker is deployed and a live search from the Pages site works.

## Done

| Subject | What exists |
|---|---|
| Blocklist | `data/blocklist.json` and `data/blocklist.md` (39 domain and 14 name entries, each sourced and dated), `proxy/src/blocklist.ts`, 91 fixtures; red run recorded before the filter existed |
| Zips | `public/zips.json` (33,791 ZCTAs) built by `data/build-zips.mjs`, browser lookup in `src/zip.ts`, provenance and attribution in `data/README.md` |
| Scoring | `proxy/ranking/` (weights, score, haversine distance) |
| Ranking data | 28 certifications, 4 curated negatives, 14 accepted negative sources, each with a source and check date |
| Worker | One route (`POST /search`), CORS, byte-counted body cap, per-client and global rate limits, Brave and OpenRouter clients, schema validation, the full pipeline with both blocklist passes |
| Site | Search page, results with sort, filter and "Why this rank", About page, cost footer, CSP injected at build |
| End-to-end | Playwright smoke test against a mock proxy running the real handler and pipeline on fixtures; screenshots in `docs/evidence/` |
| Infrastructure | OpenTofu config for the Worker, its secrets and rate limits; `infra/plan-evidence.sh` for a redacted plan |
| CI | `ci.yml` (tests, lint, full-history gitleaks, bundle secret scan, e2e) and `pages.yml` (build, scan, deploy) |
| Quality evaluation | Harness, 60-search query set, grade schema, access probe, [quality.md](quality.md) skeleton, [ADR 0005](decisions/0005-site-access-and-mitigation.md) |
| Docs | [architecture](architecture.md), [privacy](privacy.md), [ranking](ranking.md), [costs](costs.md), [debt](debt.md), ADRs [0001](decisions/0001-external-services.md) to [0004](decisions/0004-down-ranking.md) |

## In flight

- None.

## Blocked on operator

| Gate | What it unblocks |
|---|---|
| Live quality evaluation: run the 60 searches, grade in a browser, deploy, run and delete the access probe, write the report and `src/quality.json` | The numbers in [quality.md](quality.md) and on the About page |
| OpenRouter account privacy settings ([privacy.md](privacy.md#openrouter-settings-operator-action-not-verified)) | Not verified by this project |

## Deploy (2026-09-23)

- `tofu apply` created the Worker and its `workers.dev` address (2 added, 0 changed, 0 destroyed), from a plan reviewed before apply. The rate-limit bindings were accepted at deploy; a 429 has not been triggered live.
- The first live search succeeded with `provider.data_collection: "deny"`: 10 local and 10 online results, 5 Brave calls, about $0.026. Screenshot: [evidence/live-search.jpg](evidence/live-search.jpg).
- Observed in that search: about half the online results were review articles rather than shops, and local results had no matched product. The quality evaluation measures this.

## Decisions made by the operator

- License: AGPL-3.0.
- Negative signals are allowed, under the policy in [ADR 0004](decisions/0004-down-ranking.md).
- The build prompt in `prompts/` stays as committed; history is not rewritten.
- The Playwright smoke test keeps the zip the build prompt names.
- Existing commit subjects stay as they are.

## Decisions needed

- How disputes are reviewed and resolved (the About page and [ranking.md](ranking.md) say TBD).
- Whether `independent_retailer_assoc` membership or positive signals should ever affect the score.
- Whether to add labor or environmental watchdogs to the negative-source registry.
- Whether zips with no ZCTA get a fallback or a clearer message.

## Questions guessed on

Every default below was taken without operator input; each is also reflected in the docs or [debt.md](debt.md).

**Search and services**
- Local results come from Brave `place_search` only; the web-search fallback is not built (verified: place_search 200, 3 results, 2026-09-23).
- Rate limit: 30 per 60 s per client key plus a global 60 per 60 s circuit breaker, because Cloudflare periods are only 10 or 60 s. The UI says "Try again in about a minute", matching `Retry-After: 60`.
- The Worker sends `provider.data_collection: "deny"` and fails rather than relaxing it.
- The model gets a structure-only schema; the full schema is enforced on its reply. Response validation against `search-response.json` runs only in tests, to fit the 10 ms CPU budget.
- JSON Schema library: `@cfworker/json-schema` (no `eval`, compiled at module scope).
- No retailer classification: every web result outside the negative-source domains is a candidate.
- Prompt templates are `.ts` string modules, not `.txt` files, because tsx cannot import `.txt` and Vite would load it as an asset URL.
- The LLM client records usage for every billed attempt, retries included, on `llm.usage`, and `complete()` returns only the validated data.
- `brave.ts` strips inline markup from titles and snippets and collapses whitespace; whether live responses contain markup is unchecked.
- Header values for `x-loc-city` are folded to ASCII; a name that stays non-ASCII drops the header.
- The handler sends `Vary: Origin` on every response, not only to the allowed origin; it grants no CORS permission.
- Empty `canonical_name` from the model falls back to the user's product with blocked brand names stripped, so a product that is only a blocked brand comes back as an empty name.
- Local result ids are assigned after the first blocklist pass, not straight after dedupe; ids stay unique.
- The source scrub also drops a signal whose claim contains the word "amazon", since claims are fetched page titles.
- "Queries that all point at blocked text" read as two cases, both tested: every fetched result blocked (no enrich call, empty results), and every online query empty after scrubbing (`invalid_llm_output` before any Brave call).

**Blocklist**
- Entries sourced only by a dated redirect, a subsidiary's Wikipedia article or a news source are kept with status `pending-rule-amendment` (amzn.to, amzn.com, a.co, 6pm.com, 'Amazon Style', fabric.com, amzn.eu); the filter ignores status.
- The name rule is one pass on punctuation-to-space normalization with per-entry `exact` or `prefix-word` matching, instead of the prescribed separator list.
- Adopted amazonaws.com and the sourced additions (souq.com, diapers.com, bookdepository.com, 'Amazon Pharmacy', vine.com, wag.com, yoyo.com, wondery.com, mgm.com, onemedical.com), plus a 'Woot' prefix-word name entry sourced with woot.com.
- wag.com returned 301 to an amazon.com path on 2026-09-23, so it is blocked on both its source and the redirect.
- Excluded buyvip.com and lovefilm.com (no source ties the domain to Amazon, and neither resolves). Handmade and Luxury Stores live inside amazon.com and are already covered.
- Two fixtures that duplicated others were turned into local cases with their own unlisted websites.

**Ranking and data**
- FTC bamboo-marketing cases (Kohl's, Walmart) are tagged `governance` (deceptive marketing), not `environmental`.
- `independent_retailer_assoc` is a badge only.
- Positive model signals are displayed, never scored. Acceptance is stricter than first designed: any signal must cite a fetched page that is the retailer's own or names it, and a duplicate (same kind, polarity and URL) counts once.
- Relevance is a substring match on normalized text, so "pan" matches inside "Japan".
- Certifications count once per kind; negative findings once per kind and source page; the cap applies before findings are subtracted.
- Proximity is scored from the displayed distance (haversine rounded to 0.1 km), and distance never uses Brave's `distance` field.
- Baseline and proximity sources link to `about.html#ranking` on the deployed site; ethics and environment keep their sources even when floored at 0.
- Source labels: negatives read '<Kind>: <claim>', certifications use their label, relevance uses the result's title (falling back to its name).
- madewell.com is inferred from the brand name: the Fair Trade directory lists Madewell with an empty link and the storefront returns 403 to curl.
- The three Grassroots Outdoor Alliance store names come from each store's own site title (all re-fetched 200 on 2026-09-23); their domains come from logo filenames on the member list.
- `negative-sources.md` has a machine copy, `negative-sources.json`, kept equal by a test.

**Zips**
- `public/zips.json` is committed; PR, VI, GU, AS and MP rows are included; a zip with no ZCTA shows not-found.
- The expected row count (33,791) is hard-coded in `data/build-zips.mjs` so a truncated download fails loudly; a new Gazetteer vintage needs a manual bump.
- Out-of-order or duplicate Gazetteer ids throw rather than being sorted.
- `join()` takes file contents, not paths, so its test needs no filesystem.
- `loadZips` evicts a failed fetch from its cache so a later search can retry.
- The sample fixture rows (00601, 00802, 02138, 10001, 60614, 96799, 96860, 96910, 96950, 99501) were extracted from the generated file, not hand-typed.

**Site**
- `sessionStorage` holds the last product text only, never the zip.
- The CSP is a `<meta>` tag injected at build only (Vite's dev server needs inline styles and an HMR socket), so the e2e run serves the built site through `vite preview`.
- Distance sort: ascending, missing distance last, ties broken by name.
- "Why this rank" renders as a `<ul>` grid rather than a table, so it reflows at 360 px.
- Component labels: Relevance, Ethics, Environment, Proximity. The weights line reads 'Ranked by relevance 0.25, ethics 0.30, environment 0.30, proximity 0.15.'
- Copy: 'Found N shops near you and M online.', 'Type what you are looking for.', 'Enter a five-digit zip code.', and 'N shops within X mi' using the farthest shown distance.
- Distance shows with the address; result snippets are not shown, which keeps stray brand words off the page.
- Positive signals show as plain rows with no dispute link; negatives get the warning row plus 'Dispute this'.
- The About page title is 'About {siteName}'; doc links point at `{repoUrl}/blob/main/<path>` and stay plain text without a repo URL.
- An inline SVG favicon stops the `/favicon.ico` 404 that the smoke test would count as a console error.
- `build.rolldownOptions.input` replaces the deprecated `rollupOptions` in Vite 8.3.
- `src/quality.json` shape: `{"measured": null}` until measured, then `{"measured": {date, searches, precision: {online, local}, recall: {online, local}}}` with fractions from 0 to 1, written by `node eval/summarize.mjs --site`.

**Infrastructure and CI**
- Stable `cloudflare_workers_script` and `cloudflare_workers_script_subdomain`, with `content_sha256` for change detection; the Worker is bundled by `wrangler deploy --dry-run`.
- No empty `provider "cloudflare" {}` block; the provider reads `CLOUDFLARE_API_TOKEN` from the environment.
- The Pages origin and the `workers.dev` host appear only in `TF_VAR_*` values and the `WORKER_URL` Actions variable, never in the repo; the deployed site necessarily contains both.
- The plan-evidence script refuses to run unless the five `TF_VAR_*` values are the named test values; test hooks are the env vars `PLAN_TEXT` and `OUT`; hosts are over-redacted; tofu's own '(sensitive value)' text is left as is.
- The full-history gitleaks scan runs the pinned gitleaks binary after a `fetch-depth: 0` checkout, not gitleaks-action, which scans only the pushed range on push events. gitleaks v8.30.1's sha256 matches the release checksums.
- Action majors (checked 2026-09-23): checkout v7, setup-node v7, configure-pages v6, upload-pages-artifact v5, deploy-pages v5. `ci.yml` has two jobs, check and e2e.
- `pages.yml` skips the npm cache so a deploy never restores a cache another run wrote.
- The bundle scan uses `gitleaks dir --config .gitleaks.toml`; the Brave rule matches the `BSA` prefix observed on issued keys.
- Self-tests for the scan and plan scripts are shell scripts under `.github/scripts/`.
- TypeScript 6.0.3 kept; relative imports are extension-less.

**End-to-end and evaluation**
- The mock proxy runs the real handler and pipeline under tsx with a fixture `fetch`; no code path can make a live call. It rebuilds its fixtures per search, so every search returns the same results.
- `smoke.spec.ts` loads the blocklist through tsx's `tsImport` (Playwright's loader rejects the JSON import) and does not import `data/blocklist.json` directly; neither web server is reused.
- Keyboard check: focus the first summary, press Enter, assert `details[open]`.
- Screenshots: `landing.png`, `results.png`, `about.png` at 1280x800 and `landing-360.png` at 360x640.
- Evaluation zips: urban, suburban and rural per state by a fixed RUCA and distance rule; 10 states, 2 products each, 60 searches.
- The probe fetches robots.txt first and one page per registrable domain, 2 s apart; its verdict is scored against the browser pass; grades and the recall baseline share one file and schema; searches run 4 s apart.
- Test count reported as 514 in 21 files (measured today). The task text's 463 is from before the pipeline and e2e commits.
- ADR 0001 is not verbatim from research/services.md. Its rate-limit decision (option B, 5/min, SEARCH_LIMITER) and bindings example were rewritten to match the code: RATE_LIMITER 30/60 s plus GLOBAL_LIMITER 60/60 s, namespaces 1001 and 1002. The distance sentence and the plan-gate bullet were amended as instructed. The live-check row cites the findings without the query text, which named a location.
- The hygiene grep is reported in STATUS as a control hit plus 3 expected matches, described generically, not the prescribed '0 hits, control 1 hit'. The orchestrator's out-of-band patterns never arrived, so I used my own (name, city, home path, key-filename prefix).
- README local dev uses 'npx wrangler dev --cwd proxy' with proxy/.dev.vars. The flag was checked against wrangler --help and matches the build:proxy form, but the command was not run.
- costs.md's worst-case LLM prompt cost takes a loose bound of 1 token per character over measured worst-case prompt lengths (enrich 25,605 chars with 200-char URLs, normalize 1,197). The 'typical' LLM cost is labeled an estimate. I added a Cloudflare Workers Free row (100,000 requests/day) from the research checks.
- debt.md was regrouped into topic sections. I added rows from spec's own required list and STATUS content: model negatives cannot fire, positive signals informational, cloudflare_worker trio, runtime response validation only in tests, dispute process undefined. The rate-limit rows were merged into three. The stale Brave gitleaks-rule row was removed, and the web-search fallback row was rewritten as not needed.
- ranking.md's dispute link points at .github/ISSUE_TEMPLATE/dispute-a-ranking.md. The site itself links to issues/new?template=.
- In STATUS, the nine review passes with '<n>' placeholders now show 'not recorded'. The session note says those counts could not be recovered after the crash.
- STATUS records the operator decisions from the session note in generic wording: build prompt kept with no history rewrite, smoke-test zip kept, commit subjects kept. No location is named.
- The 0003 weight rationale is written as reasoning plus arithmetic from the formula. No history or attribution was invented.

## Review passes

Each subject got `/simplify` plus a two-lens fresh-eyes review. Applied and rejected counts were not recorded for the first nine.

| Subject | Findings | Applied | Rejected |
|---|---|---|---|
| Infrastructure (config) | 4 |  |  |
| Zips | 5 |  |  |
| Ranking data | 8 |  |  |
| Scoring | 5 |  |  |
| Site | 11 |  |  |
| CI | 12 |  |  |
| Worker (handler and clients) | 9 |  |  |
| Blocklist | 10 |  |  |
| Quality evaluation harness | 16 |  |  |
| Plan evidence and CI self-tests | 8 | 6 | 0 |
| Search pipeline | 8 | 7 | 0 |
| End-to-end smoke test | 11 | 8 | 1 |
| Docs | 7 (from a simplification self-pass and a fresh-eyes review; the declined one asked to cut a step from architecture.md) | 6 | 1 |
| Docs (second review) | 10 | 10 | 0 |
| Project docs: simplify + Fable review (2 lenses) | 10 | 10 | 0 |
| Adversarial review of blocklist, tests and docs (the rejected one asked to change the build prompt, smoke-test zip and history, which the operator decided to keep) | 18 | 17 | 1 |

## Evidence

Run on 2026-09-23 against the working tree at `8cce4d6`.

| Check | Command | Result |
|---|---|---|
| Unit tests | `npm test` | `Test Files  21 passed (21)`, `Tests  540 passed (540)` |
| Blocklist suite | `npx vitest run proxy/test/blocklist.test.ts` | `Tests  153 passed (153)`; `tests/fixtures/blocklist-cases.json` holds 91 fixtures across domains, subdomains, country TLDs, short links, embedded URLs and local names, including the 'Whole Foods Co-op' must-pass case |
| Red runs before the code existed | `docs/evidence/blocklist-red-run.txt`, `worker-red-run.txt`, `zips-red-run.txt` | `69 failed \| 45 passed (114)`; `48 failed \| 2 passed (50)`; `15 failed (15)` |
| HR2 injection | in `proxy/test/pipeline.test.ts`: "removes a blocked retailer that enters after the first pass", "runs twice, and the model enrichment cannot bring a blocked retailer back" | pass (part of the 540) |
| HR3 location | `src/api.test.ts` "sends city, state and a 2-decimal centroid, never the zip"; `src/main.test.ts` "never puts the zip in the URL, storage, or the request"; `proxy/test/pipeline.test.ts` "sends the model no location" | pass (part of the 540) |
| Lint and types | `npm run lint` | exit 0 |
| Site build | `npm run build` | `✓ built in 58ms` |
| Worker bundle | `npm run build:proxy` | `Total Upload: 276.03 KiB / gzip: 73.26 KiB` |
| Bundle secret scan | `npm run scan:bundle` | `no leaks found` (site and Worker bundles) |
| Secrets in history | `gitleaks git --config .gitleaks.toml .` | `55 commits scanned.`, `no leaks found` |
| End-to-end smoke and screenshots | `npm run e2e` | `3 passed (3.1s)` |
| Screenshots | `docs/evidence/landing.png`, `landing-360.png`, `results.png`, `about.png` | present |
| `tofu plan` | `infra/plan-evidence.sh` | `Plan: 2 to add, 0 to change, 0 to destroy.` in [evidence/tofu-plan.txt](evidence/tofu-plan.txt) |
| CI on `main` | GitHub Actions | CI `success` (1m4s), Pages `success` (35s) on the first push |
| Live search screenshot | manual, from the Pages site | 10 near you, 10 online: [evidence/live-search.jpg](evidence/live-search.jpg) |
| Hygiene grep | case-insensitive grep of tracked files and `git log -p --all` for personal names, the operator's location, local home paths and key filenames, after a planted control | control: 1 hit. Tracked files: 3 expected matches (a place name in the zip dataset, the home-path guard inside `infra/plan-evidence.sh`, and the build prompt kept by operator decision). History: commit author lines and the same content; no key filenames |
