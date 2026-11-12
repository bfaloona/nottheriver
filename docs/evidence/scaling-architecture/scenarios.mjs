// Arithmetic behind docs/scaling-architecture.md. The doc's projections follow these formulas;
// the output (scenarios-output.json, written next to this file) is the copy to check them against. Nothing here is billed data: the
// inputs are the measured per-search figures and list prices already recorded in the repo, and
// every monthly figure is a projection from them.
// Run from the repo root: node docs/evidence/scaling-architecture/scenarios.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Inputs. Each carries the repo file it was read from; none was fetched for this script.
const IN = {
  braveUsdPerCall: 0.005, // docs/costs.md:11, proxy/src/pricing.ts:5 (list price, checked 2026-09-23)
  braveCreditUsd: 5, // docs/costs.md:11, monthly free credit
  braveCallsPerSearch: 4, // docs/costs.md:26, measured in all 20 searches
  braveQueriesPerSecond: 50, // docs/costs.md:11
  normalizeUsd: 0.00033, // docs/scale-feasibility-costs.md:26, routed price, per call
  normalizeMissRate: 0.4, // docs/scale-feasibility-costs.md:33, one eval run, not a live rate
  modelUsdRouted: 0.00338, // docs/scale-feasibility-costs.md:33, per search at the routed price
  modelUsdCheapest: 0.00053, // same line, cheapest endpoint
  upperBoundUsdPerSearch: 0.1, // docs/costs.md:32
  openRouterFeeRate: 0.055, // docs/scale-feasibility-costs.md:29
  openRouterFeeMinUsd: 0.8, // same line
  workerRequestsPerSearch: 2, // docs/scale-feasibility-costs.md:33, preflight plus POST
  workersFreeRequestsPerDay: 100000, // docs/scale-feasibility-costs.md:187
  workersPaidUsd: 5, // docs/scale-feasibility-costs.md:188
  kvFreeWritesPerDay: 1000, // docs/scale-feasibility-costs.md:189
  kvFreeReadsPerDay: 100000, // same line
  durableFreeRequestsPerDay: 100000, // docs/scale-feasibility-costs.md:191
  durableFreeRowsWrittenPerDay: 100000, // same line
  clientLimitPerMinute: 30, // proxy/src/handler.ts:11
  globalLimitPerMinute: 60, // proxy/src/handler.ts:12
  zipsGzipBytes: 330531, // data/README.md:37
  daysPerMonth: 30, // docs/scale-feasibility-costs.md:33
};

// The ladder docs/scale-feasibility-costs.md section B already uses, so the totals can be
// checked against that note. The first three are SC1 (steady); the fourth is SC3 (the whole country).
const LADDER = [
  { id: 'SC1-small', searchesPerMonth: 300 },
  { id: 'SC1-medium', searchesPerMonth: 3000 },
  { id: 'SC1-large', searchesPerMonth: 30000 },
  { id: 'SC3-country', searchesPerMonth: 300000 },
];

// Assumption, not a measurement: the share of a day's searches that falls in its busiest hour.
// No traffic data exists in the repo, so the doc shows the flat figure beside this one.
const PEAK_HOUR_SHARE = 0.1;

/** @param {number} x @param {number} [places] */
const round = (x, places = 2) => Math.round(x * 10 ** places) / 10 ** places;

const typicalUsdPerSearch = IN.braveCallsPerSearch * IN.braveUsdPerCall + IN.modelUsdRouted;

/**
 * One month of steady use.
 * @param {number} searches searches a month
 * @param {{ braveCalls?: number; modelUsd?: number }} [opts]
 */
