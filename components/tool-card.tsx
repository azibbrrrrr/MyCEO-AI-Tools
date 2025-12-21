"use client"

import { useLanguage } from "./language-provider"
import Link from "next/link"

interface ToolCardProps {
  icon: string
  titleKey: string
  descKey: string
  href: string
  state?: "available" | "inProgress" | "usedToday" | "comingSoon"
  progress?: number
}

export function ToolCard({ icon, titleKey, descKey, href, state = "available", progress }: ToolCardProps) {
  const { t } = useLanguage()

  const isDisabled = state === "comingSoon"

  const stateColors = {
    available: "bg-[var(--mint-green)]",
    inProgress: "bg-[var(--sunshine-orange)]",
    usedToday: "bg-[var(--sky-blue)]",
    comingSoon: "bg-[var(--text-muted)]",
  }

  const CardWrapper = isDisabled ? "div" : Link

  return (
    <CardWrapper
      href={isDisabled ? undefined! : href}
      className={`block bg-white rounded-3xl p-6 shadow-[var(--shadow-medium)] transition-all duration-300 ${
        isDisabled
          ? "opacity-60 cursor-not-allowed"
          : "hover:shadow-[var(--shadow-high)] hover:scale-[1.02] cursor-pointer"
      }`}
    >
      <div className="flex flex-col items-center text-center gap-3">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--sky-blue-light)] to-[var(--sky-blue)] flex items-center justify-center text-3xl shadow-[var(--shadow-low)]">
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-[var(--text-primary)]">{t(titleKey)}</h3>

        {/* Description */}
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{t(descKey)}</p>

        {/* State badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${stateColors[state]}`}>
          {t(`state.${state}`)}
        </span>

        {/* Progress bar for in-progress state */}
        {state === "inProgress" && progress !== undefined && (
          <div className="w-full h-2 bg-[var(--muted)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--sunshine-orange)] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </CardWrapper>
  )
}
