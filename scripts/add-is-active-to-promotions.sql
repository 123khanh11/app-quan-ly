-- Add is_active column to product_promotions if it doesn't exist
ALTER TABLE product_promotions
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create index on is_active for faster queries
CREATE INDEX IF NOT EXISTS idx_product_promotions_active ON product_promotions(is_active);
