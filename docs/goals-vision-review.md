# Review: the vision in goals.md against the owner's five aims

Status: DRAFT 2026-11-17. Written by one agent (Fable 5.2) from the repo alone, no web requests. Not reviewed by the owner. Nothing in `docs/goals.md` or the code was changed. Paths are relative to `/Users/brandon/dev/ai/nottheriver`.

The owner's message of 2026-11-17, the subject of this review:

> "when evaluating implementation it is logical to measure our ability to reliably rank and our confidence that a shop will actually have the item being searched for. I think an aspect of the project vision is unexpressed, deprioritized, or misunderstood. the core idea is providing ways to help people buy from better companies, support local businesses, drive less, defund amazon monopoly and buy less stuff (that last one was probably never expressed). So, diverting someone to a tool lending library, a tool repair shop, a used tools shop are all fantastic ways to support the vision. these results in a query to not trump all other factors, but they need to be expressed as first class priorities. discuss"

Two rulings from the owner arrived while this review was being written, relayed by the lead agent the same day. This review treats both as settled:

| Label | Ruling, in the words relayed |
|---|---|
| RUL-1 | "buy used/less should rank above 'from better companies'" in the vision's order of priority |
| RUL-2 | The owner likes a separate "before you buy" list, apart from the ranked shop list, "because it's easier to characterize those results as 'ideas that may apply'" |

## 1. Answer

- **The owner is mostly right.** Of the five aims, `docs/goals.md` states one in full (better companies), keeps one as a rule with its reason left out (Amazon), puts one second by the owner's own earlier answer (local businesses), and never states two (drive less, buy less).
- **"Buy less" appears as an aim nowhere in the repo.** A search of the `.md`, `.html` and `.ts` files found the idea only in agent-written strategy names ("Before you buy new", "reuse first") and in one owner idea filed as "Breadth" (`docs/ideas.md:11`). It was shelved on 2026-11-15 and came back two days later as a data mechanism (goal G5, useful information without a data feed).
- **The thrift store spec's narrow framing likely follows from the wording of the goals file.** Its refusal to say a store "likely" has the item would hold under any vision, because no source for a thrift store's stock was found.
- **With RUL-1 and RUL-2 the shape is set:** buy less goes first in the vision, and it shows as a separate list of ideas with no score. Section 3 says what that list can honestly claim; section 6 gives the wording.
- **Pushback:** the order of work now contradicts the vision's order (four of the five ordered items serve "better companies"), "ideas that may apply" does not excuse a wrong address, and the cheapest honest first version names no place at all.

## 2. Where each aim stands

How the vision sentence came to read as it does: the owner's words on 2026-11-15 were "public resource that makes it easier to shop on smaller and more ethical companies that are nearby" (`docs/STATUS.md:131`). The goals file prints an agent's rewording, "more ethical companies nearby, smaller ones included" (`docs/goals.md:7`), with no quote marks. The rewording follows the owner's answer that day, recorded in the lead agent's summary, that a company's record comes first and its size second (`docs/STATUS.md:131`). The vision rows V1 to V3 are unchanged since that first commit (`git log -p -- docs/goals.md`, five commits).

Aims are listed in the order RUL-1 implies: buy less first, better companies second. The owner has not ordered the other three.

