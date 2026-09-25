// Where did the shops the rerun lost go? Checks both eval runs and replay-1 for each.
import { readFileSync, existsSync } from 'node:fs';
const DIR = new URL('.', import.meta.url).pathname;
const cases = [['usb-c-charging-cable-suburban', 'target'], ['dark-chocolate-bar-suburban', 'safeway'], ['wool-socks-urban', 'dick']];
for (const [id, k] of cases) {
  console.log('==', id, k);
  for (const run of ['eval60', 'eval20-0924']) {
    const b = JSON.parse(readFileSync(`docs/evidence/quality/${run}/responses/${id}.json`, 'utf8')).body;
    const shown = [...b.local, ...(b.local_farther ?? [])].filter((r) => JSON.stringify(r.retailer).toLowerCase().includes(k)).map((r) => `${r.retailer.name} @ ${r.address}`);
    console.log(run, JSON.stringify(b.query.local_queries), 'shown', JSON.stringify(shown), 'dropped', JSON.stringify(b.dropped.filter((x) => x.domain.includes(k))));
  }
  for (const i of [0, 1]) {
    const f = `${DIR}replay-1/${id}__${i}.json`;
    if (!existsSync(f)) continue;
    const j = JSON.parse(readFileSync(f, 'utf8'));
    const hits = j.body.results.filter((r) => JSON.stringify(r).toLowerCase().includes(k)).map((r) => `${r.title} @ ${r.postal_address?.displayAddress ?? ''}`);
    console.log('replay-1', JSON.stringify(j.q), JSON.stringify(hits));
  }
}
