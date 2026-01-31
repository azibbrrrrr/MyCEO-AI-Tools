import { Button } from '@/components/ui/button';

interface QuestControlsProps {
  onBack?: () => void;
  onUndo: () => void;
  onSkip: () => void;
  onReset: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
}

export const QuestControls = ({
  onBack,
  onUndo,
  onSkip,
  onReset,
  onNext,
  backLabel = 'Back',
  nextLabel = 'Next',
  nextDisabled = false,
}: QuestControlsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-200">
      {onBack && (
        <Button variant="outline" size="sm" onClick={onBack}>
          {backLabel}
        </Button>
      )}
      <Button variant="outline" size="sm" onClick={onUndo}>
        Undo
      </Button>
      <Button variant="outline" size="sm" onClick={onSkip}>
        Skip
      </Button>
      <Button variant="outline" size="sm" onClick={onReset}>
        Reset Step
      </Button>
      {onNext && (
        <Button className="ml-auto" onClick={onNext} disabled={nextDisabled}>
          {nextLabel}
        </Button>
      )}
    </div>
  );
};
