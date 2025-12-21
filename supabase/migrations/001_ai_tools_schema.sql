-- Migration: Add AI Tools Schema
-- Tables: ai_tools, ai_tool_usage, child_logos

-- ============================================
-- 1. ai_tools - Tool registry (very stable)
-- ============================================
CREATE TABLE public.ai_tools (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  key text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT ai_tools_pkey PRIMARY KEY (id)
);

-- Seed initial tools (matching project tool keys)
INSERT INTO public.ai_tools (key, name, description, is_active) VALUES
  ('logo_maker', 'AI Logo Maker', 'Generate AI-powered logos for your business', true),
  ('booth_ready', 'Booth Ready', 'Design and plan your market booth setup', true),
  ('profit_calculator', 'Profit Calculator', 'Calculate costs, revenue, and profit margins', true);

-- ============================================
-- 2. ai_tool_usage - Quota & usage tracking (CRITICAL)
-- ============================================
CREATE TABLE public.ai_tool_usage (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  child_id uuid NOT NULL,
  tool_id uuid NOT NULL,
  plan_type text NOT NULL DEFAULT 'free',
  provider text,
  generation_count integer NOT NULL DEFAULT 0,
  image_count integer NOT NULL DEFAULT 0,
  last_used_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT ai_tool_usage_pkey PRIMARY KEY (id),
  CONSTRAINT ai_tool_usage_child_id_fkey FOREIGN KEY (child_id) REFERENCES public.children(id) ON DELETE CASCADE,
  CONSTRAINT ai_tool_usage_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.ai_tools(id) ON DELETE CASCADE,
  CONSTRAINT ai_tool_usage_child_tool_plan_unique UNIQUE (child_id, tool_id, plan_type),
  CONSTRAINT ai_tool_usage_plan_type_check CHECK (plan_type IN ('free', 'premium')),
  CONSTRAINT ai_tool_usage_generation_count_check CHECK (generation_count >= 0),
  CONSTRAINT ai_tool_usage_image_count_check CHECK (image_count >= 0)
);

-- Index for fast quota check
CREATE INDEX idx_ai_tool_usage_child_tool ON public.ai_tool_usage (child_id, tool_id, plan_type);

-- ============================================
-- 3. child_logos - Persisted AI results
-- ============================================
CREATE TABLE public.child_logos (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  child_id uuid NOT NULL,
  company_id uuid,
  tool_id uuid NOT NULL,
  plan_type text NOT NULL DEFAULT 'free',
  provider text,
  company_name text,
  business_type text,
  logo_style text,
  vibe text,
  color_palette jsonb,
  slogan text,
  symbol text,
  image_url text NOT NULL,
  is_selected boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT child_logos_pkey PRIMARY KEY (id),
  CONSTRAINT child_logos_child_id_fkey FOREIGN KEY (child_id) REFERENCES public.children(id) ON DELETE CASCADE,
  CONSTRAINT child_logos_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL,
  CONSTRAINT child_logos_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.ai_tools(id) ON DELETE CASCADE,
  CONSTRAINT child_logos_plan_type_check CHECK (plan_type IN ('free', 'premium'))
);

-- Index for fast logo gallery
CREATE INDEX idx_child_logos_child ON public.child_logos (child_id);

-- Index for selecting logo
CREATE INDEX idx_child_logos_selected ON public.child_logos (child_id) WHERE is_selected = true;

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tool_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_logos ENABLE ROW LEVEL SECURITY;

-- ai_tools: Anyone can read (public registry)
CREATE POLICY "ai_tools_select_all" ON public.ai_tools
  FOR SELECT USING (true);

-- ai_tool_usage: Children can read/write their own usage
CREATE POLICY "ai_tool_usage_select_own" ON public.ai_tool_usage
  FOR SELECT USING (child_id = auth.uid());

CREATE POLICY "ai_tool_usage_insert_own" ON public.ai_tool_usage
  FOR INSERT WITH CHECK (child_id = auth.uid());

CREATE POLICY "ai_tool_usage_update_own" ON public.ai_tool_usage
  FOR UPDATE USING (child_id = auth.uid());

-- child_logos: Children can read/write their own logos
CREATE POLICY "child_logos_select_own" ON public.child_logos
  FOR SELECT USING (child_id = auth.uid());

CREATE POLICY "child_logos_insert_own" ON public.child_logos
  FOR INSERT WITH CHECK (child_id = auth.uid());

CREATE POLICY "child_logos_update_own" ON public.child_logos
  FOR UPDATE USING (child_id = auth.uid());

CREATE POLICY "child_logos_delete_own" ON public.child_logos
  FOR DELETE USING (child_id = auth.uid());

-- ============================================
-- DEV-ONLY: Permissive policies for development
-- REMOVE THESE IN PRODUCTION!
-- ============================================

-- Allow all operations on child_logos (DEV ONLY)
CREATE POLICY "child_logos_dev_all" ON public.child_logos
  FOR ALL USING (true) WITH CHECK (true);

-- Allow all operations on ai_tool_usage (DEV ONLY)
CREATE POLICY "ai_tool_usage_dev_all" ON public.ai_tool_usage
  FOR ALL USING (true) WITH CHECK (true);
