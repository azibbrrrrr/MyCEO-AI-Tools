import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import type { SiteConfig } from '@/hooks/useSiteConfig';

interface SocialProofSectionProps {
  config: SiteConfig;
  isMobile: boolean;
}

export const SocialProofSection = ({ config, isMobile }: SocialProofSectionProps) => {
  const reviews = config.content.reviews;
  const cornerRadius = config.styles.cornerRadius;

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold mb-2">What People Say 💬</h2>
        <div className="flex items-center justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="ml-2 text-muted-foreground">
            {reviews.length} happy customers
          </span>
        </div>
      </motion.div>

      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-6'} max-w-3xl mx-auto`}>
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-6 bg-muted/50 ${cornerRadius}`}
          >
            <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />
            
            {/* Stars */}
            <div className="flex items-center gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>

            {/* Review text */}
            <p className="text-sm mb-4 text-foreground/80 italic">
              "{review.text}"
            </p>

            {/* Reviewer */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                {review.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-sm">{review.name}</p>
                <p className="text-xs text-muted-foreground">Verified Buyer ✓</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
