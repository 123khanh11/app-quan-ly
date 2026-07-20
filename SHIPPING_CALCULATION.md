# 📦 Shipping Fee Calculation Documentation

## Tổng Quan

Module `shipping-calculator.ts` cung cấp các hàm để tính phí vận chuyển dựa trên:
- **Cân nặng sản phẩm** (gram)
- **Kích thước bưu kiện** (cm)
- **Khoảng cách giao hàng** (từ shop → khách)
- **Loại dịch vụ GHN** (mặc định: Light goods)

---

## 🔧 Các Hàm Chính

### 1. `calculateTotalWeight(items: CartItem[]): number`
**Tính tổng cân nặng từ giỏ hàng**

```typescript
const cartItems = [
  { product_id: '1', name: 'T-shirt', price: 100000, quantity: 2, weight: 300 }, // 300g
  { product_id: '2', name: 'Quần', price: 200000, quantity: 1, weight: 500 }, // 500g
]

const totalWeight = calculateTotalWeight(cartItems)
// Output: 1100g (1.1kg) = 300*2 + 500*1
```

**Công thức:**
```
totalWeight = SUM(item.weight || 500) * item.quantity

Tối thiểu: 1kg (1000g)
```

**Tham số:**
| Param | Type | Default | Mô tả |
|-------|------|---------|-------|
| items | CartItem[] | - | Danh sách sản phẩm trong giỏ |

**Trả về:** Tổng cân nặng (gram)

---

### 2. `calculateDimensions(items: CartItem[])`
**Tính kích thước bưu kiện từ giỏ hàng**

```typescript
const cartItems = [
  { 
    product_id: '1',
    name: 'Hộp',
    price: 100000,
    quantity: 2,
    length: 30,  // 30cm
    width: 20,   // 20cm
    height: 10,  // 10cm mỗi cái
  }
]

const dimensions = calculateDimensions(cartItems)
// Output: { length: 30, width: 20, height: 20 }
```

**Công thức:**
```
length = MAX(item.length || 20) cho tất cả items
width = MAX(item.width || 20) cho tất cả items
height = SUM((item.height || 20) * item.quantity)

Tối thiểu: 20x20x20cm
```

**Trả về:** `{ length, width, height }` (cm)

---

### 3. `estimateShippingFee(weight: number, distance?: 'local' | 'province' | 'remote'): number`
**Ước tính phí vận chuyển (không gọi API)**

```typescript
// Cùng quận, 1.5kg
const localFee = estimateShippingFee(1500, 'local')
// Output: 22,500 VNĐ

// Khác tỉnh, 2.5kg
const provinceFee = estimateShippingFee(2500, 'province')
// Output: 42,500 VNĐ

// Vùng xa, 3kg
const remoteFee = estimateShippingFee(3000, 'remote')
// Output: 60,000 VNĐ
```

**Công thức:**
```
baseFee = {
  'local': 20,000 VNĐ     // Cùng quận
  'province': 35,000 VNĐ  // Khác tỉnh
  'remote': 50,000 VNĐ    // Vùng xa
}

weightSurcharge = MAX(0, (weightKg - 1) * 5,000)

total = baseFee + weightSurcharge
```

**Ví dụ:**
- **Local (cùng quận)**: 20,000 + (1.5 - 1) * 5,000 = 22,500 VNĐ
- **Province (khác tỉnh)**: 35,000 + (2.5 - 1) * 5,000 = 42,500 VNĐ
- **Remote (vùng xa)**: 50,000 + (3 - 1) * 5,000 = 60,000 VNĐ

**Tham số:**
| Param | Type | Default | Mô tả |
|-------|------|---------|-------|
| weight | number | - | Cân nặng (gram) |
| distance | string | 'province' | 'local' \| 'province' \| 'remote' |

**Trả về:** Phí ước tính (VNĐ)

---

### 4. `calculateShipping(items, toDistrictId, toWardCode, serviceId?): Promise<ShippingResult>`
**Tính phí vận chuyển thực tế từ GHN API**

