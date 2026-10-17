# BUG REPORT
**E-Commerce Website Interface v1.0.0**  
**Report Date:** 17/10/2026  
**Prepared By:** AI Test Agent (Kiro)  

---

## BUG-001: Weight Validation Not Strictly Enforced ⚠️ MEDIUM

### Basic Information
| Field | Value |
|-------|-------|
| **Bug ID** | BUG-001 |
| **Title** | Weight Validation Not Strictly Enforced |
| **Severity** | MEDIUM |
| **Priority** | HIGH |
| **Status** | OPEN |
| **Component** | api/shipping-fee.mjs |
| **Test Case** | TC-F06-006 / TC-API-006 |
| **Date Found** | 17/10/2026 |
| **Found By** | AI Test Agent |

### Description
The `/api/shipping-fee` endpoint accepts weight values below 200g (the documented minimum) instead of rejecting them. According to the API specification (FR6.2 from SRS), weight must be validated in the range 200-20000g.

**Current Behavior:**
```
Request:  POST /api/shipping-fee
Body:     { "to_district_id": 1454, "to_ward_code": "21616", "weight_gram": 100 }
Response: Status 200 OK + Fallback fee (estimated)
Expected: Status 400 Bad Request + Error message
```

### Root Cause
The API implements a fallback mechanism when GHN API fails, but does NOT validate the minimum weight threshold before making the GHN call. The function checks:
- ✅ If GHN fails → return estimated fee
- ❌ NOT checking: if weight < 200g → return error

**Current Code (api/shipping-fee.mjs):**
```javascript
// Line ~60
weight_gram = Math.max(parseInt(weight_gram) || 1000, 200)  // ← Pads to min, doesn't reject
```

This line uses `Math.max()` to ensure minimum, but should VALIDATE and REJECT if user-provided weight is < 200g.

### Steps to Reproduce
1. Use Postman or similar API client
2. Send POST request to `/api/shipping-fee`
3. Set `weight_gram: 100` (below 200g minimum)
4. Expected: Status 400 error
5. Actual: Status 200 + estimated fee

### Test Case Details
```json
{
  "to_district_id": 1454,
  "to_ward_code": "21616",
  "weight_gram": 100
}
```

**Expected Result:**
```json
{
  "success": false,
  "error": "Invalid weight: 100g (must be 200-20000g)"
}
Status: 400 Bad Request
```

**Actual Result:**
```json
{
  "success": true,
  "data": {
    "total": 20000,
    "service_fee": 20000,
    ...
  }
}
Status: 200 OK
```

### Impact Analysis
- **Severity:** MEDIUM - Fallback behavior is safe, but violates API contract
- **Scope:** Affects shipping fee calculation edge cases
- **User Impact:** Low - Users cannot input weight directly (it comes from product DB), but API is not defensive
- **Business Impact:** Low - Fallback fee is reasonable default

### Recommended Fix
**Option 1: Strict Validation (Recommended)**
```javascript
// In api/shipping-fee.mjs, before GHN API call
weight_gram = parseInt(weight_gram) || 1000;

// Add validation
if (weight_gram < 200 || weight_gram > 20000) {
  console.error('❌ Invalid weight:', weight_gram);
  return res.status(400).json({
    success: false,
    error: `Invalid weight: ${weight_gram}g (must be 200-20000g)`
  });
}
```

**Option 2: Silent Fallback (Current, but not recommended)**
- Keep auto-padding to 200g minimum
- Document this behavior in API schema
- Risk: Hidden bugs if weight is truly invalid

### Testing the Fix
```javascript
// Test 1: Weight too low
POST /api/shipping-fee { weight_gram: 100 }
Expected: Status 400

// Test 2: Weight at min boundary
POST /api/shipping-fee { weight_gram: 200 }
Expected: Status 200 OK

// Test 3: Weight above max
POST /api/shipping-fee { weight_gram: 25000 }
Expected: Status 200 OK

// Test 4: Weight way above max
POST /api/shipping-fee { weight_gram: 30000 }
Expected: Status 400
```

### Acceptance Criteria
- [ ] Weight < 200g returns Status 400
- [ ] Weight > 20000g returns Status 400
- [ ] Weight in range [200, 20000] returns Status 200
- [ ] Error message is clear and helpful
- [ ] Fix does not break existing functionality

### Files to Modify
- `api/shipping-fee.mjs` - Add strict validation

### Related Documentation
- SRS v1.0.0, Section 2.3.6 (UC-06: Tính phí vận chuyển)
- FR6.2: Trọng lượng tính toán 500g/sản phẩm, tối thiểu 1kg (1000g)
- Test Plan: TC-F06-006, TC-API-006

### Attachments
- Test Case: TC-F06-006 in TEST_CASES_COMPREHENSIVE.md
- API Payload: Example request/response in TEST_EXECUTION_REPORT.md

---

## SUMMARY OF FINDINGS

| Bug ID | Title | Severity | Status | Fix Effort |
|--------|-------|----------|--------|-----------|
| BUG-001 | Weight Validation | MEDIUM | OPEN | 15 min |

**Total Bugs Found:** 1 MEDIUM (0 HIGH, 1 MEDIUM, 0 LOW)

**Recommendation:** 
✅ FIX BEFORE PRODUCTION DEPLOYMENT

The bug is low-risk but should be fixed to maintain API contract integrity and defensive programming practices.

---

**Report Approved By:** Test Manager  
**Status:** AWAITING DEVELOPER RESPONSE  
**Follow-up Date:** TBD  
