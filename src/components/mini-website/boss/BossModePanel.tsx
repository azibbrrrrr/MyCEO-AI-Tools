import type { UseSiteConfigReturn } from '@/hooks/useSiteConfig';
import { EditorSidebarContent } from '../EditorSidebarContent';

interface BossModePanelProps {
  siteConfig: UseSiteConfigReturn;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BossModePanel = ({ siteConfig, activeTab, setActiveTab }: BossModePanelProps) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="shrink-0">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
          <p className="text-sm font-semibold text-blue-700">Boss Mode</p>
          <p className="text-xs text-blue-600">Refine layouts, styles, and advanced content.</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto min-h-0 pr-1 -mr-1">
         <EditorSidebarContent
            siteConfig={siteConfig}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
      </div>

      <div className="shrink-0 pt-4 border-t border-slate-200 mt-auto bg-white">
        <button
          onClick={() => siteConfig.toggleBossMode()}
          className="w-full py-2 px-4 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium"
        >
          Back to Wizard
        </button>
      </div>
    </div>
  );
};
