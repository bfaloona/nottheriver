# Known shortcuts

Shortcuts taken for the proof of concept, each with the best-practice alternative. "Not decided" means no alternative has been chosen yet.

## Infrastructure and operations

| Shortcut | Best-practice alternative |
|----------|---------------------------|
| Local OpenTofu state file; it holds both secret binding values and every sensitive variable (account id, API keys, Pages origin) in plain text (gitignored, but on disk) | Encrypted remote backend with locking, or OpenTofu state encryption |
| In-memory, per-isolate rate limiting if the Cloudflare rate-limiting binding is unavailable; each isolate counts separately, so it is weak | Platform rate-limiting binding or a shared store, backed by provider spend caps |
| Rate limit is 30 per 60 s per client plus a global 60 per 60 s circuit breaker. The requirement of 30 per 10 minutes cannot be expressed with Cloudflare's 10 s or 60 s periods, so the sustained per-client ceiling is 10 times the target. `mitigation_timeout`, which could extend a block, is undocumented in the runtime docs and unused | A shared store (Durable Object or KV) counting over a 10-minute window |
| Clients are keyed on `CF-Connecting-IP` (full IPv4 address, or IPv6 /64), although Cloudflare advises against IP keys because many users can share one address. The header is trusted only because Cloudflare's edge sets it | A non-Cloudflare deployment must key on the socket peer address; a signed client token if shared addresses become a problem |
| Nothing cross-checks the OpenTofu rate-limit defaults (`rate_limit_per_minute` 30, `global_limit_per_minute` 60) against `RATE_LIMIT` / `GLOBAL_LIMIT` in `proxy/src/handler.ts`; the wrangler config test does not cover `infra/variables.tf` | A test that parses `infra/variables.tf` defaults and asserts they equal the handler constants |
| Shared `github.io` origin for CORS | Custom domain, so the allowed origin is not shared with other project pages |
| No route resource: the Worker is served on `workers.dev` only | Custom domain with a route resource |
| Stable `cloudflare_workers_script` + `cloudflare_workers_script_subdomain`, not the newer `cloudflare_worker` trio the provider labels beta | Migrate once the trio is stable |
| No caching layer | Cache normalized queries and fetch results with a short TTL to cut cost and latency |
| Web-search fallback for local results: not needed, because `place_search` was verified with the project's key on 2026-09-23 | None needed |

## Search pipeline

| Shortcut | Best-practice alternative |
|----------|---------------------------|
| No retailer classification: every parsed web result outside the negative-source domains becomes a candidate, review and news sites included | A deterministic domain-category filter or a validated `is_retailer` field |
| Local shops without a website are not shown (a place with no URL, or one that yields no registrable domain, is dropped before filtering) | Key local results on place identity, not domain |
| The model gets a structure-only JSON schema (value constraints stripped) because provider strict-mode keyword support is unverified; the full schema is enforced on every reply | Send the full schema once the first live search shows the provider accepts it |
| The response is validated against `search-response.json` only in tests, not at runtime, to stay inside the Free plan's 10 ms CPU budget | Runtime validation on a paid plan, or a cheaper hand-written check |
| `fetchCandidates` runs the Brave calls in parallel (`Promise.all`). If one returns non-2xx, the whole search fails with 502 while the calls already started still cost money | Keep partial results from the calls that succeeded |
| `scrubSources` rescores every row that survives the second pass, even when nothing was removed (at most about 40 scoring calls per request) | Skip rows with nothing removed, if profiling ever shows a cost |
| `dedupe` in `pipeline.ts` repeats the seen-set pattern of `uniqueBy` in `proxy/ranking/score.ts` | Export one helper and use it in both |

## Blocklist

