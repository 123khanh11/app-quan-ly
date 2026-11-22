# API: Lấy Chi Tiết Phí Vận Chuyển Đơn Hàng
**GET /api/shipping-order-fee**

**Phiên bản:** 1.0.0  
**Ngày tạo:** 17/10/2026  
**Liên kết:** GHN Shipping API v2

---

## 📋 Mô Tả

Endpoint này lấy **chi tiết phí vận chuyển** của một đơn hàng GHN đã tồn tại dựa trên mã vận đơn (order_code).

Điểm khác biệt so với `/api/shipping-fee`:
- **shipping-fee (POST)**: Tính phí cho đơn hàng **chưa tạo**
- **shipping-order-fee (GET)**: Lấy phí đơn hàng **đã tồn tại**

---

## 🔧 Cấu Trúc Request

### Method
```
GET
```

### URL
```
/api/shipping-order-fee?order_code={mã_vận_đơn}
```

### Query Parameters

| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|---------|-------|
| `order_code` | String | ✅ Có | Mã vận đơn GHN (ví dụ: `LAD8VT`) |

### Headers
```json
{
  "Content-Type": "application/json"
}
```

---

## 📤 Ví Dụ Request

### cURL
```bash
curl -X GET "http://localhost:3000/api/shipping-order-fee?order_code=LAD8VT" \
  -H "Content-Type: application/json"
```

### JavaScript / Fetch
```javascript
const response = await fetch('/api/shipping-order-fee?order_code=LAD8VT', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
const data = await response.json()
console.log(data)
```

### Postman
```
Method: GET
URL: http://localhost:3000/api/shipping-order-fee
Params:
  - Key: order_code
  - Value: LAD8VT
```

### PowerShell
```powershell
$response = Invoke-WebRequest `
  -Uri "http://localhost:3000/api/shipping-order-fee?order_code=LAD8VT" `
  -Method GET `
  -Headers @{"Content-Type"="application/json"}

$response.Content | ConvertFrom-Json
```

---

## 📥 Ví Dụ Response

### Thành Công (HTTP 200)

```json
{
  "success": true,
  "data": {
    "order_code": "LAD8VT",
    "detail": {
      "main_service": 20900,
      "insurance": 0,
      "cod_fee": 0,
      "station_do": 0,
      "station_pu": 0,
      "return": 0,
      "r2s": 0,
      "coupon": 0,
      "document_return": 0,
      "double_check": 0,
      "pick_remote_areas_fee": 0,
      "deliver_remote_areas_fee": 0,
      "change_to_address_fee": 0,
      "change_return_address_fee": 0,
      "total": 20900
    },
    "cod_collect_date": "0001-01-01T00:00:00Z"
  }
}
```

**Chi tiết các trường:**

| Trường | Kiểu | Mô tả | Đơn vị |
|--------|------|-------|-------|
| `order_code` | String | Mã vận đơn GHN | - |
| `detail.main_service` | Number | Phí vận chuyển cơ bản | VND |
| `detail.insurance` | Number | Phí bảo hiểm | VND |
| `detail.cod_fee` | Number | Phí thu hộ COD | VND |
| `detail.station_do` | Number | Phí nhận tại bưu cục (chặng giao) | VND |
| `detail.station_pu` | Number | Phí gửi tại bưu cục (chặng lấy) | VND |
| `detail.return` | Number | Phí trả hàng | VND |
| `detail.r2s` | Number | Phí giao lại (trả về shop) | VND |
| `detail.coupon` | Number | Giảm giá coupon | VND |
| `detail.total` | Number | Tổng phí | VND |
| `cod_collect_date` | String | Thời điểm đã thu COD (ISO 8601) | - |

---

## ❌ Ví Dụ Lỗi

### Thiếu order_code (HTTP 400)
```json
{
  "success": false,
  "error": "Missing required query parameter: order_code"
}
```

### Order không tồn tại (HTTP 404)
```json
{
  "success": false,
  "error": "Order code not found: INVALID123"
}
```

### Order không thuộc tài khoản (HTTP 400)
```json
{
  "success": false,
  "error": "Order does not belong to your shop"
}
```

### Lỗi hệ thống GHN (HTTP 500)
```json
{
  "success": false,
  "error": "GHN API error"
}
```

---

## 📊 Bảng Mã Lỗi HTTP

| Mã HTTP | Ý Nghĩa | Nguyên Nhân |
|---------|---------|-----------|
| **200** | Thành công | Order tồn tại, phí được lấy |
| **400** | Bad Request | Thiếu parameter, order không thuộc tài khoản |
| **404** | Not Found | Mã vận đơn không tồn tại |
| **405** | Method Not Allowed | Dùng method khác GET |
| **500** | Server Error | Lỗi hệ thống GHN hoặc server |

---

## 🧪 Test Cases

### TC-API-006A: Order Code Hợp Lệ
```
Input:  order_code=LAD8VT
Output: Status 200, detail phí đầy đủ
Result: ✅ PASS
```

### TC-API-006B: Thiếu order_code
```
Input:  (không gửi order_code)
Output: Status 400, error message
Result: ✅ PASS
```

### TC-API-006C: Order Không Tồn Tại
```
Input:  order_code=INVALID999
Output: Status 404, error message
Result: ✅ PASS
```

---

## 💡 Cách Sử Dụng

### 1. Lấy phí của đơn đã tạo
```javascript
// Sau khi tạo đơn trên GHN, bạn có mã order_code
const orderCode = "LAD8VT"

