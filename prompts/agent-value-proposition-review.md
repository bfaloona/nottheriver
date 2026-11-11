# Brief: fresh-eyes reviews of the value proposition

First read `prompts/agent-shared-rules.md` and follow it. Handoff note: `handoff/2026-11-11-value-proposition.md`.

## Goal

Tell the operator, with evidence, what nottheriver offers a person in the United States who wants to buy something without Amazon, whether that offer is strong enough for them to use the site and come back, and what should change. Nothing is off limits: a wording change, a different first screen, a different product, or the case for stopping. Be ambitious and blunt. A review that confirms the current plan is worth less than one that finds where it is wrong.

You are the lead. You run four reviewers who never see each other's work, then write the synthesis, then have it attacked.

If you cannot start subagents, write the lenses yourself in the order VL1 to VL4, reading only each lens's inputs before writing its file, and say in the report that they came from one reader.

## Stage 1: four blind reviewers

Start four fresh subagents (three at a time at most). Each gets only the inputs listed for its lens, the shared rules' hard limits and writing rules, and 12 WebSearch calls. Each writes one file in `docs/value-proposition/` and must not read that folder or the other lenses' inputs beyond its own list.

| Lens | Reads | Answers | Writes |
|---|---|---|---|
| VL1, first visit | Only `index.html`, `about.html`, the user-facing strings in `src/`, and `docs/evidence/landing.png`, `landing-360.png`, `results.png`, `about.png`. No other docs | What does this site say it does, in its own words? What would a stranger expect after the first screen, and does the results page deliver it? Where does a first visit stall? What is missing that a shopper needs before acting (price, stock, hours, a way to buy)? | `first-visit.md` |
| VL2, position | `research/competitors/` (all three files), `research/amazon-alternatives.md`, `research/README.md`, `research/sites/` | Who is the nearest substitute for each kind of shopper, counting "search Google Maps" and "just use Amazon"? Which claimed differences would a shopper notice and which only matter to the builder? What do the sites that died or stalled say about this space? | `position.md` |
| VL3, promise against measurement | `docs/quality.md`, `docs/search-latency.md`, `docs/open-place-coverage.md`, `docs/open-place-precision.md`, `docs/costs.md`, `docs/feasibility-overview.md`, `docs/ranking.md`, `docs/privacy.md` | Which promises can the product as measured keep today, and which does it break (for example how often a nearby result is wrong)? What would a shopper feel at those rates? Which single measured weakness most limits the offer? | `promise-vs-measured.md` |
| VL4, the case for a different product | `docs/STATUS.md`, `docs/ideas.md`, `docs/feasibility-overview.md`, `docs/plans/`, `research/competitors/README.md`, `README.md` | Argue the strongest case for at least three product shapes that differ in kind from today's and from each other, one of them a full pivot, plus the case for stopping. For each: who it serves, what it would take, what existing work it keeps, how to test it in under a week without spending on Brave | `different-product.md` |

Every reviewer ends its file with a ranked list of changes, each with: the evidence (file and line, or URL and date read), size (wording, screen, feature, pivot), the cheapest test that would show it works, and how confident the reviewer is. A reviewer's read of what a shopper would think is its own judgment and is labeled so; no invented personas or quotes.

## Stage 2: synthesis

Read the four files and write `docs/value-proposition-review.md`:

1. The answer in five lines or fewer: the offer as it stands, the main reason it does or does not hold, the one change you would make first.
2. Where the reviewers agree, where they disagree, and which side the evidence favors.
3. One table of recommended changes from smallest to largest (wording, style, screen, feature, pivot), each with evidence, effort, what it risks, and the cheapest test. Mark each as "agent can do" or "operator decides".
4. What nobody could answer from the repo, and how to find out (for example five real shoppers; do not invent their answers).
5. Decisions for the operator, labeled VQ1, VQ2 and so on, each with your recommendation.

## Stage 3: attack the synthesis

Start one fresh subagent with only `docs/value-proposition-review.md` and the four lens files. Its job: find claims the evidence does not carry, recommendations that contradict each other, and the strongest objection to the first-line answer. Apply what holds up; record the counts.

## Stretch: quick wins on a branch

`npm ci` is permitted for this. Implement the wording and small style changes that the synthesis marks "agent can do" on the branch `claude/value-prop-quick-wins`, one commit per change, with lint, unit tests and the build passing. Follow the site's existing typography, spacing, color and component patterns; if a recommendation would break one, do not build it, and name the pattern and the conflict in the synthesis. This branch never merges without the operator.

## Merge

The four lens files, the synthesis and the STATUS row go to `main` without approval. No change to the site, the Worker or the ranking merges; those wait on the quick-wins branch or as VQ decisions.

## Model

Fable for the lead and all five subagents.
