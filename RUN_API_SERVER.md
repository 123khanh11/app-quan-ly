# ⚡ RUN API SERVER - 3 STEPS

## 🎯 Run Now!

### Step 1: Install
```bash
npm install
```

### Step 2: Start Server
```bash
npm run server
```

### Step 3: Test
Mở browser:
```
http://localhost:5000/api/ghn/province
```

**✅ Done!** API running!

---

## 📊 Test API Results

### Provinces
```
http://localhost:5000/api/ghn/province
```
→ Returns list of provinces (Hà Nội, TPHCM, etc.)

### Districts
```
http://localhost:5000/api/ghn/district?province_id=201
```
→ Returns quận/huyện (Ba Đình, Hoàn Kiếm, etc.)

### Wards
```
http://localhost:5000/api/ghn/ward?district_id=1450
```
→ Returns xã/phường (Phường 1, Phường 2, etc.)

### Fee
Use curl or Postman:
```bash
curl -X POST http://localhost:5000/api/ghn/fee \
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
→ Returns shipping fee

---

## 🔧 Scripts

```bash
# Run server
npm run server

# Run server with auto-reload
npm run server:dev

# Run website (separate terminal)
npm run dev

# Build
npm run build
```

---

## 📁 What's New

```
✅ server.ts - Express server with GHN API
✅ package.json - Added express, cors, dotenv
✅ .env.local - GHN credentials configured
✅ API_TEST_GUIDE.md - Full test guide
✅ RUN_API_SERVER.md - This file
```

---

## 🚀 API Endpoints

| GET/POST | Endpoint | Test |
|----------|----------|------|
| GET | `/api/ghn/province` | [Click](http://localhost:5000/api/ghn/province) |
| GET | `/api/ghn/district?province_id=201` | [Click](http://localhost:5000/api/ghn/district?province_id=201) |
| GET | `/api/ghn/ward?district_id=1450` | [Click](http://localhost:5000/api/ghn/ward?district_id=1450) |
| POST | `/api/ghn/fee` | Use curl/Postman |

---

**Status**: ✅ Server Ready  
**Command**: `npm run server`  
**Test**: http://localhost:5000/api/ghn/province

🎉 **API Chi Tiết Ready!**