function month(searches, opts = {}) {
  const braveCallsPerSearch = opts.braveCalls ?? IN.braveCallsPerSearch;
  const modelUsdPerSearch = opts.modelUsd ?? IN.modelUsdRouted;
  const perDay = searches / IN.daysPerMonth;
  const braveCalls = searches * braveCallsPerSearch;
  const braveUsd = Math.max(0, braveCalls * IN.braveUsdPerCall - IN.braveCreditUsd);
  const modelUsd = searches * modelUsdPerSearch;
  const kvWritesPerDay = perDay * IN.normalizeMissRate;
  const cloudflareUsd = kvWritesPerDay > IN.kvFreeWritesPerDay ? IN.workersPaidUsd : 0;
  const totalUsd = braveUsd + modelUsd + cloudflareUsd;
  return {
    searches_per_month: searches,
    searches_per_day: round(perDay, 1),
    brave_calls: braveCalls,
    brave_usd_after_credit: round(braveUsd),
    model_calls: round(searches * (2 + IN.normalizeMissRate)),
    model_usd: round(modelUsd),
    model_key_cap_at_twice_the_month_usd: round(modelUsd * 2),
    openrouter_purchase_fee_usd: round(Math.max(IN.openRouterFeeMinUsd, modelUsd * IN.openRouterFeeRate)),
    cloudflare_usd: cloudflareUsd,
    total_usd: round(totalUsd),
    usd_per_search: round(totalUsd / searches, 4),
    worker_requests_per_day: round(perDay * IN.workerRequestsPerSearch),
    kv_reads_per_day: round(perDay),
    kv_writes_per_day: round(kvWritesPerDay),
    searches_per_minute_flat: round(perDay / 1440, 3),
    searches_per_minute_peak_hour: round((perDay * PEAK_HOUR_SHARE) / 60, 2),
    zips_json_gb_if_fetched_every_search: round((searches * IN.zipsGzipBytes) / 1e9, 2),
  };
}

// SC1 and SC3: steady months.
const steady = Object.fromEntries(LADDER.map((s) => [s.id, month(s.searchesPerMonth)]));

// Where steady use meets a limit, in searches a month.
const servedPerHourAtGlobalLimit = IN.globalLimitPerMinute * 60;
const thresholds = {
  brave_credit_ends: (IN.braveCreditUsd / IN.braveUsdPerCall) / IN.braveCallsPerSearch,
  kv_free_writes_end: (IN.kvFreeWritesPerDay / IN.normalizeMissRate) * IN.daysPerMonth,
  peak_hour_meets_global_limit: (servedPerHourAtGlobalLimit / PEAK_HOUR_SHARE) * IN.daysPerMonth,
  flat_traffic_meets_global_limit: IN.globalLimitPerMinute * 1440 * IN.daysPerMonth,
  workers_free_requests_end: (IN.workersFreeRequestsPerDay / IN.workerRequestsPerSearch) * IN.daysPerMonth,
  durable_free_requests_end_at_2_per_search: (IN.durableFreeRequestsPerDay / 2) * IN.daysPerMonth,
};

// The most Brave's own rate limit lets through in an hour, whatever the Worker's limiter does.
const braveRateCap = {
  searches_per_hour: (IN.braveQueriesPerSecond * 3600) / IN.braveCallsPerSearch,
  brave_usd_per_hour: round(IN.braveQueriesPerSecond * 3600 * IN.braveUsdPerCall),
};

// Brave calls for the one new measurement the doc asks for: 10 searches in territory zips.
const territoryCheck = { searches: 10, brave_calls: 10 * IN.braveCallsPerSearch, brave_usd: round(10 * IN.braveCallsPerSearch * IN.braveUsdPerCall) };

// SC2: a month of traffic arrives in one hour.
const spike = Object.fromEntries(LADDER.map((s) => {
  const n = s.searchesPerMonth;
  const requests = n * IN.workerRequestsPerSearch;
  // On Workers Free the day's request allowance can run out inside the hour (arrivals taken as
  // even, refused requests and preflights counted); after that minute nothing is served.
  const minutesServed = Math.min(60, (IN.workersFreeRequestsPerDay / requests) * 60);
  const served = Math.min(n, IN.globalLimitPerMinute * minutesServed);
  const braveCallsUnlimited = Math.min((n * IN.braveCallsPerSearch * minutesServed) / 60, IN.braveQueriesPerSecond * 60 * minutesServed);
  return [s.id, {
    minutes_until_workers_free_requests_run_out: round(minutesServed, 1),
    brave_calls_if_the_limit_fails_on_workers_free: round(braveCallsUnlimited),
    brave_usd_if_the_limit_fails_on_workers_free: round(braveCallsUnlimited * IN.braveUsdPerCall),
    searches_in_the_hour: n,
    demand_per_minute: round(n / 60, 1),
    times_the_global_limit: round(n / 60 / IN.globalLimitPerMinute, 2),
    served_if_the_global_limit_holds: served,
    brave_calls_if_the_limit_holds: served * IN.braveCallsPerSearch,
    model_calls_if_the_limit_holds: round(served * (2 + IN.normalizeMissRate)),
    model_calls_if_every_search_runs: round(n * (2 + IN.normalizeMissRate)),
    // Not served covers both the limiter's refusals and, once the allowance is gone, requests
    // Cloudflare never hands to the Worker.
    not_served: n - served,
    share_not_served: round((n - served) / n, 3),
    share_refused_by_the_site_limit_while_running: round(Math.max(0, 1 - IN.globalLimitPerMinute / (n / 60)), 3),
    usd_if_the_limit_holds: round(served * typicalUsdPerSearch),
    usd_if_every_search_runs: round(n * typicalUsdPerSearch),
    usd_if_every_search_runs_upper_bound: round(n * IN.upperBoundUsdPerSearch),
    brave_calls_per_second_if_every_search_runs: round((n * IN.braveCallsPerSearch) / 3600, 1),
    brave_calls_if_every_search_runs: n * IN.braveCallsPerSearch,
    worker_requests_in_the_hour: requests,
    over_workers_free_daily_requests: requests > IN.workersFreeRequestsPerDay,
    kv_writes_wanted: round(n * IN.normalizeMissRate),
    over_kv_free_daily_writes: n * IN.normalizeMissRate > IN.kvFreeWritesPerDay,
  }];
}));

