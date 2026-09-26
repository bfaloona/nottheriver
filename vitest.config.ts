import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'proxy/**/*.test.ts', 'data/**/*.test.mjs', 'eval/**/*.test.mjs', 'infra/**/*.test.mjs', 'research/**/*.test.mjs'],
    passWithNoTests: true,
  },
});
