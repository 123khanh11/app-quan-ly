# Variant Selector UI Responsive Fix

Enhanced variant selection with larger, responsive buttons and a modal showing products for each variant combination. Variants now display properly on mobile (previously truncated), and clicking a color or size button opens a modal listing all products matching that variant.

The fix addresses mobile usability by converting the variant layout from flex-wrap to a responsive grid (2 columns on mobile, 3 on tablet, 4 on desktop), increasing button sizes from `px-4 py-2` to `px-6 py-3`, and adding a modal component that surfaces the full product list for a selected variant. This is a UI-only change with no impact on pricing logic, cart handling, or product data.

**Watch for:** Modal closure works via X button, Escape key, and backdrop click. No TypeScript errors or type unsafety. Variant selection logic (setting active variant, price display) is preserved.

**Verdict**: APPROVED

---

## High-level view

The variant buttons on mobile are now visible and properly sized. The layout switched from `flex flex-wrap` to `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`, guaranteeing 2-column layout on small screens where variants were previously hidden or compressed. Button padding increased to make them easier to tap on touch devices.

A new VariantModal component displays all products matching a selected color-size combination. When a user clicks a color or size button, the modal opens with a list showing SKU, price, and stock status. The modal is fully responsive, sliding from the bottom on mobile and centering on desktop. It closes via X button, Escape key, or backdrop click, with proper event propagation handling to avoid accidental closes.

The modal receives filtered variant data (all variants matching the selected color and size) and renders them with Vietnamese localization for currency and stock labels. TypeScript interfaces properly type the variant and product objects, avoiding unsafe casts.

Modal and variant selection are independent concerns. Clicking a variant button both updates the main product view (image, price, description) and opens the modal—these flows don't interfere. The existing variant selection logic that surfaces prices and images is untouched.

---

<details>
<summary>Issues (0)</summary>

No blocking concerns.

</details>

<details>
<summary>Details</summary>

### Mobile visibility and responsive grid

The variant buttons are rendered with `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3`, ensuring a fixed 2-column layout on mobile screens where the previous `flex flex-wrap` could collapse or hide buttons due to space constraints. The grid approach is more predictable and the increased gap (3 units) provides better spacing on touch devices. Button sizes grew from `px-4 py-2` (10px × 8px padding) to `px-6 py-3` (24px × 12px padding), making touch targets substantially larger and reducing misclicks on mobile.

Both color and size variant sections use identical grid styling, maintaining consistent UX across both variant types.

### VariantModal component design and responsiveness

The modal is a new presentational component that accepts variant metadata (color, size, variant_id) and a filtered product list. It renders a header with the variant label (e.g., "Sản phẩm thuộc loại Red - M"), a scrollable product list, and a close button.

The modal layout is fully responsive: on mobile (`items-end`), it slides from the bottom; on desktop and tablet (`sm:items-center`), it centers. The header uses `sm:hidden` to show a `<br>` only on mobile, ensuring the title wraps to two lines on small screens where space is tight but stays on one line on larger screens. The modal uses `z-50` for the modal container and `z-40` for the backdrop, correctly layering above other page content.

Closing is implemented via three paths: X button click, Escape key (via `useEffect` listener), and backdrop click. The backdrop click handler calls `e.stopPropagation()` on the modal itself to prevent bubbling and unintended closes. This is correct event handling—the modal stops propagation so a click inside the modal doesn't bubble to the backdrop handler.

Products display with color, size, SKU, price, and stock status. Stock rendering is conditional (green "Còn N" for in-stock, red "Hết hàng" for out-of-stock). Price uses Vietnamese locale formatting (`toLocaleString('vi-VN')`) with the đ currency symbol. No prices are hard-coded; they come from variant data.

### VariantModal TypeScript safety

The component uses `VariantModalProps` and `VariantProduct` interfaces with no `any` types. The variant prop is nullable and the component returns `null` when closed, avoiding unnecessary DOM rendering.

### Modal integration into ProductDetailPage

The ProductDetailPage adds state `selectedVariantForModal` to track which variant should display in the modal. When a color or size button is clicked, the button handler opens the modal and passes the full variant object.

The modal receives filtered products matching the selected color AND size combination. Modal closing sets state to `null`, which closes the modal and clears state.

### Variant selection logic preservation

Clicking a variant button updates `selectedVariant` (driving the product view), resets the image index, and opens the modal via `selectedVariantForModal`. These state updates don't interfere. Price display remains correct: `selectedVariant?.variant_price || product.product_price` prioritizes variant pricing when available, and the modal uses the same logic for consistency.

### Potential edge case: modal scroll on small screens

The modal caps height at 90% viewport (`max-h-[90vh]`). On very small screens with many products, the list scrolls extensively but remains accessible. This is acceptable—hiding products wouldn't be better.

</details>

---

## File map

<details>
<summary>Files changed</summary>

- `src/app/components/shop/VariantModal.tsx` — New component (97 lines). Modal dialog displaying products for a selected variant (color-size combination). Handles close via X button, Escape key, and backdrop click. Responsive layout (bottom sheet on mobile, centered on desktop). No external dependencies beyond React and lucide-react icons.

- `src/app/components/shop/ProductDetailPage.tsx` — Modified. Added VariantModal import and state management (`selectedVariantForModal`). Converted variant grid from `flex flex-wrap` to `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` with increased button padding (`px-6 py-3`). Modal rendering at component end passes filtered variant data. Existing variant selection and price display logic untouched.

[Full diff available via `git diff master`]

</details>
