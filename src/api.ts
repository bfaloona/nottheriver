import type { ErrorCode, SearchRequest, SearchResponse } from '../proxy/src/contract';
import { workerUrl } from './config';

export type SearchOutcome = { ok: true; data: SearchResponse } | { ok: false; code: ErrorCode | 'network' };

const ERROR_CODES: readonly string[] = ['bad_request', 'rate_limited', 'upstream_error', 'invalid_llm_output', 'server_error'];

export const round2 = (n: number) => Math.round(n * 100) / 100;

export async function search(req: SearchRequest, fetchImpl: typeof fetch = fetch): Promise<SearchOutcome> {
  // An explicit literal, so nothing else a caller attaches (a zip, say) can ride along.
  const body = {
    product: req.product, city: req.city, state: req.state, lat: round2(req.lat), lon: round2(req.lon),
    ...(req.ruca !== undefined && { ruca: req.ruca }),
  };
  let res: Response;
  try {
    res = await fetchImpl(`${workerUrl}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
    });
  } catch {
    return { ok: false, code: 'network' };
  }

  const payload: unknown = await res.json().catch(() => null);
  if (res.status === 429) return { ok: false, code: 'rate_limited' };
  if (!res.ok) {
    const code = (payload as { error?: unknown } | null)?.error;
    return { ok: false, code: typeof code === 'string' && ERROR_CODES.includes(code) ? (code as ErrorCode) : 'server_error' };
  }
  const data = payload as SearchResponse | null;
  if (!data || !Array.isArray(data.local) || !Array.isArray(data.online)) return { ok: false, code: 'server_error' };
  return { ok: true, data };
}
