import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "EN" | "BM"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

// Translation dictionary
const translations: Record<string, Record<Language, string>> = {
  // Landing Page
  "landing.badge": { EN: "Ready for adventure?", BM: "Sedia untuk pengembaraan?" },
  "landing.title.welcome": { EN: "Welcome, Young", BM: "Selamat Datang," },
  "landing.title.ceo": { EN: "CEO!", BM: "CEO Muda!" },
  "landing.subtitle": {
    EN: "Your entrepreneurship journey starts here! Create amazing products, design cool logos, and build your business empire!",
    BM: "Perjalanan keusahawanan anda bermula di sini! Cipta produk hebat, reka logo keren, dan bina empayar perniagaan anda!",
  },
  "landing.cta": { EN: "Start Creating!", BM: "Mula Mencipta!" },
  "landing.tools.title": { EN: "Your AI Superpowers", BM: "Kuasa AI Anda" },

  // Tool Names
  "tool.product": { EN: "AI Product Idea", BM: "Idea Produk AI" },
  "tool.product.desc": {
    EN: "Get amazing product ideas for your carnival booth!",
    BM: "Dapatkan idea produk hebat untuk gerai karnival anda!",
  },
  "tool.packaging": { EN: "AI Packaging Idea", BM: "Idea Pembungkusan AI" },
  "tool.packaging.desc": { EN: "Make your products look irresistible!", BM: "Jadikan produk anda kelihatan menarik!" },
  "tool.logo": { EN: "AI Logo Maker", BM: "Pembuat Logo AI" },
  "tool.logo.desc": { EN: "Design a cool logo for your brand!", BM: "Reka logo keren untuk jenama anda!" },
  "tool.booth": { EN: "Booth Ready Mode", BM: "Mod Sedia Gerai" },
  "tool.booth.desc": { EN: "Print banners, stickers & price tags!", BM: "Cetak sepanduk, pelekat & tanda harga!" },
  "tool.profit": { EN: "Profit Calculator", BM: "Kalkulator Untung" },
  "tool.profit.desc": { EN: "See how much money you can make!", BM: "Lihat berapa banyak wang anda boleh buat!" },
  "tool.businessName": { EN: "Business Name Generator", BM: "Penjana Nama Perniagaan" },
  "tool.businessName.desc": {
    EN: "Find the perfect name for your business!",
    BM: "Cari nama yang sempurna untuk perniagaan anda!",
  },
  "tool.marketing": { EN: "Marketing Ideas", BM: "Idea Pemasaran" },
  "tool.marketing.desc": { EN: "Get creative marketing strategies!", BM: "Dapatkan strategi pemasaran kreatif!" },

  // Dashboard
  "dashboard.welcome": { EN: "Welcome Back,", BM: "Selamat Kembali," },
  "dashboard.tip.title": { EN: "Tip of the Day", BM: "Tip Hari Ini" },
  "dashboard.tools": { EN: "Your Tools", BM: "Alatan Anda" },
  "dashboard.recent": { EN: "Recent Creations", BM: "Ciptaan Terbaru" },
  "dashboard.seeMore": { EN: "See More", BM: "Lihat Lagi" },
  "dashboard.company": { EN: "Your Company", BM: "Syarikat Anda" },

  // States
  "state.available": { EN: "Available", BM: "Tersedia" },
  "state.inProgress": { EN: "In Progress", BM: "Sedang Berjalan" },
  "state.usedToday": { EN: "Used Today", BM: "Digunakan Hari Ini" },
  "state.comingSoon": { EN: "Coming Soon", BM: "Akan Datang" },

  // Common
  "common.back": { EN: "Back to Adventure!", BM: "Kembali ke Pengembaraan!" },
  "common.next": { EN: "Next", BM: "Seterusnya" },
  "common.previous": { EN: "Previous", BM: "Sebelumnya" },
  "common.finish": { EN: "Finish", BM: "Selesai" },
  "common.save": { EN: "Save", BM: "Simpan" },
  "common.cancel": { EN: "Cancel", BM: "Batal" },
  "common.help": { EN: "What should I do?", BM: "Apa yang perlu saya buat?" },
  "common.optional": { EN: "Optional", BM: "Pilihan" },

  // Wizard
  "wizard.step": { EN: "Step", BM: "Langkah" },
  "wizard.generating": { EN: "Generating...", BM: "Menjana..." },

  // Product Idea Tool
  "product.step1.title": { EN: "What do you like?", BM: "Apa yang anda suka?" },
  "product.step1.subtitle": { EN: "Pick your favorite topic!", BM: "Pilih topik kegemaran anda!" },
  "product.step2.title": { EN: "What's your budget?", BM: "Berapa bajet anda?" },
  "product.step2.subtitle": {
    EN: "How much can you spend to make products?",
    BM: "Berapa anda boleh belanja untuk buat produk?",
  },
  "product.step3.title": { EN: "Make or Buy?", BM: "Buat atau Beli?" },
  "product.step3.subtitle": {
    EN: "Do you want to make things yourself or sell ready-made items?",
    BM: "Nak buat sendiri atau jual barang siap?",
  },
  "product.step4.title": { EN: "AI Suggestions!", BM: "Cadangan AI!" },
  "product.step4.subtitle": { EN: "Here are some cool ideas for you!", BM: "Ini beberapa idea hebat untuk anda!" },
  "product.interest.food": { EN: "Food", BM: "Makanan" },
  "product.interest.crafts": { EN: "Crafts", BM: "Kraf" },
  "product.interest.games": { EN: "Games", BM: "Permainan" },
  "product.interest.books": { EN: "Books", BM: "Buku" },
  "product.interest.toys": { EN: "Toys", BM: "Mainan" },
  "product.budget.low": { EN: "Small", BM: "Kecil" },
  "product.budget.medium": { EN: "Medium", BM: "Sederhana" },
  "product.budget.high": { EN: "Big", BM: "Besar" },
  "product.type.diy": { EN: "Make It", BM: "Buat Sendiri" },
  "product.type.resale": { EN: "Buy & Sell", BM: "Beli & Jual" },
  "product.type.both": { EN: "Both!", BM: "Dua-dua!" },
  "product.success.title": { EN: "Great Choice!", BM: "Pilihan Hebat!" },
  "product.success.desc": {
    EN: "You picked an awesome product idea! Let's make it look amazing.",
    BM: "Anda pilih idea produk yang hebat! Jom jadikan ia menawan.",
  },
  "product.success.next": { EN: "Design Packaging", BM: "Reka Pembungkusan" },

  // Packaging Tool
  "packaging.step1.title": { EN: "What's your product?", BM: "Apa produk anda?" },
  "packaging.step1.subtitle": { EN: "Pick the type that matches best!", BM: "Pilih jenis yang paling sesuai!" },
  "packaging.step2.title": { EN: "Who will buy it?", BM: "Siapa akan beli?" },
  "packaging.step2.subtitle": { EN: "Think about your customers!", BM: "Fikirkan pelanggan anda!" },
  "packaging.step3.title": { EN: "Packaging style?", BM: "Gaya pembungkusan?" },
  "packaging.step3.subtitle": { EN: "What feeling do you want?", BM: "Apa perasaan yang anda mahu?" },
  "packaging.step4.title": { EN: "Packaging Ideas!", BM: "Idea Pembungkusan!" },
  "packaging.step4.subtitle": { EN: "Pick the one you like best!", BM: "Pilih yang anda paling suka!" },
  "packaging.type.baked": { EN: "Baked Goods", BM: "Kek & Kuih" },
  "packaging.type.liquid": { EN: "Drinks", BM: "Minuman" },
  "packaging.type.boxed": { EN: "Boxed Items", BM: "Barang Berkotak" },
  "packaging.type.flat": { EN: "Flat Items", BM: "Barang Rata" },
  "packaging.type.soft": { EN: "Soft Items", BM: "Barang Lembut" },
  "packaging.buyer.kids": { EN: "Kids", BM: "Kanak-kanak" },
  "packaging.buyer.teens": { EN: "Teens", BM: "Remaja" },
  "packaging.buyer.parents": { EN: "Parents", BM: "Ibu Bapa" },
  "packaging.buyer.gifts": { EN: "Gift Buyers", BM: "Pembeli Hadiah" },
  "packaging.budget.eco": { EN: "Eco-Friendly", BM: "Mesra Alam" },
  "packaging.budget.fancy": { EN: "Fancy", BM: "Mewah" },
  "packaging.budget.creative": { EN: "Creative", BM: "Kreatif" },
  "packaging.success.title": { EN: "Packaging Ready!", BM: "Pembungkusan Siap!" },
  "packaging.success.desc": {
    EN: "Your packaging idea is saved! Time to make a cool logo.",
    BM: "Idea pembungkusan disimpan! Masa untuk buat logo yang keren.",
  },
  "packaging.success.next": { EN: "Create Logo", BM: "Buat Logo" },

  // Logo Maker
  "logo.step1.title": { EN: "Name Your Shop!", BM: "Namakan Kedai Anda!" },
  "logo.step1.subtitle": { EN: "What's your business called?", BM: "Apakah nama perniagaan anda?" },
  "logo.step2.title": { EN: "Style Your Logo!", BM: "Gayakan Logo Anda!" },
  "logo.step2.subtitle": { EN: "Pick the look you want!", BM: "Pilih rupa yang anda mahu!" },
  "logo.step3.title": { EN: "Add Fun Details!", BM: "Tambah Butiran Seronok!" },
  "logo.step3.subtitle": { EN: "Optional extras for your logo!", BM: "Tambahan pilihan untuk logo anda!" },
  "logo.step5.title": { EN: "Pick Your Favorite!", BM: "Pilih Kegemaran Anda!" },
  "logo.step5.subtitle": { EN: "AI made these logos just for you!", BM: "AI buat logo ini khas untuk anda!" },
  "logo.step6.title": { EN: "Logo Saved!", BM: "Logo Disimpan!" },
  "logo.step6.subtitle": { EN: "Your new logo is ready!", BM: "Logo baru anda siap!" },
  "logo.shopName": { EN: "Shop Name", BM: "Nama Kedai" },
  "logo.shopName.placeholder": { EN: "e.g. Ahmad's Cookies", BM: "cth. Kek Ahmad" },
  "logo.businessType": { EN: "Business Type", BM: "Jenis Perniagaan" },
  // Business Types
  "logo.type.food": { EN: "Food", BM: "Makanan" },
  "logo.type.crafts": { EN: "Crafts", BM: "Kraf" },
  "logo.type.toys": { EN: "Toys", BM: "Mainan" },
  "logo.type.accessories": { EN: "Accessories", BM: "Aksesori" },
  "logo.type.diy": { EN: "DIY", BM: "DIY" },
  "logo.type.fashion": { EN: "Fashion", BM: "Fesyen" },
  "logo.type.games": { EN: "Games", BM: "Permainan" },
  "logo.type.services": { EN: "Services", BM: "Perkhidmatan" },
  // Logo Styles
  "logo.style": { EN: "Logo Style", BM: "Gaya Logo" },
  "logo.style.wordmark": { EN: "Wordmark", BM: "Teks Logo" },
  "logo.style.symbol": { EN: "Symbol", BM: "Simbol" },
  "logo.style.emblem": { EN: "Emblem", BM: "Lambang" },
  "logo.style.mascot": { EN: "Mascot", BM: "Maskot" },
  "logo.style.text": { EN: "Text Only", BM: "Teks Sahaja" },
  "logo.style.icon": { EN: "Icon Only", BM: "Ikon Sahaja" },
  "logo.style.combined": { EN: "Text + Icon", BM: "Teks + Ikon" },
  // Vibes
  "logo.vibe": { EN: "Brand Vibe", BM: "Suasana Jenama" },
  "logo.vibe.cheerful": { EN: "Cheerful", BM: "Ceria" },
  "logo.vibe.premium": { EN: "Premium", BM: "Premium" },
  "logo.vibe.minimal": { EN: "Minimal", BM: "Minimal" },
  "logo.vibe.playful": { EN: "Playful", BM: "Bermain" },
  "logo.vibe.traditional": { EN: "Traditional", BM: "Tradisional" },
  "logo.vibe.fun": { EN: "Fun & Playful", BM: "Seronok & Ceria" },
  "logo.vibe.professional": { EN: "Professional", BM: "Profesional" },
  "logo.vibe.creative": { EN: "Creative", BM: "Kreatif" },
  "logo.vibe.natural": { EN: "Natural", BM: "Semulajadi" },
  // Colors
  "logo.colors": { EN: "Color Theme", BM: "Tema Warna" },
  // Symbols
  "logo.symbol": { EN: "Add a Symbol", BM: "Tambah Simbol" },
  "logo.slogan": { EN: "Add a Slogan", BM: "Tambah Slogan" },
  "logo.slogan.placeholder": { EN: "e.g. Made with love!", BM: "cth. Dibuat dengan kasih sayang!" },
  "logo.generating.title": { EN: "Creating Your Logos...", BM: "Mencipta Logo Anda..." },
  "logo.generating.subtitle": {
    EN: "AI is designing something special!",
    BM: "AI sedang mereka sesuatu yang istimewa!",
  },
  "logo.option": { EN: "Option", BM: "Pilihan" },
  "logo.download": { EN: "Download", BM: "Muat Turun" },
  "logo.backToDashboard": { EN: "Back to Dashboard", BM: "Kembali ke Dashboard" },
  "logo.success.title": { EN: "Logo Saved!", BM: "Logo Disimpan!" },
  "logo.success.desc": {
    EN: "Your new logo is ready! Want to create booth materials?",
    BM: "Logo baru anda siap! Mahu buat bahan gerai?",
  },
  "logo.success.booth": { EN: "Create Booth Materials", BM: "Buat Bahan Gerai" },

  // Booth Ready
  "booth.select.title": { EN: "What do you need?", BM: "Apa yang anda perlukan?" },
  "booth.select.subtitle": { EN: "Pick the materials for your booth!", BM: "Pilih bahan untuk gerai anda!" },
  "booth.generate": { EN: "Generate Mockups", BM: "Jana Mockup" },
  "booth.generating": { EN: "Creating your mockups...", BM: "Mencipta mockup anda..." },
  "booth.ready.title": { EN: "Your Booth Materials!", BM: "Bahan Gerai Anda!" },
  "booth.ready.subtitle": {
    EN: "Download and print for your carnival!",
    BM: "Muat turun dan cetak untuk karnival anda!",
  },
  "booth.export.label": { EN: "Download Format:", BM: "Format Muat Turun:" },
  "booth.download": { EN: "Download", BM: "Muat Turun" },
  "booth.next": { EN: "Calculate Profit", BM: "Kira Untung" },

  // Profit Calculator
  "profit.title": { EN: "Calculate Your Profit!", BM: "Kira Untung Anda!" },
  "profit.subtitle": { EN: "See how much money you can make!", BM: "Lihat berapa wang anda boleh buat!" },
  "profit.cost": { EN: "Cost per item", BM: "Kos setiap item" },
  "profit.price": { EN: "Selling price", BM: "Harga jualan" },
  "profit.quantity": { EN: "How many to sell?", BM: "Berapa banyak nak jual?" },
  "profit.items": { EN: "items", BM: "item" },
  "profit.revenue": { EN: "Revenue", BM: "Pendapatan" },
  "profit.totalCost": { EN: "Total Cost", BM: "Jumlah Kos" },
  "profit.totalProfit": { EN: "Total Profit", BM: "Jumlah Untung" },
  "profit.perItem": { EN: "Profit per item", BM: "Untung setiap item" },
  "profit.margin": { EN: "Margin", BM: "Margin" },
  "profit.formula": { EN: "Formula", BM: "Formula" },
  "profit.status.loss": { EN: "You're losing money!", BM: "Anda rugi!" },
  "profit.status.low": { EN: "Low profit margin", BM: "Margin untung rendah" },
  "profit.status.good": { EN: "Good profit!", BM: "Untung bagus!" },
  "profit.status.great": { EN: "Amazing profit!", BM: "Untung hebat!" },
  "profit.done": { EN: "Back to Dashboard", BM: "Kembali ke Dashboard" },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("EN")

  useEffect(() => {
    const stored = localStorage.getItem("bizkids-language") as Language
    if (stored && (stored === "EN" || stored === "BM")) {
      setLanguageState(stored)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("bizkids-language", lang)
  }

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
