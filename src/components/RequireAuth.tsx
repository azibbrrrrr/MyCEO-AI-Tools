/**
 * RequireAuth Component
 * Shows auth required message for unauthenticated users (no redirect)
 */

import { useChildSession } from '@/hooks/useChildSession'
import { FloatingElements } from '@/components/floating-elements'

interface RequireAuthProps {
  children: React.ReactNode
}

// Main Portal URL
const MAIN_PORTAL_URL = import.meta.env.VITE_MAIN_PORTAL_URL || 'https://my-ceo.com'

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
    return (
      <div className="min-h-screen bg-sky-gradient relative overflow-hidden">
        <FloatingElements />

        <main className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-3xl p-8 shadow-[var(--shadow-high)] text-center">
              <div className="text-5xl mb-4">🔐</div>
              <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2">
                Login Required
              </h1>
              <p className="text-[var(--text-secondary)] mb-6">
                Please access this page from the main portal to continue.
              </p>
              <div className="space-y-3">
                <a
                  href={MAIN_PORTAL_URL}
                  className="block w-full px-6 py-3 bg-[var(--sky-blue)] text-white font-bold rounded-full hover:scale-105 transition-transform shadow-[var(--shadow-medium)]"
                >
                  Go to Main Portal
                </a>
                <button
                  onClick={() => window.location.reload()}
                  className="block w-full px-6 py-3 bg-gray-100 text-[var(--text-secondary)] font-medium rounded-full hover:bg-gray-200 transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return <>{children}</>
}
