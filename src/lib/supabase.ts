
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://qtsrymkdgpzaiobvsobb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0c3J5bWtkZ3B6YWlvYnZzb2JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MDEwMTYsImV4cCI6MjA2MzE3NzAxNn0.YLaDdrpoi8Xu7iz8ynOJu6q_1SgvJeorlskVq_LNJ2g";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: localStorage
  }
});
