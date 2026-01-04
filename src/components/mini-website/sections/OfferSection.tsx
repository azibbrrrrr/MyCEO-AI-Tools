import { motion } from 'framer-motion';
import { Package, Sparkles } from 'lucide-react';
import type { SiteConfig } from '@/hooks/useSiteConfig';

interface OfferSectionProps {
  config: SiteConfig;
  isMobile: boolean;
}

export const OfferSection = ({ config, isMobile }: OfferSectionProps) => {
  const variant = config.layouts.offer;
  const products = config.content.products;
  const cornerRadius = config.styles.cornerRadius;
  const buttonStyle = config.styles.buttonStyle;

  const getButtonClasses = () => {
    const base = `w-full px-4 py-2 font-semibold transition-all ${cornerRadius}`;
    if (buttonStyle === 'solid') {
      return `${base} bg-primary text-primary-foreground hover:opacity-90`;
    }
    if (buttonStyle === 'outline') {
      return `${base} border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground`;
    }
    return `${base} bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:-translate-y-1`;
  };

  // Cards Layout
  if (variant === 'cards') {
    return (
      <section className="py-12 px-6 bg-white">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-center mb-8"
        >
          Choose Your Pack 📦
        </motion.h2>

        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-6'} max-w-2xl mx-auto`}>
          {products.map((product, index) => {
            const isPopular = index === 1; // Second product is "popular"
            const savings = product.originalPrice
              ? Math.round((1 - product.price / product.originalPrice) * 100)
              : 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`relative p-6 bg-background ${cornerRadius} ${
                  isPopular
                    ? 'border-2 border-primary shadow-xl'
                    : 'border border-border shadow-md'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    BEST VALUE ⭐
                  </div>
                )}

                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                  <Package className="w-8 h-8 text-primary" />
                </div>

                <h3 className="font-bold text-lg text-center mb-2">{product.name}</h3>

                <div className="text-center mb-4">
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through mr-2">
                      ${product.originalPrice}
                    </span>
                  )}
                  <span className="text-3xl font-bold text-primary">${product.price}</span>
                  {savings > 0 && (
                    <span className="ml-2 text-sm text-green-600 font-semibold">
                      Save {savings}%
                    </span>
                  )}
                </div>

                <button className={getButtonClasses()}>Add to Cart</button>
              </motion.div>
            );
          })}
        </div>
      </section>
    );
  }

  // Bundle Layout
  return (
    <section className="py-12 px-6 bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className={`max-w-lg mx-auto p-8 bg-gradient-to-br from-primary/10 via-background to-secondary/10 ${cornerRadius} border-2 border-primary/30 shadow-xl relative overflow-hidden`}
      >
        {/* Sparkle decorations */}
        <Sparkles className="absolute top-4 right-4 w-6 h-6 text-primary/30 animate-pulse" />
        <Sparkles className="absolute bottom-4 left-4 w-6 h-6 text-secondary/30 animate-pulse" />

        <div className="text-center relative z-10">
          <div className="inline-block px-4 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full mb-4">
            🎁 BUNDLE DEAL
          </div>

          <h2 className="text-2xl font-bold mb-2">Get Everything!</h2>
          <p className="text-muted-foreground mb-6">
            All products in one amazing package
          </p>

          <div className="flex items-center justify-center gap-4 mb-6">
            {products.map((_product, index) => (
              <div
                key={index}
                className={`p-6 bg-white ${cornerRadius} border border-gray-100 shadow-sm text-center justify-center`}
              >
                <Package className="w-8 h-8 text-primary/60" />
              </div>
            ))}
          </div>

          <div className="mb-6">
            <span className="text-lg text-muted-foreground line-through mr-2">
              ${products.reduce((sum, p) => sum + (p.originalPrice || p.price), 0)}
            </span>
            <span className="text-4xl font-bold text-primary">
              ${Math.round(products.reduce((sum, p) => sum + p.price, 0) * 0.8)}
            </span>
            <div className="text-green-600 font-semibold mt-1">
              Save 20% with bundle! 🎉
            </div>
          </div>

          <button className={`${getButtonClasses()} text-lg py-3`}>
            Get the Bundle →
          </button>
        </div>
      </motion.div>
    </section>
  );
};
