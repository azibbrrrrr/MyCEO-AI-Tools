import type { Product, Review } from '@/hooks/useSiteConfig';

export const QUEST_DEFAULT_SHOP_NAME = 'My Shop';

export const QUEST_PRODUCT_TEMPLATES: Product[] = [
  { id: 'q-product-1', name: 'My Best Seller', price: 10 },
  { id: 'q-product-2', name: 'Special Bundle', price: 15 },
];

export const QUEST_REVIEW_TEMPLATES: Review[] = [
  {
    id: 'q-review-1',
    name: 'Happy Customer',
    rating: 5,
    text: 'Sedap sangat! Will buy again!',
  },
  {
    id: 'q-review-2',
    name: 'Satisfied Buyer',
    rating: 5,
    text: 'Fast delivery, nice packaging!',
  },
  {
    id: 'q-review-3',
    name: 'Loyal Fan',
    rating: 5,
    text: 'Best in class, 10/10!',
  },
];
