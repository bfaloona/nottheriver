# Caching and store types in nottheriver

Read-only research, 2026-09-27, branch `main` at 4855b7f. Paths are relative to the repo root.

## Q1. What is cached or saved, and what is fresh per search

**Short answer:** only two things carry over between searches: the model's reading of the product (Workers KV, 30 days) and hand-curated repo data (blocklist, certifications, findings, zips). Every Brave call, the enrich/classify model call, scoring and filtering run fresh on every search, and the response is marked `Cache-Control: no-store` (`proxy/src/handler.ts:139`).

| Step | Fresh, cached or repo | Holds | Lives / written by / refreshed | Cost or latency |
|---|---|---|---|---|
| Zip to city/state/centroid/RUCA | Repo, static | 33,791 ZCTAs | `public/zips.json` built by `data/build-zips.mjs` (`data/README.md`); fetched once per page load and held in a module-level promise (`src/zip.ts:27-41`); rebuilt by hand | 1.34 MB raw, ~330 KB gzip, first search only (`docs/costs.md:38`) |
| Last product text | Browser | product only, never the zip | `sessionStorage` (`src/main.ts:26,97`); cleared when the tab closes | none |
| Normalize (category, canonical name, similar products, 3 online + 2 local queries) | Cached (KV) | raw model output, unscrubbed | `NORMALIZE_CACHE`, key = SHA-256 of {version, prompt with lowercased product, model list} (`proxy/src/normalize-cache.ts:12-19`); written after a fresh call only if it has a local query (`proxy/src/pipeline.ts:308-309`); 30-day TTL (`normalize-cache.ts:8`); bump `CACHE_VERSION` to flush | Saves 1 of 2 model calls (~1.5k-char prompt, `docs/costs.md:26`); main value is repeatable wording (`docs/quality.md:86-87`) |
| Brave web search (1-3 calls) | Fresh | 10 results per query, with lat/lon/city/state headers | `proxy/src/brave.ts:153-167`, `pipeline.ts:107-114` | $0.005 per call |
| Brave place search (0-2 calls) | Fresh | 10 places per query, with lat/lon in the query | `brave.ts:170-177` | $0.005 per call; Brave is most of a search's cost (`docs/costs.md:28`) |
| Dedupe, blocklist, editorial URL rule | Fresh, deterministic | | `pipeline.ts:137-151`, `blocklist.ts`, `precision.ts` | CPU only |
| Enrich/classify (site type, sells it, signals) | Fresh | one call over up to 24 online + 20 local candidates | `proxy/src/enrich.ts:159-171`; prompt ~39k chars (`costs.md:26`) | Both model calls together: "well under $0.002" typical, $0.0073 upper bound (`docs/costs.md:26,29`); eval20-0925 measured $0.416 for 20 searches, of which $0.40 is 80 Brave calls, so about $0.0008 of model use per search (`docs/evidence/quality/eval20-0925/run-summary.json`) |
| Certifications, findings, accepted sources, blocklist | Repo, build-time | 29 cert rows, 4 findings, 16 source domains, 39+14 blocklist entries | `data/*.json` imported at build (`pipeline.ts:1-3`, `blocklist.ts`); hand-checked with `checked` dates; re-deploy to refresh | none at runtime |
| Score, distance groups, branch cap, top 10 | Fresh, deterministic | | `proxy/ranking/score.ts`, `pipeline.ts:231-281` | CPU only |
| Quality headline on About | Repo, build-time | precision/recall figures | `src/quality.json`, written by `node eval/summarize.mjs --site` | none |
| Eval evidence (not runtime) | Repo | saved responses, grades, baseline | `docs/evidence/quality/*/responses`, `grades.json`; grades reused by URL and address (`docs/quality.md:91`) | the existing "save to repo for repeatability" mechanism |
| Rate-limit counters | Worker memory + Cloudflare binding | client key (IP or /64) | `handler.ts:59-77`; 60 s window | not a cache |

Latency: no measured figures in the repo. The Worker logs per-request ms (`handler.ts:178`) but observability is off; 3 of 20 eval searches exceeded the eval client's 60 s limit once (`docs/quality.md:91`).

### What to consider caching or saving next

Ranked by value against risk. `docs/debt.md:17` already lists "cache fetch results with a short TTL" as the alternative to today's design; `docs/ideas.md` has no caching item.

