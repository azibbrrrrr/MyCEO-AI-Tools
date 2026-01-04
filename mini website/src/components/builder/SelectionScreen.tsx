import { motion } from 'framer-motion';
import { Cake, Palette, Package, Gem, Hammer } from 'lucide-react';
import type { BusinessType } from '@/hooks/useSiteConfig';
import { SpicyAnimation } from './SpicyAnimations';

interface SelectionScreenProps {
  onSelect: (type: BusinessType) => void;
}

const businessTypes: {
  type: BusinessType;
  emoji: string;
  label: string;
  description: string;
  icon: typeof Cake;
  gradient: string;
}[] = [
  {
    type: 'food',
    emoji: '🍰',
    label: 'Food & Treats',
    description: 'Cookies, cakes, snacks & drinks',
    icon: Cake,
    gradient: 'from-orange-400 to-red-500',
  },
  {
    type: 'crafts',
    emoji: '🎨',
    label: 'Arts & Crafts',
    description: 'Handmade art, jewelry & decor',
    icon: Palette,
    gradient: 'from-purple-400 to-pink-500',
  },
  {
    type: 'toys',
    emoji: '🧸',
    label: 'Toys & Games',
    description: 'Fun stuff for kids of all ages',
    icon: Package,
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    type: 'accessories',
    emoji: '💍',
    label: 'Accessories',
    description: 'Bags, jewelry & fashion items',
    icon: Gem,
    gradient: 'from-pink-400 to-purple-500',
  },
  {
    type: 'diy',
    emoji: '🔨',
    label: 'DIY Kits',
    description: 'Build-it-yourself projects',
    icon: Hammer,
    gradient: 'from-blue-400 to-cyan-500',
  },
];

export const SelectionScreen = ({ onSelect }: SelectionScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
          My-CEO Mini-Site Builder
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground">
          What kind of shop are you building? 🏪
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl w-full">
        {businessTypes.map((business, index) => (
          <motion.button
            key={business.type}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(business.type)}
            className="group relative bg-card rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary/30 overflow-hidden"
          >
            {/* Background gradient on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${business.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            />

            {/* Spicy animation preview on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <SpicyAnimation type={business.type} />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <motion.div
                className="text-5xl mb-4"
                whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                {business.emoji}
              </motion.div>

              <h3 className="text-lg font-bold mb-2 text-foreground">
                {business.label}
              </h3>

              <p className="text-sm text-muted-foreground">
                {business.description}
              </p>

              {/* Hover indicator */}
              <motion.div
                className={`mt-4 h-1 bg-gradient-to-r ${business.gradient} rounded-full`}
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.button>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-10 text-muted-foreground text-center"
      >
        ✨ Hover over a card to see the magic animation! ✨
      </motion.p>
    </div>
  );
};
