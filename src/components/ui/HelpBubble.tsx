import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface HelpBubbleProps {
  tips?: string[];
}

export function HelpBubble({ tips }: HelpBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useI18n();

  const defaultTips = [
    "Click on any tool card to start creating!",
    "You can always go back to previous steps.",
    "Don't worry about mistakes - you can try again!",
  ];

  const displayTips = tips || defaultTips;

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-6">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-72 bg-card rounded-2xl shadow-lg p-4 animate-pop-in border border-border">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
          <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <span className="text-lg">💡</span>
            {t('common.helpBubble')}
          </h4>
          <ul className="space-y-2">
            {displayTips.map((tip, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 bounce-hover",
          isOpen
            ? "bg-muted text-muted-foreground"
            : "bg-primary text-primary-foreground animate-pulse-glow"
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <HelpCircle className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
