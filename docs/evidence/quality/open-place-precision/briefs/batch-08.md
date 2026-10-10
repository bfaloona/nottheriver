# Grading brief, batch 08

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

Write a JSON array to `docs/evidence/quality/open-place-precision/grades/batch-08.json` with one object per row, in the same order as the input, with exactly these keys: `row_id`, `sells_product`, `local_exists`, `page_access`, `basis`, `notes`, `checked`. Write nothing else to the repository. When you finish, reply with the counts of each `sells_product` value and anything that blocked you.

## Rows

[
 {
  "row_id": "r211",
  "product": "USB-C charging cable",
  "name": "McKay Lumber Inc",
  "address": "180 Tecon Cv, Buda, TX, 78610",
  "website": null,
  "phone": "5124783424"
 },
 {
  "row_id": "r212",
  "product": "wool socks",
  "name": "Tiffany Brown Ltd",
  "address": "533 Peachtree St NE Ste B, Atlanta, GA, 30308",
  "website": "http://www.tbrownltd.com",
  "phone": "(404) 347-1556"
 },
 {
  "row_id": "r213",
  "product": "jigsaw puzzle",
  "name": "Kinoko Kids",
  "address": "3803 Grand Ave S, Minneapolis, MN, 55409",
  "website": "http://www.kinokokids.com/",
  "phone": "+16125455741"
 },
 {
  "row_id": "r214",
  "product": "wooden train set",
  "name": "Bound Booksellers & Gifts",
  "address": "230 Franklin Rd #11F, Franklin, TN, 37064",
  "website": "https://boundbookstn.com/",
  "phone": "+16156565345"
 },
 {
  "row_id": "r215",
  "product": "rain jacket",
  "name": "Optica",
  "address": "23 Main St, Natick, MA, 01760",
  "website": "http://www.opticanatick.com/",
  "phone": "+15086552594"
 },
 {
  "row_id": "r216",
  "product": "camping tent",
  "name": "The Mattress Factory",
  "address": "465 W Germantown Pike, Plymouth Meeting, PA, 19462-1301",
  "website": "https://www.themattressfactoryinc.com/store/33/plymouth-meeting-mattress-store/",
  "phone": "+14845327110"
 },
 {
  "row_id": "r217",
  "product": "wooden train set",
  "name": "Barnes & Noble Booksellers",
  "address": "104 Claude Yates Dr, Franklin, TN, 37064-2085",
  "website": "http://www.barnesandnoble.com/",
  "phone": "+16155994173"
 },
 {
  "row_id": "r218",
  "product": "jigsaw puzzle",
  "name": "Present Moment Herbs & Books",
  "address": "3546 Grand Ave S, Minneapolis, MN, 55408",
  "website": "http://www.presentmoment.com/",
  "phone": "+16128243157"
 },
 {
  "row_id": "r219",
  "product": "wool socks",
  "name": "Ubikwitas7 World Of Hats",
  "address": "620 Peachtree St, Atlanta, GA, 30308-2300",
  "website": "https://ubikwitas7.com/",
  "phone": "+14042543110"
 },
 {
  "row_id": "r220",
  "product": "wooden train set",
  "name": "Redbox",
  "address": "305 Independence Sq, Franklin, TN, 37064",
  "website": null,
  "phone": "8667332693"
 },
 {
  "row_id": "r221",
  "product": "dark chocolate bar",
  "name": "Drake Avenue Bar&Grill",
  "address": "Burlingame, CA",
  "website": null,
  "phone": null
 },
 {
  "row_id": "r222",
  "product": "extra virgin olive oil",
  "name": "La Mongerie Bakery",
  "address": "265 Ponce de Leon Ave NE, Atlanta, GA, 30308",
  "website": "http://www.lamongerie.com",
  "phone": "(404) 817-7515"
 },
 {
  "row_id": "r223",
  "product": "jigsaw puzzle",
  "name": "Castle Accordion",
  "address": "3252 Lyndale Ave S, Minneapolis, MN, 55408",
  "website": "http://www.castleaccordion.com",
  "phone": "(612) 821-8766"
 },
 {
  "row_id": "r224",
  "product": "LED light bulbs",
  "name": "Ernie's Appliance Repair Service",
  "address": "1802 Mountain Rd, Hamburg, PA, 19526",
  "website": "https://erniesappliancerepair.com",
  "phone": "(610) 562-4045"
 },
 {
  "row_id": "r225",
  "product": "camping tent",
  "name": "Macy's Plymouth Meeting",
  "address": "4444 Plymouth Meeting Mall, Plymouth Meeting, PA, 19462",
  "website": "http://www.macys.com/?cm_mmc=macys_stores-_-Plymouth%20Meeting-_-n-_-156",
  "phone": "6108251700"
 },
 {
  "row_id": "r226",
  "product": "bath towels",
  "name": "Nicollet Market Garden Cooperative",
  "address": "3345 Nicollet Ave S, Minneapolis, MN, 55408-4443",
  "website": "http://twitter.com/nicolletgarden",
  "phone": "+16514859479"
 },
 {
  "row_id": "r227",
  "product": "camping tent",
  "name": "Bass Pro Shops",
  "address": "100 Cabela Dr, Hamburg, PA, 19526-8777",
  "website": "http://www.basspro.com/",
  "phone": "+16109297000"
 },
 {
  "row_id": "r228",
  "product": "wool socks",
  "name": "Atlantic Station",
  "address": "Atlanta, GA",
  "website": null,
  "phone": null
 },
 {
  "row_id": "r229",
  "product": "camping tent",
  "name": "Dick's Sporting Goods",
  "address": "500 W Germantown Pike, Plymouth Meeting, PA, 19462-1353",
  "website": "http://www.dickssportinggoods.com",
  "phone": "+14843510045"
 },
 {
  "row_id": "r230",
  "product": "cast iron skillet",
  "name": "HomeGoods",
  "address": "198 Alewife Brook Pkwy, Cambridge, MA, 02138",
  "website": "http://www.homegoods.com/",
  "phone": "+16174928500"
 },
 {
  "row_id": "r231",
  "product": "wool socks",
  "name": "Johnny London Llc",
  "address": "730 Peachtree St Ne  Ste 570, Atlanta, GA, 30308-1244",
  "website": null,
  "phone": "18006521719"
 },
 {
  "row_id": "r232",
  "product": "camping tent",
  "name": "Priority One Surplus",
  "address": "1744 Tilden Ridge Dr, Hamburg, PA, 19526-8170",
  "website": "http://www.priorityonesurplus.com/",
  "phone": "+16104882957"
 },
 {
  "row_id": "r233",
  "product": "loose leaf green tea",
  "name": "Dollar General",
  "address": "484 N Main St, Seneca, IL, 61360",
  "website": "https://www.dollargeneral.com/store-directory/il/seneca/17461",
  "phone": "+18153577110"
 },
 {
  "row_id": "r234",
  "product": "bath towels",
  "name": "Twin city, concrete yard and garden",
  "address": "3024 Harriet Ave, Minneapolis, MN, 55408-2905",
  "website": "https://www.pinterest.com/twincityconcreteyardandgarden/",
  "phone": "+16124708332"
 },
 {
  "row_id": "r235",
  "product": "jigsaw puzzle",
  "name": "Tower Games",
  "address": "3920 Nicollet Ave #150, Minneapolis, MN, 55409",
  "website": "http://towergamesmn.com/",
  "phone": "+16128234477"
 },
 {
  "row_id": "r236",
  "product": "wool socks",
  "name": "Ice Dazzle",
  "address": "730 Peachtree St NE, Atlanta, GA, 30308",
  "website": "https://www.icedazzle.com/",
  "phone": null
 },
 {
  "row_id": "r237",
  "product": "LED light bulbs",
  "name": "Tilden Ridge Shopping Center",
  "address": "1712 Tilden Ridge Dr, Hamburg, PA, 19526-8170",
  "website": "http://stores.gnc.com/pa/hamburg/974",
  "phone": "+16105624583"
 },
 {
  "row_id": "r238",
  "product": "LED light bulbs",
  "name": "Blatts Bargains",
  "address": "218 Pine St, Hamburg, PA, 19526-1815",
  "website": "http://Blattsbargains.com/",
  "phone": "+16107634649"
 },
 {
  "row_id": "r239",
  "product": "rechargeable AA batteries",
  "name": "Pipe & Piling Supplies Ltd",
  "address": "501 Shipyard Rd, Seneca, IL, 61360-9203",
  "website": "https://www.pipe-piling.com",
  "phone": "18153576899"
 },
 {
  "row_id": "r240",
  "product": "rain jacket",
  "name": "Vans",
  "address": "1245 Worcester Street, Suite #1164, Natick, MA, 01760",
  "website": "https://locations.vans.com/Natick/Natick/USA389",
  "phone": null
 }
]
