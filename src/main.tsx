import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { WagmiProvider } from 'wagmi'
import { config } from './config/wagmi'

// Create a client
const queryClient = new QueryClient()

// Get the root element
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

// Function to render error state
const renderError = (message: string, details?: string[]) => {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Configuration Error</h1>
          <p className="text-gray-300 mb-4">{message}</p>
          {details && details.length > 0 && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Missing Environment Variables:</h2>
              <ul className="list-disc list-inside text-gray-300">
                {details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-4 text-gray-400">
            Please check your <code className="bg-gray-800 px-2 py-1 rounded">.env</code> file 
            and ensure all required variables are set.
          </p>
        </div>
      </div>
    </React.StrictMode>
  )
}

// Function to render app without wagmi (fallback)
const renderAppWithoutWagmi = () => {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <div className="root-wrapper relative min-h-screen bg-black">
        <QueryClientProvider client={queryClient}>
          <BrowserRouter future={{ v7_startTransition: true }}>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </div>
    </React.StrictMode>
  )
}

try {
  console.log('Initializing app...')
  
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      {/* Root styles wrapper to ensure backgrounds are visible */}
      <div className="root-wrapper relative min-h-screen bg-black">
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter future={{ v7_startTransition: true }}>
              <AuthProvider>
                <App />
              </AuthProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </WagmiProvider>
      </div>
    </React.StrictMode>
  )
  
  console.log('App initialized successfully')
} catch (error) {
  console.error('Failed to initialize app with wagmi:', error)
  console.log('Falling back to app without wagmi...')
  
  // Fallback to app without wagmi
  try {
    renderAppWithoutWagmi()
    console.log('App initialized without wagmi')
  } catch (fallbackError) {
    console.error('Failed to initialize app even without wagmi:', fallbackError)
    if (fallbackError instanceof Error) {
      renderError(fallbackError.message)
    } else {
      renderError('An unexpected error occurred while initializing the application.')
    }
  }
}
