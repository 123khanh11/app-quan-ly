/**
 * EXAMPLE: Sử dụng Shipping Calculator
 * 
 * Ví dụ cách dùng các function trong shipping-calculator.ts
 */

import {
  CartItem,
  calculateTotalWeight,
  calculateDimensions,
  estimateShippingFee,
  calculateShipping,
  formatShippingFee,
  getDistanceCategory,
  calculateOrderSummary,
  validateCartItems,
} from './shipping-calculator'

/**
 * ============================================
 * EXAMPLE 1: Tính cân nặng từ giỏ hàng
 * ============================================
 */
export async function example1_CalculateWeight() {
  // Giỏ hàng với 3 sản phẩm
  const cartItems: CartItem[] = [
    {
      product_id: 'prod_1',
      name: 'T-shirt',
      price: 150000,
      quantity: 2,
      weight: 300, // 300g mỗi cái
    },
    {
      product_id: 'prod_2',
      name: 'Quần',
      price: 250000,
      quantity: 1,
      weight: 500, // 500g
    },
    {
      product_id: 'prod_3',
      name: 'Giày',
      price: 800000,
      quantity: 1,
      weight: 800, // 800g
    },
  ]

  const totalWeight = calculateTotalWeight(cartItems)
  console.log('📦 Tổng cân nặng:', totalWeight, 'gram')
  // Output: 2400 gram (2.4 kg)

  return totalWeight
}

/**
 * ============================================
 * EXAMPLE 2: Tính kích thước bưu kiện
 * ============================================
 */
export async function example2_CalculateDimensions() {
  const cartItems: CartItem[] = [
    {
      product_id: 'prod_1',
      name: 'Hộp giftbox',
      price: 200000,
      quantity: 1,
      length: 30, // 30cm
      width: 20, // 20cm
      height: 15, // 15cm
    },
    {
      product_id: 'prod_2',
      name: 'Sách',
      price: 100000,
      quantity: 2,
      length: 25, // 25cm
      width: 18, // 18cm
      height: 10, // 10cm mỗi cuốn
    },
  ]

  const dimensions = calculateDimensions(cartItems)
  console.log('📐 Kích thước bưu kiện:', dimensions)
  // Output: { length: 30, width: 20, height: 35 }
  // - Chiều dài: max(30, 25) = 30cm
  // - Chiều rộng: max(20, 18) = 20cm
  // - Chiều cao: 15 + 10*2 = 35cm

  return dimensions
}

/**
 * ============================================
 * EXAMPLE 3: Ước tính phí (không gọi API)
 * ============================================
 */
export function example3_EstimateShipping() {
  // Ước tính nhanh cho 3 tình huống

  console.log('=== ƯỚC TÍNH PHÍ VẬN CHUYỂN ===\n')

  // 1. Cùng quận (local)
  const localFee = estimateShippingFee(1500, 'local')
  console.log(`1. Cùng quận, 1.5kg: ${formatShippingFee(localFee)}`)
  // = 20,000 + (0.5 * 5,000) = 22,500 VNĐ

  // 2. Khác tỉnh (province)
  const provinceFee = estimateShippingFee(2500, 'province')
  console.log(`2. Khác tỉnh, 2.5kg: ${formatShippingFee(provinceFee)}`)
  // = 35,000 + (1.5 * 5,000) = 42,500 VNĐ

  // 3. Vùng sâu xa (remote)
  const remoteFee = estimateShippingFee(3000, 'remote')
  console.log(`3. Vùng xa, 3kg: ${formatShippingFee(remoteFee)}`)
  // = 50,000 + (2 * 5,000) = 60,000 VNĐ

  return { localFee, provinceFee, remoteFee }
}

/**
 * ============================================
 * EXAMPLE 4: Tính phí thực tế từ GHN API
 * ============================================
 */
