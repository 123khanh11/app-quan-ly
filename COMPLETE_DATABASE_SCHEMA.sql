-- ============================================================================
-- HỆ THỐNG QUẢN LÝ BÁN HÀNG - SCHEMA ĐỦ ĐẦY (COMPLETE DATABASE SCHEMA)
-- ============================================================================
-- Ngày tạo: 2026-07-21
-- Version: 1.0 Production Ready
-- Mô tả: Toàn bộ schema database cho ứng dụng quản lý đơn hàng, sản phẩm, kho hàng
-- ============================================================================

-- ============================================================================
-- 1. BẢNG DANH MỤC (CATEGORIES)
-- ============================================================================
CREATE TABLE public.categories (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    slug text UNIQUE,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT categories_pkey PRIMARY KEY (id)
);

-- Indexes
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_name ON public.categories(name);

-- ============================================================================
-- 2. BẢNG THƯƠNG HIỆU (BRANDS)
-- ============================================================================
CREATE TABLE public.brands (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT brands_pkey PRIMARY KEY (id)
);

-- Indexes
CREATE INDEX idx_brands_name ON public.brands(name);

-- ============================================================================
-- 3. BẢNG HỒƠN SỬ DỤNG (PROFILES - Extends auth.users)
-- ============================================================================
CREATE TABLE public.profiles (
    id uuid NOT NULL,
    full_name text,
    phone text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- ============================================================================
-- 4. BẢNG SẢN PHẨM (PRODUCTS)
-- Lưu ý: KHÔNG CÓ trường stock_quantity - stock được quản lý trong product_variants
-- ============================================================================
CREATE TABLE public.products (
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
    image_url text,
    image text,
    CONSTRAINT products_pkey PRIMARY KEY (id),
    CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL,
    CONSTRAINT products_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_brand_id ON public.products(brand_id);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_active ON public.products(active);

-- ============================================================================
-- 5. BẢNG BIẾN THỂ SẢN PHẨM (PRODUCT_VARIANTS)
-- ĐÂY LÀ BẢNG QUẢN LÝ STOCK (Kích thước, Màu sắc, SKU riêng, Giá riêng, Tồn kho)
-- ============================================================================
CREATE TABLE public.product_variants (
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

-- Indexes
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON public.product_variants(sku);
CREATE INDEX idx_product_variants_stock ON public.product_variants(stock);

-- ============================================================================
-- 6. BẢNG HÌNH ẢNH SẢN PHẨM (PRODUCT_IMAGES)
-- ============================================================================
CREATE TABLE public.product_images (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    product_id uuid,
    image_url text NOT NULL,
    is_main boolean DEFAULT false,
    CONSTRAINT product_images_pkey PRIMARY KEY (id),
    CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_product_images_product_id ON public.product_images(product_id);

-- ============================================================================
-- 7. BẢNG ĐỊA CHỈ (ADDRESSES)
-- ============================================================================
CREATE TABLE public.addresses (
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

-- Indexes
CREATE INDEX idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX idx_addresses_is_default ON public.addresses(is_default);

-- ============================================================================
-- 8. BẢNG GIỎ HÀNG (CARTS)
-- ============================================================================
CREATE TABLE public.carts (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    variant_id uuid,
    quantity integer DEFAULT 1,
    CONSTRAINT carts_pkey PRIMARY KEY (id),
    CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
    CONSTRAINT carts_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_carts_user_id ON public.carts(user_id);
CREATE INDEX idx_carts_variant_id ON public.carts(variant_id);

-- ============================================================================
-- 9. BẢNG ĐƠNHÀNG (ORDERS)
-- Lưu ý: Các trường chính
--   - total: Tổng tiền (KHÔNG phải total_amount)
--   - order_status: Trạng thái đơn hàng (KHÔNG phải status)
--   - note: Ghi chú (KHÔNG phải notes)
-- ============================================================================
CREATE TABLE public.orders (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid,
    total numeric NOT NULL DEFAULT 0,
    shipping_fee numeric,
    payment_method text,
    payment_status text DEFAULT 'pending'::text,
    order_status text DEFAULT 'pending'::text,
    shipping_address text,
    note text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT orders_pkey PRIMARY KEY (id),
    CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_order_status ON public.orders(order_status);
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);

-- ============================================================================
-- 10. BẢNG CHI TIẾT ĐƠN HÀNG (ORDER_ITEMS)
-- Lưu ý: Sử dụng variant_id (KHÔNG phải product_id) để liên kết với product_variants
-- ============================================================================
CREATE TABLE public.order_items (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    order_id uuid,
    variant_id text,
    quantity integer NOT NULL,
    price numeric NOT NULL,
    CONSTRAINT order_items_pkey PRIMARY KEY (id),
    CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_variant_id ON public.order_items(variant_id);

-- ============================================================================
-- 11. BẢNG ĐÁNH GIÁ (REVIEWS)
-- ============================================================================
CREATE TABLE public.reviews (
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

-- Indexes
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_product_id ON public.reviews(product_id);

-- ============================================================================
-- 12. BẢNG TỈNH THÀNH GHN (GHN_PROVINCES)
-- ============================================================================
CREATE TABLE public.ghn_provinces (
    id bigint NOT NULL DEFAULT nextval('ghn_provinces_id_seq'::regclass),
    province_id integer NOT NULL UNIQUE,
    province_name character varying NOT NULL,
    province_name_en character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ghn_provinces_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- 13. BẢNG QUẬN HUYỆN GHN (GHN_DISTRICTS)
-- ============================================================================
CREATE TABLE public.ghn_districts (
    id bigint NOT NULL DEFAULT nextval('ghn_districts_id_seq'::regclass),
    province_id integer NOT NULL,
    district_id integer NOT NULL UNIQUE,
    district_name character varying NOT NULL,
    district_name_en character varying,
    support_type smallint DEFAULT 0,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ghn_districts_pkey PRIMARY KEY (id),
    CONSTRAINT fk_districts_province FOREIGN KEY (province_id) REFERENCES public.ghn_provinces(province_id)
);

-- ============================================================================
-- 14. BẢNG PHƯỜNG XÃGHN (GHN_WARDS)
-- ============================================================================
CREATE TABLE public.ghn_wards (
    id bigint NOT NULL DEFAULT nextval('ghn_wards_id_seq'::regclass),
    province_id integer NOT NULL,
    district_id integer NOT NULL,
    ward_code character varying NOT NULL,
    ward_name character varying NOT NULL,
    ward_name_en character varying,
    support_type smallint DEFAULT 0,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ghn_wards_pkey PRIMARY KEY (id),
    CONSTRAINT fk_wards_district FOREIGN KEY (district_id) REFERENCES public.ghn_districts(district_id),
    CONSTRAINT fk_wards_province FOREIGN KEY (province_id) REFERENCES public.ghn_provinces(province_id)
);

-- ============================================================================
-- 15. BẢNG SEQUENCE TỰ ĐỘNG TĂNG (AUTO INCREMENT)
-- ============================================================================
CREATE SEQUENCE public.ghn_provinces_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE public.ghn_districts_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE public.ghn_wards_id_seq START WITH 1 INCREMENT BY 1;

-- ============================================================================
-- DỮẪU KIỂM THỬA MẪẢU (SAMPLE DATA)
-- ============================================================================

-- Insert Danh mục
INSERT INTO public.categories (name, slug) VALUES
    ('Điện tử', 'dien-tu'),
    ('Thời trang', 'thoi-trang'),
    ('Nhà cửa', 'nha-cua'),
    ('Sách', 'sach')
ON CONFLICT DO NOTHING;

-- Insert Thương hiệu
INSERT INTO public.brands (name) VALUES
    ('Samsung'),
    ('Apple'),
    ('Sony'),
    ('Nike')
ON CONFLICT DO NOTHING;

-- Insert Sản phẩm mẫu
INSERT INTO public.products (
    name, slug, sku, category_id, brand_id, description, price, sale_price, active, image_url
) VALUES
    (
        'Điện thoại Galaxy A53',
        'dien-thoai-galaxy-a53',
        'SAMSUNG-A53-001',
        (SELECT id FROM categories WHERE slug = 'dien-tu' LIMIT 1),
        (SELECT id FROM brands WHERE name = 'Samsung' LIMIT 1),
        'Điện thoại thông minh Galaxy A53 với màn hình AMOLED 120Hz',
        8990000,
        7990000,
        true,
        'https://example.com/galaxy-a53.jpg'
    ),
    (
        'Áo thun Nam',
        'ao-thun-nam',
        'NIKE-SHIRT-001',
        (SELECT id FROM categories WHERE slug = 'thoi-trang' LIMIT 1),
        (SELECT id FROM brands WHERE name = 'Nike' LIMIT 1),
        'Áo thun nam thoáng mát, thấm hút mồ hôi',
        350000,
        250000,
        true,
        'https://example.com/tshirt.jpg'
    )
ON CONFLICT DO NOTHING;

-- Insert Biến thể sản phẩm (Variants) với tồn kho
INSERT INTO public.product_variants (product_id, size, color, sku, stock, price) VALUES
    (
        (SELECT id FROM products WHERE sku = 'SAMSUNG-A53-001' LIMIT 1),
        '6.1"',
        'Đen',
        'SAMSUNG-A53-001-BLACK',
        50,
        8990000
    ),
    (
        (SELECT id FROM products WHERE sku = 'SAMSUNG-A53-001' LIMIT 1),
        '6.1"',
        'Trắng',
        'SAMSUNG-A53-001-WHITE',
        30,
        8990000
    ),
    (
        (SELECT id FROM products WHERE sku = 'NIKE-SHIRT-001' LIMIT 1),
        'M',
        'Đen',
        'NIKE-SHIRT-001-M-BLACK',
        100,
        350000
    ),
    (
        (SELECT id FROM products WHERE sku = 'NIKE-SHIRT-001' LIMIT 1),
        'L',
        'Trắng',
        'NIKE-SHIRT-001-L-WHITE',
        80,
        350000
    )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- CẤU HÌNH ROW LEVEL SECURITY (RLS) - ĐỀ BẢO MẬT
-- ============================================================================

-- Bật RLS trên tất cả bảng
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Cho phép anonymous đọc (public data)
GRANT SELECT ON public.categories, public.brands, public.products, public.product_variants, public.product_images, public.reviews TO anon;

-- Cho phép authenticated users full access (với RLS)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories, public.brands, public.products, public.product_variants, public.product_images, public.addresses, public.carts, public.orders, public.order_items, public.reviews, public.profiles TO authenticated;

-- ============================================================================
-- CHẠY CÁC LỆNH SAU VỚI TÀI KHOẢN ADMIN
-- ============================================================================
-- 1. Chỉnh sửa RLS policies để cho phép đọc ghi dữ liệu
-- 2. Tạo tài khoản kiểm thử
-- 3. Chèn dữ liệu mẫu

-- ============================================================================
-- KẾT THÚC
-- ============================================================================
-- Schema này là phiên bản cuối cùng để dùng với ứng dụng React Vite
-- Tất cả trường tên đã được sắp xếp đúng theo yêu cầu:
--   ✅ Không có stock_quantity trong products
--   ✅ Sử dụng variant_id thay vì product_id
--   ✅ Sử dụng total thay vì total_amount
--   ✅ Sử dụng order_status thay vì status
--   ✅ Sử dụng note thay vì notes
-- ============================================================================
