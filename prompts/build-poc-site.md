# Build prompt: nottheriver POC

You are an autonomous engineering agent. Build a working proof-of-concept of **nottheriver**, a product search site that recommends local and online retailers and never shows Amazon. Work in the repo at the current directory (git branch `main`, currently empty). Read this whole prompt before acting. "Operator" below means the human who runs you.

## 1. Mission

A visitor types a product (for example "cast iron skillet") and a US zip code. The site returns retailers that sell that product or close equivalents, split into **Near you** and **Online**, ranked by ethical practice, environmental sustainability, and proximity. Amazon and Amazon-owned businesses never appear. That exclusion is the reason the site exists.

Goal now: a POC a stranger can use at a GitHub Pages URL. Vision: an open-source project on open standards (OpenTofu for infrastructure, public PRs, public cost ledger). Shortcuts are allowed for the POC, but every shortcut is written down (section 11) so best practice stays visible.

## 2. Hard requirements (non-negotiable, each has an automated test)

| ID | Requirement | Test |
|----|-------------|------|
| HR1 | No Amazon or Amazon-owned business ever appears in results, in any section, at any rank. | Unit tests on the blocklist filter (section 3 defines matching) with at least 20 fixtures; an end-to-end test against a mocked proxy whose fixtures include Amazon entries, asserting none render. |
| HR2 | The exclusion is enforced in deterministic code twice: once after fetching, and once more as the final step before results are returned to the browser. The LLM is never the only line of defense. | Test injects an Amazon retailer into the mocked Enrich (LLM) output and asserts it is still removed. |
| HR3 | The only location data that leaves the browser is the ZCTA-level location described in section 6. The raw 5-digit zip string is never sent, no finer location is ever collected, and the LLM receives city and state only. | Two tests: in `src/`, mocked `fetch` asserts no outbound URL, header, or body contains the zip string; in `proxy/`, the built LLM payload is asserted to contain no coordinates. |
| HR4 | No API key or secret exists in the repo, git history, or built static bundle. | gitleaks in pre-commit and in CI with full history (`fetch-depth: 0`); CI greps `dist/` for `sk-or-` and for the Brave key prefix (verify the prefix from the operator's key format without printing the key; if unknown, grep for any 20+ character base64-looking string and review hits manually). |
| HR5 | Every ranking decision is explainable: each result shows every non-zero score component with its value and a source URL. | Test renders fixture results and asserts each one lists all non-zero components with a value and a source. |

## 3. Blocklist

Maintain `data/blocklist.json` plus `data/blocklist.md` (provenance and change log). Seed with:

- Domains: `amazon.*` (all TLDs and country suffixes), `amzn.to`, `amzn.com`, `a.co`, `primevideo.com`, `wholefoodsmarket.com`, `zappos.com`, `6pm.com`, `woot.com`, `shopbop.com`, `audible.*`, `ring.com`, `eero.com`, `blinkforhome.com`, `twitch.tv`, `imdb.com`, `goodreads.com`, `abebooks.*`, `pillpack.com`, `comixology.com`.
- Names (for local results): "Whole Foods", "Whole Foods Market", "Amazon Fresh", "Amazon Go", "Amazon Style", "Amazon 4-star", "Amazon Books", "Zappos".

**Verification rule:** an entry stays if the cited public source (Wikipedia "Amazon (company)" subsidiaries section or "List of Amazon products and services") shows it was Amazon-owned at any time. Closure or rebranding does not remove an entry. Remove only entries you cannot source; record the source URL and check date per entry in `data/blocklist.md`. Do not add entries you cannot source.

**Matching rules** (implement exactly these, test each):
- Domain: extract the registrable domain using the public suffix list (use a small library or a vendored list). `amazon.*` matches any registrable domain whose label is `amazon` under any public suffix (`amazon.com`, `amazon.co.uk`, `amazon.de`). Subdomains match their registrable domain.
- Name: normalize (lowercase, strip punctuation, collapse whitespace). Block if the normalized name equals an entry, or starts with an entry followed by a separator (` - `, ` #`, ` (`, `,`, ` at `, ` in `). "Whole Foods Market - West Seattle" is blocked. "Whole Foods Co-op" is not blocked; include it as a must-pass fixture.
- A local result with a website domain on the list is blocked regardless of name.

## 4. Stack and repo layout

Keep dependencies minimal so outside contributors can read the whole thing in an hour.

- **Site:** Vite + TypeScript, no framework (plain DOM). Builds to `dist/`, deployed to GitHub Pages by GitHub Actions. The site sends one request per search and renders the response. It never builds prompts or talks to Brave or OpenRouter directly. UI requirements are in section 15.
- **Proxy:** one Cloudflare Worker in TypeScript at `proxy/`. It **owns the whole pipeline** (section 8): fixed prompt templates, Brave calls, OpenRouter calls, filtering, scoring. It exposes exactly one route, `POST /search`, taking `{product, city, state, lat, lon}` and returning ranked results. There is no general LLM or search relay route; CORS is not authentication, so the Worker must be safe to call from curl.
- **Infrastructure:** OpenTofu in `infra/` deploys the Worker, its secrets (read from `TF_VAR_*` environment variables at apply time, never from committed `.tfvars`), the `ALLOWED_ORIGIN` variable, and the route. State backend: local for the POC (section 11).
- **Tests:** Vitest for site and proxy. Playwright for one end-to-end smoke test that runs against the local dev server with a **mocked proxy** serving fixture responses. No CI test calls Brave or OpenRouter.
- **Data:** `data/` holds the blocklist, the zip dataset, the certification seed list, and the negative-signal source registry.

Layout:

```
.github/workflows/   ci.yml (test, lint, gitleaks, bundle secret scan), pages.yml
data/                blocklist.json, blocklist.md, zips.json, README.md, certifications.json, negatives.json, negative-sources.md
docs/                architecture.md, privacy.md, ranking.md, costs.md, debt.md, STATUS.md, evidence/, decisions/
infra/               OpenTofu for the Worker
proxy/               Worker source, prompt templates, tests
src/                 site source
tests/               e2e and proxy mock
```

Repo hygiene from the first commit: `.gitignore` (node_modules, dist, .env*, *.tfstate*, .terraform/, prompts/operator-local.md), `.gitleaks.toml`, `LICENSE`, `README.md`, and `.github/ISSUE_TEMPLATE/dispute-a-ranking.md` (the down-ranking policy depends on it). Do not add CONTRIBUTING, a code of conduct, PR templates, or other community boilerplate yet; list them in `docs/debt.md` under "before going public".

## 5. External services (verify before building; record checks in `docs/decisions/0001-external-services.md`)

**Brave Search API** (docs: https://api-dashboard.search.brave.com/app/documentation)
- Web search: `GET https://api.search.brave.com/res/v1/web/search`, header `X-Subscription-Token`.
- Local: `/res/v1/local/pois` and `/res/v1/local/descriptions`. Verify whether these take free-text queries or only location ids returned in a web search's `locations` block, and whether the operator's plan includes them. Design step 2 of section 8 around what you find. If the plan lacks local endpoints, fall back to web search with `{product} near {city}, {state}` and record the fallback in `docs/debt.md`.
- Send location as city/state text plus the coordinates from section 6, using whichever request parameters or headers the docs specify.

**OpenRouter** (docs: https://openrouter.ai/docs)
- Model: `google/gemma-4-31b-it`. Fallback on error: `google/gemma-4-26b-a4b-it`. On 2026-09-23 the public models endpoint (`GET https://openrouter.ai/api/v1/models`) listed both with `structured_outputs` and `response_format` in `supported_parameters`, and the `:free` variants without `structured_outputs`. Re-check on the day you build and record the result. Do not use `:free` variants.
- Always request strict JSON schema output (`response_format: {type: "json_schema", ...}`). Define schemas in `proxy/schemas/` and validate every response against them before use; on validation failure retry once, then return a clear error.
- Set the app-identification headers OpenRouter documents (referer and title). Verify the exact header names in the docs; do not guess between `X-Title` and `X-OpenRouter-Title`.
- In `docs/privacy.md`, instruct the operator to set the OpenRouter account's privacy settings to disallow prompt training and logging, and state that you did not verify this setting.

## 6. Privacy and safety rules

- **Location.** The zip is converted in the browser to city, state, and the ZCTA centroid (latitude and longitude, 2 decimal places) from `data/zips.json`. The Worker receives city, state, and the centroid; it forwards the centroid to Brave for proximity and gives the LLM city and state only. Be honest in `docs/privacy.md`: the centroid identifies the zip area, so Brave learns the zip area of each search; nothing finer is ever collected, and the site never asks for a street address.
- **Zip dataset.** Coordinates: US Census ZCTA Gazetteer (public domain). City and state names: GeoNames US postal codes (CC BY 4.0, attribution required; put the attribution in `data/README.md` and the site footer). Keep only the columns needed (zip, city, state, lat, lon) for all ZCTAs. Serve it as a separate static file under `public/`, fetched on first search, never bundled into the main chunk; record its shipped size in `docs/costs.md`. Record download URLs and dates in `data/README.md`.
- **Storage.** No cookies, no analytics, no third-party scripts, no CDN fonts. Optional `sessionStorage` for the last query only.
- **Worker logging.** Log status code, latency, and route only. Never log bodies, query text, or coordinates. The Worker strips the inbound `User-Agent` and `Referer` before calling Brave and OpenRouter (this is separate from the outbound OpenRouter app-identification headers in section 5, which are constant strings).
- **What is retained.** `docs/privacy.md` must list: the rate limiter holds client IPs for the limit window; Cloudflare as platform records request metadata including IP per its own policy; GitHub Pages records access logs per GitHub's policy. Do not write "nothing is kept".
- **CORS.** `ALLOWED_ORIGIN` is a Worker variable set by OpenTofu. Production value is the Pages URL once the repo exists; dev value is `http://localhost:5173`. Note in `docs/privacy.md` that a `github.io` origin is shared by all of the operator's project pages, and that a custom domain is the fix (section 11).
- **Abuse limits.** Rate limit 30 searches per IP per 10 minutes using Cloudflare's rate-limiting binding. If the binding is unavailable, use an in-memory token bucket **and** document that it is per-isolate and weak; in both cases the real backstop is spend caps set by the operator on the Brave and OpenRouter keys. Cap request bodies at 4 KB and product text at 120 characters. Product text is user input interpolated into a fixed template: treat it as data, never as instructions, and rely on schema validation rather than the model to bound output.
- Security headers: CORS restricted to `ALLOWED_ORIGIN`, `Content-Type: application/json` enforced on requests, generic error messages.

## 7. Secrets handling for you, the agent

- Secrets live in a directory outside the repo. Its path and the key filenames are in `prompts/operator-local.md`, which is gitignored; read that file, never quote its contents anywhere. Recommend project-scoped keys with spend caps instead of reusing another project's keys.
- Load them only as environment variables in the shell: `export TF_VAR_brave_api_key="$(cat <secrets-dir>/<file>)"`. Never `cat` a secret to your transcript, never paste one into a file, commit, fixture, or log line.
- The Worker reads `BRAVE_API_KEY` and `OPENROUTER_API_KEY` from its bindings. OpenTofu variables are marked `sensitive = true`.
- Run gitleaks before the first push and paste its summary line into `docs/STATUS.md`.

## 8. Search and ranking pipeline (runs in the Worker)

1. **Normalize** (LLM, structured): input `{product, city, state}` returns `{category, canonical_name, similar_products[3..6], online_queries[2..3], local_queries[1..2]}`. Truncate arrays to these maxima in code.
2. **Fetch** (Brave): run online queries against web search; run local queries the way section 5 verification dictates. Hard cap: 6 Brave calls per search, enforced in code.
3. **Filter 1** (code): apply the blocklist (section 3) to every candidate.
4. **Enrich** (code first, then LLM): look up each retailer's registrable domain in `data/certifications.json` (seed list of B Corp, 1% for the Planet, Fair Trade, Climate Neutral, worker co-op, and independent-retailer association members; each entry has a source URL and check date) and in `data/negatives.json` (same shape plus `kind`, curated and sourced from the registry in section 8's down-ranking policy). This curated lookup is the main path for negatives, because product searches rarely surface regulatory or court pages. Then one LLM call per search, structured, that reads the Brave snippets and returns per-retailer `{signals: [{kind, polarity, claim, source_url, confidence}]}`. In code, discard any signal whose `source_url` was not among the fetched results. For negative signals, also discard unless the source domain is in `data/negative-sources.md`.
5. **Score** (code, deterministic). Every component is in `[0, 1]`:
   - `relevance`: 1.0 if the retailer's snippet or title contains `canonical_name` or a `similar_products` entry after normalization, 0.5 if only the `category`, else 0.2.
   - `ethics`: 0.5 baseline; +0.25 per ethics certification (B Corp, Fair Trade, worker co-op) capped at 1.0; −0.25 per accepted negative signal of kind `labor` or `governance`, floored at 0.
   - `env`: 0.5 baseline; +0.25 per environmental certification (1% for the Planet, Climate Neutral) capped at 1.0; −0.25 per accepted negative signal of kind `environmental`, floored at 0.
   - `proximity` (local only): `max(0, 1 − distance_km / 40)` using haversine from the centroid. Online results use 0.5.
   - `score = 0.25·relevance + 0.30·ethics + 0.30·env + 0.15·proximity`. Weights live in `proxy/ranking/weights.ts` and are displayed on the page. Record the rationale in `docs/decisions/0003-scoring.md`.
6. **Filter 2** (code): apply the blocklist again to the final list. This is the last step before the response is built.
7. **Respond**: the browser renders two sections, each result showing retailer, matched product, distance (local only), certification badges with source links, any negative signal with its source, and a "Why this rank" toggle listing every non-zero component with value and source.

**Down-ranking policy** (the operator chose to allow negatives):
- A negative signal lowers a score only if its `source_url` domain is in `data/negative-sources.md`, a registry of accepted sources (regulatory bodies, court records, established news organizations, recognized labor and environmental watchdogs). Seed it with a short list and a one-line rationale per entry; do not add sources you cannot verify exist.
- Every negative shown carries the citation and a "Dispute this" link to the GitHub issue template.
- The LLM never authors negative language for display. The page shows the signal kind and the source; the claim text is the source's own title or snippet.
- Write this policy into `docs/ranking.md` so contributors and affected businesses can read it.

## 9. Open-source posture

- License: default AGPL-3.0 so hosted forks must publish their changes. Ask the operator once; MIT is the alternative. If no answer, proceed with AGPL-3.0 and note it in `docs/STATUS.md`.
- `README.md` states the mission in one paragraph, the Amazon exclusion as the first feature, and links to privacy, ranking, costs, and debt docs.
- `docs/costs.md` is the open ledger: Brave and OpenRouter unit prices with the date checked, and the estimated cost per search.
- Each search shows a small footer: number of Brave calls, LLM tokens used, and estimated cost.
- Architecture decisions go in `docs/decisions/NNNN-title.md`, ADR format, short. Required: 0001 external services checks, 0002 proxy and enforcement points, 0003 scoring, 0004 down-ranking policy.

## 10. Deployment

- `pages.yml` builds on push to `main` and deploys `dist/` to GitHub Pages. The Worker URL is a build-time variable, not a secret.
- `infra/` applies the Worker with OpenTofu. Document the exact commands in `docs/architecture.md`. Save redacted `tofu plan` output to `docs/evidence/`.
- Creating the GitHub repo, pushing, enabling Pages, and `tofu apply` are outward-facing: **stop and ask the operator before each**. If no answer arrives, mark the item "blocked on operator" in `docs/STATUS.md`, finish everything that does not depend on it, and treat the run as complete up to that gate.
- Future hosting on Infomaniak: one paragraph in `docs/architecture.md` naming what is Cloudflare-specific (rate-limit binding, secrets bindings) and what would replace it. No adapter code for the POC.

## 11. Allowed shortcuts (write each into `docs/debt.md` with the best-practice alternative)

- Local OpenTofu state instead of a remote backend.
- In-memory rate limiting if the Cloudflare binding is unavailable.
- Shared `github.io` origin instead of a custom domain.
- Small hand-seeded certification and negative lists instead of live directory or per-retailer lookups.
- Web-search fallback for local results if the Brave plan lacks the local endpoint.
- No caching layer.

Anything else you skip goes in the same file. An empty debt file means you did not look.

## 12. Working rules

- Small conventional commits (`feat:`, `fix:`, `test:`, `docs:`, `infra:`). Stage explicit paths only. Subject line under 60 characters; body only when the why is not obvious, and never a history of the problem.
- **Public-repo hygiene.** Every commit, comment, and doc will be public. Never name the operator or any person in code, comments, docs, or commit text; the git author signature is the only place a human name appears. Never write local filesystem paths, hostnames, account names, or key filenames into the repo. Commits authored by an AI agent carry a `Co-Authored-By:` trailer naming the model (for example `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`).
- **Naming.** The site name and domain may change. Put them in one place (`src/config.ts` for the site, a Worker variable for the proxy) and reference that everywhere, including page titles, the OpenRouter title header, and docs where practical. Do not hard-code the repo name in code.
- **Less, done well.** Deliver the smallest set of files that meets sections 2 and 13 with best practices. No scaffolding, templates, or config for things not yet needed; if a generator adds boilerplate, delete what is unused.
- **Review cadence.** After each unit of work (blocklist, zip lookup, scoring, Worker routes and limits, UI, infra) run `/simplify` and then `/code-review` (or an equivalent fresh-eyes review if those commands are unavailable), fix findings before starting the next unit, and note each pass in `docs/STATUS.md`.
- Test first for the blocklist filter, the zip lookup, the scoring function, and the Worker CORS and rate-limit logic. Show the Amazon test failing before the filter exists.
- Comments explain why, not what. Keep them short; no issue histories, no references to plans or sessions.
- Do not fabricate data: every seed entry in `data/` needs a source URL and a check date. If a source cannot be found, leave the entry out and say so.
- Keep `docs/STATUS.md` current: done, in flight, blocked on operator, decisions needed, questions you guessed on.
- Before claiming done, run the checklist in section 13 and paste the evidence (command and the relevant output line) into `docs/STATUS.md`.

## 13. Definition of done

- [ ] `npm test` green; the blocklist suite has at least 20 fixtures across domains, subdomains, country TLDs, short links, local business names, and the "Whole Foods Co-op" must-pass case.
- [ ] HR2 injection test and HR3 mocked-network test green.
- [ ] CI runs tests, lint, gitleaks (full history), and the bundle secret grep; all green on `main`.
- [ ] Playwright smoke test against the mocked proxy: "cast iron skillet" + "98116" renders at least one local and one online fixture result, no blocklist match, each with a "Why this rank" block.
- [ ] `tofu plan` saved to `docs/evidence/` with no secrets in it.
- [ ] One manual live search against the deployed Worker from the Pages URL, screenshot in `docs/evidence/` (or "blocked on operator").
- [ ] `docs/` contains architecture, privacy, ranking, costs, debt, STATUS, and ADRs 0001 through 0004.
- [ ] `README.md`, `LICENSE`, `.gitignore`, `.gitleaks.toml`, and the dispute issue template exist; `git log` and `grep -ri` over the repo show no personal names, local paths, or key filenames.
- [ ] Landing page, results, and about page meet section 15; one screenshot of each in `docs/evidence/`.
- [ ] Final report lists every question you guessed on and every item in `docs/debt.md`.

## 14. Assumptions you may take unless the operator says otherwise

- US only for the POC (zip code is the location input).
- English only.
- No user accounts, no saved searches.
- Results capped at 10 local and 10 online.
- Node 22 LTS, npm.

## 15. User interface

Use the `frontend-design` skill if available. The aim is a page that looks deliberate and inviting, built from simple controls, with advanced CSS deferred.

- **Landing page carries the full product.** Product field, zip field, and search button front and center above the fold, with one sentence of mission and nothing else competing for attention. It should look attractive and compelling on first load, on phone and desktop.
- **Results.** Two sections, Near you and Online. Provide sort (score, distance, name), filter (local or online, has certification), and a details affordance per result (hover or focus popover on desktop, tap-to-expand on touch) holding the "Why this rank" components and outbound links to the retailer and to each cited source. Every control is a native element (`<select>`, `<input type="checkbox">`, `<details>`, `<button>`) styled lightly; no custom widget libraries.
- **Footer and about.** One short footer line with the cost footer from section 9, an About link, and the data attributions. The About page is a few paragraphs: mission, the Amazon exclusion, how ranking works, how to dispute, link to the repo.
- **Styling.** One stylesheet with design tokens (color, type scale, spacing) in `:root`, a light and dark scheme via `prefers-color-scheme`, system font stack, no CSS framework. Keyboard operable, visible focus states, contrast at WCAG AA. Record deferred visual work in `docs/debt.md`.
