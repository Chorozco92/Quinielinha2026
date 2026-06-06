import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://byhjjmvfqybgrfqggpfl.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5aGpqbXZmcXliZ3JmcWdncGZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MTM2ODcsImV4cCI6MjA5NjI4OTY4N30.IKhvED6IbsufWjwiW-U1sxWKsm_qNNBjSbey6qznxMw'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
