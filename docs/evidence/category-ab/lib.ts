// Shared by run-ab.ts and score-ab.ts: the six searches, the two arms and the list's store types.
import fs from 'node:fs';
import path from 'node:path';

export const ROOT = path.resolve(import.meta.dirname, '../../..');
export const OUT = path.join(import.meta.dirname, 'runs');
export const SEARCHES = ['cordless-drill-suburban', 'jigsaw-puzzle-urban', 'led-light-bulbs-rural', 'rechargeable-aa-batteries-rural', 'wool-blanket-rural', 'wool-socks-urban'];
export const ARMS = ['model', 'list'] as const;
export type Arm = (typeof ARMS)[number];
export const json = <T>(file: string): T => JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8')) as T;

export interface Query { id: string; product: string; zip: string }
interface StoreType { q: string; basis: string }
interface ListEntry { id: string; store_types: StoreType[] | null }
interface List { general: (ListEntry & { store_types: StoreType[]; specific: ListEntry[] })[] }

export const jobs = json<{ queries: Query[] }>('eval/queries.json').queries.filter((q) => SEARCHES.includes(q.id));
if (jobs.length !== SEARCHES.length) throw new Error('a search id is missing from eval/queries.json');
const picks = json<{ picks: Record<string, { pick: [string, string | null] }> }>('eval/picks.json').picks;
const list = json<List>('data/categories.draft.json');

/** The pair IDEA-1 would send: the specific category's store types when it has its own, else its parent's. */
export function listPair(product: string): string[] {
  const [generalId, specificId] = picks[product]!.pick;
  const general = list.general.find((g) => g.id === generalId)!;
  const specific = general.specific.find((s) => s.id === specificId);
  return (specific?.store_types ?? general.store_types).map((s) => s.q);
}

export interface PlaceRow { title?: string; url?: string; icon_category?: string; categories?: string[]; distance?: unknown }
export interface PlaceCall { id: string; arm: Arm; round: number; q: string; replayed: boolean; status: number; results: PlaceRow[] }
export interface CallsFile {
  ran: string;
  rounds: number;
  brave_live_calls: number;
  brave_replayed_calls: number;
  searches: { id: string; arm: Arm; round: number; status: number; elapsed_ms: number; brave_live: number; brave_replayed: number }[];
  place_calls: PlaceCall[];
}
