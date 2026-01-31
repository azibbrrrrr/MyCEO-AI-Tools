import { useState } from 'react';
import type { UseSiteConfigReturn } from '@/hooks/useSiteConfig';
import { QuestStep1Name } from './steps/QuestStep1Name';
import { QuestStep2Vibe } from './steps/QuestStep2Vibe';
import { QuestStep3Products } from './steps/QuestStep3Products';
import { QuestStep4Reviews } from './steps/QuestStep4Reviews';
import { QuestStep5Publish } from './steps/QuestStep5Publish';

interface QuestFlowProps {
  siteConfig: UseSiteConfigReturn;
  isPublished: boolean;
  liveUrl?: string | null;
  onPublish: () => void;
  onEnterBossMode: () => void;
}

const steps = [
  { id: 'name', label: 'Name' },
  { id: 'vibe', label: 'Vibe' },
  { id: 'products', label: 'Products' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'publish', label: 'Publish' },
];

export const QuestFlow = ({
  siteConfig,
  isPublished,
  liveUrl,
  onPublish,
  onEnterBossMode,
}: QuestFlowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () => setCurrentIndex(prev => Math.min(prev + 1, steps.length - 1));
  const goBack = () => setCurrentIndex(prev => Math.max(prev - 1, 0));

  const handleStepSelect = (index: number) => {
    if (index <= currentIndex) {
      setCurrentIndex(index);
    }
  };

  if (currentIndex === 0) {
    return (
      <QuestStep1Name
        siteConfig={siteConfig}
        steps={steps}
        currentIndex={currentIndex}
        onStepSelect={handleStepSelect}
        onNext={goNext}
      />
    );
  }

  if (currentIndex === 1) {
    return (
      <QuestStep2Vibe
        siteConfig={siteConfig}
        steps={steps}
        currentIndex={currentIndex}
        onStepSelect={handleStepSelect}
        onNext={goNext}
      />
    );
  }

  if (currentIndex === 2) {
    return (
      <QuestStep3Products
        siteConfig={siteConfig}
        steps={steps}
        currentIndex={currentIndex}
        onStepSelect={handleStepSelect}
        onNext={goNext}
      />
    );
  }

  if (currentIndex === 3) {
    return (
      <QuestStep4Reviews
        siteConfig={siteConfig}
        steps={steps}
        currentIndex={currentIndex}
        onStepSelect={handleStepSelect}
        onNext={goNext}
      />
    );
  }

  return (
    <QuestStep5Publish
      steps={steps}
      currentIndex={currentIndex}
      onStepSelect={handleStepSelect}
      onBack={goBack}
      onPublish={onPublish}
      isPublished={isPublished}
      liveUrl={liveUrl}
      onEnterBossMode={onEnterBossMode}
    />
  );
};
