import { useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import type { UseSiteConfigReturn } from '@/hooks/useSiteConfig';
import { useLanguage } from '@/components/language-provider';
import { useChildSession } from '@/hooks/useChildSession';
import { QuestShell } from '../QuestShell';
import { QuestControls } from '../QuestControls';
import { QUEST_DEFAULT_SHOP_NAME } from '@/lib/questTemplates';
import { sanitizeText, sanitizeWithFallback } from '@/lib/questGuardrails';
import { BUSINESS_TYPE_OPTIONS, type BusinessTypeKey } from '@/lib/businessTypes';
import { applyBusinessTypeDefaults } from '@/lib/businessTypeDefaults';

interface QuestStepBaseProps {
  siteConfig: UseSiteConfigReturn;
  steps: { id: string; label: string }[];
  currentIndex: number;
  onStepSelect: (index: number) => void;
  onNext: () => void;
  isPublished: boolean;
}

export const QuestStep1Name = ({
  siteConfig,
  steps,
  currentIndex,
  onStepSelect,
  onNext,
  isPublished,
}: QuestStepBaseProps) => {
  const { config, setContent, setConfig } = siteConfig;
  const { language, t } = useLanguage();
  const { child } = useChildSession();

  const initialConfigRef = useRef(JSON.parse(JSON.stringify(config)) as typeof config);
  const previousConfigRef = useRef(JSON.parse(JSON.stringify(config)) as typeof config);
  const hasUserEditedRef = useRef(false);

  const stashPrevConfig = () => {
    previousConfigRef.current = JSON.parse(JSON.stringify(config)) as typeof config;
  };

  const applyHeading = (value: string) => {
    stashPrevConfig();
    setContent('heroHeading', value);
  };

  const handleNameChange = (value: string) => {
    hasUserEditedRef.current = true;
    applyHeading(value);
  };

  useEffect(() => {
    if (isPublished) return;
    if (hasUserEditedRef.current) return;
    const companyName = child?.companies?.[0]?.company_name;
    if (!companyName) return;

    const currentName = config.content.heroHeading?.trim();
    if (currentName && currentName !== QUEST_DEFAULT_SHOP_NAME) return;

    applyHeading(sanitizeWithFallback(companyName, QUEST_DEFAULT_SHOP_NAME));
  }, [child?.companies?.[0]?.company_name, config.content.heroHeading]);

  useEffect(() => {
    if (isPublished) return;
    const logoUrl = child?.companies?.[0]?.logo_url;
    if (!logoUrl) return;
    if (config.content.heroImage) return;
    stashPrevConfig();
    setContent('heroImage', logoUrl);
  }, [child?.companies?.[0]?.logo_url, config.content.heroImage, isPublished]);

  const handleBusinessTypeSelect = (type: BusinessTypeKey) => {
    stashPrevConfig();
    const next = applyBusinessTypeDefaults(config, type, { allowContentOverwrite: !isPublished });
    setConfig(next);
  };

  const handleUndo = () => {
    const current = JSON.parse(JSON.stringify(config)) as typeof config;
    setConfig(previousConfigRef.current);
    previousConfigRef.current = current;
  };

  const handleReset = () => {
    stashPrevConfig();
    setConfig(initialConfigRef.current);
  };

  const handleSkip = () => {
    const nextValue = sanitizeWithFallback(config.content.heroHeading, QUEST_DEFAULT_SHOP_NAME);
    if (nextValue !== config.content.heroHeading) {
      applyHeading(nextValue);
    }
    if (!config.businessType) {
      handleBusinessTypeSelect(BUSINESS_TYPE_OPTIONS[0].key);
    }
    onNext();
  };

  return (
    <QuestShell
      steps={steps}
      currentIndex={currentIndex}
      onStepSelect={onStepSelect}
      title={language === 'EN' ? 'Name Your Shop' : 'Namakan Kedai Anda'}
      subtitle={
        language === 'EN'
          ? 'Every great boss needs a great name. Pick one you love.'
          : 'Setiap boss hebat perlukan nama hebat. Pilih satu yang kamu suka.'
      }
      controls={
        <QuestControls
          onUndo={handleUndo}
          onSkip={handleSkip}
          onReset={handleReset}
          onNext={onNext}
          nextLabel={language === 'EN' ? 'Next' : 'Seterusnya'}
          nextDisabled={!config.businessType}
        />
      }
    >
      <div className="space-y-3">
        <div>
          <p className="text-sm font-semibold text-slate-700">
            {t('logo.businessType')}
          </p>
          <p className="text-xs text-slate-500">
            {language === 'EN'
              ? 'Pick the one that fits best — you can change it later 😊'
              : 'Pilih yang paling sesuai — boleh tukar kemudian 😊'}
          </p>
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

      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4">
        <label className="block text-xs font-semibold text-slate-600 mb-2">
          {language === 'EN' ? 'Shop Name' : 'Nama Kedai'}
        </label>
        <Input
          value={config.content.heroHeading}
          onChange={(event) => handleNameChange(sanitizeText(event.target.value))}
          placeholder={language === 'EN' ? 'Type your shop name' : 'Taip nama kedai'}
          className="bg-white"
        />
        <p className="text-[11px] text-slate-500 mt-2">
          {language === 'EN' ? 'Example: Cookies by Aisyah' : 'Contoh: Kuih by Siti'}
        </p>
      </div>
    </QuestShell>
  );
};
