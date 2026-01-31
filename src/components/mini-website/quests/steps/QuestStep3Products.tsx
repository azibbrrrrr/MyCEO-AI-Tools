import type { UseSiteConfigReturn, Product } from '@/hooks/useSiteConfig';
import { useLanguage } from '@/components/language-provider';

import { Input } from '@/components/ui/input';
import { Trash2, Edit2, ImageIcon } from 'lucide-react';
import { QuestShell } from '../QuestShell';
import { QuestControls } from '../QuestControls';
import { sanitizeText } from '@/lib/questGuardrails';

interface QuestStepBaseProps {
  siteConfig: UseSiteConfigReturn;
  steps: { id: string; label: string }[];
  currentIndex: number;
  onStepSelect: (index: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export const QuestStep3Products = ({
  siteConfig,
  steps,
  currentIndex,
  onStepSelect,
  onBack,
  onNext,
}: QuestStepBaseProps) => {
  const { config, addProduct, updateProduct, removeProduct } = siteConfig;
  const { language } = useLanguage();


  const visibleProducts = config.content.products;

  const handleAddProduct = () => {
    addProduct({
      name: 'New Product',
      price: 12,
      image: undefined,
    });
  };

  const handleImageUpload = (product: Product, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateProduct(product.id, { image: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <QuestShell
      steps={steps}
      currentIndex={currentIndex}
      onStepSelect={onStepSelect}
      title={language === 'EN' ? 'Show What You Sell' : 'Tunjukkan Produk Anda'}
      subtitle={
        language === 'EN'
          ? 'Add 1-2 products, prices, and a photo for each.'
          : 'Tambah 1-2 produk, harga, dan gambar untuk setiap satu.'
      }
      controls={
        <QuestControls
          onBack={onBack}
          onNext={onNext}
          backLabel={language === 'EN' ? 'Back' : 'Kembali'}
          nextLabel={language === 'EN' ? 'Next' : 'Seterusnya'}
          nextDisabled={config.content.products.length === 0}
        />
      }
    >
      <div className="space-y-4">
        {visibleProducts.map(product => (
          <div key={product.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex gap-4 mb-4">
              <div className="shrink-0">
                <label 
                  htmlFor={`product-image-${product.id}`}
                  className="relative w-20 h-20 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden cursor-pointer group hover:border-blue-400 transition-colors"
                >
                  {product.image ? (
                    <>
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Edit2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-1">
                      <ImageIcon className="w-6 h-6" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                        <Edit2 className="w-5 h-5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  )}
                  <input
                    id={`product-image-${product.id}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        handleImageUpload(product, file);
                        event.target.value = '';
                      }
                    }}
                  />
                </label>
                {product.image && (
                  <button
                    type="button"
                    onClick={() => updateProduct(product.id, { image: undefined })}
                    className="mt-1 text-[10px] text-red-500 hover:text-red-600 block w-full text-center"
                  >
                    {language === 'EN' ? 'Remove' : 'Buang'}
                  </button>
                )}
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {language === 'EN' ? 'Product name' : 'Nama produk'}
                  </label>
                   <div className="flex gap-2">
                    <Input
                      value={product.name}
                      onChange={(event) => {
                        const value = sanitizeText(event.target.value);
                        updateProduct(product.id, { name: value });
                      }}
                      className="bg-white"
                    />
                    <button
                        type="button"
                        onClick={() => removeProduct(product.id)}
                        className="p-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors border border-red-100 shrink-0"
                        title={language === 'EN' ? 'Remove product' : 'Buang produk'}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
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
                        updateProduct(product.id, { price: Number.isNaN(price) ? 0 : price });
                      }}
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {config.content.products.length < 8 && (
          <button
            type="button"
            onClick={handleAddProduct}
            className="w-full rounded-xl border border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            {language === 'EN' ? 'Add another product' : 'Tambah produk lagi'}
          </button>
        )}

        {config.content.products.length >= 8 && (
          <p className="text-xs text-slate-500">
            {language === 'EN'
              ? 'Max 8 products in wizard. Use Boss Mode for more.'
              : 'Maksimum 8 produk. Guna Boss Mode untuk lebih banyak.'}
          </p>
        )}
      </div>
    </QuestShell>
  );
};
