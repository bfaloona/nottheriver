# Grading brief, batch 09

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

Write a JSON array to `docs/evidence/quality/open-place-precision/grades/batch-09.json` with one object per row, in the same order as the input, with exactly these keys: `row_id`, `sells_product`, `local_exists`, `page_access`, `basis`, `notes`, `checked`. Write nothing else to the repository. When you finish, reply with the counts of each `sells_product` value and anything that blocked you.

## Rows

[
 {
  "row_id": "r241",
  "product": "rain jacket",
  "name": "Stucchi Jewelers",
  "address": "3 Main St, Natick, MA, 01760-4505",
  "website": "http://www.stucchi.com",
  "phone": "+15086513990"
 },
 {
  "row_id": "r242",
  "product": "rechargeable AA batteries",
  "name": "Kunkin Patch",
  "address": "8000 Old Stage Rd, Morris, IL, 60450-8820",
  "website": null,
  "phone": "+18155304233"
 },
 {
  "row_id": "r243",
  "product": "jigsaw puzzle",
  "name": "Extreme Noise Records",
  "address": "407 W Lake St, Minneapolis, MN, 55408",
  "website": "http://www.extremenoise.com",
  "phone": "(612) 824-0100"
 },
 {
  "row_id": "r244",
  "product": "cast iron skillet",
  "name": "Cowls Building Supply",
  "address": "125 Sunderland Rd, Amherst, MA, 01059",
  "website": "http://www.cowlsbuildingsupply.com/",
  "phone": "+14135490001"
 },
 {
  "row_id": "r245",
  "product": "extra virgin olive oil",
  "name": "Atlantic Station",
  "address": "Atlanta, GA",
  "website": null,
  "phone": null
 },
 {
  "row_id": "r246",
  "product": "jigsaw puzzle",
  "name": "Steamship Games",
  "address": "711 Lake St W, Minneapolis, MN, 55408-2918",
  "website": "http://steamshipgames.com/",
  "phone": "+16128254066"
 },
 {
  "row_id": "r247",
  "product": "loose leaf green tea",
  "name": "Fergy's Bar and Grill",
  "address": "272 N Main St, Seneca, IL, 61360",
  "website": "http://www.fergysbar.com",
  "phone": "+18153578809"
 },
 {
  "row_id": "r248",
  "product": "cast iron skillet",
  "name": "Mind Over Matter",
  "address": "17 Beston St, Amherst, MA, 01002",
  "website": "http://mind-overmatter.com",
  "phone": "(413) 253-9485"
 },
 {
  "row_id": "r249",
  "product": "camping tent",
  "name": "Philadelphia Runner",
  "address": "1711 Walnut St, Philadelphia, PA, 19103",
  "website": "http://www.philadelphiarunner.com",
  "phone": "+12159728333"
 },
 {
  "row_id": "r250",
  "product": "cast iron skillet",
  "name": "Shaws Grocery",
  "address": "699 Mount Auburn St, Cambridge, MA, 02138",
  "website": "http://www.shaws.com/",
  "phone": null
 },
 {
  "row_id": "r251",
  "product": "camping tent",
  "name": "Spring Dance Hot Tubs of Plymouth Meeting",
  "address": "465 W Germantown Pike, Plymouth Meeting, PA, 19462",
  "website": "https://springdancehottubs.com/",
  "phone": "4845312116"
 },
 {
  "row_id": "r252",
  "product": "wool blanket",
  "name": "Archery Depot",
  "address": "28510 Co Rd 64, Gill, CO, 80624",
  "website": "http://www.archerydepotco.com/",
  "phone": "+19703518262"
 },
 {
  "row_id": "r253",
  "product": "headlamp",
  "name": "Flora Grubb Gardens",
  "address": "1074 Guerrero St, San Francisco, CA, 94110",
  "website": "http://www.floragrubb.com",
  "phone": "(415) 648-2670"
 },
 {
  "row_id": "r254",
  "product": "cast iron skillet",
  "name": "Ivy & Rose Department Store",
  "address": "2955  Hillcrest Avenue, Natick, MA, 01740",
  "website": null,
  "phone": "+17818569689"
 },
 {
  "row_id": "r255",
  "product": "camping tent",
  "name": "Nordstrom Rack",
  "address": "1700 Chestnut St, Philadelphia, PA, 19103",
  "website": "https://stores.nordstromrack.com/us/pa/philadelphia/1700-chestnut-street?utm_source=facebook&utm_medium=organic&utm_campaign=rack&utm_content=551&utm_channel=low_nd_seo_local&sp_source=facebook&sp_campaign=rack",
  "phone": "+12155996755"
 },
 {
  "row_id": "r256",
  "product": "cordless drill",
  "name": "Harpeth Village Fieldstone",
  "address": "2020 Fieldstone Pkwy, Franklin, TN, 37069",
  "website": "https://www.regencycenters.com/property/detail/226/Harpeth-Village-Fieldstone",
  "phone": "+14045753200"
 },
 {
  "row_id": "r257",
  "product": "USB-C charging cable",
  "name": "Buda's Flooring Store, Llc",
  "address": "1115 Main St  Ste 300, Buda, TX, 78610-3693",
  "website": "http://www.budasflooringstore.com",
  "phone": "5125238193"
 },
 {
  "row_id": "r258",
  "product": "loose leaf green tea",
  "name": "Paula's Homemade Kitchen",
  "address": "Marseilles, IL, 61341",
  "website": null,
  "phone": "+18153037441"
 },
 {
  "row_id": "r259",
  "product": "camping tent",
  "name": "Furniture Tip-Overs",
  "address": "1845 Walnut St, Philadelphia, PA, 19103-4700",
  "website": "http://www.furniture-tip-over-accidents.com/",
  "phone": "+12155991699"
 },
 {
  "row_id": "r260",
  "product": "headlamp",
  "name": "U Save Plumbing & Hardware",
  "address": "1146 Valencia St, San Francisco, CA, 94110-3027",
  "website": "http://www.u-saveplumbing.com",
  "phone": "+14152822562"
 },
 {
  "row_id": "r261",
  "product": "jigsaw puzzle",
  "name": "Magers & Quinn Booksellers",
  "address": "3038 Hennepin Ave, Minneapolis, MN, 55408",
  "website": "http://www.magersandquinn.com/",
  "phone": "+16128224611"
 },
 {
  "row_id": "r262",
  "product": "headlamp",
  "name": "Candle Light Shop",
  "address": "3330 24th St, San Francisco, CA, 94110",
  "website": "http://candlelightshop.net",
  "phone": "+14158244003"
 },
 {
  "row_id": "r263",
  "product": "cordless drill",
  "name": "Publix",
  "address": "2020 Fieldstone Pkwy, Franklin, TN, 37069",
  "website": "https://www.publix.com/?utm_medium=maps&utm_source=facebook&utm_content=psm_fb_override",
  "phone": "+16155991825"
 },
 {
  "row_id": "r264",
  "product": "LED light bulbs",
  "name": "Dollar Tree",
  "address": "1780 Tilden Ridge Dr, Hamburg, PA, 19526-8170",
  "website": "https://locations.dollartree.com/pa/hamburg/1780-tilden-ridge-dr",
  "phone": "+14846623599"
 },
 {
  "row_id": "r265",
  "product": "rechargeable AA batteries",
  "name": "We Fix That",
  "address": "482 Main St, Marseilles, IL, 61341",
  "website": "https://wefixthatil.com/",
  "phone": "8155009015"
 },
 {
  "row_id": "r266",
  "product": "headlamp",
  "name": "Food Villa",
  "address": "3347 24th St, San Francisco, CA, 94110-3869",
  "website": null,
  "phone": "+14158241777"
 },
 {
  "row_id": "r267",
  "product": "cast iron skillet",
  "name": "Neighbor Food Mart",
  "address": "324 College St, Amherst, MA, 01002-2331",
  "website": "https://www.neighborfoodmart.com",
  "phone": "14132568168"
 },
 {
  "row_id": "r268",
  "product": "wooden train set",
  "name": "Bound Booksellers & Gifts",
  "address": "158 Front St  Ste 106, Franklin, TN, 37064-5163",
  "website": "boundbookstn.com",
  "phone": "16156565345"
 },
 {
  "row_id": "r269",
  "product": "dark chocolate bar",
  "name": "Hanan's Gourmet Middle Eastern Catering",
  "address": "1335 El Camino Real, Burlingame, CA, 94010-4713",
  "website": "http://www.hanans.com/",
  "phone": "+16507036055"
 },
 {
  "row_id": "r270",
  "product": "cordless drill",
  "name": "Keychain manufacturer",
  "address": "29 legends ridge dr, Franklin, TN, 77386",
  "website": null,
  "phone": "+8615257958599"
 }
]