// SC4: a scripted caller. Windows at the per-client and global limits, and how many isolates
// (each with its own in-memory counter, docs/debt.md:10) multiply the global figure.
/** @param {number} perMinute */
const abuseWindows = (perMinute) => Object.fromEntries(
  [['hour', 60], ['day', 1440], ['month', 1440 * IN.daysPerMonth]].map(([name, minutes]) => {
    const searches = perMinute * Number(minutes);
    return [name, {
      searches,
      brave_calls: searches * IN.braveCallsPerSearch,
      model_calls: round(searches * (2 + IN.normalizeMissRate)),
      usd_typical: round(searches * typicalUsdPerSearch),
      usd_upper_bound: round(searches * IN.upperBoundUsdPerSearch),
    }];
  }),
);
const abuse = {
  one_client_at_the_per_client_limit: abuseWindows(IN.clientLimitPerMinute),
  many_clients_at_the_global_limit: abuseWindows(IN.globalLimitPerMinute),
  global_limit_times_isolates_per_day_usd_typical: Object.fromEntries(
    [2, 5, 10].map((isolates) => [isolates, round(IN.globalLimitPerMinute * 1440 * isolates * typicalUsdPerSearch)]),
  ),
  workers_free_daily_cap_no_preflight: {
    searches: IN.workersFreeRequestsPerDay,
    usd_typical: round(IN.workersFreeRequestsPerDay * typicalUsdPerSearch),
    usd_upper_bound: round(IN.workersFreeRequestsPerDay * IN.upperBoundUsdPerSearch),
  },
  // With a ceiling enforced before any upstream call, the loss is the ceiling and the attack
  // becomes an outage. Minutes a caller at the global limit needs to use up a budget sized for
  // each steady scenario, as one monthly pot and as a daily slice of it.
  minutes_to_use_up_a_budget_at_the_global_limit: Object.fromEntries(LADDER.map((s) => [s.id, {
    monthly_pot_searches: s.searchesPerMonth,
    monthly_pot_minutes: round(s.searchesPerMonth / IN.globalLimitPerMinute, 1),
    daily_slice_searches: s.searchesPerMonth / IN.daysPerMonth,
    daily_slice_minutes: round(s.searchesPerMonth / IN.daysPerMonth / IN.globalLimitPerMinute, 1),
    most_lost_in_a_day_with_daily_slices_usd: round((s.searchesPerMonth / IN.daysPerMonth) * typicalUsdPerSearch),
  }])),
};

// SC5: no money. What the Brave credit alone buys, and what the model still costs.
const zeroSpend = Object.fromEntries([4, 3, 2].map((calls) => {
  const searches = Math.floor(IN.braveCreditUsd / IN.braveUsdPerCall / calls);
  return [`${calls}_brave_calls_per_search`, {
    searches_per_month: searches,
    searches_per_day: round(searches / IN.daysPerMonth, 1),
    brave_calls: searches * calls,
    model_calls: round(searches * (2 + IN.normalizeMissRate)),
    model_usd_routed: round(searches * IN.modelUsdRouted),
    model_usd_cheapest: round(searches * IN.modelUsdCheapest),
    months_a_5_usd_model_top_up_lasts_routed: round(5 / (searches * IN.modelUsdRouted), 1),
    months_a_5_usd_model_top_up_lasts_cheapest: round(5 / (searches * IN.modelUsdCheapest), 1),
  }];
}));

