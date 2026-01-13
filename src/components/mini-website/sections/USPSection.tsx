import { motion } from 'framer-motion';
import { Heart, Sparkles, Shield, Star, Check, Zap } from 'lucide-react';
import type { SiteConfig } from '@/hooks/useSiteConfig';
import type { LucideIcon } from 'lucide-react';

// Default icons to use - rotates based on index
const defaultIcons: LucideIcon[] = [Sparkles, Heart, Shield, Star, Zap, Check];

interface USPSectionProps {
  config: SiteConfig;
  isMobile: boolean;
}

// 1. BADGES - Circular icons in colorful badges
const BadgesUSP = ({ config, isMobile }: USPSectionProps) => {
  const features = config.content.features;
  
  return (
    <section className="section-padding px-6 bg-gradient-to-b from-primary/5 to-secondary/10">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl font-bold text-center mb-10"
      >
        What Makes Us Special 🌟
      </motion.h2>
      
      <div className={`flex ${isMobile ? 'flex-col gap-8' : 'flex-row justify-center gap-12'} max-w-4xl mx-auto`}>
        {features.map((feature, index) => {
          const IconComponent = defaultIcons[index % defaultIcons.length];
          const colors = ['from-primary to-primary/70', 'from-secondary to-secondary/70', 'from-accent to-accent/70'];
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, type: "spring" }}
              className="text-center flex flex-col items-center"
            >
              <motion.div 
                className={`w-24 h-24 rounded-full bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center shadow-lg mb-4`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <IconComponent className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground max-w-[180px]">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

// 2. TIMELINE - Step 1 -> Step 2 -> Step 3
const TimelineUSP = ({ config, isMobile }: USPSectionProps) => {
  const features = config.content.features;
  
  return (
    <section className="section-padding px-6 bg-gradient-to-b from-secondary/10 to-primary/5">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl font-bold text-center mb-10 font-serif"
      >
        Our Process 🎨
      </motion.h2>
      
      <div className="max-w-3xl mx-auto">
        <div className={`relative ${isMobile ? '' : 'flex items-start justify-between'}`}>
          {/* Connecting line */}
          {!isMobile && (
            <div className="absolute top-8 left-8 right-8 h-0.5 bg-gradient-to-r from-primary/30 via-secondary/50 to-accent/30" />
          )}
          
          {features.map((feature, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`relative ${isMobile ? 'flex items-start gap-4 mb-8' : 'flex flex-col items-center text-center flex-1'}`}
              >
                {/* Step number */}
                <div className={`relative z-10 w-16 h-16 rounded-full bg-background border-4 border-primary flex items-center justify-center shadow-lg ${isMobile ? '' : 'mb-4'}`}>
                  <span className="text-2xl font-bold text-primary">{index + 1}</span>
                </div>
                
                {/* Vertical line for mobile */}
                {isMobile && index < features.length - 1 && (
                  <div className="absolute left-8 top-16 bottom-0 w-0.5 h-16 bg-primary/30" />
                )}
                
                <div className={isMobile ? 'flex-1' : ''}>
                  <h3 className="font-bold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// 3. STAT_BARS - RPG style power meters
const StatBarsUSP = ({ config }: USPSectionProps) => {
  const features = config.content.features;
  
  const stats = [
    { name: 'QUALITY', value: 95, color: 'from-primary to-primary/70' },
    { name: 'VALUE', value: 88, color: 'from-secondary to-secondary/70' },
    { name: 'SATISFACTION', value: 92, color: 'from-accent to-accent/70' },
  ];
  
  return (
    <section className="section-padding px-6 bg-gradient-to-b from-muted/50 to-background">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl font-bold text-center mb-10"
      >
        Power Stats! ⚡
      </motion.h2>
      
      <div className="max-w-xl mx-auto space-y-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
          >
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold tracking-wider text-foreground">{stat.name}</span>
              <span className="font-mono text-muted-foreground">{stat.value}/100</span>
            </div>
            <div className="h-6 bg-muted rounded-full overflow-hidden border-2 border-border">
              <motion.div
                className={`h-full bg-gradient-to-r ${stat.color} flex items-center justify-end pr-2`}
                initial={{ width: 0 }}
                whileInView={{ width: `${stat.value}%` }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.3, duration: 0.8, type: "spring" }}
              >
                <span className="text-xs font-bold text-primary-foreground drop-shadow">MAX!</span>
              </motion.div>
            </div>
          </motion.div>
        ))}
        
        {/* Features as text badges */}
        <div className="flex flex-wrap gap-3 justify-center pt-6">
          {features.map((feature, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-full font-bold text-sm shadow-lg"
              >
                <span>{feature.title}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// 4. ICONS - Elevated card blocks with pulsing indicators
const IconsUSP = ({ config, isMobile }: USPSectionProps) => {
  const features = config.content.features;
  
  return (
    <section className="section-padding px-6 bg-gradient-to-b from-background to-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <span className="text-xs uppercase tracking-widest text-primary font-semibold">Details Matter</span>
        <h2 className="text-2xl font-light font-serif mt-2">Exquisite Features ✨</h2>
      </motion.div>
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-6'} max-w-4xl mx-auto`}>
        {features.map((feature, index) => {
          const IconComponent = defaultIcons[index % defaultIcons.length];
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-card p-6 border border-border hover:border-primary/50 transition-colors rounded-lg shadow-sm">
                {/* Pulsing dot indicator */}
                <div className="absolute -top-2 -right-2 w-4 h-4">
                  <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-50" />
                  <div className="absolute inset-0 bg-primary rounded-full" />
                </div>
                
                <IconComponent className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-medium text-sm uppercase tracking-wider mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

// 5. CHECKLIST - Technical specs with checkmarks
const ChecklistUSP = ({ config, isMobile }: USPSectionProps) => {
  const features = config.content.features;
  
  const specs = [
    { label: 'Quality', value: 'Premium' },
    { label: 'Support', value: '24/7' },
    { label: 'Shipping', value: 'Fast' },
    { label: 'Returns', value: 'Easy' },
  ];
  
  return (
    <section className="section-padding px-6 bg-gradient-to-b from-muted/50 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <span className="text-xs uppercase tracking-widest text-primary font-semibold">Specs</span>
        <h2 className="text-2xl font-bold mt-2">What's Included 📋</h2>
      </motion.div>
      
      <div className="max-w-2xl mx-auto">
        {/* Specs grid */}
        <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-4 mb-8`}>
          {specs.map((spec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card p-4 rounded-lg border border-border text-center shadow-sm"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{spec.label}</p>
              <p className="font-bold">{spec.value}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Features checklist */}
        <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-primary" />
            Features Included:
          </h3>
          <div className="space-y-3">
            {features.map((feature, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 bg-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{feature.title}</p>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============ MAIN COMPONENT ============

export const USPSection = ({ config, isMobile }: USPSectionProps) => {
  // Use variant from config.layouts.usp
  const variant = config.layouts.usp;

  const props = { config, isMobile };

  // Render based on variant
  switch (variant) {
    case 'badges':
      return <BadgesUSP {...props} />;
    case 'timeline':
      return <TimelineUSP {...props} />;
    case 'statBars':
      return <StatBarsUSP {...props} />;
    case 'icons':
      return <IconsUSP {...props} />;
    case 'checklist':
      return <ChecklistUSP {...props} />;
    default:
      return <BadgesUSP {...props} />;
  }
};
