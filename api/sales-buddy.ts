import type { VercelRequest, VercelResponse } from '@vercel/node'

// ============================================
// Types
// ============================================

interface ChatMessage {
    sender: 'user' | 'ai'
    text: string
}

interface CustomerInfo {
    name: string
    age: number
    trait: string
    socialMediaName: string
    goal?: string
}

interface SalesBuddyRequest {
    customerType: string
    productType: string
    productName?: string
    productPrice?: string
    productDesc?: string
    customerInfo?: CustomerInfo
    messages: ChatMessage[]
    mood: number
    language: 'EN' | 'BM'
    isStart?: boolean
}

interface ResponseOption {
    text: string
    type: 'bad' | 'good' | 'okay'
}

// Bilingual Interface
interface BilingualText {
    en: string
    bm: string
}

interface BilingualArray {
    en: string[]
    bm: string[]
}

interface Reflection {
    outcome: 'success' | 'fail'
    rating: number
    social_review: BilingualText
    hashtags: BilingualArray  // Changed: must be arrays for frontend .map()
    good_point: BilingualText
    suggestion: BilingualText
}

interface SalesBuddyResponse {
    thought_process?: string
    response: string
    mood_score: number
    options: ResponseOption[]
    is_finished: boolean
    reflection?: Reflection
    customerInfo?: CustomerInfo
}

