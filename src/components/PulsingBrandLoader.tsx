import React from 'react'

interface PulsingBrandLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
}

export function PulsingBrandLoader({ size = 'md', icon = '🎨' }: PulsingBrandLoaderProps) {
  const dimensions = {
    sm: 'w-24 h-24 text-2xl',
    md: 'w-32 h-32 text-4xl',
    lg: 'w-48 h-48 text-6xl',
  }[size]

  return (
    <div className={`relative ${dimensions.split(' ')[0]} ${dimensions.split(' ')[1]} flex items-center justify-center`}>
      {/* Ripples */}
      <div 
        className="absolute w-full h-full bg-[var(--sky-blue)] rounded-full opacity-20 animate-ping" 
        style={{ animationDuration: '2s' }} 
      />
      <div className="absolute w-2/3 h-2/3 bg-[var(--sky-blue)] rounded-full opacity-30 animate-pulse" />
      
      {/* Icon */}
      <div className={`relative z-10 ${dimensions.split(' ').pop()} transform transition-transform hover:scale-110 duration-500`}>
        {icon}
      </div>
    </div>
  )
}
