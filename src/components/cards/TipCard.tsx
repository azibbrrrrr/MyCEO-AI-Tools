import { Lightbulb, ChevronRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const tips = [
  {
    emoji: '💡',
    en: 'A good business solves a problem! Think about what people need.',
    bm: 'Perniagaan yang baik menyelesaikan masalah! Fikir apa yang orang perlukan.',
  },
  {
    emoji: '🎨',
    en: 'Simple logos are easier to remember. Less is more!',
    bm: 'Logo yang simple lebih mudah diingat. Kurang adalah lebih!',
  },
  {
    emoji: '💰',
    en: 'Always know your costs before setting prices!',
    bm: 'Sentiasa tahu kos anda sebelum tetapkan harga!',
  },
  {
    emoji: '🌟',
    en: 'Happy customers tell their friends. Be nice and helpful!',
    bm: 'Pelanggan gembira beritahu kawan mereka. Jadilah baik dan membantu!',
  },
  {
    emoji: '📦',
    en: 'Good packaging makes your product look special!',
    bm: 'Pembungkusan yang bagus membuat produk anda nampak istimewa!',
  },
];

export function TipCard() {
  const { t, language } = useI18n();
  
  // Get a random tip based on the day
  const tipIndex = new Date().getDate() % tips.length;
  const tip = tips[tipIndex];

  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-warning" />
        </div>
        <h3 className="font-bold text-foreground">{t('dashboard.tip.title')}</h3>
      </div>

      <div className="flex items-start gap-3 p-4 bg-warning/5 rounded-xl">
        <span className="text-2xl">{tip.emoji}</span>
        <p className="text-sm text-foreground leading-relaxed flex-1">
          {language === 'bm' ? tip.bm : tip.en}
        </p>
      </div>
    </div>
  );
}
