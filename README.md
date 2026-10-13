# 🛒 E-Commerce Website Interface

Full-stack e-commerce platform with GHN shipping integration and Meta Pixel tracking.

**Status:** ✅ **PRODUCTION READY**

---

## 🎯 Features

- ✅ Product catalog with variant management
- ✅ Variant image gallery
- ✅ Shopping cart management
- ✅ Checkout with address selection
- ✅ **GHN Shipping Integration** (63 provinces, 722 districts, 11,980 wards)
- ✅ Real-time shipping fee calculation
- ✅ **Meta Pixel Tracking** (AddToCart, Lead events)
- ✅ fbp + fbc tracking for conversion attribution
- ✅ Order management with Meta Pixel data
- ✅ PostgreSQL database with RLS
- ✅ Supabase backend

---

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm i

# Start dev server
npm run dev

# → http://localhost:3000
```

### Production

```bash
# Deploy to Vercel
git push origin master

# Frontend URL: https://e-commerce-website-interface.vercel.app
```

---

## 📍 Shop Location

**Current Shop Address:**
- **Province:** Sơn La (Province ID: 266)
- **District:** Huyện Mộc Châu (District ID: 1976)
- **Ward:** Ward Code: 141005
- **Shop ID:** 5430969
- **GHN Token:** 653bfc7b-8381-11f1-a65e-a68e06d4dd1e

---

## 📊 Meta Pixel Tracking

### Implemented Events

#### 1. **AddToCart Event**
- **Trigger:** When user clicks "Thêm Vào Giỏ"
- **Data Sent:**
  - `content_name`: Product name
  - `content_type`: "product"
  - `content_ids`: Product/variant ID
  - `value`: Price in VND
  - `currency`: "VND"
  - `quantity`: Items added
  - `color`: Selected color
  - `size`: Selected size
  - `fbp`: Facebook Pixel ID (auto-tracked)
  - `fbc`: Facebook Click ID (from fbclid URL param)

#### 2. **Lead Event**
- **Trigger:** When user confirms checkout ("Xác Nhận Đặt Đơn Hàng")
- **Data Sent:**
  - `value`: Order total in VND
  - `currency`: "VND"
  - `payment_method`: "bank_transfer" or "cod"
  - `fbp`: Facebook Pixel ID
  - `fbc`: Facebook Click ID

### fbp + fbc in Orders

fbp and fbc are now saved in the `orders` table for conversion tracking:

```sql
ALTER TABLE orders
ADD COLUMN fbp VARCHAR(255) DEFAULT NULL,
ADD COLUMN fbc VARCHAR(255) DEFAULT NULL;
```

**Data Flow:**
1. User visits from Facebook ads → `fbclid` captured in URL
2. Meta Pixel creates `_fbp` cookie on first visit
3. When user adds product → fbp + fbc tracked with AddToCart event
4. When user confirms order → fbp + fbc saved to database + Lead event sent
5. Order data includes fbp + fbc for sending to external systems

---

## 🏗️ Technology Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite bundler

### Backend & Database
- Supabase (PostgreSQL)
- Row Level Security (RLS)
- Real-time subscriptions

### APIs
- **GHN Shipping API** - Shipping calculation
- **Meta Pixel API** - Conversion tracking

### Deployment
- Vercel (Frontend)
- Supabase (Database)

---

## 📚 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── shop/               # Product & checkout components
│   │   ├── checkout/           # Checkout flow components
│   │   └── layout/             # Header, footer
│   ├── context/                # React context (Cart, Favorites)
│   └── App.tsx                 # Main app component
├── services/
│   ├── supabase.ts             # Supabase client & queries
│   ├── ghn-api-client.ts       # GHN API calls
│   └── shipping-calculator.ts  # Shipping fee logic
├── utils/
│   └── facebookPixel.ts        # Meta Pixel tracking
├── hooks/
│   └── useShippingFee.ts       # Shipping fee hook
└── styles/                     # Tailwind CSS config

scripts/
├── add-fbp-fbc-to-orders.sql   # Migration for fbp + fbc columns
├── create-*.sql                # Database table creation
└── seed-*.sql                  # GHN data seeding

api/
├── orders.mjs                  # Order creation API
├── payment-transfers.mjs       # Payment tracking API
└── ghn-*.mjs                   # GHN location data APIs
```

---

## 🔧 Key Services

### Meta Pixel Service (`src/utils/facebookPixel.ts`)

```typescript
// Get fbp cookie (created by Meta Pixel)
getFbp(): string

// Wait for fbp cookie with timeout
waitForFbp(timeout: number): Promise<string>

// Get fbc from URL parameter or storage
getFbc(): string

// Track AddToCart event with fbp + fbc
trackAddToCart(data: {
  content_name: string
  content_type: string
  content_ids: string[]
  value: number
  currency: string
  quantity: number
  fbp?: string
  fbc?: string
}): Promise<void>

// Track Lead event (on checkout confirm)
trackLead(data: {
  value: number
  currency: string
  payment_method: string
  fbp?: string
  fbc?: string
}): Promise<void>
```

### Order Service

- `createOrder()` - Create order with fbp + fbc
- `getOrderById()` - Retrieve order details
- `updateOrderStatus()` - Update order status

### GHN Service

- `getDistricts()` - Get districts by province
- `getWards()` - Get wards by district
- `calculateShippingFee()` - Get shipping cost

---

## 📋 Setup Checklist

### 1. Database Migration

Run this SQL in Supabase to add fbp + fbc columns:

