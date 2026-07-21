-- =====================================================
-- Tạo bảng PRODUCTS (Hàng hóa)
-- =====================================================

CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sku text NOT NULL UNIQUE,
  price numeric(12, 2) NOT NULL DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  description text,
  image_url text,
  category text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT products_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- =====================================================
-- Tạo RLS POLICIES cho products
-- =====================================================

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone can view products
CREATE POLICY "Allow public read" 
ON public.products 
FOR SELECT 
USING (true);

-- Policy 2: Authenticated users can insert
CREATE POLICY "Allow authenticated insert" 
ON public.products 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Policy 3: Authenticated users can update
CREATE POLICY "Allow authenticated update" 
ON public.products 
FOR UPDATE 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Policy 4: Authenticated users can delete
CREATE POLICY "Allow authenticated delete" 
ON public.products 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- =====================================================
-- Tạo INDEX để tối ưu tìm kiếm
-- =====================================================

CREATE INDEX idx_products_sku ON public.products (sku);
CREATE INDEX idx_products_name ON public.products (name);
CREATE INDEX idx_products_category ON public.products (category);

-- =====================================================
-- Dữ liệu mẫu (INSERT TEST DATA)
-- =====================================================

INSERT INTO public.products (name, sku, price, stock, description, category)
VALUES
  ('Áo Phông Nam Tay Ngắn', 'SKU001', 89000, 50, 'Áo phông cotton 100%, thoáng mát, phù hợp với mọi mùa', 'Áo thun'),
  ('Quần Jeans Nam Slim', 'SKU002', 299000, 35, 'Quần jeans phong cách hiện đại, thoải mái khi mặc', 'Quần'),
  ('Áo Khoác Gió Nam', 'SKU003', 199000, 20, 'Áo khoác chống gió, nhẹ, dễ mang', 'Áo khoác'),
  ('Giày Thể Thao Nam', 'SKU004', 599000, 15, 'Giày thể thao đế cao su, thoải mái cho hoạt động hàng ngày', 'Giày'),
  ('Mũ Lưỡi Trai Nam', 'SKU005', 49000, 60, 'Mũ lưỡi trai cotton, chắn nắng tốt', 'Mũ'),
  ('Áo Sơ Mi Nam Dài Tay', 'SKU006', 149000, 40, 'Áo sơ mi vải cotton pha, phù hợp công sở', 'Áo sơ mi'),
  ('Quần Short Nam', 'SKU007', 79000, 80, 'Quần short mặc nhà, thoáng mát', 'Quần'),
  ('Dây Lưng Nam Da Thật', 'SKU008', 129000, 25, 'Dây lưng da thật, bền bỉ', 'Phụ kiện'),
  ('Tất Nam Cotton', 'SKU009', 29000, 200, 'Tất cotton mềm mại, thoáng khí', 'Tất'),
  ('Áo Len Nam', 'SKU010', 179000, 30, 'Áo len ấm áp, thích hợp mùa lạnh', 'Áo len');

-- =====================================================
-- Verify (Kiểm tra dữ liệu)
-- =====================================================

-- Xem số lượng sản phẩm
SELECT COUNT(*) as total_products FROM public.products;

-- Xem danh sách tất cả sản phẩm
SELECT id, name, sku, price, stock, category FROM public.products ORDER BY created_at DESC;

-- Xem sản phẩm hết hàng
SELECT name, sku, stock FROM public.products WHERE stock = 0;

-- Xem sản phẩm sắp hết hàng (tồn < 20)
SELECT name, sku, stock FROM public.products WHERE stock < 20 ORDER BY stock ASC;
