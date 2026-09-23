import { defineConfig, type Plugin } from 'vite';

// The one place the dev Worker URL default lives; the CSP below reads the same value.
const workerUrl = (process.env.VITE_WORKER_URL ??= 'http://localhost:8787');

// Build only: Vite's dev server injects inline styles and an HMR socket that
// this policy would block. form-action 'none' keeps a failed script from ever
// submitting the zip field as a query string.
function contentSecurityPolicy(workerUrl: string): Plugin {
  const policy = [
    "default-src 'none'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data:",
    `connect-src 'self' ${workerUrl}`,
    "form-action 'none'",
    "base-uri 'none'",
  ].join('; ');
  return {
    name: 'content-security-policy',
    apply: 'build',
    transformIndexHtml: () => [
      { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: policy }, injectTo: 'head-prepend' },
    ],
  };
}

// GitHub Pages serves project sites under /<repo>/; CI sets BASE_PATH so the
// repo name never needs to be hard-coded here.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [contentSecurityPolicy(workerUrl)],
  build: {
    rolldownOptions: {
      input: { main: 'index.html', about: 'about.html' },
    },
  },
});
