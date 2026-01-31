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
      title={language === 'EN' ? 'Launch' : 'Lancar'}
      subtitle={
        language === 'EN'
          ? "You're ready. Let's make this official."
          : 'Anda sudah bersedia. Mari jadikan ini rasmi.'
      }
      controls={
        <QuestControls
          onBack={onBack}
          backLabel={language === 'EN' ? 'Back' : 'Kembali'}
        />
      }
    >
      <div className="space-y-4">
        {!isPublished && (
          <>
            {language === 'EN' ? (
              <div className="flex flex-col items-center text-center space-y-4 py-6">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-2 animate-bounce-slow">
                  <span className="text-4xl">🚀</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">Ready for liftoff?</h3>
                  <p className="text-slate-600 max-w-[260px] mx-auto leading-relaxed">
                    You've built a great site. Let's share it with the world.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-4 py-6">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-2 animate-bounce-slow">
                  <span className="text-4xl">🚀</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">Sedia untuk berlepas?</h3>
                  <p className="text-slate-600 max-w-[260px] mx-auto leading-relaxed">
                    Laman anda hebat. Mari kongsikan dengan dunia.
                  </p>
                </div>
              </div>
            )}
            
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={onPublish}
                className="w-full rounded-xl bg-slate-900 text-white py-3.5 font-bold shadow-lg hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
              >
                <span>{language === 'EN' ? 'Publish Now' : 'Terbitkan Sekarang'}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <button
                type="button"
                onClick={onBack}
                className="w-full text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors py-2"
              >
                {language === 'EN' ? 'Go back and edit' : 'Kembali untuk ubah'}
              </button>
            </div>
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
