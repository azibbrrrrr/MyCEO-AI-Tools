import { useState, useCallback } from 'react';
import type { HeroVariant, USPVariant, SocialProofVariant, ProductVariant } from '@/lib/layoutRegistry';

export type Mode = 'editor' | 'preview';
export type Palette = 'warm' | 'pastel' | 'neon' | 'dark';
export type CornerRadius = 'rounded-none' | 'rounded-lg' | 'rounded-2xl' | 'rounded-full';
export type ButtonStyle = 'solid' | 'outline' | 'shadow-pop';
export type FontPair = 'modern' | 'professional' | 'elegant' | 'friendly' | 'tech';
export type SpacingDensity = 'tight' | 'normal' | 'relaxed';

export interface Review {
    id: string;
    name: string;
    rating: number;
    text: string;
    avatar?: string;
    image?: string;
}

export interface Feature {
    id: string;
    title: string;
    description: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image?: string;
    description?: string;
    badge?: string;
}

export type CTAActionType = 'shop' | 'whatsapp' | 'email' | 'phone' | 'custom';

export interface CTAButton {
    id: string;
    type: CTAActionType;
    text: string;
    value: string; // phone number, email, or URL depending on type
    isPrimary: boolean;
}

export interface SiteConfig {
    mode: Mode;
    bossMode: boolean;
    layouts: {
        hero: HeroVariant;
        usp: USPVariant;
        socialProof: SocialProofVariant;
        product: ProductVariant;
    };
    styles: {
        palette: Palette;
        cornerRadius: CornerRadius;
        buttonStyle: ButtonStyle;
        fontPair: FontPair;
        spacingDensity: SpacingDensity;
    };
    content: {
        heroHeading: string;
        heroSubheading: string;
        heroImage: string | null;
        heroBeforeImage: string | null;
        scarcityText: string;
        scarcityEnabled: boolean;
        reviews: Review[];
        features: Feature[];
        products: Product[];
        ctaHeading: string;
        ctaSubtext: string;
        ctaButtons: CTAButton[];
    };
}

const defaultFeatures: Feature[] = [
    { id: 'f1', title: 'Premium Quality', description: 'Only the best for you' },
    { id: 'f2', title: 'Made with Love', description: 'Crafted with care' },
    { id: 'f3', title: 'Guaranteed', description: '100% satisfaction' },
];

const defaultProducts: Product[] = [
    { id: '1', name: 'Starter Pack', price: 29, originalPrice: 39 },
    { id: '2', name: 'Pro Bundle', price: 59, originalPrice: 79 },
];

export const createInitialConfig = (): SiteConfig => ({
    mode: 'editor',
    bossMode: false,
    layouts: {
        hero: 'split',
        usp: 'badges',
        socialProof: 'cards',
        product: 'grid',
    },
    styles: {
        palette: 'pastel',
        cornerRadius: 'rounded-lg',
        buttonStyle: 'solid',
        fontPair: 'modern',
        spacingDensity: 'normal',
    },
    content: {
        heroHeading: 'Welcome to Your Store',
        heroSubheading: 'Discover amazing products made just for you',
        heroImage: null,
        heroBeforeImage: null,
        scarcityText: 'Only 3 left!',
        scarcityEnabled: true,
        reviews: [
            { id: '1', name: 'Happy Customer', rating: 5, text: 'Absolutely loved it! Will buy again.' },
            { id: '2', name: 'Satisfied Buyer', rating: 4, text: 'Great quality and fast delivery!' },
        ],
        features: defaultFeatures,
        products: defaultProducts,
        ctaHeading: 'Ready to Order?',
        ctaSubtext: "Don't miss out on this amazing offer. Order now and join our happy customers!",
        ctaButtons: [
            { id: 'cta1', type: 'shop', text: 'Order Now', value: '', isPrimary: true },
        ],
    },
});

