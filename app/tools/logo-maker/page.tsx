"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { WizardLayout } from "@/components/wizard-layout"
import { StepCard } from "@/components/step-card"
import { SelectionCard } from "@/components/selection-card"
import { WizardNav } from "@/components/wizard-nav"
import { Celebration } from "@/components/celebration"

const businessTypes = [
  { icon: "🍰", key: "food" },
  { icon: "🎨", key: "crafts" },
  { icon: "👕", key: "fashion" },
  { icon: "🎮", key: "games" },
  { icon: "📚", key: "services" },
]

const logoStyles = [
  { icon: "✒️", key: "text" },
  { icon: "🎯", key: "icon" },
  { icon: "🔄", key: "combined" },
]

const vibes = [
  { icon: "🌈", key: "fun" },
  { icon: "⭐", key: "professional" },
  { icon: "🎨", key: "creative" },
  { icon: "🌿", key: "natural" },
]

const colorPresets = [
  { name: "Ocean", colors: ["#60B5F4", "#2D5F8D"], key: "ocean" },
  { name: "Sunset", colors: ["#FFB84D", "#FF6B6B"], key: "sunset" },
  { name: "Forest", colors: ["#A8E6CF", "#2D8B6F"], key: "forest" },
  { name: "Berry", colors: ["#FFB6C1", "#9B59B6"], key: "berry" },
]

const symbols = [
  { icon: "⭐", key: "star" },
  { icon: "❤️", key: "heart" },
  { icon: "🌟", key: "sparkle" },
  { icon: "🎯", key: "target" },
  { icon: "🌈", key: "rainbow" },
  { icon: "🔥", key: "fire" },
]

