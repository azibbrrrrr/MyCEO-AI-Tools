import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Package, Sparkles, Plus, Equal, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import type { SiteConfig } from '@/hooks/useSiteConfig';

interface ProductSectionProps {
  config: SiteConfig;
  isMobile: boolean;
}

function getButtonClasses(style: SiteConfig['styles']['buttonStyle'], radius: SiteConfig['styles']['cornerRadius']) {
  const base = `w-full px-4 py-2 font-semibold transition-all ${radius}`;
  if (style === 'solid') {
    return `${base} bg-primary text-primary-foreground hover:opacity-90`;
  }
  if (style === 'outline') {
    return `${base} border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground`;
  }
  return `${base} bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:-translate-y-1`;
}

// Grid variant
const GridProduct = ({ config, isMobile }: ProductSectionProps) => {
  const products = config.content.products;
  const cornerRadius = config.styles.cornerRadius;
  const buttonClasses = getButtonClasses(config.styles.buttonStyle, cornerRadius);
  
  return (
    <section className="section-padding px-6 bg-background">
      <h2 className="text-2xl font-bold text-center mb-8">Our Products</h2>
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 md:grid-cols-3 gap-6'} max-w-4xl mx-auto`}>
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`bg-card ${cornerRadius} overflow-hidden shadow-md hover:shadow-xl transition-shadow`}
          >
            <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <Package className="w-12 h-12 text-primary/40" />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">{product.name}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-primary">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                )}
              </div>
              <button className={buttonClasses}>Add to Cart</button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// Carousel variant
