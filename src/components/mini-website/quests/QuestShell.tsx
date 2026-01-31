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
    <div className="flex flex-col gap-4">
      <QuestProgress steps={steps} currentIndex={currentIndex} onSelect={onStepSelect} />
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="space-y-4">{children}</div>
      {controls}
    </div>
  );
};
