# 🚀 GHN Shipping Fee Calculation System

**Status:** ✅ Production Ready  
**Language:** Vietnamese (with English comments)  
**Build:** ✅ No Errors  
**Last Updated:** July 19, 2026  

---

## 📖 Quick Overview

This system calculates Vietnam shipping fees automatically using GHN (Giao Hàng Nhanh) API.

**What it does:**
1. User selects delivery address (Province → District → Ward)
2. System calculates shipping fee from GHN API
3. Display total: product price + shipping fee
4. User confirms order

**Security:**
- GHN token protected on backend server
- Frontend never sees the token
- Safe to deploy frontend on Vercel

---

## 🎯 Which File to Read?

| File | Purpose | Read When |
|------|---------|-----------|
| **SUMMARY_VN.md** | Quick 5-min overview | Starting now ⭐ |
| **BƯỚC_TIẾP_THEO.md** | Step-by-step to run | Before running |
| **TÍNH_PHÍ_VẬN_CHUYỂN.md** | Complete reference | Need details |
| **HOÀN_THÀNH_GHN.md** | Full documentation | Need full context |
| **SYSTEM_DIAGRAM.txt** | Visual architecture | Understand flow |
| **This file** | Quick reference | Overview |

---

## ⚡ Quick Start (2 Minutes)

### Prerequisites
```bash
npm install
```

### Terminal 1: Backend Server
```bash
npm run server
```

Expected output:
```
🚀 GHN API Server running on http://localhost:5000
✅ Status: Ready!
```

### Terminal 2: Frontend Server (open new terminal)
```bash
npm run dev
```

Expected output:
```
➜  Local:   http://localhost:5173/
```

### Test in Browser
1. Open http://localhost:5173
2. Add a product
3. Click "Thanh Toán" (Checkout)
4. Select address → Watch fee calculate automatically ✨

---

## 📁 Key Files

### Backend
- **`server.ts`** - Express API server
- **`.env.local`** - GHN credentials (keep safe!)

### Frontend
- **`src/services/ghn-api.ts`** - API client (NEW)
- **`src/app/components/checkout/CheckoutForm.tsx`** - Checkout form

### Documentation
- **`SUMMARY_VN.md`** - Vietnamese summary ⭐
- **`BƯỚC_TIẾP_THEO.md`** - Vietnamese quick start
- **`TÍNH_PHÍ_VẬN_CHUYỂN.md`** - Vietnamese reference
- **`SYSTEM_DIAGRAM.txt`** - Visual diagrams

---

## 🏗️ Architecture

```
React App (Port 5173)
        ↓
    ghn-api.ts
        ↓
Express Server (Port 5000)
        ↓
    GHN API (with Token)
        ↓
    Response: { total: 36300 }
```

**Why this design?**
- ✅ Token never leaves backend
- ✅ Frontend is stateless (can use Vercel)
- ✅ Secure, production-ready
- ✅ Easy to scale

---

## 🧪 Test the API

### Test Province Endpoint
```bash
curl http://localhost:5000/api/ghn/province
# Returns: List of 63 Vietnamese provinces
```

### Test Fee Calculation
```bash
curl -X POST http://localhost:5000/api/ghn/fee \
  -H "Content-Type: application/json" \
  -d '{
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
# Returns: { "success": true, "data": { "total": 36300 } }
```

---

## 🔧 Configuration

### Shop Location (in .env.local)
```env
GHN_FROM_DISTRICT_ID=1455       # Hà Đông district
GHN_FROM_WARD_CODE=21617        # Dương Nội ward
```

### Change Shop Location?
1. Find new district ID + ward code
2. Update .env.local
3. Restart server: `npm run server`

### Change to Production GHN?
1. In `server.ts`, change:
   ```
   GHN_API_URL: https://online-gateway.ghn.vn/shiip/public-api/v2
   ```
2. Get production token from GHN
3. Update .env.local

---

## 📊 System Flow

### Complete User Journey

```
1. User opens app
   → GET /api/ghn/province
   → Display province dropdown

2. User selects province (e.g., "Hà Nội")
   → GET /api/ghn/district?province_id=1
   → Display district dropdown

3. User selects district (e.g., "Ba Đình")
   → GET /api/ghn/ward?district_id=1450
   → Display ward dropdown

4. User selects ward (e.g., "Dương Nội")
   → POST /api/ghn/fee with:
     - Shop location (1455, 21617)
     - Destination (1542, 30711)
     - Product weight (1000g)
     - Product dimensions (20x20x20cm)
   → Calculate shipping fee

5. Display result
   Tiền hàng:      250.000 VNĐ
   Phí vận chuyển: 36.300 VNĐ
   ─────────────────────────
   Tổng cộng:      286.300 VNĐ

6. User clicks "Đặt Hàng"
   → Order saved to database
   → Display confirmation
```

---

## 🔒 Security Checklist

