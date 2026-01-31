import type { ReactNode } from 'react';
import { QuestProgress } from './QuestProgress';

interface QuestShellProps {
  steps: { id: string; label: string }[];
  currentIndex: number;
  title: string;
  subtitle?: string;
  onStepSelect?: (index: number) => void;
  children: ReactNode;
  controls?: ReactNode;
}

export const QuestShell = ({
  steps,
  currentIndex,
  title,
  subtitle,
  onStepSelect,
  children,
  controls,
}: QuestShellProps) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="shrink-0 space-y-4">
        <QuestProgress steps={steps} currentIndex={currentIndex} onSelect={onStepSelect} />
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0 pr-1 -mr-1">
        <div className="space-y-4 pb-4">{children}</div>
      </div>
      <div className="shrink-0 pt-4 border-t border-slate-200 mt-auto bg-white">
        {controls}
      </div>
    </div>
  );
};
