"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { WizardLayout } from "@/components/wizard-layout"
import { StepCard } from "@/components/step-card"
import { SelectionCard } from "@/components/selection-card"
import { WizardNav } from "@/components/wizard-nav"
import { Celebration } from "@/components/celebration"

const productTypes = [
  { icon: "🍪", key: "baked" },
  { icon: "🧴", key: "liquid" },
  { icon: "🎁", key: "boxed" },
  { icon: "📄", key: "flat" },
  { icon: "🧸", key: "soft" },
]

const buyers = [
  { icon: "👧", key: "kids" },
  { icon: "👩", key: "teens" },
  { icon: "👨‍👩‍👧", key: "parents" },
  { icon: "🎁", key: "gifts" },
]

const budgetLevels = [
  { icon: "♻️", key: "eco" },
  { icon: "✨", key: "fancy" },
  { icon: "💡", key: "creative" },
]

// Simulated packaging suggestions
const packagingSuggestions = [
  {
    title: "Kraft Paper Bags",
    tips: [
      "Use brown kraft paper bags for an eco-friendly look",
      "Add a colorful ribbon or sticker to seal",
      "Stamp your logo using ink stamps",
      "Include a small thank-you card inside",
    ],
    cost: "Low",
  },
  {
    title: "Clear Cellophane Wraps",
    tips: [
      "Perfect for showing off colorful products",
      "Tie with curly ribbons in your brand colors",
      "Add a printed tag with product name",
      "Great for baked goods and crafts",
    ],
    cost: "Medium",
  },
  {
    title: "Custom Mini Boxes",
    tips: [
      "Use small cardboard boxes for premium feel",
      "Print or stick your logo on top",
      "Add tissue paper inside for protection",
      "Stack multiple items in themed boxes",
    ],
    cost: "Higher",
  },
]

export default function PackagingIdeaPage() {
  const { t } = useLanguage()
  const [step, setStep] = useState(1)
  const [productType, setProductType] = useState("")
  const [targetBuyer, setTargetBuyer] = useState("")
  const [budgetStyle, setBudgetStyle] = useState("")
  const [generating, setGenerating] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedPackaging, setSelectedPackaging] = useState<number | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)

  const handleNext = async () => {
    if (step === 3) {
      setGenerating(true)
      await new Promise((r) => setTimeout(r, 1500))
      setGenerating(false)
      setShowResults(true)
      setStep(4)
    } else if (step === 4 && selectedPackaging !== null) {
      setShowCelebration(true)
    } else {
      setStep(step + 1)
    }
  }

  const canProceed = () => {
    if (step === 1) return productType !== ""
    if (step === 2) return targetBuyer !== ""
    if (step === 3) return budgetStyle !== ""
    if (step === 4) return selectedPackaging !== null
    return true
  }

  return (
    <WizardLayout currentStep={step} totalSteps={4} toolName={t("tool.packaging")} toolIcon="📦">
      <Celebration show={showCelebration} />

      {step === 1 && (
        <StepCard title={t("packaging.step1.title")} subtitle={t("packaging.step1.subtitle")} icon="📦">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {productTypes.map((item) => (
              <SelectionCard
                key={item.key}
                icon={item.icon}
                label={t(`packaging.type.${item.key}`)}
                selected={productType === item.key}
                onClick={() => setProductType(item.key)}
              />
            ))}
          </div>
          <WizardNav onNext={handleNext} canGoNext={canProceed()} isFirstStep />
        </StepCard>
      )}

      {step === 2 && (
        <StepCard title={t("packaging.step2.title")} subtitle={t("packaging.step2.subtitle")} icon="🎯">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {buyers.map((item) => (
              <SelectionCard
                key={item.key}
                icon={item.icon}
                label={t(`packaging.buyer.${item.key}`)}
                selected={targetBuyer === item.key}
                onClick={() => setTargetBuyer(item.key)}
              />
            ))}
          </div>
          <WizardNav onPrevious={() => setStep(1)} onNext={handleNext} canGoNext={canProceed()} />
        </StepCard>
      )}

      {step === 3 && (
        <StepCard title={t("packaging.step3.title")} subtitle={t("packaging.step3.subtitle")} icon="💡">
          <div className="grid grid-cols-3 gap-4">
            {budgetLevels.map((item) => (
              <SelectionCard
                key={item.key}
                icon={item.icon}
                label={t(`packaging.budget.${item.key}`)}
                selected={budgetStyle === item.key}
                onClick={() => setBudgetStyle(item.key)}
              />
            ))}
          </div>
          <WizardNav onPrevious={() => setStep(2)} onNext={handleNext} canGoNext={canProceed()} loading={generating} />
        </StepCard>
      )}

      {step === 4 && showResults && (
        <StepCard title={t("packaging.step4.title")} subtitle={t("packaging.step4.subtitle")} icon="✨">
          <div className="space-y-4">
            {packagingSuggestions.map((pkg, index) => (
              <button
                key={index}
                onClick={() => setSelectedPackaging(index)}
                className={`w-full text-left p-5 rounded-2xl border-3 transition-all ${
                  selectedPackaging === index
                    ? "border-[var(--sunshine-orange)] bg-[var(--sunshine-orange)]/10"
                    : "border-[var(--border)] bg-white hover:border-[var(--sky-blue)]"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-[var(--text-primary)]">{pkg.title}</h3>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--mint-green)] text-[var(--text-primary)]">
                    {pkg.cost} Cost
                  </span>
                </div>
                <ul className="space-y-2">
                  {pkg.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <span className="text-[var(--sky-blue)]">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
          <WizardNav onPrevious={() => setStep(3)} onNext={handleNext} canGoNext={canProceed()} isLastStep />
        </StepCard>
      )}

      {showCelebration && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 text-center max-w-md mx-4 animate-in zoom-in-95 duration-300">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2">{t("packaging.success.title")}</h2>
            <p className="text-[var(--text-secondary)] mb-6">{t("packaging.success.desc")}</p>
            <a
              href="/tools/logo-maker"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[var(--sky-blue)] text-white font-bold hover:scale-105 transition-all"
            >
              {t("packaging.success.next")} 🎨
            </a>
          </div>
        </div>
      )}
    </WizardLayout>
  )
}
