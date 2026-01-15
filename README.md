# MyCEO-AI-Tools

(My-CEO) AI Entrepreneurship Suite: An educational platform designed specifically for students (ages 9–13). The platform provides a suite of AI-powered creative and educational tools to gamify the entrepreneurship journey, allowing students to build their business identity and practice sales skills in a safe, guided environment.

## Core Philosophy
- **Safe & Age-Appropriate**: All AI interactions are guard-railed for safety and positivity.
- **Action-Oriented**: Tools focus on tangible outputs (a logo, a sales script, a profit margin).
- **Bilingual**: Fully supports English and Bahasa Melayu (Colloquial/Pasar).

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS v3
- **Routing**: React Router
- **Backend**: Vercel Serverless Functions
- **Database**: Supabase
- **AI**: Replicate API (for logo generation)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in your values in .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with:

```env
# Supabase
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Replicate (for API route)
REPLICATE_API_TOKEN=your-replicate-api-token
```

## Project Structure

```
src/
├── assets/          # Images and icons
├── components/      # Reusable UI components
├── hooks/           # Custom React hooks
│   └── useAuth.ts   # Authentication hook
├── lib/
│   ├── supabase/    # Supabase client & types
│   │   ├── client.ts
│   │   ├── types.ts
│   │   └── index.ts
│   └── utils.ts     # Utility functions
├── pages/           # Route pages
├── types/           # TypeScript types
├── App.tsx          # Router configuration
├── main.tsx         # App entry point
└── index.css        # Global styles

api/                 # Vercel serverless functions
```

## The Tool Suite

| Module | Function |
| :--- | :--- |
| 🎨 **AI Logo Maker** | Generates professional business logos based on student prompts. |
| 💬 **AI Sales Buddy** | Interactive roleplay simulation to practice sales pitching. |
| 💰 **Profit Calculator** | Simple tool to calculate costs, selling price, and margin. |
| 🌐 **Mini Website** | Build a simple online presence for the business. |

## Feature Spotlight

### 💬 AI Sales Buddy
The AI Sales Buddy is a text-based roleplay simulation where students attempt to sell their product to a virtual customer.

- **6-Turn Golden Flow**: Strictly limited to 6 turns (Greeting, Pitch, Handling Objections, Negotiation, Closing, Payment).
- **Dynamic Customer Personas**: Randomly generated personas like "Friendly", "Picky", or "Bargain Hunter".
- **Educational Guardrails**:
    - **Math Verification**: AI rejects incorrect price calculations.
    - **Mood Meter**: Visual indicator of customer satisfaction.
    - **Cultural Context**: Understands Malaysian context (e.g., Makcik, Abang, Boss).
- **Post-Game Feedback**: Receives a "Social Media Review" and specific coaching tips.

### 🎨 AI Logo Maker
Visualise your company brand with AI-generated logos.

- **Plan Tiers**:
    - **Free Plan**: Unlimited conceptual/draft generations.
    - **Premium Plan**: High-quality (Ideogram v3) production HD logos (Max 5 attempts).
- **Workflow**: Enter Company Name/Type/Vibe -> Generate variations -> Select & Lock Final Logo.

### 💰 Profit Calculator
Financial literacy tool to teach margins and pricing.

- **Inputs**: Raw materials, packaging, and other costs.
- **Verdict**: AI advises if the margin is too low (<20%), healthy (20-50%), or too high (>70%).

### 🌐 Mini Website
A section-based web builder that allows students to create a professional splash page for their business.

- **Modular Builder**: Customise sections including:
    - **Hero**: Catchy headlines and banners.
    - **USP**: "Why buy from us?" highlights.
    - **Products**: Simple catalog with images and prices.
    - **Social Proof**: "Chat bubble" style customer reviews.
    - **Scarcity Bar**: Create urgency for carnival sales.
- **AI Marketing Coach**:
    - **Real-time Feedback**: A scoring system (0-100) based on conversion best practices.
    - **Actionable Tips**: Suggests improvements (e.g., "Add more USPs", "Check your pricing").
    - **Gamified Leveling**: Visual rewards and celebrations for high-scoring sites.
- **Instant Publishing**: Provides a live URL with a custom business slug (e.g., `myceo.tools/site/my-cookie-shop`).

## User Roles & Permissions

| Role | Access Rights |
| :--- | :--- |
| **Student** | Creator. Can generate logos, play simulations, and save their results. |
| **Parent** | Viewer. Can view the creations (logos/scores) of their linked children. |
| **Admin/Teacher** | Moderator. Full view of all student activities; can moderate content. |

## Safety & Compliance

- **Privacy First**: No student personal data (PII) is sent to AI models.
- **Content Filtering**: Automatic rejection of inappropriate, violent, or unsafe prompts.
- **Data Retention**: Persistence for selected logos and feedback; draft data is not saved.

## License

MIT
