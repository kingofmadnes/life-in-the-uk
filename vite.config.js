import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // React rarely changes; keeping it in its own chunk means an edit to the question bank
        // doesn't force returning students to re-download the framework.
        manualChunks(id) {
          if (id.includes('node_modules') && (id.includes('/react') || id.includes('/scheduler'))) {
            return 'react'
          }
        },
      },
    },
  },
})
