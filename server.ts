/**
 * Express Server cho Vite
 * Cung cấp API routes cho GHN
 * Chạy: npm run server
 * API sẽ available tại http://localhost:5000/api/ghn/*
 */

import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Load .env.local
const envPath = '.env.local'
console.log(`📂 Loading environment from: ${envPath}`)
dotenv.config({ path: envPath })

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Token', 'ShopId']
}))
app.use(express.json())

// GHN Configuration
const GHN_TOKEN = process.env.GHN_TOKEN || ''
const GHN_SHOP_ID = process.env.GHN_SHOP_ID || ''
const GHN_API_URL = process.env.GHN_API_URL || 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2'

console.log('\n📋 Environment Variables:')
console.log(`   ✓ Token: ${GHN_TOKEN ? '✓ Set (' + GHN_TOKEN.substring(0, 10) + '...)' : '✗ Missing'}`)
console.log(`   ✓ Shop ID: ${GHN_SHOP_ID ? '✓ Set (' + GHN_SHOP_ID + ')' : '✗ Missing'}`)
console.log(`   ✓ API URL: ${GHN_API_URL}`)

if (!GHN_TOKEN || !GHN_SHOP_ID) {
  console.error('\n❌ ERROR: GHN_TOKEN or GHN_SHOP_ID not configured!')
  console.error('Please check your .env.local file and ensure:')
  console.error('  GHN_TOKEN=653bfc7b-8381-11f1-a65e-a68e06d4dd1e')
  console.error('  GHN_SHOP_ID=5430969')
  process.exit(1)
}

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
  res.json({
    status: 'ok',
    message: 'GHN API Server is running',
    token: GHN_TOKEN ? '✓ Configured' : '✗ Missing',
    shopId: GHN_SHOP_ID ? '✓ Configured' : '✗ Missing',
  })
})

