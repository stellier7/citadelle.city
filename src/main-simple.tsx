import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// ULTRA SIMPLE TEST - Just show text
const rootElement = document.getElementById('root')
if (!rootElement) {
  document.body.innerHTML = '<div style="color: white; font-size: 48px; padding: 50px;">ROOT ELEMENT NOT FOUND!</div>'
} else {
  ReactDOM.createRoot(rootElement).render(
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom, #1a1a1a, #000)',
      color: 'white',
      padding: '50px',
      fontFamily: 'Arial'
    }}>
      <h1 style={{ fontSize: '48px', color: '#d4af37', marginBottom: '20px' }}>
        ✅ REACT IS WORKING!
      </h1>
      <p style={{ fontSize: '24px', marginBottom: '20px' }}>
        This is the SIMPLE version of Citadel.build
      </p>
      <p style={{ fontSize: '18px', color: '#888' }}>
        If you see this, React is loading correctly.
      </p>
      <div style={{
        marginTop: '40px',
        padding: '30px',
        background: '#d4af37',
        color: 'black',
        borderRadius: '10px',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        🎉 SUCCESS - The deployment works!
      </div>
    </div>
  )
}
