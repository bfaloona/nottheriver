# Goals

The owner sets the vision and the goals. Quoted lines are the owner's words of 2026-11-15 unless another date is given. A line marked "inferred" was added by an agent from earlier rulings or the owner's earlier words, and the owner has not ruled on it.

## 1. Vision

**A public resource that makes it easier to buy from more ethical companies nearby, smaller ones included.**

The owner, 2026-11-17: "the core idea is providing ways to help people buy from better companies, support local businesses, drive less, defund amazon monopoly and buy less stuff". On order: "buy used/less should rank above 'from better companies'". The rest of the order, ruled the same day:

| Order | Aim | The owner's words |
|---|---|---|
| 0 | Defund the Amazon monopoly: the reason behind the whole site, above the ranked aims | "defund amazon is the meta-goal or goal 0" |
| 1 | Buy used or buy less (V0, G6) | "buy used/less should rank above 'from better companies'" |
| 2 | Better companies, with independent ownership part of it or right after it (V1) | "independent is part of or right after better businesses" |
| 3 | Local, meaning nearby; a separate factor from independent | "two different factors ... local is right after that" |
| Not placed | Drive less: a factor to consider, not yet a ranked aim, until researched | "drive less is complicated to record it as a factor to consider (research, opine, etc)" |

Whether the bold sentence changes to match: TBD, the owner to write.

