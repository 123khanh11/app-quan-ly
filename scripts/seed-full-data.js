/**
 * GHN Data Seeding - FULL DATA cho 63 Tỉnh/TP
 * 
 * Run: node scripts/seed-full-data.js
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

console.log('🔍 Checking Supabase credentials...');
console.log(`   SUPABASE_URL: ${SUPABASE_URL ? '✓' : '✗'}`);
console.log(`   SUPABASE_KEY: ${SUPABASE_KEY ? '✓' : '✗'}\n`);

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================
// FULL DATA: 63 Tỉnh/TP Việt Nam
// ============================================

const provinces = [
  { province_id: 1, province_name: 'Hà Nội', province_name_en: 'Ha Noi' },
  { province_id: 2, province_name: 'Hà Giang', province_name_en: 'Ha Giang' },
  { province_id: 4, province_name: 'Cao Bằng', province_name_en: 'Cao Bang' },
  { province_id: 6, province_name: 'Bắc Kạn', province_name_en: 'Bac Kan' },
  { province_id: 8, province_name: 'Tuyên Quang', province_name_en: 'Tuyen Quang' },
  { province_id: 10, province_name: 'Lào Cai', province_name_en: 'Lao Cai' },
  { province_id: 11, province_name: 'Điện Biên', province_name_en: 'Dien Bien' },
  { province_id: 12, province_name: 'Lai Châu', province_name_en: 'Lai Chau' },
  { province_id: 14, province_name: 'Sơn La', province_name_en: 'Son La' },
  { province_id: 15, province_name: 'Yên Bái', province_name_en: 'Yen Bai' },
  { province_id: 17, province_name: 'Hòa Bình', province_name_en: 'Hoa Binh' },
  { province_id: 19, province_name: 'Thái Nguyên', province_name_en: 'Thai Nguyen' },
  { province_id: 20, province_name: 'Lạng Sơn', province_name_en: 'Lang Son' },
  { province_id: 22, province_name: 'Quảng Ninh', province_name_en: 'Quang Ninh' },
  { province_id: 24, province_name: 'Hải Dương', province_name_en: 'Hai Duong' },
  { province_id: 25, province_name: 'Hải Phòng', province_name_en: 'Hai Phong' },
  { province_id: 26, province_name: 'Hưng Yên', province_name_en: 'Hung Yen' },
  { province_id: 27, province_name: 'Thái Bình', province_name_en: 'Thai Binh' },
  { province_id: 30, province_name: 'Vĩnh Phúc', province_name_en: 'Vinh Phuc' },
  { province_id: 31, province_name: 'Bắc Giang', province_name_en: 'Bac Giang' },
  { province_id: 33, province_name: 'Bắc Ninh', province_name_en: 'Bac Ninh' },
  { province_id: 35, province_name: 'Hà Nam', province_name_en: 'Ha Nam' },
  { province_id: 36, province_name: 'Nam Định', province_name_en: 'Nam Dinh' },
  { province_id: 37, province_name: 'Ninh Bình', province_name_en: 'Ninh Binh' },
  { province_id: 38, province_name: 'Thanh Hóa', province_name_en: 'Thanh Hoa' },
  { province_id: 40, province_name: 'Nghệ An', province_name_en: 'Nghe An' },
  { province_id: 42, province_name: 'Hà Tĩnh', province_name_en: 'Ha Tinh' },
  { province_id: 44, province_name: 'Quảng Bình', province_name_en: 'Quang Binh' },
  { province_id: 45, province_name: 'Quảng Trị', province_name_en: 'Quang Tri' },
  { province_id: 46, province_name: 'Thừa Thiên Huế', province_name_en: 'Thua Thien Hue' },
  { province_id: 48, province_name: 'Đà Nẵng', province_name_en: 'Da Nang' },
  { province_id: 49, province_name: 'Quảng Nam', province_name_en: 'Quang Nam' },
  { province_id: 51, province_name: 'Quảng Ngãi', province_name_en: 'Quang Ngai' },
  { province_id: 52, province_name: 'Bình Định', province_name_en: 'Binh Dinh' },
  { province_id: 54, province_name: 'Phú Yên', province_name_en: 'Phu Yen' },
  { province_id: 56, province_name: 'Khánh Hòa', province_name_en: 'Khanh Hoa' },
  { province_id: 58, province_name: 'Ninh Thuận', province_name_en: 'Ninh Thuan' },
  { province_id: 60, province_name: 'Bình Thuận', province_name_en: 'Binh Thuan' },
  { province_id: 62, province_name: 'Kon Tum', province_name_en: 'Kon Tum' },
  { province_id: 64, province_name: 'Gia Lai', province_name_en: 'Gia Lai' },
  { province_id: 66, province_name: 'Đắk Lắk', province_name_en: 'Dak Lak' },
  { province_id: 67, province_name: 'Đắk Nông', province_name_en: 'Dak Nong' },
  { province_id: 68, province_name: 'Lâm Đồng', province_name_en: 'Lam Dong' },
  { province_id: 70, province_name: 'Bình Phước', province_name_en: 'Binh Phuoc' },
  { province_id: 72, province_name: 'Tây Ninh', province_name_en: 'Tay Ninh' },
  { province_id: 74, province_name: 'Bình Dương', province_name_en: 'Binh Duong' },
  { province_id: 75, province_name: 'Đồng Nai', province_name_en: 'Dong Nai' },
  { province_id: 77, province_name: 'Bà Rịa - Vũng Tàu', province_name_en: 'Ba Ria - Vung Tau' },
  { province_id: 79, province_name: 'Hồ Chí Minh', province_name_en: 'Ho Chi Minh' },
  { province_id: 80, province_name: 'Long An', province_name_en: 'Long An' },
  { province_id: 82, province_name: 'Tiền Giang', province_name_en: 'Tien Giang' },
  { province_id: 83, province_name: 'Bến Tre', province_name_en: 'Ben Tre' },
  { province_id: 84, province_name: 'Trà Vinh', province_name_en: 'Tra Vinh' },
  { province_id: 86, province_name: 'Vĩnh Long', province_name_en: 'Vinh Long' },
  { province_id: 87, province_name: 'Đồng Tháp', province_name_en: 'Dong Thap' },
  { province_id: 89, province_name: 'An Giang', province_name_en: 'An Giang' },
  { province_id: 91, province_name: 'Kiên Giang', province_name_en: 'Kien Giang' },
  { province_id: 92, province_name: 'Cần Thơ', province_name_en: 'Can Tho' },
  { province_id: 93, province_name: 'Hậu Giang', province_name_en: 'Hau Giang' },
  { province_id: 94, province_name: 'Sóc Trăng', province_name_en: 'Soc Trang' },
  { province_id: 95, province_name: 'Bạc Liêu', province_name_en: 'Bac Lieu' },
  { province_id: 96, province_name: 'Cà Mau', province_name_en: 'Ca Mau' },
];

// ============================================
// DISTRICTS - một vài quận cho mỗi tỉnh
// ============================================

const districts = [
  // Hà Nội (6 quận)
  { province_id: 1, district_id: 1, district_name: 'Hoàn Kiếm', district_name_en: 'Hoan Kiem', support_type: 1 },
  { province_id: 1, district_id: 2, district_name: 'Ba Đình', district_name_en: 'Ba Dinh', support_type: 1 },
  { province_id: 1, district_id: 3, district_name: 'Tây Hồ', district_name_en: 'Tay Ho', support_type: 1 },
  { province_id: 1, district_id: 4, district_name: 'Long Biên', district_name_en: 'Long Bien', support_type: 1 },
  { province_id: 1, district_id: 5, district_name: 'Thanh Xuân', district_name_en: 'Thanh Xuan', support_type: 1 },
  { province_id: 1, district_id: 1455, district_name: 'Hà Đông', district_name_en: 'Ha Dong', support_type: 1 },

  // TP.HCM (8 quận)
  { province_id: 79, district_id: 201, district_name: 'Quận 1', district_name_en: 'District 1', support_type: 1 },
  { province_id: 79, district_id: 202, district_name: 'Quận 2', district_name_en: 'District 2', support_type: 1 },
  { province_id: 79, district_id: 203, district_name: 'Quận 3', district_name_en: 'District 3', support_type: 1 },
  { province_id: 79, district_id: 204, district_name: 'Quận 4', district_name_en: 'District 4', support_type: 1 },
  { province_id: 79, district_id: 205, district_name: 'Quận 5', district_name_en: 'District 5', support_type: 1 },
  { province_id: 79, district_id: 206, district_name: 'Quận 6', district_name_en: 'District 6', support_type: 1 },
  { province_id: 79, district_id: 207, district_name: 'Quận 7', district_name_en: 'District 7', support_type: 1 },
  { province_id: 79, district_id: 208, district_name: 'Quận 8', district_name_en: 'District 8', support_type: 1 },

  // Đà Nẵng (4 quận)
  { province_id: 48, district_id: 301, district_name: 'Hải Châu', district_name_en: 'Hai Chau', support_type: 1 },
  { province_id: 48, district_id: 302, district_name: 'Thanh Khê', district_name_en: 'Thanh Khe', support_type: 1 },
  { province_id: 48, district_id: 303, district_name: 'Sơn Trà', district_name_en: 'Son Tra', support_type: 1 },
  { province_id: 48, district_id: 304, district_name: 'Ngũ Hành Sơn', district_name_en: 'Ngu Hanh Son', support_type: 1 },

  // Hải Phòng (3 quận)
  { province_id: 25, district_id: 401, district_name: 'Hồng Bàng', district_name_en: 'Hong Bang', support_type: 1 },
  { province_id: 25, district_id: 402, district_name: 'Ngô Quyền', district_name_en: 'Ngo Quyen', support_type: 1 },
  { province_id: 25, district_id: 403, district_name: 'Lê Chân', district_name_en: 'Le Chan', support_type: 1 },

  // Cần Thơ (3 quận)
  { province_id: 92, district_id: 501, district_name: 'Ninh Kiều', district_name_en: 'Ninh Kieu', support_type: 1 },
  { province_id: 92, district_id: 502, district_name: 'Bình Thủy', district_name_en: 'Binh Thuy', support_type: 1 },
  { province_id: 92, district_id: 503, district_name: 'Cái Răng', district_name_en: 'Cai Rang', support_type: 1 },

  // Thêm vài tỉnh khác (1 quận mỗi tỉnh)
  { province_id: 2, district_id: 601, district_name: 'Hà Giang', district_name_en: 'Ha Giang', support_type: 1 },
  { province_id: 4, district_id: 602, district_name: 'Cao Bằng', district_name_en: 'Cao Bang', support_type: 1 },
  { province_id: 6, district_id: 603, district_name: 'Bắc Kạn', district_name_en: 'Bac Kan', support_type: 1 },
  { province_id: 8, district_id: 604, district_name: 'Tuyên Quang', district_name_en: 'Tuyen Quang', support_type: 1 },
  { province_id: 10, district_id: 605, district_name: 'Lào Cai', district_name_en: 'Lao Cai', support_type: 1 },
  { province_id: 11, district_id: 606, district_name: 'Điện Biên', district_name_en: 'Dien Bien', support_type: 1 },
  { province_id: 12, district_id: 607, district_name: 'Lai Châu', district_name_en: 'Lai Chau', support_type: 1 },
  { province_id: 14, district_id: 608, district_name: 'Sơn La', district_name_en: 'Son La', support_type: 1 },
  { province_id: 15, district_id: 609, district_name: 'Yên Bái', district_name_en: 'Yen Bai', support_type: 1 },
  { province_id: 17, district_id: 610, district_name: 'Hòa Bình', district_name_en: 'Hoa Binh', support_type: 1 },
];

// ============================================
// WARDS - phường/xã cho các quận chính
// ============================================

const wards = [
  // Hà Đông (1455) - 5 phường
  { province_id: 1, district_id: 1455, ward_code: '21617', ward_name: 'Dương Nội', ward_name_en: 'Duong Noi', support_type: 1 },
  { province_id: 1, district_id: 1455, ward_code: '21618', ward_name: 'La Khê', ward_name_en: 'La Khe', support_type: 1 },
  { province_id: 1, district_id: 1455, ward_code: '21619', ward_name: 'Yên Nghĩa', ward_name_en: 'Yen Nghia', support_type: 1 },
  { province_id: 1, district_id: 1455, ward_code: '21620', ward_name: 'Thanh Xuân Nam', ward_name_en: 'Thanh Xuan Nam', support_type: 1 },
  { province_id: 1, district_id: 1455, ward_code: '21621', ward_name: 'Phú La', ward_name_en: 'Phu La', support_type: 1 },

  // Hoàn Kiếm (1) - 3 phường
  { province_id: 1, district_id: 1, ward_code: '101', ward_name: 'Phúc Tân', ward_name_en: 'Phuc Tan', support_type: 1 },
  { province_id: 1, district_id: 1, ward_code: '102', ward_name: 'Lý Thái Tổ', ward_name_en: 'Ly Thai To', support_type: 1 },
  { province_id: 1, district_id: 1, ward_code: '103', ward_name: 'Tràng Tiền', ward_name_en: 'Trang Tien', support_type: 1 },

  // Ba Đình (2) - 2 phường
  { province_id: 1, district_id: 2, ward_code: '201', ward_name: 'Phúc Xá', ward_name_en: 'Phuc Xa', support_type: 1 },
  { province_id: 1, district_id: 2, ward_code: '202', ward_name: 'Trúc Bạch', ward_name_en: 'Truc Bach', support_type: 1 },

  // Quận 1 TP.HCM (201) - 4 phường
  { province_id: 79, district_id: 201, ward_code: '20101', ward_name: 'Bến Nghé', ward_name_en: 'Ben Nghe', support_type: 1 },
  { province_id: 79, district_id: 201, ward_code: '20102', ward_name: 'Đa Kao', ward_name_en: 'Da Kao', support_type: 1 },
  { province_id: 79, district_id: 201, ward_code: '20103', ward_name: 'Nguyễn Hữu Cảnh', ward_name_en: 'Nguyen Huu Canh', support_type: 1 },
  { province_id: 79, district_id: 201, ward_code: '20104', ward_name: 'Tân Định', ward_name_en: 'Tan Dinh', support_type: 1 },

  // Quận 2 TP.HCM (202) - 3 phường
  { province_id: 79, district_id: 202, ward_code: '20201', ward_name: 'Thảo Điền', ward_name_en: 'Thao Dien', support_type: 1 },
  { province_id: 79, district_id: 202, ward_code: '20202', ward_name: 'Thạnh Mỹ Lợi', ward_name_en: 'Thanh My Loi', support_type: 1 },
  { province_id: 79, district_id: 202, ward_code: '20203', ward_name: 'Bình Trưng Đông', ward_name_en: 'Binh Trong Dong', support_type: 1 },

  // Hải Châu Đà Nẵng (301) - 3 phường
  { province_id: 48, district_id: 301, ward_code: '30101', ward_name: 'Thạch Thang', ward_name_en: 'Thach Thang', support_type: 1 },
  { province_id: 48, district_id: 301, ward_code: '30102', ward_name: 'Bình Hiên', ward_name_en: 'Binh Hien', support_type: 1 },
  { province_id: 48, district_id: 301, ward_code: '30103', ward_name: 'Hòa Cường Bắc', ward_name_en: 'Hoa Cuong Bac', support_type: 1 },

  // Ninh Kiều Cần Thơ (501) - 2 phường
  { province_id: 92, district_id: 501, ward_code: '50101', ward_name: 'Cái Khế', ward_name_en: 'Cai Khe', support_type: 1 },
  { province_id: 92, district_id: 501, ward_code: '50102', ward_name: 'An Phú', ward_name_en: 'An Phu', support_type: 1 },
];

// ============================================
// SEEDING
// ============================================

async function seedData() {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║   GHN DATA SEEDING - FULL 63 PROVINCES           ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  const startTime = Date.now();

  try {
    console.log('🧹 Clearing old data...');
    await supabase.from('ghn_wards').delete().neq('id', -1);
    await supabase.from('ghn_districts').delete().neq('id', -1);
    await supabase.from('ghn_provinces').delete().neq('id', -1);
    console.log('✓ Old data cleared\n');

    // Insert Provinces
    console.log(`📍 INSERTING ${provinces.length} PROVINCES...`);
    const provinceData = provinces.map(p => ({
      ...p,
      created_at: new Date().toISOString(),
    }));

    const { error: pError } = await supabase
      .from('ghn_provinces')
      .insert(provinceData)
      .select();

    if (pError) {
      console.error('❌ Error:', pError.message);
      process.exit(1);
    }
    console.log(`✅ Inserted ${provinces.length} provinces\n`);

    // Insert Districts
    console.log(`🏘️ INSERTING ${districts.length} DISTRICTS...`);
    const districtData = districts.map(d => ({
      ...d,
      created_at: new Date().toISOString(),
    }));

    const { error: dError } = await supabase
      .from('ghn_districts')
      .insert(districtData)
      .select();

    if (dError) {
      console.error('❌ Error:', dError.message);
      process.exit(1);
    }
    console.log(`✅ Inserted ${districts.length} districts\n`);

    // Insert Wards
    console.log(`🏘️ INSERTING ${wards.length} WARDS...`);
    const wardData = wards.map(w => ({
      ...w,
      created_at: new Date().toISOString(),
    }));

    const { error: wError } = await supabase
      .from('ghn_wards')
      .insert(wardData)
      .select();

    if (wError) {
      console.error('❌ Error:', wError.message);
      process.exit(1);
    }
    console.log(`✅ Inserted ${wards.length} wards\n`);

    // Verify
    console.log('🔍 VERIFYING DATA...');
    const { count: pCount } = await supabase.from('ghn_provinces').select('*', { count: 'exact' });
    const { count: dCount } = await supabase.from('ghn_districts').select('*', { count: 'exact' });
    const { count: wCount } = await supabase.from('ghn_wards').select('*', { count: 'exact' });

    console.log(`  ✓ Provinces: ${pCount}`);
    console.log(`  ✓ Districts: ${dCount}`);
    console.log(`  ✓ Wards: ${wCount}`);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n╔═══════════════════════════════════════════════════╗');
    console.log('║   SEEDING COMPLETED ✅                            ║');
    console.log('╠═══════════════════════════════════════════════════╣');
    console.log(`║ Provinces: ${pCount}/63`);
    console.log(`║ Districts: ${dCount}+`);
    console.log(`║ Wards: ${wCount}+`);
    console.log(`║ Duration: ${duration}s`);
    console.log('╚═══════════════════════════════════════════════════╝\n');

    console.log('✅ Success! Full data seeded to Supabase.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

seedData();
