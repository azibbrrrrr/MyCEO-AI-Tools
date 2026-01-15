-- Migration: Add Mini Websites Table (PRODUCTION)

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
-- ============================================

ALTER TABLE public.mini_websites ENABLE ROW LEVEL SECURITY;

-- Children can CRUD their own websites
CREATE POLICY "mini_websites_select_own" ON public.mini_websites
  FOR SELECT USING (child_id = auth.uid());

CREATE POLICY "mini_websites_insert_own" ON public.mini_websites
  FOR INSERT WITH CHECK (child_id = auth.uid());

CREATE POLICY "mini_websites_update_own" ON public.mini_websites
  FOR UPDATE USING (child_id = auth.uid());

CREATE POLICY "mini_websites_delete_own" ON public.mini_websites
  FOR DELETE USING (child_id = auth.uid());

-- Public can view PUBLISHED websites
CREATE POLICY "mini_websites_public_view" ON public.mini_websites
  FOR SELECT USING (is_published = true);
