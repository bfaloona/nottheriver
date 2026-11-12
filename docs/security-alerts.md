# Dependency security alerts

As of 2026-11-11: `npm audit --audit-level=high` exits 0. The 7 high alerts are cleared, 2 of the 12 moderate alerts are cleared, and 10 moderate alerts stay open (one minimatch advisory, counted once for each of 10 lint packages). No alerted package is in the Worker bundle or the browser bundle.

- Alert source: `npm audit`. GitHub Dependabot alerts are off for this repo, and there is one `package.json` (repo root).
- Counts are npm's: one alert per affected package, so one advisory can count several times.
- All figures below were measured on 2026-11-11 on macOS arm64, node 22.22.3, npm 10.9.8, starting from commit `e132f05`, with the commands under "Repeat the check". Versions come from the `package-lock.json` diff; the baseline check results and bundle hashes are recorded in `handoff/2026-11-11-security-alerts.md` on the branch `claude/security-alerts`.
- The end-to-end tests did not run locally; the CI `e2e` job passed on the pull request and on `main` at `84e7470` (see "Checks before and after").

## Counts

| | Critical | High | Moderate | Total |
|---|---|---|---|---|
| Before | 0 | 7 | 12 | 19 |
| After plain `npm audit fix` | 0 | 1 | 10 | 11 |
| After raising happy-dom to 21 | 0 | 0 | 10 | 10 |

## What changed

Two steps, in two commits:

1. Plain `npm audit fix` (never `--force`). It changed `package-lock.json` only; every direct dependency stayed inside the version range `package.json` already allowed. Three nested packages crossed a major version as their parents moved (obug 2.2.1 to 3.0.0, why-is-node-running 2.3.0 to 3.2.1, @emnapi/runtime 1.11.3 to 2.0.0-beta.2).
2. happy-dom from 20 to 21.0.4, a major version jump, in `package.json` and the lock file. No 20.x release fixes either high advisory (the newest, 20.14.6, is still in both affected ranges), so nothing smaller clears the alert.

No `overrides` entry was added.

### Breaking changes checked for happy-dom 21

