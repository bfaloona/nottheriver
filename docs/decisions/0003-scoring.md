# 0003: Scoring

Status: Accepted (2026-09-23)

## Context

Results are ranked by ethical practice, environmental practice and proximity, among shops that sell the product. Every rank must be explainable: each result shows each non-zero component with its value and a source. The score must be deterministic code; the model may point at evidence but never sets a number.

## Decision

```
score = 0.25 × relevance + 0.30 × ethics + 0.30 × env + 0.15 × proximity
```

Weights live in `proxy/ranking/weights.ts`, are returned with every response and are shown on the page. Every component is in [0, 1] and the weights sum to 1.

**Why these weights.**

- Ethics and environment carry the most (0.60 together, split evenly) because ranking by practice is the reason the site exists, and neither should dominate the other.
- Relevance gets 0.25, not more, because every candidate already came from a search for the product; the component mostly separates an exact match (1.0) from a category match (0.5) or a loose one (0.2).
- Proximity gets 0.15 because it only varies for local shops (online retailers are fixed at 0.5); a small weight lets a nearby shop edge ahead without letting distance outweigh practice.

What that means in points: one certification or one negative finding moves a score by 0.075 (0.30 × 0.25), exactly the gap between a shop at the center of your zip area and an online retailer (0.15 × 0.5). An exact product match beats a category match by 0.125.

**Component rules** (full text in [ranking.md](../ranking.md)):

- Relevance: 1.0 if the title or snippet contains the canonical name or a similar product, 0.5 if only the category, else 0.2; plain substring match on normalized text. Never 0, so relevance always shows with the result's own page as its source.
- Ethics and environment: baseline 0.5, +0.25 per certification kind that scores in that component, capped at 1.0, then −0.25 per accepted negative finding of a matching kind, floored at 0. Baselines are non-zero because no data is not bad data, and so both components always carry a source (the ranking doc).
- Duplicates count once: each certification kind earns one step even when a shop has two rows of that kind, and a finding counts once per kind and source page, so a curated row and a model-cited row of the same page cannot penalize twice.
- The cap applies before findings are subtracted, so a finding still costs 0.25 for a shop that holds every certification.
- Proximity: `max(0, 1 − distance_km / 40)` for local shops, haversine from the request centroid to the shop's coordinates, rounded to 0.1 km before scoring so a reader can recompute it from the display. No coordinates or beyond 40 km gives 0. Online retailers: fixed 0.5.
- `independent_retailer_assoc` is a badge with no score effect: no weight is defined for it.
- Positive signals the model points at are displayed but do not change the score; only curated certifications raise it.
- Ties keep fetch order (stable sort); scores and contributions are rounded to 3 decimals in the response, and the total is summed from unrounded products.
- Amended 2026-09-24 (operator decision): "Why this rank" on the page shows the score to 2 decimals and one plain-words line per component, linking only certifications and concerns; the weights are in the line above the results, and every value, weight and source stays in the API response.

## Consequences

- Most local shops score 0.5 or 0.2 on relevance, because a place result has only a name and a category list ([debt.md](../debt.md)).
- A substring match can over-match inside longer words ("pan" in "Japan").
- Changing a weight is a one-line change in `weights.ts`; the page reads the weights from each response, but this ADR and [ranking.md](../ranking.md) must be updated with it.
