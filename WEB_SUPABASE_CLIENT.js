// ========================================
// Supabase Client Configuration
// File: src/lib/supabaseClient.js
// ========================================

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://edtxexnhpbipcecceoop.supabase.co'
const SUPABASE_KEY = 'sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ========================================
// Hoặc nếu dùng trong HTML:
// ========================================
/*
<script type="module">
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'
  
  const supabase = createClient(
    'https://edtxexnhpbipcecceoop.supabase.co',
    'sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7'
  )
  
  // Dùng supabase ở đây
</script>
*/
