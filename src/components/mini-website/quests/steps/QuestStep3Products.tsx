import { useRef } from 'react';
import type { UseSiteConfigReturn, Product } from '@/hooks/useSiteConfig';
import { useLanguage } from '@/components/language-provider';
import { useChildSession } from '@/hooks/useChildSession';
import { Input } from '@/components/ui/input';
import { QuestShell } from '../QuestShell';
import { QuestControls } from '../QuestControls';
import { QUEST_PRODUCT_TEMPLATES } from '@/lib/questTemplates';
import { sanitizeText } from '@/lib/questGuardrails';

interface QuestStepBaseProps {
  siteConfig: UseSiteConfigReturn;
  steps: { id: string; label: string }[];
  currentIndex: number;
  onStepSelect: (index: number) => void;
  onBack: () => void;
  onNext: () => void;
}

const cloneProducts = (products: Product[]) => products.map(product => ({ ...product }));

export const QuestStep3Products = ({
  siteConfig,
  steps,
  currentIndex,
  onStepSelect,
  onBack,
  onNext,
}: QuestStepBaseProps) => {
  const { config, setContent, addProduct, updateProduct } = siteConfig;
  const { language } = useLanguage();
  const { child } = useChildSession();

  const initialRef = useRef(cloneProducts(config.content.products));
  const previousRef = useRef(cloneProducts(config.content.products));

  const logoUrl = child?.companies?.[0]?.logo_url ?? null;

  const visibleProducts = config.content.products.slice(0, 2);

  const applyProducts = (next: Product[]) => {
    previousRef.current = cloneProducts(config.content.products);
    setContent('products', next);
  };

  const handleUndo = () => {
    const current = cloneProducts(config.content.products);
    setContent('products', previousRef.current);
    previousRef.current = current;
  };

  const handleReset = () => {
    previousRef.current = cloneProducts(config.content.products);
    setContent('products', initialRef.current);
  };

  const handleSkip = () => {
    if (config.content.products.length === 0) {
      const templates = QUEST_PRODUCT_TEMPLATES.map(product => ({
        ...product,
        image: logoUrl ?? undefined,
      }));
      applyProducts(templates);
    }
    onNext();
  };

  const handleAddProduct = () => {
    previousRef.current = cloneProducts(config.content.products);
    addProduct({
      name: 'New Product',
      price: 12,
      image: logoUrl ?? undefined,
    });
  };

  return (
    <QuestShell
      steps={steps}
      currentIndex={currentIndex}
      onStepSelect={onStepSelect}
      title={language === 'EN' ? 'Show What You Sell' : 'Tunjukkan Produk Anda'}
      subtitle={
        language === 'EN'
          ? 'Add 1-2 products with prices. Keep it simple.'
          : 'Tambah 1-2 produk dengan harga. Ringkas sahaja.'
      }
      controls={
        <QuestControls
          onBack={onBack}
          onUndo={handleUndo}
          onSkip={handleSkip}
          onReset={handleReset}
          onNext={onNext}
          backLabel={language === 'EN' ? 'Back' : 'Kembali'}
          nextLabel={language === 'EN' ? 'Next' : 'Seterusnya'}
        />
      }
    >
      <div className="space-y-4">
        {visibleProducts.map(product => (
          <div key={product.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-slate-400">Logo</span>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {language === 'EN' ? 'Product name' : 'Nama produk'}
                </label>
                <Input
                  value={product.name}
                  onChange={(event) => {
                    const value = sanitizeText(event.target.value);
                    previousRef.current = cloneProducts(config.content.products);
                    updateProduct(product.id, { name: value });
                  }}
                />
              </div>
            </div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {language === 'EN' ? 'Price (RM)' : 'Harga (RM)'}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-600">RM</span>
              <Input
                type="number"
                value={product.price}
                onChange={(event) => {
                  const price = Number.parseFloat(event.target.value || '0');
                  previousRef.current = cloneProducts(config.content.products);
                  updateProduct(product.id, { price: Number.isNaN(price) ? 0 : price });
                }}
              />
            </div>
          </div>
        ))}

        {config.content.products.length < 2 && (
          <button
            type="button"
            onClick={handleAddProduct}
            className="w-full rounded-xl border border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            {language === 'EN' ? 'Add another product' : 'Tambah produk lagi'}
          </button>
        )}

        {config.content.products.length > 2 && (
          <p className="text-xs text-slate-500">
            {language === 'EN'
              ? 'More products are available in Boss Mode.'
              : 'Lebih banyak produk tersedia dalam Boss Mode.'}
          </p>
        )}
      </div>
    </QuestShell>
  );
};