| Shortcut | Best-practice alternative |
|----------|---------------------------|
| The name rule replaces the prescribed separator list with punctuation-to-space plus word-prefix matching. The bare 'Whole Foods' entry blocks any name it starts, except two hand-listed co-op spellings ('Whole Foods Co-op', 'Whole Foods Cooperative'); another co-op spelling is over-blocked | Add a spelling to the entry's `except` list when one is reported |
| Accents are folded before names are compared, so a name that really starts with an accented form of an entry is blocked too. This is the safe side | None needed |
| The same rule over-blocks plain-space suffixes such as 'Whole Foods Market Midtown' and 'Amazon Fresh Pickup'. This is the safe side | None needed |
| 'Amazon' in the middle of a name ('The Amazon Cafe') or as part of a longer word ('Amazonia Plants') is allowed by the name rule (the second pass's text rule still drops a result whose name contains the word) | None needed |
| The second pass's text rule drops any result whose title, name, snippet or matched product contains the word "amazon" (or a glued name entry such as 'AmazonBasics'), so a shop that says 'not on Amazon' disappears | Not decided |
| Redirects are not followed at runtime, so an unlisted shortener whose URL contains no Amazon token passes | A 'redirector' entry kind for a small sourced list of shorteners |
| media-amazon.com and ssl-images-amazon.com (Amazon image hosts): no public source found, not added | Add them once a public source ties them to Amazon |
| `normalizeName` turns symbols into spaces before NFKC so that '™' cannot fold into 'tm'. Side effect: enclosed-letter symbols such as 'Ⓐ' become a space, so 'Ⓐmazon' is not caught. Low risk | Not decided |
| The ownership check reads Wikipedia by hand on the check date. Nothing re-verifies sources automatically | A scheduled re-check of each entry's source |

## Ranking data

| Shortcut | Best-practice alternative |
|----------|---------------------------|
| Small hand-seeded certification and negative-signal lists | Live directory lookups or per-retailer checks against certifying bodies and accepted sources |
| Model-suggested negatives cannot fire: they must cite a fetched page on an accepted-source domain, and those pages are dropped at fetch. Only curated negatives appear | Fetch registry pages as citable evidence rows, separate from shop results |
| Positive signals the model points at are informational only and never change the score | Operator decision on whether any should count |
| `independent_retailer_assoc` is a badge only and does not change the score | Operator decision on whether association membership should count |
| Only one watchdog (Good Jobs First) in the negative-source registry | Operator policy choice on adding labor or environmental NGOs |
| How disputes are reviewed and resolved is not defined; the About page says TBD | A written review process with a response time |
| Certifier directories (bcorporation.net returns a Cloudflare 403; the 1% for the Planet directory is JavaScript-only) cannot be re-checked by a script, so those 12 rows' check dates will go stale | Automated re-check in a real browser |
| Fair Trade rows are product-level, not whole-company | Keep the badge text 'Sells Fair Trade Certified products' |
| The certification and signal kind lists in `score.ts` are hardcoded; no test checks they match the `kinds` map in `data/certifications.json` | A cross-file assertion in `pipeline.test.ts` |
| Local relevance uses only the place title and its categories list (`/local/descriptions` is not called), so most local results score 0.5 or 0.2 | Fetch `/local/descriptions` or the store's product page |
| Relevance is a substring match on normalized text, so a short product name matches inside a longer word ('pan' in 'Japan') and a plural product name does not match singular text | Whole-word matching with an optional plural s, or a structured relevance judgment validated in code |
| A shop's own page can be cited as a positive signal: in the pipeline fixtures (`tests/fixtures/llm/enrich.json` citing `tests/fixtures/brave/web-1.json`) Blue Heron Goods gets an 'Environmental' signal whose claim is its own product title, visible in `docs/evidence/results.png` | Require a positive signal to cite a third-party page |
| The model view (`llmView` in `proxy/src/enrich.ts`) caps title and snippet but not URL, so a long URL raises prompt size and cost | Cap or drop the URL in the model view |

## Zip data

| Shortcut | Best-practice alternative |
|----------|---------------------------|
| Zips with no ZCTA (7,846 GeoNames US postal codes, mostly PO-box or single-organization codes such as 10008) return not-found; no GeoNames-coordinate fallback, which would break the Census-only coordinate rule | Operator decision on a fallback or a clearer message |
| Single 1.27 MB `zips.json` (317 KB with `gzip -9`) fetched on first search; per-prefix sharding rejected because the fetch URL would expose the zip prefix in GitHub Pages logs | Revisit if first-search latency matters |
| GitHub Pages compression of `zips.json` unmeasured until deploy | Measure with `curl -sI -H 'Accept-Encoding: gzip, br'` and record in `costs.md` |
| GeoNames place spellings kept as-is (e.g. 96860 -> 'Jbphh') | Curated display-name overrides |
| 111 ZCTAs share a centroid at 2-decimal rounding (the intended ~1 km coarsening) | None needed; recorded so it is not mistaken for a bug |

## Site

| Shortcut | Best-practice alternative |
|----------|---------------------------|
| CSP is a build-time `<meta>` tag because GitHub Pages cannot set headers | A real CSP header behind a custom domain |
| Serif system font stack not checked on Android (no Georgia) or Windows (no ui-serif) | Test on real devices; if the fallback is poor, self-host an open-license serif (still no CDN) |
| Desktop popover can extend below the viewport for the last result | Flip it above the summary near the viewport bottom |
| Popover hover, focus and Escape behaviour is not covered by an automated browser test (click-to-pin checked by hand only) | A Playwright check that hover opens it, Escape closes it, and focus inside keeps it open |
| No skip link | Add 'Skip to search' before the header |
| No print stylesheet | `@media print` that hides the controls and expands every `<details>` |
| Dark mode follows `prefers-color-scheme` only | A manual toggle with a `data-theme` attribute, remembered in `sessionStorage` |
| Loading state is a text line only | A step indicator once the Worker reports stages |
| Native `<select>` and checkbox internals are drawn by the browser and were not contrast-checked | Audit with an accessibility tool and add a custom border if a browser fails 3:1 |
| No social/OG image | Export the creek mark as a plain OG image |
| Baseline and proximity source links (`about.html#ranking`, built by the Worker) open in a new tab even though they are same-site | Open same-origin source links in the same tab |
| The site name in the wordmark is filled in by JS (it is kept out of the HTML so it lives in one place), so the header is briefly empty on first paint | Inject it at build time with a `transformIndexHtml` replacement |

## CI, secrets and tests

| Shortcut | Best-practice alternative |
|----------|---------------------------|
| `WORKER_URL` masking is partial: GitHub prints a step's env block before the step runs, so the 'Mask Worker URL' step shows the value once in its own log header. Every later step is masked. The `workers.dev` host is public in the deployed bundle anyway | A custom domain, or store it as a secret |
| The bundle scan does not catch a bare high-entropy string with no key-like word next to it; a bare-string fallback would flag hashed chunk names and `zips.json`. Coverage is the two project key patterns (`sk-or-`, `BSA`) plus the default gitleaks rules, which need a key-like word such as 'apiKey=' next to the value | Revisit if a new key type without a known prefix is added |
| The bundle-scan self-test proves the scan as a whole goes red. It does not prove gitleaks and the prefix grep each catch the samples on their own | Not decided |
| The gitleaks install step (pinned version and sha256) is duplicated in `ci.yml` and `pages.yml` | A shared install script or composite action called from both workflows |
| Workflows use floating major tags (`@v7` etc.), not commit SHAs | Pin actions to commit SHAs with a bot updating them |
| The plan-evidence leftover check covers only `TF_VAR_brave_api_key`, `TF_VAR_openrouter_api_key` and `CLOUDFLARE_API_TOKEN` by literal value. The account id is covered by the 32-hex rule, and the origin and site URL by the host rules | Not decided |
| The synthetic plan fixture is hand-written, not captured from real `tofu show` output. The first real run is the check that the redaction fits the real output | Not decided |
| The 32-hex redaction's behavior at end of line was not tested separately on GNU sed (CI) and BSD sed (macOS). Low risk: tofu quotes string values | Not decided |
| `smoke.spec.ts` loads the blocklist through tsx's `tsImport`, because Playwright's loader rejects `proxy/src/blocklist.ts`'s JSON import without `with { type: 'json' }` | Add the import attribute, or drop the workaround once Playwright accepts the import |
| No tsconfig type-checks `playwright.config.ts` (the root include is `['src']`); eslint still covers the file | Add it to the tests tsconfig |
| The results screenshot uses fixture places far from the typed zip, so the near section reads '5 shops within 982 mi' and local results have no proximity row. It shows layout, not real distances | Fixture places near the screenshot zip |
| Every `npm run e2e` rewrites the four tracked PNGs in `docs/evidence`, so local runs leave binary diffs | Gate the screenshot test behind an env var, or accept the churn |
| If the CI e2e job ever sets `BASE_PATH`, `vite preview` serves under `/<repo>/` and the e2e base URL 404s | Derive `baseURL` from `BASE_PATH` in `playwright.config.ts` |

## Quality evaluation

| Shortcut | Best-practice alternative |
|----------|---------------------------|
| Access-probe challenge detection is a heuristic: the `cf-mitigated` header, plus vendor challenge-script markers on non-2xx responses only. The browser grading pass is its ground truth | Not decided |
| The probe runs from Cloudflare's network and sends a `CF-Worker` header, while Brave's crawler follows Googlebot's permissions and does not name itself. So the probe's blocked rate approximates, but does not measure, what Brave's crawler meets | Not decided |
| Grading uses one grader and no inter-rater agreement check. Recall is measured against another search engine's top results (up to 5 per section), not against every shop that exists | A second grader on a sample |
| The script that picked the evaluation zips is not committed (it read raw RUCA and Gazetteer files that stay out of the repo). The rule, the sources and a table of each zip's RUCA code and distance are in `eval/README.md`, so the choice can be rechecked | Not decided |
| `run-searches.mjs` must run under tsx so it can reuse the browser's `src/zip.ts` lookup. Plain node cannot run it | Not decided |
| The robots.txt parser does not percent-encoding-normalize paths and reads robots.txt up to 1 MB (RFC 9309 sets a minimum of 500 KiB) | Not decided |

## Documentation and evidence

| Shortcut | Best-practice alternative |
|----------|---------------------------|
| `docs/evidence/tofu-plan.txt` does not exist; it needs one run of `infra/plan-evidence.sh` with a real `CLOUDFLARE_API_TOKEN` (listed in STATUS under Blocked on operator) | Run the script once and commit its output |
| Applied and rejected counts for the first nine review passes are unrecoverable; STATUS shows them as not recorded | Record counts at the time of each review |
| The STATUS review row for the first docs pass (6 of 7 applied) is self-reported, from a self-pass plus an advisor review, not a separate reviewer's count | An independent reviewer records its own counts |
| Typical per-search LLM cost in `costs.md` is an estimate | Replace with OpenRouter's `usage.cost` from the first live search and the quality evaluation |

## Before going public

- CONTRIBUTING guide
- Code of conduct
- Pull request templates
