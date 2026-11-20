import { getDomain, getDomainWithoutSuffix } from 'tldts';

// RFC 3492 decoder for one label, without the "xn--" prefix. Null when the text is not Punycode.
function decodePunycode(input: string): string | null {
  const out: number[] = [];
  const basic = Math.max(input.lastIndexOf('-'), 0);
  for (let j = 0; j < basic; j++) {
    const c = input.charCodeAt(j);
    if (c >= 0x80) return null;
    out.push(c);
  }
  let n = 128;
  let i = 0;
  let bias = 72;
  for (let idx = basic > 0 ? basic + 1 : 0; idx < input.length; ) {
    const oldi = i;
    for (let w = 1, k = 36; ; k += 36) {
      if (idx >= input.length) return null;
      const c = input.charCodeAt(idx++);
      const digit = c >= 48 && c < 58 ? c - 22 : c >= 97 && c < 123 ? c - 97 : c >= 65 && c < 91 ? c - 65 : -1;
      if (digit < 0) return null;
      i += digit * w;
      const t = k <= bias ? 1 : k >= bias + 26 ? 26 : k - bias;
      if (digit < t) break;
      w *= 36 - t;
      if (!Number.isSafeInteger(i) || !Number.isSafeInteger(w)) return null;
    }
    const points = out.length + 1;
    let delta = oldi === 0 ? Math.floor((i - oldi) / 700) : (i - oldi) >> 1;
    delta += Math.floor(delta / points);
    let k = 0;
    for (; delta > 455; k += 36) delta = Math.floor(delta / 35);
    bias = k + Math.floor((36 * delta) / (delta + 38));
    n += Math.floor(i / points);
    i %= points;
    if (n > 0x10ffff) return null;
    out.splice(i++, 0, n);
  }
  return String.fromCodePoint(...out);
}

// Runtimes differ on a label such as "xn--amzon-hqa": Node 22 refuses the URL, Node 26 and the
// Worker runtime keep the label as typed. A label that does not decode, or that the runtime
// encodes to different text, names no real host, so it is refused here on every runtime.
function validIdnLabels(host: string): boolean {
  return host.split('.').every((label) => {
    const lower = label.toLowerCase();
    if (!lower.startsWith('xn--')) return true;
    const decoded = decodePunycode(lower.slice(4));
    if (decoded === null) return false;
    try {
      return new URL(`https://${decoded}.example/`).hostname === `${lower}.example`;
    } catch {
      return false;
    }
  });
}

// URLs go through WHATWG parsing first so case, IDN-to-punycode and percent-encoded
// dots in the host are normalized the same way a browser would before tldts sees them.
export function hostOf(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (!trimmed.includes('://')) return validIdnLabels(trimmed) ? trimmed : null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return validIdnLabels(url.hostname) ? url.hostname : null;
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
