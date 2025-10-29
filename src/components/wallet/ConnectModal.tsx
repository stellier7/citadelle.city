import { useState } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { useConnect, useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose }) => {
  const {
    // State
    socialWallet,
    socialWalletLoading,
    externalWallet,
    externalWalletLoading,
    isConnected,
    isLoading,
    error,
    
    // Actions
    signInWithGoogle,
    signInWithApple,
    signOutSocial,
    connectMetaMask,
    connectCoinbase,
    connectPhantom,
    disconnectExternal,
    clearError
  } = useWallet();

  // Debug: Get available connectors
  const { connectors } = useConnect();
  const { connector } = useAccount();
  
  const [activeTab, setActiveTab] = useState<'social' | 'wallet'>('social');

  // Check if wallets are installed
  const isMetaMaskInstalled = typeof window !== 'undefined' && window.ethereum?.isMetaMask;
  const isCoinbaseInstalled = typeof window !== 'undefined' && window.ethereum?.isCoinbaseWallet;

  // Debug: Log available connectors
  console.log('Available connectors:', connectors.map(c => ({ id: c.id, name: c.name, ready: c.ready })));

  const handleClose = () => {
    clearError();
    onClose();
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      handleClose();
    } catch (error) {}
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithApple();
      handleClose();
    } catch (error) {
      toast.error('Apple login is not configured or supported.');
    }
  };

  const handleMetaMaskConnect = async () => {
    if (!isMetaMaskInstalled) {
      toast.error('MetaMask is not installed.');
      return;
    }
    
    // Debug: Check if MetaMask connector is available
    const metamaskConnector = connectors.find(c => c.id === 'metaMask');
    console.log('MetaMask connector:', metamaskConnector);
    
    if (!metamaskConnector) {
      toast.error('MetaMask connector not found. Please check wagmi configuration.');
      return;
    }
    
    try {
      await connectMetaMask();
      handleClose();
    } catch (error) {
      toast.error('Failed to connect to MetaMask.');
    }
  };

  const handleCoinbaseConnect = async () => {
    if (!isCoinbaseInstalled) {
      toast.error('Coinbase Wallet is not installed.');
      return;
    }
    
    // Debug: Check if Coinbase connector is available
    const coinbaseConnector = connectors.find(c => c.id === 'coinbaseWallet');
    console.log('Coinbase connector:', coinbaseConnector);
    
    if (!coinbaseConnector) {
      toast.error('Coinbase Wallet connector not found. Please check wagmi configuration.');
      return;
    }
    
    try {
      await connectCoinbase();
      handleClose();
    } catch (error) {
      toast.error('Failed to connect to Coinbase Wallet.');
    }
  };

  const handlePhantomConnect = async () => {
    toast.error('Phantom (Solana) is not supported yet.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-zinc-900 rounded-2xl border border-zinc-700 p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors duration-200 p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex mb-6 bg-zinc-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('social')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'social'
                ? 'bg-[#ff4444] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign in with Email
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'wallet'
                ? 'bg-[#ff4444] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Connect Wallet
          </button>
        </div>

        {/* Social Login Tab */}
        {activeTab === 'social' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-400 mb-4">
              Sign in with Google or Apple
            </p>
            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={socialWalletLoading || isLoading}
              className="w-full px-4 py-3 text-left text-sm text-white hover:bg-zinc-800 rounded-xl transition-colors duration-200 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700 hover:border-zinc-600"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <div className="flex-1">
                <div className="font-medium">Sign in with Google</div>
              </div>
              {socialWalletLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
            </button>
            {/* Apple Sign In */}
            <button
              onClick={handleAppleSignIn}
              disabled={socialWalletLoading || isLoading}
              className="w-full px-4 py-3 text-left text-sm text-white hover:bg-zinc-800 rounded-xl transition-colors duration-200 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700 hover:border-zinc-600"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="flex-1">
                <div className="font-medium">Sign in with Apple</div>
              </div>
              {socialWalletLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
            </button>
          </div>
        )}

        {/* Wallet Connection Tab */}
        {activeTab === 'wallet' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-400 mb-4">
              Connect your existing wallet
            </p>
            {/* MetaMask */}
            <button
              onClick={handleMetaMaskConnect}
              disabled={externalWalletLoading || isLoading}
              className="w-full px-4 py-3 text-left text-sm text-white hover:bg-zinc-800 rounded-xl transition-colors duration-200 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700 hover:border-zinc-600"
            >
              {/* MetaMask Fox Icon */}
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" className="w-6 h-6" alt="MetaMask" />
              <div className="flex-1">
                <div className="font-medium">MetaMask</div>
                <div className="text-xs text-gray-400">
                  {isMetaMaskInstalled ? 'Installed' : 'Not Detected'}
                </div>
              </div>
              {connector?.id === 'metaMask' ? (
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              ) : isMetaMaskInstalled && (
                <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
              )}
            </button>

            {/* Coinbase Wallet */}
            <button
              onClick={handleCoinbaseConnect}
              disabled={externalWalletLoading || isLoading}
              className="w-full px-4 py-3 text-left text-sm text-white hover:bg-zinc-800 rounded-xl transition-colors duration-200 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700 hover:border-zinc-600"
            >
              {/* Coinbase Icon */}
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#0052FF"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M7 7H17V9H9V11H17V13H9V15H17V17H7V7Z" fill="white"/>
              </svg>
              <div className="flex-1">
                <div className="font-medium">Coinbase Wallet</div>
                <div className="text-xs text-gray-400">
                  {isCoinbaseInstalled ? 'Installed' : 'Not Detected'}
                </div>
              </div>
              {connector?.id === 'coinbaseWallet' ? (
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              ) : isCoinbaseInstalled && (
                <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
              )}
            </button>

            {/* Phantom */}
            <button
              onClick={handlePhantomConnect}
              disabled={true}
              className="w-full px-4 py-3 text-left text-sm text-white bg-zinc-800 rounded-xl border border-zinc-700 opacity-50 cursor-not-allowed flex items-center gap-3"
            >
              {/* Phantom Icon */}
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <div className="flex-1">
                <div className="font-medium">Phantom</div>
                <div className="text-xs text-gray-400">Not supported yet</div>
              </div>
            </button>

            {/* Install MetaMask Prompt */}
            {!isMetaMaskInstalled && (
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-400 text-sm mb-2">MetaMask not installed?</p>
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:text-blue-200 text-sm underline"
                >
                  Install MetaMask
                </a>
              </div>
            )}
          </div>
        )}

        {/* Connected Wallets Display */}
        {(socialWallet || externalWallet) && (
          <div className="mt-6 pt-6 border-t border-zinc-700">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Connected Wallets</h3>
            
            {socialWallet && (
              <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg mb-2">
                <div>
                  <p className="text-sm font-medium text-white">Social Wallet</p>
                  <p className="text-xs text-gray-400 font-mono">
                    {`${socialWallet.address.slice(0, 6)}...${socialWallet.address.slice(-4)}`}
                  </p>
                </div>
                <button
                  onClick={signOutSocial}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Disconnect
                </button>
              </div>
            )}
            
            {externalWallet && (
              <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-white">External Wallet</p>
                  <p className="text-xs text-gray-400 font-mono">
                    {`${externalWallet.slice(0, 6)}...${externalWallet.slice(-4)}`}
                  </p>
                </div>
                <button
                  onClick={disconnectExternal}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 