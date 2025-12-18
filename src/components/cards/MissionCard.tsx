import { Trophy, Star, Zap } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface MissionCardProps {
  completed: number;
  total: number;
  streak?: number;
}

export function MissionCard({ completed, total, streak = 0 }: MissionCardProps) {
  const { t } = useI18n();
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="relative overflow-hidden rounded-2xl p-6" style={{ background: 'var(--gradient-hero)' }}>
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 opacity-20">
        <Trophy className="w-24 h-24 text-white" />
      </div>
      <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-white/10" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{t('dashboard.mission.title')}</h3>
            <p className="text-white/80 text-sm">{t('dashboard.mission.subtitle')}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white/20 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/90 text-sm font-medium">{t('dashboard.progress')}</span>
            <span className="text-white font-bold">{percentage}%</span>
          </div>
          <div className="h-3 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500 animate-progress"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-semibold">{completed}/{total} tasks</span>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
              <span className="text-lg">🔥</span>
              <span className="text-white font-semibold">{streak} day streak!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
