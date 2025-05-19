
import { createClient } from '@supabase/supabase-js';

// Check for environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate required configuration
if (!supabaseUrl) {
  console.error('Supabase URL is not configured. Please set VITE_SUPABASE_URL in your environment variables.');
}

if (!supabaseAnonKey) {
  console.error('Supabase Anon Key is not configured. Please set VITE_SUPABASE_ANON_KEY in your environment variables.');
}

// Create a supabase client with fallbacks to prevent runtime errors
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);
