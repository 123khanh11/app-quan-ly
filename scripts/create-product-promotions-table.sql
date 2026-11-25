-- Tạo table product_promotions để lưu khuyến mại theo số lượng
CREATE TABLE IF NOT EXISTS public.product_promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  min_quantity INTEGER NOT NULL CHECK (min_quantity > 0),
  promotion_type TEXT NOT NULL CHECK (promotion_type IN ('free_shipping', 'percentage_discount', 'fixed_discount')),
  promotion_value DECIMAL(10, 2),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tạo index để tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_product_promotions_product_id
ON public.product_promotions(product_id);

CREATE INDEX IF NOT EXISTS idx_product_promotions_min_quantity
ON public.product_promotions(min_quantity);

-- Enable RLS
ALTER TABLE public.product_promotions ENABLE ROW LEVEL SECURITY;

-- Policy cho SELECT (tất cả người dùng có thể xem)
CREATE POLICY "Allow select product_promotions"
ON public.product_promotions FOR SELECT
USING (true);

-- Policy cho INSERT (authenticated users)
CREATE POLICY "Allow insert product_promotions"
ON public.product_promotions FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Policy cho UPDATE (authenticated users)
CREATE POLICY "Allow update product_promotions"
ON public.product_promotions FOR UPDATE
USING (auth.role() = 'authenticated');

-- Policy cho DELETE (authenticated users)
CREATE POLICY "Allow delete product_promotions"
ON public.product_promotions FOR DELETE
USING (auth.role() = 'authenticated');

-- Tạo trigger để tự động update updated_at
CREATE OR REPLACE FUNCTION update_product_promotions_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_promotions_timestamp
BEFORE UPDATE ON public.product_promotions
FOR EACH ROW
EXECUTE FUNCTION update_product_promotions_timestamp();
