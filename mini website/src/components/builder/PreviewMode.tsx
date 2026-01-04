import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import type { UseSiteConfigReturn } from '@/hooks/useSiteConfig';
import { SitePreview } from './preview/SitePreview';

interface PreviewModeProps {
  siteConfig: UseSiteConfigReturn;
}

export const PreviewMode = ({ siteConfig }: PreviewModeProps) => {
  const { config, setMode } = siteConfig;

  return (
    <div className={`min-h-screen palette-${config.styles.palette}`}>
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setMode('editor')}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-background/90 backdrop-blur-sm text-foreground px-4 py-2 rounded-full shadow-lg hover:bg-background transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Editor
      </motion.button>

      <SitePreview config={config} siteConfig={siteConfig} isMobile={false} />
    </div>
  );
};
