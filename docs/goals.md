# Goals

The owner sets the vision and the goals. Quoted lines are the owner's words of 2026-11-15. A line marked "inferred" was added by an agent from earlier rulings or the owner's earlier words, and the owner has not ruled on it.

## 1. Vision

**A public resource that makes it easier to buy from more ethical companies nearby, smaller ones included.**

| | What it means |
|---|---|
| V1, record first, size second | The aim is the better company, whatever its size. Whether a shop is independent or a chain is shown as one fact about it, beside what its record says. |
| V2, broader than Amazon | "while 'quit amazon prime' would not be incorrect, the site hopes to be broader than that." Keeping Amazon and the businesses it owns out of results is one promise among several (G3). The site's job is to help a shopper choose where to buy instead. |
| V3, the size of the project | A proof of concept, kept by one person with agents, moving toward telling friends about it. "The 'announcement' is not an event as much as a weather vane. that's the type and size of project it is." Work is sized for a site friends would use. Planning for public traffic is [shelved](STATUS.md#shelved-2026-11-15). |

## 2. Goals

### G1. The site can gather enough information to be useful to shoppers

"validate the site can collect and aggregate enough information to be useful to shoppers". The owner chose four checks; G1 is met when all four pass.

| Check | Passes when | Today |
|---|---|---|
| G1a, the ten-purchase log | In the owner's next ten real purchases, the site gave something their usual tool did not at least 3 times, by the owner's call on each log line | Not started |
| G1b, records tell like companies apart | The [record book pilot](plans/record-book-pilot.md) shows different records in at least 2 of 3 groups (Walmart, Target, Costco; Home Depot, Lowe's; REI, DICK'S), with no more than one claim tied to the wrong company | Passed with no margin by the proposed rule: records differ in 2 of 3 groups, and one row is likely labeled with the wrong Walmart company ([results](evidence/record-book/README.md)). The owner has not ruled on the rule |
| G1c, half of results say something | At least half of shown results carry a checked fact (owner, independent or chain, certification, finding) in place of "unknown" | 579 of 2,182 saved results (27%) are for a website the site holds a fact about: 235 a certification or finding, the rest a chain-list entry only ([shop-domains.tsv](evidence/ethics-data/shop-domains.tsv)) |
| G1d, the nearby list is mostly right | The share of nearby shops graded good reaches a target. Target: TBD, the owner to fill | 71% of graded nearby shops good in the runs of 2026-09-29 ([quality.md](quality.md)) |

### G2. Searches feel responsive

"searches feel responsive (~2 seconds?)". The owner's reading: the first results are on screen within about 2 seconds for most searches, and the full list may take longer.

| Passes when | Today |
|---|---|
| First results show within about 2 seconds in most searches on the live site. The share that counts as "most": TBD, the owner to fill | Nothing shows until the whole answer arrives, so the time to the first result is the time of the whole search. On the live Worker that was a median of 2.9 and 3.3 seconds, with 9 in 10 searches within 3.9 seconds, in the two graded runs of 20 searches on 2026-09-29 (`elapsed_ms` in the saved responses under [evidence/quality/eval20-store-types/](evidence/quality/eval20-store-types/)). Time in the browser adds under a second ([search-latency.md](search-latency.md)) |

### G3. What the site says can be checked (inferred)

Inferred from the rulings in [ranking.md](ranking.md), [privacy.md](privacy.md) and the [decision records](decisions/).

- Amazon and Amazon-owned businesses never appear.
- Every certification and finding has a public source and a date, and a finding can be disputed.
- A shop with no record says "unknown".
- The zip code stays in the browser.

Today: the Amazon list is enforced by code that runs twice per search, with tests. How often an Amazon result slips through has never been counted.

### G4. Small enough for one person to keep (inferred)

Inferred from the owner's words: "simplicity is paramount. i want to build toward something with a good architecture." and "still experimenting with what is possible/useful/sustainable-for-me". Passes when: TBD, the owner to fill.

Today: one server program (a Cloudflare Worker), static pages, and data files in git ([architecture.md](architecture.md)). The free search credit covers about 250 searches a month ([costs.md](costs.md)).

## 3. Upcoming work

Work is done in the order listed: the top item whose next step is not waiting on something is next. Every item names the goal or vision line it serves; work that cannot name one goes under "No goal named" until the owner rules on it. The owner orders the list. An agent adds a new item at the bottom with a proposed position, and moves a finished item to "Done" in [STATUS.md](STATUS.md#done). Decisions the owner owes are listed in [STATUS.md](STATUS.md#decisions-needed).

Sizes are estimates.

### Ordered by the owner

| Order | Work | Serves | Size | Next step | Waits on |
|---|---|---|---|---|---|
| 1 | **Record book pilot.** One fixed check of public sources (workplace safety cases, wage cases, FTC cases, certification registries) on the ten chains seen most in saved searches. Shown only, no effect on order ([method](plans/record-book-pilot.md)) | G1b | Large: about 15 hours of agent time | The owner reads the [results for ten chains](evidence/record-book/README.md) and rules on its eight questions | The owner. Before any of it shows, the owner also reads every row that meets the chosen rule |
| 2 | **Ten-purchase log.** The owner uses the site for their next ten real purchases beside their usual tool, one log line each | G1a | Small, the owner's | The owner's first logged purchase | Owner |
| 3 | **A page per company in the record book**, and a box to look one up by name | G1c, G3: a record can be read and disputed without running a search | Days | Design the page once the pilot's claims are signed | Item 1 |
| 4 | **Order results by match and distance**, with the browser joining each shop to its record | G4: the search only finds shops, and a data change ships with a site push alone | Days | Wait for the ruling | The owner's ruling on whether ethics and environment leave the default order ([decisions needed](STATUS.md#decisions-needed)), and item 1 |
| 5 | **Consumer co-ops as a recorded fact.** Worker co-ops score today, consumer co-ops such as REI do not | V1 | Small | Propose how co-op ownership is shown, with sources, beside the record book's ownership facts | The owner's ruling on the proposal |

### Inferred, not yet ordered by the owner

| Proposed position | Work | Serves | Size | Next step | Waits on |
|---|---|---|---|---|---|
| After 2 | **Name the three missing targets**: the target share of nearby shops graded good (G1d), the share of searches that counts as "most" (G2), and what G4 passes on | G1d, G2, G4 | Small, the owner's | The owner fills them in section 2 | Owner |
| After 3 | **Show first results within about 2 seconds.** Candidates: send online shops before nearby ones, or show live steps while the search runs ([ideas.md](ideas.md), "Live search progress") | G2 | Large | Propose a design and what it would cost in model calls | Nothing |
| After 3 | **Links on each shop to check its public record yourself** ([ethics-data-strategies.md](ethics-data-strategies.md#5-strategies), "links to check a shop yourself") | G1c, G3 | Small | Test the links on 20 shops before any ship | The owner's choice: build now or after the 20-shop test |
| After 4 | **Grow the record book to the 99 most-seen shop websites**, ownership first. They are about half of saved results | G1c | Large: 26 to 30 hours of agent time | Decide from the results of items 1 and 2 | Items 1 and 2 both passing |
| After 4 | **Count Amazon results that slip through**, by a hand read of 50 saved results for Amazon-owned names missing from the blocklist and for sellers that ship through Amazon ([value-proposition-review.md](value-proposition-review.md), row R1) | G3 | Small: about half a day of page reading, no search calls | Pick the 50 results | The owner's ruling: this check was shelved on 2026-11-15 with the other value proposition decisions |

### No goal named

Each needs the owner to schedule it under a goal, shelve it or drop it.

| Work | State |
|---|---|
| A graded test of searches that make 3 paid search calls in place of 4 | Approved 2026-10-09, stalled after its first round ([STATUS.md](STATUS.md#in-flight)). It would cut cost per search, which G4 might cover once G4 has a measure |
| A test of whether sending the shopper's location changes web results | Approved 2026-10-09, never started ([STATUS.md](STATUS.md#in-flight)) |
| Ideas not started: a price-level score, and free, used, lending-library and near-transit options | [ideas.md](ideas.md) |

### Set aside

Shelved work and deferred outreach are listed in [STATUS.md](STATUS.md#shelved-2026-11-15), each with the ruling that would bring it back.
