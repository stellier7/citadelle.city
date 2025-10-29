import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { walletConnect, coinbaseWallet, injected } from 'wagmi/connectors';

// Create wagmi config
export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
  connectors: [
    injected({
      target: 'metaMask',
    }),
    injected({
      target: 'coinbaseWallet',
    }),
    coinbaseWallet({
      appName: 'Citadelle City',
    }),
    walletConnect({
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '',
    }),
  ],
  ssr: false,
}); 