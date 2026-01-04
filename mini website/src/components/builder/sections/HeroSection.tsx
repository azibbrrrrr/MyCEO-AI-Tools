import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { DndContext, DragEndEvent, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Award, BadgeCheck, Hand, Clock, Sparkles, Star, Heart, Zap, ImageIcon } from 'lucide-react';
import type { SiteConfig, UseSiteConfigReturn, Sticker } from '@/hooks/useSiteConfig';
import { SpicyAnimation } from '../SpicyAnimations';

interface HeroSectionProps {
  config: SiteConfig;
  siteConfig: UseSiteConfigReturn;
  isMobile: boolean;
}

const stickerIcons: Record<Sticker['type'], typeof Award> = {
  'best-seller': Award,
  'halal': BadgeCheck,
  'handmade': Hand,
  'limited': Clock,
  'new': Zap,
  'sparkle': Sparkles,
  'star': Star,
  'heart': Heart,
};

const stickerColors: Record<Sticker['type'], string> = {
  'best-seller': 'bg-yellow-500',
  'halal': 'bg-green-500',
  'handmade': 'bg-amber-600',
  'limited': 'bg-red-500',
  'new': 'bg-blue-500',
  'sparkle': 'bg-purple-500',
  'star': 'bg-orange-500',
  'heart': 'bg-pink-500',
};

const stickerLabels: Record<Sticker['type'], string> = {
  'best-seller': 'Best Seller',
  'halal': 'Halal',
  'handmade': 'Handmade',
  'limited': 'Limited',
  'new': 'New!',
  'sparkle': '✨',
  'star': '⭐ 5 Star',
  'heart': '❤️ Loved',
};

const DraggableSticker = ({ sticker }: { sticker: Sticker }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: sticker.id,
  });

  const Icon = stickerIcons[sticker.type];
  const color = stickerColors[sticker.type];
  const label = stickerLabels[sticker.type];

  const style = {
    transform: CSS.Translate.toString(transform),
    left: `${sticker.x}%`,
    top: `${sticker.y}%`,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      className={`absolute px-2 py-1 ${color} text-white text-xs font-bold rounded-full shadow-lg cursor-grab active:cursor-grabbing flex items-center gap-1 z-20 ${
        isDragging ? 'opacity-80 scale-110' : ''
      }`}
    >
      <Icon className="w-3 h-3" />
      <span>{label}</span>
    </motion.div>
  );
};

export const HeroSection = ({ config, siteConfig, isMobile }: HeroSectionProps) => {
  const { updateSticker } = siteConfig;
  const containerRef = useRef<HTMLDivElement>(null);
  const variant = config.layouts.hero;
  const cornerRadius = config.styles.cornerRadius;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const sticker = config.content.stickers.find(s => s.id === active.id);
    if (!sticker || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const deltaXPercent = (delta.x / rect.width) * 100;
    const deltaYPercent = (delta.y / rect.height) * 100;

    const newX = Math.max(0, Math.min(90, sticker.x + deltaXPercent));
    const newY = Math.max(0, Math.min(85, sticker.y + deltaYPercent));

    updateSticker(sticker.id, { x: newX, y: newY });
  };

  const buttonClasses = getButtonClasses(config.styles.buttonStyle, cornerRadius);

  // Split Layout
  if (variant === 'split') {
    return (
      <DndContext onDragEnd={handleDragEnd}>
        <section className={`py-12 px-6 ${isMobile ? '' : 'md:py-20 md:px-12'}`}>
          <div className={`flex flex-col ${isMobile ? '' : 'md:flex-row'} items-center gap-8`}>
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 text-center md:text-left"
            >
              <h1 className={`text-3xl ${isMobile ? '' : 'md:text-5xl'} font-bold mb-4 text-foreground`}>
                {config.content.heroHeading || 'Your Amazing Headline'}
              </h1>
              <p className={`text-lg ${isMobile ? '' : 'md:text-xl'} text-muted-foreground mb-6`}>
                {config.content.heroSubheading || 'Add a catchy subheading here'}
              </p>
              <button className={buttonClasses}>
                Shop Now →
              </button>
            </motion.div>

            {/* Image */}
            <motion.div
              ref={containerRef}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex-1 relative aspect-square max-w-md w-full bg-gradient-to-br from-primary/20 to-secondary/20 ${cornerRadius} overflow-hidden`}
            >
              {config.content.heroImage ? (
                <img
                  src={config.content.heroImage}
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-muted-foreground/50" />
                </div>
              )}
              <SpicyAnimation type={config.businessType} className="absolute inset-0" />
              {config.content.stickers.map(sticker => (
                <DraggableSticker key={sticker.id} sticker={sticker} />
              ))}
            </motion.div>
          </div>
        </section>
      </DndContext>
    );
  }

  // Poster Layout
  if (variant === 'poster') {
    return (
      <DndContext onDragEnd={handleDragEnd}>
        <section
          ref={containerRef}
          className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: config.content.heroImage
              ? `url(${config.content.heroImage})`
              : 'linear-gradient(135deg, hsl(var(--primary)/0.3), hsl(var(--secondary)/0.3))',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <SpicyAnimation type={config.businessType} className="absolute inset-0 z-10" />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-20 text-center text-white px-6"
          >
            <h1 className={`text-4xl ${isMobile ? '' : 'md:text-6xl'} font-bold mb-4 drop-shadow-lg`}>
              {config.content.heroHeading || 'Your Amazing Headline'}
            </h1>
            <p className={`text-xl ${isMobile ? '' : 'md:text-2xl'} mb-8 opacity-90`}>
              {config.content.heroSubheading || 'Add a catchy subheading here'}
            </p>
            <button className={`${buttonClasses} bg-white text-foreground hover:bg-white/90`}>
              Shop Now →
            </button>
          </motion.div>

          {config.content.stickers.map(sticker => (
            <DraggableSticker key={sticker.id} sticker={sticker} />
          ))}
        </section>
      </DndContext>
    );
  }

  // Minimal Layout
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <section className="py-16 px-6 text-center" ref={containerRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={`text-3xl ${isMobile ? '' : 'md:text-5xl'} font-bold mb-4 text-foreground`}>
            {config.content.heroHeading || 'Your Amazing Headline'}
          </h1>
          <p className={`text-lg text-muted-foreground mb-8 max-w-xl mx-auto`}>
            {config.content.heroSubheading || 'Add a catchy subheading here'}
          </p>
          
          <div className={`relative w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-primary/20 to-secondary/20 ${cornerRadius} overflow-hidden`}>
            {config.content.heroImage ? (
              <img
                src={config.content.heroImage}
                alt="Hero"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
              </div>
            )}
            <SpicyAnimation type={config.businessType} className="absolute inset-0" />
          </div>

          <button className={buttonClasses}>
            Shop Now →
          </button>
        </motion.div>

        {config.content.stickers.map(sticker => (
          <DraggableSticker key={sticker.id} sticker={sticker} />
        ))}
      </section>
    </DndContext>
  );
};

function getButtonClasses(style: SiteConfig['styles']['buttonStyle'], radius: SiteConfig['styles']['cornerRadius']) {
  const base = `px-6 py-3 font-semibold transition-all ${radius}`;
  
  if (style === 'solid') {
    return `${base} bg-primary text-primary-foreground hover:opacity-90`;
  }
  if (style === 'outline') {
    return `${base} border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground`;
  }
  return `${base} bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:-translate-y-1 hover:shadow-xl`;
}