const CarouselProduct = ({ config }: ProductSectionProps) => {
  const products = config.content.products;
  const scrollRef = useRef<HTMLDivElement>(null);
  const cornerRadius = config.styles.cornerRadius;
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <section className="section-padding px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between px-6 mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className="p-2 rounded-full border hover:bg-muted transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scroll('right')} className="p-2 rounded-full border hover:bg-muted transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 pb-4" style={{ scrollbarWidth: 'none' }}>
          {products.map((product, index) => (
            <motion.div key={index} className={`flex-none w-64 snap-center bg-card ${cornerRadius} overflow-hidden shadow-md`}>
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-10 h-10 text-primary/40" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium">{product.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-semibold">${product.price}</span>
                  {product.originalPrice && <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Bundle variant
const BundleProduct = ({ config, isMobile }: ProductSectionProps) => {
  const products = config.content.products;
  const cornerRadius = config.styles.cornerRadius;
  const buttonStyle = config.styles.buttonStyle;
  
  const totalOriginal = products.reduce((sum, p) => sum + (p.originalPrice || p.price), 0);
  const totalBundle = Math.round(products.reduce((sum, p) => sum + p.price, 0) * 0.8);
  const savings = totalOriginal - totalBundle;

  const buttonClasses = getButtonClasses(buttonStyle, cornerRadius);
  
  return (
    <section className="section-padding px-6 bg-gradient-to-b from-muted to-background">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-xs uppercase tracking-widest text-primary font-semibold">Complete Bundle</span>
        <h2 className="text-3xl font-bold mt-2 text-foreground mb-8">Everything You Need</h2>
        
        <div className={`bg-card ${cornerRadius} p-8 border border-border shadow-xl`}>
          <div className={`flex ${isMobile ? 'flex-col gap-4' : 'flex-row items-center justify-center gap-6'} mb-8`}>
            {products.map((product, index) => (
              <div key={product.id} className="flex items-center gap-4">
                <div className="w-24 h-24 bg-muted/50 rounded-xl flex items-center justify-center shadow-sm border border-border relative overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                {index < products.length - 1 && !isMobile && <Plus className="w-8 h-8 text-primary" />}
              </div>
            ))}
            {!isMobile && products.length > 1 && (
              <>
                <Equal className="w-8 h-8 text-primary" />
                <div className="w-32 h-32 bg-primary/10 rounded-xl flex items-center justify-center shadow-lg border-2 border-primary/20">
                  <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                </div>
              </>
            )}
          </div>
          
          <div className="text-foreground">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-2xl text-muted-foreground line-through">${totalOriginal}</span>
              <span className="text-5xl font-bold text-primary">${totalBundle}</span>
            </div>
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full font-semibold mb-6 animate-bounce-gentle">
              You Save ${savings}! 🎉
            </div>
            <button className={`${buttonClasses} w-full max-w-md mx-auto py-4 text-lg`}>
              Get the Bundle →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// List variant
const ListProduct = ({ config }: ProductSectionProps) => {
  const products = config.content.products;
  const cornerRadius = config.styles.cornerRadius;
  const buttonStyle = config.styles.buttonStyle;
  const buttonClasses = getButtonClasses(buttonStyle, cornerRadius);
  
  return (
    <section className="section-padding px-6 bg-muted/20">
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Our Menu</h2>
        <div className={`bg-card p-8 ${cornerRadius} shadow-lg border-4 border-double border-primary/20`}>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-end">
                {product.image && (
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-muted/20 mr-3 mb-1 shrink-0 border border-border/50">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <span className="font-semibold text-lg">{product.name}</span>
                <span className="flex-1 border-b border-dotted border-muted-foreground/30 mx-3 mb-1" />
                <div className="text-right">
                  {product.originalPrice && <span className="text-sm text-muted-foreground line-through mr-2">${product.originalPrice}</span>}
                  <span className="font-bold text-xl text-primary">${product.price}</span>
                </div>
              </div>
            ))}
          </div>
          <button className={`${buttonClasses} mt-8 w-full`}>
            Order Now
          </button>
        </div>
      </div>
    </section>
  );
};

// Comparison variant
const ComparisonProduct = ({ config, isMobile }: ProductSectionProps) => {
  const products = config.content.products.slice(0, 2);
  const cornerRadius = config.styles.cornerRadius;
  const buttonClasses = getButtonClasses(config.styles.buttonStyle, cornerRadius);
  
  return (
    <section className="section-padding px-6 bg-background">
      <h2 className="text-2xl font-bold text-center mb-8">Choose Your Plan</h2>
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-6'} max-w-3xl mx-auto`}>
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${cornerRadius} overflow-hidden shadow-lg ${
              index === 1 ? 'bg-primary text-primary-foreground ring-4 ring-primary/30' : 'bg-card'
            }`}
          >
            {index === 1 && <div className="bg-primary-foreground/20 text-center py-1 text-sm font-bold">MOST POPULAR</div>}
            <div className="p-6">
              {product.image && (
                <div className="mb-4 aspect-video rounded-md overflow-hidden bg-muted/20 border border-border/50">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">${product.price}</span>
                {product.originalPrice && <span className={`text-sm ml-2 ${index === 1 ? 'opacity-70' : 'text-muted-foreground'} line-through`}>${product.originalPrice}</span>}
              </div>
              <ul className="space-y-2 mb-6">
                {['Feature one', 'Feature two', 'Feature three'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4" /> {f}
                  </li>
                ))}
              </ul>
              <button className={index === 1 ? `w-full px-4 py-2 bg-primary-foreground text-primary font-semibold ${cornerRadius} hover:opacity-90 transition-opacity` : buttonClasses}>
                Get Started
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export const ProductSection = ({ config, isMobile }: ProductSectionProps) => {
  const variant = config.layouts.product;
  const props = { config, isMobile };

  switch (variant) {
    case 'grid': return <GridProduct {...props} />;
    case 'carousel': return <CarouselProduct {...props} />;
    case 'bundle': return <BundleProduct {...props} />;
    case 'list': return <ListProduct {...props} />;
    case 'comparison': return <ComparisonProduct {...props} />;
    default: return <GridProduct {...props} />;
  }
};
