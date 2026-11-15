// Reads public pages for research without getting around anything a site has set up.
// robots.txt is checked before every request and every redirect hop; the client name is
// Node's own or the headless browser's own; a refusal or challenge page is recorded and
// never retried in another client. Saved pages are untrusted data: nothing in them is run
// outside the browser sandbox.
//
//   node research/fetch-page.mjs --out DIR [--browser] [--max-mb N] URL...
//
// --browser also loads every readable HTML page in a headless browser (for pages whose
// data is filled in by script). Without it the browser is used only when the plain
// request returns a near-empty page. --max-mb raises the size at which a saved body is
// cut (default 5). One line per URL is appended to DIR/index.jsonl.
import { mkdirSync, writeFileSync, appendFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';

// The request carries Node's own client name, which no robots.txt names, so the `*`
// group is the one that binds it. A group written for a named crawler or assistant
// (ClaudeBot, Claude-User, GPTBot) is not applied, by the owner's ruling in
// docs/STATUS.md ("Decisions made by the operator", crawler rules).
export const ROBOTS_AGENTS = ['*'];
const MIN_GAP_MS = 2000;
const MAX_PER_HOST = 6;
const MAX_HOPS = 5;
const DEFAULT_MAX_MB = 5;
const SLUG_CHARS = 90;
const SHELL_CHARS = 500;
const CHALLENGE = /just a moment|one moment, please|challenge-platform|attention required|access denied|request rate threshold|verify(ing)? you are (a )?human/i;

export function parseRobots(text) {
  const groups = [];
  let current = null;
  let inAgentRun = false;
  for (const raw of text.split(/\r?\n/)) {
    const m = /^([A-Za-z-]+)\s*:\s*(.*)$/.exec(raw.replace(/#.*/, '').trim());
    if (!m) continue;
    const key = m[1].toLowerCase();
    const value = m[2].trim();
    if (key === 'user-agent') {
      if (!inAgentRun) groups.push((current = { agents: [], rules: [], crawlDelay: 0 }));
      current.agents.push(value.toLowerCase());
      inAgentRun = true;
    } else if (key === 'allow' || key === 'disallow' || key === 'crawl-delay') {
      // Rules above any User-agent line have no stated audience; read them as binding everyone.
      if (!current) groups.push((current = { agents: ['*'], rules: [], crawlDelay: 0 }));
      if (key === 'crawl-delay') current.crawlDelay = Number(value) || 0;
      else if (value) current.rules.push({ allow: key === 'allow', pattern: value });
      inAgentRun = false;
    }
  }
  return groups;
}

function patternMatches(pattern, path) {
  const escaped = pattern.split('*').map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*');
  return new RegExp(`^${escaped.replace(/\\\$$/, '$')}`).test(path);
}

// Longest matching rule wins and Allow wins a tie (RFC 9309); the path must pass every
// group that names one of `agents`.
export function robotsAllows(groups, path, agents = ROBOTS_AGENTS) {
  for (const agent of agents) {
    let best = null;
    for (const rule of groups.filter((g) => g.agents.includes(agent)).flatMap((g) => g.rules)) {
      if (!patternMatches(rule.pattern, path)) continue;
      if (!best || rule.pattern.length > best.pattern.length || (rule.pattern.length === best.pattern.length && rule.allow)) best = rule;
    }
    if (best && !best.allow) return false;
  }
  return true;
}

export function htmlToText(html) {
  return html
    .replace(/<(script|style|noscript|svg|template)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<a\b[^>]*?href="([^"#][^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '$2 [$1] ')
    .replace(/<\/?(p|div|br|li|tr|h[1-6]|table|section|article|ul|ol)\b[^>]*>/gi, '\n')
    .replace(/<(td|th)\b[^>]*>/gi, ' | ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
    .replace(/[ \t\r\f\v]+/g, ' ')
    .replace(/ ?\n ?/g, '\n')
    .replace(/\n+/g, '\n')
    .trim();
}

// ok: readable text. shell: too little text, likely filled in by script. challenge: a bot
// check or block page. refused: any 4xx or 5xx. file: not HTML (PDF, JSON, spreadsheet).
export function classify(status, contentType, text) {
  if (status >= 400) return CHALLENGE.test(text) ? 'challenge' : 'refused';
  if (!/html|text\/plain/i.test(contentType)) return 'file';
  if (text.length < 4000 && CHALLENGE.test(text)) return 'challenge';
  return text.length < SHELL_CHARS ? 'shell' : 'ok';
}

const robotsCache = new Map();
const robotsProblem = new Map();
const lastRequest = new Map();
const hostCount = new Map();

async function politeFetch(url, options) {
  const { host } = new URL(url);
  const delay = Math.max(MIN_GAP_MS, (robotsCache.get(new URL(url).origin)?.crawlDelay ?? 0) * 1000);
  const wait = (lastRequest.get(host) ?? 0) + delay - Date.now();
  if (wait > 0) await sleep(wait);
  lastRequest.set(host, Date.now());
  return fetch(url, { signal: AbortSignal.timeout(30000), ...options });
}

// null means the rules could not be read, which is treated as "everything disallowed".
async function robotsFor(origin) {
  if (robotsCache.has(origin)) return robotsCache.get(origin);
  let entry = null;
  try {
    const res = await politeFetch(`${origin}/robots.txt`, {});
    const text = res.ok ? await res.text() : '';
    if (res.status === 404 || res.status === 410) entry = { groups: [], crawlDelay: 0 };
    else if (res.ok && !/^\s*</.test(text)) {
      const groups = parseRobots(text);
      entry = { groups, crawlDelay: Math.max(0, ...groups.filter((g) => g.agents.includes('*')).map((g) => g.crawlDelay)) };
    } else robotsProblem.set(origin, res.ok ? 'robots.txt is an HTML page' : `robots.txt status ${res.status}`);
  } catch (e) {
    robotsProblem.set(origin, `robots.txt error ${e.cause?.code ?? e.name}`);
  }
  robotsCache.set(origin, entry);
  return entry;
}

async function robotsVerdict(url) {
  const u = new URL(url);
  const robots = await robotsFor(u.origin);
  if (!robots) return 'robots-unreadable';
  return robotsAllows(robots.groups, u.pathname + u.search) ? 'allowed' : 'robots-disallowed';
}

async function fetchPlain(url, maxBytes) {
  const hops = [];
  let current = url;
  for (let hop = 0; hop <= MAX_HOPS; hop++) {
    hops.push(current);
    const verdict = await robotsVerdict(current);
    if (verdict !== 'allowed') return { hops, refusal: verdict };
    const { host } = new URL(current);
    hostCount.set(host, (hostCount.get(host) ?? 0) + 1);
    if (hostCount.get(host) > MAX_PER_HOST) return { hops, refusal: 'host-cap' };
    let res;
    try {
      res = await politeFetch(current, { redirect: 'manual' });
    } catch (e) {
      return { hops, refusal: `error:${e.cause?.code ?? e.name}` };
    }
    const location = res.headers.get('location');
    if (res.status >= 300 && res.status < 400 && location) {
      current = new URL(location, current).href;
      continue;
    }
    const full = Buffer.from(await res.arrayBuffer());
    return { hops, status: res.status, contentType: res.headers.get('content-type') ?? '', body: full.subarray(0, maxBytes), truncated: full.length > maxBytes };
  }
  return { hops, refusal: 'too-many-redirects' };
}

let browser;
async function launchBrowser() {
  const { chromium } = await import('playwright');
  if (process.env.CHROMIUM_PATH) return chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
  try {
    return await chromium.launch();
  } catch (e) {
    // Playwright's pinned build is not installed; use the newest headless shell already in
    // its cache instead of downloading one.
    const cache = process.env.PLAYWRIGHT_BROWSERS_PATH ?? join(homedir(), 'Library', 'Caches', 'ms-playwright');
    const builds = existsSync(cache) ? readdirSync(cache).filter((d) => d.startsWith('chromium_headless_shell-')).sort() : [];
    for (const build of builds.reverse()) {
      for (const dir of readdirSync(join(cache, build))) {
        const candidate = join(cache, build, dir, 'chrome-headless-shell');
        if (existsSync(candidate)) return chromium.launch({ executablePath: candidate });
      }
    }
    throw e;
  }
}

async function fetchRendered(url) {
  browser ??= await launchBrowser();
  const context = await browser.newContext();
  const page = await context.newPage();
  const { host } = new URL(url);
  let blocked = 0;
  // The page's own scripts may call paths its robots.txt closes; stop those, and any
  // navigation to another site that its rules do not allow.
  await page.route('**/*', async (route) => {
    const request = route.request();
    const target = new URL(request.url());
    const check = target.protocol.startsWith('http') && (target.host === host || request.isNavigationRequest());
    if (check && (await robotsVerdict(target.href)) !== 'allowed') {
      blocked += 1;
      return route.abort();
    }
    return route.continue();
  });
  const out = { blocked_by_robots: 0 };
  try {
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    out.status = response?.status() ?? null;
  } catch (e) {
    out.error = String(e.message).split('\n')[0];
  }
  try {
    out.text = await page.innerText('body');
    out.final_url = page.url();
  } catch { /* nothing rendered */ }
  out.blocked_by_robots = blocked;
  await context.close();
  return out;
}

// Order matters: a spreadsheet's and an XHTML page's content types both contain "xml".
const EXT = [[/pdf/, 'pdf'], [/json/, 'json'], [/spreadsheet|excel/, 'xlsx'], [/csv/, 'csv'], [/zip/, 'zip'], [/html/, 'html'], [/xml/, 'xml']];

// A long address keeps its start (the host) and its end (the file name), so two files in
// one deep folder do not get the same name.
export function slugOf(url) {
  const slug = url.replace(/^https?:\/\//, '').replace(/[^A-Za-z0-9.-]+/g, '_').replace(/_+$/, '');
  if (slug.length <= SLUG_CHARS) return slug;
  const head = Math.floor(SLUG_CHARS / 2) - 1;
  return `${slug.slice(0, head)}__${slug.slice(-(SLUG_CHARS - head - 2))}`;
}

const withExt = (slug, ext) => (slug.toLowerCase().endsWith(`.${ext}`) ? slug : `${slug}.${ext}`);

async function main(args) {
  const useBrowser = args.includes('--browser');
  const outIndex = args.indexOf('--out');
  const outDir = outIndex >= 0 ? args[outIndex + 1] : null;
  const maxIndex = args.indexOf('--max-mb');
  const maxBytes = (maxIndex >= 0 ? Number(args[maxIndex + 1]) : DEFAULT_MAX_MB) * 1024 * 1024;
  const urls = args.filter((a, i) => /^https?:\/\//.test(a) && i !== outIndex + 1);
  if (!outDir || urls.length === 0 || !(maxBytes > 0)) {
    console.error('usage: node research/fetch-page.mjs --out DIR [--browser] [--max-mb N] URL...');
    process.exit(2);
  }
  mkdirSync(outDir, { recursive: true });
  for (const url of urls) {
    const slug = slugOf(url);
    const row = { url, fetched: new Date().toISOString() };
    const plain = await fetchPlain(url, maxBytes);
    row.final_url = plain.hops.at(-1);
    if (plain.refusal) {
      row.class = plain.refusal;
      const problem = robotsProblem.get(new URL(row.final_url).origin);
      if (plain.refusal === 'robots-unreadable' && problem) row.robots = problem;
    } else {
      const ext = EXT.find(([re]) => re.test(plain.contentType))?.[1] ?? 'bin';
      const text = ext === 'html' || /text\/plain/.test(plain.contentType) ? htmlToText(plain.body.toString('utf8')) : '';
      Object.assign(row, { status: plain.status, content_type: plain.contentType, bytes: plain.body.length, truncated: plain.truncated, text_chars: text.length });
      row.class = classify(plain.status, plain.contentType, text);
      row.saved = withExt(slug, ext);
      writeFileSync(join(outDir, row.saved), plain.body);
      if (text) writeFileSync(join(outDir, `${slug}.txt`), `${text}\n`);
    }
    if (row.class === 'shell' || (useBrowser && row.class === 'ok')) {
      try {
        const rendered = await fetchRendered(row.final_url);
        const text = rendered.text ?? '';
        row.rendered = { status: rendered.status ?? null, text_chars: text.length, blocked_by_robots: rendered.blocked_by_robots, final_url: rendered.final_url, error: rendered.error };
        row.rendered.class = classify(rendered.status ?? 200, 'text/html', text);
        if (text) writeFileSync(join(outDir, `${slug}.rendered.txt`), `${text}\n`);
      } catch (e) {
        row.rendered = { error: String(e.message).split('\n')[0] };
      }
    }
    appendFileSync(join(outDir, 'index.jsonl'), `${JSON.stringify(row)}\n`);
    console.log(`${row.class}${row.rendered ? ` / rendered ${row.rendered.class ?? 'error'}` : ''}\t${url}`);
  }
  await browser?.close();
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main(process.argv.slice(2));
