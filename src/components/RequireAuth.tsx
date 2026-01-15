/**
 * RequireAuth Component
 * Redirects unauthenticated users to the Main Portal
 */

import { useEffect } from 'react'
import { useChildSession } from '@/hooks/useChildSession'

interface RequireAuthProps {
  children: React.ReactNode
}

// Main Portal URL for redirect when not authenticated
const MAIN_PORTAL_URL = import.meta.env.VITE_MAIN_PORTAL_URL || 'https://my-ceo.com'

export function RequireAuth({ children }: RequireAuthProps) {
  const { child, loading } = useChildSession()

  useEffect(() => {
    if (!loading && !child) {
      // Redirect to Main Portal if not authenticated
      window.location.href = MAIN_PORTAL_URL
    }
  }, [child, loading])

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-sky-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🚀</div>
          <p className="text-xl text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render children until we've confirmed auth
  if (!child) {
    return null
  }

  return <>{children}</>
}
