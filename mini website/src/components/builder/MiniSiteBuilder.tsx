import { useSiteConfig } from '@/hooks/useSiteConfig';
import { SelectionScreen } from './SelectionScreen';
import { EditorLayout } from './EditorLayout';
import { PreviewMode } from './PreviewMode';

export const MiniSiteBuilder = () => {
  const siteConfig = useSiteConfig();
  const { config } = siteConfig;

  if (config.mode === 'selection') {
    return (
      <SelectionScreen
        onSelect={(type) => {
          siteConfig.setBusinessType(type);
          siteConfig.setMode('editor');
        }}
      />
    );
  }

  if (config.mode === 'preview') {
    return <PreviewMode siteConfig={siteConfig} />;
  }

  return <EditorLayout siteConfig={siteConfig} />;
};
