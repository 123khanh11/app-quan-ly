# ✅ GHN Server-Side Integration Guide

## 🎯 Architecture

```
Frontend (React/Vite)
    │
    ├─→ /api/ghn-provinces (GET)
    ├─→ /api/ghn-districts (GET?province_id=...)
    ├─→ /api/ghn-wards (GET?district_id=...)
    ├─→ /api/ghn-service (GET?from_district=...&to_district=...)
    ├─→ /api/ghn-fee (POST)
    │
    └─→ Backend (Vercel Serverless)
        │
        └─→ GHN API
            ├─ Token: SECURE (never exposed to frontend)
            ├─ Shop ID: SECURE
            └─ Credentials: Protected
```

## 📁 Files Created

### Backend API Routes (Vercel Serverless)
```
api/
├── ghn-provinces.ts    (GET /api/ghn-provinces)
├── ghn-districts.ts    (GET /api/ghn-districts?province_id=...)
├── ghn-wards.ts        (GET /api/ghn-wards?district_id=...)
├── ghn-service.ts      (GET /api/ghn-service?from_district=...&to_district=...)
└── ghn-fee.ts          (POST /api/ghn-fee)
```

### Frontend Client
```
src/services/
├── ghn-api-client.ts   (Frontend calls these APIs)
└── ghn-api-server.ts   (Server-side helpers)
```

### Environment Configuration
```
.env.local
├── GHN_TOKEN (Server-side only)
├── GHN_SHOP_ID
├── GHN_API_URL
├── GHN_FROM_DISTRICT_ID (Shop location)
└── GHN_FROM_WARD_CODE
```

---

## ✅ Files Already Created

✅ `api/ghn-provinces.ts`
✅ `api/ghn-districts.ts`
✅ `api/ghn-wards.ts`
✅ `api/ghn-service.ts`
✅ `api/ghn-fee.ts`
✅ `src/services/ghn-api-client.ts`
✅ `src/services/ghn-api-server.ts`
✅ `.env.local` (updated with server-side config)

---

## 📊 How It Works

### Step 1: User Selects Province
```javascript
// Frontend
const provinces = await getProvinces()
// Returns: [{ ProvinceID, ProvinceName }, ...]
```

### Step 2: User Selects District
```javascript
// Frontend
const districts = await getDistricts(provinceId)
// API calls backend /api/ghn-districts
// Backend calls GHN with secure token
// Returns district list
```

### Step 3: User Selects Ward
```javascript
// Frontend
const wards = await getWards(districtId)
// Returns: [{ ward_code, ward_name }, ...]
```

### Step 4: Get Service Types
```javascript
// Frontend
const services = await getServiceTypes(fromDistrict, toDistrict)
// Returns: [{ service_id }, ...] - needed for fee calculation
```

### Step 5: Calculate Shipping Fee
```javascript
// Frontend
const fee = await calculateShippingFee({
  service_id: 53320,
  from_district_id: 1455,
  from_ward_code: '21617',
  to_district_id: 1542,
  to_ward_code: '21211',
  weight: 1000,
  length: 20,
  width: 20,
  height: 20
})
// Returns: { total: 32000, service_fee: 32000, ... }
```

---

## 🔐 Security Benefits

| Before | After |
|--------|-------|
| ❌ Token exposed in frontend | ✅ Token only on backend |
| ❌ Anyone could extract token | ✅ Token hidden from client |
| ❌ Direct GHN calls from browser | ✅ All calls through API |
| ❌ Credentials in VITE_ vars | ✅ Credentials in GHN_ vars (server-only) |

---

## 📋 Next Steps to Complete Integration

### 1. Update CheckoutForm to use ghn-api-client
Replace current implementation with:

```javascript
import {
  getProvinces,
  getDistricts,
  getWards,
  getServiceTypes,
  calculateShippingFee
} from '@/services/ghn-api-client'

// Instead of direct GHN calls, use these functions
```

### 2. Add Province Loading
```javascript
useEffect(() => {
  loadProvinces()
}, [])

async function loadProvinces() {
  const result = await getProvinces()
  // Map to { label: name, value: id } format
}
```

### 3. Add District Loading on Province Select
```javascript
const handleProvinceSelect = async (provinceId) => {
  const result = await getDistricts(provinceId)
  // Populate district dropdown
}
```

### 4. Add Ward Loading on District Select
```javascript
const handleDistrictSelect = async (districtId) => {
  const result = await getWards(districtId)
  // Populate ward dropdown
}
```

### 5. Get Service ID then Calculate Fee
```javascript
const handleWardSelect = async (wardCode, districtId) => {
  // First get service types
  const services = await getServiceTypes(shopDistrict, districtId)
  const serviceId = services.data[0].service_id
  
  // Then calculate fee
  const fee = await calculateShippingFee({
    service_id: serviceId,
    from_district_id: shopDistrict,
    from_ward_code: shopWard,
    to_district_id: districtId,
    to_ward_code: wardCode,
    weight: totalWeight,
    // ... other params
  })
  
  setShippingFee(fee.data.total)
}
```

---

## ✅ Environment Variables

### Server-Side (Never exposed to frontend)
```env
GHN_TOKEN=653bfc7b-8381-11f1-a65e-a68e06d4dd1e
GHN_SHOP_ID=5430969
GHN_API_URL=https://dev-online-gateway.ghn.vn/shiip/public-api/v2
GHN_FROM_DISTRICT_ID=1455
GHN_FROM_WARD_CODE=21617
```

### Frontend (Can only see public variables)
None! All GHN calls go through our API routes.

---

## 🚀 Deployment

### Vercel Setup
1. Push code with `api/` folder
2. Environment variables in Vercel Dashboard:
   - `GHN_TOKEN`
   - `GHN_SHOP_ID`
   - `GHN_API_URL`
   - `GHN_FROM_DISTRICT_ID`
   - `GHN_FROM_WARD_CODE`
3. Deploy: `vercel --prod`

### Local Development
```bash
npm run dev
# API routes will be available at /api/...
```

---

## 📊 Testing API Routes

### Test Province API
```bash
curl http://localhost:3000/api/ghn-provinces
```

### Test District API
```bash
curl "http://localhost:3000/api/ghn-districts?province_id=201"
```

### Test Ward API
```bash
curl "http://localhost:3000/api/ghn-wards?district_id=1450"
```

### Test Service API
```bash
curl "http://localhost:3000/api/ghn-service?from_district=1455&to_district=1542"
```

### Test Fee Calculation
```bash
curl -X POST http://localhost:3000/api/ghn-fee \
  -H "Content-Type: application/json" \
  -d '{
    "service_id": 53320,
    "from_district_id": 1455,
    "from_ward_code": "21617",
    "to_district_id": 1542,
    "to_ward_code": "21211",
    "weight": 1000
  }'
```

---

## ✅ Benefits

✅ **Secure**: Token hidden from frontend
✅ **Efficient**: API calls cached by Vercel
✅ **Scalable**: Serverless functions auto-scale
✅ **Reliable**: Error handling on backend
✅ **Compliant**: Follows GHN best practices

---

## 📌 Important Notes

1. **API routes need TypeScript support**: Install `@vercel/node` types
2. **Token must be in environment vars**: Never hardcode
3. **CORS already handled**: Vercel API routes bypass browser CORS
4. **Caching**: Consider adding cache headers for province/district lists

---

**Status**: API Routes Created ✅
**Next**: Update CheckoutForm to use new API routes
**Final**: Test and deploy

🚀 Ready to implement!