Source: the [v21.0.0 release notes](https://github.com/capricorn86/happy-dom/releases/tag/v21.0.0), read 2026-11-11. The notes list one breaking change.

| Change in 21 | Effect here |
|---|---|
| Loading of CSS files and iframe pages is off by default (new settings `enableCSSFileLoading` and `enableIframePageLoading`) | None seen: all 876 unit tests pass, and no test sets either setting |
| The `disableCSSFileLoading` setting is deprecated | The repo does not set it |
| Node requirement and dependencies | Unchanged from 20.14.6 (`npm view`, node 20 or later) |

## Alerts

"Where it runs" says where the package's code executes in this project. "Dev" is a developer machine, "CI" is the GitHub Actions runner. Dependency paths are from `npm ls`.

### High (7, all cleared)

| Package | How it gets here | Advisories | Where it runs | What was done | Before | After |
|---|---|---|---|---|---|---|
| happy-dom | Direct dev dependency | [GHSA-834v-8h66-3h79](https://github.com/advisories/GHSA-834v-8h66-3h79) (high, code execution through an import alias), [GHSA-c8p4-j97h-3vg8](https://github.com/advisories/GHSA-c8p4-j97h-3vg8) (high, server-side request forgery), [GHSA-5fpq-26gf-qwcr](https://github.com/advisories/GHSA-5fpq-26gf-qwcr) (moderate, cookie scope) | Dev and CI, as the page simulator for four unit test files (`src/about.test.ts`, `src/main.test.ts`, `src/map.test.ts`, `src/render.test.ts`) | `npm audit fix` took it to 20.14.6 (still flagged); then the major jump | 20.14.5 | 21.0.4 |
| vite | Direct dev dependency | [GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm) (high, Windows only), plus 4 moderate and 1 low in the dev server: [GHSA-698v-4r3x-3vcv](https://github.com/advisories/GHSA-698v-4r3x-3vcv), [GHSA-r825-w8mm-5pxw](https://github.com/advisories/GHSA-r825-w8mm-5pxw), [GHSA-rq7h-c2jc-7f22](https://github.com/advisories/GHSA-rq7h-c2jc-7f22), [GHSA-vfpm-58rq-9qcg](https://github.com/advisories/GHSA-vfpm-58rq-9qcg), [GHSA-9jrq-w75r-8gcw](https://github.com/advisories/GHSA-9jrq-w75r-8gcw) | Dev (dev server, build) and CI (build, and the preview server in the end-to-end job). It writes the browser bundle but is not in it | `npm audit fix` | 8.3.0 | 8.3.8 |
| wrangler | Direct dev dependency | None of its own; flagged because it depends on miniflare | Dev and CI: bundles the Worker (`npm run build:proxy`, also called by `infra/deploy.sh`) | `npm audit fix` | 4.137.0 | 4.160.1 |
| miniflare | wrangler | None of its own; flagged because it depends on sharp and undici | Dev and CI, inside wrangler (the local Worker simulator) | `npm audit fix` | 5.20260921.0-alpha | 5.20261110.1-beta |
| sharp | wrangler, miniflare | [GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w) (high, in its bundled SVG library) | Dev and CI, inside miniflare | `npm audit fix` | 0.35.4 | 0.35.5 |
| undici | wrangler, miniflare | 18 advisories, 6 high: [GHSA-rfgv-xxqx-mfg5](https://github.com/advisories/GHSA-rfgv-xxqx-mfg5), [GHSA-w293-vg96-wgc3](https://github.com/advisories/GHSA-w293-vg96-wgc3), [GHSA-xjj6-f33q-929c](https://github.com/advisories/GHSA-xjj6-f33q-929c), [GHSA-4w7w-5xrc-9h26](https://github.com/advisories/GHSA-4w7w-5xrc-9h26), [GHSA-2m5v-pch6-74hx](https://github.com/advisories/GHSA-2m5v-pch6-74hx), [GHSA-qrxm-fqhp-jwvm](https://github.com/advisories/GHSA-qrxm-fqhp-jwvm); 9 moderate and 3 low, listed under the table | Dev and CI, inside miniflare | `npm audit fix` | 7.29.0 | 7.30.1 |
| source-map-js | vite, postcss | [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) (high, denial of service) | Dev and CI, at build time | `npm audit fix` | 1.2.1 | 1.2.2 |

The other undici advisories, all fixed by 7.30.1: [GHSA-3wwx-pv8p-q78v](https://github.com/advisories/GHSA-3wwx-pv8p-q78v), [GHSA-pmjh-fq2x-6v4x](https://github.com/advisories/GHSA-pmjh-fq2x-6v4x), [GHSA-3xpg-4rpp-hhhm](https://github.com/advisories/GHSA-3xpg-4rpp-hhhm), [GHSA-2jfj-6hjv-fm6j](https://github.com/advisories/GHSA-2jfj-6hjv-fm6j), [GHSA-rx4f-c7p8-82vq](https://github.com/advisories/GHSA-rx4f-c7p8-82vq), [GHSA-4qv8-2p9j-2685](https://github.com/advisories/GHSA-4qv8-2p9j-2685), [GHSA-f72v-6w45-q472](https://github.com/advisories/GHSA-f72v-6w45-q472), [GHSA-9fm3-97px-rjf6](https://github.com/advisories/GHSA-9fm3-97px-rjf6), [GHSA-55wc-3pg8-jfw6](https://github.com/advisories/GHSA-55wc-3pg8-jfw6) (9 moderate), [GHSA-r53p-7pc4-xj5r](https://github.com/advisories/GHSA-r53p-7pc4-xj5r), [GHSA-2gqq-gqf2-x968](https://github.com/advisories/GHSA-2gqq-gqf2-x968), [GHSA-8436-99hf-9mmv](https://github.com/advisories/GHSA-8436-99hf-9mmv) (3 low).

### Moderate, cleared (2)

| Package | How it gets here | Advisories | Where it runs | What was done | Before | After |
|---|---|---|---|---|---|---|
| vitest | Direct dev dependency | None of its own; flagged because it depends on @vitest/mocker | Dev and CI, the unit test runner | `npm audit fix` | 5.0.1 | 5.1.0 |
| @vitest/mocker | vitest | [GHSA-qxg6-89mg-rqv8](https://github.com/advisories/GHSA-qxg6-89mg-rqv8), [GHSA-xp26-3454-mjgp](https://github.com/advisories/GHSA-xp26-3454-mjgp) | Dev and CI, inside vitest | `npm audit fix` | 5.0.1 | 5.1.0 |

### Moderate, left open (10)

One advisory, [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) (minimatch, denial of service on a crafted file pattern; affected 7.0.0 up to but not including 11.0.1), counted once for each package that leads to minimatch:

| Package | Before | After |
|---|---|---|
| minimatch (the package with the flaw; pulled in by eslint, @eslint/config-array and @typescript-eslint/typescript-estree) | 10.2.6 | 10.2.6 |
| eslint (direct) | 10.11.0 | 10.14.0 |
| @eslint/js (direct) | 10.0.1 | 10.0.1 |
| @eslint/config-array | 0.23.5 | 0.23.5 |
| typescript-eslint (direct) | 8.70.1 | 8.72.2 |
| @typescript-eslint/eslint-plugin, parser, type-utils, typescript-estree, utils (5 packages) | 8.70.1 | 8.72.2 |

- Where it runs: dev and CI, only during `npm run lint`. The file patterns it reads come from this repo's own `eslint.config.js`.
- Why open: npm offers a fix only through `npm audit fix --force`, which would move eslint from 10 down to 9.39.5 and typescript-eslint down to 8.36.0. The newest eslint 10 (10.14.0) and typescript-eslint 8 (8.72.2) still require minimatch 10.
- `npm audit fix` raised eslint and typescript-eslint inside their ranges; that did not clear the alert.
- When it clears: once eslint and typescript-eslint publish releases that accept minimatch 11.0.1 or later, plain `npm audit fix` should pick them up (a projection, not measured).

## Checks before and after

| Check | Before | After |
|---|---|---|
| `npm ci` | exit 0 | exit 0 (clean install from the new lock file) |
| `npm run lint` | exit 0 | exit 0 |
| `npm test` | exit 0, 876 tests in 25 files | exit 0, 876 tests in 25 files |
| `npm run build` | exit 0 | exit 0 |
| `npm run build:proxy` | exit 0, 302.34 KiB | exit 0, 302.34 KiB |
| `npm run scan:bundle` | exit 0, no leaks found | exit 0, no leaks found |
| `npm run e2e` | Could not run: Playwright's Chromium was not installed in the session | Could not run locally, same reason. The CI `e2e` job passed on pull request 1 and on `main` at `84e7470` (2026-11-12 UTC) |

The lock file keeps the same 7 `linux-x64` optional packages the CI runner needs.

## Did the bundles change?

| Bundle | Changed? | Detail (sha256, each build run twice at baseline) |
|---|---|---|
| Worker bundle, `proxy/dist/index.js` | No | `2cdcd3d6e7ebb848041cf6948000c1f01962a19367199abd6357de3ccee9b6ba` before and after. No Worker deploy follows from this change |
| Site bundle, `dist/` | Yes, 3 of 9 files | `main-*.js` (13.33 kB to 13.73 kB), `map-*.js` (150.81 kB to 150.65 kB) and `index.html` (it names the two files). Likely cause: the newer vite and its bundler (rolldown 1.2.10 to 1.2.19) emit slightly different code; no source file changed. The CSS, `about.html`, the other two scripts and `zips.json` are byte-identical |

The site redeploys on any push to `main`, so the changed site files go live with the merge.

## Beyond npm (read-only check, 2026-11-11)

Each item was checked against the repository's published security advisories page and the GitHub Advisory Database on 2026-11-11. No workflow action has a known high advisory, so no workflow file changed.

| Item | Pinned | Finding | Action |
|---|---|---|---|
| `actions/checkout` | v7 | [No published advisories](https://github.com/actions/checkout/security/advisories) | None |
| `actions/setup-node` | v7 | [No published advisories](https://github.com/actions/setup-node/security/advisories) | None |
| `actions/configure-pages` | v6 | [No published advisories](https://github.com/actions/configure-pages/security/advisories) | None |
| `actions/upload-pages-artifact` | v5 | [No published advisories](https://github.com/actions/upload-pages-artifact/security/advisories) | None |
| `actions/deploy-pages` | v5 | [No published advisories](https://github.com/actions/deploy-pages/security/advisories) | None |
| gitleaks binary (`ci.yml`, `pages.yml`, sha256-pinned) | 8.30.1, the latest release | [GHSA-mmh4-9cvr-w4cj](https://github.com/advisories/GHSA-mmh4-9cvr-w4cj) (high, report templates can read environment variables): affects versions before 8.30.1, so the pin is not affected. [GHSA-w4h6-9gpx-7gm5](https://github.com/advisories/GHSA-w4h6-9gpx-7gm5) (moderate, the file written by `--report-path` is readable by other local users): affects 8.30.1, no fixed release listed. Both are marked unreviewed by GitHub | None. No gitleaks call in this repo uses `--report-path`, and every call passes `--redact` |
| Cloudflare provider (`infra/.terraform.lock.hcl`) | 5.25.0, constraint `~> 5.25` | [GHSA-xjp2-hvfx-583h](https://github.com/cloudflare/terraform-provider-cloudflare/security/advisories/GHSA-xjp2-hvfx-583h) (low): builds made with an older Go toolchain can accept certificates that chain through distrusted eMudhra intermediates. Fixed in provider 5.28.1; latest is 5.29.0 | Reported only. Raising the lock needs `tofu init -upgrade`, which is the operator's to run. The constraint already allows 5.28.1 |

The advisory database search for the five actions used the query `type:reviewed ecosystem:actions actions/` (43 results, none for these five). It lists high advisories for `actions/download-artifact` and `actions/runner`, which no workflow here names.

## Repeat the check

```
npm ci
npm audit
npm audit --audit-level=high
```

The last command exits 0 when no high or critical alert is open. To see where a flagged package comes from: `npm explain <package>`.

To fix what can be fixed without a major version jump, then recheck:

```
npm audit fix
npm ci
npm run lint
npm test
npm run build
npm run build:proxy
shasum -a 256 proxy/dist/index.js
npm run scan:bundle
npm run e2e
```

Never use `npm audit fix --force`. If the Worker bundle's sha256 differs from the deployed one, a Worker deploy follows the push (`.claude/skills/deploy/SKILL.md`). Hash the site bundle straight after `npm run build`: `npm run e2e` rebuilds it with the mock proxy's address.

For the items beyond npm, open each link in the table above; `infra/.terraform.lock.hcl` holds the provider version and the two workflow files hold the action and gitleaks versions.
