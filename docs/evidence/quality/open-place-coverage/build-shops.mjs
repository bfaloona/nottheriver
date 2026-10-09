// Step 1 of the open place data coverage check (docs/open-place-coverage.md): the 86 graded
// "nearby" baseline shops of eval20-0925, each with a hand-mapped expected location and name
// pattern, written to shops.json. The baseline is read only to check it against a third dataset;
// nothing here feeds an eval's candidate selection.
//   node docs/evidence/quality/open-place-coverage/build-shops.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const DIR = 'docs/evidence/quality/open-place-coverage';
const grades = JSON.parse(readFileSync('docs/evidence/quality/eval60/grades.json', 'utf8'));
const ids = JSON.parse(readFileSync('docs/evidence/quality/eval20-0925/method/ids.json', 'utf8')).ids;
const queries = JSON.parse(readFileSync('eval/queries.json', 'utf8')).queries;
const zips = JSON.parse(readFileSync('public/zips.json', 'utf8'));

/**
 * Expected location and name pattern per baseline name. `place` is the Nominatim query for the
 * expected location, read off the baseline name and URL: a street address when the URL carries
 * one, a landmark (mall, neighborhood) when the name carries one, else the city. `radius_mi` is
 * the accept radius around that geocode (0.5 address, 1 landmark, 6 small city, 10 large city).
 * `name_re` is the precise name test (case-insensitive, whole name). `street` narrows a
 * city-level match to objects whose `addr:street` contains it, when the name carries a street.
 * @type {Record<string, {place: string, radius_mi: number, name_re: string, street?: string}>}
 */