| Rank | Candidate | Value | Risk | Notes |
|---|---|---|---|---|
| 1 | Brave place-search results, keyed by (local query, 2-decimal lat/lon) | Mainly eval repeatability: Brave itself changes ~1 shop in 14 within an hour (`quality.md:66`). Live cost saving depends on hit rate, and a key of query x 2-decimal centroid is sparse for live traffic | **Privacy:** a new store of zip-area centers with queries; needs a `docs/privacy.md` row and a hashed key. **Staleness:** graders found 3 shops no longer at the listed address (`quality.md:90`). A TTL of hours to days limits both | Same key shape the normalize cache uses; KV write limits apply (`normalize-cache.ts:36`) |
| 2 | Brave web-search results, keyed by (online query, city/state/lat/lon) | Same repeatability case; online precision is already 98%, so staleness matters less | Web results are location-tuned (`brave.ts:158-163`), so the key must include location, same privacy note | |
| 3 | Shop-judging verdict (`sells_product`, `site_type`) per (domain or place, product) | Shop judging is now the largest remaining run-to-run change: 8 of 248 shops flipped (`quality.md:88`); `docs/plans/search-variation.md:25` listed this cache as option 1 | **Not chosen:** operator ruled 2026-09-26 to accept the variance and grade two runs; the ruling records no rationale, so what follows is this note's reading. The verdict is a likelihood from a name and a store-type word (`docs/ranking.md:43`), made in one call over all candidates, so a cached one comes from a different context; a cached "no" hides a real shop for the whole TTL (the same worry at `pipeline.ts:308`). **Fairness:** a wrong "no" becomes persistent. It saves no call unless every candidate hits | Cheapest fix if repeatability matters more than freshness: cache only "yes"/"maybe", never "no" |
| 4 | The normalized reading for the 20 eval products, committed to the repo | Evals stay repeatable across the 30-day expiry and across `CACHE_VERSION` bumps | Freezes wording the model would otherwise improve; only eval products, so no privacy cost | A seed file under `eval/`, loaded by the harness, not the Worker |
| 5 | Fetched page content per retailer | Would let the classifier see more than a name and a store-type word (`debt.md:26,65`) | This is a new fetch, not a cache of an existing one: 14-16% of retailer pages block a declared bot (`quality.md:11`), plus storage and copyright questions | Only after deciding to fetch pages at all |
| 6 | Certification and finding checks | Already saved to the repo with `checked` dates; that is the design (`docs/ranking.md:92`) | Certifier directories cannot be re-checked by script (`debt.md:62`); what is missing is automated re-check, not a cache | Phase B of `docs/plans/amazon-alternatives-in-ranking.md` adds 54 rows the same way |

## Q2. How results are categorized by store type or breadth

**Short answer:** the ranking has no notion of specialist vs generalist or independent vs chain. The only chain-aware rule is the cap of 2 nearby branches per domain. A local hardware store, Home Depot and Walmart are told apart only by the classifier's "sells it" guess, distance, and whichever of them has a curated finding.

| Category | Values | Where | Effect |
|---|---|---|---|
| Brave `icon_category` (undocumented) | seen: shop, hardware, furniture, service, sportevent, car, bicycle, null (`docs/evidence/quality/place-icon-categories.json`) | `brave.ts:33,94-110` | Drops `restaurant` and `amusement_park` (`brave.ts:83`); otherwise becomes the first word of the local snippet, which feeds the classifier and the text relevance rule. Never displayed (snippets are not shown, `docs/STATUS.md:127`) |
| Site type (classifier) | retailer, marketplace, editorial, manufacturer_no_cart, service, other (`contract.ts:29`) | `enrich.ts:84-97`, `precision.ts:35-43` | editorial/service/manufacturer_no_cart dropped; retailer, marketplace and other treated the same. Not in `SearchResult` (`contract.ts:71-86`), so never ranked or displayed |
| Sells it (classifier) | yes, maybe, no | `score.ts:60-72` | "no" dropped; local only: yes gives relevance 1.0, maybe 0.5; online uses the text rule only (`score.ts:69`) |
| Relevance text rule | 1.0 product name, 0.5 category, 0.2 else | `score.ts:74-88` | 0.25 weight; most local shops sit at 0.2 without the classifier (`docs/ranking.md:43`) |
| Normalize category | free text ("cookware") | `contract.ts:142`, `prompts.ts:27` | Text-rule 0.5 tier, enrich prompt, shown in the query echo. The local queries name "the specialist store type" then "the broader name small independent shops use" (`proxy/prompts/normalize.ts`), the only specialist/generalist notion in the code, and it is lost when results are flattened (`pipeline.ts:109-113`) |
| Local vs online | kind | `pipeline.ts:261-263`, `score.ts:136-138` | Separate top-10 sections; online proximity fixed at 0.5 |
| Branch cap | 2 per registrable domain, nearby section | `pipeline.ts:24,229-240` | Drops extra branches as `branch_cap`; the only rule that treats a chain differently, and Ace dealers share one domain |
| `independent_retailer_assoc` | 3 rows | `data/certifications.json`, `score.ts:48` | Badge only, no score |
| Chain (eval) | 10+ US stores under one name | `docs/quality.md:17` | Eval prose only; not found as a field in `eval/grade-schema.json` or `grades.json` |

