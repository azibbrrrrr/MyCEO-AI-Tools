import type { VercelRequest, VercelResponse } from '@vercel/node'
import Together from 'together-ai'
// import { GoogleGenAI } from "@google/genai" // Removed: Using Together AI for Imagen
import { createClient } from '@supabase/supabase-js'

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
type IconType =
    | 'star' | 'sun' | 'moon' | 'rainbow' | 'flower' | 'leaf'
    | 'cat' | 'dog' | 'unicorn' | 'butterfly' | 'paw'
    | 'heart' | 'crown' | 'rocket' | 'lightning' | 'fire'
    | 'diamond' | 'sparkle'

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

const PALETTE_CONFIG: Record<string, { description: string; textColor: string; iconColors: string }> = {
    pastel: {
        description: 'soft pastel pink, mint green, and light sky blue',
        // INTERVENTION: Pastels are too light for white bg, force dark grey
        textColor: 'dark charcoal grey',
        iconColors: 'soft pastel pink and mint green'
    },
    bold: {
        description: 'coral red, teal, and dark teal',
        // Dark teal is strong enough for text
        textColor: 'dark teal',
        iconColors: 'coral red'
    },
    earth: {
        description: 'earth brown, sage green, and cream beige',
        textColor: 'dark earth brown',
        iconColors: 'sage green'
    },
    bright: {
        description: 'hot magenta pink, bright cyan, and vibrant yellow',
        // Cyan/Yellow too light for text, use Magenta or Black
        textColor: 'black',
        iconColors: 'hot magenta pink and bright cyan'
    },
    premium: {
        description: 'dark navy blue, gold, and black',
        textColor: 'black',
        iconColors: 'dark navy blue and gold'
    }
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
    const paletteKey = (data.colorPalette as ColorPalette) || 'bold'
    const palette = PALETTE_CONFIG[paletteKey] || PALETTE_CONFIG.bold

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
- ${palette.description}

Typography:
- ${vibe.typography}

Layout:
- The text in the logo must be the company name "${data.businessName}".
- Do not write the business type or industry name as text.
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

// Optimized prompt for Flux Schnell (Text-First Structure)
function buildFluxPrompt(data: LogoWizardData): string {
    const businessType = BUSINESS_TYPE_PROMPTS[data.businessType as BusinessType] || data.businessType
    const logoStyle = LOGO_STYLE_PROMPTS[data.logoStyle as LogoStyle] || 'modern vector logo'
    const vibe = VIBE_PROMPTS[data.vibe as VibeType] || VIBE_PROMPTS.playful

    // Resolve Color Strategy with Contrast Intervention
    const paletteKey = (data.colorPalette as ColorPalette) || 'bold'
    const palette = PALETTE_CONFIG[paletteKey] || PALETTE_CONFIG.bold

    // Build icons text with STRICT icon colors
    const iconsList = data.icons?.map(icon => SYMBOL_PROMPTS[icon as IconType]).filter(Boolean) || []
    let iconSection = ''
    if (iconsList.length > 0) {
        iconSection = `Above the text is a simple vector icon of ${iconsList.join(' and ')} colored in ${palette.iconColors}.`
    } else {
        iconSection = `Above the text is a design element representing a ${businessType} colored in ${palette.iconColors}.`
    }

    // Text-First structural formula:
    // [Overall Vibe & Background] [Text Content & Strict Color] [Icon/Graphic Details & Strict Colors] [Technical Style Keywords]

    let prompt = `A ${vibe.mood} ${logoStyle} for a ${businessType} on a clean white background. `

    // [Text Content & Strict Color]
    prompt += `The text "${data.businessName.toUpperCase()}" is written in the center in ${vibe.typography}. `
    prompt += `The text color is ${palette.textColor} to ensure high visibility against the white background. `

    if (data.slogan) {
        prompt += `Below the main text is the slogan "${data.slogan}" in a smaller ${palette.textColor} font. `
    }

    // [Icon/Graphic Details & Strict Colors]
    prompt += `${iconSection} `

    // [Technical Style Keywords]
    prompt += `Style: Flat vector, professional minimalist vector art, ${vibe.style}, no shading, sharp lines, high contrast.`

    console.log('Generated Flux prompt (Structured):', prompt)
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

// Premium prompt for Google Imagen 4 (premium tier)
// Premium prompt for Google Imagen 4 (premium tier)
// function buildPremiumPrompt(data: LogoWizardData): string {
//     const logoStyle = LOGO_STYLE_PROMPTS[data.logoStyle as LogoStyle] || 'modern'
//     const colors = data.colorPalette ? COLOR_PALETTE_PROMPTS[data.colorPalette as ColorPalette] : 'vibrant colors'
//     const vibe = VIBE_PROMPTS[data.vibe as VibeType] || VIBE_PROMPTS.playful
//     const businessType = BUSINESS_TYPE_PROMPTS[data.businessType as BusinessType] || data.businessType

//     // Build icons text
//     const iconsList = data.icons?.map(icon => SYMBOL_PROMPTS[icon as IconType]).filter(Boolean) || []
//     const iconText = iconsList.length > 0
//         ? `featuring ${iconsList.join(' and ')}`
//         : 'incorporating elements related to the business'

//     // Formulate the new Subject-Context-Style prompt
//     let prompt = `A high-quality vector art logo design for a kids' ${businessType} named "${data.businessName}".\n`

//     // Subject: Core Design
//     prompt += `Subject: A ${vibe.mood} ${logoStyle} design ${iconText}. The design should match the ${vibe.style} aesthetic.\n`

//     // Context: Background
//     prompt += `Context: Isolated on a solid white background, centered composition.\n`

//     // Text: Typography instructions
//     prompt += `Text: The text "${data.businessName}" is clearly visible and legible in ${vibe.typography} font style.`
//     if (data.slogan) {
//         prompt += ` The slogan "${data.slogan}" appears in smaller, complementary text below.`
//     }
//     prompt += `\n`

//     // Style: Modifiers & Quality
//     prompt += `Style: ${colors}. Professional vector illustration, flat design, clean lines, child-friendly, trending on Dribbble, 4k, sharp focus, high resolution.`

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

        const together = new Together({ apiKey: process.env.TOGETHER_API_KEY })

        // Select prompt builder based on plan
        const basePrompt = plan === 'premium' ? buildPrompt(logoWizardData) : buildFluxPrompt(logoWizardData)

        if (plan === 'premium') {
            // ==========================================
            // PREMIUM (Imagen 4 via Together AI)
            // ==========================================
            console.log('Starting 1 Imagen 4 premium job via Together AI...')

            if (!process.env.TOGETHER_API_KEY) {
                throw new Error('Missing Together AI API Key')
            }

            const response = await together.images.generate({
                model: "google/imagen-4.0-preview", // Updated model name
                prompt: basePrompt,
                n: 1,
                response_format: 'base64'
            });

            const b64 = response.data[0].b64_json;
            if (!b64) throw new Error('No image generated by Together AI');

            // Convert to buffer for Supabase upload
            const imgBytes = b64;

            // Upload to Supabase directly
            const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
            const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

            if (!supabaseUrl || !supabaseServiceKey) {
                throw new Error('Missing Supabase credentials for upload')
            }

            const supabase = createClient(supabaseUrl, supabaseServiceKey, {
                auth: { persistSession: false }
            })

            const buffer = Buffer.from(imgBytes, "base64")
            const timestamp = Date.now()
            const childId = logoWizardData.businessName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10).toLowerCase() || 'anonymous'
            const randomId = Math.random().toString(36).substring(2, 8)
            const storagePath = `premium/${childId}/logo-${timestamp}-${randomId}.png`

            const { error: uploadError } = await supabase.storage
                .from('generated-images')
                .upload(storagePath, buffer, {
                    contentType: 'image/png',
                    upsert: false,
                })

            if (uploadError) {
                console.error('Upload error:', uploadError)
                throw new Error(`Failed to upload generated image: ${uploadError.message}`)
            }

            const { data: urlData } = supabase.storage
                .from('generated-images')
                .getPublicUrl(storagePath)

            console.log('Premium generation complete:', urlData.publicUrl)

            // Return direct result
            return res.status(200).json({
                mode: 'direct',
                images: [urlData.publicUrl]
            })

        } else {
            // ==========================================
            // FREE (Flux Schnell via Together AI)
            // ==========================================
            console.log('Starting Flux job via Together AI...')

            if (!process.env.TOGETHER_API_KEY) {
                throw new Error('Missing Together AI API Key')
            }

            const response = await together.images.generate({
                model: "black-forest-labs/FLUX.1-schnell",
                prompt: basePrompt,
                width: 1024,
                height: 1024,
                // explicit defaults for consistency
                steps: 4,
                n: 1,
                response_format: 'base64'
            });

            const b64 = response.data[0].b64_json;
            if (!b64) throw new Error('No image generated by Together AI');

            const dataUri = `data:image/jpeg;base64,${b64}`;

            return res.status(200).json({
                mode: 'direct',
                images: [dataUri]
            })
        }

    } catch (error: any) {
        console.error('Error starting prediction:', error)

        // Try to check for Replicate API error structure
        // Often comes as error.response.status or error.message

        let status = 500

        // Check if it's a specific API error object from Replicate SDK or similar
        if (error?.response?.status) {
            status = error.response.status
        }

        // Check string message for keywords
        const errorString = error?.toString() || ''
        const errorJSON = error?.response?.data || {} // sometimes axios/fetch error data is here
        const combinedErrorDetails = JSON.stringify(errorJSON) + errorString

        if (status === 429 || combinedErrorDetails.includes('429') || combinedErrorDetails.includes('throttled')) {
            if (combinedErrorDetails.includes('less than $5') || combinedErrorDetails.includes('account')) {
                // Low balance specific message
                return res.status(429).json({
                    error: 'We are experiencing high demand. Please try again in 10-15 seconds.',
                    code: 'RATE_LIMITED_LOW_BALANCE',
                    retryAfter: 15
                })
            }

            // Check for Google GenAI Quota Exceeded
            if (combinedErrorDetails.includes('RESOURCE_EXHAUSTED') || combinedErrorDetails.includes('quota')) {
                return res.status(429).json({
                    error: 'Our premium design studio is at capacity! Please try the "Free" mode for unlimited drafts.',
                    code: 'PREMIUM_QUOTA_EXCEEDED'
                })
            }


            // Generic rate limit return
            return res.status(429).json({
                error: 'Our AI is a bit busy right now! Please wait a moment and try again.',
                code: 'RATE_LIMITED',
                retryAfter: 15
            })
        }

        if (status === 402 || combinedErrorDetails.includes('billing') || combinedErrorDetails.includes('credit')) {
            return res.status(402).json({
                error: 'Generation credits temporarily unavailable. Please try again later.',
                code: 'INSUFFICIENT_CREDITS'
            })
        }

        if (status === 401 || status === 403) {
            return res.status(500).json({
                error: 'Service configuration error. Please contact support.',
                code: 'AUTH_ERROR'
            })
        }

        // Generic fallback
        return res.status(500).json({
            error: error instanceof Error ? error.message : 'Unknown error',
            code: 'GENERATION_ERROR',
            details: process.env.NODE_ENV === 'development' ? errorString : undefined
        })
    }
}
