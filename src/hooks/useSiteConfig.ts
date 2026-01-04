import { useState, useCallback } from 'react';

export type BusinessType = 'food' | 'crafts' | 'toys' | 'accessories' | 'diy';
export type Mode = 'selection' | 'editor' | 'preview';
export type HeroLayout = 'split' | 'poster' | 'minimal';
export type FeaturesLayout = 'grid' | 'list' | 'cards';
export type OfferLayout = 'cards' | 'bundle';
export type Palette = 'warm' | 'pastel' | 'neon' | 'dark';
export type CornerRadius = 'rounded-none' | 'rounded-lg' | 'rounded-2xl' | 'rounded-full';
export type ButtonStyle = 'solid' | 'outline' | 'shadow-pop';

export interface Sticker {
    id: string;
    type: 'best-seller' | 'halal' | 'handmade' | 'limited' | 'new' | 'sparkle' | 'star' | 'heart';
    x: number;
    y: number;
}

export interface Review {
    id: string;
    name: string;
    rating: number;
    text: string;
    avatar?: string;
}

export interface SiteConfig {
    mode: Mode;
    businessType: BusinessType;
    bossMode: boolean;
    layouts: {
        hero: HeroLayout;
        features: FeaturesLayout;
        offer: OfferLayout;
    };
    styles: {
        palette: Palette;
        cornerRadius: CornerRadius;
        buttonStyle: ButtonStyle;
    };
    content: {
        heroHeading: string;
        heroSubheading: string;
        heroImage: string | null;
        stickers: Sticker[];
        scarcityText: string;
        scarcityEnabled: boolean;
        reviews: Review[];
        features: { icon: string; title: string; description: string }[];
        products: { name: string; price: number; originalPrice?: number; image?: string }[];
    };
}

const defaultFeatures: Record<BusinessType, { icon: string; title: string; description: string }[]> = {
    food: [
        { icon: 'ChefHat', title: 'Fresh Daily', description: 'Made fresh every morning' },
        { icon: 'Heart', title: 'Made with Love', description: 'Family recipes passed down' },
        { icon: 'Leaf', title: 'Quality Ingredients', description: 'Only the best for you' },
    ],
    crafts: [
        { icon: 'Palette', title: 'Handcrafted', description: 'Each piece is unique' },
        { icon: 'Sparkles', title: 'Custom Orders', description: 'Made just for you' },
        { icon: 'Gift', title: 'Gift Ready', description: 'Beautiful packaging included' },
    ],
    toys: [
        { icon: 'Shield', title: 'Safe Materials', description: 'Kid-friendly and tested' },
        { icon: 'Smile', title: 'Hours of Fun', description: 'Entertainment guaranteed' },
        { icon: 'Package', title: 'Fast Shipping', description: 'Get it in 2-3 days' },
    ],
    accessories: [
        { icon: 'Gem', title: 'Premium Quality', description: 'Built to last' },
        { icon: 'Sparkles', title: 'Trendy Designs', description: 'Stay stylish' },
        { icon: 'Gift', title: 'Gift Wrapping', description: 'Perfect for gifting' },
    ],
    diy: [
        { icon: 'Wrench', title: 'Easy Assembly', description: 'Clear instructions included' },
        { icon: 'Book', title: 'Tutorial Videos', description: 'Step-by-step guides' },
        { icon: 'MessageCircle', title: 'Support', description: "We're here to help" },
    ],
};

const defaultProducts: Record<BusinessType, { name: string; price: number; originalPrice?: number }[]> = {
    food: [
        { name: 'Classic Box', price: 15, originalPrice: 20 },
        { name: 'Family Pack', price: 35, originalPrice: 45 },
    ],
    crafts: [
        { name: 'Starter Kit', price: 25, originalPrice: 35 },
        { name: 'Pro Bundle', price: 55, originalPrice: 70 },
    ],
    toys: [
        { name: 'Single Toy', price: 12, originalPrice: 15 },
        { name: 'Play Set', price: 30, originalPrice: 40 },
    ],
    accessories: [
        { name: 'Essential', price: 20, originalPrice: 28 },
        { name: 'Complete Set', price: 45, originalPrice: 60 },
    ],
    diy: [
        { name: 'Beginner Kit', price: 18, originalPrice: 25 },
        { name: 'Master Bundle', price: 40, originalPrice: 55 },
    ],
};

