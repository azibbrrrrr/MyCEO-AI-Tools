/**
 * Child Session Context
 * DEV-ONLY: Manages the currently "impersonated" child for development
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { Child, Company } from '@/lib/supabase/types'

interface ChildWithCompany extends Child {
  companies: Company[]
  parent_email?: string
}

interface ChildSessionContextType {
  child: ChildWithCompany | null
  loading: boolean
  isDevMode: boolean
  login: (childId: string) => Promise<boolean>
  logout: () => void
  updateCompanyLogoUrl: (logoUrl: string) => void
}

const ChildSessionContext = createContext<ChildSessionContextType | undefined>(undefined)

const STORAGE_KEY = 'dev_child_session'

export function ChildSessionProvider({ children }: { children: ReactNode }) {
  const [child, setChild] = useState<ChildWithCompany | null>(null)
  const [loading, setLoading] = useState(true)

  // Load session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setChild(parsed)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (childId: string): Promise<boolean> => {
    setLoading(true)
    try {
      // Fetch child with companies
      const { data: childData, error: childError } = await supabase
        .from('children')
        .select(`
          *,
          companies (*)
        `)
        .eq('id', childId)
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
        // Supabase can return `companies` as an object (single) or array (multiple)
        // Normalize to always be an array
        companies: Array.isArray(childData.companies) 
          ? childData.companies 
          : childData.companies 
            ? [childData.companies] 
            : [],
        parent_email: (parentData?.users as { email: string } | null)?.email,
      }

      setChild(childWithCompany)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(childWithCompany))

      // Log impersonation
      console.log('🚨 DEV MODE: Impersonating child', {
        child_id: childId,
        child_name: childData.name,
        impersonated: true,
      })

      setLoading(false)
      return true
    } catch (error) {
      console.error('Login error:', error)
      setLoading(false)
      return false
    }
  }, [])

  const logout = useCallback(() => {
    setChild(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  // Update company logo URL in session without full refresh
  const updateCompanyLogoUrl = useCallback((logoUrl: string) => {
    setChild(prev => {
      if (!prev || !prev.companies?.[0]) return prev
      
      const updatedChild: ChildWithCompany = {
        ...prev,
        companies: prev.companies.map((company, index) => 
          index === 0 ? { ...company, logo_url: logoUrl } : company
        )
      }
      
      // Persist to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedChild))
      console.log('✅ Session updated with new logo URL:', logoUrl)
      return updatedChild
    })
  }, [])

  return (
    <ChildSessionContext.Provider
      value={{
        child,
        loading,
        isDevMode: true, // Always true for now
        login,
        logout,
        updateCompanyLogoUrl,
      }}
    >
      {children}
    </ChildSessionContext.Provider>
  )
}

export function useChildSession() {
  const context = useContext(ChildSessionContext)
  if (context === undefined) {
    throw new Error('useChildSession must be used within a ChildSessionProvider')
  }
  return context
}
