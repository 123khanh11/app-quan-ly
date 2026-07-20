# 🚚 GHN API Integration Guide

## API Endpoints

Tất cả các endpoint được deploy trên Vercel Serverless Functions:

### 1. GET `/api/ghn-province`
**Lấy danh sách tất cả tỉnh/thành phố Việt Nam**

```bash
curl "https://e-commerce-website-interface.vercel.app/api/ghn-province"
```

**Response:**
```json
{
  "success": true,
  "source": "local", // hoặc "GHN" nếu token hợp lệ
  "data": [
    { "province_id": 1, "province_name": "Hà Nội" },
    { "province_id": 2, "province_name": "Hà Giang" },
    ...
  ]
}
```

**Data có sẵn:** 60 tỉnh/thành phố Việt Nam

---

### 2. GET `/api/ghn-district?province_id=<ID>`
**Lấy danh sách quận/huyện theo tỉnh**

```bash
# Lấy quận ở Hà Nội (province_id=1)
curl "https://e-commerce-website-interface.vercel.app/api/ghn-district?province_id=1"

# Lấy quận ở TP.HCM (province_id=58)
curl "https://e-commerce-website-interface.vercel.app/api/ghn-district?province_id=58"
```

**Response:**
```json
{
  "success": true,
  "source": "local",
  "data": [
    { "district_id": 1, "district_name": "Hoàn Kiếm" },
    { "district_id": 2, "district_name": "Ba Đình" },
    ...
  ]
}
```

**Data hiện có:**
- Hà Nội (province_id=1): 12 quận
- TP.HCM (province_id=58): 16 quận

**Mở rộng:** Thêm districts khác vào file `api/ghn-district.ts` trong object `DISTRICTS`

---

### 3. GET `/api/ghn-ward?district_id=<ID>`
**Lấy danh sách xã/phường theo quận**

```bash
# Lấy phường ở Hoàn Kiếm (district_id=1)
curl "https://e-commerce-website-interface.vercel.app/api/ghn-ward?district_id=1"

# Lấy phường ở Hà Đông (district_id=1455)
curl "https://e-commerce-website-interface.vercel.app/api/ghn-ward?district_id=1455"
```

**Response:**
```json
{
  "success": true,
  "source": "local",
  "data": [
    { "ward_code": "1A", "ward_name": "Phường Hàng Đồng" },
    { "ward_code": "1B", "ward_name": "Phường Hàng Gai" },
    ...
  ]
}
```

**Data hiện có:**
- Hoàn Kiếm (district_id=1): 6 phường
- Hà Đông (district_id=1455): 8 phường

**Mở rộng:** Thêm wards khác vào file `api/ghn-ward.ts` trong object `WARDS`

---

### 4. GET `/api/ghn-service?from_district=<ID>&to_district=<ID>`
**Lấy danh sách dịch vụ giao hàng có sẵn giữa 2 quận**

```bash
curl "https://e-commerce-website-interface.vercel.app/api/ghn-service?from_district=1455&to_district=206"
```

**Response:**
```json
{
  "success": true,
  "source": "local",
  "data": [
    { "service_id": 0, "service_name": "Chuyển phát nhanh" },
    { "service_id": 1, "service_name": "Chuyển phát chuẩn" },
    { "service_id": 2, "service_name": "Chuyển phát nhanh hôm nay" }
  ]
}
```

---

### 5. POST `/api/ghn-fee`
**Tính phí vận chuyển dựa trên cân nặng, kích thước, và địa chỉ**

```bash
curl -X POST "https://e-commerce-website-interface.vercel.app/api/ghn-fee" \
  -H "Content-Type: application/json" \
  -d '{
    "service_id": 2,
    "from_district_id": 1455,
    "from_ward_code": "21617",
    "to_district_id": 206,
    "to_ward_code": "1A",
    "weight": 1500,
    "length": 30,
    "width": 25,
    "height": 20,
    "insurance_value": 0,
    "coupon": null
  }'
```

