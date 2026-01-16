import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import { WizardLayout } from "@/components/wizard-layout"
import { StepCard } from "@/components/step-card"
import { SelectionCard } from "@/components/selection-card"
import { WizardNav } from "@/components/wizard-nav"
import { Celebration } from "@/components/celebration"
import { Link } from "react-router-dom"
import {
  BUSINESS_TYPES,
  LOGO_STYLES,
  VIBES,
  COLOR_PRESETS,
  SYMBOLS,
  COLOR_HEX_MAP,
} from "@/constants"
import type { PlanType, Logo, ColorPalette } from "@/constants"
import { useChildSession } from "@/hooks/useChildSession"
import { saveLogos, getToolByKey, selectLogoAndUpdateCompany, checkQuota, incrementUsage, QUOTA_LIMITS } from "@/lib/supabase/ai-tools"
import { LogoZoomModal } from "@/components/LogoZoomModal"
import { PulsingBrandLoader } from '@/components/PulsingBrandLoader'

export default function LogoMakerPage() {
  const { t } = useLanguage()
  const { child, updateCompanyLogoUrl } = useChildSession()
  const [step, setStep] = useState(1)

  // Premium credits
  const [premiumCreditsLeft, setPremiumCreditsLeft] = useState<number | null>(null)

  // Step 1 inputs
  const [shopName, setShopName] = useState("")
  const [businessType, setBusinessType] = useState("")

  // Step 2 inputs
  const [logoStyle, setLogoStyle] = useState("")
  const [vibe, setVibe] = useState("")
  const [colorPreset, setColorPreset] = useState("")

  // Step 3 inputs
  const [symbols, setSymbols] = useState<string[]>([])
  const [slogan, setSlogan] = useState("")

  // Step 4: Plan selection
  const [plan, setPlan] = useState<PlanType | "">("")

  // Step 5-7 state
  const [generating, setGenerating] = useState(false)
  const [logos, setLogos] = useState<Logo[]>([])
  const [savedLogoIds, setSavedLogoIds] = useState<string[]>([]) // DB IDs of saved logos
  const [selectedLogo, setSelectedLogo] = useState<number | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Polling state for progressive loading
  const [cardProgress, setCardProgress] = useState<number[]>([0, 0, 0]) // Progress % for each card

  // Fetch premium credits on mount
  useEffect(() => {
    async function fetchPremiumCredits() {
      if (child?.id) {
        try {
          const tool = await getToolByKey('logo_maker')
          if (tool) {
            const quota = await checkQuota(child.id, tool.id, 'premium')
            setPremiumCreditsLeft(quota.generationsRemaining)
          }
        } catch (err) {
          console.warn('Failed to fetch premium credits:', err)
        }
      }
    }
    fetchPremiumCredits()
  }, [child?.id])

  // Zoom modal state (simplified - most logic is in LogoZoomModal)
  const [zoomModalOpen, setZoomModalOpen] = useState(false)
  const [zoomLogoIndex, setZoomLogoIndex] = useState<number | null>(null)

  const openZoomModal = (index: number) => {
    setZoomLogoIndex(index)
    setZoomModalOpen(true)
  }

  const closeZoomModal = () => {
    setZoomModalOpen(false)
    setZoomLogoIndex(null)
  }

  const selectAndClose = (index: number) => {
    setSelectedLogo(prev => prev === index ? null : index)
    closeZoomModal()
  }

  // Helper: Poll predictions with progress updates
  const pollPredictions = async (mode: 'batch' | 'individual', ids: string[]): Promise<string[]> => {
    const POLL_INTERVAL = 1000 // 1 second
    const MAX_POLLS = 120 // 2 minutes max

    if (mode === 'batch') {
      // Batch mode: poll 1 ID, it returns 3 images
      let polls = 0
      while (polls < MAX_POLLS) {
        const res = await fetch(`/api/check-status?id=${ids[0]}`)
        const data = await res.json()
        
        // Update all 3 cards with same progress
        setCardProgress([data.progress, data.progress, data.progress])
        
        if (data.status === 'succeeded' && data.output) {
          return data.output as string[]
        } else if (data.status === 'failed') {
          throw new Error(data.error || 'Generation failed')
        }
        
        await new Promise(r => setTimeout(r, POLL_INTERVAL))
        polls++
      }
      throw new Error('Generation timed out')
    } else {
      // Individual mode: poll each ID separately (1 for premium, could be more in future)
      const results: (string | null)[] = ids.map(() => null)
      let polls = 0
      
      // Update progress state to match number of IDs
      setCardProgress(ids.map(() => 0))
      
      while (polls < MAX_POLLS && results.some(r => r === null)) {
        const promises = ids.map(async (id, i) => {
          if (results[i]) return // Already done
          
          const res = await fetch(`/api/check-status?id=${id}`)
          const data = await res.json()
          
          setCardProgress(prev => {
            const next = [...prev]
            next[i] = data.progress
            return next
          })
          
          if (data.status === 'succeeded' && data.output) {
            results[i] = Array.isArray(data.output) ? data.output[0] : data.output
          } else if (data.status === 'failed') {
            throw new Error(`Generation failed: ${data.error}`)
          }
        })
        
        await Promise.all(promises)
        
        if (results.every(r => r !== null)) break
        
        await new Promise(r => setTimeout(r, POLL_INTERVAL))
        polls++
      }
      
      if (results.some(r => r === null)) {
        throw new Error('Generation timed out')
      }
      
      return results as string[]
    }
  }

  // Helper to upload images to permanent storage
  const uploadImages = async (tempUrls: string[]) => {
    const permanentUrls: string[] = []
    for (let i = 0; i < tempUrls.length; i++) {
      try {
        const uploadRes = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tempUrl: tempUrls[i],
            childId: child?.id || 'anonymous',
            filename: `logo-${Date.now()}-${i}`,
          }),
        })
        if (uploadRes.ok) {
          const { permanentUrl } = await uploadRes.json()
          permanentUrls.push(permanentUrl)
        } else {
          console.warn('Upload failed, using temp URL')
          permanentUrls.push(tempUrls[i])
        }
      } catch (err) {
        console.warn('Upload error, using temp URL:', err)
        permanentUrls.push(tempUrls[i])
      }
    }
    return permanentUrls
  }

  // Helper to save logos to database
  const saveLogosToDb = async (logos: Logo[]) => {
    if (!child?.id) return
    try {
      const tool = await getToolByKey('logo_maker')
      if (tool) {
        const hexColors = COLOR_HEX_MAP[colorPreset as ColorPalette] || { primary: '#6B4EFF', secondary: '#FFD54F', tertiary: '#45B7D1' }
        const logosToSave = logos.map((logo) => ({
          child_id: child.id,
          tool_id: tool.id,
          plan_type: plan as 'free' | 'premium',
          company_name: shopName,
          business_type: businessType,
          logo_style: logoStyle,
          vibe: vibe,
          color_palette: { 
            preset: colorPreset,
            primary: hexColors.primary,
            secondary: hexColors.secondary,
            tertiary: hexColors.tertiary,
          },
          slogan: slogan || null,
          symbol: symbols.length > 0 ? symbols.join(',') : null,
          image_url: logo.imageUrl,
          is_selected: false,
        }))
        const savedRecords = await saveLogos(logosToSave)
        if (savedRecords) {
          setSavedLogoIds(savedRecords.map(r => r.id))
          console.log('✅ Logos saved to Supabase', savedRecords.map(r => r.id))
        }
      }
    } catch (err) {
      console.warn('Failed to save logos to DB:', err)
    }
  }

  const handleNext = async () => {
    if (step === 4 && plan) {
      // Safety check: prevent premium generation if out of credits
      if (plan === 'premium' && premiumCreditsLeft !== null && premiumCreditsLeft <= 0) {
        setError('You have used all your premium generations. Please use the Free option.')
        return
      }

      // Generate logos with polling
      setGenerating(true)
      setError(null)
      setLogos([])
      setSelectedLogo(null)
      setCardProgress(plan === 'premium' ? [0] : [0, 0, 0])
      setStep(5)

      try {
        // Step 1: Start predictions (non-blocking)
        const response = await fetch('/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            logoWizardData: {
              businessName: shopName,
              businessType,
              logoStyle,
              vibe,
              colorPalette: colorPreset,
              icons: symbols,
              slogan,
            },
            plan,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to start generation')
        }

        const data = await response.json()
        const { mode } = data

        let tempUrls: string[] = []
        let isDirect = false

        if (mode === 'direct') {
          // Direct response (Imagen 4) - no polling needed
          const { images } = data
          if (images && Array.isArray(images)) {
             tempUrls = images
             isDirect = true
             // Set progress to complete
             setCardProgress(plan === 'premium' ? [100] : [100, 100, 100])
          }
        } else {
             // Polling response (Flux)
             const { ids } = data
             tempUrls = await pollPredictions(mode, ids)
        }
        
        // Step 3: Upload to permanent storage (skip if direct mode as they are already permanent)
        const permanentUrls = isDirect ? tempUrls : await uploadImages(tempUrls)
        
        // Step 4: Convert to Logo format
        const generatedLogos: Logo[] = permanentUrls.map((url, i) => ({
          id: `logo-${Date.now()}-${i}`,
          imageUrl: url,
          prompt: '',
          createdAt: new Date().toISOString(),
          plan: plan,
        }))

        setLogos(generatedLogos)

        // Step 5: Save logos to Supabase
        await saveLogosToDb(generatedLogos)

        // Step 6: Increment usage for premium plan
        if (plan === 'premium' && child?.id) {
          const tool = await getToolByKey('logo_maker')
          if (tool) {
            await incrementUsage(child.id, tool.id, 'premium', permanentUrls.length)
            // Update the credits display
            const quota = await checkQuota(child.id, tool.id, 'premium')
            setPremiumCreditsLeft(quota.generationsRemaining)
          }
        }

        setGenerating(false)
        setStep(6)
      } catch (err) {
        console.error('Error generating logos:', err)
        setError(err instanceof Error ? err.message : 'Failed to generate logos')
        setGenerating(false)
        setStep(4) // Go back to plan selection
      }
    } else if (step === 6 && selectedLogo !== null) {
      // Update DB: mark logo as selected and update company logo_url
      if (child?.id && savedLogoIds[selectedLogo] && child.companies?.[0]?.id) {
        try {
          await selectLogoAndUpdateCompany(
            child.id,
            savedLogoIds[selectedLogo],
            logos[selectedLogo].imageUrl,
            child.companies[0].id
          )
          // Also update localStorage so the UI shows the new logo immediately
          updateCompanyLogoUrl(logos[selectedLogo].imageUrl)
          console.log('✅ Logo selection saved to DB and localStorage')
        } catch (err) {
          console.warn('Failed to update logo selection:', err)
        }
      }
      setShowCelebration(true)
      setStep(7)
    } else {
      setStep(step + 1)
    }
  }

  const canProceed = () => {
    if (step === 1) return shopName.trim() !== "" && businessType !== ""
    if (step === 2) return logoStyle !== "" && vibe !== "" && colorPreset !== ""
    if (step === 3) return true // Optional inputs
    if (step === 4) return plan !== ""
    if (step === 6) return selectedLogo !== null
    return true
  }

  const downloadAsPng = (imageUrl: string, filename: string) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = imageUrl
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        const pngUrl = canvas.toDataURL('image/png')
        
        const link = document.createElement('a')
        link.href = pngUrl
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  }

  return (
    <WizardLayout currentStep={step} totalSteps={7} toolName={t("tool.logo")} toolIcon="🎨">
      <Celebration show={showCelebration} />

      {/* Step 1: Shop name + business type */}
      {step === 1 && (
        <StepCard title={t("logo.step1.title")} subtitle={t("logo.step1.subtitle")} icon="🏪">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                {t("logo.shopName")}
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder={t("logo.shopName.placeholder")}
                className="w-full px-4 py-3 rounded-2xl border-2 border-[var(--border-light)] focus:border-[var(--sky-blue)] focus:outline-none transition-colors text-[var(--text-primary)]"
                maxLength={30}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3">
                {t("logo.businessType")}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {BUSINESS_TYPES.map((item) => (
                  <SelectionCard
                    key={item.key}
                    icon={item.icon}
                    label={t(`logo.type.${item.key}`)}
                    selected={businessType === item.key}
                    onClick={() => setBusinessType(item.key)}
                  />
                ))}
              </div>
            </div>
          </div>
          <WizardNav onNext={handleNext} canGoNext={canProceed()} isFirstStep />
        </StepCard>
      )}

      {/* Step 2: Logo type, vibe, colors */}
      {step === 2 && (
        <StepCard title={t("logo.step2.title")} subtitle={t("logo.step2.subtitle")} icon="🎯">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3">{t("logo.style")}</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {LOGO_STYLES.map((item) => (
                  <SelectionCard
                    key={item.key}
                    icon={item.icon}
                    label={t(`logo.style.${item.key}`)}
                    selected={logoStyle === item.key}
                    onClick={() => setLogoStyle(item.key)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3">{t("logo.vibe")}</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {VIBES.map((item) => (
                  <SelectionCard
                    key={item.key}
                    icon={item.icon}
                    label={t(`logo.vibe.${item.key}`)}
                    selected={vibe === item.key}
                    onClick={() => setVibe(item.key)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3">{t("logo.colors")}</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.key}
                    onClick={() => setColorPreset(preset.key)}
                    className={`p-3 rounded-2xl border-3 transition-all duration-200 ${
                      colorPreset === preset.key
                        ? "border-[var(--sunshine-orange)] bg-[#fff5e6] scale-105 shadow-[0_4px_16px_rgba(255,184,77,0.25)]"
                        : "border-[var(--border-light)] bg-white hover:border-[var(--sky-blue)] hover:scale-102"
                    }`}
                  >
                    <div className="flex gap-1 justify-center mb-2">
                      {preset.colors.map((color, i) => (
                        <div key={i} className="w-6 h-6 rounded-full" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-[var(--text-primary)]">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <WizardNav onPrevious={() => setStep(1)} onNext={handleNext} canGoNext={canProceed()} />
        </StepCard>
      )}

      {/* Step 3: Optional symbols + slogan */}
      {step === 3 && (
        <StepCard title={t("logo.step3.title")} subtitle={t("logo.step3.subtitle")} icon="✨">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3">
                {t("logo.symbol")} ({t("common.optional")})
              </label>
              
              {/* Category labels */}
              <div className="flex flex-wrap gap-2 mb-3">
                {['🌟 Nature', '🐾 Animals', '🎉 Fun', '💎 Shapes'].map((cat, i) => (
                  <span key={i} className="text-xs font-medium text-[var(--text-secondary)] bg-[var(--bg-soft)] px-2 py-1 rounded-full">
                    {cat}
                  </span>
                ))}
              </div>
              
              {/* Symbol grid - 6 columns for clean layout */}
              <div className="grid grid-cols-6 gap-2">
                {SYMBOLS.map((item) => {
                  const isSelected = symbols.includes(item.key)
                  const canSelect = symbols.length < 3 || isSelected
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        if (isSelected) {
                          setSymbols(symbols.filter(s => s !== item.key))
                        } else if (canSelect) {
                          setSymbols([...symbols, item.key])
                        }
                      }}
                      disabled={!canSelect}
                      className={`p-2.5 rounded-xl text-2xl transition-all duration-200 border-2 ${
                        isSelected
                          ? "border-[var(--sunshine-orange)] bg-[#fff5e6] scale-110 shadow-[0_4px_16px_rgba(255,184,77,0.25)]"
                          : canSelect
                            ? "border-[var(--border-light)] bg-white hover:border-[var(--sky-blue)] hover:scale-105"
                            : "border-[var(--border-light)] bg-gray-100 opacity-50 cursor-not-allowed"
                      }`}
                      title={item.key}
                    >
                      {item.icon}
                    </button>
                  )
                })}
              </div>
              
              {/* Selection counter */}
              <p className="text-xs text-[var(--text-secondary)] mt-2">
                {symbols.length}/3 selected {symbols.length > 0 && `(${symbols.join(', ')})`}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                {t("logo.slogan")} ({t("common.optional")})
              </label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                placeholder={t("logo.slogan.placeholder")}
                className="w-full px-4 py-3 rounded-2xl border-2 border-[var(--border-light)] focus:border-[var(--sky-blue)] focus:outline-none transition-colors text-[var(--text-primary)]"
                maxLength={50}
              />
            </div>
          </div>
          <WizardNav onPrevious={() => setStep(2)} onNext={handleNext} canGoNext={canProceed()} />
        </StepCard>
      )}

      {/* Step 4: Choose Plan (Free vs Premium) */}
      {step === 4 && (
        <StepCard 
          title="Choose Your Creation Mode" 
          subtitle="Pick how you want your logo to be created" 
          icon="⚡"
        >
          {error && (
            <div className="mb-6 p-4 bg-[#fff0f0] border-2 border-red-200 rounded-2xl flex items-center gap-3">
              <span className="text-2xl">😅</span>
              <span className="text-red-600 text-sm font-medium">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Free Plan Card */}
            <button
              onClick={() => setPlan("free")}
              className={`relative p-6 rounded-3xl border-3 transition-all duration-300 text-left ${
                plan === "free"
                  ? "border-[var(--mint-green)] bg-gradient-to-br from-[#f0fff4] to-[#e6fff0] scale-[1.02] shadow-[0_8px_32px_rgba(168,230,207,0.4)]"
                  : "border-[var(--border-light)] bg-white hover:border-[var(--mint-green)] hover:shadow-lg"
              }`}
            >
              <div className="absolute -top-3 left-4">
                <span className="px-3 py-1 bg-[var(--mint-green)] text-white text-xs font-bold rounded-full">
                  FREE
                </span>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--mint-green)] to-[#6cc9a8] flex items-center justify-center text-3xl mb-4 shadow-md">
                🎨
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Quick & Easy</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Great for exploring ideas! Get 3 logo variations quickly.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <span className="text-[var(--mint-green)]">✓</span>
                  3 logo options per generation
                </li>
                <li className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <span className="text-[var(--mint-green)]">✓</span>
                  Fast results (~15 seconds)
                </li>
                <li className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <span className="text-[var(--mint-green)]">✓</span>
                  Unlimited generations
                </li>
              </ul>
              {plan === "free" && (
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[var(--mint-green)] flex items-center justify-center text-white text-lg">
                  ✓
                </div>
              )}
            </button>

            {/* Premium Plan Card */}
            {(() => {
              const isPremiumDisabled = premiumCreditsLeft !== null && premiumCreditsLeft <= 0
              return (
                <button
                  onClick={() => !isPremiumDisabled && setPlan("premium")}
                  disabled={isPremiumDisabled}
                  className={`relative p-6 rounded-3xl border-3 transition-all duration-300 text-left ${
                    isPremiumDisabled
                      ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                      : plan === "premium"
                        ? "border-[var(--golden-yellow)] bg-gradient-to-br from-[#fffef0] to-[#fff8e0] scale-[1.02] shadow-[0_8px_32px_rgba(255,200,80,0.4)]"
                        : "border-[var(--border-light)] bg-white hover:border-[var(--golden-yellow)] hover:shadow-lg"
                  }`}
                >
                  <div className="absolute -top-3 left-4">
                    <span className={`px-3 py-1 text-white text-xs font-bold rounded-full ${
                      isPremiumDisabled 
                        ? "bg-gray-400" 
                        : "bg-gradient-to-r from-[var(--golden-yellow)] to-[var(--sunshine-orange)]"
                    }`}>
                      {isPremiumDisabled ? "OUT OF CREDITS" : "PREMIUM ⭐"}
                    </span>
                  </div>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-md ${
                    isPremiumDisabled 
                      ? "bg-gray-300" 
                      : "bg-gradient-to-br from-[var(--golden-yellow)] to-[var(--sunshine-orange)]"
                  }`}>
                    {isPremiumDisabled ? "🔒" : "👑"}
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Premium Quality</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    {isPremiumDisabled 
                      ? "You've used all your premium generations." 
                      : "Professional-grade logo with superior text and detail quality."}
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <span className="text-[var(--golden-yellow)]">★</span>
                      1 high-quality logo per generation
                    </li>
                    <li className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <span className="text-[var(--golden-yellow)]">★</span>
                      Best text & typography rendering
                    </li>
                    <li className="flex items-center gap-2 font-semibold">
                      <span className="text-[var(--golden-yellow)]">★</span>
                      {premiumCreditsLeft !== null ? (
                        <span className={premiumCreditsLeft > 0 ? 'text-[var(--mint-green)]' : 'text-red-500'}>
                          {premiumCreditsLeft} of {QUOTA_LIMITS.premium.maxGenerations} generations left
                        </span>
                      ) : (
                        <span className="text-[var(--text-secondary)]">
                          {QUOTA_LIMITS.premium.maxGenerations} generations included
                        </span>
                      )}
                    </li>
                  </ul>
                  {plan === "premium" && !isPremiumDisabled && (
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[var(--golden-yellow)] flex items-center justify-center text-white text-lg">
                      ✓
                    </div>
                  )}
                </button>
              )
            })()}
          </div>

          <WizardNav 
            onPrevious={() => setStep(3)} 
            onNext={handleNext} 
            canGoNext={canProceed()} 
            nextLabel="Generate Logos ✨"
          />
        </StepCard>
      )}

      {/* Step 5: Generating animation with progress bars */}
      {step === 5 && generating && (
        <StepCard title={t("logo.generating.title")} subtitle={t("logo.generating.subtitle")} icon="🎨">
          <div className="flex flex-col items-center py-4">
            <p className="text-center text-[var(--text-secondary)] mb-6">
              {plan === "premium" 
                ? "Creating premium-quality logos with enhanced details..." 
                : "Generating creative logo ideas..."}
            </p>
            
            {/* Logo Cards with Circular Progress - 1 for premium, 3 for free */}
            <div className={`grid gap-6 w-full ${plan === 'premium' ? 'grid-cols-1 max-w-xs mx-auto' : 'grid-cols-3'}`}>
              {(plan === 'premium' ? [0] : [0, 1, 2]).map((i) => {
                const progress = cardProgress[i] || 0
                
                return (
                  <div key={i} className="bg-white p-6 rounded-3xl shadow-[var(--shadow-medium)] flex flex-col items-center border-gray-200 border-4 relative overflow-hidden transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="absolute top-0 right-0 bg-[var(--sky-blue)] text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                      {progress < 100 ? "CREATING" : "READY"}
                    </div>
                    
                    <h3 className="text-lg font-bold mb-4 text-[var(--text-primary)]">
                       {plan === 'premium' ? 'Premium Logo' : `Logo ${i + 1}`}
                    </h3>

                    <div className="flex items-center justify-center h-28 w-28 py-2">
                      {progress < 100 ? (
                         <PulsingBrandLoader size="sm" icon={plan === "premium" ? "👑" : "🎨"} />
                      ) : (
                         <div className="text-5xl animate-pulse">✨</div>
                      )}
                    </div>
                    
                    <p className="text-sm text-[var(--text-muted)] mt-4 text-center">
                       {progress < 100 ? "AI is refining details..." : "Design complete!"}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </StepCard>
      )}

      {/* Step 6: Select logo */}
      {step === 6 && logos.length > 0 && (
        <StepCard title={t("logo.step5.title")} subtitle={t("logo.step5.subtitle")} icon="👑">
          <div className={`grid gap-6 ${logos.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' : 'grid-cols-1 sm:grid-cols-3'}`}>
            {logos.map((logo, index) => {
               const isSelected = selectedLogo === index
               return (
                  <div 
                    key={logo.id}
                    onClick={() => openZoomModal(index)}
                    className={`bg-white p-6 rounded-3xl shadow-[var(--shadow-medium)] flex flex-col items-center border-4 relative overflow-hidden transition-all duration-300 transform hover:scale-[1.02] cursor-pointer ${
                      isSelected ? 'border-[var(--sky-blue)]' : 'border-gray-200'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 right-0 bg-[var(--sky-blue)] text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                        SELECTED
                      </div>
                    )}
                    
                    <h3 className="text-lg font-bold mb-4 text-[var(--text-primary)]">
                       {logos.length === 1 ? 'Your Premium Logo' : `Logo ${index + 1}`}
                    </h3>

                    <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-sm">
                       <img src={logo.imageUrl} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                  </div>
               )
            })}
          </div>
          
          {/* Regenerate button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={async () => {
                setSelectedLogo(null)
                setLogos([])
                // Go back to step 4 momentarily then trigger next to regenerate
                setStep(4)
                // Small delay then trigger handleNext
                await new Promise(r => setTimeout(r, 50))
                // Directly trigger generation with same settings
                setStep(5)
                setGenerating(true)
                setError(null)
                setCardProgress(plan === 'premium' ? [0] : [0, 0, 0])
                
                try {
                  const response = await fetch('/api/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      logoWizardData: {
                        businessName: shopName,
                        businessType,
                        logoStyle,
                        vibe,
                        colorPalette: colorPreset,
                        icons: symbols,
                        slogan,
                      },
                      plan,
                    }),
                  })

                  if (!response.ok) {
                    throw new Error('Failed to start regeneration')
                  }

                    const data = await response.json()
                    const { mode } = data

                    let tempUrls: string[] = []
                    let isDirect = false

                    if (mode === 'direct') {
                         const { images } = data
                         if (images && Array.isArray(images)) {
                              tempUrls = images
                              isDirect = true
                              setCardProgress(plan === 'premium' ? [100] : [100, 100, 100])
                         }
                    } else {
                         const { ids } = data
                         tempUrls = await pollPredictions(mode, ids)
                    }
                    
                    // Upload to permanent storage (skip if direct)
                    const permanentUrls = isDirect ? tempUrls : await uploadImages(tempUrls)
                    
                    const generatedLogos: Logo[] = permanentUrls.map((url, i) => ({
                      id: `logo-${Date.now()}-${i}`,
                      imageUrl: url,
                      prompt: '',
                      createdAt: new Date().toISOString(),
                      plan: plan,
                    }))

                    setLogos(generatedLogos)

                    // Save to DB
                    await saveLogosToDb(generatedLogos)

                  setGenerating(false)
                  setStep(6)
                } catch (err) {
                  console.error('Regeneration error:', err)
                  setError(err instanceof Error ? err.message : 'Regeneration failed')
                  setGenerating(false)
                  setStep(6)
                }
              }}
              className="px-5 py-2.5 rounded-full border-2 border-[var(--sky-blue)] text-[var(--sky-blue)] font-semibold hover:bg-[var(--sky-blue)]/10 transition-colors flex items-center gap-2"
            >
              Generate Again
            </button>
          </div>
          
          <WizardNav onPrevious={() => setStep(4)} onNext={handleNext} canGoNext={canProceed()} />
        </StepCard>
      )}

      {/* Zoom Modal */}
      {zoomLogoIndex !== null && (
        <LogoZoomModal
          isOpen={zoomModalOpen}
          imageUrl={logos[zoomLogoIndex]?.imageUrl || ''}
          title={`Option ${zoomLogoIndex + 1}`}
          onClose={closeZoomModal}
          showPickButton={true}
          pickButtonLabel={selectedLogo === zoomLogoIndex ? "Unpick Selection ❌" : "Pick This One! 🎨"}
          pickButtonColor={selectedLogo === zoomLogoIndex ? "bg-red-500 hover:bg-red-600" : undefined}
          onPick={() => zoomLogoIndex !== null && selectAndClose(zoomLogoIndex)}
        />
      )}

      {/* Step 7: Success */}
      {step === 7 && selectedLogo !== null && (
        <StepCard title={t("logo.step6.title")} subtitle={t("logo.step6.subtitle")} icon="🎉">
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-3xl bg-white shadow-[var(--shadow-high)] flex items-center justify-center mb-6 border-3 border-[var(--sunshine-orange)] overflow-hidden">
              <img src={logos[selectedLogo].imageUrl} alt="Selected logo" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{shopName}</h3>
            {slogan && <p className="text-[var(--text-secondary)] mb-4">"{slogan}"</p>}

            <div className="flex gap-3">
              <button 
                onClick={() => {
                  const filename = `logo-${shopName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`
                  downloadAsPng(logos[selectedLogo].imageUrl, filename)
                }}
                className="px-6 py-3 rounded-full bg-[var(--sky-blue)] text-white font-bold hover:scale-105 transition-transform border-2 border-[var(--border-light)]"
              >
                {t("logo.download")}
              </button>
              <Link
                to="/"
                className="px-6 py-3 rounded-full bg-white text-[var(--text-primary)] font-bold hover:scale-105 transition-transform border-2 border-[var(--border-light)]"
              >
                {t("logo.backToDashboard")}
              </Link>
            </div>
          </div>
        </StepCard>
      )}
    </WizardLayout>
  )
}
