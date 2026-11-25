-- Create product_promotions table
CREATE TABLE IF NOT EXISTS product_promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  min_quantity INTEGER NOT NULL DEFAULT 1,
  promotion_type TEXT NOT NULL CHECK (promotion_type IN ('free_shipping', 'percentage_discount', 'fixed_discount')),
  promotion_value DECIMAL(10, 2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_promotions_product_id ON product_promotions(product_id);
CREATE INDEX IF NOT EXISTS idx_product_promotions_active ON product_promotions(is_active);

-- Enable RLS
ALTER TABLE product_promotions ENABLE ROW LEVEL SECURITY;

-- Allow public read (for customer app)
CREATE POLICY "Allow public read" ON product_promotions
  FOR SELECT USING (is_active = true);

-- Allow authenticated users to manage (for admin app)
CREATE POLICY "Allow authenticated users to manage" ON product_promotions
  FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_product_promotions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_product_promotions_updated_at ON product_promotions;
CREATE TRIGGER trigger_product_promotions_updated_at
  BEFORE UPDATE ON product_promotions
  FOR EACH ROW
  EXECUTE FUNCTION update_product_promotions_updated_at();
