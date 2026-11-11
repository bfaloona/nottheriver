# Shared rules for background agents (nottheriver)

Read this whole file before your task brief. "Operator" means the human who owns the repo. You run in a cloud session on a fresh clone, with nobody watching; nobody will answer a question mid-run, so decide, write down what you guessed, and keep going. Paths in the briefs are relative to the repo root.

## First five minutes

1. Fetch `origin` and start a working branch `claude/<topic>` (the topic is in your brief's handoff note name) from the tip of `origin/main`.
2. Create your handoff note at the path your brief names, under `handoff/`. First line `# <topic>`, second line `Status: active`. Keep it current: done, in flight, blocked, decisions the operator owes, next concrete step. Write it so a fresh agent could resume cold.
3. Commit and push the working branch early and after every stage. The pushed branch is the only durable copy of your work; a run can end without warning.
4. Read `CLAUDE.md` and `docs/STATUS.md`.

## Your environment may differ from the briefs

The briefs were first written for the operator's laptop. If a tool the brief assumes is missing in the cloud session (WebSearch, a browser for the e2e tests, network access to a host, the `copy-review` skill), do the rest, record what you skipped and why in the note, and say so in the final report. Do not install system packages or browsers to get around it. `npm ci` is allowed only where your brief permits it. Keep everything you add to the repo under 2 MB per brief; no screenshots or binaries unless your brief asks.

## Hard limits

- No Brave calls, no OpenRouter calls, no live searches against the deployed Worker. The Brave budget is blocked on the operator.
- No `infra/deploy.sh`, no `tofu` command, no change to GitHub repo settings, no force push, no push to any branch except your own `claude/` branches and, where your brief allows it, `main`.
- Never print, read or commit key values. If the environment holds credentials, use them only for git.
- Web requests: never put the operator's name, email or account details in a User-Agent, URL, query or payload; use a generic client name. Stay within the WebSearch count your brief gives you; prefer fetching a known page over searching.
- Leave the branches `worktree-agent-a425196dcc37b1982` and `variant/brave-3-call-local` alone if you see them.
- If a guard or permission check blocks you, stop that step and report it. Never work around a block.
- After `npm ci`, commits run `.githooks/pre-commit`, which needs `gitleaks`. If it is missing, install the pinned version the way `.github/workflows/ci.yml` does (same release, same sha256 check) into a folder outside the repo and put it on `PATH`. Never skip or disable the hook; if you cannot install it, push nothing to `main` and report.

## Subagents

- Start subagents fresh (`subagent_type: general-purpose`, `model: fable` unless your brief names another). Never fork yourself: a fork inherits everything you have read, which defeats a blind or fresh-eyes review.
- A subagent knows only what you put in its brief. Give it file paths to read, the output path to write, these hard limits, and its WebSearch count. Do not hand it your conclusions.
- Run at most three subagents at once.
- If you have no Agent tool, write each subagent brief you would have sent into your handoff note, do the parts that need no isolation yourself, and say in your final report which stages were not run blind.

## Writing

Everything the operator reads (docs, notes, commit messages) follows these:

- Lead with the answer. Short sections, tables and lists over paragraphs. Plain words; define a needed technical term on first use.
- No em dashes. US spelling. Distances in miles.
- Label every identifier with what it is: "RQ4 (daily counters)", never a bare "RQ4".
- Say "likely" unless every variable was controlled. Mark each figure as measured (with its source file) or a projection.
- Invent nothing: no personas, user quotes, statistics, history or attributions without a source in the repo or a page you fetched (cite URL and the date read). A judgment of yours is labeled as yours.
- Never write the operator's name, email, home path or location into a tracked file.
- Code comments say why, never what, and never name a plan, phase or ticket.

## Review before merge

Before anything merges, a fresh subagent that has not seen your reasoning reviews the deliverable against the brief (for prose, also against the Writing rules above). Apply what holds up and record the count of findings applied and rejected.

## Merging

Your brief says what goes to `main` without approval and what waits for the operator. The operator has authorized pushing that work to `origin/main`; a push to `main` rebuilds and deploys the site, so only the paths your brief lists go there.

1. Build a clean branch `claude/<topic>-main` from the current `origin/main` and bring over only the deliverable paths (`git checkout claude/<topic> -- <paths>`). The handoff note stays on the working branch and never goes to `main`.
2. Add one row to the Done table in `docs/STATUS.md`, and any operator decision under "Decisions needed". Three other agents are adding rows too.
3. Small conventional commits (`docs:`, `fix:`, `chore(deps):`), staging explicit paths only (never `git add -A` or `git add .`). End each message with a `Co-Authored-By:` trailer naming the model you actually are.
4. `git push origin claude/<topic>-main:main`. If it is rejected because `main` moved, fetch, rebase (on a `docs/STATUS.md` conflict keep both sides' rows) and retry, up to three times. Never force.
5. If the session is not permitted to push to `main`, push `claude/<topic>-main` instead, open a pull request if `gh` works, and report the branch as ready to merge.
6. After a push to `main`, check the CI run for your commit if you can (`gh run list`); a failure you caused is yours to fix or revert.

Work that waits for approval stays on its own named branch, pushed, never merged, with the branch name in your handoff note and final report.

## Final report

Under 200 words, answer first: what reached `main` (commit ids) and what waits on which branch, the paths of the deliverables, the decisions the operator owes (labeled, with your recommendation), anything you guessed or skipped, and the handoff note path and branch. Set the note's status to `closed` or `blocked` and push it.
