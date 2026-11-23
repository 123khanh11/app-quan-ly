# Per-Variant Pricing Support

This change enables per-variant pricing on products by adding `variant_price` field handling to the data layer and UI. Previously, all variants of a product shared the product's base `sale_price`; now each variant can have its own price via the optional `variant_price` column.

The approach uses nullish coalescing to implement a backward-compatible fallback chain: `variant_price` → `price` → `sale_price`. Variants without a `variant_price` continue to use the product's sale price, so existing products remain unaffected. The build passed with no TypeScript errors.

**Watch for:** The nullish coalescing operator (`??`) is used in one place and the logical OR (`||`) in another. Both are correct here but should remain consistent if future changes touch these lines.

**Verdict**: APPROVED

## High-level view

The SELECT query in `getProductDetails()` now includes `variant_price` in the product_variants selection. Because the column is optional and may not exist on older databases, Supabase returns `null` for missing columns, which the fallback logic handles.

The variant mapping applies the fallback chain `v.variant_price ?? v.price ?? data.sale_price`, prioritizing the new variant-specific price, then falling back to the variant's legacy price field, then to the product's sale price. This three-tier approach ensures no variant ever displays null regardless of which price fields are populated.

The UI uses `selectedVariant?.variant_price || product.product_price` for price display and cart operations. No changes were needed in the presentation layer.

<details>
<summary>Issues (1)</summary>

1. **Mixed fallback operators** — The data layer uses `??` (nullish coalescing) and the UI uses `||` (logical OR). While both work for the current use case, they can diverge if prices ever legitimately become `0` or `false`. Standardize on `??` across both layers for consistency.

</details>

<details>
<summary>Details</summary>

## Query and Mapping Pattern

The SELECT query in `getProductDetails()` now includes `variant_price` alongside the existing `price` field when fetching product_variants. The dual-column fetch allows the mapping logic to decide which field to use based on availability.

The mapping applies `v.variant_price ?? v.price ?? data.sale_price` to construct each variant's final price. This three-tier approach is sound: if the variant has a dedicated override price, use it; otherwise use its base price field; if that's also missing, fall back to the product's sale price as a last resort. The build succeeded, confirming the type contract between the query and the ProductDetail interface is satisfied.

## Backward Compatibility

The variant_price column is optional and may not exist on all databases. When a column is missing, Supabase returns `null` for that field, so the fallback chain correctly degrades. Products on databases without the new column continue to function—variants use their existing `price` field or the product's `sale_price`. This design avoids database migrations as a prerequisite.

## Consistency Gap: Fallback Operators

The data layer uses nullish coalescing (`??`): `v.variant_price ?? v.price ?? data.sale_price`

The UI uses logical OR (`||`): `selectedVariant?.variant_price || product.product_price`

Both produce the correct result for prices in their current range (non-zero numbers or undefined). They diverge if a price legitimately becomes `0` (free product, clearance item): under `||`, a `0` would incorrectly fall through; under `??`, it would be used. This inconsistency risks bugs if price logic changes.

## UI Changes

ProductDetailPage already displays `selectedVariant?.variant_price || product.product_price` in the price section and passes it to `addToCart()` and to the Meta Pixel tracking event. No changes to the presentation layer were needed. The same pattern is used consistently in ProductDetailModal.

## Coverage

The pattern is applied consistently across ProductDetailPage and ProductDetailModal (both use `selectedVariant?.variant_price || product.product_price`). Similar product cards display the product-level price directly, which is correct since they don't expose variant selection.

</details>

<details>
<summary>File map</summary>

- **src/services/supabase.ts**: Added `variant_price` to product_variants SELECT clause (line 337). Updated variant mapping to use fallback chain `v.variant_price ?? v.price ?? data.sale_price` (line 414). Updated ProductDetail interface type to include `variant_price: number` in the variants array type.

- **src/app/components/shop/ProductDetailPage.tsx**: No changes. File review confirmed price display (line 236) and addToCart (line 118) already use `selectedVariant?.variant_price || product.product_price`.

</details>
