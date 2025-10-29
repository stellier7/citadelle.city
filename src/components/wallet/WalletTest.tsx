import { useConnect, useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';

export const WalletTest = () => {
  const { connect, connectors } = useConnect();
  const { address } = useAccount();

  const handleConnect = async (connectorId: string) => {
    try {
      console.log('Attempting to connect with:', connectorId);
      
      const connector = connectors.find(c => c.id === connectorId);
      if (!connector) {
        toast.error(`Connector ${connectorId} not found`);
        return;
      }

      console.log('Found connector:', connector);
      console.log('Connector ready:', connector.ready);

      await connect({ connector });
      toast.success(`Connected with ${connectorId}!`);
    } catch (error: any) {
      console.error('Connection error:', error);
      toast.error(`Failed to connect: ${error.message}`);
    }
  };

  return (
    <div className="p-4 bg-zinc-800 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Wallet Connection Test</h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-400">Available connectors:</p>
        <ul className="text-sm">
          {connectors.map(connector => (
            <li key={connector.id} className="flex items-center gap-2">
              <span>{connector.id}</span>
              <span className={connector.ready ? 'text-green-400' : 'text-red-400'}>
                {connector.ready ? 'Ready' : 'Not Ready'}
              </span>
              <button
                onClick={() => handleConnect(connector.id)}
                className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                Connect
              </button>
            </li>
          ))}
        </ul>
      </div>

      {address && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
          <p className="text-green-400 text-sm">Connected: {address}</p>
        </div>
      )}
    </div>
  );
}; 