import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';
import type { SiteConfig, UseSiteConfigReturn } from '@/hooks/useSiteConfig';

interface HeroSectionProps {
  config: SiteConfig;
  siteConfig: UseSiteConfigReturn;
  isMobile: boolean;
}

function getButtonClasses(style: SiteConfig['styles']['buttonStyle'], radius: SiteConfig['styles']['cornerRadius']) {
  const base = `px-6 py-3 font-semibold transition-all ${radius}`;
  if (style === 'solid') return `${base} bg-primary text-primary-foreground hover:opacity-90`;
  if (style === 'outline') return `${base} border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground`;
  return `${base} bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:-translate-y-1 hover:shadow-xl`;
}

// Split variant
const SplitHero = ({ config, isMobile }: HeroSectionProps) => {
  const buttonClasses = getButtonClasses(config.styles.buttonStyle, config.styles.cornerRadius);
  return (
    <section className={`section-padding px-6 ${isMobile ? '' : 'flex items-center gap-12'} max-w-6xl mx-auto`}>
      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className={`flex-1 ${isMobile ? 'text-center mb-8' : ''}`}>
        <h1 className={`text-4xl ${isMobile ? '' : 'md:text-5xl'} font-bold mb-4`}>{config.content.heroHeading}</h1>
        <p className="text-lg text-muted-foreground mb-6">{config.content.heroSubheading}</p>
        <button className={buttonClasses}>Get Started</button>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
        {config.content.heroImage ? (
          <img src={config.content.heroImage} alt="Hero" className={`w-full aspect-square object-cover ${config.styles.cornerRadius}`} />
        ) : (
          <div className={`w-full aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 ${config.styles.cornerRadius} flex items-center justify-center`}>
            <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}
      </motion.div>
    </section>
  );
};

// Poster variant
const PosterHero = ({ config, isMobile }: HeroSectionProps) => {
  const buttonClasses = getButtonClasses(config.styles.buttonStyle, config.styles.cornerRadius);
  return (
    <section className="relative min-h-[450px] flex items-center justify-center" style={{ backgroundImage: config.content.heroImage ? `url(${config.content.heroImage})` : 'linear-gradient(135deg, hsl(var(--primary)/0.3), hsl(var(--secondary)/0.3))', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black/50" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-center text-white px-6 max-w-2xl">
        <h1 className={`text-4xl ${isMobile ? '' : 'md:text-6xl'} font-bold mb-4 drop-shadow-lg`}>{config.content.heroHeading}</h1>
        <p className={`text-xl ${isMobile ? '' : 'md:text-2xl'} mb-8 opacity-90`}>{config.content.heroSubheading}</p>
        <button className={`${buttonClasses} bg-white text-foreground hover:bg-white/90`}>Learn More</button>
      </motion.div>
    </section>
  );
};

// Minimal variant
const MinimalHero = ({ config, isMobile }: HeroSectionProps) => {
  const buttonClasses = getButtonClasses(config.styles.buttonStyle, config.styles.cornerRadius);
  return (
    <section className="section-padding px-6 text-center max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={`text-4xl ${isMobile ? '' : 'md:text-5xl'} font-bold mb-4`}>{config.content.heroHeading}</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">{config.content.heroSubheading}</p>
        <button className={buttonClasses}>Get Started</button>
        {config.content.heroImage && (
          <motion.img initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} src={config.content.heroImage} alt="Hero" className={`w-full max-w-md mx-auto mt-12 ${config.styles.cornerRadius}`} />
        )}
      </motion.div>
    </section>
  );
};

// Cinematic variant
const CinematicHero = ({ config, isMobile }: HeroSectionProps) => {
  const buttonClasses = getButtonClasses(config.styles.buttonStyle, config.styles.cornerRadius);
  return (
    <section className="relative min-h-[550px] flex items-end" style={{ backgroundImage: config.content.heroImage ? `url(${config.content.heroImage})` : 'linear-gradient(135deg, hsl(var(--primary)/0.4), hsl(var(--secondary)/0.4))', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 px-6 pb-16 pt-32 w-full max-w-4xl mx-auto text-white">
        <span className="text-sm uppercase tracking-widest opacity-70 mb-2 block">Featured</span>
        <h1 className={`text-4xl ${isMobile ? '' : 'md:text-6xl'} font-bold mb-4`}>{config.content.heroHeading}</h1>
        <p className="text-xl opacity-90 mb-8 max-w-xl">{config.content.heroSubheading}</p>
        <button className={`${buttonClasses} bg-white text-foreground hover:bg-white/90`}>Explore Now</button>
      </motion.div>
    </section>
  );
};

// Before/After variant
const BeforeAfterHero = ({ config, isMobile }: HeroSectionProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const buttonClasses = getButtonClasses(config.styles.buttonStyle, config.styles.cornerRadius);
  
  return (
    <section className="section-padding px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className={`text-3xl ${isMobile ? '' : 'md:text-5xl'} font-bold mb-4`}>{config.content.heroHeading}</h1>
          <p className="text-lg text-muted-foreground">{config.content.heroSubheading}</p>
        </motion.div>
        
        {isMobile ? (
          <div className="space-y-4">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-300 flex items-center justify-center">
              {config.content.heroBeforeImage ? <img src={config.content.heroBeforeImage} alt="Before" className="w-full h-full object-cover" /> : <span className="text-muted-foreground">Before</span>}
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-green-200 flex items-center justify-center">
              {config.content.heroImage ? <img src={config.content.heroImage} alt="After" className="w-full h-full object-cover" /> : <span className="text-muted-foreground">After</span>}
            </div>
          </div>
        ) : (
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-slate-300 flex items-center justify-center">
              {config.content.heroBeforeImage ? <img src={config.content.heroBeforeImage} alt="Before" className="w-full h-full object-cover" /> : <span className="text-4xl text-muted-foreground">Before</span>}
              <span className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 text-sm rounded">BEFORE</span>
            </div>
            <div className="absolute inset-0 bg-green-200 flex items-center justify-center" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
              {config.content.heroImage ? <img src={config.content.heroImage} alt="After" className="w-full h-full object-cover" /> : <span className="text-4xl text-muted-foreground">After</span>}
              <span className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 text-sm rounded font-bold">AFTER</span>
            </div>
            <div className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-lg" style={{ left: `${sliderPosition}%` }}>
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                <span className="text-xs">↔</span>
              </div>
            </div>
            <input type="range" min="0" max="100" value={sliderPosition} onChange={(e) => setSliderPosition(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize" />
          </div>
        )}
        
        <div className="text-center mt-8">
          <button className={buttonClasses}>See the Difference</button>
        </div>
      </div>
    </section>
  );
};

export const HeroSection = ({ config, siteConfig, isMobile }: HeroSectionProps) => {
  const variant = config.layouts.hero;
  const props = { config, siteConfig, isMobile };

  switch (variant) {
    case 'split': return <SplitHero {...props} />;
    case 'poster': return <PosterHero {...props} />;
    case 'minimal': return <MinimalHero {...props} />;
    case 'cinematic': return <CinematicHero {...props} />;
    case 'beforeAfter': return <BeforeAfterHero {...props} />;
    default: return <SplitHero {...props} />;
  }
};
