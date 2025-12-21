import type { VercelRequest, VercelResponse } from '@vercel/node'
import Replicate from 'replicate'

// ============================================
// Types (duplicated for serverless isolation)
// ============================================

interface LogoWizardData {
    businessName: string
    businessType?: string
    logoStyle?: string
    vibe?: string
    colorPalette?: string
    icon?: string
    slogan?: string
}

type LogoGenerationPlan = 'free' | 'premium'
type BusinessType = 'food' | 'crafts' | 'toys' | 'accessories' | 'diy'
type LogoStyle = 'modern' | 'wordmark' | 'symbol' | 'emblem' | 'mascot'
type VibeType = 'playful' | 'cheerful' | 'premium' | 'minimal' | 'traditional'
type ColorPalette = 'sunset' | 'ocean' | 'forest' | 'candy' | 'monochrome'
type IconType = 'star' | 'heart' | 'animal'

// ============================================
// Prompt Mappings
// ============================================

const BUSINESS_TYPE_PROMPTS: Record<string, string> = {
    food: 'food business',
    crafts: 'handmade crafts business',
    toys: 'toy business',
    accessories: 'accessories business',
    diy: 'DIY business',
}

const LOGO_STYLE_PROMPTS: Record<string, string> = {
    wordmark: 'wordmark style (text-based)',
    symbol: 'symbol/icon style',
    emblem: 'emblem style (badge-like)',
    mascot: 'mascot style (character-based)',
}

const COLOR_PALETTE_PROMPTS: Record<string, string> = {
    pastel: 'soft pastel colors',
    bold: 'bold vibrant colors',
    earth: 'earth tones and natural colors',
    bright: 'bright and energetic colors',
    premium: 'sophisticated premium colors',
}

const VIBE_PROMPTS: Record<string, string> = {
    cheerful: 'cheerful and friendly',
    premium: 'premium and luxurious',
    minimal: 'minimal and clean',
    playful: 'playful and fun',
    traditional: 'traditional and classic',
}

const SYMBOL_PROMPTS: Record<string, string> = {
    star: 'star icon',
    fire: 'fire icon',
    leaf: 'leaf icon',
    lightning: 'lightning icon',
    heart: 'heart icon',
    animal: 'animal icon',
}

// ============================================
// Helpers
// ============================================

function buildPrompt(data: LogoWizardData): string {
    const businessType = BUSINESS_TYPE_PROMPTS[data.businessType as BusinessType] || data.businessType
    const logoStyle = LOGO_STYLE_PROMPTS[data.logoStyle as LogoStyle] || 'modern'
    const vibe = VIBE_PROMPTS[data.vibe as VibeType] || 'friendly'
    const colors = data.colorPalette ? COLOR_PALETTE_PROMPTS[data.colorPalette as ColorPalette] : 'vibrant colors'
    const symbol = data.icon ? SYMBOL_PROMPTS[data.icon as IconType] : 'No symbol, text-based logo only'

    const prompt = `
Design one ${logoStyle} logo for a ${businessType} business named "${data.businessName}".
Overall vibe: ${vibe} — friendly, age-appropriate, and engaging for young entrepreneurs.

Visual style:
- Child-safe, Clean, vector-like illustration
- Simple shapes with clear outlines

Symbol / Icon:
- ${symbol}
- If included, the symbol should visually represent the business and match the vibe.

Color palette:
- ${colors}
- No additional colors.

Typography:
- Rounded, clear, and highly readable typography suitable for children.

Layout:
- Company name "${data.businessName}" is the main focus.
${data.slogan ? `- Optional slogan "${data.slogan}" appears smaller and playful.` : ''}
- Balanced and easy to recognize at small sizes.

Background:
- Plain white background only.

Output quality:
- Print-ready, Flat design, No complex gradients or shadows.
`.trim()

    console.log('Generated prompt:', prompt)
    return prompt
}

// ============================================
// Handler - Start Predictions (Non-blocking)
// ============================================

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        const { logoWizardData, plan = 'free' } = req.body as {
            logoWizardData: LogoWizardData
            plan: LogoGenerationPlan
        }

        if (!logoWizardData?.businessName) {
            return res.status(400).json({ error: 'Business name is required' })
        }

        const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
        const basePrompt = buildPrompt(logoWizardData)

        if (plan === 'premium') {
            // ==========================================
            // PREMIUM (Ideogram V3 Turbo) - Optimized for logos
            // ==========================================
            console.log('Starting 3 Ideogram jobs...')

            // Map user vibe/style to Ideogram Style Presets
            let stylePreset = "None"
            if (logoWizardData.vibe === 'minimal') stylePreset = "Minimal Illustration"
            if (logoWizardData.logoStyle === 'mascot') stylePreset = "Flat Vector"
            if (logoWizardData.vibe === 'traditional') stylePreset = "Vintage Poster"

            const predictionPromises = [1, 2, 3].map(async () => {
                return await replicate.predictions.create({
                    model: 'ideogram-ai/ideogram-v3-turbo',
                    input: {
                        prompt: basePrompt,
                        aspect_ratio: '1:1',
                        style_type: 'Design',        // Optimized for text/logos
                        magic_prompt_option: 'Auto', // Improves prompt adherence
                        style_preset: stylePreset,   // Uses official presets
                    }
                })
            })

            const predictions = await Promise.all(predictionPromises)

            // Return 3 IDs so frontend tracks them individually
            return res.status(200).json({
                mode: 'individual', // Track these 3 separately
                ids: predictions.map(p => p.id)
            })

        } else {
            // ==========================================
            // FREE (Flux Schnell) - Fire 1 prediction with num_outputs: 3
            // ==========================================
            console.log('Starting Flux batch job...')

            const prediction = await replicate.predictions.create({
                model: 'black-forest-labs/flux-schnell',
                input: {
                    prompt: basePrompt,
                    aspect_ratio: '1:1',
                    output_format: 'webp',
                    output_quality: 80,
                    num_outputs: 3,
                    num_inference_steps: 4,
                    go_fast: true,
                    disable_safety_checker: false,
                },
            })

            // Return 1 ID (batch mode - will give 3 images)
            return res.status(200).json({
                mode: 'batch', // Track this 1 ID, it will give 3 images
                ids: [prediction.id]
            })
        }

    } catch (error: unknown) {
        console.error('Error starting prediction:', error)

        // Handle specific error types
        if (error && typeof error === 'object' && 'response' in error) {
            const apiError = error as { response?: { status?: number }; message?: string }
            const status = apiError.response?.status

            if (status === 429) {
                // Rate limit error
                return res.status(429).json({
                    error: 'Our AI is a bit busy right now! Please wait a moment and try again.',
                    code: 'RATE_LIMITED',
                    retryAfter: 15
                })
            }

            if (status === 402) {
                // Payment/credit error
                return res.status(402).json({
                    error: 'Generation credits temporarily unavailable. Please try again later.',
                    code: 'INSUFFICIENT_CREDITS'
                })
            }

            if (status === 401 || status === 403) {
                // Auth error
                return res.status(500).json({
                    error: 'Service configuration error. Please contact support.',
                    code: 'AUTH_ERROR'
                })
            }
        }

        // Generic fallback
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return res.status(500).json({
            error: 'Failed to start generation. Please try again.',
            code: 'GENERATION_ERROR',
            details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        })
    }
}
