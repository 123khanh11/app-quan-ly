# 🚀 HƯỚNG DẪN TÍNH PHÍ VẬN CHUYỂN GHN

## ✅ ĐÃ HOÀN THÀNH

Chúng tôi đã cập nhật hệ thống để:
- ✅ Tính phí vận chuyển từ GHN một cách chính xác
- ✅ Bảo vệ token GHN trên server backend
- ✅ Tạo API để frontend gọi an toàn
- ✅ Cập nhật vị trí kho hàng: Hà Đông, Hà Nội

---

## 🔧 THIẾT LẬP

### 1️⃣ Cài đặt Dependencies

```bash
npm install
```

✅ Đã cài: Express, CORS, dotenv, @types/express, @types/cors, @types/node

### 2️⃣ Kiểm tra .env.local

File `.env.local` đã có các thông tin cần thiết:

```env
GHN_TOKEN=653bfc7b-8381-11f1-a65e-a68e06d4dd1e
GHN_SHOP_ID=5430969
GHN_API_URL=https://dev-online-gateway.ghn.vn/shiip/public-api/v2

# Vị trí kho hàng: Hà Đông, Hà Nội
GHN_FROM_DISTRICT_ID=1455
GHN_FROM_WARD_CODE=21617
```

---

## 🏃 CHẠY HỆ THỐNG

### Bước 1: Khởi động Backend Server

```bash
npm run server
```

Output sẽ hiển thị:
```
🚀 GHN API Server running on http://localhost:5000

📍 API Endpoints:
   GET  http://localhost:5000/api/ghn/province
   GET  http://localhost:5000/api/ghn/district?province_id=201
   GET  http://localhost:5000/api/ghn/ward?district_id=1450
   GET  http://localhost:5000/api/ghn/service?from_district=1455&to_district=1542
   POST http://localhost:5000/api/ghn/fee

✅ Status: Ready!
```

**⚠️ Lưu ý: Giữ terminal này mở**. Server phải chạy liên tục để frontend có thể gọi API.

### Bước 2: Khởi động Frontend

Mở terminal khác, chạy:

```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

---

## ✨ CÁC API ENDPOINT

### 1. Lấy Danh Sách Tỉnh/Thành Phố

**Endpoint:**
```
GET http://localhost:5000/api/ghn/province
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "province_id": 1,
      "province_name": "Hà Nội"
    },
    {
      "province_id": 202,
      "province_name": "TP. Hồ Chí Minh"
    }
  ]
}
```

---

### 2. Lấy Danh Sách Quận/Huyện

**Endpoint:**
```
GET http://localhost:5000/api/ghn/district?province_id=1
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "district_id": 1450,
      "district_name": "Ba Đình"
    },
    {
      "district_id": 1455,
      "district_name": "Hà Đông"
    }
  ]
}
```

---

### 3. Lấy Danh Sách Xã/Phường

**Endpoint:**
```
GET http://localhost:5000/api/ghn/ward?district_id=1450
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "ward_code": "21211",
      "ward_name": "Dương Nội"
    },
    {
      "ward_code": "21212",
      "ward_name": "La Khê"
    }
  ]
}
```

---

### 4. Lấy Danh Sách Dịch Vụ (Không bắt buộc)

**Endpoint:**
```
GET http://localhost:5000/api/ghn/service?from_district=1455&to_district=1542
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "service_id": 2,
      "service_name": "Hàng nhẹ"
    },
    {
      "service_id": 5,
      "service_name": "Hàng nặng"
    }
  ]
}
```

---

### 5. TÍNH PHÍ VẬN CHUYỂN ⭐

**Endpoint:**
```
POST http://localhost:5000/api/ghn/fee
```

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "service_id": 2,
  "from_district_id": 1455,
  "from_ward_code": "21617",
  "to_district_id": 1542,
  "to_ward_code": "30711",
  "weight": 1000,
  "length": 20,
  "width": 20,
  "height": 20,
  "insurance_value": 0,
  "coupon": null
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 36300,
    "service_fee": 36300,
    "insurance_fee": 0,
    "pick_station_fee": 0,
    "coupon_value": 0,
    "r2s_fee": 0,
    "document_return": 0,
    "double_check": 0,
    "cod_fee": 0,
    "pick_remote_areas_fee": 0,
    "deliver_remote_areas_fee": 0,
    "cod_failed_fee": 0
  }
}
```

---

## 🧪 KIỂM TRA API TRONG TRÌNH DUYỆT

### Test Province (tỉnh)

Mở trình duyệt, nhập URL:
```
http://localhost:5000/api/ghn/province
```

Sẽ thấy danh sách tỉnh/thành phố.

---

### Test Calculating Fee (tính phí)

Sử dụng **Postman** hoặc **curl**:

```bash
curl --location 'http://localhost:5000/api/ghn/fee' \
  --header 'Content-Type: application/json' \
  --data '{
    "service_id": 2,
    "from_district_id": 1455,
    "from_ward_code": "21617",
    "to_district_id": 1542,
    "to_ward_code": "30711",
    "weight": 1000,
    "length": 20,
    "width": 20,
    "height": 20
  }'
```

---

## 🌐 KIẾN TRÚC HỆ THỐNG

```
🖥️ Customer Browser
         ↓
    Frontend (React)
         ↓ (gọi /api/ghn/*)
    Backend Server (Express)
    http://localhost:5000
         ↓ (gọi với Token)
    GHN API
    https://dev-online-gateway.ghn.vn
         ↓
    Trả về phí vận chuyển
```

**Ưu điểm:**
- ✅ Token GHN được bảo vệ trên server
- ✅ Frontend không bao giờ tiếp xúc với token
- ✅ Có thể deploy frontend trên Vercel, backend riêng
- ✅ An toàn, bảo mật

