import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadJsonData(filename) {
  const filePath = path.join(__dirname, "ghn-data-script", "ghn-data", filename);
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

// Analyze provinces
const provinces = loadJsonData("ghn_provinces.json");
console.log("\n=== PROVINCES ===");
console.log(`Total: ${provinces.length}`);
console.log("First 5:");
provinces.slice(0, 5).forEach((p) => {
  console.log(`  ${p.ProvinceID}: ${p.ProvinceName}`);
});

// Analyze districts
const districts = loadJsonData("ghn_districts.json");
console.log("\n=== DISTRICTS ===");
console.log(`Total: ${districts.length}`);

// Group by province
const districtsByProvince = {};
districts.forEach((d) => {
  if (!districtsByProvince[d.ProvinceID]) {
    districtsByProvince[d.ProvinceID] = [];
  }
  districtsByProvince[d.ProvinceID].push(d);
});

console.log(`Unique ProvinceIDs: ${Object.keys(districtsByProvince).length}`);
console.log("Districts per province:");
Object.entries(districtsByProvince)
  .slice(0, 10)
  .forEach(([pId, dList]) => {
    const province = provinces.find((p) => p.ProvinceID == pId);
    console.log(`  ProvinceID ${pId} (${province?.ProvinceName || "Unknown"}): ${dList.length} districts`);
  });

// Check if ProvinceID 1 exists in provinces
const province1 = provinces.find((p) => p.ProvinceID === 1);
console.log(`\n=== PROVINCE ID 1 ===`);
console.log(`Found: ${province1 ? province1.ProvinceName : "NOT FOUND"}`);

if (province1) {
  const p1Districts = districtsByProvince[1];
  console.log(`Districts for ProvinceID 1: ${p1Districts?.length || 0}`);
}
