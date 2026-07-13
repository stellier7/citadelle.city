import { Link } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import { Login } from './Login';
import { FaPlus, FaChartLine, FaMap, FaUser, FaCopy, FaWallet, FaGear, FaRightFromBracket } from 'react-icons/fa6';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export const Header = () => {
  // const { address } = useAccount();
  // const { disconnect } = useDisconnect();
  const address = null; // Temporary fix
  const disconnect = () => {}; // Temporary fix
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { user, walletAddress, metamaskAddress, connectedWalletType, signOut, disconnectMetaMask, disconnectCoinbase, disconnectPhantom, isAuthenticated } = useAuth();

  // Check if user has any wallet connected (either authenticated or any external wallet)
  const hasWallet = isAuthenticated || metamaskAddress;

  const handleSignOut = async () => {
    try {
      await signOut();
      disconnect();
      setIsProfileOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleDisconnectMetaMask = async () => {
    try {
      await disconnectMetaMask();
      setIsProfileOpen(false);
    } catch (error) {
      console.error('MetaMask disconnect error:', error);
    }
  };

  const handleDisconnectCoinbase = async () => {
    try {
      await disconnectCoinbase();
      setIsProfileOpen(false);
    } catch (error) {
      console.error('Coinbase disconnect error:', error);
    }
  };

  const handleDisconnectPhantom = async () => {
    try {
      await disconnectPhantom();
      setIsProfileOpen(false);
    } catch (error) {
      console.error('Phantom disconnect error:', error);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const getDisplayName = () => {
    if (user) {
      return user.displayName || user.email?.split('@')[0] || 'User';
    }
    // For wallet-only users, show the wallet type
    if (connectedWalletType) {
      return `${connectedWalletType} User`;
    }
    return 'Anonymous User';
  };

  const getPrimaryWallet = () => {
    // If connected to an external wallet, show that address
    if (metamaskAddress) {
      return metamaskAddress;
    }
    // If authenticated user has a generated wallet
    if (walletAddress) {
      return walletAddress;
    }
    return 'No wallet connected';
  };

  const getWalletLabel = () => {
    if (connectedWalletType) {
      return connectedWalletType;
    }
    if (walletAddress) {
      return 'Generated Wallet';
    }
    return 'No Wallet';
  };

  const getWalletType = () => {
    if (connectedWalletType) {
      return connectedWalletType;
    }
    if (walletAddress) {
      return 'Generated Wallet';
    }
    return 'No Wallet';
  };

  const getDisconnectButton = () => {
    if (connectedWalletType) {
      return {
        label: `Disconnect ${connectedWalletType}`,
        handler: connectedWalletType === 'MetaMask' ? handleDisconnectMetaMask :
                 connectedWalletType === 'Coinbase' ? handleDisconnectCoinbase :
                 connectedWalletType === 'Phantom' ? handleDisconnectPhantom : null
      };
    }
    return null;
  };

  const handleConnectWallet = () => {
    setIsProfileOpen(false);
    setIsWalletModalOpen(true);
  };

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 h-16">
      {/* Gradient border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff4444]/30 to-transparent" />
      
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Content container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link 
            to="/" 
            className="shrink-0 font-sans text-lg font-light tracking-wider hover:text-[#ff4444] transition-colors duration-200"
          >
            Citadelle.build
          </Link>

          {/* Navigation and Auth */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Navigation buttons - Hide on mobile */}
            <div className="hidden sm:flex items-center gap-2">
                {/* Add Property Button */}
              <Link
                to="/submit"
                  className="group h-9 inline-flex items-center gap-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg transition-all duration-200 text-sm font-medium overflow-hidden"
              >
                  <div className="w-9 h-9 flex items-center justify-center">
                <FaPlus className="w-4 h-4" />
                  </div>
                  <span className="w-0 group-hover:w-auto group-hover:pr-3 transition-all duration-200 whitespace-nowrap opacity-0 group-hover:opacity-100">
                    Add Property
                  </span>
              </Link>

                {/* Dashboard Button */}
              <Link
                to="/dashboard"
                  className="group h-9 inline-flex items-center gap-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg transition-all duration-200 text-sm font-medium overflow-hidden"
              >
                  <div className="w-9 h-9 flex items-center justify-center">
                <FaChartLine className="w-4 h-4" />
                  </div>
                  <span className="w-0 group-hover:w-auto group-hover:pr-3 transition-all duration-200 whitespace-nowrap opacity-0 group-hover:opacity-100">
                    Dashboard
                  </span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="sm:hidden h-9 w-9 inline-flex items-center justify-center bg-zinc-800/50 hover:bg-zinc-800 rounded-lg transition-colors duration-200"
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

            {/* Auth button */}
            <div className="flex items-center">
                {hasWallet ? (
                  <div className="relative">
                    {/* Profile Button */}
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="h-9 w-9 inline-flex items-center justify-center bg-zinc-800/50 hover:bg-zinc-800 rounded-lg transition-colors duration-200 text-sm font-medium"
                    >
                      <FaUser className="w-4 h-4" />
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-zinc-900/95 backdrop-blur-sm rounded-xl border border-zinc-700 shadow-2xl z-50">
                        {/* User Info Section */}
                        <div className="p-4 border-b border-zinc-700">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-[#ff4444]/20 rounded-full flex items-center justify-center">
                              <FaUser className="w-5 h-5 text-[#ff4444]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-medium truncate">{getDisplayName()}</div>
                              <div className="text-sm text-gray-400 truncate">
                                {user?.email || `${connectedWalletType || 'Wallet'} User`}
                              </div>
                            </div>
                          </div>
                          
                          {/* Wallet Address */}
                          <div className="bg-zinc-800/50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-gray-400 mb-1">{getWalletLabel()}</div>
                                <div className="text-sm text-white font-mono truncate">{getPrimaryWallet()}</div>
                              </div>
                              <button
                                onClick={() => copyToClipboard(getPrimaryWallet(), 'Wallet address')}
                                className="ml-2 p-1 text-gray-400 hover:text-white transition-colors duration-200"
                              >
                                <FaCopy className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          <Link
                            to="/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-zinc-800 rounded-lg transition-colors duration-200"
                          >
                            <FaUser className="w-4 h-4" />
                            <span>Profile</span>
                          </Link>
                          
                          {!metamaskAddress && !connectedWalletType && (
                            <button
                              onClick={handleConnectWallet}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-zinc-800 rounded-lg transition-colors duration-200"
                            >
                              <FaWallet className="w-4 h-4" />
                              <span>+ Connect Wallet</span>
                            </button>
                          )}
                          
                          <Link
                            to="/assets"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-zinc-800 rounded-lg transition-colors duration-200"
                          >
                            <FaChartLine className="w-4 h-4" />
                            <span>Assets</span>
                          </Link>
                          
                          <Link
                            to="/settings"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-white hover:bg-zinc-800 rounded-lg transition-colors duration-200"
                          >
                            <FaGear className="w-4 h-4" />
                            <span>Settings</span>
                          </Link>
                          
                          {isAuthenticated && (
                            <button
                              onClick={handleSignOut}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                            >
                              <FaRightFromBracket className="w-4 h-4" />
                              <span>Sign Out</span>
                            </button>
                          )}
                          
                          {connectedWalletType && getDisconnectButton() && (
                            <button
                              onClick={() => getDisconnectButton()?.handler?.()}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                            >
                              <FaRightFromBracket className="w-4 h-4" />
                              <span>{getDisconnectButton()?.label}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Backdrop to close dropdown */}
                    {isProfileOpen && (
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsProfileOpen(false)}
                      />
                    )}
                  </div>
                ) : (
                  <Login />
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation - Animated */}
      <div 
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="relative px-4 pt-2 pb-3 space-y-1 bg-black/80 backdrop-blur-sm">
          <Link
            to="/submit"
            className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-zinc-800/50 transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center gap-2">
              <FaPlus className="w-4 h-4" />
              <span>Add Property</span>
            </div>
          </Link>
          <Link
            to="/dashboard"
            className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-zinc-800/50 transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center gap-2">
              <FaChartLine className="w-4 h-4" />
              <span>Dashboard</span>
            </div>
          </Link>
        </div>
      </div>
    </header>

      {/* Wallet Connection Modal */}
      {isWalletModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsWalletModalOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-zinc-900 rounded-2xl border border-zinc-700 p-6 w-full max-w-md mx-4 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Connect Additional Wallet</h2>
              <button
                onClick={() => setIsWalletModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200 p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                Connect additional wallets to manage multiple assets across different addresses.
              </div>
              
              {/* Placeholder for wallet connection options */}
              <div className="space-y-3">
                <button className="w-full px-4 py-3 text-left text-sm text-white hover:bg-zinc-800 rounded-xl transition-colors duration-200 flex items-center gap-3 border border-zinc-700 hover:border-zinc-600">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.49 1L13.9 8.59l1.41-1.41L21.49 1zM3.51 1L8.69 7.18 7.28 8.59 3.51 1zM1 3.51L7.18 8.69l1.41-1.41L1 3.51zM1 21.49L8.59 13.9l-1.41-1.41L1 21.49zM21.49 23L15.31 16.82l1.41-1.41L21.49 23zM23 21.49L16.82 15.31l1.41-1.41L23 21.49zM23 3.51L16.82 9.69l-1.41-1.41L23 3.51z"/>
                  </svg>
                  <div className="flex-1">
                    <div className="font-medium">MetaMask</div>
                    <div className="text-xs text-gray-400">Connect existing wallet</div>
                  </div>
                </button>
                
                <button className="w-full px-4 py-3 text-left text-sm text-white hover:bg-zinc-800 rounded-xl transition-colors duration-200 flex items-center gap-3 border border-zinc-700 hover:border-zinc-600">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <div className="flex-1">
                    <div className="font-medium">WalletConnect</div>
                    <div className="text-xs text-gray-400">Connect via QR code</div>
                  </div>
                </button>
                
                <button className="w-full px-4 py-3 text-left text-sm text-white hover:bg-zinc-800 rounded-xl transition-colors duration-200 flex items-center gap-3 border border-zinc-700 hover:border-zinc-600">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <div className="flex-1">
                    <div className="font-medium">Coinbase Wallet</div>
                    <div className="text-xs text-gray-400">Connect existing wallet</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 