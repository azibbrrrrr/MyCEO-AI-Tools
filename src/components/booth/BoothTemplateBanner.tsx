/**
 * BoothTemplateBanner
 * Large backdrop banner for school fairs and mini expos
 * Features: Full-width banner, centered logo, business name
 */

import type { BoothProps } from './Booth.types'

export function BoothTemplateBanner({
  logoUrl,
  businessName,
  primaryColor,
  secondaryColor,
  width = 600,
  height = 400,
  className = '',
}: BoothProps) {
  // Calculate proportional sizes
  const bannerHeight = height * 0.7
  const logoSize = Math.min(width * 0.35, bannerHeight * 0.5)
  
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Definitions for gradients and shadows */}
      <defs>
        {/* Banner gradient */}
        <linearGradient id="bannerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="1" />
          <stop offset="100%" stopColor={primaryColor} stopOpacity="0.85" />
        </linearGradient>
        
        {/* Drop shadow filter */}
        <filter id="bannerShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.15" />
        </filter>
        
        {/* Subtle inner glow */}
        <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background - subtle event venue feel */}
      <rect x="0" y="0" width={width} height={height} fill="#f5f5f5" />
      
      {/* Banner poles (left and right) */}
      <g id="banner-poles">
        {/* Left pole */}
        <rect
          x={width * 0.08}
          y={height * 0.05}
          width="8"
          height={bannerHeight + 20}
          rx="4"
          fill="#888"
        />
        {/* Right pole */}
        <rect
          x={width * 0.92 - 8}
          y={height * 0.05}
          width="8"
          height={bannerHeight + 20}
          rx="4"
          fill="#888"
        />
      </g>

      {/* Main banner - the focal point */}
      <g id="banner-main" filter="url(#bannerShadow)">
        {/* Banner background */}
        <rect
          x={width * 0.1}
          y={height * 0.08}
          width={width * 0.8}
          height={bannerHeight}
          rx="8"
          fill="url(#bannerGradient)"
        />
        
        {/* Top accent bar */}
        <rect
          x={width * 0.1}
          y={height * 0.08}
          width={width * 0.8}
          height="12"
          rx="6"
          fill={secondaryColor}
        />
        
        {/* Bottom accent bar */}
        <rect
          x={width * 0.1}
          y={height * 0.08 + bannerHeight - 12}
          width={width * 0.8}
          height="12"
          rx="6"
          fill={secondaryColor}
        />
      </g>

      {/* Logo container - centered on banner */}
      <g id="logo-area">
        {/* White circle background for logo */}
        <circle
          cx={width / 2}
          cy={height * 0.08 + bannerHeight * 0.4}
          r={logoSize * 0.6}
          fill="white"
          filter="url(#bannerShadow)"
        />
        
        {/* Logo image */}
        <image
          href={logoUrl}
          x={width / 2 - logoSize / 2}
          y={height * 0.08 + bannerHeight * 0.4 - logoSize / 2}
          width={logoSize}
          height={logoSize}
          preserveAspectRatio="xMidYMid meet"
        />
      </g>

      {/* Business name */}
      <text
        x={width / 2}
        y={height * 0.08 + bannerHeight * 0.82}
        textAnchor="middle"
        fill="white"
        fontSize={width * 0.045}
        fontWeight="bold"
        fontFamily="system-ui, sans-serif"
        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
      >
        {businessName}
      </text>

      {/* Floor shadow for realism */}
      <ellipse
        cx={width / 2}
        cy={height * 0.95}
        rx={width * 0.35}
        ry={height * 0.03}
        fill="rgba(0,0,0,0.08)"
      />
    </svg>
  )
}
