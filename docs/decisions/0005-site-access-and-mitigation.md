# 0005: Site access by bots, and how to mitigate it

Status: accepted. Measurement pending (see [quality.md](../quality.md)).

## Context

The site never fetches retailer pages. Every result comes from Brave Search's index, so a shop Brave cannot crawl cannot appear. How much coverage that costs is not known yet; the quality evaluation in `eval/` measures it.

What the sources say, checked 2026-09-23 (IDs point to the table at the end):

| ID | Finding |
|---|---|
| C1 | Brave's crawler "does not advertise a differentiated user agent because we must avoid discrimination from websites that allow only Google to crawl them," and "if a domain or page is not crawlable by Googlebot, then Brave Search's bot will not crawl it either." Brave says robots.txt is not used to keep a page out of the index; a `noindex` directive is. [S1] |
| C2 | On 2025-07-01 Cloudflare announced it would block AI crawlers that access content "without permission or compensation, by default," and that "every new domain will now be asked if they want to allow AI crawlers." [S2] |
| C3 | Cloudflare's "Block AI Bots" page (last updated 2026-07-01) says that on 2026-09-15 "Cloudflare will set updated defaults for new domains": "bots classified as Training or as Agent will be blocked on pages that display ads, and Search will remain allowed," and "mixed-purpose crawlers that combine Search and Training will also be blocked by all configurations to block AI training." [S3] |
| C4 | Pay per crawl lets a site "set a price per zone"; a crawler either presents payment intent in request headers and gets HTTP 200, or receives "HTTP 402 Payment Required" with pricing. It "is currently in closed beta." [S4] The crawler sends `crawler-exact-price` or `crawler-max-price`; the site answers with `crawler-price` and, when billed, `crawler-charged`. [S5] A paying crawler must identify itself with Web Bot Auth and follow Cloudflare's verified bots policy. [S6] |
| C5 | Web Bot Auth "leverages cryptographic signatures in HTTP messages to verify that a request comes from an automated bot." It builds on RFC 9421, uses the `Signature`, `Signature-Input` and `Signature-Agent` headers with tag `web-bot-auth`, and needs a public key directory at `/.well-known/http-message-signatures-directory`. Bots register through a form in the Cloudflare dashboard. [S7] RFC 9421 (HTTP Message Signatures) is a Standards Track RFC from February 2024. [S8] The IETF Web Bot Auth working group is active. [S9] |
| C6 | A Cloudflare verified bot must show "honest self-identification" (a Web Bot Auth signature, a published IP list with a stable user agent, or reverse DNS) and "non-abusive behavior" (it "obeys robots.txt and crawl directives, maintains reasonable request rates"). Categories include Search and Agent. Operators apply through the dashboard. [S10] |
| C7 | Bot Fight Mode, available on the Free plan, "issues computationally expensive challenges" to matching bot traffic, and Skip, Bypass and Allow rules "have no effect" on it. [S11] A Cloudflare challenge page carries the header `cf-mitigated: challenge`, for all challenge page types. [S12] Requests a Worker sends carry a `CF-Worker` header identifying the host that spawned them. [S13] |
| C8 | Standard product data formats exist: Google Merchant Center requires `id`, `title`, `description`, `link`, `image_link`, `availability` and `price`. [S14] Schema.org's `Offer` has `availability`, `price` and `availableAtOrFrom` ("store locations"). [S15] |
| C9 | Affiliate networks pass advertiser feeds to publishers. Awin's feed list covers "feeds they can see from either Advertisers they are joined to or Advertisers that allow Partners to promote their products before joining," and uses a data feed API key separate from the Partner API key. [S16] CJ describes a Product Search API for publishers to "discover new products." [S17] |
| C10 | RFC 9309: a crawler obeys the group matching its product token, else the `*` group; a 4xx on robots.txt allows everything; a 5xx or network failure means "complete disallow." [S18] |

## Decision

1. **Never disguise a bot as a person.** Anything this project runs that fetches third-party pages (today only the evaluation probe) sends a User-Agent that names it and links the About page, reads robots.txt first and obeys it (C10), and keeps request rates low. No browser User-Agent strings, no residential or rotating proxies, no CAPTCHA solving, no retrying around a challenge. A challenge or refusal is recorded as the result.
2. **Measure before mitigating.** The probe in `eval/access-probe/` records how retailer sites answer an honest bot and compares that with what a person sees in a real browser. It runs from Cloudflare's network and announces itself as a Worker (C7), so it approximates, but does not reproduce, what Brave's crawler meets: Brave's crawler follows Googlebot's permissions and does not name itself (C1).
3. **Tell visitors.** The results page says results come from Brave's index and that shops blocking crawlers may be missing; the About page shows the measured numbers or "Not yet measured."
4. **Nothing below is built yet.** Options, in order of fit with the project's aims:

