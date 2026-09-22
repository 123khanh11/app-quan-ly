# Testing Hệ thống Tính Phí Vận Chuyển

Hướng dẫn test API endpoint `/api/ghn/fee` và component tính phí.

## 📋 Mục lục

1. [Khởi chạy server](#khởi-chạy-server)
2. [Test API với cURL](#test-api-với-curl)
3. [Test API với REST Client](#test-api-với-rest-client)
4. [Test Component](#test-component)
5. [Các test case](#các-test-case)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Khởi chạy server

### Terminal 1: Vite Dev Server (Frontend)

```bash
npm run dev
```

Vite sẽ chạy trên: http://localhost:5173

### Terminal 2: Express Server (API)

```bash
npm run server:dev
```

Express sẽ chạy trên: http://localhost:5000

### Kiểm tra server

```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "ok",
  "message": "GHN API Server is running",
  "token": "✓ Configured",
  "shopId": "✓ Configured"
}
```

---

## Test API với cURL

### Yêu cầu

- cURL installed (hoặc sử dụng Windows PowerShell)
- Express server chạy trên port 5000

### Test Case 1: Tính phí cơ bản (Hà Nội → Sài Gòn)

```bash
curl -X POST http://localhost:5000/api/ghn/fee \
  -H "Content-Type: application/json" \
  -d '{
    "to_district_id": 1444,
    "to_ward_code": "20308",
    "weight": 1000,
    "length": 20,
    "width": 20,
    "height": 20
  }'
```

### Test Case 2: Tính phí với bảo hiểm

```bash
curl -X POST http://localhost:5000/api/ghn/fee \
  -H "Content-Type: application/json" \
  -d '{
    "to_district_id": 1444,
    "to_ward_code": "20308",
    "weight": 2000,
    "length": 30,
    "width": 25,
    "height": 15,
    "insurance_value": 500000,
    "cod_value": 0
  }'
```

### Test Case 3: Tính phí COD

```bash
curl -X POST http://localhost:5000/api/ghn/fee \
  -H "Content-Type: application/json" \
  -d '{
    "to_district_id": 1444,
    "to_ward_code": "20308",
    "weight": 500,
    "cod_value": 1000000
  }'
```

### Test Case 4: Error - Thiếu tham số

```bash
curl -X POST http://localhost:5000/api/ghn/fee \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 1000
  }'
```

---

## Test API với REST Client

### Tạo file `.rest` trong VS Code

Tạo file `test-shipping.rest` trong thư mục root:

```rest
### Variables
@baseUrl = http://localhost:5000
@apiUrl = {{baseUrl}}/api/ghn/fee

### Test 1: Basic shipping fee calculation
POST {{apiUrl}}
Content-Type: application/json

{
  "to_district_id": 1444,
  "to_ward_code": "20308",
  "weight": 1000,
  "length": 20,
  "width": 20,
  "height": 20
}

### Test 2: With insurance and COD
POST {{apiUrl}}
Content-Type: application/json

{
  "to_district_id": 1444,
  "to_ward_code": "20308",
  "weight": 2000,
  "length": 30,
  "width": 25,
  "height": 15,
  "insurance_value": 500000,
  "cod_value": 1000000
}

### Test 3: Different destination (Hà Nội trong nội thành)
POST {{apiUrl}}
Content-Type: application/json

{
  "to_district_id": 1451,
  "to_ward_code": "20003",
  "weight": 800,
  "length": 15,
  "width": 15,
  "height": 10
}

### Test 4: Heavy package (>= 20kg)
POST {{apiUrl}}
Content-Type: application/json

{
  "to_district_id": 1444,
  "to_ward_code": "20308",
  "weight": 25000,
  "service_id": 5,
  "length": 50,
  "width": 40,
  "height": 30
}

### Test 5: Missing required parameter
POST {{apiUrl}}
Content-Type: application/json

{
  "weight": 1000
}

### Test 6: Invalid district
POST {{apiUrl}}
Content-Type: application/json

{
  "to_district_id": 99999,
  "to_ward_code": "99999",
  "weight": 1000
}
```

**Cách sử dụng**: 
- Install VS Code extension: **REST Client**
- Mở file `test-shipping.rest`
- Click **Send Request** trên mỗi request

---

## Test Component

### Setup

1. Tạo page test:

```tsx
// src/app/test/shipping/page.tsx
'use client'

import { ShippingFeeCalculator } from '@/app/components/shipping/ShippingFeeCalculator'
import { useState } from 'react'

export default function ShippingFeeTestPage() {
  const [lastFee, setLastFee] = useState<number | null>(null)

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="mb-8 text-3xl font-bold">Test Tính Phí Vận Chuyển</h1>

      <ShippingFeeCalculator 
        provinceId={1}
        onFeeCalculated={(fee) => {
          setLastFee(fee)
          console.log('Fee calculated:', fee)
        }}
        autoCalculate={false}
      />

      {lastFee !== null && (
        <div className="mt-8 rounded-lg bg-blue-100 p-4">
          <p className="text-sm text-blue-600">Phí vận chuyển cuối cùng:</p>
          <p className="text-2xl font-bold text-blue-900">
            {lastFee.toLocaleString('vi-VN')} VNĐ
          </p>
        </div>
      )}
    </div>
  )
}
```

2. Truy cập: `http://localhost:3000/test/shipping`

3. Test các scenario:
   - Chọn quận/huyện khác nhau
   - Thay đổi cân nặng
   - Thay đổi kích thước
   - Chọn bảo hiểm

---

## Các test case

### ✅ Success Cases

#### Case 1: Tính phí nội thành (Hà Nội)
```json
{
  "to_district_id": 1451,
  "to_ward_code": "20003",
  "weight": 1000
}
```
**Kỳ vọng**: Phí ≈ 20.000 - 30.000 VNĐ

#### Case 2: Tính phí ngoài Hà Nội
```json
{
  "to_district_id": 1444,
  "to_ward_code": "20308",
  "weight": 1000
}
```
**Kỳ vọng**: Phí ≈ 30.000 - 50.000 VNĐ

#### Case 3: Hàng nặng (20kg+)
```json
{
  "to_district_id": 1444,
  "to_ward_code": "20308",
  "weight": 25000,
  "service_id": 5
}
```
**Kỳ vọng**: Phí > 100.000 VNĐ

#### Case 4: Với bảo hiểm
```json
{
  "to_district_id": 1444,
  "to_ward_code": "20308",
  "weight": 1000,
  "insurance_value": 500000
}
```
**Kỳ vọng**: `insurance_fee > 0`

### ❌ Error Cases

#### Case 1: Thiếu district_id
```json
{
  "to_ward_code": "20308",
  "weight": 1000
}
```
**Kỳ vọng**: HTTP 400, error = "Missing required parameters"

#### Case 2: Thiếu ward_code
```json
{
  "to_district_id": 1444,
  "weight": 1000
}
```
**Kỳ vọng**: HTTP 400, error = "Missing required parameters"

#### Case 3: District không tồn tại
```json
{
  "to_district_id": 99999,
  "to_ward_code": "20308",
  "weight": 1000
}
```
**Kỳ vọng**: HTTP 200, sử dụng fallback fee (ước tính)

#### Case 4: Ward code không hợp lệ
```json
{
  "to_district_id": 1444,
  "to_ward_code": "99999",
  "weight": 1000
}
```
**Kỳ vọng**: HTTP 200, sử dụng fallback fee

#### Case 5: Weight không hợp lệ
```json
{
  "to_district_id": 1444,
  "to_ward_code": "20308",
  "weight": 0
}
```
**Kỳ vọng**: Weight sẽ được chuyển thành 200g tối thiểu

---

## Troubleshooting

### 🔴 Error: "Missing GHN credentials"

**Nguyên nhân**: `.env.local` thiếu GHN_TOKEN hoặc GHN_SHOP_ID

**Giải pháp**:
```env
# .env.local
GHN_API_URL=https://online-gateway.ghn.vn/shiip/public-api/v2
GHN_TOKEN=your-token-here
GHN_SHOP_ID=your-shop-id
GHN_FROM_DISTRICT_ID=1455
GHN_FROM_WARD_CODE=21617
```

**Lấy token & shop ID**:
1. Đăng nhập vào https://online.ghn.vn/
2. Vào Settings → API
3. Copy Token và Shop ID

### 🔴 Error: "Route not found" từ GHN

**Nguyên nhân**: Tuyến đường giao hàng từ shop → khách không khả dụng

**Giải pháp**:
- API sẽ tự động fallback sang giá ước tính
- Check response có `warning` field
- Retry với `service_id` khác (2 hoặc 5)

### 🔴 Error: "Cannot connect to GHN"

**Nguyên nhân**: Network error hoặc GHN API down

**Giải pháp**:
- Kiểm tra kết nối internet
- Kiểm tra GHN API status
- Check firewall/proxy
- API sẽ fallback sang giá ước tính

### 🟡 Warning: "Using estimation"

**Nguyên nhân**: GHN API không thể lấy phí chính xác

**Giải pháp**: Đây là bình thường, hệ thống sẽ:
1. Lấy phí ước tính: `20.000 VNĐ + (weight - 1kg) * 5.000 VNĐ`
2. Trả lại response với `warning` field
3. Frontend có thể hiển thị cảnh báo

### 🔵 Debug Mode

Thêm logs vào browser console:

```typescript
const { loading, data, error, warning, calculateFee } = useShippingFee()

// Enable debug
window.__DEBUG_SHIPPING = true

const result = await calculateFee({
  to_district_id: 1444,
  to_ward_code: '20308',
  weight: 1000,
})

console.log('Result:', result)
console.log('Data:', data)
console.log('Error:', error)
console.log('Warning:', warning)
```

---

## 📊 Performance Monitoring

### Thêm tracking vào hook

```typescript
const calculateFee = useCallback(
  async (params: ShippingFeeParams): Promise<ShippingFeeResult> => {
    const startTime = performance.now()
    
    const result = await fetch('/api/shipping/fee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    
    const duration = performance.now() - startTime
    console.log(`✅ API call took ${duration.toFixed(2)}ms`)
    
    return result.json()
  },
  []
)
```

**Expected performance**:
- ✅ < 500ms: Excellent (GHN API được cache)
- ⚠️ 500-1000ms: Acceptable (GHN API slow)
- ❌ > 1000ms: Too slow (network issue hoặc GHN down)

---

## 🎯 Acceptance Criteria

Tính phí vận chuyển được coi là hoàn thành khi:

- [x] API endpoint `/api/shipping/fee` hoạt động
- [x] Có thể tính phí cho các tuyến đường khác nhau
- [x] Có error handling và fallback
- [x] Hook `useShippingFee` hoạt động
- [x] Component `ShippingFeeCalculator` hiển thị đúng
- [x] Response trả lại chi tiết phí breakdown
- [x] Environment variables được cấu hình đúng
- [x] Test cases pass

---

## 📝 Log Example

### Success Response

```
📦 Shipping Fee Calculation Request: {
  from_district: 1455,
  to_district: 1444,
  to_ward: '20308',
  weight: 1000,
  dimensions: '20x20x20cm'
}
📡 Step 1: Fetching available services...
✅ Using available service: 2 (Giao hàng tiêu chuẩn)
📡 Step 2: Calculating fee with service 2...
✅ Shipping fee calculated: 20900 VND
```

### Error Response

```
📞 Calculating shipping fee... ShippingFeeParams {
  to_district_id: 1444,
  to_ward_code: '20308',
  weight: 1000
}
❌ Shipping fee error: GHN API error, using estimation
✅ Shipping fee calculated: 50000 VND (estimated)
```

---

## ✅ Verification Checklist

Trước khi deploy:

- [ ] `.env.local` có GHN_TOKEN & GHN_SHOP_ID
- [ ] API endpoint trả lại response chính xác
- [ ] Hook `useShippingFee` có thể gọi API
- [ ] Component hiển thị form đúng
- [ ] Error cases được xử lý
- [ ] Fallback fee hoạt động
- [ ] Performance < 1000ms
- [ ] Mobile responsive (component có Tailwind)
- [ ] Vietnamese locale display đúng