// Options. Per-search cost and monthly total under each change that has a price in the repo.
const VARIANTS = [
  { id: 'today', label: '4 Brave calls, throughput routing', braveCalls: 4, modelUsd: IN.modelUsdRouted },
  { id: 'three_calls', label: '3 Brave calls', braveCalls: 3, modelUsd: IN.modelUsdRouted },
  { id: 'cheapest_routing', label: '4 Brave calls, cheapest endpoint', braveCalls: 4, modelUsd: IN.modelUsdCheapest },
  { id: 'no_place_search', label: 'web search only (shop table replaces place search)', braveCalls: 2, modelUsd: IN.modelUsdRouted },
  { id: 'no_place_one_web', label: 'shop table plus one web call', braveCalls: 1, modelUsd: IN.modelUsdRouted },
  { id: 'free_model', label: '4 Brave calls, model at no charge (ceiling of any model change)', braveCalls: 4, modelUsd: 0 },
];
const options = Object.fromEntries(VARIANTS.map((v) => {
  const perSearch = v.braveCalls * IN.braveUsdPerCall + v.modelUsd;
  return [v.id, {
    label: v.label,
    usd_per_search_before_credit: round(perSearch, 5),
    saving_vs_today_share: round(1 - perSearch / typicalUsdPerSearch, 3),
    monthly_total_usd: Object.fromEntries(LADDER.map((s) => [s.id, month(s.searchesPerMonth, v).total_usd])),
    searches_a_month_on_the_brave_credit: Math.floor(IN.braveCreditUsd / IN.braveUsdPerCall / v.braveCalls),
  }];
}));

// A cache of web results keyed by the query alone: each hit saves the two web calls.
const webCacheSavingUsd = Object.fromEntries([10, 30, 50].map((percent) => [
  `${percent}_percent_hits`,
  Object.fromEntries(LADDER.map((s) => [s.id, round((s.searchesPerMonth * percent * 2 * IN.braveUsdPerCall) / 100)])),
]));

// What routing for speed costs over the cheapest endpoint, a month.
const routingPremiumUsd = Object.fromEntries(
  LADDER.map((s) => [s.id, round(s.searchesPerMonth * (IN.modelUsdRouted - IN.modelUsdCheapest))]),
);

// Building results ahead of time for a grid of products and areas, instead of on request.
// The grid sizes are illustrations chosen for this script, not measurements of demand.
const PRECOMPUTE = { products: 100, areas: 50 };
const cells = PRECOMPUTE.products * PRECOMPUTE.areas;
const precompute = {
  products: PRECOMPUTE.products,
  areas: PRECOMPUTE.areas,
  cells,
  usd_per_refresh: round(cells * typicalUsdPerSearch),
  usd_per_month_nightly: round(cells * typicalUsdPerSearch * IN.daysPerMonth),
  usd_per_month_weekly: round((cells * typicalUsdPerSearch * IN.daysPerMonth) / 7),
  // A refresh costs one search per cell, so it beats searching on request only when each cell is
  // asked for more than once between refreshes.
  searches_a_month_needed_to_break_even_nightly: cells * IN.daysPerMonth,
  searches_a_month_needed_to_break_even_weekly: round((cells * IN.daysPerMonth) / 7),
  requests_per_cell_per_month_if_all_traffic_lands_on_the_grid: Object.fromEntries(
    LADDER.map((s) => [s.id, round(s.searchesPerMonth / cells, 2)]),
  ),
};

const prewarmReadingsUsdPerMonth = Object.fromEntries(
  [100, 1000, 10000].map((n) => [`${n}_products`, round(n * IN.normalizeUsd)]),
);

// One shared counter (a Durable Object) checked before a search and updated after it.
const meter = {
  durable_requests_per_search: 2,
  durable_requests_per_day: Object.fromEntries(LADDER.map((s) => [s.id, round((s.searchesPerMonth / IN.daysPerMonth) * 2)])),
  rows_written_per_day_at_one_per_search: Object.fromEntries(LADDER.map((s) => [s.id, round(s.searchesPerMonth / IN.daysPerMonth)])),
  // If every arriving search asked the counter, refused ones included, the busiest cases would
  // pass the free allowance; the design must let an instance refuse from memory once told "no".
  durable_requests_if_every_arrival_asks: {
    spike_of_30000_in_an_hour: 30000,
    spike_of_300000_in_an_hour: 300000,
    caller_at_the_global_limit_per_day: IN.globalLimitPerMinute * 1440,
  },
  free_requests_per_day: IN.durableFreeRequestsPerDay,
  free_rows_written_per_day: IN.durableFreeRowsWrittenPerDay,
};

