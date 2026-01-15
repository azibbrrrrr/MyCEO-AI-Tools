-- ============================================
-- SSO Tokens Table (PRODUCTION)
-- One-time tickets for cross-app authentication
-- ============================================

CREATE TABLE IF NOT EXISTS sso_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket TEXT UNIQUE NOT NULL,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('child', 'parent', 'admin')),
  actor_id UUID NOT NULL,
  parent_id UUID,
  plan TEXT DEFAULT 'free',
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sso_tokens_ticket ON sso_tokens(ticket);
CREATE INDEX IF NOT EXISTS idx_sso_tokens_expires ON sso_tokens(expires_at);

-- Enable RLS
ALTER TABLE sso_tokens ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can insert tokens
CREATE POLICY "sso_tokens_insert_auth" ON sso_tokens
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow reading tokens for exchange (anon for callback page)
CREATE POLICY "sso_tokens_select_valid" ON sso_tokens
  FOR SELECT USING (used_at IS NULL AND expires_at > NOW());

-- Allow marking tokens as used
CREATE POLICY "sso_tokens_update_use" ON sso_tokens
  FOR UPDATE USING (used_at IS NULL);
