import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { GLOBAL_LIMIT, RATE_LIMIT } from '../src/handler';

// .jsonc has no import loader; the file stays comment-free so JSON.parse can read it.
const wrangler = JSON.parse(readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8')) as {
  observability: { enabled: boolean };
  ratelimits: Array<{ name: string; simple: { limit: number; period: number } }>;
};

describe('wrangler.jsonc', () => {
  const byName = (name: string) => wrangler.ratelimits.find((r) => r.name === name)?.simple;

  it('mirrors the rate limits in handler.ts', () => {
    expect(byName('RATE_LIMITER')).toEqual({ limit: RATE_LIMIT.limit, period: RATE_LIMIT.periodSeconds });
    expect(byName('GLOBAL_LIMITER')).toEqual({ limit: GLOBAL_LIMIT.limit, period: GLOBAL_LIMIT.periodSeconds });
  });

  it('keeps Workers Logs off so no console line is retained', () => {
    expect(wrangler.observability.enabled).toBe(false);
  });
});
