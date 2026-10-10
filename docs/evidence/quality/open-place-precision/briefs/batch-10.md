# Grading brief, batch 10

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

Write a JSON array to `docs/evidence/quality/open-place-precision/grades/batch-10.json` with one object per row, in the same order as the input, with exactly these keys: `row_id`, `sells_product`, `local_exists`, `page_access`, `basis`, `notes`, `checked`. Write nothing else to the repository. When you finish, reply with the counts of each `sells_product` value and anything that blocked you.

## Rows

[
 {
  "row_id": "r271",
  "product": "extra virgin olive oil",
  "name": "Publix Super Market At Piedmont",
  "address": "595 Piedmont Ave NE, Atlanta, GA, 30308-2478",
  "website": "https://www.publix.com",
  "phone": "14048811750"
 },
 {
  "row_id": "r272",
  "product": "rain jacket",
  "name": "9-27 Shopping Center",
  "address": "219 N Main St, Natick, MA, 01760-1151",
  "website": null,
  "phone": null
 },
 {
  "row_id": "r273",
  "product": "loose leaf green tea",
  "name": "The Lunchbox",
  "address": "301 N Main St, Seneca, IL, 61360",
  "website": null,
  "phone": "+18153050082"
 },
 {
  "row_id": "r274",
  "product": "cast iron skillet",
  "name": "Leverett Woodworks",
  "address": "169 Rattlesnake Gutter Rd, Leverett, MA, 01054",
  "website": "http://www.leverettwoodworks.com/",
  "phone": "+14133679220"
 },
 {
  "row_id": "r275",
  "product": "wool blanket",
  "name": "Bear Saddle Ranch",
  "address": "323 3rd St, Kersey, CO, 80644",
  "website": "http://www.bearsaddleranch.com",
  "phone": "(308) 641-9784"
 },
 {
  "row_id": "r276",
  "product": "loose leaf green tea",
  "name": "BP",
  "address": "450 Jefferson St, Marseilles, IL, 61341",
  "website": "http://www.bp.com",
  "phone": "(815) 795-2825"
 },
 {
  "row_id": "r277",
  "product": "headlamp",
  "name": "Casa Guadalupe Supermarket",
  "address": "2999 Mission St, San Francisco, CA, 94110",
  "website": "http://www.casaguadalupesm.com/",
  "phone": "+14156428355"
 },
 {
  "row_id": "r278",
  "product": "wool socks",
  "name": "Splashdrone",
  "address": "730 Peachtree St Ne Ste 570, Atlanta, GA, 30308-1244",
  "website": null,
  "phone": null
 },
 {
  "row_id": "r279",
  "product": "cast iron skillet",
  "name": "Masse Hardware",
  "address": "249 Walden St, Cambridge, MA, 02140",
  "website": "http://www.massehardwarecompany.ambz.com",
  "phone": "(617) 876-3463"
 },
 {
  "row_id": "r280",
  "product": "camping tent",
  "name": "Saatva",
  "address": "1712 Walnut St, Philadelphia, PA, 19103",
  "website": "https://www.saatva.com/locations/philadelphia/rittenhousesquare",
  "phone": "+14452698880"
 },
 {
  "row_id": "r281",
  "product": "rain jacket",
  "name": "Burberry",
  "address": "1245 Worchester St N, Natick, MA, 17600",
  "website": "https://us.burberry.com/",
  "phone": "5086501919"
 },
 {
  "row_id": "r282",
  "product": "wool blanket",
  "name": "Family Dollar",
  "address": "109 Hill St, Kersey, CO, 80644",
  "website": "https://locations.familydollar.com/co/kersey/109-hill-street",
  "phone": "+19706739893"
 },
 {
  "row_id": "r283",
  "product": "dark chocolate bar",
  "name": "The Reservoir Pub & Grill",
  "address": "6650 Golf Course Dr, Burlingame, CA, 94010",
  "website": null,
  "phone": "+16503424188"
 },
 {
  "row_id": "r284",
  "product": "bath towels",
  "name": "Sherwin-Williams",
  "address": "505 W Lake St, Minneapolis, MN, 55408",
  "website": "https://www.sherwin-williams.com/store-locator/commercial-paint-store/minneapolis/mn/703005",
  "phone": "+16128272046"
 },
 {
  "row_id": "r285",
  "product": "bath towels",
  "name": "Cb2",
  "address": "3045 Hennepin Ave, Minneapolis, MN, 55408-2615",
  "website": null,
  "phone": "+16128219303"
 },
 {
  "row_id": "r286",
  "product": "camping tent",
  "name": "Brooklinen",
  "address": "1703 Walnut St, Philadelphia, PA, 19103",
  "website": null,
  "phone": "+12672732816"
 },
 {
  "row_id": "r287",
  "product": "camping tent",
  "name": "Burlington",
  "address": "500 W Germantown Pike, Plymouth Meeting, PA, 19462-1353",
  "website": "http://www.burlington.com",
  "phone": "+16102225001"
 },
 {
  "row_id": "r288",
  "product": "extra virgin olive oil",
  "name": "Starbucks",
  "address": "550 Peachtree Rd NE, Atlanta, GA, 30308",
  "website": null,
  "phone": "4048313957"
 },
 {
  "row_id": "r289",
  "product": "cordless drill",
  "name": "Hometown Hospitality",
  "address": "141 Spencer Creek Rd, Franklin, TN, 37069-4308",
  "website": "http://www.hometownhospitality.net/",
  "phone": "+18554463257"
 },
 {
  "row_id": "r290",
  "product": "loose leaf green tea",
  "name": "Bruno Beef",
  "address": "2507 N 2553rd Rd, Marseilles, IL, 61341-9604",
  "website": "http://www.brunobeef.com/",
  "phone": "+18157952549"
 },
 {
  "row_id": "r291",
  "product": "cast iron skillet",
  "name": "Bonny's Garden Center",
  "address": "41 Bay State Rd, Cambridge, MA, 02138",
  "website": "https://bonnysgardencenter.wixsite.com/bonnysgardencenter",
  "phone": "+16175471585"
 },
 {
  "row_id": "r292",
  "product": "wool socks",
  "name": "Playful Rides, Llc",
  "address": "730 Peachtree St Ne  Ste 570, Atlanta, GA, 30308-1244",
  "website": "https://playfulrides.com",
  "phone": "8884498907"
 },
 {
  "row_id": "r293",
  "product": "camping tent",
  "name": "Tilden Ridge Shopping Center",
  "address": "1712 Tilden Ridge Dr, Hamburg, PA, 19526-8170",
  "website": "http://stores.gnc.com/pa/hamburg/974",
  "phone": "+16105624583"
 },
 {
  "row_id": "r294",
  "product": "extra virgin olive oil",
  "name": "Vil Smoke",
  "address": "583 Juniper St NE, Atlanta, GA, 30308-2386",
  "website": "http://WWW.VILLAGESMOKE.COM/",
  "phone": "+14044376653"
 },
 {
  "row_id": "r295",
  "product": "cast iron skillet",
  "name": "Natick Cooperative Playgroup",
  "address": "39 E Central St, Natick, MA, 01760-4612",
  "website": "http://natickcooperativeplaygroup.com",
  "phone": "15084330833"
 },
 {
  "row_id": "r296",
  "product": "wool blanket",
  "name": "Threaded Three Boutique",
  "address": "27470 Co Rd 66, Gill, CO, 80624",
  "website": "http://www.threaded3boutique.com/",
  "phone": "+19707028636"
 },
 {
  "row_id": "r297",
  "product": "camping tent",
  "name": "Mattress Firm",
  "address": "1760 Tilden Ridge Dr, Hamburg, PA, 19526",
  "website": "https://www.mattressfirm.com/en-us/stores/pa/hamburg/151011/",
  "phone": "+16105622817"
 },
 {
  "row_id": "r298",
  "product": "cast iron skillet",
  "name": "Star's at Cambridge",
  "address": "699 Mt Auburn St, Cambridge, MA, 02138",
  "website": "https://www.regencycenters.com/property/detail/80090/Stars-at-Cambridge",
  "phone": "+12036355560"
 },
 {
  "row_id": "r299",
  "product": "loose leaf green tea",
  "name": "Bellettini's",
  "address": "Seneca, IL, 61360",
  "website": "http://www.bellettinifoods.com",
  "phone": "(815) 357-6734"
 },
 {
  "row_id": "r300",
  "product": "camping tent",
  "name": "Genji Sushi",
  "address": "500 W Germantown Pike, Plymouth Meeting, PA, 19462",
  "website": null,
  "phone": "6108320010"
 }
]
