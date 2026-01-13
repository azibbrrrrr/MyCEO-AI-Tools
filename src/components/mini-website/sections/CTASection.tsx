import { motion } from 'framer-motion';
import { ShoppingCart, MessageCircle, Mail, Phone, ExternalLink } from 'lucide-react';
import type { SiteConfig, CTAButton, CTAActionType } from '@/hooks/useSiteConfig';

interface CTASectionProps {
  config: SiteConfig;
}

// Generate proper URL based on action type
const getButtonHref = (button: CTAButton): string => {
  switch (button.type) {
    case 'whatsapp':
      return `https://wa.me/${button.value}`;
    case 'email':
      return `mailto:${button.value}`;
    case 'phone':
      return `tel:${button.value}`;
    case 'shop':
    case 'custom':
    default:
      return button.value || '#';
  }
};

// Get icon based on action type
const getButtonIcon = (type: CTAActionType) => {
  switch (type) {
    case 'whatsapp':
      return MessageCircle;
    case 'email':
      return Mail;
    case 'phone':
      return Phone;
    case 'shop':
      return ShoppingCart;
    case 'custom':
    default:
      return ExternalLink;
  }
};

export const CTASection = ({ config }: CTASectionProps) => {
  const cornerRadius = config.styles.cornerRadius;
  const buttonStyle = config.styles.buttonStyle;
  const buttons = config.content.ctaButtons;

  const getButtonClasses = (isPrimary: boolean) => {
    const base = `px-6 py-3 font-bold text-base transition-all ${cornerRadius} flex items-center justify-center gap-2`;
    
    if (!isPrimary) {
      // Secondary button - outline style
      return `${base} border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground`;
    }
    
    // Primary button - follow button style setting
    if (buttonStyle === 'solid') {
      return `${base} bg-primary text-primary-foreground hover:opacity-90`;
    }
    if (buttonStyle === 'outline') {
      return `${base} border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground`;
    }
    return `${base} bg-primary text-primary-foreground shadow-xl shadow-primary/40 hover:-translate-y-1 hover:shadow-2xl`;
  };

  return (
    <section className="py-16 px-6 bg-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-xl mx-auto"
      >
        <h2 className="text-3xl font-bold mb-4">{config.content.ctaHeading} 🚀</h2>
        <p className="text-muted-foreground mb-8">
          {config.content.ctaSubtext}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {buttons.map((button) => {
            const Icon = getButtonIcon(button.type);
            const href = getButtonHref(button);
            
            return (
              <motion.a
                key={button.id}
                href={href}
                target={button.type === 'shop' || button.type === 'custom' ? '_blank' : undefined}
                rel={button.type === 'shop' || button.type === 'custom' ? 'noopener noreferrer' : undefined}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={getButtonClasses(button.isPrimary)}
              >
                <Icon className="w-5 h-5" />
                {button.text}
              </motion.a>
            );
          })}
        </div>

        {/* <p className="text-xs text-muted-foreground mt-6">
          ✓ Free shipping  ✓ 30-day returns  ✓ Secure checkout
        </p> */}
      </motion.div>
    </section>
  );
};
