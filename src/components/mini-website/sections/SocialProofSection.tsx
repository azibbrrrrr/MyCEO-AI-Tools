import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, MessageCircle, ImageIcon } from 'lucide-react';
import type { SiteConfig } from '@/hooks/useSiteConfig';

interface SocialProofSectionProps {
  config: SiteConfig;
  isMobile: boolean;
}

// Cards variant (default)
const CardsProof = ({ config }: SocialProofSectionProps) => {
  const reviews = config.content.reviews;
  if (reviews.length === 0) return null;
  
  return (
    <section className="section-padding px-6 bg-muted/30">
      <h2 className="text-2xl font-bold text-center mb-8">What Customers Say ⭐</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {reviews.map((review) => (
          <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
              ))}
            </div>
            <p className="text-foreground mb-4">"{review.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                {review.name.charAt(0).toUpperCase()}
              </div>
              <p className="font-semibold text-sm">{review.name}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// Grid variant
const GridProof = ({ config, isMobile }: SocialProofSectionProps) => {
  const reviews = config.content.reviews;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  if (reviews.length === 0) return null;
  
  return (
    <section className="section-padding px-6 bg-muted/30">
      <h2 className="text-2xl font-light text-center mb-8">#CustomerLove 💕</h2>
      <div className={`grid grid-cols-2 ${isMobile ? 'gap-1' : 'md:grid-cols-4 gap-1'} max-w-4xl mx-auto`}>
        {[...reviews, ...reviews].slice(0, 8).map((review, index) => (
          <motion.div key={index} className="aspect-square relative overflow-hidden cursor-pointer" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="text-4xl">💎</span>
            </div>
            <motion.div animate={{ opacity: hoveredIndex === index ? 1 : 0 }} className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center gap-1"><Heart className="w-5 h-5 fill-white" /><span className="text-sm font-semibold">{100 + index * 23}</span></div>
                <div className="flex items-center gap-1"><MessageCircle className="w-5 h-5" /><span className="text-sm font-semibold">{10 + index * 3}</span></div>
              </div>
              <p className="text-xs text-center line-clamp-2">"{review.text}"</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// Chat bubbles variant
const ChatBubblesProof = ({ config }: SocialProofSectionProps) => {
  const reviews = config.content.reviews;
  if (reviews.length === 0) return null;
  
  return (
    <section className="section-padding px-6 bg-gradient-to-b from-purple-100 to-pink-100">
      <h2 className="text-2xl font-bold text-center mb-8">What People Say 💬</h2>
      <div className="max-w-2xl mx-auto space-y-8">
        {reviews.map((review, index) => {
          const isLeft = index % 2 === 0;
          return (
            <motion.div key={review.id} initial={{ opacity: 0, x: isLeft ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className={`flex items-end gap-3 ${isLeft ? '' : 'flex-row-reverse'}`}>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0 border-4 border-white">
                {review.name.charAt(0).toUpperCase()}
              </div>
              <div className={`relative max-w-md ${isLeft ? '' : 'text-right'}`}>
                <div className={`bg-white p-5 rounded-2xl shadow-lg ${isLeft ? 'rounded-bl-none' : 'rounded-br-none'}`}>
                  <div className={`flex items-center gap-1 mb-2 ${isLeft ? '' : 'justify-end'}`}>
                    {[...Array(review.rating)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />))}
                  </div>
                  <p className="text-foreground">{review.text}</p>
                </div>
                <p className={`text-xs text-muted-foreground mt-2 ${isLeft ? '' : 'text-right'}`}>{review.name} 🌟</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

// Gallery variant
const GalleryProof = ({ config, isMobile }: SocialProofSectionProps) => {
  const reviews = config.content.reviews;
  if (reviews.length === 0) return null;
  
  return (
    <section className="section-padding px-6 bg-muted/50">
      <h2 className="text-2xl font-bold text-center mb-8">Customer Showcase 🏆</h2>
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-2 lg:grid-cols-3 gap-6'} max-w-5xl mx-auto`}>
        {reviews.map((review) => (
          <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
              <div className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">VERIFIED ✓</div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">{review.name.charAt(0).toUpperCase()}</div>
                <p className="font-semibold text-sm">{review.name}</p>
              </div>
              <p className="text-sm text-muted-foreground mb-3">"{review.text}"</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export const SocialProofSection = ({ config, isMobile }: SocialProofSectionProps) => {
  const variant = config.layouts.socialProof;
  const props = { config, isMobile };

  switch (variant) {
    case 'grid': return <GridProof {...props} />;
    case 'chatBubbles': return <ChatBubblesProof {...props} />;
    case 'gallery': return <GalleryProof {...props} />;
    case 'cards': return <CardsProof {...props} />;
    default: return <CardsProof {...props} />;
  }
};
