import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import type { SiteConfig } from '@/hooks/useSiteConfig';

interface CTASectionProps {
  config: SiteConfig;
}

export const CTASection = ({ config }: CTASectionProps) => {
  const cornerRadius = config.styles.cornerRadius;
  const buttonStyle = config.styles.buttonStyle;

  const getButtonClasses = () => {
    const base = `px-8 py-4 font-bold text-lg transition-all ${cornerRadius} flex items-center gap-2`;
    if (buttonStyle === 'solid') {
      return `${base} bg-primary text-primary-foreground hover:opacity-90`;
    }
    if (buttonStyle === 'outline') {
      return `${base} border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground`;
    }
    return `${base} bg-primary text-primary-foreground shadow-xl shadow-primary/40 hover:-translate-y-1 hover:shadow-2xl`;
  };

  return (
    <section className="py-16 px-6 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-xl mx-auto"
      >
        <h2 className="text-3xl font-bold mb-4">Ready to Order? 🚀</h2>
        <p className="text-muted-foreground mb-8">
          Don't miss out on this amazing offer. Order now and join our happy customers!
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={getButtonClasses()}
        >
          <ShoppingCart className="w-5 h-5" />
          Order Now
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        <p className="text-xs text-muted-foreground mt-4">
          ✓ Free shipping  ✓ 30-day returns  ✓ Secure checkout
        </p>
      </motion.div>
    </section>
  );
};
