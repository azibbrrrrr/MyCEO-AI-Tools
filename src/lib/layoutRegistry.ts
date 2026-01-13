// Variant-based Layout Registry
// Section → Variant mapping (no business type dependencies)

export type HeroVariant = 'split' | 'poster' | 'minimal' | 'cinematic' | 'beforeAfter';
export type USPVariant = 'badges' | 'checklist' | 'timeline' | 'statBars' | 'icons';
export type SocialProofVariant = 'grid' | 'chatBubbles' | 'gallery' | 'cards';
export type ProductVariant = 'grid' | 'carousel' | 'bundle' | 'list' | 'comparison';

export interface LayoutRegistry {
    hero: Record<HeroVariant, { label: string; description: string }>;
    usp: Record<USPVariant, { label: string; description: string }>;
    socialProof: Record<SocialProofVariant, { label: string; description: string }>;
    product: Record<ProductVariant, { label: string; description: string }>;
}

export const layoutRegistry: LayoutRegistry = {
    hero: {
        split: { label: 'Split', description: 'Text left, image right' },
        poster: { label: 'Poster', description: 'Full background image' },
        minimal: { label: 'Minimal', description: 'Centered, clean look' },
        cinematic: { label: 'Cinematic', description: 'Immersive full-bleed' },
        beforeAfter: { label: 'Before/After', description: 'Comparison slider' },
    },
    usp: {
        badges: { label: 'Badges', description: 'Circular icon blocks' },
        checklist: { label: 'Checklist', description: 'Checkmark list style' },
        timeline: { label: 'Timeline', description: 'Step-by-step flow' },
        statBars: { label: 'Stats', description: 'Progress bar stats' },
        icons: { label: 'Icons', description: 'Elevated card blocks' },
    },
    socialProof: {
        grid: { label: 'Grid', description: 'Instagram-style grid' },
        chatBubbles: { label: 'Chat', description: 'Speech bubble reviews' },
        gallery: { label: 'Gallery', description: 'Project showcase' },
        cards: { label: 'Cards', description: 'Review cards stack' },
    },
    product: {
        grid: { label: 'Grid', description: 'Product grid layout' },
        carousel: { label: 'Carousel', description: 'Horizontal slider' },
        bundle: { label: 'Bundle', description: 'Package deal layout' },
        list: { label: 'List', description: 'Menu-style list' },
        comparison: { label: 'Compare', description: 'Side-by-side pricing' },
    },
};

export type SectionType = keyof LayoutRegistry;
export type VariantType<T extends SectionType> = keyof LayoutRegistry[T];
