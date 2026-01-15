/**
 * Auth Callback Page
 * Handles SSO ticket exchange from Main Portal
 * 
 * URL: /auth/callback?ticket=sso_tk_xxx
 */

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useChildSession } from '@/hooks/useChildSession'
import { FloatingElements } from '@/components/floating-elements'

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { loginWithToken, child } = useChildSession()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    // If already logged in, go to dashboard
    if (child) {
      navigate('/', { replace: true })
      return
    }

    const ticket = searchParams.get('ticket')
    
    if (!ticket) {
      setError('No SSO ticket provided. Please access this page from the main portal.')
      setIsProcessing(false)
      return
    }

    // Exchange ticket for session
    async function exchangeTicket() {
      try {
        const success = await loginWithToken(ticket!)
        if (success) {
          navigate('/', { replace: true })
        } else {
          setError('Failed to authenticate. The link may have expired or already been used.')
          setIsProcessing(false)
        }
      } catch (err) {
        console.error('SSO exchange error:', err)
        setError('Authentication failed. Please try again from the main portal.')
        setIsProcessing(false)
      }
    }

    exchangeTicket()
  }, [searchParams, navigate, loginWithToken, child])

  return (
    <div className="min-h-screen bg-sky-gradient relative overflow-hidden">
      <FloatingElements />

      <main className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl p-8 shadow-[var(--shadow-high)] text-center">
            {isProcessing ? (
              <>
                <div className="text-5xl mb-4 animate-bounce">🚀</div>
                <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2">
                  Launching AI Tools...
                </h1>
                <p className="text-[var(--text-secondary)]">
                  Please wait while we set up your session
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="w-8 h-8 border-4 border-[var(--sky-blue)] border-t-transparent rounded-full animate-spin" />
                </div>
              </>
            ) : error ? (
              <>
                <div className="text-5xl mb-4">🔐</div>
                <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2">
                  Login Required
                </h1>
                <p className="text-[var(--text-secondary)] mb-6">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-6 py-3 bg-[var(--sky-blue)] text-white font-bold rounded-full hover:scale-105 transition-transform shadow-[var(--shadow-medium)]"
                >
                  Try Again
                </button>
              </>
            ) : null}
          </div>

          {/* Footer info */}
          <p className="text-center text-sm text-[var(--text-muted)] mt-6">
            Having trouble? Contact support or try logging in again from the main portal.
          </p>
        </div>
      </main>
    </div>
  )
}
