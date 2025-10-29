import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'process'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      target: 'es2022',
      supported: { 
        bigint: true 
      },
    },
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      '@thirdweb-dev/react',
      '@thirdweb-dev/sdk',
      '@tanstack/react-query',
    ],
  },
  build: {
    target: 'es2022',
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@thirdweb-dev')) {
              return 'thirdweb'
            }
            if (id.includes('react')) {
              return 'react'
            }
            return 'vendor'
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      process: 'process/browser',
      util: 'util',
      stream: 'stream-browserify',
      buffer: 'buffer',
      '@': resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': process.env,
    global: 'globalThis',
  },
  server: {
    hmr: {
      overlay: true,
    },
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
})

