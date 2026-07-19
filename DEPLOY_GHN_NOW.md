# 🚀 Deploy GHN Integration Now

## Quick Start - Choose Your Method

### ⚡ Method 1: Deploy with Vercel CLI (Easiest)

```bash
vercel --prod
```

That's it! Vercel will:
1. Upload the latest build
2. Deploy to production
3. Give you the live URL

---

### 🌐 Method 2: Manual Vercel Dashboard Deploy

1. Go to: https://vercel.com/dashboard
2. Select project: "e-commerce-website-interface"
3. Click **"Deployments"** tab
4. Click **"New Deployment"** or **"Redeploy"**
5. Wait for build to complete (~2-3 minutes)
6. Visit the URL when ready

---

### 📁 Method 3: Upload Dist Folder (If No Git)

1. In Vercel dashboard, go to **Settings** → **General**
2. Look for **Framework** setting, ensure it's set correctly
3. Trigger a manual build from latest code
4. Or upload `dist/` folder directly through Vercel CLI

---

## Testing After Deployment

### Test Case 1: Checkout Form Opens
```
1. Open website
2. Add product to cart
3. Click "Đặt Hàng"
4. ✅ Form should display without errors
```

### Test Case 2: Districts Load Dynamically
```
1. Select province "Hà Nội"
2. Wait 2-3 seconds
3. Click district dropdown
4. ✅ Districts should appear (Cầu Giấy, Hoàn Kiếm, etc.)
```

### Test Case 3: Wards Load Dynamically
```
1. Select district "Ba Đình"
2. Wait 2-3 seconds
3. Click ward dropdown
4. ✅ Wards should appear
```

### Test Case 4: Shipping Fee Calculates
```
1. Select all address fields
2. Check "Phí vận chuyển" (shipping fee)
3. ✅ Should show calculated fee (not 50,000)
4. Example: 36,300 VNĐ for Hà Nội
```

### Test Case 5: Complete Checkout
```
1. Fill all fields
2. Click "Đặt Hàng"
3. ✅ Order should be created successfully
4. ✅ Show confirmation with order ID
```

---

## Check Deployment Status

### During deployment:
```
vercel --prod
# Watch the build progress
```

### After deployment:
- Check Vercel dashboard for "Ready" status
- Visit your production URL
- Open DevTools (F12) → Console
- Look for any error messages

---

## Environment Variables

The deployment already has these set in Vercel:

```
VITE_GHN_TOKEN=c518-c4bb-11ea-be3a-f636b1deefb9
VITE_GHN_SHOP_ID=885
VITE_GHN_API_URL=https://dev-online-gateway.ghn.vn/shiip/public-api/v2
```

✅ No additional configuration needed!

---

## If Something Goes Wrong

### Issue: Districts not loading
- **Cause**: GHN API not responding
- **Fix**: Wait 5 seconds, refresh page, try again
- **Fallback**: Districts will load from hardcoded backup

### Issue: Shipping fee shows "undefined"
- **Cause**: API call failed
- **Fix**: Defaults to 50,000 VNĐ
- **Debug**: Check browser console → Network tab

### Issue: MapPin error appears
- **Cause**: Old cache still in browser
- **Fix**: Hard refresh (Ctrl+F5) or clear site data
- **Or**: Open in Incognito/Private window

---

## Performance Tips

- **First load**: ~3-4 seconds (dependencies load)
- **District select**: ~1-2 seconds (API call)
- **Ward select**: ~1-2 seconds (API call)
- **Shipping fee**: ~1-2 seconds (calculation)

All timeouts have fallbacks, so if API is slow, defaults kick in.

---

## Vercel Deployment Status

**Current Project Info:**
- Project ID: `prj_A4GiHYyezaImbvhmvgKvbLkyp4xf`
- Project Name: `e-commerce-website-interface`
- Organization: `team_qwpLdzdTP5w5QVz7HKN3Aalo`

Check here: https://vercel.com/dashboard

---

## Next Steps

1. **Deploy**: Run `vercel --prod`
2. **Wait**: 2-3 minutes for build
3. **Test**: Go through all 5 test cases above
4. **Share**: Give feedback on what works/needs fixing

---

## Commands Cheat Sheet

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# Check deployment logs
vercel logs

# Redeploy latest commit
vercel --prod

# View current deployments
vercel ls
```

---

## Success Checklist

- [ ] Vercel CLI deploy completed
- [ ] Build shows "Ready" on Vercel dashboard
- [ ] Website loads without MapPin errors
- [ ] Districts load when province selected
- [ ] Wards load when district selected
- [ ] Shipping fee calculates and displays
- [ ] Can complete full checkout flow
- [ ] Order confirmation appears

✅ All checks pass = **GHN Integration Working!**

---

**Status**: Ready to deploy. Execute `vercel --prod` now!
