# Grading brief, batch 04

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

Write a JSON array to `docs/evidence/quality/open-place-precision/grades/batch-04.json` with one object per row, in the same order as the input, with exactly these keys: `row_id`, `sells_product`, `local_exists`, `page_access`, `basis`, `notes`, `checked`. Write nothing else to the repository. When you finish, reply with the counts of each `sells_product` value and anything that blocked you.

## Rows

[
 {
  "row_id": "r091",
  "product": "extra virgin olive oil",
  "name": "ZaEx",
  "address": "590 Piedmont Ave NE, Atlanta, GA, 30308-2437",
  "website": "http://VillageSmoke.com/",
  "phone": "+14044376653"
 },
 {
  "row_id": "r092",
  "product": "bath towels",
  "name": "Bryant Hardware",
  "address": "818 W 36th St, Minneapolis, MN, 55408",
  "website": "http://Www.bryanthardware.com/",
  "phone": "+16128234748"
 },
 {
  "row_id": "r093",
  "product": "rain jacket",
  "name": "Building #19",
  "address": "881 Worcester St, Natick, MA, 01760",
  "website": "http://www.building19.com",
  "phone": "(508) 653-1900"
 },
 {
  "row_id": "r094",
  "product": "bath towels",
  "name": "Perennial Cycle",
  "address": "3342 Hennepin Ave, Minneapolis, MN, 55408",
  "website": "http://www.perennialcycle.com/",
  "phone": "+16128278000"
 },
 {
  "row_id": "r095",
  "product": "USB-C charging cable",
  "name": "Buda Woodworks",
  "address": "602 S Loop 4, Buda, TX, 78610-9389",
  "website": "http://www.budawoodworks.com",
  "phone": "+15123120550"
 },
 {
  "row_id": "r096",
  "product": "camping tent",
  "name": "Showroom Lighting Sales",
  "address": "620 W Germantown Pike  Ste 440, Plymouth Meeting, PA, 19462-1056",
  "website": "http://www.showroomlighting.com",
  "phone": "16102601567"
 },
 {
  "row_id": "r097",
  "product": "rechargeable AA batteries",
  "name": "Ram Sita Corporation",
  "address": "271 S Main St, Seneca, IL, 61360-9415",
  "website": null,
  "phone": null
 },
 {
  "row_id": "r098",
  "product": "camping tent",
  "name": "Cabellas",
  "address": "80 Wilderness Trail, Tilden Twp, PA, 19526",
  "website": "http://www.cabelas.com/",
  "phone": "+16109297000"
 },
 {
  "row_id": "r099",
  "product": "bath towels",
  "name": "Of The Lion",
  "address": "3554 Bryant Ave S, Minneapolis, MN, 55408",
  "website": "http://ofthelion.shop",
  "phone": "+17636205466"
 },
 {
  "row_id": "r100",
  "product": "rechargeable AA batteries",
  "name": "The Rusty Rooster",
  "address": "113 William St, Seneca, IL, 61360",
  "website": "https://www.instagram.com/therustyroosteratthelumberyard/",
  "phone": "+18152281397"
 },
 {
  "row_id": "r101",
  "product": "wooden train set",
  "name": "Books-A-Million",
  "address": "1897 General George Patton Dr Ste 106, Franklin, TN, 37067",
  "website": "http://booksamillion.com",
  "phone": "(615) 777-5304"
 },
 {
  "row_id": "r102",
  "product": "camping tent",
  "name": "SV Sports",
  "address": "1744 Tilden Ridge Dr, Hamburg, PA, 19526",
  "website": "https://www.svsports.com",
  "phone": "(484) 665-0390"
 },
 {
  "row_id": "r103",
  "product": "camping tent",
  "name": "Fastener Place",
  "address": "137 Schuylkill Ave, Hamburg, PA, 19526",
  "website": "http://thefastenerplace.com/",
  "phone": "+14846603432"
 },
 {
  "row_id": "r104",
  "product": "wool socks",
  "name": "Mahnpe'",
  "address": "730 Peachtree St Ne Ste 570, Atlanta, GA, 30308-1244",
  "website": null,
  "phone": null
 },
 {
  "row_id": "r105",
  "product": "dark chocolate bar",
  "name": "Weimax Wines & Spirits",
  "address": "1178 Broadway, Burlingame, CA, 94010",
  "website": "http://www.weimax.com/",
  "phone": "+16503430182"
 },
 {
  "row_id": "r106",
  "product": "cast iron skillet",
  "name": "Fresh Pond Market",
  "address": "360 Huron Ave, Cambridge, MA, 02138-6828",
  "website": null,
  "phone": "+16178763916"
 },
 {
  "row_id": "r107",
  "product": "camping tent",
  "name": "Garden Stop at Plymouth Meeting Mall",
  "address": "500 W Germantown Pike, Plymouth Meeting, PA, 19462-1353",
  "website": "http://www.thegardenstop.us/",
  "phone": "+12159710743"
 },
 {
  "row_id": "r108",
  "product": "cordless drill",
  "name": "Tractor Supply Co.",
  "address": "2176 Hillsboro Rd Ste 122, Franklin, TN, 37069",
  "website": "https://www.tractorsupply.com/tsc/store_Franklin-TN-37069_2314",
  "phone": "+16155955700"
 },
 {
  "row_id": "r109",
  "product": "camping tent",
  "name": "Sunburst Shutters & Window Fashions",
  "address": "600 W Germantown Pike, Plymouth Meeting, PA, 19462-1046",
  "website": "https://www.sunburstshuttersphilly.com/",
  "phone": "+12158744897"
 },
 {
  "row_id": "r110",
  "product": "cast iron skillet",
  "name": "Hope & Feathers Framing and Printing",
  "address": "319 Main St, Amherst, MA, 01002",
  "website": "http://hopeandfeathersframing.com/",
  "phone": "4138350197"
 },
 {
  "row_id": "r111",
  "product": "camping tent",
  "name": "Center City Gourmet",
  "address": "1730 Chestnut St, Philadelphia, PA, 19103",
  "website": "http://dibruno.com",
  "phone": "(215) 564-9339"
 },
 {
  "row_id": "r112",
  "product": "cast iron skillet",
  "name": "Mattress Firm",
  "address": "194 Alewife Brook Pkwy, Cambridge, MA, 02138",
  "website": "https://www.mattressfirm.com/en-us/stores/ma/cambridge/154018/",
  "phone": "+18572530085"
 },
 {
  "row_id": "r113",
  "product": "cast iron skillet",
  "name": "Reside",
  "address": "266 Concord Ave, Cambridge, MA, 02138",
  "website": "http://www.resideinc.com/",
  "phone": "+16175472929"
 },
 {
  "row_id": "r114",
  "product": "cordless drill",
  "name": "J & R Stone",
  "address": "2170 Hillsboro Rd, Franklin, TN, 37069-6224",
  "website": "http://jandrstoneco.com/",
  "phone": "+16155995156"
 },
 {
  "row_id": "r115",
  "product": "loose leaf green tea",
  "name": "Cheddar Curtain Cheesecakes",
  "address": "547 Broadway St, Marseilles, IL, 61341",
  "website": "https://bio.site/CheddarCurtainCheesecakes",
  "phone": "+12626134187"
 },
 {
  "row_id": "r116",
  "product": "wool socks",
  "name": "Paris Watch Co",
  "address": "730 Peachtree St Ne  Ste 570, Atlanta, GA, 30308-1244",
  "website": "https://www.pariswatchco.com",
  "phone": "7703246596"
 },
 {
  "row_id": "r117",
  "product": "extra virgin olive oil",
  "name": "ZENSHI Handcrafted Sushi",
  "address": "595 Piedmont Ave NE, Atlanta, GA, 30308-2478",
  "website": "https://www.zenshisushi.com/",
  "phone": "+14048811750"
 },
 {
  "row_id": "r118",
  "product": "cast iron skillet",
  "name": "Ah Nich Shop",
  "address": "#rt 2, Cambridge, MA",
  "website": null,
  "phone": "+85511798632"
 },
 {
  "row_id": "r119",
  "product": "wooden train set",
  "name": "Garden Delights Fine Florist",
  "address": "2179 Hillsboro Rd, Franklin, TN, 37069",
  "website": "http://www.gardendelights.net/",
  "phone": "+16155999950"
 },
 {
  "row_id": "r120",
  "product": "USB-C charging cable",
  "name": "Bellows Forge",
  "address": "111 N Cedar St, Buda, TX, 78610-3353",
  "website": "http://www.bellowsforge.com/",
  "phone": "+15125043539"
 }
]
