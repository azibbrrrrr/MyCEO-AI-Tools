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
    socialMediaName: string  // e.g., @makcik_kiah88
    goal?: string            // e.g., "I need a cheap gift under RM20"
}

interface SalesBuddyRequest {
    customerType: string
    productType: string
    productName?: string
    productPrice?: string
    productDesc?: string
    customerInfo?: CustomerInfo  // Passed from frontend after first call
    messages: ChatMessage[]
    mood: number
    language: 'EN' | 'BM'
    isStart?: boolean
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

interface SalesBuddyResponse {
    thought_process?: string
    response: string
    mood_score: number
    options: ResponseOption[]
    is_finished: boolean
    reflection?: Reflection
    customerInfo?: CustomerInfo  // Returned on first call for frontend to store
    game_state?: any // Legacy support if needed, but we ignore it now
}

// ============================================
// Handler
// ============================================

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY not configured' })
    }

    try {
        const { customerType, productType, messages, mood, language, isStart } = req.body as SalesBuddyRequest

        // Debug: Print incoming request
        console.log('=== Sales Buddy Request ===')
        console.log('Customer Type:', customerType)
        console.log('Product:', productType, req.body.productName, req.body.productPrice)
        console.log('Language:', language)
        console.log('Mood:', mood)
        console.log('isStart:', isStart)
        console.log('Messages:', JSON.stringify(messages, null, 2))

        // Build conversation history
        const conversationHistory = messages
            .map(m => `${m.sender === 'user' ? 'Penjual' : 'Pelanggan'}: ${m.text}`)
            .join('\n')

        // Get customer info - use passed info or let AI generate on first call
        const { customerInfo: passedCustomerInfo } = req.body as SalesBuddyRequest

        // If we have passed customer info from previous turns, use it
        // Otherwise, this is the first call and AI will generate a persona
        const hasExistingCustomer = passedCustomerInfo && !isStart

        // Build product description
        const { productName, productPrice, productDesc } = req.body as SalesBuddyRequest
        // Note: productDesc is passed explicitly now, or fallback to type

        // Calculate turn count (each user message = 1 turn)
        const turnCount = messages.filter(m => m.sender === 'user').length

        // Determine Persona Instruction
        let personaInstruction = ''

        if (hasExistingCustomer) {
            // Case 1: Continuing conversation - use existing persona
            const c = passedCustomerInfo!
            personaInstruction = language === 'BM'
                ? `Kamu adalah "${c.name}", umur ${c.age}. Perangai: ${c.trait}. Nama sosial media: ${c.socialMediaName}. Guna Bahasa Melayu santai/pasar.`
                : `You are "${c.name}", age ${c.age}. Personality: ${c.trait}. Social media: ${c.socialMediaName}. Speak casual English.`
        } else {
            // Case 2: Start - AI generates random persona based on customerType

            // Define demographics by customer type
            const demographicsByCustomerType = {
                friendly: {
                    bm: `
- Rakan Sebaya / Kawan Sekolah (9-12 tahun) - support member, cakap "bro/weh"
- Remaja (15-18 tahun) - friendly, support member
- Dewasa muda (22-30 tahun) - peramah, suka benda comel
- Ibu bapa (42-52 tahun) - supportive, beli untuk anak
- Warga emas (68-75 tahun) - penyayang, suka berbual`,
                    en: `
- Schoolmate / Peer (9-12 yrs) - casual, supportive friend
- Teens (15-18 yrs) - friendly, supportive
- Young adults (22-30 yrs) - friendly, loves cute things
- Parents (42-52 yrs) - supportive, buying for kids
- Elderly (68-75 yrs) - kind, loves to chat`
                },
                picky: {
                    bm: `
- Pengawas Sekolah / Rakan Sebaya (10-12 tahun) - cerewet, bajet bagus
- Remaja (16-19 tahun) - skeptikal, bandingkan harga
- Dewasa muda (25-35 tahun) - perfectionist, banyak tanya
- Wanita mengandung (28-32 tahun) - cerewet pasal bahan
- Warga emas (70-75 tahun) - teliti, pengalaman luas`,
                    en: `
- School Prefect / Peer (10-12 yrs) - picky, acts authoritative
- Teens (16-19 yrs) - skeptical, compares prices
- Young adults (25-35 yrs) - perfectionist, asks many questions
- Pregnant women (28-32 yrs) - picky about ingredients
- Elderly (70-75 yrs) - meticulous, experienced`
                },
                bargain: {
                    bm: `
- Kawan Sekolah (9-11 tahun) - duit belanja sikit, minta "belanja la"
- Remaja (15-18 tahun) - bajet ciput, nak diskaun
- Pelajar U (19-23 tahun) - nak murah & banyak
- Ibu bapa (40-50 tahun) - kaki tawar menawar
- Warga emas (65-75 tahun) - ingat harga lama (murah)`,
                    en: `
- Schoolmate (9-11 yrs) - low pocket money, asks for free treats
- Teens (15-18 yrs) - low budget, wants discount
- Uni Students (19-23 yrs) - wants cheap & big portion
- Parents (40-50 yrs) - expert haggler
- Elderly (65-75 yrs) - remembers old cheap prices`
                }
            }

            const typeKey = customerType as keyof typeof demographicsByCustomerType || 'friendly'
            const selectedDemographics = demographicsByCustomerType[typeKey]
            const demographicList = language === 'BM' ? selectedDemographics.bm : selectedDemographics.en

            personaInstruction = `FIRST TASK: Randomly pick ONE persona from this list (Customer Type: ${customerType.toUpperCase()}):
${demographicList}

Generate character details: 
1. Name
2. Age
3. Trait
4. Social Media Name (e.g., @auntie_may)
5. Goal & Budget (e.g., "Need a gift under RM20", "Just browsing with RM5")

You MUST include these details in the "customer_info" field in the JSON output.`
        }
        // Define Dynamic Variables for Prompt
        const p_persona = hasExistingCustomer
            ? `${passedCustomerInfo?.name} (${passedCustomerInfo?.trait})`
            : "{Generated by AI}"

        const p_goal = hasExistingCustomer ? passedCustomerInfo?.goal : "{Generated by AI}"
        const p_turn = `${turnCount + 1}`

        // Game Logic Variables
        const MAX_TURNS = 7
        const EXPLORE_END = 3
        const DECIDE_START = 4
        const DECIDE_END = 5
        // const PAYMENT_TURN = 6 // Not explicitly used in new prompt but good reference

        const targetLanguage = language === 'BM' ? 'Bahasa Melayu' : 'English'

        const systemPrompt = `
${personaInstruction}

You are "AI Sales Buddy", an interactive roleplay simulation for students (ages 9-13).

### 1. CONTEXT & STATE
- **Role:** Customer (Persona: ${p_persona}) **IMPORTANT: This is your character.**
- **Seller:** A student (kid ages 9-13) trying to sell you a product.
- **Environment:** A busy school entrepreneurship fair. There is noise and other distractions.
- **Goal & Budget:** ${p_goal}
- **Mood:** ${mood} (0-100)
- **Turn:** ${p_turn} of ${MAX_TURNS}
- **Language:** ${targetLanguage}

### 2. PRODUCT INFO
- **Item:** ${productName || productType}
- **Price:** ${productPrice ? `RM${productPrice}` : 'Not specified'}
- **Desc:** ${productDesc || productType}

### 3. LANGUAGE & STYLE RULES (CRITICAL)
- **If Language is 'English':** Speak naturally, casual/spoken style.
- **If Language is 'Bahasa Melayu':**
  - Use **"Bahasa Pasar"** (Colloquial Malay).
  - Use words like: "takpe", "jap", "dik", "makcik", "kaler", "murah la sikit".
  - DO NOT speak formal "Buku Teks" Malay.
  - Sound like a real Malaysian local.

### 4. BEHAVIOR (REAL LIFE SIMULATION)
- **Physicality:** Speak as if standing there. Use *actions* in italics (e.g., *picks up item*, *looks confused*).
- **Math Guardrails:** ALWAYS verify the User's math (Quantity x Price) against the history.
  - If math is WRONG (e.g., Price is RM5 but User asks RM50) -> You MUST Reject & Scold.
- **Customer Psychology:**
  - If seller is too short/rude -> Mood DOWN (-20).
  - If seller is weak/unsure -> Mood DOWN/NEUTRAL (-10).
  - If seller is polite, confident & helpful -> Mood UP (+10).
  - You can REJECT the sale if the pitch is bad or math is wrong.

### 5. GAME PACING RULES (STRICT)
- **Turns 1-${EXPLORE_END} (Explore):** Ask questions, negotiate.
- **Turns ${DECIDE_START}-${DECIDE_END} (Decide):**
  - **CRITICAL:** If Math is WRONG -> **REJECT** immediately.
  - If Math is CORRECT -> Decide based on Mood & Urgency (The "Sweet Spot"):
    - **Mood > 50 (Happy):** EASY BUY. (Cheerful, maybe tips or compliments).
    - **Mood 25-50 (Reluctant):** GRUMPY BUY. (Complain about price/service, but still buy because you need/want it).
    - **Mood < 25 (Angry):** RAGE QUIT. (Walk away, say it's not worth it).
- **Turn ${MAX_TURNS} (Closing):**
  - Say Goodbye. Set \`is_finished: true\`.

### 6. TASK
1. **THINK:** Check Turn Count, Math accuracy, and Goal/Budget constraints.
2. **RESPOND:** Generate the JSON output below.
3. **COACHING:** Generate 3 specific sentences the **STUDENT SELLER** could say next.

### 7. OUTPUT JSON ONLY
{
  "thought_process": "String (Internal logic check: Math, Budget, Turn)",
  "response": "String (Your spoken response, can include *actions*)",
  "mood_score": Number (0-100),
  // *** STRICT ORDER: ALWAYS return options in this EXACT sequence: bad, good, okay. DO NOT shuffle. ***
  "options": [
      {"text": "Suggested reply for the STUDENT to speak (Rude/Short)", "type": "bad"},
      {"text": "Suggested reply for the STUDENT to speak (Good/Persuasive)", "type": "good"},
      {"text": "Suggested reply for the STUDENT to speak (Weak/Unsure)", "type": "okay"}
  ],
  "is_finished": Boolean (true if sale concluded or customer left),
  
  // *** CRITICAL: ONLY GENERATE "reflection" IF "is_finished" IS TRUE. ***
  // If game is NOT finished, OMIT this field or set to null.
  "reflection": {
      "outcome": "success" | "fail",
      "rating": Number (1-5 stars),
      "social_review": {
          "en": "String (Review in English)",
          "bm": "String (Review in Bahasa Melayu)"
      },
      "hashtags": {
          "en": ["#Tag1", "#Tag2"],
          "bm": ["#Tag1", "#Tag2"]
      },
      // CRITICAL: Feedback must be based on the STUDENT'S ACTUAL PERFORMANCE in this chat.
      "good_point": { 
          "en": "String (Specific praise about the student's Pitch, Math, or Politeness. e.g., 'Great job using polite words!')", 
          "bm": "String (Pujian spesifik tentang gaya jualan atau adab murid. cth: 'Bagus sebab pandai kira baki!')" 
      },
      "suggestion": { 
          "en": "String (Specific coaching tip to improve sales skills or math. e.g., 'Try to upsell next time.')", 
          "bm": "String (Saranan spesifik untuk baiki teknik jualan atau kira-kira. cth: 'Cuba senyum dan sapa pelanggan dulu.')" 
      }
  },
  "customer_info": {
      "name": "String",
      "age": Number,
      "trait": "String",
      "socialMediaName": "String",
      "goal": "String"
  } (Only on first turn)
}
`

        const userPrompt = isStart
            ? (language === 'BM'
                ? `Mula simulasi. Kamu baru sampai kat gerai ${productType}. Mood awal: 50. GENERATE watak pelanggan dahulu (ikut arahan di atas) kemudian bagi opening line.`
                : `Start simulation. You just arrived at a ${productType} booth. Initial mood: 50. GENERATE customer persona first (follow instructions above) then give opening line.`)
            : (language === 'BM'
                ? `Sejarah perbualan:\n${conversationHistory}\n\nPenjual baru cakap. Balas sebagai pelanggan (ikut watak yang dah ditetapkan) dan bagi 3 pilihan untuk penjual.`
                : `Conversation history:\n${conversationHistory}\n\nSeller just spoke. Reply as customer (follow established persona) and give 3 options for seller.`)

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }],
                    generationConfig: {
                        responseMimeType: 'application/json',
                        temperature: 0.8
                    }
                }),
            }
        )

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('Gemini API error:', JSON.stringify(errorData, null, 2))

            // Check for rate limit / quota exceeded
            if (response.status === 429 || errorData.error?.status === 'RESOURCE_EXHAUSTED') {
                const retryInfo = errorData.error?.details?.find((d: Record<string, unknown>) => d['@type']?.toString().includes('RetryInfo'))
                const retryDelay = retryInfo?.retryDelay || '60s'
                return res.status(429).json({
                    error: 'rate_limit',
                    message: 'AI is busy. Please try again in a moment.',
                    retryAfter: retryDelay
                })
            }

            return res.status(500).json({ error: 'ai_error', message: 'AI service error. Please try again.' })
        }

        const data = await response.json()

        // Debug: Print raw response
        // console.log('Gemini raw response:', JSON.stringify(data, null, 2))

        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
            console.log('Invalid response structure - no text found')
            return res.status(500).json({ error: 'Invalid AI response' })
        }

        const rawText = data.candidates[0].content.parts[0].text
        console.log('Parsed text from Gemini:', rawText)

        const result = JSON.parse(rawText)

        // Extract customer info from AI response or use valid existing one
        const aiGeneratedCustomer = result.customer_info ? {
            name: result.customer_info.name,
            age: result.customer_info.age,
            trait: result.customer_info.trait,
            socialMediaName: result.customer_info.socialMediaName,
            goal: result.customer_info.goal
        } : undefined

        const finalCustomerInfo = hasExistingCustomer ? passedCustomerInfo : aiGeneratedCustomer

        // Validate and sanitize response
        const sanitizedResult: SalesBuddyResponse = {
            thought_process: result.thought_process,
            response: result.response || "...",
            mood_score: typeof result.mood_score === 'number' ? Math.max(0, Math.min(100, result.mood_score)) : mood,
            options: Array.isArray(result.options) ? result.options.slice(0, 3) : [],
            is_finished: Boolean(result.is_finished),
            reflection: result.is_finished && result.reflection ? {
                outcome: result.reflection.outcome || 'fail',
                rating: typeof result.reflection.rating === 'number' ? Math.max(1, Math.min(5, result.reflection.rating)) : 3,
                social_review: result.reflection.social_review || { en: "No review", bm: "Tiada ulasan" },
                hashtags: result.reflection.hashtags || { en: ["#SalesBuddy"], bm: ["#SalesBuddy"] },
                good_point: result.reflection.good_point || { en: "Good effort!", bm: "Usaha bagus!" },
                suggestion: result.reflection.suggestion || { en: "Keep practicing!", bm: "Teruskan usaha!" }
            } : undefined,
            customerInfo: finalCustomerInfo  // Return customer info for frontend to store
        }

        return res.status(200).json(sanitizedResult)

    } catch (error) {
        console.error('Sales Buddy Error:', error)
        return res.status(500).json({ error: 'Failed to generate response' })
    }
}
