import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail loudly and clearly rather than silently falling back to mock data.
  console.error(
    '[GovConnect] Missing Supabase config. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file (see .env.example).'
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Only .gov.in employee addresses are allowed to sign up for this portal.
export const ALLOWED_EMAIL_DOMAIN = '@gov.in'

export function isAllowedGovEmail(email) {
  if (!email) return false
  return email.trim().toLowerCase().endsWith(ALLOWED_EMAIL_DOMAIN)
}
