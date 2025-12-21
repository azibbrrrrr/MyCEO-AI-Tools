import type React from "react"

interface StepCardProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  icon?: string
}

export function StepCard({ children, title, subtitle, icon }: StepCardProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[var(--shadow-medium)] animate-fade-up">
        {/* Header */}
        <div className="text-center mb-6">
          {icon && <div className="text-5xl mb-4">{icon}</div>}
          <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">{title}</h2>
          {subtitle && <p className="text-[var(--text-secondary)] mt-2">{subtitle}</p>}
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  )
}
