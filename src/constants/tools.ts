/**
 * Dashboard Tools Configuration
 * Available and upcoming tools for the dashboard
 */

// Tool icons - these need to be imported where used due to Vite asset handling
// The icon images should be imported in the consuming component

export interface ToolConfig {
    icon: string
    iconImageKey: 'logoMaker' | 'booth' | 'calculator' | 'productIdea' | 'packaging'
    titleKey: string
    descKey: string
    href: string
    state: 'available' | 'inProgress' | 'usedToday' | 'comingSoon'
}

export const AVAILABLE_TOOLS: ToolConfig[] = [
    {
        icon: "🎨",
        iconImageKey: "logoMaker",
        titleKey: "tool.logo",
        descKey: "tool.logo.desc",
        href: "/tools/logo-maker",
        state: "available",
    },
    {
        icon: "🏪",
        iconImageKey: "booth",
        titleKey: "tool.booth",
        descKey: "tool.booth.desc",
        href: "/tools/booth-ready",
        state: "available",
    },
    {
        icon: "💰",
        iconImageKey: "calculator",
        titleKey: "tool.profit",
        descKey: "tool.profit.desc",
        href: "/tools/profit-calculator",
        state: "available",
    },
]

export const COMING_SOON_TOOLS: ToolConfig[] = [
    {
        icon: "💡",
        iconImageKey: "productIdea",
        titleKey: "tool.product",
        descKey: "tool.product.desc",
        href: "#",
        state: "comingSoon",
    },
    {
        icon: "📦",
        iconImageKey: "packaging",
        titleKey: "tool.packaging",
        descKey: "tool.packaging.desc",
        href: "#",
        state: "comingSoon",
    },
]

// Tool icon mapping type (for use with dynamic imports)
export type ToolIconKey = ToolConfig['iconImageKey']
