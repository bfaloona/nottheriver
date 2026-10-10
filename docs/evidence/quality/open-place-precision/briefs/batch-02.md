# Grading brief, batch 02

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

Write a JSON array to `docs/evidence/quality/open-place-precision/grades/batch-02.json` with one object per row, in the same order as the input, with exactly these keys: `row_id`, `sells_product`, `local_exists`, `page_access`, `basis`, `notes`, `checked`. Write nothing else to the repository. When you finish, reply with the counts of each `sells_product` value and anything that blocked you.

## Rows

[
 {
  "row_id": "r031",
  "product": "rechargeable AA batteries",
  "name": "Ganz Greenhouse",
  "address": "1030 E Bluff St, Marseilles, IL, 61341",
  "website": null,
  "phone": "+18157954641"
 },
 {
  "row_id": "r032",
  "product": "cast iron skillet",
  "name": "The Goat Girls",
  "address": "132 Pelham Rd, Amherst, MA, 01002-1651",
  "website": "http://www.thegoatgirls.com/",
  "phone": "+14134616832"
 },
 {
  "row_id": "r033",
  "product": "wooden train set",
  "name": "Let's Roll Games, LLC",
  "address": "6960 Moores Ln, Brentwood, TN, 37027",
  "website": "https://www.letsrollgames.com/",
  "phone": "+16296547124"
 },
 {
  "row_id": "r034",
  "product": "camping tent",
  "name": "Bloomingdale's Outlet",
  "address": "1625 Chestnut St Suite 240-248, Philadelphia, PA, 19103",
  "website": "https://locations.bloomingdales.com/liberty-place-outlet",
  "phone": "+12678583200"
 },
 {
  "row_id": "r035",
  "product": "cordless drill",
  "name": "Santa's Christmas Trees - Franklin",
  "address": "2184 Hillsboro Rd, Franklin, TN, 37069",
  "website": "http://www.santaschristmastrees.com/",
  "phone": "6154674001"
 },
 {
  "row_id": "r036",
  "product": "loose leaf green tea",
  "name": "Refuge Coffee",
  "address": "113 William St, Seneca, IL, 61360",
  "website": null,
  "phone": null
 },
 {
  "row_id": "r037",
  "product": "cast iron skillet",
  "name": "Tile & Granite Solutions",
  "address": "30 Washington St, Natick, MA, 01760",
  "website": "https://www.tileandgranitesolutions.com",
  "phone": "(978) 420-8200"
 },
 {
  "row_id": "r038",
  "product": "bath towels",
  "name": "Gotcha Covered of West Minneapolis",
  "address": "3019 Bryant Ave S Apt 206, Minneapolis, MN, 55408",
  "website": "https://www.gotchacovered.com/west-minneapolis/",
  "phone": "(952) 260-2913"
 },
 {
  "row_id": "r039",
  "product": "rechargeable AA batteries",
  "name": "Randy's Maintenance",
  "address": "465 Broadway St, Marseilles, IL, 61341",
  "website": "https://www.randys-maintenance-inc.com",
  "phone": "(779) 206-0850"
 },
 {
  "row_id": "r040",
  "product": "USB-C charging cable",
  "name": "Buda Drug Store",
  "address": "203 N Railroad St, Buda, TX, 78610-3383",
  "website": "http://www.budadrugstore.com",
  "phone": "+15123122111"
 },
 {
  "row_id": "r041",
  "product": "dark chocolate bar",
  "name": "Urban Cigar & Smoke Shop",
  "address": "1199 Broadway  Ste 4, Burlingame, CA, 94010-3493",
  "website": "https://urban-cigar-smoke-shop.business.site",
  "phone": "16503152230"
 },
 {
  "row_id": "r042",
  "product": "headlamp",
  "name": "Kismet Sf Furniture",
  "address": "4001 24th St, San Francisco, CA, 94114-3715",
  "website": "https://www.kismetsf.com",
  "phone": "14159709030"
 },
 {
  "row_id": "r043",
  "product": "dark chocolate bar",
  "name": "Cafe Capuchino",
  "address": "1158 Capuchino Ave, Burlingame, CA, 94010-3510",
  "website": null,
  "phone": "16503422669"
 },
 {
  "row_id": "r044",
  "product": "cast iron skillet",
  "name": "Hamshaw Lumber",
  "address": "150 College St, Amherst, MA, 01002-2308",
  "website": "https://www.acehardware.com/store-details/17984",
  "phone": "+14132533411"
 },
 {
  "row_id": "r045",
  "product": "extra virgin olive oil",
  "name": "Wingstop",
  "address": "595 Piedmont Ave Ne Ste 330, Atlanta, GA, 30308",
  "website": "https://www.wingstop.com/location/wingstop-663-atlanta-ga-30308/menu?utm_source=facebook&utm_medium=distrib&utm_campaign=facebook-distrib",
  "phone": "+14048749464"
 },
 {
  "row_id": "r046",
  "product": "dark chocolate bar",
  "name": "Nuts For Candy",
  "address": "1241 Broadway, Burlingame, CA, 94010",
  "website": "http://www.nutsforcandy.com/",
  "phone": "+16503438758"
 },
 {
  "row_id": "r047",
  "product": "wool socks",
  "name": "Atlanta Gothworks",
  "address": "708 Argonne Ave NE APT 2, Atlanta, GA, 30308",
  "website": "https://www.atlgothworks.com/",
  "phone": "+14048046043"
 },
 {
  "row_id": "r048",
  "product": "wooden train set",
  "name": "The Good Tree",
  "address": "2176 Hillsboro Rd Suite 126 & 130, Franklin, TN, 37069",
  "website": "https://docs.google.com/forms/d/e/1FAIpQLScrwyjGo8kdQHoB5xR8s2kqJb8YOmuhVGpkU5mQYk6vpLGVlA/viewform?usp=send_form",
  "phone": "+16158665737"
 },
 {
  "row_id": "r049",
  "product": "jigsaw puzzle",
  "name": "Fleurs De Lee",
  "address": "410 W 38th St, Minneapolis, MN, 55409-1108",
  "website": "http://www.fleursdelee.com",
  "phone": "16128237311"
 },
 {
  "row_id": "r050",
  "product": "cordless drill",
  "name": "Walgreens",
  "address": "2045 Fieldstone Pkwy, Franklin, TN, 37069",
  "website": "https://www.walgreens.com",
  "phone": "+16155915828"
 },
 {
  "row_id": "r051",
  "product": "camping tent",
  "name": "Philly Team Store",
  "address": "1720 Chestnut St, Philadelphia, PA, 19103",
  "website": "http://www.phillyteamstore.com/",
  "phone": "2159415002"
 },
 {
  "row_id": "r052",
  "product": "camping tent",
  "name": "Ernie's Appliance Repair Service",
  "address": "1802 Mountain Rd, Hamburg, PA, 19526",
  "website": "https://erniesappliancerepair.com",
  "phone": "(610) 562-4045"
 },
 {
  "row_id": "r053",
  "product": "rechargeable AA batteries",
  "name": "Biewer Lumber",
  "address": "615 E Shipyard Rd, Seneca, IL, 61360",
  "website": "http://biewerlumber.com",
  "phone": "+18153576792"
 },
 {
  "row_id": "r054",
  "product": "wool blanket",
  "name": "Blade Runner",
  "address": "2434 E 8th St, Greeley, CO, 80631-9786",
  "website": null,
  "phone": "19703528780"
 },
 {
  "row_id": "r055",
  "product": "rechargeable AA batteries",
  "name": "Bauer Roofing",
  "address": "217 S Hossack St, Seneca, IL, 61360",
  "website": "http://bauerroofing.biz",
  "phone": "(815) 357-1275"
 },
 {
  "row_id": "r056",
  "product": "wool blanket",
  "name": "Bee Healthy Candles",
  "address": "38648 County Road 43, Eaton, CO, 80615",
  "website": "http://www.beehealthycandles.com",
  "phone": "(970) 834-9502"
 },
 {
  "row_id": "r057",
  "product": "USB-C charging cable",
  "name": "Wizards For Hire",
  "address": "601 S Loop 4 Bldg B, Buda, TX, 78610-5795",
  "website": "http://www.wizardsforhire.com",
  "phone": "+15129137443"
 },
 {
  "row_id": "r058",
  "product": "dark chocolate bar",
  "name": "Starbucks",
  "address": "1230 Broadway, Burlingame, CA, 94010",
  "website": "https://www.starbucks.com/store-locator/store/14081/",
  "phone": "+16503440747"
 },
 {
  "row_id": "r059",
  "product": "bath towels",
  "name": "Daibelys Galindo Emprendimiento",
  "address": "3400 Dupont Ave S, Minneapolis, MN, 55408-5005",
  "website": null,
  "phone": null
 },
 {
  "row_id": "r060",
  "product": "LED light bulbs",
  "name": "Burkey & Driscoll Funeral Home Inc",
  "address": "40 S 4th St, Hamburg, PA, 19526",
  "website": "http://www.burkeydriscoll.com/",
  "phone": "6105622955"
 }
]
