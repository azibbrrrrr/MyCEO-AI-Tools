/**
 * LogoZoomModal - Reusable zoom modal for logo viewing
 * Used in: Logo Maker, Dashboard, Creations
 */

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"

export interface LogoZoomModalProps {
  isOpen: boolean
  imageUrl: string
  title?: string
  subtitle?: string
  onClose: () => void
  onPick?: () => void  // Optional: for Logo Maker selection
  showPickButton?: boolean
  pickButtonLabel?: string
  pickButtonColor?: string // Custom color class (e.g. "bg-red-500")
  onDelete?: () => void  // Optional: for Creations page
  showDeleteButton?: boolean
}

export function LogoZoomModal({
  isOpen,
  imageUrl,
  title,
  subtitle,
  onClose,
  onPick,
  showPickButton = false,
  pickButtonLabel,
  pickButtonColor,
  onDelete,
  showDeleteButton = false,
}: LogoZoomModalProps) {
  const { t } = useLanguage()
  const resolvedPickButtonLabel = pickButtonLabel || `${t("modal.zoom.pick")} 🎨`

  // ... existing state ...
  const [zoomLevel, setZoomLevel] = useState(100)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  if (!isOpen) return null

  // ... existing handlers ...
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 300))
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 50))

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) handleZoomIn()
    else handleZoomOut()
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 100) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - dragPosition.x, y: e.clientY - dragPosition.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setDragPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
    }
  }

  const handleMouseUp = () => setIsDragging(false)

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleDownload = () => {
    const filename = `logo-${Date.now()}.png`
    
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = imageUrl
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        const pngUrl = canvas.toDataURL('image/png')
        
        const link = document.createElement('a')
        link.href = pngUrl
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  }

  const resetZoom = () => {
    setZoomLevel(100)
    setDragPosition({ x: 0, y: 0 })
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl transition-colors z-10"
        >
          ✕
        </button>

        {/* Title section */}
        {(title || subtitle) && (
          <div className="mb-4 pr-12">
            {title && <h3 className="font-bold text-lg text-[var(--text-primary)] truncate">{title}</h3>}
            {subtitle && <p className="text-sm text-[var(--text-muted)]">{subtitle}</p>}
          </div>
        )}

        {/* Zoomable image container */}
        <div
          className="relative w-full aspect-square rounded-2xl overflow-hidden border-3 border-[var(--sky-blue)] bg-gray-100 cursor-grab active:cursor-grabbing"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            src={imageUrl}
            alt="Zoomed logo"
            className="w-full h-full object-contain select-none"
            style={{
              transform: `scale(${zoomLevel / 100}) translate(${dragPosition.x / (zoomLevel / 100)}px, ${dragPosition.y / (zoomLevel / 100)}px)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            }}
            draggable={false}
          />

          {/* Zoom controls overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 rounded-full px-3 py-2">
            <button
              onClick={handleZoomOut}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors text-sm"
            >
              ➖
            </button>
            <button 
              onClick={resetZoom}
              className="text-white text-sm font-semibold min-w-[50px] text-center hover:bg-white/20 rounded px-1"
            >
              {zoomLevel}%
            </button>
            <button
              onClick={handleZoomIn}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors text-sm"
            >
              ➕
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleDownload}
            className="flex-1 px-4 py-3 rounded-full bg-gray-100 text-[var(--text-primary)] font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
           {t("modal.zoom.download")}
          </button>
          {showPickButton && onPick && (
            <button
              onClick={onPick}
              className={`flex-1 px-4 py-3 rounded-full text-white font-bold hover:scale-105 transition-transform ${pickButtonColor || "bg-[var(--sunshine-orange)]"}`}
            >
              {resolvedPickButtonLabel}
            </button>
          )}
        </div>
        
        {/* Delete button (separate row for danger action) */}
        {showDeleteButton && onDelete && (
          <button
            onClick={onDelete}
            className="w-full mt-3 px-4 py-2.5 rounded-full border-2 border-red-400 text-red-500 font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            {t("modal.zoom.delete")}
          </button>
        )}
      </div>
    </div>
  )
}
