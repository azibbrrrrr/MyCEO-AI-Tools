-- Migration: Add Mini Websites Table (PRODUCTION)
-- RLS: Uses child existence check (compatible with SSO auth)

-- ============================================
-- 1. mini_websites - Store user website configurations
-- ============================================
CREATE TABLE IF NOT EXISTS public.mini_websites (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  child_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'My Amazing Store',
  data jsonb NOT NULL,
  is_published boolean NOT NULL DEFAULT false,
  url_slug text UNIQUE,
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT mini_websites_pkey PRIMARY KEY (id),
  CONSTRAINT mini_websites_child_id_fkey FOREIGN KEY (child_id) REFERENCES public.children(id) ON DELETE CASCADE,
  CONSTRAINT mini_websites_url_slug_check CHECK (url_slug ~ '^[a-z0-9-]+$')
);

CREATE INDEX IF NOT EXISTS idx_mini_websites_child ON public.mini_websites (child_id);
CREATE INDEX IF NOT EXISTS idx_mini_websites_slug ON public.mini_websites (url_slug) WHERE is_published = true;

-- ============================================
-- Row Level Security (RLS) Policies
-- Uses child existence check (compatible with SSO)
-- ============================================

ALTER TABLE public.mini_websites ENABLE ROW LEVEL SECURITY;

-- Allow select if child exists OR website is published (public view)
CREATE POLICY "mini_websites_select" ON public.mini_websites
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM children WHERE children.id = mini_websites.child_id)
    OR is_published = true
  );

CREATE POLICY "mini_websites_insert" ON public.mini_websites
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM children WHERE children.id = mini_websites.child_id)
  );

CREATE POLICY "mini_websites_update" ON public.mini_websites
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM children WHERE children.id = mini_websites.child_id)
  );

CREATE POLICY "mini_websites_delete" ON public.mini_websites
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM children WHERE children.id = mini_websites.child_id)
  );
