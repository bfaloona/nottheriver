import { defineConfig } from 'vite';

// GitHub Pages serves project sites under /<repo>/; CI sets BASE_PATH so the
// repo name never needs to be hard-coded here.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
});
