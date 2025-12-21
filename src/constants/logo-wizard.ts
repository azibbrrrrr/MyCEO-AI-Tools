/**
 * Logo Wizard Constants
 * UI options and API prompt mappings for logo generation
 */

// ============================================
// Types
// ============================================

export type BusinessType = 'food' | 'crafts' | 'toys' | 'accessories' | 'diy'
export type LogoStyle = 'wordmark' | 'symbol' | 'emblem' | 'mascot'
export type ColorPalette = 'pastel' | 'bold' | 'earth' | 'bright' | 'premium'
export type VibeType = 'cheerful' | 'premium' | 'minimal' | 'playful' | 'traditional'
export type IconType = 'star' | 'fire' | 'leaf' | 'lightning' | 'heart' | 'animal'
export type PlanType = 'free' | 'premium'

export interface Logo {
    id: string
    imageUrl: string
    prompt: string
    createdAt: string
    plan: string
}

export interface LogoWizardData {
    businessName: string
    businessType?: string
    logoStyle?: string
    vibe?: string
    colorPalette?: string
    icon?: string
    slogan?: string
}

// ============================================
// UI Selection Options
// ============================================

export const BUSINESS_TYPES: Array<{ icon: string; key: BusinessType }> = [
    { icon: "🍰", key: "food" },
    { icon: "🎨", key: "crafts" },
    { icon: "🧸", key: "toys" },
    { icon: "💍", key: "accessories" },
    { icon: "🔨", key: "diy" },
]

export const LOGO_STYLES: Array<{ icon: string; key: LogoStyle }> = [
    { icon: "✍️", key: "wordmark" },
    { icon: "🎯", key: "symbol" },
    { icon: "🏅", key: "emblem" },
    { icon: "🐻", key: "mascot" },
]

export const VIBES: Array<{ icon: string; key: VibeType }> = [
    { icon: "😊", key: "cheerful" },
    { icon: "👑", key: "premium" },
    { icon: "✨", key: "minimal" },
    { icon: "🎈", key: "playful" },
    { icon: "🏛️", key: "traditional" },
]

export const COLOR_PRESETS: Array<{ name: string; colors: [string, string, string]; key: ColorPalette }> = [
    { name: "Pastel", colors: ["#FFD1DC", "#B5EAD7", "#C7CEEA"], key: "pastel" },
    { name: "Bold", colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"], key: "bold" },
    { name: "Earth", colors: ["#8B7355", "#A8C686", "#E6D5B8"], key: "earth" },
    { name: "Bright", colors: ["#FF1493", "#00CED1", "#FFD700"], key: "bright" },
    { name: "Premium", colors: ["#2C3E50", "#C9A961", "#1A1A2E"], key: "premium" },
]

// Helper to get hex colors from preset key (primary, secondary, tertiary)
export const COLOR_HEX_MAP: Record<ColorPalette, { primary: string; secondary: string; tertiary: string }> = {
    pastel: { primary: "#FFD1DC", secondary: "#B5EAD7", tertiary: "#C7CEEA" },
    bold: { primary: "#FF6B6B", secondary: "#4ECDC4", tertiary: "#45B7D1" },
    earth: { primary: "#8B7355", secondary: "#A8C686", tertiary: "#E6D5B8" },
    bright: { primary: "#FF1493", secondary: "#00CED1", tertiary: "#FFD700" },
    premium: { primary: "#2C3E50", secondary: "#C9A961", tertiary: "#1A1A2E" },
}

export const SYMBOLS: Array<{ icon: string; key: IconType }> = [
    { icon: "⭐", key: "star" },
    { icon: "🔥", key: "fire" },
    { icon: "🍃", key: "leaf" },
    { icon: "⚡", key: "lightning" },
    { icon: "💖", key: "heart" },
    { icon: "🐾", key: "animal" },
]

// ============================================
// API Prompt Mappings
// ============================================

export const BUSINESS_TYPE_PROMPTS: Record<BusinessType, string> = {
    food: "food business",
    crafts: "handmade crafts business",
    toys: "toy business",
    accessories: "accessories business",
    diy: "DIY business",
}

export const LOGO_STYLE_PROMPTS: Record<LogoStyle, string> = {
    wordmark: "wordmark style (text-based)",
    symbol: "symbol/icon style",
    emblem: "emblem style (badge-like)",
    mascot: "mascot style (character-based)",
}

export const COLOR_PALETTE_PROMPTS: Record<ColorPalette, string> = {
    pastel: "soft pastel colors",
    bold: "bold vibrant colors",
    earth: "earth tones and natural colors",
    bright: "bright and energetic colors",
    premium: "sophisticated premium colors",
}

export const VIBE_PROMPTS: Record<VibeType, string> = {
    cheerful: "cheerful and friendly",
    premium: "premium and luxurious",
    minimal: "minimal and clean",
    playful: "playful and fun",
    traditional: "traditional and classic",
}

export const SYMBOL_PROMPTS: Record<IconType, string> = {
    star: "star icon",
    fire: "fire icon",
    leaf: "leaf icon",
    lightning: "lightning icon",
    heart: "heart icon",
    animal: "animal icon",
}
