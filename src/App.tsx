import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import LogoMakerPage from './pages/LogoMakerPage'
import ProductIdeaPage from './pages/ProductIdeaPage'
import PackagingIdeaPage from './pages/PackagingIdeaPage'
import BoothReadyPage from './pages/BoothReadyPage'
import ProfitCalculatorPage from './pages/ProfitCalculatorPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tools/logo-maker" element={<LogoMakerPage />} />
      <Route path="/tools/product-idea" element={<ProductIdeaPage />} />
      <Route path="/tools/packaging-idea" element={<PackagingIdeaPage />} />
      <Route path="/tools/booth-ready" element={<BoothReadyPage />} />
      <Route path="/tools/profit-calculator" element={<ProfitCalculatorPage />} />
    </Routes>
  )
}

export default App
