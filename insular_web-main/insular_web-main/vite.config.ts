import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const PORT = Number(process.env.PORT || 5173)
const PREVIEW_PORT = Number(process.env.PREVIEW_PORT || 4173)
// Use root path for GoDaddy deployment
const BASE = '/'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: PORT,
    allowedHosts: ['.trycloudflare.com', '.ngrok-free.dev', '.ngrok.io', '.ngrok-free.app'],
  },
  preview: {
    host: '0.0.0.0',
    port: PREVIEW_PORT,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          gsap: ['gsap'],
          router: ['react-router-dom'],
        },
      },
    },
  },
  base: BASE,
})
