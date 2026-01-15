import { Component, type ReactNode } from 'react'
import { FloatingElements } from '@/components/floating-elements'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary Component
 * Catches React errors and shows a friendly error page instead of white screen
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-sky-gradient relative overflow-hidden">
          <FloatingElements />

          <main className="relative z-10 flex items-center justify-center min-h-screen px-4">
            <div className="w-full max-w-md">
              <div className="bg-white rounded-3xl p-8 shadow-[var(--shadow-high)] text-center">
                <div className="text-5xl mb-4">😵</div>
                <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2">
                  Something Went Wrong
                </h1>
                <p className="text-[var(--text-secondary)] mb-6">
                  Don't worry, it's not your fault! Try refreshing the page.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-6 py-3 bg-[var(--sky-blue)] text-white font-bold rounded-full hover:scale-105 transition-transform shadow-[var(--shadow-medium)]"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </main>
        </div>
      )
    }

    return this.props.children
  }
}
