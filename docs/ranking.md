# How ranking works

Every result's score is computed by code in `proxy/ranking/score.ts`, from fetched search results and curated, sourced data. The language model suggests search terms, points at evidence, and judges whether each result is a shop that sells the product, which can remove a result ([Filtered before scoring](#filtered-before-scoring)); it never sets a number and never writes text that is shown as a finding. Each result's "Why this rank" lists every non-zero component with its value, weight and source.

## Filtered before scoring

Only shops that could sell the product are scored. Each layer only removes candidates; the two blocklist passes run regardless ([architecture.md](architecture.md#request-flow)).

| Layer | Drops | Code |
|---|---|---|
| Place category | Local places whose Brave `icon_category` is `restaurant` or `amusement_park`, reported as `place_category`. Other categories are not dropped: `furniture` and `service` also covered kitchenware shops in the pilot's place results ([place-icon-categories.json](evidence/quality/place-icon-categories.json)), so they reach the classifier as the first word of the snippet instead | `DROPPED_PLACE_CATEGORIES` in `proxy/src/brave.ts` |
| Local dedupe | Department listings of one store: same registrable domain and street address, the shortest name kept | `dedupe` in `proxy/src/pipeline.ts` |
| Editorial URL rule | Online pages whose path has an editorial segment (blog, blogs, news, post, posts, story, article, articles, features, expert-advice, longform, how-to, shopping-guide) or a slug with the word "best". Never a homepage, and never a URL with a shop segment (collections, product, products, shop, store, stores). Dedupe prefers a shop page from the same domain, so a domain is dropped only when every page fetched from it is editorial | `isEditorialUrl` in `proxy/src/precision.ts` |
| Classification | Candidates the model classifies as editorial, service or manufacturer with no cart, or as not selling the product. A candidate it did not classify is kept | `dropReason` in `proxy/src/precision.ts` |

After scoring, the near-you section shows at most 2 branches per registrable domain (`MAX_BRANCHES_PER_DOMAIN` in `proxy/src/pipeline.ts`). In a rerun of the Cambridge skillet search, five Ace Hardware branches and a duplicate grocery listing filled the top 10 and pushed a Le Creuset outlet and a Home Depot below it.

Measured offline against the graded six-search pilot (`tests/fixtures/quality/graded-pilot.json`, replayed by `proxy/test/precision.test.ts`):

- The URL rule drops 25 of the 52 online rows graded "no" (15 of 27 unique URLs) and none of the 8 graded as selling the product.
- With a stub classifier that answers from hand labels, the remaining 12 unique "no" URLs are dropped: 11 as editorial and one clothing shop as not selling the product. This proves the plumbing, not the model's accuracy; that needs a live rerun of the pilot.
- Local dedupe merges three department pairs or groups in the pilot (REI and REI Bike Shop; three Camping World listings; Cabela's and its gun library listing) and keeps apart branches at different addresses and different shops at one mall address.

Every word in the URL rule matched at least one graded page; the lists grow only with new graded evidence.

## Formula

```
score = 0.25 × relevance + 0.30 × ethics + 0.30 × env + 0.15 × proximity
```

Every component is between 0 and 1, and the weights sum to 1, so the score is too. The weights live in `proxy/ranking/weights.ts` and are shown above every set of results. Why these weights: [ADR 0003](decisions/0003-scoring.md).

## Components

| Component | Rule | Source shown |
|---|---|---|
| Relevance | 1.0 if the result's title or snippet contains the product name or one of the similar products the model suggested; 0.5 if it contains only the product category; otherwise 0.2 | The result's own page |
| Ethics | See [Baseline](#baseline). +0.25 per ethics certification kind, capped at 1.0; then −0.25 per accepted labor or governance finding, floored at 0 | This page, plus each counted certification and finding |
| Environment | See [Baseline](#baseline). +0.25 per environmental certification kind, capped at 1.0; then −0.25 per accepted environmental finding, floored at 0 | This page, plus each counted certification and finding |
| Proximity | See [Proximity](#proximity) | This page |

Relevance is a plain substring match on lowercased text with punctuation turned into spaces, so a short product name can match inside a longer word ("pan" in "Japan"). For a local shop the snippet is Brave's store-type word (such as "hardware") plus any categories, so most local shops score 0.5 or 0.2; a shop scores 1.0 only when its name or the snippet names the product. Both limits are listed in [debt.md](debt.md).

### Baseline

Ethics and environment start at 0.5, not 0: a shop with no certification and no finding is unknown, not bad. "Baseline 0.5" in a result's sources links here.

- Certifications count once per kind: two B Corp rows for one shop add 0.25 once.
- A finding counts once per kind and source page, so the same case cannot lower a score twice.
- The cap is applied before findings are subtracted, so a finding still costs 0.25 even when a shop holds every certification in that component.

### Proximity

For a shop near you: `max(0, 1 − distance_km / 40)`. Distance is the straight-line (haversine) distance from the center of your zip area to the shop's coordinates, rounded to 0.1 km before scoring so you can recompute the value from what is shown (the page displays miles). A shop with no coordinates, or 40 km (about 25 miles) or more away, gets 0 and the component is hidden. Online retailers get a fixed 0.5.

## Certifications

Curated in `data/certifications.json`; every row has a source URL and a check date.

| Kind | Shown as | Scores in |
|---|---|---|
| `b_corp` | B Corp | Ethics |
| `fair_trade` | Sells Fair Trade Certified products | Ethics |
| `worker_coop` | Worker co-op | Ethics |
| `one_percent_planet` | 1% for the Planet | Environment |
| `climate_neutral` | Climate Label certified (the Climate Neutral certification, now branded The Climate Label) | Environment |
| `independent_retailer_assoc` | Independent retailer association | Badge only, no score effect |

## Negative findings (down-ranking policy)

A finding lowers a score only if all of these hold:

1. **Accepted source.** The registrable domain of its source URL is in [data/negative-sources.md](../data/negative-sources.md): regulators, court records, established news organizations and recognized watchdogs. Each entry has a one-line rationale and was verified to exist. New sources are proposed by pull request.
2. **Citation.** Every finding shown carries its source link and, for curated findings, the date of the action.
3. **No model-authored text.** The page shows the finding's kind and the source's own title. The language model never writes the claim.
4. **Dispute link.** Every finding shown has a "Dispute this" link.

**What can appear today.** Only curated findings, from `data/negatives.json`: four rows, each citing a regulator's own release with its action date (Kohl's and Walmart, FTC, 2022-04-08; The Home Depot, EPA, 2020-12-17; Dollar General, OSHA, 2024-07-11).

**The model path cannot fire yet.** The code accepts a model-suggested finding only when it cites a page that was among the fetched search results, that page names the shop, and that page sits on an accepted-source domain. But the Worker drops every search result on an accepted-source domain before ranking (a regulator's page must never be ranked as a shop), so no such page is ever citable. The path stays in the code, and becomes live only if registry pages are someday fetched as citable evidence rows separate from shop results.

Positive signals the model points at (for example a shop's own sustainability page) are shown as information and never change the score; only curated certifications raise it.

## Disputes

Anyone, including the business itself, can dispute a certification, a finding or any part of a score. The "Dispute this" link opens the [dispute issue template](../.github/ISSUE_TEMPLATE/dispute-a-ranking.md), which asks for the retailer, the signal shown, the cited source, why it is wrong, and evidence. How disputes are reviewed and resolved: TBD.
