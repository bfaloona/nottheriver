# Grading brief, batch 01

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

Write a JSON array to `docs/evidence/quality/open-place-precision/grades/batch-01.json` with one object per row, in the same order as the input, with exactly these keys: `row_id`, `sells_product`, `local_exists`, `page_access`, `basis`, `notes`, `checked`. Write nothing else to the repository. When you finish, reply with the counts of each `sells_product` value and anything that blocked you.

## Rows

[
 {
  "row_id": "r001",
  "product": "camping tent",
  "name": "Tilden Ridge",
  "address": "1898 Tilden Ridge Dr, Hamburg, PA, 19526",
  "website": null,
  "phone": null
 },
 {
  "row_id": "r002",
  "product": "bath towels",
  "name": "Johnson Cleaning Solution",
  "address": "1406 W Lake St, Minneapolis, MN, 55408-2653",
  "website": "http://johnsoncleaningsolution.net/",
  "phone": "+16124431595"
 },
 {
  "row_id": "r003",
  "product": "dark chocolate bar",
  "name": "Il Fornaio",
  "address": "1415 N Carolan Ave, Burlingame, CA, 94010",
  "website": "http://www.ilfornaio.com/",
  "phone": "(650) 373-3400"
 },
 {
  "row_id": "r004",
  "product": "jigsaw puzzle",
  "name": "Belle Weather",
  "address": "3404 Lyndale Ave S, Minneapolis, MN, 55408",
  "website": "http://www.shopbelleweather.com",
  "phone": "(612) 825-2909"
 },
 {
  "row_id": "r005",
  "product": "rain jacket",
  "name": "Fairbanks Fancy Goods",
  "address": "2 Summer St Ste 9, NATICK, MA, 01760",
  "website": "https://fairbanksfancygoods.com/",
  "phone": "6173065460"
 },
 {
  "row_id": "r006",
  "product": "camping tent",
  "name": "Dollar Tree",
  "address": "1780 Tilden Ridge Dr, Hamburg, PA, 19526-8170",
  "website": "https://locations.dollartree.com/pa/hamburg/1780-tilden-ridge-dr",
  "phone": "+14846623599"
 },
 {
  "row_id": "r007",
  "product": "USB-C charging cable",
  "name": "Thatcher",
  "address": "218 Main St, Buda, TX, 78610-3309",
  "website": "https://www.thatcherbuda.com",
  "phone": "+15123129601"
 },
 {
  "row_id": "r008",
  "product": "cast iron skillet",
  "name": "A J's  Glass and Aluminium",
  "address": "nemamwa , Natick, MA",
  "website": null,
  "phone": "+263779047997"
 },
 {
  "row_id": "r009",
  "product": "USB-C charging cable",
  "name": "Zoi Medicinals",
  "address": "200 Main St, Buda, TX, 78610",
  "website": "http://www.zoimedicinals.com/",
  "phone": "+15126480610"
 },
 {
  "row_id": "r010",
  "product": "USB-C charging cable",
  "name": "Pac-N-Sac",
  "address": "101 Jack C Hays Trl, Buda, TX, 78610-3301",
  "website": "http://www.sacnpac.com",
  "phone": "+15122952978"
 },
 {
  "row_id": "r011",
  "product": "dark chocolate bar",
  "name": "Din Tai Fung",
  "address": "2855 Stevens Creek Blvd, Santa Clara, CA, 95050",
  "website": "https://dtf.com/en/locations/santa-clara",
  "phone": "(408) 248-1688"
 },
 {
  "row_id": "r012",
  "product": "headlamp",
  "name": "Viking CO",
  "address": "1699 Valencia St, San Francisco, CA, 94110",
  "website": "http://viking-co.com/San-Francisco",
  "phone": "4154834232"
 },
 {
  "row_id": "r013",
  "product": "camping tent",
  "name": "Lovesac",
  "address": "1724 Walnut St, Philadelphia, PA, 19103",
  "website": "http://www.lovesac.com/",
  "phone": "+12157351979"
 },
 {
  "row_id": "r014",
  "product": "extra virgin olive oil",
  "name": "Chevron Station Atlanta",
  "address": "180 Ponce De Leon Ave NE, Atlanta, GA, 30308",
  "website": null,
  "phone": "7704478030"
 },
 {
  "row_id": "r015",
  "product": "cast iron skillet",
  "name": "Red Fire North",
  "address": "485 Federal St, Montague, MA, 01351",
  "website": "http://www.redfirenorth.com/",
  "phone": "+14133673071"
 },
 {
  "row_id": "r016",
  "product": "camping tent",
  "name": "Plymouth Meeting Mall",
  "address": "500 W Germantown Pike, Plymouth Meeting, PA, 19462-1353",
  "website": "https://shopplymouthmeetingmall.com",
  "phone": "16108259351"
 },
 {
  "row_id": "r017",
  "product": "cast iron skillet",
  "name": "Vintage Table",
  "address": "33 Florence St, Natick, MA, 01760",
  "website": "http://www.TheVintageTable.net/",
  "phone": "+15086554642"
 },
 {
  "row_id": "r018",
  "product": "USB-C charging cable",
  "name": "Pathway Communications Ltd",
  "address": "100 Precision  Ste 302, Buda, TX, 78610-5867",
  "website": "pathwaycommunicationsltd.com",
  "phone": "19724366161"
 },
 {
  "row_id": "r019",
  "product": "headlamp",
  "name": "JMB Construction",
  "address": "3401 Cesar Chavez, San Francisco, CA, 94110",
  "website": "http://www.jmbconstruction.com",
  "phone": "(415) 648-4310"
 },
 {
  "row_id": "r020",
  "product": "cast iron skillet",
  "name": "Dod Contractors",
  "address": "112 South Ave, Natick, MA, 01760-4609",
  "website": "https://dodcontractorsinc.com/",
  "phone": "+17743623223"
 },
 {
  "row_id": "r021",
  "product": "cordless drill",
  "name": "Buck Steel",
  "address": "1107 Battlewood St, Franklin, TN, 37069",
  "website": "http://www.bucksteel.com/",
  "phone": "6155495539"
 },
 {
  "row_id": "r022",
  "product": "cordless drill",
  "name": "Arborist On Call",
  "address": "1994 Berrys Chapel Rd, Franklin, TN, 37069",
  "website": "http://www.nashvilletreeservices.com",
  "phone": "(615) 790-3411"
 },
 {
  "row_id": "r023",
  "product": "cast iron skillet",
  "name": "M and A Contractors",
  "address": "76 Summer St, Natick, MA, 01760",
  "website": "http://www.Macandd.com/",
  "phone": "+18602875215"
 },
 {
  "row_id": "r024",
  "product": "wool blanket",
  "name": "Green Earth Commercial Sanitation",
  "address": "23595 County Road 62, Greeley, CO, 80631",
  "website": "https://greenearthcolorado.com/pages/disinfecting-services/?utm_source=primary&utm_medium=organic-traffic&utm_campaign=greeley-gmb",
  "phone": "9708151000"
 },
 {
  "row_id": "r025",
  "product": "cast iron skillet",
  "name": "Red Line Music Distribution, Inc.",
  "address": "85 N Whitney St Ste 120, Amherst, MA, 01002",
  "website": "http://www.redlinemusicdistribution.com/",
  "phone": "+14138350855"
 },
 {
  "row_id": "r026",
  "product": "rechargeable AA batteries",
  "name": "Seneca Food Mart",
  "address": "271 S Main St, Seneca, IL, 61360",
  "website": "http://www.senecafoods.com",
  "phone": "+18153576734"
 },
 {
  "row_id": "r027",
  "product": "loose leaf green tea",
  "name": "Seneca Food Mart",
  "address": "271 S Main St, Seneca, IL, 61360",
  "website": "http://www.senecafoods.com",
  "phone": "+18153576734"
 },
 {
  "row_id": "r028",
  "product": "cordless drill",
  "name": "The Camera Eye",
  "address": "2020 Fieldstone Pkwy, Franklin, TN, 37069-4337",
  "website": "http://www.thecameraeye.com",
  "phone": "6153981103"
 },
 {
  "row_id": "r029",
  "product": "wooden train set",
  "name": "Harpeth Village Fieldstone",
  "address": "2020 Fieldstone Pkwy, Franklin, TN, 37069",
  "website": "https://www.regencycenters.com/property/detail/226/Harpeth-Village-Fieldstone",
  "phone": "+14045753200"
 },
 {
  "row_id": "r030",
  "product": "cast iron skillet",
  "name": "Kitchen Engineering",
  "address": "31 Belmont St, Cambridge, MA, 02138-4441",
  "website": null,
  "phone": null
 }
]
