import type { LlmUsage } from './contract';
import { InvalidLlmOutput, UpstreamError } from './errors';
import { schemas, structuralOnly, validateAgainst } from './validate';

export const MODELS = ['google/gemma-4-31b-it', 'google/gemma-4-26b-a4b-it'];
export const NORMALIZE_MAX_TOKENS = 400;
export const ENRICH_MAX_TOKENS = 3000;
const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

export type LlmCall = 'normalize' | 'enrich';

const modelSchemas: Record<LlmCall, unknown> = {
  normalize: structuralOnly(schemas.normalize),
  enrich: structuralOnly(schemas.enrich),
};

interface Completion {
  model?: string;
  choices?: Array<{ message?: { content?: string } }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number; cost?: number };
}

export function createLlmClient(opts: { fetch: typeof globalThis.fetch; apiKey: string; siteUrl: string; siteName: string }) {
  // Every attempt is billed, retries included, so every attempt is recorded.
  const usage: LlmUsage[] = [];

  async function attempt(call: LlmCall, body: string): Promise<{ ok: true; data: unknown } | { ok: false }> {
    let res: Response;
    try {
      res = await opts.fetch(ENDPOINT, {
        method: 'POST',
        // Literal headers only: nothing from the inbound request reaches OpenRouter.
        headers: {
          Authorization: `Bearer ${opts.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': opts.siteUrl,
          'X-OpenRouter-Title': opts.siteName,
        },
        body,
      });
    } catch {
      throw new UpstreamError();
    }
    if (!res.ok) throw new UpstreamError();
    let completion: Completion;
    try {
      completion = (await res.json()) as Completion;
    } catch {
      return { ok: false };
    }
    usage.push({
      call,
      model: completion.model ?? 'unknown',
      prompt_tokens: completion.usage?.prompt_tokens ?? 0,
      completion_tokens: completion.usage?.completion_tokens ?? 0,
      cost_usd: typeof completion.usage?.cost === 'number' ? completion.usage.cost : null,
    });
    try {
      const data: unknown = JSON.parse(completion.choices?.[0]?.message?.content ?? '');
      return validateAgainst(call, data).ok ? { ok: true, data } : { ok: false };
    } catch {
      return { ok: false };
    }
  }

  return {
    usage,

    // Model output is never trusted: it is schema-validated, retried once, then refused.
    async complete<T>(call: LlmCall, prompt: string, maxCompletionTokens: number): Promise<T> {
      const body = JSON.stringify({
        models: MODELS,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_schema', json_schema: { name: call, strict: true, schema: modelSchemas[call] } },
        provider: { require_parameters: true, data_collection: 'deny' },
        max_completion_tokens: maxCompletionTokens,
        temperature: 0,
      });
      for (let i = 0; i < 2; i++) {
        const result = await attempt(call, body);
        if (result.ok) return result.data as T;
      }
      throw new InvalidLlmOutput();
    },
  };
}

export type LlmClient = ReturnType<typeof createLlmClient>;
