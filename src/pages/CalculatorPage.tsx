import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { HelpBubble } from '@/components/ui/HelpBubble';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, TrendingDown, DollarSign, Package, Tag, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CalculatorPage() {
  const { t, language } = useI18n();

  const [cost, setCost] = useState(5);
  const [price, setPrice] = useState(10);
  const [quantity, setQuantity] = useState(10);

  const profit = (price - cost) * quantity;
  const profitPerItem = price - cost;
  const profitMargin = cost > 0 ? ((price - cost) / cost) * 100 : 0;

  const getProfitEmoji = () => {
    if (profitMargin >= 100) return '🤑';
    if (profitMargin >= 50) return '😊';
    if (profitMargin >= 20) return '🙂';
    if (profitMargin > 0) return '😐';
    if (profitMargin === 0) return '😕';
    return '😢';
  };

  const getProfitColor = () => {
    if (profitMargin >= 50) return 'text-success';
    if (profitMargin > 0) return 'text-warning';
    return 'text-destructive';
  };

  const tips = {
    en: [
      'Try to make at least 50% profit on each item!',
      'The more you sell, the more you earn!',
      'Don\'t forget to count ALL your costs!',
    ],
    bm: [
      'Cuba buat sekurang-kurangnya 50% untung setiap item!',
      'Lebih banyak jual, lebih banyak dapat!',
      'Jangan lupa kira SEMUA kos anda!',
    ],
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-4">
            <DollarSign className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground mb-2">
            {t('calc.title')} 💰
          </h1>
          <p className="text-muted-foreground">
            {t('calc.subtitle')}
          </p>
        </div>

        {/* Calculator Card */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Cost Slider */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 font-semibold text-foreground">
                <Package className="w-5 h-5 text-muted-foreground" />
                {t('calc.cost')}
              </label>
              <div className="text-2xl font-black text-foreground">
                RM {cost.toFixed(2)}
              </div>
            </div>
            <Slider
              value={[cost]}
              onValueChange={(v) => setCost(v[0])}
              min={1}
              max={50}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>RM 1</span>
              <span>RM 50</span>
            </div>
          </div>

          {/* Price Slider */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 font-semibold text-foreground">
                <Tag className="w-5 h-5 text-muted-foreground" />
                {t('calc.price')}
              </label>
              <div className="text-2xl font-black text-foreground">
                RM {price.toFixed(2)}
              </div>
            </div>
            <Slider
              value={[price]}
              onValueChange={(v) => setPrice(v[0])}
              min={1}
              max={100}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>RM 1</span>
              <span>RM 100</span>
            </div>
          </div>

          {/* Quantity Slider */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 font-semibold text-foreground">
                <span className="text-xl">📦</span>
                {t('calc.quantity')}
              </label>
              <div className="text-2xl font-black text-foreground">
                {quantity}
              </div>
            </div>
            <Slider
              value={[quantity]}
              onValueChange={(v) => setQuantity(v[0])}
              min={1}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>1</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mt-6 space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {/* Total Profit */}
          <div className={cn(
            "rounded-2xl p-6 text-center transition-all duration-500",
            profit >= 0 ? "bg-success/10" : "bg-destructive/10"
          )}>
            <div className="flex items-center justify-center gap-3 mb-2">
              {profit >= 0 ? (
                <TrendingUp className="w-8 h-8 text-success" />
              ) : (
                <TrendingDown className="w-8 h-8 text-destructive" />
              )}
              <span className="text-5xl">{getProfitEmoji()}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{t('calc.profit')}</p>
            <p className={cn("text-4xl font-black transition-colors", getProfitColor())}>
              RM {profit.toFixed(2)}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Profit per item</p>
              <p className={cn("text-xl font-bold", getProfitColor())}>
                RM {profitPerItem.toFixed(2)}
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Profit margin</p>
              <p className={cn("text-xl font-bold", getProfitColor())}>
                {profitMargin.toFixed(0)}%
              </p>
            </div>
          </div>

          {/* Tip */}
          <div className="bg-warning/10 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                💡 {language === 'bm' ? 'Tip' : 'Tip'}
              </p>
              <p className="text-sm text-muted-foreground">
                {tips[language][Math.floor(Math.random() * tips[language].length)]}
              </p>
            </div>
          </div>
        </div>
      </main>

      <MobileNav />
      <HelpBubble
        tips={[
          "Move the sliders to change values!",
          "Watch the profit change in real-time!",
          "Aim for the happy emoji!",
        ]}
      />
    </div>
  );
}
