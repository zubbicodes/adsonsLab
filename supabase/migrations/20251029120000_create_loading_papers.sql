/*
  Create tables for Loading Papers with permissive public access (demo-friendly)
*/

-- Header table
CREATE TABLE IF NOT EXISTS loading_papers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dc_no text DEFAULT '',
  po_no text DEFAULT '',
  date text DEFAULT '',
  acc_name text DEFAULT '',
  acc_address text DEFAULT '',
  remarks text DEFAULT '',
  header_note text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Items table
CREATE TABLE IF NOT EXISTS loading_paper_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id uuid REFERENCES loading_papers(id) ON DELETE CASCADE,
  sr int DEFAULT 0,
  detail_name text DEFAULT '',
  unit text DEFAULT '',
  job_no text DEFAULT '',
  pack numeric DEFAULT 0,
  qty numeric DEFAULT 0,
  weight numeric DEFAULT 0,
  po_no text DEFAULT '',
  dc_no text DEFAULT '',
  remarks text DEFAULT ''
);

-- Enable RLS
ALTER TABLE loading_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE loading_paper_items ENABLE ROW LEVEL SECURITY;

-- Public policies (adjust for production)
CREATE POLICY "Public can view loading_papers" ON loading_papers FOR SELECT USING (true);
CREATE POLICY "Public can insert loading_papers" ON loading_papers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can delete loading_papers" ON loading_papers FOR DELETE USING (true);

CREATE POLICY "Public can view loading_paper_items" ON loading_paper_items FOR SELECT USING (true);
CREATE POLICY "Public can insert loading_paper_items" ON loading_paper_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can delete loading_paper_items" ON loading_paper_items FOR DELETE USING (true);


