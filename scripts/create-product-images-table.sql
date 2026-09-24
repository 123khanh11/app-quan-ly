-- Create product_images table for product-level images
CREATE TABLE IF NOT EXISTS public.product_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  image_url text NOT NULL,
  is_main boolean NULL DEFAULT false,
  sort_order integer NULL DEFAULT 0,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT product_images_pkey PRIMARY KEY (id),
  CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_images_product_id 
  ON public.product_images USING btree (product_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_product_images_sort_order 
  ON public.product_images USING btree (product_id, sort_order) TABLESPACE pg_default;

-- Create trigger to update product timestamp when images are modified
CREATE OR REPLACE FUNCTION update_product_updated_at_from_images()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET updated_at = NOW() WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_product_on_image_change ON product_images;

CREATE TRIGGER trigger_update_product_on_image_change
AFTER INSERT OR UPDATE OR DELETE ON product_images
FOR EACH ROW
EXECUTE FUNCTION update_product_updated_at_from_images();

-- Verify table was created
SELECT COUNT(*) as product_image_count FROM product_images;
