import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import LogoMakerPage from './pages/LogoMakerPage'
import LogoMakerV2Page from './pages/LogoMakerV2Page'
import ProductIdeaPage from './pages/ProductIdeaPage'
import PackagingIdeaPage from './pages/PackagingIdeaPage'
import BoothReadyPage from './pages/BoothReadyPage'
import ProfitCalculatorPage from './pages/ProfitCalculatorPage'
import SalesBuddyPage from './pages/SalesBuddyPage'
import SalesBuddyHistoryPage from './pages/SalesBuddyHistoryPage'
import MiniWebsitePage from './pages/MiniWebsitePage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import CreationsPage from './pages/CreationsPage'
import PublicWebsitePage from './pages/PublicWebsitePage'
import NotFoundPage from './pages/NotFoundPage'
import { RequireAuth } from './components/RequireAuth'

function App() {
  return (
    <Routes>
      {/* SSO Auth callback - handles ticket exchange */}
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      
      {/* Protected routes - shows login required if not authenticated */}
      <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/creations" element={<RequireAuth><CreationsPage /></RequireAuth>} />
      <Route path="/tools/logo-maker" element={<RequireAuth><LogoMakerPage /></RequireAuth>} />
      <Route path="/tools/logo-maker-v2" element={<RequireAuth><LogoMakerV2Page /></RequireAuth>} />
      <Route path="/tools/product-idea" element={<RequireAuth><ProductIdeaPage /></RequireAuth>} />
      <Route path="/tools/packaging-idea" element={<RequireAuth><PackagingIdeaPage /></RequireAuth>} />
      <Route path="/tools/booth-ready" element={<RequireAuth><BoothReadyPage /></RequireAuth>} />
      <Route path="/tools/profit-calculator" element={<RequireAuth><ProfitCalculatorPage /></RequireAuth>} />
      <Route path="/tools/sales-buddy" element={<RequireAuth><SalesBuddyPage /></RequireAuth>} />
      <Route path="/tools/sales-buddy/history" element={<RequireAuth><SalesBuddyHistoryPage /></RequireAuth>} />
      <Route path="/tools/mini-website" element={<RequireAuth><MiniWebsitePage /></RequireAuth>} />
      
      {/* Public Mini Website Route */}
      <Route path="/site/:slug" element={<PublicWebsitePage />} />
      
      {/* Catch-all: show 404 page for unknown routes */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
