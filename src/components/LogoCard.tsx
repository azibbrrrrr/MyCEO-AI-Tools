/**
 * LogoCard - Reusable logo card component
 * Used in: Logo Maker, Dashboard, Creations
 */

interface LogoCardProps {
  imageUrl: string
  title?: string
  subtitle?: string
  showDate?: boolean
  date?: string
  planType?: 'free' | 'premium'
  isSelected?: boolean
  onClick: () => void
}

export function LogoCard({
  imageUrl,
  title,
  subtitle,
  showDate = false,
  date,
  planType,
  isSelected = false,
  onClick,
}: LogoCardProps) {
  return (
    <div
      onClick={onClick}
      className={`group relative aspect-square bg-white rounded-2xl overflow-hidden shadow-[var(--shadow-low)] hover:shadow-[var(--shadow-high)] transition-all hover:scale-102 cursor-pointer ${
        isSelected
          ? "ring-3 ring-[var(--sunshine-orange)] scale-105"
          : ""
      }`}
    >
      {/* Image */}
      <img 
        src={imageUrl} 
        alt={title || "Logo"} 
        className="w-full h-full object-cover"
      />
      
      {/* Premium badge - top left corner */}
      {planType === 'premium' && (
        <div className="absolute top-2 left-2 text-lg drop-shadow-md">
          ⭐
        </div>
      )}
      
      {/* Selected indicator - top right */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[var(--sunshine-orange)] flex items-center justify-center text-white text-sm shadow-md">
          ✓
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
        {title && (
          <h4 className="font-bold text-white text-sm truncate">
            {title}
          </h4>
        )}
        {subtitle && (
          <p className="text-[10px] text-white/70 truncate">
            {subtitle}
          </p>
        )}
        {showDate && date && (
          <span className="text-[10px] text-white/60 mt-1">
            {date}
          </span>
        )}
        <span className="text-white/60 text-[10px] text-center mt-2">Click to view</span>
      </div>
    </div>
  )
}

/**
 * LogoCardSkeleton - Loading skeleton for LogoCard
 */
export function LogoCardSkeleton() {
  return (
    <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-[var(--shadow-low)] animate-pulse">
      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-100" />
    </div>
  )
}
