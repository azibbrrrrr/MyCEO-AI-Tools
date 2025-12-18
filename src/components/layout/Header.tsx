import { useI18n } from '@/lib/i18n';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { User, Sparkles } from 'lucide-react';

interface HeaderProps {
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
  userEmail?: string;
}

export function Header({ showProgress, currentStep = 0, totalSteps = 1, userEmail }: HeaderProps) {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">
              KidBiz Tools
            </span>
          </div>

          {/* Progress (if in wizard) */}
          {showProgress && (
            <div className="flex-1 max-w-xs mx-4 hidden md:block">
              <ProgressBar current={currentStep} total={totalSteps} />
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LanguageToggle />
            
            {userEmail && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 rounded-full">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-medium text-success hidden sm:inline">
                  {t('dashboard.session.active')}
                </span>
              </div>
            )}

            {userEmail && (
              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-xl">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground hidden sm:inline max-w-24 truncate">
                  {userEmail}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Progress */}
        {showProgress && (
          <div className="pb-3 md:hidden">
            <ProgressBar current={currentStep} total={totalSteps} showSteps />
          </div>
        )}
      </div>
    </header>
  );
}
