import { useMemo, useRef } from 'react';
import type { UseSiteConfigReturn, Review } from '@/hooks/useSiteConfig';
import { useLanguage } from '@/components/language-provider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { QuestShell } from '../QuestShell';
import { QuestControls } from '../QuestControls';
import { QUEST_REVIEW_TEMPLATES } from '@/lib/questTemplates';
import { sanitizeText } from '@/lib/questGuardrails';

interface QuestStepBaseProps {
  siteConfig: UseSiteConfigReturn;
  steps: { id: string; label: string }[];
  currentIndex: number;
  onStepSelect: (index: number) => void;
  onBack: () => void;
  onNext: () => void;
}

const cloneReviews = (reviews: Review[]) => reviews.map(review => ({ ...review }));

const matchesTemplate = (review: Review, template: Review) =>
  review.text === template.text && review.name === template.name;

export const QuestStep4Reviews = ({
  siteConfig,
  steps,
  currentIndex,
  onStepSelect,
  onBack,
  onNext,
}: QuestStepBaseProps) => {
  const { config, setContent } = siteConfig;
  const { language } = useLanguage();

  const initialRef = useRef(cloneReviews(config.content.reviews));
  const previousRef = useRef(cloneReviews(config.content.reviews));

  const selectedReviews = config.content.reviews.slice(0, 2);
  const extraReviews = config.content.reviews.slice(2);

  const selectedTemplateIds = useMemo(() => {
    return QUEST_REVIEW_TEMPLATES.filter(template =>
      selectedReviews.some(review => matchesTemplate(review, template))
    ).map(template => template.id);
  }, [selectedReviews]);

  const updateSelected = (nextSelected: Review[]) => {
    previousRef.current = cloneReviews(config.content.reviews);
    setContent('reviews', [...nextSelected, ...extraReviews]);
  };

  const handleUndo = () => {
    const current = cloneReviews(config.content.reviews);
    setContent('reviews', previousRef.current);
    previousRef.current = current;
  };

  const handleReset = () => {
    previousRef.current = cloneReviews(config.content.reviews);
    setContent('reviews', initialRef.current);
  };

  const handleSkip = () => {
    onNext();
  };

  const toggleTemplate = (template: Review) => {
    const isSelected = selectedReviews.some(review => matchesTemplate(review, template));
    if (isSelected) {
      const next = selectedReviews.filter(review => !matchesTemplate(review, template));
      updateSelected(next);
      return;
    }
    if (selectedReviews.length >= 2) return;
    const next = [
      ...selectedReviews,
      { ...template, id: crypto.randomUUID() },
    ];
    updateSelected(next);
  };

  return (
    <QuestShell
      steps={steps}
      currentIndex={currentIndex}
      onStepSelect={onStepSelect}
      title={language === 'EN' ? 'Add Some Trust' : 'Tambah Kepercayaan'}
      subtitle={
        language === 'EN'
          ? 'Pick up to 2 reviews to build trust.'
          : 'Pilih hingga 2 ulasan untuk bina kepercayaan.'
      }
      controls={
        <QuestControls
          onBack={onBack}
          onUndo={handleUndo}
          onSkip={handleSkip}
          onReset={handleReset}
          onNext={onNext}
          backLabel={language === 'EN' ? 'Back' : 'Kembali'}
          nextLabel={language === 'EN' ? 'Next' : 'Seterusnya'}
        />
      }
    >
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          {QUEST_REVIEW_TEMPLATES.map(template => {
            const isSelected = selectedTemplateIds.includes(template.id);
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => toggleTemplate(template)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <p className="text-sm font-semibold text-slate-800">{template.text}</p>
                <p className="text-xs text-slate-500 mt-2">{template.name}</p>
              </button>
            );
          })}
        </div>

        {selectedReviews.length > 0 && (
          <div className="space-y-3">
            {selectedReviews.map((review, index) => (
              <div key={review.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {language === 'EN' ? `Review ${index + 1}` : `Ulasan ${index + 1}`}
                </label>
                <Input
                  value={review.name}
                  onChange={(event) => {
                    const name = sanitizeText(event.target.value);
                    const next = selectedReviews.map(item =>
                      item.id === review.id ? { ...item, name } : item
                    );
                    updateSelected(next);
                  }}
                  className="mb-2"
                />
                <Textarea
                  value={review.text}
                  onChange={(event) => {
                    const text = sanitizeText(event.target.value);
                    const next = selectedReviews.map(item =>
                      item.id === review.id ? { ...item, text } : item
                    );
                    updateSelected(next);
                  }}
                  rows={2}
                />
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-slate-500">
          {language === 'EN'
            ? 'Tip: Reviews help people trust your shop.'
            : 'Tip: Ulasan bantu orang percaya pada kedai kamu.'}
        </p>
      </div>
    </QuestShell>
  );
};
