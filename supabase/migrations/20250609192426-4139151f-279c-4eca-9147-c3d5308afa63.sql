
-- Add github_repo and project_links columns to the reports table
ALTER TABLE public.reports 
ADD COLUMN github_repo TEXT,
ADD COLUMN project_links TEXT;

-- Add comments to document the new columns
COMMENT ON COLUMN public.reports.github_repo IS 'Optional GitHub repository URL for the project';
COMMENT ON COLUMN public.reports.project_links IS 'Optional additional project links (demo URLs, documentation, etc.)';
