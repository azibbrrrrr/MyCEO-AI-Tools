import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import type { SiteConfig } from '@/hooks/useSiteConfig';

interface ScarcityBarProps {
  config: SiteConfig;
}

export const ScarcityBar = ({ config }: ScarcityBarProps) => {
  return (
    <div className="bg-destructive text-destructive-foreground py-2 overflow-hidden animate-pulse-glow">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: '-100%' }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="flex items-center gap-4 whitespace-nowrap"
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-4 h-4" />
            {config.content.scarcityText}
            <span className="mx-4">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};