| | What it means |
|---|---|
| V0, before buying new | "diverting someone to a tool lending library, a tool repair shop, a used tools shop are all fantastic ways to support the vision." (2026-11-17). Borrowing, repairing and buying used come first among the site's aims, but "these results in a query [are] to not trump all other factors". They show as a separate "before you buy" list of ideas that may apply, apart from the ranked shops: beside the shops on wide screens, above them and collapsed on narrow screens (ruled 2026-11-17). For now the list carries no score and never changes the order of shops. Giving used and repair shops a boost in the ranked list is the owner's preferred long-term direction, not scheduled (2026-11-17). See G6 |
| V1, record first, size second | The aim is the better company, whatever its size. Whether a shop is independent or a chain is shown as one fact about it, beside what its record says. |
| V2, broader than Amazon | "while 'quit amazon prime' would not be incorrect, the site hopes to be broader than that." Keeping Amazon and the businesses it owns out of results is one promise among several (G3). The site's job is to help a shopper choose where to buy instead. The reason, in the owner's words of 2026-11-17: "defund amazon monopoly". |
| V3, the size of the project | A proof of concept, kept by one person with agents, moving toward telling friends about it. "The 'announcement' is not an event as much as a weather vane. that's the type and size of project it is." Work is sized for a site friends would use. Planning for public traffic is [shelved](STATUS.md#shelved-2026-11-15). |

## 2. Goals

### G1. The site can gather enough information to be useful to shoppers

"validate the site can collect and aggregate enough information to be useful to shoppers". The owner chose four checks; G1 is met when all four pass.

| Check | Passes when | Today |
|---|---|---|
| G1a, the ten-purchase log | In the owner's next ten real purchases, the site gave something their usual tool did not at least 3 times, by the owner's call on each log line | Not started |
| G1b, records tell like companies apart | The [record book pilot](plans/record-book-pilot.md) shows different records in at least 2 of 3 groups (Walmart, Target, Costco; Home Depot, Lowe's; REI, DICK'S), with no more than one claim tied to the wrong company | Passed with no margin by the rule the owner chose on 2026-11-16: records differ in 2 of 3 groups, and one row is likely labeled with the wrong Walmart company ([results](evidence/record-book/README.md)). By rate per store the picture differs: Walmart has the most cases and never the highest rate in its group ([rates.md](evidence/record-book/rates.md)) |
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

**How sure each item is (the owner, 2026-11-17).** "Perhaps there is a design language that we include to indicate if things are facts, likely facts, likely true, broad generalizations. (Obviously we don't want a bunch of levels!)" Every item shown carries one of four levels, each with one visual mark used site-wide:

| Level | Means | Example |
|---|---|---|
| Checked | A public source with a date | "Nonprofit (IRS listing)" |
| Likely | What a shop says about itself, map tags, or the model's reading of a page | "Likely consignment" |
| In general | True of most places of this kind, not checked for this one | "Thrift stores usually carry clothing and housewares" |
| Unknown | Nothing found | "Size unknown" |

What a shop says about itself may show as Likely: "we should be permissive with showing what a shop advertises about themselves, except for certain things which we deem to require an external source." Certifications and findings stay Checked only. Which other claims need an outside source: TBD, the owner to fill. A Likely or In general item never changes a score ([ranking.md](ranking.md#negative-findings-down-ranking-policy)).

Today: the Amazon list is enforced by code that runs twice per search, with tests. How often an Amazon result slips through has never been counted.

### G4. Small enough for one person to keep (inferred)

Inferred from the owner's words: "simplicity is paramount. i want to build toward something with a good architecture." and "still experimenting with what is possible/useful/sustainable-for-me". Passes when: TBD, the owner to fill.

Today: one server program (a Cloudflare Worker), static pages, and data files in git ([architecture.md](architecture.md)). The free search credit covers about 250 searches a month ([costs.md](costs.md)).

### G5. Useful information without a data feed

The owner, 2026-11-17: "The site should include information dynamically. We can't purchase data feeds." When a search's product falls in a category that a kind of place usually carries ("if a search term meets any of a set of criteria (e.g. is_clothing==true), we could include thrift stores"), those places join the results. The first case is thrift stores: nearby ones appear with a short description (size, main goods, donation or consignment), each item marked with a level from G3, beside a general guide to what thrift stores usually carry. Tool libraries are a likely second case.

Since 2026-11-17, G5 is the means and its first cases serve G6: thrift stores are one kind of idea in the "before you buy" list, beside lending libraries and repair shops. Version one names no store (see G6), so the per-store description above waits for a later version.

Passes when: TBD, the owner to fill. Candidate: in a hand check of 20 thrift stores near 3 zip codes, at least 8 in 10 Likely items are right.

Today: not started. Thrift stores appear only when the search happens to find them; 28 saved results (1.3%) are resale ([ethics-data-strategies.md](ethics-data-strategies.md), ES5).

### G6. Ideas for not buying new

Serves V0. For products where borrowing, repair or buying used is sound advice, a "before you buy" list offers ideas that may apply (lend, repair, used), apart from the ranked shops. The owner, 2026-11-17: version one names kinds of place only, one sourced sentence per kind (for example "tool libraries often lend drills"), with no named place and no extra search call. Inferred: each statement about a kind of place carries a G3 level, usually In general; a named place, when a later version adds one, is a statement about that place and carries its own level.

Passes when: TBD, the owner to fill. Candidates from [goals-vision-review.md](goals-vision-review.md#4-measuring-success): the idea fits the product and stays away from goods where used is bad advice, such as helmets and car seats (MS-1), and purchases avoided in the ten-purchase log (MS-4).

Today: not started. The 2026-11-15 shelving of used and repair options (ES5) was lifted for borrow, repair and used on 2026-11-17. The extra paid place search (ED11) stays shelved while version one names no place. The draft [thrift store pilot](plans/thrift-store-pilot.md) is to be rescoped as one case of this list.

## 3. Upcoming work

Work is done in the order listed: the top item whose next step is not waiting on something is next. Every item names the goal or vision line it serves; work that cannot name one goes under "No goal named" until the owner rules on it. The owner orders the list. An agent adds a new item at the bottom with a proposed position, and moves a finished item to "Done" in [STATUS.md](STATUS.md#done). Decisions the owner owes are listed in [STATUS.md](STATUS.md#decisions-needed).

Sizes are estimates.

### Ordered by the owner

| Order | Work | Serves | Size | Next step | Waits on |
|---|---|---|---|---|---|
| 1 | **Before you buy, version one.** Ideas for borrow, repair and used with no place named, starting from the draft [thrift store pilot](plans/thrift-store-pilot.md). The owner, 2026-11-17: "thrift store pilot should be #1 priority, but a soon to be performed re-review will define what that work is" | V0, G6, G5, G3 | Not estimated | The re-review, which defines the work | The re-review |
| 2 | **Ten-purchase log.** The owner uses the site for their next ten real purchases beside their usual tool, one log line each | G1a | Small, the owner's | The owner's first logged purchase | Owner |
| 3 | **A page per company in the record book**, and a box to look one up by name | G1c, G3: a record can be read and disputed without running a search | Days | Design the page once the pilot's claims are signed | The record book pilot, unscheduled 2026-11-17 ([STATUS.md](STATUS.md#shelved-2026-11-15)) |
| 4 | **Order results by match and distance**, with the browser joining each shop to its record | G4: the search only finds shops, and a data change ships with a site push alone | Days | Wait for the ruling | The owner's ruling on whether ethics and environment leave the default order ([decisions needed](STATUS.md#decisions-needed)), and the record book pilot (unscheduled) |
| 5 | **Consumer co-ops as a recorded fact.** Worker co-ops score today, consumer co-ops such as REI do not | V1 | Small | Propose how co-op ownership is shown, with sources, beside the record book's ownership facts | The owner's ruling on the proposal |

### Inferred, not yet ordered by the owner

| Proposed position | Work | Serves | Size | Next step | Waits on |
|---|---|---|---|---|---|
| After 2 | **Name the three missing targets**: the target share of nearby shops graded good (G1d), the share of searches that counts as "most" (G2), and what G4 passes on | G1d, G2, G4 | Small, the owner's | The owner fills them in section 2 | Owner |
| After 3 | **Show first results within about 2 seconds.** Candidates: send online shops before nearby ones, or show live steps while the search runs ([ideas.md](ideas.md), "Live search progress") | G2 | Large | Propose a design and what it would cost in model calls | Nothing |
| After 3 | **Links on each shop to check its public record yourself** ([ethics-data-strategies.md](ethics-data-strategies.md#5-strategies), "links to check a shop yourself") | G1c, G3 | Small | Test the links on 20 shops before any ship | The owner's choice: build now or after the 20-shop test |
| After 4 | **Grow the record book to the 99 most-seen shop websites**, ownership first. They are about half of saved results | G1c | Large: 26 to 30 hours of agent time | Decide from the results of the record book pilot and item 2 | The record book pilot (unscheduled) and item 2 both passing |
| After 4 | **Count Amazon results that slip through**, by a hand read of 50 saved results for Amazon-owned names missing from the blocklist and for sellers that ship through Amazon ([value-proposition-review.md](value-proposition-review.md), row R1) | G3 | Small: about half a day of page reading, no search calls | Pick the 50 results | The owner's ruling: this check was shelved on 2026-11-15 with the other value proposition decisions |

### No goal named

Each needs the owner to schedule it under a goal, shelve it or drop it.

| Work | State |
|---|---|
| A graded test of searches that make 3 paid search calls in place of 4 | Approved 2026-10-09, stalled after its first round ([STATUS.md](STATUS.md#in-flight)). It would cut cost per search, which G4 might cover once G4 has a measure |
| A test of whether sending the shopper's location changes web results | Approved 2026-10-09, never started ([STATUS.md](STATUS.md#in-flight)) |
| Ideas not started: a price-level score, and free and near-transit options | [ideas.md](ideas.md). Used, lending-library and repair options moved to V0 and G6 on 2026-11-17 |
| Build the interface from the clickable prototype ([ui-prototype/README.md](ui-prototype/README.md)) | Put off by the owner on 2026-11-16 ("schedule building from this prototype for the future. 1mo?"). Revisit on or after 2026-12-16, a date the agent set from "1mo". First step then: the owner rules on the prototype's six decisions (UP1 to UP6), the first being whether the design is worth building while most results carry no checked fact. Size not estimated |

### Set aside

Shelved work and deferred outreach are listed in [STATUS.md](STATUS.md#shelved-2026-11-15), each with the ruling that would bring it back.
