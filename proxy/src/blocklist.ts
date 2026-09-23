import { domainLabel, registrableDomain } from './domain';
import list from '../../data/blocklist.json';

export type BlockCheck = { name: string; domain: string | null | undefined; url?: string };

const SEPARATORS = /[\p{P}\p{S}\s]+/gu;
// Scanned separately, not as one alternation: a URL match would swallow the host tokens nested
// inside it. The URL scan still earns its place because URL parsing folds a fullwidth host.
const URL_TOKENS = /https?:\/\/[^\s"'&]+/g;
const HOST_TOKENS = /[a-z0-9.-]+\.[a-z]{2,}/g;

// Separators are replaced before NFKC too, so a symbol like "™" cannot fold into letters
// ("TM") and fuse with the word before it.
export function normalizeName(name: string): string {
  return name
    .replace(SEPARATORS, ' ')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\p{Cf}\p{M}]/gu, '')
    .replace(SEPARATORS, ' ')
    .trim();
}

const exactDomains = new Set(list.domains.filter((d) => d.kind === 'exact').map((d) => d.pattern));
const blockedLabels = new Set(list.domains.filter((d) => d.kind === 'label-any-suffix').map((d) => d.pattern));
const nameEntries = list.names.map((n) => ({ key: normalizeName(n.name), prefix: n.match === 'prefix-word' }));

export function isBlockedDomain(hostOrUrl: string): boolean {
  const domain = registrableDomain(hostOrUrl);
  if (!domain) return false;
  return exactDomains.has(domain) || blockedLabels.has(domainLabel(domain) ?? '');
}

export function isBlockedName(name: string): boolean {
  // A zero-width character may sit inside a word or stand in for a space; try both readings.
  // Plain NFKC first also lets a symbol that folds to a letter ("Ⓐ") read as that letter.
  return [name, name.replace(/\p{Cf}/gu, ' '), name.normalize('NFKC')].some((variant) => {
    const n = normalizeName(variant);
    return nameEntries.some((e) => n === e.key || (e.prefix && n.startsWith(`${e.key} `)));
  });
}

// Checks the host, then any Amazon link a redirector or deal page carries in the path, query or
// fragment. Decoding once only: a second pass would let any double-encoded string decide the result.
export function isBlockedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return true;
    const tail = decodeURIComponent(parsed.pathname + parsed.search + parsed.hash).toLowerCase();
    return [parsed.hostname, ...(tail.match(URL_TOKENS) ?? []), ...(tail.match(HOST_TOKENS) ?? [])].some(isBlockedDomain);
  } catch {
    return true;
  }
}

// A missing domain blocks: upstream drops unparsable URLs, so a null here is a bug or an injected row.
export function isBlocked(c: BlockCheck): boolean {
  return !c.domain || isBlockedDomain(c.domain) || isBlockedName(c.name) || (c.url !== undefined && isBlockedUrl(c.url));
}

export function filterBlocked<T>(items: T[], pick: (item: T) => BlockCheck): T[] {
  return items.filter((item) => !isBlocked(pick(item)));
}

// Longest first, so "whole foods market" goes before "whole foods" and leaves no "market" behind.
// Marks and format characters are allowed between letters in the pattern rather than stripped
// from the text, because the text is sent on as a search query and must otherwise stay intact.
const IN_WORD = '[\\p{M}\\p{Cf}]*';
const scrubPatterns = [...new Set(['amazon', ...nameEntries.map((e) => e.key)])]
  .sort((a, b) => b.length - a.length)
  .map((key) => {
    const words = key.split(' ').map((w) => [...w].join(IN_WORD));
    return new RegExp(`(?<![\\p{L}\\p{N}])${words.join('[^\\p{L}\\p{N}]+')}${IN_WORD}(?![\\p{L}\\p{N}])`, 'giu');
  });

// A symbol that NFKC expands to several characters ("™" -> "TM") becomes a space first, so it
// cannot fuse with the word before it; "$" and "Ⓐ" -> "A" pass through.
export function scrubBlockedText(text: string): string {
  let out = text.replace(/\p{S}/gu, (ch) => ([...ch.normalize('NFKC')].length > 1 ? ' ' : ch)).normalize('NFKC');
  for (const pattern of scrubPatterns) out = out.replace(pattern, ' ');
  return out.replace(/\s+/g, ' ').trim();
}
