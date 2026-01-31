import type { UseSiteConfigReturn } from '@/hooks/useSiteConfig';
import { useLanguage } from '@/components/language-provider';
import { QuestShell } from '../QuestShell';
import { QuestControls } from '../QuestControls';
import { BUSINESS_TYPE_OPTIONS, type BusinessTypeKey } from '@/lib/businessTypes';
import { applyBusinessTypeDefaults } from '@/lib/businessTypeDefaults';

interface QuestStepBaseProps {
  siteConfig: UseSiteConfigReturn;
  steps: { id: string; label: string }[];
  currentIndex: number;
  onStepSelect: (index: number) => void;
  onBack: () => void;
  onNext: () => void;
  isPublished: boolean;
}

export const QuestStep2BusinessType = ({
  siteConfig,
  steps,
  currentIndex,
  onStepSelect,
  onBack,
  onNext,
  isPublished,
}: QuestStepBaseProps) => {
  const { config, setConfig } = siteConfig;
  const { language, t } = useLanguage();

  const handleBusinessTypeSelect = (type: BusinessTypeKey) => {
    const next = applyBusinessTypeDefaults(config, type, { allowContentOverwrite: !isPublished });
    setConfig(next);
  };

  return (
    <QuestShell
      steps={steps}
      currentIndex={currentIndex}
      onStepSelect={onStepSelect}
      title={language === 'EN' ? 'Pick Your Business Type' : 'Pilih Jenis Perniagaan'}
      subtitle={
        language === 'EN'
          ? 'Choose the category that fits best. You can change it later.'
          : 'Pilih kategori yang paling sesuai. Boleh tukar kemudian.'
      }
      controls={
        <QuestControls
          onBack={onBack}
          onNext={onNext}
          backLabel={language === 'EN' ? 'Back' : 'Kembali'}
          nextLabel={language === 'EN' ? 'Next' : 'Seterusnya'}
          nextDisabled={!config.businessType}
        />
      }
    >
      <div className="space-y-1">
        <div>
          {/* <p className="text-sm font-semibold text-slate-700">{t('logo.businessType')}</p>
          <p className="text-xs text-slate-500">
            {language === 'EN'
              ? 'Pick the one that fits best - you can change it later.'
              : 'Pilih yang paling sesuai - boleh tukar kemudian.'}
          </p> */}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {BUSINESS_TYPE_OPTIONS.map((item) => {
            const isSelected = config.businessType === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleBusinessTypeSelect(item.key)}
                className={`rounded-xl border p-3 text-center transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <div className="text-xl mb-1">{item.icon}</div>
                <div className="text-xs font-semibold text-slate-700">
                  {t(`logo.type.${item.key}`)}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </QuestShell>
  );
};
