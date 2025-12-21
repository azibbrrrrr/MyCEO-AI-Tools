"use client"

import { useLanguage } from "@/components/language-provider"
import { LanguageToggle } from "@/components/language-toggle"
import { FloatingElements } from "@/components/floating-elements"
import { ToolCard } from "@/components/tool-card"
import { HelpBubble } from "@/components/help-bubble"
import Link from "next/link"

export default function LandingPage() {
  const { t } = useLanguage()

  const tools = [
    { icon: "💡", titleKey: "tool.product", descKey: "tool.product.desc", href: "/tools/product-idea" },
    { icon: "📦", titleKey: "tool.packaging", descKey: "tool.packaging.desc", href: "/tools/packaging-idea" },
    { icon: "🎨", titleKey: "tool.logo", descKey: "tool.logo.desc", href: "/tools/logo-maker" },
    { icon: "🏪", titleKey: "tool.booth", descKey: "tool.booth.desc", href: "/tools/booth-ready" },
    { icon: "💰", titleKey: "tool.profit", descKey: "tool.profit.desc", href: "/tools/profit-calculator" },
  ]

  return (
    <div className="min-h-screen bg-sky-gradient relative overflow-hidden">
      <FloatingElements />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          <span className="font-bold text-[var(--text-primary)] text-lg">BizKids AI</span>
        </div>
        <LanguageToggle />
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-4 md:px-8 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Content */}
          <div className="text-center mb-12 md:mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-[var(--shadow-low)] mb-6">
              <span className="text-sm font-medium text-[var(--text-secondary)]">{t("landing.badge")}</span>
            </div>

            {/* Hero Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
              <span className="text-[var(--sky-blue)]">{t("landing.title.welcome")}</span>
              <br />
              <span className="text-[var(--sunshine-orange)]">{t("landing.title.ceo")}</span>
            </h1>

            {/* Subtitle Card */}
            <div className="max-w-2xl mx-auto bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-dashed border-[var(--sky-blue-light)] p-6 mb-8">
              <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed">{t("landing.subtitle")}</p>
            </div>

            {/* CTA Button */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-[var(--sky-blue)] text-white font-bold text-lg px-8 py-4 rounded-full shadow-[var(--shadow-medium)] hover:shadow-[var(--shadow-high)] hover:scale-105 transition-all duration-200"
            >
              {t("landing.cta")}
            </Link>
          </div>

          {/* Tools Preview Section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] text-center mb-8">
              ⚡ {t("landing.tools.title")} ⚡
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {tools.map((tool) => (
                <ToolCard
                  key={tool.titleKey}
                  icon={tool.icon}
                  titleKey={tool.titleKey}
                  descKey={tool.descKey}
                  href={tool.href}
                  state="available"
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Help Bubble */}
      <HelpBubble />
    </div>
  )
}
