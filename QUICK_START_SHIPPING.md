# 🚀 Quick Start - Tính Phí Vận Chuyển

Hướng dẫn nhanh sử dụng hệ thống tính phí vận chuyển.

## 5 Phút Setup

### 1. Khởi chạy server

Terminal 1:
```bash
npm run dev
```

Terminal 2:
```bash
npm run server:dev
```

✅ Xong! API sẵn sàng trên `http://localhost:5000/api/ghn/fee`

### 2. Sử dụng trong component

```tsx
'use client'

import { ShippingFeeCalculator } from '@/app/components/shipping/ShippingFeeCalculator'

export default function CheckoutPage() {
  return (
    <div>
      <h1>Thanh toán</h1>
      <ShippingFeeCalculator 
        provinceId={1}
        onFeeCalculated={(fee) => console.log('Phí:', fee)}
      />
    </div>
  )
}
```

✅ Xong! Component hiển thị form tính phí.

---

## API Reference (30 giây)

### Request
```bash
POST http://localhost:5000/api/ghn/fee

Content-Type: application/json

{
  "to_district_id": 1444,
  "to_ward_code": "20308",
  "weight": 1000
}
```

### Response
```json
{
  "success": true,
  "data": {
    "total": 20900,
    "service_fee": 20900,
    "insurance_fee": 0,
    ...
  }
}
```

---

## Hook Usage (15 giây)

```tsx
import { useShippingFee } from '@/hooks/useShippingFee'

const { loading, data, error, calculateFee } = useShippingFee()

await calculateFee({
  to_district_id: 1444,
  to_ward_code: '20308',
  weight: 1000,
})

// data.total = phí vận chuyển (VNĐ)
```

---

## Utility Functions (30 giây)

```tsx
import { 
  formatShippingFee,
  getShippingFeeBreakdown 
} from '@/hooks/useShippingFee'

// Format: "50.000 VNĐ"
formatShippingFee(50000)

// Breakdown: [{label: 'Phí vận chuyển', amount: 20900}, ...]
getShippingFeeBreakdown(data)
```

---

## Test API (1 phút)

```bash
# Test cURL
curl -X POST http://localhost:5000/api/ghn/fee \
  -H "Content-Type: application/json" \
  -d '{
    "to_district_id": 1444,
    "to_ward_code": "20308",
    "weight": 1000
  }'
```

---

## Troubleshooting (30 giây)

| Vấn đề | Giải pháp |
|--------|----------|
| ❌ CORS error | Kiểm tra Express chạy trên 5000 |
| ❌ GHN credentials error | Kiểm tra `.env.local` |
| ⚠️ Using estimation | Bình thường, fallback fee |
| ❌ Cannot connect | Khởi chạy: `npm run server:dev` |

---

## Files

- **Hook**: `src/hooks/useShippingFee.ts`
- **Component**: `src/app/components/shipping/ShippingFeeCalculator.tsx`
- **Docs**: `SHIPPING_FEE_API.md` (đầy đủ)

---

## ✨ Done!

API + Hook + Component + Docs ready to use 🎉

Bất kỳ câu hỏi? Xem `SHIPPING_FEE_API.md`
