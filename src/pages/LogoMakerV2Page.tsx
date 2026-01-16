import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
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
import { Celebration } from "@/components/celebration"

export default function LogoMakerV2Page() {
  useLanguage() // For context
  const { child, updateCompanyLogoUrl } = useChildSession()

  // Form inputs - all visible at once
  const [shopName, setShopName] = useState("")
  const [businessType, setBusinessType] = useState("")
  const [logoStyle, setLogoStyle] = useState("")
  const [vibe, setVibe] = useState("")
  const [colorPreset, setColorPreset] = useState("")
  const [symbols, setSymbols] = useState<string[]>([])
  const [slogan, setSlogan] = useState("")

  // Generation state
  const [generating, setGenerating] = useState(false)
  const [logos, setLogos] = useState<Logo[]>([])
  const [selectedLogo, setSelectedLogo] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [savedLogoIds, setSavedLogoIds] = useState<string[]>([])
  const [showCelebration, setShowCelebration] = useState(false)

  // Premium credits
  const [premiumCreditsLeft, setPremiumCreditsLeft] = useState<number | null>(null)

  // Zoom modal
  const [zoomModalOpen, setZoomModalOpen] = useState(false)
  const [zoomLogoIndex, setZoomLogoIndex] = useState<number | null>(null)

  // Fetch premium credits
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

  // Polling helper
  const pollPrediction = async (predictionId: string, onProgress?: (p: number) => void): Promise<string | null> => {
    const maxAttempts = 120
    let attempts = 0
    while (attempts < maxAttempts) {
      const response = await fetch(`/api/check-status?id=${predictionId}`)
      const data = await response.json()
      if (data.status === 'succeeded' && data.output) {
        onProgress?.(100)
        return Array.isArray(data.output) ? data.output[0] : data.output
      } else if (data.status === 'failed' || data.status === 'canceled') {
        throw new Error(data.error || 'Generation failed')
      }
      const progress = data.progress || Math.min(90, 10 + (attempts / maxAttempts) * 80)
      onProgress?.(Math.round(progress))
      await new Promise(resolve => setTimeout(resolve, 1000))
      attempts++
    }
    return null
  }

  // Upload images to permanent storage
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
          permanentUrls.push(tempUrls[i])
        }
      } catch (err) {
        permanentUrls.push(tempUrls[i])
      }
    }
    return permanentUrls
  }

  // Save logos to database
  const saveLogosToDb = async (logos: Logo[], plan: PlanType) => {
    if (!child?.id) return
    const hexColors = COLOR_HEX_MAP[colorPreset as ColorPalette] || { primary: '#60b5f4', secondary: '#ffb84d', tertiary: '#a8e6cf' }
    try {
      const tool = await getToolByKey('logo_maker')
      if (!tool) return
      const logosToSave = logos.map((logo) => ({
        child_id: child.id,
        tool_id: tool.id,
        plan_type: plan as 'free' | 'premium',
        company_name: shopName,
        business_type: businessType || null,
        logo_style: logoStyle || null,
        vibe: vibe || null,
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
      }
    } catch (err) {
      console.warn('Failed to save logos to DB:', err)
    }
  }

  // Generate logos
  const handleGenerate = async (plan: PlanType) => {
    if (!shopName.trim()) {
      setError('Please enter a business name')
      return
    }

    // Check premium credits
    if (plan === 'premium' && premiumCreditsLeft !== null && premiumCreditsLeft <= 0) {
      setError('You have used all your premium generations.')
      return
    }

    setGenerating(true)
    setError(null)
    setLogos([])
    setSelectedLogo(null)

    try {
      // Start predictions
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

      // Poll for results
      const results: (string | null)[] = []
      let isDirect = false

      if (mode === 'direct') {
        const { images } = data
        if (images && Array.isArray(images)) {
            results.push(...images)
            isDirect = true
        }
      } else if (mode === 'batch') {
        const ids = data.ids
        const result = await pollPrediction(ids[0])
        if (result) {
          if (Array.isArray(result)) {
            results.push(...result)
          } else {
            results.push(result)
          }
        }
      } else {
        const ids = data.ids
        for (const id of ids) {
          const result = await pollPrediction(id)
          results.push(result)
        }
      }

      const tempUrls = results.filter(Boolean) as string[]
      if (tempUrls.length === 0) {
        throw new Error('No logos generated')
      }

      // Upload to permanent storage (skip if direct mode as they are already permanent)
      const permanentUrls = isDirect ? tempUrls : await uploadImages(tempUrls)

      // Create logo objects
      const generatedLogos: Logo[] = permanentUrls.map((url, i) => ({
        id: `logo-${Date.now()}-${i}`,
        imageUrl: url,
        prompt: '',
        createdAt: new Date().toISOString(),
        plan: plan,
      }))

      setLogos(generatedLogos)
      await saveLogosToDb(generatedLogos, plan)

      // Increment usage for premium
      if (plan === 'premium' && child?.id) {
        const tool = await getToolByKey('logo_maker')
        if (tool) {
          await incrementUsage(child.id, tool.id, 'premium', permanentUrls.length)
          const quota = await checkQuota(child.id, tool.id, 'premium')
          setPremiumCreditsLeft(quota.generationsRemaining)
        }
      }

      setGenerating(false)
    } catch (err) {
      console.error('Error generating logos:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate logos')
      setGenerating(false)
    }
  }

  // Select and save logo
  const handleSelectLogo = async (index: number) => {
    setSelectedLogo(index)
    
    if (child?.id && savedLogoIds[index] && child.companies?.[0]?.id) {
      try {
        await selectLogoAndUpdateCompany(
          child.id,
          savedLogoIds[index],
          logos[index].imageUrl,
          child.companies[0].id
        )
        updateCompanyLogoUrl(logos[index].imageUrl)
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
      } catch (err) {
        console.warn('Failed to update logo selection:', err)
      }
    }
  }

  const openZoomModal = (index: number) => {
    setZoomLogoIndex(index)
    setZoomModalOpen(true)
  }

  const closeZoomModal = () => {
    setZoomModalOpen(false)
    setZoomLogoIndex(null)
  }

  const canGenerate = shopName.trim() !== ''
  const isPremiumDisabled = premiumCreditsLeft !== null && premiumCreditsLeft <= 0

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#e8f4fc_0%,#f0f8ff_50%,#fff9e6_100%)]">
      <Celebration show={showCelebration} onComplete={() => setShowCelebration(false)} />

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-[var(--border-light)]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-4 py-2 bg-white rounded-full shadow-[var(--shadow-low)] hover:shadow-[var(--shadow-medium)] transition-shadow text-[var(--text-secondary)] font-semibold"
            >
              ← Back
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-3xl">🎨</span>
              <span className="text-xl font-bold text-[var(--text-primary)]">Logo Maker Studio</span>
            </div>
          </div>
          
          {premiumCreditsLeft !== null && (
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-[var(--shadow-low)]">
              <span className="text-lg">👑</span>
              <span className={`font-bold ${premiumCreditsLeft > 0 ? 'text-[var(--mint-green)]' : 'text-red-500'}`}>
                {premiumCreditsLeft}/{QUOTA_LIMITS.premium.maxGenerations} Premium
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Left Panel - Settings */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl shadow-[var(--shadow-medium)] p-6 space-y-6">
              
              {/* Business Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-2">
                  📝 Business Name
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g., Rainbow Stars"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[var(--border-light)] focus:border-[var(--sky-blue)] focus:outline-none transition-colors text-[var(--text-primary)]"
                  maxLength={30}
                />
              </div>

              {/* Business Type */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-2">
                  🏪 What do you sell?
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {BUSINESS_TYPES.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setBusinessType(businessType === item.key ? "" : item.key)}
                      className={`p-3 rounded-xl text-2xl transition-all duration-200 border-2 ${
                        businessType === item.key
                          ? "border-[var(--sunshine-orange)] bg-[#fff5e6] scale-105 shadow-[0_4px_16px_rgba(255,184,77,0.25)]"
                          : "border-[var(--border-light)] bg-white hover:border-[var(--sky-blue)]"
                      }`}
                      title={item.key}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logo Style */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-2">
                  🎯 Logo Style
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {LOGO_STYLES.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setLogoStyle(logoStyle === item.key ? "" : item.key)}
                      className={`p-3 rounded-xl text-2xl transition-all duration-200 border-2 ${
                        logoStyle === item.key
                          ? "border-[var(--sunshine-orange)] bg-[#fff5e6] scale-105 shadow-[0_4px_16px_rgba(255,184,77,0.25)]"
                          : "border-[var(--border-light)] bg-white hover:border-[var(--sky-blue)]"
                      }`}
                      title={item.key}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vibe */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-2">
                  ✨ Vibe
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {VIBES.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setVibe(vibe === item.key ? "" : item.key)}
                      className={`p-3 rounded-xl text-2xl transition-all duration-200 border-2 ${
                        vibe === item.key
                          ? "border-[var(--sunshine-orange)] bg-[#fff5e6] scale-105 shadow-[0_4px_16px_rgba(255,184,77,0.25)]"
                          : "border-[var(--border-light)] bg-white hover:border-[var(--sky-blue)]"
                      }`}
                      title={item.key}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-2">
                  🎨 Colors
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.key}
                      onClick={() => setColorPreset(colorPreset === preset.key ? "" : preset.key)}
                      className={`relative p-2 rounded-xl transition-all duration-200 border-2 ${
                        colorPreset === preset.key
                          ? "border-[var(--sunshine-orange)] scale-105 shadow-[0_4px_16px_rgba(255,184,77,0.25)]"
                          : "border-[var(--border-light)] hover:border-[var(--sky-blue)]"
                      }`}
                    >
                      <div className="flex gap-1 justify-center">
                        {preset.colors.map((color, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Symbols */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-2">
                  ⭐ Add Icons (up to 3)
                </label>
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
                        className={`p-2 rounded-xl text-xl transition-all duration-200 border-2 ${
                          isSelected
                            ? "border-[var(--sunshine-orange)] bg-[#fff5e6] scale-110"
                            : canSelect
                              ? "border-[var(--border-light)] bg-white hover:border-[var(--sky-blue)]"
                              : "border-[var(--border-light)] bg-gray-100 opacity-50 cursor-not-allowed"
                        }`}
                        title={item.key}
                      >
                        {item.icon}
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  {symbols.length}/3 selected
                </p>
              </div>

              {/* Slogan */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] mb-2">
                  💬 Slogan (optional)
                </label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="e.g., Play with magic!"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[var(--border-light)] focus:border-[var(--sky-blue)] focus:outline-none transition-colors text-[var(--text-primary)]"
                  maxLength={50}
                />
              </div>
            </div>

            {/* Generate Buttons */}
            <div className="bg-white rounded-3xl shadow-[var(--shadow-medium)] p-6 space-y-3">
              {error && (
                <div className="p-4 bg-[#fff0f0] border-2 border-red-200 rounded-2xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={() => handleGenerate('free')}
                disabled={!canGenerate || generating}
                className={`w-full py-4 rounded-full font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  canGenerate && !generating
                    ? "bg-[var(--mint-green)] text-white hover:scale-[1.02] shadow-[var(--shadow-medium)]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {generating ? "✨ Creating..." : "🎨 Generate Free (3 logos)"}
              </button>

              <button
                onClick={() => handleGenerate('premium')}
                disabled={!canGenerate || generating || isPremiumDisabled}
                className={`w-full py-4 rounded-full font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  isPremiumDisabled
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : canGenerate && !generating
                      ? "bg-gradient-to-r from-[var(--golden-yellow)] to-[var(--sunshine-orange)] text-white hover:scale-[1.02] shadow-[var(--shadow-medium)]"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isPremiumDisabled ? "🔒 Out of Premium Credits" : generating ? "✨ Creating..." : "👑 Generate Premium (1 logo)"}
              </button>
            </div>
          </div>

          {/* Right Panel - Preview & Results */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Live Preview */}
            <div className="bg-white rounded-3xl shadow-[var(--shadow-medium)] p-6">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                👀 Preview
              </h3>
              <div className="p-4 bg-[var(--bg-soft)] rounded-2xl">
                <div className="flex flex-wrap gap-2 text-sm">
                  {shopName && (
                    <span className="px-3 py-1 bg-white rounded-full shadow-sm">
                      📝 {shopName}
                    </span>
                  )}
                  {businessType && (
                    <span className="px-3 py-1 bg-white rounded-full shadow-sm">
                      🏪 {businessType}
                    </span>
                  )}
                  {logoStyle && (
                    <span className="px-3 py-1 bg-white rounded-full shadow-sm">
                      🎯 {logoStyle}
                    </span>
                  )}
                  {vibe && (
                    <span className="px-3 py-1 bg-white rounded-full shadow-sm">
                      ✨ {vibe}
                    </span>
                  )}
                  {colorPreset && (
                    <span className="px-3 py-1 bg-white rounded-full shadow-sm">
                      🎨 {colorPreset}
                    </span>
                  )}
                  {symbols.length > 0 && (
                    <span className="px-3 py-1 bg-white rounded-full shadow-sm">
                      ⭐ {symbols.join(', ')}
                    </span>
                  )}
                  {slogan && (
                    <span className="px-3 py-1 bg-white rounded-full shadow-sm">
                      💬 "{slogan}"
                    </span>
                  )}
                  {!shopName && (
                    <span className="text-[var(--text-secondary)]">
                      Start by entering your business name...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Generating State */}
            {generating && (
              <div className="bg-white rounded-3xl shadow-[var(--shadow-medium)] p-6">
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  ✨ Creating your logos...
                </h3>
                <div className="flex justify-center py-8">
                  <PulsingBrandLoader size="lg" icon="✨" />
                </div>
              </div>
            )}

            {/* Generated Logos */}
            {logos.length > 0 && !generating && (
              <div className="bg-white rounded-3xl shadow-[var(--shadow-medium)] p-6">
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  🎉 Your Logos
                </h3>
                <div className={`grid gap-4 ${logos.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' : 'grid-cols-3'}`}>
                  {logos.map((logo, index) => (
                    <div
                      key={logo.id}
                      className={`relative rounded-2xl overflow-hidden border-3 cursor-pointer transition-all duration-200 ${
                        selectedLogo === index
                          ? "border-[var(--sunshine-orange)] scale-105 shadow-[0_8px_32px_rgba(255,184,77,0.4)]"
                          : "border-[var(--border-light)] hover:border-[var(--sky-blue)] hover:scale-[1.02]"
                      }`}
                      onClick={() => openZoomModal(index)}
                    >
                      <img
                        src={logo.imageUrl}
                        alt={`Logo option ${index + 1}`}
                        className="w-full aspect-square object-cover"
                      />
                      {selectedLogo === index && (
                        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[var(--sunshine-orange)] flex items-center justify-center text-white">
                          ✓
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 right-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectLogo(index)
                          }}
                          className={`w-full py-2 rounded-full text-sm font-bold transition-all ${
                            selectedLogo === index
                              ? "bg-[var(--sunshine-orange)] text-white"
                              : "bg-white/90 text-[var(--text-primary)] hover:bg-[var(--sky-blue)] hover:text-white"
                          }`}
                        >
                          {selectedLogo === index ? "✓ Selected!" : "Pick This!"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Logo Actions */}
            {selectedLogo !== null && logos[selectedLogo] && (
              <div className="bg-white rounded-3xl shadow-[var(--shadow-medium)] p-6">
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  🎉 Your Logo is Ready!
                </h3>
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden border-3 border-[var(--sunshine-orange)] shadow-lg mb-4">
                    <img
                      src={logos[selectedLogo].imageUrl}
                      alt="Selected logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xl font-bold text-[var(--text-primary)] mb-2">{shopName}</p>
                  {slogan && <p className="text-[var(--text-secondary)] mb-4">"{slogan}"</p>}
                  <div className="flex gap-3">
                    <button className="px-6 py-3 rounded-full bg-[var(--sky-blue)] text-white font-bold hover:scale-105 transition-transform">
                      Download
                    </button>
                    <Link
                      to="/"
                      className="px-6 py-3 rounded-full bg-white text-[var(--text-primary)] font-bold hover:scale-105 transition-transform border-2 border-[var(--border-light)]"
                    >
                      🏠 Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {logos.length === 0 && !generating && (
              <div className="bg-white rounded-3xl shadow-[var(--shadow-medium)] p-12 text-center">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                  Ready to create your logo!
                </h3>
                <p className="text-[var(--text-secondary)]">
                  Fill in your business details on the left and click Generate
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Zoom Modal */}
      {zoomLogoIndex !== null && logos[zoomLogoIndex] && (
        <LogoZoomModal
          isOpen={zoomModalOpen}
          imageUrl={logos[zoomLogoIndex].imageUrl}
          title={`Option ${zoomLogoIndex + 1}`}
          onClose={closeZoomModal}
          showPickButton={true}
          pickButtonLabel="Pick This One! 🎨"
          onPick={() => {
            handleSelectLogo(zoomLogoIndex)
            closeZoomModal()
          }}
        />
      )}
    </div>
  )
}
