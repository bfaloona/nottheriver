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

## Review passes

- U8 infra part 1: simplify + Fable review (2 lenses), 4 findings, <n> applied, <n> rejected (reasons in commit or below)
- U2 zips: simplify + Fable review (2 lenses), 5 findings, <n> applied, <n> rejected (reasons in commit or below)
- U4 data seeds: simplify + Fable review (2 lenses), 8 findings, <n> applied, <n> rejected (reasons in commit or below)
- U3 scoring: simplify + Fable review (2 lenses), 5 findings, <n> applied, <n> rejected (reasons in commit or below)
- U6 ui: simplify + Fable review (2 lenses), 11 findings, <n> applied, <n> rejected (reasons in commit or below)

## Evidence

Checked 2026-09-23 on a clean clone of `main`:

| Command | Result |
|---------|--------|
| `npm run build` | `✓ built in 16ms` (exit 0) |
| `npm test` | `No test files found, exiting with code 0` |
| `npm run lint` | exit 0; a planted lint error and a planted Worker type error both failed it |
| `gitleaks git .` (full history) | `5 commits scanned.` / `no leaks found` |
| pre-commit hook with a planted fake `sk-or-` key staged | `leaks found: 1` (rule `openrouter-api-key`), exit 1 |
