# Plan: short quality summary on the About page, raw evidence one link away

Status: planned 2026-09-24, not started. Operator direction: keep collecting evidence that anyone can inspect in the repo; the About page summarizes it with much less detail; a link takes readers to the raw evidence.

## Today

- `src/about.ts` `coverageText()` renders one long sentence from `src/quality.json` (date, graded searches, online and local precision, online and local recall), written by `node eval/summarize.mjs --site`.
- About page: `about.html` section `#coverage`, then a link to `docs/quality.md`.
- Evidence per run lives in `docs/evidence/quality/<run>/` (`responses/`, `grades.json`, `report.json`, `run-summary.json`, and for the latest rerun `method/`). Nothing lists the runs in one place; `quality.md` is prose.

## Steps

1. **Evidence index.** Add `docs/evidence/quality/README.md`: one row per run (date, folder, what changed in the pipeline, searches graded, online and local precision, local recall), newest first, each linking to its folder and `report.json`. Backfill the rows for `after`, `after3`, `eval60`, `eval20-0924` from their reports. Add a step to `eval/README.md`: every graded run gets its own folder and an index row.
2. **Evidence link in the site data.** `summarize.mjs --site` also writes `evidence: "docs/evidence/quality/<run>"` (from `OUT_DIR`) into `src/quality.json`; extend `QualityMeasure` and the `siteMeasure` test.
3. **Shorter About text.** Replace the sentence with two plain lines and one link, for example: "Checked 2026-09-24 on 20 searches. Online, nearly every result (98%) sells the item; nearby, about 6 in 10 do." then "Raw evidence" linking to the index (repo URL + `tree/main/docs/evidence/quality`). Keep "Method and limits" linking to `quality.md`. Render test for the new text and link; the link stays plain text when no repo URL is configured, as other repo links do.
4. **Refresh the headline** from the latest run (`eval20-0924`): `OUT_DIR=docs/evidence/quality/eval20-0924 node eval/summarize.mjs --site`.
5. Checks, review pass, commit, push (site only; no Worker deploy).

## Open questions for the operator

- Q1. Keep recall on the About page ("finds about 3 in 10 of the good shops another search engine found") or move it to the evidence page only? Recall is the less flattering, more honest number.
- Q2. The rerun's local precision (59%) mixes first-pass grades with a second grader's answers for rows the first could not judge (the eval60 headline, 51%, used first-pass grades only). Show the mixed figure with a one-word note, or compute a first-pass-only figure for the headline?