export async function example4_CalculateActualShipping() {
  // Giỏ hàng
  const cartItems: CartItem[] = [
    {
      product_id: 'prod_1',
      name: 'Áo phông',
      price: 120000,
      quantity: 1,
      weight: 250,
      length: 30,
      width: 25,
      height: 15,
    },
    {
      product_id: 'prod_2',
      name: 'Quần shorts',
      price: 180000,
      quantity: 2,
      weight: 150,
      length: 35,
      width: 28,
      height: 10,
    },
  ]

  // Địa chỉ giao hàng
  const toDistrictId = 1 // Quận 1, TP.HCM
  const toWardCode = '1A' // Phường nào đó

  // Gọi hàm tính phí
  const result = await calculateShipping(cartItems, toDistrictId, toWardCode, 2)

  console.log('🚚 KẾT QUẢ TÍNH PHÍ:')
  console.log('Success:', result.success)
  console.log('Phí vận chuyển:', formatShippingFee(result.total))
  console.log('Chi tiết:', result.details)
  console.log('Error (nếu có):', result.error)

  return result
}

/**
 * ============================================
 * EXAMPLE 5: Phân loại khoảng cách
 * ============================================
 */
export function example5_GetDistanceCategory() {
  // Hà Đông (1455) gửi đến các địa điểm
  const fromDistrictId = 1455 // Hà Đông, Hà Nội

  console.log('=== PHÂN LOẠI KHOẢNG CÁCH ===\n')

  // Cùng quận
  let distance = getDistanceCategory(fromDistrictId, 1455)
  console.log(`Hà Đông → Hà Đông: ${distance}`) // 'local'

  // Khác quận, cùng tỉnh
  distance = getDistanceCategory(fromDistrictId, 1) // Hoàn Kiếm
  console.log(`Hà Đông → Hoàn Kiếm: ${distance}`) // 'province'

  // Khác tỉnh
  distance = getDistanceCategory(fromDistrictId, 1) // TP.HCM Quận 1
  console.log(`Hà Đông → TP.HCM: ${distance}`) // 'remote'

  return distance
}

/**
 * ============================================
 * EXAMPLE 6: Tính tổng đơn hàng
 * ============================================
 */
export function example6_OrderSummary() {
  const cartItems: CartItem[] = [
    {
      product_id: 'prod_1',
      name: 'Sản phẩm A',
      price: 500000,
      quantity: 1,
    },
    {
      product_id: 'prod_2',
      name: 'Sản phẩm B',
      price: 300000,
      quantity: 2,
    },
  ]

  const shippingFee = 45000

  const summary = calculateOrderSummary(cartItems, shippingFee)

  console.log('💰 TỔNG ĐƠN HÀNG:')
  console.log('Tiền hàng:', formatShippingFee(summary.subtotal))
  console.log('Phí ship:', formatShippingFee(summary.shipping))
  console.log('Tổng cộng:', formatShippingFee(summary.total))
  // Output:
  // Tiền hàng: 1,100,000 VNĐ
  // Phí ship: 45,000 VNĐ
  // Tổng cộng: 1,145,000 VNĐ

  return summary
}

/**
 * ============================================
 * EXAMPLE 7: Kiểm tra dữ liệu giỏ hàng
 * ============================================
 */
export function example7_ValidateCart() {
  // Giỏ hàng có vấn đề
  const invalidCart: CartItem[] = [
    {
      product_id: 'prod_1',
      name: 'Sản phẩm A',
      price: 100000,
      quantity: 1,
    },
    {
      product_id: 'prod_2',
      name: '', // Thiếu tên
      price: -50000, // Giá âm
      quantity: 0, // Số lượng 0
    },
  ]

  const validation = validateCartItems(invalidCart)

  console.log('✓ Cart hợp lệ:', validation.valid)
  console.log('❌ Lỗi:')
  validation.errors.forEach((error) => console.log('  -', error))
  // Output:
  // ✓ Cart hợp lệ: false
  // ❌ Lỗi:
  //   - Sản phẩm 2: Thiếu tên sản phẩm
  //   - Sản phẩm 2: Giá không hợp lệ
  //   - Sản phẩm 2: Số lượng không hợp lệ

  return validation
}

/**
 * ============================================
 * EXAMPLE 8: FLOW CHECKOUT HOÀN CHỈNH
 * ============================================
 */
