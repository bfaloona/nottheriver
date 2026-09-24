// Shared types for POST /search. The site imports this file type-only; nothing
// here may import from @cloudflare/workers-types (the mock proxy runs under Node).

export interface SearchRequest {
  product: string; // 1..120 chars after trim
  city: string;    // from public/zips.json
  state: string;   // 2-letter USPS code, 56 accepted (50 states, DC, PR, VI, GU, AS, MP)
  lat: number;     // ZCTA centroid, 2 decimals
  lon: number;     // ZCTA centroid, 2 decimals
}

export type ResultKind = 'local' | 'online';
export type ComponentName = 'relevance' | 'ethics' | 'env' | 'proximity';
export type CertKind =
  | 'b_corp' | 'fair_trade' | 'worker_coop'
  | 'one_percent_planet' | 'climate_neutral'
  | 'independent_retailer_assoc';
export type SignalKind = 'labor' | 'governance' | 'environmental';
// The model's judgment of one fetched page. "maybe" exists because a place listing often
// gives too little to decide, and a forced yes/no would be a guess.
export type SiteType = 'retailer' | 'marketplace' | 'editorial' | 'manufacturer_no_cart' | 'service' | 'other';
export type SellsProduct = 'yes' | 'maybe' | 'no';
export interface Classification { site_type: SiteType; sells_product: SellsProduct }

export interface SourceRef { label: string; url: string }

export interface Certification {
  kind: CertKind;
  label: string;      // display text, e.g. "B Corp", "Sells Fair Trade Certified products"
  source_url: string;
  checked: string;    // YYYY-MM-DD
}

export interface Signal {
  kind: SignalKind;
  polarity: 'positive' | 'negative';
  claim: string;              // the source's own title; never model prose
  source_url: string;
  origin: 'curated' | 'llm';
  action_date: string | null; // curated only
}

export interface ScoreComponent {
  name: ComponentName;
  value: number;        // 0..1
  weight: number;       // from proxy/ranking/weights.ts
  contribution: number; // weight * value, 3 decimals
  sources: SourceRef[]; // length >= 1 whenever value > 0
}

export interface SearchResult {
  id: string;             // online: "online:<domain>"; local: "local:<place_id or domain>:<index among local rows that reach scoring>"
  kind: ResultKind;
  rank: number;           // 1-based score rank within its section; the UI never renumbers
  retailer: { name: string; domain: string; url: string };
  matched_product: string;
  snippet: string;
  address: string | null;      // local only (displayAddress)
  distance_km: number | null;  // local only, haversine from the centroid, 1 decimal
  certifications: Certification[];
  signals: Signal[];
  score: number;               // 0..1, 3 decimals
  components: ScoreComponent[]; // always all four
}

export interface LlmUsage {
  call: 'normalize' | 'enrich';
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  cost_usd: number | null; // OpenRouter usage.cost when present
}

export interface Usage {
  brave_calls: number;
  llm: LlmUsage[];
  llm_tokens: number;         // sum of prompt + completion over llm[]
  estimated_cost_usd: number; // see pricing.ts
}

// What a precision filter removed or the top-10 cut left out, so an evaluation can tell a
// dropped shop from one never found. Domain only: no name, address or coordinates.
export interface Dropped { kind: ResultKind; domain: string; reason: 'editorial_url' | 'site_type' | 'sells_product' | 'below_top_10' | 'branch_cap' }

export interface SearchResponse {
  query: {
    product: string; city: string; state: string; canonical_name: string; category: string;
    online_queries?: string[]; local_queries?: string[];
  };
  weights: Record<ComponentName, number>;
  local: SearchResult[];  // <= 10
  online: SearchResult[]; // <= 10
  usage: Usage;
  dropped?: Dropped[];
}

export type ErrorCode = 'bad_request' | 'rate_limited' | 'upstream_error' | 'invalid_llm_output' | 'server_error';
export interface ErrorResponse { error: ErrorCode }

// Worker-internal shapes shared across units.

export interface Candidate {
  kind: ResultKind;
  name: string;
  domain: string;          // registrable domain, never empty: brave.ts drops anything that does not parse
  url: string;             // WHATWG-normalized href
  title: string;
  snippet: string;
  address: string | null;
  lat: number | null;
  lon: number | null;
  place_id: string | null;
}

export interface Normalized {
  category: string;
  canonical_name: string;
  similar_products: string[]; // <= 6 after truncation
  online_queries: string[];   // <= 3
  local_queries: string[];    // <= 2
}

export interface RateLimiter { limit(opts: { key: string }): Promise<{ success: boolean }> }

export interface Env {
  BRAVE_API_KEY: string;
  OPENROUTER_API_KEY: string;
  ALLOWED_ORIGIN: string; // origin only, e.g. http://localhost:5173
  SITE_NAME: string;      // OpenRouter X-OpenRouter-Title
  SITE_URL: string;       // full site base URL, may include a path, never a trailing slash (pipeline.ts strips one defensively)
  RATE_LIMITER?: RateLimiter;   // per-client; memoryLimiter(RATE_LIMIT) applies as well
  GLOBAL_LIMITER?: RateLimiter; // all clients together; memoryLimiter(GLOBAL_LIMIT) applies as well
}

export interface Deps {
  fetch: typeof globalThis.fetch;
  now: () => number;
  log: (line: string) => void;
}

export type RunSearch = (req: SearchRequest, env: Env, deps: Deps) => Promise<SearchResponse>;
