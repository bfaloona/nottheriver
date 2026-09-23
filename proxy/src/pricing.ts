import type { LlmUsage } from './contract';

// Unit prices as published on PRICES_CHECKED; docs/costs.md carries the sources.
export const PRICES_CHECKED = '2026-09-23';
export const BRAVE_USD_PER_CALL = 0.005;
export const MODEL_PRICES: Record<string, { prompt: number; completion: number }> = {
  'google/gemma-4-31b-it': { prompt: 0.09e-6, completion: 0.34e-6 },
  'google/gemma-4-26b-a4b-it': { prompt: 0.09e-6, completion: 0.3e-6 },
};

// OpenRouter's reported cost wins; token prices are the fallback, and an unknown model counts as 0.
export function estimateCost(usage: { brave_calls: number; llm: LlmUsage[] }): number {
  const llm = usage.llm.reduce((sum, u) => {
    if (u.cost_usd !== null) return sum + u.cost_usd;
    const price = MODEL_PRICES[u.model];
    return price ? sum + u.prompt_tokens * price.prompt + u.completion_tokens * price.completion : sum;
  }, 0);
  return Math.round((usage.brave_calls * BRAVE_USD_PER_CALL + llm) * 1e6) / 1e6;
}
