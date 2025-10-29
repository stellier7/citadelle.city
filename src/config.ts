import { baseSepolia } from 'wagmi/chains';
import { http, createConfig } from 'wagmi';
import { injected } from 'wagmi/connectors';

interface Config {
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
  };
  contract: {
    address: string;
    chain: typeof baseSepolia;
  };
  api: {
    baseUrl: string;
  };
  network: {
    blockExplorer: string;
  };
  wagmi: ReturnType<typeof createConfig>;
}

// Default contract address for development
const DEFAULT_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

const config: Config = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  },
  contract: {
    address: import.meta.env.VITE_CONTRACT_ADDRESS || DEFAULT_CONTRACT_ADDRESS,
    chain: baseSepolia,
  },
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  },
  network: {
    blockExplorer: 'https://sepolia.basescan.org',
  },
  wagmi: createConfig({
    chains: [baseSepolia],
    connectors: [injected()],
    transports: {
      [baseSepolia.id]: http(),
    },
  }),
};

// Validate required config
const validateConfig = () => {
  // Only validate Firebase config in production
  if (import.meta.env.PROD) {
    const requiredFirebaseKeys = [
      'apiKey',
      'authDomain',
      'projectId',
      'appId',
    ] as const;

    const missingKeys = requiredFirebaseKeys.filter(key => !config.firebase[key]);
    if (missingKeys.length > 0) {
      throw new Error(
        `Missing required Firebase configuration: ${missingKeys.join(', ')}`
      );
    }

    // Only require contract address in production
    if (!config.contract.address || config.contract.address === DEFAULT_CONTRACT_ADDRESS) {
      throw new Error('Missing contract address configuration');
    }
  }
};

// Validate on import
validateConfig();

export default config; 