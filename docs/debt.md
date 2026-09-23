# Known shortcuts

Shortcuts taken for the proof of concept, each with the best-practice alternative.

| Shortcut | Best-practice alternative |
|----------|---------------------------|
| Local OpenTofu state file; it holds both secret binding values and every sensitive variable (account id, API keys, Pages origin) in plaintext (gitignored, but on disk) | Encrypted remote backend with locking, or OpenTofu state encryption |
| In-memory, per-isolate rate limiting if the Cloudflare rate-limiting binding is unavailable | Platform rate-limiting binding or a shared store, backed by provider spend caps |
| Shared `github.io` origin for CORS | Custom domain, so the allowed origin is not shared with other project pages |
| Small hand-seeded certification and negative-signal lists | Live directory lookups or per-retailer checks against certifying bodies and accepted sources |
| Web-search fallback for local results if the Brave plan lacks local endpoints | Brave local (POI) endpoints or another places data source |
| No caching layer | Cache normalized queries and fetch results with a short TTL to cut cost and latency |
| No gitleaks rule for Brave Search keys: Brave's API docs do not publish a key format | Add a prefix-specific rule once Brave documents the format; meanwhile rely on the default generic rule and the CI bundle scan |
| Nothing cross-checks the OpenTofu rate-limit defaults (`rate_limit_per_minute` 30, `global_limit_per_minute` 60) against `RATE_LIMIT` / `GLOBAL_LIMIT` in `proxy/src/handler.ts`; the wrangler config test does not cover `infra/variables.tf` | A test that parses `infra/variables.tf` defaults and asserts they equal the handler constants |
| No route resource: the Worker is served on `workers.dev` only | Custom domain with a route resource |
| Zips with no ZCTA (7,846 GeoNames US postal codes, mostly PO-box/unique codes such as 10008) return not-found; no GeoNames-coordinate fallback, which would break the Census-only coordinate rule | Operator decision on a fallback or a clearer message |
| Single 1.27 MB `zips.json` (317 KB gzip -9) fetched on first search; per-prefix sharding rejected because the fetch URL would expose the zip prefix in GitHub Pages logs | Revisit if first-search latency matters |
| GitHub Pages compression of `zips.json` unmeasured until deploy | Measure with `curl -sI -H 'Accept-Encoding: gzip, br'` and record in `costs.md` |
| GeoNames place spellings kept as-is (e.g. 96860 -> 'Jbphh') | Curated display-name overrides |
| 111 ZCTAs share a centroid at 2-decimal rounding (intended ~1 km coarsening) | None needed; recorded so it is not mistaken for a bug |
| Certifier directories (bcorporation.net returns a Cloudflare 403; the 1% for the Planet directory is JavaScript-only) cannot be re-checked by a script, so those 12 rows' check dates will go stale | Automated re-check in a real browser |
| `independent_retailer_assoc` is a badge only and does not change the score (F-13) | Operator decision on whether association membership should count |
| Only one watchdog (Good Jobs First) in the negative-source registry | Operator policy choice on adding labor or environmental NGOs |
| Fair Trade rows are product-level, not whole-company | Keep the badge text 'Sells Fair Trade Certified products' (C10 label) |
| Local relevance uses only the place title and its categories list (Brave place results have no description), so most local results score 0.5 or 0.2 | Fetch /local/descriptions or the store's product page |
| Relevance is a substring match on normalized text, so a short product name matches inside a longer word ('pan' in 'Japan') and a plural product name does not match singular text | Whole-word matching with an optional plural s, or a structured relevance judgment validated in code |
| The score.ts certification and signal kind lists are hardcoded from the prompt's section 8; no test checks they match the 'kinds' map in data/certifications.json | A cross-file assertion in pipeline.test.ts |
| Serif system font stack not checked on Android (no Georgia) or Windows (no ui-serif). | Test on real devices; if the fallback is poor, self-host an open-license serif (still no CDN). |
| Desktop popover can extend below the viewport for the last result. | Flip it above the summary near the viewport bottom (a few lines of JS). |
| Popover hover/focus/Escape behaviour is not covered by an automated browser test (click-to-pin checked by hand only). | A Playwright check that hover opens it, Escape closes it, and focus inside keeps it open. |
| No skip link. | Add 'Skip to search' before the header. |
| No print stylesheet. | @media print that hides the controls and expands every <details>. |
| Dark mode follows prefers-color-scheme only. | A manual toggle with a data-theme attribute, remembered in sessionStorage. |
| Loading state is a text line only. | A step indicator once the Worker reports stages. |
| Native <select> and checkbox internals are drawn by the browser and were not contrast-checked. | Audit with an a11y tool and add a custom border if a browser fails 3:1. |
| No social/OG image. | Export the creek mark as a plain OG image. |
| Baseline/proximity source links (about.html#ranking from the Worker) open in a new tab even though they are same-site. | Open same-origin source links in the same tab. |
| CSP is a build-time meta tag because GitHub Pages cannot set headers. | A real CSP header behind a custom domain. |
| The site name in the wordmark is filled in by JS (C15 keeps it out of the HTML), so the header is briefly empty on first paint. | Inject it at build time with a transformIndexHtml replacement. |
| WORKER_URL masking is partial: GitHub prints a step's env block before the step runs, so the 'Mask Worker URL' step shows the value once in its own log header. Every later step is masked. The workers.dev host is public in the deployed bundle anyway. | A custom domain, or store it as a secret (the prompt says variable). |
| The bundle scan does not catch a bare high-entropy string with no key-like word next to it. A bare-string fallback would flag hashed chunk names and zips.json. Coverage is the two project key patterns (sk-or-, BSA) plus the default gitleaks rules, which need a key-like word such as 'apiKey=' next to the value. | Revisit if a new key type without a known prefix is added. |
| The gitleaks install step (pinned version and sha256) is duplicated in ci.yml and pages.yml. | A shared install script or composite action called from both workflows. |
| Workflows use floating major tags (@v7 etc.), not commit SHAs. | Pin actions to commit SHAs with a bot updating them. |
| Rate limit is 30 per 60 s per client key (full IPv4 address or IPv6 /64) plus a global 60 per 60 s circuit breaker; the prompt's 30 per 10 minutes cannot be expressed with Cloudflare's 10 s or 60 s periods, so the sustained ceiling is 10x the target | A shared store (Durable Object or KV) counting over a 10-minute window |
| The model gets a structure-only JSON schema (value constraints stripped by structuralOnly) because provider strict-mode keyword support is unverified; the full schema is enforced on every reply | Send the full schema once the live gate shows the provider accepts it |
| Local shops without a website are not shown (a place with no url, or one that yields no registrable domain, is dropped before filtering) | Key local results on place identity, not domain |
| No retailer classification: every parsed web result outside the negative-source domains becomes a candidate, review and news sites included | A deterministic domain-category filter or a validated is_retailer field |
| Clients are keyed on CF-Connecting-IP, trusted only because Cloudflare's edge sets it | A non-Cloudflare deployment must key on the socket peer address |
| The name rule under-blocks the bare 'Whole Foods' entry followed by a separator ('Whole Foods - Midtown', fixtures N36/N37 are allowed). The entry has to be exact so 'Whole Foods Co-op' passes. The domain rule covers these listings when a website is present (N38). | Not decided |
| The name rule over-blocks plain-space suffixes such as 'Whole Foods Market Midtown' and 'Amazon Fresh Pickup'. This is the safe side for the no-Amazon requirement. | None needed |
| 'Amazon' in the middle of a name ('The Amazon Cafe') or as part of a longer word ('Amazonia Plants') is allowed by design. | None needed |
| Redirects are not followed at runtime, so an unlisted shortener whose URL contains no Amazon token passes. | A 'redirector' entry kind |
| media-amazon.com and ssl-images-amazon.com (Amazon image hosts): no public source found, not added. | Add them once a public source ties them to Amazon |
| normalizeName turns symbols into spaces before NFKC so that '™' cannot fold into 'tm'. Side effect: enclosed-letter symbols such as 'Ⓐ' become a space, so 'Ⓐmazon' is not caught. Low risk. | Not decided |
| The ownership check reads Wikipedia by hand on the check date. Nothing re-verifies sources automatically. | A scheduled re-check of each entry's source |
| Access-probe challenge detection is a heuristic: the cf-mitigated header, plus vendor challenge-script markers on non-2xx responses only. The browser grading pass is its ground truth. | Not decided |
| The probe runs from Cloudflare's network and sends a CF-Worker header, while Brave's crawler follows Googlebot's permissions and does not name itself. So the probe's blocked rate approximates, but does not measure, what Brave's crawler meets. | Not decided |
| Grading uses one grader and no inter-rater agreement check. Recall is measured against another search engine's top results (up to 5 per section), not against every shop that exists. | Not decided |
| The script that picked the zips is not committed (it read raw RUCA and Gazetteer files that stay out of the repo). The rule, the sources and a table of each zip's RUCA code and distance are in eval/README.md, so the choice can be rechecked. | Not decided |
| run-searches.mjs must run under tsx so it can reuse the browser's src/zip.ts lookup. Plain node cannot run it. | Not decided |
| The robots.txt parser does not percent-encoding-normalize paths and reads robots.txt up to 1 MB (RFC 9309 sets a minimum of 500 KiB). | Not decided |
| The literal-value leftover check covers only TF_VAR_brave_api_key, TF_VAR_openrouter_api_key and CLOUDFLARE_API_TOKEN. The account id is covered by the 32-hex rule, and the origin and site URL by the host rules. | Not decided |
| The synthetic plan fixture is hand-written, not captured from real 'tofu show' output. The first real run is the check that the redaction fits the real output. | Not decided |
| The 32-hex redaction's behavior at end of line was not tested separately on GNU sed (CI) and BSD sed (macOS). Low risk: tofu quotes string values. | Not decided |
| The bundle-scan self-test proves the scan as a whole goes red. It does not prove gitleaks and the prefix grep each catch the samples on their own. | Not decided |

## Before going public

- CONTRIBUTING guide
- Code of conduct
- Pull request templates
