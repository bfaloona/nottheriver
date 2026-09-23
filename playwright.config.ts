import { defineConfig } from '@playwright/test';

const WORKER_URL = 'http://localhost:8788';

// The site is the built dist, not the dev server: the CSP meta is injected at build time
// only, and the smoke test must run under it. Servers are never reused, so a stray dev
// server on 5173 (no CSP, wrong worker URL) fails loudly on --strictPort instead.
export default defineConfig({
  testDir: 'tests/e2e',
  forbidOnly: !!process.env.CI,
  use: { baseURL: 'http://localhost:5173' },
  projects: [{ name: 'chromium' }],
  webServer: [
    {
      command: 'npx tsx tests/mock-proxy.ts',
      url: `${WORKER_URL}/health`,
      reuseExistingServer: false,
    },
    {
      command: 'npm run build && npx vite preview --port 5173 --strictPort',
      url: 'http://localhost:5173',
      env: { VITE_WORKER_URL: WORKER_URL },
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