**Walkthrough, "cast iron skillet", nearby.** All three come from the same two place searches ("cookware store", "kitchen supply store", or similar). Ethics and environment start at 0.5 each. Walmart's FTC row (`data/negatives.json`, $3M, self) costs 0.25 on ethics; Home Depot's EPA row costs 0.25 on environment; the hardware store has no row. With the formula (`docs/ranking.md:29`), at equal distance (about 2 mi, proximity 0.92):

| Shop | Classifier says | Score |
|---|---|---|
| Local hardware store | maybe | 0.125 + 0.15 + 0.15 + 0.138 = **0.563** |
| Home Depot | yes | 0.25 + 0.15 + 0.075 + 0.138 = **0.613** |
| Walmart | yes | 0.25 + 0.075 + 0.15 + 0.138 = **0.613** |

A "yes" beats a "maybe" by 0.125, more than a major finding costs (0.075), so a big-box store the classifier is surer about outranks an independent with no findings. With the same verdict the independent wins by 0.075. Online, all three usually get relevance 1.0 from page titles, so only the findings separate them.

**Walkthrough, food (say loose-leaf tea).** Target has no finding row today (its research row is Phase B, not imported); a corner market has none either. All three sit at 0.5/0.5 and are ordered by the classifier verdict and distance alone. The exceptions are the curated co-ops and New Seasons (`data/certifications.json`), which gain 0.075.

### Open decisions already recorded

- Whether local recall should favor independents (17% vs 35% found, `docs/STATUS.md:63`); whether marketplaces show at all (`STATUS.md:64`); whether `independent_retailer_assoc` should score (`STATUS.md:66`).
- `docs/ideas.md:13` item 3: an independence score as a factor separate from concerns; ADR 0006 declined a company-size factor and points size at that idea (`docs/decisions/0006-weighted-findings.md`, "No company size factor").

### Smallest changes that would tell them apart (not recommendations)

| Change | Size | Tells apart | Tradeoff |
|---|---|---|---|
| S1. Keep which local query returned each place (specialist query vs broader query) and expose it as a tag or a small relevance bump | Small: `fetchCandidates` flattens, `pipeline.ts:109-113` | Specialist vs generalist, weakly | No new calls; but Brave returns Home Depot for "cookware store" too, so the signal is noisy |
| S2. Add a field to the enrich reply (e.g. `store_breadth`: specialist / general / department, or `chain`: yes / no / unknown) | Small: `enrich.ts:39,84-97`, `proxy/prompts/enrich.ts`, schema | Both | Model guess from a name; fail-open keeps unclassified rows; same precedent as `sells_product`, but ADR 0003 says the model never sets a number, so use it as a tier like yes/maybe, not a value |
| S3. Count distinct addresses per domain in the place results (before the cap) and treat 3+ as "chain nearby" | Small: `pipeline.ts:232-240` already counts per domain | Chain vs independent, locally | Deterministic and explainable; misses a chain with one nearby branch; Ace dealers look like one chain |
| S4. A curated chain list in `data/` (domain, store count, source), badge first, score later | Medium: new data file, test, render | Chain vs independent | Sourced and disputable like certifications; needs a threshold (eval uses 10+) and upkeep; a chain penalty is the open policy call in STATUS |
| S5. Move `independent_retailer_assoc` into the ethics certs list | Two lines: `score.ts:49` and `kinds.unscored` in `data/certifications.json` (nothing ties the two lists, `debt.md:64`) | Independent, for 3 shops | Almost no effect until more association rows exist |

## Open questions for the operator

- CQ1. Is a place-search cache acceptable given it stores zip-area centers (2-decimal) with queries, and what TTL? (`docs/privacy.md` would need a row.)
- CQ2. Now that wording is fixed and shop judging is the largest remaining variance, should the verdict cache (ruled "accept" on 2026-09-26) be reopened, perhaps caching only yes/maybe?
- CQ3. Is independent vs chain meant to be a ranking factor, a badge, or a filter on the page? (STATUS "Decisions needed".)
- CQ4. Is specialist vs generalist a relevance question (a cookware store more likely stocks the skillet) or a values question (favor specialists even when both stock it)? The answer decides whether S1/S2 feed relevance or a new component.
- CQ5. Should the eval's chain label (10+ stores) be recorded per baseline shop in a committed file so later evals reuse it?
