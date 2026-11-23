import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

// Load .env.local
dotenv.config()

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
  ],
  
  // Proxy API calls to backend
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      }
    }
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  assetsInclude: ['**/*.svg', '**/*.csv'],

  define: {
    'process.env.GHN_TOKEN': JSON.stringify(process.env.GHN_TOKEN),
    'process.env.GHN_SHOP_ID': JSON.stringify(process.env.GHN_SHOP_ID),
    'process.env.GHN_FROM_DISTRICT_ID': JSON.stringify(process.env.GHN_FROM_DISTRICT_ID),
    'process.env.GHN_FROM_WARD_CODE': JSON.stringify(process.env.GHN_FROM_WARD_CODE),
  }
})

