/**
 * Booth Template Types
 * Shared interfaces for all booth SVG components
 */

export type BoothTemplateId = 'banner' | 'table' | 'sticker' | 'pricetag'

export interface BoothProps {
    /** URL to the transparent logo image */
    logoUrl: string
    /** Business/company name to display */
    businessName: string
    /** Primary brand color (hex) */
    primaryColor: string
    /** Secondary brand color (hex) */
    secondaryColor: string
    /** Optional width override (default: 400) */
    width?: number
    /** Optional height override (default: 300) */
    height?: number
    /** Optional className for styling */
    className?: string
}

export interface BoothTemplateConfig {
    id: BoothTemplateId
    name: string
    description: string
    icon: string
}

export const BOOTH_TEMPLATES: BoothTemplateConfig[] = [
    {
        id: 'banner',
        name: 'Banner Booth',
        description: 'Large backdrop banner for school fairs',
        icon: '🏳️',
    },
    {
        id: 'table',
        name: 'Table Booth',
        description: 'Table with front panel and top surface',
        icon: '🪑',
    },
    {
        id: 'sticker',
        name: 'Rounded Sticker',
        description: 'Circular sticker badge with logo',
        icon: '⭕',
    },
    {
        id: 'pricetag',
        name: 'Price Tag',
        description: 'Product price tag for booth items',
        icon: '🏷️',
    },
]
