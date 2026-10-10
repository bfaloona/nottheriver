# Grading brief, batch 07

You are grading whether a list of local shops sell a named product and whether each shop exists at the listed address. The rows come from a place dataset; you are told nothing about how they were chosen, and you must not try to work it out. Grade each row on its own. Do not look at other batches, other graders' output, or any file in this repository other than the output file you write.

## Rules

Work from the shop's own website when it has one, otherwise from one current public listing you can reach without logging in (a search engine result page, a chamber of commerce page, a mall directory, a maps listing that renders without a login). Fetch pages with a plain HTTP client (WebFetch, or curl with `-A "nottheriver-precision-check/0.1"`). Never put any person's name, email address or account details in a User-Agent, URL, query or payload. Do not log in, buy, submit forms, or run searches through a browser signed in to anyone's account. Do not use the Brave Search API or the nottheriver site or Worker.

Per row, record:

| Field | Allowed values | Judged as |
|---|---|---|
| `sells_product` | `yes`, `equivalent`, `no`, `unknown` | `yes`: the shop's site (or a listing of its stock) shows it offers the product; `equivalent`: a close substitute (a different wool blend sock for "wool socks" is `yes`; a cotton sock is `no`; a camping cot for "camping tent" is `no`); `no`: the shop clearly does not carry it (a bridal boutique for a cast iron skillet); `unknown`: could not tell. A shop with no website and no stock listing is `unknown` unless its name or type settles it (a store named "Camping World" for a camping tent is `yes`, with a note saying the name settled it; a pharmacy for LED bulbs is `unknown`, not `yes`, unless its site shows them). A chain whose national site shows the product in stock or for pickup counts as `yes` for a store of that chain. Do not guess from the category alone; a sporting goods store that might sell headlamps is `unknown` until you see them |
| `local_exists` | `yes`, `no`, `unknown` | `yes`: the shop is at the listed address (or that street, for a mall) per its own site or a current listing; `no`: confirmed not there (the site or a listing says closed or moved, or another business now occupies the address); `unknown`: no evidence either way, or conflicting evidence (a dead site but a current listing). A site that will not load with nothing else either way is `unknown`, not `no`. The row's own name, address and phone are a claim, not evidence |
| `page_access` | `ok`, `challenge`, `blocked`, `error`, `none` | What the fetch of the shop's website returned: `ok`, `challenge` (CAPTCHA or "checking your browser"), `blocked` (a refusal page or 403), `error` (did not load); `none` when the row has no website. A `blocked` or `challenge` site gives `sells_product: unknown` unless a listing elsewhere settles it; do not guess |
| `basis` | free text | What you read: the URL(s) or listing you judged from, one line |
| `notes` | free text | Anything a reader needs: what the shop is, why `equivalent`, why `no` |
| `checked` | `YYYY-MM-DD` | Today |

Be strict about `yes`: it needs the product seen on a page, in a category list on the shop's site, or a name that leaves no doubt. When a site is a single landing page with no stock information, that is `unknown`. Work through every row; do not skip any. Spend at most about two page loads per row; if two loads do not settle it, record `unknown` with what you saw.

## Output

Write a JSON array to `docs/evidence/quality/open-place-precision/grades/batch-07.json` with one object per row, in the same order as the input, with exactly these keys: `row_id`, `sells_product`, `local_exists`, `page_access`, `basis`, `notes`, `checked`. Write nothing else to the repository. When you finish, reply with the counts of each `sells_product` value and anything that blocked you.

## Rows

