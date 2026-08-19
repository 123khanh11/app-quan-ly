import { createClient } from '@supabase/supabase-js'

// Supabase config
const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// GHN Provinces data
const provinces = [
  { province_id: 1, province_name: 'Hà Nội', province_name_en: 'Ha Noi' },
  { province_id: 2, province_name: 'Hà Giang', province_name_en: 'Ha Giang' },
  { province_id: 3, province_name: 'Quảng Ninh', province_name_en: 'Quang Ninh' },
  { province_id: 4, province_name: 'Cao Bằng', province_name_en: 'Cao Bang' },
  { province_id: 5, province_name: 'Yên Bái', province_name_en: 'Yen Bai' },
  { province_id: 6, province_name: 'Bắc Giang', province_name_en: 'Bac Giang' },
  { province_id: 15, province_name: 'Hải Phòng', province_name_en: 'Hai Phong' },
  { province_id: 48, province_name: 'Đà Nẵng', province_name_en: 'Da Nang' },
  { province_id: 58, province_name: 'TP. Hồ Chí Minh', province_name_en: 'Ho Chi Minh' },
]

// GHN Districts data - mẫu cho Hà Nội và TP.HCM
const districts = [
  // Hà Nội
  { province_id: 1, district_id: 1, district_name: 'Hoàn Kiếm', district_name_en: 'Hoan Kiem' },
  { province_id: 1, district_id: 2, district_name: 'Ba Đình', district_name_en: 'Ba Dinh' },
  { province_id: 1, district_id: 3, district_name: 'Tây Hồ', district_name_en: 'Tay Ho' },
  { province_id: 1, district_id: 4, district_name: 'Thanh Xuân', district_name_en: 'Thanh Xuan' },
  { province_id: 1, district_id: 5, district_name: 'Cầu Giấy', district_name_en: 'Cau Giay' },
  { province_id: 1, district_id: 6, district_name: 'Đống Đa', district_name_en: 'Dong Da' },
  { province_id: 1, district_id: 7, district_name: 'Hai Bà Trưng', district_name_en: 'Hai Ba Trung' },
  { province_id: 1, district_id: 8, district_name: 'Hoàng Mai', district_name_en: 'Hoang Mai' },
  { province_id: 1, district_id: 9, district_name: 'Long Biên', district_name_en: 'Long Bien' },
  { province_id: 1, district_id: 10, district_name: 'Bắc Từ Liêm', district_name_en: 'Bac Tu Liem' },
  { province_id: 1, district_id: 11, district_name: 'Nam Từ Liêm', district_name_en: 'Nam Tu Liem' },
  { province_id: 1, district_id: 1455, district_name: 'Hà Đông', district_name_en: 'Ha Dong' },
  // TP. Hồ Chí Minh
  { province_id: 58, district_id: 1, district_name: 'Quận 1', district_name_en: 'District 1' },
  { province_id: 58, district_id: 3, district_name: 'Quận 3', district_name_en: 'District 3' },
  { province_id: 58, district_id: 4, district_name: 'Quận 4', district_name_en: 'District 4' },
  { province_id: 58, district_id: 5, district_name: 'Quận 5', district_name_en: 'District 5' },
  { province_id: 58, district_id: 6, district_name: 'Quận 6', district_name_en: 'District 6' },
  { province_id: 58, district_id: 7, district_name: 'Quận 7', district_name_en: 'District 7' },
  { province_id: 58, district_id: 8, district_name: 'Quận 8', district_name_en: 'District 8' },
  { province_id: 58, district_id: 10, district_name: 'Quận 10', district_name_en: 'District 10' },
  { province_id: 58, district_id: 11, district_name: 'Quận 11', district_name_en: 'District 11' },
  { province_id: 58, district_id: 12, district_name: 'Quận 12', district_name_en: 'District 12' },
  { province_id: 58, district_id: 201, district_name: 'Bình Thạnh', district_name_en: 'Binh Thanh' },
  { province_id: 58, district_id: 202, district_name: 'Gò Vấp', district_name_en: 'Go Vap' },
  { province_id: 58, district_id: 203, district_name: 'Phú Nhuận', district_name_en: 'Phu Nhuan' },
  { province_id: 58, district_id: 204, district_name: 'Tân Bình', district_name_en: 'Tan Binh' },
  { province_id: 58, district_id: 205, district_name: 'Tân Phú', district_name_en: 'Tan Phu' },
  { province_id: 58, district_id: 206, district_name: 'Thủ Đức', district_name_en: 'Thu Duc' },
  { province_id: 58, district_id: 3440, district_name: 'Bình Chánh', district_name_en: 'Binh Chanh' },
]

