# Hệ thống Tính Phí Vận Chuyển (GHN Shipping Fee Calculator)

Tài liệu hướng dẫn sử dụng API và component tính phí vận chuyển từ GHN.

## 📋 Mục lục

1. [API Endpoint](#api-endpoint)
2. [Hook (`useShippingFee`)](#hook-useshippingfee)
3. [Component React](#component-react)
4. [Ví dụ sử dụng](#ví-dụ-sử-dụng)
5. [Lỗi và xử lý](#lỗi-và-xử-lý)
6. [Khởi chạy](#khởi-chạy)

---

## API Endpoint

### URL

Express Server (Vite development):
```
POST http://localhost:5000/api/ghn/fee
```

### Request Headers

```
Content-Type: application/json
```

### Request Body

```json
{
  "to_district_id": 1444,           // (required) Mã quận/huyện giao hàng
  "to_ward_code": "20308",           // (required) Mã phường/xã giao hàng
  "weight": 1000,                    // (optional) Cân nặng (gram), mặc định: 1000
  "length": 20,                      // (optional) Dài (cm), mặc định: 20
  "width": 20,                       // (optional) Rộng (cm), mặc định: 20
  "height": 20,                      // (optional) Cao (cm), mặc định: 20
  "service_id": 2,                   // (optional) ID loại dịch vụ, sẽ tự động chọn nếu không có
  "insurance_value": 0,              // (optional) Giá trị bảo hiểm (VNĐ), mặc định: 0
  "cod_value": 0,                    // (optional) Số tiền COD (VNĐ), mặc định: 0
  "coupon": null                     // (optional) Mã giảm giá
}
```

### Response Success (HTTP 200)

```json
{
  "success": true,
  "data": {
    "total": 20900,                          // Tổng phí (VNĐ)
    "service_fee": 20900,                    // Phí vận chuyển cơ bản
    "insurance_fee": 0,                      // Phí bảo hiểm
    "cod_fee": 0,                            // Phí thu tiền COD
    "pick_station_fee": 0,                   // Phí đón tại ga
    "pick_remote_areas_fee": 0,              // Phí khu vực xa (nhận)
    "deliver_remote_areas_fee": 0,           // Phí khu vực xa (giao)
    "coupon_value": 0,                       // Giá trị giảm giá
    "r2s_fee": 0,
    "return_again": 0,
    "document_return": 0,
    "double_check": 0,
    "cod_failed_fee": 0,
    "change_to_address_fee": 0,
    "change_return_address_fee": 0,
    "return": 0
  },
  "warning": null
}
```

### Response Error (HTTP 400/500)

```json
{
  "success": false,
  "error": "Missing required parameters: to_district_id, to_ward_code",
  "code": "INVALID_PARAMS"
}
```

---

## Hook: `useShippingFee`

### Import

```typescript
import { useShippingFee } from '@/hooks/useShippingFee'
```

### Đặc điểm

- Hook React cho phép gọi API tính phí từ client
- Tự động quản lý loading state
- Hỗ trợ error handling
- Cung cấp các utility function (format, breakdown, etc.)
- Tự động phát hiện API URL (local dev hoặc production)

### Signature

```typescript
function useShippingFee(): {
  loading: boolean                                    // Đang tính toán
  data: ShippingFeeData | null                        // Kết quả phí vận chuyển
  error: string | null                                // Lỗi nếu có
  warning: string | null                              // Cảnh báo (ví dụ: dùng giá ước tính)
  calculateFee: (params: ShippingFeeParams) => Promise<ShippingFeeResult>
  reset: () => void                                   // Xóa state
}
```

### ShippingFeeParams

```typescript
interface ShippingFeeParams {
  to_district_id: number       // (required)
  to_ward_code: string         // (required)
  weight?: number              // gram, default: 1000
  length?: number              // cm, default: 20
  width?: number               // cm, default: 20
  height?: number              // cm, default: 20
  service_id?: number          // optional
  insurance_value?: number     // optional
  cod_value?: number           // optional
  coupon?: string              // optional
}
```

### ShippingFeeData

```typescript
interface ShippingFeeData {
  total: number                        // Tổng phí (VNĐ)
  service_fee: number                  // Phí vận chuyển cơ bản
  insurance_fee: number                // Phí bảo hiểm
  cod_fee: number                      // Phí COD
  pick_station_fee: number             // Phí đón tại ga
  pick_remote_areas_fee: number        // Phí khu vực xa (nhận)
  deliver_remote_areas_fee: number     // Phí khu vực xa (giao)
  // ... và các field khác
}
```

### Utility Functions

#### `formatShippingFee(fee: number): string`

Định dạng phí theo locale Việt Nam.

```typescript
formatShippingFee(50000) // "50.000 VNĐ"
```

#### `getShippingFeeBreakdown(data: ShippingFeeData): Array<{label, amount}>`

Lấy chi tiết phí thành các item có > 0.

```typescript
const breakdown = getShippingFeeBreakdown(data)
// [
//   { label: 'Phí vận chuyển', amount: 20900 },
//   { label: 'Phí khu vực xa (giao)', amount: 5000 }
// ]
```

---

## Component React

### `<ShippingFeeCalculator />`

Component UI đầy đủ cho phép người dùng tính phí vận chuyển.

### Import

```typescript
import { ShippingFeeCalculator } from '@/app/components/shipping/ShippingFeeCalculator'
```

### Props

```typescript
interface ShippingFeeCalculatorProps {
  provinceId?: number           // Mã tỉnh để tải danh sách quận (mặc định: 1 - Hà Nội)
  onFeeCalculated?: (fee: number) => void  // Callback khi phí được tính toán
  autoCalculate?: boolean       // Tự động tính khi form thay đổi (mặc định: false)
}
```

### Features

- ✅ Chọn quận/huyện và phường/xã giao hàng
- ✅ Nhập cân nặng và kích thước bưu kiện
- ✅ Bảo hiểm hàng hóa (tuỳ chọn)
- ✅ Hiển thị chi tiết phí
- ✅ Auto-calculate mode
- ✅ Error & warning messages
- ✅ Loading state

### Styles

Component sử dụng **Tailwind CSS**. Đảm bảo dự án đã cấu hình Tailwind.

---

## Ví dụ sử dụng

### 1️⃣ Dùng Hook trong Component

```tsx
'use client'

import { useState } from 'react'
import { useShippingFee, formatShippingFee } from '@/hooks/useShippingFee'

export function MyCheckoutPage() {
  const { loading, data, error, calculateFee } = useShippingFee()
  const [districtId, setDistrictId] = useState(1444)
  const [wardCode, setWardCode] = useState('20308')

  async function handleCalculate() {
    const result = await calculateFee({
      to_district_id: districtId,
      to_ward_code: wardCode,
      weight: 1500,  // 1.5 kg
      length: 30,
      width: 20,
      height: 15,
    })

    if (result.success) {
      console.log('Phí vận chuyển:', formatShippingFee(result.data!.total))
    }
  }

  return (
    <div>
      <button onClick={handleCalculate} disabled={loading}>
        {loading ? 'Đang tính...' : 'Tính phí vận chuyển'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && <p>Phí: {formatShippingFee(data.total)}</p>}
    </div>
  )
}
```

### 2️⃣ Dùng Component có sẵn

```tsx
'use client'

import { ShippingFeeCalculator } from '@/app/components/shipping/ShippingFeeCalculator'

export function MyCheckout() {
  function handleFeeCalculated(fee: number) {
    console.log('Phí vận chuyển được cập nhật:', fee)
    // Cập nhật total order: subtotal + fee
  }

  return (
    <div>
      <h1>Thanh toán</h1>
      
      <ShippingFeeCalculator 
        provinceId={1}
        onFeeCalculated={handleFeeCalculated}
        autoCalculate={true}
      />
    </div>
  )
}
```

### 3️⃣ Gọi API trực tiếp (fetch)

```typescript
async function calculateShippingFee() {
  const response = await fetch('http://localhost:5000/api/ghn/fee', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to_district_id: 1444,
      to_ward_code: '20308',
      weight: 1000,
      length: 20,
      width: 20,
      height: 20,
    }),
  })

  const result = await response.json()
  
  if (result.success) {
    console.log('Total fee:', result.data.total)
  } else {
    console.error('Error:', result.error)
  }
}
```

---

## Lỗi và xử lý

### Error Codes

| Code | HTTP | Mô tả | Giải pháp |
|------|------|-------|----------|
| `INVALID_PARAMS` | 400 | Thiếu tham số bắt buộc | Kiểm tra `to_district_id`, `to_ward_code` |
| `CONFIG_ERROR` | 500 | Thiếu GHN credentials | Kiểm tra `.env.local` có `GHN_TOKEN`, `GHN_SHOP_ID` |
| `ROUTE_NOT_FOUND` | 400 | Tuyến đường không khả dụng | Sử dụng giá ước tính (fallback) |
| Network error | Network | Lỗi mạng | Retry hoặc dùng giá ước tính |

### Fallback Mechanism

Khi GHN API không có sẵn:

1. API endpoint trả lại phí ước tính (fallback fee)
2. Response có `warning` field
3. Frontend có thể hiển thị cảnh báo cho người dùng

```json
{
  "success": true,
  "data": {
    "total": 50000,
    "service_fee": 50000,
    ...
  },
  "warning": "GHN API error, using estimation"
}
```

### Environment Variables

Đảm bảo `.env.local` có các biến sau:

```env
GHN_API_URL=https://online-gateway.ghn.vn/shiip/public-api/v2
GHN_TOKEN=your-ghn-token
GHN_SHOP_ID=your-shop-id
GHN_FROM_DISTRICT_ID=1455
GHN_FROM_WARD_CODE=21617
```

---

## 🚀 Khởi chạy

### Development

Terminal 1 - Vite dev server:
```bash
npm run dev
```

Terminal 2 - Express API server:
```bash
npm run server:dev
```

Truy cập:
- Frontend: http://localhost:5173 (Vite)
- API: http://localhost:5000/api/ghn/fee

### Production

```bash
npm run build
npm run server
```

---

## 🔗 Liên kết

- **GHN API Docs**: https://sandbox.ghn.vn/
- **Service Types**:
  - `2`: Cân nặng < 20kg
  - `5`: Cân nặng >= 20kg hoặc nhiều kiện

---

## 📝 Ghi chú

- Tất cả phí được tính bằng **VNĐ**
- Cân nặng tối thiểu: **200 gram**
- Kích thước tối thiểu: **10cm** (mỗi chiều)
- Cân nặng được tính **tính theo 200g** gần nhất
- Component sử dụng **Tailwind CSS** - đảm bảo đã cấu hình
- Express server tự động lấy GHN credentials từ `.env.local`

---

## ✅ Checklist để sử dụng

- [ ] Cập nhật `.env.local` với GHN credentials
- [ ] Kiểm tra GHN token & shop ID hợp lệ
- [ ] Khởi chạy Express server: `npm run server:dev`
- [ ] Khởi chạy Vite dev: `npm run dev`
- [ ] Import hook/component trong component của bạn
- [ ] Test API endpoint: `POST http://localhost:5000/api/ghn/fee`
- [ ] Test component: hiển thị form & tính phí
- [ ] Xử lý error cases trong UI
