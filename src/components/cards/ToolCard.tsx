import { LucideIcon, Lock, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export type ToolState = 'available' | 'inProgress' | 'used' | 'comingSoon' | 'locked';

interface ToolCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  state: ToolState;
  color: 'primary' | 'accent' | 'success' | 'warning';
  onClick?: () => void;
}

const stateConfig = {
  available: {
    badge: 'tool.state.available',
    badgeColor: 'bg-success/10 text-success',
    icon: Sparkles,
  },
  inProgress: {
    badge: 'tool.state.inProgress',
    badgeColor: 'bg-warning/10 text-warning',
    icon: Clock,
  },
  used: {
    badge: 'tool.state.used',
    badgeColor: 'bg-primary/10 text-primary',
    icon: CheckCircle,
  },
  comingSoon: {
    badge: 'tool.state.comingSoon',
    badgeColor: 'bg-muted text-muted-foreground',
    icon: Lock,
  },
  locked: {
    badge: 'tool.state.locked',
    badgeColor: 'bg-muted text-muted-foreground',
    icon: Lock,
  },
};

const colorConfig = {
  primary: {
    bg: 'bg-primary/10',
    icon: 'text-primary',
    hover: 'hover:border-primary/30',
  },
  accent: {
    bg: 'bg-accent/10',
    icon: 'text-accent',
    hover: 'hover:border-accent/30',
  },
  success: {
    bg: 'bg-success/10',
    icon: 'text-success',
    hover: 'hover:border-success/30',
  },
  warning: {
    bg: 'bg-warning/10',
    icon: 'text-warning',
    hover: 'hover:border-warning/30',
  },
};

export function ToolCard({ name, description, icon: Icon, state, color, onClick }: ToolCardProps) {
  const { t } = useI18n();
  const stateInfo = stateConfig[state];
  const colorInfo = colorConfig[color];
  const isDisabled = state === 'comingSoon' || state === 'locked';
  const StateIcon = stateInfo.icon;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        "w-full p-5 rounded-2xl border-2 border-border bg-card text-left transition-all duration-300 fun-card group",
        colorInfo.hover,
        isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      )}
    >
      {/* Badge */}
      <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-4", stateInfo.badgeColor)}>
        <StateIcon className="w-3 h-3" />
        {t(stateInfo.badge as any)}
      </div>

      {/* Icon */}
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110", colorInfo.bg)}>
        <Icon className={cn("w-7 h-7", colorInfo.icon)} />
      </div>

      {/* Content */}
      <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
        {name}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Coming Soon Overlay */}
      {isDisabled && (
        <div className="mt-4 flex items-center gap-2 text-muted-foreground">
          <Lock className="w-4 h-4" />
          <span className="text-sm font-medium">{t('tool.state.comingSoon')}</span>
        </div>
      )}
    </button>
  );
}
