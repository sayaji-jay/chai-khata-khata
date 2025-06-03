import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://belvjbowviufapxotyqh.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlbHZqYm93dml1ZmFweG90eXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDY5MzAsImV4cCI6MjA2NDE4MjkzMH0.IL0IDtu_GqVPzKYh236lbJjayU0ocxh-lG_P8cGVzis"

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
}); 