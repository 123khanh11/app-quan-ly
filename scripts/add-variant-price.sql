-- Add price column to product_variants table
-- This allows each variant to have its own price

ALTER TABLE product_variants
ADD COLUMN IF NOT EXISTS variant_price INT;

-- Update variant_price with current product prices (as default)
-- You can manually update each variant's price in the admin panel

-- Example: Set different prices for variants
-- UPDATE product_variants SET variant_price = 100000 WHERE id = '...';

-- Make sure variant_price is used in queries
-- If variant_price is NULL, fallback to product.sale_price in the app

COMMENT ON COLUMN product_variants.variant_price IS 'Individual price for this variant (optional, overrides product sale_price)';
