-- ============================================
-- SSO Tokens Table
-- One-time tickets for cross-app authentication
-- ============================================

CREATE TABLE IF NOT EXISTS sso_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- The random ticket string (e.g., sso_tk_7a8b9c...)
  ticket TEXT UNIQUE NOT NULL,
  
  -- Actor information
  actor_type TEXT NOT NULL CHECK (actor_type IN ('child', 'parent', 'admin')),
  actor_id UUID NOT NULL,
  parent_id UUID,  -- Required for child actors
  
  -- Subscription plan for feature flags
  plan TEXT DEFAULT 'free',
  
  -- Lifecycle
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,  -- Set when consumed (for audit trail)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fast ticket lookup
CREATE INDEX IF NOT EXISTS idx_sso_tokens_ticket ON sso_tokens(ticket);

-- For cleanup of expired tokens
CREATE INDEX IF NOT EXISTS idx_sso_tokens_expires ON sso_tokens(expires_at);

-- ============================================
-- Helper function to generate tickets
-- Main Portal can call this or generate their own
-- ============================================

CREATE OR REPLACE FUNCTION generate_sso_ticket(
  p_actor_type TEXT,
  p_actor_id UUID,
  p_parent_id UUID DEFAULT NULL,
  p_plan TEXT DEFAULT 'free',
  p_ttl_seconds INT DEFAULT 30
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_ticket TEXT;
BEGIN
  -- Generate unique ticket
  v_ticket := 'sso_tk_' || replace(gen_random_uuid()::text, '-', '');
  
  -- Insert token
  INSERT INTO sso_tokens (ticket, actor_type, actor_id, parent_id, plan, expires_at)
  VALUES (v_ticket, p_actor_type, p_actor_id, p_parent_id, p_plan, NOW() + (p_ttl_seconds || ' seconds')::interval);
  
  RETURN v_ticket;
END;
$$;

-- ============================================
-- Function to exchange ticket for session data
-- AI Tools calls this on /auth/callback
-- ============================================

CREATE OR REPLACE FUNCTION exchange_sso_ticket(p_ticket TEXT)
RETURNS TABLE (
  actor_type TEXT,
  actor_id UUID,
  parent_id UUID,
  plan TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_token RECORD;
BEGIN
  -- Find and lock the token
  SELECT * INTO v_token
  FROM sso_tokens t
  WHERE t.ticket = p_ticket
  FOR UPDATE;
  
  -- Check if token exists
  IF v_token IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired SSO ticket';
  END IF;
  
  -- Check if already used
  IF v_token.used_at IS NOT NULL THEN
    RAISE EXCEPTION 'SSO ticket has already been used';
  END IF;
  
  -- Check if expired
  IF v_token.expires_at < NOW() THEN
    RAISE EXCEPTION 'SSO ticket has expired';
  END IF;
  
  -- Mark as used (keep for audit, don't delete)
  UPDATE sso_tokens
  SET used_at = NOW()
  WHERE id = v_token.id;
  
  -- Return the session data
  RETURN QUERY
  SELECT v_token.actor_type, v_token.actor_id, v_token.parent_id, v_token.plan;
END;
$$;

-- ============================================
-- Cleanup job: Delete old tokens (optional)
-- Run this periodically via cron or Supabase Edge Function
-- ============================================

CREATE OR REPLACE FUNCTION cleanup_expired_sso_tokens()
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_deleted INT;
BEGIN
  DELETE FROM sso_tokens
  WHERE expires_at < NOW() - INTERVAL '1 hour';
  
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;

-- Grant access to authenticated users (for Main Portal to create tokens)
GRANT INSERT ON sso_tokens TO authenticated;
GRANT EXECUTE ON FUNCTION generate_sso_ticket TO authenticated;
GRANT EXECUTE ON FUNCTION exchange_sso_ticket TO anon, authenticated;
