/**
 * Test Script: GET /api/shipping-order-fee
 * Kiểm tra lấy chi tiết phí của đơn hàng GHN
 */

const BASE_URL = 'http://localhost:3000'
const API_ENDPOINT = '/api/shipping-order-fee'

console.log('🧪 Testing GET /api/shipping-order-fee\n')
console.log('=' .repeat(60))

// Test Cases
const testCases = [
  {
    name: 'Test 1: Valid order code (LAD8VT)',
    query: { order_code: 'LAD8VT' },
    expectedStatus: 200,
    description: 'Should return fee details for valid order'
  },
  {
    name: 'Test 2: Missing order_code parameter',
    query: {},
    expectedStatus: 400,
    description: 'Should return 400 for missing order_code'
  },
  {
    name: 'Test 3: Empty order_code',
    query: { order_code: '' },
    expectedStatus: 400,
    description: 'Should return 400 for empty order_code'
  },
  {
    name: 'Test 4: Invalid order code (nonexistent)',
    query: { order_code: 'INVALID123' },
    expectedStatus: 404,
    description: 'Should return 404 for nonexistent order'
  },
  {
    name: 'Test 5: Order code with lowercase (should auto-uppercase)',
    query: { order_code: 'lad8vt' },
    expectedStatus: 200,
    description: 'Should handle lowercase order codes'
  }
]

// Run tests
async function runTests() {
  let passed = 0
  let failed = 0

  for (const testCase of testCases) {
    console.log(`\n📝 ${testCase.name}`)
    console.log(`   Description: ${testCase.description}`)
    console.log(`   Query: ${JSON.stringify(testCase.query)}`)

    try {
      // Build URL with query params
      const url = new URL(API_ENDPOINT, BASE_URL)
      Object.keys(testCase.query).forEach(key => {
        url.searchParams.append(key, testCase.query[key])
      })

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      console.log(`   Status: ${response.status} (Expected: ${testCase.expectedStatus})`)

      if (response.status === testCase.expectedStatus) {
        console.log('   ✅ PASS')
        if (data.success) {
          if (data.data.detail) {
            console.log(`   Fee Details:`)
            console.log(`     - Main Service: ${data.data.detail.main_service} VND`)
            console.log(`     - Insurance: ${data.data.detail.insurance} VND`)
            console.log(`     - COD Fee: ${data.data.detail.cod_fee} VND`)
            console.log(`     - Total: ${data.data.detail.total} VND`)
          }
        } else {
          console.log(`   Error: ${data.error}`)
        }
        passed++
      } else {
        console.log(`   ❌ FAIL (Expected ${testCase.expectedStatus}, got ${response.status})`)
        console.log(`   Response: ${JSON.stringify(data)}`)
        failed++
      }
    } catch (err) {
      console.log(`   ❌ ERROR: ${err.message}`)
      failed++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`\n📊 Test Results: ${passed} PASSED, ${failed} FAILED\n`)
}

// Run the tests
runTests().catch(err => {
  console.error('❌ Test runner error:', err)
  process.exit(1)
})
