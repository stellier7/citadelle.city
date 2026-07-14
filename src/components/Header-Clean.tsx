import { Link } from 'react-router-dom';
import { useState } from 'react';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 h-16">
      {/* Gradient border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
      
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Content container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link 
            to="/" 
            className="shrink-0 font-sans text-lg font-light tracking-wider text-white hover:text-[#d4af37] transition-colors duration-200"
          >
            Citadel.build
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Navigation buttons - Hide on mobile */}
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/developments"
                className="group h-9 inline-flex items-center gap-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg transition-all duration-200 text-sm font-medium overflow-hidden px-4 text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Developments</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="sm:hidden h-9 w-9 inline-flex items-center justify-center bg-zinc-800/50 hover:bg-zinc-800 rounded-lg transition-colors duration-200 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg 
                className="w-5 h-5 transition-transform duration-200" 
                style={{ transform: isMobileMenuOpen ? 'rotate(90deg)' : 'none' }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div 
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="relative px-4 pt-2 pb-3 space-y-1 bg-black/80 backdrop-blur-sm">
          <Link
            to="/developments"
            className="block px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-zinc-800/50 transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Developments</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
    </>
  );
};
