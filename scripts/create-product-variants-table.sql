-- Create product_variants table if not exists
CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  size text NULL,
  color text NULL,
  sku text NULL,
  stock integer NULL DEFAULT 0,
  price numeric(12, 2) NULL,
  barcode text NULL,
  weight_kg numeric NULL,
  length_cm numeric NULL,
  width_cm numeric NULL,
  height_cm numeric NULL,
  cost_price numeric NULL,
  is_active boolean NULL DEFAULT true,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  image_url text NULL,
  CONSTRAINT product_variants_pkey PRIMARY KEY (id),
  CONSTRAINT product_variants_barcode_key UNIQUE (barcode),
  CONSTRAINT product_variants_sku_key UNIQUE (sku),
  CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id 
  ON public.product_variants USING btree (product_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_product_variants_sku 
  ON public.product_variants USING btree (sku) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_product_variants_color_size 
  ON public.product_variants USING btree (product_id, color, size) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_product_variants_image_url 
  ON public.product_variants USING btree (image_url) TABLESPACE pg_default;

-- Create triggers
CREATE OR REPLACE FUNCTION update_product_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET updated_at = NOW() WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_variant_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop triggers if they exist
DROP TRIGGER IF EXISTS trigger_update_product_on_variant_delete ON product_variants;
DROP TRIGGER IF EXISTS trigger_update_product_on_variant_insert ON product_variants;
DROP TRIGGER IF EXISTS trigger_update_product_on_variant_update ON product_variants;
DROP TRIGGER IF EXISTS trigger_update_variant_timestamp ON product_variants;

-- Create triggers
CREATE TRIGGER trigger_update_product_on_variant_delete
AFTER DELETE ON product_variants
FOR EACH ROW
EXECUTE FUNCTION update_product_updated_at();

CREATE TRIGGER trigger_update_product_on_variant_insert
AFTER INSERT ON product_variants
FOR EACH ROW
EXECUTE FUNCTION update_product_updated_at();

CREATE TRIGGER trigger_update_product_on_variant_update
AFTER UPDATE ON product_variants
FOR EACH ROW
EXECUTE FUNCTION update_product_updated_at();

CREATE TRIGGER trigger_update_variant_timestamp
AFTER UPDATE ON product_variants
FOR EACH ROW
EXECUTE FUNCTION update_variant_timestamp();

-- Verify table was created
SELECT COUNT(*) as variant_count FROM product_variants;
SELECT COUNT(*) as product_count FROM products;
