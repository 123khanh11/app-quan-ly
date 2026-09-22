import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const SUPABASE_URL = 'https://edtxexnhpbipcecceoop.supabase.co'
const SUPABASE_KEY = 'sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function uploadLogo() {
  try {
    const logoPath = 'C:\\Users\\baomu\\Downloads\\Gemini_Generated_Image_w6c73ww6c73ww6c7.png'
    
    // Check if file exists
    if (!fs.existsSync(logoPath)) {
      console.error('Logo file not found:', logoPath)
      process.exit(1)
    }

    // Read file
    const fileData = fs.readFileSync(logoPath)
    const fileName = 'logo.png'
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('public')
      .upload(fileName, fileData, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'image/png'
      })

    if (error) {
      console.error('Upload error:', error)
      process.exit(1)
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('public')
      .getPublicUrl(fileName)

    console.log('Logo uploaded successfully!')
    console.log('Public URL:', publicUrl)
    
  } catch (err) {
    console.error('Error:', err)
    process.exit(1)
  }
}

uploadLogo()
