/**
 * Express Server cho Vite
 * Cung cấp API routes cho GHN
 * Chạy: npm run server
 * API sẽ available tại http://localhost:5000/api/ghn/*
 */

import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// GHN Configuration
const GHN_TOKEN = process.env.GHN_TOKEN
const GHN_SHOP_ID = process.env.GHN_SHOP_ID
const GHN_API_URL = process.env.GHN_API_URL || 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2'

// Helper: GHN Headers
function getGHNHeaders() {
  return {
    'Content-Type': 'application/json',
    'Token': GHN_TOKEN,
    'ShopId': GHN_SHOP_ID,
  }
}

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'GHN API Server is running' })
})

// GET /api/ghn/province - Lấy danh sách tỉnh/thành phố
app.get('/api/ghn/province', async (req: Request, res: Response) => {
  try {
    const response = await fetch(`${GHN_API_URL}/master-data/province`, {
      method: 'GET',
      headers: getGHNHeaders(),
    })

    const data = await response.json()

    if (data.code === 200) {
      res.json({
        success: true,
        data: data.data || [],
      })
    } else {
      res.status(400).json({
        success: false,
        error: data.message,
      })
    }
  } catch (error) {
    console.error('Get Provinces Error:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// GET /api/ghn/district - Lấy danh sách quận/huyện
// Query: ?province_id=201
app.get('/api/ghn/district', async (req: Request, res: Response) => {
  try {
    const { province_id } = req.query

    if (!province_id) {
      return res.status(400).json({
        success: false,
        error: 'province_id is required',
      })
    }

    const response = await fetch(
      `${GHN_API_URL}/master-data/district?province_id=${province_id}`,
      {
        method: 'GET',
        headers: getGHNHeaders(),
      }
    )

    const data = await response.json()

    if (data.code === 200) {
      res.json({
        success: true,
        data: data.data || [],
      })
    } else {
      res.status(400).json({
        success: false,
        error: data.message,
      })
    }
  } catch (error) {
    console.error('Get Districts Error:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// GET /api/ghn/ward - Lấy danh sách xã/phường
// Query: ?district_id=1450
app.get('/api/ghn/ward', async (req: Request, res: Response) => {
  try {
    const { district_id } = req.query

    if (!district_id) {
      return res.status(400).json({
        success: false,
        error: 'district_id is required',
      })
    }

    const response = await fetch(
      `${GHN_API_URL}/master-data/ward?district_id=${district_id}`,
      {
        method: 'GET',
        headers: getGHNHeaders(),
      }
    )

    const data = await response.json()

    if (data.code === 200) {
      res.json({
        success: true,
        data: data.data || [],
      })
    } else {
      res.status(400).json({
        success: false,
        error: data.message,
      })
    }
  } catch (error) {
    console.error('Get Wards Error:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// GET /api/ghn/service - Lấy danh sách dịch vụ
// Query: ?from_district=1455&to_district=1542
app.get('/api/ghn/service', async (req: Request, res: Response) => {
  try {
    const { from_district, to_district } = req.query

    if (!from_district || !to_district) {
      return res.status(400).json({
        success: false,
        error: 'from_district and to_district are required',
      })
    }

    const response = await fetch(
      `${GHN_API_URL}/master-data/service?from_district=${from_district}&to_district=${to_district}`,
      {
        method: 'GET',
        headers: getGHNHeaders(),
      }
    )

    const data = await response.json()

    if (data.code === 200) {
      res.json({
        success: true,
        data: data.data || [],
      })
    } else {
      res.status(400).json({
        success: false,
        error: data.message,
      })
    }
  } catch (error) {
    console.error('Get Services Error:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// POST /api/ghn/fee - Tính phí vận chuyển
app.post('/api/ghn/fee', async (req: Request, res: Response) => {
  try {
    const {
      service_id,
      from_district_id,
      from_ward_code,
      to_district_id,
      to_ward_code,
      weight,
      length = 0,
      width = 0,
      height = 0,
      insurance_value = 0,
      coupon = null,
    } = req.body

    if (!service_id || !from_district_id || !to_district_id || !to_ward_code || !weight) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
      })
    }

    const response = await fetch(`${GHN_API_URL}/shipping-order/fee`, {
      method: 'POST',
      headers: getGHNHeaders(),
      body: JSON.stringify({
        service_id,
        from_district_id,
        from_ward_code,
        to_district_id,
        to_ward_code,
        weight,
        length,
        width,
        height,
        insurance_value,
        coupon,
      }),
    })

    const data = await response.json()

    if (data.code === 200) {
      res.json({
        success: true,
        data: data.data,
      })
    } else {
      res.status(400).json({
        success: false,
        error: data.message,
      })
    }
  } catch (error) {
    console.error('Calculate Fee Error:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 GHN API Server running on http://localhost:${PORT}`)
  console.log(`📍 API Endpoints:`)
  console.log(`   GET  http://localhost:${PORT}/api/ghn/province`)
  console.log(`   GET  http://localhost:${PORT}/api/ghn/district?province_id=201`)
  console.log(`   GET  http://localhost:${PORT}/api/ghn/ward?district_id=1450`)
  console.log(`   GET  http://localhost:${PORT}/api/ghn/service?from_district=1455&to_district=1542`)
  console.log(`   POST http://localhost:${PORT}/api/ghn/fee`)
  console.log(`\n✅ Token: ${GHN_TOKEN ? '✓ Configured' : '✗ Missing'}`)
  console.log(`✅ Shop ID: ${GHN_SHOP_ID ? '✓ Configured' : '✗ Missing'}`)
})