```typescript
const cartItems = [
  {
    product_id: 'prod_1',
    name: 'Áo phông',
    price: 250000,
    quantity: 1,
    weight: 300,
    length: 30,
    width: 25,
    height: 15,
  }
]

const result = await calculateShipping(
  cartItems,
  206, // Thủ Đức, TP.HCM
  '21617', // Ward code
  2 // Service: Light goods
)

// Output:
// {
//   success: true,
//   total: 45000,
//   details: {
//     service_fee: 40000,
//     insurance_fee: 0,
//     pick_remote_areas_fee: 5000,
//     ...
//   }
// }
```

**Tham số:**
| Param | Type | Default | Mô tả |
|-------|------|---------|-------|
| items | CartItem[] | - | Danh sách sản phẩm |
| toDistrictId | number | - | ID quận/huyện đích |
| toWardCode | string | - | Mã xã/phường đích |
| serviceId | number | 2 | Loại dịch vụ GHN |

**Trả về:** `ShippingResult`
```typescript
interface ShippingResult {
  success: boolean
  total: number // Phí vận chuyển (VNĐ)
  details?: {
    service_fee: number
    insurance_fee: number
    pick_station_fee: number
    pick_remote_areas_fee: number
    deliver_remote_areas_fee: number
    cod_fee: number
  }
  error?: string
}
```

---

### 5. `getDistanceCategory(fromDistrictId, toDistrictId): 'local' | 'province' | 'remote'`
**Phân loại khoảng cách giữa hai quận**

```typescript
// Hà Đông (1455) gửi đến:

// Cùng quận
getDistanceCategory(1455, 1455) // 'local'

// Khác quận, cùng Hà Nội
getDistanceCategory(1455, 1) // Hoàn Kiếm - 'province'

// Khác tỉnh
getDistanceCategory(1455, 206) // TP.HCM Thủ Đức - 'remote'
```

---

### 6. `calculateOrderSummary(items, shippingFee)`
**Tính tổng đơn hàng: tiền hàng + phí ship**

```typescript
const cartItems = [
  { product_id: '1', name: 'Sản phẩm A', price: 500000, quantity: 1 },
  { product_id: '2', name: 'Sản phẩm B', price: 300000, quantity: 2 },
]

const summary = calculateOrderSummary(cartItems, 45000)
// Output: {
//   subtotal: 1,100,000,  // 500,000 + 300,000*2
//   shipping: 45,000,
//   total: 1,145,000
// }
```

---

### 7. `validateCartItems(items): { valid, errors }`
**Kiểm tra dữ liệu giỏ hàng trước khi checkout**

```typescript
const invalidCart = [
  { product_id: '', name: 'Sản phẩm', price: 100000, quantity: 1 }, // Thiếu ID
  { product_id: '2', name: '', price: -50000, quantity: 0 }, // Thiếu tên, giá âm, qty 0
]

const validation = validateCartItems(invalidCart)
// Output: {
//   valid: false,
//   errors: [
//     'Sản phẩm 1: Thiếu product_id',
//     'Sản phẩm 2: Thiếu tên sản phẩm',
//     'Sản phẩm 2: Giá không hợp lệ',
//     'Sản phẩm 2: Số lượng không hợp lệ',
//   ]
// }
```

---

## 📋 CartItem Interface

```typescript
interface CartItem {
  product_id: string      // ID sản phẩm (bắt buộc)
  name: string            // Tên sản phẩm (bắt buộc)
  price: number           // Giá (VNĐ) (bắt buộc)
  quantity: number        // Số lượng (bắt buộc)
  weight?: number         // Cân nặng (gram), mặc định: 500g
  length?: number         // Chiều dài (cm), mặc định: 20cm
  width?: number          // Chiều rộng (cm), mặc định: 20cm
  height?: number         // Chiều cao (cm), mặc định: 20cm
}
```

---

## 🔄 Flow Checkout Hoàn Chỉnh

```
1. Khách thêm sản phẩm vào giỏ
   ↓
2. Hiển thị danh sách quận/phường
   ↓
3. Khách chọn địa chỉ giao hàng
   ↓
4. Gọi calculateShipping() → Tính phí từ GHN API
   ↓
5. Hiển thị tổng đơn (tiền hàng + phí ship)
   ↓
6. Khách xác nhận đặt hàng
   ↓
7. Lưu order vào database
```

