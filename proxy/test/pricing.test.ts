import { describe, expect, it } from 'vitest';
import type { LlmUsage } from '../src/contract';
import { estimateCost } from '../src/pricing';

const usage = (model: string, prompt: number, completion: number, cost: number | null): LlmUsage =>
  ({ call: 'normalize', model, prompt_tokens: prompt, completion_tokens: completion, cost_usd: cost });

describe('estimateCost', () => {
  it('charges each Brave call', () => {
    expect(estimateCost({ brave_calls: 4, llm: [] })).toBe(0.02);
  });

  it('prefers the reported LLM cost', () => {
    expect(estimateCost({ brave_calls: 4, llm: [usage('google/gemma-4-31b-it', 400, 120, 0.0000768), usage('google/gemma-4-31b-it', 2100, 300, 0.000291)] }))
      .toBeCloseTo(0.020368, 6);
  });

  it('falls back to token prices for each model, and to 0 for an unknown model', () => {
    expect(estimateCost({ brave_calls: 0, llm: [usage('google/gemma-4-31b-it', 1_000_000, 1_000_000, null)] })).toBeCloseTo(0.43, 6);
    expect(estimateCost({ brave_calls: 0, llm: [usage('google/gemma-4-26b-a4b-it', 1_000_000, 1_000_000, null)] })).toBeCloseTo(0.39, 6);
    expect(estimateCost({ brave_calls: 1, llm: [usage('other/model', 1000, 1000, null)] })).toBe(0.005);
  });
});
