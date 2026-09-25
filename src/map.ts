import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { MapPin } from './render';

// Loaded on demand by main.ts, so Leaflet stays out of the first page load.

// OpenStreetMap's tile policy requires a Referer and the page sends none (index.html);
// the tiles alone send the site's origin, never a path.
const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

let current: L.Map | undefined;

function pinIcon(pin: MapPin): L.DivIcon {
  const label = document.createElement('span');
  label.textContent = String(pin.rank);
  return L.divIcon({ html: label, className: pin.farther ? 'map-pin map-pin-farther' : 'map-pin', iconSize: [26, 26] });
}

// Brings a pin's shop into view in the list and moves focus to its link, so the next Tab or
// Enter continues from there.
function showInList(pin: MapPin, reducedMotion: boolean): void {
  const item = document.getElementById(pin.target);
  if (!item) return;
  for (const picked of document.querySelectorAll('.result-picked')) picked.classList.remove('result-picked');
  item.classList.add('result-picked');
  item.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
  item.querySelector<HTMLElement>('[data-retailer]')?.focus({ preventScroll: true });
}

export function clearMap(): void {
  current?.remove();
  current = undefined;
}

export function drawMap(container: HTMLElement, pins: MapPin[], center?: { lat: number; lon: number }): void {
  clearMap();
  // A newer render already replaced this container.
  if (!container.isConnected) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // One-finger drag would trap page scrolling on a touch screen; the zoom buttons still work.
  const map = L.map(container, {
    scrollWheelZoom: false,
    dragging: !matchMedia('(pointer: coarse)').matches,
    zoomAnimation: !reducedMotion,
    fadeAnimation: !reducedMotion,
    markerZoomAnimation: !reducedMotion,
  });
  try {
    map.attributionControl.setPrefix(false);
    L.tileLayer(TILES, { maxZoom: 19, attribution: ATTRIBUTION, referrerPolicy: 'strict-origin-when-cross-origin' }).addTo(map);

    const points: L.LatLngExpression[] = [];
    if (center) {
      L.circleMarker([center.lat, center.lon], { radius: 6, className: 'map-center' })
        .bindTooltip('Center of your zip area')
        .addTo(map);
      points.push([center.lat, center.lon]);
    }
    // Farther pins first, so nearby ones draw on top where they overlap. keyboard: false keeps
    // pins out of the tab order: a pin only leads to its list item, which the next Tab reaches anyway.
    for (const pin of [...pins].sort((a, b) => Number(b.farther) - Number(a.farther))) {
      L.marker([pin.lat, pin.lon], { icon: pinIcon(pin), title: `${pin.rank}. ${pin.name}`, keyboard: false })
        .on('click', () => showInList(pin, reducedMotion))
        .addTo(map);
      points.push([pin.lat, pin.lon]);
    }
    map.fitBounds(L.latLngBounds(points), { padding: [24, 24], maxZoom: 15 });
  } catch (err) {
    map.remove();
    throw err;
  }
  current = map;
}
