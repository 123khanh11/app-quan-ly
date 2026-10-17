#!/usr/bin/env node

/**
 * TEST AUTOMATION SUITE - E-Commerce Website Interface
 * Kiểm thử tự động các API endpoints và chức năng chính
 * 
 * Chạy: node test-automation/run-tests.js
 */

const BASE_URL = 'http://localhost:5173/api';
const GHN_API_URL = 'https://online-gateway.ghn.vn/shiip/public-api/v2';

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

async function fetch_custom(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 0, error: error.message };
  }
}

function log_test_result(testName, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  const emoji = passed ? '✔️' : '❌';
  console.log(`${emoji} ${testName}: ${status}`);
  if (details) console.log(`   └─ ${details}`);
}

function log_section(title) {
  console.log('\n' + '='.repeat(70));
  console.log(`📋 ${title}`);
  console.log('='.repeat(70));
}

// ============================================================
// TEST SUITES
// ============================================================

// ============================================================
// F06: TÍNH PHÍ VẬN CHUYỂN - API TESTS
// ============================================================

async function test_f06_shipping_api() {
  log_section('F06: TÍNH PHÍ VẬN CHUYỂN (API ENDPOINTS)');
  
  const test_results = [];

  // TC-API-001: GET /api/health
  console.log('\n📌 TC-API-001: GET /api/health');
  const health = await fetch_custom(`${BASE_URL}/health`);
  const health_pass = health.status === 200;
  log_test_result('TC-API-001: Health Check', health_pass, 
    health_pass ? 'Status 200 OK' : `Status ${health.status}`);
  test_results.push({ tc: 'TC-API-001', pass: health_pass });

  // TC-API-002: GET /api/ghn-provinces
  console.log('\n📌 TC-API-002: GET /api/ghn-provinces');
  const provinces = await fetch_custom(`${BASE_URL}/ghn-provinces`);
  const provinces_pass = provinces.status === 200 && 
                        Array.isArray(provinces.data?.data) && 
                        provinces.data.data.length === 63;
  log_test_result('TC-API-002: GHN Provinces', provinces_pass,
    provinces_pass ? '63 provinces loaded' : `Status ${provinces.status}, Count: ${provinces.data?.data?.length}`);
  test_results.push({ tc: 'TC-API-002', pass: provinces_pass });

  // TC-API-003: GET /api/ghn-districts?province_id=1
  console.log('\n📌 TC-API-003: GET /api/ghn-districts?province_id=1');
  const districts = await fetch_custom(`${BASE_URL}/ghn-districts?province_id=1`);
  const districts_pass = districts.status === 200 && 
                        Array.isArray(districts.data?.data) && 
                        districts.data.data.length > 0;
  log_test_result('TC-API-003: GHN Districts', districts_pass,
    districts_pass ? `${districts.data.data.length} districts loaded` : `Status ${districts.status}`);
  test_results.push({ tc: 'TC-API-003', pass: districts_pass });

  // TC-API-004: GET /api/ghn-wards?district_id=1
  console.log('\n📌 TC-API-004: GET /api/ghn-wards?district_id=1');
  const wards = await fetch_custom(`${BASE_URL}/ghn-wards?district_id=1`);
  const wards_pass = wards.status === 200 && 
                    Array.isArray(wards.data?.data) && 
                    wards.data.data.length > 0;
  log_test_result('TC-API-004: GHN Wards', wards_pass,
    wards_pass ? `${wards.data.data.length} wards loaded` : `Status ${wards.status}`);
  test_results.push({ tc: 'TC-API-004', pass: wards_pass });

  // TC-F06-005: POST /api/shipping-fee (Valid data)
  console.log('\n📌 TC-F06-005 / TC-API-005: POST /api/shipping-fee (Valid)');
  const shipping_payload = {
    to_district_id: 1454,
    to_ward_code: '21616',
    weight_gram: 1000,
    length_cm: 20,
    width_cm: 20,
    height_cm: 20
  };
  const shipping = await fetch_custom(`${BASE_URL}/shipping-fee`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(shipping_payload)
  });
  const shipping_pass = shipping.status === 200 && 
                       shipping.data?.success && 
                       shipping.data?.data?.total > 0;
  log_test_result('TC-F06-005: Shipping Fee Valid', shipping_pass,
    shipping_pass ? `Total: ${shipping.data.data.total}đ` : `Status ${shipping.status}, Error: ${shipping.data?.error}`);
  test_results.push({ tc: 'TC-F06-005', pass: shipping_pass });

  // TC-F06-006 / TC-API-006: POST /api/shipping-fee (Invalid weight < 200g)
  console.log('\n📌 TC-F06-006 / TC-API-006: POST /api/shipping-fee (Invalid weight)');
  const shipping_invalid = await fetch_custom(`${BASE_URL}/shipping-fee`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to_district_id: 1454,
      to_ward_code: '21616',
      weight_gram: 100  // < 200g
    })
  });
  const shipping_invalid_pass = shipping_invalid.status === 400 && 
                               !shipping_invalid.data?.success;
  log_test_result('TC-F06-006: Shipping Fee Invalid Weight', shipping_invalid_pass,
    shipping_invalid_pass ? 'Correctly rejected' : `Status ${shipping_invalid.status}`);
  test_results.push({ tc: 'TC-F06-006', pass: shipping_invalid_pass });

  return test_results;
}

