import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Star, Edit2, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { UseSiteConfigReturn } from '@/hooks/useSiteConfig';

interface ContentTabProps {
  siteConfig: UseSiteConfigReturn;
}

export const ContentTab = ({ siteConfig }: ContentTabProps) => {
  const { config, setContent, addReview, removeReview, addFeature, updateFeature, removeFeature, addProduct, updateProduct, removeProduct } = siteConfig;
  const [editingFeature, setEditingFeature] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  return (
    <div className="space-y-8 p-1">
      {/* Hero Content */}
      <section>
        <h3 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">
          🎯 Hero Section
        </h3>
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
        </div>
      </section>

      {/* Features/USP */}
      <section>
        <h3 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">
          ✨ Features
        </h3>
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

      {/* Products */}
      <section>
        <h3 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">
          🛍️ Products
        </h3>
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

      {/* Reviews */}
      <section>
        <h3 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">
          ⭐ Reviews
        </h3>
        <div className="space-y-3">
          {config.content.reviews.map((review) => (
            <motion.div
              key={review.id}
              layout
              className="group p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all relative"
            >
              <button
                onClick={() => removeReview(review.id)}
                className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                title="Remove review"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-100'}`}
                  />
                ))}
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">{review.name}</p>
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{review.text}</p>
            </motion.div>
          ))}
          <button
            onClick={() => addReview({ name: 'Customer', rating: 5, text: 'Great product!' })}
            className="w-full py-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add Review
          </button>
        </div>
      </section>

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
