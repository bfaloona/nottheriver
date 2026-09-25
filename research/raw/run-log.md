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
| 3 Assess (pilot, then rest) + calibrate | pilot running | |
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
