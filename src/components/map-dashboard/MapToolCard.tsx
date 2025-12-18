import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Star, Award, Lightbulb, Package, PenTool, Store, Calculator, Sparkles } from 'lucide-react';
import { ToolNode } from '@/types/mapDashboard.types';

interface MapToolCardProps {
  node: ToolNode;
}

const MapToolCard: React.FC<MapToolCardProps> = ({ node }) => {
  const isLocked = node.status === 'locked';
  const navigate = useNavigate();

  // Navigation mapping
  const handleCardClick = () => {
    if (isLocked) return;
    
    switch (node.iconType) {
      case 'idea': navigate('/product-idea'); break;
      case 'package': navigate('/packaging-idea'); break;
      case 'logo': navigate('/logo-maker'); break;
      case 'booth': navigate('/booth-ready'); break;
      case 'calc': navigate('/calculator'); break;
      default: break;
    }
  };

  const getIconPath = () => {
    switch (node.iconType) {
      case 'idea': return '/assets/stickers/idea.png';
      case 'package': return '/assets/stickers/package.png';
      case 'logo': return '/assets/stickers/logo.png';
      case 'booth': return '/assets/stickers/booth.png';
      case 'calc': return '/assets/stickers/calc.png';
      default: return '/assets/stickers/idea.png';
    }
  };

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 group select-none"
      style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}
    >
      {/* Tooltip for Locked Items */}
      {isLocked && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-16 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg w-40 text-center shadow-lg pointer-events-none z-20">
          {node.requiredTask}
          <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-800 rotate-45"></div>
        </div>
      )}

      {/* Main Sticker Container */}
      <div 
        onClick={handleCardClick}
        className={`
          relative w-32 h-32 flex items-center justify-center
          transition-transform hover:scale-110 active:scale-95 cursor-pointer
          ${isLocked ? 'grayscale-[0.5] opacity-90' : ''}
        `}
      >
        {/* The Sticker Asset */}
        <div className="relative w-28 h-28 group-hover:drop-shadow-sticker transition-all">
          <img 
            src={getIconPath()} 
            alt={node.title}
            className="w-full h-full object-contain"
          />
          
          {/* Lock Overlay (Bottom Right of Icon) */}
          {isLocked && (
            <div className="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow-md border-2 border-gray-100 animate-bounce-in">
              <Lock size={16} className="text-gray-500" fill="currentColor" />
            </div>
          )}

          {/* AI Hint Bubble / Badges can also be placed relative to this */}
          {node.hint && (
            <div className="absolute -right-4 -top-2 z-30 animate-bounce">
               <div className="bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-1 rounded-full shadow-md border-2 border-white flex items-center gap-1">
                 <Sparkles size={10} />
                 {node.hint}
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Rating Stars (Below Icon) */}
      {!isLocked && (
        <div className="flex gap-0.5 mt-[-10px] mb-1 z-20 animate-pop-in">
           {[...Array(3)].map((_, i) => (
             <Star
               key={i}
               size={14}
               className={i < node.stars ? "fill-yellow-400 text-yellow-500 drop-shadow-sm" : "fill-gray-200 text-gray-300"}
             />
           ))}
        </div>
      )}

      {/* Title (Text Label Below) */}
      <h3 className={`
        text-[13px] font-black text-gray-800 text-center mt-1 px-2 py-0.5 rounded-lg
        ${isLocked ? 'text-gray-500' : 'text-gray-800'}
      `} style={{ textShadow: '0 2px 0 white' }}>
        {node.title}
      </h3>
    </div>
  );
};

export default MapToolCard;
