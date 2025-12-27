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
    icons?: string[]  // Up to 3 icons
    slogan?: string
}

type LogoGenerationPlan = 'free' | 'premium'
type BusinessType = 'food' | 'crafts' | 'toys' | 'accessories' | 'diy'
type LogoStyle = 'wordmark' | 'symbol' | 'emblem' | 'mascot'
type VibeType = 'cheerful' | 'premium' | 'minimal' | 'playful' | 'traditional'
type ColorPalette = 'pastel' | 'bold' | 'earth' | 'bright' | 'premium'
type IconType = 'star' | 'fire' | 'leaf' | 'lightning' | 'heart' | 'animal'

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
    pastel: 'soft pastel pink, mint green, and light sky blue colors',
    bold: 'coral red, teal, and dark teal colors',
    earth: 'earth brown, sage green, and cream beige colors',
    bright: 'hot magenta pink, bright cyan, and vibrant yellow colors',
    premium: 'dark navy blue, gold, and black colors',
}

// Each vibe controls the overall energy, typography style, and visual feel
const VIBE_PROMPTS: Record<string, { mood: string; typography: string; style: string }> = {
    cheerful: {
        mood: 'cheerful, friendly, and welcoming',
        typography: 'rounded, warm, friendly typography',
        style: 'bright, inviting, happy vibes'
    },
    premium: {
        mood: 'premium, elegant, and sophisticated',
        typography: 'refined, sleek, modern typography',
        style: 'polished, high-end, luxurious feel'
    },
    minimal: {
        mood: 'minimal, clean, and modern',
        typography: 'simple, clean sans-serif typography',
        style: 'understated, balanced, refined simplicity'
    },
    playful: {
        mood: 'playful, fun, and exciting',
        typography: 'bold, bubbly, bouncy typography',
        style: 'dynamic, energetic, eye-catching, full of personality'
    },
    traditional: {
        mood: 'traditional, classic, and timeless',
        typography: 'classic, serif or vintage-inspired typography',
        style: 'nostalgic, trustworthy, established feel'
    },
}

const SYMBOL_PROMPTS: Record<string, string> = {
    // Nature
    star: 'shining star',
    sun: 'bright sun',
    moon: 'crescent moon',
    rainbow: 'colorful rainbow',
    flower: 'blooming flower',
    leaf: 'green leaf',
    // Animals
    cat: 'cute cat',
    dog: 'friendly dog',
    unicorn: 'magical unicorn',
    butterfly: 'beautiful butterfly',
    paw: 'animal paw print',
    // Fun
    heart: 'love heart',
    crown: 'royal crown',
    rocket: 'flying rocket',
    lightning: 'lightning bolt',
    fire: 'flame',
    // Shapes
    diamond: 'sparkling diamond',
    sparkle: 'magic sparkles',
}

// Helpers
// ============================================

// Standard prompt for Flux (free tier)
function buildPrompt(data: LogoWizardData): string {
    const businessType = BUSINESS_TYPE_PROMPTS[data.businessType as BusinessType] || data.businessType
    const logoStyle = LOGO_STYLE_PROMPTS[data.logoStyle as LogoStyle] || 'modern'
    const vibe = VIBE_PROMPTS[data.vibe as VibeType] || VIBE_PROMPTS.playful
    const colors = data.colorPalette ? COLOR_PALETTE_PROMPTS[data.colorPalette as ColorPalette] : 'vibrant colors'
    // Build symbols list from icons array
    const iconsList = data.icons?.map(icon => SYMBOL_PROMPTS[icon as IconType]).filter(Boolean) || []
    const symbolsText = iconsList.length > 0
        ? iconsList.join(', ')
        : 'No symbol, text-based logo only'

    const prompt = `
Design one ${logoStyle} logo for a ${businessType} named "${data.businessName}".
The logo design should visually relate to the company name "${data.businessName}" and represent a ${businessType}.
Overall vibe: ${vibe.mood} — age-appropriate and engaging for young entrepreneurs.

Visual style:
- ${vibe.style}
- Child-safe, vector-like illustration
- Design elements should reflect both the company name meaning and the ${businessType} industry

Symbol / Icon:
- ${symbolsText}
- If included, the symbols should visually represent the business and match the vibe.

Color palette:
- ${colors}

Typography:
- ${vibe.typography}

Layout:
- Company name "${data.businessName}" is the main focus.
${data.slogan ? `- slogan "${data.slogan}" appears smaller.` : ''}
- Balanced and easy to recognize at small sizes.

Background:
- Isolated on pure white background only.

Output quality:
- Print-ready, High-quality vector art logo.
`.trim()

    console.log('Generated prompt:', prompt)
    return prompt
}

// Premium prompt for Google Imagen 4 (premium tier)
// Imagen 4 excels at typography and high-quality image generation
// Formula: [Medium] + [Text in "Quotes"] + [Typography Style] + [Visual Aesthetic]
// function buildPremiumPrompt(data: LogoWizardData): string {
//     const logoStyle = LOGO_STYLE_PROMPTS[data.logoStyle as LogoStyle] || 'modern'
//     const colors = data.colorPalette ? COLOR_PALETTE_PROMPTS[data.colorPalette as ColorPalette] : 'vibrant colors'
//     // Build symbols list from icons array
//     const iconsList = data.icons?.map(icon => SYMBOL_PROMPTS[icon as IconType]).filter(Boolean) || []
//     const vibe = VIBE_PROMPTS[data.vibe as VibeType] || VIBE_PROMPTS.playful

//     // Build prompt following Ideogram's best practices
//     const businessType = BUSINESS_TYPE_PROMPTS[data.businessType as BusinessType] || data.businessType
//     let prompt = `A ${vibe.mood} ${logoStyle} vector logo design for a kids' ${businessType}. `

//     // The exact text in quotes (mandatory for Ideogram) + vibe-controlled typography
//     prompt += `The text reads "${data.businessName}" in ${vibe.typography}. `

//     // Emphasize design should relate to company name and business type
//     prompt += `The design should visually relate to the name "${data.businessName}" and represent a ${businessType}. `

//     // Add slogan if provided
//     if (data.slogan) {
//         prompt += `Below it in smaller text: "${data.slogan}". `
//     }

//     // Symbols/icons if selected (up to 3)
//     if (iconsList.length > 0) {
//         prompt += `The design features cute ${iconsList.join(' and ')} that match the ${vibe.mood} vibe. `
//     }

//     // Visual aesthetic controlled by vibe
//     prompt += `Overall style: ${vibe.style}. `
//     prompt += `Colors: ${colors}. `
//     prompt += `High-quality vector art logo, isolated on pure white background.`

//     console.log('Generated premium prompt:', prompt)
//     return prompt
// }

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
            // PREMIUM (Google Imagen 4 FAST) - 1 high-quality logo, same prompt as free
            // ==========================================
            console.log('Starting 1 Imagen 4 premium job...')

            const prediction = await replicate.predictions.create({
                model: 'google/imagen-4-fast',
                input: {
                    prompt: basePrompt,  // Use same prompt as free version
                    aspect_ratio: '1:1',
                    output_format: 'png',
                    safety_filter_level: 'block_medium_and_above'
                }
            })

            console.log(`Premium prediction started: ${prediction.id}`)

            // Return 1 ID (same format as batch for consistency)
            return res.status(200).json({
                mode: 'individual',
                ids: [prediction.id]
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
