interface QuestProgressProps {
  steps: { id: string; label: string }[];
  currentIndex: number;
  onSelect?: (index: number) => void;
}

export const QuestProgress = ({ steps, currentIndex, onSelect }: QuestProgressProps) => {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isComplete = index < currentIndex;
        return (
          <button
            key={step.id}
            type="button"
            onClick={() => onSelect?.(index)}
            className={`flex-1 h-2 rounded-full transition-colors ${
              isActive
                ? 'bg-blue-500'
                : isComplete
                  ? 'bg-blue-200'
                  : 'bg-slate-200'
            }`}
            aria-label={`Step ${index + 1}: ${step.label}`}
          />
        );
      })}
    </div>
  );
};
