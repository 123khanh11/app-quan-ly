-- ============================================
-- GHN SUPABASE TABLES - FIX VERSION
-- ============================================
-- Paste all this SQL vào Supabase SQL Editor và click RUN
-- Đặc biệt: Xóa constraint cũ trước, tạo lại từ đầu

-- DROP OLD TABLES (nếu có)
DROP TABLE IF EXISTS ghn_wards CASCADE;
DROP TABLE IF EXISTS ghn_districts CASCADE;
DROP TABLE IF EXISTS ghn_provinces CASCADE;

-- ============================================
-- TABLE 1: GHN_PROVINCES
-- ============================================
CREATE TABLE ghn_provinces (
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
-- TABLE 2: GHN_DISTRICTS
-- ============================================
CREATE TABLE ghn_districts (
  id BIGSERIAL PRIMARY KEY,
  province_id INTEGER NOT NULL,
  district_id INTEGER NOT NULL UNIQUE,
  district_name VARCHAR(100) NOT NULL,
  district_name_en VARCHAR(100),
  support_type SMALLINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_districts_province FOREIGN KEY (province_id) REFERENCES ghn_provinces(province_id) ON DELETE CASCADE
);

CREATE INDEX idx_province_district ON ghn_districts(province_id);
CREATE INDEX idx_district_id ON ghn_districts(district_id);
CREATE INDEX idx_district_name ON ghn_districts(district_name);

-- ============================================
-- TABLE 3: GHN_WARDS
-- ============================================
CREATE TABLE ghn_wards (
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
  CONSTRAINT fk_wards_district FOREIGN KEY (district_id) REFERENCES ghn_districts(district_id) ON DELETE CASCADE,
  CONSTRAINT fk_wards_province FOREIGN KEY (province_id) REFERENCES ghn_provinces(province_id) ON DELETE CASCADE
);

CREATE INDEX idx_district_ward ON ghn_wards(district_id);
CREATE INDEX idx_ward_code ON ghn_wards(ward_code);
CREATE INDEX idx_ward_name ON ghn_wards(ward_name);
CREATE INDEX idx_province_ward ON ghn_wards(province_id);

-- ============================================
-- ENABLE RLS (Row Level Security)
-- ============================================
ALTER TABLE ghn_provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE ghn_districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ghn_wards ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - Allow SELECT for everyone
-- ============================================
CREATE POLICY "Allow read provinces" ON ghn_provinces FOR SELECT USING (true);
CREATE POLICY "Allow read districts" ON ghn_districts FOR SELECT USING (true);
CREATE POLICY "Allow read wards" ON ghn_wards FOR SELECT USING (true);
