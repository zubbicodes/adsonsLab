import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
