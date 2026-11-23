# Implementation Plan: Per-Variant Pricing

## Decision Rationale

**Include both `variant_price` and `price` in SELECT query:**
The migration script adds an optional `variant_price` column to `product_variants`. To support both old DBs (without the column) and new ones (with it), we query both columns. Supabase silently returns `null` for missing columns, so the fallback chain handles both cases seamlessly.

**Fallback priority: `variant_price` → `price` → `sale_price`:**
If a variant has a dedicated `variant_price`, use it (new feature). If not, fall back to the existing `price` field (backward compatibility). If that's missing, fall back to the product's `sale_price`. This ensures no variant ever displays null and old data continues to work.

**ProductDetailPage already correct:**
The component already uses `selectedVariant?.variant_price || product.product_price` for display and cart operations. No changes needed there.

---

## Implementation Steps

- [ ] 1. Update the SELECT query in `getProductDetails()` to fetch both `price` and `variant_price`.
      Add `variant_price` to the product_variants select clause to include the new column in results.
      Files: `src/services/supabase.ts`
      Verify: `npm run build` from workspace root completes with no TypeScript errors.

- [ ] 2. Update the variant mapping logic in `getProductDetails()` to use the fallback chain.
      Change line ~288 from `variant_price: v.price,` to `variant_price: v.variant_price ?? v.price ?? data.sale_price,` to prioritize the new column while falling back to existing price fields.
      Files: `src/services/supabase.ts`
      Verify: `npm run build` from workspace root completes with no TypeScript errors; verify the mapping matches the ProductDetail interface (variant_price: number is required).

- [ ] 3. Confirm ProductDetailPage.tsx displays and passes variant prices correctly.
      Inspect line ~230 (price display) and line ~283 (addToCart) to confirm both use `selectedVariant?.variant_price || product.product_price`. No changes needed if both are present.
      Files: `src/app/components/shop/ProductDetailPage.tsx`
      Verify: Inspect the file and confirm the fallback logic is in place. File review only, no changes needed.

- [ ] 4. Final build verification.
      Run the full build command to ensure all TypeScript compiles without errors and the app is ready.
      Files: (no source changes)
      Verify: `npm run build` from workspace root completes successfully with exit code 0 and produces a dist/ directory. Confirm no warnings or errors in the build log.

---

## Notes

- **Database migration:** The migration script at `scripts/add-variant-price.sql` should NOT be run. The fallback logic handles both old (no `variant_price` column) and new (with `variant_price` column) database states.
- **Backward compatibility:** Products without variants or variants without `variant_price` values will continue to use the product's `sale_price`, ensuring no breaking changes.
