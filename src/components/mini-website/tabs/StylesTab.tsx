import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { UseSiteConfigReturn, Palette, CornerRadius, ButtonStyle } from '@/hooks/useSiteConfig';

interface StylesTabProps {
  siteConfig: UseSiteConfigReturn;
}

const palettes: { value: Palette; label: string; colors: string[] }[] = [
  { value: 'warm', label: 'Warm', colors: ['#f97316', '#f59e0b', '#fbbf24'] },
  { value: 'pastel', label: 'Pastel', colors: ['#c084fc', '#5eead4', '#fde047'] },
  { value: 'neon', label: 'Neon', colors: ['#22d3ee', '#a855f7', '#facc15'] },
  { value: 'dark', label: 'Dark', colors: ['#3b82f6', '#a855f7', '#eab308'] },
];

const corners: { value: CornerRadius; label: string }[] = [
  { value: 'rounded-none', label: 'Sharp' },
  { value: 'rounded-lg', label: 'Rounded' },
  { value: 'rounded-2xl', label: 'Soft' },
  { value: 'rounded-full', label: 'Pill' },
];

const buttonStyles: { value: ButtonStyle; label: string }[] = [
  { value: 'solid', label: 'Solid' },
  { value: 'outline', label: 'Outline' },
  { value: 'shadow-pop', label: 'Pop!' },
];

export const StylesTab = ({ siteConfig }: StylesTabProps) => {
  const { config, setStyle } = siteConfig;

  return (
    <div className="space-y-6">
      {/* Color Palette */}
      <div>
        <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
          🎨 Color Palette
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {palettes.map((palette) => (
            <motion.button
              key={palette.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStyle('palette', palette.value)}
              className={`relative p-3 rounded-xl border-2 transition-colors ${
                config.styles.palette === palette.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              {config.styles.palette === palette.value && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <div className="flex gap-1 mb-2">
                {palette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full shadow-inner"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-sm font-medium">{palette.label}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Corner Radius */}
      <div>
        <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
          📐 Corner Style
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {corners.map((corner) => (
            <motion.button
              key={corner.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStyle('cornerRadius', corner.value)}
              className={`p-3 border-2 transition-colors ${corner.value} ${
                config.styles.cornerRadius === corner.value
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              <div
                className={`w-full aspect-square bg-gradient-to-br from-primary/30 to-secondary/30 ${corner.value} mb-2`}
              />
              <p className="text-xs font-medium">{corner.label}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Button Style */}
      <div>
        <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
          🔘 Button Style
        </h3>
        <div className="space-y-2">
          {buttonStyles.map((style) => (
            <motion.button
              key={style.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStyle('buttonStyle', style.value)}
              className={`w-full p-3 rounded-lg border-2 flex items-center justify-between transition-colors ${
                config.styles.buttonStyle === style.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              <span className="text-sm font-medium">{style.label}</span>
              <ButtonPreview style={style.value} cornerRadius={config.styles.cornerRadius} />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ButtonPreview = ({
  style,
  cornerRadius,
}: {
  style: ButtonStyle;
  cornerRadius: CornerRadius;
}) => {
  const baseClasses = `px-3 py-1 text-xs font-medium transition-all ${cornerRadius}`;

  if (style === 'solid') {
    return (
      <span className={`${baseClasses} bg-primary text-primary-foreground`}>
        Buy Now
      </span>
    );
  }

  if (style === 'outline') {
    return (
      <span className={`${baseClasses} border-2 border-primary text-primary bg-transparent`}>
        Buy Now
      </span>
    );
  }

  return (
    <span
      className={`${baseClasses} bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:-translate-y-0.5`}
    >
      Buy Now
    </span>
  );
};
