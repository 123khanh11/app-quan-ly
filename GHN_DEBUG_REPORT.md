# GHN API Integration Debug Report

## Root Cause: Token/Shop ID Mismatch ❌

**Current Status**: ALL GHN API calls are failing with error:
```
❌ FAILED - Code: 400
   Message: "Tài khoản không thuộc cửa hàng"
   (Translation: "Account does not belong to this shop")
   Code: CLIENT_NOT_BELONG_OF_SHOP
```

**Why**: The GHN_TOKEN doesn't match GHN_SHOP_ID. The token was likely issued for a different shop or has expired.

## Diagnostic Test Results

Ran 6 test cases with different:
- Weights: 5kg, 20kg, 50kg
- Service types: 2 (standard), 5 (heavy)
- Destinations: Hanoi area, remote areas

**Result**: All 6 tests failed with the same error.

**Conclusion**: The issue is NOT about weight validation, ward codes, or service types. It's authentication.

## Current Configuration

```
GHN_SHOP_ID = 5430969
GHN_TOKEN = a2bb6329-1eda-4bb3-9282-01a8a011c1c8
```

## Solution: Regenerate Token

1. **Login to GHN Merchant Dashboard**:
   - Visit: https://khachhang.ghn.vn/
   - Use your GHN account credentials

2. **Navigate to API Settings**:
   - Look for "Cấu hình API" or "API Configuration"
   - Find "Token API"

3. **Verify Shop ID**:
   - Confirm your shop ID matches `5430969`
   - If different, update `.env.local` and `.env.production`

4. **Generate New Token**:
   - Delete or disable the old token
   - Create a new one
   - Copy the full token value

5. **Update Environment Variables**:
   ```
   .env.local:
   GHN_TOKEN="<new-token>"
   
   .env.production:
   GHN_TOKEN="<new-token>"
   ```

6. **Update Vercel Dashboard**:
   - Go to your Vercel project Settings → Environment Variables
   - Update GHN_TOKEN variable
   - Redeploy

7. **Test Again**:
   ```bash
   node api/test-weight-issue.mjs
   ```

## Next Steps After Token Fix

Once token is regenerated and working:

1. **Verify Weight Calculation**:
   - Frontend (CheckoutForm) multiplies weight × quantity ✓
   - Backend (shipping-fee.mjs) validates weight > 0 ✓
   - Service type auto-detection: type 2 for <20kg, type 5 for ≥20kg ✓

2. **Verify Ward Codes**:
   - Test with known valid wards (e.g., "21616")
   - Identify which wards support service type 5 (heavy goods)

3. **Fallback to Estimation**:
   - Current code returns estimated fee if GHN API fails ✓
   - Provides graceful degradation

## Files Modified in This Session

- `.env.local`: Updated GHN_TOKEN (previous fix)
- `.env.production`: Updated GHN_TOKEN (previous fix)
- `api/shipping-fee.mjs`: Weight validation & service type logic ✓
- `src/services/shipping-calculator.ts`: Correct weight calculation ✓
- `src/app/components/checkout/CheckoutForm.tsx`: Correct weight × quantity logic ✓
- `api/test-weight-issue.mjs`: Created diagnostic tool ✓

## Weight Calculation Verification

**Frontend (CheckoutForm)**:
```typescript
// ✓ CORRECT: Multiply weight per unit by quantity
const itemWeightPerUnit = (item.weight ?? 500) || 500 // gram per unit
const itemWeight = itemWeightPerUnit * itemQuantity // total for all units
totalWeight += itemWeight
```

**API (shipping-fee.mjs)**:
```javascript
// ✓ CORRECT: Accept weight_gram directly from frontend
weight_gram = parseInt(weight_gram) || 1000
// Auto-select service type
let finalServiceType = (weight_gram >= 20000) ? 5 : 2
```

**Backend calculation (shipping-calculator.ts)** - NOT currently used for checkout:
```typescript
// Note: This doesn't multiply by quantity - it assumes items array contains
// individual units, not aggregated by quantity. This is for server-side
// calculation only, not for checkout flow.
```

## Testing Checklist After Token Fix

- [ ] Test 5kg shipment → Should use service_type_id 2
- [ ] Test 20kg shipment → Should use service_type_id 5
- [ ] Test 50kg shipment → Should use service_type_id 5
- [ ] Test to Hanoi inner districts → Should calculate fee correctly
- [ ] Test to remote areas → Should include remote area surcharge
- [ ] Test API fallback when GHN fails → Should return estimation

