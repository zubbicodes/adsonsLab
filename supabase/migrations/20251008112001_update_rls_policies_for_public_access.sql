/*
  # Update RLS Policies for Public Access

  1. Changes
    - Drop existing restrictive policies
    - Add new policies that allow public access for both products and shrinkage_reports
    - This allows the application to work without authentication

  2. Security Note
    - These policies allow public read and write access
    - Consider adding authentication later for production use
*/

-- Drop existing policies for products
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON products;

-- Drop existing policies for shrinkage_reports
DROP POLICY IF EXISTS "Anyone can view shrinkage reports" ON shrinkage_reports;
DROP POLICY IF EXISTS "Authenticated users can insert reports" ON shrinkage_reports;
DROP POLICY IF EXISTS "Authenticated users can update reports" ON shrinkage_reports;
DROP POLICY IF EXISTS "Authenticated users can delete reports" ON shrinkage_reports;

-- Create new public access policies for products
CREATE POLICY "Public can view products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Public can insert products"
  ON products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update products"
  ON products FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete products"
  ON products FOR DELETE
  USING (true);

-- Create new public access policies for shrinkage_reports
CREATE POLICY "Public can view reports"
  ON shrinkage_reports FOR SELECT
  USING (true);

CREATE POLICY "Public can insert reports"
  ON shrinkage_reports FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update reports"
  ON shrinkage_reports FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete reports"
  ON shrinkage_reports FOR DELETE
  USING (true);