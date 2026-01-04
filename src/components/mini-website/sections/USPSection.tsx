import { motion } from 'framer-motion';
import { ChefHat, Heart, Leaf, Palette, Sparkles, Gift, Shield, Smile, Package, Gem, Wrench, Book, MessageCircle, Star, Check } from 'lucide-react';
import type { SiteConfig } from '@/hooks/useSiteConfig';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  ChefHat, Heart, Leaf, Palette, Sparkles, Gift, Shield, Smile, Package, Gem, Wrench, Book, MessageCircle, Star
};

interface USPSectionProps {
  config: SiteConfig;
  isMobile: boolean;
}

export const USPSection = ({ config, isMobile }: USPSectionProps) => {
  const variant = config.layouts.features;
  const features = config.content.features;
  const cornerRadius = config.styles.cornerRadius;

  // Grid Layout
  if (variant === 'grid') {
    return (
      <section className="py-12 px-6 bg-gray-50">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-center mb-8"
        >
          Why Choose Us? ✨
        </motion.h2>
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-6'} max-w-4xl mx-auto`}>
        {features.map((feature, index) => {
          const IconComponent = iconMap[feature.icon] || Star;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`text-center p-6 bg-background ${cornerRadius} shadow-sm`}
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>
    );
  }

  // List Layout
  if (variant === 'list') {
    return (
      <section className="py-12 px-6 bg-gray-50">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-center mb-8"
        >
          What You Get ✓
        </motion.h2>
        <div className="max-w-md mx-auto space-y-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  // Cards Layout
  return (
    <section className="py-12 px-6 bg-gray-50">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl font-bold text-center mb-8"
      >
        Our Promise 💫
      </motion.h2>
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-6'} max-w-4xl mx-auto`}>
        {features.map((feature, index) => {
          const IconComponent = iconMap[feature.icon] || Star;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`p-6 bg-white ${cornerRadius} border border-gray-100 shadow-sm`}
            >
              <IconComponent className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