// GHN Wards data - mẫu
const wards = [
  // Hà Đông - Hà Nội
  { province_id: 1, district_id: 1455, ward_code: '21617', ward_name: 'Phúc Diễn', ward_name_en: 'Phuc Dien' },
  { province_id: 1, district_id: 1455, ward_code: '21618', ward_name: 'Dương Nội', ward_name_en: 'Duong Noi' },
  { province_id: 1, district_id: 1455, ward_code: '21619', ward_name: 'Hà Cầu', ward_name_en: 'Ha Cau' },
  { province_id: 1, district_id: 1455, ward_code: '21620', ward_name: 'Quang Trung', ward_name_en: 'Quang Trung' },
  { province_id: 1, district_id: 1455, ward_code: '21621', ward_name: 'Tân Mai', ward_name_en: 'Tan Mai' },
  { province_id: 1, district_id: 1455, ward_code: '21622', ward_name: 'Tây Mỗ', ward_name_en: 'Tay Mo' },
  { province_id: 1, district_id: 1455, ward_code: '21623', ward_name: 'Thanh Mỹ', ward_name_en: 'Thanh My' },
  { province_id: 1, district_id: 1455, ward_code: '21624', ward_name: 'Triều Khúc', ward_name_en: 'Trieu Khuc' },
  // Quận 1 - TP.HCM
  { province_id: 58, district_id: 1, ward_code: '13000', ward_name: 'Bến Nghé', ward_name_en: 'Ben Nghe' },
  { province_id: 58, district_id: 1, ward_code: '13001', ward_name: 'Bến Thành', ward_name_en: 'Ben Thanh' },
  { province_id: 58, district_id: 1, ward_code: '13002', ward_name: 'Cầu Ông Lãnh', ward_name_en: 'Cau Ong Lanh' },
  { province_id: 58, district_id: 1, ward_code: '13003', ward_name: 'Đa Kao', ward_name_en: 'Da Kao' },
  { province_id: 58, district_id: 1, ward_code: '13004', ward_name: 'Nguyễn Huệ', ward_name_en: 'Nguyen Hue' },
  { province_id: 58, district_id: 1, ward_code: '13005', ward_name: 'Tân Định', ward_name_en: 'Tan Dinh' },
  // Bình Chánh - TP.HCM
  { province_id: 58, district_id: 3440, ward_code: '13010', ward_name: 'An Lạc', ward_name_en: 'An Lac' },
  { province_id: 58, district_id: 3440, ward_code: '13011', ward_name: 'An Nhơn', ward_name_en: 'An Nhon' },
  { province_id: 58, district_id: 3440, ward_code: '13012', ward_name: 'Bình Hưng', ward_name_en: 'Binh Hung' },
  { province_id: 58, district_id: 3440, ward_code: '13013', ward_name: 'Tân Túc', ward_name_en: 'Tan Tuc' },
]

async function seedData() {
  try {
    console.log('🌱 Starting GHN data seed...\n')

    // Seed provinces
    console.log('📍 Seeding provinces...')
    const { data: existingProvinces } = await supabase
      .from('ghn_provinces')
      .select('province_id')
    
    const existingProvinceIds = new Set(existingProvinces?.map(p => p.province_id) || [])
    const provincesToInsert = provinces.filter(p => !existingProvinceIds.has(p.province_id))
    
    if (provincesToInsert.length > 0) {
      const { error: provinceError } = await supabase
        .from('ghn_provinces')
        .insert(provincesToInsert)
      
      if (provinceError) {
        console.error('❌ Error seeding provinces:', provinceError)
      } else {
        console.log(`✅ Seeded ${provincesToInsert.length} provinces`)
      }
    } else {
      console.log('✅ Provinces already seeded')
    }

    // Seed districts
    console.log('📍 Seeding districts...')
    const { data: existingDistricts } = await supabase
      .from('ghn_districts')
      .select('district_id')
    
    const existingDistrictIds = new Set(existingDistricts?.map(d => d.district_id) || [])
    const districtsToInsert = districts.filter(d => !existingDistrictIds.has(d.district_id))
    
    if (districtsToInsert.length > 0) {
      const { error: districtError } = await supabase
        .from('ghn_districts')
        .insert(districtsToInsert)
      
      if (districtError) {
        console.error('❌ Error seeding districts:', districtError)
      } else {
        console.log(`✅ Seeded ${districtsToInsert.length} districts`)
      }
    } else {
      console.log('✅ Districts already seeded')
    }

    // Seed wards
    console.log('📍 Seeding wards...')
    const { data: existingWards } = await supabase
      .from('ghn_wards')
      .select('ward_code, district_id')
    
    const existingWardKeys = new Set(
      existingWards?.map(w => `${w.district_id}-${w.ward_code}`) || []
    )
    const wardsToInsert = wards.filter(
      w => !existingWardKeys.has(`${w.district_id}-${w.ward_code}`)
    )
    
    if (wardsToInsert.length > 0) {
      const { error: wardError } = await supabase
        .from('ghn_wards')
        .insert(wardsToInsert)
      
      if (wardError) {
        console.error('❌ Error seeding wards:', wardError)
      } else {
        console.log(`✅ Seeded ${wardsToInsert.length} wards`)
      }
    } else {
      console.log('✅ Wards already seeded')
    }

    console.log('\n✅ GHN data seed completed!')
  } catch (error) {
    console.error('❌ Seed error:', error)
    process.exit(1)
  }
}

seedData()
