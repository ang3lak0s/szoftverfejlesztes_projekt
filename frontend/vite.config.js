import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // IDE FOG BUILD-elni:
    outDir: '../src/main/resources/static',
    emptyOutDir: true,
  },
  base: '/',
})