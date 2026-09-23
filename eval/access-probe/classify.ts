export type Access = 'ok' | 'challenge' | 'blocked' | 'error';

// Vendor challenge scripts. Cloudflare can inject its challenge-platform script into normal
// pages too, so markers only count on a non-2xx response; on a 2xx only the header does.
const CHALLENGE_MARKERS = ['/cdn-cgi/challenge-platform/', 'challenges.cloudflare.com', 'captcha-delivery.com', 'px-captcha', 'g-recaptcha', 'h-captcha'];
const REFUSAL_STATUSES = new Set([401, 402, 403, 429, 451, 503]);

/** Heuristic: the Chrome grading pass is the ground truth this is scored against. */
export function classify(status: number, cfMitigated: string | null, body: string): { access: Access; marker: string | null } {
  if (cfMitigated === 'challenge') return { access: 'challenge', marker: 'cf-mitigated' };
  if (status >= 200 && status < 300) return { access: 'ok', marker: null };
  const marker = CHALLENGE_MARKERS.find((m) => body.includes(m)) ?? null;
  if (marker && REFUSAL_STATUSES.has(status)) return { access: 'challenge', marker };
  if (REFUSAL_STATUSES.has(status) && status !== 503) return { access: 'blocked', marker: null };
  return { access: 'error', marker: null };
}

export function pageTitle(html: string): string | null {
  const m = /<title[^>]*>([^<]*)<\/title>/i.exec(html);
  return m?.[1] ? m[1].replace(/\s+/g, ' ').trim().slice(0, 120) : null;
}
