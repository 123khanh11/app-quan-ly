const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// ======================================================
// CẤU HÌNH SUPABASE
// ======================================================

const SUPABASE_URL = "https://edtxexnhpbipcecceoop.supabase.co";
const SUPABASE_KEY = "sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ======================================================
// LẤY DỮ LIỆU TỪ JSON
// ======================================================

function loadJsonData(filename) {
  const filePath = path.join(__dirname, "ghn-data", filename);
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

// ======================================================
// IMPORT PROVINCES
// ======================================================

async function importProvinces() {
  console.log("\n========================================");
  console.log("IMPORTING PROVINCES");
  console.log("========================================");

  const provinces = loadJsonData("ghn_provinces.json");

  // Convert GHN format to Supabase format (only use available columns)
  const dataToInsert = provinces.map((p) => ({
    province_id: p.ProvinceID,
    province_name: p.ProvinceName,
  }));

  console.log(`Importing ${dataToInsert.length} provinces...`);

  // Clear existing data
  await supabase.from("ghn_provinces").delete().neq("province_id", 0);

  // Insert new data
  const { data, error } = await supabase
    .from("ghn_provinces")
    .insert(dataToInsert);

  if (error) {
    console.error("❌ Error importing provinces:", error);
    throw error;
  }

  console.log(`✅ Imported ${dataToInsert.length} provinces`);
  return dataToInsert.length;
}

// ======================================================
// IMPORT DISTRICTS
// ======================================================

async function importDistricts() {
  console.log("\n========================================");
  console.log("IMPORTING DISTRICTS");
  console.log("========================================");

  const districts = loadJsonData("ghn_districts.json");

  // Convert GHN format to Supabase format (only use available columns)
  const dataToInsert = districts.map((d) => ({
    district_id: d.DistrictID,
    province_id: d.ProvinceID,
    district_name: d.DistrictName,
  }));

  console.log(`Importing ${dataToInsert.length} districts...`);

  // Clear existing data
  await supabase.from("ghn_districts").delete().neq("district_id", 0);

  // Insert new data - batch in chunks of 1000
  const chunkSize = 1000;
  for (let i = 0; i < dataToInsert.length; i += chunkSize) {
    const chunk = dataToInsert.slice(i, i + chunkSize);
    const { error } = await supabase
      .from("ghn_districts")
      .insert(chunk);

    if (error) {
      console.error(`❌ Error importing districts chunk ${i}:`, error);
      throw error;
    }

    console.log(`   → Imported ${Math.min(chunk.length, chunkSize)} districts`);
  }

  console.log(`✅ Imported ${dataToInsert.length} districts total`);
  return dataToInsert.length;
}

// ======================================================
// IMPORT WARDS
// ======================================================

async function importWards() {
  console.log("\n========================================");
  console.log("IMPORTING WARDS");
  console.log("========================================");

  const wards = loadJsonData("ghn_wards.json");
  const districts = loadJsonData("ghn_districts.json");

  // Create district_id to province_id map
  const districtMap = {};
  for (const district of districts) {
    districtMap[district.DistrictID] = district.ProvinceID;
  }

  // Convert GHN format to Supabase format
  const dataToInsert = wards.map((w) => ({
    ward_code: w.WardCode,
    district_id: w.DistrictID,
    province_id: districtMap[w.DistrictID] || null,
    ward_name: w.WardName,
  }));

  console.log(`Importing ${dataToInsert.length} wards...`);

  // Clear existing data
  await supabase.from("ghn_wards").delete().neq("district_id", 0);

  // Insert new data - batch in chunks of 1000
  const chunkSize = 1000;
  for (let i = 0; i < dataToInsert.length; i += chunkSize) {
    const chunk = dataToInsert.slice(i, i + chunkSize);
    const { error } = await supabase
      .from("ghn_wards")
      .insert(chunk);

    if (error) {
      console.error(`❌ Error importing wards chunk ${i}:`, error);
      throw error;
    }

    console.log(`   → Imported ${Math.min(chunk.length, chunkSize)} wards`);
  }

  console.log(`✅ Imported ${dataToInsert.length} wards total`);
  return dataToInsert.length;
}

// ======================================================
// MAIN
// ======================================================

async function main() {
  try {
    console.log("\n");
    console.log("========================================");
    console.log("  GHN DATA → SUPABASE IMPORTER");
    console.log("========================================");

    const provinceCount = await importProvinces();
    const districtCount = await importDistricts();
    const wardCount = await importWards();

    console.log("\n========================================");
    console.log("✅ IMPORT COMPLETED");
    console.log("========================================");

    console.log(`\nSummary:`);
    console.log(`  Provinces : ${provinceCount}`);
    console.log(`  Districts : ${districtCount}`);
    console.log(`  Wards     : ${wardCount}`);

    console.log("\n✅ You can now use the API!");
  } catch (error) {
    console.error("\n========================================");
    console.error("❌ ERROR");
    console.error("========================================");
    console.error(error.message);
    process.exit(1);
  }
}

main();
