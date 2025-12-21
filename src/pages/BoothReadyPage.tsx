import { useLanguage } from "@/components/language-provider"
import { WizardLayout } from "@/components/wizard-layout"
import { StepCard } from "@/components/step-card"

export default function BoothReadyPage() {
  const { t } = useLanguage()

  return (
    <WizardLayout currentStep={1} totalSteps={3} toolName={t("tool.booth")} toolIcon="🏪">
      <StepCard title={t("booth.select.title")} subtitle={t("booth.select.subtitle")} icon="🏪">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚧</div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Coming Soon!</h3>
          <p className="text-[var(--text-secondary)]">
            This tool is being built. Check back soon to create booth materials!
          </p>
        </div>
      </StepCard>
    </WizardLayout>
  )
}
