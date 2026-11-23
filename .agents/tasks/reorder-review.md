# Variants selector repositioned to right column

The Variants selector (Chọn Loại Sản Phẩm) has been moved from above the product image grid to below the product description in the right column. The mobile-only variants block that appeared between the price and image grid has been removed entirely. The selector now displays on both mobile and desktop without visibility breakpoint hiding.

Watch for: No structural issues detected. The layout shift is clean and the selector remains fully interactive and responsive.

**Verdict**: APPROVED

## High-level view

The Variants selector is now positioned after the desktop-only price display and before the Quantity selector, all within the right column of the main grid. The selector maintains responsive behavior with `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` for color and size buttons, adapting automatically to screen size. The top-level mobile-only price and variants block that previously appeared between the price section and image grid is gone, eliminating the redundant layout. No conditional visibility hiding is applied to the variants container itself — it's the same component for all breakpoints.

<details>
<summary>Issues (0)</summary>

No blocking concerns.

</details>

<details>
<summary>Details</summary>

## Structure: Right column now contains description → price → variants → quantity

The grid structure wraps the description, price, variants, and quantity in the right column (`grid-cols-1 md:grid-cols-2`). The Variants section is a sibling of the description and price sections, appearing after the desktop-only price (`hidden md:block`) and before the Quantity section. The color and size button grids use responsive column counts (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3`), so they adapt naturally without needing container-level breakpoint hiding.

## Mobile and desktop alignment

The mobile-only price section (`md:hidden`) remains above the image grid, as intended. Inside the right column, the desktop-only price section (`hidden md:block`) appears just before the Variants selector. Because the Variants selector has no breakpoint classes on its container, it renders on all screen sizes. The responsive button grid handles size adaptation — on small screens the buttons stack tighter (2-3 columns), on larger screens they spread wider (4 columns). This keeps the selector visible and functional across all breakpoints without redundant component duplication.

## Variants selector interaction and responsiveness

The color and size buttons remain responsive with the same interactive logic: clicking a color button filters and selects a matching variant; clicking a size button does the same. The "Xem tất cả ›" (View all) buttons open the VariantModal. The selector logic and state management (`selectedVariant`, `setSelectedVariant`) are unchanged, so variant switching and image gallery updates work as before.

</details>

## File map

<details>
<summary>Files changed</summary>

**ProductDetailPage.tsx** — Removed the mobile-only Variants block that appeared between price and image grid (lines previously between the mobile-only price and the grid). Variants selector is now part of the right column layout, appearing after the desktop-only price section and before the Quantity section. No changes to variant selection logic, state management, or interactive behavior.

[Full diff against main: `git diff main src/app/components/shop/ProductDetailPage.tsx`]

</details>
