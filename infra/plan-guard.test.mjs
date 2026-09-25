import { describe, expect, it } from 'vitest';
import { checkPlan } from './plan-guard.mjs';

const change = (address, type, actions, extra = {}) => ({ address, type, change: { actions, ...extra } });
const BEFORE = {
  content_file: '../proxy/dist/index.js', content_sha256: 'aaa', compatibility_date: '2026-09-01',
  bindings: [{ name: 'BRAVE_API_KEY', type: 'secret_text', text: 'secret-value' }], observability: { enabled: false }, modified_on: '2026-09-23',
};
// A code-only deploy: new bundle hash, and the provider recomputes modified_on.
const codeOnly = (after = {}) => change(WORKER, 'cloudflare_workers_script', ['update'], {
  before: BEFORE,
  after: { ...BEFORE, content_sha256: 'bbb', modified_on: null, ...after },
  after_unknown: { modified_on: true },
});
const plan = (...changes) => ({ resource_changes: changes });
const WORKER = 'cloudflare_workers_script.proxy';

describe('checkPlan', () => {
  it('allows a new Worker bundle and lists it', () => {
    const r = checkPlan(plan(codeOnly(), change('cloudflare_workers_script_subdomain.proxy', 'cloudflare_workers_script_subdomain', ['no-op'])));
    expect(r).toEqual({ ok: true, changes: [`update ${WORKER}`], problems: [] });
  });

  it.each([
    ['bindings', { bindings: [] }],
    ['observability', { observability: { enabled: true } }],
    ['compatibility_date', { compatibility_date: '2026-10-01' }],
  ])('refuses a Worker update that also changes %s, naming it without its value', (attr, after) => {
    const r = checkPlan(plan(codeOnly(after)));
    expect(r.ok).toBe(false);
    expect(r.problems).toEqual([`needs the operator: update ${WORKER} changes ${attr}`]);
    expect(JSON.stringify(r)).not.toContain('secret-value');
  });

  it('refuses a Worker update whose before and after it cannot see', () => {
    expect(checkPlan(plan(change(WORKER, 'cloudflare_workers_script', ['update']))).ok).toBe(false);
  });

  it('reports no changes for an all no-op plan', () => {
    expect(checkPlan(plan(change(WORKER, 'cloudflare_workers_script', ['no-op'])))).toEqual({ ok: true, changes: [], problems: [] });
  });

  it.each([
    ['a replaced Worker', change(WORKER, 'cloudflare_workers_script', ['delete', 'create'])],
    ['a destroyed Worker', change(WORKER, 'cloudflare_workers_script', ['delete'])],
    ['a new Worker', change(WORKER, 'cloudflare_workers_script', ['create'])],
    ['any change to another resource', change('cloudflare_workers_script_subdomain.proxy', 'cloudflare_workers_script_subdomain', ['update'])],
  ])('refuses %s', (_, c) => {
    const r = checkPlan(plan(c));
    expect(r.ok).toBe(false);
    expect(r.problems).toHaveLength(1);
    expect(r.problems[0]).toContain(c.address);
  });

  it.each([
    ['an empty action list', change(WORKER, 'cloudflare_workers_script', [])],
    ['an import', change(WORKER, 'cloudflare_workers_script', ['no-op'], { importing: { id: 'x' } })],
    ['a moved resource', { ...change(WORKER, 'cloudflare_workers_script', ['no-op']), previous_address: 'cloudflare_workers_script.old' }],
  ])('refuses %s', (_, c) => {
    expect(checkPlan(plan(c)).ok).toBe(false);
  });

  it('refuses a plan it cannot read', () => {
    expect(checkPlan({}).ok).toBe(false);
  });
});