export async function example8_CompleteCheckoutFlow() {
  console.log('🛒 FLOW CHECKOUT HOÀN CHỈNH\n')

  // Bước 1: Lấy giỏ hàng từ context/state
  const cartItems: CartItem[] = [
    {
      product_id: 'prod_123',
      name: 'Áo polo',
      price: 250000,
      quantity: 1,
      weight: 300,
      length: 30,
      width: 25,
      height: 15,
    },
    {
      product_id: 'prod_456',
      name: 'Quần Jeans',
      price: 450000,
      quantity: 1,
      weight: 600,
      length: 40,
      width: 30,
      height: 20,
    },
  ]

  console.log('1️⃣ Giỏ hàng:', cartItems.length, 'sản phẩm')

  // Bước 2: Kiểm tra dữ liệu
  const validation = validateCartItems(cartItems)
  if (!validation.valid) {
    console.log('❌ Lỗi:', validation.errors)
    return
  }
  console.log('2️⃣ Kiểm tra dữ liệu: ✓ Thành công')

  // Bước 3: Tính cân nặng & kích thước
  const weight = calculateTotalWeight(cartItems)
  const dimensions = calculateDimensions(cartItems)
  console.log(`3️⃣ Cân nặng: ${weight}g, Kích thước: ${dimensions.length}x${dimensions.width}x${dimensions.height}cm`)

  // Bước 4: Khách chọn địa chỉ giao hàng
  const toDistrictId = 206 // Thủ Đức, TP.HCM
  const toWardCode = '21617'
  console.log(`4️⃣ Địa chỉ giao: Quận ${toDistrictId}, Phường ${toWardCode}`)

  // Bước 5: Tính phí vận chuyển
  const shippingResult = await calculateShipping(cartItems, toDistrictId, toWardCode, 2)
  if (!shippingResult.success) {
    console.log('⚠️ Cảnh báo:', shippingResult.error)
  }
  console.log(`5️⃣ Phí vận chuyển: ${formatShippingFee(shippingResult.total)}`)

  // Bước 6: Tính tổng đơn hàng
  const summary = calculateOrderSummary(cartItems, shippingResult.total)
  console.log(`6️⃣ Tổng đơn:`)
  console.log(`   - Tiền hàng: ${formatShippingFee(summary.subtotal)}`)
  console.log(`   - Phí ship: ${formatShippingFee(summary.shipping)}`)
  console.log(`   - Tổng cộng: ${formatShippingFee(summary.total)}`)

  // Bước 7: Tiến hành thanh toán
  console.log(`\n7️⃣ Sẵn sàng thanh toán ✓`)

  return {
    items: cartItems,
    shipping: shippingResult,
    summary,
  }
}

/**
 * ============================================
 * RUN ALL EXAMPLES
 * ============================================
 */
export async function runAllExamples() {
  console.log('========================================')
  console.log('   SHIPPING CALCULATOR - EXAMPLES')
  console.log('========================================\n')

  console.log('\n--- EXAMPLE 1: Tính cân nặng ---')
  await example1_CalculateWeight()

  console.log('\n--- EXAMPLE 2: Tính kích thước ---')
  await example2_CalculateDimensions()

  console.log('\n--- EXAMPLE 3: Ước tính phí ---')
  example3_EstimateShipping()

  console.log('\n--- EXAMPLE 4: Tính phí thực tế ---')
  // await example4_CalculateActualShipping() // Require API call

  console.log('\n--- EXAMPLE 5: Phân loại khoảng cách ---')
  example5_GetDistanceCategory()

  console.log('\n--- EXAMPLE 6: Tính tổng đơn ---')
  example6_OrderSummary()

  console.log('\n--- EXAMPLE 7: Kiểm tra dữ liệu ---')
  example7_ValidateCart()

  console.log('\n--- EXAMPLE 8: Flow checkout hoàn chỉnh ---')
  // await example8_CompleteCheckoutFlow() // Require API call

  console.log('\n========================================')
  console.log('   EXAMPLES COMPLETED')
  console.log('========================================')
}