// Geography, counted from the zip file the site ships.
/** @type {{ zip: string[]; state: string[]; lat: number[]; lon: number[]; ruca: (number | null)[] }} */
const zips = JSON.parse(readFileSync(new URL('../../../public/zips.json', import.meta.url), 'utf8'));
const TERRITORIES = ['PR', 'VI', 'GU', 'AS', 'MP'];
const NOT_CONTIGUOUS = new Set(['AK', 'HI', ...TERRITORIES]);
/** @type {Record<string, number>} */
const territoryCounts = Object.fromEntries(TERRITORIES.map((t) => [t, 0]));
const rucaCounts = { metro_1_to_3: 0, other_4_to_10: 0, none: 0 };
const centers = new Set();
let contiguousWest = 0;
let contiguousEast = -180;
for (let i = 0; i < zips.zip.length; i++) {
  const state = zips.state[i] ?? '';
  const ruca = zips.ruca[i];
  const lon = zips.lon[i] ?? 0;
  if (Object.hasOwn(territoryCounts, state)) territoryCounts[state] = (territoryCounts[state] ?? 0) + 1;
  if (ruca == null) rucaCounts.none++;
  else if (ruca <= 3) rucaCounts.metro_1_to_3++;
  else rucaCounts.other_4_to_10++;
  centers.add(`${zips.lat[i]},${lon}`);
  if (!NOT_CONTIGUOUS.has(state)) {
    contiguousWest = Math.min(contiguousWest, lon);
    contiguousEast = Math.max(contiguousEast, lon);
  }
}
const zipAreas = zips.zip.length;
const geography = {
  zip_areas: zipAreas,
  distinct_two_decimal_centers: centers.size,
  by_rural_urban_code: rucaCounts,
  share_with_the_30_mile_nearby_radius: round(rucaCounts.other_4_to_10 / zipAreas, 3),
  territories: territoryCounts,
  territories_total: Object.values(territoryCounts).reduce((a, b) => a + b, 0),
  contiguous_states_longitude: { west: contiguousWest, east: contiguousEast },
  // 15 degrees of longitude is one hour of sun time; this is how far apart "evening" is.
  contiguous_states_sun_time_span_hours: round((contiguousEast - contiguousWest) / 15, 1),
  searches_per_zip_area_per_month_if_spread_evenly: Object.fromEntries(
    LADDER.map((s) => [s.id, round(s.searchesPerMonth / zipAreas, 3)]),
  ),
};

const output = {
  note: 'Projections from repo figures and list prices; nothing here is billed data. Written by scenarios.mjs.',
  inputs: { ...IN, peak_hour_share_assumed: PEAK_HOUR_SHARE, typical_usd_per_search: round(typicalUsdPerSearch, 5) },
  shares_of_a_typical_search: {
    brave: round((IN.braveCallsPerSearch * IN.braveUsdPerCall) / typicalUsdPerSearch, 3),
    model: round(IN.modelUsdRouted / typicalUsdPerSearch, 3),
    one_brave_call: round(IN.braveUsdPerCall / typicalUsdPerSearch, 3),
    model_when_on_the_cheapest_endpoint: round(
      IN.modelUsdCheapest / (IN.braveCallsPerSearch * IN.braveUsdPerCall + IN.modelUsdCheapest), 3,
    ),
  },
  steady,
  thresholds_searches_per_month: thresholds,
  spike_a_month_in_an_hour: spike,
  brave_rate_cap: braveRateCap,
  territory_check: territoryCheck,
  abuse,
  zero_spend: zeroSpend,
  options,
  web_cache_saving_usd_per_month: webCacheSavingUsd,
  routing_premium_usd_per_month: routingPremiumUsd,
  precompute_grid: precompute,
  prewarm_readings_usd_per_month: prewarmReadingsUsdPerMonth,
  budget_meter: meter,
  geography,
};

const text = `${JSON.stringify(output, null, 2)}\n`;
writeFileSync(fileURLToPath(new URL('./scenarios-output.json', import.meta.url)), text);
console.log(text);
