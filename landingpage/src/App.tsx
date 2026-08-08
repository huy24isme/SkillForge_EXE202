import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { CustomPlanPage } from './pages/CustomPlanPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone Landing Page */}
        <Route path="/" element={<LandingPage />} />
        {/* Dedicated Registration & Checkout Page */}
        <Route path="/checkout" element={<CheckoutPage />} />
        {/* Custom Enterprise Plan Consultation Page */}
        <Route path="/custom-plan" element={<CustomPlanPage />} />
        {/* Catch-all redirect to Landing Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
