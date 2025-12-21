/**
 * Dev Mode Banner
 * Shows a warning banner when in dev/impersonation mode
 */

import { useChildSession } from '@/hooks/useChildSession'

export function DevModeBanner() {
  const { child, isDevMode, logout } = useChildSession()

  if (!isDevMode || !child) return null

  return (
    <div 
      className="relative w-full z-50 py-2 px-4 text-center text-sm font-bold"
      style={{
        background: 'linear-gradient(90deg, #ff6b6b 0%, #ffa502 50%, #ff6b6b 100%)',
        color: 'white',
      }}
    >
      <span className="mr-2">🚨</span>
      DEV MODE – Impersonating: <span className="underline">{child.name}</span> (Age {child.age})
      <button 
        onClick={logout}
        className="ml-4 px-3 py-1 bg-white/20 rounded-full hover:bg-white/30 transition-all text-xs"
      >
        Logout
      </button>
    </div>
  )
}