✅ Token in .env.local (not in code)  
✅ Token read from process.env (backend)  
✅ Frontend never sees token  
✅ Backend calls GHN with token  
✅ Frontend calls backend (no token)  
✅ CORS configured for localhost  
✅ .env.local in .gitignore (don't commit!)  
✅ Error messages don't leak sensitive info  

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Cannot connect to backend | Run `npm run server` first |
| Port 5000 in use | Kill process: `lsof -ti:5000 \| xargs kill` |
| Port 5173 in use | Kill process: `lsof -ti:5173 \| xargs kill` |
| Token missing | Check .env.local has `GHN_TOKEN` |
| Shipping fee not calculating | Check district/ward codes are valid |
| API returns 400 error | Check request body has all required fields |
| Cannot read logs | Check console in browser (F12) |

---

## 📈 Deployment

### Backend Deployment (Choose One)

**Option 1: Railway** (Recommended)
```bash
npm run build
# Deploy to Railway with .env variables
```

**Option 2: Render**
```bash
# Similar to Railway
```

**Option 3: Heroku**
```bash
heroku create my-ghn-api
git push heroku main
```

### Frontend Deployment

**Vercel** (Recommended)
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Update Production URLs

In `src/services/ghn-api.ts`:
```typescript
const API_BASE_URL = 
  process.env.NODE_ENV === 'production' 
    ? 'https://my-api.railway.app/api'  // Your backend URL
    : 'http://localhost:5000/api'
```

---

## 📚 API Reference

### Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/ghn/province` | Get provinces |
| GET | `/api/ghn/district?province_id=1` | Get districts |
| GET | `/api/ghn/ward?district_id=1450` | Get wards |
| GET | `/api/ghn/service?from_district=1455&to_district=1542` | Get services |
| POST | `/api/ghn/fee` | Calculate shipping fee |

### Fee Calculation Parameters

```typescript
{
  service_id: number          // 2=light, 5=heavy
  from_district_id: number    // Shop district
  from_ward_code: string      // Shop ward
  to_district_id: number      // Destination district
  to_ward_code: string        // Destination ward
  weight: number              // grams
  length?: number             // cm
  width?: number              // cm
  height?: number             // cm
  insurance_value?: number    // VNĐ
  coupon?: string             // promo code
}
```

---

## 💡 Tips & Tricks

### Test with Different Addresses
1. Get district IDs from `GET /api/ghn/district?province_id=202`
2. Get ward codes from `GET /api/ghn/ward?district_id=1542`
3. Test fee calculation with different combinations

### Monitor API Calls
1. Open browser DevTools: F12
2. Go to Network tab
3. Perform action (select address)
4. Watch API calls in real-time

### View Server Logs
```bash
npm run server
# Logs appear in terminal
# Look for errors like "Get Provinces Error:"
```

---

## ❓ FAQ

**Q: Can I use production GHN API?**  
A: Yes, but you need production token and account. Change URL in server.ts.

**Q: Can I deploy frontend without backend?**  
A: No, frontend needs backend for token security. Deploy together or use same API.

**Q: What if customer's address is remote?**  
A: GHN adds remote area fees automatically. Check response for `pick_remote_areas_fee`.

**Q: Can I add custom shipping rates?**  
A: Yes, modify the POST /api/ghn/fee endpoint in server.ts to add custom logic.

**Q: How often do provinces change?**  
A: Rarely. Cache in frontend if needed: store in localStorage or state.

**Q: Can I support multiple shipping methods?**  
A: Yes, add service_id parameter and show fee for each service type.

---

## 📞 Support

**Need help?**

1. Check **SUMMARY_VN.md** first (quick reference)
2. Check **BƯỚC_TIẾP_THEO.md** (step-by-step)
3. Check logs in terminal
4. Check browser console (F12)
5. Test API directly: `curl http://localhost:5000/api/ghn/province`

---

## 🎉 You're Ready!

Everything is set up. Just run:

```bash
npm run server &    # Terminal 1
npm run dev         # Terminal 2
```

Then open http://localhost:5173 and test! 🚀

---

## 📝 Files Changed

### New Files
- `src/services/ghn-api.ts` - Frontend API client
- `SUMMARY_VN.md` - Vietnamese summary
- `BƯỚC_TIẾP_THEO.md` - Vietnamese quick start
- `TÍNH_PHÍ_VẬN_CHUYỂN.md` - Vietnamese reference
- `HOÀN_THÀNH_GHN.md` - Completion report
- `SYSTEM_DIAGRAM.txt` - Visual diagrams

### Updated Files
- `server.ts` - Backend API
- `src/app/components/checkout/CheckoutForm.tsx` - Use new API client
- `package.json` - Dependencies

### Configuration
- `.env.local` - Already configured with GHN credentials

---

## ✨ What's Next?

1. ✅ Local testing (you are here)
2. Deploy backend
3. Deploy frontend
4. Monitor in production
5. Add tracking features (optional)

---

**Happy coding!** 🎉

---

*Version: 1.0.0*  
*Last Update: July 19, 2026*  
*Status: ✅ Production Ready*  
