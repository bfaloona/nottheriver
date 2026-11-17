// @vitest-environment happy-dom
import L from 'leaflet';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearMap, drawMap } from './map';
import type { MapPin } from './render';

const PINS: MapPin[] = [
  { rank: 1, name: 'Near Shop', lat: 39.78, lon: -89.63, farther: false, target: 'shop-1' },
  { rank: 2, name: 'Far Shop', lat: 40.5, lon: -89.1, farther: true, target: 'shop-2' },
];
const CENTER = { lat: 39.78, lon: -89.65 };

function container(): HTMLElement {
  const el = document.createElement('div');
  document.body.append(el);
  return el;
}

const pinsIn = (el: HTMLElement) => [...el.querySelectorAll<HTMLElement>('.map-pin')];

// Stands in for the browser's observer: records what is watched and lets a test report a size change.
const watched: { target: Element | null; changed: () => void }[] = [];
class FakeResizeObserver {
  private readonly entry: (typeof watched)[number];
  constructor(changed: () => void) {
    this.entry = { target: null, changed };
    watched.push(this.entry);
  }
  observe(target: Element): void {
    this.entry.target = target;
  }
  disconnect(): void {
    this.entry.target = null;
  }
}

beforeEach(() => {
  document.body.innerHTML = '';
  watched.length = 0;
  vi.stubGlobal('matchMedia', () => ({ matches: false }));
  vi.stubGlobal('ResizeObserver', FakeResizeObserver);
});
afterEach(() => {
  clearMap();
  vi.unstubAllGlobals();
});

describe('drawMap', () => {
  it('pins each shop by rank, marks farther ones, and keeps pins out of the tab order', () => {
    const el = container();
    drawMap(el, PINS, CENTER);
    expect(pinsIn(el).map((p) => [p.textContent, p.classList.contains('map-pin-farther')]).sort()).toEqual([
      ['1', false],
      ['2', true],
    ]);
    expect(pinsIn(el).map((p) => p.title).sort()).toEqual(['1. Near Shop', '2. Far Shop']);
    for (const pin of pinsIn(el)) expect(pin.hasAttribute('tabindex'), pin.title).toBe(false);
    expect(el.querySelector('.leaflet-control-attribution')!.textContent).toContain('OpenStreetMap contributors');
  });

  it('takes a pin click to its result: scrolled into view, marked, and its shop name focused', () => {
    const list = document.createElement('ol');
    list.innerHTML = '<li class="result" id="shop-1"><button data-retailer>Near Shop</button></li><li class="result result-picked" id="shop-2"><button data-retailer>Far Shop</button></li>';
    document.body.append(list);
    const scrolled = vi.fn();
    const item = document.getElementById('shop-1')!;
    item.scrollIntoView = scrolled;
    const el = container();
    drawMap(el, PINS);

    const pin = pinsIn(el).find((p) => p.title === '1. Near Shop')!;
    pin.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(scrolled).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
    expect(document.activeElement).toBe(item.querySelector('button'));
    expect([...document.querySelectorAll('.result-picked')]).toEqual([item]);
  });

  it('skips a container a newer render already removed', () => {
    const el = document.createElement('div');
    drawMap(el, PINS);
    expect(el.classList.contains('leaflet-container')).toBe(false);
  });

  it('skips a container that was hidden again before the map library loaded', () => {
    const el = container();
    el.hidden = true;
    drawMap(el, PINS);
    expect(el.classList.contains('leaflet-container')).toBe(false);
  });

  it('removes the previous map when it draws a new one, and on clearMap', () => {
    const first = container();
    drawMap(first, PINS);
    const second = container();
    drawMap(second, PINS);
    expect(pinsIn(first)).toHaveLength(0);
    expect(pinsIn(second)).toHaveLength(2);
    clearMap();
    expect(pinsIn(second)).toHaveLength(0);
  });

  it('keeps the map it drew when the same shops come again in another order', () => {
    const fitted = vi.spyOn(L.Map.prototype, 'fitBounds');
    try {
      const el = container();
      drawMap(el, PINS, CENTER);
      const pane = el.querySelector('.leaflet-map-pane');
      const pins = pinsIn(el);
      fitted.mockClear();

      drawMap(el, [...PINS].reverse(), CENTER);
      expect(el.querySelector('.leaflet-map-pane')).toBe(pane);
      expect(pinsIn(el)).toEqual(pins);
      // The visitor may have moved the map; a sort is no reason to move it back.
      expect(fitted).not.toHaveBeenCalled();
      expect(watched.filter((w) => w.target === el)).toHaveLength(1);
    } finally {
      fitted.mockRestore();
    }
  });

  it('changes only the pins, and fits the view to them, when the shops in its container change', () => {
    const fitted = vi.spyOn(L.Map.prototype, 'fitBounds');
    try {
      const el = container();
      drawMap(el, PINS, CENTER);
      const pane = el.querySelector('.leaflet-map-pane');
      fitted.mockClear();

      drawMap(el, [PINS[0]!], CENTER);
      expect(el.querySelector('.leaflet-map-pane')).toBe(pane);
      expect(pinsIn(el).map((p) => p.title)).toEqual(['1. Near Shop']);
      expect(el.querySelectorAll('.map-center')).toHaveLength(1);
      expect(fitted).toHaveBeenCalledTimes(1);

      drawMap(el, PINS, CENTER);
      expect(pinsIn(el).map((p) => p.title).sort()).toEqual(['1. Near Shop', '2. Far Shop']);
    } finally {
      fitted.mockRestore();
    }
  });

  it('draws a new map in a container whose map was cleared', () => {
    const el = container();
    drawMap(el, PINS, CENTER);
    clearMap();
    drawMap(el, PINS, CENTER);
    expect(pinsIn(el)).toHaveLength(2);
  });

  it('recalculates its size when its container changes size, until the map is cleared', () => {
    const resized = vi.spyOn(L.Map.prototype, 'invalidateSize');
    const el = container();
    drawMap(el, PINS);
    expect(watched.map((w) => w.target)).toEqual([el]);
    resized.mockClear();
    watched[0]!.changed();
    expect(resized).toHaveBeenCalledTimes(1);

    clearMap();
    expect(watched[0]!.target).toBeNull();
    resized.mockRestore();
  });

  it('removes a half-built map when a pin cannot be placed', () => {
    const el = container();
    expect(() => drawMap(el, [...PINS, { rank: 3, name: 'Bad', lat: Number.NaN, lon: 0, farther: false, target: 'shop-3' }])).toThrow();
    expect(el.querySelector('.leaflet-pane')).toBeNull();
  });
});
