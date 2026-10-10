# Grading brief, batch 03

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

Write a JSON array to `docs/evidence/quality/open-place-precision/grades/batch-03.json` with one object per row, in the same order as the input, with exactly these keys: `row_id`, `sells_product`, `local_exists`, `page_access`, `basis`, `notes`, `checked`. Write nothing else to the repository. When you finish, reply with the counts of each `sells_product` value and anything that blocked you.

## Rows

[
 {
  "row_id": "r061",
  "product": "LED light bulbs",
  "name": "Lowe's",
  "address": "20 Wilderness Trail, Hamburg, PA, 19526",
  "website": "https://www.lowes.com/store/PA-Hamburg/2894?cm_mmc=lod-_-c-_-lcl-_-awr-_-yxt-_-fb-_-2894-_-na-_-0-_-0&y_source=1_MTE4MzQwNS01NTktbG9jYXRpb24ud2Vic2l0ZQ%3D%3D",
  "phone": "+14846607970"
 },
 {
  "row_id": "r062",
  "product": "cast iron skillet",
  "name": "Star Market",
  "address": "699 Mt Auburn St, Cambridge, MA, 02138",
  "website": "https://local.starmarket.com/ma/cambridge/699-mt-auburn-st.html",
  "phone": "+16178761450"
 },
 {
  "row_id": "r063",
  "product": "bath towels",
  "name": "Slotcar Fever",
  "address": "3141 Emerson Ave S, Minneapolis, MN, 55408",
  "website": "http://www.slotcar-fever.com",
  "phone": "(612) 353-1481"
 },
 {
  "row_id": "r064",
  "product": "loose leaf green tea",
  "name": "3rd Bar",
  "address": "316 N Main St, Seneca, IL, 61360",
  "website": "https://3rdbarseneca.com",
  "phone": "+18159404508"
 },
 {
  "row_id": "r065",
  "product": "camping tent",
  "name": "Love N Honey Candles",
  "address": "500 W Germantown Pike  Ste 1300, Plymouth Meeting, PA, 19462-1361",
  "website": "http://www.lovenhoneycandles.com",
  "phone": "12677778781"
 },
 {
  "row_id": "r066",
  "product": "headlamp",
  "name": "Golden State Lumber",
  "address": "625 Potrero Ave, San Francisco, CA, 94110",
  "website": "https://www.goldenstatelumber.com/locations/san-francisco/",
  "phone": "4154620020"
 },
 {
  "row_id": "r067",
  "product": "cast iron skillet",
  "name": "Mom’s House",
  "address": "318 College St, Amherst, MA, 01002",
  "website": "http://momshouse.org",
  "phone": "+14132531868"
 },
 {
  "row_id": "r068",
  "product": "headlamp",
  "name": "San Fran Market",
  "address": "3353 26th St, San Francisco, CA, 94110",
  "website": "https://san-fran-market.business.site",
  "phone": "+14158345402"
 },
 {
  "row_id": "r069",
  "product": "wool blanket",
  "name": "Front Range Supply",
  "address": "2434 E 8th St, Greeley, CO, 80631",
  "website": null,
  "phone": "9703528780"
 },
 {
  "row_id": "r070",
  "product": "rain jacket",
  "name": "Mill & Speen Corner",
  "address": "2 Mill St, Natick, MA, 01760-4124",
  "website": null,
  "phone": null
 },
 {
  "row_id": "r071",
  "product": "camping tent",
  "name": "Cabela's",
  "address": "100 Cabela Dr, Hamburg, PA, 19526-8777",
  "website": "https://stores.cabelas.com/us/pa/hamburg/100-cabela-drive.html?y_source=1_Mzk4NjcxMi01NTktbG9jYXRpb24ud2Vic2l0ZQ%3D%3D",
  "phone": "+16109297000"
 },
 {
  "row_id": "r072",
  "product": "rechargeable AA batteries",
  "name": "Rooted on Main LLC",
  "address": "500 Main St, Marseilles, IL, 61341",
  "website": null,
  "phone": null
 },
 {
  "row_id": "r073",
  "product": "headlamp",
  "name": "Samiramis Imports",
  "address": "2990 Mission St, San Francisco, CA, 94110",
  "website": "http://samiramisimports.com",
  "phone": "+14158246555"
 },
 {
  "row_id": "r074",
  "product": "LED light bulbs",
  "name": "Tilden Ridge",
  "address": "1898 Tilden Ridge Dr, Hamburg, PA, 19526",
  "website": null,
  "phone": null
 },
 {
  "row_id": "r075",
  "product": "rain jacket",
  "name": "Hedgehog Belly Designs",
  "address": "1 Main St, Natick, MA, 01760-4505",
  "website": "https://www.hedgehogbellydesigns.com",
  "phone": "15085451059"
 },
 {
  "row_id": "r076",
  "product": "jigsaw puzzle",
  "name": "Amelia Flower & Garden Shoppe",
  "address": "910 W 36th St, Minneapolis, MN, 55408",
  "website": "http://www.ameliaflower.com/",
  "phone": "6122081205"
 },
 {
  "row_id": "r077",
  "product": "extra virgin olive oil",
  "name": "Metro Fuxon",
  "address": "554 Piedmont Ave NE Ste A, Atlanta, GA, 30308",
  "website": "http://www.metrofuxon.com",
  "phone": "(404) 996-2485"
 },
 {
  "row_id": "r078",
  "product": "wool socks",
  "name": "Ar Hommes Company",
  "address": "730 Peachtree St NE, Atlanta, GA, 30308-1210",
  "website": "https://www.arhommes.com",
  "phone": "+18886265998"
 },
 {
  "row_id": "r079",
  "product": "wool socks",
  "name": "Kitemas Wholesale",
  "address": "620 Peachtree St NE, Atlanta, GA, 30308",
  "website": "http://kitemas.com",
  "phone": "+14705581275"
 },
 {
  "row_id": "r080",
  "product": "LED light bulbs",
  "name": "Fine Wine & Good Spirits",
  "address": "1772 Tilden Ridge Drive, Hamburg, PA, 19526",
  "website": "https://www.finewineandgoodspirits.com/fine-wine-good-spirits-0607/product/store-607",
  "phone": null
 },
 {
  "row_id": "r081",
  "product": "cast iron skillet",
  "name": "Tedeschi Food Shops",
  "address": "54B E Central St, Natick, MA, 01760-4621",
  "website": "https://www.salemspeedway.com",
  "phone": "+15086513739"
 },
 {
  "row_id": "r082",
  "product": "cast iron skillet",
  "name": "PuroClean Metrowest",
  "address": "4 Mechanic St, Natick, MA, 01760-3460",
  "website": "https://www.puroclean.com/natick-ma-puroclean-natick/",
  "phone": "+18007757876"
 },
 {
  "row_id": "r083",
  "product": "wool socks",
  "name": "Atlanta - 4",
  "address": "Atlanta, GA",
  "website": null,
  "phone": "+14046541252"
 },
 {
  "row_id": "r084",
  "product": "cast iron skillet",
  "name": "Natick Appliance",
  "address": "30 N Main St, Natick, MA, 01760",
  "website": null,
  "phone": "5086551485"
 },
 {
  "row_id": "r085",
  "product": "rain jacket",
  "name": "9/27 Plaza",
  "address": "829-881 Worcester St, Natick, MA, 01760",
  "website": null,
  "phone": null
 },
 {
  "row_id": "r086",
  "product": "wooden train set",
  "name": "Toys R Us",
  "address": "165 Cool Springs Blvd, Franklin, TN, 37067-7241",
  "website": null,
  "phone": null
 },
 {
  "row_id": "r087",
  "product": "USB-C charging cable",
  "name": "Ref-use",
  "address": "601 S Loop 4, Buda, TX, 78610-5795",
  "website": "www.lincolngarbage.com",
  "phone": "15126867438"
 },
 {
  "row_id": "r088",
  "product": "cast iron skillet",
  "name": "Debsan The Decorating Store",
  "address": "25 Main St, Natick, MA, 01760",
  "website": "http://debsan.net/",
  "phone": "5086531360"
 },
 {
  "row_id": "r089",
  "product": "LED light bulbs",
  "name": "Alternative Furnishings Inc",
  "address": "266 State St, Hamburg, PA, 19526",
  "website": "http://www.alternativefurnishings.com/",
  "phone": "+17174842225"
 },
 {
  "row_id": "r090",
  "product": "cast iron skillet",
  "name": "Huron Village - A wonderful village experience",
  "address": "370 Huron Ave, Cambridge, MA, 02138-6828",
  "website": null,
  "phone": "+16173542800"
 }
]