| Option | What it takes | Tradeoff |
|---|---|---|
| OPT-1 Retailer-supplied data | Accept a product feed or sitemap from retailers who opt in, in an existing format such as the Merchant Center specification or schema.org `Offer` markup (C8) | Coverage grows only as shops sign up; needs a submission and review process |
| OPT-2 Affiliate network feeds | Publisher accounts with networks such as Awin or CJ (C9) | Commission income would conflict with neutral ranking and would need disclosure; coverage skews to shops large enough to join a network |
| OPT-3 Own verified crawler | Web Bot Auth signing (C5) and a verified-bot application in the Search category (C6) | Verified status is a Cloudflare program (C6); support by other bot-protection vendors was not checked. The project becomes a crawler operator with the duties in C6 |
| OPT-4 Pay per crawl | Closed beta, and meant for AI crawlers (C4) | Per-page cost; not a fit while the site fetches no pages |

## Consequences

- Some shops will be missing, most likely those whose sites refuse crawlers. The quality report states how many the evaluation found.
- Nothing can be done in this project about how Brave's own crawler is treated (C1).
- If OPT-2 is ever adopted, commission links must be disclosed on every result and must not affect score.

## Sources

All checked 2026-09-23.

| ID | Source |
|---|---|
| S1 | Brave Search, "Brave Search Crawler," https://search.brave.com/help/brave-search-crawler |
| S2 | Cloudflare press release, 2025-07-01, https://www.cloudflare.com/press/press-releases/2025/cloudflare-just-changed-how-ai-crawlers-scrape-the-internet-at-large/ |
| S3 | Cloudflare docs, "Block AI Bots," https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/ |
| S4 | Cloudflare docs, "What is Pay Per Crawl?" https://developers.cloudflare.com/ai-crawl-control/features/pay-per-crawl/what-is-pay-per-crawl/ |
| S5 | Cloudflare docs, "Crawl pages," https://developers.cloudflare.com/ai-crawl-control/features/pay-per-crawl/use-pay-per-crawl-as-ai-owner/crawl-pages/ |
| S6 | Cloudflare docs, "Verify your AI crawler," https://developers.cloudflare.com/ai-crawl-control/features/pay-per-crawl/use-pay-per-crawl-as-ai-owner/verify-ai-crawler/ |
| S7 | Cloudflare docs, "Web Bot Auth," https://developers.cloudflare.com/bots/reference/bot-verification/web-bot-auth/ |
| S8 | RFC 9421, HTTP Message Signatures, https://www.rfc-editor.org/rfc/rfc9421.html |
| S9 | IETF Web Bot Auth working group, https://datatracker.ietf.org/wg/webbotauth/about/ |
| S10 | Cloudflare docs, "Verified bots," https://developers.cloudflare.com/bots/concepts/bot/verified-bots/ |
| S11 | Cloudflare docs, "Get started with Bot Fight Mode," https://developers.cloudflare.com/bots/get-started/bot-fight-mode/ |
| S12 | Cloudflare docs, "Detect a Challenge Page response," https://developers.cloudflare.com/cloudflare-challenges/challenge-types/challenge-pages/detect-response/ |
| S13 | Cloudflare docs, "Cloudflare HTTP headers," https://developers.cloudflare.com/fundamentals/reference/http-headers/ |
| S14 | Google Merchant Center Help, "Product data specification," https://support.google.com/merchants/answer/7052112 |
| S15 | Schema.org, "Offer," https://schema.org/Offer |
| S16 | Awin, "Product Feed List Download," https://help.awin.com/developers/docs/product-feed-list-download |
| S17 | CJ, "Product Discovery, Improved! CJ's New Product Search API" (2020-05-11), https://junction.cj.com/article/product-discovery-improved-cjs-new-product-search-api |
| S18 | RFC 9309, Robots Exclusion Protocol, https://www.rfc-editor.org/rfc/rfc9309.html |
