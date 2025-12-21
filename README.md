# MyCEO-AI-Tools

An educational entrepreneurship platform for students aged 9–13 to prepare for real-world selling activities. Students explore product ideas, packaging concepts, branding, booth setup, and basic profit calculation through guided, AI-assisted tools designed for school programmes and student carnivals.

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

## Available Tools

- 🎨 **Logo Maker** - Create AI-generated logos
- 🏪 **Booth Ready** - Design your booth setup
- 💰 **Profit Calculator** - Calculate costs and profits
- 💡 **Product Idea** *(Coming Soon)*
- 📦 **Packaging Idea** *(Coming Soon)*

## License

MIT