| Label | Aim | In goals.md | In site copy | In scoring and plans | Verdict |
|---|---|---|---|---|---|
| AIM-1 | Buy less (borrow, repair, buy used) | Not stated. Thrift stores appear in G5 as a case of "information without a data feed" (`docs/goals.md:64-70`). Lending-library, used and free options sit under "No goal named" (`:107`) | Not stated | The strategy "used and repair options first" (ES5) is shelved (`docs/STATUS.md:74`). The "reuse first" product shape is shelved with the value proposition decisions (`docs/value-proposition-review.md:95`, `docs/STATUS.md:73`). The thrift pilot sits last in the proposed order (`docs/goals.md:97`) | Never expressed, and now first by RUL-1. The largest gap in the file |
| AIM-2 | Better companies | The vision sentence and V1, record first, size second (`docs/goals.md:7`, `:11`); the checks on records, G1b and G1c (`:24-25`) | "Who you buy from matters." (`index.html:26`) | 60% of the score (`docs/ranking.md:29`); the top item in the order of work (`docs/goals.md:82`) | Expressed, and treated as first everywhere. 27% of saved results carry a fact (`docs/goals.md:25`) |
| AIM-3 | Support local businesses | "nearby, smaller ones included"; V1 puts size second (`docs/goals.md:7`, `:11`) | "shops near you and online retailers" (`about.html:26`); nothing on local or independent as a value | Independent or chain is a badge with no score effect (`docs/caching-and-store-types.md:92`, `docs/STATUS.md:196`). Whether nearby search should favor independents is open (`docs/STATUS.md:146`) | Placed below AIM-2 by the owner's answer of 2026-11-15. "Local" and "small" are blurred: a nearby chain store counts as nearby |
| AIM-4 | Drive less | Not stated. The check on the nearby list (G1d) grades whether shops sell the item, with no regard to miles (`docs/goals.md:26`) | Not stated | Distance is 15% of the score, the smallest weight (`docs/ranking.md:29`). An online shop gets a fixed 0.5, the same as a nearby shop about 12 miles away (`docs/ranking.md:76`). "Near transit" sits in the ideas list (`docs/ideas.md:11`) | Missing as an aim; present as a sort key |
| AIM-5 | Defund the Amazon monopoly | The Amazon rule is a promise under G3, what the site says can be checked (`docs/goals.md:40`). V2 calls it "one promise among several" (`:12`) | The headline, "If not Amazon, who?" (`index.html:25`); "Why Amazon never appears" explains how, and gives no reason (`about.html:28-30`) | Enforced twice per search with tests (`docs/goals.md:56`). The count of Amazon results that slip through is shelved (`docs/goals.md:96`) | The rule is kept; the reason is unwritten. "Monopoly", "defund" and "antitrust" appear in no file under `docs/`, `src/`, the two pages or `README.md` |

### Is the thrift spec's framing from the vision or from the wording?

The draft spec is `docs/plans/thrift-store-pilot.md`; line numbers below are its own unless a path is given.

