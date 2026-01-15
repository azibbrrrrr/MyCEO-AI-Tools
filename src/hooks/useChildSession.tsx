/**
 * Session Context
 * Manages the current user session (child/parent/admin)
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { Child, Company } from '@/lib/supabase/types'

// Actor types supported by SSO
export type ActorType = 'child' | 'parent' | 'admin'

interface ChildWithCompany extends Child {
  companies: Company[]
  parent_email?: string
}

interface SessionData {
  actorType: ActorType
  actorId: string
  parentId?: string | null
  plan?: string
  child?: ChildWithCompany
}

interface SessionContextType {
  // Session state
  session: SessionData | null
  child: ChildWithCompany | null
  loading: boolean
  
  // Auth methods
  loginWithToken: (ticket: string) => Promise<boolean>
  logout: () => void
  
  // Utility methods
  updateCompanyLogoUrl: (logoUrl: string) => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

const STORAGE_KEY = 'session'

export function ChildSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)

  // Load session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setSession(parsed)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setLoading(false)
  }, [])

  // Login with SSO ticket
  const loginWithToken = useCallback(async (ticket: string): Promise<boolean> => {
    setLoading(true)
    try {
      // Exchange ticket for session data
      // First, find and validate the token
      const { data: tokenData, error: tokenError } = await supabase
        .from('sso_tokens')
        .select('*')
        .eq('ticket', ticket)
        .is('used_at', null)
        .gt('expires_at', new Date().toISOString())
        .single()

      if (tokenError || !tokenData) {
        console.error('SSO ticket exchange failed:', tokenError?.message || 'Invalid or expired ticket')
        setLoading(false)
        return false
      }

      // Mark ticket as used immediately
      await supabase
        .from('sso_tokens')
        .update({ used_at: new Date().toISOString() })
        .eq('id', tokenData.id)

      const { actor_type, actor_id, parent_id, plan } = tokenData as {
        actor_type: ActorType
        actor_id: string
        parent_id: string | null
        plan: string
      }

      // For child actors, fetch the full child data with companies
      if (actor_type === 'child') {
        const { data: childData, error: childError } = await supabase
          .from('children')
          .select(`
            *,
            companies (*)
          `)
          .eq('id', actor_id)
          .single()

        if (childError || !childData) {
          console.error('Error fetching child:', childError)
          setLoading(false)
          return false
        }

        // Fetch parent email
        const { data: parentData } = await supabase
          .from('parents')
          .select('users (email)')
          .eq('id', childData.parent_id)
          .single()

        const childWithCompany: ChildWithCompany = {
          ...childData,
          companies: Array.isArray(childData.companies) 
            ? childData.companies 
            : childData.companies 
              ? [childData.companies] 
              : [],
          parent_email: (parentData?.users as { email: string } | null)?.email,
        }

        const sessionData: SessionData = {
          actorType: actor_type,
          actorId: actor_id,
          parentId: parent_id ?? undefined,
          plan,
          child: childWithCompany,
        }

        setSession(sessionData)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData))

        console.log('✅ SSO login successful', {
          actor_type,
          actor_id,
          child_name: childData.name,
        })

        setLoading(false)
        return true
      }

      // For parent/admin actors (future implementation)
      const sessionData: SessionData = {
        actorType: actor_type,
        actorId: actor_id,
        parentId: parent_id ?? undefined,
        plan,
      }

      setSession(sessionData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData))
      setLoading(false)
      return true

    } catch (error) {
      console.error('Login error:', error)
      setLoading(false)
      return false
    }
  }, [])

  const logout = useCallback(() => {
    setSession(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  // Update company logo URL in session without full refresh
  const updateCompanyLogoUrl = useCallback((logoUrl: string) => {
    setSession(prev => {
      if (!prev || !prev.child || !prev.child.companies?.[0]) return prev
      
      const updatedChild: ChildWithCompany = {
        ...prev.child,
        companies: prev.child.companies.map((company, index) => 
          index === 0 ? { ...company, logo_url: logoUrl } : company
        )
      }

      const updatedSession: SessionData = {
        ...prev,
        child: updatedChild,
      }
      
      // Persist to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession))
      console.log('✅ Session updated with new logo URL:', logoUrl)
      return updatedSession
    })
  }, [])

  return (
    <SessionContext.Provider
      value={{
        session,
        child: session?.child ?? null,
        loading,
        loginWithToken,
        logout,
        updateCompanyLogoUrl,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useChildSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useChildSession must be used within a ChildSessionProvider')
  }
  return context
}
