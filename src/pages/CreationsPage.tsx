import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import { Link, useNavigate } from "react-router-dom"
import { useChildSession } from "@/hooks/useChildSession"
import { getChildLogos, selectLogoAndUpdateCompany, deleteLogo } from "@/lib/supabase/ai-tools"
import type { ChildLogo } from "@/lib/supabase/types"
import { FloatingElements } from "@/components/floating-elements"
import { LogoCard } from "@/components/LogoCard"
import { LogoZoomModal } from "@/components/LogoZoomModal"
import { ConfirmDialog } from "@/components/ConfirmDialog"

// Helper to format date
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  return date.toLocaleDateString()
}

export default function CreationsPage() {
  const { t } = useLanguage()
  const { child, loading, updateCompanyLogoUrl } = useChildSession()
  const navigate = useNavigate()
  const [logos, setLogos] = useState<ChildLogo[]>([])
  const [loadingLogos, setLoadingLogos] = useState(true)

  // Simplified zoom modal state
  const [zoomModalOpen, setZoomModalOpen] = useState(false)
  const [zoomLogoIndex, setZoomLogoIndex] = useState<number | null>(null)

  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [logoToDelete, setLogoToDelete] = useState<ChildLogo | null>(null)

  // Redirect to dev login if not logged in
  useEffect(() => {
    if (!loading && !child) {
      navigate('/dev/login')
    }
  }, [child, loading, navigate])

  // Fetch logos
  useEffect(() => {
    async function fetchLogos() {
      if (child?.id) {
        setLoadingLogos(true)
        const data = await getChildLogos(child.id)
        setLogos(data)
        setLoadingLogos(false)
      }
    }
    fetchLogos()
  }, [child?.id])

  const openZoomModal = (index: number) => {
    setZoomLogoIndex(index)
    setZoomModalOpen(true)
  }

  const closeZoomModal = () => {
    setZoomModalOpen(false)
    setZoomLogoIndex(null)
  }

  const handleDeleteClick = () => {
    if (zoomLogoIndex !== null && logos[zoomLogoIndex]) {
      setLogoToDelete(logos[zoomLogoIndex])
      setDeleteConfirmOpen(true)
    }
  }

  const handleConfirmDelete = async () => {
    if (logoToDelete && child?.id) {
      await deleteLogo(child.id, logoToDelete.id)
      // Remove from local state
      setLogos(prev => prev.filter(l => l.id !== logoToDelete.id))
      setDeleteConfirmOpen(false)
      setLogoToDelete(null)
      closeZoomModal()
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-sky-gradient flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  // No child - will redirect
  if (!child) return null

  return (
    <div className="min-h-screen bg-sky-gradient relative overflow-hidden">
      <FloatingElements />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 md:p-6 bg-white/50 backdrop-blur-sm">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-[var(--shadow-low)] hover:shadow-[var(--shadow-medium)] transition-all"
        >
          <span className="text-xl">←</span>
          <span className="font-bold text-[var(--text-primary)]">{t("common.back")}</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 md:px-8 pb-8 pt-4">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mb-2">
              🎨 My Creations
            </h1>
            <p className="text-[var(--text-secondary)]">
              All the amazing logos you've created!
            </p>
          </div>

          {/* Logos Grid */}
          {loadingLogos ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin text-4xl">🔄</div>
            </div>
          ) : logos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {logos.map((logo, index) => (
                <LogoCard
                  key={logo.id}
                  imageUrl={logo.image_url}
                  title={logo.company_name || "My Logo"}
                  subtitle={`${logo.business_type || ''} • ${logo.logo_style || ''}`}
                  showDate
                  date={formatDate(logo.created_at)}
                  planType={logo.plan_type as 'free' | 'premium'}
                  onClick={() => openZoomModal(index)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white/70 rounded-3xl p-12 text-center">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No creations yet!</h3>
              <p className="text-[var(--text-secondary)] mb-6">
                Start your creative journey by making your first logo.
              </p>
              <Link 
                to="/tools/logo-maker"
                className="inline-block px-8 py-3 bg-[var(--sky-blue)] text-white font-bold rounded-full hover:scale-105 transition-transform shadow-[var(--shadow-medium)]"
              >
                Create My First Logo 🚀
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Zoom Modal */}
      {zoomLogoIndex !== null && logos[zoomLogoIndex] && (
        <LogoZoomModal
          isOpen={zoomModalOpen}
          imageUrl={logos[zoomLogoIndex].image_url}
          title={logos[zoomLogoIndex].company_name || "My Logo"}
          subtitle={`Created ${formatDate(logos[zoomLogoIndex].created_at)}`}
          onClose={closeZoomModal}
          showPickButton={true}
          pickButtonLabel="Set as Company Logo ✨"
          onPick={async () => {
            const logo = logos[zoomLogoIndex]
            console.log('🔵 Set Company Logo clicked:', { logoId: logo.id, childId: child?.id, companyId: child?.companies?.[0]?.id })
            if (child?.id && child.companies?.[0]?.id) {
              try {
                const result = await selectLogoAndUpdateCompany(
                  child.id,
                  logo.id,
                  logo.image_url,
                  child.companies[0].id
                )
                console.log('🔵 selectLogoAndUpdateCompany result:', result)
                if (result) {
                  updateCompanyLogoUrl(logo.image_url) // Update session without refresh
                }
                closeZoomModal()
              } catch (err) {
                console.error('🔴 Error setting company logo:', err)
                closeZoomModal()
              }
            } else {
              console.warn('🟡 Missing child or company ID:', { childId: child?.id, companyId: child?.companies?.[0]?.id })
            }
          }}
          showDeleteButton={true}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Logo?"
        message="This will permanently remove this logo from your creations. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Keep It"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false)
          setLogoToDelete(null)
        }}
      />
    </div>
  )
}
