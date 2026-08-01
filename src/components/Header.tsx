import { Link } from 'react-router-dom';
import { Login } from './Login';
import { FaPlus, FaChartLine, FaMap, FaUser, FaGear, FaRightFromBracket } from 'react-icons/fa6';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, signOut, isAuthenticated } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsProfileOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getDisplayName = () => {
    if (user) {
      return user.displayName || user.email?.split('@')[0] || 'User';
    }
    return 'Anonymous User';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 border-b border-zinc-800 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#ff4444] to-[#cc0000] rounded-lg flex items-center justify-center shadow-lg shadow-red-500/20">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-white font-bold text-lg">citadel.build</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-zinc-400 hover:text-white transition-colors duration-200 flex items-center gap-2">
              <FaMap className="w-4 h-4" />
              Explore
            </Link>
            <Link to="/developments" className="text-zinc-400 hover:text-white transition-colors duration-200 flex items-center gap-2">
              <FaPlus className="w-4 h-4" />
              Developments
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-zinc-400 hover:text-white transition-colors duration-200 flex items-center gap-2">
                <FaChartLine className="w-4 h-4" />
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <Login />
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-all duration-200 border border-zinc-800"
                >
                  <FaUser className="w-4 h-4 text-[#ff4444]" />
                  <span className="text-sm text-white">{getDisplayName()}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-zinc-900 rounded-lg shadow-xl border border-zinc-800 overflow-hidden z-50">
                    <div className="p-4 border-b border-zinc-800">
                      <p className="text-sm text-zinc-400">Signed in as</p>
                      <p className="text-white font-medium truncate">{user?.email || 'User'}</p>
                    </div>

                    <div className="p-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors duration-200"
                      >
                        <FaGear className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors duration-200"
                      >
                        <FaRightFromBracket className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors duration-200"
            >
              Explore
            </Link>
            <Link
              to="/developments"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors duration-200"
            >
              Developments
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors duration-200"
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
