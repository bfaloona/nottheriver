import { describe, it, expect } from 'vitest';
import { buildFilter, chunk, pageAll, sumPenalties, summarizeInspection } from './fetch-osha-dol.mjs';

describe('buildFilter', () => {
  it('returns a single condition unwrapped', () => {
    expect(JSON.parse(buildFilter([['estab_name', 'like', '%COSTCO%']]))).toEqual({ field: 'estab_name', operator: 'like', value: '%COSTCO%' });
  });

  it('joins several conditions with and', () => {
    const f = JSON.parse(buildFilter([['estab_name', 'like', '%COSTCO%'], ['open_date', 'gt', '2021-05-15']]));
    expect(f).toEqual({ and: [{ field: 'estab_name', operator: 'like', value: '%COSTCO%' }, { field: 'open_date', operator: 'gt', value: '2021-05-15' }] });
  });

  it('refuses an empty list', () => {
    expect(() => buildFilter([])).toThrow();
  });
});

describe('pageAll', () => {
  it('keeps asking until a short page comes back', async () => {
    const rows = Array.from({ length: 5 }, (_, i) => ({ i }));
    const offsets = [];
    const all = await pageAll(async (offset, limit) => {
      offsets.push(offset);
      return { data: rows.slice(offset, offset + limit) };
    }, 2);
    expect(all.map((r) => r.i)).toEqual([0, 1, 2, 3, 4]);
    expect(offsets).toEqual([0, 2, 4]);
  });

  it('stops at an empty reply', async () => {
    const all = await pageAll(async () => ({ data: [] }), 2);
    expect(all).toEqual([]);
  });

  it('stops at the page cap so a bad filter cannot run away', async () => {
    let calls = 0;
    await expect(pageAll(async () => { calls++; return { data: [{}, {}] }; }, 2, 3)).rejects.toThrow(/page cap/);
    expect(calls).toBe(3);
  });
});

describe('chunk', () => {
  it('splits a list into runs of at most n', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunk([], 2)).toEqual([]);
  });
});

describe('summarizeInspection', () => {
  const closed = { close_case_date: '2024-01-01T00:00:00' };
  const open = { close_case_date: null };

  it('is not final while a violation is contested without a final order', () => {
    const s = summarizeInspection(closed, [{ current_penalty: '5000', issuance_date: '2023-01-01', contest_date: '2023-01-20', final_order_date: null }]);
    expect(s.final).toBe(false);
    expect(s.current).toBe(5000);
    expect(s.actionDate).toBe('2023-01-01');
  });

  it('is final when the case is closed and nothing is under contest', () => {
    const s = summarizeInspection(closed, [{ current_penalty: '100', issuance_date: '2023-01-01', final_order_date: null }]);
    expect(s.final).toBe(true);
  });

  it('is final when open but every violation has a final order, dated by the latest order', () => {
    const s = summarizeInspection(open, [
      { current_penalty: '100', issuance_date: '2023-01-01', contest_date: '2023-01-10', final_order_date: '2023-06-01' },
      { current_penalty: '200', issuance_date: '2023-01-01', final_order_date: '2023-02-01' },
    ]);
    expect(s).toMatchObject({ final: true, current: 300, actionDate: '2023-06-01', anyContest: true });
  });

  it('is not final when open with no final orders, and falls back to the issuance date', () => {
    const s = summarizeInspection(open, [{ current_penalty: '100', issuance_date: '2023-03-01T00:00:00', final_order_date: null }]);
    expect(s).toMatchObject({ final: false, actionDate: '2023-03-01' });
  });

  it('leaves out deleted violations', () => {
    const s = summarizeInspection(closed, [{ current_penalty: '900', delete_flag: 'X', issuance_date: '2023-01-01' }, { current_penalty: '100', issuance_date: '2023-01-02' }]);
    expect(s).toMatchObject({ current: 100, violations: 1 });
  });
});

describe('sumPenalties', () => {
  it('totals current and initial penalties per inspection', () => {
    const totals = sumPenalties([
      { activity_nr: 1, current_penalty: '1000', initial_penalty: '2000' },
      { activity_nr: 1, current_penalty: 500, initial_penalty: null },
      { activity_nr: 2, current_penalty: null, initial_penalty: '300' },
    ]);
    expect(totals).toEqual({ 1: { current: 1500, initial: 2000, violations: 2 }, 2: { current: 0, initial: 300, violations: 1 } });
  });
});
