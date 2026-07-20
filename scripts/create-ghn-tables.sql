-- GHN Data Tables
-- Run this in Supabase SQL Editor to create tables

-- ============================================
-- Table 1: GHN_PROVINCES
-- ============================================
CREATE TABLE IF NOT EXISTS ghn_provinces (
  id BIGSERIAL PRIMARY KEY,
  province_id INTEGER NOT NULL UNIQUE,
  province_name VARCHAR(100) NOT NULL,
  province_name_en VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_province_id ON ghn_provinces(province_id);
CREATE INDEX idx_province_name ON ghn_provinces(province_name);

-- ============================================
-- Table 2: GHN_DISTRICTS
-- ============================================
CREATE TABLE IF NOT EXISTS ghn_districts (
  id BIGSERIAL PRIMARY KEY,
  province_id INTEGER NOT NULL,
  district_id INTEGER NOT NULL,
  district_name VARCHAR(100) NOT NULL,
  district_name_en VARCHAR(100),
  support_type SMALLINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(province_id, district_id),
  FOREIGN KEY (province_id) REFERENCES ghn_provinces(province_id) ON DELETE CASCADE
);

CREATE INDEX idx_province_district ON ghn_districts(province_id);
CREATE INDEX idx_district_id ON ghn_districts(district_id);
CREATE INDEX idx_district_name ON ghn_districts(district_name);

-- ============================================
-- Table 3: GHN_WARDS
-- ============================================
CREATE TABLE IF NOT EXISTS ghn_wards (
  id BIGSERIAL PRIMARY KEY,
  province_id INTEGER NOT NULL,
  district_id INTEGER NOT NULL,
  ward_code VARCHAR(20) NOT NULL,
  ward_name VARCHAR(100) NOT NULL,
  ward_name_en VARCHAR(100),
  support_type SMALLINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(district_id, ward_code),
  FOREIGN KEY (district_id) REFERENCES ghn_districts(district_id) ON DELETE CASCADE,
  FOREIGN KEY (province_id) REFERENCES ghn_provinces(province_id) ON DELETE CASCADE
);

CREATE INDEX idx_district_ward ON ghn_wards(district_id);
CREATE INDEX idx_ward_code ON ghn_wards(ward_code);
CREATE INDEX idx_ward_name ON ghn_wards(ward_name);
CREATE INDEX idx_province_ward ON ghn_wards(province_id);

-- ============================================
-- Enable RLS (Row Level Security)
-- ============================================
ALTER TABLE ghn_provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE ghn_districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ghn_wards ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies (Everyone can read)
-- ============================================
CREATE POLICY "Allow read provinces" ON ghn_provinces
  FOR SELECT USING (true);

CREATE POLICY "Allow read districts" ON ghn_districts
  FOR SELECT USING (true);

CREATE POLICY "Allow read wards" ON ghn_wards
  FOR SELECT USING (true);

-- ============================================
-- VIEWS for easier queries
-- ============================================

-- View: Get all data for a district
CREATE OR REPLACE VIEW v_districts_with_province AS
SELECT
  d.id,
  d.district_id,
  d.district_name,
  d.province_id,
  p.province_name,
  COUNT(w.id) as ward_count
FROM ghn_districts d
LEFT JOIN ghn_provinces p ON d.province_id = p.province_id
LEFT JOIN ghn_wards w ON d.district_id = w.district_id
GROUP BY d.id, d.district_id, d.district_name, d.province_id, p.province_name;

-- View: Get wards with district and province info
CREATE OR REPLACE VIEW v_wards_full_info AS
SELECT
  w.id,
  w.ward_code,
  w.ward_name,
  w.district_id,
  d.district_name,
  d.province_id,
  p.province_name
FROM ghn_wards w
LEFT JOIN ghn_districts d ON w.district_id = d.district_id
LEFT JOIN ghn_provinces p ON w.province_id = p.province_id;

-- ============================================
-- SAMPLE QUERIES
-- ============================================

-- Get all provinces
-- SELECT * FROM ghn_provinces ORDER BY province_name;

-- Get districts of Hà Nội (province_id = 1)
-- SELECT * FROM ghn_districts WHERE province_id = 1 ORDER BY district_name;

-- Get wards of Hà Đông (district_id = 1455)
-- SELECT * FROM ghn_wards WHERE district_id = 1455 ORDER BY ward_name;

-- Get all data for Hà Đông
-- SELECT * FROM v_wards_full_info WHERE district_id = 1455;

-- Search district by name
-- SELECT * FROM ghn_districts WHERE district_name ILIKE '%Hoàn%';

-- Count statistics
-- SELECT
--   COUNT(DISTINCT province_id) as provinces,
--   COUNT(DISTINCT district_id) as districts,
--   COUNT(*) as wards
-- FROM ghn_wards;
