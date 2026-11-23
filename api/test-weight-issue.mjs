/**
 * Test GHN weight issue
 * Tests various weights and wards to isolate the problem
 */

import dotenv from 'dotenv'
dotenv.config()

const GHN_API_URL = process.env.GHN_API_URL || 'https://online-gateway.ghn.vn/shiip/public-api/v2'
const GHN_TOKEN = process.env.GHN_TOKEN || 'a2bb6329-1eda-4bb3-9282-01a8a011c1c8'
const GHN_SHOP_ID = process.env.GHN_SHOP_ID || '5430969'
const GHN_FROM_DISTRICT_ID = process.env.GHN_FROM_DISTRICT_ID || '1455'
const GHN_FROM_WARD_CODE = process.env.GHN_FROM_WARD_CODE || '21617'

// Test cases
const tests = [
  {
    name: 'Test 1: Small weight (5kg), service_type_id 2',
    to_district_id: 1454,
    to_ward_code: '21616',
    weight: 5000,
    service_type_id: 2,
  },
  {
    name: 'Test 2: 20kg boundary, service_type_id 2',
    to_district_id: 1454,
    to_ward_code: '21616',
    weight: 20000,
    service_type_id: 2,
  },
  {
    name: 'Test 3: 20kg with service_type_id 5',
    to_district_id: 1454,
    to_ward_code: '21616',
    weight: 20000,
    service_type_id: 5,
  },
  {
    name: 'Test 4: 50kg with service_type_id 5',
    to_district_id: 1454,
    to_ward_code: '21616',
    weight: 50000,
    service_type_id: 5,
  },
  {
    name: 'Test 5: 20kg to problematic ward 510109, service_type 5',
    to_district_id: 510,
    to_ward_code: '510109',
    weight: 20000,
    service_type_id: 5,
  },
  {
    name: 'Test 6: 5kg to problematic ward 510109, service_type 2',
    to_district_id: 510,
    to_ward_code: '510109',
    weight: 5000,
    service_type_id: 2,
  },
]

async function runTest(test) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`📦 ${test.name}`)
  console.log('='.repeat(60))

  const payload = {
    from_district_id: parseInt(GHN_FROM_DISTRICT_ID),
    from_ward_code: GHN_FROM_WARD_CODE,
    to_district_id: test.to_district_id,
    to_ward_code: test.to_ward_code,
    weight: test.weight,
    length: 20,
    width: 20,
    height: 20,
    service_type_id: test.service_type_id,
    cod_value: 0,
    insurance_value: 0,
  }

  console.log('📤 Request payload:')
  console.log(JSON.stringify(payload, null, 2))

  try {
    const response = await fetch(`${GHN_API_URL}/shipping-order/fee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': GHN_TOKEN,
        'ShopId': GHN_SHOP_ID
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (data.code === 200) {
      console.log(`✅ SUCCESS - Total fee: ${data.data.total} VNĐ`)
      console.log(`   Service fee: ${data.data.service_fee} VNĐ`)
      console.log(`   Remote areas fee: ${data.data.deliver_remote_areas_fee} VNĐ`)
    } else {
      console.error(`❌ FAILED - Code: ${data.code}`)
      console.error(`   Message: ${data.message}`)
      console.error(`   Full response:`)
      console.error(JSON.stringify(data, null, 2))
    }
  } catch (err) {
    console.error(`❌ ERROR:`, err.message)
  }
}

async function main() {
  console.log('🔧 GHN Weight Issue Diagnostic')
  console.log(`\nUsing:`)
  console.log(`  - API URL: ${GHN_API_URL}`)
  console.log(`  - Shop ID: ${GHN_SHOP_ID}`)
  console.log(`  - From: District ${GHN_FROM_DISTRICT_ID}, Ward ${GHN_FROM_WARD_CODE}`)
  console.log(`  - Token: ${GHN_TOKEN.substring(0, 8)}...`)

  for (const test of tests) {
    await runTest(test)
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log(`\n${'='.repeat(60)}`)
  console.log('✅ Diagnostic complete')
}

main().catch(console.error)
