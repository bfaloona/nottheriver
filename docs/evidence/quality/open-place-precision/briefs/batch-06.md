# Grading brief, batch 06

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

Write a JSON array to `docs/evidence/quality/open-place-precision/grades/batch-06.json` with one object per row, in the same order as the input, with exactly these keys: `row_id`, `sells_product`, `local_exists`, `page_access`, `basis`, `notes`, `checked`. Write nothing else to the repository. When you finish, reply with the counts of each `sells_product` value and anything that blocked you.

## Rows

[
 {
  "row_id": "r151",
  "product": "extra virgin olive oil",
  "name": "Atlmacarons",
  "address": "573 Juniper St NE, Atlanta, GA, 30308",
  "website": "http://www.atlmacarons.com/",
  "phone": "+14047937808"
 },
 {
  "row_id": "r152",
  "product": "dark chocolate bar",
  "name": "Nings Catering",
  "address": "2217 Hillside Dr, Burlingame, CA, 94010",
  "website": "http://www.ningscatering.com/",
  "phone": "(650) 344-1141"
 },
 {
  "row_id": "r153",
  "product": "headlamp",
  "name": "Golden Gate Market",
  "address": "2899 Mission St, San Francisco, CA, 94110",
  "website": "http://www.ggu.edu",
  "phone": "(415) 824-5600"
 },
 {
  "row_id": "r154",
  "product": "dark chocolate bar",
  "name": "Liquor Young's Burlingame",
  "address": "Burlingame, CA",
  "website": "http://www.burlingamepress.com/",
  "phone": "+16503763210"
 },
 {
  "row_id": "r155",
  "product": "rechargeable AA batteries",
  "name": "Dollar General",
  "address": "484 N Main St, Seneca, IL, 61360",
  "website": "https://www.dollargeneral.com/store-directory/il/seneca/17461",
  "phone": "+18153577110"
 },
 {
  "row_id": "r156",
  "product": "wooden train set",
  "name": "Landmark Booksellers",
  "address": "114 E Main St, Franklin, TN, 37064",
  "website": "https://www.landmarkbooksellers.com/",
  "phone": "+16157916400"
 },
 {
  "row_id": "r157",
  "product": "camping tent",
  "name": "New Balance Philadelphia",
  "address": "1619 Walnut St Fl 1, Philadelphia, PA, 19103",
  "website": "https://stores.newbalance.com/pa/philadelphia/1619-walnut-street?utm_source=facebook&utm_medium=storelisting&utm_campaign=4041",
  "phone": "+14452232029"
 },
 {
  "row_id": "r158",
  "product": "camping tent",
  "name": "Endeavor Athletic",
  "address": "119 S 18th St, Philadelphia, PA, 19103-5122",
  "website": "endeavorathletic.com",
  "phone": "+12677697671"
 },
 {
  "row_id": "r159",
  "product": "LED light bulbs",
  "name": "Diamond Decor",
  "address": "342 State St, Hamburg, PA, 19526",
  "website": "http://www.diamond-decor.com/",
  "phone": "+14847972879"
 },
 {
  "row_id": "r160",
  "product": "wool blanket",
  "name": "Silver Health Guide",
  "address": "25490 County Road 58, Greeley, CO, 80631-9750",
  "website": "http://www.mmexcavation.com/",
  "phone": "+19703525220"
 },
 {
  "row_id": "r161",
  "product": "rain jacket",
  "name": "Shoshana",
  "address": "23 Main St, Natick, MA, 01760-4505",
  "website": null,
  "phone": "+15086552594"
 },
 {
  "row_id": "r162",
  "product": "headlamp",
  "name": "Léon & George",
  "address": "3465 Cesar Chavez St, San Francisco, CA, 94110-4507",
  "website": "https://www.leonandgeorge.com/",
  "phone": "+13108399009"
 },
 {
  "row_id": "r163",
  "product": "camping tent",
  "name": "Hamburg Plaza",
  "address": "Hamburg, PA",
  "website": null,
  "phone": null
 },
 {
  "row_id": "r164",
  "product": "rain jacket",
  "name": "Baylee Bee",
  "address": "19 Main St, Natick, MA, 01760",
  "website": "http://www.bayleebee.com/",
  "phone": "+15082333406"
 },
 {
  "row_id": "r165",
  "product": "cast iron skillet",
  "name": "ALDI",
  "address": "321 Speen St, Natick, MA, 01760",
  "website": "https://www.aldi.us",
  "phone": null
 },
 {
  "row_id": "r166",
  "product": "extra virgin olive oil",
  "name": "Tarrazu",
  "address": "265 Ponce de Leon Ave NE, Atlanta, GA, 30308",
  "website": "http://www.barrazacoffeebar.com/",
  "phone": "(404) 815-2077"
 },
 {
  "row_id": "r167",
  "product": "wool blanket",
  "name": "Vintage Grain",
  "address": "21417 County Road 66, Greeley, CO, 80631-9513",
  "website": "http://Www.vintage-grain.com/",
  "phone": "+19706525080"
 },
 {
  "row_id": "r168",
  "product": "rain jacket",
  "name": "GRS Jewelry & Repair",
  "address": "3 Main St, Natick, MA, 01760",
  "website": "http://stucchi.com",
  "phone": "(508) 647-0040"
 },
 {
  "row_id": "r169",
  "product": "bath towels",
  "name": "Twin Six",
  "address": "716 W 34th St, Minneapolis, MN, 55408",
  "website": "http://www.twinsix.com",
  "phone": "(612) 208-1787"
 },
 {
  "row_id": "r170",
  "product": "jigsaw puzzle",
  "name": "Pansy Floral",
  "address": "314 W 38th St, Minneapolis, MN, 55409-1231",
  "website": "https://www.pansyfloraldesign.com",
  "phone": "15152915404"
 },
 {
  "row_id": "r171",
  "product": "extra virgin olive oil",
  "name": "Walgreens",
  "address": "595 Piedmont Ave NE, Atlanta, GA, 30308",
  "website": "https://www.walgreens.com",
  "phone": "+14046859665"
 },
 {
  "row_id": "r172",
  "product": "cast iron skillet",
  "name": "Sherwin-Williams",
  "address": "355 Fresh Pond Pkwy, Cambridge, MA, 02138",
  "website": "https://www.sherwin-williams.com/store-locator/paint-store/cambridge/ma/701888",
  "phone": "+16178641248"
 },
 {
  "row_id": "r173",
  "product": "wool socks",
  "name": "Family Dollar",
  "address": "455 N Ave NE, Atlanta, GA, 30354",
  "website": "http://www.familydollar.com/locations/ga/atlanta/26611/",
  "phone": "4044640385"
 },
 {
  "row_id": "r174",
  "product": "cast iron skillet",
  "name": "Mill & Speen Corner",
  "address": "2 Mill St, Natick, MA, 01760-4124",
  "website": null,
  "phone": null
 },
 {
  "row_id": "r175",
  "product": "wool blanket",
  "name": "Dollar General",
  "address": "209 Hill St, Kersey, CO, 80644",
  "website": "https://www.dollargeneral.com/store-directory/co/kersey/23646",
  "phone": "+19705737064"
 },
 {
  "row_id": "r176",
  "product": "dark chocolate bar",
  "name": "Mollie Stone's Markets",
  "address": "1477 Chapin Ave, Burlingame, CA, 94010",
  "website": "http://www.molliestones.com/",
  "phone": "+16505589992"
 },
 {
  "row_id": "r177",
  "product": "jigsaw puzzle",
  "name": "Redbox",
  "address": "200 W Lake St, Minneapolis, MN, 55408",
  "website": null,
  "phone": "8667332693"
 },
 {
  "row_id": "r178",
  "product": "jigsaw puzzle",
  "name": "Eye of Horus Metaphysical",
  "address": "910 W Lake St, Minneapolis, MN, 55408",
  "website": "http://EyeofHorus.biz",
  "phone": "(612) 872-1292"
 },
 {
  "row_id": "r179",
  "product": "camping tent",
  "name": "Subzicart",
  "address": "2929 Arch Street, Suite 1700,, Philadelphia, PA, 19104",
  "website": "https://subzicart.com",
  "phone": "(484) 206-3336"
 },
 {
  "row_id": "r180",
  "product": "wooden train set",
  "name": "Keychain manufacturer",
  "address": "29 legends ridge dr, Franklin, TN, 77386",
  "website": null,
  "phone": "+8615257958599"
 }
]
