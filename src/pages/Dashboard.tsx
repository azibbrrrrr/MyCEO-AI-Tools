import { useLanguage } from "@/components/language-provider"
import { LanguageToggle } from "@/components/language-toggle"
import { FloatingElements } from "@/components/floating-elements"
import { ToolCard } from "@/components/tool-card"
import { HelpBubble } from "@/components/help-bubble"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useChildSession } from "@/hooks/useChildSession"
import { DAILY_TIPS, AVAILABLE_TOOLS } from "@/constants"
import { getChildLogos, checkQuota, getToolByKey, QUOTA_LIMITS } from "@/lib/supabase/ai-tools"
import type { ChildLogo } from "@/lib/supabase/types"
import type { QuotaStatus } from "@/lib/supabase/ai-tools"
import { LogoCard, LogoCardSkeleton } from "@/components/LogoCard"

// Import tool icons
import logoMakerIcon from "@/assets/logo-maker.png"
import boothIcon from "@/assets/booth-icon.png"
import calculatorIcon from "@/assets/calculator-icon.png"
import productIdeaIcon from "@/assets/product-idea-icon.png"
import packagingIcon from "@/assets/packaging-icon.png"
import salesBuddyIcon from "@/assets/sales-buddy-icon.png"
import miniWebsiteIcon from "@/assets/mini-website-icon.png"

// Tool icon mapping
const toolIcons: Record<string, string> = {
  logoMaker: logoMakerIcon,
  booth: boothIcon,
  calculator: calculatorIcon,
  productIdea: productIdeaIcon,
  packaging: packagingIcon,
  salesBuddy: salesBuddyIcon,
  miniWebsite: miniWebsiteIcon,
}

// Helper to format date
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  return date.toLocaleDateString()
}

