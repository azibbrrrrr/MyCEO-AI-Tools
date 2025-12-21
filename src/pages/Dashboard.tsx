import { useLanguage } from "@/components/language-provider"
import { LanguageToggle } from "@/components/language-toggle"
import { FloatingElements } from "@/components/floating-elements"
import { ToolCard } from "@/components/tool-card"
import { HelpBubble } from "@/components/help-bubble"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

// Import tool icons
import logoMakerIcon from "@/assets/logo-maker.png"
import boothIcon from "@/assets/booth-icon.png"
import calculatorIcon from "@/assets/calculator-icon.png"
import productIdeaIcon from "@/assets/product-idea-icon.png"
import packagingIcon from "@/assets/packaging-icon.png"

// Tips that rotate daily
const tips = {
  EN: [
    "Always smile when talking to customers - it makes them feel welcome! 😊",
    "Keep your prices simple - round numbers are easier to remember! 💰",
    "Make your booth colorful - bright colors attract attention! 🎨",
    "Practice explaining your product in 10 seconds or less! ⏱️",
    "Ask your customers what they like - it helps you improve! 💡",
  ],
  BM: [
    "Sentiasa senyum bila bercakap dengan pelanggan - mereka akan rasa dihargai! 😊",
    "Pastikan harga mudah - nombor bulat lebih senang diingat! 💰",
    "Jadikan gerai anda berwarna-warni - warna cerah menarik perhatian! 🎨",
    "Latih diri menerangkan produk dalam 10 saat! ⏱️",
    "Tanya pelanggan apa yang mereka suka - ia membantu anda memperbaiki! 💡",
  ],
}

export default function Dashboard() {
  const { t, language } = useLanguage()
  const [tipIndex, setTipIndex] = useState(0)

  // Rotate tip based on day
  useEffect(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setTipIndex(dayOfYear % tips.EN.length)
  }, [])

  // Mock user data
  const user = {
    name: "Ahmad",
    avatar: "🧑‍💼",
    companyName: "Ahmad's Cool Shop",
    companyLogo: null,
  }

  const tools = [
    {
      icon: "🎨",
      iconImage: logoMakerIcon,
      titleKey: "tool.logo",
      descKey: "tool.logo.desc",
      href: "/tools/logo-maker",
      state: "available" as const,
    },
    {
      icon: "🏪",
      iconImage: boothIcon,
      titleKey: "tool.booth",
      descKey: "tool.booth.desc",
      href: "/tools/booth-ready",
      state: "available" as const,
    },
    {
      icon: "💰",
      iconImage: calculatorIcon,
      titleKey: "tool.profit",
      descKey: "tool.profit.desc",
      href: "/tools/profit-calculator",
      state: "available" as const,
    },
  ]

  const futureTools = [
    {
      icon: "💡",
      iconImage: productIdeaIcon,
      titleKey: "tool.product",
      descKey: "tool.product.desc",
      href: "#",
      state: "comingSoon" as const,
    },
    {
      icon: "📦",
      iconImage: packagingIcon,
      titleKey: "tool.packaging",
      descKey: "tool.packaging.desc",
      href: "#",
      state: "comingSoon" as const,
    },
  ]

  const recentCreations = [
    { type: "logo", preview: "🏷️", name: "Cool Logo v1", date: "Today" },
    { type: "product", preview: "🧁", name: "Cupcake Idea", date: "Yesterday" },
    { type: "booth", preview: "🏪", name: "Booth Design", date: "2 days ago" },
  ]

  return (
    <div className="min-h-screen bg-sky-gradient relative overflow-hidden">
      <FloatingElements />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 md:p-6 bg-white/50 backdrop-blur-sm">
        <Link
          to="/"
          className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-[var(--shadow-low)] hover:shadow-[var(--shadow-medium)] transition-all"
        >
          <span>←</span>
          <span className="font-semibold text-[var(--text-primary)] text-sm">{t("common.back")} 🏠</span>
        </Link>

        <div className="flex items-center gap-4">
          <LanguageToggle />
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-[var(--shadow-low)]">
            <span className="text-2xl">{user.avatar}</span>
            <span className="font-semibold text-[var(--text-primary)] hidden sm:block">{user.name}</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4 md:px-8 py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* Welcome Card */}
            <div className="flex-1 bg-white rounded-3xl p-6 shadow-[var(--shadow-medium)]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--sunshine-orange)] to-[var(--golden-yellow)] flex items-center justify-center text-3xl shadow-[var(--shadow-low)]">
                  {user.avatar}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold">
                    <span className="text-[var(--sky-blue)]">{t("dashboard.welcome")}</span>{" "}
                    <span className="text-[var(--sunshine-orange)]">{user.name}!</span>
                  </h1>
                  <p className="text-[var(--text-secondary)] mt-1">👑 Young CEO</p>
                </div>
              </div>
            </div>

            {/* Company Card */}
            <div className="md:w-72 bg-white rounded-3xl p-6 shadow-[var(--shadow-medium)]">
              <h3 className="text-sm font-semibold text-[var(--text-muted)] mb-3">{t("dashboard.company")}</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[var(--muted)] flex items-center justify-center text-2xl">
                  {user.companyLogo || "🏢"}
                </div>
                <div>
                  <p className="font-bold text-[var(--text-primary)]">{user.companyName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tip of the Day */}
          <div className="bg-gradient-to-r from-[var(--sky-blue-light)] to-[var(--mint-green)] rounded-3xl p-6 shadow-[var(--shadow-medium)] mb-8">
            <h3 className="font-bold text-[var(--text-primary)] mb-2">{t("dashboard.tip.title")}</h3>
            <p className="text-[var(--text-primary)]">{tips[language][tipIndex]}</p>
          </div>

          {/* Tools Grid */}
          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-6">🛠️ {t("dashboard.tools")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {tools.map((tool) => (
                <ToolCard
                  key={tool.titleKey}
                  icon={tool.icon}
                  iconImage={tool.iconImage}
                  titleKey={tool.titleKey}
                  descKey={tool.descKey}
                  href={tool.href}
                  state={tool.state}
                />
              ))}
            </div>

            {/* Coming Soon Tools */}
            <h3 className="text-lg font-bold text-[var(--text-muted)] mt-8 mb-4">🔮 Coming Soon</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {futureTools.map((tool) => (
                <ToolCard
                  key={tool.titleKey}
                  icon={tool.icon}
                  iconImage={tool.iconImage}
                  titleKey={tool.titleKey}
                  descKey={tool.descKey}
                  href={tool.href}
                  state={tool.state}
                />
              ))}
            </div>
          </section>

          {/* Recent Creations */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">✨ {t("dashboard.recent")}</h2>
              <button className="text-[var(--sky-blue)] font-semibold hover:underline">
                {t("dashboard.seeMore")} →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentCreations.map((creation, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-4 shadow-[var(--shadow-low)] hover:shadow-[var(--shadow-medium)] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[var(--muted)] flex items-center justify-center text-2xl">
                      {creation.preview}
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">{creation.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{creation.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Help Bubble */}
      <HelpBubble />
    </div>
  )
}
