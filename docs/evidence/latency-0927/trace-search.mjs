// Live browser trace of a product+zip search on the public site.
// Usage: node trace-search.mjs <outfile.json> [throttle]
// page.evaluate and waitForFunction bodies run in the browser.
/* global performance, document */
import { chromium } from 'playwright';
import fs from 'node:fs';

const SITE = 'https://bfaloona.github.io/nottheriver/';
const ZIP = '97214';
const SEARCHES = ['bike pump', 'bike pump', 'beeswax candles', 'hiking boots'];
const out = process.argv[2];
const throttle = process.argv[3] === 'slow4g';

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
await cdp.send('Network.enable');
if (throttle) {
  // Lighthouse "Slow 4G": 150 ms RTT, 1.6 Mbps down, 750 Kbps up, 4x CPU slowdown.
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
}

const t0 = Date.now();
const reqs = [];
const encoded = new Map();
cdp.on('Network.loadingFinished', (e) => encoded.set(e.requestId, e.encodedDataLength));
const pending = new Map();
cdp.on('Network.requestWillBeSent', (e) => pending.set(e.requestId, { url: e.request.url, method: e.request.method, type: e.type, start: e.timestamp }));
cdp.on('Network.responseReceived', (e) => {
  const p = pending.get(e.requestId); if (!p) return;
  const t = e.response.timing;
  p.status = e.response.status;
  p.protocol = e.response.protocol;
  p.encoding = e.response.headers['content-encoding'] ?? e.response.headers['Content-Encoding'] ?? null;
  p.cacheControl = e.response.headers['cache-control'] ?? null;
  p.fromCache = e.response.fromDiskCache || e.response.fromServiceWorker || false;
  if (t) p.timing = { dns: t.dnsEnd - t.dnsStart, connect: t.connectEnd - t.connectStart, ssl: t.sslEnd - t.sslStart, send: t.sendEnd - t.sendStart, ttfb: t.receiveHeadersStart - t.sendEnd };
});
cdp.on('Network.loadingFinished', (e) => {
  const p = pending.get(e.requestId); if (!p) return;
  p.total_ms = Math.round((e.timestamp - p.start) * 1000);
  p.bytes = e.encodedDataLength;
  p.url = p.url.replace(/https:\/\/[^/]+\.workers\.dev/, 'https://<worker>');
  reqs.push(p); pending.delete(e.requestId);
});

const phases = [];
const mark = (name, extra = {}) => phases.push({ name, at_ms: Date.now() - t0, ...extra });

await page.goto(SITE, { waitUntil: 'load' });
mark('load');
const nav = await page.evaluate(() => {
  const n = performance.getEntriesByType('navigation')[0];
  const fcp = performance.getEntriesByName('first-contentful-paint')[0];
  return { ttfb: n.responseStart, dcl: n.domContentLoadedEventEnd, load: n.loadEventEnd, fcp: fcp?.startTime ?? null };
});
mark('nav', nav);

for (const product of SEARCHES) {
  await page.fill('#product', product);
  await page.fill('#zip', ZIP);
  const before = reqs.length;
  const clickAt = Date.now();
  const resp = page.waitForResponse((r) => r.url().endsWith('/search') && r.request().method() === 'POST', { timeout: 120_000 });
  await page.click('button[type=submit]');
  const r = await resp;
  const respAt = Date.now();
  const body = await r.json().catch(() => null);
  // Results or a terminal status line mean the page has finished rendering this search.
  await page.waitForFunction(() => !document.querySelector('#results')?.hidden || /no |failed|try again/i.test(document.querySelector('[data-status]')?.textContent ?? ''), null, { timeout: 30_000 });
  const renderedAt = Date.now();
  await page.waitForTimeout(3000); // let the map chunk and tiles load
  const usage = body?.usage ?? null;
  mark('search', {
    product,
    click_to_response_ms: respAt - clickAt,
    response_to_rendered_ms: renderedAt - respAt,
    click_to_rendered_ms: renderedAt - clickAt,
    status: r.status(),
    brave_calls: usage?.brave_calls,
    llm: usage?.llm?.map((u) => ({ call: u.call, model: u.model, prompt: u.prompt_tokens, completion: u.completion_tokens })),
    results: body ? { local: body.local?.length, farther: body.local_farther?.length, online: body.online?.length } : null,
    requests_after_click: reqs.slice(before).length,
  });
  await page.waitForTimeout(1000);
}

// Late finishers (tiles) are captured by now.
fs.writeFileSync(out, JSON.stringify({ site: SITE, zip: ZIP, throttle, ran: new Date().toISOString(), phases, requests: reqs }, null, 2));
await browser.close();
console.log('wrote', out);
