import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  'https://qoarqrajcenjkcyjzqna.supabase.co'

const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  'sb_publishable_vZEPaPnFhXVjBx6YSpS62Q_h_F3sXJD'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
