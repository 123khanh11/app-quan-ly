const axios = require("axios");
const fs = require("fs");
const path = require("path");

// ======================================================
// CẤU HÌNH
// ======================================================

// ĐIỀN TOKEN GHN CỦA BẠN VÀO ĐÂY
const GHN_TOKEN = "653bfc7b-8381-11f1-a65e-a68e06d4dd1e";

const BASE_URL =
  "https://online-gateway.ghn.vn/shiip/public-api/master-data";

const OUTPUT_DIR = path.join(__dirname, "ghn-data");

// Tạo thư mục lưu dữ liệu nếu chưa tồn tại
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Axios client
const ghn = axios.create({
  baseURL: BASE_URL,
  headers: {
    Token: GHN_TOKEN,
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// ======================================================
// DELAY
// ======================================================

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ======================================================
// LẤY PROVINCE
// ======================================================

async function getProvinces() {
  console.log("\n========================================");
  console.log("ĐANG LẤY PROVINCE");
  console.log("========================================");

  const response = await ghn.get("/province");

  if (response.data.code !== 200) {
    throw new Error(
      `GHN Province Error: ${response.data.message}`
    );
  }

  const provinces = response.data.data || [];

  console.log(`Đã lấy ${provinces.length} Province`);

  return provinces;
}

// ======================================================
// LẤY DISTRICT THEO PROVINCE
// ======================================================

async function getDistricts(provinceId) {
  const response = await ghn.get("/district", {
    params: {
      province_id: provinceId,
    },
  });

  if (response.data.code !== 200) {
    throw new Error(
      `GHN District Error: ${response.data.message}`
    );
  }

  return response.data.data || [];
}

// ======================================================
// LẤY WARD THEO DISTRICT
// ======================================================

async function getWards(districtId) {
  const response = await ghn.post("/ward", {
    district_id: districtId,
  });

  if (response.data.code !== 200) {
    throw new Error(
      `GHN Ward Error: ${response.data.message}`
    );
  }

  return response.data.data || [];
}

// ======================================================
// LƯU JSON
// ======================================================

function saveJson(filename, data) {
  const filePath = path.join(OUTPUT_DIR, filename);

  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2),
    "utf8"
  );

  console.log(`Đã lưu: ${filePath}`);
}

// ======================================================
// MAIN
// ======================================================

async function main() {
  try {
    if (
      !GHN_TOKEN ||
      GHN_TOKEN === "YOUR_GHN_TOKEN"
    ) {
      throw new Error(
        "Bạn chưa nhập GHN_TOKEN trong file get-ghn-data.js"
      );
    }

    console.log("\n");
    console.log("========================================");
    console.log("       GHN MASTER DATA DOWNLOADER");
    console.log("========================================");

    // --------------------------------------------------
    // 1. PROVINCE
    // --------------------------------------------------

    const provinces = await getProvinces();

    saveJson("ghn_provinces.json", provinces);

    // --------------------------------------------------
    // 2. DISTRICT
    // --------------------------------------------------

    console.log("\n========================================");
    console.log("ĐANG LẤY DISTRICT");
    console.log("========================================");

    const allDistricts = [];

    for (let i = 0; i < provinces.length; i++) {
      const province = provinces[i];

      console.log(
        `[${i + 1}/${provinces.length}] ` +
        `${province.ProvinceName} ` +
        `(ID: ${province.ProvinceID})`
      );

      try {
        const districts = await getDistricts(
          province.ProvinceID
        );

        for (const district of districts) {
          allDistricts.push(district);
        }

        console.log(
          `   → ${districts.length} District`
        );
      } catch (error) {
        console.error(
          `   ❌ Lỗi Province ${province.ProvinceID}:`,
          error.message
        );
      }

      // Nghỉ một chút để tránh gọi API quá nhanh
      await sleep(150);
    }

    saveJson(
      "ghn_districts.json",
      allDistricts
    );

    console.log(
      `\nTổng District: ${allDistricts.length}`
    );

    // --------------------------------------------------
    // 3. WARD
    // --------------------------------------------------

    console.log("\n========================================");
    console.log("ĐANG LẤY WARD");
    console.log("========================================");

    const allWards = [];

    for (let i = 0; i < allDistricts.length; i++) {
      const district = allDistricts[i];

      console.log(
        `[${i + 1}/${allDistricts.length}] ` +
        `${district.DistrictName} ` +
        `(ID: ${district.DistrictID})`
      );

      try {
        const wards = await getWards(
          district.DistrictID
        );

        for (const ward of wards) {
          allWards.push(ward);
        }

        console.log(
          `   → ${wards.length} Ward`
        );
      } catch (error) {
        console.error(
          `   ❌ Lỗi District ${district.DistrictID}:`,
          error.message
        );
      }

      // Nghỉ giữa các request
      await sleep(150);
    }

    saveJson(
      "ghn_wards.json",
      allWards
    );

    console.log("\n========================================");
    console.log("HOÀN TẤT");
    console.log("========================================");

    console.log(
      `Province : ${provinces.length}`
    );

    console.log(
      `District : ${allDistricts.length}`
    );

    console.log(
      `Ward     : ${allWards.length}`
    );

    console.log("\nFile đã tạo:");

    console.log(
      "ghn-data/ghn_provinces.json"
    );

    console.log(
      "ghn-data/ghn_districts.json"
    );

    console.log(
      "ghn-data/ghn_wards.json"
    );
  } catch (error) {
    console.error("\n========================================");
    console.error("❌ CÓ LỖI");
    console.error("========================================");

    if (error.response) {
      console.error(
        "HTTP:",
        error.response.status
      );

      console.error(
        "Response:",
        error.response.data
      );
    } else {
      console.error(
        error.message
      );
    }

    process.exit(1);
  }
}

main();
