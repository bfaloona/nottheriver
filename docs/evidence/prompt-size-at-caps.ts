// Prompt sizes, in characters, at the code's caps: the longest product the request allows for
// normalize, and for each enrich call the most candidates it may be sent at the title and snippet
// caps. URLs and domains are not capped, so they are set to an assumed 200 and 40 characters.
// JSON escaping is not exercised (plain ASCII), so a real prompt with quotes or non-ASCII text
// can run a little longer. Run: npx tsx docs/evidence/prompt-size-at-caps.ts
import { buildEnrichPrompt, buildNormalizePrompt, type LlmView } from '../../proxy/src/prompts';
import { LLM_SNIPPET_CHARS, LLM_TITLE_CHARS, MAX_LLM_LOCAL, MAX_LLM_ONLINE } from '../../proxy/src/enrich';

const URL_CHARS = 200;
const DOMAIN_CHARS = 40;
const PRODUCT_CHARS = 120; // search-request.json product maxLength
const product = { canonical_name: 'p'.repeat(80), category: 'c'.repeat(60) }; // normalize.json maxLengths

function view(count: number, firstIndex: number): LlmView[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `c${firstIndex + i}`,
    domain: 'd'.repeat(DOMAIN_CHARS),
    title: 't'.repeat(LLM_TITLE_CHARS),
    snippet: 's'.repeat(LLM_SNIPPET_CHARS),
    url: 'u'.repeat(URL_CHARS),
  }));
}

const normalize = buildNormalizePrompt({ product: 'x'.repeat(PRODUCT_CHARS) }).length;
const online = buildEnrichPrompt(view(MAX_LLM_ONLINE, 0), product).length;
const local = buildEnrichPrompt(view(MAX_LLM_LOCAL, MAX_LLM_ONLINE), product).length;
console.log(JSON.stringify({ normalize, enrich_online: online, enrich_local: local, total: normalize + online + local }));
