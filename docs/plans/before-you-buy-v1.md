# Draft spec: Before you buy, version one (V0, G6, G5, G3)

Status: DRAFT 2026-11-17. Written by agents in one design workflow. Not reviewed or approved by the owner. Nothing here is built.

Supersedes: docs/plans/thrift-store-pilot.md, which is left as it was. Section 8 says what carries over.

Working files: `/Users/brandon/dev/ai/nottheriver/handoff/before-you-buy-spec/`. Triage of the earlier run: `/Users/brandon/dev/ai/nottheriver/handoff/before-you-buy-spec/00-triage.md`.

How to read the citations. Paths are relative to `/Users/brandon/dev/ai/nottheriver`. "BYB" is `handoff/before-you-buy-spec/`, "OLD" is `handoff/thrift-pilot-spec/`. "Research 01" to "research 04" and "research 06" (no file 05 exists) and "lens 11" to "lens 14" are the files of those numbers in BYB. "The critique" is `BYB/31-adversarial-critique.md`, "the walk-through" is `BYB/32-list-walk-through.md`, "the claim check" is `BYB/33-claim-check.md`, "the rerun" is `BYB/41-final-rules-rerun.py` with its output `BYB/41-final-rules-rerun.out.txt`. A label from another file is written with its file ("lens 12 ROW-1"), because the same label names different rows in different files. Labels with no file are this spec's own. Line numbers for `docs/goals.md` and `docs/STATUS.md` were read today, after commit 456eb02. G3 is marked "inferred" in `docs/goals.md:49`. The owner's own words there are a quote asking for a design language (`docs/goals.md:58`); the four level names, the meaning "most" (`:64`) and G6's "usually In general" (`:89`) are an agent's wording the owner has not ruled on.

## 1. Answer

