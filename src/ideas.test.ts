import { describe, expect, it } from 'vitest';
import { isBlockedUrl, mentionsAmazon } from '../proxy/src/blocklist';
import { ideasFor, IDEAS_DATA } from './ideas';

const show = (product: string, canonical_name = '', category = '') =>
  ideasFor({ product, canonical_name, category }).map((i) => `${i.idea} ${i.kind}`);

const data = IDEAS_DATA;

describe('the data file', () => {
  it('has seven kinds, each one short sentence with "often" and no "likely"', () => {
    expect(data.kinds).toHaveLength(7);
    for (const k of data.kinds) {
      expect(k.text.split(/\s+/).length, k.id).toBeLessThanOrEqual(20);
      expect(k.text, k.id).toMatch(/\boften\b/);
      expect(k.text.toLowerCase(), k.id).not.toMatch(/\blikely\b/);
      expect(k.level).toBe('in_general');
      expect(k.basis).toBe('owner');
      for (const s of k.sources) {
        expect(s.url, k.id).toMatch(/^https:\/\//);
        expect(s.checked, k.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });

  it('has unique ids and rows that name existing kinds of the right idea', () => {
    const ids = [...data.kinds.map((k) => k.id), ...data.rows.map((r) => r.id), ...data.keep_out.map((k) => k.id)];
    expect(new Set(ids).size).toBe(ids.length);
    const byId = new Map(data.kinds.map((k) => [k.id, k]));
    for (const r of data.rows) {
      for (const idea of ['borrow', 'repair', 'used'] as const) {
        const kind = r[idea];
        if (kind !== null) expect(byId.get(kind)?.idea, `${r.id} ${idea}`).toBe(idea);
      }
    }
  });

  it('never uses "chair" as a bare row term, so high chairs and the like stay out (MATCH-6)', () => {
    expect(data.rows.flatMap((r) => r.terms)).not.toContain('chair');
  });

  it('names no Amazon page, company or text (OR-1)', () => {
    for (const k of data.kinds) {
      expect(mentionsAmazon(k.text), k.id).toBe(false);
      for (const s of k.sources) {
        expect(isBlockedUrl(s.url), s.url).toBe(false);
        expect(mentionsAmazon(s.publisher), s.publisher).toBe(false);
      }
    }
  });
});

describe('ideasFor: the signed table', () => {
  it.each([
    ['cordless drill', ['borrow tool_library', 'repair tool_repair_shop', 'used used_tool_shop']],
    ['claw hammer', ['borrow tool_library', 'repair tool_repair_shop', 'used used_tool_shop']],
    ['bundt pan', ['borrow library_of_things', 'used thrift_store']],
    ['cast iron skillet', ['used thrift_store']],
    ['rain jacket', ['repair repair_cafe', 'used thrift_store']],
    ['cookbook', ['used thrift_store']],
    ['interior door', ['used reuse_center']],
    ['oak dresser', ['repair repair_cafe', 'used thrift_store']],
    ['hair dryer', ['repair repair_cafe']],
    ['road bike', ['repair repair_cafe']],
  ])('%s shows %j', (product, expected) => {
    expect(show(product)).toEqual(expected);
  });

  it('joins two rows, each idea taking the first row in file order (MATCH-7)', () => {
    // stand mixer is in TRG-3 (borrow, used) and TRG-9 (repair).
    expect(show('stand mixer')).toEqual(['borrow library_of_things', 'repair repair_cafe', 'used thrift_store']);
  });

  it('keeps the order borrow, repair, used', () => {
    expect(show('dining table').map((s) => s.split(' ')[0])).toEqual(['repair', 'used']);
  });
});

describe('ideasFor: the 20 eval products', () => {
  const shows: Record<string, string[]> = {
    'cast iron skillet': ['used thrift_store'],
    'cordless drill': ['borrow tool_library', 'repair tool_repair_shop', 'used used_tool_shop'],
    'rain jacket': ['repair repair_cafe', 'used thrift_store'],
    "chef's knife": ['used thrift_store'],
    'insulated water bottle': ['used thrift_store'],
    'pour-over coffee dripper': ['used thrift_store'],
  };
  const nothing = [
    'camping tent', 'wool socks', 'loose leaf green tea', 'jigsaw puzzle', 'USB-C charging cable', 'wool blanket',
    'headlamp', 'LED light bulbs', 'extra virgin olive oil', 'wooden train set', 'rechargeable AA batteries',
    'bath towels', 'garden hose', 'dark chocolate bar',
  ];
  it.each(Object.entries(shows))('%s shows %j', (p, expected) => expect(show(p)).toEqual(expected));
  it.each(nothing)('%s shows nothing', (p) => expect(show(p)).toEqual([]));
});

describe('ideasFor: safety (OR-6)', () => {
  const keepOutExamples = data.keep_out.flatMap((k) => k.terms);
  it.each(keepOutExamples)('keep-out term %j shows nothing', (t) => expect(show(t)).toEqual([]));
  it.each(data.watch)('watch string %j shows nothing', (t) => expect(show(t)).toEqual([]));

  // Products that showed an idea under the earlier draft's rules (walk-through WALK-58 to 66).
  it.each([
    'feeding chair', 'hook-on chair', 'bouncer chair', 'wheel chair', 'winter jacket for babies',
    'flotation jacket', 'bicycle hemlet', 'bike child seat', 'bike trailer',
  ])('formerly unsafe %j shows nothing', (t) => expect(show(t)).toEqual([]));

  it.each([
    'car seat cover', 'helmet light', 'kids bike', "children's winter coat", 'kids rain jacket', 'toddler bike seat',
    'baby doll crib', 'convertible car seat', 'life jacket', 'e-bike', 'heat lamp', 'welding jacket', 'lab coat',
    'hazmat coat', 'nonstick frying pan', 'Teflon frying pan', 'boxer briefs', 'swimsuit', 'swim shirt', 'wool socks',
  ])('%j shows nothing', (t) => expect(show(t)).toEqual([]));

  it('a keep-out word in the model fields hides every idea', () => {
    expect(show('Graco SlimFit3', 'Graco SlimFit3 convertible car seat', 'baby gear')).toEqual([]);
    expect(show('winter coat', 'winter coat', "children's outerwear")).toEqual([]);
  });

  it('the model fields never show an idea on their own (DEF-1)', () => {
    expect(show('DeWalt DCD771', 'DeWalt cordless drill', 'power tools')).toEqual([]);
  });
});

describe('ideasFor: accessories and parts inherit no idea (MATCH-5)', () => {
  it.each([
    'drill bits', 'drill battery', 'screwdriver bits', 'circular saw blade', 'hose clamp', 'printer ink', 'vacuum bags',
    'coat rack', 'coat hanger', 'bike lock', 'bike pump', 'phone stand', 'book light', 'e-book reader', 'coloring book',
  ])('%j shows nothing', (t) => expect(show(t)).toEqual([]));
});

describe('ideasFor: word handling (MATCH-1, MATCH-2)', () => {
  it('matches plurals on the last word', () => {
    expect(show('dresses')).toEqual(show('dress'));
    expect(show('bookshelves')).toEqual(show('bookshelf'));
    expect(show('drills')).toEqual(show('drill'));
  });
  it('matches whole words only', () => {
    expect(show('Japan travel guide')).toEqual([]);
    expect(show('mugwort tea')).toEqual([]);
  });
  it('drops a trailing apostrophe-s and splits on hyphens', () => {
    expect(show("men's rain jacket")).toEqual(show('rain jacket'));
    expect(show('e-bike')).toEqual([]);
  });
  it('is case-insensitive', () => {
    expect(show('CORDLESS DRILL')).toEqual(show('cordless drill'));
  });
});
