# Brief: scaling scenarios and the architecture changes they call for

First read `prompts/agent-shared-rules.md` and follow it. Handoff note: `handoff/2026-11-11-scaling-architecture.md`.

## Goal

Show the operator what happens to cost, speed and usefulness as use grows from a handful of searches a day to people across the whole United States, and which architecture changes keep the site affordable for one person paying the bills, responsive, and useful in any US zip. Be ambitious about options; be strict about evidence.

## Build on what exists; do not redo it

Read first: `docs/feasibility-overview.md`, `docs/scale-feasibility.md` with its companions `docs/scale-feasibility-costs.md` and `docs/scale-feasibility-reuse.md`, `docs/architecture.md`, `docs/costs.md`, `docs/search-latency.md`, `docs/caching-and-store-types.md`, `docs/open-place-coverage.md`, `docs/open-place-precision.md`, `docs/privacy.md`, `docs/debt.md`, the Worker in `proxy/src/`, and the operator's rulings in `docs/STATUS.md` ("Decisions made by the operator", the 2026-10-09 scale feasibility entry).

That work already answers the cost of a search, which caches are worth it below 30,000 searches a month, and 13 decisions (all ruled or deferred). Treat the rulings as settled. You may say at which scenario a ruling should be reopened and what evidence would justify it; you may not reopen one on argument alone. Three of them (Brave payment method and quota, daily counters, spend ceilings) were deferred to 2026-10-14 and are overdue; say what each scenario below needs from them.

## What is missing, and is yours to add

**SC, the scenarios.** Define them with numbers you choose and justify, at least:

| Scenario | What it stresses |
|---|---|
| SC1 steady small, medium and large (three sizes of searches per day) | Monthly bill, free-tier limits of every service in the path |
| SC2 a spike (a news mention sends a month of traffic in an hour) | Rate limits, the per-isolate limiter noted in `docs/debt.md`, upstream quotas, what the visitor sees when the budget is gone |
| SC3 the whole country | Rural zips, territories, places where the place search returns little, speed far from the model provider, time zones |
| SC4 unwanted traffic (bots, scripted callers of `POST /search`) | Cost someone else can run up, and what stops it |
| SC5 a month with no money | What still works at zero spend |

For each: requests to every upstream service, cost per month, which limit breaks first, the latency a visitor sees, and what the visitor sees when it breaks.

**OPT, the options.** Cover at least these families, each option with what it saves in which scenario, what it costs to build and run, what it does to result quality, and whether it keeps the promises in the "What to protect" table of `docs/feasibility-overview.md` (zip stays in the browser, every result explained and disputable, honest degradation):

- Caching: at the browser, at Cloudflare's edge, in Workers KV; what can be cached without holding a search or a location.
- Batching and precomputation: work moved out of the request (nightly builds, popular products per metro area, shop tables built offline, model batch pricing).
- Outsourcing, meaning work or cost carried by someone else: open place data, retailer or certifier feeds, community curation, a visitor's own API key, donated or nonprofit credits, running part of the work in the visitor's browser, other search or place providers.
- Anything else you find: a cheaper or self-hosted model, fewer upstream calls, a curated directory with search as the fallback, queueing, a hard monthly ceiling with a public meter.

## Evidence rules for this brief

- Cost per search and its parts come from `docs/costs.md` and `docs/scale-feasibility-costs.md`. A price not already in the repo comes from the provider's own pricing page, fetched by you, cited with the URL and date read (up to 30 WebSearch calls; no accounts, no sign-ups). If you cannot fetch it, write "price not verified".
- Every monthly figure is a projection and is labeled so. Do the arithmetic in a small script committed under `docs/evidence/scaling-architecture/`, and take every number in the doc from its output.
- No Brave or model calls. Hit rates and latencies not already measured in the repo are "unknown", with the measurement that would settle them.

## Deliverable

`docs/scaling-architecture.md`:

1. The answer in five lines or fewer: how far today's design goes, what breaks first, the first change to make.
2. The scenario table.
3. The options table, then a short section per option family.
4. A recommended path in stages, each stage tied to the scenario that triggers it, so nothing is built before it is needed.
5. Decisions for the operator, labeled AQ1, AQ2 and so on, each with your recommendation and what it unblocks.

Link it from `docs/feasibility-overview.md` and the Docs row of `docs/STATUS.md`.

## Subagents

- After your first full draft, two fresh reviewers in parallel: one re-derives every figure from the script and the cited sources; one reads only the draft and the "What to protect" table and looks for options that quietly break a promise or contradict a ruling.
- Optional, if you want breadth: up to three fresh researchers, one per option family, 10 WebSearch calls each out of your 30, each writing findings with sources to your handoff note's folder before you draft.

## Merge

The doc, the script and the STATUS row go to `main` without approval. Build nothing in `proxy/`, `src/` or `infra/`; changes there are AQ decisions.

## Model

Fable for the lead and reviewers.
