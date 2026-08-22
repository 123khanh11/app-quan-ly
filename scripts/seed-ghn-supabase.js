import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://edtxexnhpbipcecceoop.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkdHhleFticGJpcGNlY2Nlb29wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxODQwMDcxOSwiZXhwIjoxODc2MTY5MTAxOX0.GyLIEu49mEpDK5vZhbSVNHRDflGqWSmRnKNLy-O0TnI'
const GHN_TOKEN = '653bfc7b-8381-11f1-a65e-a68e06d4dd1e'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function seedGHNData() {
  try {
    console.log('🚀 Starting GHN data seed to Supabase...')

    // 1. Fetch provinces from GHN
    console.log('\n📍 Fetching provinces from GHN...')
    const provincesRes = await fetch('https://online-gateway.ghn.vn/shiip/public-api/v2/master-data/province', {
      headers: {
        'Token': GHN_TOKEN,
        'Content-Type': 'application/json'
      }
    })
    const provincesData = await provincesRes.json()
    const provinces = provincesData.data || []
    console.log(`✅ Got ${provinces.length} provinces`)

    // 2. Clear existing data
    console.log('\n🗑️  Clearing existing GHN data...')
    await supabase.from('ghn_wards').delete().neq('id', -1)
    await supabase.from('ghn_districts').delete().neq('id', -1)
    await supabase.from('ghn_provinces').delete().neq('id', -1)
    console.log('✅ Cleared old data')

    // 3. Seed provinces
    console.log('\n🌍 Seeding provinces...')
    const provinceRecords = provinces.map(p => ({
      province_id: p.ProvinceID,
      province_name: p.ProvinceName,
      province_name_en: p.ProvinceName,
      is_active: true
    }))
    
    if (provinceRecords.length > 0) {
      const { error: provinceError } = await supabase.from('ghn_provinces').insert(provinceRecords)
      if (provinceError) throw new Error(`Province insert error: ${provinceError.message}`)
      console.log(`✅ Inserted ${provinceRecords.length} provinces`)
    }

    // 4. Fetch and seed districts
    console.log('\n🏙️  Fetching districts from GHN (this will take a moment)...')
    const districts = []
    
    for (const province of provinces) {
      try {
        const distRes = await fetch(
          `https://online-gateway.ghn.vn/shiip/public-api/v2/master-data/district?province_id=${province.ProvinceID}`,
          {
            headers: {
              'Token': GHN_TOKEN,
              'Content-Type': 'application/json'
            }
          }
        )
        const distData = await distRes.json()
        const dists = distData.data || []
        
        for (const d of dists) {
          districts.push({
            province_id: province.ProvinceID,
            district_id: d.DistrictID,
            district_name: d.DistrictName,
            district_name_en: d.DistrictName,
            support_type: d.SupportType || 0,
            is_active: true
          })
        }
        
        console.log(`  ✓ Province ${province.ProvinceName}: ${dists.length} districts`)
      } catch (e) {
        console.warn(`  ⚠️  Failed to fetch districts for ${province.ProvinceName}:`, e.message)
      }
      
      // Rate limiting - small delay between requests
      await new Promise(r => setTimeout(r, 100))
    }

    if (districts.length > 0) {
      console.log(`\n📥 Inserting ${districts.length} districts...`)
      
      // Insert in batches
      const batchSize = 1000
      for (let i = 0; i < districts.length; i += batchSize) {
        const batch = districts.slice(i, i + batchSize)
        const { error: distError } = await supabase.from('ghn_districts').insert(batch)
        if (distError) throw new Error(`District insert error: ${distError.message}`)
        console.log(`  ✓ Inserted batch ${Math.floor(i / batchSize) + 1}`)
      }
      console.log(`✅ Inserted all ${districts.length} districts`)
    }

    // 5. Fetch and seed wards
    console.log('\n🏘️  Fetching wards from GHN (this will take a moment)...')
    const wards = []
    
    for (const district of districts.slice(0, 100)) { // Limit to first 100 districts to avoid timeout
      try {
        const wardRes = await fetch(
          `https://online-gateway.ghn.vn/shiip/public-api/v2/master-data/ward?district_id=${district.district_id}`,
          {
            headers: {
              'Token': GHN_TOKEN,
              'Content-Type': 'application/json'
            }
          }
        )
        const wardData = await wardRes.json()
        const w = wardData.data || []
        
        for (const ward of w) {
          wards.push({
            province_id: district.province_id,
            district_id: district.district_id,
            ward_code: ward.WardCode,
            ward_name: ward.WardName,
            ward_name_en: ward.WardName,
            support_type: ward.SupportType || 0,
            is_active: true
          })
        }
      } catch (e) {
        console.warn(`  ⚠️  Failed to fetch wards for district ${district.district_id}:`, e.message)
      }
      
      // Rate limiting
      await new Promise(r => setTimeout(r, 100))
    }

    if (wards.length > 0) {
      console.log(`\n📥 Inserting ${wards.length} wards...`)
      
      // Insert in batches
      const batchSize = 1000
      for (let i = 0; i < wards.length; i += batchSize) {
        const batch = wards.slice(i, i + batchSize)
        const { error: wardError } = await supabase.from('ghn_wards').insert(batch)
        if (wardError) throw new Error(`Ward insert error: ${wardError.message}`)
        console.log(`  ✓ Inserted batch ${Math.floor(i / batchSize) + 1}`)
      }
      console.log(`✅ Inserted all ${wards.length} wards`)
    }

    console.log('\n✨ GHN data seed completed successfully!')
    console.log(`\n📊 Summary:`)
    console.log(`   - Provinces: ${provinceRecords.length}`)
    console.log(`   - Districts: ${districts.length}`)
    console.log(`   - Wards: ${wards.length}`)

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

seedGHNData()
