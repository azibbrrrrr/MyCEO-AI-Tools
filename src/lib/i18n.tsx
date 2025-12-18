import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'bm';

// Translation dictionary
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.tools': 'Tools',
    'nav.help': 'Help',
    
    // Landing Page
    'landing.hero.title': 'Create Amazing Things',
    'landing.hero.subtitle': 'Fun AI tools to help you become a young entrepreneur!',
    'landing.hero.cta': 'Start Creating',
    'landing.tools.title': 'Your Creative Toolkit',
    'landing.tools.subtitle': 'Discover tools that make business fun!',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.mission.title': "Today's Mission",
    'dashboard.mission.subtitle': 'Complete tasks to unlock rewards!',
    'dashboard.tools.title': 'Your Tools',
    'dashboard.recent.title': 'Recent Creations',
    'dashboard.tip.title': 'Tip of the Day',
    'dashboard.session.active': 'Session Active',
    'dashboard.progress': 'Progress',
    
    // Tools
    'tool.logo.name': 'AI Logo Maker',
    'tool.logo.desc': 'Design your dream business logo with AI magic!',
    'tool.calculator.name': 'Profit Calculator',
    'tool.calculator.desc': 'Learn how to price your products and make money!',
    'tool.name.name': 'Business Name Generator',
    'tool.name.desc': 'Find the perfect name for your business!',
    'tool.marketing.name': 'Marketing Ideas',
    'tool.marketing.desc': 'Get creative ideas to promote your business!',
    
    // Tool States
    'tool.state.available': 'Ready to use',
    'tool.state.inProgress': 'In progress',
    'tool.state.used': 'Used today',
    'tool.state.comingSoon': 'Coming soon',
    'tool.state.locked': 'Locked',
    
    // Logo Maker Steps
    'logo.intro.title': 'Let\'s Create Your Logo!',
    'logo.intro.subtitle': 'Answer a few fun questions and watch the magic happen!',
    'logo.intro.start': 'Let\'s Go!',
    'logo.step1.title': 'What\'s Your Business?',
    'logo.step1.name': 'Business Name',
    'logo.step1.namePlaceholder': 'My Awesome Business',
    'logo.step1.type': 'What do you sell?',
    'logo.step2.title': 'Pick Your Style',
    'logo.step2.logoType': 'Logo Type',
    'logo.step2.vibe': 'How should it feel?',
    'logo.step2.colors': 'Pick your colors',
    'logo.step3.title': 'Extra Fun Stuff',
    'logo.step3.symbol': 'Add a symbol? (Optional)',
    'logo.step3.slogan': 'Got a slogan?',
    'logo.step3.sloganPlaceholder': 'Quality you can taste!',
    'logo.step3.skip': 'Skip this step',
    'logo.step4.title': 'Creating Your Logos...',
    'logo.step4.tip1': 'Good logos are simple and easy to remember!',
    'logo.step4.tip2': 'Your logo should look good big AND small!',
    'logo.step4.tip3': 'Colors can show feelings - blue is calm, red is exciting!',
    'logo.step5.title': 'Choose Your Favorite!',
    'logo.step5.subtitle': 'Pick the logo that speaks to you',
    'logo.step6.title': 'Booth Ready Mode',
    'logo.step6.subtitle': 'Create everything you need for your booth!',
    'logo.step6.banner': 'Booth Banner',
    'logo.step6.table': 'Table Display',
    'logo.step6.sticker': 'Product Sticker',
    'logo.step6.priceTag': 'Price Tag',
    'logo.step7.title': 'Congratulations!',
    'logo.step7.subtitle': 'Your creations are ready to download!',
    'logo.step7.download': 'Download All',
    'logo.step7.createAnother': 'Create Another',
    
    // Calculator
    'calc.title': 'Profit Calculator',
    'calc.subtitle': 'Learn how much money you can make!',
    'calc.cost': 'Cost to Make',
    'calc.price': 'Selling Price',
    'calc.quantity': 'How Many?',
    'calc.profit': 'Your Profit',
    'calc.tip': 'Try to make at least 50% profit on each item!',
    
    // Common
    'common.next': 'Next',
    'common.back': 'Back',
    'common.skip': 'Skip',
    'common.done': 'Done',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.loading': 'Loading...',
    'common.error': 'Oops! Something went wrong',
    'common.retry': 'Try Again',
    'common.helpBubble': 'What should I do?',
    
    // Business Types
    'business.food': 'Food & Drinks',
    'business.craft': 'Crafts & Art',
    'business.service': 'Services',
    'business.fashion': 'Fashion',
    'business.tech': 'Tech & Games',
    
    // Logo Types
    'logoType.text': 'Text Only',
    'logoType.icon': 'Icon Only',
    'logoType.combo': 'Text + Icon',
    'logoType.badge': 'Badge Style',
    
    // Vibes
    'vibe.fun': 'Fun & Playful',
    'vibe.pro': 'Professional',
    'vibe.eco': 'Eco-Friendly',
    'vibe.modern': 'Modern & Cool',
    'vibe.classic': 'Classic & Timeless',
  },
  bm: {
    // Navigation
    'nav.home': 'Laman Utama',
    'nav.dashboard': 'Papan Pemuka',
    'nav.tools': 'Alatan',
    'nav.help': 'Bantuan',
    
    // Landing Page
    'landing.hero.title': 'Cipta Benda Hebat',
    'landing.hero.subtitle': 'Alatan AI yang seronok untuk menjadi usahawan muda!',
    'landing.hero.cta': 'Mula Mencipta',
    'landing.tools.title': 'Kit Alatan Kreatif Anda',
    'landing.tools.subtitle': 'Temui alatan yang menjadikan perniagaan seronok!',
    
    // Dashboard
    'dashboard.welcome': 'Selamat kembali',
    'dashboard.mission.title': 'Misi Hari Ini',
    'dashboard.mission.subtitle': 'Lengkapkan tugas untuk membuka ganjaran!',
    'dashboard.tools.title': 'Alatan Anda',
    'dashboard.recent.title': 'Ciptaan Terbaru',
    'dashboard.tip.title': 'Tip Hari Ini',
    'dashboard.session.active': 'Sesi Aktif',
    'dashboard.progress': 'Kemajuan',
    
    // Tools
    'tool.logo.name': 'Pembuat Logo AI',
    'tool.logo.desc': 'Reka logo perniagaan impian anda dengan AI!',
    'tool.calculator.name': 'Kalkulator Untung',
    'tool.calculator.desc': 'Belajar cara menetapkan harga dan buat duit!',
    'tool.name.name': 'Penjana Nama Perniagaan',
    'tool.name.desc': 'Cari nama yang sempurna untuk perniagaan anda!',
    'tool.marketing.name': 'Idea Pemasaran',
    'tool.marketing.desc': 'Dapatkan idea kreatif untuk promosi perniagaan!',
    
    // Tool States
    'tool.state.available': 'Sedia digunakan',
    'tool.state.inProgress': 'Sedang berjalan',
    'tool.state.used': 'Digunakan hari ini',
    'tool.state.comingSoon': 'Akan datang',
    'tool.state.locked': 'Dikunci',
    
    // Logo Maker Steps
    'logo.intro.title': 'Jom Cipta Logo Anda!',
    'logo.intro.subtitle': 'Jawab beberapa soalan dan lihat keajaiban berlaku!',
    'logo.intro.start': 'Jom Mula!',
    'logo.step1.title': 'Apakah Perniagaan Anda?',
    'logo.step1.name': 'Nama Perniagaan',
    'logo.step1.namePlaceholder': 'Perniagaan Hebat Saya',
    'logo.step1.type': 'Apa yang anda jual?',
    'logo.step2.title': 'Pilih Gaya Anda',
    'logo.step2.logoType': 'Jenis Logo',
    'logo.step2.vibe': 'Bagaimana rasanya?',
    'logo.step2.colors': 'Pilih warna anda',
    'logo.step3.title': 'Benda Tambahan',
    'logo.step3.symbol': 'Tambah simbol? (Pilihan)',
    'logo.step3.slogan': 'Ada slogan?',
    'logo.step3.sloganPlaceholder': 'Kualiti yang boleh dirasa!',
    'logo.step3.skip': 'Langkau langkah ini',
    'logo.step4.title': 'Mencipta Logo Anda...',
    'logo.step4.tip1': 'Logo yang baik adalah simple dan mudah diingat!',
    'logo.step4.tip2': 'Logo anda perlu nampak bagus besar DAN kecil!',
    'logo.step4.tip3': 'Warna boleh tunjuk perasaan - biru tenang, merah teruja!',
    'logo.step5.title': 'Pilih Kegemaran Anda!',
    'logo.step5.subtitle': 'Pilih logo yang anda suka',
    'logo.step6.title': 'Mod Sedia Gerai',
    'logo.step6.subtitle': 'Cipta semua yang anda perlukan untuk gerai!',
    'logo.step6.banner': 'Sepanduk Gerai',
    'logo.step6.table': 'Paparan Meja',
    'logo.step6.sticker': 'Pelekat Produk',
    'logo.step6.priceTag': 'Tag Harga',
    'logo.step7.title': 'Tahniah!',
    'logo.step7.subtitle': 'Ciptaan anda sedia untuk dimuat turun!',
    'logo.step7.download': 'Muat Turun Semua',
    'logo.step7.createAnother': 'Cipta Lagi',
    
    // Calculator
    'calc.title': 'Kalkulator Untung',
    'calc.subtitle': 'Belajar berapa banyak duit boleh anda buat!',
    'calc.cost': 'Kos Buat',
    'calc.price': 'Harga Jual',
    'calc.quantity': 'Berapa Banyak?',
    'calc.profit': 'Keuntungan Anda',
    'calc.tip': 'Cuba buat sekurang-kurangnya 50% untung setiap item!',
    
    // Common
    'common.next': 'Seterusnya',
    'common.back': 'Kembali',
    'common.skip': 'Langkau',
    'common.done': 'Selesai',
    'common.cancel': 'Batal',
    'common.save': 'Simpan',
    'common.loading': 'Memuatkan...',
    'common.error': 'Alamak! Ada masalah',
    'common.retry': 'Cuba Lagi',
    'common.helpBubble': 'Apa yang perlu saya buat?',
    
    // Business Types
    'business.food': 'Makanan & Minuman',
    'business.craft': 'Kraf & Seni',
    'business.service': 'Perkhidmatan',
    'business.fashion': 'Fesyen',
    'business.tech': 'Teknologi & Permainan',
    
    // Logo Types
    'logoType.text': 'Teks Sahaja',
    'logoType.icon': 'Ikon Sahaja',
    'logoType.combo': 'Teks + Ikon',
    'logoType.badge': 'Gaya Lencana',
    
    // Vibes
    'vibe.fun': 'Seronok & Ceria',
    'vibe.pro': 'Profesional',
    'vibe.eco': 'Mesra Alam',
    'vibe.modern': 'Moden & Cool',
    'vibe.classic': 'Klasik & Abadi',
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app-language');
      return (saved === 'bm' ? 'bm' : 'en') as Language;
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

export { translations };
