import { Header } from "./components/Header"
import { AnimatedHero } from "./components/AnimatedHero"
import { ProblemSection, SolutionSection, HowItWorks } from "./components/Sections"
import { WaitlistSection, Footer } from "./components/Waitlist"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AdminDashboard } from "./pages/AdminDashboard"

function LandingPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <AnimatedHero />
      <div className="bg-background">
        <ProblemSection />
        <SolutionSection />
        <HowItWorks />
        <WaitlistSection />
      </div>
      <Footer />
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