---

## 📁 CẤU TRÚC FILES

```
project/
├── server.ts                          # Backend Express server
├── .env.local                         # GHN credentials (BẢNG)
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── checkout/
│   │   │       └── CheckoutForm.tsx   # Form checkout
│   │   └── App.tsx
│   └── services/
│       ├── ghn-api.ts                 # Frontend API client (MỚI)
│       └── ghn.ts                     # Old (không dùng nữa)
├── package.json                       # Dependencies
└── ...
```

---

## 🎯 FLOW HOÀN CHỈNH

### Bước 1: Chọn Tỉnh/Thành Phố
```
Frontend → GET /api/ghn/province
Backend  → GHN API
         ← Danh sách tỉnh
```

### Bước 2: Chọn Quận/Huyện
```
Frontend → GET /api/ghn/district?province_id=1
Backend  → GHN API
         ← Danh sách quận
```

### Bước 3: Chọn Xã/Phường
```
Frontend → GET /api/ghn/ward?district_id=1450
Backend  → GHN API
         ← Danh sách xã
```

### Bước 4: Tính Phí Vận Chuyển
```
Frontend → POST /api/ghn/fee
          + District ID
          + Ward Code
          + Weight
          + Dimensions
Backend  → GHN API
         ← total: 36300 VNĐ
Frontend → Hiển thị phí
```

### Bước 5: Đặt Hàng
```
Frontend → Gửi đơn hàng
Backend  → Lưu vào Supabase
         ← Order ID: xyz-123
Frontend → Hiển thị "Đặt hàng thành công"
```

---

## ⚙️ PARAMETERS GIẢI THÍCH

### service_id
- `2` = Hàng nhẹ (Light goods)
- `5` = Hàng nặng (Heavy goods)

### from_district_id & to_district_id
- Mã quận/huyện (lấy từ danh sách quận)
- Kho hàng: `1455` (Hà Đông)
- Khách: Tùy chọn

### from_ward_code & to_ward_code
- Mã xã/phường (lấy từ danh sách xã)
- Kho hàng: `21617` (Phường Dương Nội)
- Khách: Tùy chọn

### weight
- Đơn vị: gram (g)
- Ví dụ: 1000 = 1 kg
- Mặc định per item: 500g

### length, width, height
- Đơn vị: cm
- Mặc định per item: 20x20x20cm

---

## 🔒 BẢO MẬT

**Lưu ý quan trọng:**
- ❌ Token GHN KHÔNG được để trong frontend code
- ❌ Token GHN KHÔNG được đẩy lên GitHub (public)
- ✅ Token GHN được lưu trong `.env.local` (server)
- ✅ Token GHN được đọc từ `process.env` (server)
- ✅ Frontend chỉ gọi `/api/ghn/*` endpoints

---

## 🐛 TROUBLESHOOTING

### ❌ Lỗi "Cannot connect to backend"
```
Giải pháp: Chạy `npm run server` trước, giữ terminal mở
```

### ❌ Lỗi "Token missing"
```
Kiểm tra .env.local có GHN_TOKEN không
Restart server: npm run server
```

### ❌ Lỗi "Invalid district_id"
```
Kiểm tra district_id từ danh sách quận (GET /api/ghn/district)
```

### ❌ Lỗi "Shipping fee calculation failed"
```
Kiểm tra:
- service_id (2 hoặc 5)
- from_district_id & to_district_id có hợp lệ không
- weight > 0
- to_ward_code không trống
```

---

## 📊 VÍ DỤ HOÀN CHỈNH

### Scenario: Khách từ TP. HCM đặt hàng, giao tới Quận 1

1. **Lấy danh sách tỉnh**
```
GET http://localhost:5000/api/ghn/province
```

2. **Chọn TP. HCM, lấy danh sách quận**
```
GET http://localhost:5000/api/ghn/district?province_id=202
→ Trả về: district_id=1542 (Quận 1)
```

3. **Chọn Quận 1, lấy danh sách phường**
```
GET http://localhost:5000/api/ghn/ward?district_id=1542
→ Trả về: ward_code=30711 (Phường Bến Nghé)
```

4. **Tính phí vận chuyển từ kho Hà Nội**
```
POST http://localhost:5000/api/ghn/fee
{
  "service_id": 2,
  "from_district_id": 1455,    # Hà Đông (kho)
  "from_ward_code": "21617",   # Dương Nội (kho)
  "to_district_id": 1542,      # Quận 1 (khách)
  "to_ward_code": "30711",     # Bến Nghé (khách)
  "weight": 1000,              # 1kg
  "length": 20,
  "width": 20,
  "height": 20
}
→ Trả về: total = 36300 VNĐ
```

5. **Hiển thị trên form**
```
Tiền hàng:      250.000 VNĐ
Phí vận chuyển: 36.300 VNĐ
─────────────────────────
Tổng cộng:      286.300 VNĐ
```

---

## ✅ READY!

Hệ thống tính phí vận chuyển GHN đã sẵn sàng sử dụng!

**Bước tiếp theo:**
1. Chạy `npm run server`
2. Chạy `npm run dev` (terminal khác)
3. Mở http://localhost:5173
4. Thêm sản phẩm vào giỏ hàng
5. Nhấn "Thanh Toán"
6. Chọn địa chỉ
7. Xem phí vận chuyển được tính tự động ✨

---

## 📞 LIÊN HỆ

Nếu có vấn đề, kiểm tra:
- `.env.local` có đầy đủ credentials
- Server đang chạy: `http://localhost:5000/health`
- Frontend kết nối: Browser console (F12)

Thành công! 🎉
