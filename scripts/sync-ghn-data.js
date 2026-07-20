/**
 * GHN Data Sync Script (JavaScript)
 * 
 * Crawl toàn bộ dữ liệu từ GHN:
 * 1. Provinces (63 cái)
 * 2. Districts (700+ cái)
 * 3. Wards (10,000+ cái)
 * 
 * Lưu vào Supabase
 * 
 * Run: node scripts/sync-ghn-data.js
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

const GHN_TOKEN = process.env.GHN_TOKEN || '';
const GHN_SHOP_ID = process.env.GHN_SHOP_ID || '';
const GHN_API_URL = process.env.GHN_API_URL || 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

// Debug: Show what we loaded
console.log('🔍 Checking credentials...');
console.log(`   GHN_TOKEN: ${GHN_TOKEN ? '✓ Set' : '✗ Missing'}`);
console.log(`   GHN_SHOP_ID: ${GHN_SHOP_ID ? '✓ Set' : '✗ Missing'}`);
console.log(`   SUPABASE_URL: ${SUPABASE_URL ? '✓ Set' : '✗ Missing'}`);
console.log(`   SUPABASE_KEY: ${SUPABASE_KEY ? '✓ Set' : '✗ Missing'}\n`);

// Initialize Supabase
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================
// HELPER: GHN API Calls
// ============================================

async function getGHNHeaders() {
  return {
    'Content-Type': 'application/json',
    'Token': GHN_TOKEN,
    'ShopId': GHN_SHOP_ID,
  };
}

async function callGHN(endpoint, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(`${GHN_API_URL}${endpoint}`, {
        method: 'GET',
        headers: await getGHNHeaders(),
      });

      const data = await response.json();

      if (data.code === 200) {
        return data.data || [];
      } else {
        console.warn(`⚠️ GHN Error: ${data.message}`);
        if (i < retries - 1) {
          console.log(`🔄 Retry ${i + 1}/${retries - 1}...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      console.error(`❌ Network error on attempt ${i + 1}:`, error.message);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  return [];
}

// ============================================
// STEP 1: Fetch & Sync Provinces
// ============================================

async function syncProvinces() {
  console.log('\n📍 SYNCING PROVINCES...\n');

  try {
    const provinces = await callGHN('/master-data/province');

    if (!provinces || provinces.length === 0) {
      console.error('❌ No provinces found');
      return [];
    }

    console.log(`✓ Fetched ${provinces.length} provinces`);

    // Delete old data
    const { error: deleteError } = await supabase.from('ghn_provinces').delete().neq('id', -1);
    if (deleteError) console.warn('⚠️ Delete error:', deleteError.message);

    // Insert new data
    const provinceData = provinces.map(p => ({
      province_id: p.province_id,
      province_name: p.province_name,
      province_name_en: p.province_name_en || '',
      created_at: new Date().toISOString(),
    }));

    const { error: insertError, data } = await supabase
      .from('ghn_provinces')
      .insert(provinceData)
      .select();

    if (insertError) {
      console.error('❌ Insert error:', insertError.message);
      return [];
    }

    console.log(`✅ Synced ${data?.length || 0} provinces to DB\n`);
    return provinces;
  } catch (error) {
    console.error('❌ Sync Provinces error:', error.message);
    return [];
  }
}

// ============================================
// STEP 2: Fetch & Sync Districts
// ============================================

async function syncDistricts(provinces) {
  console.log('🏘️ SYNCING DISTRICTS...\n');

  let totalDistricts = 0;
  let failedProvinces = [];

  // Delete old data
  const { error: deleteError } = await supabase.from('ghn_districts').delete().neq('id', -1);
  if (deleteError) console.warn('⚠️ Delete error:', deleteError.message);

  for (const province of provinces) {
    try {
      console.log(`  📍 ${province.province_name} (${province.province_id})...`);

      const districts = await callGHN(`/master-data/district?province_id=${province.province_id}`);

      if (!districts || districts.length === 0) {
        console.warn(`  ⚠️ No districts found for ${province.province_name}`);
        failedProvinces.push(province);
        continue;
      }

      console.log(`    ✓ Fetched ${districts.length} districts`);

      // Prepare data
      const districtData = districts.map(d => ({
        province_id: province.province_id,
        district_id: d.district_id,
        district_name: d.district_name,
        district_name_en: d.district_name_en || '',
        support_type: d.support_type || 0,
        created_at: new Date().toISOString(),
      }));

      // Insert to DB
      const { error: insertError, data } = await supabase
        .from('ghn_districts')
        .insert(districtData)
        .select();

      if (insertError) {
        console.warn(`    ⚠️ Insert error: ${insertError.message}`);
        failedProvinces.push(province);
        continue;
      }

      if (data) {
        totalDistricts += data.length;
        console.log(`    ✅ Inserted ${data.length} districts`);
      }
    } catch (error) {
      console.error(`    ❌ Error syncing ${province.province_name}:`, error.message);
      failedProvinces.push(province);
    }

    // Rate limit: 100ms delay between API calls
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n✅ Synced ${totalDistricts} total districts\n`);

  if (failedProvinces.length > 0) {
    console.warn(`⚠️ Failed provinces (${failedProvinces.length}):`);
    failedProvinces.forEach(p => console.warn(`  - ${p.province_name}`));
  }

  return totalDistricts;
}

// ============================================
// STEP 3: Fetch & Sync Wards
// ============================================

async function syncWards(provinces) {
  console.log('\n🏘️ SYNCING WARDS...\n');

  // First, get all districts from DB
  const { data: allDistricts, error: fetchError } = await supabase.from('ghn_districts').select('*');

  if (fetchError) {
    console.error('❌ Failed to fetch districts:', fetchError.message);
    return 0;
  }

  if (!allDistricts || allDistricts.length === 0) {
    console.error('❌ No districts found in database');
    return 0;
  }

  console.log(`📦 Total districts to sync wards: ${allDistricts.length}\n`);

  let totalWards = 0;
  let processedDistricts = 0;
  let failedDistricts = [];

  // Delete old data
  const { error: deleteError } = await supabase.from('ghn_wards').delete().neq('id', -1);
  if (deleteError) console.warn('⚠️ Delete error:', deleteError.message);

  for (const district of allDistricts) {
    try {
      processedDistricts++;

      // Log every 10 districts
      if (processedDistricts % 10 === 0 || processedDistricts === 1) {
        console.log(`  ⏳ Processing district ${processedDistricts}/${allDistricts.length}: ${district.district_name}`);
      }

      const wards = await callGHN(`/master-data/ward?district_id=${district.district_id}`);

      if (!wards || wards.length === 0) {
        failedDistricts.push(district);
        continue;
      }

      // Insert to DB in batches
      const wardsToInsert = wards.map(w => ({
        province_id: district.province_id,
        district_id: district.district_id,
        ward_code: w.ward_code,
        ward_name: w.ward_name,
        ward_name_en: w.ward_name_en || '',
        support_type: w.support_type || 0,
        created_at: new Date().toISOString(),
      }));

      const { error: insertError, data } = await supabase
        .from('ghn_wards')
        .insert(wardsToInsert)
        .select();

      if (insertError) {
        console.warn(`    ⚠️ Insert error for district ${district.district_id} (${district.district_name}): ${insertError.message}`);
        failedDistricts.push(district);
        continue;
      }

      if (data) {
        totalWards += data.length;
      }
    } catch (error) {
      console.error(`    ❌ Error syncing district ${district.district_id}:`, error.message);
      failedDistricts.push(district);
    }

    // Rate limit: 50ms delay between API calls
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  console.log(`\n✅ Synced ${totalWards} total wards`);
  console.log(`   Processed ${processedDistricts} districts`);

  if (failedDistricts.length > 0) {
    console.warn(`⚠️ Failed districts (${failedDistricts.length}):`);
    failedDistricts.forEach(d => console.warn(`  - ${d.district_id}: ${d.district_name}`));
  }

  return totalWards;
}

// ============================================
// MAIN: Run Sync
// ============================================

async function main() {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║   GHN DATA SYNC - Crawl All Locations            ║');
  console.log('╚═══════════════════════════════════════════════════╝');

  // Check GHN credentials
  if (!GHN_TOKEN || !GHN_SHOP_ID) {
    console.error('\n❌ Missing GHN credentials in .env.local');
    console.error('   Add: GHN_TOKEN=xxx and GHN_SHOP_ID=xxx');
    process.exit(1);
  }

  console.log('\n📊 Starting sync...\n');
  const startTime = Date.now();

  try {
    // Step 1: Sync Provinces
    const provinces = await syncProvinces();

    if (provinces.length === 0) {
      console.error('❌ Failed to fetch provinces. Exiting.');
      process.exit(1);
    }

    // Step 2: Sync Districts
    const districtCount = await syncDistricts(provinces);

    // Step 3: Sync Wards
    const wardCount = await syncWards(provinces);

    // Summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n╔═══════════════════════════════════════════════════╗');
    console.log('║   SYNC COMPLETED ✅                               ║');
    console.log('╠═══════════════════════════════════════════════════╣');
    console.log(`║ Provinces: ${provinces.length}`);
    console.log(`║ Districts: ${districtCount}`);
    console.log(`║ Wards: ${wardCount}`);
    console.log(`║ Duration: ${duration}s`);
    console.log('╚═══════════════════════════════════════════════════╝\n');

    console.log('✅ Success! Data synced to Supabase database.');
    console.log('   Frontend can now query locations instantly!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();
