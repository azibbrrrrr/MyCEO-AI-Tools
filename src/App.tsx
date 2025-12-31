import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import LogoMakerPage from './pages/LogoMakerPage'
import LogoMakerV2Page from './pages/LogoMakerV2Page'
import ProductIdeaPage from './pages/ProductIdeaPage'
import PackagingIdeaPage from './pages/PackagingIdeaPage'
import BoothReadyPage from './pages/BoothReadyPage'
import ProfitCalculatorPage from './pages/ProfitCalculatorPage'
import SalesBuddyPage from './pages/SalesBuddyPage'
import SalesBuddyHistoryPage from './pages/SalesBuddyHistoryPage'
import DevLoginPage from './pages/DevLoginPage'
import CreationsPage from './pages/CreationsPage'
import { DevModeBanner } from './components/dev-mode-banner'
import { RequireAuth } from './components/RequireAuth'

function App() {
  return (
    <>
      <DevModeBanner />
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<DevLoginPage />} />
        
        {/* Protected routes - redirect to /login if not authenticated */}
        <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/creations" element={<RequireAuth><CreationsPage /></RequireAuth>} />
        <Route path="/tools/logo-maker" element={<RequireAuth><LogoMakerPage /></RequireAuth>} />
        <Route path="/tools/logo-maker-v2" element={<RequireAuth><LogoMakerV2Page /></RequireAuth>} />
        <Route path="/tools/product-idea" element={<RequireAuth><ProductIdeaPage /></RequireAuth>} />
        <Route path="/tools/packaging-idea" element={<RequireAuth><PackagingIdeaPage /></RequireAuth>} />
        <Route path="/tools/booth-ready" element={<RequireAuth><BoothReadyPage /></RequireAuth>} />
        <Route path="/tools/profit-calculator" element={<RequireAuth><ProfitCalculatorPage /></RequireAuth>} />
        <Route path="/tools/sales-buddy" element={<RequireAuth><SalesBuddyPage /></RequireAuth>} />
        <Route path="/tools/sales-buddy/history" element={<RequireAuth><SalesBuddyHistoryPage /></RequireAuth>} />
        
        {/* Catch-all: redirect unknown routes to dashboard (which will redirect to login if needed) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App


