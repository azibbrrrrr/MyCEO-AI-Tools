import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '@/components/language-provider'
import { LanguageToggle } from '@/components/language-toggle'
import { FloatingElements } from '@/components/floating-elements'
import { HelpBubble } from '@/components/help-bubble'
import { useChildSession } from '@/hooks/useChildSession'
import { createSession, saveMessage, updateSession, getChildSessions, SalesSession } from '@/lib/supabase'
import { 
  Coffee, Gift, Utensils, Box, 
  Smile, Search, DollarSign, 
  Send, RefreshCw, 
  Lightbulb, User,
  ChevronRight, Star, Trophy,
  ArrowRight, Heart, MessageSquare, X, ShieldCheck, Meh, Frown, Keyboard, ClipboardList
} from 'lucide-react'

// ============================================
// Types
// ============================================

interface ChatMessage {
  sender: 'user' | 'ai'
  text: string
}

interface ResponseOption {
  text: string
  type: 'bad' | 'good' | 'okay'
}

interface LocalizedText {
  en: string
  bm: string
}

interface LocalizedArray {
  en: string[]
  bm: string[]
}

interface Reflection {
  outcome: 'success' | 'fail' | 'ongoing'
  rating: number
  social_review: LocalizedText
  hashtags: LocalizedArray
  good_point: LocalizedText
  suggestion: LocalizedText
}

interface CustomerInfo {
  name: string
  age: number
  trait: string
  socialMediaName: string
  goal?: string
}

interface Product {
  id: string
  labelKey: string
  icon: React.ReactNode
}

interface Customer {
  id: string
  labelKey: string
  descKey: string
  icon: React.ReactNode
  colorClass: string
}

// ============================================
// Data
// ============================================

const PRODUCTS: Product[] = [
  { id: 'food', labelKey: 'salesBuddy.product.food', icon: <Utensils size={32} /> },
  { id: 'drinks', labelKey: 'salesBuddy.product.drinks', icon: <Coffee size={32} /> },
  { id: 'gifts', labelKey: 'salesBuddy.product.gifts', icon: <Gift size={32} /> },
  { id: 'others', labelKey: 'salesBuddy.product.others', icon: <Box size={32} /> },
]

const CUSTOMERS: Customer[] = [
  { 
    id: 'friendly', 
    labelKey: 'salesBuddy.customer.friendly', 
    descKey: 'salesBuddy.customer.friendly.desc',
    icon: <Smile size={28} />,
    colorClass: 'bg-[var(--mint-green)] text-[var(--text-primary)]'
  },
  { 
    id: 'picky', 
    labelKey: 'salesBuddy.customer.picky', 
    descKey: 'salesBuddy.customer.picky.desc',
    icon: <Search size={28} />,
    colorClass: 'bg-[var(--sunshine-orange)] text-white'
  },
  { 
    id: 'bargain', 
    labelKey: 'salesBuddy.customer.bargain', 
    descKey: 'salesBuddy.customer.bargain.desc',
    icon: <DollarSign size={28} />,
    colorClass: 'bg-[var(--coral-pink)] text-[var(--text-primary)]'
  },
]

// ============================================
// Main Component
// ============================================

