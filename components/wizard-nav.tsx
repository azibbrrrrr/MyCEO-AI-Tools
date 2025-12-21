"use client"

import { useLanguage } from "./language-provider"

interface WizardNavProps {
  onPrevious?: () => void
  onNext?: () => void
  canGoNext?: boolean
  isLastStep?: boolean
  isFirstStep?: boolean
  loading?: boolean
}

export function WizardNav({
  onPrevious,
  onNext,
  canGoNext = true,
  isLastStep = false,
  isFirstStep = false,
  loading = false,
}: WizardNavProps) {
  const { t } = useLanguage()

  return (
    <div className="flex items-center justify-between mt-8 gap-4">
      {!isFirstStep ? (
        <button
          onClick={onPrevious}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-[var(--border)] text-[var(--text-secondary)] font-semibold hover:border-[var(--sky-blue)] hover:text-[var(--sky-blue)] transition-all"
        >
          ← {t("common.previous")}
        </button>
      ) : (
        <div />
      )}

      <button
        onClick={onNext}
        disabled={!canGoNext || loading}
        className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white transition-all ${
          canGoNext && !loading
            ? "bg-[var(--sky-blue)] hover:shadow-[var(--shadow-high)] hover:scale-105"
            : "bg-[var(--text-muted)] cursor-not-allowed"
        }`}
      >
        {loading ? (
          <>
            <span className="animate-spin">⏳</span>
            {t("wizard.generating")}
          </>
        ) : isLastStep ? (
          <>{t("common.finish")} ✨</>
        ) : (
          <>{t("common.next")} →</>
        )}
      </button>
    </div>
  )
}
