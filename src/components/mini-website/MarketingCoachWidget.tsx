import { motion } from 'framer-motion';
import { MessageCircle, Sparkles, Star } from 'lucide-react';
import { useMarketingCoach } from '@/hooks/useMarketingCoach';
import type { SiteConfig } from '@/hooks/useSiteConfig';

interface MarketingCoachWidgetProps {
  config: SiteConfig;
  isMobile?: boolean;
  isPublished: boolean;
}

export const MarketingCoachWidget = ({ config, isMobile, isPublished }: MarketingCoachWidgetProps) => {
  const coach = useMarketingCoach(config, { isPublished });

  return (
    <motion.div
      className={`fixed z-40 ${
        isMobile ? 'bottom-24 right-4' : 'bottom-6 right-6'
      }`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', delay: 0.4 }}
    >
      <div className="bg-card border-2 border-primary/20 rounded-2xl shadow-2xl p-4 w-72">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Boss Level</p>
            <p className="text-base font-semibold text-foreground">{coach.levelLabel}</p>
          </div>
          <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="w-3 h-3 text-amber-400" />
            <span>Coach</span>
          </div>
        </div>

        <div className="rounded-xl bg-muted/60 p-3 text-sm text-foreground flex items-start gap-2">
          <MessageCircle className="w-4 h-4 mt-0.5 text-primary" />
          <span>{coach.tip}</span>
        </div>
      </div>
    </motion.div>
  );
};
