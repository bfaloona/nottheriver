# Grading brief, batch 05

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

Write a JSON array to `docs/evidence/quality/open-place-precision/grades/batch-05.json` with one object per row, in the same order as the input, with exactly these keys: `row_id`, `sells_product`, `local_exists`, `page_access`, `basis`, `notes`, `checked`. Write nothing else to the repository. When you finish, reply with the counts of each `sells_product` value and anything that blocked you.

## Rows

[
 {
  "row_id": "r121",
  "product": "cast iron skillet",
  "name": "Sleep Number",
  "address": "357 Fresh Pond Pkwy, Cambridge, MA, 02138-2114",
  "website": "https://www.sleepnumber.com",
  "phone": "+16179455047"
 },
 {
  "row_id": "r122",
  "product": "jigsaw puzzle",
  "name": "Petersen Flowers",
  "address": "410 38th St W, Minneapolis, MN, 55409-1108",
  "website": "http://www.petersenflowers.com/",
  "phone": "+16128237311"
 },
 {
  "row_id": "r123",
  "product": "cast iron skillet",
  "name": "Summerlin Floors",
  "address": "322 College St, Amherst, MA, 01002",
  "website": "https://www.summerlinfloors.com/",
  "phone": "+14132539022"
 },
 {
  "row_id": "r124",
  "product": "wool blanket",
  "name": "D&R Roofing ",
  "address": "30574 County Road 78, Eaton, CO, 80615-9704",
  "website": "https://dandrroofing.com/",
  "phone": "+19705391827"
 },
 {
  "row_id": "r125",
  "product": "LED light bulbs",
  "name": "M & R Hardware and Tool",
  "address": "13 S 4th St, Hamburg, PA, 19526-1268",
  "website": "https://www.mandrhardware.com",
  "phone": "+16103400059"
 },
 {
  "row_id": "r126",
  "product": "dark chocolate bar",
  "name": "Istanbul Market SF",
  "address": "1199 Broadway, Burlingame, CA, 94010",
  "website": "http://www.istanbulmarketsf.com/",
  "phone": "+16503934404"
 },
 {
  "row_id": "r127",
  "product": "cast iron skillet",
  "name": "Starview Gardens",
  "address": "475 Amherst Rd, Sunderland, MA, 01375",
  "website": "http://www.starviewgardens.com/",
  "phone": "+14134799335"
 },
 {
  "row_id": "r128",
  "product": "bath towels",
  "name": "G&L Furniture",
  "address": "320 West Lake Stree, Minneapolis, MN, 55408",
  "website": "https://www.glfurnitures.com",
  "phone": "(612) 824-5655"
 },
 {
  "row_id": "r129",
  "product": "loose leaf green tea",
  "name": "Ram Sita Corporation",
  "address": "271 S Main St, Seneca, IL, 61360-9415",
  "website": null,
  "phone": null
 },
 {
  "row_id": "r130",
  "product": "loose leaf green tea",
  "name": "D and S Foods",
  "address": "120 E Bluff St, Marseilles, IL, 61341",
  "website": "http://www.dsfoods.com/",
  "phone": "+18157954200"
 },
 {
  "row_id": "r131",
  "product": "cast iron skillet",
  "name": "Talon Furniture & Mattress",
  "address": "320 College St, Amherst, MA, 01002-2331",
  "website": "http://www.talonfurniture.com",
  "phone": "14132303253"
 },
 {
  "row_id": "r132",
  "product": "jigsaw puzzle",
  "name": "Game Stop",
  "address": "1221 W Lake St Ste 103, Minneapolis, MN, 55408",
  "website": null,
  "phone": "6128273853"
 },
 {
  "row_id": "r133",
  "product": "USB-C charging cable",
  "name": "Downtown Buda Farmers' Market",
  "address": "308 S Main St, Buda, TX, 78610-3862",
  "website": "http://www.budatxfarmersmarket.com/",
  "phone": null
 },
 {
  "row_id": "r134",
  "product": "wool socks",
  "name": "Duce En",
  "address": "730 Peachtree St Ne  Ste 570, Atlanta, GA, 30308-1244",
  "website": "http://duceen.com.co",
  "phone": "16785723080"
 },
 {
  "row_id": "r135",
  "product": "rain jacket",
  "name": "Ivy & Rose Department Store",
  "address": "2955  Hillcrest Avenue, Natick, MA, 01740",
  "website": null,
  "phone": "+17818569689"
 },
 {
  "row_id": "r136",
  "product": "wool blanket",
  "name": "Reliable Rooter Service L.L.C.",
  "address": "513 Kohler Farms Rd, Kersey, CO, 80644",
  "website": "http://reliablerooterservice.com",
  "phone": "(970) 573-9132"
 },
 {
  "row_id": "r137",
  "product": "camping tent",
  "name": "Ikea Service Office",
  "address": "496 W Germantown Pike, Plymouth Meeting, PA, 19462-1302",
  "website": null,
  "phone": "+16108340180"
 },
 {
  "row_id": "r138",
  "product": "rechargeable AA batteries",
  "name": "Ace Hardware",
  "address": "255 S Main St, Seneca, IL, 61360",
  "website": "http://www.acehardware.com/store-details/16926",
  "phone": "+18153576144"
 },
 {
  "row_id": "r139",
  "product": "camping tent",
  "name": "Aldi",
  "address": "15 Wilderness Trl, Hamburg, PA, 19526-8177",
  "website": "https://stores.aldi.us/pa/hamburg/15-wilderness-trl?utm_source=fb&utm_medium=local&utm_campaign=brand&utm_content=storepage_webclick",
  "phone": "+18559552534"
 },
 {
  "row_id": "r140",
  "product": "USB-C charging cable",
  "name": "Zoi Market",
  "address": "200 Main St, Buda, TX, 78610",
  "website": "https://www.thezoimarket.com",
  "phone": "+15123610033"
 },
 {
  "row_id": "r141",
  "product": "extra virgin olive oil",
  "name": "Ponce Mini Market",
  "address": "75 Ponce De Leon Ave Ne Ste 100, Atlanta, GA, 30308-1995",
  "website": "http://ponceminimarket.com",
  "phone": "+14044164880"
 },
 {
  "row_id": "r142",
  "product": "wooden train set",
  "name": "Luna Record Shop",
  "address": "230 Franklin Rd #12d, Franklin, TN, 37064",
  "website": "http://www.lunarecordshop.com/",
  "phone": "+16292622680"
 },
 {
  "row_id": "r143",
  "product": "cordless drill",
  "name": "Conserva Irrigation of Nashville South",
  "address": "203 Saddlebridge Ln, Franklin, TN, 37069",
  "website": "https://www.conservairrigation.com/nashville-south",
  "phone": "(615) 857-4359"
 },
 {
  "row_id": "r144",
  "product": "USB-C charging cable",
  "name": "The Mercantile at Mill + Grain",
  "address": "304 S Main St #101, Buda, TX, 78610",
  "website": "http://www.themercantile.shop/",
  "phone": "+15125238668"
 },
 {
  "row_id": "r145",
  "product": "cast iron skillet",
  "name": "Earth First Flooring & Tile Co.",
  "address": "289 Amherst Rd, Sunderland, MA, 01375",
  "website": "http://earth1stflooring.com/",
  "phone": "+14133973586"
 },
 {
  "row_id": "r146",
  "product": "LED light bulbs",
  "name": "Walmart",
  "address": "1800 Tilden Ridge Dr, Hamburg, PA, 19526",
  "website": "https://www.walmart.com/store/4612-hamburg-pa/pharmacy/",
  "phone": "4846684008"
 },
 {
  "row_id": "r147",
  "product": "headlamp",
  "name": "Rent-A-Center",
  "address": "2853 Mission St, San Francisco, CA, 94110",
  "website": null,
  "phone": "4152822522"
 },
 {
  "row_id": "r148",
  "product": "rain jacket",
  "name": "Kendra Scott",
  "address": "1245 Worcester St., Natick, MA, 01760, United States, MA",
  "website": "https://www.kendrascott.com/stores/massachusetts/natick/265162",
  "phone": null
 },
 {
  "row_id": "r149",
  "product": "cast iron skillet",
  "name": "Beyt2",
  "address": "185 Mount Auburn St, Cambridge, MA, 02138-4810",
  "website": null,
  "phone": "+16174018415"
 },
 {
  "row_id": "r150",
  "product": "loose leaf green tea",
  "name": "Fat Daddyz",
  "address": "176 W Jackson St, Seneca, IL, 61360",
  "website": "https://fatdaddyz.wixsite.com/my-site-1",
  "phone": "+18153578700"
 }
]
