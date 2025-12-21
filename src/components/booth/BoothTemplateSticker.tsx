/**
 * BoothTemplateSticker
 * Rounded sticker/badge format - perfect for products and giveaways
 * Circular design with logo centered and decorative ring
 */

import type { BoothProps } from './Booth.types'

export function BoothTemplateSticker({
  logoUrl,
  businessName,
  primaryColor,
  secondaryColor,
  width = 400,
  height = 400,
  className = '',
}: BoothProps) {
  // Keep it square for sticker
  const size = Math.min(width, height)
  const center = size / 2
  const outerRadius = size * 0.45
  const innerRadius = size * 0.38
  const logoSize = size * 0.4
  
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Outer ring gradient */}
        <linearGradient id="stickerRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="50%" stopColor={secondaryColor} />
          <stop offset="100%" stopColor={primaryColor} />
        </linearGradient>
        
        {/* Sticker shadow */}
        <filter id="stickerShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.2" />
        </filter>
        
        {/* Subtle emboss effect */}
        <filter id="emboss" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
          <feOffset in="blur" dx="1" dy="1" result="offsetBlur" />
          <feMerge>
            <feMergeNode in="offsetBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background - shows sticker is cut out */}
      <rect x="0" y="0" width={size} height={size} fill="#f8f8f8" />
      
      {/* Cut line guide (dashed) */}
      <circle
        cx={center}
        cy={center}
        r={outerRadius + 8}
        fill="none"
        stroke="#ccc"
        strokeWidth="1"
        strokeDasharray="8 4"
      />

      {/* Main sticker body */}
      <g id="sticker" filter="url(#stickerShadow)">
        {/* Outer decorative ring */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="url(#stickerRingGradient)"
        />
        
        {/* Decorative dots around ring */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180
          const x = center + Math.cos(angle) * (outerRadius - 8)
          const y = center + Math.sin(angle) * (outerRadius - 8)
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="white"
              opacity="0.8"
            />
          )
        })}
        
        {/* Inner white circle */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="white"
        />
        
        {/* Subtle inner border */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius - 3}
          fill="none"
          stroke={primaryColor}
          strokeWidth="2"
          opacity="0.2"
        />
      </g>

      {/* Logo */}
      <image
        href={logoUrl}
        x={center - logoSize / 2}
        y={center - logoSize / 2 - size * 0.05}
        width={logoSize}
        height={logoSize}
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Business name curved at bottom */}
      <text
        x={center}
        y={center + innerRadius * 0.65}
        textAnchor="middle"
        fill={primaryColor}
        fontSize={size * 0.055}
        fontWeight="bold"
        fontFamily="system-ui, sans-serif"
      >
        {businessName}
      </text>
    </svg>
  )
}
