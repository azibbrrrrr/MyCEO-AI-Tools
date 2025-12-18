import React from 'react';
import { TOOL_NODES } from '@/constants/mapDashboard.constants';
import MapToolCard from './MapToolCard';
import { Cloud } from 'lucide-react';

const DashboardMap: React.FC = () => {
  // SVG Path Data for the winding road
  // ViewBox assumed roughly 1200 x 800 for Desktop scaling
  // Road goes: Middle Left -> Dip -> Rise Middle -> Dip Right -> End Right
  const roadPath = "M -50 400 C 150 400, 150 600, 350 600 C 550 600, 500 300, 700 350 C 900 400, 950 500, 1300 450";

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-pastel-sky">
      {/* --- Background Landscape Layers --- */}
      
      {/* Distant Hills */}
      <div className="absolute bottom-0 w-full h-[60%] bg-pastel-green-light rounded-t-[50%] scale-x-150 translate-y-20 opacity-80"></div>
      
      {/* Mid Hills */}
      <div className="absolute bottom-0 left-0 w-[120%] h-[50%] bg-pastel-green-med rounded-tr-[100%] rounded-tl-[20%] -translate-x-10"></div>
      <div className="absolute bottom-0 right-0 w-[120%] h-[45%] bg-pastel-green-med rounded-tl-[100%] rounded-tr-[20%] translate-x-10"></div>

      {/* Foreground Hills */}
      <div className="absolute -bottom-20 w-full h-[40%] bg-pastel-green-dark rounded-t-[30%]"></div>

      {/* Decor: Clouds */}
      <Cloud className="absolute top-10 right-40 text-white fill-white opacity-80 w-24 h-24" />
      <Cloud className="absolute top-24 left-20 text-white fill-white opacity-60 w-16 h-16" />
      <Cloud className="absolute top-5 right-[40%] text-white fill-white opacity-40 w-32 h-32" />

      {/* --- The Winding Road (SVG) --- */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 800" preserveAspectRatio="none">
         {/* Road Border/Outline */}
         <path 
           d={roadPath} 
           fill="none" 
           stroke="#C6A87C" 
           strokeWidth="90" 
           strokeLinecap="round"
         />
         {/* Road Surface */}
         <path 
           d={roadPath} 
           fill="none" 
           stroke="#E6CCA0" 
           strokeWidth="80" 
           strokeLinecap="round"
         />
         {/* Road Dashes */}
         <path 
           d={roadPath} 
           fill="none" 
           stroke="white" 
           strokeWidth="4" 
           strokeDasharray="15 25"
           opacity="0.6"
         />
      </svg>

      {/* --- Tool Nodes --- */}
      {/* We overlay the nodes absolutely. The CSS positions in constants.ts need to align with the SVG path visually */}
      <div className="absolute inset-0 w-full h-full">
        {TOOL_NODES.map((node) => (
          <MapToolCard key={node.id} node={node} />
        ))}
      </div>
      
    </div>
  );
};

export default DashboardMap;
