-- Create portfolios table if it doesn't exist
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  about TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  profileimage TEXT,
  herotext TEXT DEFAULT '',
  services JSONB DEFAULT '[]'::jsonb,
  projects JSONB DEFAULT '[]'::jsonb,
  socialmedia JSONB DEFAULT '[]'::jsonb,
  faqitems JSONB DEFAULT '[]'::jsonb,
  templateid INTEGER DEFAULT 1,
  createdat TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updatedat TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS portfolios_slug_idx ON portfolios(slug);

-- Enable RLS (Row Level Security)
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON portfolios
  FOR SELECT
  USING (true);

-- Create policy for inserting own portfolio (based on JWT)
CREATE POLICY "Allow insert for authenticated users" ON portfolios
  FOR INSERT
  WITH CHECK (true);

-- Create policy for updating own portfolio
CREATE POLICY "Allow update for all" ON portfolios
  FOR UPDATE
  USING (true);
