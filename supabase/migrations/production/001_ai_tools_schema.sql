-- Migration: Add AI Tools Schema (PRODUCTION)
-- Tables: ai_tools, ai_tool_usage, child_logos
-- RLS: Uses child existence check (compatible with SSO auth)

-- ============================================
-- 1. ai_tools - Tool registry
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_tools (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  key text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT ai_tools_pkey PRIMARY KEY (id)
);

-- Seed initial tools
INSERT INTO public.ai_tools (key, name, description, is_active) VALUES
  ('logo_maker', 'AI Logo Maker', 'Generate AI-powered logos for your business', true),
  ('booth_ready', 'Booth Ready', 'Design and plan your market booth setup', true),
  ('profit_calculator', 'Profit Calculator', 'Calculate costs, revenue, and profit margins', true)
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 2. ai_tool_usage - Quota & usage tracking
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_tool_usage (
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

CREATE INDEX IF NOT EXISTS idx_ai_tool_usage_child_tool ON public.ai_tool_usage (child_id, tool_id, plan_type);

-- ============================================
-- 3. child_logos - Persisted AI results
-- ============================================
CREATE TABLE IF NOT EXISTS public.child_logos (
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

CREATE INDEX IF NOT EXISTS idx_child_logos_child ON public.child_logos (child_id);
CREATE INDEX IF NOT EXISTS idx_child_logos_selected ON public.child_logos (child_id) WHERE is_selected = true;

-- ============================================
-- Row Level Security (RLS) Policies
-- Uses child existence check (compatible with SSO)
-- ============================================

ALTER TABLE public.ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tool_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_logos ENABLE ROW LEVEL SECURITY;

-- ai_tools: Anyone can read
CREATE POLICY "ai_tools_select_all" ON public.ai_tools
  FOR SELECT USING (true);

-- ai_tool_usage: Allow if child exists
CREATE POLICY "ai_tool_usage_select" ON public.ai_tool_usage
  FOR SELECT USING (EXISTS (SELECT 1 FROM children WHERE children.id = ai_tool_usage.child_id));

CREATE POLICY "ai_tool_usage_insert" ON public.ai_tool_usage
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM children WHERE children.id = ai_tool_usage.child_id));

CREATE POLICY "ai_tool_usage_update" ON public.ai_tool_usage
  FOR UPDATE USING (EXISTS (SELECT 1 FROM children WHERE children.id = ai_tool_usage.child_id));

-- child_logos: Allow if child exists
CREATE POLICY "child_logos_select" ON public.child_logos
  FOR SELECT USING (EXISTS (SELECT 1 FROM children WHERE children.id = child_logos.child_id));

CREATE POLICY "child_logos_insert" ON public.child_logos
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM children WHERE children.id = child_logos.child_id));

CREATE POLICY "child_logos_update" ON public.child_logos
  FOR UPDATE USING (EXISTS (SELECT 1 FROM children WHERE children.id = child_logos.child_id));

CREATE POLICY "child_logos_delete" ON public.child_logos
  FOR DELETE USING (EXISTS (SELECT 1 FROM children WHERE children.id = child_logos.child_id));
