# 0004: Down-ranking policy

Status: Accepted (2026-09-23)

## Context

Negative findings (labor, governance, environmental) lower a shop's score. A wrong finding harms a real business, and a language model can invent or misattribute one. Product searches rarely surface regulatory or court pages, so model-found negatives would be rare even if trusted.

## Decision

- **Accepted sources only.** A finding lowers a score only if the registrable domain of its source URL is in `data/negative-sources.md` (machine copy `negative-sources.json`; a test keeps them equal): regulators, court records, established news organizations and recognized watchdogs, each with a one-line rationale and verified to exist. New sources come by pull request.
- **Curated first.** The main path is `data/negatives.json`: rows curated by hand, joined by registrable domain, each with its source URL, the action date and a check date. They need no fetched page.
  - Amended 2026-09-27: see [0006](0006-weighted-findings.md) for the row fields a curated finding also carries (`penalty_usd`, `relation`, `status`, `citation_type`).
- **The model only points.** The model may suggest a finding by citing a URL. Code accepts it only if the URL is one of the pages fetched for this search (after the first blocklist pass, so a blocked page can never be cited), the page is the shop's own or names the shop by name or domain label (the mention rule: a regulator page that does not name the shop cannot down-rank it), and, for a negative, the page's domain is an accepted source.
  - Amended 2026-09-28: the model is no longer asked for findings or positive signals, and the code path above is removed. None had reached a shown result since the no-self-vouching rule below (0 in about 360 searches measured 2026-09-27/28, [search-latency.md](../search-latency.md#what-enrichs-output-tokens-are)), and asking for them cost output tokens on every search. Every finding shown is now curated. Reviving the path means restoring the rules in this bullet.
- **No self-vouching (amended 2026-09-24).** A positive signal citing the shop's own site is dropped: the page is the shop describing itself, and the claim shown would be its page title.
- **Accepted-source pages are never shops.** Brave results on an accepted-source domain are dropped before ranking, so a regulator can never appear as a retailer, and a registry page cannot be ranked and then cited against an unrelated shop.
- **No model-authored text.** The page shows the finding's kind, the source's own title as the claim, the source link and, for curated rows, the action date. Model prose is discarded.
- **Every finding is disputable.** Each one shows a "Dispute this" link to the dispute issue template.
- A finding counts once per kind and source page; the arithmetic is in [0003](0003-scoring.md).

## Consequences

- The two rules together meant the model path could not fire for a negative: a negative had to cite a fetched page on an accepted-source domain, and no such page survives the fetch step. The path was removed on 2026-09-28 (see the amendment under "The model only points").
- Findings shown today are the four curated rows in `data/negatives.json`.
- Coverage of negatives is small and hand-maintained; the registry has one watchdog. Both are listed in [debt.md](../debt.md).
- How disputes are reviewed and resolved is not yet defined.
