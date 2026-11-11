# Brief: clear every high and critical dependency alert

First read `prompts/agent-shared-rules.md` and follow it. Handoff note: `handoff/2026-11-11-security-alerts.md`.

## Goal

`npm audit --audit-level=high` exits 0 on `main`, with every check the project runs still passing, and the operator can see what changed and what is left.

## What is known (2026-11-11, main at d8a5415)

- GitHub Dependabot alerts are disabled for this repo, so `npm audit` is the alert source. There is one `package.json` (repo root).
- `npm audit` reported 19 alerts: 0 critical, 7 high, 12 moderate. The highs were happy-dom, vite and wrangler (direct dev dependencies) and miniflare, sharp, source-map-js and undici (pulled in by others). npm said each high has a fix that is not a major version jump. Re-run the audit yourself; advisories change daily.
- The moderate alerts in the eslint and typescript-eslint chain (minimatch) are offered only through `npm audit fix --force`, which would move eslint from 10 down to 9.

## Do

1. You may run `npm ci` in the clone.
2. Before changing anything, record a baseline in your note: the audit counts, the results of `npm run lint`, `npm test`, `npm run build`, `npm run build:proxy`, `npm run scan:bundle` and `npm run e2e`, and a sha256 of the Worker bundle that `build:proxy` writes to `dist/`. If e2e cannot run because Playwright's browsers are missing, record that and continue; do not install them.
3. Run plain `npm audit fix`. Never use `--force`.
4. For any high or critical alert still open, in this order: raise the direct dependency within its current major; add the narrowest `overrides` entry in `package.json` for a nested package; take a major version jump of a direct dependency only if nothing else clears the alert, as its own commit with the breaking changes you checked listed in the message. If an alert has no fixed release, say whether the vulnerable code can run in this project (dev tooling only, the CI runner, the Worker bundle or the browser bundle) and leave it open with that note.
5. Fix moderate alerts that plain `npm audit fix` clears. Leave the rest and list them.
6. Re-run every check from step 2. All that passed before must pass now. Compare the Worker bundle hash and the site bundle: say whether either changed, since a changed Worker bundle means the operator has a Worker deploy to run after pushing.
7. Look past npm, read-only: the action versions in `.github/workflows/*.yml`, the pinned gitleaks binary, and the provider versions in `infra/.terraform.lock.hcl`. Check each against its published security advisories (up to 8 WebSearch calls). Fix a workflow action with a known high advisory by bumping it; report the rest.
8. Write `docs/security-alerts.md`: a table of each alert (package, severity, advisory link, where the package runs, what you did, version before and after), what remains open and why, and the exact commands to repeat the check. Add a link to it from the Docs row of `docs/STATUS.md`.

## Merge

If `npm run e2e` could not run in your session, do not push to `main` directly: push `claude/security-alerts-main`, open a pull request, and push to `main` only after the CI e2e job on it is green. If you cannot see CI, leave the pull request and report.

No approval needed. Push to `main` when `npm audit --audit-level=high` exits 0 and the step 6 checks pass. If a major version jump was needed, or any check that passed at baseline now fails, leave the whole change on the branch `claude/security-alerts-review` and report instead.

## Decisions to hand the operator

- Whether to turn on Dependabot alerts and security updates (a repo setting only the operator can change). Draft a `.github/dependabot.yml` in the report, uncommitted.
- Whether a Worker deploy follows (only the operator or a local session can run it; say whether the Worker bundle changed).

## Model

Fable lead. No subagents needed except the fresh review of the diff and the doc before merge.
