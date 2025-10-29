import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://tstjwjgsretjynxydjdv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzdGp3amdzcmV0anlueHlkamR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjAxMDUsImV4cCI6MjA3NTQ5NjEwNX0.9cC4UYB_S96DLkX94jzG4zvbtXX8oLAiEmSLf_BvUT0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  product_code: string;
  description: string;
  width: string;
  color: string;
  created_at: string;
};

export type ShrinkageReport = {
  id: string;
  product_code: string;
  po_number: string;
  dc_number: string;
  date: string;
  item_number: string;
  product_description: string;
  color: string;
  shrinkage_requirement: string;
  temp: string;
  dimensional_change: string;
  ph: string;
  result: string;
  created_at: string;
  updated_at: string;
};
