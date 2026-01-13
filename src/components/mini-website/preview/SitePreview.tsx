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
        <div id="preview-hero" className="scroll-mt-4">
          <HeroSection 
            config={config} 
            siteConfig={siteConfig} 
            isMobile={isMobile} 
          />
        </div>

        {/* USP/Features Section */}
        <div id="preview-usp" className="scroll-mt-4">
           <USPSection config={config} isMobile={isMobile} />
        </div>

        {/* Social Proof Section */}
        <div id="preview-social-proof" className="scroll-mt-4">
           <SocialProofSection config={config} isMobile={isMobile} />
        </div>

        {/* Product Section */}
        <div id="preview-product" className="scroll-mt-4">
           <ProductSection config={config} isMobile={isMobile} />
        </div>

        {/* Scarcity Bar */}
        {config.content.scarcityEnabled && (
          <div id="preview-scarcity" className="scroll-mt-4">
            <ScarcityBar config={config} />
          </div>
        )}

        {/* CTA Section */}
        <div id="preview-cta" className="scroll-mt-4">
           <CTASection config={config} />
        </div>
      </motion.div>
    </div>
  );
};
