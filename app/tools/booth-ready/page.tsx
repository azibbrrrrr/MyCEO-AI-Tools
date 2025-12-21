"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { WizardLayout } from "@/components/wizard-layout"
import { StepCard } from "@/components/step-card"
import { Celebration } from "@/components/celebration"

const templates = [
  { id: "banner", icon: "🎪", name: "Booth Banner" },
  { id: "table", icon: "🪑", name: "Table Sign" },
  { id: "sticker", icon: "🏷️", name: "Product Stickers" },
  { id: "price", icon: "💵", name: "Price Tags" },
]

export default function BoothReadyPage() {
  const { t } = useLanguage()
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([])
  const [generating, setGenerating] = useState(false)
  const [mockups, setMockups] = useState<Record<string, string>>({})
  const [showCelebration, setShowCelebration] = useState(false)
  const [downloadReady, setDownloadReady] = useState(false)

  const toggleTemplate = (id: string) => {
    setSelectedTemplates((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
  }

  const handleGenerate = async () => {
    if (selectedTemplates.length === 0) return
    setGenerating(true)

    await new Promise((r) => setTimeout(r, 2000))

    const newMockups: Record<string, string> = {}
    selectedTemplates.forEach((id) => {
      newMockups[id] =
        `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(id + " booth mockup carnival")}`
    })
    setMockups(newMockups)
    setGenerating(false)
    setDownloadReady(true)
    setShowCelebration(true)
  }

  const handleDownload = (format: string) => {
    // Simulate download
    alert(`Downloading all mockups as ${format.toUpperCase()}!`)
  }

  return (
    <WizardLayout currentStep={downloadReady ? 2 : 1} totalSteps={2} toolName={t("tool.booth")} toolIcon="🏪">
      <Celebration show={showCelebration} onComplete={() => setShowCelebration(false)} />

      {!downloadReady && (
        <StepCard title={t("booth.select.title")} subtitle={t("booth.select.subtitle")} icon="🎨">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => toggleTemplate(template.id)}
                className={`p-4 rounded-2xl border-3 transition-all flex flex-col items-center gap-3 ${
                  selectedTemplates.includes(template.id)
                    ? "border-[var(--sunshine-orange)] bg-[var(--sunshine-orange)]/10"
                    : "border-[var(--border)] bg-white hover:border-[var(--sky-blue)]"
                }`}
              >
                <span className="text-4xl">{template.icon}</span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">{template.name}</span>
                {selectedTemplates.includes(template.id) && (
                  <span className="text-xs px-2 py-1 rounded-full bg-[var(--sunshine-orange)] text-white font-semibold">
                    Selected
                  </span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={selectedTemplates.length === 0 || generating}
            className={`w-full py-4 rounded-full font-bold text-white transition-all ${
              selectedTemplates.length > 0 && !generating
                ? "bg-[var(--sky-blue)] hover:scale-105 shadow-[var(--shadow-medium)]"
                : "bg-[var(--text-muted)] cursor-not-allowed"
            }`}
          >
            {generating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                {t("booth.generating")}
              </span>
            ) : (
              <>
                {t("booth.generate")} ({selectedTemplates.length}) ✨
              </>
            )}
          </button>
        </StepCard>
      )}

      {downloadReady && (
        <StepCard title={t("booth.ready.title")} subtitle={t("booth.ready.subtitle")} icon="🎉">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {Object.entries(mockups).map(([id, url]) => (
              <div key={id} className="bg-[var(--muted)] rounded-2xl p-4">
                <img
                  src={url || "/placeholder.svg"}
                  alt={templates.find((t) => t.id === id)?.name}
                  className="w-full aspect-video object-contain rounded-xl bg-white mb-3"
                />
                <p className="text-center font-semibold text-[var(--text-primary)]">
                  {templates.find((t) => t.id === id)?.icon} {templates.find((t) => t.id === id)?.name}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-center text-sm font-semibold text-[var(--text-secondary)] mb-4">
              {t("booth.export.label")}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["PNG", "JPEG", "SVG"].map((format) => (
                <button
                  key={format}
                  onClick={() => handleDownload(format)}
                  className="px-6 py-3 rounded-full bg-white border-2 border-[var(--border)] font-semibold text-[var(--text-primary)] hover:border-[var(--sky-blue)] hover:text-[var(--sky-blue)] transition-all"
                >
                  {t("booth.download")} {format}
                </button>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <a
                href="/tools/profit-calculator"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[var(--sky-blue)] text-white font-bold hover:scale-105 transition-all"
              >
                {t("booth.next")} 💰
              </a>
            </div>
          </div>
        </StepCard>
      )}
    </WizardLayout>
  )
}
