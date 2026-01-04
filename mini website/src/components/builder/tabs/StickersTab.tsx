import { motion } from 'framer-motion';
import { 
  Award, 
  BadgeCheck, 
  Hand, 
  Clock, 
  Sparkles, 
  Star, 
  Heart,
  Zap,
  Info
} from 'lucide-react';
import type { UseSiteConfigReturn, Sticker } from '@/hooks/useSiteConfig';

interface StickersTabProps {
  siteConfig: UseSiteConfigReturn;
}

const stickerTypes: {
  type: Sticker['type'];
  label: string;
  icon: typeof Award;
  color: string;
}[] = [
  { type: 'best-seller', label: 'Best Seller', icon: Award, color: 'bg-yellow-500' },
  { type: 'halal', label: 'Halal', icon: BadgeCheck, color: 'bg-green-500' },
  { type: 'handmade', label: 'Handmade', icon: Hand, color: 'bg-amber-600' },
  { type: 'limited', label: 'Limited', icon: Clock, color: 'bg-red-500' },
  { type: 'new', label: 'New!', icon: Zap, color: 'bg-blue-500' },
  { type: 'sparkle', label: 'Sparkle', icon: Sparkles, color: 'bg-purple-500' },
  { type: 'star', label: '5 Star', icon: Star, color: 'bg-orange-500' },
  { type: 'heart', label: 'Loved', icon: Heart, color: 'bg-pink-500' },
];

export const StickersTab = ({ siteConfig }: StickersTabProps) => {
  const { config, addSticker, removeSticker } = siteConfig;

  const handleAddSticker = (type: Sticker['type']) => {
    // Add sticker at random position within hero area
    const x = 10 + Math.random() * 60; // 10-70%
    const y = 10 + Math.random() * 60; // 10-70%
    addSticker({ type, x, y });
  };

  return (
    <div className="space-y-6">
      {/* Info */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-start gap-2">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Click a sticker to add it to your hero image! You can drag them around in the preview.
        </p>
      </div>

      {/* Sticker Library */}
      <div>
        <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
          🏷️ Sticker Library
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {stickerTypes.map((sticker) => {
            const Icon = sticker.icon;
            return (
              <motion.button
                key={sticker.type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddSticker(sticker.type)}
                className="flex items-center gap-2 p-3 rounded-lg border-2 border-border hover:border-primary/30 bg-background transition-colors"
              >
                <div className={`w-8 h-8 ${sticker.color} rounded-full flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{sticker.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Placed Stickers */}
      <div>
        <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
          📍 Placed Stickers ({config.content.stickers.length})
        </h3>
        
        {config.content.stickers.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No stickers placed yet. Click above to add some!
          </p>
        ) : (
          <div className="space-y-2">
            {config.content.stickers.map((sticker) => {
              const stickerInfo = stickerTypes.find(s => s.type === sticker.type);
              if (!stickerInfo) return null;
              const Icon = stickerInfo.icon;

              return (
                <motion.div
                  key={sticker.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between p-2 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 ${stickerInfo.color} rounded-full flex items-center justify-center text-white`}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <span className="text-sm">{stickerInfo.label}</span>
                  </div>
                  <button
                    onClick={() => removeSticker(sticker.id)}
                    className="text-xs text-destructive hover:underline"
                  >
                    Remove
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tips */}
      {config.content.stickers.length > 0 && (
        <div className="bg-accent/10 rounded-lg p-3">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Pro tip:</strong> Don't add too many stickers! 2-3 is perfect for highlighting what's special.
          </p>
        </div>
      )}
    </div>
  );
};
