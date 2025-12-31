/**
 * Booth Ready Page
 * Create booth mockups using SVG templates with brand colors and logo
 */

import { useState, useEffect, useRef } from "react"
import { useLanguage } from "@/components/language-provider"
import { WizardLayout } from "@/components/wizard-layout"
import { StepCard } from "@/components/step-card"
import { WizardNav } from "@/components/wizard-nav"
import { useChildSession } from "@/hooks/useChildSession"
import { Link } from "react-router-dom"
import { 
  BoothRenderer, 
  BOOTH_TEMPLATES, 
  type BoothTemplateId 
} from "@/components/booth/BoothRenderer"

export default function BoothReadyPage() {
  const { t } = useLanguage()
  const { child } = useChildSession()
  
  // State
  const [step, setStep] = useState(1)
  const [selectedTemplates, setSelectedTemplates] = useState<BoothTemplateId[]>([])
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [transparentLogoUrl, setTransparentLogoUrl] = useState<string | null>(null)
  const [removingBg, setRemovingBg] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Refs for export (divs containing SVGs)
  const svgRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Get company data
  const company = child?.companies?.[0]
  const companyLogo = company?.logo_url
  const companyName = company?.company_name || child?.name || "My Business"
  
  // Brand colors - will be loaded from selected logo
  const [primaryColor, setPrimaryColor] = useState("#6B4EFF")
  const [secondaryColor, setSecondaryColor] = useState("#FFD54F")

  // Load logo and colors from selected logo
  useEffect(() => {
    async function loadLogoData() {
      if (companyLogo) {
        setLogoUrl(companyLogo)
      }
      
      // Fetch selected logo to get brand colors from color_palette JSON
      if (child?.id) {
        try {
          const { getSelectedLogo } = await import('@/lib/supabase/ai-tools')
          const selectedLogo = await getSelectedLogo(child.id)
          if (selectedLogo?.color_palette) {
            const palette = selectedLogo.color_palette as { primary?: string; secondary?: string; tertiary?: string }
            if (palette.primary) setPrimaryColor(palette.primary)
            if (palette.secondary) setSecondaryColor(palette.secondary)
          }
        } catch (err) {
          console.warn('Could not load logo colors:', err)
        }
      }
    }
    loadLogoData()
  }, [companyLogo, child?.id])

  // Toggle template selection
  const toggleTemplate = (templateId: BoothTemplateId) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    )
  }

  // Remove background from logo
  const handleRemoveBackground = async () => {
    if (!logoUrl) return
    
    setRemovingBg(true)
    setError(null)
    
    try {
      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: logoUrl }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to remove background')
      }
      
      const data = await response.json()
      const tempTransparentUrl = data.transparentUrl
      
      // Step 3: Upload transparent version to permanent storage
      try {
        const uploadRes = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tempUrl: tempTransparentUrl,
            childId: child?.id || 'anonymous',
            filename: `logo-transparent-${Date.now()}`,
          }),
        })
        if (uploadRes.ok) {
          const { permanentUrl } = await uploadRes.json()
          setTransparentLogoUrl(permanentUrl)
        } else {
          setTransparentLogoUrl(tempTransparentUrl)
        }
      } catch (uploadErr) {
        console.warn('Permanent upload failed for transparent logo:', uploadErr)
        setTransparentLogoUrl(tempTransparentUrl)
      }
      
      setStep(2)
    } catch (err) {
      console.error('Remove BG error:', err)
      setError('Failed to process logo. Using original.')
      // Fall back to original logo
      setTransparentLogoUrl(logoUrl)
      setStep(2)
    } finally {
      setRemovingBg(false)
    }
  }

  // Export SVG to PNG
  const exportToPng = async (templateId: BoothTemplateId) => {
    const container = svgRefs.current[templateId]
    if (!container) return
    
    // Find SVG inside the container div
    const svg = container.querySelector('svg')
    if (!svg) return

    try {
      // Get SVG dimensions
      const viewBox = svg.getAttribute('viewBox')?.split(' ').map(Number) || [0, 0, 600, 400]
      const svgWidth = viewBox[2]
      const svgHeight = viewBox[3]
      
      // Get SVG as string
      const svgData = new XMLSerializer().serializeToString(svg)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)

      // Create image from SVG
      const img = new Image()
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas')
        canvas.width = svgWidth * 2 // 2x for high res
        canvas.height = svgHeight * 2
        
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        
        // Scale for high res
        ctx.scale(2, 2)
        
        // Draw image
        ctx.drawImage(img, 0, 0, svgWidth, svgHeight)
        
        // Download
        const link = document.createElement('a')
        link.download = `booth-${templateId}-${companyName.replace(/\s+/g, '-')}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
        
        URL.revokeObjectURL(url)
      }
      img.src = url
    } catch (err) {
      console.error('Export error:', err)
    }
  }

  // Can proceed check
  const canProceed = () => {
    if (step === 1) return !!logoUrl
    if (step === 2) return selectedTemplates.length > 0
    return false
  }

  // Handle next
  const handleNext = async () => {
    if (step === 1 && logoUrl) {
      await handleRemoveBackground()
    } else if (step === 2 && selectedTemplates.length > 0) {
      setStep(3)
    }
  }

  return (
    <WizardLayout 
      currentStep={step} 
      totalSteps={3} 
      toolName={t("tool.booth")} 
      toolIcon="🏪"
    >
      {/* Step 1: Check Logo */}
      {step === 1 && (
        <StepCard 
          title="Your Logo" 
          subtitle="We'll use your company logo for the booth mockups" 
          icon="🎨"
        >
          <div className="flex flex-col items-center py-8">
            {companyLogo ? (
              <>
                <div className="w-40 h-40 rounded-2xl bg-white shadow-[var(--shadow-medium)] flex items-center justify-center mb-6 border-2 border-[var(--border-light)] overflow-hidden">
                  <img 
                    src={companyLogo} 
                    alt="Company Logo" 
                    className="w-full h-full object-contain p-4"
                  />
                </div>
                <p className="text-[var(--text-secondary)] mb-4 text-center">
                  We'll remove the background to make it look great on mockups!
                </p>
                {error && (
                  <p className="text-red-500 text-sm mb-4">{error}</p>
                )}
              </>
            ) : (
              <div className="text-center">
                <div className="w-40 h-40 rounded-2xl bg-gray-100 flex items-center justify-center mb-6 border-2 border-dashed border-gray-300">
                  <span className="text-5xl">🎨</span>
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                  No Logo Yet!
                </h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Create a logo first to use in your booth mockups.
                </p>
                <Link 
                  to="/tools/logo-maker"
                  className="inline-block px-6 py-3 bg-[var(--sky-blue)] text-white font-bold rounded-full hover:scale-105 transition-transform"
                >
                  Create Logo First 🚀
                </Link>
              </div>
            )}
          </div>
          
          {companyLogo && (
            <WizardNav 
              onNext={handleNext}
              canGoNext={canProceed()}
              nextLabel={removingBg ? "Processing... ⏳" : "Prepare Logo ✨"}
            />
          )}
        </StepCard>
      )}

      {/* Step 2: Select Mockup Types */}
      {step === 2 && (
        <StepCard 
          title="Choose Mockups" 
          subtitle="Select the booth materials you want to create" 
          icon="🖼️"
        >
          <div className="grid grid-cols-2 gap-4 mb-8">
            {BOOTH_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => toggleTemplate(template.id)}
                className={`relative p-6 rounded-2xl border-3 transition-all duration-300 text-left ${
                  selectedTemplates.includes(template.id)
                    ? "border-[var(--sky-blue)] bg-gradient-to-br from-[#f0f7ff] to-[#e6f0ff] scale-[1.02] shadow-[0_8px_32px_rgba(66,170,217,0.3)]"
                    : "border-[var(--border-light)] bg-white hover:border-[var(--sky-blue)] hover:shadow-lg"
                }`}
              >
                <div className="text-4xl mb-3">{template.icon}</div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
                  {template.name}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {template.description}
                </p>
                
                {selectedTemplates.includes(template.id) && (
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[var(--sky-blue)] flex items-center justify-center text-white text-lg">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
          
          <p className="text-center text-[var(--text-secondary)] mb-6">
            {selectedTemplates.length === 0 
              ? "Select at least one mockup type"
              : `${selectedTemplates.length} mockup${selectedTemplates.length > 1 ? 's' : ''} selected`
            }
          </p>
          
          <WizardNav 
            onPrevious={() => setStep(1)}
            onNext={handleNext}
            canGoNext={canProceed()}
            nextLabel="Generate Mockups ✨"
          />
        </StepCard>
      )}

      {/* Step 3: Preview & Download */}
      {step === 3 && transparentLogoUrl && (
        <StepCard 
          title="Your Booth Mockups" 
          subtitle="Download your materials for the booth!" 
          icon="🎉"
        >
          {/* Mockup Grid - single column for cleaner look */}
          <div className="space-y-8">
            {selectedTemplates.map((templateId) => {
              const template = BOOTH_TEMPLATES.find(t => t.id === templateId)
              if (!template) return null
              
              // Calculate sizes based on template type
              const isSmall = templateId === 'sticker' || templateId === 'pricetag'
              const mockupWidth = isSmall ? 240 : 480
              const mockupHeight = templateId === 'pricetag' ? 320 : templateId === 'sticker' ? 240 : 300
              
              return (
                <div 
                  key={templateId}
                  className="bg-white rounded-3xl shadow-[var(--shadow-medium)] border-2 border-[var(--border-light)] overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-light)] bg-gradient-to-r from-white to-[var(--sky-lighter)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--sky-light)] flex items-center justify-center text-xl">
                        {template.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-[var(--text-primary)] text-lg">
                          {template.name}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {template.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => exportToPng(templateId)}
                      className="px-6 py-3 bg-gradient-to-r from-[var(--sky-blue)] to-[var(--sky-blue-dark)] text-white font-bold rounded-full text-sm hover:scale-105 hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <span>Download</span>
                      <span>📥</span>
                    </button>
                  </div>
                  
                  {/* Mockup Preview - Centered with padding */}
                  <div className="p-8 bg-gradient-to-b from-[var(--sky-lighter)] to-white flex items-center justify-center min-h-[300px]">
                    <div className="transform scale-90 hover:scale-95 transition-transform duration-300">
                      <BoothRenderer
                        ref={(el: HTMLDivElement | null) => { svgRefs.current[templateId] = el }}
                        templateId={templateId}
                        logoUrl={transparentLogoUrl}
                        businessName={companyName}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                        width={mockupWidth}
                        height={mockupHeight}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-[var(--border-light)]">
            <button
              onClick={() => setStep(2)}
              className="px-8 py-4 rounded-full bg-white text-[var(--text-primary)] font-bold hover:scale-105 transition-transform border-2 border-[var(--border-light)] shadow-sm"
            >
              ← Change Selection
            </button>
            <Link
              to="/"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[var(--mint-green)] to-[#7fd4a8] text-white font-bold hover:scale-105 transition-transform shadow-lg"
            >
              Back to Dashboard
            </Link>
          </div>
        </StepCard>
      )}
    </WizardLayout>
  )
}