const response = await fetch(
  `/api/shipping-order-fee?order_code=${orderCode}`
)
const { data } = await response.json()

console.log(`Phí vận chuyển: ${data.detail.main_service} VND`)
console.log(`Tổng phí: ${data.detail.total} VND`)
```

### 2. Hiển thị chi tiết phí trên UI
```javascript
function displayOrderFee(data) {
  const html = `
    <div class="order-fee">
      <h3>Chi Tiết Phí Vận Chuyển</h3>
      <ul>
        <li>Phí vận chuyển: ${data.detail.main_service} VND</li>
        <li>Phí bảo hiểm: ${data.detail.insurance} VND</li>
        <li>Phí COD: ${data.detail.cod_fee} VND</li>
        <li>---</li>
        <li><strong>Tổng: ${data.detail.total} VND</strong></li>
      </ul>
    </div>
  `
  return html
}
```

### 3. Xử lý lỗi
```javascript
try {
  const response = await fetch(
    `/api/shipping-order-fee?order_code=${orderCode}`
  )
  
  if (!response.ok) {
    const { error } = await response.json()
    console.error('Lỗi:', error)
    return
  }
  
  const { data } = await response.json()
  // Process data
} catch (err) {
  console.error('Network error:', err)
}
```

---

## 🔐 Bảo Mật

- ✅ Token GHN được lưu trên server (không gửi client)
- ✅ Mã vận đơn được validate trước khi gửi GHN
- ✅ CORS được enable cho phép từ domain được phép
- ✅ Hỗ trợ HTTPS trên production

---

## 📝 Ghi Chú

- Mã vận đơn được tự động convert sang **UPPERCASE**
- Mã vận đơn rỗng hoặc không hợp lệ sẽ bị từ chối
- Nếu GHN API timeout, server sẽ trả về lỗi 500
- Phí được tính trong đơn vị **VND**

---

## 🔗 Tham Khảo

- [GHN Shipping API - Lấy Phí Đơn Hàng](https://api.ghn.vn)
- [POST /api/shipping-fee](./api/shipping-fee.mjs) - Tính phí đơn chưa tạo
- [Test Cases](./TEST_CASES_COMPREHENSIVE.md) - TC-API-006A, 006B, 006C

