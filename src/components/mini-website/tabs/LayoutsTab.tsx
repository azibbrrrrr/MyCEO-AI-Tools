import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { UseSiteConfigReturn } from '@/hooks/useSiteConfig';
import { layoutRegistry, type HeroVariant, type USPVariant, type SocialProofVariant, type ProductVariant } from '@/lib/layoutRegistry';

interface LayoutsTabProps {
  siteConfig: UseSiteConfigReturn;
}

export const LayoutsTab = ({ siteConfig }: LayoutsTabProps) => {
  const { config, setLayout } = siteConfig;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-8 p-1">
      {/* Hero Section */}
      <section>
        <h3 
            onClick={() => scrollToSection('preview-hero')}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-4 cursor-pointer hover:text-primary transition-colors"
        >
          🎯 Hero Section
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(layoutRegistry.hero) as HeroVariant[]).map((variant) => (
            <LayoutCard
              key={variant}
              label={layoutRegistry.hero[variant].label}
              description={layoutRegistry.hero[variant].description}
              selected={config.layouts.hero === variant}
              onClick={() => setLayout('hero', variant)}
              preview={<HeroPreview variant={variant} />}
            />
          ))}
        </div>
      </section>

      {/* USP Section */}
      <section>
        <h3 
            onClick={() => scrollToSection('preview-usp')}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-4 cursor-pointer hover:text-primary transition-colors"
        >
          ✨ USP Section
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(layoutRegistry.usp) as USPVariant[]).map((variant) => (
            <LayoutCard
              key={variant}
              label={layoutRegistry.usp[variant].label}
              description={layoutRegistry.usp[variant].description}
              selected={config.layouts.usp === variant}
              onClick={() => setLayout('usp', variant)}
              preview={<USPPreview variant={variant} />}
            />
          ))}
        </div>
      </section>

      {/* Social Proof Section */}
      <section>
        <h3 
            onClick={() => scrollToSection('preview-social-proof')}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-4 cursor-pointer hover:text-primary transition-colors"
        >
          ⭐ Social Proof
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(layoutRegistry.socialProof) as SocialProofVariant[]).map((variant) => (
            <LayoutCard
              key={variant}
              label={layoutRegistry.socialProof[variant].label}
              description={layoutRegistry.socialProof[variant].description}
              selected={config.layouts.socialProof === variant}
              onClick={() => setLayout('socialProof', variant)}
              preview={<SocialProofPreview variant={variant} />}
            />
          ))}
        </div>
      </section>

      {/* Product Section */}
      <section>
        <h3 
            onClick={() => scrollToSection('preview-product')}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-4 cursor-pointer hover:text-primary transition-colors"
        >
          🛍️ Product Section
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(layoutRegistry.product) as ProductVariant[]).map((variant) => (
            <LayoutCard
              key={variant}
              label={layoutRegistry.product[variant].label}
              description={layoutRegistry.product[variant].description}
              selected={config.layouts.product === variant}
              onClick={() => setLayout('product', variant)}
              preview={<ProductPreview variant={variant} />}
            />
          ))}
        </div>
      </section>
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