| Label | The spec's choice | Rests on | Stands after RUL-1 and RUL-2? |
|---|---|---|---|
| SPEC-1 | No step says "this store likely carries it" (`:13`, `:323`) | No source of any kind for a thrift store's stock today (`:58`) | Yes. A stronger vision does not create the data |
| SPEC-2 | No "Likely" word on a store row (`:40`) | "Likely" already means "likely sells it" on the same screen, and nobody has graded what a "thrift store" place search returns (the critique's points CRIT-2 and CRIT-9, `handoff/thrift-pilot-spec/31-adversarial-critique.md:22`, `:29`) | Yes, until that search is graded |
| SPEC-3 | Rows carry no score, in a block of their own | "A Likely or In general item never changes a score" (`docs/goals.md:54`) | Yes. RUL-2 asks for the same thing |
| SPEC-4 | Thrift stores serve G5 (`:1`) | The goals file's wording of G5, built on the owner's quote about a trigger rule (`docs/goals.md:66`) | No. The mechanism now serves the first aim in the vision |
| SPEC-5 | The block sits after the ranked nearby shops; the spec itself notes "position is a value statement nobody has recorded" (`:44`, `:333`) | No ruling existed | Reopened. RUL-1 is that value statement; where the list sits is question OQ-2 below |
| SPEC-6 | Lift the 2026-11-15 shelving "for thrift only" (`:320`) | The shelving row (`docs/STATUS.md:74`) | No. The owner's message names a lending library and a repair shop first |
| SPEC-7 | Clothing searches only (`:41`, `:322`) | The owner's "is_clothing" example (`docs/goals.md:66`) | Partly. The message's examples are all tools |
| SPEC-8 | No pass mark proposed. The spec notes the goals file's candidate (8 in 10 Likely items right, `docs/goals.md:68`) "has nothing to grade" in its design (`:321`) | G5's wording | No. A mark for the first aim should ask whether a purchase was avoided (section 4) |
| SPEC-9 | Build order "After 5" (`docs/goals.md:97`, `:324`) | An agent's proposal the owner has not ruled on | No. See tension TEN-1 |

The design agents were told to cover G3 and G5 "broadly; thrift stores as the narrow proof of concept" (`handoff/2026-11-17-thrift-pilot-spec.md:4`). They answered the goals file as written. The spec's first step, a one-sentence idea that names no store (`:24`), is close to what RUL-2 describes.

## 3. The "before you buy" list

RUL-2 picks the first of three framings this review weighed. The other two are kept for the record.

| Label | Framing | For | Against | State |
|---|---|---|---|---|
| FR-1 | A separate "before you buy" list of ideas, apart from the ranked shops, with no score | States the priority through its place on the page and touches no score, so the rule at `docs/goals.md:54` stands. "None found nearby" is a real answer (`docs/ethics-data-strategies.md:183`). Two earlier strategies drew this shape (`docs/ethics-data-strategies.md:178`, `docs/evidence/ethics-data/p3-strategies-fable.md:112-114`) | A list shown first reads as "the better choice" beside a record line that says unknown. Needs a list of goods to keep out (helmets, car seats, `docs/ethics-data-strategies.md:185`). Naming places costs a search call per kind of place | Chosen (RUL-2) |
| FR-2 | A scoring factor: lending, repair and used places join the ranked list with a bonus | One list, one order | Breaks `docs/goals.md:54`: a place's kind comes from map tags or a model reading, both Likely (`:50`). Changes the score weights while the ruling on taking ethics out of the default order is open (`docs/STATUS.md:156`). Puts a place to borrow a drill and a place to buy one in one column | Not chosen |
| FR-3 | A goal of its own, with its own measures; G5 becomes the means | The next spec is judged on purchases avoided. Lending and repair enter without posing as shops | A sixth goal for one person. G2, G4 and G5 have no pass mark and G1d has no target (`docs/goals.md:26`, `:34`, `:60`, `:68`) | Recommended alongside FR-1 |

### What "ideas that may apply" can and cannot cover

An idea is a suggestion, and it still contains statements. G3 says every item shown carries one of four levels (`docs/goals.md:45`). Taken apart:

| Label | Part of an idea | Example | Level under G3 | Cost |
|---|---|---|---|---|
| IDEA-1 | The suggestion | "Before you buy: you may be able to borrow one." | None needed; it claims nothing | A word list in the site, no search call |
| IDEA-2 | What this kind of place usually offers | "Tool libraries usually lend power tools." | In general, with a source for the sentence | One sourced sentence per kind |
| IDEA-3 | A named place of that kind, with miles | "A tool library, 2.1 mi" | A statement that the place exists and is that kind. Unknown or bare provenance until the place search is graded; Likely after | One search call per kind, per search |
| IDEA-4 | Whether this place has or lends the item today | | Unknown, said once | No source found for thrift stock (`docs/plans/thrift-store-pilot.md:58`). Not checked for lending libraries or repair shops |

- **The heading "ideas that may apply" covers IDEA-1 and IDEA-2 well.** It does not cover IDEA-3: a closed or misnamed place costs a trip, which works against the drive-less aim. Open map rows were found at their address in 101 of 300 checks (`docs/STATUS.md:38`).
- **Version one can stop at IDEA-2.** It names no place, uses no search call and needs no Worker change. This is the spec's step PH-1b (`docs/plans/thrift-store-pilot.md:24`), widened from thrift to borrow and repair.
- **"Ideas" must not become a way around G3.** Suggested rule: the heading sets the tone, and each statement inside still carries its level.
- **A separate reuse page from open map data** (shape S3, `docs/value-proposition/different-product.md:84-102`) is another source for IDEA-3 with no search call, at the reliability just cited.

## 4. Measuring success

The owner's two measures, and where they fit:

| Label | Kind of result | "Ranks reliably" | "Will have the item" |
|---|---|---|---|
| FIT-1 | A shop selling new | Fits. `docs/goals.md` has no check on order at all. The nearest figure: of the shops in the nearby top 3, 36 of 51 and 36 of 52 were graded good in two runs (`docs/value-proposition-review.md:43`) | Fits. Check G1d: 71% of graded nearby shops good (`docs/goals.md:26`). Stock at the store was never checked (`docs/value-proposition-review.md:43`) |
| FIT-2 | A used or thrift store | No rank exists in an unscored list; only miles | Poor fit. Stock changes and no source was found. The fair question: does this kind of place usually carry this kind of thing |
| FIT-3 | A lending library | Same | Changes meaning: lends this kind of tool, and to whom (membership, service area). Not checked |
| FIT-4 | A repair shop | Same | Does not apply: the shopper already owns the item. The question: repairs this kind of thing |

The two measures stay right for the ranked lists, and the first has no check in the goals file today. Applied to the ideas list they would score a useful idea as a failure. Two existing checks share the problem: G1c (half of results carry a checked fact) falls when rows with no record are added, and G1d grades "sells the product", which a repair shop cannot pass.

Proposed measures. Every target is "TBD, the owner to fill".

| Label | Measure | Serves | How it is taken | Limit |
|---|---|---|---|---|
| MS-1 | The idea fits: it shows for goods where borrowing, repair or used is sound advice, and stays away otherwise | AIM-1, G3 | Hand grade over the 20 test products | The keep-out list is mostly agents' judgment today (`handoff/thrift-pilot-spec/31-adversarial-critique.md`, CRIT-12) |
| MS-2 | The place is real: it exists and is the kind stated | AIM-1, AIM-4, G3 | Hand check of the nearest places per test zip code. An earlier proposal set 8 in 10 (`docs/value-proposition/different-product.md:102`) | Only once places are named |
| MS-3 | Coverage: the share of fitting searches with at least one such place within the nearby distance (10 miles, or 30 outside metropolitan areas) | AIM-1, AIM-4 | The same hand check | Only once places are named |
| MS-4 | Purchases avoided: of the owner's logged purchases, how many ended as borrowed, repaired, bought used or not bought | AIM-1 | One more field on each line of the ten-purchase log (`docs/goals.md:23`, `:83`) | One person, ten purchases. The site has no analytics (`about.html:26`), so no other count is possible |
| MS-5 | Miles to the place chosen, per logged purchase | AIM-4 | The same log | The same limit |
| MS-6 | A check on order for the ranked lists, since the owner names ranking as a measure | AIM-2 | TBD. Candidate: a set share of nearby top 3 shops graded good | Order by record is not gradable while most records are unknown |
| MS-7 | Amazon results that slip through | AIM-5 | The shelved hand read of 50 results (`docs/goals.md:96`) | Measures the rule. The site can count no effect on Amazon |

MS-4 is the one measure of the first aim itself.

## 5. Tensions and pushback

| Label | Tension | Detail |
|---|---|---|
| TEN-1 | The order of work contradicts RUL-1 | Items 1, 3, 4 and 5 of the owner's order serve "better companies" (`docs/goals.md:82-86`); the only buy-less work sits last in the agents' proposed list (`:97`). Item 1, the record book, is deferred. If buy less ranks first, either the order of work changes or the vision's order is about values only. The owner should say which |
| TEN-2 | RUL-1 against "not trump all other factors" | The same day's message says these results should not trump other factors. Both hold only if "rank above" means the vision's order and the page's layout, never the score of a shop. Section 6 words it that way; the owner should confirm |
| TEN-3 | "Ideas that may apply" against G3 | Section 3. A named place is a statement, whatever the heading says. Version one with no place named avoids the problem |
| TEN-4 | The trigger list | Which searches get which idea is a hand-kept list: goods where used is sound, goods to keep out, goods worth repairing, goods a library lends. The thrift spec has sources for helmets and car seats only (CRIT-12). A list that misses an unsafe item shows the idea anyway. Each kind of idea adds a list for one person to keep (G4) |
| TEN-5 | Cost against the search-call cap | A search uses up to 5 of the 6 allowed search calls (`docs/ethics-data-strategies.md:185`). Naming places for three kinds (lend, repair, used) needs three more calls, or one combined query nobody has tested. One extra call on every search would take the free credit from about 250 searches a month to about 200 (`docs/plans/thrift-store-pilot.md:171`). No open US repair directory was found (`docs/ethics-data-strategies.md:179`), and the one tool-library map the spec opened calls itself incomplete (`docs/plans/thrift-store-pilot.md:176`) |
| TEN-6 | The aims still pull against each other | Borrowing a drill is a sale a local hardware shop did not make (AIM-1 against AIM-3). A thrift store 9 miles away against a new one a mile away (AIM-1 against AIM-4). RUL-1 settles AIM-1 over AIM-2; the other three are unordered. Suggested: the site shows the choices and the shopper picks |
| TEN-7 | Used first, with the record unknown | A used-goods chain has a record like any company. Putting used first must not hide it: the idea list should carry the same record line as any shop when a place is named (the critique's point CRIT-3, records are lost). The claim that reuse beats buying new also has no source in the repo; one strategy file marks it "to be checked" (`docs/evidence/ethics-data/p3-strategies-fable.md:115`) |
| TEN-8 | The owner's earlier words produced part of the narrow reading | Record first, size second on 2026-11-15 (`docs/STATUS.md:131`). Thrift stores introduced through a data rule on 2026-11-17 (`docs/goals.md:66`). Lending and used ideas recorded as "Breadth" (`docs/ideas.md:11`). "Unexpressed" explains more than "misunderstood" |
| TEN-9 | "Support local businesses" against V1 | If local or independent is meant to change order, V1 and the badge-only ruling (`docs/caching-and-store-types.md:92`) need a second look. This review does not recommend reversing them: a small shop with no record is still unknown |
| TEN-10 | Speed (G2) | Already missed: medians of 2.9 and 3.3 seconds against about 2 (`docs/goals.md:34`). Version one adds no call. Later calls would run beside the others (`docs/plans/thrift-store-pilot.md:72`); the added time is unmeasured |
| TEN-11 | Direction changes | 2026-11-15: record book first, used and repair shelved. 2026-11-16: record book deferred. 2026-11-17: G5, then this reordering. The top two items in the order of work are deferred or not started (`docs/goals.md:82-83`). The cheapest test of the new first aim is the ten-purchase log with MS-4 added, which needs no build |
| TEN-12 | "Buy less" on a shopping site | A visitor arrives meaning to buy. "Before you buy" is the honest size of the aim here: an offer at the right moment for durable goods. It does not fit consumables or safety gear, so most searches will likely show no idea |
| TEN-13 | "Defund the Amazon monopoly" against V2 | On 2026-11-15 the owner said the site "hopes to be broader than" quitting Amazon (`docs/goals.md:12`). Both can hold: the reason goes in the vision and the scope stays broad. It can be a stated reason and never a check |

## 6. Proposed edits to goals.md (not applied)

Wording marked "inferred" is this agent's and needs the owner's ruling, following the rule at `docs/goals.md:3`. RUL-1 and RUL-2 reached this agent secondhand, so the owner should confirm the quoted words before they go in the file.

| Label | Where | Suggested wording |
|---|---|---|
| GW-1 | Under the vision sentence, `docs/goals.md:7` | The owner, 2026-11-17: "the core idea is providing ways to help people buy from better companies, support local businesses, drive less, defund amazon monopoly and buy less stuff". Order of priority, the owner the same day: "buy used/less should rank above 'from better companies'". The order of the other three: TBD, the owner to fill. Whether the bold sentence itself changes: TBD, the owner to write |
| GW-2 | New first vision row | "V0, before buying new. 'diverting someone to a tool lending library, a tool repair shop, a used tools shop are all fantastic ways to support the vision.' (the owner, 2026-11-17). Borrowing, repairing and buying used come first among the site's aims. They show as a separate 'before you buy' list of 'ideas that may apply', apart from the ranked shops. Inferred: the list carries no score and never changes the order of the shops ('these results in a query to not trump all other factors')." |
| GW-3 | V1, `docs/goals.md:11` | Add: "Among places that sell, the aim is the better company. The owner named 'support local businesses' as an aim on 2026-11-17; whether that changes 'size second': TBD, the owner to rule." |
| GW-4 | V2, `docs/goals.md:12` | Add the reason in the owner's words, "defund amazon monopoly" (2026-11-17), beside the existing quote |
| GW-5 | New vision row (inferred) | "Nearer is better. Fewer miles driven is an aim as well as a sort key." How an online order compares with a drive: TBD, the owner to fill |
| GW-6 | New goal G6 (inferred) | "G6. The site offers ideas for not buying new. For products where borrowing, repair or used is sound advice, a 'before you buy' list gives ideas that may apply. Each statement inside an idea carries a level from G3; a named place is a statement. Passes when: TBD, the owner to fill. Candidates: the idea fits, the place is real, and purchases avoided in the owner's log (MS-1, MS-2 and MS-4 in `docs/goals-vision-review.md`). Today: not started." |
| GW-7 | G5, `docs/goals.md:66` | Add: "G5 is the means; its first cases serve G6." Name repair shops beside tool libraries |
| GW-8 | G3, after the levels table, `docs/goals.md:52` | Add (inferred): "A suggestion that claims nothing ('you may be able to borrow one') needs no level. Anything it says about a kind of place or a named place does." |
| GW-9 | G1a, `docs/goals.md:23` | Add to each log line: how the purchase ended (bought new, bought used, borrowed, repaired, not bought) and miles to the place |
| GW-10 | G1c and G1d, `docs/goals.md:25-26` | Add (inferred): "Rows in the 'before you buy' list are not counted here." |
| GW-11 | Upcoming work, `docs/goals.md:97`, `:107` | Rename the pilot row "Before you buy, version one: ideas with no place named, for borrow, repair and used", serving V0 and G6. Its position: the owner to rule (TEN-1). Move lending-library, used and free options out of "No goal named" |

Site copy is left alone. "Who you buy from matters." (`index.html:26`) speaks to the second aim only; a line for buying less is a headline change and needs its own copy and design check.

### Earlier decisions the owner would need to revisit

| Label | Decision | Where | Why |
|---|---|---|---|
| REV-1 | The 2026-11-15 shelving of "used and repair options first" (strategy ES5) and of its extra paid search (decision ED11) | `docs/STATUS.md:74`, `docs/ethics-data-strategies.md:364` | Shelved as "new features ... before the record is shown to work". RUL-1 puts it ahead of the record. Lift it for borrow, repair and used together; the paid search can stay shelved while no place is named |
| REV-2 | The order of work | `docs/goals.md:78-97` | TEN-1 |
| REV-3 | The thrift pilot spec, still an unapproved draft | `docs/plans/thrift-store-pilot.md` | Keep its hand check and its honesty limits (SPEC-1 to SPEC-3). Redo its scope (thrift only, clothing only), its goal (G5), its block position and its pass mark (its decisions TD-1, TD-2, TD-5, TD-8, `:320-333`) |
| REV-4 | The shelving of the "reuse first" shape (row R24) with the value proposition decisions | `docs/STATUS.md:73`, `docs/value-proposition-review.md:95` | Its hand test with no search calls is the cheapest way to learn whether such places can be found |
| REV-5 | Record first, size second, and independent or chain as a badge only | `docs/STATUS.md:131`, `docs/caching-and-store-types.md:92` | Only if "support local businesses" is meant to change order |
| REV-6 | The open ruling on taking ethics and environment out of the default order (OD2) | `docs/STATUS.md:156` | With better companies now second, 60% of the score still rests on it |

### Questions for the owner

| Label | Question | Suggested answer |
|---|---|---|
| OQ-1 | Does "rank above" mean the vision's order and the page layout only, never a shop's score? | Yes |
| OQ-2 | Where does the "before you buy" list sit: above the ranked shops, or beside them? | Above, and absent when no idea fits |
| OQ-3 | May version one name no place (ideas and one sourced sentence per kind)? | Yes; name places only after a hand check of place data passes |
| OQ-4 | Does the order of work change so buy-less work comes ahead of the record book? | Add MS-4 and MS-5 to the ten-purchase log now and build version one next; leave the record book deferred |
| OQ-5 | Is "support local businesses" about nearby, about independent, or both, and where do it, drive less and Amazon sit in the order? | TBD, the owner to fill |

## 7. What was not checked

- No web page was opened. Nothing about what lending libraries, repair shops or thrift stores publish was verified.
- RUL-1 and RUL-2 are quoted as relayed by the lead agent; this agent did not see the owner's message.
- "Never stated" rests on case-insensitive searches. For "monopol", "defund" and "antitrust": `docs/`, `src/`, `index.html`, `about.html` and `README.md`, with "amazon" as a control. For "buy less", "buying less", "consume less", "less stuff", "before you buy", "drive less", "driving", "trip" and "transit": the repo's `.md` and `.html` files, with "thrift" as a control (53 files). Other wordings could have been missed, and conversations that never reached a file were not available.
- The thrift spec was read at lines 1 to 75, section 3 and section 9. Its critique was read with each table row cut at about 600 characters; its vision lens with rows cut at 800. `docs/value-proposition/first-visit.md`, `position.md` and `promise-vs-measured.md` were searched only.
- "About 12 miles" in AIM-4 is this agent's arithmetic from the formula at `docs/ranking.md:76` (a score of 0.5 at 20 km).
- Line numbers were checked for the thrift spec and `docs/ethics-data-strategies.md` citations; the others were taken from the search output that found them.
