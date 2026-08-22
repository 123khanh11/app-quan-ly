import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = "https://edtxexnhpbipcecceoop.supabase.co";
const SUPABASE_KEY = "sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Load JSON data
function loadJsonData(filename) {
  const filePath = path.join(__dirname, "ghn-data-script", "ghn-data", filename);
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

async function resetAndImport() {
  try {
    console.log("\n========================================");
    console.log("RESET & IMPORT GHN DATA");
    console.log("========================================\n");

    // 1. Clear all existing data
    console.log("🗑️  Clearing existing data...");
    
    await supabase.from("ghn_wards").delete().neq("ward_code", "");
    console.log("✅ Cleared ghn_wards");
    
    await supabase.from("ghn_districts").delete().neq("district_id", 0);
    console.log("✅ Cleared ghn_districts");
    
    await supabase.from("ghn_provinces").delete().neq("province_id", 0);
    console.log("✅ Cleared ghn_provinces");

    // 2. Import provinces
    console.log("\n📥 Importing provinces...");
    const provinces = loadJsonData("ghn_provinces.json");
    const provinceData = provinces.map((p) => ({
      province_id: p.ProvinceID,
      province_name: p.ProvinceName,
    }));

    const { error: pError } = await supabase
      .from("ghn_provinces")
      .insert(provinceData);

    if (pError) {
      throw new Error(`Province import failed: ${pError.message}`);
    }
    console.log(`✅ Imported ${provinceData.length} provinces`);

    // 3. Import districts
    console.log("\n📥 Importing districts...");
    const districts = loadJsonData("ghn_districts.json");
    const districtData = districts.map((d) => ({
      district_id: d.DistrictID,
      province_id: d.ProvinceID,
      district_name: d.DistrictName,
    }));

    // Batch import - 1000 at a time
    const chunkSize = 1000;
    for (let i = 0; i < districtData.length; i += chunkSize) {
      const chunk = districtData.slice(i, i + chunkSize);
      const { error: dError } = await supabase
        .from("ghn_districts")
        .insert(chunk);

      if (dError) {
        throw new Error(`District import chunk ${i} failed: ${dError.message}`);
      }
      console.log(`  ✅ Imported chunk ${Math.floor(i / chunkSize) + 1}/${Math.ceil(districtData.length / chunkSize)}`);
    }
    console.log(`✅ Total: ${districtData.length} districts`);

    // 4. Import wards
    console.log("\n📥 Importing wards...");
    const wards = loadJsonData("ghn_wards.json");
    const districtMap = {};
    districts.forEach((d) => {
      districtMap[d.DistrictID] = d.ProvinceID;
    });

    const wardData = wards.map((w) => ({
      ward_code: w.WardCode,
      district_id: w.DistrictID,
      province_id: districtMap[w.DistrictID] || null,
      ward_name: w.WardName,
    }));

    for (let i = 0; i < wardData.length; i += chunkSize) {
      const chunk = wardData.slice(i, i + chunkSize);
      const { error: wError } = await supabase
        .from("ghn_wards")
        .insert(chunk);

      if (wError) {
        throw new Error(`Ward import chunk ${i} failed: ${wError.message}`);
      }
      console.log(`  ✅ Imported chunk ${Math.floor(i / chunkSize) + 1}/${Math.ceil(wardData.length / chunkSize)}`);
    }
    console.log(`✅ Total: ${wardData.length} wards`);

    // 5. Verify
    console.log("\n========================================");
    console.log("VERIFICATION");
    console.log("========================================\n");

    const { count: pCount } = await supabase
      .from("ghn_provinces")
      .select("*", { count: "exact", head: true });

    const { count: dCount } = await supabase
      .from("ghn_districts")
      .select("*", { count: "exact", head: true });

    const { count: wCount } = await supabase
      .from("ghn_wards")
      .select("*", { count: "exact", head: true });

    console.log(`Provinces: ${pCount} ✅`);
    console.log(`Districts: ${dCount} ✅`);
    console.log(`Wards: ${wCount} ✅`);

    // Test query for province 1
    const { data: testDistricts } = await supabase
      .from("ghn_districts")
      .select("*")
      .eq("province_id", 1)
      .limit(3);

    console.log(`\nTest: Districts for province_id=1: ${testDistricts?.length || 0}`);
    testDistricts?.forEach((d) => {
      console.log(`  - ${d.district_id}: ${d.district_name}`);
    });

    console.log("\n✅ IMPORT COMPLETED SUCCESSFULLY!");

  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    process.exit(1);
  }
}

resetAndImport();
