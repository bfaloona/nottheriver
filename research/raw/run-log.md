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
| 0 Check commit | in progress | |
| 1 Index script + test | pending | |
| 2 Discovery (6 + critic) | pending | |
| 3 Assess (pilot, then rest) + calibrate | pending | |
| 4 Tally | pending | |
| 5 Retailers (research + verify) | pending | |
| 6 Report | pending | |
| 7 QA + finish | pending | |

## Planned files per stage

(Filled in before each stage's agents start.)