[
 {
  "row_id": "r181",
  "product": "cast iron skillet",
  "name": "Olsen & Olsen",
  "address": "3 Malden St, Natick, MA, 01760",
  "website": "http://olsendaines.com",
  "phone": "(508) 650-5752"
 },
 {
  "row_id": "r182",
  "product": "cast iron skillet",
  "name": "Leverett Village Co-Op",
  "address": "180 Rattlesnake Gutter Rd, Leverett, MA, 01054",
  "website": "https://leverettcoop.com/",
  "phone": "+14133679794"
 },
 {
  "row_id": "r183",
  "product": "camping tent",
  "name": "Boscov's",
  "address": "500 W Germantown Pike, Plymouth Meeting, PA, 19462-1353",
  "website": "https://locations.boscovs.com/pa/plymouthmeeting/500-w-germantown-pike.html",
  "phone": "+16108258686"
 },
 {
  "row_id": "r184",
  "product": "cast iron skillet",
  "name": "Planted Collective",
  "address": "37 S Main St, Natick, MA, 01760",
  "website": "https://www.weddingwire.com/biz/planted-collective/7c9f2b9cc47ca85f.html",
  "phone": "+15085307655"
 },
 {
  "row_id": "r185",
  "product": "extra virgin olive oil",
  "name": "Lil Village Smoke",
  "address": "268 Ponce de Leon Ave NE, Atlanta, GA, 30308-1936",
  "website": "http://www.villagesmoke.com/",
  "phone": "+14044376653"
 },
 {
  "row_id": "r186",
  "product": "LED light bulbs",
  "name": "Peach Mill Supply Works",
  "address": "238 Pine St, Hamburg, PA, 19526",
  "website": "http://www.peachmillsupply.com/",
  "phone": "+16107504411"
 },
 {
  "row_id": "r187",
  "product": "LED light bulbs",
  "name": "Fastener Place",
  "address": "137 Schuylkill Ave, Hamburg, PA, 19526",
  "website": "http://thefastenerplace.com/",
  "phone": "+14846603432"
 },
 {
  "row_id": "r188",
  "product": "bath towels",
  "name": "The Little Bird",
  "address": "3704 S Colfax Ave, Minneapolis, MN, 55409-1024",
  "website": null,
  "phone": "+19783176218"
 },
 {
  "row_id": "r189",
  "product": "LED light bulbs",
  "name": "Mattress Firm",
  "address": "1760 Tilden Ridge Dr, Hamburg, PA, 19526",
  "website": "https://www.mattressfirm.com/en-us/stores/pa/hamburg/151011/",
  "phone": "+16105622817"
 },
 {
  "row_id": "r190",
  "product": "wool blanket",
  "name": "Freefurry LLC",
  "address": "2436 E 8th St, Greeley, CO, 80631-9786",
  "website": "https://freefurry.com/",
  "phone": "+17207942930"
 },
 {
  "row_id": "r191",
  "product": "bath towels",
  "name": "Go Home Furnishings",
  "address": "1408 W Lake St, Minneapolis, MN, 55408-2640",
  "website": "http://www.noyougohome.com",
  "phone": "+16128248732"
 },
 {
  "row_id": "r192",
  "product": "loose leaf green tea",
  "name": "Kunkin Patch",
  "address": "8000 Old Stage Rd, Morris, IL, 60450-8820",
  "website": null,
  "phone": "+18155304233"
 },
 {
  "row_id": "r193",
  "product": "rechargeable AA batteries",
  "name": "Bellettini's",
  "address": "Seneca, IL, 61360",
  "website": "http://www.bellettinifoods.com",
  "phone": "(815) 357-6734"
 },
 {
  "row_id": "r194",
  "product": "camping tent",
  "name": "Mattress Firm",
  "address": "400 W Germantown Pike, Plymouth Meeting, PA, 19462-1322",
  "website": "https://www.mattressfirm.com/en-us/stores/pa/plymouth-meeting/168031/",
  "phone": "+16108320200"
 },
 {
  "row_id": "r195",
  "product": "cordless drill",
  "name": "Calloway Boxwood And Landscaping",
  "address": "2131 Hillsboro Rd, Franklin, TN, 37069-6223",
  "website": "callowayboxwood.com",
  "phone": "16156464745"
 },
 {
  "row_id": "r196",
  "product": "camping tent",
  "name": "Lowe's",
  "address": "20 Wilderness Trail, Hamburg, PA, 19526",
  "website": "https://www.lowes.com/store/PA-Hamburg/2894?cm_mmc=lod-_-c-_-lcl-_-awr-_-yxt-_-fb-_-2894-_-na-_-0-_-0&y_source=1_MTE4MzQwNS01NTktbG9jYXRpb24ud2Vic2l0ZQ%3D%3D",
  "phone": "+14846607970"
 },
 {
  "row_id": "r197",
  "product": "USB-C charging cable",
  "name": "Mockingbird Made",
  "address": "107 Ash St, Buda, TX, 78610",
  "website": "http://www.mockingbirdmade.com/",
  "phone": "+15129055698"
 },
 {
  "row_id": "r198",
  "product": "camping tent",
  "name": "Gander Outdoors",
  "address": "20 Industrial Dr, Hamburg, PA, 19526-8767",
  "website": "https://rv.campingworld.com/dealer/hamburg-pennsylvania",
  "phone": "+18337391030"
 },
 {
  "row_id": "r199",
  "product": "headlamp",
  "name": "Martinez Top Construction",
  "address": "3345 23rd St, San Francisco, CA, 94110",
  "website": "https://martinezconstructionca.net",
  "phone": "(415) 410-6180"
 },
 {
  "row_id": "r200",
  "product": "camping tent",
  "name": "Jordan World of Flight Philly ",
  "address": "1617 Walnut St, Philadelphia, PA, 19103-5420",
  "website": "http://jordan.com/",
  "phone": null
 },
 {
  "row_id": "r201",
  "product": "wooden train set",
  "name": "Artisan Guitars",
  "address": "Franklin, TN, 37064",
  "website": "https://artisanguitars.com",
  "phone": "(615) 595-2544"
 },
 {
  "row_id": "r202",
  "product": "cordless drill",
  "name": "John Deere Landscapes",
  "address": "1109 Hillsboro Rd, Franklin, TN, 37064-2054",
  "website": "http://www.johndeerelandscapes.com",
  "phone": "+16157944518"
 },
 {
  "row_id": "r203",
  "product": "camping tent",
  "name": "One Crazy Fan",
  "address": "500 W Germantown Pike Ste 2080, Plymouth Meeting, PA, 19462-1388",
  "website": "https://www.onecrazyfan.com",
  "phone": "+14843518070"
 },
 {
  "row_id": "r204",
  "product": "cordless drill",
  "name": "Blinds & Designs",
  "address": "2221 Hillsboro Rd  Ste A, Franklin, TN, 37069-6200",
  "website": null,
  "phone": "16152412608"
 },
 {
  "row_id": "r205",
  "product": "camping tent",
  "name": "Duxiana-The Dux Bed",
  "address": "212 S 17th St, Philadelphia, PA, 19103",
  "website": "http://duxiana.com",
  "phone": "(215) 772-0959"
 },
 {
  "row_id": "r206",
  "product": "wool blanket",
  "name": "Rustic Woodworks LLC",
  "address": "41056 Co Rd 43, Ault, CO, 80610",
  "website": "https://www.etsy.com/shop/RusticWoodworksLLC?ref=shop_profile&listing_id=1572042688&dd_referrer=https%3A%2F%2Fwww.etsy.com%2Flisting%2F1572042688%2F10-inch-critter-campfire-bear-moose%3Fls%3Ds%26ga_order%3Dmost_relevant%26ga_search_type%3Dall%26ga_view_type%3Dgallery%26ga_search_query%3Dchainsaw%2Bcarved%2Bmoose%26ref%3Dsr_gallery-1-2%26organic_search_click%3D1%26frs%3D1%26cns%3D1%26nob%3D1%26content_source%3D2fd2231c-dacf-41d6-a339-53cd1d76eff8%25253A665988cfaa3d7e4a6492056e52e54afc250d8fea%26logging_key%3D2fd2231c-dacf-41d6-a339-53cd1d76eff8%253A665988cfaa3d7e4a6492056e52e54afc250d8fea",
  "phone": "+19708349835"
 },
 {
  "row_id": "r207",
  "product": "dark chocolate bar",
  "name": "Preston's Candy & Ice Cream",
  "address": "1170 Broadway, Burlingame, CA, 94010",
  "website": "https://prestonscandyshop.com/",
  "phone": "+16503443254"
 },
 {
  "row_id": "r208",
  "product": "camping tent",
  "name": "Mizutani Alliance",
  "address": "125 S 18th St, Philadelphia, PA, 19103-5240",
  "website": "https://www.mizutanialliance.com/",
  "phone": "+12158217181"
 },
 {
  "row_id": "r209",
  "product": "wooden train set",
  "name": "Perfect Setting",
  "address": "2181 Hillsboro Rd, Franklin, TN, 37069",
  "website": null,
  "phone": "+16155386053"
 },
 {
  "row_id": "r210",
  "product": "rechargeable AA batteries",
  "name": "Bunton Painting",
  "address": "7445 Morey Rd, Morris, IL, 60450",
  "website": "http://www.buntonpainting.com",
  "phone": "(815) 941-1105"
 }
]
