import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite({ target: 'react', autoCodeSplitting: true }), react(), tailwindcss(), {
    name: 'remove-service-worker',
    apply: 'build',
    closeBundle() {
      const swPath = path.resolve(__dirname, 'public/serviceworker.js')
      if (fs.existsSync(swPath)) {
        fs.rmSync(swPath)
      }
    },
  },],
  server: {
    watch: {
      usePolling: true, // Because windows with wsl is an arsehole
    },
    host: true,
  },
})
