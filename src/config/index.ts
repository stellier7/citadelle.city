import { sepolia } from 'viem/chains';
import { http, createConfig, createStorage } from 'wagmi';
import { metaMask, coinbaseWallet, injected } from 'wagmi/connectors';

// Validate required environment variables
const requiredEnvVars = [
  'VITE_RWA_DEPLOYED_CONTRACT_ADDRESS',
  'VITE_REVENUE_CONTRACT_ADDRESS',
  'VITE_WALLETCONNECT_PROJECT_ID',
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID'
] as const;

const missingEnvVars = requiredEnvVars.filter(
  key => !import.meta.env[key]
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}

// Create wagmi config with minimal settings
const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
  connectors: [
    metaMask(),
    coinbaseWallet({
      appName: 'Citadelle',
    }),
    injected({ target: 'phantom' }),
  ],
  storage: createStorage({
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  }),
});

export const config = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  },
  contract: {
    address: import.meta.env.VITE_RWA_DEPLOYED_CONTRACT_ADDRESS,
    chain: sepolia,
  },
  revenueContract: {
    address: import.meta.env.VITE_REVENUE_CONTRACT_ADDRESS,
    chain: sepolia,
  },
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  },
  network: {
    blockExplorer: 'https://sepolia.etherscan.io',
  },
} as const;

export default wagmiConfig; 