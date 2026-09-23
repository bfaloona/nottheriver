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

## Review passes

- U8 infra part 1: simplify + Fable review (2 lenses), 4 findings, <n> applied, <n> rejected (reasons in commit or below)
- U2 zips: simplify + Fable review (2 lenses), 5 findings, <n> applied, <n> rejected (reasons in commit or below)

## Evidence

Checked 2026-09-23 on a clean clone of `main`:

| Command | Result |
|---------|--------|
| `npm run build` | `✓ built in 16ms` (exit 0) |
| `npm test` | `No test files found, exiting with code 0` |
| `npm run lint` | exit 0; a planted lint error and a planted Worker type error both failed it |
| `gitleaks git .` (full history) | `5 commits scanned.` / `no leaks found` |
| pre-commit hook with a planted fake `sk-or-` key staged | `leaks found: 1` (rule `openrouter-api-key`), exit 1 |
