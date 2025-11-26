-- ============================================================
-- COMPLETE SUPABASE DATABASE SCHEMA FOR PORTFOLIO PLATFORM
-- ============================================================

-- ============================================================
-- 1. PORTFOLIOS TABLE (Core)
-- ============================================================
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  about TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  profileImage TEXT,
  services JSONB DEFAULT '[]'::jsonb,
  projects JSONB DEFAULT '[]'::jsonb,
  socialMedia JSONB DEFAULT '[]'::jsonb,
  templateId INTEGER DEFAULT 1,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS portfolios_slug_idx ON portfolios(slug);
CREATE INDEX IF NOT EXISTS portfolios_createdAt_idx ON portfolios(createdAt);

-- Enable RLS on portfolios
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON portfolios
  FOR SELECT USING (true);

CREATE POLICY "Allow insert for all" ON portfolios
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for all" ON portfolios
  FOR UPDATE USING (true);


-- ============================================================
-- 2. PORTFOLIO VIEWS TABLE (Analytics)
-- ============================================================
CREATE TABLE IF NOT EXISTS portfolio_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  visitor_ip TEXT,
  visitor_country TEXT,
  visitor_city TEXT,
  referrer TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS portfolio_views_portfolio_id_idx ON portfolio_views(portfolio_id);
CREATE INDEX IF NOT EXISTS portfolio_views_viewed_at_idx ON portfolio_views(viewed_at);

ALTER TABLE portfolio_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON portfolio_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read" ON portfolio_views
  FOR SELECT USING (true);


-- ============================================================
-- 3. PORTFOLIO COMMENTS TABLE (Feedback)
-- ============================================================
CREATE TABLE IF NOT EXISTS portfolio_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  visitor_name TEXT NOT NULL,
  visitor_email TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS portfolio_comments_portfolio_id_idx ON portfolio_comments(portfolio_id);
CREATE INDEX IF NOT EXISTS portfolio_comments_created_at_idx ON portfolio_comments(created_at);

ALTER TABLE portfolio_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON portfolio_comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read" ON portfolio_comments
  FOR SELECT USING (true);


-- ============================================================
-- 4. TEMPLATES TABLE (Template Management)
-- ============================================================
CREATE TABLE IF NOT EXISTS templates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  preview_image TEXT,
  design_config JSONB,
  colors JSONB,
  fonts JSONB,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS templates_slug_idx ON templates(slug);
CREATE INDEX IF NOT EXISTS templates_is_featured_idx ON templates(is_featured);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON templates
  FOR SELECT USING (true);


-- ============================================================
-- 5. PORTFOLIO ANALYTICS TABLE (Detailed Analytics)
-- ============================================================
CREATE TABLE IF NOT EXISTS portfolio_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  view_count INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2),
  last_viewed_at TIMESTAMP WITH TIME ZONE,
  month_year DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS portfolio_analytics_portfolio_month_idx 
  ON portfolio_analytics(portfolio_id, month_year);

CREATE INDEX IF NOT EXISTS portfolio_analytics_portfolio_id_idx ON portfolio_analytics(portfolio_id);

ALTER TABLE portfolio_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON portfolio_analytics
  FOR SELECT USING (true);


-- ============================================================
-- 6. USERS TABLE (For Future Authentication)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  password_hash TEXT,
  profile_image TEXT,
  bio TEXT,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS users_username_idx ON users(username);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow user read own data" ON users
  FOR SELECT USING (auth.uid() = id OR is_active = true);

CREATE POLICY "Allow user update own data" ON users
  FOR UPDATE USING (auth.uid() = id);


-- ============================================================
-- 7. USER PORTFOLIOS TABLE (Link Users to Portfolios)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'owner' CHECK (role IN ('owner', 'editor', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, portfolio_id)
);

CREATE INDEX IF NOT EXISTS user_portfolios_user_id_idx ON user_portfolios(user_id);
CREATE INDEX IF NOT EXISTS user_portfolios_portfolio_id_idx ON user_portfolios(portfolio_id);

ALTER TABLE user_portfolios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON user_portfolios
  FOR SELECT USING (true);


-- ============================================================
-- 8. CONTACT MESSAGES TABLE (Contact Form Submissions)
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contact_messages_portfolio_id_idx ON contact_messages(portfolio_id);
CREATE INDEX IF NOT EXISTS contact_messages_is_read_idx ON contact_messages(is_read);
CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON contact_messages(created_at);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow portfolio owner read" ON contact_messages
  FOR SELECT USING (true);


-- ============================================================
-- 9. PORTFOLIO CUSTOM SETTINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS portfolio_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE UNIQUE,
  custom_domain TEXT UNIQUE,
  custom_colors JSONB,
  custom_fonts JSONB,
  seo_title TEXT,
  seo_description TEXT,
  google_analytics_id TEXT,
  enable_comments BOOLEAN DEFAULT true,
  enable_contact_form BOOLEAN DEFAULT true,
  show_view_count BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS portfolio_settings_portfolio_id_idx ON portfolio_settings(portfolio_id);
