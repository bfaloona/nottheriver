# Status

## Done

- Build and test tooling: Vite, TypeScript (site and Worker projects), Vitest, ESLint, Playwright config.
- Repo hygiene: `.gitignore`, `.gitleaks.toml`, `LICENSE` (AGPL-3.0), `README.md` stub, dispute issue template.
- License: AGPL-3.0, chosen by the operator.
- gitleaks pre-commit hook in `.githooks/`, enabled by `npm install` (the `prepare` script sets `core.hooksPath`).

## In flight

- `index.html`, `src/main.ts`, and `proxy/src/index.ts` are placeholders to be replaced.
- README links to `docs/privacy.md`, `docs/ranking.md`, and `docs/costs.md`, which are not written yet.

## Blocked on operator

- None yet.

## Decisions needed

- None yet.

## Questions guessed on

- Placeholder bundle content for validate: 'export default {};' (spec said one line, not which).
- Omitted the empty provider "cloudflare" {} block; the provider reads CLOUDFLARE_API_TOKEN from env implicitly, noted in a comment in versions.tf.
- EXPECTED_ROWS = 33791 is hard-coded in data/build-zips.mjs main() so a truncated download fails loudly; a future Gazetteer vintage with a different ZCTA count needs a manual bump (J5 only requires output rows == Gazetteer rows, which join() also guarantees).
- Out-of-order or duplicate Gazetteer GEOIDs throw rather than being sorted (J7 assumes sorted input; C8 requires ascending output).
- join(gazetteerText, geonamesTexts) takes file contents, not paths, so the test needs no filesystem; main() does the I/O.
- loadZips evicts a failed fetch from its cache so a later search can retry (C9 says only 'one fetch per url').
- Sample fixture rows chosen: 00601 PR, 00802 VI, 02138 MA, 10001 NY, 60614 IL, 96799 AS, 96860 HI, 96910 GU, 96950 MP, 99501 AK (no WA rows), extracted from the generated file, not hand-typed.
- F-14 (FTC bamboo cases): Kohl's and Walmart are tagged `governance` (deceptive marketing), not `environmental`. The choice decides which score component the penalty lowers.
- madewell.com is inferred from the brand name: fairtradecertified.org lists Madewell with an empty outbound link, and the storefront returns 403 to curl, so the domain could not be confirmed.
- The three Grassroots Outdoor Alliance store names (Travel Country Outfitters, Ute Mountaineer, Skinny Skis) come from each store's own site title (all three re-fetched 200 on 2026-09-23). Their domains come from logo filenames on the member list.
- Relevance matching: whole words on NFKC-lowercased, punctuation-to-space text, with an optional trailing 's'/'es' so 'cast iron skillets' matches 'cast iron skillet'. This is narrower than the spec's plain 'contains' ('pan' no longer matches 'Japan') but can over-match plurals ('pin' matches 'pines').
- Certifications count once per kind: two rows of the same kind for one domain add +0.25 once.
- Negative signals count once per source_url.
- Ethics and env cap before subtracting: value = max(0, min(1, 0.5 + 0.25*certs) - 0.25*negatives), so a negative still costs 0.25 even when a retailer holds all three ethics certifications. Netting everything first and then clamping would leave that case at 1.0.
- Proximity uses the displayed distance (haversine rounded to 1 decimal), so a reader can recompute value = 1 - distance_km/40 from what the page shows. The value itself is not rounded.
- Negative source labels read '<Kind>: <claim>' (e.g. 'Labor: <source title>'). Certification source labels use the certification's label. The relevance source label is the candidate's title, falling back to its name.
- Ethics and env keep their sources (baseline, certifications, negatives) even after flooring to 0. The UI hides zero rows anyway.
- Shape of src/quality.json once measured: {date: 'YYYY-MM-DD', precision: {online, local}, recall: {online, local}}, all values fractions from 0 to 1 (typed as QualityMeasure in src/about.ts). U11 must write this shape.
- Distance sort follows spec D: distance ascending, missing distance last, ties (including all-online) broken by name. This overrides ui.md 4.1, which kept online items in score order.
- Used build.rolldownOptions.input instead of rollupOptions, which is deprecated in the installed vite 8.3.0 types.
- The 'Why this rank' components render as a <ul> grid, not the <table> from ui.md, so it reflows at 360px. The C14 data-* hooks are unchanged.
- Component labels: Relevance, Ethics, Environment (for env), Proximity. Weights line reads 'Ranked by relevance 0.25, ethics 0.30, environment 0.30, proximity 0.15.' (decimals, so both '0.3' and '0.30' match).
- Success status copy 'Found N shops near you and M online.' is not in ui.md 4.5. Input-validation copy: 'Type what you are looking for.' and 'Enter a five-digit zip code.'
- Positive LLM signals (F-21) show as plain rows (kind, source's claim, source link) with no dispute link. Negative signals get the warn row plus 'Dispute this'.
- About page title is 'About {siteName}'. Its h1 is the mission sentence. Doc links (docs/*.md, data/blocklist.md) point at {repoUrl}/blob/main/<path> and stay plain text when no repo URL is set.
- Added an inline data: SVG favicon (the creek mark) to both pages. Chrome's /favicon.ico 404 was logging a console error, and U7's smoke test asserts there are none. The CSP img-src already allows data:.
- Local count line reads 'N shops within X mi' using the farthest shown distance. Bare 'N shops' when no distances are known.
- Distance shows with the address: '2.0 mi, 12 Main St, ...'. Result snippets are not shown, which avoids stray brand words in visible text.
- Changed from the spec: the full-history gitleaks scan runs the pinned gitleaks binary (`gitleaks git`) after a fetch-depth 0 checkout, not gitleaks/gitleaks-action. On push events the action's src/gitleaks.js (lines 103-110 at v3) scans only the pushed commit range, so it would not meet 'full history'. The action's current major is v3 (the spec named v2; v2 runs on Node 20, which GitHub removed from hosted runners on 2026-09-16).
- Merged the spec's separate `gitleaks` job into the `check` job (which now checks out with fetch-depth 0), so each workflow installs gitleaks once. ci.yml has two jobs: check and e2e.
- Action majors checked on GitHub today (2026-09-23), each floating tag resolved: actions/checkout@v7 (v7.0.1), actions/setup-node@v7 (v7.0.0), actions/configure-pages@v6, actions/upload-pages-artifact@v5, actions/deploy-pages@v5 (v5.0.1). gitleaks v8.30.1 linux_x64 sha256 551f6fc8...70eb matches the release checksums file and my own hash of the downloaded tarball.
- pages.yml skips the npm cache so the deploy build never restores a cache another run wrote (setup-node v7 notes discuss cache-poisoning risk). CI keeps the cache.
- The scan uses `gitleaks dir --config <repo>/.gitleaks.toml` (the current name for `detect --no-git`). --config is required because `gitleaks dir` otherwise looks for .gitleaks.toml inside the scanned directory, not the repo root.
- The Brave rule comment says keys 'have been observed' to start with BSA, without naming whose key.
- Prompt templates are .ts string modules (proxy/prompts/normalize.ts, enrich.ts), not the .txt files the spec names. Reason: tsx cannot import .txt (checked: ERR_UNKNOWN_FILE_EXTENSION), which would break the e2e mock proxy, and Vite would load .txt as an asset URL.
- llm client: complete() returns only the validated data. Usage goes into a `usage: LlmUsage[]` list on the client, one entry per billed attempt, retries included. The spec had complete() return {data, usage}. This way the pipeline reads llm.usage once and retry cost is not lost.
- enrichAll(pass1, llm, data) drops the unused `n` parameter from the spec signature.
- acceptSignals is stricter than the spec for positive signals too. Any signal must cite a fetched page that is either on the retailer's own domain or names the retailer (by name or domain label); the spec kept a positive from any fetched URL. Duplicate signals (same kind, polarity and URL) count once so they cannot double-penalize a score.
- brave.ts strips inline markup (<...>) from titles and snippets and collapses whitespace. I have not seen whether live Brave responses contain markup; this is defensive. Worth checking at the live-search gate.
- createBraveClient takes `negativeSourceDomains: ReadonlySet<string>` as a parameter. data/negative-sources.json belongs to U4, so the pipeline wires it in wave B.
- The handler sends `Vary: Origin` on every response, not only on allowed origins. It adds no CORS permission.
- Header values fed to x-loc-city: accents are folded to ASCII; a name that stays non-ASCII after folding drops the header.
- Adopted the rule amendment for secondary sources (dated HTTP redirect, subsidiary article, and a news source for 'Amazon Style' only). 7 entries are status pending-rule-amendment: amzn.to, amzn.com, a.co, 6pm.com, 'Amazon Style' (seed) and fabric.com, amzn.eu (additions). The filter ignores status.
- Added a 'Woot' prefix-word name entry, sourced from the same Wikipedia products-list sentence as woot.com. Without it, fixture N28 ('Woot.com' as a listing name, expected blocked) could not pass.
- Additions from the sourced-additions check: vine.com, wag.com and yoyo.com (named as domains on List of Amazon products and services #Retail_goods), plus wondery.com, mgm.com and onemedical.com (named on Amazon (company); each domain taken from the brand's own Wikipedia infobox). All are active.
- wag.com: the spec expected an unrelated business at this domain. On 2026-09-23 it returned 301 to https://amazon.com:443/wag/, so it is blocked on both the Wikipedia source and the redirect. No guess involved.
- Excluded buyvip.com (no article or redirect ties the brand to the domain, and it does not resolve) and lovefilm.com (the article's website field points to an Amazon storefront, not this domain, and it does not resolve). Handmade and Luxury Stores are storefronts inside amazon.com and are already covered.
- Renamed the embedded-URL fixture ids from U1-U4 to URL1-URL4 so they can't be read as unit names.
- Changed N32 and N34 from exact duplicates of N8 and N12 into local cases with their own non-listed websites. They are still expected allowed.
- How zip kinds are defined: urban = hand-picked anchor ZCTA with primary RUCA 1 and under 5 sq mi of land; suburban = nearest ZCTA in the same state with a different place name, RUCA 1, at least 20 km away; rural = nearest ZCTA in the same state with RUCA 10, at least 100 km away. Sources: USDA ERS 2020 RUCA ZIP file and the 2026 Gazetteer, both fetched 2026-09-23.
- Geography: 10 state triplets (MA, PA, GA, TN, IL, MN, TX, CO, AZ, CA), 2 products per triplet from different categories, 60 searches in total.
- 'One request per domain' taken to mean one page per registrable domain. The probe also fetches robots.txt first, so each domain sees 2 requests, and the driver waits 2 s between domains.
- Probe precision/recall: the probe's verdict (challenge, blocked or robots_disallow) is scored against the browser pass's page_access (challenge or blocked) on the same URL. The bot_only count (probe blocked, person got through) is reported separately as the bot-specific blocking signal.
- Grades and the recall baseline live in one file (docs/evidence/quality/grades.json) and one schema. miss_reason is set by the grader; summarize.mjs works out found vs missed itself, and counts a miss with no reason as 'unclassified'.
- Default delay between searches is 4 s (15 per minute), leaving headroom under the 30/min per-client and 60/min global limits.
- Shape of src/quality.json once measured, written by `node eval/summarize.mjs --site`: {"measured": {"date", "searches", "precision": {"online", "local"}, "recall": {"online", "local"}}}. Values are numbers or null. U6 should code against this shape.
- Repo files never name the operator's state, and the operator's zip appears nowhere in eval/. Zips outside that state were chosen by hand rather than enforced by a test that would name the state.
- Kept the spec's test-value guard: the script refuses to run tofu unless the five TF_VAR_* values are exactly test-brave, test-openrouter, 32 zeros, and http://localhost:5173 for both the origin and the site URL. I read 'with credentials' as CLOUDFLARE_API_TOKEN only.
- Test hooks are env vars (PLAN_TEXT=<file> uses synthetic text instead of running tofu; OUT=<file> overrides docs/evidence/tofu-plan.txt), not flags.
- Hosts are over-redacted: the whole token up to .workers.dev or .github.io is replaced, so the outputs.tf placeholder 'https://nottheriver-proxy.<account-subdomain>.workers.dev' becomes '[redacted-worker-host]'. Otherwise the leftover check would refuse every real run.
- Self-tests are shell scripts under .github/scripts/, because vitest's include list leaves out infra/ and I don't own vitest.config.ts.
- Used 'gitleaks dir --config .gitleaks.toml' as the existing scan does, instead of the spec's 'gitleaks detect --no-git' (old syntax).
- Dropped the random apiKey sample from the bundle-secret-scan.sh header instead of making it deterministic. The header now points at the self-test script.
- '(sensitive value)' is left as-is, not redacted further: tofu already prints that literal in place of sensitive values.

## Review passes

- U8 infra part 1: simplify + Fable review (2 lenses), 4 findings, <n> applied, <n> rejected (reasons in commit or below)
- U2 zips: simplify + Fable review (2 lenses), 5 findings, <n> applied, <n> rejected (reasons in commit or below)
- U4 data seeds: simplify + Fable review (2 lenses), 8 findings, <n> applied, <n> rejected (reasons in commit or below)
- U3 scoring: simplify + Fable review (2 lenses), 5 findings, <n> applied, <n> rejected (reasons in commit or below)
- U6 ui: simplify + Fable review (2 lenses), 11 findings, <n> applied, <n> rejected (reasons in commit or below)
- U9 ci: simplify + Fable review (2 lenses), 12 findings, <n> applied, <n> rejected (reasons in commit or below)
- U5 worker part 1: simplify + Fable review (2 lenses), 9 findings, <n> applied, <n> rejected (reasons in commit or below)
- U1 blocklist: simplify + Fable review (2 lenses), 10 findings, <n> applied, <n> rejected (reasons in commit or below)
- U11 quality eval part 1: simplify + Fable review (2 lenses), 16 findings, <n> applied, <n> rejected (reasons in commit or below)
- infra plan evidence and CI control: simplify + Fable review (2 lenses), 8 findings, 6 applied, 0 rejected

## Evidence

Checked 2026-09-23 on a clean clone of `main`:

| Command | Result |
|---------|--------|
| `npm run build` | `✓ built in 16ms` (exit 0) |
| `npm test` | `No test files found, exiting with code 0` |
| `npm run lint` | exit 0; a planted lint error and a planted Worker type error both failed it |
| `gitleaks git .` (full history) | `5 commits scanned.` / `no leaks found` |
| pre-commit hook with a planted fake `sk-or-` key staged | `leaks found: 1` (rule `openrouter-api-key`), exit 1 |

Ran against a pass-through stub of proxy/src/blocklist.ts: every check returned false and filterBlocked returned its input, so no filter existed yet. The fixtures, tests and data/blocklist.json were already written. Recorded in docs/evidence/blocklist-red-run.txt.

```
$ npx vitest run proxy/test/blocklist.test.ts
     × D1 domain amazon.com -> blocked
     × D2 url https://www.amazon.com/dp/B000000000 -> blocked
     × D3 domain smile.amazon.com -> blocked
     × D4 domain amazon.co.uk -> blocked
     × D7 url https://amzn.to/3abc -> blocked
     × D8 url https://a.co/d/xyz -> blocked
     × D20 domain mybucket.s3.amazonaws.com -> blocked
     × D30 url https://evil.example/?u=https://amazon.… -> blocked
     × URL1 url https://deals.example/go?url=amazon.com -> blocked
     × N1 name Whole Foods Market -> blocked
     × N2 name Whole Foods Market - Midtown -> blocked
     × N9 name Amazon Fresh -> blocked
     × N17 local The Fresh Market -> blocked
     × N29 name Amazon Hub Locker - Midtown -> blocked
 Test Files  1 failed (1)
      Tests  69 failed | 45 passed (114)
```

The 45 that passed were the allowed-by-design fixtures (for example D15 amazon.example.com and N8 Whole Foods Co-op), the data-file checks, and the registrableDomain checks (domain.ts already existed).
