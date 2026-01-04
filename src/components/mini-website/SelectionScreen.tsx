import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Cake, Palette, Package, Gem, Hammer } from 'lucide-react';
import type { BusinessType } from '@/hooks/useSiteConfig';

import { useLanguage } from '@/components/language-provider';
import { LanguageToggle } from '@/components/language-toggle';
import { FloatingElements } from '@/components/floating-elements';
import { HelpBubble } from '@/components/help-bubble';

interface SelectionScreenProps {
  onSelect: (type: BusinessType) => void;
}

const businessTypes: {
  type: BusinessType;
  emoji: string;
  labelEN: string;
  labelBM: string;
  descEN: string;
  descBM: string;
  icon: typeof Cake;
  gradient: string;
}[] = [
  {
    type: 'food',
    emoji: '🍰',
    labelEN: 'Food & Treats',
    labelBM: 'Makanan & Snek',
    descEN: 'Cookies, cakes, snacks & drinks',
    descBM: 'Biskut, kek, snek & minuman',
    icon: Cake,
    gradient: 'from-orange-400 to-red-500',
  },
  {
    type: 'crafts',
    emoji: '🎨',
    labelEN: 'Arts & Crafts',
    labelBM: 'Seni & Kraf',
    descEN: 'Handmade art, jewelry & decor',
    descBM: 'Seni buatan tangan, barang kemas & hiasan',
    icon: Palette,
    gradient: 'from-purple-400 to-pink-500',
  },
  {
    type: 'toys',
    emoji: '🧸',
    labelEN: 'Toys & Games',
    labelBM: 'Mainan & Permainan',
    descEN: 'Fun stuff for kids of all ages',
    descBM: 'Barangan seronok untuk kanak-kanak',
    icon: Package,
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    type: 'accessories',
    emoji: '💍',
    labelEN: 'Accessories',
    labelBM: 'Aksesori',
    descEN: 'Bags, jewelry & fashion items',
    descBM: 'Beg, barang kemas & fesyen',
    icon: Gem,
    gradient: 'from-pink-400 to-purple-500',
  },
  {
    type: 'diy',
    emoji: '🔨',
    labelEN: 'DIY Kits',
    labelBM: 'Kit DIY',
    descEN: 'Build-it-yourself projects',
    descBM: 'Projek buat sendiri',
    icon: Hammer,
    gradient: 'from-blue-400 to-cyan-500',
  },
];

export const SelectionScreen = ({ onSelect }: SelectionScreenProps) => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <FloatingElements />

      {/* Standard Navbar */}
      <header className="relative z-10 flex items-center justify-between p-4 md:p-6 bg-white/50 backdrop-blur-sm">
        <Link
          to="/"
          className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-[var(--shadow-low)] hover:shadow-[var(--shadow-medium)] transition-all"
        >
          <span>←</span>
          <span className="font-semibold text-[var(--text-primary)] text-sm">{t("common.back")}</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌐</span>
          <span className="font-bold text-[var(--text-primary)] hidden sm:block">{t("tool.miniWebsite")}</span>
        </div>
        <LanguageToggle />
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 md:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] mb-2">
            {language === 'EN' ? 'What kind of shop are you building?' : 'Jenis kedai apa yang anda bina?'} 🏪
          </h1>
          <p className="text-[var(--text-secondary)]">
            {language === 'EN' ? 'Pick your business type to get started' : 'Pilih jenis perniagaan untuk bermula'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {businessTypes.map((business, index) => (
            <motion.button
              key={business.type}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(business.type)}
              className="group relative bg-white rounded-2xl p-5 shadow-[var(--shadow-low)] hover:shadow-[var(--shadow-medium)] transition-all duration-300 border-2 border-[var(--border-light)] hover:border-[var(--sky-blue)] overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${business.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* Content */}
              <div className="relative z-10">
                <motion.div
                  className="text-4xl mb-3"
                  whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {business.emoji}
                </motion.div>

                <h3 className="text-base font-bold mb-1 text-[var(--text-primary)]">
                  {language === 'EN' ? business.labelEN : business.labelBM}
                </h3>

                <p className="text-xs text-[var(--text-muted)]">
                  {language === 'EN' ? business.descEN : business.descBM}
                </p>

                {/* Hover indicator */}
                <motion.div
                  className={`mt-3 h-1 bg-gradient-to-r ${business.gradient} rounded-full`}
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.button>
          ))}
        </div>
      </main>

      <HelpBubble />
    </div>
  );
};
