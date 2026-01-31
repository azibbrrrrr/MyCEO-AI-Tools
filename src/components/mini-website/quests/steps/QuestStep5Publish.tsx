import { useLanguage } from '@/components/language-provider';
import { QuestShell } from '../QuestShell';
import { QuestControls } from '../QuestControls';

interface QuestStep5Props {
  steps: { id: string; label: string }[];
  currentIndex: number;
  onStepSelect: (index: number) => void;
  onBack: () => void;
  onPublish: () => void;
  isPublished: boolean;
  liveUrl?: string | null;
  onEnterBossMode: () => void;
}

export const QuestStep5Publish = ({
  steps,
  currentIndex,
  onStepSelect,
  onBack,
  onPublish,
  isPublished,
  liveUrl,
  onEnterBossMode,
}: QuestStep5Props) => {
  const { language } = useLanguage();

  return (
    <QuestShell
      steps={steps}
      currentIndex={currentIndex}
      onStepSelect={onStepSelect}
      title={language === 'EN' ? 'Go Live!' : 'Terbitkan!'}
      subtitle={
        language === 'EN'
          ? 'Review your preview and publish your website.'
          : 'Semak laman anda dan terbitkan sekarang.'
      }
      controls={
        <QuestControls
          onBack={onBack}
          onUndo={onBack}
          onSkip={onBack}
          onReset={onBack}
          backLabel={language === 'EN' ? 'Back' : 'Kembali'}
        />
      }
    >
      <div className="space-y-4">
        {!isPublished && (
          <>
            <p className="text-sm text-slate-600">
              {language === 'EN'
                ? 'Your website is ready. Publish when you are happy.'
                : 'Laman web anda sudah siap. Terbitkan bila anda suka.'}
            </p>
            <button
              type="button"
              onClick={onPublish}
              className="w-full rounded-xl bg-emerald-600 text-white py-3 font-semibold hover:bg-emerald-700 transition-colors"
            >
              {language === 'EN' ? 'Publish Website' : 'Terbitkan Website'}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              {language === 'EN' ? 'Go back and edit' : 'Kembali untuk ubah'}
            </button>
          </>
        )}

        {isPublished && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <p className="font-semibold">
              {language === 'EN' ? 'Your site is live!' : 'Laman anda sudah terbit!'}
            </p>
            {liveUrl && (
              <p className="mt-2 break-all text-xs text-emerald-700">{liveUrl}</p>
            )}
            <div className="mt-4 flex flex-col gap-2">
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center rounded-lg bg-emerald-600 text-white py-2 text-sm font-semibold hover:bg-emerald-700 transition-colors"
                >
                  {language === 'EN' ? 'Open Site' : 'Buka Laman'}
                </a>
              )}
              <button
                type="button"
                onClick={onEnterBossMode}
                className="w-full text-center rounded-lg border border-emerald-300 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                {language === 'EN' ? 'Enter Boss Mode' : 'Masuk Boss Mode'}
              </button>
            </div>
          </div>
        )}
      </div>
    </QuestShell>
  );
};
