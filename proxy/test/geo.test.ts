import { describe, expect, it } from 'vitest';
import { haversineKm } from '../ranking/geo';

// ZCTA internal points from the 2026 Census Gazetteer (INTPTLAT, INTPTLONG).
const PR_00601 = { lat: 18.180621, lon: -66.749931 };
const MA_02138 = { lat: 42.379981, lon: -71.135002 };
const GU_96910 = { lat: 13.450428, lon: 144.751149 };
const AS_96799 = { lat: -14.324678, lon: -170.752057 };

// Independent oracle on the same sphere: spherical law of cosines, accurate at these distances.
function lawOfCosinesKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const r = Math.PI / 180;
  const c =
    Math.sin(a.lat * r) * Math.sin(b.lat * r) +
    Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.cos((b.lon - a.lon) * r);
  return 6371 * Math.acos(Math.min(1, c));
}

describe('haversineKm', () => {
  it('measures one degree of latitude as 111.195 km on a 6371 km sphere', () => {
    expect(haversineKm({ lat: 0, lon: 0 }, { lat: 1, lon: 0 })).toBeCloseTo(111.195, 3);
  });

  it('matches the oracle for Puerto Rico to Massachusetts', () => {
    const km = haversineKm(PR_00601, MA_02138);
    expect(km).toBeCloseTo(lawOfCosinesKm(PR_00601, MA_02138), 3);
    expect(km).toBeGreaterThan(2500);
    expect(km).toBeLessThan(3000);
  });

  it('is symmetric', () => {
    expect(haversineKm(PR_00601, MA_02138)).toBe(haversineKm(MA_02138, PR_00601));
  });

  it('is zero for identical points', () => {
    expect(haversineKm(MA_02138, MA_02138)).toBe(0);
  });

  it('handles positive longitude, negative latitude, and the antimeridian', () => {
    const km = haversineKm(GU_96910, AS_96799);
    expect(km).toBeCloseTo(lawOfCosinesKm(GU_96910, AS_96799), 3);
    // The short way across the antimeridian, not the ~315 degree way round.
    expect(km).toBeLessThan(6000);
  });
});
