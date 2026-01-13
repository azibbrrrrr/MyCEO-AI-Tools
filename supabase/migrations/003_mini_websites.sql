-- Migration: Add Mini Websites Table
-- Table: mini_websites

-- ============================================
-- 1. mini_websites - Store user website configurations
-- ============================================
CREATE TABLE public.mini_websites (
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
  CONSTRAINT mini_websites_url_slug_check CHECK (url_slug ~ '^[a-z0-9-]+$') -- Only lowercase alphanumeric and dashes
);

-- Index for fast lookup by child
CREATE INDEX idx_mini_websites_child ON public.mini_websites (child_id);

-- Index for public lookup by slug
CREATE INDEX idx_mini_websites_slug ON public.mini_websites (url_slug) WHERE is_published = true;

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS
ALTER TABLE public.mini_websites ENABLE ROW LEVEL SECURITY;

-- Policy: Children can CRUD their own websites
CREATE POLICY "mini_websites_select_own" ON public.mini_websites
  FOR SELECT USING (child_id = auth.uid());

CREATE POLICY "mini_websites_insert_own" ON public.mini_websites
  FOR INSERT WITH CHECK (child_id = auth.uid());

CREATE POLICY "mini_websites_update_own" ON public.mini_websites
  FOR UPDATE USING (child_id = auth.uid());

CREATE POLICY "mini_websites_delete_own" ON public.mini_websites
  FOR DELETE USING (child_id = auth.uid());

-- Policy: Public can view PUBLISHED websites
CREATE POLICY "mini_websites_public_view" ON public.mini_websites
  FOR SELECT USING (is_published = true);

-- ============================================
-- DEV-ONLY: Permissive policies for development
-- REMOVE THESE IN PRODUCTION!
-- ============================================

-- Allow all operations on mini_websites (DEV ONLY)
CREATE POLICY "mini_websites_dev_all" ON public.mini_websites
  FOR ALL USING (true) WITH CHECK (true);
