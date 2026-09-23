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

- None yet.

## Review passes

- None yet.

## Evidence

Checked 2026-09-23 on a clean clone of `main`:

| Command | Result |
|---------|--------|
| `npm run build` | `✓ built in 16ms` (exit 0) |
| `npm test` | `No test files found, exiting with code 0` |
| `npm run lint` | exit 0; a planted lint error and a planted Worker type error both failed it |
| `gitleaks git .` (full history) | `5 commits scanned.` / `no leaks found` |
| pre-commit hook with a planted fake `sk-or-` key staged | `leaks found: 1` (rule `openrouter-api-key`), exit 1 |
