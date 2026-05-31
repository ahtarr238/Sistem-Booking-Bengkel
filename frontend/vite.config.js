import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const backend = 'http://localhost:3000';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/auth': { target: backend, changeOrigin: true },
      '/bookings': { target: backend, changeOrigin: true },
      '/parts': { target: backend, changeOrigin: true },
      '/categories': { target: backend, changeOrigin: true },
      '/sales': { target: backend, changeOrigin: true },
      '/reports': { target: backend, changeOrigin: true },
      '/uploads': { target: backend, changeOrigin: true },
    },
  },
});
