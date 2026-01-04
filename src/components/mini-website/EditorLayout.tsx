import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Monitor,
  Smartphone,
  Eye,
  Zap,
  ChevronUp,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { UseSiteConfigReturn } from '@/hooks/useSiteConfig';
import { SitePreview } from './preview/SitePreview';
import { MarketingCoachWidget } from './MarketingCoachWidget';
import { EditorSidebarContent } from './EditorSidebarContent';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useLanguage } from '@/components/language-provider';
import { LanguageToggle } from '@/components/language-toggle';

interface EditorLayoutProps {
  siteConfig: UseSiteConfigReturn;
}

export const EditorLayout = ({ siteConfig }: EditorLayoutProps) => {
  const { config, setMode, toggleBossMode } = siteConfig;
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState('layouts');
  const isMobile = useIsMobile();
  const { t, language } = useLanguage();

  // Auto-switch to mobile view on mobile devices
  if (isMobile && deviceView !== 'mobile') {
    setDeviceView('mobile');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Standard Navbar - same as other tools */}
      <header className="relative z-10 flex items-center justify-between p-4 md:p-6 bg-white/50 backdrop-blur-sm border-b border-[var(--border-light)] shrink-0">
        <button
          onClick={() => setMode('selection')}
          className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200 hover:shadow-md transition-all"
        >
          <span>←</span>
          <span className="font-semibold text-gray-700 text-sm">{language === 'EN' ? 'Back' : 'Kembali'}</span>
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌐</span>
          <span className="font-bold text-[var(--text-primary)] hidden sm:block">{t("tool.miniWebsite")}</span>
        </div>
        
        <LanguageToggle />
      </header>

      {/* Tool Bar - device toggle, boss mode, preview */}
      <div className="bg-card border-b px-4 py-2 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-4">
          {!isMobile && (
            <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
              <button
                onClick={() => setDeviceView('desktop')}
                className={`p-2 rounded-md transition-colors ${
                  deviceView === 'desktop'
                    ? 'bg-background text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceView('mobile')}
                className={`p-2 rounded-md transition-colors ${
                  deviceView === 'mobile'
                    ? 'bg-background text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="boss-mode"
              checked={config.bossMode}
              onCheckedChange={toggleBossMode}
            />
            <Label htmlFor="boss-mode" className="flex items-center gap-1 text-sm cursor-pointer">
              <Zap className="w-4 h-4 text-accent" />
              <span className="hidden sm:inline">{language === 'EN' ? 'Boss Mode' : 'Mod Boss'}</span>
            </Label>
          </div>

          <button
            onClick={() => setMode('preview')}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'EN' ? 'Preview' : 'Pratonton'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row relative">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-full md:w-80 lg:w-96 bg-card border-r overflow-y-auto shrink-0"
          >
            <EditorSidebarContent
              siteConfig={siteConfig}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </motion.aside>
        )}

        {/* Mobile Edit Drawer */}
        {isMobile && (
          <Drawer>
            <DrawerTrigger asChild>
              <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-transparent pointer-events-none">
                <button className="w-full bg-primary text-primary-foreground p-4 rounded-xl shadow-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 font-bold pointer-events-auto">
                  <ChevronUp className="w-5 h-5" />
                  {language === 'EN' ? 'Edit Content' : 'Edit Kandungan'}
                </button>
              </div>
            </DrawerTrigger>
            <DrawerContent className="h-[80vh] flex flex-col">
              <div className="p-4 flex-1 min-h-0 overflow-hidden">
                <EditorSidebarContent
                  siteConfig={siteConfig}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>
            </DrawerContent>
          </Drawer>
        )}

        {/* Preview Panel */}
        <main className={`flex-1 overflow-auto bg-gray-50 flex items-start justify-center ${isMobile ? 'p-0' : 'p-4 md:p-6'}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`transition-all duration-300 ${
              isMobile 
                ? 'w-full h-full min-h-screen bg-background' 
                : `bg-background rounded-xl shadow-2xl ${
                    deviceView === 'mobile' ? 'w-[375px] min-h-[667px] overflow-hidden' : 'w-full max-w-5xl min-h-[600px]'
                  }`
            }`}
          >
            <SitePreview config={config} isMobile={isMobile || deviceView === 'mobile'} />
          </motion.div>
        </main>
      </div>

      {/* Marketing Coach Widget */}
      <MarketingCoachWidget config={config} isMobile={isMobile} />
    </div>
  );
};
