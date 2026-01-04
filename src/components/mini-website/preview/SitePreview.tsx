import { motion } from 'framer-motion';
import type { SiteConfig } from '@/hooks/useSiteConfig';
import { HeroSection } from '../sections/HeroSection';
import { USPSection } from '../sections/USPSection';
import { SocialProofSection } from '../sections/SocialProofSection';
import { OfferSection } from '../sections/OfferSection';
import { ScarcityBar } from '../sections/ScarcityBar';
import { CTASection } from '../sections/CTASection';

interface SitePreviewProps {
  config: SiteConfig;
  isMobile: boolean;
}

export const SitePreview = ({ config, isMobile }: SitePreviewProps) => {
  const paletteClass = `palette-${config.styles.palette}`;

  return (
    <div className={`${paletteClass} overflow-hidden bg-white`}>
      <motion.div
        layout
        className="transition-all duration-300"
      >
        {/* Hero Section */}
        <HeroSection 
          config={config} 
          isMobile={isMobile} 
        />

        {/* USP/Features Section */}
        <USPSection config={config} isMobile={isMobile} />

        {/* Social Proof Section */}
        <SocialProofSection config={config} isMobile={isMobile} />

        {/* Offer Section */}
        <OfferSection config={config} isMobile={isMobile} />

        {/* Scarcity Bar */}
        {config.content.scarcityEnabled && (
          <ScarcityBar config={config} />
        )}

        {/* CTA Section */}
        <CTASection config={config} />
      </motion.div>
    </div>
  );
};
