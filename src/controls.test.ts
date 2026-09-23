import { describe, expect, it } from 'vitest';
import type { SearchResponse, SearchResult } from '../proxy/src/contract';
import fixture from '../tests/fixtures/search-response.json';
import { filterResults, sortResults } from './controls';

const base = (fixture as SearchResponse).local[0]!;

function make(name: string, rank: number, distance_km: number | null, certified = false): SearchResult {
  return {
    ...base,
    id: `local:${name}:${rank}`,
    kind: distance_km === null ? 'online' : 'local',
    rank,
    retailer: { ...base.retailer, name },
    distance_km,
    certifications: certified ? base.certifications : [],
  };
}

const names = (list: SearchResult[]) => list.map((r) => r.retailer.name);

describe('sortResults', () => {
  const list = [make('Cedar', 2, 5), make('alder', 1, 9), make('Birch', 3, 5), make('Aspen', 4, null), make('Oak', 5, null)];

  it('sorts by rank for score without mutating the input', () => {
    const before = names(list);
    expect(names(sortResults(list, 'score'))).toEqual(['alder', 'Cedar', 'Birch', 'Aspen', 'Oak']);
    expect(names(list)).toEqual(before);
  });

  it('sorts by distance with ties and nulls ordered by name, nulls last', () => {
    expect(names(sortResults(list, 'distance'))).toEqual(['Birch', 'Cedar', 'alder', 'Aspen', 'Oak']);
  });

  it('sorts by name ignoring case', () => {
    expect(names(sortResults(list, 'name'))).toEqual(['alder', 'Aspen', 'Birch', 'Cedar', 'Oak']);
  });

  it('keeps input order for equal keys', () => {
    const twins = [make('Same', 7, 1), make('Same', 3, 1)];
    expect(sortResults(twins, 'name').map((r) => r.rank)).toEqual([7, 3]);
    expect(sortResults(twins, 'distance').map((r) => r.rank)).toEqual([7, 3]);
  });
});

describe('filterResults', () => {
  const list = [make('Near plain', 1, 2), make('Near certified', 2, 3, true), make('Web certified', 1, null, true)];

  it('keeps everything by default', () => {
    expect(filterResults(list, { near: true, online: true, certifiedOnly: false })).toHaveLength(3);
  });

  it('drops a section that is switched off', () => {
    expect(names(filterResults(list, { near: false, online: true, certifiedOnly: false }))).toEqual(['Web certified']);
    expect(names(filterResults(list, { near: true, online: false, certifiedOnly: false }))).toEqual([
      'Near plain',
      'Near certified',
    ]);
  });

  it('keeps only certified results when asked', () => {
    expect(names(filterResults(list, { near: true, online: true, certifiedOnly: true }))).toEqual([
      'Near certified',
      'Web certified',
    ]);
  });
});
