/**
 * Supabase Database Types
 * 
 * Generated from database schema for MyCEO-AI-Tools
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            // ==========================================
            // AI Tools Tables
            // ==========================================

            ai_tools: {
                Row: {
                    id: string
                    key: string
                    name: string
                    description: string | null
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    key: string
                    name: string
                    description?: string | null
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    key?: string
                    name?: string
                    description?: string | null
                    is_active?: boolean
                    created_at?: string
                }
                Relationships: []
            }

            ai_tool_usage: {
                Row: {
                    id: string
                    child_id: string
                    tool_id: string
                    plan_type: 'free' | 'premium'
                    provider: string | null
                    generation_count: number
                    image_count: number
                    last_used_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    child_id: string
                    tool_id: string
                    plan_type?: 'free' | 'premium'
                    provider?: string | null
                    generation_count?: number
                    image_count?: number
                    last_used_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    child_id?: string
                    tool_id?: string
                    plan_type?: 'free' | 'premium'
                    provider?: string | null
                    generation_count?: number
                    image_count?: number
                    last_used_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "ai_tool_usage_child_id_fkey"
                        columns: ["child_id"]
                        isOneToOne: false
                        referencedRelation: "children"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "ai_tool_usage_tool_id_fkey"
                        columns: ["tool_id"]
                        isOneToOne: false
                        referencedRelation: "ai_tools"
                        referencedColumns: ["id"]
                    }
                ]
            }

            child_logos: {
                Row: {
                    id: string
                    child_id: string
                    company_id: string | null
                    tool_id: string
                    plan_type: 'free' | 'premium'
                    provider: string | null
                    company_name: string | null
                    business_type: string | null
                    logo_style: string | null
                    vibe: string | null
                    color_palette: Json | null
                    slogan: string | null
                    symbol: string | null
                    image_url: string
                    is_selected: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    child_id: string
                    company_id?: string | null
                    tool_id: string
                    plan_type?: 'free' | 'premium'
                    provider?: string | null
                    company_name?: string | null
                    business_type?: string | null
                    logo_style?: string | null
                    vibe?: string | null
                    color_palette?: Json | null
                    slogan?: string | null
                    symbol?: string | null
                    image_url: string
                    is_selected?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    child_id?: string
                    company_id?: string | null
                    tool_id?: string
                    plan_type?: 'free' | 'premium'
                    provider?: string | null
                    company_name?: string | null
                    business_type?: string | null
                    logo_style?: string | null
                    vibe?: string | null
                    color_palette?: Json | null
                    slogan?: string | null
                    symbol?: string | null
                    image_url?: string
                    is_selected?: boolean
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "child_logos_child_id_fkey"
                        columns: ["child_id"]
                        isOneToOne: false
                        referencedRelation: "children"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "child_logos_company_id_fkey"
                        columns: ["company_id"]
                        isOneToOne: false
                        referencedRelation: "companies"
                        referencedColumns: ["id"]
                    }
                ]
            }

            users: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    role: 'parent' | 'admin' | 'child'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    role?: 'parent' | 'admin' | 'child'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    role?: 'parent' | 'admin' | 'child'
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }

            parents: {
                Row: {
                    id: string
                    user_id: string
                    stripe_customer_id: string | null
                    subscription_tier: 'basic' | 'standard' | 'premium' | null
                    subscription_status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
                    trial_ends_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    stripe_customer_id?: string | null
                    subscription_tier?: 'basic' | 'standard' | 'premium' | null
                    subscription_status?: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
                    trial_ends_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    stripe_customer_id?: string | null
                    subscription_tier?: 'basic' | 'standard' | 'premium' | null
                    subscription_status?: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
                    trial_ends_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "parents_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }

            children: {
                Row: {
                    id: string
                    parent_id: string
                    name: string
                    age: number | null
                    gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
                    profile_picture_url: string | null
                    access_code: string
                    total_xp: number
                    current_level: number
                    current_streak: number
                    last_activity_at: string | null
                    created_at: string
                    updated_at: string
                    deleted_at: string | null
                }
                Insert: {
                    id?: string
                    parent_id: string
                    name: string
                    age?: number | null
                    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
                    profile_picture_url?: string | null
                    access_code: string
                    total_xp?: number
                    current_level?: number
                    current_streak?: number
                    last_activity_at?: string | null
                    created_at?: string
                    updated_at?: string
                    deleted_at?: string | null
                }
                Update: {
                    id?: string
                    parent_id?: string
                    name?: string
                    age?: number | null
                    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
                    profile_picture_url?: string | null
                    access_code?: string
                    total_xp?: number
                    current_level?: number
                    current_streak?: number
                    last_activity_at?: string | null
                    created_at?: string
                    updated_at?: string
                    deleted_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "children_parent_id_fkey"
                        columns: ["parent_id"]
                        isOneToOne: false
                        referencedRelation: "parents"
                        referencedColumns: ["id"]
                    }
                ]
            }

            companies: {
                Row: {
                    id: string
                    child_id: string
                    company_name: string
                    product_name: string | null
                    logo_url: string | null
                    specialty: string | null
                    initial_capital: number
                    current_balance: number
                    total_revenue: number
                    total_expenses: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    child_id: string
                    company_name: string
                    product_name?: string | null
                    logo_url?: string | null
                    specialty?: string | null
                    initial_capital?: number
                    current_balance?: number
                    total_revenue?: number
                    total_expenses?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    child_id?: string
                    company_name?: string
                    product_name?: string | null
                    logo_url?: string | null
                    specialty?: string | null
                    initial_capital?: number
                    current_balance?: number
                    total_revenue?: number
                    total_expenses?: number
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "companies_child_id_fkey"
                        columns: ["child_id"]
                        isOneToOne: false
                        referencedRelation: "children"
                        referencedColumns: ["id"]
                    }
                ]
            }

            modules: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    track: 'money_basics' | 'entrepreneurship' | 'advanced' | 'project_based' | 'online_class'
                    order_index: number
                    difficulty_level: number
                    xp_reward: number
                    is_published: boolean
                    published_at: string | null
                    thumbnail_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    track: 'money_basics' | 'entrepreneurship' | 'advanced' | 'project_based' | 'online_class'
                    order_index: number
                    difficulty_level?: number
                    xp_reward?: number
                    is_published?: boolean
                    published_at?: string | null
                    thumbnail_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    track?: 'money_basics' | 'entrepreneurship' | 'advanced' | 'project_based' | 'online_class'
                    order_index?: number
                    difficulty_level?: number
                    xp_reward?: number
                    is_published?: boolean
                    published_at?: string | null
                    thumbnail_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }

            lessons: {
                Row: {
                    id: string
                    module_id: string
                    title: string
                    content: string | null
                    lesson_type: 'video' | 'text' | 'quiz' | 'pdf' | 'presentation'
                    content_url: string | null
                    order_index: number
                    duration_minutes: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    module_id: string
                    title: string
                    content?: string | null
                    lesson_type: 'video' | 'text' | 'quiz' | 'pdf' | 'presentation'
                    content_url?: string | null
                    order_index: number
                    duration_minutes?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    module_id?: string
                    title?: string
                    content?: string | null
                    lesson_type?: 'video' | 'text' | 'quiz' | 'pdf' | 'presentation'
                    content_url?: string | null
                    order_index?: number
                    duration_minutes?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "lessons_module_id_fkey"
                        columns: ["module_id"]
                        isOneToOne: false
                        referencedRelation: "modules"
                        referencedColumns: ["id"]
                    }
                ]
            }

            achievements: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    icon_url: string | null
                    achievement_type: 'milestone' | 'performance' | 'company' | 'engagement'
                    rarity: 'common' | 'rare' | 'epic' | 'legendary'
                    xp_bonus: number
                    criteria: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    icon_url?: string | null
                    achievement_type: 'milestone' | 'performance' | 'company' | 'engagement'
                    rarity?: 'common' | 'rare' | 'epic' | 'legendary'
                    xp_bonus?: number
                    criteria?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    icon_url?: string | null
                    achievement_type?: 'milestone' | 'performance' | 'company' | 'engagement'
                    rarity?: 'common' | 'rare' | 'epic' | 'legendary'
                    xp_bonus?: number
                    criteria?: Json | null
                    created_at?: string
                }
                Relationships: []
            }

            // ==========================================
            // Sales Buddy History Tables
            // ==========================================

            sales_sessions: {
                Row: {
                    id: string
                    child_id: string
                    customer_type: 'friendly' | 'picky' | 'bargain'
                    customer_name: string
                    customer_age: number
                    customer_trait: string | null
                    customer_goal: string | null
                    customer_social: string | null
                    product_name: string
                    product_price: number
                    product_desc: string | null
                    final_mood: number | null
                    outcome: 'success' | 'fail' | 'abandoned' | null
                    rating: number | null
                    reflection_review_en: string | null
                    reflection_review_bm: string | null
                    reflection_good_en: string | null
                    reflection_good_bm: string | null
                    reflection_tip_en: string | null
                    reflection_tip_bm: string | null
                    language: 'EN' | 'BM' | null
                    created_at: string
                    completed_at: string | null
                }
                Insert: {
                    id?: string
                    child_id: string
                    customer_type: 'friendly' | 'picky' | 'bargain'
                    customer_name: string
                    customer_age: number
                    customer_trait?: string | null
                    customer_goal?: string | null
                    customer_social?: string | null
                    product_name: string
                    product_price: number
                    product_desc?: string | null
                    final_mood?: number | null
                    outcome?: 'success' | 'fail' | 'abandoned' | null
                    rating?: number | null
                    reflection_review_en?: string | null
                    reflection_review_bm?: string | null
                    reflection_good_en?: string | null
                    reflection_good_bm?: string | null
                    reflection_tip_en?: string | null
                    reflection_tip_bm?: string | null
                    language?: 'EN' | 'BM' | null
                    created_at?: string
                    completed_at?: string | null
                }
                Update: {
                    id?: string
                    child_id?: string
                    customer_type?: 'friendly' | 'picky' | 'bargain'
                    customer_name?: string
                    customer_age?: number
                    customer_trait?: string | null
                    customer_goal?: string | null
                    customer_social?: string | null
                    product_name?: string
                    product_price?: number
                    product_desc?: string | null
                    final_mood?: number | null
                    outcome?: 'success' | 'fail' | 'abandoned' | null
                    rating?: number | null
                    reflection_review_en?: string | null
                    reflection_review_bm?: string | null
                    reflection_good_en?: string | null
                    reflection_good_bm?: string | null
                    reflection_tip_en?: string | null
                    reflection_tip_bm?: string | null
                    language?: 'EN' | 'BM' | null
                    created_at?: string
                    completed_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "sales_sessions_child_id_fkey"
                        columns: ["child_id"]
                        isOneToOne: false
                        referencedRelation: "children"
                        referencedColumns: ["id"]
                    }
                ]
            }

            sales_messages: {
                Row: {
                    id: string
                    session_id: string
                    sender: 'user' | 'ai'
                    message: string
                    mood_after: number | null
                    turn_number: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    session_id: string
                    sender: 'user' | 'ai'
                    message: string
                    mood_after?: number | null
                    turn_number?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    session_id?: string
                    sender?: 'user' | 'ai'
                    message?: string
                    mood_after?: number | null
                    turn_number?: number | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "sales_messages_session_id_fkey"
                        columns: ["session_id"]
                        isOneToOne: false
                        referencedRelation: "sales_sessions"
                        referencedColumns: ["id"]
                    }
                ]
            }

            mini_websites: {
                Row: {
                    id: string
                    child_id: string
                    title: string
                    data: Json
                    is_published: boolean
                    url_slug: string | null
                    published_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    child_id: string
                    title?: string
                    data: Json
                    is_published?: boolean
                    url_slug?: string | null
                    published_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    child_id?: string
                    title?: string
                    data?: Json
                    is_published?: boolean
                    url_slug?: string | null
                    published_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "mini_websites_child_id_fkey"
                        columns: ["child_id"]
                        isOneToOne: false
                        referencedRelation: "children"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            plan_type: 'free' | 'premium'
            user_role: 'parent' | 'admin' | 'child'
            subscription_tier: 'basic' | 'standard' | 'premium'
            subscription_status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
            achievement_type: 'milestone' | 'performance' | 'company' | 'engagement'
            rarity: 'common' | 'rare' | 'epic' | 'legendary'
            lesson_type: 'video' | 'text' | 'quiz' | 'pdf' | 'presentation'
            track: 'money_basics' | 'entrepreneurship' | 'advanced' | 'project_based' | 'online_class'
        }
    }
}

// Helper types for common use cases
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Convenience aliases
export type AITool = Tables<'ai_tools'>
export type AIToolUsage = Tables<'ai_tool_usage'>
export type ChildLogo = Tables<'child_logos'>
export type User = Tables<'users'>
export type Parent = Tables<'parents'>
export type Child = Tables<'children'>
export type Company = Tables<'companies'>
export type Module = Tables<'modules'>
export type Lesson = Tables<'lessons'>
export type Achievement = Tables<'achievements'>
export type SalesSession = Tables<'sales_sessions'>
export type SalesMessage = Tables<'sales_messages'>
export type MiniWebsite = Tables<'mini_websites'>

