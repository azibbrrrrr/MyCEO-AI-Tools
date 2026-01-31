import { Button } from '@/components/ui/button';

interface QuestControlsProps {
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
}

export const QuestControls = ({
  onBack,
  onNext,
  backLabel = 'Back',
  nextLabel = 'Next',
  nextDisabled = false,
}: QuestControlsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {onBack && (
        <Button variant="outline" size="sm" onClick={onBack}>
          {backLabel}
        </Button>
      )}
      {onNext && (
        <Button className="ml-auto" onClick={onNext} disabled={nextDisabled}>
          {nextLabel}
        </Button>
      )}
    </div>
  );
};