const defaultHeadings: Record<BusinessType, { heading: string; subheading: string }> = {
    food: { heading: 'Delicious Treats Made Fresh', subheading: 'Taste the difference of homemade goodness' },
    crafts: { heading: 'Handcrafted with Love', subheading: 'Unique creations just for you' },
    toys: { heading: 'Playtime Adventures Await', subheading: 'Fun that never stops' },
    accessories: { heading: 'Style That Shines', subheading: 'Accessories that make you sparkle' },
    diy: { heading: 'Build Something Amazing', subheading: 'Create, learn, and have fun' },
};

export const createInitialConfig = (businessType: BusinessType = 'food'): SiteConfig => ({
    mode: 'selection',
    businessType,
    bossMode: false,
    layouts: {
        hero: 'split',
        features: 'grid',
        offer: 'cards',
    },
    styles: {
        palette: 'warm',
        cornerRadius: 'rounded-lg',
        buttonStyle: 'solid',
    },
    content: {
        heroHeading: defaultHeadings[businessType].heading,
        heroSubheading: defaultHeadings[businessType].subheading,
        heroImage: null,
        stickers: [],
        scarcityText: 'Only 3 left!',
        scarcityEnabled: true,
        reviews: [
            { id: '1', name: 'Happy Customer', rating: 5, text: 'Absolutely loved it! Will buy again.' },
            { id: '2', name: 'Satisfied Buyer', rating: 4, text: 'Great quality and fast delivery!' },
        ],
        features: defaultFeatures[businessType],
        products: defaultProducts[businessType],
    },
});

export function useSiteConfig() {
    const [config, setConfig] = useState<SiteConfig>(createInitialConfig());

    const setMode = useCallback((mode: Mode) => {
        setConfig(prev => ({ ...prev, mode }));
    }, []);

    const setBusinessType = useCallback((businessType: BusinessType) => {
        setConfig(prev => ({
            ...prev,
            businessType,
            content: {
                ...prev.content,
                heroHeading: defaultHeadings[businessType].heading,
                heroSubheading: defaultHeadings[businessType].subheading,
                features: defaultFeatures[businessType],
                products: defaultProducts[businessType],
            },
        }));
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

    const addSticker = useCallback((sticker: Omit<Sticker, 'id'>) => {
        const newSticker: Sticker = { ...sticker, id: crypto.randomUUID() };
        setConfig(prev => ({
            ...prev,
            content: {
                ...prev.content,
                stickers: [...prev.content.stickers, newSticker],
            },
        }));
        return newSticker.id;
    }, []);

    const updateSticker = useCallback((id: string, updates: Partial<Omit<Sticker, 'id'>>) => {
        setConfig(prev => ({
            ...prev,
            content: {
                ...prev.content,
                stickers: prev.content.stickers.map(s =>
                    s.id === id ? { ...s, ...updates } : s
                ),
            },
        }));
    }, []);

    const removeSticker = useCallback((id: string) => {
        setConfig(prev => ({
            ...prev,
            content: {
                ...prev.content,
                stickers: prev.content.stickers.filter(s => s.id !== id),
            },
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

    const removeReview = useCallback((id: string) => {
        setConfig(prev => ({
            ...prev,
            content: {
                ...prev.content,
                reviews: prev.content.reviews.filter(r => r.id !== id),
            },
        }));
    }, []);

    return {
        config,
        setConfig,
        setMode,
        setBusinessType,
        toggleBossMode,
        setLayout,
        setStyle,
        setContent,
        addSticker,
        updateSticker,
        removeSticker,
        addReview,
        removeReview,
    };
}

export type UseSiteConfigReturn = ReturnType<typeof useSiteConfig>;
