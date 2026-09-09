-- D SAJAWAT Portfolio - Supabase Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql/new

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- 1. INQUIRIES TABLE
-- ===========================================
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  event_type TEXT,
  message TEXT,
  source TEXT NOT NULL CHECK (source IN ('contact', 'quote', 'hero_cta', 'collection_card')),
  page_url TEXT,
  user_agent TEXT,
  referrer TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'converted', 'spam', 'archived')),
  priority INTEGER DEFAULT 0,
  responded_at TIMESTAMPTZ,
  responded_by TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for inquiries
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX idx_inquiries_source ON inquiries(source);
CREATE INDEX idx_inquiries_phone ON inquiries(phone);

-- Updated_at trigger for inquiries
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_inquiries_updated_at 
  BEFORE UPDATE ON inquiries 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- 2. PRODUCTS TABLE (Collections CMS)
-- ===========================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  overline TEXT,
  description TEXT,
  images TEXT[],
  category TEXT,
  gsm INTEGER,
  width_cm INTEGER,
  composition TEXT,
  colors JSONB,
  min_order_meters INTEGER,
  price_per_meter DECIMAL,
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for products
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_products_featured ON products(featured);

-- Updated_at trigger for products
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- 3. SWATCH REQUESTS TABLE
-- ===========================================
CREATE TABLE swatch_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inquiry_id UUID REFERENCES inquiries(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address JSONB NOT NULL,
  products_requested JSONB,
  tracking_number TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'shipped', 'delivered', 'returned')),
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for swatch requests
CREATE INDEX idx_swatch_requests_status ON swatch_requests(status);
CREATE INDEX idx_swatch_requests_inquiry_id ON swatch_requests(inquiry_id);

-- ===========================================
-- 4. ADMIN USERS TABLE
-- ===========================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  magic_link_token TEXT,
  magic_link_expires TIMESTAMPTZ,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE swatch_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Inquiries: Allow anonymous INSERT (for form submissions)
CREATE POLICY "Allow anonymous inquiry creation" ON inquiries
  FOR INSERT TO anon WITH CHECK (true);

-- Inquiries: Allow authenticated admin SELECT/UPDATE
CREATE POLICY "Allow admin read inquiries" ON inquiries
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admin update inquiries" ON inquiries
  FOR UPDATE TO authenticated USING (true);

-- Products: Allow anonymous SELECT for active products
CREATE POLICY "Allow public read active products" ON products
  FOR SELECT TO anon USING (active = true);

-- Products: Allow authenticated admin full access
CREATE POLICY "Allow admin full products access" ON products
  FOR ALL TO authenticated USING (true);

-- Swatch requests: Allow anonymous INSERT
CREATE POLICY "Allow anonymous swatch creation" ON swatch_requests
  FOR INSERT TO anon WITH CHECK (true);

-- Swatch requests: Allow authenticated admin access
CREATE POLICY "Allow admin read swatch requests" ON swatch_requests
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admin update swatch requests" ON swatch_requests
  FOR UPDATE TO authenticated USING (true);

-- Admin users: Only authenticated access
CREATE POLICY "Allow admin self access" ON admin_users
  FOR ALL TO authenticated USING (auth.uid() = id);

-- ===========================================
-- 6. STORAGE BUCKETS (Run in Storage section)
-- ===========================================
-- Go to Storage in Supabase dashboard and create these buckets:
-- 1. product-images (public)
-- 2. swatch-uploads (private)
-- 3. admin-assets (private)

-- ===========================================
-- 7. SAMPLE DATA (Optional - for testing)
-- ===========================================
-- INSERT INTO products (slug, title, overline, description, category, images, gsm, width_cm, composition, min_order_meters, price_per_meter, featured) VALUES
-- ('round-table-covers', 'Round Table Covers', 'Series 01', 'Premium fabric table covers for flawless event setups.', 'table-covers', ARRAY['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800'], 220, 150, '100% Polyester', 10, 120.00, true),
-- ('chair-covers', 'Chair Covers', 'Series 02', 'Transform ordinary chairs into elegant statements.', 'chair-covers', ARRAY['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'], 200, 140, 'Polyester Blend', 20, 85.00, true);