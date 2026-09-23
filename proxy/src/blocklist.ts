import { domainLabel, hostOf, registrableDomain } from './domain';
import list from '../../data/blocklist.json';

export type BlockCheck = { name: string; domain: string | null | undefined; url?: string };

const SEPARATORS = /[\p{P}\p{S}\s]+/gu;
// Scanned separately, not as one alternation: a URL match would swallow the host tokens nested
// inside it. The URL scan still earns its place because URL parsing folds a fullwidth host.
const URL_TOKENS = /https?:\/\/[^\s"'&]+/g;
const HOST_TOKENS = /[a-z0-9.-]+\.[a-z]{2,}/g;

// Separators are replaced before NFKC too, so a symbol like "™" cannot fold into letters
// ("TM") and fuse with the word before it. NFD after NFKC splits the accented letters NFKC
// composed ("ń"), so their marks are dropped like any other.
export function normalizeName(name: string): string {
  return name
    .replace(SEPARATORS, ' ')
    .normalize('NFKC')
    .normalize('NFD')
    .toLowerCase()
    .replace(/[\p{Cf}\p{M}]/gu, '')
    .normalize('NFC')
    .replace(SEPARATORS, ' ')
    .trim();
}

// A zero-width character may sit inside a word or stand in for a space; both readings are tried.
// Plain NFKC first also lets a symbol that folds to a letter ("Ⓐ") read as that letter.
function readings(text: string): string[] {
  return [text, text.replace(/\p{Cf}/gu, ' '), text.normalize('NFKC')].map(normalizeName);
}

const exactDomains = new Set(list.domains.filter((d) => d.kind === 'exact').map((d) => d.pattern));
const blockedLabels = new Set(list.domains.filter((d) => d.kind === 'label-any-suffix').map((d) => d.pattern));
const nameEntries = list.names.map((n) => ({
  key: normalizeName(n.name),
  prefix: n.match === 'prefix-word',
  except: (n.except ?? []).map(normalizeName),
}));

const startsWithWords = (n: string, key: string) => n === key || n.startsWith(`${key} `);

// Exact entries also match as a host suffix: an Amazon site under a suffix the public suffix
// list does not know ("amazon.com.be") has a registrable domain of "com.be", which is no entry.
export function isBlockedDomain(hostOrUrl: string): boolean {
  const labels = (hostOf(hostOrUrl) ?? '').toLowerCase().replace(/\.+$/, '').split('.');
  if (labels.some((_, i) => exactDomains.has(labels.slice(i).join('.')))) return true;
  const domain = registrableDomain(hostOrUrl);
  if (!domain) return false;
  return exactDomains.has(domain) || blockedLabels.has(domainLabel(domain) ?? '');
}

export function isBlockedName(name: string): boolean {
  return readings(name).some((n) =>
    nameEntries.some((e) =>
      (e.prefix ? startsWithWords(n, e.key) : n === e.key) && !e.except.some((x) => startsWithWords(n, x))),
  );
}

// Glued spellings ("AmazonBasics") come from the name entries, so the list stays the one source.
const AMAZON_WORD = new RegExp(
  `\\b(${['amazon', ...nameEntries.map((e) => e.key).filter((k) => k.startsWith('amazon') && !k.includes(' '))].join('|')})\\b`,
);

// Deliberately over-blocks: "not on Amazon" counts too, because the word itself must not reach the page.
export function mentionsAmazon(text: string): boolean {
  return readings(text).some((n) => AMAZON_WORD.test(n));
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
    return new RegExp(`(?<![\\p{L}\\p{N}\\p{M}])${words.join('[^\\p{L}\\p{N}]+')}${IN_WORD}(?![\\p{L}\\p{N}])`, 'giu');
  });

// A symbol that NFKC expands to several characters ("™" -> "TM") becomes a space first, so it
// cannot fuse with the word before it; "$" and "Ⓐ" -> "A" pass through. The text is matched
// decomposed, so an accent NFKC composed into a letter is a mark the pattern can skip.
export function scrubBlockedText(text: string): string {
  let out = text.replace(/\p{S}/gu, (ch) => ([...ch.normalize('NFKC')].length > 1 ? ' ' : ch)).normalize('NFKC').normalize('NFD');
  for (const pattern of scrubPatterns) out = out.replace(pattern, ' ');
  return out.replace(/\s+/g, ' ').trim().normalize('NFC');
}
