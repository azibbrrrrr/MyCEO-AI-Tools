import { useState, useEffect } from 'react'

interface PulsingCounterLoaderProps {
  progress: number
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export function PulsingCounterLoader({ progress, label = "Loading", size = 'md' }: PulsingCounterLoaderProps) {
  // Use interpolation for smoothness
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let animationFrame: number
    const animate = () => {
      setDisplayValue(current => {
        if (current === progress) return current
        const diff = progress - current
        // Adjust speed based on distance: faster if far, slower if close
        // But for "smoothness" we want a nice ease-out
        const step = diff > 0 ? Math.ceil(diff * 0.05) : Math.floor(diff * 0.05) 
         
        // If step is 0 but diff is not 0, force a move to avoid getting stuck
        if (step === 0 && diff !== 0) return current + (diff > 0 ? 1 : -1)

        // Snap if very close
        if (Math.abs(diff) < 1) return progress
        
        return current + step
      })
      animationFrame = requestAnimationFrame(animate)
    }
    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [progress])

  const dimensions = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  }[size]

  return (
    <div className={`relative ${dimensions} flex items-center justify-center`}>
       {/* Ripples */}
       <div className="absolute w-full h-full bg-[var(--sky-blue)] rounded-full opacity-20 animate-ping" style={{ animationDuration: '2s' }} />
       <div className="absolute w-3/4 h-3/4 bg-[var(--sky-blue)] rounded-full opacity-10 animate-pulse" />
       
       {/* Centered Number */}
       <div className="relative z-10 flex flex-col items-center justify-center">
         <span className="text-4xl font-black text-[var(--sky-blue)] tabular-nums tracking-tighter">
           {displayValue}%
         </span>
         {label && (
           <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide mt-1">
             {label}
           </span>
         )}
       </div>
    </div>
  )
}
