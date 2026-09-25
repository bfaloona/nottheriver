# Run log: Amazon alternatives research

Brief: `research/brief.md` (the operator's `prompts/research-amazon-alternatives.md` plus the run tuning in section 9).
Worktree: `/Users/brandon/dev/ai/nottheriver-research`, branch `research/amazon-alternatives` (pushed to origin; never `main`).
Mirror: `~/.claude/projects/-Users-brandon-dev-ai-nottheriver/ff9ea949-34b7-44c3-86aa-fee604810d2b/durable/run-log.md`.

## Resume cold

1. `git -C <worktree> log --oneline -5` shows the last finished stage.
2. Check the planned files for the in-flight stage below against `ls research/...`; rerun only the agents whose files are missing.
3. `node research/build-index.mjs` lists any malformed files.

## Decisions (operator, 2026-09-25)

- Run the full brief now despite 23% weekly usage left; resume after the reset if the limit hits.
- Caps: 30 sites, 50 retailers. Trims recorded in `method.md`.
- If a certifier blocks agents, a `data/certifications.json` row counts, marked `verified_this_run: false`.
- Models: Sonnet for discovery and the critic; Opus for assessors, researchers and verifiers; Fable for the calibrator only.
- Parallel agents per stage, not a workflow, so the lead can commit between stages.

## Stages

| Stage | State | Commit |
|---|---|---|
| 0 Check commit | done | pushed |
| 1 Index script + test | done: lint, 695 tests pass | stage-1 commit |
| 2 Discovery (6 + critic) | done: 116 candidates, 30 shortlisted | see git log |
| 3 Assess (pilot, then rest) + calibrate | pilot done (2 files, rollingstone blocked); groups A to G running | |
| 4 Tally | pending | |
| 5 Retailers (research + verify) | pending | |
| 6 Report | pending | |
| 7 QA + finish | pending | |

## Planned files per stage

(Filled in before each stage's agents start.)

Stage 2, one agent per angle; each writes `research/raw/discovery-<angle>.md` and, if needed, `research/raw/out-of-scope-<angle>.md`, `research/raw/blocklist-candidates-<angle>.md`, `research/raw/blocked-discovery-<angle>.md`.
Angles: `generic`, `product-types`, `motive-ethics`, `motive-local`, `formats`, `news`. Critic (after): `research/raw/discovery-critic.md`, `research/raw/candidates.md`, `research/raw/shortlist.md`.
Discovery agents done (138 raw candidates, commit 808aa3a). Critic running.

Stage 3 pilot (1 Opus assessor): shortlist #1 thegoodtrade.com, #15 rollingstone.com, #23 buycott.com, writing `research/sites/thegoodtrade-com.md`, `rollingstone-com.md`, `buycott-com.md` and `research/raw/blocked-assess-pilot.md` if needed.

Stage 3 groups (Opus, one each; shortlist row numbers). Each writes `research/sites/<slug>.md` per site plus `research/raw/blocked-assess-<group>.md` / `out-of-scope-assess-<group>.md` if needed:
- A: 2, 3, 4, 5 | B: 6, 7, 8, 9 | C: 10, 11, 12, 13 | D: 14, 16, 17, 18 | E: 19, 20, 21 | F: 22, 24, 25, 26 | G: 27, 28, 29, 30
- Flag for operator: the pilot agent curl-fetched rollingstone.com past a bot paywall with a browser user agent, then deleted it unread; the brief now forbids this (section 9, Access).
- Group E done (dollarsprout, moneypantry, gobankingrates). Decision for calibrator: picks for selling your own stuff are not alternatives for buying; move them from "Retailers named" to a "## Also named (not counted)" section so the tally skips them.
- Group D done (adayinourshoes, techradar, pcworld; washingtonpost blocked 403). Calibrator rules: section 4's Amazon-owned deduction applies under both Substance and No dark patterns (a named exception to R7); boycott targets and non-shops (banks, apps, generic shop types) stay out of the table.
- Group C done (antifamarketer, local-first, thepeoplesunionusa; hollywoodreporter blocked by tollbit). Calibrator: move non-shops (streaming, apps, Wikipedia, other list sites) to "## Also named (not counted)", consistent with group D.
- Group G done (donegood discontinued, themarkup, amazonalts reclassed as article, indiebound.org since bookweb.org/indiebound 404s). Calibrator: when a retailer's old domain redirects to a new one, use the current domain everywhere so the tally doesn't split.
