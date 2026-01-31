import { useMemo, useRef } from 'react';
import { Input } from '@/components/ui/input';
import type { UseSiteConfigReturn } from '@/hooks/useSiteConfig';
import { useLanguage } from '@/components/language-provider';
import { QuestShell } from '../QuestShell';
import { QuestControls } from '../QuestControls';
import {
  QUEST_DEFAULT_SHOP_NAME,
  QUEST_NAME_TEMPLATES,
} from '@/lib/questTemplates';
import { sanitizeText, sanitizeWithFallback } from '@/lib/questGuardrails';

interface QuestStepBaseProps {
  siteConfig: UseSiteConfigReturn;
  steps: { id: string; label: string }[];
  currentIndex: number;
  onStepSelect: (index: number) => void;
  onNext: () => void;
}

export const QuestStep1Name = ({
  siteConfig,
  steps,
  currentIndex,
  onStepSelect,
  onNext,
}: QuestStepBaseProps) => {
  const { config, setContent } = siteConfig;
  const { language } = useLanguage();

  const initialRef = useRef(config.content.heroHeading);
  const previousRef = useRef(config.content.heroHeading);

  const selectedTemplate = useMemo(() => {
    return QUEST_NAME_TEMPLATES.find(t => t.value === config.content.heroHeading);
  }, [config.content.heroHeading]);

  const applyHeading = (value: string) => {
    previousRef.current = config.content.heroHeading;
    setContent('heroHeading', value);
  };

  const handleUndo = () => {
    const current = config.content.heroHeading;
    setContent('heroHeading', previousRef.current);
    previousRef.current = current;
  };

  const handleReset = () => {
    previousRef.current = config.content.heroHeading;
    setContent('heroHeading', initialRef.current);
  };

  const handleSkip = () => {
    const nextValue = sanitizeWithFallback(config.content.heroHeading, QUEST_DEFAULT_SHOP_NAME);
    if (nextValue !== config.content.heroHeading) {
      applyHeading(nextValue);
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
        />
      }
    >
      <div className="grid gap-3 md:grid-cols-2">
        {QUEST_NAME_TEMPLATES.map(template => {
          const isSelected = selectedTemplate?.id === template.id;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => applyHeading(template.value)}
              className={`rounded-xl border p-4 text-left transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              <p className="text-sm font-semibold text-slate-800">{template.value}</p>
              <p className="text-xs text-slate-500 mt-1">{template.label}</p>
            </button>
          );
        })}
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4">
          <label className="block text-xs font-semibold text-slate-600 mb-2">
            {language === 'EN' ? 'Custom Name' : 'Nama Sendiri'}
          </label>
          <Input
            value={config.content.heroHeading}
            onChange={(event) => applyHeading(sanitizeText(event.target.value))}
            placeholder={language === 'EN' ? 'Type your shop name' : 'Taip nama kedai'}
            className="bg-white"
          />
          <p className="text-[11px] text-slate-500 mt-2">
            {language === 'EN'
              ? `Example: ${QUEST_NAME_TEMPLATES[0].exampleEn}, ${QUEST_NAME_TEMPLATES[1].exampleEn}`
              : `Contoh: ${QUEST_NAME_TEMPLATES[0].exampleBm}, ${QUEST_NAME_TEMPLATES[1].exampleBm}`}
          </p>
        </div>
      </div>
    </QuestShell>
  );
};
