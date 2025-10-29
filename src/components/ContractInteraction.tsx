import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useRWAContract } from '../hooks/useRWAContract';
import { injected } from 'wagmi/connectors';

export function ContractInteraction() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { 
    owner, 
    balance, 
    isLoading, 
    error,
    submitProperty,
    isWritePending 
  } = useRWAContract();

  if (error) {
    return (
      <div className="text-red-500 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Connection */}
      <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
        <div>
          {isConnected ? (
            <div className="flex flex-col">
              <span className="text-sm text-zinc-400">Connected Wallet</span>
              <span className="font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
          ) : (
            <span>Not connected</span>
          )}
        </div>
        
        <button
          onClick={() => isConnected ? disconnect() : connect({ connector: injected() })}
          className="btn btn-primary"
        >
          {isConnected ? 'Disconnect' : 'Connect Wallet'}
        </button>
      </div>

      {/* Contract Data */}
      {isConnected && (
        <div className="space-y-4 p-4 bg-[#1a1a1a] rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Contract Data</h2>
          
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-zinc-800 rounded w-1/4"></div>
              <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
            </div>
          ) : (
            <>
              <div>
                <span className="text-zinc-400">Contract Owner:</span>
                <div className="font-mono">{owner as string}</div>
              </div>
              
              <div>
                <span className="text-zinc-400">Contract Balance:</span>
                <div className="font-mono">{balance?.toString()} ETH</div>
              </div>
            </>
          )}

          {/* Example Property Submission */}
          <div className="mt-6">
            <button
              onClick={() => {
                submitProperty({
                  name: "Example Property",
                  price: "1000000000000000000", // 1 ETH
                  location: "Example Location"
                });
              }}
              disabled={isWritePending}
              className={`btn btn-primary w-full ${isWritePending ? 'opacity-50' : ''}`}
            >
              {isWritePending ? 'Submitting...' : 'Submit Example Property'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 