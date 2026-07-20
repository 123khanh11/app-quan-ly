/**
 * GHN Data Seeding Script - Insert mock data vào Supabase
 * 
 * Run: node scripts/seed-ghn-data.js
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load env
const envPath = path.resolve(process.cwd(), '.env.local');
console.log(`📂 Loading env from: ${envPath}\n`);
dotenv.config({ path: envPath });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

console.log('🔍 Checking Supabase credentials...');
console.log(`   SUPABASE_URL: ${SUPABASE_URL ? '✓ Set' : '✗ Missing'}`);
console.log(`   SUPABASE_KEY: ${SUPABASE_KEY ? '✓ Set' : '✗ Missing'}\n`);

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================
// MOCK DATA: Hà Nội & TP.HCM
// ============================================

const provinces = [
  { province_id: 1, province_name: 'Hà Nội', province_name_en: 'Ha Noi' },
  { province_id: 202, province_name: 'Hồ Chí Minh', province_name_en: 'Ho Chi Minh' },
  { province_id: 48, province_name: 'Đà Nẵng', province_name_en: 'Da Nang' },
];

const districts = [
  // Hà Nội
  { province_id: 1, district_id: 101, district_name: 'Hoàn Kiếm', district_name_en: 'Hoan Kiem', support_type: 1 },
  { province_id: 1, district_id: 102, district_name: 'Ba Đình', district_name_en: 'Ba Dinh', support_type: 1 },
  { province_id: 1, district_id: 103, district_name: 'Tây Hồ', district_name_en: 'Tay Ho', support_type: 1 },
  { province_id: 1, district_id: 104, district_name: 'Long Biên', district_name_en: 'Long Bien', support_type: 1 },
  { province_id: 1, district_id: 105, district_name: 'Thanh Xuân', district_name_en: 'Thanh Xuan', support_type: 1 },
  { province_id: 1, district_id: 1455, district_name: 'Hà Đông', district_name_en: 'Ha Dong', support_type: 1 },
  
  // TP.HCM
  { province_id: 202, district_id: 201, district_name: 'Quận 1', district_name_en: 'District 1', support_type: 1 },
  { province_id: 202, district_id: 202, district_name: 'Quận 2', district_name_en: 'District 2', support_type: 1 },
  { province_id: 202, district_id: 203, district_name: 'Quận 3', district_name_en: 'District 3', support_type: 1 },
  { province_id: 202, district_id: 204, district_name: 'Quận 4', district_name_en: 'District 4', support_type: 1 },
  
  // Đà Nẵng
  { province_id: 48, district_id: 301, district_name: 'Hải Châu', district_name_en: 'Hai Chau', support_type: 1 },
  { province_id: 48, district_id: 302, district_name: 'Thanh Khê', district_name_en: 'Thanh Khe', support_type: 1 },
];

const wards = [
  // Hà Đông (1455)
  { province_id: 1, district_id: 1455, ward_code: '21617', ward_name: 'Dương Nội', ward_name_en: 'Duong Noi', support_type: 1 },
  { province_id: 1, district_id: 1455, ward_code: '21618', ward_name: 'La Khê', ward_name_en: 'La Khe', support_type: 1 },
  { province_id: 1, district_id: 1455, ward_code: '21619', ward_name: 'Yên Nghĩa', ward_name_en: 'Yen Nghia', support_type: 1 },
  { province_id: 1, district_id: 1455, ward_code: '21620', ward_name: 'Thanh Xuân Nam', ward_name_en: 'Thanh Xuan Nam', support_type: 1 },
  { province_id: 1, district_id: 1455, ward_code: '21621', ward_name: 'Phú La', ward_name_en: 'Phu La', support_type: 1 },
  
  // Hoàn Kiếm (101)
  { province_id: 1, district_id: 101, ward_code: '101', ward_name: 'Phúc Tân', ward_name_en: 'Phuc Tan', support_type: 1 },
  { province_id: 1, district_id: 101, ward_code: '102', ward_name: 'Lý Thái Tổ', ward_name_en: 'Ly Thai To', support_type: 1 },
  { province_id: 1, district_id: 101, ward_code: '103', ward_name: 'Tràng Tiền', ward_name_en: 'Trang Tien', support_type: 1 },
  
  // Quận 1 (201) - TP.HCM
  { province_id: 202, district_id: 201, ward_code: '201', ward_name: 'Bến Nghé', ward_name_en: 'Ben Nghe', support_type: 1 },
  { province_id: 202, district_id: 201, ward_code: '202', ward_name: 'Đa Kao', ward_name_en: 'Da Kao', support_type: 1 },
];

// ============================================
// MAIN FUNCTION
// ============================================

async function seedData() {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║   GHN DATA SEEDING - Insert Mock Data            ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  const startTime = Date.now();

  try {
    // STEP 1: Check if tables exist
    console.log('📊 Checking tables...');
    const { data: provincesCheck, error: provincesError } = await supabase
      .from('ghn_provinces')
      .select('id')
      .limit(1);

    if (provincesError && provincesError.code !== 'PGRST116') {
      console.error('❌ Error checking tables:', provincesError.message);
      process.exit(1);
    }

    console.log('✓ Tables ready\n');

    // STEP 2: Clear old data first
    console.log('🧹 Clearing old data...');
    try {
      await supabase.from('ghn_wards').delete().neq('id', -1);
      await supabase.from('ghn_districts').delete().neq('id', -1);
      await supabase.from('ghn_provinces').delete().neq('id', -1);
      console.log('✓ Old data cleared\n');
    } catch (e) {
      console.log('ℹ️ No old data to clear\n');
    }

    // STEP 3: Insert Provinces
    console.log('📍 INSERTING PROVINCES...');
    const provinceData = provinces.map(p => ({
      ...p,
      created_at: new Date().toISOString(),
    }));

    const { error: provinceInsertError, data: insertedProvinces } = await supabase
      .from('ghn_provinces')
      .insert(provinceData)
      .select();

    if (provinceInsertError) {
      console.error('❌ Error inserting provinces:', provinceInsertError.message);
      process.exit(1);
    } else {
      console.log(`✅ Inserted ${insertedProvinces?.length || 0} provinces`);
    }

    // STEP 4: Insert Districts
    console.log('\n🏘️ INSERTING DISTRICTS...');
    const districtData = districts.map(d => ({
      ...d,
      created_at: new Date().toISOString(),
    }));

    const { error: districtInsertError, data: insertedDistricts } = await supabase
      .from('ghn_districts')
      .insert(districtData)
      .select();

    if (districtInsertError) {
      console.error('❌ Error inserting districts:', districtInsertError.message);
      process.exit(1);
    } else {
      console.log(`✅ Inserted ${insertedDistricts?.length || 0} districts`);
    }

    // STEP 5: Insert Wards
    console.log('\n🏘️ INSERTING WARDS...');
    const wardData = wards.map(w => ({
      ...w,
      created_at: new Date().toISOString(),
    }));

    const { error: wardInsertError, data: insertedWards } = await supabase
      .from('ghn_wards')
      .insert(wardData)
      .select();

    if (wardInsertError) {
      console.error('❌ Error inserting wards:', wardInsertError.message);
      process.exit(1);
    } else {
      console.log(`✅ Inserted ${insertedWards?.length || 0} wards`);
    }

    // STEP 6: Verify data
    console.log('\n🔍 VERIFYING DATA...');

    const { count: pCount } = await supabase.from('ghn_provinces').select('*', { count: 'exact' });
    const { count: dCount } = await supabase.from('ghn_districts').select('*', { count: 'exact' });
    const { count: wCount } = await supabase.from('ghn_wards').select('*', { count: 'exact' });

    console.log(`  Provinces: ${pCount || 0}`);
    console.log(`  Districts: ${dCount || 0}`);
    console.log(`  Wards: ${wCount || 0}`);

    // Final summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n╔═══════════════════════════════════════════════════╗');
    console.log('║   SEEDING COMPLETED ✅                            ║');
    console.log('╠═══════════════════════════════════════════════════╣');
    console.log(`║ Duration: ${duration}s`);
    console.log('║ Status: Ready to use!');
    console.log('╚═══════════════════════════════════════════════════╝\n');

    console.log('✅ Success! Mock data seeded to Supabase database.');
    console.log('   - Hà Nội (6 districts, 8 wards)');
    console.log('   - TP.HCM (4 districts, 2 wards)');
    console.log('   - Đà Nẵng (2 districts)\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

seedData();
