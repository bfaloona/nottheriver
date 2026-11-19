// "Before you buy": ideas that may apply (borrow, repair, buy used), chosen from the shopper's
// typed product by a hand-kept table. Spec: docs/plans/before-you-buy-v1.md, section 2b.
import raw from '../data/before-you-buy.json';

export type Idea = 'borrow' | 'repair' | 'used';
export type Kind = {
  id: string; idea: Idea; name: string; level: string; text: string; basis: string;
  sources: { url: string; publisher: string; checked: string }[];
};
export type Row = {
  id: string; group: string; borrow: string | null; repair: string | null; used: string | null;
  terms: string[]; except: string[];
};
export type IdeasData = {
  kinds: Kind[]; rows: Row[]; keep_out: { id: string; group: string; terms: string[] }[]; watch: string[];
};
export type IdeaQuery = { product: string; canonical_name: string; category: string };
export type ShownIdea = { idea: Idea; kind: string };

export const IDEAS_DATA = raw as IdeasData;
const IDEAS: Idea[] = ['borrow', 'repair', 'used'];

function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/’/g, "'")
    .split(/[\s-]+/)
    .map((w) => w.replace(/'s$/, '').replace(/[^a-z0-9]/g, ''))
    .filter(Boolean);
}

function forms(last: string): Set<string> {
  const f = new Set([last, `${last}s`, `${last}es`]);
  if (last.endsWith('y')) f.add(`${last.slice(0, -1)}ies`);
  return f;
}

// A term matches as a run of whole words, with a plural allowed on its last word. With atEnd,
// only a run that ends the text counts, so "drill bits" does not inherit the drill's ideas.
function matches(terms: string[], toks: string[], atEnd: boolean): boolean {
  return terms.some((term) => {
    const tt = term.split(' ');
    const head = tt.slice(0, -1);
    const last = forms(tt[tt.length - 1] ?? '');
    const starts = atEnd ? [toks.length - tt.length] : toks.map((_, i) => i);
    return starts.some((i) => {
      if (i < 0 || i + tt.length > toks.length) return false;
      const win = toks.slice(i, i + tt.length);
      return head.every((w, j) => win[j] === w) && last.has(win[win.length - 1] ?? '');
    });
  });
}

// Keep-out words read all three fields, so a model's reading can hide ideas; rows read only the
// typed product, so a model's reading can never show one (spec DEF-1).
export function ideasFor(q: IdeaQuery, data: IdeasData = IDEAS_DATA): ShownIdea[] {
  const keepOut = data.keep_out.flatMap((k) => k.terms);
  if ([q.product, q.canonical_name, q.category].some((t) => matches(keepOut, words(t ?? ''), false))) return [];
  const toks = words(q.product);
  const chosen = new Map<Idea, string>();
  for (const row of data.rows) {
    if (matches(row.except, toks, false) || !matches(row.terms, toks, true)) continue;
    for (const idea of IDEAS) {
      const kind = row[idea];
      if (kind && !chosen.has(idea)) chosen.set(idea, kind);
    }
  }
  return IDEAS.flatMap((idea) => {
    const kind = chosen.get(idea);
    return kind ? [{ idea, kind }] : [];
  });
}
