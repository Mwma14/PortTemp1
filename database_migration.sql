-- Add missing columns to portfolios table for DevFolio template support

-- Add skills column (JSON array of skill objects)
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::jsonb;

-- Add stats column (JSON array of stat objects)
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS stats JSONB DEFAULT '[]'::jsonb;

-- Add heroText column for template-specific hero content
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS "heroText" TEXT DEFAULT '';

-- Add faqItems column for FAQ/knowledge base entries
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS "faqItems" JSONB DEFAULT '[]'::jsonb;

-- Optional: Add index on skills for faster queries if needed
CREATE INDEX IF NOT EXISTS idx_portfolios_skills ON portfolios USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_portfolios_stats ON portfolios USING GIN(stats);
