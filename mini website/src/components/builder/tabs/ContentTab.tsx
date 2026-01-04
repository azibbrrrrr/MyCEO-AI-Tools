import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus, Trash2, Star, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { UseSiteConfigReturn } from '@/hooks/useSiteConfig';

interface ContentTabProps {
  siteConfig: UseSiteConfigReturn;
}

const magicHeadings = [
  "You Won't Believe How Good This Is!",
  "The Secret Everyone's Talking About",
  "Transform Your Day with This",
  "Finally, Something That Actually Works",
  "Get Ready to Be Amazed!",
];

const magicSubheadings = [
  "Join thousands of happy customers today",
  "Made with love, delivered with care",
  "Quality you can taste/feel/see",
  "Your new favorite thing awaits",
  "Because you deserve the best",
];

export const ContentTab = ({ siteConfig }: ContentTabProps) => {
  const { config, setContent, addReview, removeReview } = siteConfig;
  const [newReview, setNewReview] = useState({ name: '', rating: 5, text: '' });

  const handleMagicHeading = () => {
    const random = magicHeadings[Math.floor(Math.random() * magicHeadings.length)];
    setContent('heroHeading', random);
  };

  const handleMagicSubheading = () => {
    const random = magicSubheadings[Math.floor(Math.random() * magicSubheadings.length)];
    setContent('heroSubheading', random);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setContent('heroImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddReview = () => {
    if (newReview.name && newReview.text) {
      addReview(newReview);
      setNewReview({ name: '', rating: 5, text: '' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Content */}
      <div>
        <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
          🎯 Hero Content
        </h3>

        <div className="space-y-4">
          {/* Heading */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label className="text-sm">Headline</Label>
              <button
                onClick={handleMagicHeading}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Sparkles className="w-3 h-3" />
                Magic Write
              </button>
            </div>
            <Input
              value={config.content.heroHeading}
              onChange={(e) => setContent('heroHeading', e.target.value)}
              placeholder="Your catchy headline..."
              className="text-sm"
            />
          </div>

          {/* Subheading */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label className="text-sm">Subheading</Label>
              <button
                onClick={handleMagicSubheading}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Sparkles className="w-3 h-3" />
                Magic Write
              </button>
            </div>
            <Textarea
              value={config.content.heroSubheading}
              onChange={(e) => setContent('heroSubheading', e.target.value)}
              placeholder="Explain your value..."
              className="text-sm resize-none"
              rows={2}
            />
          </div>

          {/* Hero Image */}
          <div>
            <Label className="text-sm mb-1.5 block">Hero Image</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
              {config.content.heroImage ? (
                <div className="relative">
                  <img
                    src={config.content.heroImage}
                    alt="Hero"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setContent('heroImage', null)}
                    className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload image
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scarcity */}
      <div>
        <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
          ⏰ Urgency Settings
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Enable Scarcity Bar</Label>
            <Switch
              checked={config.content.scarcityEnabled}
              onCheckedChange={(checked) => setContent('scarcityEnabled', checked)}
            />
          </div>

          {config.bossMode && config.content.scarcityEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <Label className="text-sm mb-1.5 block">Scarcity Text</Label>
              <Input
                value={config.content.scarcityText}
                onChange={(e) => setContent('scarcityText', e.target.value)}
                placeholder="Only 3 left!"
                className="text-sm"
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div>
        <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
          ⭐ Customer Reviews
        </h3>

        <div className="space-y-3">
          {/* Existing reviews */}
          {config.content.reviews.map((review) => (
            <motion.div
              key={review.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-muted rounded-lg p-3 relative"
            >
              <button
                onClick={() => removeReview(review.id)}
                className="absolute top-2 right-2 p-1 hover:bg-destructive/10 rounded"
              >
                <Trash2 className="w-3 h-3 text-destructive" />
              </button>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs font-medium">{review.name}</p>
              <p className="text-xs text-muted-foreground">{review.text}</p>
            </motion.div>
          ))}

          {/* Add new review */}
          <div className="border rounded-lg p-3 space-y-2">
            <Input
              value={newReview.name}
              onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
              placeholder="Customer name..."
              className="text-sm"
            />
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setNewReview({ ...newReview, rating })}
                >
                  <Star
                    className={`w-5 h-5 transition-colors ${
                      rating <= newReview.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground hover:text-yellow-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <Textarea
              value={newReview.text}
              onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
              placeholder="What did they say?"
              className="text-sm resize-none"
              rows={2}
            />
            <Button
              onClick={handleAddReview}
              size="sm"
              className="w-full"
              disabled={!newReview.name || !newReview.text}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Review
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
