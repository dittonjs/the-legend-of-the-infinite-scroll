import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative asset paths so the site works from GitHub Pages' /<repo>/ subpath.
  base: './',
  // GitHub Pages can serve from the docs folder on the main branch.
  build: {
    outDir: 'docs',
  },
})
