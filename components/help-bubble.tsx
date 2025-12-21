"use client"

import { useState } from "react"
import { useLanguage } from "./language-provider"

export function HelpBubble() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-[var(--shadow-high)] p-4 w-64 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <p className="text-sm text-[var(--text-secondary)]">{t("common.help")}</p>
          <p className="text-xs text-[var(--text-muted)] mt-2">Click on any tool to start your adventure! 🚀</p>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[var(--sky-blue)] text-white shadow-[var(--shadow-high)] flex items-center justify-center text-2xl hover:scale-110 transition-transform duration-200"
      >
        ❓
      </button>
    </div>
  )
}