// ============================================
// DATA: Predefined Personas (Expanded)
// ============================================
const PREDEFINED_PERSONAS = {
    // FRIENDLY: Focus on SUPPORT & ENCOURAGEMENT (no price focus)
    friendly: [
        // Kids/Peers
        { name: "Ahmad", age: 11, trait: "Supportive classmate, says 'bro'", socialMediaName: "@ahmad_cool", goal: "Wants to support a friend's business" },
        { name: "Priya", age: 10, trait: "Sweet and encouraging", socialMediaName: "@priya_star", goal: "Excited to try something new" },
        { name: "Jason", age: 12, trait: "Enthusiastic friend", socialMediaName: "@jason_gamer", goal: "Heard good things, wants to try" },
        { name: "Mei Ling", age: 12, trait: "Best friend, always supportive", socialMediaName: "@mei_ling_cute", goal: "Here to support you!" },
        // Teens
        { name: "Mia", age: 16, trait: "Cheerful teen, loves selfies", socialMediaName: "@mia_sparkle", goal: "Looking for something nice to share" },
        { name: "Amirul", age: 17, trait: "Chill and supportive", socialMediaName: "@amirul_vibes", goal: "Just hanging out, happy to buy" },
        // Adults
        { name: "Auntie Lisa", age: 45, trait: "Kind mother, very patient", socialMediaName: "@auntieLisa88", goal: "Loves supporting young entrepreneurs" },
        { name: "Uncle Kumar", age: 52, trait: "Friendly uncle, loves to chat", socialMediaName: "@kumar_uncle", goal: "Impressed by young business owners" },
        { name: "Sarah", age: 25, trait: "Supportive young adult", socialMediaName: "@sarah_loves", goal: "Wants to encourage young sellers" },
        { name: "Abang Azlan", age: 30, trait: "Cool older brother type", socialMediaName: "@azlan_motor", goal: "Treating his little siblings today" },
        // Elderly
        { name: "Pak Cik Razak", age: 68, trait: "Friendly grandpa, tells stories", socialMediaName: "@pakcik_razak", goal: "Loves chatting with young people" },
        { name: "Ah Ma Tan", age: 71, trait: "Sweet grandmother, very warm", socialMediaName: "@ahma_tan", goal: "Wants to buy a gift for grandkids" }
    ],
    // PICKY: "Cerewet" - Fussy, asks MANY questions, hard to please
    picky: [
        // Kids/Peers
        { name: "Aisyah", age: 11, trait: "School prefect, questions everything", socialMediaName: "@aisyah_prefect", goal: "Will ask 10 questions before deciding" },
        { name: "Darren", age: 12, trait: "Annoying know-it-all", socialMediaName: "@darren_smart", goal: "Corrects everything you say, very cerewet" },
        // Teens
        { name: "Marcus", age: 17, trait: "Skeptical, never satisfied", socialMediaName: "@marcus_reviews", goal: "Doubts your answers, asks follow-up questions" },
        { name: "Rina", age: 18, trait: "Complaints about everything", socialMediaName: "@rina_aesthetic", goal: "Nothing is ever good enough for her" },
        { name: "Tyra", age: 19, trait: "Super fussy influencer", socialMediaName: "@tyra_ootd", goal: "Asks about packaging, presentation, taste, EVERYTHING" },
        // Adults
        { name: "Mdm Chen", age: 30, trait: "Asks endless questions", socialMediaName: "@mdm_chen", goal: "Interrogates you about every detail" },
        { name: "Kak Lina", age: 28, trait: "Paranoid about ingredients", socialMediaName: "@kaklina_momtobe", goal: "Asks 5 times if it's halal and safe" },
        { name: "Dr. Ravi", age: 42, trait: "Cross-examines like a lawyer", socialMediaName: "@dr_ravi", goal: "Questions your hygiene practices" },
        { name: "Cik Fauziah", age: 35, trait: "Teacher mode, tests your knowledge", socialMediaName: "@cikgu_fauziah", goal: "Quizzes you about your product" },
        { name: "Chef Ramli", age: 40, trait: "Food critic, complains constantly", socialMediaName: "@chef_ramli", goal: "Finds fault with taste, texture, presentation" },
        // Elderly
        { name: "Tok Wan", age: 72, trait: "Complains about modern things", socialMediaName: "@tokwan1952", goal: "Says 'zaman dulu lagi sedap', very cerewet" },
        { name: "Makcik Ros", age: 65, trait: "Retired chef, ultra critical", socialMediaName: "@makcik_ros", goal: "Criticizes your technique, asks many questions" }
    ],
    // BARGAIN: Focus on DISCOUNTS & NEGOTIATION (percentage-based, works with any price)
    bargain: [
        // Kids/Peers
        { name: "Danial", age: 10, trait: "Low pocket money, wants freebies", socialMediaName: "@danial_games", goal: "Asks for 50% discount or free sample" },
        { name: "Mei Ling", age: 11, trait: "Saves every cent", socialMediaName: "@meiling_saver", goal: "Wants something extra free with purchase" },
        { name: "Adik Bongsu", age: 8, trait: "Crying kid, wants free", socialMediaName: "N/A", goal: "Begs for free item, no money at all" },
        // Teens
        { name: "Farah", age: 16, trait: "Student on tight budget", socialMediaName: "@farah_saver", goal: "Wants minimum 30% off the price" },
        { name: "Zul", age: 15, trait: "Always asks 'ada diskaun?'", socialMediaName: "@zul_bargain", goal: "Never accepts first price, wants 20% off" },
        { name: "Siti", age: 17, trait: "Compares prices on phone", socialMediaName: "@siti_deals", goal: "Claims found cheaper elsewhere, asks to match" },
        { name: "Brian", age: 20, trait: "Broke Gamer", socialMediaName: "@brian_gaming", goal: "Offers half price, take it or leave it" },
        // Young Adults
        { name: "Hafiz", age: 21, trait: "Uni student, wants big portions", socialMediaName: "@hafiz_uni", goal: "Wants double portion for same price" },
        { name: "Kavitha", age: 23, trait: "Fresh grad, counting every ringgit", socialMediaName: "@kavi_budget", goal: "Asks for 25% student discount" },
        // Adults
        { name: "Uncle Lim", age: 48, trait: "Expert haggler, never pays full", socialMediaName: "@unclelim_deals", goal: "Starts negotiation at 40% off" },
        { name: "Pakcik Ali", age: 55, trait: "Market regular, knows all tricks", socialMediaName: "@pakcik_ali", goal: "Wants bulk discount, buy 3 pay for 2" },
        { name: "Kak Sya", age: 35, trait: "Budget Mom feeding 5 kids", socialMediaName: "@sya_family", goal: "Asks for family bundle deal" },
        // Elderly
        { name: "Nenek Aminah", age: 70, trait: "Remembers cheaper old prices", socialMediaName: "@nenek_aminah", goal: "Complains price too high, wants 50% off" }
    ]
};

// ============================================
// Helper: Clean JSON Markdown
// ============================================
function cleanJsonString(text: string): string {
    return text.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
}

// ============================================
// Helper: Safe Bilingual Field
// ============================================
function safeBilingual(field: unknown, fallbackEn: string, fallbackBm: string): BilingualText {
    if (typeof field === 'string') {
        return { en: field, bm: field }
    }
    if (typeof field === 'object' && field !== null) {
        const obj = field as Record<string, unknown>
        return {
            en: typeof obj.en === 'string' ? obj.en : fallbackEn,
            bm: typeof obj.bm === 'string' ? obj.bm : fallbackBm
        }
    }
    return { en: fallbackEn, bm: fallbackBm }
}

