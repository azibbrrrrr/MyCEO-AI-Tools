import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { UseSiteConfigReturn, HeroLayout, FeaturesLayout, OfferLayout } from '@/hooks/useSiteConfig';

interface LayoutsTabProps {
  siteConfig: UseSiteConfigReturn;
}

const heroLayouts: { value: HeroLayout; label: string; description: string }[] = [
  { value: 'split', label: 'Split', description: 'Text left, image right' },
  { value: 'poster', label: 'Poster', description: 'Full background image' },
  { value: 'minimal', label: 'Minimal', description: 'Centered, clean look' },
];

const featuresLayouts: { value: FeaturesLayout; label: string; description: string }[] = [
  { value: 'grid', label: 'Grid', description: 'Icon blocks in grid' },
  { value: 'list', label: 'List', description: 'Checkmark list style' },
  { value: 'cards', label: 'Cards', description: 'Elevated card blocks' },
];

const offerLayouts: { value: OfferLayout; label: string; description: string }[] = [
  { value: 'cards', label: 'Cards', description: 'Side-by-side products' },
  { value: 'bundle', label: 'Bundle', description: 'Highlight savings deal' },
];

export const LayoutsTab = ({ siteConfig }: LayoutsTabProps) => {
  const { config, setLayout } = siteConfig;

  return (
    <div className="space-y-6">
      {/* Hero Layout */}
      <div>
        <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
          🎯 Hero Section
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {heroLayouts.map((layout) => (
            <LayoutCard
              key={layout.value}
              label={layout.label}
              description={layout.description}
              selected={config.layouts.hero === layout.value}
              onClick={() => setLayout('hero', layout.value)}
              preview={<HeroPreview variant={layout.value} />}
            />
          ))}
        </div>
      </div>

      {/* Features Layout */}
      <div>
        <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
          ✨ Features Section
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {featuresLayouts.map((layout) => (
            <LayoutCard
              key={layout.value}
              label={layout.label}
              description={layout.description}
              selected={config.layouts.features === layout.value}
              onClick={() => setLayout('features', layout.value)}
              preview={<FeaturesPreview variant={layout.value} />}
            />
          ))}
        </div>
      </div>

      {/* Offer Layout */}
      <div>
        <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
          💰 Offer Section
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {offerLayouts.map((layout) => (
            <LayoutCard
              key={layout.value}
              label={layout.label}
              description={layout.description}
              selected={config.layouts.offer === layout.value}
              onClick={() => setLayout('offer', layout.value)}
              preview={<OfferPreview variant={layout.value} />}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface LayoutCardProps {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  preview: React.ReactNode;
}

const LayoutCard = ({ label, description, selected, onClick, preview }: LayoutCardProps) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative p-2 rounded-lg border-2 transition-colors text-left ${
      selected
        ? 'border-primary bg-primary/5'
        : 'border-border hover:border-primary/30 bg-background'
    }`}
  >
    {selected && (
      <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
        <Check className="w-3 h-3 text-primary-foreground" />
      </div>
    )}
    <div className="aspect-video bg-muted rounded mb-2 overflow-hidden">
      {preview}
    </div>
    <p className="text-xs font-medium truncate">{label}</p>
  </motion.button>
);

// Mini preview components
const HeroPreview = ({ variant }: { variant: HeroLayout }) => {
  if (variant === 'split') {
    return (
      <div className="w-full h-full flex p-1 gap-1">
        <div className="flex-1 flex flex-col justify-center gap-0.5">
          <div className="h-1.5 w-3/4 bg-foreground/20 rounded" />
          <div className="h-1 w-1/2 bg-foreground/10 rounded" />
        </div>
        <div className="flex-1 bg-primary/20 rounded" />
      </div>
    );
  }
  if (variant === 'poster') {
    return (
      <div className="w-full h-full bg-primary/20 flex items-center justify-center p-1">
        <div className="text-center">
          <div className="h-1.5 w-8 bg-white/60 rounded mx-auto mb-0.5" />
          <div className="h-1 w-6 bg-white/40 rounded mx-auto" />
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-1 gap-1">
      <div className="h-1.5 w-1/2 bg-foreground/20 rounded" />
      <div className="h-1 w-1/3 bg-foreground/10 rounded" />
      <div className="w-4 h-4 bg-primary/20 rounded mt-1" />
    </div>
  );
};

const FeaturesPreview = ({ variant }: { variant: FeaturesLayout }) => {
  if (variant === 'grid') {
    return (
      <div className="w-full h-full grid grid-cols-3 gap-0.5 p-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-primary/15 rounded flex items-center justify-center">
            <div className="w-2 h-2 bg-primary/30 rounded-full" />
          </div>
        ))}
      </div>
    );
  }
  if (variant === 'list') {
    return (
      <div className="w-full h-full flex flex-col gap-0.5 p-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-primary/30 rounded-full shrink-0" />
            <div className="h-1 flex-1 bg-foreground/10 rounded" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="w-full h-full grid grid-cols-3 gap-0.5 p-1">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card rounded shadow-sm border" />
      ))}
    </div>
  );
};

const OfferPreview = ({ variant }: { variant: OfferLayout }) => {
  if (variant === 'cards') {
    return (
      <div className="w-full h-full flex gap-1 p-1">
        <div className="flex-1 bg-card rounded shadow-sm border" />
        <div className="flex-1 bg-primary/10 rounded shadow-sm border-2 border-primary/30" />
      </div>
    );
  }
  return (
    <div className="w-full h-full flex items-center justify-center p-1">
      <div className="w-3/4 h-3/4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded flex items-center justify-center">
        <span className="text-[8px] font-bold text-primary">BUNDLE</span>
      </div>
    </div>
  );
};