// GET /api/ghn/province - Lấy danh sách tỉnh/thành phố
app.get('/api/ghn/province', async (_req: Request, res: Response) => {
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
app.get('/api/ghn/district', async (req: Request, res: Response) => {
  try {
    const { province_id } = req.query

    if (!province_id) {
      return res.status(400).json({
        success: false,
        error: 'province_id is required',
      })
    }

    const response = await fetch(`${GHN_API_URL}/master-data/district?province_id=${province_id}`, {
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
    console.error('Get Districts Error:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// GET /api/ghn/ward - Lấy danh sách xã/phường
app.get('/api/ghn/ward', async (req: Request, res: Response) => {
  try {
    const { district_id } = req.query

    if (!district_id) {
      return res.status(400).json({
        success: false,
        error: 'district_id is required',
      })
    }

    const response = await fetch(`${GHN_API_URL}/master-data/ward?district_id=${district_id}`, {
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
    console.error('Get Wards Error:', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// GET /api/ghn/service - Lấy danh sách dịch vụ
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

/**
 * POST /api/ghn/fee - Tính phí vận chuyển (Advanced)
 * 
 * Tính toán phí vận chuyển từ shop → khách hàng
 * 
 * Request body:
 * {
 *   to_district_id: number (required)
 *   to_ward_code: string (required)
 *   weight?: number (default: 1000)
 *   length?: number (default: 20)
 *   width?: number (default: 20)
 *   height?: number (default: 20)
 *   service_id?: number (optional, auto-detect if not provided)
 *   insurance_value?: number (default: 0)
 *   cod_value?: number (default: 0)
 *   coupon?: string (optional)
 * }
 * 
 * Được sử dụng bởi: Giỏ hàng → Thanh toán
 */
app.post('/api/ghn/fee', async (req: Request, res: Response) => {
  try {
    const {
      to_district_id,
      to_ward_code,
      weight = 1000,
      length = 20,
      width = 20,
      height = 20,
      service_id,
      insurance_value = 0,
      cod_value = 0,
      coupon = null,
    } = req.body

    // Shop location (fixed)
    const FROM_DISTRICT_ID = process.env.GHN_FROM_DISTRICT_ID || 1455
    const FROM_WARD_CODE = process.env.GHN_FROM_WARD_CODE || '21617'

    // Validate required params
    if (!to_district_id || !to_ward_code) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: to_district_id, to_ward_code',
        code: 'INVALID_PARAMS',
      })
    }

    console.log('📦 Shipping Fee Calculation Request:', {
      from_district: FROM_DISTRICT_ID,
      to_district: to_district_id,
      to_ward: to_ward_code,
      weight: weight,
      dimensions: `${length}x${width}x${height}cm`,
    })

    // Step 1: Get available services if service_id not provided
    let finalServiceId = service_id

    if (!finalServiceId) {
      try {
        console.log('📡 Step 1: Fetching available services...')

        const servicesResponse = await fetch(
          `${GHN_API_URL}/shipping-order/available-services`,
          {
            method: 'POST',
            headers: getGHNHeaders(),
            body: JSON.stringify({
              from_district_id: FROM_DISTRICT_ID,
              to_district_id: to_district_id,
            }),
          }
        )

        const servicesData = await servicesResponse.json()

        if (
          servicesData.code === 200 &&
          servicesData.data &&
          Array.isArray(servicesData.data) &&
          servicesData.data.length > 0
        ) {
          finalServiceId = servicesData.data[0].service_id
          console.log(
            `✅ Using available service: ${finalServiceId} (${servicesData.data[0].short_name})`
          )
        } else {
          finalServiceId = 2
          console.warn('⚠️ No available services found, using default service 2')
        }
      } catch (err) {
        console.error('❌ Error fetching services:', err)
        finalServiceId = 2
        console.warn('⚠️ Error getting services, using default service 2')
      }
    }

    // Step 2: Calculate shipping fee
    console.log(`📡 Step 2: Calculating fee with service ${finalServiceId}...`)

    const feePayload = {
      service_id: finalServiceId,
      from_district_id: FROM_DISTRICT_ID,
      from_ward_code: FROM_WARD_CODE,
      to_district_id: to_district_id,
      to_ward_code: to_ward_code,
      weight: Math.max(Math.ceil(weight), 200),
      length: Math.max(Math.ceil(length), 10),
      width: Math.max(Math.ceil(width), 10),
      height: Math.max(Math.ceil(height), 10),
      insurance_value: Math.max(insurance_value, 0),
      cod_value: Math.max(cod_value, 0),
      coupon: coupon,
    }

    const feeResponse = await fetch(`${GHN_API_URL}/shipping-order/fee`, {
      method: 'POST',
      headers: getGHNHeaders(),
      body: JSON.stringify(feePayload),
    })

    const feeData = await feeResponse.json()

    if (feeData.code === 200 && feeData.data) {
      console.log(`✅ Shipping fee calculated: ${feeData.data.total} VND`)
      return res.json({
        success: true,
        data: {
          total: feeData.data.total,
          service_fee: feeData.data.service_fee,
          insurance_fee: feeData.data.insurance_fee,
          cod_fee: feeData.data.cod_fee,
          pick_station_fee: feeData.data.pick_station_fee,
          pick_remote_areas_fee: feeData.data.pick_remote_areas_fee,
          deliver_remote_areas_fee: feeData.data.deliver_remote_areas_fee,
          coupon_value: feeData.data.coupon_value,
          r2s_fee: feeData.data.r2s_fee,
          return_again: feeData.data.return_again,
          document_return: feeData.data.document_return,
          double_check: feeData.data.double_check,
          cod_failed_fee: feeData.data.cod_failed_fee,
          change_to_address_fee: feeData.data.change_to_address_fee,
          change_return_address_fee: feeData.data.change_return_address_fee,
          return: feeData.data.return,
        },
      })
    } else {
      console.warn('❌ GHN API error:', feeData.message)

      // Fallback: return estimated fee
      const estimatedFee = Math.max(20000, 20000 + Math.max(0, Math.ceil(weight / 1000) - 1) * 5000)

      return res.json({
        success: true,
        data: {
          total: estimatedFee,
          service_fee: estimatedFee,
          insurance_fee: 0,
          cod_fee: 0,
          pick_station_fee: 0,
          pick_remote_areas_fee: 0,
          deliver_remote_areas_fee: 0,
          coupon_value: 0,
          r2s_fee: 0,
          return_again: 0,
          document_return: 0,
          double_check: 0,
          cod_failed_fee: 0,
          change_to_address_fee: 0,
          change_return_address_fee: 0,
          return: 0,
        },
        warning: feeData.message || 'GHN API error, using estimation',
      })
    }
  } catch (error) {
    console.error('❌ Shipping fee calculation error:', error)

    // Fallback: return default estimated fee
    const estimatedFee = 50000
    return res.json({
      success: true,
      data: {
        total: estimatedFee,
        service_fee: estimatedFee,
        insurance_fee: 0,
        cod_fee: 0,
        pick_station_fee: 0,
        pick_remote_areas_fee: 0,
        deliver_remote_areas_fee: 0,
        coupon_value: 0,
        r2s_fee: 0,
        return_again: 0,
        document_return: 0,
        double_check: 0,
        cod_failed_fee: 0,
        change_to_address_fee: 0,
        change_return_address_fee: 0,
        return: 0,
      },
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 GHN API Server running on http://localhost:${PORT}`)
  console.log(`\n📍 API Endpoints:`)
  console.log(`   GET  http://localhost:${PORT}/api/ghn/province`)
  console.log(`   GET  http://localhost:${PORT}/api/ghn/district?province_id=201`)
  console.log(`   GET  http://localhost:${PORT}/api/ghn/ward?district_id=1450`)
  console.log(`   GET  http://localhost:${PORT}/api/ghn/service?from_district=1455&to_district=1542`)
  console.log(`   POST http://localhost:${PORT}/api/ghn/fee`)
  console.log(`\n✅ Status: Ready!`)
})
