import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://edtxexnhpbipcecceoop.supabase.co";
// Dùng service role key (nếu có) hoặc anon key
const SUPABASE_KEY = "sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  try {
    // 1. Đếm tổng records
    console.log("\n=== COUNTING RECORDS ===");
    const { count: provinceCount, error: pError } = await supabase
      .from("ghn_provinces")
      .select("*", { count: "exact", head: true });
    
    console.log(`Provinces: ${provinceCount} ${pError ? "❌ " + pError.message : "✅"}`);

    const { count: districtCount, error: dError } = await supabase
      .from("ghn_districts")
      .select("*", { count: "exact", head: true });
    
    console.log(`Districts: ${districtCount} ${dError ? "❌ " + dError.message : "✅"}`);

    const { count: wardCount, error: wError } = await supabase
      .from("ghn_wards")
      .select("*", { count: "exact", head: true });
    
    console.log(`Wards: ${wardCount} ${wError ? "❌ " + wError.message : "✅"}`);

    // 2. Sample districts cho province_id = 1
    console.log("\n=== SAMPLE: Districts for province_id = 1 ===");
    const { data: districts, error: distError } = await supabase
      .from("ghn_districts")
      .select("*")
      .eq("province_id", 1)
      .limit(3);

    if (distError) {
      console.log("❌ Error:", distError.message);
    } else {
      console.log(`Found: ${districts?.length || 0} districts`);
      districts?.forEach(d => {
        console.log(`  - ${d.district_id}: ${d.district_name}`);
      });
    }

    // 3. Check first 5 districts in table
    console.log("\n=== SAMPLE: First 5 districts in table ===");
    const { data: firstDistricts, error: firstError } = await supabase
      .from("ghn_districts")
      .select("*")
      .limit(5);

    if (firstError) {
      console.log("❌ Error:", firstError.message);
    } else {
      console.log(`Found: ${firstDistricts?.length || 0} records`);
      firstDistricts?.forEach(d => {
        console.log(`  - province_id: ${d.province_id}, district_id: ${d.district_id}, name: ${d.district_name}`);
      });
    }

    // 4. Check table schema
    console.log("\n=== TABLE SCHEMA ===");
    const { data: schema, error: schemaError } = await supabase
      .from("ghn_districts")
      .select("*")
      .limit(0);

    if (schemaError) {
      console.log("❌ Error:", schemaError.message);
    } else {
      console.log("✅ Table exists and is accessible");
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main();
