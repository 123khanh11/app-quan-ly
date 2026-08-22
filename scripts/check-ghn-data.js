import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://edtxexnhpbipcecceoop.supabase.co";
const SUPABASE_KEY = "sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkData() {
  try {
    console.log("\n========================================");
    console.log("CHECKING GHN DATA IN SUPABASE");
    console.log("========================================\n");

    // Check provinces
    const { data: provinces, error: pError } = await supabase
      .from("ghn_provinces")
      .select("count", { count: "exact" });

    if (pError) {
      console.error("❌ Error checking provinces:", pError.message);
    } else {
      console.log(`✅ Provinces: ${provinces?.length || 0} records`);
    }

    // Check districts
    const { data: districts, error: dError } = await supabase
      .from("ghn_districts")
      .select("count", { count: "exact" });

    if (dError) {
      console.error("❌ Error checking districts:", dError.message);
    } else {
      console.log(`✅ Districts: ${districts?.length || 0} records`);
    }

    // Check wards
    const { data: wards, error: wError } = await supabase
      .from("ghn_wards")
      .select("count", { count: "exact" });

    if (wError) {
      console.error("❌ Error checking wards:", wError.message);
    } else {
      console.log(`✅ Wards: ${wards?.length || 0} records`);
    }

    // Check districts for province_id = 1
    console.log("\n--- Checking province_id = 1 ---");
    const { data: provinceDistricts, error: pdError } = await supabase
      .from("ghn_districts")
      .select("*")
      .eq("province_id", 1);

    if (pdError) {
      console.error("❌ Error:", pdError.message);
    } else {
      console.log(
        `✅ Districts for province_id=1: ${provinceDistricts?.length || 0} records`
      );
      if (provinceDistricts && provinceDistricts.length > 0) {
        console.log("   First 3 districts:");
        provinceDistricts.slice(0, 3).forEach((d) => {
          console.log(
            `   - ID: ${d.district_id}, Name: ${d.district_name}`
          );
        });
      }
    }

    // Check if province_id = 58 exists
    console.log("\n--- Checking province_id = 58 ---");
    const { data: province58, error: p58Error } = await supabase
      .from("ghn_provinces")
      .select("*")
      .eq("province_id", 58)
      .single();

    if (p58Error) {
      console.error("❌ Province ID 58 not found:", p58Error.message);
    } else {
      console.log(`✅ Province ID 58: ${province58?.province_name}`);
    }

    // Check all unique province_ids in districts
    console.log("\n--- All province IDs in districts table ---");
    const { data: distinctProvinces, error: dpError } = await supabase
      .from("ghn_districts")
      .select("province_id")
      .neq("province_id", null);

    if (dpError) {
      console.error("❌ Error:", dpError.message);
    } else {
      const uniqueIds = [...new Set(distinctProvinces?.map((d) => d.province_id))];
      console.log(`✅ Found ${uniqueIds.length} unique province IDs`);
      console.log(`   IDs: ${uniqueIds.slice(0, 10).join(", ")}${uniqueIds.length > 10 ? "..." : ""}`);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

checkData();
