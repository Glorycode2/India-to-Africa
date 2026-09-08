import { createClient } from '@supabase/supabase-js'

const supabaseUr1 = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonkey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUr1, supabaseAnonkey)