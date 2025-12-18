import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showSteps?: boolean;
  className?: string;
}

export function ProgressBar({ current, total, label, showSteps = false, className }: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className={cn("w-full", className)}>
      {(label || showSteps) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-muted-foreground">{label}</span>}
          {showSteps && (
            <span className="text-sm font-bold text-primary">
              {current}/{total}
            </span>
          )}
        </div>
      )}
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            background: 'var(--gradient-hero)',
          }}
        />
      </div>
      {showSteps && (
        <div className="flex justify-between mt-2">
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                i < current
                  ? "bg-primary text-primary-foreground"
                  : i === current
                  ? "bg-accent text-accent-foreground animate-pulse"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {i < current ? "✓" : i + 1}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
