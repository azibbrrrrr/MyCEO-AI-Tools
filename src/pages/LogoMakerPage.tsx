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
import { saveLogos, getToolByKey, selectLogoAndUpdateCompany, checkQuota, QUOTA_LIMITS } from "@/lib/supabase/ai-tools"
import { LogoZoomModal } from "@/components/LogoZoomModal"
import { LogoCard } from "@/components/LogoCard"

export default function LogoMakerPage() {
  const { t } = useLanguage()
  const { child } = useChildSession()
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
  const [symbol, setSymbol] = useState("")
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
    setSelectedLogo(index)
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
      // Individual mode: poll 3 IDs separately
      const results: (string | null)[] = [null, null, null]
      let polls = 0
      
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
            throw new Error(`Card ${i + 1} failed: ${data.error}`)
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

  const handleNext = async () => {
    if (step === 4 && plan) {
      // Generate logos with polling
      setGenerating(true)
      setError(null)
      setLogos([])
      setCardProgress([0, 0, 0])
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
              icon: symbol,
              slogan,
            },
            plan,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to start generation')
        }

        const { mode, ids } = await response.json()

        // Step 2: Poll for results with progress updates
        const imageUrls = await pollPredictions(mode, ids)
        
        // Convert to Logo format
        const generatedLogos: Logo[] = imageUrls.map((url, i) => ({
          id: `logo-${Date.now()}-${i}`,
          imageUrl: url,
          prompt: '',
          createdAt: new Date().toISOString(),
          plan: plan,
        }))

        setLogos(generatedLogos)

        // Save logos to Supabase if child is logged in
        if (child?.id) {
          try {
            const tool = await getToolByKey('logo_maker')
            if (tool) {
              const hexColors = COLOR_HEX_MAP[colorPreset as ColorPalette] || { primary: '#6B4EFF', secondary: '#FFD54F', tertiary: '#45B7D1' }
              const logosToSave = generatedLogos.map((logo: Logo) => ({
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
                symbol: symbol || null,
                image_url: logo.imageUrl,
                is_selected: false,
              }))
              const savedRecords = await saveLogos(logosToSave)
              if (savedRecords) {
                setSavedLogoIds(savedRecords.map(r => r.id))
                console.log('✅ Logos saved to Supabase', savedRecords.map(r => r.id))
              }
            }
          } catch (saveErr) {
            console.warn('Failed to save logos to DB:', saveErr)
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
          console.log('✅ Logo selection saved to DB')
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
              <div className="grid grid-cols-6 gap-3">
                {SYMBOLS.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setSymbol(symbol === item.key ? "" : item.key)}
                    className={`p-3 rounded-2xl text-2xl transition-all duration-200 border-3 ${
                      symbol === item.key
                        ? "border-[var(--sunshine-orange)] bg-[#fff5e6] scale-105 shadow-[0_4px_16px_rgba(255,184,77,0.25)]"
                        : "border-[var(--border-light)] bg-white hover:border-[var(--sky-blue)] hover:scale-102"
                    }`}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
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
                Perfect for getting started! Generate creative logo ideas instantly with our fast AI engine.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <span className="text-[var(--mint-green)]">✓</span>
                  3 logo variations per generation
                </li>
                <li className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <span className="text-[var(--mint-green)]">✓</span>
                  Fast generation (10-15 seconds)
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
            <button
              onClick={() => setPlan("premium")}
              className={`relative p-6 rounded-3xl border-3 transition-all duration-300 text-left ${
                plan === "premium"
                  ? "border-[var(--golden-yellow)] bg-gradient-to-br from-[#fffef0] to-[#fff8e0] scale-[1.02] shadow-[0_8px_32px_rgba(255,200,80,0.4)]"
                  : "border-[var(--border-light)] bg-white hover:border-[var(--golden-yellow)] hover:shadow-lg"
              }`}
            >
              <div className="absolute -top-3 left-4">
                <span className="px-3 py-1 bg-gradient-to-r from-[var(--golden-yellow)] to-[var(--sunshine-orange)] text-white text-xs font-bold rounded-full">
                  PREMIUM ⭐
                </span>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--golden-yellow)] to-[var(--sunshine-orange)] flex items-center justify-center text-3xl mb-4 shadow-md">
                👑
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Premium Quality</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Get stunning, professional-grade logos with enhanced details and text rendering.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <span className="text-[var(--golden-yellow)]">★</span>
                  3 high-quality logo variations
                </li>
                <li className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <span className="text-[var(--golden-yellow)]">★</span>
                  Better text & detail rendering
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
              {plan === "premium" && (
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[var(--golden-yellow)] flex items-center justify-center text-white text-lg">
                  ✓
                </div>
              )}
            </button>
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
            
            {/* 3 Logo Cards with Progress */}
            <div className="grid grid-cols-3 gap-4 w-full">
              {[0, 1, 2].map((i) => (
                <div key={i} className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-[var(--shadow-low)]">
                  {/* Background with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50" />
                  
                  {/* Progress overlay */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--sky-blue)] to-[var(--sky-blue-light)]"
                    style={{ 
                      height: `${cardProgress[i]}%`,
                      transition: 'height 0.3s ease-out'
                    }}
                  />
                  
                  {/* Center content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    {cardProgress[i] < 100 ? (
                      <>
                        <div className="text-3xl mb-2 animate-pulse">🎨</div>
                        <span className="text-sm font-bold text-[var(--text-primary)]">
                          {cardProgress[i]}%
                        </span>
                      </>
                    ) : (
                      <div className="text-4xl">✓</div>
                    )}
                  </div>
                  
                  {/* Card label */}
                  <div className="absolute bottom-2 left-2 right-2 text-center z-10">
                    <span className="px-2 py-1 bg-white/80 rounded-full text-xs font-semibold text-[var(--text-primary)]">
                      Logo {i + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </StepCard>
      )}

      {/* Step 6: Select logo */}
      {step === 6 && logos.length > 0 && (
        <StepCard title={t("logo.step5.title")} subtitle={t("logo.step5.subtitle")} icon="👑">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {logos.map((logo, index) => (
              <LogoCard
                key={logo.id}
                imageUrl={logo.imageUrl}
                title={`Option ${index + 1}`}
                isSelected={selectedLogo === index}
                onClick={() => openZoomModal(index)}
              />
            ))}
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
                setCardProgress([0, 0, 0])
                
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
                        icon: symbol,
                        slogan,
                      },
                      plan,
                    }),
                  })

                  if (!response.ok) {
                    throw new Error('Failed to start regeneration')
                  }

                  const { mode, ids } = await response.json()
                  const imageUrls = await pollPredictions(mode, ids)
                  
                  const generatedLogos: Logo[] = imageUrls.map((url, i) => ({
                    id: `logo-${Date.now()}-${i}`,
                    imageUrl: url,
                    prompt: '',
                    createdAt: new Date().toISOString(),
                    plan: plan,
                  }))

                  setLogos(generatedLogos)

                  // Save to DB
                  if (child?.id) {
                    try {
                      const tool = await getToolByKey('logo_maker')
                      if (tool) {
                        const logosToSave = generatedLogos.map((logo: Logo) => ({
                          child_id: child.id,
                          tool_id: tool.id,
                          plan_type: plan as 'free' | 'premium',
                          company_name: shopName,
                          business_type: businessType,
                          logo_style: logoStyle,
                          vibe: vibe,
                          color_palette: { preset: colorPreset },
                          slogan: slogan || null,
                          symbol: symbol || null,
                          image_url: logo.imageUrl,
                          is_selected: false,
                        }))
                        const savedRecords = await saveLogos(logosToSave)
                        if (savedRecords) {
                          setSavedLogoIds(savedRecords.map(r => r.id))
                        }
                      }
                    } catch (e) { console.warn('Save failed:', e) }
                  }

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
              🔄 Generate Again
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
          pickButtonLabel="Pick This One! 🎨"
          onPick={() => selectAndClose(zoomLogoIndex)}
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
              <button className="px-6 py-3 rounded-full bg-[var(--sky-blue)] text-white font-bold hover:scale-105 transition-transform border-2 border-[var(--border-light)]">
                {t("logo.download")} 📥
              </button>
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-full bg-white text-[var(--text-primary)] font-bold hover:scale-105 transition-transform border-2 border-[var(--border-light)]"
              >
                {t("logo.backToDashboard")} 🏠
              </Link>
            </div>
          </div>
        </StepCard>
      )}
    </WizardLayout>
  )
}