export default function LogoMakerPage() {
  const { t } = useLanguage()
  const [step, setStep] = useState(1)

  // Step 1 inputs
  const [shopName, setShopName] = useState("")
  const [businessType, setBusinessType] = useState("")

  // Step 2 inputs
  const [logoStyle, setLogoStyle] = useState("")
  const [vibe, setVibe] = useState("")
  const [colorPreset, setColorPreset] = useState("")

  // Step 3 inputs
  const [symbol, setSymbol] = useState("")
  const [slogan, setSlogan] = useState("")

  // Step 4-6 state
  const [generating, setGenerating] = useState(false)
  const [logos, setLogos] = useState<string[]>([])
  const [selectedLogo, setSelectedLogo] = useState<number | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)

  const handleNext = async () => {
    if (step === 3) {
      // Generate logos
      setGenerating(true)
      setStep(4)
      await new Promise((r) => setTimeout(r, 2500)) // Simulate AI generation
      setLogos([
        `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(shopName + " logo " + businessType + " style 1")}`,
        `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(shopName + " logo " + businessType + " style 2")}`,
        `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(shopName + " logo " + businessType + " style 3")}`,
      ])
      setGenerating(false)
      setStep(5)
    } else if (step === 5 && selectedLogo !== null) {
      setShowCelebration(true)
      setStep(6)
    } else {
      setStep(step + 1)
    }
  }

  const canProceed = () => {
    if (step === 1) return shopName.trim() !== "" && businessType !== ""
    if (step === 2) return logoStyle !== "" && vibe !== "" && colorPreset !== ""
    if (step === 3) return true // Optional inputs
    if (step === 5) return selectedLogo !== null
    return true
  }

  return (
    <WizardLayout currentStep={step} totalSteps={6} toolName={t("tool.logo")} toolIcon="🎨">
      <Celebration show={showCelebration} />

      {/* Step 1: Shop name + business type */}
      {step === 1 && (
        <StepCard title={t("logo.step1.title")} subtitle={t("logo.step1.subtitle")} icon="🏪">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                {t("logo.shopName")}
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder={t("logo.shopName.placeholder")}
                className="w-full px-4 py-3 rounded-2xl border-2 border-[var(--border)] focus:border-[var(--sky-blue)] focus:outline-none transition-colors text-[var(--text-primary)]"
                maxLength={30}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3">
                {t("logo.businessType")}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {businessTypes.map((item) => (
                  <SelectionCard
                    key={item.key}
                    icon={item.icon}
                    label={t(`logo.type.${item.key}`)}
                    selected={businessType === item.key}
                    onClick={() => setBusinessType(item.key)}
                  />
                ))}
              </div>
            </div>
          </div>
          <WizardNav onNext={handleNext} canGoNext={canProceed()} isFirstStep />
        </StepCard>
      )}

      {/* Step 2: Logo type, vibe, colors */}
      {step === 2 && (
        <StepCard title={t("logo.step2.title")} subtitle={t("logo.step2.subtitle")} icon="🎯">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3">{t("logo.style")}</label>
              <div className="grid grid-cols-3 gap-3">
                {logoStyles.map((item) => (
                  <SelectionCard
                    key={item.key}
                    icon={item.icon}
                    label={t(`logo.style.${item.key}`)}
                    selected={logoStyle === item.key}
                    onClick={() => setLogoStyle(item.key)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3">{t("logo.vibe")}</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {vibes.map((item) => (
                  <SelectionCard
                    key={item.key}
                    icon={item.icon}
                    label={t(`logo.vibe.${item.key}`)}
                    selected={vibe === item.key}
                    onClick={() => setVibe(item.key)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3">{t("logo.colors")}</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.key}
                    onClick={() => setColorPreset(preset.key)}
                    className={`p-3 rounded-2xl border-3 transition-all ${
                      colorPreset === preset.key
                        ? "border-[var(--sunshine-orange)]"
                        : "border-[var(--border)] hover:border-[var(--sky-blue)]"
                    }`}
                  >
                    <div className="flex gap-1 justify-center mb-2">
                      {preset.colors.map((color, i) => (
                        <div key={i} className="w-6 h-6 rounded-full" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-[var(--text-primary)]">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <WizardNav onPrevious={() => setStep(1)} onNext={handleNext} canGoNext={canProceed()} />
        </StepCard>
      )}

      {/* Step 3: Optional symbols + slogan */}
      {step === 3 && (
        <StepCard title={t("logo.step3.title")} subtitle={t("logo.step3.subtitle")} icon="✨">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3">
                {t("logo.symbol")} ({t("common.optional")})
              </label>
              <div className="grid grid-cols-6 gap-3">
                {symbols.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setSymbol(symbol === item.key ? "" : item.key)}
                    className={`p-3 rounded-xl text-2xl transition-all ${
                      symbol === item.key
                        ? "bg-[var(--sunshine-orange)]/20 border-2 border-[var(--sunshine-orange)]"
                        : "bg-[var(--muted)] hover:bg-[var(--sky-blue-light)]"
                    }`}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                {t("logo.slogan")} ({t("common.optional")})
              </label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                placeholder={t("logo.slogan.placeholder")}
                className="w-full px-4 py-3 rounded-2xl border-2 border-[var(--border)] focus:border-[var(--sky-blue)] focus:outline-none transition-colors text-[var(--text-primary)]"
                maxLength={50}
              />
            </div>
          </div>
          <WizardNav onPrevious={() => setStep(2)} onNext={handleNext} canGoNext={canProceed()} loading={generating} />
        </StepCard>
      )}

      {/* Step 4: Generating animation */}
      {step === 4 && generating && (
        <StepCard title={t("logo.generating.title")} subtitle={t("logo.generating.subtitle")} icon="🎨">
          <div className="flex flex-col items-center py-8">
            <div className="relative w-32 h-32 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-[var(--muted)]" />
              <div className="absolute inset-0 rounded-full border-4 border-t-[var(--sky-blue)] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              <div className="absolute inset-4 rounded-full bg-[var(--sky-blue-light)] flex items-center justify-center text-4xl animate-pulse">
                🎨
              </div>
            </div>
            <div className="flex gap-2">
              <span
                className="w-3 h-3 rounded-full bg-[var(--sky-blue)] animate-bounce"
                style={{ animationDelay: "0s" }}
              />
              <span
                className="w-3 h-3 rounded-full bg-[var(--sunshine-orange)] animate-bounce"
                style={{ animationDelay: "0.1s" }}
              />
              <span
                className="w-3 h-3 rounded-full bg-[var(--mint-green)] animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
            </div>
          </div>
        </StepCard>
      )}

      {/* Step 5: Select logo */}
      {step === 5 && logos.length > 0 && (
        <StepCard title={t("logo.step5.title")} subtitle={t("logo.step5.subtitle")} icon="👑">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {logos.map((logo, index) => (
              <button
                key={index}
                onClick={() => setSelectedLogo(index)}
                className={`p-4 rounded-2xl border-3 transition-all ${
                  selectedLogo === index
                    ? "border-[var(--sunshine-orange)] bg-[var(--sunshine-orange)]/10 scale-105"
                    : "border-[var(--border)] bg-white hover:border-[var(--sky-blue)]"
                }`}
              >
                <img
                  src={logo || "/placeholder.svg"}
                  alt={`Logo option ${index + 1}`}
                  className="w-full aspect-square object-contain rounded-xl bg-[var(--muted)]"
                />
                <p className="text-center mt-3 font-semibold text-[var(--text-primary)]">
                  {t("logo.option")} {index + 1}
                </p>
              </button>
            ))}
          </div>
          <WizardNav onPrevious={() => setStep(3)} onNext={handleNext} canGoNext={canProceed()} isLastStep />
        </StepCard>
      )}

      {/* Step 6: Success + Booth Ready toggle */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 text-center max-w-md mx-4 animate-in zoom-in-95 duration-300">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2">{t("logo.success.title")}</h2>
            <p className="text-[var(--text-secondary)] mb-6">{t("logo.success.desc")}</p>

            <div className="space-y-3">
              <a
                href="/tools/booth-ready"
                className="block w-full px-8 py-3 rounded-full bg-[var(--sky-blue)] text-white font-bold hover:scale-105 transition-all"
              >
                {t("logo.success.booth")} 🏪
              </a>
              <a
                href="/dashboard"
                className="block w-full px-8 py-3 rounded-full bg-white border-2 border-[var(--border)] text-[var(--text-secondary)] font-semibold hover:border-[var(--sky-blue)] transition-all"
              >
                {t("common.back")}
              </a>
            </div>
          </div>
        </div>
      )}
    </WizardLayout>
  )
}