- **Recommended:** three kinds of place, one fixed sentence each (tool library, repair café, thrift store), shown as an unscored "Before you buy" list when the last words of the shopper's typed product match a hand-kept table of 8 product groups, and never when a keep-out word appears. The browser decides from the search response it already has: no Worker change, no search call, no model call, a site push alone. Today two of the three sentences have sources that pass one stated bar (BD-1, the source bar); the thrift sentence does not.
- **Changed from the working draft, after the critique (section 11):** three kinds where the draft had five; "often" is back in every sentence; source names are off the face of the list, behind one "Sources" button; a row word must end the typed product; a research step and the fail bar come before any code; and the first build is the collapsed line at every width, with "beside" to follow. That last change departs from the placement ruling for one stage, so it is the owner's decision (BD-10, the first build).
- **Smallest first step (shows a shopper nothing):** desk research (PH-R, source research): read the pages the bar needs: thrift stores, one page with no Amazon store link plus a second organization (RT-9); used tool shops, two pages from two organizations; repair shops, one more page that names tool repair (RT-2). Then the owner reads the sentences and signs the table (PH-0, the owner's read and sign-off). No code.
- **Left for later:** any named place, any link to a directory or map search for a kind (ALT-3, BD-13), a caution for goods that are fine only after a check (used furniture, used power tools), and a score boost for used and repair shops. The Sources panel links to each source page (STR-4, BD-9).
- **Where it falls short of the owner's own example:** a drill search shows borrow and repair and no used idea, and the repair idea names a repair café where the owner's sentence names "a tool repair shop" (`docs/goals.md:23`). Used tool shops have no page read for that kind, and repair shops have one; the bar asks for two organizations.
- **Biggest doubt:** whether a sentence that names a kind of place and no place changes any purchase. No tool found does this (research 06, "Answer"), the owner's read before the build is a weak test because the owner proposed these kinds, and the list shows for 2 of the 20 test products today, 3 once the thrift sentence has a source (`BYB/41-final-rules-rerun.out.txt:24`, `:47`).

## 2. Recommended version one

### Where the lenses disagreed

"Changed" marks an outcome the final writer changed after the critique.

| Label | Disagreement | Sides | Outcome |
|---|---|---|---|
| DIS-1 | Which fields may show an idea | Lens 12 (section 2e): the typed product and the model's canonical name. Lens 14 (REC-1): the typed product only; the model's name and category can only hide | Lens 14. The saved data cannot separate them: the two fields are equal in 1,101 of 1,101 saved responses (`BYB/12-count-match-fields.out.txt:20`). With no evidence, the rule that can only hide on a model misreading wins. Loser kept as ALT-5 (the model's name) with its revisit test (RT-4, what the model returns for odd inputs) |
| DIS-2 | Shape of the keep-out list | Lens 12 (2d): one list for all three ideas. Lens 14 (2c): per idea, each cell with its own basis | Changed. One short list of words that can collide with a row, hiding all three ideas, and a watch list for the rest (section 2b). The file records the basis per idea (lens 14), because the one "never" quote for car seats covers resale only (research 04 SA-6) |
| DIS-3 | The level of a kind sentence | Lens 11 (OWD-1): keep G3's "most", or attribute the sentence and mark it Checked. Lens 12 (2b notes): In general, no frequency word. Lens 13 (POD-3): In general even for "some", and reword G3 | Changed. Each sentence carries "often", the word of the goals file's own example ("tool libraries often lend drills", `docs/goals.md:89`), at level In general, and G3 is not reworded. On today's counts no sentence is shown to meet G3's "most" (`docs/goals.md:64`): power tools are named by 3 of the 4 tool-lending pages that name kinds (lens 12 PLACE-1) and by 5 of all 11 lender pages (research 01 KIND-2). The owner accepts or refuses that stretch in BD-2 (the level and the hedge) |
| DIS-4 | Sources on the face of an entry | Lens 13 (ENT-3): exactly one. Lens 14 (2c): the file holds a list. Lens 12's borrow sentence rests on four pages | Changed. No source name on the face. One "Sources" button opens every source the file holds, with its read date (section 2c). BD-9 (a source's name) |
| DIS-5 | A drill's used idea | Lens 13's example (EXS-1) shows an EPA line. Lens 12 (ROW-1) and lens 11 (OWD-2) show nothing | Nothing. The EPA line names no kind of place, one of the owner's four fixed points. Kept as ALT-4 (the EPA line) and BD-4 (the drill example) |
| DIS-6 | Five kinds or three | Lens 12 picks five and calls three a "close second" (ALTC-4); lens 11 (APP-2) names the same five | Changed. Three; the other two are sourced and held. BD-5 (how many kinds) |
| DIS-7 | Does the list survive a sort or filter change | Lens 13 (ST-6): yes, it sits outside what is rebuilt. Lens 14 (REC-4): everything is rebuilt, so carry the state | The code settles it for lens 13: `renderResults` replaces the children of the element it is given (`src/render.ts:491`), and that element is `#result-sections` (`src/main.ts:22`, `:83`). A list placed in `#results` outside it (`index.html:56-57`) is untouched |
| DIS-8 | The words of the bare suggestion | Lens 13: "Borrow one.", "Repair yours.", "Buy used." Lens 12: "Borrow it", "Repair the one you have", "Buy it used" | Lens 12. "The one you have" says who the repair idea is for (research 02 REP-D) |
| DIS-9 | Children's goods | Lens 12 keeps out children's clothing on a CPSC basis and the words "baby", "infant", "toddler", "nursery", yet its own test list expects "kids bike" to show the repair idea (`BYB/12-count-match-fields.out.txt:106`) | Changed. Kept out of every idea by keep-out words, until the owner rules (BD-8, children's goods) |
| DIS-10 | What a table row rests on, and who writes the expected results | Lens 14 (OW-2, OW-4): every row on the owner's basis, and the expected table written before the match words exist. Lens 12 gives each show cell a source basis and has already written the table, the words and 38 probe strings | Both: a row records its source basis and ships only with the owner's sign-off. The table can no longer be written blind, so the owner corrects the draft and adds probe strings of their own before opening the match words (PH-0, the owner's read and sign-off) |

### 2a. The kinds and their sentences

**One source bar for every kind** (BAR-A, agent's judgment, no source; the owner rules in BD-1, the source bar). A kind's sentence may ship when (1) pages were read from at least two organizations that run, represent or regulate places of that kind, (2) every good the sentence names is on one of those pages, and (3) no page shown as a source links to an Amazon store. A page by an operator describing itself counts, nonprofit or for-profit, and is recorded as such.

| Label | Kind of place | Pages read | Under BAR-A |
|---|---|---|---|
| BARK-1 | Tool library | 4 operators: LA County Library, Denver Tool Library, Community Homeworks, Riverside Public Library (research 01 BOR-A) | Passes |
| BARK-2 | Repair café | The organizer's About and FAQ pages; the Open Repair Alliance's 2024 report; one café described on a Vermont state agency page (research 02 REP-A) | Passes |
| BARK-3 | Thrift store | One Goodwill region's donation page names the goods, and its menu links to its Amazon store (`OLD/pages/data-sources/goodwillng.org_ways-to-support_donate-goods_items-we-do-and-dont-accept.txt:67`, `:107`). A resale trade group's page says thrift stores are part of resale and that apparel leads (`OLD/pages/data-sources/www.narts.org_state-of-resale.txt:57`), and names "clothing, home goods, and accessories" as what shoppers link with secondhand buying (`:70`); it names no books or furniture, and its menu carries an "Amazon Picks" link (`:40`, `:44`) | Fails on (3) for both pages, which leaves no clean page for (1); the NARTS link is to a narts.org page named "Amazon Picks", and the bar treats that as an Amazon link (agent's judgment, no source). Needs one clean page (RT-9, a clean thrift page) |
| BARK-4 | Library of things | 4 public libraries (research 01, lenders LND-4 to LND-7) | Passes; held (BD-5, how many kinds) |
| BARK-5 | Building-material reuse center | EPA and Habitat for Humanity (research 03 USE-A) | Passes; held (BD-5) |
| BARK-6 | Used tool shop (the owner's example) | One pawn chain's page lists tools (research 03 USE-A); a pawn shop is a different kind of place | Fails on (1). Needs two pages (RT-2, pages on used tool shops and repair shops) |
| BARK-7 | Repair shop, the owner's "tool repair shop" included | One state agency's list of repair businesses, no tool repair on it (research 02 REP-A, SENT-4) | Fails on (1). Needs one more page, one that names tools (RT-2) |
| BARK-8 | Community bike shop, library book sale, used sporting goods store | One page each (research 03 USE-A) | Fail on (1); not in version one |

**The sentences.** Each is a fixed string of 20 words or fewer. The product's name is never put into a sentence. Level is In general (`docs/goals.md:64`), pending BD-2 (the level and the hedge). "Date checked" is the day the researchers read the page. Saved pages are under `BYB/pages/` unless OLD is written. The final writer reopened every cited line today except the Goodwill list at `:125-129`, which the claim check reopened.

| Label | Idea | Kind of place | Exact sentence | Level | Supporting passage (saved page:line) | Source URL | Date checked | Must not be read to promise | State |
|---|---|---|---|---|---|---|---|---|---|
| SEN-1 | Borrow | Tool library | "Tool libraries often lend hand and power tools; some are free with a library card, others charge a yearly membership." | In general | `borrow/communityhomeworks.org_programs_tool-library.txt:129` "hand tools, power tools, and outdoor equipment"; `borrow/denvertoollibrary.org_tool-library.txt:131` "Drills (power, impact, hammer)"; `borrow/lacountylibrary.org_tools.txt:105` "Borrow tools for free!"; `borrow/riversideca.gov_library_library-services_riverside-tool-lending-library.txt:102` "Borrow it for free with your library card"; fees in research 01 LIM-5 to LIM-8 | https://lacountylibrary.org/tools/ ; https://denvertoollibrary.org/tool-library ; https://communityhomeworks.org/programs/tool-library/ ; https://riversideca.gov/library/library-services/riverside-tool-lending-library | 2026-11-17 | One nearby; that it is free; open to renters or under-18s (research 01 LIM-1, LIM-8); power tools at every one (Riverside's page lists none); the tool on the shelf today | First set |
| SEN-3 | Repair | Repair café (a volunteer repair event) | "Repair cafés are free meeting places where volunteers often help fix clothes, furniture, bicycles, appliances, electronics and power tools." | In general | `repair/www.repaircafe.org_en_about.txt:36` "Repair Cafés are free meeting places ... On clothes, furniture, electrical appliances, bicycles, crockery, appliances, toys, et cetera. You’ll also find expert volunteers"; `repair/openrepair.org_open-data_insights_2024-report.txt:43` "7 years for example for coffee makers, laptops and printers, 10 years on average for hair dryers and power tools" (products seen at community repair events); `repair/dec.vermont.gov_waste-management_solid_materials-mgmt_how-can-i-waste-less_reusevt.txt:225`, one café on a state agency's page: "Computers, clothes, appliances, tools, furniture, bikes" | https://www.repaircafe.org/en/about/ ; https://openrepair.org/open-data/insights/2024-report/ ; https://dec.vermont.gov/waste-management/solid/materials-mgmt/how-can-i-waste-less/reusevt | 2026-11-17 | One nearby or open this week; that the item gets fixed (53% fixed and 25% deemed end of life at community repair events, same report `:42`; research 02 SENT-2 says the data cover electrical and electronic items); a repair service (the organizer's FAQ, `repair/www.repaircafe.org_en_faq.txt:55`). The first source is the organizer describing itself. "Electronics" and "power tools" rest on the report, which covers community repair events in general, and on one Vermont café that lists computers and tools; that the report's events include repair cafés is one step of inference (BD-4, the drill example) | First set |
| SEN-4 | Used | Thrift store | "Thrift stores often sell donated clothing, housewares, books and furniture." | In general | `OLD/pages/data-sources/goodwillng.org_ways-to-support_donate-goods_items-we-do-and-dont-accept.txt:125-129`, "Items We Need": "Clothing", "Housewares", "Books", "Furniture"; `:179` "Revenue generated from donated goods sold in our stores" | None that passes BAR-A. https://goodwillng.org/ways-to-support/donate-goods/items-we-do-and-dont-accept/ (read; fails BAR-A part 3, it links to an Amazon store) | 2026-11-17 | Stock today; any one store | **Held: no source passes** (BARK-3). The rows that use it show nothing until RT-9 finds a page |
| SEN-2 | Borrow | Library of things at a public library | "Libraries of things at public libraries often lend household items such as tools and kitchen equipment with a library card." | In general | `borrow/www.readingpl.org_library-of-things.txt:113` "tools, kitchen items, outdoor gear, tech devices, games, and more"; `borrow/www.wilmingtonlibrary.org_library-of-things.txt:39` "kitchen gadgets, tools, electronics" | https://www.readingpl.org/library-of-things ; https://www.wilmingtonlibrary.org/library-of-things/ | 2026-11-17 | That your library has one (no count of US libraries found, research 01 NOTF-4); camping gear; free to non-residents | Sourced, held (BD-5) |
| SEN-5 | Used | Building-material reuse center | "Building-material reuse centers often sell used doors, windows, cabinets, lumber and flooring." | In general | `used/www.epa.gov_smm_best-practices-reducing-reus__ycling-construction-and-demolition-materials.txt:107` reuse centers "primarily offering items such as doors, windows, cabinets, plumbing fixtures, lumber, millwork, metals, flooring"; `OLD/pages/data-sources/www.habitat.org_restores.txt:106` "furniture, appliances, home goods, building materials and more" | https://www.epa.gov/smm/best-practices-reducing-reusing-and-recycling-construction-and-demolition-materials ; https://www.habitat.org/restores | 2026-11-17 | One nearby: the same EPA line says reuse centers "represent a small percentage of the total number of reuse retail businesses". That salvaged goods are free of hazards: the page says a small percentage of these materials "contains constituents of potential concern", and names asbestos, PCBs and lead (same file `:103-104`) | Sourced, held (BD-5) |

No caution sentence is shown in version one: a caution is a claim that needs its own source and level (OLD critique CRIT-11, per the triage).

### 2b. Which products show which idea

**Approach** (lens 12 section 2c, lens 14 REC-1, changed by the walk-through):

- One table of product groups by idea. A product no row lists shows nothing (an allow list).
- A cell may name a kind only if that kind's sentence names the row's goods (lens 12 RULE-1).
- Keep-out words are checked first and win. A hit shows no list and gives no reason.
- Every row and every word needs the owner's sign-off before it ships (lens 14 OW-2). The "basis" below is what the row rests on, for the owner to judge.

**The table, first set.** Empty cells are agent's judgment, no source, unless noted. The match words for each row are at `BYB/41-final-rules-rerun.py:34-50`; they are a first draft by agents, and the owner opens them only after writing their own probe strings (PH-0, the owner's read and sign-off).

| Label | Product group | Borrow | Repair | Used | Basis of the show cells |
|---|---|---|---|---|---|
| TRG-1 | Power tools | SEN-1 (tool libraries) | SEN-3 (repair cafés) | none: no sentence for used tool shops (BARK-6) | Borrow: research 01 KIND-2. Repair: power tools are seen at community repair events (SEN-3's second source); BD-4 (the drill example) |
| TRG-2 | Hand tools | SEN-1 | | | Research 01 KIND-1. Garden tools are left out: SEN-1 does not name them |
| TRG-4 | Cookware and dishes, not nonstick | | | SEN-4 (thrift stores), held | The Goodwill list (lens 12 ROW-5). Nonstick is out on a press list only (research 04 KE-4) |
| TRG-5 | Adult clothing, not socks, underwear or swimwear | | SEN-3 | SEN-4, held | The sentences' sources. The exceptions are press-only or agent's judgment (research 04 KR-15) |
| TRG-6 | Books | | | SEN-4, held | The Goodwill list |
| TRG-8 | Furniture, by named piece (desk, dresser, bookshelf, dining table, office chair) | | SEN-3 | none: gray | Repair: SEN-3's first source. Used: EPA says inspect and clean first (research 04 SB-1). No bare word "chair", and no "sofa" |
| TRG-9 | Small appliances and electronics | | SEN-3 | | SEN-3's sources; research 02 REP-A |
| TRG-10 | Bicycles, not e-bikes | | SEN-3 | none: kind fails the bar (BARK-8, bike shops, book sales, sporting goods) | SEN-3's first source |
| held | Baking equipment (was TRG-3) | SEN-2 (libraries of things) | | | Waits on BD-5 (how many kinds) |
| held | Doors, windows, cabinets, flooring, lumber (was TRG-7) | | | SEN-5 (reuse centers) | Waits on BD-5; doors and windows with old paint are a named case in BD-7 (check-first goods) |
| not a row | Tents and outdoor gear | dropped | | | A tent is named on 1 of 4 library-of-things pages (lens 12 ROW-3) |

**Keep-out words** (in the matcher; a hit hides all three ideas). Only words that can collide with a row word, plus the owner's two examples (`docs/goals.md:91`).

| Label | Goods and words | Firmest source read | What the sources do not say |
|---|---|---|---|
| KOUT-1 | Car seats, boosters, infant carriers | NARTS, a resale trade group: "Car seats should never be resold. Period." (research 04 SA-6) | NHTSA: a second-hand seat "may be okay to use" if a checklist passes (research 04 SA-4). Boosters: no source |
| KOUT-2 | Helmets of any kind | NARTS list; UIAA for climbing (research 04 SA-13); CPSC: replace after an impact (SA-7) | No government page read says never buy one used (research 04 NF-1) |
| KOUT-3 | Life jackets and flotation wear ("life jacket", "life vest", "flotation", "float coat", "PFD") | Agent's judgment: the pages read are silent on used (research 04 KR-16) | Everything. Listed because the names end in "jacket", a row word |
| KOUT-4 | Children's goods: "baby", "infant", "toddler", "nursery", "kid", "child", "children", "boy", "girl", "youth" | CPSC resellers guide for nursery goods and children's clothing (research 04 KR-6 to KR-8; lens 12 ROW-6) | Advice written to sellers. The words are agent's judgment. BD-8 (children's goods) |

**Watch list** (not in the matcher; kept as test strings that must show nothing, and read before any row is added). These goods match no row word, so no keep-out word is needed to hide them (critique CRIT-7).

| Label | Goods | Firmest source read | What the sources do not say |
|---|---|---|---|
| WATCH-1 | Cribs, bassinets, inclined sleepers, baby walkers | CPSC resellers guide; NARTS for walkers (research 04 KR-6, KR-7) | |
| WATCH-2 | Play yards, high chairs (also "feeding chair", "hook-on chair", "bouncer chair"), strollers, swings | CPSC guide (research 04 KR-8) | The sources say check first; none says never (research 04 KE-7) |
| WATCH-3 | Breast pumps | FDA (research 04 SB-3) | |
| WATCH-4 | Mattresses; box springs | CPSC age and label rules for mattresses (research 04 KR-10) | The guide says check first; it does not say never. Box springs: agent's judgment, no source |
| WATCH-5 | Climbing ropes and harnesses | UIAA (research 04 SA-13) | Other climbing gear: snippets only |
| WATCH-6 | Space heaters, electric blankets, hoverboards, heat lamps ("heat lamp" shows repair today through TRG-9's "lamp"; needs an exception word) | CPSC guide: check first (research 04 KR-19, KR-20, KR-22) | |
| WATCH-7 | Eye cosmetics; other makeup; medical devices, wheelchairs included | FDA, on sharing eye cosmetics (research 04 SB-4); NARTS only for devices | The FDA page is about sharing and does not cover resale. Makeup beyond eye products: press lists only (research 04 KR-14) |
| WATCH-8 | Tires; smoke and carbon monoxide alarms | Tires: one press list (research 04 KR-18). Alarms: the pages read are silent on used (KR-17) | |

The owner's two examples are met by trade sources, not by CPSC or NHTSA. Keeping them out silently makes no claim, so it needs no source under G3 (lens 11 APP-5). No check in this spec catches a source that changes its advice: the source check (PH-1, data and matcher) tests only that a quote is still on its page.

**How a search is matched** (lens 14 REC-1 with DIS-1, which fields show an idea, changed by the walk-through's fixes FIXR-1 to FIXR-7).

| Label | Rule | Why |
|---|---|---|
| MATCH-1 | Text is lowercased, a trailing "'s" is dropped, and words split on spaces and hyphens. A term matches as a run of whole words | The repo's relevance code has the substring bug this avoids ("pan" in "Japan", `docs/debt.md:65`). Hyphens and apostrophes were undecided in the draft (walk-through FIXR-6) |
| MATCH-2 | The last word of a term may be plural: "s", "es", or "y" to "ies" | "Babies" and "dresses" were missed (walk-through FIXR-3) |
| MATCH-3 | Keep-out words match anywhere in any of the three fields the response carries: `query.product`, `query.canonical_name`, `query.category` (`proxy/src/pipeline.ts:272`) | The model's fields can hide an idea and never show one |
| MATCH-4 | A row's exception words ("nonstick", "teflon", "swim", "e bike", "head lamp", "hose clamp", "coloring book") match anywhere in the typed product and skip that row | |
| MATCH-5 | A row word counts only when it ends the typed product. No row reads the model's name or category | An accessory or a part inherits no idea: "drill battery", "printer ink", "bike child seat" (walk-through FIXR-1; critique CRIT-6). 20 products drew 27 category wordings (`BYB/12-count-match-fields.out.txt:18`) |
| MATCH-6 | A bare one-word row term is allowed only where no kept-out good is commonly named with it as its last word. "Chair" fails that test and is listed only in two-word terms | Four of the eight unsafe shows came through "chair" (walk-through WALK-58, 59, 60, 62) |
| MATCH-7 | If two rows match, the ideas are joined and each idea shows at most one kind, the first row's in file order | Agent's judgment, no lens proposed this |

**The walk-through's unsafe and undecidable results, and where each went.** Under the draft's rules 8 products showed an idea for a kept-out good and 8 could not be decided (walk-through, "Counts").

| Walk-through row | Product | Under these rules | Changed by |
|---|---|---|---|
| WALK-58, 59, 60 | feeding chair, hook-on chair, bouncer chair | Nothing | MATCH-6 (no bare "chair"); WATCH-2 (a test string) |
| WALK-62 | wheel chair | Nothing | MATCH-6; WATCH-7 (a test string) |
| WALK-61 | winter jacket for babies | Nothing | MATCH-2 (plurals) and MATCH-5 (a row word must end the typed product); KOUT-4 (children's words) |
| WALK-63 | flotation jacket | Nothing | KOUT-3 (flotation words) |
| WALK-64 | bicycle hemlet (misspelled) | Nothing | MATCH-5 |
| WALK-65 | bike child seat | Nothing | MATCH-5; KOUT-4 |
| WALK-42 | upholstered sofa | Nothing: no row word | TRG-8 lists pieces by name; whether a sofa should bring the repair idea is in BD-7 |
| WALK-66 | bike trailer | Nothing | MATCH-5; named in BD-7 |
| WALK-77 | e-book reader | Nothing | MATCH-1 (hyphens split words), MATCH-5 |
| WALK-88 | head lamp | Nothing, as "headlamp" | MATCH-4 (an exception word) |
| WALK-105 | e-bike | Nothing | MATCH-4 (an exception word); lithium batteries have no source (research 04 KE-3); BD-7 |
| WALK-104, 109, 118 | kids bike, children's winter coat, kids tablet | Nothing | KOUT-4; BD-8 |

**Counts after the changes** (the rerun, run today; graded by hand against the walk-through's own "should show" column, most of which is agent's judgment):

- The 118 walk-through products, with SEN-4 sourced: 0 unsafe shows, 0 wrong shows, 16 wrong hides, 5 hidden by defaults the owner has not ruled (kids bike, kids tablet, children's winter coat, e-bike, bike trailer), 97 right (`BYB/41-final-rules-rerun.out.txt:49-169`). Before the changes: 8 unsafe, 20 wrong shows, 13 wrong hides, 8 undecidable, 69 right.
- The 16 wrong hides: brand and model names (DeWalt DCD771, iPhone 15), one-word names no row lists (smartphone, chainsaw), a misspelled row word (drils), goods no row has a word for (chef's knife, insulated water bottle, pour-over coffee dripper, pressure washer, stand mixer), "baby name book" (hidden on purpose by "baby"), three that MATCH-5 costs (coat rack, window fan, bike shorts), and two whose row is held (interior door, TV cabinet). The walk-through's extra words for some of these (its FIXR-8: knife, smartphone, chainsaw and others) were not added: each is a row edit for the owner in PH-0.
- The 20 test products: a list shows for 3 with SEN-4 sourced (cordless drill, cast iron skillet, rain jacket) and for 2 today (cordless drill; rain jacket, repair only), the same way in every saved response of each (`:3-47`).
- Lens 12's 38 made-up strings: 35 sort as lens 12 wanted. The three that differ: "kids bike" (KOUT-4), "DeWalt DCD771", "interior door" (held row) (`:171-210`).

These words were changed after seeing the failing cases, so the rerun shows the fixes work on the cases they were written for. It says nothing about strings nobody has tried (RISK-14, words tuned to known cases; RT-10, fresh probe strings).

### 2c. The page

Nothing below was rendered. Every string and height is a proposal (lens 13 section 8).

**Two stages** (BD-10, the first build). Stage one (PH-3a) is the collapsed line at every width. Stage two (PH-3b) is the wide layout below, built after a local mock (RT-5). Row V0 rules "beside the shops on wide screens" (`docs/goals.md:23`), so stage one departs from that ruling until stage two ships, and needs the owner's yes. If the owner says no, PH-3a is skipped and PH-3b builds the wide layout from the start.

**Where it lives.** The list is its own `aside` named "Before you buy", a child of `#results` between the count line and `#result-sections` (`index.html:56-57`), inside neither shop section. The second column today exists only inside "Near you" and only while that section has map pins (`src/render.ts:384-385`), so a list placed in that column would have no home when the map is absent (lens 13 section 2a).

**Wide (80rem and up), stage two: beside the first shops, above the map** (lens 13 PLC-A).

```
| Found 5 shops within 6.6 mi and 4 online.  |                                        |
| How ranking works   What unknown means     | Before you buy                         |
| Near you                                   | Ideas that may apply, picked by ...    |
| 1 Example Hardware                         | Borrow it. Tool libraries often ...    |
|   Sells it: ... 1.0 mi ...                 | Repair the one you have. Repair ...    |
| 2 Example Cookware Co.                     | Sources                                |
| 3 ...                                      | +------------------------------------+ |
|                                            | | map, sticky, starts lower          | |
```

**Narrow (under 80rem), and every width in stage one: one collapsed line above the shops.**

```
Found 5 shops within 6.6 mi and 4 online.
> Before you buy: borrow, repair
How ranking works   What unknown means
Near you
1  Example Hardware
```

| Label | State | What shows |
|---|---|---|
| ST-1 | Map beside, window 80rem or wider | Stage one: the collapsed line. Stage two: second column, top; the map under it, starting lower by the list's height |
| ST-2 | Map beside, window 64rem to 80rem | The collapsed line; map as today (BD-12, the width for beside) |
| ST-3 | Map behind its button (under 64rem, `src/main.ts:58`) | The collapsed line; "Show map" stays where it is |
| ST-4 | No nearby shops, or "Near you" unchecked | Same slot, beside or above the first online shops |
| ST-5 | Sort or filter change | Untouched (DIS-7, sort and filter changes). No control acts on the list and it is not counted in "Found" |
| ST-6 | Every result hidden by filters; map fails to load | Same slot |
| ST-7 | No idea applies, or a keep-out hit | The element is absent: no heading, no placeholder. The page is as it is today |
| ST-8 | Search running | Nothing: the keep-out check needs fields that arrive with the response (lens 13 ST-8) |
| ST-9 | No shop matched | Today `#results` stays hidden and a "no results" message shows (`src/main.ts:160-166`). Suggested: the collapsed line shows under that message. BD-11 (no shop matched) |
| ST-10 | New search | The narrow line starts closed again |

**Strings** (not rendered).

| Label | Part | String |
|---|---|---|
| STR-1 | Heading | "Before you buy" (`docs/goals.md:23`, the file's wording) |
| STR-2 | Note under the heading, in the muted ink of `.section-note` (`src/styles.css:192`). It carries the mark | "Ideas that may apply, picked by hand for this kind of product. In general: each sentence is about a kind of place. Whether one is near you, or has what you need, was not looked up." |
| STR-3 | One entry | "{Bare suggestion}. {Sentence}" with no source name, link or date |
| STR-4 | Sources, under the last entry | A button, "Sources", dressed as `.link-button` (`src/styles.css:188`), that opens in place, as "What unknown means" does (`src/render.ts:306-316`). Open, one line per sentence shown: "{Kind of place}: {Publisher}; {Publisher}. Read {date}.", each publisher's name a link to its page |
| STR-5 | Cordless drill | Line: "Before you buy: borrow, repair". "Borrow it. Tool libraries often lend hand and power tools; some are free with a library card, others charge a yearly membership." "Repair the one you have. Repair cafés are free meeting places where volunteers often help fix clothes, furniture, bicycles, appliances, electronics and power tools." |
| STR-6 | Rain jacket | Today, line: "Before you buy: repair", and the repair entry as above. Once SEN-4 (thrift stores) has a source, line: "Before you buy: repair, used", adding "Buy it used. Thrift stores often sell donated clothing, housewares, books and furniture." |
| STR-7 | Child car seat | Nothing, and no reason |

Order is fixed: borrow, repair, used, the order of the owner's sentence in row V0. No rank number, score, box, icon, accent color or comparative word ("better", "instead"), so the list does not read as a ranked or featured slot (lens 13 NEV-1 to NEV-4). The word "likely" appears nowhere: the results page already prints "Likely, by shop type" for a shop (`src/render.ts:107`). The note does not use "unknown": G3 defines Unknown as "Nothing found" (`docs/goals.md:65`) and the help text ties it to a shop's record (`src/render.ts:314`), while here nothing was looked up.

**Departures from site patterns** (lens 13 PDEP-1 to PDEP-6; critique CRIT-10). DEP-1 to DEP-3 arise only in stage two.

| Label | Departure | The standard it breaks | Pattern-consistent alternative |
|---|---|---|---|
| DEP-1 | A two-column grid on `#results` | "one left-aligned measure" (`src/styles.css:83`) | One full-width band above the shops (ALT-6), which departs from "beside" |
| DEP-2 | The map starts lower than the "Near you" heading, by a height measured in script | "level with the section heading" (`src/styles.css:218`) | A wrapper holding list and map inside the section, which changes the map code |
| DEP-3 | A second width, 80rem | One width, 64rem, decides the map (`src/main.ts:58`) | Use 64rem and accept a tall list in a narrow column (BD-12) |
| DEP-4 | A `summary` line in body ink at control height | The one today is small and warning-colored (the "N concerns" group, `src/render.ts:150`) | A link in the help line, which hides aim 1 among help links |
| DEP-5 | An `h2` that is not a shop section | Every results `h2` is a shop section (`src/render.ts:446`) | A bold lead-in, no heading |
| DEP-6 | One "Sources" button for the whole list | A shop's source reads "Source: {host}" on its own row (lens 13 PDEP-6) | "Source: {host}" on each entry, which puts a name on the face (BD-9, a source's name) and is the dress of a Checked item |
| DEP-7 | The heading needs a style rule of its own | The stylesheet's only `h2` rules are `section h2` and `.prose h2` (`src/styles.css:190`, `:358`), so an `h2` in an `aside` would get the browser's default | Give it the `section h2` values, or use DEP-5's alternative |

What the owner would accept with the wide layout: the map is partly below the first screen until the shopper scrolls, and windows from 64rem to 80rem get the collapsed line though the map is beside the shops there (lens 13 ACC-1, ACC-3).

### 2d. The certainty marks, as they apply to this list

The four marks as words were proposed by the earlier run (`OLD/13-lens-shopper-and-marks.md`, MK-1 to MK-4). The owner has not ruled on them (triage, line 5).

| Label | Level | In this list |
|---|---|---|
| MRK-1 | In general | One mark for the whole list, the words "In general:" in the note (STR-2), with its meaning beside it and a statement that it covers a kind of place, not one place (`OLD/02-certainty-marks-elsewhere.md`, FAIL-2, SUG-1, SUG-3). No level word per line: a mark that never varies tells no line from another (lens 13 MRK-1) |
| MRK-2 | Unknown | Not used as a word. The note says what was not looked up: whether a place is near, and what it has |
| MRK-3 | Likely | Not used, and tested against (TEST-1, the sentence test) |
| MRK-4 | Checked | Not used. A source link is the Checked mark on a shop row (`OLD/13-lens-shopper-and-marks.md`, EX-6); here no entry shows one, and the sources sit behind one button |

Two things carry no level:

- The frequency word. Each sentence says "often"; the level mark is "In general" (BD-2, the level and the hedge).
- The fit. "Borrow it" beside a drill says "this idea fits your product". That comes from the table in 2b, whose cells are the owner's signed judgment once PH-0 (the owner's read and sign-off) is done and agents' judgment until then. It has no source, so the note says "picked by hand for this kind of product" (critique CRIT-11). Whether that is enough under G3's "Every item shown carries one of four levels" (`docs/goals.md:58`) is BD-14 (the mark).

### 2e. The build

| Label | Part | Shape |
|---|---|---|
| BLD-1 | Data | `data/before-you-buy.json`: kinds (id, idea, level, text, a list of sources each with url, publisher, quote and check date), rows (terms, exception terms, kinds, basis, examples), keep-out rows (terms, per-idea basis, examples), watch strings. Field names follow `data/certifications.json` (lens 14 section 2c). Bundled into the site at build; the Worker does not import it |
| BLD-2 | Matcher | `src/ideas.ts`, one pure function from the three query fields to the ideas to show (MATCH-1 to MATCH-7) |
| BLD-3 | Drawing | A function called once per new response from `src/main.ts`, not from `renderResults`; styles in `src/styles.css`. Stage one: the collapsed line and the Sources button. Stage two adds the grid and a width listener at 80rem that redraws the list only |
| BLD-4 | Deploy | A site push to `main`. No Worker deploy: the deploy list names a `data/*.json` the Worker imports, and this is not one (project `CLAUDE.md`). Test bar before the push: unit tests, lint, typecheck, end-to-end (lens 14 REC-5) |

| Label | Test (none exists) |
|---|---|
| TEST-1 | Every kind: text present and 20 words or fewer, sources from at least two publishers (BAR-A, the source bar), each https with a date and a quote of 4 words or more, the ruled level, no "likely" |
| TEST-2 | Ids unique; every row names existing kinds; every row and keep-out cell has a basis; no row term is a bare word the owner has barred under MATCH-6 ("chair" today) |
| TEST-3 | Every keep-out example and every watch string shows nothing; near misses written by hand ("car seat cover", "helmet light", "drill bits", "feeding chair") show nothing |
| TEST-4 | Over the 1,101 saved responses: every response of a product gives the same ideas, equal to the owner's signed table |
| TEST-5 | No string or link in the data file matches an entry of the Amazon blocklist (lens 11 AZ-2). Needed because the Worker's two filter passes never see this list (`docs/architecture.md:32`) |

| Label | Phase | Shopper sees | Work | Waits on |
|---|---|---|---|---|
| PH-R | Fill the sources | Nothing | Desk research, no code: RT-9 (a thrift page that says what such stores sell and links to no Amazon store) and RT-2 (used tool shops; repair shops, one page naming tools). The claim check's method: saved pages, quotes checked by a second reader | BD-1 (the source bar) |
| PH-0 | Read and sign | Nothing | The owner reads the sentences (MEAS-1, the owner's read), writes probe strings of their own, then opens the match words and signs or corrects each row, word and expected result for the 20 test products. The blocking decisions BD-2 to BD-8 (section 12) are made in this read | PH-R |
| PH-1 | Data and matcher | Nothing | The data file and matcher (BLD-1, BLD-2), tests TEST-1 to TEST-5, a report per test product, and a source-check script that re-fetches each source, checks its quote is still there and searches the page for blocklist names (lens 14 UP-2; critique CRIT-3). The script is run by hand: the saved pages are in a git-ignored folder, so a unit test in CI cannot read them. Not wired to the page | PH-0 |
| PH-2 | Owner reads the report | Nothing | A difference is fixed in the data, never in the signed table, unless the owner rules the table wrong | PH-1 |
| PH-3a | The line | The collapsed line at every width | The drawing code (BLD-3), stage one; end-to-end tests at 360 and 1280 wide | PH-2; the page decisions BD-9 to BD-11, BD-13 and BD-14 (section 12) |
| PH-4 | Measure | The line | One field per ten-purchase-log line (MEAS-4, the log marks) | BD-15 (the log field) |
| PH-3b | Beside | The wide layout | A local mock first (RT-5), then BLD-3 stage two | The fail bar not met (BD-3); BD-12 (the width for beside) |

**Upkeep for one person:** 3 sentences with their sources and dates (5 if decision BD-5 picks five kinds), 8 rows, 4 keep-out groups, 8 watch groups that are test strings only, one file, one test file. In one day of research the pages tried already gave three 404s, one domain that did not resolve and one blocked page and one unreadable robots.txt (lens 14 UP-2), so sources will move. Rhythm taken as a default (DEF-5, the re-check rhythm): run the source check before each edit and once a year.

## 3. How version one serves the aims, in order

| Line | Serves | Works against | Not touched | Basis |
|---|---|---|---|---|
| Aim 0, defund the Amazon monopoly | Gives a reason to search here that Amazon does not offer (agent's judgment, no source). No source page with a link to an Amazon store is shown (BAR-A, the source bar) | The list is built in the browser, outside both filter passes | The blocklist | `docs/architecture.md:32`; TEST-5 (the blocklist test); the source check in PH-1 (data and matcher) |
| Aim 1, buy used or buy less | The first thing on the site built for it | Today no used idea shows for any test product (SEN-4, the thrift sentence, is held). Used helps when it replaces a new purchase (research 03 USE-C, one study); repair reaches only someone who owns one; borrowing has fees, age and residency limits (research 01 BOR-B); the shopper does the finding | | Lens 11 AG-1 |
| Aim 2, better companies, independent ownership | | A borrowed drill is a sale no ranked shop made. The owner ordered aim 1 above aim 2 (`docs/goals.md:14`), so this trade is ruled. The kinds that pass the source bar today are public or volunteer-run; the two that are shops (used tool shop, repair shop) do not yet (critique CRIT-4) | Scores, badges, the record line | Lens 11 AG-2 |
| Aim 3, local | The kinds are places a person visits | It cannot say one is nearby; in a zip outside metropolitan areas the nearby distance is 30 miles (`docs/ranking.md:84`) | The distance groups | Lens 11 AG-3 |
| Drive less (not placed) | | Might add a trip: lenders say to check or call first (research 01 SENT-7) | The proximity score | Lens 11 AG-4 |
| G3 (marked inferred, `docs/goals.md:49`) | A source and a date for every sentence, one click away; a level on the list; what was not looked up is said plainly; the zip is sent nowhere new | First real use of In general, with "often" where G3 says "most" (BD-2, the level and the hedge); one mark for the whole list where G3 says "Every item", and the fit carries none (BD-14, the mark) | A Likely or In general item never changes a score: no score here | `docs/goals.md:49-69` |
| G5 | Uses G5's trigger rule | A fixed sentence might not count as "information dynamically" (`docs/goals.md:79`; OLD lens 14 AGAINST-1, per the triage). G5's pass-mark candidate grades named stores and cannot be taken | The per-store description, which waits (`docs/goals.md:81`) | Lens 11 GL-17 |
| G6 | Defines it; all four fixed points kept, with one reading passed to the owner: whether a source's name is a named place (BD-9) | The pass mark is still unset (BD-3, the fail bar) | | `docs/goals.md:89-91` |
| G1 | | If an idea counted as "something their usual tool did not" in G1a, fixed sentences could pass a check about gathered information (BD-15, the log field) | G1b, G1c, G1d: an idea is not a "shown result" (`docs/goals.md:38`) | Lens 11 GL-1 to GL-4 |
| G2 | | | No call is added; the list shows with the response, never before it | `docs/goals.md:47` |
| G4 (marked inferred) | A change ships with a site push alone | One more hand-kept file with three lists | | `docs/goals.md:71-75`; G4 has no pass mark |
| V0 | No score, shop order unchanged, above the shops and collapsed on narrow | Stage one is not beside the shops on wide screens (BD-10, the first build). In stage two, between 64rem and 80rem the list is collapsed though the map is beside the shops (DEP-3, the second width) | | `docs/goals.md:23` |
| V1 | | | Names no shop, shows no badge | Section 4 |
| V2 | "help a shopper choose where to buy instead" now includes not buying | | | `docs/goals.md:25` |
| V3 | Sized for a site friends would use | With no analytics (`docs/privacy.md:40`), only the owner's log can measure it | | `docs/goals.md:26` |

A lens label in the Basis column is a citation; the claim is the one in that row.

## 4. Independent ownership and row V1

**The conflict.** The aims table quotes the owner: "independent is part of or right after better businesses" (`docs/goals.md:15`). Row V1 says independent or chain "is shown as one fact about it" and the aim is the better company "whatever its size" (`docs/goals.md:24`); that row is the file's wording and quotes nobody. The 2026-09-27 ruling made it "a badge only, no score effect and no filter" (`docs/STATUS.md:117`). Two decisions on independents are still listed as open (`docs/STATUS.md:147`, `:150`).

| Label | Reading | Which of the owner's two phrases it fits (the critique's reading; the owner has not said) | What would change (per lens 11, files not reopened today) |
|---|---|---|---|
| RD-1 | The aims table orders values; V1 and the badge ruling govern what is shown and scored | Neither phrase asks for a change. Row V0 shows an aim can be ordered first and still change no score "for now" (`docs/goals.md:23`) | One clarifying sentence in V1. No code |
| RD-2 | Independent ownership is part of "better", so it scores, through the membership badge or through the chain list | "part of" | Row V1, `docs/ranking.md`, `proxy/ranking/score.ts`, the 2026-09-27 ruling. The site holds 3 membership rows, and absence from the chain list is not evidence of independence (lens 11 RD-2a, RD-2b) |
| RD-3 | A tie-break, sort or filter outside the score | "right after" | Row V1, the "no filter" half of the ruling, `src/controls.ts` |

**Does version one depend on it?** No (the triage section 9 and lens 11 agree): it names no shop, shows no badge and changes no order. The ruling is needed before a later version names a place or boosts a score (GATE-5, the ownership ruling).

**Question for the owner (BD-16):** which reading holds? No default is suggested: RD-1 is the reading under which nothing changes, and the sentence that raised the question is the owner's own. Wording for row V1 if the owner picks RD-1, quoted as a proposal and not applied to `docs/goals.md`: "V1, record first. The aim is the better company. The owner, 2026-11-17: 'independent is part of or right after better businesses'. Today whether a shop is independent or a chain is shown as one fact about it and does not change its score (ruled 2026-09-27). Whether it should change the order of shops: TBD, the owner to rule."

## 5. How it would be measured

The site has no analytics (`docs/privacy.md:40`), so nothing counts how often the live list shows or is opened.

| Label | Measure | How taken | Cost | Limit |
|---|---|---|---|---|
| MEAS-1 | The owner's read of the sentences, before any build | Each first-set sentence marked "new to me or would change what I do", "neither" or "wrong" (lens 11 KC-1) | Minutes | A weak test: the owner proposed these kinds, and "would change what I do" is a guess (critique CRIT-5) |
| MEAS-2 | The idea fits the product (review measure MS-1, first half) | TEST-4 (the saved-response test) against the owner's signed table for the 20 test products | No search calls | Tests that the build matches the table; says nothing about the idea |
| MEAS-3 | The list stays away from keep-out goods (MS-1, second half) | TEST-3 (the keep-out test) over hand-written probe strings | No search calls | The test set holds no car seat, helmet, crib or mattress (research 04 KEEP-F); what the model writes as their category is not known without a live search |
| MEAS-4 | A purchase changed (MS-4) | On each ten-purchase-log line where an idea showed, the owner marks acted on, considered, ignored or wrong (lens 11 KC-2) | One field per line; no log field is defined in `docs/goals.md` (the log is "Not started", `docs/goals.md:36`) | Ten purchases might hold one or two lines where an idea showed |
| MEAS-5 | How often the list shows | 2 of 20 test products today, 3 of 20 with SEN-4 (thrift stores) sourced. Reported as a count; no target is set | Already counted | Counted by product; searches were not counted |
| MEAS-6 | Nothing Amazon-owned is named or linked | TEST-5 (the blocklist test), zero matches; the source check finds no blocklist name on a shown source page | A unit test and one script run | |

G6's pass mark: **TBD, the owner to fill** (`docs/goals.md:91`). The owner sets it before PH-1 (BD-3, the fail bar), so that the build has a way to fail. Candidates, labeled as candidates; every number is the adversary's or the final writer's judgment, no source:

| Label | Candidate | Fails when |
|---|---|---|
| CAND-1 | The owner's read (MEAS-1) decides how much is built | No more than one first-set sentence is marked "new to me or would change what I do": nothing past the collapsed line (PH-3a) is built |
| CAND-2 | The log (MEAS-4) decides whether the list stays | No line is marked "acted on" by the log's tenth purchase, or any line is marked "wrong": the list is removed |
| CAND-3 | The lists do what they say (MEAS-2 with MEAS-3) | Any signed row or probe string comes out differently. A check on the build only |
| CAND-4 | MEAS-5 reported beside the others | Not a pass or fail |

## 6. Alternatives considered

| Label | Alternative | Argued by | Why not picked |
|---|---|---|---|
| ALT-1 | Larger: five kinds, with the library of things and the reuse center added (the working draft's pick) | Lens 12; lens 11 APP-2 | Now the alternative: both are sourced and held. Neither is among the owner's examples and no test product brings either (critique CRIT-13). BD-5 (how many kinds) |
| ALT-2 | The wide layout from the first build, with no collapsed-line stage (the working draft's pick) | Lens 13 PLC-A; row V0 | The layout is likely the largest share of the build (agent's judgment), was not rendered, and the put-off prototype has no slot for it (RISK-13). Kept as stage two. BD-10 (the first build) |
| ALT-3 | Larger: name a place, or link to a directory or map search for the kind | Lens 11 OPT-5; research 06 LEAD-2 (Portland pairs kind-only advice with a directory link) | Against a fixed point as far as naming goes. A link names no place, so the fixed points do not settle it, but the directories read call themselves incomplete (research 01 BOR-C) and the Amazon filter does not run on another site's page (lens 11 AZ-3). BD-13 (a link out) |
| ALT-4 | Sentences that report EPA's advice ("EPA advises buying used when possible"), level Checked, for the whole list or only where a kind has no sentence | Lens 11 OPT-1; lens 12 ALTC-3; lens 13 EXS-1 | Names no kind of place. One page to keep, and it would give the drill a used idea. BD-4 (the drill example) |
| ALT-5 | Also show an idea on the model's canonical name or category | Lens 12 section 2e (name); old spec DATA-5 (all three) | DIS-1 (which fields show an idea). Revisit if RT-4 (what the model returns for odd inputs) shows many brand-name misses and a reliable name field |
| ALT-6 | One full-width band above the shops at every width | Lens 13 PALT-1 | Departs from "beside", and takes more of the first screen than the collapsed line. The fallback for stage two if DEP-1 (the grid) or DEP-2 (the map pushed down) is refused or the measured margin proves fragile |
| ALT-7 | A fixed product group picked by the normalize model | Old spec ALT-18 | Every product is read again, a wrong reading is cached 30 days, and the model would make the keep-out call (triage CARRY-5; lens 14 AL-3) |
| ALT-8 | Default on, with only a keep-out list | Lens 12 ALTC-2 | 17 of 20 test products would show ideas lens 12 judges unfit; the three "never buy used" lists read share only 3 goods (research 04 KEEP-F) |
| ALT-9 | Show gray goods with a sourced caution ("Check first: ...") | Lens 12 ALTC-6; lens 13 ENT-5 | Each caution is one more sourced, dated sentence. Used furniture is the first case if added; BD-7 (check-first goods) |
| ALT-10 | A caution line for kept-out goods | Lens 13 PALT-5 | The sources disagree on car seats and helmets, so any one sentence picks a side |
| ALT-11 | A level word on every entry | Lens 13 PALT-4 | A word per line that never varies; BD-14 (the mark) |
| ALT-12 | Show the list while the search runs | Lens 13 PALT-6; lens 14 AL-5 | An idea shown and then withdrawn for a keep-out good is the worst case |
| ALT-13 | Drop repair | Lens 11 OPT-2 | Departs from the owner's three named examples |
| ALT-14 | Smaller: one fixed list or line on every search, no lists to keep | Lens 14 AL-4; the critique's rival ALT-Z | Would show "buy used" beside a car seat, and names no kind of place |
| ALT-15 | Other wide placements: below the map, a third column, in place of the map, or at the top of the second column beside the controls | Lens 13 PLC-B, PLC-C, PLC-E, PLC-T | Below the map reads as an afterthought and a sticky map slides over it; a third column has no room at 64rem; replacing the map reverses the 2026-11-16 map ruling (`docs/STATUS.md:133`); beside the controls is "above" at the cost of a grid |
| ALT-16 | One list of product groups per idea, in place of one table | Lens 12 ALTC-1 | A good sits in up to three lists, and no one place shows what a drill brings |
| ALT-17 | Give G6 a pass mark by counting ideas inside G1a or G1c; or hold version one until the independent-ownership ruling | Lens 11 OPT-3, OPT-4 | The first lets fixed sentences pass checks written for search results; the second is delay for no gain (section 4) |
| ALT-18 | Publisher names and read dates on the face of each entry (the working draft's form) | Lens 13 ENT-3 | Three named organizations on a list ruled to name no place, shown in every zip (critique CRIT-2). BD-9 (a source's name) |
| ALT-19 | A row word matches anywhere in the typed product (the working draft's matcher) | Lens 14 REC-1 | Accessories and parts inherit the idea, and 3 of the 8 unsafe shows came this way (walk-through FIXR-1) |
| ALT-20 | All nine keep-out groups in the matcher (the working draft's list) | Lens 12 KO-1 to KO-9 | Most never act under an allow list, and one misfired ("medical textbook" hidden, critique CRIT-7). Kept as test strings |
| ALT-21 | When a shop already in the results is a used or repair shop, point the idea at it (the critique's rival ALT-N) | The critique | Names a place, against a fixed point; a result carries no store-type field (`proxy/schemas/search-response.json:46-48`, the critique's citation, not reopened) and resale shops are 1.3% of saved results (`docs/goals.md:85`) |
| ALT-22 | Smaller: one kind and one idea, tool libraries for tools (one sentence, two rows) | The final writer, as the smallest version that keeps the four fixed points | Drops two of the owner's three ideas, and the repair café sentence already passes the source bar |
| ALT-23 | No frequency word in the sentences; the In general mark is the only hedge (the working draft's pick) | Lens 12, section 2b notes | A flat sentence reads as true of every place of the kind, which the counts do not support (critique CRIT-1) |

A lens label in the "Argued by" column is a citation; the alternative is the one in that row.

## 7. Later versions and their gates

| Label | Gate | Waits on | Who sets the bar |
|---|---|---|---|
| GATE-1 | Version one has not met its fail bar (BD-3): the owner's read (MEAS-1) and the log marks (MEAS-4) | PH-4 (measuring) | The owner |
| GATE-2 | Naming a place: a source of places per kind with no paid feed, and either no extra search call or the shelved extra search brought back (`docs/STATUS.md:75`) | The owner's ruling | The owner |
| GATE-3 | Naming a place: a hand check that the places exist and are the kind stated, and how many fitting searches have one nearby (review measures MS-2, MS-3; old spec GATE-1) | GATE-2 | The owner; G5's candidate is at `docs/goals.md:83` |
| GATE-4 | Named places pass the Worker's two blocklist passes and carry the chain badge and record line | A Worker change | A rule, no bar |
| GATE-5 | The independent-ownership reading is ruled (section 4) | BD-16 (independent ownership) | The owner |
| GATE-6 | Score boost: the owner schedules it (`docs/goals.md:23`, "not scheduled") | The owner | The owner |
| GATE-7 | Score boost: a place's kind reaches Checked, or the owner amends "A Likely or In general item never changes a score" (`docs/goals.md:67`) | GATE-6 | The owner |
| GATE-8 | Score boost: the open ruling on whether ethics and environment leave the default order comes first (`docs/STATUS.md:157`); and repair shops can enter the ranked list at all (lens 11 LG-9 says a "service" candidate is dropped today; not reopened) | The owner | The owner, then a graded run |

Version one does not block these: kind ids are stable and can join to a later response field (lens 14 LT-1).

## 8. What carries over from the thrift store pilot spec, and what does not

The full list is the triage's section 7 (CARRY-1 to CARRY-16) and sections 2 to 4.

| Label | Carried | Where it lands here |
|---|---|---|
| CO-1 | Two claims stay apart: what a kind of place offers, and what is known about one place (triage CARRY-1) | 2a, 2d: version one makes only the first |
| CO-2 | The browser decides from fields the response carries; a site push alone (CARRY-2; old spec section 2b, "PH-1b, the sentence") | 2e |
| CO-3 | Code sets every level; every phrase is a fixed string; nothing says a place has the item (CARRY-3, CARRY-10) | 2a, TEST-1 (the sentence test) |
| CO-4 | An allow list with keep-out words checked first, in code, with no normalize prompt change (CARRY-4, CARRY-5) | 2b; ALT-7 (a model-picked group) |
| CO-5 | The free-text category is loose: 27 wordings for 20 products (CARRY-6) | 2b, widened: no row reads it |
| CO-6 | The four marks as words; meaning beside the mark; "likely" is taken (CARRY-7 to CARRY-9) | 2d, with the mark word changed |
| CO-7 | Saved source pages for the used sentence and the keep-out list (CARRY-11), read with the claim check's corrections (CARRY-12) | 2a, 2b. The Goodwill page is no longer a shown source (BARK-3, thrift stores) |
| CO-8 | Tests over saved responses (CARRY-15) | TEST-3, TEST-4 |
| CO-9 | The named-store block, its hand check and gates (CARRY-16) | Section 7 only |
| CO-10 | Old spec decisions TD-3 (whether the "never changes a score" rule covers the model's sells-it reading) and TD-7 (one definition of the Checked mark) | Not needed for version one; left open |

**Does not carry:** the block of up to 3 named thrift stores, the extra place search, clothing as the only group, the position after the ranked shops, and the old spec's sections 1, 3 and 9 (triage section 3). The old "existing solutions and data feeds" section has no successor here: its feed rows serve a later version, the paid rows among them stay ruled out ("We can't purchase data feeds.", `docs/goals.md:79`), and research 06 replaces its product rows with one finding, that no tool found shows a kind-of-place idea beside product results.

**The earlier critique's open rows** (`OLD/31-adversarial-critique.md`, written "old CRIT"; triage section 4):

| Old critique row | Home |
|---|---|
| Old CRIT-2, "likely" already means "likely sells it" | Answered: no sentence uses it, and TEST-1 fails on it |
| Old CRIT-5, second half: the design needs a way to fail | BD-3 (the fail bar) and section 5's candidates; until the owner sets the bar, RISK-9 (nothing shows it works) |
| Old CRIT-6, the smaller rival | Answered: it is this design. Its two cautions are met: no row reads the category, and there is no link |
| Old CRIT-8, a prompt change touches every search | Answered: no prompt change (ALT-7) |
| Old CRIT-10, the block tilts to large operators | The triage parked it for named places. It applies here too: the one thrift page named a large operator. Answered by taking names off the face (BD-9, a source's name) and holding SEN-4 (thrift stores) |
| Old CRIT-11, unsourced claims in the design's own text | Answered for sentences (TEST-1) and by showing no caution. The note (STR-2) is the site describing its own search and has no outside source: UNV-8 (nothing was rendered) |
| Old CRIT-12, the keep-out list is mostly judgment | Carried as RISK-3 (a missed keep-out word); the allow list and MATCH-5 (a row word must end the product) limit it |
| Old CRIT-13, too many lists and rulings for one person | Carried as RISK-8 (upkeep) |

**The new critique on the triage** (critique CRIT-13). The adversary checked three triage verdicts against the files and each matched. Its three findings, and what this spec does with them; the triage file is not edited:

- Old CRIT-10 was parked too early: the row above.
- An old framing came through with the Goodwill page, and with it the Amazon link: SEN-4 is held (BARK-3).
- The kept file `OLD/02-certainty-marks-elsewhere.md` holds a row the draft did not use, MARK-8 (FTC guidance: an advertising label goes near the headline): now used in RISK-7 (read as map places or an ad).

## 9. Concerns and risks

"How likely" is the lenses' judgment, no source.

| Label | Risk | How likely | What would show it early |
|---|---|---|---|
| RISK-1 | A sentence with no place tells a shopper nothing new and gives nothing to act on (triage CARRY-13; research 06 LEAD-4). That thrift stores sell clothing is likely known to most adults (the critique's judgment, no source) | Likely for some sentences | MEAS-1 (the owner's read) weakly; MEAS-4 (the log marks) |
| RISK-2 | The owner's own example falls short: no used idea for a drill, a repair café in place of a tool repair shop. The kinds that pass today are public or volunteer-run and the ones that do not are shops, so the list sends shoppers away from local businesses more than the owner's sentence does (critique CRIT-4) | Follows from the sources read | PH-R (source research); BD-4 (the drill example) |
| RISK-3 | A kept-out good ends in a row word nobody thought of, and its keep-out word is missing | Might | TEST-3 (the keep-out test); the owner's own probe strings in PH-0 (the owner's read and sign-off); RT-10 (fresh probe strings) |
| RISK-4 | Brand or model searches show nothing, and so does a product typed with words after the noun ("drill 20V", "jacket for men") | Likely; how often is not known, and no saved search holds such a name | Brand and trailing-word strings in the PH-0 list; the ten-purchase log |
| RISK-5 | The list shows rarely (2 or 3 of 20 test products), so the measure has few lines to read | Likely | MEAS-5 (how often it shows) |
| RISK-6 | In general is stretched on its first use: each sentence rests on two to four pages picked from search results (research 01 line 9, sample caveat), and says "often" where the level means "most" | The stretch is a fact; whether it matters is the owner's call | BD-2 (the level and the hedge); RT-1 (more pages per kind) |
| RISK-7 | In stage two, the list above a map of pins is read as places on that map, or a right-hand text block is read as an ad (lens 13 PRISK-1, PRISK-2). FTC guidance puts an advertising label near the headline (`OLD/02-certainty-marks-elsewhere.md:22`, MARK-8), which is where this list's own label sits | Not known | RT-5 (a local mock); one reader shown a mock |
| RISK-8 | Upkeep: sources rot (three 404s in one day of research), and three lists is one more thing for one person (G4). No check catches a source that changes its advice while keeping its words | Likely over a year | The source-check script in PH-1 (data and matcher) |
| RISK-9 | Nothing can show the list works except the owner's log, which may hold few lines where an idea showed; G6's pass mark is unset | Likely | BD-3 (the fail bar) before PH-1 |
| RISK-10 | The measured map margin (DEP-2, the map pushed down) proves fragile | Not known; not built | RT-5; fallback ALT-6 (a band above) |
| RISK-11 | A recalled product cannot be caught by words, and the used idea carries no recall line (lens 12 RISKC-9) | Might | None in version one; ALT-9 (a sourced caution) |
| RISK-12 | Absent for a keep-out good looks the same as absent for an unlisted product | By design | None; accepted |
| RISK-13 | If the prototype is built later, its wide layout is a filter rail, a table and a right panel, with no slot for this list (`docs/ui-prototype/design.md:99-103`; lens 13 PRISK-8). The prototype is put off until on or after 2026-12-16 (`docs/goals.md:130`) | Likely if stage two is built first | BD-10 (the first build): stage one adds nothing the prototype would discard |
| RISK-14 | The match words were tuned to the walk-through's failing cases, so the rerun's 0 unsafe shows is a result on known cases only | Likely that new strings find new misses | RT-10 |
| RISK-15 | With "often" in the sentence and "In general" in the note, a reader sees two hedges and no number | Not known | RT-6 (kind against place) |

## 10. Open research topics

| Label | Question | Why it matters | Cheapest way |
|---|---|---|---|
| RT-1 | More pages per kind, so "often" or "most" rests on more than a search-picked handful | BD-2 (the level and the hedge), RISK-6 (the level stretched) | Read 5 to 10 more lender pages (research 01 RT-4) |
| RT-2 | Used tool shops: two pages from two organizations. Repair shops: one more page, one that names tool repair | The owner's two examples; RISK-2 (the drill example falls short). Run as PH-R (source research) | Desk research (research 02 RT-R3, research 03 RT-1) |
| RT-3 | A primary source on used helmets and boosters | KOUT-1, KOUT-2 | Standards bodies and makers (research 04 RT-3) |
| RT-4 | What the normalize step returns for about 30 brand, model, misspelled and keep-out inputs | DIS-1 (which fields show an idea), ALT-5 (the model's name), MEAS-3 (the keep-out test) | Needs model calls, so the owner's approval; or the ten-purchase log |
| RT-5 | Render the wide layout, the band above and the narrow line with the real sentences at 1280, 1024 and 360 | Replaces every by-eye height; RISK-7 (read as map places or an ad), RISK-10 (the fragile map margin); BD-12 (the width for beside) | A local mock, no deploy |
| RT-6 | Do readers tell a statement about a kind from one about a place | 2d; RISK-15 (two hedges) | No research exists (old spec RT-7); whether to run any: TBD, the owner to fill |
| RT-7 | More library-of-things pages for camping gear, instruments, sewing machines | The dropped tent row | Desk research (research 01 RT-4) |
| RT-8 | Whether the page fetch script reads PDF text | Whether the source check covers CPSC and FDA sources | One local run (lens 14 RQ-2) |
| RT-9 | A page from a thrift operator or trade body that says what thrift stores sell, with no link to an Amazon store, and a second organization for the goods named | SEN-4, the only used sentence in the first set. Run as PH-R | Desk research (lens 12 RTC-2) |
| RT-10 | Fresh probe strings from a reader who has not seen the match words: kept-out goods by other names, accessories, names with words after the noun | RISK-3 (a missed keep-out word), RISK-14 (words tuned to known cases) | The owner's own list in PH-0 (the owner's read and sign-off); one more agent pass, no search calls |

## 11. Adversarial critique and responses

"Serious" is the adversary's own rating (critique, table "The critique"). Responses are the final writer's.

| Label | The critique | Serious | Response | Where the spec changed |
|---|---|---|---|---|
| CRIT-1 | The sentences state as flat fact what the counts do not support, at a level G3 defines as "most"; the repair café source describes itself; the thrift sentence infers sales from one region's donations | Changes the design | Accepted | "Often" in every sentence (2a); DIS-3 (the level); BD-2 (the level and the hedge) says no sentence is shown to meet "most"; SEN-4 (thrift stores) held |
| CRIT-2 | Three named organizations on the face of a list ruled to name no place; a source with a date is the dress of Checked | Changes the design | Accepted | STR-3 (an entry), STR-4 (the Sources button), DEP-6 (the Sources button), MRK-4 (the Checked mark), DIS-4 (sources on the face); the reading is asked alone as BD-9 (a source's name) |
| CRIT-3 | The only link under the thrift sentence leads to a page with an Amazon store link; do not ask the owner to bless it | Changes the design | Partly accepted. The source is dropped and the owner is not asked to accept the link. Not done as asked: the page search is a script run by hand and stays out of TEST-5 (the blocklist test), because the saved pages are git-ignored and a test in CI cannot read them | BAR-A (the source bar) part (3); SEN-4 held; RT-9 (a clean thrift page); the source check in PH-1 (data and matcher) searches each page for blocklist names; DEF-6 (no source page with an Amazon store link) |
| CRIT-4 | The owner's drill example gets one of three kinds; the source bar was uneven, and the kinds dropped are the shops | Blocks version one | Accepted as a planned step: PH-R has not been run | One bar, BAR-A, applied to every kind (2a, BD-1, the source bar); PH-R (source research) runs RT-2 (pages on used tool shops and repair shops) before the owner's read; SEN-3 (repair cafés) widened from a second page so the drill's repair cell meets lens 12's RULE-1 (the sentence names the row's goods); the gap is in sections 1 and 3 and BD-4 (the drill example) |
| CRIT-5 | The owner's read tests value on the reader who proposed the kinds | Changes the design | Partly accepted. MEAS-1 (the owner's read) stays as a cheap filter and is labeled weak; the log (MEAS-4, the log marks) is the test, and the cheap form is built first. Not changed: no other reader is proposed, since outreach is deferred and no user research exists | Section 5; BD-3 (the fail bar); BD-10 (the first build) |
| CRIT-6 | A row fires on any listed word, so accessories inherit the idea; adopt the children's default before the build | Changes the design | Accepted | MATCH-5 (a row word must end the typed product), MATCH-6 (no bare "chair"); KOUT-4 (children's goods words); the rerun counts in 2b |
| CRIT-7 | Most keep-out groups never act under an allow list; one misfires; no check catches changed advice | Worth a note | Partly accepted. The groups that cannot collide moved out of the matcher. They stay as test strings, since a later row could let one in. "Medical" is gone | Keep-out and watch tables (2b); ALT-20 (the full keep-out list); RISK-8 (upkeep) |
| CRIT-8 | Two page choices were hidden in a bundle: no list when no shop matched, and the 64rem to 80rem band | Changes the design | Accepted | BD-11 (no shop matched) and BD-12 (the width for beside), each asked alone; the default of ST-9 (no shop matched) reversed |
| CRIT-9 | The layout is the costliest and least sure part; the prototype has no slot for it; the ruling says beside and does not say above the map | Changes the design | Accepted as a staged build, which is the owner's decision | Stages in 2c and 2e; BD-10; RISK-13 (the prototype has no slot); ALT-2 (the wide layout first) |
| CRIT-10 | Three drifts the departures table missed: heading type, the word "unknown", the note's color | Worth a note | Partly accepted. One row added; the other two are fixed in the strings, so no departure is left to list | DEP-7 (the heading style); STR-2 ("was not looked up", muted ink) |
| CRIT-11 | "This idea fits your product" is the claim that matters and carries no level or source; the old marks were never ruled | Changes the design | Accepted | STR-2 ("picked by hand"); 2d; BD-14 (the mark) |
| CRIT-12 | Hard to fail: every failing result sits on a candidate bar the owner has not set | Blocks version one | Accepted | BD-3 moved into the blocking group; the candidate bars CAND-1 and CAND-2 (section 5) to accept or change; PH-3b (the wide layout) waits on the bar |
| CRIT-13 | The triage's verdicts hold; one old critique row was parked too early; the fifth kind might be carried framing | Worth a note | Accepted | Section 8; three kinds (BD-5, how many kinds); RISK-7 (read as map places or an ad) |
| CRIT-14 | The suggested default for independent ownership is the reading under which nothing changes | Worth a note | Accepted. The brief for this spec asks for a suggested default on every decision; BD-16 (independent ownership) says "none" and why | Section 4; BD-16 |

The critique's rivals: ALT-S (the collapsed line, three kinds, sources behind a button) is now the recommended first build. ALT-Z and ALT-N are ALT-14 and ALT-21.

**Critiques that still stand**

- CRIT-4: the owner's example is two thirds filled. The repair idea is a volunteer event, and no used idea shows until PH-R finds pages. If it finds none, BD-4 puts the gap to the owner.
- CRIT-5: nothing tests the list on a shopper other than the owner.
- CRIT-1: "often" is honest wording, and the level is still stretched. Only more pages (RT-1, more pages per kind) or the owner's ruling (BD-2) settles it.
- CRIT-6: MATCH-5 stops the accessory cases the adversary and the walk-through found. The words were fixed against those same cases (RISK-14, words tuned to known cases).
- CRIT-12: the bars are candidates. Until the owner sets BD-3, the design cannot fail.
- The size of the spec: the adversary counted 17 owner decisions in the draft. This spec has 16 and takes 6 defaults without asking (section 12).

## 12. Decisions for the owner

**Owner rulings, 2026-11-17 (after this draft; sections above not yet revised):**
- OR-1, Amazon scope: only Amazon, Amazon-owned companies and products hosted on Amazon are disqualified. A company or page that links to Amazon is not disqualified as a source or a store. BAR-A part (3) and DEF-6 are overruled; the Goodwill page and the NARTS page qualify, and CRIT-3 is answered.
- OR-2, lived experience: "Thrift stores often sell donated clothes" needs no outside source; the owner's lived experience is enough. SEN-4 (thrift stores) is no longer held on sources.
- OR-3, owner's word: any common-knowledge sentence the owner signs may ship on the owner's experience; outside sources are optional. This replaces BD-1 (BAR-A) and answers BD-4 (b): tool repair shops and used tool shops can have sentences without PH-R.
- OR-4, fail bar: no formal pass mark or fail bar; the owner judges by using it. Answers BD-3; CAND-1 and CAND-2 are not adopted.
- OR-5, kinds (answers BD-5): seven kinds in version one: tool library, tool repair shop, used tool shop, thrift store, repair café, library of things, building-material reuse center. Each gets one sentence the owner signs.
- OR-6, safety (answers BD-6, BD-8; BD-7 default): stay silent for car seats, helmets, children's goods and the watch-list goods; exceptions may be added later.
- OR-7, placement (answers BD-10): the collapsed line at every width first, then "beside" on wide screens after a mock-up.


**Blocking the first steps: source research (PH-R), the owner's read and sign-off (PH-0), data and matcher (PH-1)**

| Label | Decision | Options | Suggested default | Waits on it |
|---|---|---|---|---|
| BD-1 | The source bar: what makes a kind's sentence "sourced" | BAR-A (two organizations, operators' own pages count, no shown page links to an Amazon store); stricter (one page must be from an agency or trade body); looser (one page read) | BAR-A | PH-R's scope; which kinds enter |
| BD-2 | The level and the hedge. On today's counts no sentence is shown to meet G3's "most" (`docs/goals.md:64`); SEN-4 (thrift stores), if it returns, rested on one region | "Often" in the sentence, marked In general, the stretch accepted; attribute each sentence to its source and mark it Checked; reword G3's "most", which is an agent's wording in an inferred section and no ruling of the owner's | "Often", In general, G3 unchanged | TEST-1 (the sentence test), the data file |
| BD-3 | G6's pass mark and fail bar, set before any code | Section 5's CAND-1 to CAND-4, changed as the owner sees fit | TBD, the owner to fill. The agents suggest starting from CAND-1 and CAND-2 | PH-1; PH-3b (the wide layout); GATE-1 (version one has not failed) |
| BD-4 | The drill example. (a) May SEN-3 (repair cafés) name "electronics and power tools" on the strength of the Open Repair Alliance report and one Vermont café's line? (b) If PH-R finds no page for used tool shops or tool repair shops, what shows? | (a) Yes; or the narrower sentence ("clothes, furniture, electrical appliances and bicycles"), and a drill shows borrow only. (b) Nothing; the EPA line (ALT-4); a sentence on the owner's dated judgment (old spec decision TD-14) | (a) Yes. (b) Nothing | TRG-1 (power tools), TRG-9 (small appliances and electronics) |
| BD-5 | How many kinds in the first set | Three; five (ALT-1, five kinds) | Three | The data file |
| BD-6 | Car seats and helmets: out of all three ideas, silently, though NHTSA and CPSC say check first | Keep out; show with a caution | Keep out | KOUT-1 (car seats), KOUT-2 (helmets) |
| BD-7 | Goods that are fine only after a check, and goods with no source either way. Named cases: used furniture and used power tools; doors and windows with old paint (lead, if the reuse center row is added); play yards, high chairs, strollers and swings ("check first", WATCH-2, high chairs and similar); e-bikes; sofas; bike trailers; socks, towels, toys, knives; protective clothing (welding jacket, hazmat coat, lab coat show repair and used through TRG-5's "jacket" and "coat") | Hidden; shown with a caution (ALT-9, a sourced caution); shown on the owner's judgment | Hidden; the owner adds rows by judgment, each marked as such | The table |
| BD-8 | Children's goods. Unsafe case if let in: a child's bike seat or bouncer chair sent to volunteer repair | Keep "kids", "child", "children's" and the like out of every idea (KOUT-4, children's goods words); decide row by row | Keep out of every idea until ruled, which fails closed. It hides "kids bike" and "baby name book" | KOUT-4 |

**Blocking the list on screen (PH-3a, the collapsed line) or later**

| Label | Decision | Options | Suggested default | Waits on it |
|---|---|---|---|---|
| BD-9 | A fixed point's reading: does "no named place" (`docs/goals.md:89`) cover the name of a source, such as "Denver Tool Library", and may the panel link to the page? | Names only behind the Sources button; names on the face (ALT-18); host names only | Behind the button | STR-3 (an entry), STR-4 (the Sources button) |
| BD-10 | A ruling departed from: build the collapsed line at every width first, and "beside" after a mock and the fail bar? | Line first, then beside; beside from the start (ALT-2, the wide layout first); a band above (ALT-6) | Line first | PH-3a, PH-3b |
| BD-11 | Show the list when no shop matched | Yes, under the "no results" message; no | Yes: the list does not depend on a shop (agent's judgment, no source). Cost: one new state for the results area | ST-9 (no shop matched) |
| BD-12 | Stage two only: the width from which the list is beside | 80rem (DEP-3, the second width); 64rem, where the site already puts the map beside | 80rem, to be checked against the mock (RT-5) | PH-3b |
| BD-13 | A fixed point argued: a link to a directory or map search for the kind (ALT-3, a place or a link) | None; a link with no place in it | None in version one; ask again after MEAS-4 (the log marks). Any link must carry no zip ("The zip code stays in the browser", `docs/goals.md:56`; `docs/privacy.md:7`) | PH-3a |
| BD-14 | The mark. One at the heading or one per line; and is "picked by hand for this kind of product" enough for the fit, which has no level | Heading; per line. Note as written; a level for the fit | One at the heading; the note as written | STR-2 (the note) |
| BD-15 | The log: a "how it ended" field, and does an idea count toward G1a | Add or not; count or not | Add the field, read for G6 only; not toward G1a. Proposed line for G6, not applied: "Ideas are not counted in G1c, G1d or G2." | PH-4 (measuring) |
| BD-16 | Independent ownership (section 4) | RD-1, RD-2, RD-3 | None (section 4) | GATE-5 (the ownership ruling), not version one |

**Defaults taken without asking.** Each fails closed or follows an existing pattern; the owner can overturn any in review.

| Label | Default | Basis |
|---|---|---|
| DEF-1 | Ideas show on the shopper's typed words only (DIS-1, which fields show an idea) | A model misreading can hide and never show |
| DEF-2 | A row word must end the typed product (MATCH-5) | Costs wrong hides, and removes the accessory and part cases the walk-through found |
| DEF-3 | The owner signs every row, word and expected result (PH-0) | Lens 14 OW-2 |
| DEF-4 | The narrow line starts closed on each new search; "What unknown means" is not renamed | Lens 13 NAR-4, POD-9 |
| DEF-5 | Sources are re-checked before each edit and once a year; no dispute link in version one, since how disputes are handled is still open (`docs/STATUS.md:149`) | Lens 14 UP-3 |
| DEF-6 | No page that links to an Amazon store is shown as a source | Critique CRIT-3; the strict reading of "Amazon and Amazon-owned businesses never appear" (`docs/goals.md:53`) |

## 13. What is unverified

| Label | Claim | Rests on |
|---|---|---|
| UNV-1 | Kinds with no sentence that passes: thrift stores, repair shops, used tool shops, used bookstores, refurbished electronics sellers | Research 02 and 03 found too few pages; PH-R (source research) was not run |
| UNV-2 | That each sentence holds "often", let alone for "most" places of its kind | 4 tool-lending pages that name kinds, 4 library-of-things pages, one organizer and one alliance report, one EPA page and one Habitat page; lender pages picked from search results (research 01 line 9). SEN-2 uses "household" and "kitchen equipment", which are not on the pages (they say "tools, kitchen items" and "kitchen gadgets, tools"); SEN-5's goods come from EPA's list for reuse centers, which EPA calls a small share of reuse outlets |
| UNV-3 | The source bar BAR-A itself; every empty cell and exception in the 2b table; every match word; the words in KOUT-3 and KOUT-4; box springs, makeup beyond eye products, alarms in the watch list | Agent's judgment, no source |
| UNV-4 | That repair cafés are among the "community repair events" the Open Repair Alliance report counts, which "electronics and power tools" in SEN-3 (the repair café sentence) leans on | One step of inference by the final writer; the report page was read, its method page was not. The report page names "electronic products" at community repair groups since Repair Cafés began (`BYB/pages/repair/openrepair.org_open-data_insights_2024-report.txt:38`), which supports "electronics". "Power tools" rests on an average-age figure (`:43`) and one café's line on a Vermont agency page |
| UNV-5 | Keep-out rows whose firmest source is a trade group or says "check first": KOUT-1, KOUT-2, WATCH-2, WATCH-4, WATCH-6; boosters and medical devices have no government source; tires rest on one press list | Research 04 |
| UNV-6 | The matcher on real input: 0 of 1,101 saved responses hold a keep-out good; the 118 walk-through products and the 38 probe strings are agents' picks; the words were changed after seeing the failures; the rerun's grades are the final writer's hand count against the walk-through's "should show" column | `BYB/41-final-rules-rerun.out.txt`; walk-through, "What I could not test" |
| UNV-7 | The collision rule MATCH-7 (two rows joined) and the two-word rule MATCH-6 (no bare "chair") | The final writer's judgment |
| UNV-8 | The note (STR-2) and every other string, sketch, height and layout claim; the Sources button; the grid and measured margin; `details` behavior in screen readers; that the layout is the largest share of the build | Nothing rendered or built (lens 13 section 8) |
| UNV-9 | Research 04's quotes and research 01's fee rows | Reopened by the claim check, not by the final writer |
| UNV-10 | That Vite bundles a JSON import from `data/`, and that the deploy script reports nothing to do for it | Not tried (lens 14 section 8) |
| UNV-11 | Section 4's file-by-file changes, GATE-8's "service" rule, and the schema citation in ALT-21 (pointing at a shop in the results) | Lens 11 and the critique, not reopened |
| UNV-12 | The saved-response file count: 1,448 JSON files in lens 12's count output, 1,449 in lens 14; both read 1,101 responses, as did the rerun today | Likely a difference in the folders counted (claim check, closing notes); not counted today |
| UNV-13 | "No tool found" that shows such a list | 4 searches (research 06); not found is not none |
| UNV-14 | All "how likely" cells in section 9, and every number in CAND-1 and CAND-2 | Lenses', the adversary's and the final writer's judgment |
| UNV-15 | Only the word "amazon" was searched for in the saved source pages; other blocklist names were not | The final writer's search today, with a control count |

## 14. Sources

**Repo files read today by the final writer:** `docs/goals.md` (all); `docs/STATUS.md` (lines 71 to 76); `src/render.ts` (lines 104 to 110, 300 to 318); `src/main.ts` (lines 52 to 62, 156 to 168); `src/styles.css` (lines 172 to 194, 354 to 360); `docs/ranking.md` (lines 80 to 86); `docs/privacy.md` (lines 5 to 11); `docs/ui-prototype/design.md` (lines 95 to 104); `data/blocklist.md` (matched lines). Every other repo citation is the working draft's, and the claim check matched 43 of its 46 line cites; the three it flagged are corrected here.

**Working files (BYB), all read in full:** `00-triage.md`; `01-research-borrow.md`; `02-research-repair.md`; `03-research-used.md`; `04-research-keep-out-goods.md`; `06-research-gaps.md`; `11-lens-aims-and-goals.md`; `12-lens-content-and-lists.md`, and of its count output `12-count-match-fields.out.txt` lines 16 to 20 and 104 to 107 (the other lines cited from it are the working draft's, matched by the claim check); `13-lens-placement-and-marks.md`; `14-lens-build-and-upkeep.md`; `20-working-draft.md`; `31-adversarial-critique.md`; `32-list-walk-through.md` with `32-walk-through.py`; `33-claim-check.md`. Written by the final writer: `41-final-rules-rerun.py` and `41-final-rules-rerun.out.txt`. Saved pages under `pages/borrow/`, `pages/repair/`, `pages/used/`, at the lines cited in 2a. From OLD, by label or line only: `02-certainty-marks-elsewhere.md` (line 22), `13-lens-shopper-and-marks.md`, `31-adversarial-critique.md` (through the triage), and saved pages under `pages/data-sources/` (the Goodwill, Habitat and NARTS pages, at the lines cited).

The working folder is git-ignored (`~/.config/git/ignore:6`), so these files are on this machine only.

**URLs.** The final writer opened none; it read the saved copies. Opened by the researchers on 2026-11-17 and used above:

- https://lacountylibrary.org/tools/
- https://denvertoollibrary.org/tool-library
- https://communityhomeworks.org/programs/tool-library/
- https://riversideca.gov/library/library-services/riverside-tool-lending-library
- https://www.readingpl.org/library-of-things
- https://www.wilmingtonlibrary.org/library-of-things/
- https://www.repaircafe.org/en/about/
- https://www.repaircafe.org/en/faq/
- https://openrepair.org/open-data/insights/2024-report/
- https://dec.vermont.gov/waste-management/solid/materials-mgmt/how-can-i-waste-less/reusevt
- https://goodwillng.org/ways-to-support/donate-goods/items-we-do-and-dont-accept/ (saved by the earlier run)
- https://www.habitat.org/restores (saved by the earlier run)
- https://www.narts.org/state-of-resale (saved by the earlier run)
- https://www.epa.gov/smm/best-practices-reducing-reusing-and-recycling-construction-and-demolition-materials
- https://www.epa.gov/climate-change/what-you-can-do-about-climate-change-waste
- https://www.narts.org/product-safety-in-resale (saved by the earlier run)
- https://www.nhtsa.gov/car-seats-and-booster-seats/used-car-seat-safety-checklist
- https://www.fda.gov/consumers/consumer-updates/what-know-when-buying-or-using-breast-pump
- https://www.theuiaa.org/safety/buyingclimbinggear/
- https://www.portland.gov/bps/sustainability/resourcefulpdx/find-something
- https://faircado.com/faq/

The full URL lists, with what was blocked or returned 404, are in each research file and in the `index.jsonl` of each pages folder.
