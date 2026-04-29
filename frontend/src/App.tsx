import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import MarqueeBar from './components/MarqueeBar'
import Hero from './components/Hero'
import LiveCounter from './components/LiveCounter'
import Journey from './components/Journey'
import UGCChallenge from './components/UGCChallenge'
import Marathon from './components/Marathon'
import TradeIn from './components/TradeIn'
import WhyBabe from './components/WhyBabe'
import FAQ from './components/FAQ'
import FooterCTA from './components/FooterCTA'
import RouteMapModal from './components/RouteMapModal'
import SuccessModal from './components/SuccessModal'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import PolicyPage from './pages/PolicyPage'
import TermsPage from './pages/TermsPage'
import AdminPage from './pages/AdminPage'
import { usePageTracking } from './hooks/usePageTracking'

function HomePage() {
  const [routeModalOpen, setRouteModalOpen] = useState(false)
  const [successModal, setSuccessModal] = useState({ open: false, title: '', message: '' })

  return (
    <>
      <Navbar />
      <MarqueeBar />
      <Hero />
      <LiveCounter />
      <Journey />
      <UGCChallenge />
      <Marathon />
      <TradeIn />
      <WhyBabe />
      <FAQ />
      <FooterCTA />
      <RouteMapModal open={routeModalOpen} onClose={() => setRouteModalOpen(false)} />
      <SuccessModal
        open={successModal.open}
        title={successModal.title}
        message={successModal.message}
        onClose={() => setSuccessModal({ open: false, title: '', message: '' })}
      />
    </>
  )
}

function TrackedRoutes() {
  usePageTracking()
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/policy" element={<PolicyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}

export default function App() {
  return <TrackedRoutes />
}
