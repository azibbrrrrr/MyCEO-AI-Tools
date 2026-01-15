import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        'Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY are set in your .env file.'
    )
}

export const supabase = createClient<Database>(
    supabaseUrl || '',
    supabaseAnonKey || ''
)
