import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { LogoCardSkeleton } from '@/components/LogoCard'
import { Skeleton } from '@/components/ui/skeleton'
import { PulsingCounterLoader } from '@/components/PulsingCounterLoader'
import { PulsingBrandLoader } from '@/components/PulsingBrandLoader'

// Helper component for Option D
function AnimatedCounterDemo() {
  const [progress, setProgress] = useState(0)
  
  // Simulate progress updates for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0
        if (prev === 0) return 30
        if (prev === 30) return 65
        if (prev === 65) return 90
        return 100
      })
    }, 2000) // Change target every 2 seconds
    return () => clearInterval(interval)
  }, [])

  // Smoothly interpolate the display number
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    let animationFrame: number
    const animate = () => {
      setDisplayValue(current => {
        if (current === progress) return current
        const diff = progress - current
        const step = diff > 0 ? Math.ceil(diff * 0.1) : Math.floor(diff * 0.1)
        
        // Snap if close
        if (Math.abs(diff) < 1) return progress
        return current + step
      })
      animationFrame = requestAnimationFrame(animate)
    }
    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [progress])

  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (displayValue / 100) * circumference

  return (
    <div className="relative w-32 h-32 flex items-center justify-center py-8">
      {/* Background Circle */}
      <svg 
        className="w-full h-full transform -rotate-90 origin-center"
        style={{ animation: 'spin 2s linear infinite' }}
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border-light)" strokeWidth="8" />
        {/* Progress Circle with transition */}
        <circle 
          cx="50" 
          cy="50" 
          r="40" 
          fill="none" 
          stroke="var(--sky-blue)" 
          strokeWidth="8" 
          strokeLinecap="round" 
          strokeDasharray={circumference} 
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
        {/* Add global keyframes for spin if not present, or rely on Tailwind's animate-spin if applied via class, 
            but here we use inline style to ensure control. 
            We need to ensure @keyframes spin exists. Tailwind usually has it. 
            Let's use the tailwind class 'animate-spin' but override duration if needed.
        */}
      </svg>
      {/* Counter Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-[var(--text-primary)]">
          {displayValue}%
        </span>
      </div>
    </div>
  )
}

function PulsingCounterDemoWrapper() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0
        return prev + 10 > 100 ? 100 : prev + 10
      })
    }, 600)
    return () => clearInterval(interval)
  }, [])

  return <PulsingCounterLoader progress={progress} />
}

export default function LoadingShowcasePage() {
  return (
    <div className="min-h-screen bg-sky-gradient p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] text-center mb-8">
          Loading Style Showcase
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. Skeleton Loader */}
          <div className="bg-white p-6 rounded-3xl shadow-[var(--shadow-medium)]">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">💀</span> Skeleton Loader
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
              <div className="w-32">
                 <LogoCardSkeleton />
              </div>
            </div>
            <p className="text-sm text-[var(--text-muted)] mt-4">
              Used for: Content placeholders (cards, text)
            </p>
          </div>

          {/* 2. Tailwind Spinner (Rocket) */}
          <div className="bg-white p-6 rounded-3xl shadow-[var(--shadow-medium)] flex flex-col items-center justify-center text-center">
             <h2 className="text-xl font-bold mb-4 w-full text-left flex items-center gap-2">
              <span className="text-2xl">🚀</span> Rocket Spinner
            </h2>
            <div className="py-8">
                <div className="text-5xl mb-4 animate-bounce">🚀</div>
                <h1 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                  Launching AI Tools...
                </h1>
                <div className="mt-4 flex justify-center">
                  <div className="w-8 h-8 border-4 border-[var(--sky-blue)] border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
            <p className="text-sm text-[var(--text-muted)] mt-4">
              Used for: Full page loads, "launching" states
            </p>
          </div>

           {/* 3. Lucide Spinner */}
           <div className="bg-white p-6 rounded-3xl shadow-[var(--shadow-medium)]">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🔄</span> Lucide Spinner
            </h2>
            <div className="flex flex-col gap-4 items-center justify-center py-8">
               <Loader2 className="w-8 h-8 text-[var(--sky-blue)] animate-spin" />
               <button disabled className="bg-[var(--sky-blue)] text-white px-6 py-2 rounded-full flex items-center gap-2 opacity-80">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
               </button>
            </div>
            <p className="text-sm text-[var(--text-muted)] mt-4">
              Used for: Buttons, inline actions
            </p>
          </div>

          {/* 4. Typing Dots */}
          <div className="bg-white p-6 rounded-3xl shadow-[var(--shadow-medium)]">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">💬</span> Typing Dots
            </h2>
            <div className="py-8 flex justify-center">
                 <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-[var(--border-light)] shadow-[var(--shadow-low)]">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                    <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                    <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                  </div>
                </div>
            </div>
             <p className="text-sm text-[var(--text-muted)] mt-4">
              Used for: Chat, AI thinking
            </p>
          </div>

          {/* 5. Circular Progress (Logo Maker) */}
          <div className="bg-white p-6 rounded-3xl shadow-[var(--shadow-medium)] md:col-span-2">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🎨</span> Circular Progress (Logo Maker)
            </h2>
            <div className="flex flex-wrap justify-center gap-8 py-8">
               {/* 0% */}
               <div className="flex flex-col items-center">
                    <div className="relative w-28 h-28">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="56" cy="56" r="45" fill="none" stroke="var(--border-light)" strokeWidth="8" />
                        <circle cx="56" cy="56" r="45" fill="none" stroke="var(--sky-blue)" strokeWidth="8" strokeLinecap="round" strokeDasharray={2 * Math.PI * 45} strokeDashoffset={2 * Math.PI * 45} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-2xl font-bold text-[var(--text-primary)]">0%</span>
                      </div>
                    </div>
                    <span className="mt-3 text-sm font-semibold text-[var(--text-primary)]">Starting...</span>
               </div>

               {/* 65% */}
               <div className="flex flex-col items-center">
                    <div className="relative w-28 h-28">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="56" cy="56" r="45" fill="none" stroke="var(--border-light)" strokeWidth="8" />
                        <circle cx="56" cy="56" r="45" fill="none" stroke="var(--sky-blue)" strokeWidth="8" strokeLinecap="round" strokeDasharray={2 * Math.PI * 45} strokeDashoffset={2 * Math.PI * 45 - (0.65 * 2 * Math.PI * 45)} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-2xl font-bold text-[var(--text-primary)]">65%</span>
                      </div>
                    </div>
                    <span className="mt-3 text-sm font-semibold text-[var(--text-primary)]">Generating...</span>
               </div>

                {/* 100% */}
               <div className="flex flex-col items-center">
                    <div className="relative w-28 h-28">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="56" cy="56" r="45" fill="none" stroke="var(--border-light)" strokeWidth="8" />
                        <circle cx="56" cy="56" r="45" fill="none" stroke="var(--sky-blue)" strokeWidth="8" strokeLinecap="round" strokeDasharray={2 * Math.PI * 45} strokeDashoffset={0} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <div className="text-3xl text-[var(--sky-blue)]">✓</div>
                      </div>
                    </div>
                    <span className="mt-3 text-sm font-semibold text-[var(--text-primary)]">Done!</span>
               </div>
            </div>
            <p className="text-sm text-[var(--text-muted)] mt-4 text-center">
              Used for: Multi-step or long-running generation processes where progress is tracked.
            </p>
          </div>


          {/* Section: New Premium Concepts */}
          <div className="md:col-span-2 mt-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 text-center">
              ✨ New Premium Concepts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Option A: Orbiting Rings */}
              <div className="bg-white p-6 rounded-3xl shadow-[var(--shadow-medium)] flex flex-col items-center">
                <h3 className="text-lg font-bold mb-6 text-[var(--text-primary)]">Option A: Orbiting Rings</h3>
                <div className="relative w-32 h-32 flex items-center justify-center py-8">
                  {/* Outer Ring */}
                  <div className="absolute inset-0 border-4 border-transparent border-t-[var(--sky-blue)] border-r-[var(--sky-blue)] rounded-full animate-spin" style={{ animationDuration: '3s' }} />
                  {/* Inner Ring */}
                  <div className="absolute inset-4 border-4 border-transparent border-t-[var(--golden-yellow)] border-l-[var(--golden-yellow)] rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
                  {/* Core */}
                  <div className="w-4 h-4 bg-[var(--text-primary)] rounded-full animate-pulse shadow-[0_0_15px_rgba(var(--sky-blue-rgb),0.5)]" />
                </div>
                <p className="text-sm text-[var(--text-muted)] mt-6 text-center">
                  Tech-forward, precise, elegant.
                </p>
              </div>

              {/* Option B: Pulsing Brand */}
              <div className="bg-white p-6 rounded-3xl shadow-[var(--shadow-medium)] flex flex-col items-center border-[var(--sky-blue)] border-4 relative overflow-hidden">
                 <div className="absolute top-0 right-0 bg-[var(--sky-blue)] text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                  SELECTED
                </div>
                <h3 className="text-lg font-bold mb-6 text-[var(--text-primary)]">Option B: Pulsing Brand</h3>
                <div className="py-8">
                  <PulsingBrandLoader />
                </div>
                <p className="text-sm text-[var(--text-muted)] mt-6 text-center">
                  Minimalist, brand-focused.
                </p>
              </div>

              {/* Option C: Floating Orbs */}
              <div className="bg-white p-6 rounded-3xl shadow-[var(--shadow-medium)] flex flex-col items-center">
                <h3 className="text-lg font-bold mb-6 text-[var(--text-primary)]">Option C: Floating Orbs</h3>
                <div className="relative w-32 h-32 flex items-center justify-center py-8">
                  <div className="relative w-16 h-16 animate-spin" style={{ animationDuration: '4s' }}>
                    {/* Orb 1 */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-[var(--sky-blue)] rounded-full shadow-lg animate-bounce" style={{ animationDelay: '0s' }} />
                    {/* Orb 2 */}
                    <div className="absolute bottom-1 right-0 w-6 h-6 bg-[var(--golden-yellow)] rounded-full shadow-lg animate-bounce" style={{ animationDelay: '0.5s' }} />
                    {/* Orb 3 */}
                    <div className="absolute bottom-1 left-0 w-6 h-6 bg-[var(--mint-green)] rounded-full shadow-lg animate-bounce" style={{ animationDelay: '1s' }} />
                  </div>
                </div>
                <p className="text-sm text-[var(--text-muted)] mt-6 text-center">
                  Playful, creative, fluid.
                </p>
              </div>

              {/* Option D: Animated Counter */}
              <div className="bg-white p-6 rounded-3xl shadow-[var(--shadow-medium)] flex flex-col items-center opacity-50 grayscale">
                <h3 className="text-lg font-bold mb-6 text-[var(--text-primary)]">Option D: Animated Counter</h3>
                <AnimatedCounterDemo />
                <p className="text-sm text-[var(--text-muted)] mt-6 text-center">
                  (Rejected) Smooth transitions, accurate spinning ring.
                </p>
              </div>

               {/* Option E: Pulsing Counter */}
               <div className="bg-white p-6 rounded-3xl shadow-[var(--shadow-medium)] flex flex-col items-center opacity-50 grayscale">
                <h3 className="text-lg font-bold mb-6 text-[var(--text-primary)]">Option E: Pulsing Counter</h3>
                <PulsingCounterDemoWrapper />
                <p className="text-sm text-[var(--text-muted)] mt-6 text-center">
                  (Rejected) Minimalist pulse + Smooth counter.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
