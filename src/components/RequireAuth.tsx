/**
 * RequireAuth Component
 * Shows auth required message for unauthenticated users (no redirect)
 */

import { Navigate } from 'react-router-dom'
import { useChildSession } from '@/hooks/useChildSession'


interface RequireAuthProps {
  children: React.ReactNode
}

// Main Portal URL


export function RequireAuth({ children }: RequireAuthProps) {
  const { child, loading } = useChildSession()

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

  // Show auth required message if not logged in
  if (!child) {
    return <Navigate to="/magic-login" replace />
  }

  return <>{children}</>
}
