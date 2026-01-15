# Production Migrations

These are **production-safe** versions of the database migrations with:

- ✅ No DEV-ONLY permissive policies
- ✅ Proper Row Level Security (RLS) policies
- ✅ `IF NOT EXISTS` clauses for safe re-runs

## Files

| File | Description |
|------|-------------|
| `001_ai_tools_schema.sql` | AI tools registry, usage tracking, child logos |
| `002_storage_bucket.sql` | Storage bucket for generated images |
| `003_mini_websites.sql` | Mini website builder storage |
| `004_sso_tokens.sql` | SSO one-time tokens for authentication |
| `005_sales_history.sql` | Sales Buddy chat history |

## How to Apply

Run each file **in order** in your **Production Supabase SQL Editor**:

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste each file's contents
3. Run in order: 001 → 002 → 003 → 004 → 005

## Differences from Dev Migrations

| Dev Policy | Removed in Production |
|------------|----------------------|
| `child_logos_dev_all` | ✅ Removed |
| `ai_tool_usage_dev_all` | ✅ Removed |
| `mini_websites_dev_all` | ✅ Removed |

These dev policies allowed unrestricted access for testing. Production uses proper RLS restrictions.
