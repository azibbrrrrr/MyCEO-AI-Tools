import { useLanguage } from "@/components/language-provider"
import { WizardLayout } from "@/components/wizard-layout"
import { StepCard } from "@/components/step-card"

export default function PackagingIdeaPage() {
  const { t } = useLanguage()

  return (
    <WizardLayout currentStep={1} totalSteps={4} toolName={t("tool.packaging")} toolIcon="📦">
      <StepCard title={t("packaging.step1.title")} subtitle={t("packaging.step1.subtitle")} icon="📦">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚧</div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Coming Soon!</h3>
          <p className="text-[var(--text-secondary)]">
            This tool is being built. Check back soon for amazing packaging ideas!
          </p>
        </div>
      </StepCard>
    </WizardLayout>
  )
}
