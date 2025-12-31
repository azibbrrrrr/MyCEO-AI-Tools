/**
 * Dev Login Page
 * DEV-ONLY: Select a child to impersonate for development
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useChildSession } from '@/hooks/useChildSession'
import { FloatingElements } from '@/components/floating-elements'

interface ChildOption {
  id: string
  name: string
  age: number | null
  parent_id: string
  company_name: string | null
  total_xp: number
  current_level: number
}

export default function DevLoginPage() {
  const [children, setChildren] = useState<ChildOption[]>([])
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loginLoading, setLoginLoading] = useState(false)
  const { login, child: currentChild } = useChildSession()
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    if (currentChild) {
      navigate('/')
    }
  }, [currentChild, navigate])

  // Fetch children with their companies
  useEffect(() => {
    async function fetchChildren() {
      const { data, error } = await supabase
        .from('children')
        .select(`
          id,
          name,
          age,
          parent_id,
          total_xp,
          current_level,
          companies (
            company_name
          )
        `)
        .is('deleted_at', null)
        .order('name')

      if (error) {
        console.error('Error fetching children:', error)
        setLoading(false)
        return
      }

      const mapped: ChildOption[] = (data || []).map((child) => ({
        id: child.id,
        name: child.name,
        age: child.age,
        parent_id: child.parent_id,
        company_name: (child.companies as { company_name: string }[])?.[0]?.company_name || null,
        total_xp: child.total_xp,
        current_level: child.current_level,
      }))

      setChildren(mapped)
      setLoading(false)
    }

    fetchChildren()
  }, [])

  const handleLogin = async () => {
    if (!selectedChildId) return
    setLoginLoading(true)
    const success = await login(selectedChildId)
    if (success) {
      navigate('/')
    } else {
      alert('Failed to login. Check console for errors.')
    }
    setLoginLoading(false)
  }

  return (
    <div className="min-h-screen bg-sky-gradient relative overflow-hidden">
      <FloatingElements />

      <main className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          {/* Warning Banner */}
          <div 
            className="mb-6 py-3 px-4 rounded-2xl text-center text-white font-bold"
            style={{
              background: 'linear-gradient(90deg, #ff6b6b 0%, #ffa502 100%)',
            }}
          >
            🚨 DEV MODE – Child Impersonation
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl p-8 shadow-[var(--shadow-high)]">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🧑‍💼</div>
              <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">
                Select a Child
              </h1>
              <p className="text-[var(--text-secondary)] mt-2">
                Choose which child to impersonate for testing
              </p>
            </div>

            {/* Child List */}
            <div className="space-y-3 mb-8 max-h-80 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8 text-[var(--text-muted)]">
                  Loading children...
                </div>
              ) : children.length === 0 ? (
                <div className="text-center py-8 text-[var(--text-muted)]">
                  No children found in database.
                  <br />
                  <span className="text-sm">Add some test data first!</span>
                </div>
              ) : (
                children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChildId(child.id)}
                    className={`w-full p-4 rounded-2xl border-3 transition-all duration-200 text-left ${
                      selectedChildId === child.id
                        ? 'border-[var(--sunshine-orange)] bg-[#fff5e6] scale-[1.02] shadow-[0_4px_16px_rgba(255,184,77,0.25)]'
                        : 'border-[var(--border-light)] bg-white hover:border-[var(--sky-blue)]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--sky-blue-light)] to-[var(--sky-blue)] flex items-center justify-center text-xl">
                        {child.age && child.age < 10 ? '👦' : '🧑'}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-[var(--text-primary)]">
                          {child.name}
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">
                          Age {child.age || '?'} • Level {child.current_level} • {child.total_xp} XP
                        </div>
                        {child.company_name && (
                          <div className="text-xs text-[var(--sky-blue)] mt-1">
                            🏢 {child.company_name}
                          </div>
                        )}
                      </div>
                      {selectedChildId === child.id && (
                        <div className="text-2xl">✓</div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={!selectedChildId || loginLoading}
              className={`w-full py-4 rounded-full font-bold text-lg transition-all ${
                selectedChildId && !loginLoading
                  ? 'bg-[var(--sky-blue)] text-white hover:scale-105 shadow-[var(--shadow-medium)]'
                  : 'bg-[var(--muted)] text-[var(--text-muted)] cursor-not-allowed'
              }`}
            >
              {loginLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> Logging in...
                </span>
              ) : (
                'Login as Selected Child 🚀'
              )}
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-center text-sm text-[var(--text-muted)] mt-6">
            This page is for development only.
            <br />
            Production will use proper authentication.
          </p>
        </div>
      </main>
    </div>
  )
}
