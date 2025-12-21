/**
 * BoothTemplatePriceTag
 * Price tag for booth products
 * Features: Logo at top, price area, hanging hole
 */

import type { BoothProps } from './Booth.types'

interface PriceTagProps extends BoothProps {
  /** Price to display (optional) */
  price?: string
  /** Currency symbol */
  currency?: string
}

export function BoothTemplatePriceTag({
  logoUrl,
  businessName,
  primaryColor,
  secondaryColor,
  width = 300,
  height = 400,
  price = 'RM __',
  className = '',
}: PriceTagProps) {
  const tagWidth = width * 0.85
  const tagHeight = height * 0.9
  const logoSize = tagWidth * 0.4
  const holeRadius = width * 0.04
  
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Tag gradient */}
        <linearGradient id="priceTagGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f9f9f9" />
        </linearGradient>
        
        {/* Tag shadow */}
        <filter id="tagShadow" x="-15%" y="-10%" width="130%" height="125%">
          <feDropShadow dx="2" dy="4" stdDeviation="6" floodOpacity="0.15" />
        </filter>
        
        {/* String shadow */}
        <filter id="stringShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width={width} height={height} fill="#f0f0f0" />

      {/* String/rope for hanging */}
      <g id="string" filter="url(#stringShadow)">
        <path
          d={`M ${width / 2} 0 
              Q ${width / 2 - 20} ${height * 0.08} ${width / 2} ${height * 0.1 + holeRadius}`}
          fill="none"
          stroke="#8B7355"
          strokeWidth="3"
        />
      </g>

      {/* Main tag body */}
      <g id="price-tag" filter="url(#tagShadow)">
        {/* Tag shape */}
        <rect
          x={(width - tagWidth) / 2}
          y={height * 0.08}
          width={tagWidth}
          height={tagHeight}
          rx="12"
          fill="url(#priceTagGradient)"
          stroke="#e0e0e0"
          strokeWidth="1"
        />
        
        {/* Hanging hole */}
        <circle
          cx={width / 2}
          cy={height * 0.08 + holeRadius + 15}
          r={holeRadius}
          fill="#f0f0f0"
          stroke="#ccc"
          strokeWidth="2"
        />
        
        {/* Top accent bar */}
        <rect
          x={(width - tagWidth) / 2}
          y={height * 0.08}
          width={tagWidth}
          height="8"
          rx="4"
          fill={primaryColor}
        />
        
        {/* Decorative line */}
        <line
          x1={(width - tagWidth) / 2 + 20}
          y1={height * 0.18}
          x2={(width + tagWidth) / 2 - 20}
          y2={height * 0.18}
          stroke={secondaryColor}
          strokeWidth="2"
          strokeDasharray="8 4"
        />
      </g>

      {/* Logo area */}
      <g id="logo-area">
        {/* Circle background for logo */}
        <circle
          cx={width / 2}
          cy={height * 0.35}
          r={logoSize * 0.55}
          fill={`${primaryColor}15`}
          stroke={primaryColor}
          strokeWidth="2"
        />
        
        {/* Logo */}
        <image
          href={logoUrl}
          x={width / 2 - logoSize / 2}
          y={height * 0.35 - logoSize / 2}
          width={logoSize}
          height={logoSize}
          preserveAspectRatio="xMidYMid meet"
        />
      </g>

      {/* Business name */}
      <text
        x={width / 2}
        y={height * 0.55}
        textAnchor="middle"
        fill={primaryColor}
        fontSize={width * 0.06}
        fontWeight="bold"
        fontFamily="system-ui, sans-serif"
      >
        {businessName}
      </text>

      {/* Divider line */}
      <line
        x1={(width - tagWidth) / 2 + 30}
        y1={height * 0.6}
        x2={(width + tagWidth) / 2 - 30}
        y2={height * 0.6}
        stroke="#e0e0e0"
        strokeWidth="1"
      />

      {/* Price label */}
      <text
        x={width / 2}
        y={height * 0.68}
        textAnchor="middle"
        fill="#999"
        fontSize={width * 0.045}
        fontFamily="system-ui, sans-serif"
      >
        PRICE
      </text>

      {/* Price value */}
      <text
        x={width / 2}
        y={height * 0.82}
        textAnchor="middle"
        fill={primaryColor}
        fontSize={width * 0.12}
        fontWeight="bold"
        fontFamily="system-ui, sans-serif"
      >
        {price}
      </text>

      {/* Bottom accent */}
      <rect
        x={(width - tagWidth) / 2}
        y={height * 0.08 + tagHeight - 8}
        width={tagWidth}
        height="8"
        rx="4"
        fill={secondaryColor}
      />
    </svg>
  )
}
