-- Add DevFolio-specific columns for proper template data separation

ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS modules JSONB DEFAULT '[]'::jsonb;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS repos JSONB DEFAULT '[]'::jsonb;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS docs JSONB DEFAULT '[]'::jsonb;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_portfolios_modules ON portfolios USING GIN(modules);
CREATE INDEX IF NOT EXISTS idx_portfolios_repos ON portfolios USING GIN(repos);
CREATE INDEX IF NOT EXISTS idx_portfolios_docs ON portfolios USING GIN(docs);
