# Meta Pixel fbp + fbc Setup Guide

## Overview
This document explains how fbp (Facebook Pixel ID) and fbc (Facebook Click ID) are being tracked and stored for Meta Pixel conversion tracking.

## What are fbp and fbc?

- **fbp** (Facebook Pixel ID): A unique identifier for each user, created by Meta Pixel script and stored in `_fbp` cookie. Used for user identification.
- **fbc** (Facebook Click ID): Tracks the Facebook ad click that led to the conversion. Extracted from `fbclid` URL parameter. Used for attribution.

## Implementation

### 1. Frontend (Client-side)

#### In `src/utils/facebookPixel.ts`:
- `getFbp()` - Retrieves fbp from `_fbp` cookie
- `getFbc()` - Extracts fbp from `fbclid` URL parameter or sessionStorage
- `waitForFbp(timeout)` - Async function that waits for Meta Pixel to create fbp cookie

#### In Components:
- **ProductDetailPage.tsx** - Tracks `AddToCart` with fbp + fbc
- **ProductDetailModal.tsx** - Tracks `AddToCart` with fbp + fbc  
- **PaymentModal.tsx** - Retrieves fbp + fbc and passes to order creation
- **CheckoutForm.tsx** - Includes fbp + fbc in order data sent to API

### 2. Backend (Server-side)

#### In `src/services/supabase.ts`:
- Updated `Order` interface to include `fbp` and `fbc` fields
- Updated `createOrder()` function signature to accept fbp + fbc

#### In `api/orders.mjs`:
- Already accepts fbp + fbc in the order object and passes to Supabase

### 3. Database

#### Migration needed:
Run the SQL script to add fbp + fbc columns to orders table:

```bash
# Using Supabase CLI
supabase migration add add_fbp_fbc_to_orders

# Or manually run SQL in Supabase dashboard:
# scripts/add-fbp-fbc-to-orders.sql
```

SQL adds:
```sql
ALTER TABLE orders
ADD COLUMN fbp VARCHAR(255) DEFAULT NULL,
ADD COLUMN fbc VARCHAR(255) DEFAULT NULL;

CREATE INDEX idx_orders_fbp ON orders(fbp);
CREATE INDEX idx_orders_fbc ON orders(fbc);
```

## Data Flow

### When user clicks "Add to Cart":
1. `trackAddToCart()` is called
2. Waits up to 2 seconds for fbp cookie (created by Meta Pixel script)
3. Gets fbc from URL parameter or sessionStorage
4. Sends AddToCart event to Meta Pixel with fbp + fbc
5. Console logs: `🛒 [Meta Pixel] Tracking AddToCart with fbp + fbc: { ..., fbp: "fb.1.xxx", fbc: "fb.1.xxx" }`

### When user clicks "Confirm Order":
1. `PaymentModal` retrieves fbp + fbc on component mount
2. User selects payment method
3. When clicking confirm:
   - `trackLead()` is called with fbp + fbc
   - fbp + fbc are passed to `handlePaymentConfirm()`
4. Order is created with fbp + fbc included:
   ```json
   {
     "order": {
       "customer_name": "...",
       "total": 100000,
       "fbp": "fb.1.1234567890.9876543210",
       "fbc": "fb.1.1234567890.abcdefg",
       ...
     },
     "items": [...]
   }
   ```
5. Order is saved to Supabase with fbp + fbc

## Verification

### Check if fbp is being captured:
1. Open site in browser
2. Open DevTools → Console
3. Look for logs like:
   ```
   ✅ [Meta Pixel] fbp cookie found after XXXms
   🛒 [Meta Pixel] Tracking AddToCart with fbp + fbc: { fbp: "fb.1.xxx", ... }
   ```

### Check if fbp + fbc are saved in order:
1. Go to Supabase dashboard
2. Open `orders` table
3. Look for `fbp` and `fbc` columns with values like:
   - fbp: `fb.1.1234567890.9876543210`
   - fbc: `fb.1.1234567890.abcdefghij`

### Send fbp + fbc to data provider:
When sending order data to external services (e.g., CRM, analytics), include:
```json
{
  "order_id": "...",
  "customer_name": "...",
  "fbp": "fb.1.xxx",
  "fbc": "fb.1.xxx",
  ...
}
```

## Troubleshooting

### fbp not showing in console:
- Wait a few seconds for Meta Pixel script to initialize
- Check DevTools → Application → Cookies for `_fbp` cookie
- If no `_fbp` cookie exists, Meta Pixel script may not have loaded

### fbc not captured:
- Only appears if user clicked a Facebook ad with `fbclid` parameter
- For non-ad traffic, fbc will be empty (which is normal)
- Check URL for `?fbclid=...` parameter

### Order created without fbp + fbc:
- Check if Supabase columns were added (run migration)
- Verify frontend is passing fbp + fbc in API request
- Check browser console for errors

## Next Steps

1. **Run the SQL migration** to add fbp + fbc columns to orders table
2. **Test the flow**: Add product to cart → Confirm order → Check order in Supabase
3. **Send fbp + fbc to data provider** (CRM, analytics platform, etc.)
4. **Monitor Meta Pixel** in Events Manager to verify Lead events are being received