**Response:**
```json
{
  "success": true,
  "total": 45000,
  "details": {
    "service_fee": 40000,
    "insurance_fee": 0,
    "pick_station_fee": 0,
    "pick_remote_areas_fee": 5000,
    "deliver_remote_areas_fee": 0,
    "cod_fee": 0
  }
}
```

**Body Parameters:**
| Param | Type | Bắt buộc | Mô tả |
|-------|------|---------|-------|
| service_id | number | ✓ | Loại dịch vụ (0-2) |
| from_district_id | number | ✓ | Quận gửi từ (mặc định: 1455 - Hà Đông) |
| from_ward_code | string | ✓ | Phường gửi từ |
| to_district_id | number | ✓ | Quận gửi đến |
| to_ward_code | string | ✓ | Phường gửi đến |
| weight | number | ✓ | Cân nặng (gram), tối thiểu 1000g |
| length | number | - | Chiều dài (cm) |
| width | number | - | Chiều rộng (cm) |
| height | number | - | Chiều cao (cm) |
| insurance_value | number | - | Giá trị bảo hiểm (VNĐ) |
| coupon | string | - | Mã giảm giá |

---

## 🔄 Flow Hoạt Động

```
Frontend (CheckoutForm.tsx)
    ↓
User chọn Tỉnh/Quận/Phường
    ↓
Gọi `/api/ghn-district?province_id=X` → Hiển thị quận
    ↓
Gọi `/api/ghn-ward?district_id=Y` → Hiển thị phường
    ↓
Gọi `/api/ghn-fee` với weight & dimensions
    ↓
Hiển thị phí vận chuyển
    ↓
Khách submit → Lưu order vào DB
```

---

## 🔐 Token Management

### Hiện tại (Local Fallback):
- GHN API được gọi trước
- Nếu token hợp lệ → Trả về dữ liệu thực từ GHN
- Nếu token fail → Fallback sang local data
- **Status:** ✅ Hoạt động (local data)

### Để sử dụng Real GHN Data:
1. Vào GHN Dashboard
2. Thêm Vercel IP vào **IP Whitelist**
   - IP của Vercel: `76.76.19.0/24` (và các subnet khác)
   - Hoặc dùng public IP của Vercel function
3. Cập nhật `.env.production` trên Vercel:
   ```
   GHN_TOKEN=<token>
   GHN_SHOP_ID=<shop_id>
   GHN_API_URL=https://dev-online-gateway.ghn.vn/shiip/public-api/v2
   ```
4. Deploy lại

---

## 📊 Local Data Structure

### Tỉnh/Thành Phố (60 cái)
File: `api/ghn-province.ts`
```javascript
const PROVINCES = [
  { province_id: 1, province_name: 'Hà Nội' },
  { province_id: 2, province_name: 'Hà Giang' },
  ...
]
```

### Quận/Huyện
File: `api/ghn-district.ts`
```javascript
const DISTRICTS: Record<number, Array<{district_id, district_name}>> = {
  1: [
    { district_id: 1, district_name: 'Hoàn Kiếm' },
    ...
  ],
  58: [
    { district_id: 1, district_name: 'Quận 1' },
    ...
  ]
}
```

### Xã/Phường
File: `api/ghn-ward.ts`
```javascript
const WARDS: Record<number, Array<{ward_code, ward_name}>> = {
  1455: [
    { ward_code: '21617', ward_name: 'Phường Phúc Diễn' },
    ...
  ],
  1: [
    { ward_code: '1A', ward_name: 'Phường Hàng Đồng' },
    ...
  ]
}
```

---

## 🛠️ Mở Rộng Dữ Liệu

### Thêm quận mới:
```typescript
// api/ghn-district.ts
const DISTRICTS = {
  1: [...],  // Existing
  15: [      // NEW - Hải Phòng
    { district_id: 1, district_name: 'Hồng Bàng' },
    { district_id: 2, district_name: 'Ngô Quyền' },
    ...
  ]
}
```

