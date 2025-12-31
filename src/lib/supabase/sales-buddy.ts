/**
 * Sales Buddy Service
 * Handles session and message storage for Sales Buddy tool
 */

import { supabase } from '@/lib/supabase'
import type { SalesSession, SalesMessage, InsertTables } from '@/lib/supabase/types'

// ============================================
// Sessions
// ============================================

/**
 * Create a new sales session
 */
export async function createSession(
    session: InsertTables<'sales_sessions'>
): Promise<SalesSession | null> {
    const { data, error } = await supabase
        .from('sales_sessions')
        .insert(session)
        .select()
        .single()

    if (error) {
        console.error('Error creating session:', error)
        return null
    }
    return data
}

/**
 * Get sessions for a child (paginated)
 */
export async function getChildSessions(
    childId: string,
    limit: number = 20,
    offset: number = 0
): Promise<SalesSession[]> {
    const { data, error } = await supabase
        .from('sales_sessions')
        .select('*')
        .eq('child_id', childId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

    if (error) {
        console.error('Error fetching sessions:', error)
        return []
    }
    return data ?? []
}

/**
 * Get a single session by ID
 */
export async function getSession(sessionId: string): Promise<SalesSession | null> {
    const { data, error } = await supabase
        .from('sales_sessions')
        .select('*')
        .eq('id', sessionId)
        .single()

    if (error) {
        console.error('Error fetching session:', error)
        return null
    }
    return data
}

/**
 * Update a session (e.g., when finished)
 */
export async function updateSession(
    sessionId: string,
    updates: Partial<InsertTables<'sales_sessions'>>
): Promise<SalesSession | null> {
    // Add completed_at if outcome is set
    const updateData = {
        ...updates,
        ...(updates.outcome ? { completed_at: new Date().toISOString() } : {})
    }

    const { data, error } = await supabase
        .from('sales_sessions')
        .update(updateData)
        .eq('id', sessionId)
        .select()
        .single()

    if (error) {
        console.error('Error updating session:', error)
        return null
    }
    return data
}

/**
 * Delete a session
 */
export async function deleteSession(sessionId: string): Promise<boolean> {
    const { error } = await supabase
        .from('sales_sessions')
        .delete()
        .eq('id', sessionId)

    if (error) {
        console.error('Error deleting session:', error)
        return false
    }
    return true
}

// ============================================
// Messages
// ============================================

/**
 * Save a message to a session
 */
export async function saveMessage(
    message: InsertTables<'sales_messages'>
): Promise<SalesMessage | null> {
    const { data, error } = await supabase
        .from('sales_messages')
        .insert(message)
        .select()
        .single()

    if (error) {
        console.error('Error saving message:', error)
        return null
    }
    return data
}

/**
 * Get all messages for a session
 */
export async function getSessionMessages(sessionId: string): Promise<SalesMessage[]> {
    const { data, error } = await supabase
        .from('sales_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching messages:', error)
        return []
    }
    return data ?? []
}

/**
 * Get session with all messages
 */
export async function getSessionWithMessages(sessionId: string): Promise<{
    session: SalesSession
    messages: SalesMessage[]
} | null> {
    const session = await getSession(sessionId)
    if (!session) return null

    const messages = await getSessionMessages(sessionId)
    return { session, messages }
}
