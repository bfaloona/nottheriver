// Shared by the Overpass and match steps: the accept radius around a shop's geocoded expected
// location. The hand-mapped radius applies when Nominatim found the place as written; when it
// fell back to a wider place, the radius widens with it (3 mi for a neighborhood, 6 mi for a
// city), since the geocode then says less about where the shop is.

/**
 * @param {{radius_mi: number}} shop
 * @param {{fallback: boolean, used: string}} geocode
 * @returns {number} miles
 */
export function acceptRadiusMi(shop, geocode) {
  if (!geocode.fallback) return shop.radius_mi;
  const parts = geocode.used.split(',').length;
  return Math.max(shop.radius_mi, parts >= 3 ? 3 : 6);
}

/** Great-circle distance in miles. */
export function distanceMi(lat1, lon1, lat2, lon2) {
  const r = Math.PI / 180;
  const a = Math.sin(((lat2 - lat1) * r) / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(((lon2 - lon1) * r) / 2) ** 2;
  return 3958.7613 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
