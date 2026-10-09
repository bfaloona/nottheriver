# Feasibility overview: running nottheriver as users arrive

Summary of the 2026-10-08 evaluation, for the operator. The evidence is in [scale-feasibility.md](scale-feasibility.md) and its two companions; every figure below is from there (measured or projection, as labelled there).

## The short version

1. **It runs without funding up to a few thousand searches a month.** Fixed cost is zero (GitHub Pages, Workers Free). The only cost is per search, about $0.023, so 3,000 searches a month is about $65 and 30,000 is about $700 (projection). Past a few thousand it needs a funding model or a cheaper way to find shops.
2. **Brave is the bill.** Place search and web search are $0.010 each per search; the model is $0.003. Every cache on the table moves the total by under 12%; removing one Brave call moves it 21%.
3. **Caching is a product question, not a money question.** Only the product reading is cached today (30 days, in Workers KV, no location in it). A nearby-shop cache would show closed shops; a verdict cache would hide shops silently. Both are ruled out for now and the numbers do not argue for reopening them below 30,000 searches a month.
4. **A database should store shops, never searches.** Shop facts with sources, dates and dispute state fit the privacy promise; a row per search breaks it. Daily totals are the most to keep.
5. **Local data is the real lever.** A shop table built from open place data, served from the Worker, removes the place-search cost and keeps the zip away from Brave. If that table carries categories, "sells it" becomes a lookup instead of a model call, which is where the seconds go. Taken all the way, the product becomes a curated directory with a search engine as fallback, and the cost moves from money to curation time.

## What to protect

| Property | Why it matters at scale |
|---|---|
| Zip never leaves the browser; no accounts, no tracking | Every cache or store candidate is judged against the "What is kept" table first |
| Every result explained from a source, every finding disputable | A cache or store must not make a drop invisible or an explanation stale without saying so |
| Honest degradation | With no funding, a Brave quota at the month's budget is the ceiling, and the site should say when it is reached rather than fail silently |

## First steps, in order

| Step | Cost | What it decides |
|---|---|---|
| Brave payment method and monthly quota | none | Whether a busy day can run up a bill |
| Daily counters (searches, cache hits, Brave calls, model cost), with a privacy row | none | Turns every "hit rate unknown" into a number |
| Coverage check: how many of the 86 graded nearby shops appear in OpenStreetMap or Overture with a usable category | no Brave calls | Whether open place data can carry local search. Done 2026-10-09: 98% found in either, 70% with a tag that says "plausibly sells it" ([open-place-coverage.md](open-place-coverage.md)) |
| Eval of 3 Brave calls a search instead of 4 | about 160 Brave calls | The one cost cut above 12% that needs no new data |

## Open

- No measured searches-per-user figure exists; user counts in the scenarios are two stated guesses.
- Whether Brave lets the operator set a per-key quota is unverified.
- Coverage of open place data for the graded shops is measured ([open-place-coverage.md](open-place-coverage.md)); precision against shops that do not sell the product, closures and licensing are not.
