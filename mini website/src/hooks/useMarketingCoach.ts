import { useMemo } from 'react';
import type { SiteConfig } from './useSiteConfig';

export interface CoachTip {
  id: string;
  message: string;
  points: number;
  completed: boolean;
  category: 'content' | 'trust' | 'urgency' | 'design';
}

export interface CoachResult {
  score: number;
  tips: CoachTip[];
  level: 'beginner' | 'pro' | 'master';
  celebrationTriggered: boolean;
}

export function useMarketingCoach(config: SiteConfig): CoachResult {
  return useMemo(() => {
    const tips: CoachTip[] = [];
    let score = 0;

    // Headline check (15 pts)
    const hasStrongHeadline = config.content.heroHeading.length >= 8;
    tips.push({
      id: 'headline',
      message: hasStrongHeadline
        ? '✓ Great headline! It grabs attention.'
        : 'Add a catchy headline (8+ characters) to hook visitors!',
      points: 15,
      completed: hasStrongHeadline,
      category: 'content',
    });
    if (hasStrongHeadline) score += 15;

    // Hero image check (20 pts)
    const hasHeroImage = !!config.content.heroImage;
    tips.push({
      id: 'hero-image',
      message: hasHeroImage
        ? '✓ Your hero image looks amazing!'
        : 'Upload a hero image to make your site pop!',
      points: 20,
      completed: hasHeroImage,
      category: 'content',
    });
    if (hasHeroImage) score += 20;

    // Reviews check (15 pts)
    const hasReviews = config.content.reviews.length >= 2;
    tips.push({
      id: 'reviews',
      message: hasReviews
        ? '✓ Social proof is powerful! Reviews build trust.'
        : 'Add at least 2 reviews to build customer trust!',
      points: 15,
      completed: hasReviews,
      category: 'trust',
    });
    if (hasReviews) score += 15;

    // Stickers check (15 pts)
    const hasStickers = config.content.stickers.length >= 1;
    tips.push({
      id: 'stickers',
      message: hasStickers
        ? '✓ Badges make your products stand out!'
        : 'Add stickers like "Best Seller" to highlight your products!',
      points: 15,
      completed: hasStickers,
      category: 'design',
    });
    if (hasStickers) score += 15;

    // Scarcity check (10 pts)
    const hasScarcity = config.content.scarcityEnabled;
    tips.push({
      id: 'scarcity',
      message: hasScarcity
        ? '✓ Urgency creates action! Smart move.'
        : 'Enable the scarcity ticker to create urgency!',
      points: 10,
      completed: hasScarcity,
      category: 'urgency',
    });
    if (hasScarcity) score += 10;

    // Subheading check (10 pts)
    const hasSubheading = config.content.heroSubheading.length >= 10;
    tips.push({
      id: 'subheading',
      message: hasSubheading
        ? '✓ Your subheading explains your value!'
        : 'Add a subheading to explain what makes you special!',
      points: 10,
      completed: hasSubheading,
      category: 'content',
    });
    if (hasSubheading) score += 10;

    // Multiple products check (15 pts)
    const hasMultipleProducts = config.content.products.length >= 2;
    tips.push({
      id: 'products',
      message: hasMultipleProducts
        ? '✓ Options give customers choice!'
        : 'Add multiple product options to increase sales!',
      points: 15,
      completed: hasMultipleProducts,
      category: 'content',
    });
    if (hasMultipleProducts) score += 15;

    // Determine level
    let level: 'beginner' | 'pro' | 'master' = 'beginner';
    if (score >= 70) level = 'master';
    else if (score >= 40) level = 'pro';

    // Celebration at 100
    const celebrationTriggered = score === 100;

    return {
      score,
      tips,
      level,
      celebrationTriggered,
    };
  }, [config]);
}