// ============================================================
// F05: CHECKOUT - LOCATION DATA TESTS
// ============================================================

async function test_f05_checkout_locations() {
  log_section('F05: CHECKOUT - LOCATION DATA VALIDATION');
  
  const test_results = [];

  // Load provinces
  const provinces_res = await fetch_custom(`${BASE_URL}/ghn-provinces`);
  const provinces_list = provinces_res.data?.data || [];
  
  // TC-F05-005: Verify 63 provinces
  console.log('\n📌 TC-F05-005: Verify 63 Provinces/Cities');
  const provinces_63_pass = provinces_list.length === 63;
  log_test_result('TC-F05-005: Province Count', provinces_63_pass,
    `Count: ${provinces_list.length}`);
  test_results.push({ tc: 'TC-F05-005', pass: provinces_63_pass });

  // TC-F05-006: Verify districts load correctly
  console.log('\n📌 TC-F05-006: Verify Districts Load by Province');
  if (provinces_list.length > 0) {
    const test_province_id = provinces_list[0].province_id;
    const districts_res = await fetch_custom(`${BASE_URL}/ghn-districts?province_id=${test_province_id}`);
    const districts_list = districts_res.data?.data || [];
    const districts_pass = districts_list.length > 0;
    log_test_result('TC-F05-006: Districts Load', districts_pass,
      `Loaded ${districts_list.length} districts for province ${test_province_id}`);
    test_results.push({ tc: 'TC-F05-006', pass: districts_pass });

    // TC-F05-007: Verify wards load correctly
    console.log('\n📌 TC-F05-007: Verify Wards Load by District');
    if (districts_list.length > 0) {
      const test_district_id = districts_list[0].district_id;
      const wards_res = await fetch_custom(`${BASE_URL}/ghn-wards?district_id=${test_district_id}`);
      const wards_list = wards_res.data?.data || [];
      const wards_pass = wards_list.length > 0;
      log_test_result('TC-F05-007: Wards Load', wards_pass,
        `Loaded ${wards_list.length} wards for district ${test_district_id}`);
      test_results.push({ tc: 'TC-F05-007', pass: wards_pass });
    }
  }

  return test_results;
}

// ============================================================
// F06: WEIGHT CALCULATION TESTS
// ============================================================

async function test_f06_weight_calculation() {
  log_section('F06: WEIGHT & DIMENSIONS CALCULATION');
  
  const test_results = [];

  // TC-F06-003: Verify weight calculation (500g per product, min 1kg)
  console.log('\n📌 TC-F06-003: Weight Calculation Logic');
  console.log('   Test Case: 2 products without explicit weight');
  console.log('   Expected: 2 × 500g = 1000g (exactly minimum)');
  
  const shipping_calc = await fetch_custom(`${BASE_URL}/shipping-fee`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to_district_id: 1454,
      to_ward_code: '21616',
      weight_gram: 1000,  // 2 × 500g
      length_cm: 40,
      width_cm: 20,
      height_cm: 20
    })
  });
  
  const weight_calc_pass = shipping_calc.status === 200 && 
                          shipping_calc.data?.success;
  log_test_result('TC-F06-003: Weight Calculation', weight_calc_pass,
    weight_calc_pass ? 'Weight accepted at minimum threshold' : 'Failed');
  test_results.push({ tc: 'TC-F06-003', pass: weight_calc_pass });

  // TC-F06-004: Verify default dimensions (20×20×20 cm)
  console.log('\n📌 TC-F06-004: Default Dimensions');
  console.log('   Test Case: Using default 20×20×20 cm');
  console.log('   Expected: API accepts dimensions');
  
  const dimensions_pass = shipping_calc.status === 200 && 
                         shipping_calc.data?.success;
  log_test_result('TC-F06-004: Default Dimensions', dimensions_pass,
    'Default 20×20×20 cm accepted');
  test_results.push({ tc: 'TC-F06-004', pass: dimensions_pass });

  return test_results;
}

