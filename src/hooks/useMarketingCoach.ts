import { useMemo } from 'react';
import type { SiteConfig } from './useSiteConfig';

export interface CoachTip {
    id: string;
    message: string;
    completed: boolean;
    category: 'content' | 'trust' | 'urgency' | 'design';
}

export interface CoachResult {
    level: 1 | 2 | 3 | 4;
    levelLabel: string;
    tip: string;
}

interface CoachOptions {
    isPublished: boolean;
}

export function useMarketingCoach(config: SiteConfig, options: CoachOptions): CoachResult {
    return useMemo(() => {
        const tips: CoachTip[] = [];

        const hasStrongHeadline = config.content.heroHeading.trim().length >= 8;
        tips.push({
            id: 'headline',
            message: 'Add a catchy headline (8+ characters) to hook visitors.',
            completed: hasStrongHeadline,
            category: 'content',
        });

        const hasHeroImage = !!config.content.heroImage;
        tips.push({
            id: 'hero-image',
            message: 'Add a hero image to make your site pop.',
            completed: hasHeroImage,
            category: 'content',
        });

        const hasReviews = config.content.reviews.length >= 1;
        tips.push({
            id: 'reviews',
            message: 'Add at least 1 review to build trust.',
            completed: hasReviews,
            category: 'trust',
        });

        const hasFeatures = config.content.features.length >= 3;
        tips.push({
            id: 'features',
            message: 'Add 3 features to highlight your benefits.',
            completed: hasFeatures,
            category: 'design',
        });

        const hasScarcity = config.content.scarcityEnabled;
        tips.push({
            id: 'scarcity',
            message: 'Enable the urgency bar to boost action.',
            completed: hasScarcity,
            category: 'urgency',
        });

        const hasSubheading = config.content.heroSubheading.trim().length >= 10;
        tips.push({
            id: 'subheading',
            message: 'Add a short subheading to explain your offer.',
            completed: hasSubheading,
            category: 'content',
        });

        const hasMultipleProducts = config.content.products.length >= 2;
        tips.push({
            id: 'products',
            message: 'Add another product for more choices.',
            completed: hasMultipleProducts,
            category: 'content',
        });

        const quest1Complete =
            config.content.heroHeading.trim().length > 0 &&
            config.content.heroSubheading.trim().length > 0;
        const quest2Complete = Boolean(config.businessType);
        const quest3Complete = config.content.products.length >= 1;
        const quest4Complete = config.content.reviews.length >= 1;
        const quest5Complete = options.isPublished;

        let level: 1 | 2 | 3 | 4 = 1;
        let levelLabel = 'Rookie Seller';

        if (quest1Complete && quest2Complete) {
            level = 1;
            levelLabel = 'Rookie Seller';
        }
        if (quest3Complete) {
            level = 2;
            levelLabel = 'Confident Seller';
        }
        if (quest4Complete && quest5Complete) {
            level = 3;
            levelLabel = 'Pro Boss';
        }

        const optionalExtrasComplete = hasHeroImage && hasFeatures && hasScarcity && hasMultipleProducts;
        if (optionalExtrasComplete) {
            level = 4;
            levelLabel = 'Carnival Legend';
        }

        const defaultMessages: Record<1 | 2 | 3 | 4, string> = {
            1: 'Good start, Boss! Your shop looks great!',
            2: "Products added! You're ready to sell!",
            3: 'Reviews boost trust! Smart move!',
            4: "You're a marketing master, Boss!",
        };

        const nextTip = tips.find(tip => !tip.completed);
        const tip = nextTip ? nextTip.message : defaultMessages[level];

        return {
            level,
            levelLabel,
            tip,
        };
    }, [config, options.isPublished]);
}
