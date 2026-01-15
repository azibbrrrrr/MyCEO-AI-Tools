-- ============================================
-- Sales Buddy Chat History Tables (PRODUCTION)
-- ============================================

CREATE TABLE IF NOT EXISTS sales_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    
    -- Customer Info
    customer_type TEXT NOT NULL CHECK (customer_type IN ('friendly', 'picky', 'bargain')),
    customer_name TEXT NOT NULL,
    customer_age INT NOT NULL,
    customer_trait TEXT,
    customer_goal TEXT,
    customer_social TEXT,
    
    -- Product Info
    product_name TEXT NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    product_desc TEXT,
    
    -- Session Results
    final_mood INT CHECK (final_mood >= 0 AND final_mood <= 100),
    outcome TEXT CHECK (outcome IN ('success', 'fail', 'abandoned')),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    
    -- Reflection (Bilingual)
    reflection_review_en TEXT,
    reflection_review_bm TEXT,
    reflection_good_en TEXT,
    reflection_good_bm TEXT,
    reflection_tip_en TEXT,
    reflection_tip_bm TEXT,
    
    -- Metadata
    language TEXT CHECK (language IN ('EN', 'BM')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS sales_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sales_sessions(id) ON DELETE CASCADE,
    
    sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
    message TEXT NOT NULL,
    mood_after INT CHECK (mood_after >= 0 AND mood_after <= 100),
    turn_number INT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sales_sessions_child_id ON sales_sessions(child_id);
CREATE INDEX IF NOT EXISTS idx_sales_sessions_created ON sales_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_messages_session ON sales_messages(session_id);

-- Enable RLS
ALTER TABLE sales_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sales_sessions
CREATE POLICY "sales_sessions_select" ON sales_sessions
    FOR SELECT USING (EXISTS (SELECT 1 FROM children WHERE children.id = sales_sessions.child_id));

CREATE POLICY "sales_sessions_insert" ON sales_sessions
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM children WHERE children.id = sales_sessions.child_id));

CREATE POLICY "sales_sessions_update" ON sales_sessions
    FOR UPDATE USING (EXISTS (SELECT 1 FROM children WHERE children.id = sales_sessions.child_id));

-- RLS Policies for sales_messages
CREATE POLICY "sales_messages_select" ON sales_messages
    FOR SELECT USING (EXISTS (SELECT 1 FROM sales_sessions WHERE sales_sessions.id = sales_messages.session_id));

CREATE POLICY "sales_messages_insert" ON sales_messages
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM sales_sessions WHERE sales_sessions.id = sales_messages.session_id));