// ============================================
// Helper: Safe Bilingual Array Field (for hashtags)
// ============================================
function safeBilingualArray(field: unknown, fallbackEn: string[], fallbackBm: string[]): BilingualArray {
    if (typeof field === 'object' && field !== null) {
        const obj = field as Record<string, unknown>
        const en = Array.isArray(obj.en) ? obj.en.filter((x): x is string => typeof x === 'string') : fallbackEn
        const bm = Array.isArray(obj.bm) ? obj.bm.filter((x): x is string => typeof x === 'string') : fallbackBm
        return { en, bm }
    }
    return { en: fallbackEn, bm: fallbackBm }
}

// ============================================
// Handler
// ============================================

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') return res.status(200).end()
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' })

    try {
        const {
            customerType,
            productType,
            productName,
            productPrice,
            productDesc,
            messages,
            mood,
            language,
            isStart,
            customerInfo: passedCustomerInfo
        } = req.body as SalesBuddyRequest

        console.log('=== Sales Buddy Request ===')
        console.log('Customer Type:', customerType)
        console.log('Product:', productName, productPrice)
        console.log('Language:', language)
        console.log('isStart:', isStart)

        if (!Array.isArray(messages)) {
            return res.status(400).json({ error: 'Messages must be an array' })
        }

        // Logic Variables
        const hasExistingCustomer = !!(passedCustomerInfo && !isStart)
        const targetLanguage = language === 'BM' ? 'Bahasa Melayu' : 'English'

        const finalProductName = productName || productType
        const finalPriceDisplay = productPrice ? `RM${productPrice}` : 'Not specified'
        const finalProductDesc = productDesc || productType

        const userTurns = messages.filter(m => m.sender === 'user').length
        const currentTurn = isStart ? 1 : userTurns + 1
        const MAX_TURNS = 7
        const EXPLORE_END = 3
        const DECIDE_START = 4
        const DECIDE_END = 6

        // Build History
        const conversationHistory = messages
            .map(m => {
                const role = m.sender === 'user' ? 'Penjual (Student)' : 'Pelanggan (Customer)';
                return `${role}: ${m.text}`;
            })
            .join('\n');

        // ==========================================
        // PERSONA SELECTION LOGIC
        // ==========================================
        let selectedCustomerInfo: CustomerInfo;
        let personaInstruction = '';

        if (hasExistingCustomer) {
            // CASE A: Existing Customer (Continue Chat)
            selectedCustomerInfo = passedCustomerInfo!;
            const c = selectedCustomerInfo;

            personaInstruction = language === 'BM'
                ? `[SYSTEM: KEKALKAN WATAK] 
Nama: "${c.name}"
Umur: ${c.age}
Perangai: ${c.trait}
Matlamat: "${c.goal}"`
                : `[SYSTEM: MAINTAIN PERSONA] 
Name: "${c.name}"
Age: ${c.age}
Trait: ${c.trait}
Goal: "${c.goal}"`
        } else {
            // CASE B: New Customer (Cold Start) - PICK FROM PREDEFINED LIST
            const typeKey = (customerType?.toLowerCase() in PREDEFINED_PERSONAS)
                ? customerType.toLowerCase()
                : 'friendly';
            const list = PREDEFINED_PERSONAS[typeKey as keyof typeof PREDEFINED_PERSONAS];

            // Randomly select one
            const randomPersona = list[Math.floor(Math.random() * list.length)];

            selectedCustomerInfo = { ...randomPersona };

            const c = selectedCustomerInfo;
            personaInstruction = language === 'BM'
                ? `[SYSTEM: WATAK BARU DIPILIH]
Sila lakonkan watak ini sepenuhnya:
Nama: "${c.name}"
Umur: ${c.age}
Perangai: ${c.trait}
Matlamat: "${c.goal}"`
                : `[SYSTEM: NEW PERSONA SELECTED]
Act as this character:
Name: "${c.name}"
Age: ${c.age}
Trait: ${c.trait}
Goal: "${c.goal}"`
        }

        const p_persona = `${selectedCustomerInfo.name} (${selectedCustomerInfo.trait})`;
        const p_goal = selectedCustomerInfo.goal || "Browse";
        const customerAge = selectedCustomerInfo.age;

        // ==========================================
        // SYSTEM PROMPT CONSTRUCTION
        // ==========================================
        const systemPrompt = `
${personaInstruction}

You are "AI Sales Buddy", an interactive roleplay simulation for students (ages 7-12).

### 1. CONTEXT & STATE
- **Role:** Customer (Persona: ${p_persona})
- **Customer Age:** ${customerAge} years old
- **Goal & Budget:** ${p_goal}
- **Mood:** ${mood} (0-100)
- **Turn:** ${currentTurn} of ${MAX_TURNS}
- **Language:** ${targetLanguage}

### 2. PRODUCT INFO
- **Item:** ${finalProductName}
- **Price:** ${finalPriceDisplay}
- **Desc:** ${finalProductDesc}

### 3. ADDRESSING RULES (CRITICAL - Based on Age)
**The student seller is 7-12 years old. Address them NATURALLY based on YOUR age:**

- **If you are a CHILD (age ≤12):** Speak as peers/friends. Use "aku/kau", "bro", "weh", "kawan".
- **If you are a TEEN (age 13-19):** Speak as older sibling. Use "dik", "adik". Call yourself "abang/kakak" or just "aku".
- **If you are an ADULT (age 20-55):** Speak as parent/aunt/uncle. Use "dik", "nak", "dear". Call yourself "makcik/pakcik/auntie/uncle".
- **If you are ELDERLY (age 56+):** Speak as grandparent. Use "cu", "nak", "sayang". Call yourself "tok/nenek/atuk".

**CONSISTENCY:** Once you start addressing a certain way, DO NOT switch mid-conversation!

### 4. LANGUAGE & STYLE RULES
- **If Language is 'English':** Speak naturally, casual/spoken style.
- **If Language is 'Bahasa Melayu':**
  - Use **"Bahasa Pasar"** (Colloquial Malay).
  - DO NOT speak formal "Buku Teks" Malay.

### 5. BEHAVIOR (REAL LIFE SIMULATION)
- **Physicality:** Use *actions* in italics (e.g., *picks up item*, *looks skeptical*).
- **Math Verification (IMPORTANT):**
  - **WRONG CALCULATION** = Reject. Example: "5 × RM8 = RM35" is WRONG math (should be RM40).
  - **AGREED DISCOUNT** = ACCEPT! Example: Seller says "OK, RM38 for 5" after negotiation = This is a VALID discount, NOT wrong math. The seller is giving you a deal.
  - **DO NOT confuse discounts with math errors!**
- **Customer Psychology:**
  - Rude -> Mood -20.
  - Weak -> Mood -10.
  - Polite -> Mood +10.

### 6. GAME PACING RULES (STRICT)
- **Turns 1-${EXPLORE_END} (Explore):** Ask questions, negotiate.
- **Turns ${DECIDE_START}-${DECIDE_END} (Decide):**
  - **CRITICAL:** Only reject if the seller's ARITHMETIC is wrong (e.g., 5×8=35).
  - If seller offers a DISCOUNT below the calculated price, that is VALID negotiation - ACCEPT THE DEAL!
  - Decide based on Mood:
    - **Mood > 50:** EASY BUY.
    - **Mood 25-50:** GRUMPY BUY (buy but complain).
    - **Mood < 25:** RAGE QUIT.
- **Turn ${MAX_TURNS} (Closing):**
  - Say Goodbye. Set \`is_finished: true\`.


### 7. OUTPUT JSON ONLY
// *** STRICT ORDER: ALWAYS return options in this EXACT sequence: bad, good, okay. DO NOT shuffle. ***
{
  "thought_process": "String (Internal logic check)",
  "response": "String (Spoken reply by CUSTOMER)",
  "mood_score": Number,
  "options": [
      // *** NOTE: 'text' must be the spoken sentence ONLY. Do NOT add labels like '(Rude)' inside the text. ***
      {"text": "Suggested reply for STUDENT SELLER (Rude/Short)", "type": "bad"},
      {"text": "Suggested reply for STUDENT SELLER (Good/Persuasive)", "type": "good"},
      {"text": "Suggested reply for STUDENT SELLER (Weak/Unsure)", "type": "okay"}
  ],
  "is_finished": Boolean,
  
  // *** CRITICAL: ONLY GENERATE "reflection" IF "is_finished" IS TRUE. ***
  "reflection": {
      "outcome": "success" | "fail",
      "rating": Number (1-5),
      "social_review": { 
          "en": "String (Write a Social Media Post - FB/IG/TikTok style. Use emojis. If happy, hype it up! If angry, complain virally. Use slang matching your persona's age.)", 
          "bm": "String (Tulis status Media Sosial - gaya FB/IG/TikTok. Guna emoji. Jika puas hati, puji melambung! Jika marah, kecam viral. Guna bahasa pasar ikut umur watak.)" 
      },
      "hashtags": { "en": ["#Tag"], "bm": ["#Tag"] },

      // CRITICAL: Feedback must be based on the STUDENT'S OVERALL PERFORMANCE throughout the whole session.
      "good_point": { 
          "en": "String (Specific praise about the student's Pitch, Math, or Politeness)", 
          "bm": "String (Pujian spesifik tentang gaya jualan atau adab murid)" 
      },
      "suggestion": { 
          "en": "String (Specific coaching tip to improve sales skills or math)", 
          "bm": "String (Saranan spesifik untuk baiki teknik jualan atau kira-kira)" 
      }
  }
}
`

        const userPrompt = isStart
            ? (language === 'BM'
                ? `Mula simulasi. Anda watak: ${p_persona}. Berikan ayat pertama (opening line).`
                : `Start simulation. You are: ${p_persona}. Give opening line.`)
            : (language === 'BM'
                ? `Sejarah perbualan:\n${conversationHistory}\n\nPenjual baru cakap. Balas sebagai pelanggan dan bagi 3 pilihan cadangan jawapan untuk PENJUAL.`
                : `Conversation history:\n${conversationHistory}\n\nSeller just spoke. Reply as customer and give 3 suggested response options for the SELLER.`)

        console.log('=== System Prompt ===')
        console.log(systemPrompt.substring(0, 500) + '...')

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }],
                    generationConfig: {
                        responseMimeType: 'application/json',
                        temperature: 0.85
                    }
                }),
            }
        )

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('Gemini API Error:', errorData)

            if (response.status === 429) {
                return res.status(429).json({
                    error: 'rate_limit',
                    message: 'AI is busy. Please try again.',
                    retryAfter: '60s'
                })
            }
            return res.status(500).json({ error: 'ai_error', message: 'AI service error.' })
        }

        const data = await response.json()
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text

        if (!rawText) {
            console.log('Invalid response structure')
            return res.status(500).json({ error: 'Invalid AI response' })
        }

        console.log('Parsed text from Gemini:', rawText.substring(0, 300))

        let result: Record<string, unknown>
        try {
            const cleanedText = cleanJsonString(rawText)
            result = JSON.parse(cleanedText)
        } catch {
            console.error('JSON Parse Failed:', rawText)
            return res.status(500).json({ error: 'AI JSON Error', details: rawText.substring(0, 200) })
        }

        const sanitizedResult: SalesBuddyResponse = {
            thought_process: typeof result.thought_process === 'string' ? result.thought_process : undefined,
            response: typeof result.response === 'string' ? result.response : "...",
            mood_score: typeof result.mood_score === 'number' ? Math.max(0, Math.min(100, result.mood_score)) : mood,
            options: Array.isArray(result.options) ? result.options.slice(0, 3) as ResponseOption[] : [],
            is_finished: Boolean(result.is_finished),
            reflection: result.is_finished && result.reflection ? {
                outcome: (result.reflection as Record<string, unknown>).outcome === 'success' ? 'success' : 'fail',
                rating: typeof (result.reflection as Record<string, unknown>).rating === 'number'
                    ? Math.max(1, Math.min(5, (result.reflection as Record<string, unknown>).rating as number))
                    : 3,
                hashtags: safeBilingualArray((result.reflection as Record<string, unknown>).hashtags, ["#SalesBuddy"], ["#SalesBuddy"]),
                social_review: safeBilingual((result.reflection as Record<string, unknown>).social_review, "No review", "Tiada ulasan"),
                good_point: safeBilingual((result.reflection as Record<string, unknown>).good_point, "Good effort", "Usaha yang bagus"),
                suggestion: safeBilingual((result.reflection as Record<string, unknown>).suggestion, "Keep practicing", "Teruskan latihan")
            } : undefined,
            customerInfo: selectedCustomerInfo // Always return persona for frontend sync
        }

        return res.status(200).json(sanitizedResult)

    } catch (error) {
        console.error('Handler Error:', error)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}