const MAP = {
  "Blackstone's of Beacon Hill (Boston)": { place: 'Charles Street, Beacon Hill, Boston, MA', radius_mi: 1, name_re: "^Blackstone'?s" },
  'Boston General Store (Brookline)': { place: 'Brookline, MA', radius_mi: 6, name_re: '^Boston General Store' },
  'The Home Depot (Somerville)': { place: 'Somerville, MA', radius_mi: 6, name_re: '^(The )?Home Depot$' },
  'Sur La Table (Natick)': { place: 'Natick Mall, Natick, MA', radius_mi: 1, name_re: '^Sur La Table$' },
  'Crate & Barrel (Natick Mall)': { place: 'Natick Mall, Natick, MA', radius_mi: 1, name_re: '^Crate (&|and) Barrel$' },
  'The Home Depot (Natick)': { place: 'Natick, MA', radius_mi: 6, name_re: '^(The )?Home Depot$' },
  'Target (Framingham)': { place: 'Framingham, MA', radius_mi: 6, name_re: '^(Super)?Target$' },
  'Kitchen Outfitters (Acton)': { place: 'Acton, MA', radius_mi: 6, name_re: '^Kitchen Outfitters' },
  "The Baker's Pin (Northampton)": { place: 'Northampton, MA', radius_mi: 6, name_re: "^(The )?Baker'?s Pin" },
  'Target (Hadley)': { place: 'Hadley, MA', radius_mi: 6, name_re: '^(Super)?Target$' },
  'The Home Depot (Hadley)': { place: 'Hadley, MA', radius_mi: 6, name_re: '^(The )?Home Depot$' },
  'Walmart (Northampton)': { place: 'Northampton, MA', radius_mi: 6, name_re: '^Walmart( Supercenter| Neighborhood Market)?$' },
  'Walmart (Roosevelt Blvd, Philadelphia)': { place: 'Philadelphia, PA', radius_mi: 10, name_re: '^Walmart( Supercenter| Neighborhood Market)?$', street: 'Roosevelt' },
  'REI (Conshohocken)': { place: 'Conshohocken, PA', radius_mi: 6, name_re: '^REI( Co-op)?$' },
  'REI (Conshohocken/Plymouth Meeting)': { place: 'Plymouth Meeting, PA', radius_mi: 6, name_re: '^REI( Co-op)?$' },
  "DICK'S Sporting Goods (Plymouth Meeting Mall)": { place: 'Plymouth Meeting Mall, Plymouth Meeting, PA', radius_mi: 1, name_re: "^Dick'?s Sporting Goods$" },
  'REI (King of Prussia)': { place: 'King of Prussia, PA', radius_mi: 6, name_re: '^REI( Co-op)?$' },
  'L.L.Bean (King of Prussia)': { place: 'King of Prussia, PA', radius_mi: 6, name_re: '^L\\.? ?L\\.? ?Bean$' },
  'Walmart Supercenter (Norristown)': { place: 'Norristown, PA', radius_mi: 6, name_re: '^Walmart( Supercenter| Neighborhood Market)?$' },
  "Cabela's (Hamburg)": { place: '100 Cabela Drive, Hamburg, PA', radius_mi: 0.5, name_re: "^Cabela'?s$" },
  'Walmart Supercenter (Hamburg)': { place: 'Hamburg, PA', radius_mi: 6, name_re: '^Walmart( Supercenter| Neighborhood Market)?$' },
  "Dunham's Sports (Pottsville)": { place: 'Pottsville, PA', radius_mi: 6, name_re: "^Dunham'?s( Sports)?$" },
  "DICK'S Sporting Goods (Reading)": { place: 'Reading, PA', radius_mi: 6, name_re: "^Dick'?s Sporting Goods$" },
  'High Country Outfitters (Midtown, Ansley Mall)': { place: 'Ansley Mall, Midtown, Atlanta, GA', radius_mi: 1, name_re: '^High Country Outfitters$' },
  'Mountain High Outfitters (Buckhead)': { place: 'Buckhead, Atlanta, GA', radius_mi: 3, name_re: '^Mountain High Outfitters$' },
  "Abbadabba's Little Five Points": { place: 'Little Five Points, Atlanta, GA', radius_mi: 1, name_re: "^Abbadabba'?s" },
  'AT&T Store (Buda, Main St)': { place: 'Buda, TX', radius_mi: 6, name_re: '^AT&T( Store)?$', street: 'Main' },
  'Target (Kyle)': { place: 'Kyle, TX', radius_mi: 6, name_re: '^(Super)?Target$' },
  'Best Buy (Southpark Meadows, Austin)': { place: '9600 S Interstate 35, Austin, TX', radius_mi: 0.5, name_re: '^Best Buy$' },
  'Sports Basement (Bryant St)': { place: 'San Francisco, CA', radius_mi: 7, name_re: '^Sports Basement', street: 'Bryant' },
  'Target (San Francisco Central, 789 Mission St)': { place: '789 Mission St, San Francisco, CA', radius_mi: 0.5, name_re: '^(Super)?Target$' },
  'Harbor Freight (San Rafael)': { place: '863 East Francisco Blvd, San Rafael, CA 94901', radius_mi: 0.5, name_re: '^Harbor Freight( Tools)?$' },
  "Heiser's Ace Hardware (Orwigsburg)": { place: 'Orwigsburg, PA', radius_mi: 6, name_re: "^Heiser'?s( Ace Hardware)?$|^Ace Hardware$" },
  'Dewald & Lengle Hardware (Friedensburg)': { place: 'Friedensburg, PA', radius_mi: 6, name_re: '^Dewald' },
  'Denney Electric Supply (Schuylkill Haven)': { place: 'Schuylkill Haven, PA', radius_mi: 6, name_re: '^Denney' },
  "Lowe's (Hamburg)": { place: 'Hamburg, PA', radius_mi: 6, name_re: "^Lowe'?s( Home Improvement)?$" },
  'Brilliant Sky Toys and Books (Brentwood)': { place: 'Brentwood, TN', radius_mi: 6, name_re: '^Brilliant Sky' },
  'Phillips Toy Mart (Nashville, Harding Pike)': { place: 'Nashville, TN', radius_mi: 10, name_re: '^Phillips Toy', street: 'Harding' },
  'Target (Cool Springs, Franklin)': { place: 'CoolSprings Galleria, Franklin, TN', radius_mi: 1, name_re: '^(Super)?Target$' },
  'Target (St Louis Park Hwy 100)': { place: 'St. Louis Park, MN', radius_mi: 6, name_re: '^(Super)?Target$', street: '100' },
  'HomeGoods (St. Louis Park, Knollwood)': { place: 'Knollwood Mall, St. Louis Park, MN', radius_mi: 1, name_re: '^Home ?Goods$' },
  'H-E-B (Buda)': { place: 'Buda, TX', radius_mi: 6, name_re: '^H-?E-?B( plus!?)?$' },
  'REI (Atlanta, NE Expressway)': { place: 'Atlanta, GA', radius_mi: 10, name_re: '^REI( Co-op)?$', street: 'Expressway' },
  'Butters Ace Hardware (Thompsons Station)': { place: "Thompson's Station, TN", radius_mi: 6, name_re: "^Butters'? Ace Hardware$|^Ace Hardware$" },
  'B & C Hardware (Ace, Brentwood)': { place: 'Brentwood, TN', radius_mi: 6, name_re: '^B ?& ?C (Ace )?Hardware$|^Ace Hardware$' },
  "Guthrie's Ace Hardware (Nashville, Charlotte Pike)": { place: 'Nashville, TN', radius_mi: 10, name_re: "^Guthrie'?s Ace Hardware$|^Ace Hardware$", street: 'Charlotte' },
  'Hillsboro Hardware (Nashville)': { place: 'Nashville, TN', radius_mi: 10, name_re: '^Hillsboro Hardware' },
  'Harbor Freight Tools (Antioch)': { place: '5211 Hickory Hollow Pkwy, Antioch, TN 37013', radius_mi: 0.5, name_re: '^Harbor Freight( Tools)?$' },
  'Kinoko Kids': { place: 'Minneapolis, MN', radius_mi: 8, name_re: '^Kinoko' },
  'The Store at Mia (Minneapolis Institute of Art)': { place: 'Minneapolis Institute of Art, Minneapolis, MN', radius_mi: 0.5, name_re: '^(The )?Store at Mia|^Mia Store|^Minneapolis Institute of Arts?$' },
  'Games By James (Southdale Center)': { place: 'Southdale Center, Edina, MN', radius_mi: 1, name_re: '^Games By James' },
  'Pinwheels and Play Toys': { place: 'Minneapolis, MN', radius_mi: 10, name_re: '^Pinwheels' },
  'Barnes & Noble (Galleria, Edina)': { place: 'Galleria Edina, Edina, MN', radius_mi: 1, name_re: '^Barnes (&|and) Noble' },
  'Pendleton Woolen Mills (Fort Collins)': { place: 'Fort Collins, CO', radius_mi: 6, name_re: '^Pendleton' },
  'JAX Outdoor Gear (Fort Collins)': { place: 'Fort Collins, CO', radius_mi: 6, name_re: '^JAX( Outdoor Gear| Ranch & Home| Mercantile| Goods)?$' },
  'The North Face Natick Mall': { place: 'Natick Mall, Natick, MA', radius_mi: 1, name_re: '^(The )?North Face$' },
  'Natick Outdoor Store': { place: 'Natick, MA', radius_mi: 6, name_re: '^Natick Outdoor' },
  'L.L.Bean Framingham Retail Store': { place: 'Framingham, MA', radius_mi: 6, name_re: '^L\\.? ?L\\.? ?Bean$' },
  'Publix (The Plaza Midtown)': { place: 'Plaza Midtown, Atlanta, GA', radius_mi: 1, name_re: '^Publix' },
  'Petite Violette Olive Oil & Vinegar Boutique': { place: 'Atlanta, GA', radius_mi: 10, name_re: '^Petite Violette' },
  'Splash of Olive (Decatur)': { place: 'Decatur, DeKalb County, GA', radius_mi: 6, name_re: '^Splash of Olive' },
  'VSOP Olive Oil & Vinegar Taproom (Norcross)': { place: 'Norcross, GA', radius_mi: 6, name_re: '^VSOP' },
  'Harbor Freight Tools (Peru)': { place: '1604 36th Street, Peru, IL 61354', radius_mi: 0.5, name_re: '^Harbor Freight( Tools)?$' },
  'Seneca Ace Hardware': { place: 'Seneca, IL', radius_mi: 6, name_re: '^(Seneca )?Ace Hardware$' },
  'Walgreens (Morris, 100 Bedford Rd)': { place: '100 Bedford Rd, Morris, IL 60450', radius_mi: 0.5, name_re: '^Walgreens$' },
  'Dandelion Chocolate (Valencia Street, SF)': { place: 'San Francisco, CA', radius_mi: 7, name_re: '^Dandelion', street: 'Valencia' },
  'Recchiuti Confections (Ferry Building, SF)': { place: 'Ferry Building, San Francisco, CA', radius_mi: 0.5, name_re: '^Recchiuti' },
  'Safeway (Burlingame, 1450 Howard Ave)': { place: '1450 Howard Ave, Burlingame, CA', radius_mi: 0.5, name_re: '^Safeway$' },
  "Murdoch's Ranch & Home Supply (Greeley)": { place: 'Greeley, CO', radius_mi: 6, name_re: "^Murdoch'?s" },
  'Tractor Supply Co. (Greeley, S 23rd Ave)': { place: 'Greeley, CO', radius_mi: 6, name_re: '^Tractor Supply', street: '23rd' },
  "Macy's (Southdale Center, Edina)": { place: 'Southdale Center, Edina, MN', radius_mi: 1, name_re: "^Macy'?s$" },
  'Crate & Barrel (Galleria, Edina)': { place: 'Galleria Edina, Edina, MN', radius_mi: 1, name_re: '^Crate (&|and) Barrel$' },
  'Pottery Barn (Galleria, Edina)': { place: 'Galleria Edina, Edina, MN', radius_mi: 1, name_re: '^Pottery Barn$' },
  'REI San Francisco (Brannan St)': { place: 'San Francisco, CA', radius_mi: 7, name_re: '^REI( Co-op)?$', street: 'Brannan' },
  "Lowe's (San Francisco, Bayshore Blvd)": { place: 'San Francisco, CA', radius_mi: 7, name_re: "^Lowe'?s( Home Improvement)?$", street: 'Bayshore' },
  'REI Framingham (Cochituate Rd)': { place: 'Framingham, MA', radius_mi: 6, name_re: '^REI( Co-op)?$', street: 'Cochituate' },
  "DICK'S Sporting Goods (Sherwood Plaza, Natick)": { place: 'Natick, MA', radius_mi: 6, name_re: "^Dick'?s Sporting Goods$" },
  "DICK'S Sporting Goods (Lenox Marketplace, Buckhead)": { place: 'Lenox Marketplace, Buckhead, Atlanta, GA', radius_mi: 1, name_re: "^Dick'?s Sporting Goods$" },
  'Walmart Supercenter (Buda)': { place: 'Buda, TX', radius_mi: 6, name_re: '^Walmart( Supercenter| Neighborhood Market)?$' },
  'Walmart Supercenter (Morris)': { place: 'Morris, IL', radius_mi: 6, name_re: '^Walmart( Supercenter| Neighborhood Market)?$' },
  'Menards (Morris)': { place: 'Morris, IL', radius_mi: 6, name_re: '^Menards$' },
  'Target (San Mateo Fashion Island)': { place: 'San Mateo, CA', radius_mi: 6, name_re: '^(Super)?Target$' },
  "Trader Joe's (San Mateo, S Grant St)": { place: 'San Mateo, CA', radius_mi: 6, name_re: "^Trader Joe'?s$", street: 'Grant' },
  'Lakeshore Learning (Nashville, White Bridge Rd)': { place: 'Nashville, TN', radius_mi: 10, name_re: '^Lakeshore Learning', street: 'White Bridge' },
  "Trader Joe's (Atlanta, Monroe Dr)": { place: 'Atlanta, GA', radius_mi: 10, name_re: "^Trader Joe'?s$", street: 'Monroe' },
};

const baseline = grades.baseline.filter((x) => ids.includes(x.search_id) && x.section === 'local' && x.confirmed);
if (baseline.length !== 86) throw new Error(`expected 86 baseline rows, got ${baseline.length}`);

const shops = baseline.map((row, i) => {
  const q = queries.find((x) => x.id === row.search_id);
  const zi = zips.zip.indexOf(q.zip);
  const map = MAP[row.name];
  if (!map) throw new Error(`no map entry for ${row.name}`);
  return {
    row: i + 1,
    search_id: row.search_id,
    product: q.product,
    category: q.category,
    zip: q.zip,
    zip_kind: q.zip_kind,
    zip_ruca: zips.ruca[zi],
    zip_lat: zips.lat[zi],
    zip_lon: zips.lon[zi],
    name: row.name,
    url: row.url,
    ...map,
  };
});
writeFileSync(`${DIR}/shops.json`, JSON.stringify(shops, null, 1) + '\n');
console.log(`${shops.length} shops, ${new Set(shops.map((s) => s.place)).size} distinct places`);
