import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

// ONLY the new components we built today - using clean header
import { Header } from './components/Header-Clean'
import { DevelopmentHero } from './components/DevelopmentHero'
import { HowItWorks } from './components/HowItWorks'
import { Developments } from './components/Developments'
import { DevelopmentDetail } from './components/DevelopmentDetail'
import { ErrorBoundary } from './components/ErrorBoundary'

// Simple Home page with just the new stuff
const HomePage = () => (
  <>
    <DevelopmentHero />
    <HowItWorks />
  </>
)

// Clean App component - NO WAGMI, NO AUTH BULLSHIT
function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/developments" element={<Developments />} />
            <Route path="/developments/:projectId" element={<DevelopmentDetail />} />
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  )
}

// Mount the app
const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
