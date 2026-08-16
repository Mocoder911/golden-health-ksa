-- ═══════════════════════════════════════════════
-- Golden Health KSA – Initial Database Schema
-- Migration: 001_initial_schema.sql
-- ═══════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- 1. SITE SETTINGS (Single-row config)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_settings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title_en       TEXT NOT NULL DEFAULT 'Premium Cosmetic Solutions',
  hero_title_ar       TEXT NOT NULL DEFAULT 'حلول تجميلية متميزة',
  hero_subtitle_en    TEXT NOT NULL DEFAULT 'Importing the world''s finest formulas for the Saudi market',
  hero_subtitle_ar    TEXT NOT NULL DEFAULT 'نستورد أفضل التركيبات العالمية للسوق السعودي',
  hero_bg_image_url   TEXT,
  global_site_bg_url  TEXT,
  experience_years_count INT NOT NULL DEFAULT 45,
  footer_about_en     TEXT NOT NULL DEFAULT 'Golden Health KSA – Premium cosmetic & skincare importer with 45+ years of excellence.',
  footer_about_ar     TEXT NOT NULL DEFAULT 'جولدن هيلث السعودية – مستورد مستحضرات تجميل وعناية بالبشرة متميزة مع أكثر من ٤٥ عامًا من التميز.',
  phone_number        TEXT,
  whatsapp_number     TEXT,
  email_address       TEXT,
  office_address_en   TEXT,
  office_address_ar   TEXT,
  social_links        JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure single-row constraint (unique index on constant)
CREATE UNIQUE INDEX site_settings_singleton ON public.site_settings ((true));

-- Insert default settings row
INSERT INTO public.site_settings (id) VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- 2. GLOBAL SOURCES (Countries & Sourcing Hubs)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.global_sources (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_name_en TEXT NOT NULL,
  country_name_ar TEXT NOT NULL,
  flag_icon       TEXT,
  specialties_en  TEXT[] NOT NULL DEFAULT '{}',
  specialties_ar  TEXT[] NOT NULL DEFAULT '{}',
  image_url       TEXT,
  display_order   INT NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_global_sources_order ON public.global_sources(display_order);

-- ─────────────────────────────────────────────
-- 3. DELIVERED ORDERS (Track Record)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.delivered_orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en            TEXT NOT NULL,
  title_ar            TEXT NOT NULL,
  client_category_en  TEXT NOT NULL DEFAULT '',
  client_category_ar  TEXT NOT NULL DEFAULT '',
  description_en      TEXT,
  description_ar      TEXT,
  quantity_details    TEXT,
  country_origin      TEXT,
  images              JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_delivered_orders_created ON public.delivered_orders(created_at DESC);

-- ─────────────────────────────────────────────
-- 4. SERVICES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.services (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en        TEXT NOT NULL,
  title_ar        TEXT NOT NULL,
  description_en  TEXT,
  description_ar  TEXT,
  icon_name       TEXT,
  display_order   INT NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_services_order ON public.services(display_order);

-- ─────────────────────────────────────────────
-- 5. INQUIRIES (Contact Form Submissions)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.inquiries (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name            TEXT NOT NULL,
  contact_name            TEXT NOT NULL,
  phone                   TEXT,
  email                   TEXT NOT NULL,
  service_type            TEXT,
  origin_country_interest TEXT,
  message                 TEXT,
  status                  TEXT NOT NULL DEFAULT 'new'
                            CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_inquiries_status ON public.inquiries(status);
CREATE INDEX idx_inquiries_created ON public.inquiries(created_at DESC);

-- ─────────────────────────────────────────────
-- 6. AUTO-UPDATE updated_at TRIGGER
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_global_sources_updated_at
  BEFORE UPDATE ON public.global_sources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_delivered_orders_updated_at
  BEFORE UPDATE ON public.delivered_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_inquiries_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ─────────────────────────────────────────────
-- 7. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivered_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Public read policies (everyone can read active content)
CREATE POLICY "Public read site_settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Public read global_sources"
  ON public.global_sources FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public read delivered_orders"
  ON public.delivered_orders FOR SELECT
  USING (true);

CREATE POLICY "Public read services"
  ON public.services FOR SELECT
  USING (is_active = true);

-- Only authenticated admins can write
CREATE POLICY "Admin write site_settings"
  ON public.site_settings FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin write global_sources"
  ON public.global_sources FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin write delivered_orders"
  ON public.delivered_orders FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin write services"
  ON public.services FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Inquiries: public can insert, only admins can read/update
CREATE POLICY "Public insert inquiries"
  ON public.inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin read inquiries"
  ON public.inquiries FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin update inquiries"
  ON public.inquiries FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
