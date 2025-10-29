import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { FaEthereum, FaWallet } from 'react-icons/fa';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  className?: string;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ 
  onConnect,
  className = ''
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, walletAddress, metamaskAddress, connectMetaMask } = useAuth();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  // Handle network switching
  const handleNetworkSwitch = async () => {
    try {
      if (chainId !== baseSepolia.id) {
        await switchChain({ chainId: baseSepolia.id });
        toast.success('Successfully switched to Base Sepolia');
      }
    } catch (error: any) {
      console.error('Network switch error:', error);
      toast.error('Failed to switch network');
    }
  };

  // Handle MetaMask connection
  const handleMetaMaskConnect = async () => {
    if (!user) {
      toast.error('Please sign in first');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);
      await connectMetaMask();
      onConnect?.(metamaskAddress!);
    } catch (error: any) {
      console.error('MetaMask connection error:', error);
      setError(error.message || 'Failed to connect MetaMask');
    } finally {
      setIsConnecting(false);
    }
  };

  // Check network on mount and when chain changes
  useEffect(() => {
    if (metamaskAddress && chainId !== baseSepolia.id) {
      handleNetworkSwitch();
    }
  }, [chainId, metamaskAddress]);

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Display RWA Wallet Address */}
      {walletAddress && (
        <div className="flex items-center gap-2 bg-[#222] rounded-lg px-4 py-2 border border-zinc-800">
          <FaWallet className="text-[#ff4444]" />
          <div className="flex flex-col">
            <span className="text-xs text-zinc-400">RWA Wallet</span>
            <span className="text-sm font-mono">
              {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
            </span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-sm bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
          {error}
        </div>
      )}
      
      {/* MetaMask Connection */}
      {!metamaskAddress ? (
        <button
          onClick={handleMetaMaskConnect}
          disabled={isConnecting || !user}
          className={`
            btn btn-primary flex items-center gap-2 min-w-[200px] justify-center
            ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}
            ${!user ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isConnecting ? (
            <>
              <span className="animate-spin">⚡</span>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <FaEthereum className="w-4 h-4" />
              <span>Connect MetaMask</span>
            </>
          )}
        </button>
      ) : (
        <div className="flex items-center gap-2 bg-[#222] rounded-lg px-4 py-2 border border-zinc-800">
          <FaEthereum className="text-[#ff4444]" />
          <div className="flex flex-col">
            <span className="text-xs text-zinc-400">MetaMask</span>
            <span className="text-sm font-mono">
              {`${metamaskAddress.slice(0, 6)}...${metamaskAddress.slice(-4)}`}
            </span>
          </div>
          {chainId !== baseSepolia.id && (
            <button
              onClick={handleNetworkSwitch}
              className="ml-2 text-xs text-[#ff4444] hover:text-[#ff6666]"
            >
              Switch Network
            </button>
          )}
        </div>
      )}
    </div>
  );
}; 