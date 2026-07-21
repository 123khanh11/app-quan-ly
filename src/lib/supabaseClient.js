import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL || 'https://edtxexnhpbipcecceoop.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_KEY || 'sb_publishable_iWrqwcmaNjqUYjC5ndYd2A_xOkv0Tz7';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('Supabase credentials not found. Check your .env file.');
  console.warn('SUPABASE_URL:', SUPABASE_URL);
  console.warn('SUPABASE_KEY:', SUPABASE_KEY ? '***' : 'NOT SET');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
