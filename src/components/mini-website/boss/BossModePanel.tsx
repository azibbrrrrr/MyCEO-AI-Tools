import type { UseSiteConfigReturn } from '@/hooks/useSiteConfig';
import { EditorSidebarContent } from '../EditorSidebarContent';

interface BossModePanelProps {
  siteConfig: UseSiteConfigReturn;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BossModePanel = ({ siteConfig, activeTab, setActiveTab }: BossModePanelProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
        <p className="text-sm font-semibold text-blue-700">Boss Mode</p>
        <p className="text-xs text-blue-600">Refine layouts, styles, and advanced content.</p>
      </div>
      <EditorSidebarContent
        siteConfig={siteConfig}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};
