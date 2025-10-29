import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export const Login = () => {
  const { 
    signIn, 
    loading,
    connectMetaMask,
    connectCoinbase,
    connectPhantom
  } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsModalOpen(false);
    await signIn();
  };

  const handleAppleSignIn = async () => {
    // TODO: Implement Apple sign-in
    console.log('Apple sign-in not implemented yet');
    setIsModalOpen(false);
  };
  
  const handleMetaMaskConnect = async () => {
    setIsModalOpen(false);
    await connectMetaMask();
  };

  const handleCoinbaseConnect = async () => {
    setIsModalOpen(false);
    await connectCoinbase();
  };

  const handlePhantomConnect = async () => {
    setIsModalOpen(false);
    await connectPhantom();
  };

  // Check if wallets are installed
  const isMetaMaskInstalled = typeof window !== 'undefined' && window.ethereum?.isMetaMask;
  const isCoinbaseInstalled = typeof window !== 'undefined' && (window.ethereum?.isCoinbaseWallet || window.ethereum?.providers?.some((provider: any) => provider.isCoinbaseWallet));
  const isPhantomInstalled = typeof window !== 'undefined' && window.ethereum?.isPhantom;

  return (
    <>
      {/* Main Connect Wallet Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={loading}
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-[#ff4444] hover:bg-[#ff6666] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff4444] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {loading ? 'Connecting...' : 'Connect Wallet'}
      </button>

      {/* Wallet Connection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-zinc-900 rounded-2xl border border-zinc-700 p-6 w-full max-w-md mx-4 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200 p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Create New Wallet Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Create New Wallet</h3>
              <div className="space-y-2">
                {/* Google Sign In */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full px-4 py-3 text-left text-sm text-white hover:bg-zinc-800 rounded-xl transition-colors duration-200 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700 hover:border-zinc-600"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <div>
                    <div className="font-medium">Sign in with Google</div>
                    <div className="text-xs text-gray-400">Create a new wallet</div>
                  </div>
                </button>

                {/* Apple Sign In */}
                <button
                  onClick={handleAppleSignIn}
                  disabled={loading}
                  className="w-full px-4 py-3 text-left text-sm text-white hover:bg-zinc-800 rounded-xl transition-colors duration-200 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700 hover:border-zinc-600"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div>
                    <div className="font-medium">Sign in with Apple</div>
                    <div className="text-xs text-gray-400">Create a new wallet</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-700 mb-6"></div>

            {/* Connect Existing Wallet Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Connect Existing Wallet</h3>
              <div className="space-y-2">
                {/* MetaMask */}
                <button
                  onClick={handleMetaMaskConnect}
                  disabled={loading}
                  className="w-full px-4 py-3 text-left text-sm text-white hover:bg-zinc-800 rounded-xl transition-colors duration-200 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700 hover:border-zinc-600"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" className="w-6 h-6" alt="MetaMask" />
                  <div className="flex-1">
                    <div className="font-medium">MetaMask</div>
                    <div className="text-xs text-gray-400">
                      {isMetaMaskInstalled ? 'Installed' : 'Not installed'}
                    </div>
                  </div>
                  {isMetaMaskInstalled && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </button>

                {/* Coinbase Wallet */}
                <button
                  onClick={handleCoinbaseConnect}
                  disabled={loading}
                  className="w-full px-4 py-3 text-left text-sm text-white hover:bg-zinc-800 rounded-xl transition-colors duration-200 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700 hover:border-zinc-600"
                >
                  <img src="/images/coinbase.svg" className="w-6 h-6 rounded-lg" alt="Coinbase Wallet" />
                  <div className="flex-1">
                    <div className="font-medium">Coinbase Wallet</div>
                    <div className="text-xs text-gray-400">
                      {isCoinbaseInstalled ? 'Installed' : 'Not installed'}
                    </div>
                  </div>
                  {isCoinbaseInstalled && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </button>

                {/* Phantom Wallet */}
                <button
                  onClick={handlePhantomConnect}
                  disabled={loading}
                  className="w-full px-4 py-3 text-left text-sm text-white hover:bg-zinc-800 rounded-xl transition-colors duration-200 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700 hover:border-zinc-600"
                >
                  <img src="/images/phantom.svg" className="w-6 h-6 rounded-lg" alt="Phantom" />
                  <div className="flex-1">
                    <div className="font-medium">Phantom</div>
                    <div className="text-xs text-gray-400">
                      {isPhantomInstalled ? 'Installed' : 'Not installed'}
                    </div>
                  </div>
                  {isPhantomInstalled && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};