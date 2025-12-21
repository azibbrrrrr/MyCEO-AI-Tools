import { useState } from 'react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: 'danger' | 'primary'
  onConfirm: () => void
  onCancel: () => void
}

/**
 * ConfirmDialog - Reusable confirmation modal
 * Uses design.json styling principles
 */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
            confirmVariant === 'danger' 
              ? 'bg-red-100' 
              : 'bg-[var(--sky-blue-light)]'
          }`}>
            {confirmVariant === 'danger' ? '🗑️' : '❓'}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-center text-[var(--text-primary)] mb-2">
          {title}
        </h3>
        
        {/* Message */}
        <p className="text-center text-[var(--text-secondary)] mb-6">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-full bg-gray-100 text-[var(--text-primary)] font-bold hover:bg-gray-200 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 rounded-full font-bold hover:scale-105 transition-transform ${
              confirmVariant === 'danger'
                ? 'bg-red-500 text-white'
                : 'bg-[var(--sky-blue)] text-white'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Hook for using ConfirmDialog
 */
export function useConfirmDialog() {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean
    title: string
    message: string
    confirmLabel?: string
    confirmVariant?: 'danger' | 'primary'
    onConfirm: () => void
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  })

  const showConfirm = (options: {
    title: string
    message: string
    confirmLabel?: string
    confirmVariant?: 'danger' | 'primary'
    onConfirm: () => void
  }) => {
    setDialogState({
      isOpen: true,
      ...options,
    })
  }

  const hideConfirm = () => {
    setDialogState(prev => ({ ...prev, isOpen: false }))
  }

  return {
    dialogState,
    showConfirm,
    hideConfirm,
  }
}
