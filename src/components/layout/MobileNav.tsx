import { Home, Palette, Calculator, Lightbulb } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const navItems = [
  { key: 'nav.home', icon: Home, path: '/dashboard' },
  { key: 'tool.logo.name', icon: Palette, path: '/logo-maker' },
  { key: 'tool.calculator.name', icon: Calculator, path: '/calculator' },
  { key: 'nav.tools', icon: Lightbulb, path: '/tools' },
] as const;

export function MobileNav() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-xl transition-all duration-200",
                  isActive && "bg-primary/10"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "animate-bounce-in")} />
              </div>
              <span className="text-xs font-medium truncate max-w-16">
                {t(item.key as any)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
