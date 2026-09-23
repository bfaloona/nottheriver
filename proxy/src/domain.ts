import { getDomain, getDomainWithoutSuffix } from 'tldts';

// URLs go through WHATWG parsing first so case, IDN-to-punycode and percent-encoded
// dots in the host are normalized the same way a browser would before tldts sees them.
function hostOf(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (!trimmed.includes('://')) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url.hostname;
  } catch {
    return null;
  }
}

export function registrableDomain(input: string): string | null {
  const host = hostOf(input);
  return host ? getDomain(host) : null;
}

export function domainLabel(input: string): string | null {
  const host = hostOf(input);
  if (!host || !getDomain(host)) return null;
  return getDomainWithoutSuffix(host);
}
