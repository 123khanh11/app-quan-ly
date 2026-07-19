# 🚀 API Test Guide - Express Server

## ⚡ Nhanh Nhất!

### Bước 1: Install Dependencies
```bash
npm install
```

### Bước 2: Chạy Server
```bash
npm run server
```

**Output sẽ thấy**:
```
🚀 GHN API Server running on http://localhost:5000
📍 API Endpoints:
   GET  http://localhost:5000/api/ghn/province
   GET  http://localhost:5000/api/ghn/district?province_id=201
   GET  http://localhost:5000/api/ghn/ward?district_id=1450
   GET  http://localhost:5000/api/ghn/service?from_district=1455&to_district=1542
   POST http://localhost:5000/api/ghn/fee

✅ Token: ✓ Configured
✅ Shop ID: ✓ Configured
```

### Bước 3: Test API - Mở Browser

#### 1️⃣ Test Provinces (Danh sách Tỉnh)
```
http://localhost:5000/api/ghn/province
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "ProvinceID": 201,
      "ProvinceName": "Hà Nội"
    },
    {
      "ProvinceID": 202,
      "ProvinceName": "TP. Hồ Chí Minh"
    }
  ]
}
```

#### 2️⃣ Test Districts (Danh sách Quận/Huyện)
```
http://localhost:5000/api/ghn/district?province_id=201
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "DistrictID": 1450,
      "DistrictName": "Ba Đình"
    },
    {
      "DistrictID": 1451,
      "DistrictName": "Hoàn Kiếm"
    }
  ]
}
```

#### 3️⃣ Test Wards (Danh sách Xã/Phường)
```
http://localhost:5000/api/ghn/ward?district_id=1450
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "WardCode": "21211",
      "WardName": "Phường Trần Hưng Đạo"
    },
    {
      "WardCode": "21212",
      "WardName": "Phường Phúc Xá"
    }
  ]
}
```

#### 4️⃣ Test Services (Danh sách Dịch Vụ)
```
http://localhost:5000/api/ghn/service?from_district=1455&to_district=1542
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "service_id": 53320,
      "service_name": "Hàng nhẹ"
    }
  ]
}
```

#### 5️⃣ Test Shipping Fee (POST - cần dùng curl hoặc Postman)
```bash
curl -X POST http://localhost:5000/api/ghn/fee \
  -H "Content-Type: application/json" \
  -d '{
    "service_id": 53320,
    "from_district_id": 1455,
    "from_ward_code": "21617",
    "to_district_id": 1542,
    "to_ward_code": "21211",
    "weight": 1000,
    "length": 20,
    "width": 20,
    "height": 20
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "total": 32000,
    "service_fee": 32000,
    "insurance_fee": 0,
    "pick_station_fee": 0,
    "coupon_value": 0
  }
}
```

---

## 📊 API Endpoints

| Method | Endpoint | Query | Purpose |
|--------|----------|-------|---------|
| GET | `/api/ghn/province` | - | Lấy danh sách tỉnh |
| GET | `/api/ghn/district` | `province_id` | Lấy quận/huyện |
| GET | `/api/ghn/ward` | `district_id` | Lấy xã/phường |
| GET | `/api/ghn/service` | `from_district`, `to_district` | Lấy dịch vụ |
| POST | `/api/ghn/fee` | - (body) | Tính phí |

---

## 🔧 Cách Sử Dụng trong Frontend

### Import
```javascript
const API_URL = 'http://localhost:5000'

// Hoặc production:
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com'
  : 'http://localhost:5000'
```

### Get Provinces
```javascript
const getProvinces = async () => {
  const res = await fetch(`${API_URL}/api/ghn/province`)
  const data = await res.json()
  console.log(data.data) // Array of provinces
}
```

### Get Districts
```javascript
const getDistricts = async (provinceId) => {
  const res = await fetch(`${API_URL}/api/ghn/district?province_id=${provinceId}`)
  const data = await res.json()
  console.log(data.data) // Array of districts
}
```

### Get Wards
```javascript
const getWards = async (districtId) => {
  const res = await fetch(`${API_URL}/api/ghn/ward?district_id=${districtId}`)
  const data = await res.json()
  console.log(data.data) // Array of wards
}
```

### Calculate Fee
```javascript
const calculateFee = async (params) => {
  const res = await fetch(`${API_URL}/api/ghn/fee`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  const data = await res.json()
  console.log(data.data.total) // Shipping fee
}
```

---

## 🎯 Development vs Production

### Development (Local)
```bash
npm run server
# API at http://localhost:5000/api/ghn/*
```

### Production (Vercel)

**Option 1**: Deploy server separately
- Use Heroku, Railway, Render, etc.
- Set `API_URL` env var

**Option 2**: Use Vercel Serverless Functions
- Use existing `/api` folder with handler functions
- Auto-deploy with main project

---

## ⚠️ Important

✅ **Token**: Protected in `.env` (server-side only)
✅ **CORS**: Enabled for frontend
✅ **Error Handling**: All errors handled
✅ **Ready**: For production use

---

## 📞 Troubleshooting

### Server won't start
```bash
# Check if port 5000 is in use
# Or specify different port:
PORT=3001 npm run server
```

### API returns error
1. Check if `GHN_TOKEN` is set in `.env`
2. Check if `GHN_SHOP_ID` is set
3. Check internet connection
4. Check GHN API status

### CORS errors
- Server has CORS enabled ✅
- Try `npm install cors` if missing

---

**Status**: ✅ Server Ready
**API**: ✅ All endpoints working
**Security**: ✅ Token protected
**Test**: Open http://localhost:5000/api/ghn/province in browser!

🚀 **Run: `npm run server`**
