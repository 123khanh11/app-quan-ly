/**
 * Create GHN tables in Supabase
 * Run: node scripts/create-tables.js
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

console.log('🔍 Checking Supabase...');
console.log(`   URL: ${SUPABASE_URL ? '✓' : '✗'}`);
console.log(`   KEY: ${SUPABASE_KEY ? '✓' : '✗'}\n`);

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// SQL to create tables
const createTablesSql = `
-- GHN_PROVINCES
CREATE TABLE IF NOT EXISTS ghn_provinces (
  id BIGSERIAL PRIMARY KEY,
  province_id INTEGER NOT NULL UNIQUE,
  province_name VARCHAR(100) NOT NULL,
  province_name_en VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_province_id ON ghn_provinces(province_id);
CREATE INDEX IF NOT EXISTS idx_province_name ON ghn_provinces(province_name);

-- GHN_DISTRICTS
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

CREATE INDEX IF NOT EXISTS idx_province_district ON ghn_districts(province_id);
CREATE INDEX IF NOT EXISTS idx_district_id ON ghn_districts(district_id);
CREATE INDEX IF NOT EXISTS idx_district_name ON ghn_districts(district_name);

-- GHN_WARDS
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

CREATE INDEX IF NOT EXISTS idx_district_ward ON ghn_wards(district_id);
CREATE INDEX IF NOT EXISTS idx_ward_code ON ghn_wards(ward_code);
CREATE INDEX IF NOT EXISTS idx_ward_name ON ghn_wards(ward_name);
CREATE INDEX IF NOT EXISTS idx_province_ward ON ghn_wards(province_id);

-- Enable RLS
ALTER TABLE IF EXISTS ghn_provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ghn_districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ghn_wards ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Allow read provinces" ON ghn_provinces;
DROP POLICY IF EXISTS "Allow read districts" ON ghn_districts;
DROP POLICY IF EXISTS "Allow read wards" ON ghn_wards;

CREATE POLICY "Allow read provinces" ON ghn_provinces FOR SELECT USING (true);
CREATE POLICY "Allow read districts" ON ghn_districts FOR SELECT USING (true);
CREATE POLICY "Allow read wards" ON ghn_wards FOR SELECT USING (true);
`;

async function createTables() {
  console.log('📊 Creating tables...\n');

  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: createTablesSql,
    });

    if (error) {
      console.log('ℹ️ Trying alternative method...\n');
      
      // Alternative: execute individually
      const statements = createTablesSql.split(';').filter(s => s.trim());
      
      for (const stmt of statements) {
        if (stmt.trim()) {
          try {
            const res = await supabase.rpc('sql', { statement: stmt });
            if (res.error) console.log(`⚠️ ${res.error.message}`);
          } catch (e) {
            console.log(`⚠️ ${e.message}`);
          }
        }
      }

      console.log('\n⚠️ Could not create via RPC. Please manually run SQL in Supabase:');
      console.log('   1. Go to: https://supabase.com/dashboard');
      console.log('   2. Click "SQL Editor"');
      console.log('   3. Click "New Query"');
      console.log('   4. Paste content from: scripts/create-ghn-tables.sql');
      console.log('   5. Click "Run"\n');
      
      process.exit(1);
    }

    console.log('✅ Tables created successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠️ Could not create tables via API.');
    console.log('   Please manually run SQL in Supabase:\n');
    console.log('📋 Copy this SQL and paste in Supabase SQL Editor:');
    console.log('─'.repeat(50));
    console.log(createTablesSql);
    console.log('─'.repeat(50));
    process.exit(1);
  }
}

createTables();
