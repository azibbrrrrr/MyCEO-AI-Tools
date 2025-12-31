import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/components/language-provider'
import { LanguageToggle } from '@/components/language-toggle'
import { FloatingElements } from '@/components/floating-elements'
import { HelpBubble } from '@/components/help-bubble'
import { useChildSession } from '@/hooks/useChildSession'
import { 
  Smile, Search, DollarSign, 
  Star, X, Clock, ChevronRight,
  Loader2
} from 'lucide-react'
import type { SalesSession, SalesMessage } from '@/lib/supabase/types'
import { getChildSessions, getSessionWithMessages } from '@/lib/supabase'

// ============================================
// Types
// ============================================

interface SessionWithMessages {
  session: SalesSession
  messages: SalesMessage[]
}

// ============================================
// Component
// ============================================

export default function SalesBuddyHistoryPage() {
  const { t, language } = useLanguage()
  const { child } = useChildSession()
  const childId = child?.id
  
  const [sessions, setSessions] = useState<SalesSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState<SessionWithMessages | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)

  // Fetch sessions on mount
  useEffect(() => {
    if (!childId) return
    
    async function fetchSessions() {
      try {
        const data = await getChildSessions(childId!)
        setSessions(data)
      } catch (error) {
        console.error('Failed to fetch sessions:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchSessions()
  }, [childId])

  // Fetch single session with messages
  async function viewSession(sessionId: string) {
    setIsLoadingDetail(true)
    try {
      const data = await getSessionWithMessages(sessionId)
      if (data) {
        setSelectedSession(data)
      }
    } catch (error) {
      console.error('Failed to fetch session:', error)
    } finally {
      setIsLoadingDetail(false)
    }
  }

  // Format relative time
  function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return language === 'BM' ? 'Baru saja' : 'Just now'
    if (diffMins < 60) return language === 'BM' ? `${diffMins} minit lepas` : `${diffMins}m ago`
    if (diffHours < 24) return language === 'BM' ? `${diffHours} jam lepas` : `${diffHours}h ago`
    if (diffDays < 7) return language === 'BM' ? `${diffDays} hari lepas` : `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  // Get customer type info
  function getCustomerTypeInfo(type: string) {
    switch (type) {
      case 'friendly':
        return { 
          icon: <Smile size={20} />, 
          bg: 'bg-[var(--mint-green)]',
          label: language === 'BM' ? 'Mesra' : 'Friendly'
        }
      case 'picky':
        return { 
          icon: <Search size={20} />, 
          bg: 'bg-[var(--coral-pink)]',
          label: language === 'BM' ? 'Cerewet' : 'Picky'
        }
      case 'bargain':
        return { 
          icon: <DollarSign size={20} />, 
          bg: 'bg-[var(--sunshine-orange)]',
          label: language === 'BM' ? 'Tawar' : 'Bargain'
        }
      default:
        return { 
          icon: <Smile size={20} />, 
          bg: 'bg-[var(--sky-blue-light)]',
          label: type
        }
    }
  }

  // ============================================
  // Session Detail Modal
  // ============================================

  if (selectedSession) {
    const { session, messages } = selectedSession
    const isSuccess = session.outcome === 'success'
    const customerType = getCustomerTypeInfo(session.customer_type)

    return (
      <div className="fixed inset-0 bg-[var(--text-primary)]/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-scale-in">
        <div className="bg-[var(--bg-muted)] rounded-3xl w-full max-w-lg shadow-[var(--shadow-high)] overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className={`${customerType.bg} p-4 relative`}>
            <button 
              onClick={() => setSelectedSession(null)} 
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-1.5 rounded-full text-[var(--text-primary)]"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
                {customerType.icon}
              </div>
              <div>
                <p className="font-bold text-[var(--text-primary)]">{session.customer_name}</p>
                <p className="text-sm text-[var(--text-primary)]/70">
                  {customerType.label} • {session.customer_age} {language === 'BM' ? 'tahun' : 'y/o'}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-[var(--text-primary)]/80">
              <span>🏷️ {session.product_name}</span>
              <span>•</span>
              <span>RM{session.product_price}</span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-[var(--bg-muted)] space-y-3">
            {messages.length === 0 ? (
              <p className="text-center text-[var(--text-muted)] py-8">
                {language === 'BM' ? 'Tiada mesej' : 'No messages'}
              </p>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                    msg.sender === 'ai' 
                      ? 'bg-white text-[var(--text-primary)] rounded-bl-none border border-[var(--border-light)]'
                      : 'bg-[var(--sky-blue)] text-white rounded-br-none'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Reflection (if completed) */}
          {session.outcome && (
            <div className="p-4 bg-white border-t border-[var(--border-light)]">
              <div className={`flex items-center gap-2 mb-3 ${isSuccess ? 'text-[var(--mint-green)]' : 'text-[var(--coral-pink)]'}`}>
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${isSuccess ? 'bg-[var(--mint-green)]/20' : 'bg-[var(--coral-pink)]/20'}`}>
                  {isSuccess ? (language === 'BM' ? '✅ Berjaya' : '✅ Success') : (language === 'BM' ? '❌ Gagal' : '❌ Failed')}
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < (session.rating || 0) ? "fill-[var(--golden-yellow)] text-[var(--golden-yellow)]" : "text-[var(--border-light)]"} 
                    />
                  ))}
                </div>
              </div>
              
              {(session.reflection_good_en || session.reflection_good_bm) && (
                <div className="bg-[var(--mint-green)]/10 rounded-xl p-3 mb-2">
                  <p className="text-xs font-bold text-[var(--text-muted)] mb-1">💪 {language === 'BM' ? 'Kekuatan' : 'Strength'}</p>
                  <p className="text-sm text-[var(--text-primary)]">
                    {language === 'BM' ? session.reflection_good_bm : session.reflection_good_en}
                  </p>
                </div>
              )}
              
              {(session.reflection_tip_en || session.reflection_tip_bm) && (
                <div className="bg-[var(--sunshine-orange)]/10 rounded-xl p-3">
                  <p className="text-xs font-bold text-[var(--text-muted)] mb-1">💡 {language === 'BM' ? 'Saranan' : 'Tip'}</p>
                  <p className="text-sm text-[var(--text-primary)]">
                    {language === 'BM' ? session.reflection_tip_bm : session.reflection_tip_en}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Close Button */}
          <div className="p-4 bg-[var(--bg-muted)] border-t border-[var(--border-light)]">
            <button 
              onClick={() => setSelectedSession(null)}
              className="w-full bg-[var(--sky-blue)] text-white font-bold py-3 rounded-full hover:bg-[var(--sky-blue-dark)] transition-colors shadow-[var(--shadow-medium)]"
            >
              {language === 'BM' ? 'Tutup' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ============================================
  // Main History List
  // ============================================

  return (
    <div className="min-h-screen bg-sky-gradient relative overflow-hidden">
      <FloatingElements />
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 md:p-6 bg-white/50 backdrop-blur-sm">
        <Link
          to="/tools/sales-buddy"
          className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-[var(--shadow-low)] hover:shadow-[var(--shadow-medium)] transition-all"
        >
          <span>←</span>
          <span className="font-semibold text-[var(--text-primary)] text-sm">{t("common.back")}</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-2xl">📋</span>
          <span className="font-bold text-[var(--text-primary)] hidden sm:block">
            {language === 'BM' ? 'Sejarah Latihan' : 'Practice History'}
          </span>
        </div>
        <LanguageToggle />
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 md:px-8 py-8">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2">
            {language === 'BM' ? '📋 Latihan Saya' : '📋 My Practice Sessions'}
          </h1>
          <p className="text-[var(--text-secondary)] mb-6">
            {language === 'BM' ? 'Lihat bagaimana anda telah berkembang!' : 'See how you\'ve improved!'}
          </p>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="animate-spin text-[var(--sky-blue)]" size={48} />
              <p className="mt-4 text-[var(--text-muted)]">
                {language === 'BM' ? 'Memuat...' : 'Loading...'}
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && sessions.length === 0 && (
            <div className="bg-white rounded-3xl p-8 shadow-[var(--shadow-medium)] text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                {language === 'BM' ? 'Belum ada latihan' : 'No practice yet'}
              </h2>
              <p className="text-[var(--text-secondary)] mb-6">
                {language === 'BM' 
                  ? 'Mula berlatih kemahiran jualan anda sekarang!' 
                  : 'Start practicing your sales skills now!'}
              </p>
              <Link 
                to="/tools/sales-buddy"
                className="inline-flex items-center gap-2 bg-[var(--sky-blue)] text-white font-bold px-6 py-3 rounded-full hover:bg-[var(--sky-blue-dark)] transition-all shadow-[var(--shadow-medium)]"
              >
                {language === 'BM' ? 'Mula Latihan' : 'Start Practice'} <ChevronRight size={20} />
              </Link>
            </div>
          )}

          {/* Sessions List */}
          {!isLoading && sessions.length > 0 && (
            <div className="space-y-4">
              {sessions.map((session) => {
                const customerType = getCustomerTypeInfo(session.customer_type)
                const isSuccess = session.outcome === 'success'
                const isFail = session.outcome === 'fail'
                
                return (
                  <button
                    key={session.id}
                    onClick={() => viewSession(session.id)}
                    disabled={isLoadingDetail}
                    className="w-full bg-white rounded-2xl p-4 shadow-[var(--shadow-medium)] hover:shadow-[var(--shadow-high)] hover:scale-[1.02] transition-all text-left group"
                  >
                    <div className="flex items-start gap-3">
                      {/* Customer Type Icon */}
                      <div className={`w-12 h-12 rounded-xl ${customerType.bg} flex items-center justify-center shrink-0`}>
                        {customerType.icon}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[var(--text-primary)] truncate">
                            {session.customer_name}
                          </span>
                          {/* Outcome Badge */}
                          {isSuccess && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--mint-green)]/20 text-[var(--mint-green)] font-semibold">
                              ✅
                            </span>
                          )}
                          {isFail && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--coral-pink)]/20 text-[var(--coral-pink)] font-semibold">
                              ❌
                            </span>
                          )}
                          {!session.outcome && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--text-muted)]/20 text-[var(--text-muted)] font-semibold">
                              ⏸️
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-[var(--text-secondary)] truncate">
                          {customerType.label} • {session.product_name} RM{session.product_price}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          {/* Stars */}
                          <div className="flex">
                            {session.rating ? (
                              [...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={14} 
                                  className={i < session.rating! ? "fill-[var(--golden-yellow)] text-[var(--golden-yellow)]" : "text-[var(--border-light)]"} 
                                />
                              ))
                            ) : (
                              <span className="text-xs text-[var(--text-muted)]">-</span>
                            )}
                          </div>
                          
                          {/* Time */}
                          <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                            <Clock size={12} />
                            {formatRelativeTime(session.created_at)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Arrow */}
                      <ChevronRight size={20} className="text-[var(--text-muted)] group-hover:text-[var(--sky-blue)] transition-colors shrink-0" />
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <HelpBubble />
    </div>
  )
}