### Thêm phường mới:
```typescript
// api/ghn-ward.ts
const WARDS = {
  1: [...],  // Existing
  2: [       // NEW - Ba Đình
    { ward_code: '2A', ward_name: 'Phường Ba Đình' },
    { ward_code: '2B', ward_name: 'Phường Cống Vị' },
    ...
  ]
}
```

### Build & Deploy:
```bash
npm run build
git add api/
git commit -m "Add more districts/wards data"
vercel --prod
```

---

## 📱 Frontend Integration

### CheckoutForm.tsx
```typescript
import { calculateShipping } from '@/services/shipping-calculator'
import { getDistricts, getWards } from '@/services/ghn-api'

// Khi khách chọn tỉnh
const result = await getDistricts(provinceId)
setDistricts(result.districts)

// Khi khách chọn quận
const result = await getWards(districtId)
setWards(result.wards)

// Khi chọn xong địa chỉ
const shippingResult = await calculateShipping(
  cartItems,
  districtId,
  wardCode,
  serviceId
)
setShippingFee(shippingResult.total)
```

---

## ⚙️ Environment Variables

### Development (.env.local):
```
GHN_TOKEN=653bfc7b-8381-11f1-a65e-a68e06d4dd1e
GHN_SHOP_ID=5430969
GHN_API_URL=https://dev-online-gateway.ghn.vn/shiip/public-api/v2
GHN_FROM_DISTRICT_ID=1455
GHN_FROM_WARD_CODE=21617
```

### Production (Vercel):
```
GHN_TOKEN=<token>
GHN_SHOP_ID=<shop_id>
GHN_API_URL=https://dev-online-gateway.ghn.vn/shiip/public-api/v2
GHN_FROM_DISTRICT_ID=1455
GHN_FROM_WARD_CODE=21617
```

---

## 🧪 Test API

### cURL:
```bash
# Get all provinces
curl "https://e-commerce-website-interface.vercel.app/api/ghn-province"

# Get districts
curl "https://e-commerce-website-interface.vercel.app/api/ghn-district?province_id=1"

# Get wards
curl "https://e-commerce-website-interface.vercel.app/api/ghn-ward?district_id=1455"

# Calculate fee
curl -X POST "https://e-commerce-website-interface.vercel.app/api/ghn-fee" \
  -H "Content-Type: application/json" \
  -d '{"service_id":2,"from_district_id":1455,"from_ward_code":"21617","to_district_id":206,"to_ward_code":"1A","weight":1500}'
```

### JavaScript:
```javascript
// Get provinces
const prov = await fetch('/api/ghn-province').then(r => r.json());
console.log(prov.data); // 60 tỉnh

// Get districts
const dist = await fetch('/api/ghn-district?province_id=1').then(r => r.json());
console.log(dist.data); // 12 quận Hà Nội

// Calculate fee
const fee = await fetch('/api/ghn-fee', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    service_id: 2,
    from_district_id: 1455,
    from_ward_code: '21617',
    to_district_id: 206,
    to_ward_code: '1A',
    weight: 1500
  })
}).then(r => r.json());
console.log(fee.total); // 45000 VNĐ
```

---

## 📝 Notes

1. **Shop Location (cố định):**
   - Hà Đông, Hà Nội
   - District ID: 1455
   - Ward Code: 21617

2. **Cân nặng tối thiểu:** 1kg (1000g)

3. **Nếu API fail:** Tự động dùng local data, không lỗi

4. **GHN Service Types:**
   - 0: Chuyển phát nhanh (Express)
   - 1: Chuyển phát chuẩn (Standard)
   - 2: Chuyển phát nhanh hôm nay (Same day)

5. **Phí phụ:**
   - Vùng xa pick/deliver: 5,000-50,000 VNĐ
   - Bảo hiểm (optional)
   - COD fee (nếu thanh toán khi nhận)

---

**Last Updated:** 2026-07-20  
**Version:** 1.0.0
