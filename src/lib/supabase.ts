
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://qtsrymkdgpzaiobvsobb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0c3J5bWtkZ3B6YWlvYnZzb2JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MDEwMTYsImV4cCI6MjA2MzE3NzAxNn0.YLaDdrpoi8Xu7iz8ynOJu6q_1SgvJeorlskVq_LNJ2g";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: localStorage,
    autoRefreshToken: true
  }
});

// Debug function to check if table exists
export const checkTableExists = async (tableName: string) => {
  try {
    console.log(`Checking if table '${tableName}' exists...`);
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .limit(1);
    
    if (error) {
      console.error(`Error checking table ${tableName}:`, error);
      return false;
    }
    
    console.log(`Table '${tableName}' exists, data:`, data);
    return true;
  } catch (err) {
    console.error(`Error checking table ${tableName}:`, err);
    return false;
  }
};
