import { createInitialConfig, type SiteConfig } from '@/hooks/useSiteConfig';
import type { BusinessTypeKey } from './businessTypes';

interface BusinessTypeDefaults {
  layouts?: Partial<SiteConfig['layouts']>;
  styles?: Partial<SiteConfig['styles']>;
  content?: Partial<SiteConfig['content']>;
}

// Defaults used when a business type is selected in Quest 1.
// Only applied to fields that still match the base defaults.
export const BUSINESS_TYPE_DEFAULTS: Record<BusinessTypeKey, BusinessTypeDefaults> = {
  food: {
    layouts: {
      hero: 'split',
      usp: 'badges',
      socialProof: 'cards',
      product: 'list',
    },
    styles: {
      palette: 'warm',
      fontPair: 'friendly',
      spacingDensity: 'normal',
    },
    content: {
      heroSubheading: 'Fresh treats made just for you.',
      ctaHeading: 'Ready to order?',
      ctaSubtext: 'Message us and grab your favorites today.',
    },
  },
  crafts: {
    layouts: {
      hero: 'minimal',
      usp: 'icons',
      socialProof: 'gallery',
      product: 'grid',
    },
    styles: {
      palette: 'pastel',
      fontPair: 'elegant',
      spacingDensity: 'normal',
    },
    content: {
      heroSubheading: 'Handmade with care and creativity.',
      ctaHeading: "Let's create something together",
      ctaSubtext: 'Send us a message to place a custom order.',
    },
  },
  toys: {
    layouts: {
      hero: 'poster',
      usp: 'statBars',
      socialProof: 'chatBubbles',
      product: 'carousel',
    },
    styles: {
      palette: 'neon',
      fontPair: 'friendly',
      spacingDensity: 'normal',
    },
    content: {
      heroSubheading: 'Playful products for big imaginations.',
      ctaHeading: 'Pick your favorite toy!',
      ctaSubtext: 'Limited sets available - grab yours now.',
    },
  },
  accessories: {
    layouts: {
      hero: 'cinematic',
      usp: 'icons',
      socialProof: 'grid',
      product: 'grid',
    },
    styles: {
      palette: 'dark',
      fontPair: 'professional',
      spacingDensity: 'normal',
    },
    content: {
      heroSubheading: 'Style details that make you shine.',
      ctaHeading: 'Upgrade your look',
      ctaSubtext: 'Shop the newest accessories today.',
    },
  },
  diy: {
    layouts: {
      hero: 'beforeAfter',
      usp: 'timeline',
      socialProof: 'chatBubbles',
      product: 'bundle',
    },
    styles: {
      palette: 'warm',
      fontPair: 'modern',
      spacingDensity: 'normal',
    },
    content: {
      heroSubheading: 'Build it yourself and show your skills.',
      ctaHeading: 'Ready to build?',
      ctaSubtext: 'Grab your kit and start creating.',
    },
  },
};

const isSame = (value: unknown, base: unknown) =>
  JSON.stringify(value) === JSON.stringify(base);

export const applyBusinessTypeDefaults = (
  current: SiteConfig,
  businessType: BusinessTypeKey,
  options: { allowContentOverwrite?: boolean } = {}
): SiteConfig => {
  const base = createInitialConfig();
  const defaults = BUSINESS_TYPE_DEFAULTS[businessType];
  const prevType = current.businessType;
  const prevDefaults = prevType ? BUSINESS_TYPE_DEFAULTS[prevType] : undefined;
  const allowContentOverwrite = options.allowContentOverwrite ?? true;

  const next: SiteConfig = {
    ...current,
    businessType,
    layouts: { ...current.layouts },
    styles: { ...current.styles },
    content: { ...current.content },
  };

  if (defaults.layouts) {
    (Object.keys(defaults.layouts) as Array<keyof SiteConfig['layouts']>).forEach((key) => {
      const currentValue = current.layouts[key];
      const baseValue = base.layouts[key];
      const prevValue = prevDefaults?.layouts?.[key];
      if (currentValue === baseValue || (prevValue !== undefined && currentValue === prevValue)) {
        (next.layouts as any)[key] = defaults.layouts?.[key] ?? next.layouts[key];
      }
    });
  }

  if (defaults.styles) {
    (Object.keys(defaults.styles) as Array<keyof SiteConfig['styles']>).forEach((key) => {
      const currentValue = current.styles[key];
      const baseValue = base.styles[key];
      const prevValue = prevDefaults?.styles?.[key];
      if (currentValue === baseValue || (prevValue !== undefined && currentValue === prevValue)) {
        (next.styles as any)[key] = defaults.styles?.[key] ?? next.styles[key];
      }
    });
  }

  if (defaults.content && allowContentOverwrite) {
    (Object.keys(defaults.content) as Array<keyof SiteConfig['content']>).forEach((key) => {
      const currentValue = current.content[key];
      const baseValue = base.content[key];
      const prevValue = prevDefaults?.content?.[key];
      if (
        currentValue === '' ||
        currentValue === null ||
        currentValue === undefined ||
        isSame(currentValue, baseValue) ||
        (prevValue !== undefined && isSame(currentValue, prevValue))
      ) {
        (next.content as any)[key] = defaults.content?.[key] ?? next.content[key];
      }
    });
  }

  return next;
};
