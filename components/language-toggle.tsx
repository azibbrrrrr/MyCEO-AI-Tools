"use client"

import { useLanguage } from "./language-provider"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-1 bg-white rounded-full p-1 shadow-[var(--shadow-medium)]">
      <button
        onClick={() => setLanguage("BM")}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
          language === "BM" ? "bg-[var(--sky-blue)] text-white" : "text-[var(--text-secondary)] hover:bg-[var(--muted)]"
        }`}
      >
        BM
      </button>
      <button
        onClick={() => setLanguage("EN")}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
          language === "EN" ? "bg-[var(--sky-blue)] text-white" : "text-[var(--text-secondary)] hover:bg-[var(--muted)]"
        }`}
      >
        ENG
      </button>
    </div>
  )
}