export default function Dashboard() {
  const { t, language } = useLanguage()
  const { child, loading } = useChildSession()
  const navigate = useNavigate()
  const [tipIndex, setTipIndex] = useState(0)
  const [recentLogos, setRecentLogos] = useState<ChildLogo[]>([])
  const [loadingLogos, setLoadingLogos] = useState(true)
  const [premiumQuota, setPremiumQuota] = useState<QuotaStatus | null>(null)



  // Fetch recent logos and quota
  useEffect(() => {
    async function fetchData() {
      if (child?.id) {
        setLoadingLogos(true)
        // Fetch logos
        const logos = await getChildLogos(child.id)
        setRecentLogos(logos.slice(0, 4))
        setLoadingLogos(false)

        // Fetch quota for premium plan (logo_maker)
        const tool = await getToolByKey('logo_maker')
        if (tool) {
          const quota = await checkQuota(child.id, tool.id, 'premium')
          setPremiumQuota(quota)
        }
      } else {
        setLoadingLogos(false)
      }
    }
    fetchData()
  }, [child?.id])

  // Rotate tip based on day
  useEffect(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setTipIndex(dayOfYear % DAILY_TIPS.EN.length)
  }, [])

  // No child - RequireAuth will handle redirect
  if (loading || !child) return null

  // Use child session data
  const user = {
    name: child.name,
    avatar: child.age && child.age < 10 ? "👦" : "🧑‍💼",
    companyName: child.companies?.[0]?.company_name || `${child.name}'s Company`,
    companyLogo: child.companies?.[0]?.logo_url || null,
    level: child.current_level,
    xp: child.total_xp,
  }

  // Get tips for current language
  const tips = DAILY_TIPS[language as keyof typeof DAILY_TIPS] || DAILY_TIPS.EN

  return (
    <div className="min-h-screen bg-sky-gradient relative overflow-hidden">
      <FloatingElements />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 md:p-6 bg-white/50 backdrop-blur-sm">
        <a
          href={import.meta.env.VITE_MAIN_PORTAL_URL}
          className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-[var(--shadow-low)] hover:shadow-[var(--shadow-medium)] transition-all"

        >
          <span className="text-2xl">🏠</span>
          <span className="font-bold text-[var(--text-primary)] hidden sm:inline">{t("dashboard.backToPortal")}</span>
        </a>

        <div className="flex items-center gap-4">
          <LanguageToggle />
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-[var(--shadow-low)]">
            <span className="text-xl">{user.avatar}</span>
            <span className="font-semibold text-[var(--text-primary)]">{user.name}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 md:px-8 pb-8 pt-4">
        <div className="max-w-7xl mx-auto">
          {/* Kid's Company Header */}
          <section className="mb-8">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[var(--shadow-medium)]">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Company Logo/Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--sky-blue-light)] to-[var(--sky-blue)] flex items-center justify-center text-4xl shadow-[var(--shadow-float)]">
                    {user.companyLogo ? (
                      <img src={user.companyLogo} alt="Company logo" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      "🏢"
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[var(--golden-yellow)] flex items-center justify-center text-white text-sm font-bold shadow-md">
                    Lv{user.level}
                  </div>
                </div>

                {/* Company Info */}
                <div className="text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] mb-1">
                    {user.companyName}
                  </h1>
                  <p className="text-[var(--text-secondary)]">
                    {t("dashboard.welcome")} <span className="font-semibold">{user.name}</span>! 🎉
                  </p>
                </div>

                {/* Stats - Simple & Kid-Friendly */}
                <div className="flex gap-3 md:ml-auto">
                  {/* XP */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[var(--sky-blue)] to-[var(--sky-blue-light)] rounded-2xl shadow-md">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <p className="text-2xl font-extrabold text-white leading-none">{user.xp}</p>
                      <p className="text-xs font-bold text-white/80">XP</p>
                    </div>
                  </div>

                  {/* AI Credits */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[var(--sunshine-orange)] to-[var(--golden-yellow)] rounded-2xl shadow-md">
                    <span className="text-2xl">🎨</span>
                    <div>
                      <p className="text-2xl font-extrabold text-white leading-none">
                        {premiumQuota ? (premiumQuota.generationsRemaining === -1 ? '∞' : premiumQuota.generationsRemaining) : '...'}/{QUOTA_LIMITS.premium.maxGenerations}
                      </p>
                      <p className="text-xs font-bold text-white/80">Credits</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tip of the Day */}
          <div className="bg-gradient-to-r from-[var(--sky-blue-light)] to-[var(--mint-green)] rounded-3xl p-6 shadow-[var(--shadow-medium)] mb-8">
            <h3 className="font-bold text-[var(--text-primary)] mb-2">{t("dashboard.tip.title")}</h3>
            <p className="text-[var(--text-primary)]">{tips[tipIndex]}</p>
          </div>

          {/* Tools Grid */}
          <section className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-6">🛠️ {t("dashboard.tools")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {AVAILABLE_TOOLS.map((tool) => (
                <ToolCard
                  key={tool.titleKey}
                  icon={tool.icon}
                  iconImage={toolIcons[tool.iconImageKey]}
                  titleKey={tool.titleKey}
                  descKey={tool.descKey}
                  href={tool.href}
                  state={tool.state}
                />
              ))}
            </div>

            {/* Coming Soon Tools */}
            {/* <h3 className="text-lg font-bold text-[var(--text-muted)] mt-8 mb-4">🔮 Coming Soon</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {COMING_SOON_TOOLS.map((tool) => (
                <ToolCard
                  key={tool.titleKey}
                  icon={tool.icon}
                  iconImage={toolIcons[tool.iconImageKey]}
                  titleKey={tool.titleKey}
                  descKey={tool.descKey}
                  href={tool.href}
                  state={tool.state}
                />
              ))}
            </div> */}
          </section>

          {/* Recent Creations */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">
                ✨ {t("dashboard.recent")}
              </h2>
              <Link 
                to="/creations"
                className="text-sm font-semibold text-[var(--sky-blue)] hover:underline"
              >
                {t("dashboard.seeMore")} →
              </Link>
            </div>
            
            {loadingLogos ? (
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <LogoCardSkeleton key={i} />
                ))}
              </div>
            ) : recentLogos.length > 0 ? (
              <div className="grid grid-cols-4 gap-4">
                {recentLogos.slice(0, 4).map((logo) => (
                  <LogoCard
                    key={logo.id}
                    imageUrl={logo.image_url}
                    title={logo.company_name || "My Logo"}
                    subtitle={`${logo.business_type || ''} • ${logo.logo_style || ''}`}
                    showDate
                    date={formatDate(logo.created_at)}
                    planType={logo.plan_type as 'free' | 'premium'}
                    onClick={() => navigate('/creations')}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white/50 rounded-2xl p-8 text-center">
                <p className="text-[var(--text-muted)]">No creations yet. Start by making a logo! 🎨</p>
                <Link 
                  to="/tools/logo-maker"
                  className="inline-block mt-4 px-6 py-2 bg-[var(--sky-blue)] text-white font-bold rounded-full hover:scale-105 transition-transform"
                >
                  Create Logo
                </Link>
              </div>
            )}
          </section>


          {/* Help Bubble */}
          <HelpBubble />
        </div>
      </main>
    </div>
  )
}
