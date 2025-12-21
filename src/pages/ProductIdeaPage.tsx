import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { WizardLayout } from "@/components/wizard-layout"
import { StepCard } from "@/components/step-card"
import { SelectionCard } from "@/components/selection-card"
import { WizardNav } from "@/components/wizard-nav"
import { Celebration } from "@/components/celebration"
import { Link } from "react-router-dom"

const interests = [
  { icon: "🍰", key: "food" },
  { icon: "🎨", key: "crafts" },
  { icon: "🎮", key: "games" },
  { icon: "📚", key: "books" },
  { icon: "🧸", key: "toys" },
]

const budgets = [
  { icon: "💵", key: "low", range: "RM10-30" },
  { icon: "💰", key: "medium", range: "RM30-50" },
  { icon: "💎", key: "high", range: "RM50+" },
]

const types = [
  { icon: "🛠️", key: "diy" },
  { icon: "🛒", key: "resale" },
  { icon: "🎨", key: "both" },
]

const productSuggestions: Record<string, { name: string; desc: string; tip: string }[]> = {
  food: [
    { name: "Mini Cupcakes", desc: "Colorful cupcakes with fun toppings!", tip: "Add edible glitter for extra wow!" },
    { name: "Cookie Pops", desc: "Cookies on sticks - easy to eat!", tip: "Wrap in clear bags with ribbons" },
    { name: "Fruit Cups", desc: "Fresh fruit in cute cups!", tip: "Use star-shaped cutters for fruits" },
  ],
  crafts: [
    { name: "Friendship Bracelets", desc: "Handmade woven bracelets!", tip: "Offer custom name options" },
    { name: "Bookmarks", desc: "Decorated bookmarks for readers!", tip: "Add tassels for a premium feel" },
    { name: "Keychains", desc: "Fun beaded keychains!", tip: "Make themed sets for better sales" },
  ],
  games: [
    { name: "Lucky Dip Bags", desc: "Mystery bags with small toys!", tip: "Different price tiers work great" },
    { name: "Spin & Win Game", desc: "A spinning wheel with prizes!", tip: "Make sure prizes cost less than plays" },
    { name: "Ring Toss Game", desc: "Classic carnival ring toss!", tip: "Offer 3 tries per token" },
  ],
  books: [
    { name: "Story Bookmarks", desc: "Bookmarks with mini stories!", tip: "Write original short tales" },
    { name: "Comic Strips", desc: "Original mini comics!", tip: "Make a series for repeat customers" },
    { name: "Quote Cards", desc: "Inspiring quote cards!", tip: "Add colorful illustrations" },
  ],
  toys: [
    { name: "Slime Jars", desc: "Colorful homemade slime!", tip: "Add glitter or beads for variety" },
    { name: "Stress Balls", desc: "Squeezy stress relievers!", tip: "Make different shapes and faces" },
    { name: "Origami Figures", desc: "Folded paper creations!", tip: "Offer a how-to guide too" },
  ],
}

export default function ProductIdeaPage() {
  const { t } = useLanguage()
  const [step, setStep] = useState(1)
  const [interest, setInterest] = useState("")
  const [budget, setBudget] = useState("")
  const [type, setType] = useState("")
  const [generating, setGenerating] = useState(false)
  const [suggestions, setSuggestions] = useState<typeof productSuggestions.food>([])
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)

  const handleNext = async () => {
    if (step === 3) {
      setGenerating(true)
      await new Promise((r) => setTimeout(r, 1500))
      setSuggestions(productSuggestions[interest] || productSuggestions.food)
      setGenerating(false)
      setStep(4)
    } else if (step === 4 && selectedProduct !== null) {
      setShowCelebration(true)
    } else {
      setStep(step + 1)
    }
  }

  const canProceed = () => {
    if (step === 1) return interest !== ""
    if (step === 2) return budget !== ""
    if (step === 3) return type !== ""
    if (step === 4) return selectedProduct !== null
    return true
  }

  return (
    <WizardLayout currentStep={step} totalSteps={4} toolName={t("tool.product")} toolIcon="💡">
      <Celebration show={showCelebration} />

      {step === 1 && (
        <StepCard title={t("product.step1.title")} subtitle={t("product.step1.subtitle")} icon="🎯">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {interests.map((item) => (
              <SelectionCard
                key={item.key}
                icon={item.icon}
                label={t(`product.interest.${item.key}`)}
                selected={interest === item.key}
                onClick={() => setInterest(item.key)}
              />
            ))}
          </div>
          <WizardNav onNext={handleNext} canGoNext={canProceed()} isFirstStep />
        </StepCard>
      )}

      {step === 2 && (
        <StepCard title={t("product.step2.title")} subtitle={t("product.step2.subtitle")} icon="💰">
          <div className="grid grid-cols-3 gap-4">
            {budgets.map((item) => (
              <SelectionCard
                key={item.key}
                icon={item.icon}
                label={`${t(`product.budget.${item.key}`)}\n${item.range}`}
                selected={budget === item.key}
                onClick={() => setBudget(item.key)}
              />
            ))}
          </div>
          <WizardNav onPrevious={() => setStep(1)} onNext={handleNext} canGoNext={canProceed()} />
        </StepCard>
      )}

      {step === 3 && (
        <StepCard title={t("product.step3.title")} subtitle={t("product.step3.subtitle")} icon="🛠️">
          <div className="grid grid-cols-3 gap-4">
            {types.map((item) => (
              <SelectionCard
                key={item.key}
                icon={item.icon}
                label={t(`product.type.${item.key}`)}
                selected={type === item.key}
                onClick={() => setType(item.key)}
              />
            ))}
          </div>
          <WizardNav onPrevious={() => setStep(2)} onNext={handleNext} canGoNext={canProceed()} loading={generating} />
        </StepCard>
      )}

      {step === 4 && (
        <StepCard title={t("product.step4.title")} subtitle={t("product.step4.subtitle")} icon="✨">
          <div className="space-y-4">
            {suggestions.map((product, index) => (
              <button
                key={index}
                onClick={() => setSelectedProduct(index)}
                className={`w-full text-left p-4 rounded-2xl border-3 transition-all ${
                  selectedProduct === index
                    ? "border-[var(--sunshine-orange)] bg-[var(--sunshine-orange)]/10"
                    : "border-[var(--border)] bg-white hover:border-[var(--sky-blue)]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--sky-blue-light)] flex items-center justify-center text-2xl flex-shrink-0">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)]">{product.name}</h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">{product.desc}</p>
                    <p className="text-xs text-[var(--sunshine-orange)] mt-2 font-semibold">Tip: {product.tip}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <WizardNav onPrevious={() => setStep(3)} onNext={handleNext} canGoNext={canProceed()} isLastStep />
        </StepCard>
      )}

      {showCelebration && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 text-center max-w-md mx-4 animate-scale-in">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2">{t("product.success.title")}</h2>
            <p className="text-[var(--text-secondary)] mb-6">{t("product.success.desc")}</p>
            <Link
              to="/tools/packaging-idea"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[var(--sky-blue)] text-white font-bold hover:scale-105 transition-all"
            >
              {t("product.success.next")} 📦
            </Link>
          </div>
        </div>
      )}
    </WizardLayout>
  )
}
