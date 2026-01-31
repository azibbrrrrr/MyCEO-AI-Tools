import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FloatingElements } from '@/components/floating-elements'
import { useChildSession } from '@/hooks/useChildSession'

export default function MagicCodeLoginPage() {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { loginWithAccessCode } = useChildSession()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const success = await loginWithAccessCode(code.trim())
      if (success) {
        navigate('/')
      } else {
        setError('Invalid magic code. Please check and try again.')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sky-gradient relative overflow-hidden flex items-center justify-center">
      <FloatingElements />
      
      <div className="relative z-10 bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Login</h1>
        <p className="text-gray-500 mb-8">Enter your magic code to start building!</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter Magic Code (e.g. ABC-123)"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-lg text-center tracking-widest uppercase placeholder:tracking-normal placeholder:capitalize"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-500 rounded-lg text-sm font-medium animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !code.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>✨</span>
            )}
            {isLoading ? 'Checking Code...' : 'Login with Magic Code'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Ask your parent for your magic code if you forgot it.
          </p>
        </div>
      </div>
    </div>
  )
}
