import { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://edtxexnhpbipcecceoop.supabase.co'
// Use anon key with RLS disabled tables for this operation
const SUPABASE_KEY = 'sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7'

const DATA = {
  provinces: [
    { province_id: 1, province_name: 'Hà Nội', province_name_en: 'Ha Noi', is_active: true },
    { province_id: 58, province_name: 'TP. Hồ Chí Minh', province_name_en: 'Ho Chi Minh City', is_active: true },
    { province_id: 48, province_name: 'Đà Nẵng', province_name_en: 'Da Nang', is_active: true },
    { province_id: 40, province_name: 'Hải Phòng', province_name_en: 'Hai Phong', is_active: true },
  ],
  districts: [
    // Hà Nội
    { province_id: 1, district_id: 1, district_name: 'Hoàn Kiếm', district_name_en: 'Hoan Kiem', support_type: 1, is_active: true },
    { province_id: 1, district_id: 2, district_name: 'Ba Đình', district_name_en: 'Ba Dinh', support_type: 1, is_active: true },
    { province_id: 1, district_id: 3, district_name: 'Tây Hồ', district_name_en: 'Tay Ho', support_type: 1, is_active: true },
    { province_id: 1, district_id: 4, district_name: 'Long Biên', district_name_en: 'Long Bien', support_type: 1, is_active: true },
    { province_id: 1, district_id: 1455, district_name: 'Hà Đông', district_name_en: 'Ha Dong', support_type: 1, is_active: true },
    { province_id: 1, district_id: 1456, district_name: 'Thanh Trì', district_name_en: 'Thanh Tri', support_type: 1, is_active: true },
    // TP. HCM
    { province_id: 58, district_id: 1, district_name: 'Quận 1', district_name_en: 'District 1', support_type: 1, is_active: true },
    { province_id: 58, district_id: 3, district_name: 'Quận 3', district_name_en: 'District 3', support_type: 1, is_active: true },
    { province_id: 58, district_id: 4, district_name: 'Quận 4', district_name_en: 'District 4', support_type: 1, is_active: true },
    { province_id: 58, district_id: 3440, district_name: 'Bình Chánh', district_name_en: 'Binh Chanh', support_type: 1, is_active: true },
    { province_id: 58, district_id: 3441, district_name: 'Tân Phú', district_name_en: 'Tan Phu', support_type: 1, is_active: true },
    // Đà Nẵng
    { province_id: 48, district_id: 1, district_name: 'Hải Châu', district_name_en: 'Hai Chau', support_type: 1, is_active: true },
    { province_id: 48, district_id: 2, district_name: 'Thanh Khê', district_name_en: 'Thanh Khe', support_type: 1, is_active: true },
    { province_id: 48, district_id: 3, district_name: 'Sơn Trà', district_name_en: 'Son Tra', support_type: 1, is_active: true },
  ],
  wards: [
    // Hà Nội - Hoàn Kiếm (district_id: 1)
    { province_id: 1, district_id: 1, ward_code: '01', ward_name: 'Hàng Trống', ward_name_en: 'Hang Trong', support_type: 1, is_active: true },
    { province_id: 1, district_id: 1, ward_code: '02', ward_name: 'Hàng Bông', ward_name_en: 'Hang Bong', support_type: 1, is_active: true },
    { province_id: 1, district_id: 1, ward_code: '03', ward_name: 'Trang Tiền', ward_name_en: 'Trang Tien', support_type: 1, is_active: true },
    // Hà Nội - Ba Đình (district_id: 2)
    { province_id: 1, district_id: 2, ward_code: '04', ward_name: 'Phúc Tân', ward_name_en: 'Phuc Tan', support_type: 1, is_active: true },
    { province_id: 1, district_id: 2, ward_code: '05', ward_name: 'Cát Linh', ward_name_en: 'Cat Linh', support_type: 1, is_active: true },
    // Hà Nội - Hà Đông (district_id: 1455)
    { province_id: 1, district_id: 1455, ward_code: '21617', ward_name: 'Phúc Diễn', ward_name_en: 'Phuc Dien', support_type: 1, is_active: true },
    { province_id: 1, district_id: 1455, ward_code: '21618', ward_name: 'Dương Nội', ward_name_en: 'Duong Noi', support_type: 1, is_active: true },
    { province_id: 1, district_id: 1455, ward_code: '21619', ward_name: 'Hà Cầu', ward_name_en: 'Ha Cau', support_type: 1, is_active: true },
    // TP. HCM - Quận 1 (district_id: 1)
    { province_id: 58, district_id: 1, ward_code: '13000', ward_name: 'Bến Nghé', ward_name_en: 'Ben Nghe', support_type: 1, is_active: true },
    { province_id: 58, district_id: 1, ward_code: '13001', ward_name: 'Bến Thành', ward_name_en: 'Ben Thanh', support_type: 1, is_active: true },
    { province_id: 58, district_id: 1, ward_code: '13002', ward_name: 'Cầu Ông Lãnh', ward_name_en: 'Cau Ong Lanh', support_type: 1, is_active: true },
    // TP. HCM - Bình Chánh (district_id: 3440)
    { province_id: 58, district_id: 3440, ward_code: '13010', ward_name: 'An Lạc', ward_name_en: 'An Lac', support_type: 1, is_active: true },
    { province_id: 58, district_id: 3440, ward_code: '13011', ward_name: 'An Nhơn', ward_name_en: 'An Nhon', support_type: 1, is_active: true },
    { province_id: 58, district_id: 3440, ward_code: '13012', ward_name: 'Bình Hưng', ward_name_en: 'Binh Hung', support_type: 1, is_active: true },
    // Đà Nẵng - Hải Châu (district_id: 1)
    { province_id: 48, district_id: 1, ward_code: '30000', ward_name: 'Thạch Thang', ward_name_en: 'Thach Thang', support_type: 1, is_active: true },
    { province_id: 48, district_id: 1, ward_code: '30001', ward_name: 'Hòa Cường', ward_name_en: 'Hoa Cuong', support_type: 1, is_active: true },
  ]
}

export default async (req: VercelRequest, res: VercelResponse) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

    console.log('🚀 Seeding GHN location data...')

    // Delete all existing data first
    console.log('🗑️  Clearing old data...')
    await supabase.from('ghn_wards').delete().gte('id', 0)
    await supabase.from('ghn_districts').delete().gte('id', 0)
    await supabase.from('ghn_provinces').delete().gte('id', 0)

    // Insert provinces
    console.log('🌍 Seeding provinces...')
    const { error: provErr } = await supabase
      .from('ghn_provinces')
      .insert(DATA.provinces.map(p => ({ ...p, is_active: true })))
    if (provErr) throw new Error(`Province: ${provErr.message}`)

    // Insert districts
    console.log('🏙️  Seeding districts...')
    const { error: distErr } = await supabase
      .from('ghn_districts')
      .insert(DATA.districts.map(d => ({ ...d, is_active: true })))
    if (distErr) throw new Error(`District: ${distErr.message}`)

    // Insert wards
    console.log('🏘️  Seeding wards...')
    const { error: wardErr } = await supabase
      .from('ghn_wards')
      .insert(DATA.wards.map(w => ({ ...w, is_active: true })))
    if (wardErr) throw new Error(`Ward: ${wardErr.message}`)

    console.log('✨ Seed completed!')

    return res.status(200).json({
      success: true,
      message: 'Data seeded successfully',
      counts: {
        provinces: DATA.provinces.length,
        districts: DATA.districts.length,
        wards: DATA.wards.length,
      }
    })
  } catch (error) {
    console.error('❌ Error:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
