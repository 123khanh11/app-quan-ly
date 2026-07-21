-- Script SQL để setup database trong Supabase
-- Copy và paste vào SQL Editor trong Supabase Dashboard

-- 1. Tạo các bảng chính
CREATE TABLE IF NOT EXISTS public.categories (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    slug text UNIQUE,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT categories_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.brands (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT brands_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL,
    full_name text,
    phone text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.products (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    category_id uuid,
    brand_id uuid,
    name text NOT NULL,
    slug text UNIQUE,
    sku text UNIQUE,
    description text,
    price numeric NOT NULL,
    sale_price numeric,
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT products_pkey PRIMARY KEY (id),
    CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id),
    CONSTRAINT products_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id)
);

CREATE TABLE IF NOT EXISTS public.product_variants (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    product_id uuid NOT NULL,
    size text,
    color text,
    sku text UNIQUE,
    stock integer DEFAULT 0,
    price numeric,
    CONSTRAINT product_variants_pkey PRIMARY KEY (id),
    CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.product_images (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    product_id uuid,
    image_url text NOT NULL,
    is_main boolean DEFAULT false,
    CONSTRAINT product_images_pkey PRIMARY KEY (id),
    CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.addresses (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    receiver_name text,
    phone text,
    province text,
    district text,
    ward text,
    detail text,
    is_default boolean DEFAULT false,
    CONSTRAINT addresses_pkey PRIMARY KEY (id),
    CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.carts (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    variant_id uuid,
    quantity integer DEFAULT 1,
    CONSTRAINT carts_pkey PRIMARY KEY (id),
    CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
    CONSTRAINT carts_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.orders (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    total numeric NOT NULL DEFAULT 0,
    shipping_fee numeric DEFAULT 0,
    payment_method text,
    payment_status text DEFAULT 'pending'::text,
    order_status text DEFAULT 'pending'::text,
    shipping_address text,
    note text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT orders_pkey PRIMARY KEY (id),
    CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    order_id uuid,
    variant_id uuid,
    quantity integer NOT NULL,
    price numeric NOT NULL,
    CONSTRAINT order_items_pkey PRIMARY KEY (id),
    CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE,
    CONSTRAINT order_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id)
);

CREATE TABLE IF NOT EXISTS public.reviews (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    product_id uuid,
    rating integer CHECK (rating >= 1 AND rating <= 5),
    comment text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT reviews_pkey PRIMARY KEY (id),
    CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
    CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);

-- 2. Tạo trigger tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. Tạo profile tự động khi user đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 5. Tạo policies (cho phép đọc công khai, admin có thể sửa)
-- Products (public read, authenticated write)
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert products" ON public.products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update products" ON public.products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete products" ON public.products FOR DELETE USING (auth.role() = 'authenticated');

-- Categories
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage categories" ON public.categories FOR ALL USING (auth.role() = 'authenticated');

-- Brands
CREATE POLICY "Public can view brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage brands" ON public.brands FOR ALL USING (auth.role() = 'authenticated');

-- Orders
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated can view all orders" ON public.orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update orders" ON public.orders FOR UPDATE USING (auth.role() = 'authenticated');

-- 6. Thêm dữ liệu mẫu
INSERT INTO public.categories (name, slug) VALUES
('Điện thoại', 'dien-thoai'),
('Laptop', 'laptop'),
('Phụ kiện', 'phu-kien'),
('Tablet', 'tablet')
ON CONFLICT DO NOTHING;

INSERT INTO public.brands (name) VALUES
('Apple'),
('Samsung'),
('Xiaomi'),
('Oppo'),
('Vivo')
ON CONFLICT DO NOTHING;

-- 7. Tạo indexes để tăng performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- Hoàn thành!
-- Bây giờ bạn có thể tạo user để đăng nhập vào ứng dụng
