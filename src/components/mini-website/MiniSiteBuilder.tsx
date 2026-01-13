import { useSiteConfig } from '@/hooks/useSiteConfig';
import { EditorLayout } from './EditorLayout';
import { PreviewMode } from './PreviewMode';

export const MiniSiteBuilder = () => {
  const siteConfig = useSiteConfig();
  const { config } = siteConfig;

  if (config.mode === 'preview') {
    return <PreviewMode siteConfig={siteConfig} />;
  }

  return <EditorLayout siteConfig={siteConfig} />;
};
