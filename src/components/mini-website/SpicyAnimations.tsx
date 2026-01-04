import { motion } from 'framer-motion';

// Steam & Sizzle Animation for Food
export const SteamAnimation = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Steam wisps */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-6 rounded-full"
          style={{
            background: 'linear-gradient(to top, transparent, rgba(255,255,255,0.6), transparent)',
            left: `${20 + i * 20}%`,
            bottom: '30%',
            filter: 'blur(2px)',
          }}
          animate={{
            y: [0, -30, -60],
            opacity: [0, 0.8, 0],
            scaleY: [0.5, 1.2, 1.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeOut',
          }}
        />
      ))}
      {/* Food sparkles */}
      {['🍪', '🧁', '☕'].map((emoji, i) => (
        <motion.div
          key={`e-${i}`}
          className="absolute text-sm"
          style={{
            left: `${15 + i * 30}%`,
            bottom: '20%',
          }}
          animate={{
            y: [0, -15, 0],
            scale: [0.8, 1.1, 0.8],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.4,
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
};

// Paint Splash Animation for Crafts
export const AutographAnimation = () => {
  const colors = ['#FF69B4', '#9370DB', '#20B2AA', '#FFD700', '#FF6347'];
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Paint splashes */}
      {colors.map((color, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: color,
            left: `${10 + i * 20}%`,
            top: `${30 + (i % 3) * 15}%`,
          }}
          animate={{
            scale: [0, 1.5, 1],
            opacity: [0, 1, 0.6],
            y: [0, -10, 5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            repeatDelay: 1.5,
          }}
        />
      ))}
      {/* Brush stroke */}
      <motion.div
        className="absolute left-[10%] bottom-[25%] w-[80%] h-1 rounded-full"
        style={{ background: 'linear-gradient(90deg, #FF69B4, #9370DB, #20B2AA)' }}
        initial={{ scaleX: 0, transformOrigin: 'left' }}
        animate={{ scaleX: [0, 1, 1, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 0.5,
        }}
      />
    </div>
  );
};

// Sparkle & Confetti Animation for Toys
export const UnboxingAnimation = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Floating toy icons */}
      {['⭐', '🎈', '🎮', '🎪'].map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-lg"
          style={{
            left: `${15 + i * 22}%`,
            top: '40%',
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 15, -15, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.25,
          }}
        >
          {emoji}
        </motion.div>
      ))}
      {/* Confetti */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`c-${i}`}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            backgroundColor: ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#9370DB', '#32CD32'][i],
            left: `${5 + i * 16}%`,
            top: '60%',
            rotate: `${i * 30}deg`,
          }}
          animate={{
            y: [0, -40, -60],
            x: [0, (i % 2 === 0 ? 15 : -15)],
            opacity: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.15,
            repeatDelay: 1,
          }}
        />
      ))}
    </div>
  );
};

// Sparkle/Shine Animation for Accessories
export const GlintAnimation = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Sweeping shine */}
      <motion.div
        className="absolute w-8 h-full"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
          left: '-20%',
        }}
        animate={{ left: ['−20%', '120%'] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 1,
          ease: 'easeInOut',
        }}
      />
      {/* Diamond sparkles */}
      {['💎', '✨', '💍', '✨'].map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-sm"
          style={{
            left: `${15 + i * 22}%`,
            top: `${25 + (i % 2) * 30}%`,
          }}
          animate={{
            scale: [0.5, 1.3, 0.5],
            opacity: [0.3, 1, 0.3],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
};

// Blueprint/Building Animation for DIY
export const BlueprintAnimation = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Tool icons */}
      {['🔧', '🔨', '📐', '✂️'].map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-base"
          style={{
            left: `${10 + i * 25}%`,
            top: '35%',
          }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, -20, 20, 0],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        >
          {emoji}
        </motion.div>
      ))}
      {/* Building blocks */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`b-${i}`}
          className="absolute w-4 h-4 rounded-sm border-2 border-blue-400 bg-blue-100"
          style={{
            left: `${25 + i * 25}%`,
            bottom: '20%',
          }}
          animate={{
            y: [20, 0, 0],
            opacity: [0, 1, 1],
            scale: [0.5, 1, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.3,
            repeatDelay: 2,
          }}
        />
      ))}
    </div>
  );
};

// Export a component that renders based on business type
interface SpicyAnimationProps {
  type: 'food' | 'crafts' | 'toys' | 'accessories' | 'diy';
  className?: string;
}

export const SpicyAnimation = ({ type, className = '' }: SpicyAnimationProps) => {
  const animations = {
    food: SteamAnimation,
    crafts: AutographAnimation,
    toys: UnboxingAnimation,
    accessories: GlintAnimation,
    diy: BlueprintAnimation,
  };

  const AnimationComponent = animations[type];

  return (
    <div className={`absolute inset-0 ${className}`}>
      <AnimationComponent />
    </div>
  );
};