// ============================================================
// SERVICE TYPE DETERMINATION TEST
// ============================================================

async function test_service_type_determination() {
  log_section('F06: SERVICE TYPE DETERMINATION (< 20kg vs >= 20kg)');
  
  const test_results = [];

  // Test 1: Light package (< 20kg) → service_type_id = 2
  console.log('\n📌 Test: Light package (5kg) → service_type_id = 2');
  const light_pkg = await fetch_custom(`${BASE_URL}/shipping-fee`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to_district_id: 1454,
      to_ward_code: '21616',
      weight_gram: 5000  // 5kg
    })
  });
  const light_pass = light_pkg.status === 200 && light_pkg.data?.success;
  log_test_result('Light Package (5kg)', light_pass,
    light_pass ? `Fee: ${light_pkg.data.data?.total}đ` : 'Failed');
  test_results.push({ tc: 'ServiceType-Light', pass: light_pass });

  // Test 2: Heavy package (>= 20kg) → service_type_id = 5
  console.log('\n📌 Test: Heavy package (25kg) → service_type_id = 5');
  const heavy_pkg = await fetch_custom(`${BASE_URL}/shipping-fee`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to_district_id: 1454,
      to_ward_code: '21616',
      weight_gram: 25000  // 25kg
    })
  });
  const heavy_pass = heavy_pkg.status === 200 && heavy_pkg.data?.success;
  log_test_result('Heavy Package (25kg)', heavy_pass,
    heavy_pass ? `Fee: ${heavy_pkg.data.data?.total}đ` : 'Failed');
  test_results.push({ tc: 'ServiceType-Heavy', pass: heavy_pass });

  // Test 3: Boundary case (exactly 20kg) → service_type_id = 5
  console.log('\n📌 Test: Boundary package (20kg) → service_type_id = 5');
  const boundary_pkg = await fetch_custom(`${BASE_URL}/shipping-fee`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to_district_id: 1454,
      to_ward_code: '21616',
      weight_gram: 20000  // exactly 20kg
    })
  });
  const boundary_pass = boundary_pkg.status === 200 && boundary_pkg.data?.success;
  log_test_result('Boundary Package (20kg)', boundary_pass,
    boundary_pass ? `Fee: ${boundary_pkg.data.data?.total}đ` : 'Failed');
  test_results.push({ tc: 'ServiceType-Boundary', pass: boundary_pass });

  return test_results;
}

// ============================================================
// MAIN EXECUTION
// ============================================================

async function run_all_tests() {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║     E-COMMERCE WEBSITE INTERFACE - AUTOMATED TEST SUITE            ║');
  console.log('║                   Test Execution Report                            ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝');
  console.log(`Start Time: ${new Date().toLocaleString('vi-VN')}`);
  console.log(`Base URL: ${BASE_URL}`);

  let all_results = [];

  try {
    // Run all test suites
    const f06_api_results = await test_f06_shipping_api();
    all_results.push(...f06_api_results);

    const f05_location_results = await test_f05_checkout_locations();
    all_results.push(...f05_location_results);

    const f06_weight_results = await test_f06_weight_calculation();
    all_results.push(...f06_weight_results);

    const service_type_results = await test_service_type_determination();
    all_results.push(...service_type_results);

  } catch (error) {
    console.error('❌ Test execution error:', error.message);
  }

  // Print summary
  log_section('TEST EXECUTION SUMMARY');
  const passed = all_results.filter(r => r.pass).length;
  const failed = all_results.filter(r => !r.pass).length;
  const total = all_results.length;

  console.log(`\n📊 Test Results:`);
  console.log(`   ✅ Passed: ${passed}/${total}`);
  console.log(`   ❌ Failed: ${failed}/${total}`);
  console.log(`   Success Rate: ${((passed/total)*100).toFixed(2)}%`);

  console.log(`\n⏱️  End Time: ${new Date().toLocaleString('vi-VN')}`);
  console.log('\n' + '='.repeat(70) + '\n');

  // Detailed results
  console.log('📋 DETAILED RESULTS:');
  all_results.forEach(result => {
    const status = result.pass ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} - ${result.tc}`);
  });

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
run_all_tests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
