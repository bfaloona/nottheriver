// @vitest-environment happy-dom
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

beforeEach(() => {
  document.body.innerHTML = '';
  vi.stubGlobal('matchMedia', () => ({ matches: false }));
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

  it('takes a pin click to its result: scrolled into view, marked, and its shop link focused', () => {
    const list = document.createElement('ol');
    list.innerHTML = '<li class="result" id="shop-1"><a data-retailer href="#a">Near Shop</a></li><li class="result result-picked" id="shop-2"><a data-retailer href="#b">Far Shop</a></li>';
    document.body.append(list);
    const scrolled = vi.fn();
    const item = document.getElementById('shop-1')!;
    item.scrollIntoView = scrolled;
    const el = container();
    drawMap(el, PINS);

    const pin = pinsIn(el).find((p) => p.title === '1. Near Shop')!;
    pin.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(scrolled).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
    expect(document.activeElement).toBe(item.querySelector('a'));
    expect([...document.querySelectorAll('.result-picked')]).toEqual([item]);
  });

  it('skips a container a newer render already removed', () => {
    const el = document.createElement('div');
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

  it('removes a half-built map when a pin cannot be placed', () => {
    const el = container();
    expect(() => drawMap(el, [...PINS, { rank: 3, name: 'Bad', lat: Number.NaN, lon: 0, farther: false, target: 'shop-3' }])).toThrow();
    expect(el.querySelector('.leaflet-pane')).toBeNull();
  });
});
