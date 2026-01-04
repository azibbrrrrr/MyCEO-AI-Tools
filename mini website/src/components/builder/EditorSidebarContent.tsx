import {
  Layout,
  Palette,
  FileText,
  Sticker,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { UseSiteConfigReturn } from '@/hooks/useSiteConfig';
import { LayoutsTab } from './tabs/LayoutsTab';
import { StylesTab } from './tabs/StylesTab';
import { ContentTab } from './tabs/ContentTab';
import { StickersTab } from './tabs/StickersTab';

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
      <TabsList className="grid grid-cols-4 m-3 shrink-0">
        <TabsTrigger value="layouts" className="flex flex-col gap-1 py-2">
          <Layout className="w-4 h-4" />
          <span className="text-xs hidden sm:inline">Layouts</span>
        </TabsTrigger>
        <TabsTrigger value="styles" className="flex flex-col gap-1 py-2">
          <Palette className="w-4 h-4" />
          <span className="text-xs hidden sm:inline">Styles</span>
        </TabsTrigger>
        <TabsTrigger value="content" className="flex flex-col gap-1 py-2">
          <FileText className="w-4 h-4" />
          <span className="text-xs hidden sm:inline">Content</span>
        </TabsTrigger>
        <TabsTrigger value="stickers" className="flex flex-col gap-1 py-2">
          <Sticker className="w-4 h-4" />
          <span className="text-xs hidden sm:inline">Stickers</span>
        </TabsTrigger>
      </TabsList>

      <ScrollArea className="flex-1 p-3">
        <TabsContent value="layouts" className="m-0 h-full">
          <LayoutsTab siteConfig={siteConfig} />
        </TabsContent>
        <TabsContent value="styles" className="m-0 h-full">
          <StylesTab siteConfig={siteConfig} />
        </TabsContent>
        <TabsContent value="content" className="m-0 h-full">
          <ContentTab siteConfig={siteConfig} />
        </TabsContent>
        <TabsContent value="stickers" className="m-0 h-full">
          <StickersTab siteConfig={siteConfig} />
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
};
