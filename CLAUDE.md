# nottheriver: agent notes

- Deploying: follow `.claude/skills/deploy/SKILL.md`. The site deploys on every push to `main`; after pushing anything under `proxy/`, a Worker-imported `data/*.json`, or `infra/*.tf`, run `infra/deploy.sh`.
- Never print or commit key values; `infra/deploy.local.env`, `*.tfstate` and saved plans stay local.
