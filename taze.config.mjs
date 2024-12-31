import { defineConfig } from 'taze';

export default defineConfig({
  exclude: ['chalk'],
  packageMode: {
    '/vite/': 'minor',
  },
});