```sql
-- Add fbp and fbc columns for Meta Pixel tracking
ALTER TABLE orders
ADD COLUMN fbp VARCHAR(255) DEFAULT NULL,
ADD COLUMN fbc VARCHAR(255) DEFAULT NULL;

-- Add indexes for performance
CREATE INDEX idx_orders_fbp ON orders(fbp);
CREATE INDEX idx_orders_fbc ON orders(fbc);
```

### 2. Environment Variables

```bash
# GHN API
GHN_API_URL="https://online-gateway.ghn.vn/shiip/public-api/v2"
GHN_FROM_DISTRICT_ID="1976"
GHN_FROM_WARD_CODE="141005"
GHN_SHOP_ID="5430969"
GHN_TOKEN="653bfc7b-8381-11f1-a65e-a68e06d4dd1e"

# Supabase
VITE_SUPABASE_URL="https://edtxexnhpbipcecceoop.supabase.co"
VITE_SUPABASE_ANON_KEY="sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7"
```

### 3. Meta Pixel Setup

- Pixel ID: `1823205972392139`
- Whitelisted domains: `e-commerce-website-interface.vercel.app`, `app-ql-v2.vercel.app`
- Events tracked: AddToCart, Lead

---

## 🛍️ Checkout Flow

```
1. Browse products

2. Click product → See variants + images

3. Select color/size/quantity

4. Click "Thêm Vào Giỏ" 
   → AddToCart event tracked with fbp + fbc

5. Go to checkout → Select address

6. Click "Xác Nhận Đặt Đơn Hàng"
   → Lead event tracked with fbp + fbc
   → Order created with fbp + fbc in database

7. Order confirmation displayed
```

---

## 📊 Database Schema

### Orders Table

```sql
CREATE TABLE orders (
  id uuid PRIMARY KEY,
  user_id uuid,
  total numeric NOT NULL,
  shipping_fee numeric,
  payment_method text,
  payment_status text,
  order_status text,
  shipping_address text,
  customer_name text,
  customer_email text,
  customer_phone text,
  note text,
  fbp varchar(255),          -- Meta Pixel ID
  fbc varchar(255),          -- Facebook Click ID
  created_at timestamp,
  updated_at timestamp
);
```

### GHN Data Tables

- `ghn_provinces` (63 records)
- `ghn_districts` (722 records)
- `ghn_wards` (11,980 records)
- `ghn_services` - Service types
- `ghn_service_types` - Available services

---

## 🔌 GHN API Configuration

**Credentials (in `.env.local`):**
- Shop ID: 5430969
- Token: 653bfc7b-8381-11f1-a65e-a68e06d4dd1e
- API URL: https://online-gateway.ghn.vn/shiip/public-api/v2

**Shop Location:**
- Province: Sơn La (ID: 266)
- District: Huyện Mộc Châu (ID: 1976)
- Ward: 141005

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Deploy
git push origin master

# URL: https://e-commerce-website-interface.vercel.app
# Status: Auto-deployed on push
```

### Database (Supabase)
```
URL: https://edtxexnhpbipcecceoop.supabase.co
Status: ✅ Production
```

---

## 🧪 Testing Meta Pixel

### Test AddToCart Tracking

1. Visit site: https://e-commerce-website-interface.vercel.app
2. Open DevTools (F12) → Console
3. Add product to cart
4. See logs:
   ```
   🛒 [Meta Pixel] Tracking AddToCart with fbp + fbc: { fbp: "fb.1.xxx", fbc: "fb.1.xxx", ... }
   ✅ [Meta Pixel] fbq('track', 'AddToCart', ...) {...}
   ```

### Test Lead Tracking

1. Go to checkout
2. Click "Xác Nhận Đặt Đơn Hàng"
3. See logs:
   ```
   🔔 [Meta Pixel] Tracking Lead event with fbp + fbc: { fbp: "fb.1.xxx", fbc: "fb.1.xxx", value: ... }
   ✅ [Meta Pixel] fbq('track', 'Lead', ...) {...}
   ```

### Verify Order Data

1. Go to Supabase Dashboard
2. Open `orders` table
3. Check new order has fbp + fbc values:
   - fbp: `fb.1.1234567890.9876543210`
   - fbc: `fb.1.1234567890.abcdefghij`

---

## 📞 Troubleshooting

### fbp not captured?

**Issue:** fbp showing NULL in database
**Solution:**
- Wait for Meta Pixel script to initialize (2 seconds)
- Check DevTools → Application → Cookies for `_fbp`
- Verify Meta Pixel script loaded in index.html

### Lead event not appearing in Meta Events Manager?

**Issue:** Test Events dashboard shows nothing
**Solution:**
- Domain must be whitelisted in Meta Events Manager
- Check: Events Manager → Settings → Connected Domains
- Both domains should be listed:
  - `e-commerce-website-interface.vercel.app`
  - `app-ql-v2.vercel.app`
- Wait 24-48 hours for events to appear in Overview tab

### Orders table doesn't have fbp/fbc columns?

**Issue:** Columns not in database
**Solution:**
- Run SQL migration: `scripts/add-fbp-fbc-to-orders.sql`
- Go to Supabase → SQL Editor → Run migration

---

## 📝 Recent Changes

### Meta Pixel Integration
- ✅ Added fbp + fbc tracking to AddToCart event
- ✅ Added fbp + fbc tracking to Lead event
- ✅ Save fbp + fbc in orders table
- ✅ Async/await fbp initialization (2 second timeout)
- ✅ Debug logging for tracking flow

### Code Cleanup
- ✅ Removed 18 debug documentation files
- ✅ Removed 12 unused scripts
- ✅ Removed unused service files
- ✅ Project is now clean and production-ready

---

## 📄 License

This project is part of a private e-commerce initiative.

---

**Status: ✅ Production Ready**

Last Updated: October 13, 2026
