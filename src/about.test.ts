// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import aboutHtml from '../about.html?raw';
import { tagline } from './config';

async function load(measured: unknown, repo = '') {
  document.body.innerHTML = /<body>([\s\S]*)<\/body>/.exec(aboutHtml)![1]!.replace(/<script[\s\S]*?<\/script>/g, '');
  vi.stubEnv('VITE_REPO_URL', repo);
  vi.doMock('./quality.json', () => ({ default: { measured } }));
  vi.resetModules();
  await import('./about');
}

const $ = (selector: string) => document.querySelector<HTMLElement>(selector)!;

afterEach(() => {
  vi.unstubAllEnvs();
  vi.doUnmock('./quality.json');
});

describe('about page', () => {
  it('says "Not yet measured" until an evaluation has run', async () => {
    await load(null);
    expect($('[data-quality]').textContent).toBe('Not yet measured.');
  });

  it('states the measured precision and recall with the date', async () => {
    await load({ date: '2026-10-01', searches: 20, precision: { online: 0.8, local: 0.625 }, recall: { online: 0.5, local: 0.4 }, evidence: 'docs/evidence/quality/eval20-0925' });
    const text = $('[data-quality]').textContent!;
    for (const part of ['2026-10-01', '20 graded searches', '80%', '63%', "mixes two graders' answers"]) expect(text).toContain(part);
    const recall = $('[data-quality-recall]').textContent!;
    for (const part of ['50%', '40%']) expect(recall).toContain(part);
  });

  it('shows a figure as a range when the two graded runs rounded to different percentages', async () => {
    await load({
      date: '2026-09-26', searches: 20,
      precision: { online: 0.979, local: [0.617, 0.636] }, recall: { online: 0.31, local: [0.326, 0.349] },
      evidence: 'docs/evidence/quality/eval20-0925',
    });
    expect($('[data-quality]').textContent).toContain('62 to 64%');
    expect($('[data-quality-recall]').textContent).toContain('33 to 35%');
  });

  it('hides the recall line until an evaluation has run', async () => {
    await load(null);
    expect($('[data-quality-recall]').hidden).toBe(true);
  });

  it('links raw evidence to the measured run\'s own folder', async () => {
    const repo = 'https://github.com/example/example';
    await load({ date: '2026-09-26', searches: 20, precision: { online: 0.98, local: 0.6 }, recall: { online: 0.3, local: 0.3 }, evidence: 'docs/evidence/quality/eval20-0925' }, repo);
    expect($('[data-evidence-link]').getAttribute('href')).toBe(`${repo}/tree/main/docs/evidence/quality/eval20-0925`);
  });

  it('links raw evidence to the general index before anything has been measured', async () => {
    const repo = 'https://github.com/example/example';
    await load(null, repo);
    expect($('[data-evidence-link]').getAttribute('href')).toBe(`${repo}/tree/main/docs/evidence/quality`);
  });

  it('keeps repo links and the dispute form out when no repo URL is configured', async () => {
    await load(null);
    expect(document.title).toBe('About nottheriver');
    expect(document.querySelectorAll('a[data-repo-path][href], a[data-dispute-link][href]')).toHaveLength(0);
    for (const el of document.querySelectorAll<HTMLElement>('[data-needs-repo]')) expect(el.hidden).toBe(true);
  });

  it('links the docs and the dispute template when a repo URL is configured', async () => {
    const repo = 'https://github.com/example/example';
    await load(null, repo);
    expect($('a[data-repo-path="blob/main/docs/ranking.md"]').getAttribute('href')).toBe(`${repo}/blob/main/docs/ranking.md`);
    expect($('a[data-dispute-link]').getAttribute('href')).toBe(`${repo}/issues/new?template=dispute-a-ranking.md`);
    for (const el of document.querySelectorAll<HTMLElement>('[data-needs-repo]')) expect(el.hidden).toBe(false);
  });

  it('keeps the mission sentence in sync with the search page', async () => {
    await load(null);
    expect($('h1').textContent).toBe(tagline);
  });

  it('keeps every internal link relative so the Pages base path survives', async () => {
    await load(null);
    for (const a of document.querySelectorAll('a[href]')) expect(a.getAttribute('href')!.startsWith('/')).toBe(false);
  });
});