CREATE INDEX IF NOT EXISTS portfolio_settings_custom_domain_idx ON portfolio_settings(custom_domain);

ALTER TABLE portfolio_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON portfolio_settings
  FOR SELECT USING (true);


-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Function to increment portfolio view count
CREATE OR REPLACE FUNCTION increment_portfolio_views(portfolio_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE portfolio_analytics
  SET view_count = view_count + 1,
      last_viewed_at = now()
  WHERE portfolio_id = (SELECT id FROM portfolios WHERE slug = portfolio_slug)
    AND month_year = DATE_TRUNC('month', now())::DATE;
END;
$$ LANGUAGE plpgsql;


-- Function to get portfolio statistics
CREATE OR REPLACE FUNCTION get_portfolio_stats(portfolio_slug TEXT)
RETURNS TABLE(
  total_views BIGINT,
  total_comments BIGINT,
  average_rating NUMERIC,
  latest_view TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(pv.view_count), 0)::BIGINT,
    COUNT(DISTINCT pc.id)::BIGINT,
    COALESCE(AVG(pc.rating)::NUMERIC, 0)::NUMERIC,
    MAX(pv.viewed_at)
  FROM portfolios p
  LEFT JOIN portfolio_analytics pv ON p.id = pv.portfolio_id
  LEFT JOIN portfolio_comments pc ON p.id = pc.portfolio_id
  WHERE p.slug = portfolio_slug;
END;
$$ LANGUAGE plpgsql;


-- Function to get popular portfolios
CREATE OR REPLACE FUNCTION get_popular_portfolios(limit_count INT DEFAULT 10)
RETURNS TABLE(
  portfolio_id UUID,
  slug TEXT,
  title TEXT,
  view_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.slug,
    p.title,
    COALESCE(SUM(pa.view_count), 0)::BIGINT as view_count
  FROM portfolios p
  LEFT JOIN portfolio_analytics pa ON p.id = pa.portfolio_id
  GROUP BY p.id, p.slug, p.title
  ORDER BY view_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- SEED DATA: Insert Default Templates
-- ============================================================
INSERT INTO templates (name, slug, description, is_featured, is_active)
VALUES
  ('Neo-Brutalist Minimalist', 'neo-brutalist-minimalist', 'Clean, modern aesthetic with hard shadows and spring green accents', true, true),
  ('Modern Gradient', 'modern-gradient', 'Colorful, energetic design with vibrant gradients', true, true),
  ('Dark Minimalist', 'dark-minimalist', 'Sleek dark theme perfect for developers and designers', true, true),
  ('Tech Portfolio', 'tech-portfolio', 'Code-focused layout ideal for programmers', true, true),
  ('Creative Agency', 'creative-agency', 'Bold, artistic presentation for creative professionals', true, true),
  ('Professional Resume', 'professional-resume', 'Corporate, traditional style for business professionals', true, true)
ON CONFLICT (name) DO NOTHING;


-- ============================================================
-- CREATE VIEWS FOR EASIER QUERYING
-- ============================================================

-- View: Portfolio Summary with Stats
CREATE OR REPLACE VIEW portfolio_summaries AS
SELECT
  p.id,
  p.slug,
  p.title,
  p.subtitle,
  p.email,
  p.createdAt,
  p.updatedAt,
  COALESCE(pa.view_count, 0) as total_views,
  COALESCE(COUNT(pc.id), 0) as comment_count,
  COALESCE(AVG(pc.rating), 0) as avg_rating
FROM portfolios p
LEFT JOIN portfolio_analytics pa ON p.id = pa.portfolio_id AND pa.month_year = DATE_TRUNC('month', now())::DATE
LEFT JOIN portfolio_comments pc ON p.id = pc.portfolio_id
GROUP BY p.id, p.slug, p.title, p.subtitle, p.email, p.createdAt, p.updatedAt, pa.view_count;

-- View: Active Templates
CREATE OR REPLACE VIEW active_templates AS
SELECT *
FROM templates
WHERE is_active = true
ORDER BY is_featured DESC, created_at DESC;


-- ============================================================
-- COMMENTS
-- ============================================================
-- This migration file creates a complete database schema for a portfolio platform with:
--
-- Core Tables:
-- - portfolios: Main portfolio data
-- - portfolio_views: Track portfolio visits
-- - portfolio_comments: Visitor feedback
-- - portfolio_analytics: Monthly analytics
-- - portfolio_settings: Custom configurations
--
-- User Management (for future authentication):
-- - users: User accounts
-- - user_portfolios: User-portfolio relationships
--
-- Additional:
-- - templates: Template definitions
-- - contact_messages: Contact form submissions
--
-- All tables have RLS (Row Level Security) enabled.
-- Public tables are readable by everyone by default.
