/**
 * Supabase exports
 * Clean barrel export for all Supabase utilities
 */

export { supabase } from './client'
export type {
    Database,
    Json,
    Tables,
    InsertTables,
    UpdateTables,
    AITool,
    AIToolUsage,
    ChildLogo,
    User,
    Parent,
    Child,
    Company,
    Module,
    Lesson,
    Achievement,
    SalesSession,
    SalesMessage,
} from './types'

// AI Tools service
export {
    QUOTA_LIMITS,
    getToolByKey,
    getOrCreateUsage,
    checkQuota,
    incrementUsage,
    saveLogos,
    selectLogo,
    getChildLogos,
    getSelectedLogo,
} from './ai-tools'
export type { QuotaStatus } from './ai-tools'

// Sales Buddy service
export {
    createSession,
    getChildSessions,
    getSession,
    updateSession,
    deleteSession,
    saveMessage,
    getSessionMessages,
    getSessionWithMessages,
} from './sales-buddy'

