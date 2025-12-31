/**
 * RequireAuth Component
 * Redirects unauthenticated users to the login page
 */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChildSession } from '@/hooks/useChildSession'

interface RequireAuthProps {
  children: React.ReactNode
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { child, loading } = useChildSession()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !child) {
      navigate('/login', { replace: true })
    }
  }, [child, loading, navigate])

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
