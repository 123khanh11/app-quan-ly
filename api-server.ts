/**
 * Express API Server for Shipping APIs
 * Runs on port 3000
 * Loads .env variables
 */

import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '.env.local') })

console.log('✅ Environment variables loaded:')
console.log('   GHN_TOKEN:', process.env.GHN_TOKEN ? '✓ Loaded' : '✗ Missing')
console.log('   GHN_SHOP_ID:', process.env.GHN_SHOP_ID)
console.log('')

// Import API handlers
import shippingFeeHandler from './api/shipping-fee.mjs'
import shippingOrderFeeHandler from './api/shipping-order-fee.mjs'

const app = express()
const PORT = 3000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.post('/api/shipping-fee', (req, res) => shippingFeeHandler(req, res))
app.get('/api/shipping-order-fee', (req, res) => shippingOrderFeeHandler(req, res))

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      GHN_TOKEN: process.env.GHN_TOKEN ? '✓' : '✗',
      GHN_SHOP_ID: process.env.GHN_SHOP_ID
    }
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint ${req.method} ${req.path} not found`
  })
})

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('❌ Error:', err)
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 API Server running on http://localhost:${PORT}`)
  console.log(`   POST   http://localhost:${PORT}/api/shipping-fee`)
  console.log(`   GET    http://localhost:${PORT}/api/shipping-order-fee`)
  console.log(`   GET    http://localhost:${PORT}/api/health`)
  console.log('')
})
