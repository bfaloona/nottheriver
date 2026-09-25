---
name: deploy
description: Use after pushing to main in nottheriver, or when a change needs to be live. Says when to push the site, when to deploy the Worker with infra/deploy.sh, in which order, and what always needs the operator.
---

# Deploying nottheriver

Two deployables. The site deploys itself on every push to `main` (`.github/workflows/pages.yml`). The Worker deploys only through `infra/deploy.sh`, which agents may run without asking under the rules below (operator grant, 2026-09-24).

## Test bar (current phase: frequent pushes, light testing)

Before any push to `main`: `npx vitest run`, `npm run lint`, `npm run typecheck`. Run `npm run e2e` as well when the change touches the search page, the render code or the CSP. The deploy script reruns the proxy tests and the Worker build itself.

## When to deploy the Worker

Run `infra/deploy.sh` after pushing any commit that changes:

- `proxy/**` (code, ranking, schemas, prompts, `wrangler.jsonc`)
- a `data/*.json` file the Worker imports (blocklist, certifications, negatives, negative sources)
- `infra/*.tf`

When unsure, run it: it compares the committed build with the last deployed state and does nothing if they match (a Worker changed by hand in Cloudflare may not show). `infra/deploy.sh --check` only reports whether a deploy is needed; any other argument is refused.

## Order when both change

| Change | Order |
|---|---|
| The site sends a new request field | Deploy the Worker first, then push the site (an old Worker rejects unknown fields) |
| The Worker adds a response field | Either order; the site must work without the field (test it) |
| The Worker removes or renames a response field the site reads | Push the site first, so it stops reading the field, then deploy the Worker |

## Needs the operator (the script refuses or it is out of scope)

- Any plan that changes more than the Worker bundle: creating, replacing, moving, importing or destroying a resource; any other resource (subdomain, routes); or a Worker attribute besides the bundle (bindings, secrets, rate limits, logging, compatibility date). The script names the resources and attributes, never values, and stops.
- Rotating keys, changing key files, or editing `infra/deploy.local.env`.
- A deploy from anything but `main`, with uncommitted changes under `proxy/`, `data/` or `infra/`, or with unpushed commits: the script refuses. Push first.

## Secrets

- Never print, echo, log or copy a key value, and never pass one as a command argument. The script reads the values from the files named in `infra/deploy.local.env` (gitignored; template `infra/deploy.local.env.example`).
- Never run the script with `sh -x` or with `TF_LOG` set (the script turns both off).
- Never save a plan (`-out`) outside the script: a saved plan and `infra/terraform.tfstate` hold every key in plain text. State stays local and gitignored.
- If the script says output was suppressed because it held a key value, stop and tell the operator.

## After a deploy

- The script ends with `Worker deployed at <commit>; preflight 204`, or a `deploy:` error naming what failed.
- Record the commit and time in the session note. When a change should be visible in a search (a new field, a ranking change), run one live search to confirm it and note the result.
- To roll back: revert the commit, push, and run the script again.
