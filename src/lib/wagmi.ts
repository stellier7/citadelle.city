import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'viem/chains';
import { injected } from 'wagmi/connectors';

// Configure wagmi
export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
}); 