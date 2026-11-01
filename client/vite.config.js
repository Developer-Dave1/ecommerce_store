import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/login': 'http://localhost:3000',
      '/logout': 'http://localhost:3000',
      '/products': 'http://localhost:3000',
      '/admin': 'http://localhost:3000',
      '/images': 'http://localhost:3000',
    },
  },
});
