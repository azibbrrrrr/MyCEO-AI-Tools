import { Button } from '@/components/ui/button';

interface QuestControlsProps {
  onUndo: () => void;
  onSkip: () => void;
  onReset: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}

export const QuestControls = ({
  onUndo,
  onSkip,
  onReset,
  onNext,
  nextLabel = 'Next',
  nextDisabled = false,
}: QuestControlsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-200">
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
