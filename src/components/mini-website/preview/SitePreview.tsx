import { motion } from 'framer-motion';
import type { SiteConfig, UseSiteConfigReturn } from '@/hooks/useSiteConfig';
import { HeroSection } from '../sections/HeroSection';
import { USPSection } from '../sections/USPSection';
import { SocialProofSection } from '../sections/SocialProofSection';
import { ProductSection } from '../sections/ProductSection';
import { ScarcityBar } from '../sections/ScarcityBar';
import { CTASection } from '../sections/CTASection';

interface SitePreviewProps {
  config: SiteConfig;
  siteConfig: UseSiteConfigReturn;
  isMobile: boolean;
}

export const SitePreview = ({ config, siteConfig, isMobile }: SitePreviewProps) => {
  return (
    <div className="bg-background text-foreground overflow-hidden min-h-full">
      <motion.div
        layout
        className="transition-all duration-300 section-gap flex flex-col"
      >
        {/* Hero Section */}
        <HeroSection 
          config={config} 
          siteConfig={siteConfig} 
          isMobile={isMobile} 
        />

        {/* USP/Features Section */}
        <USPSection config={config} isMobile={isMobile} />

        {/* Social Proof Section */}
        <SocialProofSection config={config} isMobile={isMobile} />

        {/* Product Section */}
        <ProductSection config={config} isMobile={isMobile} />

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
