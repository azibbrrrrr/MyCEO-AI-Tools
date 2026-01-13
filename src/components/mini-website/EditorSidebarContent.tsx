import { Layout, Palette, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { UseSiteConfigReturn } from '@/hooks/useSiteConfig';
import { LayoutsTab } from './tabs/LayoutsTab';
import { StylesTab } from './tabs/StylesTab';
import { ContentTab } from './tabs/ContentTab';

interface EditorSidebarContentProps {
  siteConfig: UseSiteConfigReturn;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const EditorSidebarContent = ({
  siteConfig,
  activeTab,
  setActiveTab,
}: EditorSidebarContentProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
      <TabsList className="bg-transparent w-full flex items-center justify-between p-1 gap-2 mb-2">
        <TabsTrigger 
          value="layouts" 
          className="flex-1 rounded-full data-[state=active]:bg-sky-100 data-[state=active]:text-sky-700 data-[state=active]:shadow-none border border-transparent data-[state=active]:border-sky-200 py-2"
        >
          <div className="flex items-center justify-center gap-2">
            <Layout className="w-4 h-4" />
            <span className="text-xs font-medium hidden sm:inline">Layouts</span>
          </div>
        </TabsTrigger>
        <TabsTrigger 
          value="styles" 
          className="flex-1 rounded-full data-[state=active]:bg-sky-100 data-[state=active]:text-sky-700 data-[state=active]:shadow-none border border-transparent data-[state=active]:border-sky-200 py-2"
        >
          <div className="flex items-center justify-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="text-xs font-medium hidden sm:inline">Styles</span>
          </div>
        </TabsTrigger>
        <TabsTrigger 
          value="content" 
          className="flex-1 rounded-full data-[state=active]:bg-sky-100 data-[state=active]:text-sky-700 data-[state=active]:shadow-none border border-transparent data-[state=active]:border-sky-200 py-2"
        >
          <div className="flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="text-xs font-medium hidden sm:inline">Content</span>
          </div>
        </TabsTrigger>
      </TabsList>

      <div className="flex-1 overflow-y-auto p-3">
        <TabsContent value="layouts" className="m-0">
          <LayoutsTab siteConfig={siteConfig} />
        </TabsContent>
        <TabsContent value="styles" className="m-0">
          <StylesTab siteConfig={siteConfig} />
        </TabsContent>
        <TabsContent value="content" className="m-0">
          <ContentTab siteConfig={siteConfig} />
        </TabsContent>
      </div>
    </Tabs>
  );
};
