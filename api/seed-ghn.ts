import { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://edtxexnhpbipcecceoop.supabase.co'
// Service role key - allow full access
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkdHhleFticGJpcGNlY2Nlb29wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxODQwMDcxOSwiZXhwIjoxODc2MTY5MTAxOX0.GyLIEu49mEpDK5vZhbSVNHRDflGqWSmRnKNLy-O0TnI'

const PROVINCES = [
  { province_id: 1, province_name: 'Hà Nội', province_name_en: 'Ha Noi' },
  { province_id: 58, province_name: 'TP. Hồ Chí Minh', province_name_en: 'Ho Chi Minh City' },
  { province_id: 48, province_name: 'Đà Nẵng', province_name_en: 'Da Nang' },
  { province_id: 40, province_name: 'Hải Phòng', province_name_en: 'Hai Phong' },
]

const DISTRICTS = [
  // Hà Nội (province_id: 1)
  { province_id: 1, district_id: 1, district_name: 'Hoàn Kiếm', district_name_en: 'Hoan Kiem' },
  { province_id: 1, district_id: 2, district_name: 'Ba Đình', district_name_en: 'Ba Dinh' },
  { province_id: 1, district_id: 3, district_name: 'Tây Hồ', district_name_en: 'Tay Ho' },
  { province_id: 1, district_id: 4, district_name: 'Long Biên', district_name_en: 'Long Bien' },
  { province_id: 1, district_id: 1455, district_name: 'Hà Đông', district_name_en: 'Ha Dong' },
  { province_id: 1, district_id: 1456, district_name: 'Thanh Trì', district_name_en: 'Thanh Tri' },
  
  // TP. HCM (province_id: 58)
  { province_id: 58, district_id: 1, district_name: 'Quận 1', district_name_en: 'District 1' },
  { province_id: 58, district_id: 3, district_name: 'Quận 3', district_name_en: 'District 3' },
  { province_id: 58, district_id: 4, district_name: 'Quận 4', district_name_en: 'District 4' },
  { province_id: 58, district_id: 3440, district_name: 'Bình Chánh', district_name_en: 'Binh Chanh' },
  { province_id: 58, district_id: 3441, district_name: 'Tân Phú', district_name_en: 'Tan Phu' },
  
  // Đà Nẵng (province_id: 48)
  { province_id: 48, district_id: 1, district_name: 'Hải Châu', district_name_en: 'Hai Chau' },
  { province_id: 48, district_id: 2, district_name: 'Thanh Khê', district_name_en: 'Thanh Khe' },
  { province_id: 48, district_id: 3, district_name: 'Sơn Trà', district_name_en: 'Son Tra' },
]

const WARDS = [
  // Hà Nội - Hoàn Kiếm (district_id: 1)
  { province_id: 1, district_id: 1, ward_code: '01', ward_name: 'Hàng Trống', ward_name_en: 'Hang Trong' },
  { province_id: 1, district_id: 1, ward_code: '02', ward_name: 'Hàng Bông', ward_name_en: 'Hang Bong' },
  { province_id: 1, district_id: 1, ward_code: '03', ward_name: 'Trang Tiền', ward_name_en: 'Trang Tien' },
  
  // Hà Nội - Ba Đình (district_id: 2)
  { province_id: 1, district_id: 2, ward_code: '04', ward_name: 'Phúc Tân', ward_name_en: 'Phuc Tan' },
  { province_id: 1, district_id: 2, ward_code: '05', ward_name: 'Cát Linh', ward_name_en: 'Cat Linh' },
  
  // Hà Nội - Hà Đông (district_id: 1455)
  { province_id: 1, district_id: 1455, ward_code: '21617', ward_name: 'Phúc Diễn', ward_name_en: 'Phuc Dien' },
  { province_id: 1, district_id: 1455, ward_code: '21618', ward_name: 'Dương Nội', ward_name_en: 'Duong Noi' },
  { province_id: 1, district_id: 1455, ward_code: '21619', ward_name: 'Hà Cầu', ward_name_en: 'Ha Cau' },
  
  // TP. HCM - Quận 1 (district_id: 1)
  { province_id: 58, district_id: 1, ward_code: '13000', ward_name: 'Bến Nghé', ward_name_en: 'Ben Nghe' },
  { province_id: 58, district_id: 1, ward_code: '13001', ward_name: 'Bến Thành', ward_name_en: 'Ben Thanh' },
  { province_id: 58, district_id: 1, ward_code: '13002', ward_name: 'Cầu Ông Lãnh', ward_name_en: 'Cau Ong Lanh' },
  
  // TP. HCM - Bình Chánh (district_id: 3440)
  { province_id: 58, district_id: 3440, ward_code: '13010', ward_name: 'An Lạc', ward_name_en: 'An Lac' },
  { province_id: 58, district_id: 3440, ward_code: '13011', ward_name: 'An Nhơn', ward_name_en: 'An Nhon' },
  { province_id: 58, district_id: 3440, ward_code: '13012', ward_name: 'Bình Hưng', ward_name_en: 'Binh Hung' },
  
  // Đà Nẵng - Hải Châu (district_id: 1)
  { province_id: 48, district_id: 1, ward_code: '30000', ward_name: 'Thạch Thang', ward_name_en: 'Thach Thang' },
  { province_id: 48, district_id: 1, ward_code: '30001', ward_name: 'Hòa Cường', ward_name_en: 'Hoa Cuong' },
]

export default async (req: VercelRequest, res: VercelResponse) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Only allow POST and GET
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

    console.log('🚀 Starting GHN location data seed...')

    // Clear existing data
    console.log('🗑️  Clearing existing data...')
    await supabase.from('ghn_wards').delete().neq('id', -1)
    await supabase.from('ghn_districts').delete().neq('id', -1)
    await supabase.from('ghn_provinces').delete().neq('id', -1)

    // Seed provinces
    console.log('🌍 Seeding provinces...')
    const { error: provError } = await supabase.from('ghn_provinces').insert(
      PROVINCES.map(p => ({
        ...p,
        is_active: true,
      }))
    )
    if (provError) throw provError

    // Seed districts
    console.log('🏙️  Seeding districts...')
    const { error: distError } = await supabase.from('ghn_districts').insert(
      DISTRICTS.map(d => ({
        ...d,
        is_active: true,
        support_type: 1,
      }))
    )
    if (distError) throw distError

    // Seed wards
    console.log('🏘️  Seeding wards...')
    const { error: wardError } = await supabase.from('ghn_wards').insert(
      WARDS.map(w => ({
        ...w,
        is_active: true,
        support_type: 1,
      }))
    )
    if (wardError) throw wardError

    console.log('✨ Seed completed successfully!')

    return res.status(200).json({
      success: true,
      message: 'GHN location data seeded successfully',
      data: {
        provinces: PROVINCES.length,
        districts: DISTRICTS.length,
        wards: WARDS.length,
      },
    })
  } catch (error) {
    console.error('❌ Error:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
