import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { UseSiteConfigReturn, Palette, CornerRadius, ButtonStyle, FontScale, SpacingDensity } from '@/hooks/useSiteConfig';

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

const fontScales: { value: FontScale; label: string; preview: string }[] = [
  { value: 'compact', label: 'Compact', preview: 'Aa' },
  { value: 'normal', label: 'Normal', preview: 'Aa' },
  { value: 'large', label: 'Large', preview: 'Aa' },
];

const spacingOptions: { value: SpacingDensity; label: string; bars: number }[] = [
  { value: 'tight', label: 'Tight', bars: 2 },
  { value: 'normal', label: 'Normal', bars: 3 },
  { value: 'relaxed', label: 'Relaxed', bars: 4 },
];

export const StylesTab = ({ siteConfig }: StylesTabProps) => {
  const { config, setStyle } = siteConfig;

  return (
    <div className="space-y-8 p-1">
      {/* Color Palette */}
      <section>
        <h3 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">
          🎨 Color Palette
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {palettes.map((palette) => (
            <motion.button
              key={palette.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStyle('palette', palette.value)}
              className={`relative p-3 rounded-xl border-2 transition-all ${
                config.styles.palette === palette.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md shadow-sm'
              }`}
            >
              {config.styles.palette === palette.value && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <div className="flex gap-1 mb-2">
                {palette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full shadow-inner ring-1 ring-black/5"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className={`text-sm font-medium ${
                config.styles.palette === palette.value ? 'text-blue-700' : 'text-gray-700'
              }`}>{palette.label}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Corner Radius */}
      <section>
        <h3 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">
          📐 Corner Style
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {corners.map((corner) => (
            <motion.button
              key={corner.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStyle('cornerRadius', corner.value)}
              className={`p-3 border-2 transition-all ${corner.value} ${
                config.styles.cornerRadius === corner.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md shadow-sm'
              }`}
            >
              <div
                className={`w-full aspect-square bg-gradient-to-br from-blue-100 to-indigo-100 ${corner.value} mb-2 border border-blue-200`}
              />
              <p className={`text-xs font-medium ${
                config.styles.cornerRadius === corner.value ? 'text-blue-700' : 'text-gray-700'
              }`}>{corner.label}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Button Style */}
      <section>
        <h3 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">
          🔘 Button Style
        </h3>
        <div className="space-y-3">
          {buttonStyles.map((style) => (
            <motion.button
              key={style.value}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setStyle('buttonStyle', style.value)}
              className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                config.styles.buttonStyle === style.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md shadow-sm'
              }`}
            >
              <span className={`text-sm font-medium ${
                config.styles.buttonStyle === style.value ? 'text-blue-700' : 'text-gray-700'
              }`}>{style.label}</span>
              <ButtonPreview style={style.value} cornerRadius={config.styles.cornerRadius} />
            </motion.button>
          ))}
        </div>
      </section>

      {/* Font Scale */}
      <section>
        <h3 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">
          🔤 Font Scale
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {fontScales.map((scale) => (
            <motion.button
              key={scale.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStyle('fontScale', scale.value)}
              className={`p-3 border-2 rounded-xl transition-all ${
                config.styles.fontScale === scale.value
                   ? 'border-blue-500 bg-blue-50'
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md shadow-sm'
              }`}
            >
              <div 
                className={`font-bold mb-2 ${
                  config.styles.fontScale === scale.value ? 'text-blue-600' : 'text-gray-800'
                }`}
                style={{ 
                  fontSize: scale.value === 'compact' ? '0.875rem' : scale.value === 'large' ? '1.25rem' : '1rem' 
                }}
              >
                {scale.preview}
              </div>
              <p className={`text-xs font-medium ${
                config.styles.fontScale === scale.value ? 'text-blue-700' : 'text-gray-700'
              }`}>{scale.label}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Spacing Density */}
      <section>
        <h3 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">
          📏 Spacing Density
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {spacingOptions.map((spacing) => (
            <motion.button
              key={spacing.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStyle('spacingDensity', spacing.value)}
              className={`p-3 border-2 rounded-xl transition-all ${
                config.styles.spacingDensity === spacing.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center gap-0.5 mb-2 h-8 justify-center">
                {Array.from({ length: spacing.bars }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-6 h-1 rounded-full ${
                       config.styles.spacingDensity === spacing.value ? 'bg-blue-400' : 'bg-gray-300'
                    }`}
                    style={{ 
                      marginTop: i > 0 ? (spacing.value === 'tight' ? '2px' : spacing.value === 'relaxed' ? '6px' : '4px') : 0 
                    }}
                  />
                ))}
              </div>
              <p className={`text-xs font-medium ${
                config.styles.spacingDensity === spacing.value ? 'text-blue-700' : 'text-gray-700'
              }`}>{spacing.label}</p>
            </motion.button>
          ))}
        </div>
      </section>
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