### Mã ví dụ:
```typescript
// Trong CheckoutForm.tsx

// Khi khách chọn địa chỉ giao hàng
useEffect(() => {
  const loadShippingFee = async () => {
    if (!formData.districtId || !formData.wardCode) return
    
    const result = await calculateShipping(
      cartItems,
      formData.districtId,
      formData.wardCode,
      2 // Service ID
    )
    
    if (result.success) {
      setShippingFee(result.total)
    }
  }
  
  loadShippingFee()
}, [formData.districtId, formData.wardCode, cartItems])

// Hiển thị tổng
const summary = calculateOrderSummary(cartItems, shippingFee)
```

---

## 🎯 GHN Service Types

| Service ID | Tên | Mô Tả |
|-----------|-----|-------|
| 0 | Chuyển phát nhanh | Express - Nhanh nhất (1-2 ngày) |
| 1 | Chuyển phát chuẩn | Standard - Tiêu chuẩn (2-3 ngày) |
| 2 | Chuyển phát nhanh hôm nay | Same day - Giao cùng ngày |

---

## 📊 Ví Dụ Tính Toán Chi Tiết

### Scenario: Đặt hàng từ Hà Nội đến TP.HCM

**Giỏ hàng:**
```
- 2x Áo phông (300g, 30x25x15cm mỗi cái) = 200,000 VNĐ
- 1x Quần (600g, 40x30x20cm) = 250,000 VNĐ
```

**Tính toán:**
```
1. Cân nặng: 300*2 + 600 = 1,200g ✓

2. Kích thước: 40x30x35cm
   (length: max(30,40)=40, width: max(25,30)=30, height: 15*2+20=50→35 capped)

3. Gọi GHN API:
   - Từ: Hà Đông, Hà Nội (1455 - 21617)
   - Đến: TP.HCM Thủ Đức (206 - ...)
   - Cân nặng: 1,200g
   - Kích thước: 40x30x35cm
   - Service: 2 (Light goods)
   
4. GHN trả về:
   - service_fee: 40,000
   - pick_remote_areas_fee: 5,000
   - deliver_remote_areas_fee: 0
   - Total: 45,000 VNĐ

5. Tổng đơn:
   - Tiền hàng: 450,000 VNĐ
   - Phí ship: 45,000 VNĐ
   - TỔNG: 495,000 VNĐ
```

---

## ⚠️ Lưu Ý Quan Trọng

1. **Cân nặng mặc định 500g**: Nếu sản phẩm không có `weight`, dùng 500g
2. **Kích thước mặc định 20cm**: Nếu sản phẩm không có dimensions, dùng 20cm
3. **Tối thiểu 1kg**: Cho dù tính ra bao nhiêu, luôn >= 1kg
4. **Shop location cố định**: Hà Đông (1455) - Hà Nội
5. **Fallback value**: Nếu GHN API lỗi, dùng 50,000 VNĐ

---

## 📁 Files Liên Quan

| File | Mô tả |
|------|--------|
| `src/services/shipping-calculator.ts` | Main module |
| `src/services/shipping-calculator.example.ts` | 8 ví dụ sử dụng |
| `src/services/ghn-api.ts` | API client gọi GHN |
| `src/app/components/checkout/CheckoutForm.tsx` | Sử dụng trong checkout form |

---

## 🚀 Hướng Dẫn Mở Rộng

### Thêm sản phẩm có cân nặng thực tế:
```typescript
const cartItems = [
  {
    product_id: 'tshirt_001',
    name: 'T-shirt Premium',
    price: 350000,
    quantity: 1,
    weight: 250, // 250g thực tế
    length: 35,
    width: 28,
    height: 12,
  }
]
```

### Custom service type:
```typescript
// Dùng service_id = 0 (Express) thay vì 2
await calculateShipping(cartItems, districtId, wardCode, 0)
```

### Thay đổi shop location:
```typescript
// Edit SHOP_INFO trong shipping-calculator.ts
const SHOP_INFO = {
  name: 'Shop',
  district_id: 58,  // TP.HCM
  ward_code: '1A',
}
```

---

**Version:** 1.0.0  
**Last Updated:** 2026-07-20  
**Author:** Kiro AI
