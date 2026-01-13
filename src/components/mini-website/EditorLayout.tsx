import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Monitor,
  Smartphone,
  Eye,
  ChevronUp,
  Save,
  Globe,
  Loader2,
  Check,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink } from 'lucide-react'; 

import type { UseSiteConfigReturn, SiteConfig } from '@/hooks/useSiteConfig';
import { SitePreview } from './preview/SitePreview';
import { MarketingCoachWidget } from './MarketingCoachWidget';
import { EditorSidebarContent } from './EditorSidebarContent';
import { useChildSession } from '@/hooks/useChildSession'; 
import { saveWebsite, publishWebsite, getWebsite } from '@/lib/supabase/mini-website'; 
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useLanguage } from '@/components/language-provider';
import { LanguageToggle } from '@/components/language-toggle';
import { Skeleton } from "@/components/ui/skeleton";

interface EditorLayoutProps {
  siteConfig: UseSiteConfigReturn;
}

export const EditorLayout = ({ siteConfig }: EditorLayoutProps) => {
  const { config, setMode } = siteConfig;
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState('layouts');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  // Track the config that is currently in the DB to determine if there are changes
  const [savedConfig, setSavedConfig] = useState<SiteConfig | null>(null);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Default to true to show skeleton immediately
  
  // Publish Modal State
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [slugInput, setSlugInput] = useState('');
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const { child } = useChildSession();
  const isMobile = useIsMobile();
  const { t, language } = useLanguage();

  // Check for unsaved changes
  const hasUnsavedChanges = savedConfig 
    ? JSON.stringify(config) !== JSON.stringify(savedConfig) 
    : false; 

  // Load website data on mount
  useEffect(() => {
    const loadSavedSite = async () => {
        if (!child?.id) {
            setIsLoading(false);
            return;
        }
        
        try {
            const savedSite = await getWebsite(child.id);
            if (savedSite && savedSite.data) {
                const loadedConfig = savedSite.data as unknown as SiteConfig;
                siteConfig.setConfig(loadedConfig);
                setSavedConfig(loadedConfig); 
                setLastSaved(new Date(savedSite.updated_at));
                if (savedSite.url_slug) {
                    setSavedSlug(savedSite.url_slug);
                }
            } else {
                setSavedConfig(config);
            }
        } catch (error) {
            console.error("Failed to load site:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (child?.id) {
        loadSavedSite();
    } else {
        // If child ID isn't immediately available but might be coming, we might want to wait?
        // But for now, if no child, we just stop loading so they see the empty/default editor.
        // Actually, child session might take a moment. 
        // If child is undefined, useChildSession might still be loading.
        // Let's rely on the session hook's loading state if available, but here we just check ID.
        // If ID is missing, we might render default.
        // Let's set timeout just in case simple render passes.
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }
  }, [child?.id, siteConfig.setConfig]); 

  // Auto-switch to mobile view on mobile devices
  if (isMobile && deviceView !== 'mobile') {
    setDeviceView('mobile');
  }

  const handleSave = async () => {
    if (!child?.id) {
        alert("You must be logged in to save.");
        return;
    }
    setIsSaving(true);
    const result = await saveWebsite(child.id, config);
    setIsSaving(false);
    if (result) {
        setLastSaved(new Date());
        setSavedConfig(config); // Update baseline
    } else {
        alert("Failed to save website. Please try again.");
    }
  };

  const handleOpenPublishModal = () => {
    if (!child?.id) {
        alert("You must be logged in to publish.");
        return;
    }
    // Pre-fill slug if available or from company name
    const currentSlug = savedSlug || child.companies?.[0]?.company_name?.toLowerCase().replace(/\s+/g, '-') || 'my-store';
    setSlugInput(currentSlug);
    setIsPublishModalOpen(true);
  };

  const handleConfirmPublish = async () => {
    if (!slugInput.trim()) return;
    
    setIsPublishing(true);

    // FIRST: Save the current state
    const saved = await saveWebsite(child!.id, config);
    if (!saved) {
        setIsPublishing(false);
        alert("Failed to save before publishing.");
        return;
    }
    setLastSaved(new Date());
    setSavedConfig(config);

    // SECOND: Publish
    const result = await publishWebsite(saved.id, slugInput);
    setIsPublishing(false);

    if (result.success) {
        const url = `${window.location.origin}/site/${slugInput}`;
        setPublishedUrl(url);
        // Note: We keep the modal open to show the success state
    } else {
        alert(`Failed to publish: ${result.error}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header Skeleton */}
        <header className="sticky top-0 z-40 h-20 flex items-center justify-between p-4 md:p-6 bg-white/80 border-b shrink-0">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-8 w-48 hidden sm:block" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </header>

        <div className="flex flex-1 relative items-start">
          {/* Sidebar Skeleton */}
          {!isMobile && (
            <aside className="sticky top-20 h-[calc(100vh-5rem)] w-full md:w-80 lg:w-96 bg-card border-r shrink-0 hidden md:block p-4 space-y-4">
               <Skeleton className="h-10 w-full" />
               <div className="space-y-2">
                 <Skeleton className="h-24 w-full" />
                 <Skeleton className="h-24 w-full" />
                 <Skeleton className="h-24 w-full" />
               </div>
            </aside>
          )}

          {/* Main Content Skeleton */}
          <main className="flex-1 flex flex-col min-w-0">
             {/* Toolbar Skeleton */}
             <div className="h-16 border-b px-6 py-3 flex items-center justify-between sticky top-20 bg-white/50">
                <Skeleton className="h-9 w-24 rounded-full" />
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-24 rounded-full" />
                    <Skeleton className="h-9 w-24 rounded-full" />
                </div>
             </div>
             
             {/* Preview Skeleton */}
             <div className="flex-1 p-6 flex items-start justify-center">
                <Skeleton className="w-full max-w-5xl h-[600px] rounded-xl" />
             </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Standard Navbar - same as other tools */}
      <header className="sticky top-0 z-40 h-20 flex items-center justify-between p-4 md:p-6 bg-white/80 backdrop-blur-sm border-b border-[var(--border-light)] shrink-0">
        <div className="flex items-center gap-4 z-20">
          <Link
            to="/"
            className="px-4 py-2 bg-white rounded-full shadow-[var(--shadow-low)] hover:shadow-[var(--shadow-medium)] transition-shadow text-[var(--text-secondary)] font-semibold flex items-center gap-2"
          >
            <span>←</span> {t("common.back")}
          </Link>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
          <span className="text-2xl">🌐</span>
          <span className="font-bold text-[var(--text-primary)] hidden sm:block">{t("tool.miniWebsite")}</span>
        </div>
        
        <div className="z-20">
          <LanguageToggle />
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 relative items-start">
        {/* Desktop Sidebar - Sticky */}
        {!isMobile && (
          <aside className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto no-scrollbar w-full md:w-80 lg:w-96 bg-card border-r shrink-0 hidden md:block z-20">
            <EditorSidebarContent
              siteConfig={siteConfig}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </aside>
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
            <DrawerContent className="h-[80vh] flex flex-col bg-white">
              <div className="p-4 flex-1 min-h-0 overflow-y-auto">
                <EditorSidebarContent
                  siteConfig={siteConfig}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>
            </DrawerContent>
          </Drawer>
        )}

        {/* Main Content Pane (Preview & Toolbar) */}
        <main className="flex-1 flex flex-col min-w-0">
            {/* Tool Bar - Stuck to top of Main Pane */}
            <div className="bg-white/50 backdrop-blur-sm border-b px-6 py-3 flex items-center justify-between z-10 sticky top-20">
                <div className="flex items-center gap-4">
                {!isMobile && (
                    <div className="flex items-center p-1 bg-slate-100/80 border border-slate-200/50 rounded-full">
                    <button
                        onClick={() => setDeviceView('desktop')}
                        className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${
                        deviceView === 'desktop'
                            ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200/50 scale-100'
                            : 'text-slate-400 hover:text-slate-600 scale-95 hover:scale-100'
                        }`}
                        title={t("common.desktop")}
                    >
                        <Monitor className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setDeviceView('mobile')}
                        className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${
                        deviceView === 'mobile'
                            ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200/50 scale-100'
                            : 'text-slate-400 hover:text-slate-600 scale-95 hover:scale-100'
                        }`}
                        title={t("common.mobile")}
                    >
                        <Smartphone className="w-4 h-4" />
                    </button>
                    </div>
                )}
                </div>

                <div className="flex items-center gap-3">
                {/* Save & Publish Group */}
                <div className="flex items-center p-1.5 bg-white border border-slate-200/60 rounded-full shadow-sm gap-2">
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !hasUnsavedChanges}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                            ${hasUnsavedChanges 
                                ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-inner' 
                                : 'text-slate-400 cursor-default bg-transparent'}
                        `}
                        title={hasUnsavedChanges ? "Save your changes" : "All changes saved"}
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : !hasUnsavedChanges ? (
                            <Check className="w-4 h-4" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        <span>
                            {isSaving 
                                ? (language === 'EN' ? 'Saving...' : 'Menyimpan...') 
                                : !hasUnsavedChanges
                                    ? (language === 'EN' ? `Saved ${lastSaved ? '' : ''}` : 'Disimpan') // Just referencing lastSaved to keep TS happy, or we can format it
                                    : (language === 'EN' ? 'Save' : 'Simpan')
                            }
                        </span>
                    </button>
                    
                    <div className="w-px h-5 bg-slate-200" />

                    <button
                        onClick={handleOpenPublishModal}
                        disabled={isPublishing}
                        className={`
                            flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200
                            ${isPublishing 
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm'}
                        `}
                    >
                        {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                        <span>
                            {isPublishing ? (language === 'EN' ? 'Publishing...' : 'Menerbitkan...') : (language === 'EN' ? 'Publish' : 'Terbitkan')}
                        </span>
                    </button>
                </div>

                <div className="w-px h-8 bg-slate-200 mx-1" />

                <button
                    onClick={() => setMode('preview')}
                    className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full font-medium shadow-md hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all duration-200"
                >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">{language === 'EN' ? 'Preview' : 'Pratonton'}</span>
                </button>
                </div>
            </div>

            {/* Preview Area */}
            <div className={`flex items-start justify-center ${isMobile ? 'p-0' : 'p-4 md:p-6'}`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`palette-${config.styles.palette} font-style-${config.styles.fontPair} spacing-${config.styles.spacingDensity} transition-all duration-300 ${
                    isMobile 
                        ? 'w-full h-full min-h-screen bg-background text-foreground' 
                        : `bg-background text-foreground rounded-xl shadow-2xl ${
                            deviceView === 'mobile' ? 'w-[375px] min-h-[667px] overflow-hidden' : 'w-full max-w-5xl min-h-[600px]'
                        }`
                    }`}
                >
                    <SitePreview config={config} siteConfig={siteConfig} isMobile={isMobile || deviceView === 'mobile'} />
                </motion.div>
            </div>
        </main>
      </div>

      {/* Marketing Coach Widget */}
      <MarketingCoachWidget config={config} isMobile={isMobile} />

      {/* Publish Modal */}
      <Dialog open={isPublishModalOpen} onOpenChange={setIsPublishModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          {publishedUrl ? (
            <>
              <DialogHeader>
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <DialogTitle className="text-center text-xl">Website Published!</DialogTitle>
                <DialogDescription className="text-center">
                  Your website is now live on the internet.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="p-3 bg-muted rounded-md text-sm text-center break-all font-mono select-all cursor-pointer hover:bg-muted/80" onClick={() => navigator.clipboard.writeText(publishedUrl)}>
                  {publishedUrl}
                </div>
              </div>
              <DialogFooter className="sm:justify-center flex-col sm:flex-row gap-2">
                <a 
                  href={publishedUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Site
                </a>
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Close
                </button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Publish Website</DialogTitle>
                <DialogDescription>
                  Choose a unique web address (slug) for your website.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2 py-4">
                <div className="grid flex-1 gap-2">
                  <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                    <span className="text-muted-foreground text-sm shrink-0">{window.location.host}/site/</span>
                    <input 
                      type="text" 
                      className="flex-1 bg-transparent border-none focus:outline-none p-0 text-sm font-medium"
                      placeholder="my-store"
                      value={slugInput}
                      onChange={(e) => setSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Only lowercase letters, numbers, and hyphens allowed.
                  </p>
                </div>
              </div>
              <DialogFooter className="sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mr-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPublish}
                  disabled={!slugInput.trim() || isPublishing}
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                  Publish Now
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
