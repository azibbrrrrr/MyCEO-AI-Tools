import { useMemo, useRef } from 'react';
import type { UseSiteConfigReturn, SiteConfig } from '@/hooks/useSiteConfig';
import { useLanguage } from '@/components/language-provider';
import { QuestShell } from '../QuestShell';
import { QuestControls } from '../QuestControls';
import { VIBE_PRESETS } from '@/lib/vibePresets';

interface QuestStepBaseProps {
  siteConfig: UseSiteConfigReturn;
  steps: { id: string; label: string }[];
  currentIndex: number;
  onStepSelect: (index: number) => void;
  onNext: () => void;
}

const matchPreset = (styles: SiteConfig['styles']) =>
  VIBE_PRESETS.find(
    preset =>
      preset.palette === styles.palette &&
      preset.fontPair === styles.fontPair &&
      preset.spacingDensity === styles.spacingDensity
  );

export const QuestStep2Vibe = ({
  siteConfig,
  steps,
  currentIndex,
  onStepSelect,
  onNext,
}: QuestStepBaseProps) => {
  const { config, setConfig } = siteConfig;
  const { language } = useLanguage();

  const initialRef = useRef(config.styles);
  const previousRef = useRef(config.styles);

  const selectedPreset = useMemo(() => matchPreset(config.styles), [config.styles]);

  const applyPreset = (presetId: string) => {
    const preset = VIBE_PRESETS.find(item => item.id === presetId);
    if (!preset) return;
    previousRef.current = config.styles;
    setConfig(prev => ({
      ...prev,
      styles: {
        ...prev.styles,
        palette: preset.palette,
        fontPair: preset.fontPair,
        spacingDensity: preset.spacingDensity,
      },
    }));
  };

  const handleUndo = () => {
    const current = config.styles;
    setConfig(prev => ({ ...prev, styles: previousRef.current }));
    previousRef.current = current;
  };

  const handleReset = () => {
    previousRef.current = config.styles;
    setConfig(prev => ({ ...prev, styles: initialRef.current }));
  };

  const handleSkip = () => {
    if (!selectedPreset) {
      applyPreset(VIBE_PRESETS[0].id);
    }
    onNext();
  };

  return (
    <QuestShell
      steps={steps}
      currentIndex={currentIndex}
      onStepSelect={onStepSelect}
      title={language === 'EN' ? 'Choose Your Vibe' : 'Pilih Gaya Anda'}
      subtitle={
        language === 'EN'
          ? "What's your shop's personality? Tap to try."
          : 'Apa gaya kedai kamu? Tekan untuk cuba.'
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
        {VIBE_PRESETS.map(preset => {
          const isSelected = selectedPreset?.id === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset.id)}
              className={`rounded-xl border p-4 text-left transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {preset.colors.map(color => (
                  <span
                    key={color}
                    className="w-5 h-5 rounded-full border border-white shadow"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-sm font-semibold text-slate-800">{preset.label}</p>
              <p className="text-xs text-slate-500 mt-1">{preset.description}</p>
            </button>
          );
        })}
      </div>
    </QuestShell>
  );
};
