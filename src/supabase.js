import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://byhjjmvfqybgrfqggpfl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5aGpqbXZmcXliZ3JmcWdncGZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MTM2ODcsImV4cCI6MjA5NjI4OTY4N30.IKhvED6IbsufWjwiW-U1sxWKsm_qNNBjSbey6qznxMw'
)