export function useSiteConfig() {
    const [config, setConfig] = useState<SiteConfig>(createInitialConfig());

    const setMode = useCallback((mode: Mode) => {
        setConfig(prev => ({ ...prev, mode }));
    }, []);

    const toggleBossMode = useCallback(() => {
        setConfig(prev => ({ ...prev, bossMode: !prev.bossMode }));
    }, []);

    const setLayout = useCallback(<K extends keyof SiteConfig['layouts']>(
        key: K,
        value: SiteConfig['layouts'][K]
    ) => {
        setConfig(prev => ({
            ...prev,
            layouts: { ...prev.layouts, [key]: value },
        }));
    }, []);

    const setStyle = useCallback(<K extends keyof SiteConfig['styles']>(
        key: K,
        value: SiteConfig['styles'][K]
    ) => {
        setConfig(prev => ({
            ...prev,
            styles: { ...prev.styles, [key]: value },
        }));
    }, []);

    const setContent = useCallback(<K extends keyof SiteConfig['content']>(
        key: K,
        value: SiteConfig['content'][K]
    ) => {
        setConfig(prev => ({
            ...prev,
            content: { ...prev.content, [key]: value },
        }));
    }, []);

    const addReview = useCallback((review: Omit<Review, 'id'>) => {
        const newReview: Review = { ...review, id: crypto.randomUUID() };
        setConfig(prev => ({
            ...prev,
            content: {
                ...prev.content,
                reviews: [...prev.content.reviews, newReview],
            },
        }));
    }, []);

    const updateReview = useCallback((id: string, updates: Partial<Omit<Review, 'id'>>) => {
        setConfig(prev => ({
            ...prev,
            content: {
                ...prev.content,
                reviews: prev.content.reviews.map(r =>
                    r.id === id ? { ...r, ...updates } : r
                ),
            },
        }));
    }, []);

    const removeReview = useCallback((id: string) => {
        setConfig(prev => ({
            ...prev,
            content: {
                ...prev.content,
                reviews: prev.content.reviews.filter(r => r.id !== id),
            },
        }));
    }, []);

    const addFeature = useCallback((feature: Omit<Feature, 'id'>) => {
        const newFeature: Feature = { ...feature, id: crypto.randomUUID() };
        setConfig(prev => ({
            ...prev,
            content: {
                ...prev.content,
                features: [...prev.content.features, newFeature],
            },
        }));
    }, []);

    const updateFeature = useCallback((index: number, feature: Partial<Feature>) => {
        setConfig(prev => ({
            ...prev,
            content: {
                ...prev.content,
                features: prev.content.features.map((f, i) =>
                    i === index ? { ...f, ...feature } : f
                ),
            },
        }));
    }, []);

    const removeFeature = useCallback((index: number) => {
        setConfig(prev => ({
            ...prev,
            content: {
                ...prev.content,
                features: prev.content.features.filter((_, i) => i !== index),
            },
        }));
    }, []);

    const addProduct = useCallback((product: Omit<Product, 'id'>) => {
        const newProduct: Product = { ...product, id: crypto.randomUUID() };
        setConfig(prev => ({
            ...prev,
            content: {
                ...prev.content,
                products: [...prev.content.products, newProduct],
            },
        }));
    }, []);

    const updateProduct = useCallback((id: string, updates: Partial<Omit<Product, 'id'>>) => {
        setConfig(prev => ({
            ...prev,
            content: {
                ...prev.content,
                products: prev.content.products.map(p =>
                    p.id === id ? { ...p, ...updates } : p
                ),
            },
        }));
    }, []);

    const removeProduct = useCallback((id: string) => {
        setConfig(prev => ({
            ...prev,
            content: {
                ...prev.content,
                products: prev.content.products.filter(p => p.id !== id),
            },
        }));
    }, []);

    return {
        config,
        setConfig,
        setMode,
        toggleBossMode,
        setLayout,
        setStyle,
        setContent,
        addReview,
        updateReview,
        removeReview,
        addFeature,
        updateFeature,
        removeFeature,
        addProduct,
        updateProduct,
        removeProduct,
    };
}

export type UseSiteConfigReturn = ReturnType<typeof useSiteConfig>;
