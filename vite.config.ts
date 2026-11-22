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
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // Load environment variables
  define: {
    'process.env.GHN_TOKEN': JSON.stringify(process.env.GHN_TOKEN),
    'process.env.GHN_SHOP_ID': JSON.stringify(process.env.GHN_SHOP_ID),
    'process.env.GHN_FROM_DISTRICT_ID': JSON.stringify(process.env.GHN_FROM_DISTRICT_ID),
    'process.env.GHN_FROM_WARD_CODE': JSON.stringify(process.env.GHN_FROM_WARD_CODE),
  }
})

