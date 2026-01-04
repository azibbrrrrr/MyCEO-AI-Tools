import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingUp, AlertCircle, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { useMarketingCoach } from '@/hooks/useMarketingCoach';
import type { SiteConfig } from '@/hooks/useSiteConfig';
import { Progress } from '@/components/ui/progress';

interface MarketingCoachWidgetProps {
  config: SiteConfig;
  isMobile?: boolean;
}

export const MarketingCoachWidget = ({ config, isMobile }: MarketingCoachWidgetProps) => {
  const coach = useMarketingCoach(config);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Trigger confetti when score hits 100
  if (coach.celebrationTriggered && !showConfetti) {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }

  const incompleteTips = coach.tips.filter(t => !t.completed);
  const nextTip = incompleteTips[0];

  return (
    <>
      {/* Confetti celebration */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: `hsl(${Math.random() * 360}, 70%, 60%)`,
                  left: `${Math.random() * 100}%`,
                  top: -20,
                }}
                initial={{ y: 0, opacity: 1, rotate: 0 }}
                animate={{
                  y: window.innerHeight + 100,
                  opacity: 0,
                  rotate: Math.random() * 720 - 360,
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main widget */}
      <motion.div
        layout
        className={`fixed z-40 ${
          isMobile 
            ? 'bottom-24 right-4' // Mobile: Above bottom edit bar
            : 'bottom-6 right-6'  // Desktop: Standard corner
        }`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', delay: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card border-2 border-primary/20 rounded-2xl shadow-2xl p-5 w-80"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Marketing Coach</h3>
                    <p className="text-xs text-muted-foreground capitalize">
                      Level: {coach.level}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Marketing Score</span>
                  <span className="text-2xl font-bold text-primary">{coach.score}</span>
                </div>
                <Progress value={coach.score} className="h-3" />
              </div>

              {/* Tips list */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {coach.tips.map((tip) => (
                  <motion.div
                    key={tip.id}
                    layout
                    className={`p-3 rounded-lg text-sm ${
                      tip.completed
                        ? 'bg-green-500/10 text-green-600'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {tip.completed ? (
                        <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      )}
                      <span>{tip.message}</span>
                    </div>
                    {!tip.completed && (
                      <span className="text-xs text-primary ml-6">
                        +{tip.points} points
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(true)}
              className="bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
            >
              <div className="relative">
                <Trophy className="w-6 h-6" />
                {coach.score === 100 && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                )}
              </div>
              <div className="text-left">
                <div className="font-bold text-lg">{coach.score}/100</div>
                {nextTip && (
                  <div className="text-xs opacity-80 max-w-32 truncate flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +{nextTip.points} available
                  </div>
                )}
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
