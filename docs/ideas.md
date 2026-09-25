# Ideas for triage

Operator ideas recorded 2026-09-24, not yet designed or scheduled. Each needs a discussion before work starts; items that were started are marked.

| Idea | Notes | State |
|---|---|---|
| Price-level score for sorting | Each store gets a cost score: average or no data = 0, each low-cost signal -1, each high-end signal +1. For sorting, not (yet) for rank. | Not started |
| Map of local results | OpenStreetMap beside the local results, a marker per store. | Built 2026-09-24: above the Near you list, loads automatically |
| Simpler "Why this rank" | Smaller, less complex panel; not every line links to the ranking explanation. | Shipped 2026-09-24 (plain words, links only for certifications and concerns) |
| Breadth: product match and missing shops | Better Business Bureau? Other official sources? | Not started |
| Breadth: ethical, free, used, near transit | Community resources such as tool and equipment lending libraries and public libraries; thrift stores; marketplaces (Facebook Marketplace, Craigslist, etc.); results near public transit. Overlaps the open marketplace question in [STATUS.md](STATUS.md#decisions-needed). | Not started |
| Live search progress | After clicking Search, simple live updates that say what is happening (informative steps, not just an animation). | Not started |
| Fuller, fairer concerns | Today one curated finding shows as a large warning box (Home Depot: an environmental action dated 2020-12-17, the only row for that domain in `data/negatives.json`). Want: more data per retailer, ranked accordingly, and a small indicator (such as "3 concerns") linking to the detail. Notes: (1) under [ADR 0004](decisions/0004-down-ranking.md) every finding needs a source and date, so breadth means new sources (candidates to evaluate: Good Jobs First Violation Tracker, EPA ECHO, OSHA enforcement data), not suspicion; (2) fairness: weigh findings by age and severity, and consider size (a large chain collects more actions just by being large); (3) "small business" is a separate factor from concerns: an independence score, tied to the open questions on independents and `independent_retailer_assoc` in [STATUS.md](STATUS.md#decisions-needed). | Not started |
