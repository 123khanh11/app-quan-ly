/**
 * Development Server with Environment Variables
 * Loads .env.local and starts Vite dev server
 */

import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Load environment variables from .env.local
dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '.env.local') })

console.log('✅ Environment variables loaded:')
console.log('   GHN_TOKEN:', process.env.GHN_TOKEN ? '✓ Loaded' : '✗ Missing')
console.log('   VITE_GHN_TOKEN:', process.env.VITE_GHN_TOKEN ? '✓ Loaded' : '✗ Missing')
console.log('   GHN_SHOP_ID:', process.env.GHN_SHOP_ID)
console.log('')

// Now start Vite dev server
import { createServer } from 'vite'

async function startServer() {
  const server = await createServer({
    // any valid user config options, plus `command` and `mode`
    configFile: false,
    root: resolve(dirname(fileURLToPath(import.meta.url))),
  })

  await server.listen()

  server.printUrls()
}

startServer().catch(err => {
  console.error('❌ Server error:', err)
  process.exit(1)
})
