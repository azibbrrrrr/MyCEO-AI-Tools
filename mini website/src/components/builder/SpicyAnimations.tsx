import { motion } from 'framer-motion';

// Steam & Sizzle Animation for Food
export const SteamAnimation = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-8 bg-gradient-to-t from-transparent via-white/40 to-transparent rounded-full blur-sm"
          style={{
            left: `${15 + i * 15}%`,
            bottom: '60%',
          }}
          animate={{
            y: [-20, -60, -100],
            opacity: [0, 0.7, 0],
            scaleY: [0.5, 1, 1.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};

// SVG Autograph Animation for Crafts
export const AutographAnimation = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 200 100"
      fill="none"
    >
      <motion.path
        d="M20,80 Q40,20 60,50 T100,40 T140,60 T180,30"
        stroke="hsl(var(--crafts-accent))"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 2, repeat: Infinity, repeatDelay: 1 },
          opacity: { duration: 0.5 },
        }}
      />
      <motion.circle
        cx="180"
        cy="30"
        r="4"
        fill="hsl(var(--crafts-accent))"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ delay: 2, duration: 0.3, repeat: Infinity, repeatDelay: 3 }}
      />
    </svg>
  );
};

// Unboxing Shake Animation for Toys
export const UnboxingAnimation = () => {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none flex items-center justify-center"
      initial={{ scale: 0.8, rotate: 0 }}
      animate={{
        scale: [0.8, 1.1, 1],
        rotate: [0, -5, 5, -3, 3, 0],
      }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        repeatDelay: 2,
      }}
    >
      <div className="w-20 h-20 relative">
        {/* Box lid */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-t-lg"
          animate={{
            y: [0, -15, -15, 0],
            rotateX: [0, -20, -20, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />
        {/* Box body */}
        <div className="absolute top-4 left-0 right-0 bottom-0 bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-b-lg" />
        {/* Stars popping out */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-300"
            style={{
              top: '20%',
              left: `${30 + i * 20}%`,
            }}
            animate={{
              y: [0, -30, -50],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: 0.5 + i * 0.15,
              repeatDelay: 2.5,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Glint/Shine Animation for Accessories
export const GlintAnimation = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute w-32 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12"
        initial={{ x: '-100%' }}
        animate={{ x: '400%' }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1.5,
          ease: 'easeInOut',
        }}
      />
      {/* Secondary sparkles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full"
          style={{
            top: `${20 + i * 20}%`,
            left: `${15 + i * 25}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.4,
            repeatDelay: 2,
          }}
        />
      ))}
    </div>
  );
};

// Blueprint Snap Animation for DIY
export const BlueprintAnimation = () => {
  const gridLines = [...Array(5)];

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      fill="none"
    >
      {/* Horizontal lines */}
      {gridLines.map((_, i) => (
        <motion.line
          key={`h-${i}`}
          x1="10"
          y1={20 + i * 15}
          x2="90"
          y2={20 + i * 15}
          stroke="hsl(var(--diy-accent))"
          strokeWidth="0.5"
          strokeDasharray="4 2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{
            duration: 0.5,
            delay: i * 0.1,
            repeat: Infinity,
            repeatDelay: 4,
          }}
        />
      ))}
      {/* Vertical lines */}
      {gridLines.map((_, i) => (
        <motion.line
          key={`v-${i}`}
          x1={20 + i * 15}
          y1="10"
          x2={20 + i * 15}
          y2="90"
          stroke="hsl(var(--diy-accent))"
          strokeWidth="0.5"
          strokeDasharray="4 2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{
            duration: 0.5,
            delay: 0.5 + i * 0.1,
            repeat: Infinity,
            repeatDelay: 4,
          }}
        />
      ))}
      {/* Snap points */}
      {[
        [35, 35],
        [65, 35],
        [35, 65],
        [65, 65],
      ].map(([cx, cy], i) => (
        <motion.circle
          key={`dot-${i}`}
          cx={cx}
          cy={cy}
          r="3"
          fill="hsl(var(--diy-accent))"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 1], opacity: 1 }}
          transition={{
            duration: 0.3,
            delay: 1 + i * 0.15,
            repeat: Infinity,
            repeatDelay: 4,
          }}
        />
      ))}
    </svg>
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
    <div className={`relative ${className}`}>
      <AnimationComponent />
    </div>
  );
};
