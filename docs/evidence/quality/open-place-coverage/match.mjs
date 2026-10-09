// Step 4: match each of the 86 shops against the raw Overpass and Overture rows for its place,
// judge the category with category-rules.json, and write results.json (one row per shop) and
// summary.json (the counts the report cites). Pure function of the files in this folder.
//   node docs/evidence/quality/open-place-coverage/match.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { acceptRadiusMi, distanceMi } from './radius.mjs';

const DIR = 'docs/evidence/quality/open-place-coverage';
const shops = JSON.parse(readFileSync(`${DIR}/shops.json`, 'utf8'));
const geo = JSON.parse(readFileSync(`${DIR}/raw/nominatim.json`, 'utf8'));
const rules = JSON.parse(readFileSync(`${DIR}/category-rules.json`, 'utf8'));

const slug = (/** @type {string} */ s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const norm = (/** @type {string} */ s) => s.toLowerCase().replace(/\(.*?\)/g, '').replace(/^the\s+/, '').replace(/[^a-z0-9]+/g, ' ').trim();
const round = (/** @type {number} */ x) => Math.round(x * 100) / 100;

/** @param {string} place @param {string} kind */
function raw(place, kind) {
  const file = `${DIR}/raw/${kind}/${slug(place)}.json`;
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
}

/**
 * Pick the matched object: name or brand matches the shop's pattern, within the accept radius of
 * the geocode, ordered as `order` says; when the shop carries a street hint and some candidates carry a
 * matching street, only those count. Candidates outside the radius are kept for the miss reason.
 * @param {object[]} cands each {name, brand, street, lat, lon, ...}
 */
function pick(shop, radiusMi, center, cands, judge) {
  const re = new RegExp(shop.name_re, 'i');
  const named = cands.filter((c) => re.test(c.name ?? '') || re.test(c.brand ?? ''));
  const rank = { yes: 0, weak: 1, no: 2 };
  // Order: a name match beats a brand-only match (a kiosk inside a Walmart carries brand=Walmart),
  // then the better-categorized record among same-name duplicates (a classifier would see all of
  // them; Overture often holds the store, its pharmacy and its optical counter under one name),
  // then distance.
  const order = (a, b) => (re.test(b.name ?? '') ? 1 : 0) - (re.test(a.name ?? '') ? 1 : 0) || rank[judge(a).usable] - rank[judge(b).usable] || a.distance_mi - b.distance_mi;
  for (const c of named) c.distance_mi = round(distanceMi(center.lat, center.lon, c.lat, c.lon));
  let inside = named.filter((c) => c.distance_mi <= radiusMi);
  let streetUsed = false;
  if (shop.street && inside.length > 1) {
    const onStreet = inside.filter((c) => (c.street ?? '').toLowerCase().includes(shop.street.toLowerCase()));
    if (onStreet.length) {
      inside = onStreet;
      streetUsed = true;
    }
  }
  inside.sort(order);
  const outside = named.filter((c) => c.distance_mi > radiusMi).sort((a, b) => a.distance_mi - b.distance_mi);
  return { match: inside[0] ?? null, inside: inside.length, streetUsed, nearestOutside: outside[0] ?? null };
}

/** The baseline name without its parenthetical, compared to the matched name. */
function nameKind(shop, matched) {
  if (!matched) return null;
  const a = norm(shop.name);
  const b = norm(matched);
  if (a === b) return 'exact';
  if (a.includes(b) || b.includes(a)) return 'partial';
  return 'pattern';
}

/** @returns {{usable: 'yes'|'weak'|'no', by: string}} */
function judgeOsm(category, tags) {
  const rule = rules.categories[category];
  const present = ['shop', 'amenity', 'craft'].filter((k) => tags[k]).map((k) => `${k}=${tags[k]}`);
  if (!present.length) return { usable: 'no', by: 'no shop, amenity or craft tag' };
  for (const t of present) if (rule.osm_yes.includes(t)) return { usable: 'yes', by: t };
  for (const t of present) if (rule.osm_weak.includes(t) || rules.osm_weak_all.includes(t)) return { usable: 'weak', by: t };
  return { usable: 'no', by: present.join(' ') };
}

/** @returns {{usable: 'yes'|'weak'|'no', by: string}} */
function judgeOverture(category, row) {
  const rule = rules.categories[category];
  const present = [...new Set([row.taxonomy_primary, ...(row.taxonomy_hierarchy ?? []), row.basic_category].filter(Boolean))];
  if (!present.length) return { usable: 'no', by: 'no category' };
  for (const t of present) if (rule.overture_yes.includes(t)) return { usable: 'yes', by: t };
  for (const t of present) if (rule.overture_weak.includes(t) || rules.overture_weak_all.includes(t)) return { usable: 'weak', by: t };
  return { usable: 'no', by: `${row.basic_category} / ${row.taxonomy_primary}` };
}

function missReason(picked, haveData) {
  if (!haveData) return 'no data for this place';
  if (picked.nearestOutside) return `name found only outside the accept radius (${picked.nearestOutside.distance_mi} mi, ${picked.nearestOutside.name ?? picked.nearestOutside.brand})`;
  return 'no object with a matching name or brand in the query radius';
}

const results = shops.map((shop) => {
  const g = geo[shop.place];
  const radiusMi = acceptRadiusMi(shop, g);
  const center = g.hit;
  const out = {
    row: shop.row, search_id: shop.search_id, product: shop.product, category: shop.category, zip: shop.zip, zip_kind: shop.zip_kind, zip_ruca: shop.zip_ruca,
    name: shop.name, url: shop.url,
    expected: { place: shop.place, geocoded_as: g.used, fallback: g.fallback, lat: center.lat, lon: center.lon, accept_radius_mi: radiusMi, street_hint: shop.street ?? null, name_re: shop.name_re },
    distance_from_zip_mi: round(distanceMi(shop.zip_lat, shop.zip_lon, center.lat, center.lon)),
    osm: null, overture: null,
  };

  const op = raw(shop.place, 'overpass');
  if (op) {
    const cands = (op.reply.elements ?? []).map((el) => ({
      el, type: el.type, id: el.id, name: el.tags?.name, brand: el.tags?.brand, street: el.tags?.['addr:street'],
      lat: el.lat ?? el.center?.lat, lon: el.lon ?? el.center?.lon,
    })).filter((c) => c.lat != null);
    const p = pick(shop, radiusMi, center, cands, (c) => judgeOsm(shop.category, c.el.tags ?? {}));
    if (p.match) {
      const t = p.match.el.tags;
      const cat = judgeOsm(shop.category, t);
      out.osm = {
        found: true, osm_type: p.match.type, osm_id: p.match.id, osm_name: t.name ?? null, name_match: nameKind(shop, t.name ?? t.brand),
        distance_mi: p.match.distance_mi, candidates_in_radius: p.inside, street_filter_used: p.streetUsed,
        method: `name or brand ~ /${shop.name_re}/i within ${radiusMi} mi of ${g.used}${p.streetUsed ? `, addr:street contains "${shop.street}"` : ''}`,
        tags: { shop: t.shop ?? null, amenity: t.amenity ?? null, craft: t.craft ?? null, brand: t.brand ?? null, 'brand:wikidata': t['brand:wikidata'] ?? null, website: t.website ?? t['contact:website'] ?? null, opening_hours: t.opening_hours ?? null, phone: t.phone ?? t['contact:phone'] ?? null },
        category_usable: cat.usable, category_by: cat.by,
        last_edit: p.match.el.timestamp, version: p.match.el.version, data_timestamp: op.reply.osm3s?.timestamp_osm_base ?? null, endpoint: op.endpoint ?? null,
      };
    } else {
      out.osm = { found: false, miss_reason: missReason(p, true), data_timestamp: op.reply.osm3s?.timestamp_osm_base ?? null, endpoint: op.endpoint ?? null };
    }
  } else {
    out.osm = { found: false, miss_reason: missReason(null, false) };
  }

  const ov = raw(shop.place, 'overture');
  if (ov) {
    const cands = ov.rows.map((r) => ({ r, name: r.name, brand: r.brand, street: r.address, lat: r.lat, lon: r.lon }));
    const p = pick(shop, radiusMi, center, cands, (c) => judgeOverture(shop.category, c.r));
    if (p.match) {
      const r = p.match.r;
      const cat = judgeOverture(shop.category, r);
      out.overture = {
        found: true, id: r.id, overture_name: r.name, name_match: nameKind(shop, r.name ?? r.brand), distance_mi: p.match.distance_mi, candidates_in_radius: p.inside, street_filter_used: p.streetUsed,
        basic_category: r.basic_category, taxonomy_primary: r.taxonomy_primary, taxonomy_hierarchy: r.taxonomy_hierarchy, confidence: r.confidence, operating_status: r.operating_status,
        website: r.websites?.[0] ?? null, phone: r.phones?.[0] ?? null, brand: r.brand ?? null, brand_wikidata: r.brand_wikidata ?? null,
        category_usable: cat.usable, category_by: cat.by, source_dataset: r.source_dataset, source_update_time: r.source_update_time, release: ov.release,
      };
    } else {
      out.overture = { found: false, miss_reason: missReason(p, true), release: ov.release };
    }
  } else {
    out.overture = { found: false, miss_reason: missReason(null, false) };
  }
  return out;
});

writeFileSync(`${DIR}/results.json`, JSON.stringify(results, null, 1) + '\n');

// Summary counts.
const n = results.length;
const count = (/** @type {(r: object) => boolean} */ f) => results.filter(f).length;
const pct = (/** @type {number} */ k) => `${k} of ${n} (${Math.round((100 * k) / n)}%)`;
const tally = (/** @type {string} */ key, /** @type {(r: object) => string} */ by) => {
  /** @type {Record<string, {n: number, osm_found: number, osm_yes: number, osm_yes_or_weak: number, overture_found: number, overture_yes: number, overture_yes_or_weak: number}>} */
  const t = {};
  for (const r of results) {
    const k = by(r);
    t[k] ??= { n: 0, osm_found: 0, osm_yes: 0, osm_yes_or_weak: 0, overture_found: 0, overture_yes: 0, overture_yes_or_weak: 0 };
    t[k].n++;
    if (r.osm.found) t[k].osm_found++;
    if (r.osm.category_usable === 'yes') t[k].osm_yes++;
    if (r.osm.category_usable === 'yes' || r.osm.category_usable === 'weak') t[k].osm_yes_or_weak++;
    if (r.overture.found) t[k].overture_found++;
    if (r.overture.category_usable === 'yes') t[k].overture_yes++;
    if (r.overture.category_usable === 'yes' || r.overture.category_usable === 'weak') t[k].overture_yes_or_weak++;
  }
  return { [key]: t };
};
const osmFound = results.filter((r) => r.osm.found);
const ovFound = results.filter((r) => r.overture.found);
const ageDays = (/** @type {string} */ ts) => (Date.parse('2026-10-09') - Date.parse(ts)) / 86_400_000;
const median = (/** @type {number[]} */ xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : null;
};
const summary = {
  shops: n,
  distinct_shops: new Set(results.map((r) => `${r.name}|${r.url}`)).size,
  osm: {
    found: pct(osmFound.length),
    usable: { yes: count((r) => r.osm.category_usable === 'yes'), weak: count((r) => r.osm.category_usable === 'weak'), no: count((r) => r.osm.found && r.osm.category_usable === 'no') },
    name_match: { exact: count((r) => r.osm.name_match === 'exact'), partial: count((r) => r.osm.name_match === 'partial'), pattern: count((r) => r.osm.name_match === 'pattern') },
    freshness: {
      with_opening_hours: `${osmFound.filter((r) => r.osm.tags.opening_hours).length} of ${osmFound.length}`,
      with_website: `${osmFound.filter((r) => r.osm.tags.website).length} of ${osmFound.length}`,
      with_phone: `${osmFound.filter((r) => r.osm.tags.phone).length} of ${osmFound.length}`,
      with_brand_wikidata: `${osmFound.filter((r) => r.osm.tags['brand:wikidata']).length} of ${osmFound.length}`,
      edited_within_1_year: `${osmFound.filter((r) => ageDays(r.osm.last_edit) <= 365).length} of ${osmFound.length}`,
      edited_within_2_years: `${osmFound.filter((r) => ageDays(r.osm.last_edit) <= 730).length} of ${osmFound.length}`,
      median_last_edit_age_days: Math.round(median(osmFound.map((r) => ageDays(r.osm.last_edit)))),
    },
    misses: results.filter((r) => !r.osm.found).map((r) => ({ row: r.row, name: r.name, search_id: r.search_id, reason: r.osm.miss_reason })),
    no_shop_tag: results.filter((r) => r.osm.found && r.osm.category_usable === 'no').map((r) => ({ row: r.row, name: r.name, search_id: r.search_id, by: r.osm.category_by })),
    data_timestamps: [...new Set(results.map((r) => r.osm.data_timestamp).filter(Boolean))],
    endpoints: [...new Set(results.map((r) => r.osm.endpoint).filter(Boolean))],
  },
  overture: {
    found: pct(ovFound.length),
    usable: { yes: count((r) => r.overture.category_usable === 'yes'), weak: count((r) => r.overture.category_usable === 'weak'), no: count((r) => r.overture.found && r.overture.category_usable === 'no') },
    name_match: { exact: count((r) => r.overture.name_match === 'exact'), partial: count((r) => r.overture.name_match === 'partial'), pattern: count((r) => r.overture.name_match === 'pattern') },
    freshness: {
      with_website: `${ovFound.filter((r) => r.overture.website).length} of ${ovFound.length}`,
      with_phone: `${ovFound.filter((r) => r.overture.phone).length} of ${ovFound.length}`,
      with_brand_wikidata: `${ovFound.filter((r) => r.overture.brand_wikidata).length} of ${ovFound.length}`,
      operating_status_open: `${ovFound.filter((r) => r.overture.operating_status === 'open').length} of ${ovFound.length}`,
      source_updated_within_1_year: `${ovFound.filter((r) => r.overture.source_update_time && ageDays(r.overture.source_update_time) <= 365).length} of ${ovFound.length}`,
      median_source_update_age_days: Math.round(median(ovFound.filter((r) => r.overture.source_update_time).map((r) => ageDays(r.overture.source_update_time)))),
      median_confidence: median(ovFound.map((r) => r.overture.confidence)),
      source_datasets: Object.fromEntries([...ovFound.reduce((m, r) => m.set(r.overture.source_dataset, (m.get(r.overture.source_dataset) ?? 0) + 1), new Map())]),
    },
    misses: results.filter((r) => !r.overture.found).map((r) => ({ row: r.row, name: r.name, search_id: r.search_id, reason: r.overture.miss_reason })),
    no_category: results.filter((r) => r.overture.found && r.overture.category_usable === 'no').map((r) => ({ row: r.row, name: r.name, search_id: r.search_id, by: r.overture.category_by })),
    release: [...new Set(results.map((r) => r.overture.release).filter(Boolean))],
  },
  either_found: pct(count((r) => r.osm.found || r.overture.found)),
  either_usable_yes: pct(count((r) => r.osm.category_usable === 'yes' || r.overture.category_usable === 'yes')),
  either_usable_yes_or_weak: pct(count((r) => ['yes', 'weak'].includes(r.osm.category_usable) || ['yes', 'weak'].includes(r.overture.category_usable))),
  outside_nearby_radius: results.filter((r) => r.distance_from_zip_mi > (r.zip_ruca <= 3 ? 10 : 30)).map((r) => ({ row: r.row, name: r.name, distance_from_zip_mi: r.distance_from_zip_mi })),
  ...tally('by_zip_kind', (r) => r.zip_kind),
  ...tally('by_category', (r) => r.category),
  ...tally('by_search', (r) => r.search_id),
};
writeFileSync(`${DIR}/summary.json`, JSON.stringify(summary, null, 1) + '\n');
console.log(JSON.stringify({ osm: summary.osm.found, osm_usable: summary.osm.usable, overture: summary.overture.found, overture_usable: summary.overture.usable, either: summary.either_found }, null, 1));
