-- ============================================
-- FIX RLS POLICIES FOR SSO AUTHENTICATION
-- Run this in Production Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. Fix mini_websites RLS
-- ============================================
DROP POLICY IF EXISTS "mini_websites_insert_own" ON mini_websites;
DROP POLICY IF EXISTS "mini_websites_update_own" ON mini_websites;
DROP POLICY IF EXISTS "mini_websites_delete_own" ON mini_websites;
DROP POLICY IF EXISTS "mini_websites_select_own" ON mini_websites;
DROP POLICY IF EXISTS "mini_websites_public_view" ON mini_websites;

CREATE POLICY "mini_websites_select" ON mini_websites
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM children WHERE children.id = mini_websites.child_id)
        OR is_published = true
    );

CREATE POLICY "mini_websites_insert" ON mini_websites
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM children WHERE children.id = mini_websites.child_id)
    );

CREATE POLICY "mini_websites_update" ON mini_websites
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM children WHERE children.id = mini_websites.child_id)
    );

CREATE POLICY "mini_websites_delete" ON mini_websites
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM children WHERE children.id = mini_websites.child_id)
    );

-- ============================================
-- 2. Fix child_logos RLS
-- ============================================
DROP POLICY IF EXISTS "child_logos_select_own" ON child_logos;
DROP POLICY IF EXISTS "child_logos_insert_own" ON child_logos;
DROP POLICY IF EXISTS "child_logos_update_own" ON child_logos;
DROP POLICY IF EXISTS "child_logos_delete_own" ON child_logos;

CREATE POLICY "child_logos_select" ON child_logos
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM children WHERE children.id = child_logos.child_id)
    );

CREATE POLICY "child_logos_insert" ON child_logos
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM children WHERE children.id = child_logos.child_id)
    );

CREATE POLICY "child_logos_update" ON child_logos
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM children WHERE children.id = child_logos.child_id)
    );

CREATE POLICY "child_logos_delete" ON child_logos
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM children WHERE children.id = child_logos.child_id)
    );

-- ============================================
-- 3. Fix ai_tool_usage RLS
-- ============================================
DROP POLICY IF EXISTS "ai_tool_usage_select_own" ON ai_tool_usage;
DROP POLICY IF EXISTS "ai_tool_usage_insert_own" ON ai_tool_usage;
DROP POLICY IF EXISTS "ai_tool_usage_update_own" ON ai_tool_usage;

CREATE POLICY "ai_tool_usage_select" ON ai_tool_usage
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM children WHERE children.id = ai_tool_usage.child_id)
    );

CREATE POLICY "ai_tool_usage_insert" ON ai_tool_usage
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM children WHERE children.id = ai_tool_usage.child_id)
    );

CREATE POLICY "ai_tool_usage_update" ON ai_tool_usage
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM children WHERE children.id = ai_tool_usage.child_id)
    );

-- ============================================
-- Done! RLS policies now work with SSO auth
-- ============================================
