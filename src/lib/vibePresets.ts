import type { FontPair, Palette, SpacingDensity } from '@/hooks/useSiteConfig';

export interface VibePreset {
  id: string;
  label: string;
  description: string;
  palette: Palette;
  fontPair: FontPair;
  spacingDensity: SpacingDensity;
  colors: string[];
}

export const VIBE_PRESETS: VibePreset[] = [
  {
    id: 'fun',
    label: 'Fun & Colorful',
    description: 'Playful, bright, friendly',
    palette: 'pastel',
    fontPair: 'friendly',
    spacingDensity: 'normal',
    colors: ['#f9a8d4', '#5eead4', '#fde047'],
  },
  {
    id: 'bold',
    label: 'Bold & Cool',
    description: 'High contrast, energetic',
    palette: 'neon',
    fontPair: 'tech',
    spacingDensity: 'tight',
    colors: ['#22d3ee', '#a855f7', '#facc15'],
  },
  {
    id: 'warm',
    label: 'Warm & Cozy',
    description: 'Soft and welcoming',
    palette: 'warm',
    fontPair: 'elegant',
    spacingDensity: 'relaxed',
    colors: ['#f97316', '#f59e0b', '#fbbf24'],
  },
  {
    id: 'sleek',
    label: 'Sleek & Pro',
    description: 'Clean and premium',
    palette: 'dark',
    fontPair: 'professional',
    spacingDensity: 'normal',
    colors: ['#3b82f6', '#a855f7', '#eab308'],
  },
];