const LayoutCard = ({ label, selected, onClick, preview }: LayoutCardProps) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative p-2.5 rounded-xl border-2 transition-all text-left ${
      selected
        ? 'border-blue-500 bg-blue-50'
        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md shadow-sm'
    }`}
  >
    {selected && (
      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-sm z-10">
        <Check className="w-3 h-3 text-white" />
      </div>
    )}
    <div className={`aspect-video rounded-lg mb-2 overflow-hidden border ${selected ? 'border-blue-200 bg-white' : 'border-gray-100 bg-gray-50'}`}>
      {preview}
    </div>
    <p className={`text-xs font-medium truncate ${selected ? 'text-blue-700' : 'text-gray-700'}`}>
      {label}
    </p>
  </motion.button>
);

// Mini preview components
const HeroPreview = ({ variant }: { variant: HeroVariant }) => {
  switch (variant) {
    case 'split':
      return (
        <div className="w-full h-full flex p-1 gap-1">
          <div className="flex-1 flex flex-col justify-center gap-0.5">
            <div className="h-1.5 w-3/4 bg-foreground/20 rounded" />
            <div className="h-1 w-1/2 bg-foreground/10 rounded" />
          </div>
          <div className="flex-1 bg-primary/20 rounded" />
        </div>
      );
    case 'poster':
      return (
        <div className="w-full h-full bg-primary/20 flex items-center justify-center p-1">
          <div className="text-center">
            <div className="h-1.5 w-8 bg-white/60 rounded mx-auto mb-0.5" />
            <div className="h-1 w-6 bg-white/40 rounded mx-auto" />
          </div>
        </div>
      );
    case 'minimal':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-1 gap-1">
          <div className="h-1.5 w-1/2 bg-foreground/20 rounded" />
          <div className="h-1 w-1/3 bg-foreground/10 rounded" />
          <div className="w-4 h-4 bg-primary/20 rounded mt-1" />
        </div>
      );
    case 'cinematic':
      return (
        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-end p-1">
          <div className="w-full">
            <div className="h-1.5 w-2/3 bg-white/60 rounded mb-0.5" />
            <div className="h-1 w-1/2 bg-white/30 rounded" />
          </div>
        </div>
      );
    case 'beforeAfter':
      return (
        <div className="w-full h-full flex p-1 gap-0.5">
          <div className="flex-1 bg-slate-300 rounded flex items-center justify-center text-[6px]">B</div>
          <div className="w-0.5 bg-primary" />
          <div className="flex-1 bg-green-300 rounded flex items-center justify-center text-[6px]">A</div>
        </div>
      );
    default:
      return null;
  }
};

const USPPreview = ({ variant }: { variant: USPVariant }) => {
  switch (variant) {
    case 'badges':
      return (
        <div className="w-full h-full grid grid-cols-3 gap-0.5 p-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-primary/15 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-primary/30 rounded-full" />
            </div>
          ))}
        </div>
      );
    case 'checklist':
      return (
        <div className="w-full h-full flex flex-col gap-0.5 p-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
              <div className="h-1 flex-1 bg-foreground/10 rounded" />
            </div>
          ))}
        </div>
      );
    case 'timeline':
      return (
        <div className="w-full h-full flex items-center p-1">
          <div className="flex items-center gap-1 w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center flex-1">
                <div className="w-2 h-2 bg-primary rounded-full" />
                {i < 3 && <div className="flex-1 h-0.5 bg-primary/30" />}
              </div>
            ))}
          </div>
        </div>
      );
    case 'statBars':
      return (
        <div className="w-full h-full flex flex-col justify-center gap-1 p-1">
          {[80, 60, 90].map((w, i) => (
            <div key={i} className="h-1.5 bg-muted rounded overflow-hidden">
              <div className="h-full bg-primary/50 rounded" style={{ width: `${w}%` }} />
            </div>
          ))}
        </div>
      );
    case 'icons':
      return (
        <div className="w-full h-full grid grid-cols-3 gap-0.5 p-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded shadow-sm border flex flex-col items-center justify-center">
              <div className="w-2 h-2 bg-primary/20 rounded" />
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
};

const SocialProofPreview = ({ variant }: { variant: SocialProofVariant }) => {
  switch (variant) {
    case 'grid':
      return (
        <div className="w-full h-full grid grid-cols-2 gap-0.5 p-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-pink-200 rounded" />
          ))}
        </div>
      );
    case 'chatBubbles':
      return (
        <div className="w-full h-full flex flex-col justify-center gap-1 p-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-300 rounded-full" />
            <div className="flex-1 h-2 bg-white rounded-lg" />
          </div>
          <div className="flex items-center gap-1 flex-row-reverse">
            <div className="w-2 h-2 bg-pink-300 rounded-full" />
            <div className="flex-1 h-2 bg-white rounded-lg" />
          </div>
        </div>
      );
    case 'gallery':
      return (
        <div className="w-full h-full grid grid-cols-2 gap-0.5 p-1">
          {[1, 2].map((i) => (
            <div key={i} className="bg-blue-100 rounded flex flex-col">
              <div className="flex-1" />
              <div className="h-2 bg-white/80 p-0.5">
                <div className="h-full w-2/3 bg-foreground/20 rounded" />
              </div>
            </div>
          ))}
        </div>
      );
    case 'cards':
      return (
        <div className="w-full h-full flex gap-1 p-1">
          {[1, 2].map((i) => (
            <div key={i} className="flex-1 bg-white rounded shadow-sm border p-0.5">
              <div className="flex gap-0.5 mb-0.5">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="w-1 h-1 bg-yellow-400 rounded-full" />
                ))}
              </div>
              <div className="h-1 w-full bg-foreground/10 rounded" />
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
};

const ProductPreview = ({ variant }: { variant: ProductVariant }) => {
  switch (variant) {
    case 'grid':
      return (
        <div className="w-full h-full grid grid-cols-2 gap-1 p-1">
          {[1, 2].map((i) => (
            <div key={i} className="bg-card rounded shadow-sm border flex flex-col">
              <div className="flex-1 bg-primary/10" />
              <div className="h-2 p-0.5">
                <div className="h-1 w-2/3 bg-foreground/20 rounded" />
              </div>
            </div>
          ))}
        </div>
      );
    case 'carousel':
      return (
        <div className="w-full h-full flex gap-1 p-1 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-1/2 flex-shrink-0 bg-rose-100 rounded" />
          ))}
        </div>
      );
    case 'bundle':
      return (
        <div className="w-full h-full bg-slate-700 flex items-center justify-center p-1 gap-1">
          <div className="w-3 h-3 bg-slate-500 rounded" />
          <span className="text-[6px] text-blue-400">+</span>
          <div className="w-3 h-3 bg-slate-500 rounded" />
          <span className="text-[6px] text-green-400">=</span>
          <div className="w-4 h-4 bg-green-500 rounded" />
        </div>
      );
    case 'list':
      return (
        <div className="w-full h-full bg-amber-50 flex flex-col gap-0.5 p-1">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center">
              <div className="h-1 flex-1 bg-foreground/20 rounded" />
              <div className="h-1 w-2 bg-amber-400 rounded ml-1" />
            </div>
          ))}
        </div>
      );
    case 'comparison':
      return (
        <div className="w-full h-full flex gap-1 p-1">
          <div className="flex-1 bg-card rounded border" />
          <div className="flex-1 bg-primary/20 rounded border-2 border-primary/30" />
        </div>
      );
    default:
      return null;
  }
};
