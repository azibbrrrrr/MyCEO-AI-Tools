import { useState, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Star, Edit2, Save, X, ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { UseSiteConfigReturn } from '@/hooks/useSiteConfig';

const ImageUploader = ({ 
  label, 
  value, 
  onChange, 
  id 
}: { 
  label: string; 
  value: string | null; 
  onChange: (value: string | null) => void; 
  id: string; 
}) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-1.5 pt-2">
      <Label htmlFor={id} className="text-xs font-medium text-gray-700 block">{label}</Label>
      <div className="relative group">
        <div className={`
          border-2 border-dashed border-gray-300 rounded-lg p-4 text-center 
          hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer relative
          ${value ? 'bg-blue-50/30' : 'bg-white'}
        `}>
          <input 
            id={id}
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          
          {value ? (
            <div className="relative">
              <img src={value} alt="Preview" className="h-28 mx-auto object-cover rounded-md shadow-sm border border-gray-200" />
              <p className="mt-2 text-[10px] text-blue-600 font-medium">Click to change image</p>
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center py-2 text-gray-400">
               <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
               <span className="text-sm text-gray-500">Click to upload image</span>
            </div>
          )}
        </div>
        
        {value && (
          <button 
             onClick={(e) => {
               e.preventDefault();
               onChange(null);
             }}
             className="absolute top-2 right-2 p-1.5 bg-white shadow-sm border border-gray-200 rounded-md text-gray-400 hover:text-red-500 hover:border-red-200 z-20 transition-all"
             title="Remove image"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

const HeroEditor = ({ siteConfig }: { siteConfig: UseSiteConfigReturn }) => {
  const { config, setContent } = siteConfig;

  return (
    <section>
      <div className="space-y-4">
        <div>
          <Label htmlFor="heading" className="text-xs font-medium text-gray-700 mb-1.5 block">Heading</Label>
          <Input
            id="heading"
            value={config.content.heroHeading}
            onChange={(e) => setContent('heroHeading', e.target.value)}
            placeholder="Your awesome headline"
            className="bg-white border-gray-300 rounded-md focus-visible:ring-2 focus-visible:ring-blue-500 shadow-sm"
          />
        </div>
        <div>
          <Label htmlFor="subheading" className="text-xs font-medium text-gray-700 mb-1.5 block">Subheading</Label>
          <Textarea
            id="subheading"
            value={config.content.heroSubheading}
            onChange={(e) => setContent('heroSubheading', e.target.value)}
            placeholder="Tell people what makes you special"
            className="resize-none bg-white border-gray-300 rounded-md focus-visible:ring-2 focus-visible:ring-blue-500 shadow-sm min-h-[80px]"
            rows={3}
          />
        </div>

        {/* Hero Images */}
        <div className="space-y-4">
           <ImageUploader 
             id="hero-image"
             label="Hero Image"
             value={config.content.heroImage}
             onChange={(val) => setContent('heroImage', val)}
           />
           
           {config.layouts.hero === 'beforeAfter' && (
             <ImageUploader 
               id="hero-before-image"
               label="Before Image (for slider)"
               value={config.content.heroBeforeImage}
               onChange={(val) => setContent('heroBeforeImage', val)}
             />
           )}
        </div>
      </div>
    </section>
  );
};

const FeaturesEditor = ({ siteConfig }: { siteConfig: UseSiteConfigReturn }) => {
  const { config, addFeature, updateFeature, removeFeature } = siteConfig;
  const [editingFeature, setEditingFeature] = useState<number | null>(null);

  return (
    <section>
      <div className="space-y-3">
        {config.content.features.map((feature, index) => (
          <motion.div
            key={index}
            layout
            className="group p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
          >
            {editingFeature === index ? (
              <div className="space-y-3">
                <Input
                  value={feature.title}
                  onChange={(e) => updateFeature(index, { title: e.target.value })}
                  placeholder="Feature title"
                  className="text-sm bg-white border-gray-300"
                  autoFocus
                />
                <Input
                  value={feature.description}
                  onChange={(e) => updateFeature(index, { description: e.target.value })}
                  placeholder="Feature description"
                  className="text-sm bg-white border-gray-300"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingFeature(null)}
                    className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <Save className="w-3 h-3" /> Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate mb-0.5">{feature.title}</p>
                  <p className="text-xs text-gray-500 truncate">{feature.description}</p>
                </div>
                <div className="flex gap-1 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingFeature(index)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Edit feature"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeFeature(index)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete feature"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
        <button
          onClick={() => addFeature({ title: 'New Feature', description: 'Description here' })}
          className="w-full py-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Add Feature
        </button>
      </div>
    </section>
  );
};

const ProductsEditor = ({ siteConfig }: { siteConfig: UseSiteConfigReturn }) => {
  const { config, addProduct, updateProduct, removeProduct } = siteConfig;
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  return (
    <section>
      <div className="space-y-3">
        {config.content.products.map((product) => (
          <motion.div
            key={product.id}
            layout
            className="group p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
          >
            {editingProduct === product.id ? (
              <div className="space-y-3">
                <Input
                  value={product.name}
                  onChange={(e) => updateProduct(product.id, { name: e.target.value })}
                  placeholder="Product name"
                  className="text-sm bg-white border-gray-300"
                  autoFocus
                />
                <ImageUploader 
                  id={`product-image-${product.id}`}
                  label="Product Image"
                  value={product.image || null}
                  onChange={(val) => updateProduct(product.id, { image: val || undefined })}
                />
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label className="text-[10px] text-gray-500 mb-1 block">Price</Label>
                    <Input
                      type="number"
                      value={product.price}
                      onChange={(e) => updateProduct(product.id, { price: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      className="text-sm bg-white border-gray-300"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-[10px] text-gray-500 mb-1 block">Original (Optional)</Label>
                    <Input
                      type="number"
                      value={product.originalPrice || ''}
                      onChange={(e) => updateProduct(product.id, { originalPrice: parseFloat(e.target.value) || undefined })}
                      placeholder="0.00"
                      className="text-sm bg-white border-gray-300"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <Save className="w-3 h-3" /> Save Changes
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate mb-1">{product.name}</p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="font-bold text-gray-900">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through decoration-gray-400">${product.originalPrice}</span>
                    )}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingProduct(product.id)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Edit product"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
        <button
          onClick={() => addProduct({ name: 'New Product', price: 19 })}
          className="w-full py-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>
    </section>
  );
};

const ReviewsEditor = ({ siteConfig }: { siteConfig: UseSiteConfigReturn }) => {
  const { config, addReview, updateReview, removeReview } = siteConfig;
  const [editingReview, setEditingReview] = useState<string | null>(null);

  return (
    <section>
      <div className="space-y-3">
        {config.content.reviews.map((review) => (
          <motion.div
            key={review.id}
            layout
            className="group p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all relative"
          >
            {editingReview === review.id ? (
              <div className="space-y-3">
                <Input
                  value={review.name}
                  onChange={(e) => updateReview(review.id, { name: e.target.value })}
                  placeholder="Reviewer Name"
                  className="text-sm border-gray-300"
                  autoFocus
                />
                <Textarea
                  value={review.text}
                  onChange={(e) => updateReview(review.id, { text: e.target.value })}
                  placeholder="Review Text"
                  className="text-sm border-gray-300 min-h-[60px]"
                />
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Label className="text-xs text-gray-500">Rating:</Label>
                      <select
                        value={review.rating}
                        onChange={(e) => updateReview(review.id, { rating: Number(e.target.value) })}
                        className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                      >
                        {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                      </select>
                   </div>
                </div>

                <ImageUploader 
                  id={`review-image-${review.id}`}
                  label="Review/Showcase Image"
                  value={review.image || null}
                  onChange={(val) => updateReview(review.id, { image: val || undefined })}
                />

                <button
                  onClick={() => setEditingReview(null)}
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <Save className="w-3 h-3" /> Save Changes
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-100'}`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-1 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingReview(review.id)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit review"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeReview(review.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      title="Remove review"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                   {review.image && (
                     <img src={review.image} alt={review.name} className="w-10 h-10 rounded-full object-cover border border-gray-100 shrink-0" />
                   )}
                   <div>
                      <p className="text-sm font-semibold text-gray-900 mb-0.5">{review.name}</p>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{review.text}</p>
                   </div>
                </div>
              </>
            )}
          </motion.div>
        ))}
        <button
          onClick={() => addReview({ name: 'Happy Customer', rating: 5, text: 'Great product and fast delivery!' })}
          className="w-full py-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Add Review
        </button>
      </div>
    </section>
  );
};

const CTAEditor = ({ siteConfig }: { siteConfig: UseSiteConfigReturn }) => {
  const { config, setContent } = siteConfig;

  return (
    <div className="space-y-8">
      {/* Scarcity Bar */}
      <section>
        <h3 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">
          ⚡ Urgency Bar
        </h3>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Label htmlFor="scarcity" className="text-sm font-medium text-gray-700">Show urgency bar</Label>
            <Switch
              id="scarcity"
              checked={config.content.scarcityEnabled}
              onCheckedChange={(checked) => setContent('scarcityEnabled', checked)}
            />
          </div>
          {config.content.scarcityEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Input
                value={config.content.scarcityText}
                onChange={(e) => setContent('scarcityText', e.target.value)}
                placeholder="e.g. Only 3 left at this price!"
                className="bg-white border-gray-300 rounded-md focus-visible:ring-2 focus-visible:ring-blue-500 shadow-sm"
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <h3 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">
          🚀 Call to Action
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="ctaHeading" className="text-xs font-medium text-gray-700 mb-1.5 block">Heading</Label>
            <Input
              id="ctaHeading"
              value={config.content.ctaHeading}
              onChange={(e) => setContent('ctaHeading', e.target.value)}
              placeholder="Ready to Order?"
              className="bg-white border-gray-300 rounded-md focus-visible:ring-2 focus-visible:ring-blue-500 shadow-sm"
            />
          </div>
          <div>
            <Label htmlFor="ctaSubtext" className="text-xs font-medium text-gray-700 mb-1.5 block">Subtext</Label>
            <Textarea
              id="ctaSubtext"
              value={config.content.ctaSubtext}
              onChange={(e) => setContent('ctaSubtext', e.target.value)}
              placeholder="Don't miss out on this amazing offer..."
              className="resize-none bg-white border-gray-300 rounded-md focus-visible:ring-2 focus-visible:ring-blue-500 shadow-sm min-h-[60px]"
              rows={2}
            />
          </div>

          {/* CTA Buttons */}
          <div>
            <Label className="text-xs font-medium text-gray-700 mb-2 block">CTA Buttons</Label>
            <div className="space-y-3">
              {config.content.ctaButtons.map((button) => (
                <motion.div
                  key={button.id}
                  layout
                  className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-600">
                      {button.isPrimary ? '✨ Primary Button' : '🔘 Secondary Button'}
                    </span>
                    {!button.isPrimary && (
                      <button
                        onClick={() => {
                          const newButtons = config.content.ctaButtons.filter(b => b.id !== button.id);
                          setContent('ctaButtons', newButtons);
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Action Type */}
                  <div className="mb-3">
                    <Label className="text-[10px] text-gray-500 mb-1 block">Action Type</Label>
                    <select
                      value={button.type}
                      onChange={(e) => {
                        const newType = e.target.value as typeof button.type;
                        const defaults: Record<typeof button.type, { text: string; placeholder: string }> = {
                          shop: { text: 'Order Now', placeholder: 'https://your-shop.com' },
                          whatsapp: { text: 'Chat on WhatsApp', placeholder: '60123456789' },
                          email: { text: 'Email Us', placeholder: 'hello@example.com' },
                          phone: { text: 'Call Us', placeholder: '60123456789' },
                          custom: { text: 'Learn More', placeholder: 'https://example.com' },
                        };
                        const newButtons = config.content.ctaButtons.map(b =>
                          b.id === button.id ? { ...b, type: newType, text: defaults[newType].text, value: '' } : b
                        );
                        setContent('ctaButtons', newButtons);
                      }}
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="shop">🛒 Buy Now / Shop Link</option>
                      <option value="whatsapp">💬 WhatsApp</option>
                      <option value="email">📧 Email</option>
                      <option value="phone">📞 Phone Call</option>
                      <option value="custom">🔗 Custom Link</option>
                    </select>
                  </div>

                  {/* Button Text */}
                  <div className="mb-3">
                    <Label className="text-[10px] text-gray-500 mb-1 block">Button Text</Label>
                    <Input
                      value={button.text}
                      onChange={(e) => {
                        const newButtons = config.content.ctaButtons.map(b =>
                          b.id === button.id ? { ...b, text: e.target.value } : b
                        );
                        setContent('ctaButtons', newButtons);
                      }}
                      placeholder="Order Now"
                      className="text-sm bg-white border-gray-300"
                    />
                  </div>

                  {/* Link/Value with smart prefix */}
                  <div>
                    <Label className="text-[10px] text-gray-500 mb-1 block">
                      {button.type === 'whatsapp' && '📱 Phone Number (without +)'}
                      {button.type === 'email' && '📧 Email Address'}
                      {button.type === 'phone' && '📞 Phone Number'}
                      {button.type === 'shop' && '🔗 Shop URL'}
                      {button.type === 'custom' && '🔗 Link URL'}
                    </Label>
                    <div className="flex items-center gap-1">
                      {button.type === 'whatsapp' && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-2 rounded-l border border-r-0 border-gray-300">wa.me/</span>
                      )}
                      {button.type === 'email' && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-2 rounded-l border border-r-0 border-gray-300">mailto:</span>
                      )}
                      {button.type === 'phone' && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-2 rounded-l border border-r-0 border-gray-300">tel:</span>
                      )}
                      <Input
                        value={button.value}
                        onChange={(e) => {
                          const newButtons = config.content.ctaButtons.map(b =>
                            b.id === button.id ? { ...b, value: e.target.value } : b
                          );
                          setContent('ctaButtons', newButtons);
                        }}
                        placeholder={
                          button.type === 'whatsapp' ? '60123456789' :
                          button.type === 'email' ? 'hello@example.com' :
                          button.type === 'phone' ? '60123456789' :
                          'https://example.com'
                        }
                        className={`text-sm bg-white border-gray-300 flex-1 ${
                          ['whatsapp', 'email', 'phone'].includes(button.type) ? 'rounded-l-none' : ''
                        }`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Add Secondary Button */}
              {config.content.ctaButtons.length < 2 && (
                <button
                  onClick={() => {
                    const newButton = {
                      id: `cta${Date.now()}`,
                      type: 'whatsapp' as const,
                      text: 'Chat on WhatsApp',
                      value: '',
                      isPrimary: false,
                    };
                    setContent('ctaButtons', [...config.content.ctaButtons, newButton]);
                  }}
                  className="w-full py-2.5 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" /> Add Secondary Button
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

interface ContentTabProps {
  siteConfig: UseSiteConfigReturn;
}

export const ContentTab = ({ siteConfig }: ContentTabProps) => {
  const [activeTab, setActiveTab] = useState('hero');

  const scrollToSection = (id: string) => {
    // Small timeout to allow state update if needed, though usually not strictly necessary for scroll
    setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 0);
  };

  const tabs = [
    { id: 'hero', label: 'Hero' },
    { id: 'features', label: 'Features' },
    { id: 'products', label: 'Products' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'cta', label: 'CTA' },
  ];

  return (
    <div className="p-1">
      <div className="flex items-center gap-1 p-1 bg-muted/20 rounded-lg mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
                setActiveTab(tab.id);
                // Map internal tab IDs to preview DOM IDs
                const mapping: Record<string, string> = {
                    'hero': 'preview-hero',
                    'features': 'preview-usp',
                    'products': 'preview-product',
                    'reviews': 'preview-social-proof',
                    'cta': 'preview-cta'
                };
                if (mapping[tab.id]) {
                    scrollToSection(mapping[tab.id]);
                }
            }}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'hero' && <HeroEditor siteConfig={siteConfig} />}
            {activeTab === 'features' && <FeaturesEditor siteConfig={siteConfig} />}
            {activeTab === 'products' && <ProductsEditor siteConfig={siteConfig} />}
            {activeTab === 'reviews' && <ReviewsEditor siteConfig={siteConfig} />}
            {activeTab === 'cta' && <CTAEditor siteConfig={siteConfig} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
