/**
 * Not Found Page (404)
 * Shown when user navigates to a route that doesn't exist
 */

import { Link } from 'react-router-dom'
import { FloatingElements } from '@/components/floating-elements'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-sky-gradient relative overflow-hidden">
      <FloatingElements />

      <main className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl p-8 shadow-[var(--shadow-high)] text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2">
              Page Not Found
            </h1>
            <p className="text-[var(--text-secondary)] mb-6">
              Oops! The page you're looking for doesn't exist.
            </p>
            <Link
              to="/"
              className="inline-block w-full px-6 py-3 bg-[var(--sky-blue)] text-white font-bold rounded-full hover:scale-105 transition-transform shadow-[var(--shadow-medium)]"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
