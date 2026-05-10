import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  // Em desenvolvimento local, proxy as chamadas /api para o Worker
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8788', // wrangler pages dev
        changeOrigin: true,
      }
    }
  }
})