export default function SalesBuddyPage() {
  const { t, language } = useLanguage()
  const { child } = useChildSession()
  const navigate = useNavigate()
  
  // Flow state
  const [step, setStep] = useState<'product' | 'customer' | 'chat' | 'reflection'>('product')
  const [product, setProduct] = useState<Product | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [productDesc, setProductDesc] = useState('')
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [inputText, setInputText] = useState('')
  const [options, setOptions] = useState<ResponseOption[]>([])
  const [reflection, setReflection] = useState<Reflection | null>(null)
  const [customerMood, setCustomerMood] = useState(50)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [turnNumber, setTurnNumber] = useState(0)
  const [recentSessions, setRecentSessions] = useState<SalesSession[]>([])
  
  // Refs
  const chatEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const sessionIdRef = useRef<string | null>(null)  // Ref for immediate session ID access
  const turnNumberRef = useRef(0)  // Ref for immediate turn number access

  // Auto-scroll chat
  useEffect(() => {
    if (step === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading, options, step])

  // Fetch recent sessions for "Past Adventures" card
  useEffect(() => {
    const fetchRecentSessions = async () => {
      if (child?.id) {
        const sessions = await getChildSessions(child.id, 2)  // Get last 2 sessions
        setRecentSessions(sessions)
      }
    }
    fetchRecentSessions()
  }, [child?.id])

  // ============================================
  // API Call
  // ============================================

  const generateResponse = async (userReply: string | null, currentMessages: ChatMessage[] = messages, overrideCustomer?: Customer, currentSessionId?: string | null) => {
    setIsLoading(true)
    setOptions([])

    try {
      const response = await fetch('/api/sales-buddy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerType: (overrideCustomer || customer)?.id || 'friendly',
          productType: product?.id || 'snacks',
          productName: productName || undefined,
          productPrice: productPrice || undefined,
          productDesc: productDesc || undefined,
          customerInfo: customerInfo || undefined,  // Pass stored customer info
          messages: currentMessages,
          mood: customerMood,
          language: language,
          isStart: userReply === null
        })
      })

      const result = await response.json()

      // Handle errors
      if (!response.ok) {
        let errorMessage = language === 'BM' 
          ? 'Maaf, ada masalah. Cuba lagi.' 
          : 'Sorry, something went wrong. Please try again.'
        
        if (result.error === 'rate_limit') {
          errorMessage = language === 'BM'
            ? 'AI sedang sibuk. Sila tunggu sebentar dan cuba lagi.'
            : 'AI is busy right now. Please wait a moment and try again.'
        }
        
        setMessages(prev => [...prev, { 
          sender: 'ai', 
          text: errorMessage
        }])
        return
      }

      // Add AI message
      const aiMessage: ChatMessage = { sender: 'ai', text: result.response }
      setMessages(prev => [...prev, aiMessage])
      
      // Update mood
      if (typeof result.mood_score === 'number') {
        setCustomerMood(result.mood_score)
      }

      // DEBUG: Log which branch we'll enter
      console.log('🔍 Save logic check:', {
        hasCustomerInfo: !!result.customerInfo,
        currentSessionId,
        userReply,
        sessionIdRef: sessionIdRef.current
      })

      // Store customer info from first response and create session
      if (result.customerInfo) {
        setCustomerInfo(result.customerInfo)
      }
      
      // FIRST MESSAGE: Create session and save first AI message
      if (!sessionIdRef.current && result.customerInfo && child?.id) {
        console.log('📝 FIRST MESSAGE - Creating session')
        const newSession = await createSession({
          child_id: child.id,
          customer_type: (overrideCustomer || customer)?.id as 'friendly' | 'picky' | 'bargain' || 'friendly',
          customer_name: result.customerInfo.name,
          customer_age: result.customerInfo.age,
          customer_trait: result.customerInfo.trait,
          customer_goal: result.customerInfo.goal || null,
          customer_social: result.customerInfo.socialMediaName,
          product_name: productName || product?.id || 'Unknown',
          product_price: parseFloat(productPrice) || 0,
          product_desc: productDesc || null,
          language: language
        })
        
        if (newSession) {
          setSessionId(newSession.id)
          sessionIdRef.current = newSession.id  // Set ref immediately
          console.log('✅ Session created:', newSession.id)
          
          // Save the first AI message
          await saveMessage({
            session_id: newSession.id,
            sender: 'ai',
            message: result.response,
            mood_after: result.mood_score,
            turn_number: 1
          })
          setTurnNumber(1)
          turnNumberRef.current = 1
        }
      } 
      // SUBSEQUENT MESSAGES: Save user message and AI response
      else if (sessionIdRef.current && userReply) {
        turnNumberRef.current += 1
        const newTurn = turnNumberRef.current
        setTurnNumber(newTurn)
        
        console.log('💾 Saving messages for turn:', newTurn, 'sessionId:', sessionIdRef.current)
        
        // Save user message
        const userSaved = await saveMessage({
          session_id: sessionIdRef.current,
          sender: 'user',
          message: userReply,
          turn_number: newTurn
        })
        console.log('User message saved:', userSaved ? '✅' : '❌')
        
        // Save AI response
        const aiSaved = await saveMessage({
          session_id: sessionIdRef.current,
          sender: 'ai',
          message: result.response,
          mood_after: result.mood_score,
          turn_number: newTurn
        })
        console.log('AI message saved:', aiSaved ? '✅' : '❌')
      } else {
        console.log('⚠️ Not saving messages - sessionIdRef:', sessionIdRef.current, 'userReply:', !!userReply, 'hasCustomerInfo:', !!result.customerInfo)
      }

      // Handle finish or continue
      if (result.is_finished && result.reflection) {
        setReflection(result.reflection)
        setOptions([])
        
        // Update session with final outcome and reflection
        if (currentSessionId || sessionId) {
          const finalSessionId = currentSessionId || sessionId
          await updateSession(finalSessionId!, {
            outcome: result.reflection.outcome === 'ongoing' ? 'abandoned' : result.reflection.outcome,
            rating: result.reflection.rating,
            final_mood: result.mood_score,
            reflection_review_en: result.reflection.social_review?.en,
            reflection_review_bm: result.reflection.social_review?.bm,
            reflection_good_en: result.reflection.good_point?.en,
            reflection_good_bm: result.reflection.good_point?.bm,
            reflection_tip_en: result.reflection.suggestion?.en,
            reflection_tip_bm: result.reflection.suggestion?.bm
          })
          console.log('✅ Session updated with reflection')
        }
      } else {
        // Display options exactly as received (no shuffle)
        setOptions(result.options || [])
      }

    } catch (error) {
      console.error('API Error:', error)
      const errorMessage = language === 'BM'
        ? 'Tidak dapat berhubung. Sila semak sambungan internet.'
        : 'Could not connect. Please check your internet connection.'
      setMessages(prev => [...prev, { sender: 'ai', text: errorMessage }])
    } finally {
      setIsLoading(false)
    }
  }

  // ============================================
  // Handlers
  // ============================================

  const startSimulation = (selectedCustomer?: Customer) => {
    setStep('chat')
    setMessages([])
    setCustomerMood(50)
    setReflection(null)
    setSessionId(null)  // Reset session ID for new simulation
    sessionIdRef.current = null  // Reset ref too
    setTurnNumber(0)
    turnNumberRef.current = 0  // Reset turn number ref
    generateResponse(null, [], selectedCustomer, null)  // Pass null for new session
  }

  const handleUserReply = (text: string) => {
    if (!text.trim()) return
    
    const userMsg: ChatMessage = { sender: 'user', text: text.trim() }
    const updatedMessages = [...messages, userMsg]  // Create new array with user message
    
    setMessages(updatedMessages)  // Update state
    setInputText('')
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    
    // Use ref for immediate session ID access (state might be stale)
    generateResponse(text.trim(), updatedMessages, undefined, sessionIdRef.current)
  }

  const handleRestart = () => {
    setStep('product')
    setProduct(null)
    setCustomer(null)
    setProductName('')
    setProductPrice('')
    setCustomerInfo(null)  // Clear customer persona
    setMessages([])
    setReflection(null)
    setOptions([])
    setInputText('')
    setCustomerMood(50)
    setSessionId(null)  // Clear session ID
    sessionIdRef.current = null  // Clear ref too
    setTurnNumber(0)
    turnNumberRef.current = 0  // Clear turn number ref
  }

  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target
    target.style.height = 'auto'
    target.style.height = Math.min(target.scrollHeight, 120) + 'px'
    setInputText(target.value)
  }

  // ============================================
  // UI Helpers
  // ============================================

  const getMoodIcon = (score: number) => {
    if (score >= 70) return <Smile className="text-[var(--mint-green)]" size={24} />
    if (score >= 40) return <Meh className="text-[var(--sunshine-orange)]" size={24} />
    return <Frown className="text-[var(--coral-pink)]" size={24} />
  }

  const getMoodColor = (score: number) => {
    if (score >= 70) return 'bg-[var(--mint-green)]'
    if (score >= 40) return 'bg-[var(--sunshine-orange)]'
    return 'bg-[var(--coral-pink)]'
  }

  const renderBubble = (msg: ChatMessage, idx: number) => {
    const isAi = msg.sender === 'ai'
    
    // Parse text to separate actions from regular text
    const parts = msg.text.split(/(\*[^*]+\*)/g).filter(Boolean)
    
    return (
      <div key={idx} className={`flex w-full mb-4 ${isAi ? 'justify-start' : 'justify-end'}`}>
        <div className={`flex max-w-[85%] md:max-w-[75%] ${isAi ? 'flex-row' : 'flex-row-reverse'} items-end gap-2`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            isAi ? 'bg-[var(--sky-blue-light)] text-[var(--sky-blue)]' : 'bg-[var(--mint-green)] text-[var(--text-primary)]'
          }`}>
            {isAi ? <User size={18} /> : <Smile size={18} />}
          </div>
          <div className={`px-4 py-3 rounded-2xl shadow-[var(--shadow-low)] text-sm md:text-base leading-relaxed ${
            isAi 
              ? 'bg-white text-[var(--text-primary)] rounded-bl-none border border-[var(--border-light)]' 
              : 'bg-[var(--sky-blue)] text-white rounded-br-none'
          }`}>
            {parts.map((part, i) => {
              if (part.startsWith('*') && part.endsWith('*')) {
                // Action text - show in italics
                const actionText = part.slice(1, -1)
                return (
                  <span key={i} className="italic text-[var(--text-muted)] block mb-1 text-xs">
                    {actionText}
                  </span>
                )
              } else {
                // Regular text - trim leading dots/periods and whitespace
                const cleanText = part.replace(/^[\s.,]+/, '')
                return cleanText ? <span key={i}>{cleanText}</span> : null
              }
            })}
          </div>
        </div>
      </div>
    )
  }

  // ============================================
  // Screens
  // ============================================


  // PRODUCT SELECTION
  if (step === 'product') {
    return (
      <div className="min-h-screen bg-sky-gradient relative overflow-hidden">
        <FloatingElements />
        
        <header className="relative z-10 flex items-center justify-between p-4 md:p-6 bg-white/50 backdrop-blur-sm">
          <Link
            to="/"
            className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-[var(--shadow-low)] hover:shadow-[var(--shadow-medium)] transition-all"
          >
            <span>←</span>
            <span className="font-semibold text-[var(--text-primary)] text-sm">{t("common.back")}</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <span className="font-bold text-[var(--text-primary)] hidden sm:block">{t("tool.salesBuddy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/tools/sales-buddy/history"
              className="flex items-center gap-1.5 bg-white rounded-full px-3 py-2 shadow-[var(--shadow-low)] hover:shadow-[var(--shadow-medium)] transition-all text-[var(--text-primary)]"
              title={language === 'BM' ? 'Sejarah Latihan' : 'Practice History'}
            >
              <ClipboardList size={18} />
              <span className="font-semibold text-sm hidden sm:block">{language === 'BM' ? 'Sejarah' : 'History'}</span>
            </Link>
            <LanguageToggle />
          </div>
        </header>

        <main className="relative z-10 px-4 md:px-8 py-8">
          <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2">
              {t("salesBuddy.selectProduct")}
            </h1>
            <p className="text-[var(--text-secondary)] mb-6">
              {t("salesBuddy.selectProduct.desc")}
            </p>

            {/* Product Type Selection */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {PRODUCTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProduct(p)}
                  className={`p-4 rounded-2xl border-3 transition-all duration-200 flex flex-col items-center gap-2 text-center
                    ${product?.id === p.id 
                      ? 'border-[var(--sunshine-orange)] bg-[#fff5e6] scale-105 shadow-[0_4px_16px_rgba(255,184,77,0.25)]' 
                      : 'border-[var(--border-light)] bg-white hover:border-[var(--sky-blue)] hover:scale-102'
                    }`}
                >
                  <div className="p-2 rounded-full bg-[var(--sky-blue-light)] text-[var(--sky-blue)]">
                    {p.icon}
                  </div>
                  <span className="font-bold text-[var(--text-primary)] text-sm">{t(p.labelKey)}</span>
                </button>
              ))}
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-2xl p-5 border-2 border-[var(--border-light)] shadow-[var(--shadow-low)] space-y-4">
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                  {t("salesBuddy.productName")} <span className="text-[var(--text-muted)] font-normal">({t("common.optional")})</span>
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder={language === 'BM' ? 'cth: Kuih Raya' : 'e.g. Homemade Cookies'}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-light)] focus:border-[var(--sky-blue)] focus:ring-2 focus:ring-[var(--sky-blue-light)] focus:outline-none transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                  {t("salesBuddy.productPrice")} <span className="text-[var(--text-muted)] font-normal">({t("common.optional")})</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-semibold">RM</span>
                  <input
                    type="text"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value.replace(/[^0-9.]/g, ''))}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[var(--border-light)] focus:border-[var(--sky-blue)] focus:ring-2 focus:ring-[var(--sky-blue-light)] focus:outline-none transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
                  {language === 'BM' ? 'Deskripsi Produk' : 'Product Description'} <span className="text-[var(--text-muted)] font-normal">({t("common.optional")})</span>
                </label>
                <textarea
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  placeholder={language === 'BM' ? 'cth: Dibuat dari bahan premium...' : 'e.g. Made with premium ingredients...'}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border-light)] focus:border-[var(--sky-blue)] focus:ring-2 focus:ring-[var(--sky-blue-light)] focus:outline-none transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none"
                />
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={() => setStep('customer')}
              disabled={!product}
              className="w-full mt-6 bg-[var(--sky-blue)] hover:bg-[var(--sky-blue-dark)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-full transition-all hover:scale-105 shadow-[var(--shadow-medium)] flex items-center justify-center gap-2"
            >
              {t("common.next")} <ChevronRight size={20} />
            </button>

            {/* Past Adventures Card */}
            {recentSessions.length > 0 && (
              <div className="mt-8 bg-gradient-to-br from-[var(--sunshine-orange-light)] to-[#fff5e6] rounded-3xl p-5 border-2 border-[var(--sunshine-orange)] shadow-[var(--shadow-medium)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-[var(--sunshine-orange)] text-white">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)]">
                      {language === 'BM' ? 'Latihan Lepas Kamu' : 'Your Past Adventures'}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      {language === 'BM' ? 'Lihat prestasi terdahulu' : 'See how you did before'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {recentSessions.map((session) => {
                    const timeAgo = (() => {
                      const now = new Date()
                      const created = new Date(session.created_at!)
                      const diffHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60))
                      if (diffHours < 1) return language === 'BM' ? 'Baru je' : 'Just now'
                      if (diffHours < 24) return language === 'BM' ? `${diffHours} jam lepas` : `${diffHours}h ago`
                      const diffDays = Math.floor(diffHours / 24)
                      return language === 'BM' ? `${diffDays} hari lepas` : `${diffDays}d ago`
                    })()
                    
                    const customerEmoji = session.customer_type === 'friendly' ? '😊' : 
                                         session.customer_type === 'picky' ? '🔍' : '💰'
                    
                    return (
                      <div 
                        key={session.id}
                        className="bg-white rounded-xl p-3 flex items-center gap-3 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => navigate('/tools/sales-buddy/history')}
                      >
                        <span className="text-xl">{customerEmoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-[var(--text-primary)] truncate">
                            {session.product_name}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={10} 
                                  className={i < (session.rating || 0) 
                                    ? "fill-[var(--golden-yellow)] text-[var(--golden-yellow)]" 
                                    : "text-[var(--border-light)]"
                                  } 
                                />
                              ))}
                            </div>
                            <span className="text-xs text-[var(--text-muted)]">{timeAgo}</span>
                          </div>
                        </div>
                        <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                          session.outcome === 'success' 
                            ? 'bg-[var(--mint-green-light)] text-[var(--mint-green-dark)]'
                            : 'bg-[var(--coral-pink-light)] text-[var(--coral-pink-dark)]'
                        }`}>
                          {session.outcome === 'success' 
                            ? (language === 'BM' ? '✓ Berjaya' : '✓ Success')
                            : (language === 'BM' ? '✗ Cuba lagi' : '✗ Try again')
                          }
                        </div>
                      </div>
                    )
                  })}
                </div>

                <Link 
                  to="/tools/sales-buddy/history"
                  className="mt-4 w-full bg-[var(--sunshine-orange)] hover:bg-[var(--sunshine-orange-dark)] text-white font-bold py-3 px-4 rounded-full transition-all flex items-center justify-center gap-2 shadow-[var(--shadow-low)]"
                >
                  <ClipboardList size={18} />
                  {language === 'BM' ? 'Lihat Semua Latihan' : 'View All Practice'}
                </Link>
              </div>
            )}
          </div>
        </main>

        <HelpBubble />
      </div>
    )
  }

  // CUSTOMER SELECTION
  if (step === 'customer') {
    return (
      <div className="min-h-screen bg-sky-gradient relative overflow-hidden">
        <FloatingElements />
        
        <header className="relative z-10 flex items-center justify-between p-4 md:p-6 bg-white/50 backdrop-blur-sm">
          <button
            onClick={() => setStep('product')}
            className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-[var(--shadow-low)] hover:shadow-[var(--shadow-medium)] transition-all"
          >
            <span>←</span>
            <span className="font-semibold text-[var(--text-primary)] text-sm">{t("common.previous")}</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <span className="font-bold text-[var(--text-primary)] hidden sm:block">{t("tool.salesBuddy")}</span>
          </div>
          <LanguageToggle />
        </header>

        <main className="relative z-10 px-4 md:px-8 py-8">
          <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2">
              {t("salesBuddy.selectCustomer")}
            </h1>
            <p className="text-[var(--text-secondary)] mb-8">
              {t("salesBuddy.selectCustomer.desc")}
            </p>

            <div className="flex flex-col gap-3">
              {CUSTOMERS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCustomer(c)
                    setTimeout(() => startSimulation(c), 200)
                  }}
                  className={`flex items-center text-left w-full p-4 gap-4 rounded-2xl border-3 transition-all duration-200
                    ${customer?.id === c.id 
                      ? 'border-[var(--sunshine-orange)] bg-[#fff5e6] scale-[1.02] shadow-[0_4px_16px_rgba(255,184,77,0.25)]' 
                      : 'border-[var(--border-light)] bg-white hover:border-[var(--sky-blue)] hover:shadow-[var(--shadow-low)]'
                    }`}
                >
                  <div className={`p-3 rounded-full ${c.colorClass}`}>
                    {c.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)] text-lg">{t(c.labelKey)}</h3>
                    <p className="text-[var(--text-muted)] text-sm">{t(c.descKey)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </main>

        <HelpBubble />
      </div>
    )
  }

  // CHAT SCREEN
  if (step === 'chat') {
    return (
      <div className="min-h-screen bg-[var(--bg-sky-lighter)] flex flex-col">
        {/* Header with Mood Meter */}
        <div className="bg-white border-b border-[var(--border-light)] shadow-[var(--shadow-low)] shrink-0 z-10 sticky top-0">
          <div className="px-4 py-3 flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${customer?.colorClass || 'bg-[var(--sky-blue-light)]'}`}>
                {customer?.icon || <User size={20}/>}
              </div>
              <div>
                <h2 className="font-bold text-[var(--text-primary)] leading-tight">
                  {customer ? t(customer.labelKey) : t("salesBuddy.customer")}
                </h2>
                <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                  {t("salesBuddy.customerMood")}: {getMoodIcon(customerMood)}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <LanguageToggle />
              <button onClick={handleRestart} className="p-2 text-[var(--text-muted)] hover:text-[var(--coral-pink)] transition-colors">
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
          
          {/* Mood Bar */}
          <div className="w-full h-1.5 bg-[var(--bg-muted)]">
            <div 
              className={`h-full transition-all duration-700 ease-out ${getMoodColor(customerMood)}`}
              style={{ width: `${customerMood}%` }}
            />
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-2xl mx-auto">
            {messages.map((msg, idx) => renderBubble(msg, idx))}
            
            {isLoading && (
              <div className="flex w-full mb-4 justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-[var(--border-light)] shadow-[var(--shadow-low)]">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                    <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                    <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                  </div>
                </div>
              </div>
            )}

            {/* Response Options */}
            {!isLoading && !reflection && options.length > 0 && (
              <div className="flex flex-col gap-2 ml-10 max-w-[85%] md:max-w-[75%] animate-fade-up">
                <p className="text-xs text-[var(--text-muted)] font-semibold mb-1 uppercase tracking-wide">
                  {t("salesBuddy.options")}
                </p>
                {options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleUserReply(opt.text)}
                    className="w-full text-left p-3 rounded-xl border border-[var(--border-light)] bg-white hover:bg-[var(--bg-sky-lighter)] hover:border-[var(--sky-blue)] transition-all text-[var(--text-primary)] text-sm shadow-[var(--shadow-low)] active:scale-[0.98]"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            )}

            <div ref={chatEndRef} className="h-4" />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-[var(--border-light)] p-3 md:p-4 shrink-0 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)] sticky bottom-0">
          {reflection ? (
            <div className="animate-fade-up max-w-2xl mx-auto">
              <button 
                onClick={() => setStep('reflection')}
                className="w-full bg-[var(--sky-blue)] hover:bg-[var(--sky-blue-dark)] text-white font-bold py-4 rounded-full shadow-[var(--shadow-medium)] flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                {t("salesBuddy.viewResults")} <ArrowRight size={20} />
              </button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="mb-2 px-1">
                <p className="text-xs text-[var(--sky-blue)] font-bold flex items-center gap-1">
                  <Keyboard size={12} /> {t("salesBuddy.typeOwn")}
                </p>
              </div>
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={handleInputResize}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      if(inputText.trim()) handleUserReply(inputText)
                    }
                  }}
                  placeholder={t("salesBuddy.typeHere")}
                  rows={1}
                  className="flex-1 bg-white border-2 border-[var(--border-light)] focus:border-[var(--sky-blue)] text-[var(--text-primary)] px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--sky-blue-light)] transition-all text-sm md:text-base resize-none overflow-hidden max-h-[120px] shadow-[var(--shadow-low)] placeholder:text-[var(--text-muted)]"
                  disabled={isLoading}
                />
                <button 
                  onClick={() => handleUserReply(inputText)}
                  disabled={!inputText.trim() || isLoading}
                  className="bg-[var(--sky-blue)] text-white p-3 rounded-full mb-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--sky-blue-dark)] active:scale-95 transition-transform shadow-[var(--shadow-medium)] shrink-0"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // REFLECTION SCREEN
  if (step === 'reflection' && reflection) {
    const isSuccess = reflection.outcome === 'success'
    const langKey = language === 'BM' ? 'bm' : 'en'

    return (
      <div className="fixed inset-0 bg-[var(--text-primary)]/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-scale-in">
        <div className="bg-[var(--bg-muted)] rounded-3xl w-full max-w-sm shadow-[var(--shadow-high)] overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header Status */}
          <div className={`${isSuccess ? 'bg-[var(--mint-green)]' : 'bg-[var(--coral-pink)]'} p-4 text-center relative`}>
            <button 
              onClick={handleRestart} 
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-1 rounded-full text-[var(--text-primary)]"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {isSuccess ? t("salesBuddy.result.success") : t("salesBuddy.result.fail")}
            </h2>
            {!isSuccess && (
              <p className="text-[var(--text-primary)]/70 text-xs mt-1">
                {t("salesBuddy.result.fail.desc")}
              </p>
            )}
          </div>

          {/* Scrollable Content */}
          <div className="p-4 space-y-4 overflow-y-auto">
            
            {/* Social Media Card */}
            <div className="bg-white rounded-xl shadow-[var(--shadow-low)] border border-[var(--border-light)] overflow-hidden">
              <div className="p-3 border-b border-[var(--border-light)] flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${customer?.colorClass || 'bg-[var(--sky-blue-light)]'}`}>
                  {customer?.icon}
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-[var(--text-primary)]">
                    {customerInfo?.socialMediaName || '@customer'}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">{t("salesBuddy.justNow")}</p>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < reflection.rating ? "fill-[var(--golden-yellow)] text-[var(--golden-yellow)]" : "text-[var(--border-light)]"} 
                    />
                  ))}
                </div>
                <p className="text-[var(--text-primary)] text-sm leading-relaxed mb-3">
                  "{reflection.social_review[langKey]}"
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {reflection.hashtags[langKey].map((tag, i) => (
                    <span key={i} className="text-xs text-[var(--sky-blue)] font-medium">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="px-4 py-3 border-t border-[var(--border-light)] bg-[var(--bg-muted)] flex items-center gap-4 text-[var(--text-muted)]">
                <Heart size={20} className={isSuccess ? "text-[var(--coral-pink)] fill-[var(--coral-pink)]" : ""} />
                <MessageSquare size={20} />
                <Send size={20} />
              </div>
            </div>

            {/* Coach Feedback */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider ml-1">
                {t("salesBuddy.analysis")}
              </h3>
              <div className="bg-white p-3 rounded-xl border border-[var(--border-light)] flex gap-3">
                <ShieldCheck className="text-[var(--mint-green)] shrink-0" size={20} />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-[var(--text-muted)]">{t("salesBuddy.strength")}</p>
                  <p className="text-sm text-[var(--text-primary)]">{reflection.good_point[langKey]}</p>
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[var(--border-light)] flex gap-3">
                <Lightbulb className="text-[var(--sunshine-orange)] shrink-0" size={20} />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-[var(--text-muted)]">{t("salesBuddy.suggestion")}</p>
                  <p className="text-sm text-[var(--text-primary)]">{reflection.suggestion[langKey]}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border-t border-[var(--border-light)] shrink-0 space-y-3">
            <button 
              onClick={handleRestart}
              className="w-full bg-[var(--sky-blue)] text-white font-bold py-3 rounded-full hover:bg-[var(--sky-blue-dark)] transition-colors shadow-[var(--shadow-medium)]"
            >
              {t("salesBuddy.tryAgain")}
            </button>
            
            {/* View History Button */}
            <Link 
              to="/tools/sales-buddy/history"
              className="w-full bg-white border-2 border-[var(--sunshine-orange)] text-[var(--sunshine-orange)] font-bold py-3 rounded-full hover:bg-[var(--sunshine-orange-light)] transition-colors flex items-center justify-center gap-2"
            >
              <Trophy size={18} />
              {language === 'BM' ? 'Lihat Semua Latihan' : 'View All Practice History'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return null
}
