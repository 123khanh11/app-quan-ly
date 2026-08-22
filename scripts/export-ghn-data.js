import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load .env.local
dotenv.config({ path: '.env.local' })

// Supabase config
const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY

console.log('Checking env:', { SUPABASE_URL: !!SUPABASE_URL, SUPABASE_KEY: !!SUPABASE_KEY })

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function exportData() {
  try {
    console.log('📤 Exporting GHN data from Supabase...\n')

    // Fetch provinces
    console.log('📍 Fetching provinces...')
    const { data: provinces, error: provinceError } = await supabase
      .from('ghn_provinces')
      .select('*')
      .order('province_id')

    if (provinceError) {
      console.error('❌ Error fetching provinces:', provinceError)
      process.exit(1)
    }
    console.log(`✅ Got ${provinces.length} provinces`)

    // Fetch districts
    console.log('📍 Fetching districts...')
    const { data: districts, error: districtError } = await supabase
      .from('ghn_districts')
      .select('*')
      .order('district_id')

    if (districtError) {
      console.error('❌ Error fetching districts:', districtError)
      process.exit(1)
    }
    console.log(`✅ Got ${districts.length} districts`)

    // Fetch wards
    console.log('📍 Fetching wards...')
    const { data: wards, error: wardError } = await supabase
      .from('ghn_wards')
      .select('*')
      .order('district_id', 'ward_code')

    if (wardError) {
      console.error('❌ Error fetching wards:', wardError)
      process.exit(1)
    }
    console.log(`✅ Got ${wards.length} wards`)

    // Generate SQL
    let sql = '-- Generated GHN Data Export\n'
    sql += `-- Export time: ${new Date().toISOString()}\n\n`

    // Provinces SQL
    sql += '-- Insert Provinces\n'
    sql += 'INSERT INTO public.ghn_provinces (province_id, province_name, province_name_en, is_active) VALUES\n'
    sql += provinces
      .map(
        (p) =>
          `(${p.province_id}, '${escapeSql(p.province_name)}', '${escapeSql(p.province_name_en || '')}', ${p.is_active})`
      )
      .join(',\n')
    sql += '\nON CONFLICT (province_id) DO NOTHING;\n\n'

    // Districts SQL
    sql += '-- Insert Districts\n'
    sql += 'INSERT INTO public.ghn_districts (province_id, district_id, district_name, district_name_en, is_active) VALUES\n'
    sql += districts
      .map(
        (d) =>
          `(${d.province_id}, ${d.district_id}, '${escapeSql(d.district_name)}', '${escapeSql(d.district_name_en || '')}', ${d.is_active})`
      )
      .join(',\n')
    sql += '\nON CONFLICT (district_id) DO NOTHING;\n\n'

    // Wards SQL
    sql += '-- Insert Wards\n'
    sql += 'INSERT INTO public.ghn_wards (province_id, district_id, ward_code, ward_name, ward_name_en, is_active) VALUES\n'
    sql += wards
      .map(
        (w) =>
          `(${w.province_id}, ${w.district_id}, '${escapeSql(w.ward_code)}', '${escapeSql(w.ward_name)}', '${escapeSql(w.ward_name_en || '')}', ${w.is_active})`
      )
      .join(',\n')
    sql += '\nON CONFLICT (district_id, ward_code) DO NOTHING;\n'

    // Save to file
    const outputPath = path.join(process.cwd(), 'scripts', 'ghn-data-export.sql')
    fs.writeFileSync(outputPath, sql)

    console.log(`\n✅ Data exported to: ${outputPath}`)
    console.log(`\n📊 Summary:`)
    console.log(`   - Provinces: ${provinces.length}`)
    console.log(`   - Districts: ${districts.length}`)
    console.log(`   - Wards: ${wards.length}`)

    // Also export as JSON
    const jsonPath = path.join(process.cwd(), 'scripts', 'ghn-data-export.json')
    fs.writeFileSync(
      jsonPath,
      JSON.stringify(
        {
          provinces,
          districts,
          wards,
          exportedAt: new Date().toISOString(),
        },
        null,
        2
      )
    )
    console.log(`   - JSON: ${jsonPath}`)
  } catch (error) {
    console.error('❌ Export error:', error)
    process.exit(1)
  }
}

function escapeSql(str) {
  if (!str) return ''
  return str.replace(/'/g, "''")
}

exportData()
