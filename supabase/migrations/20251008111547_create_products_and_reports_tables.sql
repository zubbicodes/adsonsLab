/*
  # Create Products and Shrinkage Reports Tables

  1. New Tables
    - `products`
      - `id` (uuid, primary key) - Unique identifier for each product
      - `product_code` (text, unique) - Product code (e.g., "20MM", "20MM B")
      - `description` (text) - Product description (e.g., "ELASTIC")
      - `width` (text) - Product width (e.g., "20MM", "25MM")
      - `color` (text) - Product color (WHITE, BLACK)
      - `created_at` (timestamptz) - Record creation timestamp
    
    - `shrinkage_reports`
      - `id` (uuid, primary key) - Unique identifier for each report
      - `product_code` (text) - Reference to product
      - `po_number` (text) - Purchase Order number
      - `dc_number` (text) - DC number
      - `date` (text) - Report date
      - `item_number` (text) - Item number
      - `product_description` (text) - Product description
      - `color` (text) - Color
      - `shrinkage_requirement` (text) - Shrinkage requirement specification
      - `temp` (text) - Temperature value
      - `dimensional_change` (text) - Dimensional change value
      - `ph` (text) - PH value
      - `result` (text) - Test result (Pass/Fail)
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage data
    - Public read access for reports (can be restricted later as needed)
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  width text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create shrinkage_reports table
CREATE TABLE IF NOT EXISTS shrinkage_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code text NOT NULL,
  po_number text NOT NULL DEFAULT '',
  dc_number text NOT NULL DEFAULT '',
  date text NOT NULL DEFAULT '',
  item_number text DEFAULT '',
  product_description text DEFAULT '',
  color text DEFAULT '',
  shrinkage_requirement text DEFAULT 'ASTCC 135-15 = -50',
  temp text DEFAULT '+/- 3%',
  dimensional_change text DEFAULT '',
  ph text DEFAULT '',
  result text DEFAULT 'Pass',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE shrinkage_reports ENABLE ROW LEVEL SECURITY;

-- Products policies - allow public read, authenticated users can manage
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- Shrinkage reports policies - allow public read, authenticated users can manage
CREATE POLICY "Anyone can view shrinkage reports"
  ON shrinkage_reports FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert reports"
  ON shrinkage_reports FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update reports"
  ON shrinkage_reports FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete reports"
  ON shrinkage_reports FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample products from the provided list
INSERT INTO products (product_code, description, width, color) VALUES
  ('20MM', 'ELASTIC', '20MM', 'WHITE'),
  ('20MM B', 'ELASTIC', '20MM', 'BLACK'),
  ('25MM', 'ELASTIC', '25MM', 'WHITE'),
  ('25MM B', 'ELASTIC', '25MM', 'BLACK'),
  ('30MM', 'ELASTIC', '30MM', 'WHITE'),
  ('30MM B', 'ELASTIC', '30MM', 'BLACK'),
  ('35MM', 'ELASTIC', '35MM', 'WHITE'),
  ('35MM B', 'ELASTIC', '35MM', 'BLACK'),
  ('40MM', 'ELASTIC', '40MM', 'WHITE'),
  ('40MM B', 'ELASTIC', '40MM', 'BLACK'),
  ('45MM', 'ELASTIC', '45MM', 'WHITE'),
  ('45MM B', 'ELASTIC', '45MM', 'BLACK'),
  ('50MM', 'ELASTIC', '50MM', 'WHITE'),
  ('50MM B', 'ELASTIC', '50MM', 'BLACK'),
  ('55MM', 'ELASTIC', '55MM', 'WHITE'),
  ('55MM B', 'ELASTIC', '55MM', 'BLACK'),
  ('5CM B', 'ELASTIC', '5CM-SS', 'BLACK'),
  ('5CM', 'ELASTIC', '5CM-SS', 'WHITE'),
  ('7MM', 'ELASTIC', '7MM-SS', 'WHITE')
ON CONFLICT (product_code) DO NOTHING;