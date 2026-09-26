// Second concern pass (2026-09-25): fetches the accepted sources that are reachable
// without web search and allowed by their robots rules, and saves raw results per
// retailer for the concern agents. OSHA /ords/imis/, NLRB /search/, EPA ECHO and CPSC
// recall search are disallowed by robots.txt; Violation Tracker, DOJ and SEC return 403.
// FTC case search needs WebFetch (plain curl gets 403), so agents do that part.
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { splitFrontMatter } from './build-index.mjs';

const ROOT = new URL('.', import.meta.url).pathname;
const OUT = join(ROOT, 'raw', 'concern-fetch');
const AGENCY = ['Equal Employment', 'EEOC', 'Secretary of Labor', 'Department of Labor', 'Federal Trade Commission',
  'United States', 'State of', 'People of', 'Commonwealth', 'National Labor Relations', 'Environmental Protection',
  'Consumer Product Safety', 'Securities and Exchange', 'Attorney General', 'District of Columbia'];
// Names the retailer is sued or cited under when that differs from `name`.
const ALIASES = { 'lovegrown.com': ['Hive Brands'], 'wearpact.com': ['Pact Apparel', 'Pact, LLC'], 'grove.co': ['Grove Collaborative'] };

const quote = (s) => `"${s.replace(/"/g, '')}"`;

async function courtListener(names) {
  const q = `caseName:(${names.map(quote).join(' OR ')}) AND caseName:(${AGENCY.map(quote).join(' OR ')})`;
  const url = `https://www.courtlistener.com/api/rest/v4/search/?type=r&order_by=dateFiled+desc&filed_after=2016-01-01&q=${encodeURIComponent(q)}`;
  const res = await fetch(url);
  if (!res.ok) return { url, error: `HTTP ${res.status}` };
  const j = await res.json();
  return {
    url, count: j.count,
    results: (j.results || []).map((r) => ({ caseName: r.caseName, court: r.court_id, dateFiled: r.dateFiled, suitNature: r.suitNature,
      docket: `https://www.courtlistener.com${r.docket_absolute_url}` })),
  };
}

async function proPublica(name) {
  const url = `https://www.propublica.org/search?qss=${encodeURIComponent(quote(name))}`;
  let res = await fetch(url);
  if (res.status === 429) { await sleep(30000); res = await fetch(url); }
  if (!res.ok) return { url, error: `HTTP ${res.status}` };
  const html = await res.text();
  const links = [...new Set([...html.matchAll(/href="(https:\/\/www\.propublica\.org\/article\/[^"]+)"/g)].map((m) => m[1]))];
  return { url, articles: links };
}

mkdirSync(OUT, { recursive: true });
const only = process.argv.slice(2);
for (const file of readdirSync(join(ROOT, 'retailers')).sort()) {
  const { fm: data } = splitFrontMatter(readFileSync(join(ROOT, 'retailers', file), 'utf8'));
  if (data.amazon_owned || (only.length && !only.includes(data.domain))) continue;
  const names = [data.name, ...(ALIASES[data.domain] || [])];
  const out = { domain: data.domain, names, fetched: new Date().toISOString(), courtlistener: await courtListener(names), propublica: await proPublica(data.name) };
  writeFileSync(join(OUT, file.replace(/\.md$/, '.json')), `${JSON.stringify(out, null, 2)}\n`);
  console.log(`${data.domain}: courtlistener ${out.courtlistener.count ?? out.courtlistener.error}, propublica ${out.propublica.articles?.length ?? out.propublica.error}`);
  await sleep(5000);
}
