# Blocklist provenance

`blocklist.json` lists the domains and local business names that never appear in results. This file records where each entry comes from, the matching rules, and every change.

## Sourcing rule

An entry stays if a cited public source shows the business was Amazon-owned at any time. Closure or rebranding never removes an entry. Entries that cannot be sourced are left out and listed under "Not included".

Primary sources are two Wikipedia articles: [Amazon (company)](https://en.wikipedia.org/wiki/Amazon_(company)) and [List of Amazon products and services](https://en.wikipedia.org/wiki/List_of_Amazon_products_and_services). [List of mergers and acquisitions by Amazon](https://en.wikipedia.org/wiki/List_of_mergers_and_acquisitions_by_Amazon) corroborates dates.

**Amendment.** The original rule accepted only the two primary articles. That would drop the short-link domains (`amzn.to`, `amzn.com`, `a.co`), which are the most common Amazon URL shape in the wild. The rule is amended to also accept:

- a dated HTTP redirect from the domain into an already-blocked domain, observed on the check date;
- the Wikipedia article of an already-sourced subsidiary;
- for "Amazon Style" only, a news report (it has no Wikipedia mention).

Entries resting on these secondary sources carry `status: pending-rule-amendment`. The filter ignores `status` and blocks them like any other entry; to reverse the amendment, delete those rows rather than change their status. Over-blocking is the safe side.

## Matching rules

- **Domains.** The input's registrable domain is found with the public suffix list (`tldts`, after WHATWG URL parsing). `exact` entries match that registrable domain, and also the host itself or any host ending in `.` plus the entry, because a suffix missing from the list (`com.be`) would otherwise leave `amazon.com.be` with the registrable domain `com.be`; `label-any-suffix` entries match its label under any public suffix (`amazon` matches `amazon.com`, `amazon.co.uk`, `amazon.de`). Subdomains match their registrable domain. Private suffixes are not applied, so `mybucket.s3.amazonaws.com` resolves to `amazonaws.com` and `amazon.github.io` to `github.io`.
- **Names.** Both the name and the entry are normalized: every run of punctuation, symbols or whitespace turned into one space, then NFKC, then NFD so an accent NFKC composed into its letter is split off again, lowercase, format characters and combining marks dropped, NFC, then the spacing pass again. Spacing symbols before NFKC keeps "™" from folding into "TM" and fusing with the word before it. A `prefix-word` entry blocks a name that equals it or starts with it plus a space, unless the name equals or starts with one of the entry's `except` names; an `exact` entry blocks only an equal name. The name is also tried with a zero-width character read as a space, so it cannot hide a word break either way, and with plain NFKC first, so a symbol that folds to a letter ("Ⓐmazon") reads as that letter. Accented lookalikes fold to plain letters ("Amazoń Fresh" reads as "amazon fresh"); a name with a real accent folds the same way, which over-blocks at worst.
- **URLs.** A URL is blocked if its scheme is not http or https, or its host is blocked by the domain rule. The path, query and fragment are then percent-decoded once (a malformed sequence counts as blocked), and every embedded URL and, separately, every host-like token is checked with the domain rule, so a host nested inside a second embedded URL is still seen. This catches affiliate redirectors and deal pages that carry an Amazon link in a query string, path or hash route.
- **Query scrub.** Model-written query text has "amazon" and every name entry removed as whole words, tolerating format characters and combining marks inside a word. The text is matched after NFKC and NFD, so an accent composed into a letter is a mark too; other text is left as written.
- **Text mentions.** After both passes, a result whose title, name, snippet or matched product contains the word "amazon", or a glued name entry such as "AmazonBasics", is dropped, and so is a signal whose claim does. The text is read the same ways as a name, so fullwidth, math-alphabet and zero-width spellings count.
- **Missing domain.** A candidate with no registrable domain is blocked. Upstream code drops unparsable URLs before filtering, so a missing domain at the filter means a bug or an injected row.
- A local result with a listed website domain is blocked regardless of name.

**Name-rule amendment.** The original rule blocked a name equal to an entry or starting with it plus one of six separators (` - `, ` #`, ` (`, `,`, ` at `, ` in `). Normalization strips four of those separators before they can be matched, so the rule cannot be implemented literally. The rule here, "punctuation becomes a space, then equality or word prefix", covers all six and also en dashes, colons, pipes, slashes and `.com`. Two consequences:

- It over-blocks a plain-space suffix: "Whole Foods Market Midtown" and "Amazon Fresh Pickup" are blocked. Local listings often use that shape.
- The bare "Whole Foods" entry would also block "Whole Foods Co-op", an independent grocer. It is `prefix-word` with the exceptions "Whole Foods Co-op" and "Whole Foods Cooperative", so "Whole Foods - Midtown" is blocked and the co-op stays allowed.

The bare "Amazon" `prefix-word` entry catches store formats the other entries miss (Amazon Hub Locker, Amazon Hub Counter, Amazon Fresh Pickup). A name with "Amazon" mid-name, such as "The Amazon Cafe", or a longer word, such as "Amazonia Plants", stays allowed.

Test fixtures use the placeholder neighborhood "Midtown" for local names.

## Domains

`pending` in the Status column is shorthand for `pending-rule-amendment`. Every source was fetched and the claim confirmed on 2026-09-23.

| Pattern | Kind | Status | Origin | Source | Evidence |
|---|---|---|---|---|---|
| amazon | label-any-suffix | active | seed | [Amazon (company) #Amazon.com](https://en.wikipedia.org/wiki/Amazon_(company)#Amazon.com) | "Amazon websites are country-specific (for example, amazon.com for the US and amazon.co.uk for UK)" |
| amzn.to | exact | pending | seed | HTTP redirect | `https://amzn.to/` 301 to `http://www.amazon.com/` |
| amzn.com | exact | pending | seed | HTTP redirect | `https://amzn.com/` 301 to `https://www.amazon.com/` |
| a.co | exact | pending | seed | HTTP redirect | `https://a.co/` 302 to `http://www.amazon.com/` |
| primevideo.com | exact | active | seed | [Products list #Amazon_Prime_Video](https://en.wikipedia.org/wiki/List_of_Amazon_products_and_services#Amazon_Prime_Video) | "an online video-on-demand service by Amazon" |
| wholefoodsmarket.com | exact | active | seed | [Amazon (company) #Whole_Foods_Market](https://en.wikipedia.org/wiki/Amazon_(company)#Whole_Foods_Market) | "Amazon purchased Whole Foods Market supermarket chain for $13.7 billion in 2017" |
| zappos.com | exact | active | seed | [Products list #Retail_goods](https://en.wikipedia.org/wiki/List_of_Amazon_products_and_services#Retail_goods) | "Amazon also owns other e-commerce sites like Shopbop.com, Woot.com, and Zappos.com" |
| 6pm.com | exact | pending | seed | [Zappos #Amazon_subsidiary](https://en.wikipedia.org/wiki/Zappos#Amazon_subsidiary) | "In 2009, Zappos announced an acquisition by Amazon"; the article covers Zappos's 6pm outlet, and the 6pm.com home page reads "Powered by Zappos" |
| woot.com | exact | active | seed | [Products list #Retail_goods](https://en.wikipedia.org/wiki/List_of_Amazon_products_and_services#Retail_goods) | Same sentence as zappos.com; Woot is in the Amazon (company) infobox subsidiaries |
| shopbop.com | exact | active | seed | [Products list #Retail_goods](https://en.wikipedia.org/wiki/List_of_Amazon_products_and_services#Retail_goods) | Same sentence as zappos.com |
| audible | label-any-suffix | active | seed | [Amazon (company) #Audible](https://en.wikipedia.org/wiki/Amazon_(company)#Audible) | "In March 2008, Amazon bought Audible for about $300 million" |
| ring.com | exact | active | seed | [Amazon (company) #Ring](https://en.wikipedia.org/wiki/Amazon_(company)#Ring) | "Amazon bought Ring for US$1 billion in 2018" |
| eero.com | exact | active | seed | [Amazon (company) #Other](https://en.wikipedia.org/wiki/Amazon_(company)#Other) | "Eero was acquired by Amazon in 2019 for US$97 million" |
| blinkforhome.com | exact | active | seed | [Amazon (company)](https://en.wikipedia.org/wiki/Amazon_(company)), infobox subsidiaries list | "Blink" |
| twitch.tv | exact | active | seed | [Amazon (company) #Twitch](https://en.wikipedia.org/wiki/Amazon_(company)#Twitch) | "Amazon acquired Twitch in August 2014 for $970 million" |
| imdb.com | exact | active | seed | [Amazon (company) #Subsidiaries](https://en.wikipedia.org/wiki/Amazon_(company)#Subsidiaries) | "Amazon owns over 100 subsidiaries, including ... IMDb" |
| goodreads.com | exact | active | seed | [Amazon (company) #Goodreads](https://en.wikipedia.org/wiki/Amazon_(company)#Goodreads) | "Amazon bought Goodreads in March 2013" |
| abebooks | label-any-suffix | active | seed | [Amazon (company)](https://en.wikipedia.org/wiki/Amazon_(company)), infobox subsidiaries list | "AbeBooks" |
| pillpack.com | exact | active | seed | [Amazon (company) #Other](https://en.wikipedia.org/wiki/Amazon_(company)#Other) | "PillPack, an online pharmacy. It was acquired in 2018" |
| comixology.com | exact | active | seed | [Amazon (company) #Other](https://en.wikipedia.org/wiki/Amazon_(company)#Other) | ComiXology: "Amazon bought the company in April 2014" |
| amazonaws.com | exact | active | addition | [Amazon (company) #Amazon_Web_Services](https://en.wikipedia.org/wiki/Amazon_(company)#Amazon_Web_Services) | AWS is Amazon's; see rationale below |
| souq.com | exact | active | addition | [Amazon (company) #Other](https://en.wikipedia.org/wiki/Amazon_(company)#Other) | "Amazon acquired Souq.com for $580 million"; `https://souq.com/` 302 to `https://amazon.ae:443/` |
| diapers.com | exact | active | addition | [Amazon (company) #Subsidiaries](https://en.wikipedia.org/wiki/Amazon_(company)#Subsidiaries) | "Amazon owns over 100 subsidiaries, including ... Diapers.com" |
| bookdepository.com | exact | active | addition | [Mergers list](https://en.wikipedia.org/wiki/List_of_mergers_and_acquisitions_by_Amazon), row "The Book Depository", 2011-07-04 | Also in the Amazon (company) navbox; `https://bookdepository.com/` 301 to `https://amazon.com/books` |
| fabric.com | exact | pending | addition | HTTP redirect | `https://fabric.com/` 301 to `https://www.amazon.com/fabric/b/` |
| amzn.eu | exact | pending | addition | HTTP redirect | `https://amzn.eu/` 302 to `http://www.amazon.co.uk/gp/amazon-eu.html` |
| vine.com | exact | active | addition | [Products list #Retail_goods](https://en.wikipedia.org/wiki/List_of_Amazon_products_and_services#Retail_goods) | "In 2012, Amazon announced the launch of Vine.com" |
| wag.com | exact | active | addition | [Products list #Retail_goods](https://en.wikipedia.org/wiki/List_of_Amazon_products_and_services#Retail_goods) | Quidsi, "the company that Amazon bought in 2010 that also runs the sites Diapers.com (baby), Wag.com (pets), and YoYo.com (toys)"; `https://wag.com/` 301 to `https://amazon.com:443/wag/` |
| yoyo.com | exact | active | addition | [Products list #Retail_goods](https://en.wikipedia.org/wiki/List_of_Amazon_products_and_services#Retail_goods) | Same sentence as wag.com |
| wondery.com | exact | active | addition | [Amazon (company)](https://en.wikipedia.org/wiki/Amazon_(company)), lead section | "Amazon distributes downloadable and streaming content through its ... Wondery units"; domain from the [Wondery](https://en.wikipedia.org/wiki/Wondery) infobox; mergers list row dated 2020-12-30 |
| mgm.com | exact | active | addition | [Amazon (company)](https://en.wikipedia.org/wiki/Amazon_(company)), lead section | "Amazon MGM Studios, including the Metro-Goldwyn-Mayer studio"; domain from the [Metro-Goldwyn-Mayer](https://en.wikipedia.org/wiki/Metro-Goldwyn-Mayer) infobox; mergers list row dated 2021-05-26 |
| onemedical.com | exact | active | addition | [Amazon (company) #Subsidiaries](https://en.wikipedia.org/wiki/Amazon_(company)#Subsidiaries) | "Amazon owns over 100 subsidiaries, including ... One Medical"; domain from the [One Medical](https://en.wikipedia.org/wiki/One_Medical) infobox; mergers list row dated 2022-07-21 |
| amazon.com.be | exact | active | addition | [Amazon (company) #Amazon.com](https://en.wikipedia.org/wiki/Amazon_(company)#Amazon.com), country-site table | Row "Belgium, amazon.com.be, October 2022"; the only site in that table whose suffix is not on the public suffix list |
| amazonfresh.com | exact | pending | addition | HTTP redirect | `https://amazonfresh.com/` 301 to `http://www.amazon.com/amazonfresh` |
| wholefoods.com | exact | pending | addition | HTTP redirect | `https://wholefoods.com/` 301 to `https://www.wholefoodsmarket.com/` |
| kindle.com | exact | pending | addition | HTTP redirect | `https://kindle.com/` 302 to `https://www.amazon.com:443/kindle` |
| smallparts.com | exact | pending | addition | HTTP redirect | `https://smallparts.com/` 301 to `https://www.amazon.com/b2b/info/amazon-business?layout=landing&ref_=ab_from_smallparts` |
| createspace.com | exact | pending | addition | HTTP redirect | `https://createspace.com/` 301 to `https://kdp.amazon.com/createspace-transfer` |
| eastdane.com | exact | pending | addition | HTTP redirect | `https://eastdane.com/` 302 to `https://www.shopbop.com/shop-men?wasEastdane=true&` |

## Names (local results)

| Name | Match | Status | Origin | Source | Evidence |
|---|---|---|---|---|---|
| Whole Foods | prefix-word, except Co-op and Cooperative | active | seed | [Amazon (company) #Retail](https://en.wikipedia.org/wiki/Amazon_(company)#Retail) | "Amazon once operated various retail store brands, but later closed all save for Whole Foods" |
| Whole Foods Market | prefix-word | active | seed | [Amazon (company) #Whole_Foods_Market](https://en.wikipedia.org/wiki/Amazon_(company)#Whole_Foods_Market) | See wholefoodsmarket.com |
| Amazon Fresh | prefix-word | active | seed | [Products list #Retail_stores](https://en.wikipedia.org/wiki/List_of_Amazon_products_and_services#Retail_stores) | Store chain; Amazon (company) reports the January 2026 closure announcement |
| Amazon Go | prefix-word | active | seed | [Products list #Retail_stores](https://en.wikipedia.org/wiki/List_of_Amazon_products_and_services#Retail_stores) | Store chain; same closure announcement |
| Amazon Style | prefix-word | pending | seed | [GeekWire, 2023-11-02](https://www.geekwire.com/2023/amazon-closing-its-style-physical-clothing-stores-will-continue-investing-in-grocery/) | "close our two Amazon Style physical retail stores"; not on Wikipedia |
| Amazon 4-star | prefix-word | active | seed | [Products list #Retail_stores](https://en.wikipedia.org/wiki/List_of_Amazon_products_and_services#Retail_stores) | "Amazon announced to debut the Amazon 4-star in New York"; Wikipedia also writes "4-Star", which normalizes the same |
| Amazon Books | prefix-word | active | seed | [Products list #Retail_stores](https://en.wikipedia.org/wiki/List_of_Amazon_products_and_services#Retail_stores) | "The store, known as Amazon Books" |
| Zappos | prefix-word | active | seed | [Amazon (company) #Subsidiaries](https://en.wikipedia.org/wiki/Amazon_(company)#Subsidiaries) | Listed subsidiary |
| Woot | prefix-word | active | addition | [Products list #Retail_goods](https://en.wikipedia.org/wiki/List_of_Amazon_products_and_services#Retail_goods) | "Amazon also owns other e-commerce sites like Shopbop.com, Woot.com, and Zappos.com"; catches "Woot.com" as a listing name |
| Amazon Pharmacy | prefix-word | active | addition | [Amazon (company) #Other](https://en.wikipedia.org/wiki/Amazon_(company)#Other) | "an online prescription drug delivery service, launched in November 2020" |
| Amazon | prefix-word | active | addition | [Amazon (company)](https://en.wikipedia.org/wiki/Amazon_(company)) | The company's own trade name; catches unlisted store formats |
| AmazonFresh | prefix-word | active | addition | [Products list](https://en.wikipedia.org/wiki/List_of_Amazon_products_and_services) | "In August 2007, Amazon announced AmazonFresh"; the one-word spelling |
| AmazonBasics | prefix-word | active | addition | [Products list](https://en.wikipedia.org/wiki/List_of_Amazon_products_and_services) | "AmazonBasics is a private-label product line"; keeps the one-word spelling out of queries |
| 365 by Whole Foods Market | prefix-word | pending | addition | [Whole Foods Market](https://en.wikipedia.org/wiki/Whole_Foods_Market) | "In January 2019, it was announced that the 365 by Whole Foods Market concept would be discontinued, but the existing locations would remain open" |

## Rationale: amazonaws.com

A result whose only URL is an `amazonaws.com` host (an S3 bucket or a load balancer) puts an Amazon-owned domain on the page. Retailers with a real storefront have their own domain, so the cost is small. Not extended to `cloudfront.net` or other AWS service domains, which host many unrelated sites.

## Not included

- `buyvip.com`: the mergers list names BuyVIP (2010), but no article or redirect maps the brand to a domain, and the domain did not resolve on the check date.
- `lovefilm.com`: the LoveFilm article names Amazon as parent, but it gives an Amazon storefront as the website, not this domain, and the domain did not resolve on the check date.
- Handmade and Luxury Stores (products list): storefronts inside amazon.com, already covered.
- `amzn.asia`: no redirect observed and no Wikipedia mention.
- `media-amazon.com`, `ssl-images-amazon.com` (Amazon image hosts): no public source found.
- Nothing from the seed list was dropped.

## Change log

| Date | Change |
|---|---|
| 2026-09-23 | Initial list from the seed. Every entry checked against the two primary Wikipedia articles, or a secondary source under the amended rule. |
| 2026-09-23 | Marked amzn.to, amzn.com, a.co, 6pm.com and "Amazon Style" `pending-rule-amendment` (secondary sources only). |
| 2026-09-23 | Added amazonaws.com, souq.com, diapers.com, bookdepository.com, vine.com, wag.com, yoyo.com, wondery.com, mgm.com, onemedical.com, "Amazon Pharmacy", "Woot" and "Amazon"; added fabric.com and amzn.eu as `pending` (redirect evidence only). |
| 2026-09-23 | Replaced the six-separator name rule with punctuation-to-space word-prefix matching; the bare "Whole Foods" entry is `exact`. |
| 2026-09-23 | URL rule also checks the host, the fragment and hosts nested inside an embedded URL, and blocks non-http schemes; names also tried with plain NFKC first; recorded the precomposed-mark gap. |
| 2026-09-23 | Exact domain entries also match as a host suffix; added amazon.com.be, and amazonfresh.com, wholefoods.com, kindle.com, smallparts.com, createspace.com and eastdane.com as `pending` (redirect evidence only). |
| 2026-09-23 | Added "AmazonFresh", "AmazonBasics" and "365 by Whole Foods Market" (`pending`, subsidiary article); "Whole Foods" is `prefix-word` with co-op exceptions; names fold accents NFKC composed; text mentions read the same ways as names. |
