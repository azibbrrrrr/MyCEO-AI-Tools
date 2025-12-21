/**
 * BoothTemplateTable
 * Table booth with front panel, tabletop surface, and small banner
 * Realistic school fair table setup
 */

import type { BoothProps } from './Booth.types'

export function BoothTemplateTable({
  logoUrl,
  businessName,
  primaryColor,
  secondaryColor,
  width = 600,
  height = 450,
  className = '',
}: BoothProps) {
  // Calculate proportional sizes
  const tableTop = height * 0.45
  const tableHeight = height * 0.35
  const bannerHeight = height * 0.18
  const logoSize = Math.min(width * 0.2, tableHeight * 0.6)
  
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Table surface gradient */}
        <linearGradient id="tableTopGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f0f0f0" />
          <stop offset="100%" stopColor="#e0e0e0" />
        </linearGradient>
        
        {/* Front panel gradient */}
        <linearGradient id="frontPanelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={primaryColor} stopOpacity="0.9" />
        </linearGradient>
        
        {/* Shadows */}
        <filter id="tableShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="5" stdDeviation="8" floodOpacity="0.15" />
        </filter>
        
        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
        </filter>
      </defs>

      {/* Background - venue floor */}
      <rect x="0" y="0" width={width} height={height} fill="#fafafa" />
      
      {/* Back wall suggestion */}
      <rect x="0" y="0" width={width} height={height * 0.3} fill="#f0f0f0" />
      <line 
        x1="0" y1={height * 0.3} 
        x2={width} y2={height * 0.3} 
        stroke="#e5e5e5" 
        strokeWidth="2"
      />

      {/* Small banner above table */}
      <g id="table-banner" filter="url(#softShadow)">
        <rect
          x={width * 0.2}
          y={height * 0.05}
          width={width * 0.6}
          height={bannerHeight}
          rx="6"
          fill={secondaryColor}
        />
        
        {/* Banner text */}
        <text
          x={width / 2}
          y={height * 0.05 + bannerHeight * 0.6}
          textAnchor="middle"
          fill={primaryColor}
          fontSize={width * 0.035}
          fontWeight="bold"
          fontFamily="system-ui, sans-serif"
        >
          {businessName}
        </text>
      </g>

      {/* Table structure */}
      <g id="table" filter="url(#tableShadow)">
        {/* Table legs */}
        <rect
          x={width * 0.12}
          y={tableTop + tableHeight * 0.1}
          width="12"
          height={tableHeight * 0.9}
          fill="#666"
        />
        <rect
          x={width * 0.88 - 12}
          y={tableTop + tableHeight * 0.1}
          width="12"
          height={tableHeight * 0.9}
          fill="#666"
        />
        
        {/* Table front panel (branded) */}
        <rect
          x={width * 0.1}
          y={tableTop + tableHeight * 0.15}
          width={width * 0.8}
          height={tableHeight * 0.85}
          rx="4"
          fill="url(#frontPanelGradient)"
        />
        
        {/* Front panel border accent */}
        <rect
          x={width * 0.1}
          y={tableTop + tableHeight * 0.15}
          width={width * 0.8}
          height="6"
          fill={secondaryColor}
        />
        
        {/* Table top surface */}
        <rect
          x={width * 0.08}
          y={tableTop}
          width={width * 0.84}
          height={tableHeight * 0.18}
          rx="3"
          fill="url(#tableTopGradient)"
          stroke="#ccc"
          strokeWidth="1"
        />
      </g>

      {/* Logo on front panel */}
      <g id="logo-area">
        {/* White circle background */}
        <circle
          cx={width / 2}
          cy={tableTop + tableHeight * 0.55}
          r={logoSize * 0.55}
          fill="white"
          filter="url(#softShadow)"
        />
        
        {/* Logo image */}
        <image
          href={logoUrl}
          x={width / 2 - logoSize / 2}
          y={tableTop + tableHeight * 0.55 - logoSize / 2}
          width={logoSize}
          height={logoSize}
          preserveAspectRatio="xMidYMid meet"
        />
      </g>

      {/* Sample products on table (decorative) */}
      <g id="table-items" opacity="0.6">
        {/* Left item */}
        <rect
          x={width * 0.15}
          y={tableTop - height * 0.08}
          width={width * 0.1}
          height={height * 0.08}
          rx="3"
          fill="#ddd"
        />
        {/* Right item */}
        <rect
          x={width * 0.75}
          y={tableTop - height * 0.06}
          width={width * 0.08}
          height={height * 0.06}
          rx="3"
          fill="#ddd"
        />
      </g>

      {/* Floor shadow */}
      <ellipse
        cx={width / 2}
        cy={height * 0.97}
        rx={width * 0.4}
        ry={height * 0.02}
        fill="rgba(0,0,0,0.05)"
      />
    </svg>
  )
}
