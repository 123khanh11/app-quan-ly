-- =====================================================
-- Tạo bảng ORDER_ITEMS (Chi tiết sản phẩm trong đơn)
-- =====================================================

CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  product_id uuid NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(12, 2) NOT NULL,
  total_price numeric(12, 2) NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
  CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id)
) TABLESPACE pg_default;

-- =====================================================
-- Enable RLS
-- =====================================================

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies
-- =====================================================

-- Policy 1: Anyone can view order items
CREATE POLICY "Allow public read order_items" 
ON public.order_items 
FOR SELECT 
USING (true);

-- Policy 2: Authenticated users can insert
CREATE POLICY "Allow authenticated insert order_items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Policy 3: Authenticated users can update
CREATE POLICY "Allow authenticated update order_items" 
ON public.order_items 
FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Policy 4: Authenticated users can delete
CREATE POLICY "Allow authenticated delete order_items" 
ON public.order_items 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- =====================================================
-- Create Indexes
-- =====================================================

CREATE INDEX idx_order_items_order_id ON public.order_items (order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items (product_id);

-- =====================================================
-- Test Data
-- =====================================================

-- Insert sample order items (adjust order_id & product_id accordingly)
-- INSERT INTO public.order_items (order_id, product_id, quantity, unit_price, total_price)
-- VALUES
--   ('order-id-here', 'product-id-here', 2, 89000, 178000),
--   ('order-id-here', 'product-id-here', 1, 299000, 299000);

-- =====================================================
-- Queries
-- =====================================================

-- View all order items
-- SELECT oi.*, p.name, p.sku 
-- FROM order_items oi
-- JOIN products p ON oi.product_id = p.id
-- ORDER BY oi.created_at DESC;

-- View items in specific order
-- SELECT oi.*, p.name, p.sku 
-- FROM order_items oi
-- JOIN products p ON oi.product_id = p.id
-- WHERE oi.order_id = 'order-id-here';

-- Total revenue per product
-- SELECT 
--   p.name, 
--   p.sku, 
--   SUM(oi.quantity) as total_qty,
--   SUM(oi.total_price) as revenue
-- FROM order_items oi
-- JOIN products p ON oi.product_id = p.id
-- GROUP BY p.id, p.name, p.sku
-- ORDER BY revenue DESC;
