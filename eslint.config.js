import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['dist', 'proxy/dist', 'public', 'data/raw', 'test-results', 'playwright-report', '.wrangler']),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.mjs'],
    languageOptions: {
      globals: { process: 'readonly', console: 'readonly', URL: 'readonly', fetch: 'readonly', Buffer: 'readonly' },
    },
  },
);
