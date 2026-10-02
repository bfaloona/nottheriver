# Status

As of 2026-10-01. Pushed to `main`; the Worker is deployed at `975dfdd` with the store-type filter, distance groups, classifier-judged local ranking, "store"-always local searches, the normalize cache, the chain badge, and the faster enrich path (compact prompt, throughput routing, no model signals, enrich split into one call for online and one for local candidates). The quality evaluation was measured on a 20-search sample and rerun twice at each step; the latest two runs (2026-09-29, with the chain badge and split enrich) show online precision 98.4% and local precision 70.9% and 71.0%, counting a shop that does not exist as bad ([quality.md](quality.md#store-types-chain-badge-and-shop-breadth-2026-09-29)). Store types is finished (the operator ruled no on a specialist tier and a values component; the `store_breadth` field was removed again). The chain list fixes (formerly priority 6) are committed; they go live with the next Worker deploy. The next work is the Amazon plan.

## Done

| Subject | What exists |
|---|---|
| Blocklist | `data/blocklist.json` and `data/blocklist.md` (39 domain and 14 name entries, each sourced and dated), `proxy/src/blocklist.ts`, 91 fixtures; red run recorded before the filter existed |
| Normalize cache | `proxy/src/normalize-cache.ts`: the model's reading of a product is cached in Workers KV (`NORMALIZE_CACHE`, 30 days), so repeat searches send the same search wording; live 2026-09-25, checked with two live searches (the second skipped the model call). Local searches always end in "store" |
| Zips | `public/zips.json` (33,791 ZCTAs) built by `data/build-zips.mjs`, browser lookup in `src/zip.ts`, provenance and attribution in `data/README.md` |
| Scoring | `proxy/ranking/` (weights, score, haversine distance) |
| Ranking data | 28 certifications, 4 curated negatives, 14 accepted negative sources, each with a source and check date |
| Worker | One route (`POST /search`), CORS, byte-counted body cap, per-client and global rate limits, Brave and OpenRouter clients, schema validation, the full pipeline with both blocklist passes |
| Site | Search page, results with sort, filter and "Why this rank" (plain words), a map of nearby shops (OpenStreetMap tiles, Leaflet), About page, cost footer, CSP injected at build |
| End-to-end | Playwright smoke test against a mock proxy running the real handler and pipeline on fixtures; screenshots in `docs/evidence/` |
| Infrastructure | OpenTofu config for the Worker, its secrets and rate limits; `infra/plan-evidence.sh` for a redacted plan |
| CI | `ci.yml` (tests, lint, full-history gitleaks, bundle secret scan, e2e) and `pages.yml` (build, scan, deploy) |
| Quality evaluation | Harness, 60-search query set, grade schema, access probe, [ADR 0005](decisions/0005-site-access-and-mitigation.md); all 60 searches run, 20 graded with a recall baseline and miss reasons, access probe run and deleted ([check](evidence/quality/eval60/probe-deleted.txt)), [quality.md](quality.md) and the About page headline; a second blind grader agreed on 25 of 27 local rows, and regrading the 45 unknown local rows puts local precision at 56% (94 of 167) ([regrade-local](evidence/quality/eval60/regrade-local/)) |
| Local store-type filter | Brave's undocumented `icon_category` becomes the local snippet; restaurants and amusement parks are dropped as `place_category` ([ranking.md](ranking.md)) |
| Local classifier coverage | The model sees every local candidate (cap 16 to 20, tied to the place-search count by a test); `usage.unclassified_shown` counts shown results it did not judge |
| Distance groups | Nearby within 10 mi (metro zips, RUCA 1 to 3) or 30 mi (RUCA 4 to 10); up to 3 "Farther away" out to 100 mi; beyond that dropped as `too_far`. RUCA code per ZCTA in `zips.json`, sent with each search ([ranking.md](ranking.md#distance-groups)) |
| Wording-fix rerun | The 20 graded searches run twice on 2026-09-25/26 with "store" always and the normalize cache: wording identical across runs and zips; local precision 63.6% and 61.7% in the two runs vs 58.1% on 9-24 (a shop that does not exist counts as bad, ruling 2026-09-26), nearby top 3 good in 32 of 49 and 32 of 50 vs 29 of 51, local recall 28 and 30 of 86 vs 24; the model's sells judgment flipped 8 of 248 shops Brave returned in both runs ([quality.md](quality.md#rerun-after-fixing-the-search-wording)) |
| Amazon alternatives research | `research/` (54 retailer files, 26 list sites, `research/index.json`), merged a6fa019; the Worker deploy added fda.gov and ca.gov as accepted negative sources and World of Books' B Corp certification. Feeding it into ranking is planned: [plans/amazon-alternatives-in-ranking.md](plans/amazon-alternatives-in-ranking.md) |
| Grouped concerns (Amazon plan Phase A) | A result with 2 or more concerns shows one line ("2 concerns, 2021 to 2023") that opens to each finding with its date, source and dispute link; a single concern shows as before, with its date. Screenshot: [evidence/results.png](evidence/results.png) |
| Weighted findings (Phase B0, [ADR 0006](decisions/0006-weighted-findings.md)) | Each finding costs 0.25 × band (by penalty) × relation; minor findings capped at 0.25 per dimension; no age factor. The 4 live findings are all major, so live scores did not change. Deployed at 4855b7f (2026-09-27) |
| About quality summary | Two plain lines from eval20-0925 (both runs) plus the path to the raw evidence; index of runs in [evidence/quality/README.md](evidence/quality/README.md). A local shop that does not exist now counts as bad, and every graded eval runs twice ([eval/README.md](../eval/README.md)) |
| Local ranking | Local relevance from the classifier's sells judgment (yes 1.0, maybe 0.5); offline, good shops in each nearby top 3 went from 23 to 29; a live rerun showed no change (30 of 54 before, 29 of 51 after) ([quality.md](quality.md#rerun-after-distance-groups-and-classifier-judged-ranking)) |
| Caching and store-types triage (priority 1, 2026-09-27) | Test tying `score.ts` kind lists to `data/certifications.json` (red run in [evidence/cert-kinds-red-run.txt](evidence/cert-kinds-red-run.txt)); `eval/compare.mjs` compares wording and results between two saved runs (reproduces eval20-0925 run2 numbers); the rest triaged in [caching-and-store-types.md](caching-and-store-types.md#triage-2026-09-27) |
| Amazon execution approach (priority 2, 2026-09-27) | [plans/amazon-execution-approach.md](plans/amazon-execution-approach.md): gate-to-gate stretches, one per session, side findings parked as Priorities or debt rows, deploys by hand; approved by the operator |
| Worker deploys | Agents deploy the Worker with `infra/deploy.sh` (operator grant, 2026-09-24): committed and pushed code only, and only a new bundle; any other infrastructure change stops for the operator. When to run it: `.claude/skills/deploy/SKILL.md` |
| Positive signals | A positive signal must cite a fetched page on another site that names the shop; a shop's own page no longer counts ([ADR 0004](decisions/0004-down-ranking.md)) |
| Search latency (2026-09-28) | [search-latency.md](search-latency.md): the enrich model call is 76-93% of a search's time; the browser is under 1 s. One-line JSON and no self-citations in the enrich prompt (7c855e1) cut the median search from 25-29 s to 15-16 s on the 20 graded searches, twice, with recall, graded-bad shown and sell flips at noise level; the zip list now downloads on first form focus (af6f2cd). Pushed 2026-09-28; the site change is live (checked in the live bundle). Priority 6 (2026-09-28): throughput routing (c504d1a), no model signals (e07c707, ADR 0004 amended) and no editorial pages sent to the model (64cdd9d) cut the median search to 7-8 s on the 60 graded searches, twice; nearby sell verdicts got stricter past noise (every graded shop newly dropped was graded "doesn't sell"; the 37 ungraded flips, graded blind: it drops 18 bad and 4 good shops and newly shows 6 bad and 2 good), likely from the prompt change ([results](search-latency.md#priority-6-changes-2026-09-28)). The Worker was deployed at 6c5059e (includes 7c855e1) and the operator checked the live site. Split enrich (LQ2), recreated on main (first committed as 26976c9, merged as 8de26ed) and rerun on the 60 searches x 2 rounds: median search 4.2 s to 3.4 s, model cost +10%, no failures; graded blind, its verdict changes drop 25 bad and 5 good shops and newly show 12 bad and 4 good, and about half of nearby shops move from "may sell it" to "likely sells it" (graded 84% good), which changes the nearby top 3 in 37 of 60 searches ([results](search-latency.md#split-enrich-on-top-of-priority-6-2026-09-28)). Shipped on the operator's ruling (8de26ed, 50b1e1f; Worker deployed at 50b1e1f). Confirmed live 2026-09-29: all 20 responses of store types Phase 4's first run list exactly two `enrich` calls in `usage.llm`, median search 2.9 s, max 5.4 s ([evidence/quality/eval20-store-types/](evidence/quality/eval20-store-types/)) |
| Store types (2026-09-27 to 09-30, [plans/store-types.md](plans/store-types.md)) | Chain badge: `data/chains.json` (39 sourced chains; 41 after the 2026-10-01 upkeep), the optional `chain` response field and a neutral badge on the site; the `store_breadth` judgment in the enrich reply, response only (removed 2026-10-01; Worker deployed at `975dfdd`). Phase 4 measured on the 20 graded searches twice: online precision 98.4%, local 70.9% and 71.0%, 0 badges on non-chain shops, 95% badge coverage, 2 of 241 sells flips between runs. The model's specialist label was 47.5% good on "may sell it" shops against the 60% bar and agreed with the grader on 76% of specialist or general labels, so the operator ruled no on a specialist relevance tier and a values component and Phases 3b and 5 are dropped ([results](quality.md#store-types-chain-badge-and-shop-breadth-2026-09-29)). Chain counts corrected 2026-10-01 (row "Chain list upkeep") |
| Chain list upkeep (2026-10-01) | `data/chains.json` from the Phase 4 source check ([results](quality.md#store-types-chain-badge-and-shop-breadth-2026-09-29)): Walmart 5,217 to 4,615 (the page's total counted Sam's Club); Cabela's 70 to 49 (Cabela's-named stores, April 2025, after the Bass Pro rebranding; the sentence carries no citation); REI "190+" to 195 from REI's own newsroom facts page, read in a browser; Ace Hardware stays "5,000+" (US, July 2024), since the page's "over 5,700" is worldwide; Sports Basement added (16 stores, counted from its own store page) and The North Face added (286 VF-operated stores worldwide, VF's FY2026 10-K, no US figure given). `data/README.md` now allows a count of a company's own full store list |
| Docs | [architecture](architecture.md), [privacy](privacy.md), [ranking](ranking.md), [costs](costs.md), [debt](debt.md), ADRs [0001](decisions/0001-external-services.md) to [0006](decisions/0006-weighted-findings.md) |

## In flight

- None.

## Priorities

How work is scheduled: this list is the order of work. The top item not blocked on the operator is next. Each item names its next concrete step and what it waits on. The operator orders the list; an agent adds a new item at the bottom with a proposed position, and moves a finished item to Done. Decisions the operator owes live under "Decisions needed", not here.

| # | Work | Next step | Waits on |
|---|---|---|---|
| 2 | Amazon plan Phase B: import 54 findings and 6 certifications ([plan](plans/amazon-alternatives-in-ranking.md)), run under [the approved approach](plans/amazon-execution-approach.md) | B1, the claim-wording sheet (review item R1), as its own session; the plan's status checklist holds B1 and the B2 gate | Operator sign-off on every claim at B2 |
| 3 | Amazon plan Phase C: measure (offline replay, then live rerun against T1 to T4) | After Phase B deploys | Phase B |
| 4 | Amazon plan Phase D: suggested shops | Revisit after Phase C (operator ruling Q4: not yet) | Phase C |
| 5 | Consumer co-ops (REI) as a positive signal: `worker_coop` scores today, consumer co-ops do not (operator remark, 2026-09-27) | Propose badge vs ethics score, with sources for co-op status; proposed position: after Phase C | Operator decision on the proposal |

## Blocked on operator

| Gate | What it unblocks |
|---|---|
| OpenRouter account privacy settings ([privacy.md](privacy.md#openrouter-settings-operator-action-not-verified)) | Not verified by this project |
| Brave call budget for eval runs: the standing authorization to raise the cap ended 2026-09-30 | Any further graded rerun (about 80 Brave calls each) |

## Deploy (2026-09-23)

- `tofu apply` created the Worker and its `workers.dev` address (2 added, 0 changed, 0 destroyed), from a plan reviewed before apply. The rate-limit bindings were accepted at deploy but did not throttle a live burst. After the in-memory limiter was redeployed (1 changed), 40 requests over one reused connection returned 21 `400` then 19 `429`, while 40 requests on separate connections returned no `429` because they spread across isolates ([debt.md](debt.md)).
- The first live search succeeded with `provider.data_collection: "deny"`: 10 local and 10 online results, 5 Brave calls, about $0.026. Screenshot: [evidence/live-search.jpg](evidence/live-search.jpg).
- Observed in that search: about half the online results were review articles rather than shops, and local results had no matched product. The quality evaluation measures this.

## Decisions made by the operator

- License: AGPL-3.0.
- Negative signals are allowed, under the policy in [ADR 0004](decisions/0004-down-ranking.md).
- The build prompt in `prompts/` stays as committed; history is not rewritten.
- The Playwright smoke test keeps the zip the build prompt names.
- Existing commit subjects stay as they are.
- The stronger local classifier is not shipped: Gemini 2.5 Flash with a prompt paragraph dropped good local shops on the graded sample, and gpt-oss-120b missed the pre-set precision gain ([quality.md](quality.md#experiments-that-did-not-ship)).
- Distance groups: 10 mi nearby for metro zips, 30 mi for other zips, nothing beyond 100 mi; the zip's RUCA code picks the group.
- Distances are shown in miles everywhere a person reads them.
- "Why this rank" is plain words with links only for certifications and concerns (2026-09-24). This departs from HR5 in the build prompt ("every non-zero component with its value and a source"), which stays as committed; the full values remain in the API response ([ADR 0003](decisions/0003-scoring.md)).
- The map of nearby shops loads automatically, above the Near you list, with OpenStreetMap tiles; OpenStreetMap sees the visitor's IP address and the area ([privacy.md](privacy.md)).
- No dispute response promise ships with the Amazon alternatives import, though it adds about 54 "Dispute this" links; the review process stays TBD and the gap is accepted (2026-09-26, [plans/amazon-alternatives-in-ranking.md](plans/amazon-alternatives-in-ranking.md)).
- Local searches always end in "store", and the model's reading of a product is cached per product in Workers KV; the normalize prompt no longer receives city and state (2026-09-25, [plans/search-variation.md](plans/search-variation.md)). The 30-day cache lifetime was the agent's pick; change it in `proxy/src/normalize-cache.ts`.
- Caching and store types (2026-09-27, [caching-and-store-types.md](caching-and-store-types.md)): no place-search cache for now (CQ1); the 2026-09-26 ruling accepting shop-judging variance stands (CQ2); independent vs chain shows as a badge only, no score effect and no filter (CQ3); specialist vs generalist is a relevance question and also a values question, the values part only if easy (CQ4); chain labels are recorded per baseline shop, local and online (CQ5).
- Chain badge (2026-09-27, [plans/store-types.md](plans/store-types.md)): dealer-owned chains such as Ace count as chains with a note; the badge shows on nearby and online rows as "Chain, <count> stores" linked to its source, in a neutral style distinct from the teal certification badge.
- Chain labels (2026-09-27): stores in the Do It Best buying co-op that trade under their own name are not chains; REI counts as a chain.
- Search latency (2026-09-28, [search-latency.md](search-latency.md#open-questions-for-the-operator)): route the model for throughput despite 1.3-2.3x model cost (LQ1 yes); stop asking the model for signals, since none has reached a result since 2026-09-24 (LQ4 drop); grade the split enrich call's verdict changes before deciding on it (LQ2 yes; graded 2026-09-28, then shipped on the operator's ruling).
- Store types Phase 4 (2026-09-30, [plans/store-types.md](plans/store-types.md), [results](quality.md#store-types-chain-badge-and-shop-breadth-2026-09-29)): no specialist relevance tier (Q5; "may sell it" shops the model called specialist were 47.5% good against the 60% bar) and no specialist values component (Q6; M5 agreement 76% against the 85% gate). Phases 3b and 5 are dropped. Remove `store_breadth` from the Worker (2026-10-01, after [the review](store-breadth-review.md)); removed in `10cc13f`, Worker deployed at `975dfdd` (2026-10-01) after a paired check on identical inputs ([evidence](evidence/quality/eval20-breadth-removal/README.md)).
- Amazon Phases B to D run under [plans/amazon-execution-approach.md](plans/amazon-execution-approach.md) (approved 2026-09-27): one gate per phase B (claim sign-off), an operator ruling (not an automatic rollback) on a Phase C target miss, Phase C rows graded by an agent blind.

## Decisions needed

- Whether local recall should favor independents: the site finds 23% of independent baseline shops against 36% of chain stores (a gap within noise at this sample size).
- Whether marketplaces (Facebook Marketplace is classified `marketplace` and kept) should appear at all.
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
- Search latency, overnight 2026-09-28 (operator: "implement clear wins and fixes, testing and merging to main as needed"): "merging to main" read as local main only, so nothing was pushed or deployed. "Clear win" read as faster with recall, graded-bad shown and sell flips within noise on two graded-search runs and no cost increase; the compact enrich prompt met it, throughput routing did not (cost rises, and LQ1 was already put to the operator).
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

**Store types (2026-09-27)**
- A store count the source gives only as a floor shows as "5,000+ stores"; counts use thousands separators.
- 23 of the 33 rows in `data/chains.json` cite Wikipedia, not the company's own page; Target and Walmart cite corporate pages. Swap the rest when re-checked.
- Four rows' counts include stores outside the US (noted per row; `data/README.md` says the count is the source's stated total). Since 2026-10-01 The North Face's count is worldwide, with no US figure given.
- Chains unlisted because no source found states a count: Williams Sonoma, Sports Basement, The North Face, Patagonia (patagonia.com blocks agents; an operator check could confirm its own count), and the TJX banners (only the corporate site tjx.com appeared, with a multi-brand total). They show no badge, and Phase 4's coverage measure counted them as misses by construction: Sports Basement and The North Face were returned without a badge in both runs (38 to 39 of 40 to 41 chain shops badged). Costco, Dollar General, Urban Outfitters, GameStop, Micro Center and L.L.Bean were added 2026-09-27 (39 rows); Dollar General and GameStop counts checked against their 10-K text. Sports Basement and The North Face were added 2026-10-01 (Done, "Chain list upkeep").
- The `store_breadth` judgment was added in Phase 3a (required in the model's reply, off-list values kept as no judgment) and removed 2026-10-01 after the measure showed it did not separate good shops from bad ([review](store-breadth-review.md)); the grader labels and saved responses that contain it stay as evidence.

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
| Caching and store-types triage (Fable) | 4 corrections to the draft triage | 4 | 0 |
| Store-types plan (Fable fresh-eyes) | 16 | 16 | 0 |
| Amazon execution approach (Fable fresh-eyes) | 12 | 12 | 0 |
| Store types Phases 0 and 1 (Fable; P2, adding Costco and more chains, deferred to Phase 4) | 7 | 6 | 0 |
| Store types Phase 2, site badge (Fable) | 4 | 4 | 0 |
| Store types Phase 3a, store breadth (Fable; T5, an isolated pipeline test, not done) | 7 | 4 | 0 |
| Store types Phase 4, measure (advisor; every figure traced to `report.json` and `breadth-measures.json`; the rejected one is a cosmetic duplicate marker in run 2 grade notes) | 8 | 7 | 1 |
| Store breadth value (Fable memo; recommendation to remove the field, and 3 corrections to the brief) | 1 + 3 | 1 (removed at `975dfdd`) | 0 |

## Evidence

Run on 2026-09-23 against the working tree at `8cce4d6`. Latest checks, 2026-10-01 at `975dfdd`: 872 unit tests passed (25 files), `npm run e2e` 3 passed, lint and typecheck clean, CI and Pages `success`; the table below is the 2026-09-23 run.

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
