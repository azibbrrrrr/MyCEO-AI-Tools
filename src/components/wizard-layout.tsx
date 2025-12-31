import type React from "react"
import { useLanguage } from "./language-provider"
import { LanguageToggle } from "./language-toggle"
import { FloatingElements } from "./floating-elements"
import { HelpBubble } from "./help-bubble"
import { Link } from "react-router-dom"

interface WizardLayoutProps {
  children: React.ReactNode
  currentStep: number
  totalSteps: number
  toolName: string
  toolIcon: string
}

export function WizardLayout({ children, currentStep, totalSteps, toolName, toolIcon }: WizardLayoutProps) {
  const { t } = useLanguage()

  const progressPercent = (currentStep / totalSteps) * 100

  return (
    <div className="min-h-screen bg-sky-gradient relative overflow-hidden">
      <FloatingElements />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 md:p-6 bg-white/50 backdrop-blur-sm">
        <Link
          to="/"
          className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-[var(--shadow-low)] hover:shadow-[var(--shadow-medium)] transition-all"
        >
          <span>←</span>
          <span className="font-semibold text-[var(--text-primary)] text-sm">{t("common.back")}</span>
        </Link>

        {/* Tool title */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">{toolIcon}</span>
          <span className="font-bold text-[var(--text-primary)] hidden sm:block">{toolName}</span>
        </div>

        <LanguageToggle />
      </header>

      {/* Progress bar */}
      <div className="relative z-10 bg-white/50 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[var(--text-secondary)]">
              {t("wizard.step")} {currentStep} / {totalSteps}
            </span>
            <span className="text-sm font-semibold text-[var(--sky-blue)]">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-3 bg-[var(--muted)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--sky-blue)] to-[var(--sunshine-orange)] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-10 px-4 md:px-8 py-6 md:py-8">{children}</main>

      <HelpBubble />
    </div>
  )
}
